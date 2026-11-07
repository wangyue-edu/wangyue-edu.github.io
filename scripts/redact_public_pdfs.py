"""Securely remove email/QQ contacts from public PDFs, including nested ZIP PDFs.
Uses PyMuPDF; no original files outside the website checkout are touched.
"""
from __future__ import annotations
import argparse,hashlib,io,json,os,zipfile
from pathlib import Path
import pymupdf as fitz
from contact_privacy import contact_spans,redact_contacts,is_survey
ROOT=Path(__file__).resolve().parents[1]
CACHE={};PDF_CHANGES={};PHYSICAL=[];REVIEWED_PDFS=set()

def clean_pdf(name,data,work):
    doc=fitz.open(stream=data,filetype='pdf');changed=False;affected=[]
    for page in doc:
        # Raw character coordinates allow redaction across spans/lines, including
        # addresses broken by the PDF's typography.
        chars=[];positions=[]
        for block in page.get_text('rawdict')['blocks']:
            for line in block.get('lines',[]):
                for span in line.get('spans',[]):
                    for char in span.get('chars',[]):chars.append(char['c']);positions.append(char['bbox'])
                chars.append('\n');positions.append(None)
        text=''.join(chars);rects=[]
        for start,end,_ in contact_spans(text):
            byline={}
            for i in range(start,end):
                box=positions[i]
                if box is not None:
                    key=round(box[1],1);r=fitz.Rect(box)
                    byline[key]=byline[key]|r if key in byline else r
            rects.extend(byline.values())
        if rects:
            for r in rects:page.add_redact_annot(r,fill=(0,0,0))
            page.apply_redactions();changed=True;affected.append(page.number)
        for link in page.get_links():
            uri=link.get('uri','')
            if uri.lower().startswith('mailto:') or contact_spans(uri):page.delete_link(link);changed=True
        if page.annots():
            for annot in page.annots():
                info=annot.info;new={k:redact_contacts(v) if isinstance(v,str) else v for k,v in info.items()}
                if new!=info:annot.set_info(new);annot.update();changed=True
        for field in page.widgets() or []:
            if isinstance(field.field_value,str):
                value=redact_contacts(field.field_value)
                if value!=field.field_value:field.field_value=value;field.update();changed=True
    meta=doc.metadata;clean={k:redact_contacts(v) if isinstance(v,str) else v for k,v in meta.items()}
    if clean!=meta:doc.set_metadata(clean);changed=True
    xmp=doc.get_xml_metadata()
    if xmp and redact_contacts(xmp)!=xmp:doc.set_xml_metadata(redact_contacts(xmp));changed=True
    if not changed:doc.close();return data
    # A fresh, non-incremental save discards removed text, annotations and old objects.
    out=doc.tobytes(garbage=4,deflate=True,clean=True);doc.close()
    h=hashlib.sha256(out).hexdigest();PDF_CHANGES[h]={'name':name,'pages_redacted':affected,'bytes':out}
    if work:
        (work/'changed-pdfs').mkdir(exist_ok=True);(work/'changed-pdfs'/(h+'.pdf')).write_bytes(out)
    return out

def transform(name,data,work,depth=0):
    h=hashlib.sha256(data).hexdigest()
    if h in CACHE:return CACHE[h]
    ext=Path(name).suffix.lower();out=data
    if ext=='.pdf':
        out=clean_pdf(name,data,work)
        REVIEWED_PDFS.add(hashlib.sha256(out).hexdigest())
    elif ext in {'.zip','.sb3','.aab'} and depth<6:
        try:
            zin=zipfile.ZipFile(io.BytesIO(data));buffer=io.BytesIO();changed=False
            with zipfile.ZipFile(buffer,'w',compression=zipfile.ZIP_DEFLATED) as zout:
                for info in zin.infolist():
                    body=zin.read(info);new=transform(name+'!/'+info.filename,body,work,depth+1);changed |= body!=new;zout.writestr(info,new)
            if changed:out=buffer.getvalue()
        except zipfile.BadZipFile:pass
    CACHE[h]=out;return out

def main():
    p=argparse.ArgumentParser();p.add_argument('--write',action='store_true');p.add_argument('--record-reviewed-pdfs',action='store_true',help='Record hashes only after the caller has visually/OCR-reviewed the PDFs.');p.add_argument('--work-dir',type=Path,required=True);a=p.parse_args();a.work_dir.mkdir(parents=True,exist_ok=True)
    if a.record_reviewed_pdfs and not a.write:p.error('--record-reviewed-pdfs requires --write')
    for f in sorted((ROOT/'public').rglob('*')):
        if not f.is_file() or f.suffix.lower() not in {'.pdf','.zip','.sb3','.aab'}:continue
        before=f.read_bytes();out=transform(str(f.relative_to(ROOT)),before,a.work_dir if a.write else None)
        if out!=before:
            PHYSICAL.append(str(f.relative_to(ROOT)))
            if a.write:
                temp=f.with_name(f.name+'.privacy-tmp');temp.write_bytes(out);os.replace(temp,f)
    result={'write':a.write,'unique_pdfs_changed':len(PDF_CHANGES),'physical_files_changed':PHYSICAL,'pdf_changes':[{k:v for k,v in x.items() if k!='bytes'} for x in PDF_CHANGES.values()]}
    (a.work_dir/'pdf-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items() if k not in ['physical_files_changed','pdf_changes']}))
    if a.record_reviewed_pdfs:
        path=ROOT/'scripts/public_privacy_review.json';policy=json.loads(path.read_text())
        policy['reviewed_pdf_sha256']=sorted(REVIEWED_PDFS)
        path.write_text(json.dumps(policy,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
