"""Remove contact values from source/public text and nested Office/source archives.
Run with the bundled document Python (lxml). PDFs use redact_public_pdfs.py.
Original scholarship archives outside this checkout are never changed.
"""
from __future__ import annotations
import argparse,hashlib,io,json,os,zipfile
from pathlib import Path
from lxml import etree as ET
from contact_privacy import *

ROOT=Path(__file__).resolve().parents[1]
POLICY_PATH=ROOT/'scripts/public_privacy_review.json'
ALLOWED_APKS=set(json.loads(POLICY_PATH.read_text()).get('allowed_signed_apk_sha256',[])) if POLICY_PATH.exists() else set()
CACHE={};CHANGES=[];BLOCKED=[];DOCX={};REMOVED=[]
XML_PARSER=ET.XMLParser(resolve_entities=False,no_network=True,remove_blank_text=False)

def sanitize_xml(data:bytes)->bytes:
    try: root=ET.fromstring(data,parser=XML_PARSER)
    except ET.XMLSyntaxError: return data
    changed=False
    # Concatenate paragraph/run text so split email addresses cannot survive.
    groups=[e for e in root.iter() if isinstance(e.tag,str) and ET.QName(e).localname in {'p','si'}]
    for group in groups:
        nodes=[e for e in group.iter() if isinstance(e.tag,str) and ET.QName(e).localname in {'t','instrText','delText'} and e.text]
        before=''.join(e.text for e in nodes); after=redact_contacts(before)
        if before!=after:
            pos=0
            for e in nodes:
                length=len(e.text);e.text=after[pos:pos+length];pos+=length
            changed=True
    for e in root.iter():
        if not isinstance(e.tag,str):continue
        if e.text:
            after=redact_contacts(e.text)
            if after!=e.text:e.text=after;changed=True
        if e.tail:
            after=redact_contacts(e.tail)
            if after!=e.tail:e.tail=after;changed=True
        for name,value in list(e.attrib.items()):
            after=redact_contacts(value)
            if after!=value:
                # Remove hidden contact URI targets rather than creating a masked address.
                e.set(name,'https://example.invalid/redacted' if ET.QName(name).localname=='Target' and value.lower().startswith('mailto:') else after)
                changed=True
    return ET.tostring(root,encoding='UTF-8',xml_declaration=data.lstrip().startswith(b'<?xml'),standalone=True if b'standalone="yes"' in data[:200] else None) if changed else data

def contact_apk(data:bytes)->bool:
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            return any(contact_spans(z.read(n).decode('utf-8',errors='ignore')) for n in z.namelist() if Path(n).suffix.lower() in TEXT_EXTENSIONS and not z.getinfo(n).is_dir())
    except zipfile.BadZipFile:return False

def transform(name:str,data:bytes,remove_contact_apks=False,depth=0):
    key=(hashlib.sha256(data).hexdigest(),Path(name).suffix.lower(),remove_contact_apks)
    if key in CACHE:return CACHE[key]
    ext=key[1];out=data
    if is_survey(name) or is_private_metadata(name):REMOVED.append(name);return None
    if ext=='.apk':
        if key[0] in ALLOWED_APKS:return data
        if contact_apk(data):
            if remove_contact_apks:REMOVED.append(name);return None
            BLOCKED.append(name)
        return data
    if ext in OFFICE_EXTENSIONS|ARCHIVE_EXTENSIONS:
        try:
            zin=zipfile.ZipFile(io.BytesIO(data));buffer=io.BytesIO();changed=False
            with zipfile.ZipFile(buffer,'w',compression=zipfile.ZIP_DEFLATED) as zout:
                for info in zin.infolist():
                    member=info.filename
                    if is_survey(member):REMOVED.append(name+'!/'+member);changed=True;continue
                    body=zin.read(info)
                    if ext in OFFICE_EXTENSIONS and member.endswith(('.xml','.rels')):new=sanitize_xml(body)
                    elif depth<6:new=transform(name+'!/'+member,body,remove_contact_apks,depth+1)
                    else:new=body
                    if new is None:changed=True;continue
                    changed |= new!=body
                    zout.writestr(info,new)
            if changed:out=buffer.getvalue()
        except zipfile.BadZipFile:
            # Some historical XLSX filenames actually contain a legacy BIFF workbook.
            pass
    elif ext in TEXT_EXTENSIONS or name.endswith('/config'):
        encoding='utf-8-sig' if data.startswith(b'\xef\xbb\xbf') else 'utf-8'
        try:text=data.decode(encoding)
        except UnicodeDecodeError:
            encoding='gb18030'
            try:text=data.decode(encoding)
            except UnicodeDecodeError:return data
        clean=redact_contacts(text)
        if clean!=text:out=clean.encode(encoding)
    if out!=data:
        CHANGES.append(name)
        if ext=='.docx':DOCX[hashlib.sha256(out).hexdigest()]=(name,out)
    CACHE[key]=out
    return out

def filter_downloads(obj):
    if isinstance(obj,list):return [filter_downloads(x) for x in obj if not (isinstance(x,dict) and any(is_survey(str(x.get(k,''))) for k in ['filename','url']))]
    if isinstance(obj,dict):return {k:filter_downloads(v) for k,v in obj.items()}
    return obj

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--write',action='store_true');ap.add_argument('--remove-contact-apks',action='store_true');ap.add_argument('--work-dir',type=Path,required=True);a=ap.parse_args();a.work_dir.mkdir(parents=True,exist_ok=True)
    touched=[]
    for base in ['src','public']:
        for p in sorted((ROOT/base).rglob('*')):
            if not p.is_file() or 'ruffle' in p.parts:continue
            old=p.read_bytes()
            # Remove downloadable survey entries before generic contact scrubbing.
            if p.suffix=='.json' and ('src/data' in str(p) or p.name=='downloads_index.json'):
                try:
                    original=json.loads(old);filtered=filter_downloads(original)
                    if original!=filtered:old_for_transform=(json.dumps(filtered,ensure_ascii=False,indent=2)+'\n').encode()
                    else:old_for_transform=old
                except (ValueError,UnicodeDecodeError):old_for_transform=old
            else:old_for_transform=old
            out=transform(str(p.relative_to(ROOT)),old_for_transform,a.remove_contact_apks)
            if out is None:
                if a.write:p.unlink()
                touched.append(str(p.relative_to(ROOT)));continue
            if out!=old:
                touched.append(str(p.relative_to(ROOT)))
                if a.write:
                    temp=p.with_name(p.name+'.privacy-tmp');temp.write_bytes(out);os.replace(temp,p)
    # Keep download sizes accurate after archive/document changes.
    if a.write:
        for p in [ROOT/'public/data/downloads_index.json',*sorted((ROOT/'src/data/editions').glob('*.json'))]:
            obj=json.loads(p.read_text())
            def resize(node):
                if isinstance(node,dict):
                    if 'url' in node and 'filename' in node and 'size' in node and node['url'].startswith('/'):
                        f=ROOT/'public'/node['url'].lstrip('/')
                        if f.is_file():
                            n=f.stat().st_size;node['size']=f'{n/1024/1024:.1f} MB' if n>=1024*1024 else f'{n/1024:.1f} KB' if n>=1024 else f'{n} B'
                    for v in node.values():resize(v)
                elif isinstance(node,list):
                    for v in node:resize(v)
            before=json.dumps(obj,ensure_ascii=False);resize(obj)
            if json.dumps(obj,ensure_ascii=False)!=before:p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
    docdir=a.work_dir/'changed-docx';docdir.mkdir(exist_ok=True)
    for h,(name,data) in DOCX.items():
        if a.write:(docdir/(h+'.docx')).write_bytes(data)
    result={'write':a.write,'physical_files_changed':touched,'nested_items_changed':CHANGES,'removed_items':REMOVED,'contact_apks_pending':sorted(set(BLOCKED)),'unique_docx_changed':len(DOCX)}
    (a.work_dir/'office-text-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items() if k not in ['physical_files_changed','nested_items_changed','removed_items','contact_apks_pending']}));print('physical changes',len(touched),'removed items',len(REMOVED),'contact APKs pending',len(set(BLOCKED)))
if __name__=='__main__':main()
