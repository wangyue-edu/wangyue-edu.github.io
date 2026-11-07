"""Fail a build if survey data or email/QQ contacts return to distributable files.
Uses only Python's standard library. Compiled signed binaries follow the explicit
exception policy; PDF/legacy-Word content is checked against reviewed hashes.
"""
from __future__ import annotations
import hashlib,io,json,sys,zipfile,xml.etree.ElementTree as ET
from pathlib import Path
from contact_privacy import *
ROOT=Path(__file__).resolve().parents[1];POLICY=ROOT/'scripts/public_privacy_review.json'

def collect_violations(roots,policy):
    issues=[];seen=set();pdfs=set();counts={'files':0,'archives':0,'office':0,'reviewed_pdfs':0}
    def checktext(name,text):
        if contact_spans(text):issues.append(name+': email/QQ contact value')
    def inspect(name,data,depth=0):
        h=hashlib.sha256(data).hexdigest();ext=Path(name).suffix.lower()
        if is_survey(name):issues.append(name+': forbidden survey');return
        if is_private_metadata(name):issues.append(name+': private archive metadata');return
        if h in seen:return
        seen.add(h)
        if ext=='.apk':
            try:
                z=zipfile.ZipFile(io.BytesIO(data));has_contacts=any(contact_spans(z.read(n).decode('utf-8',errors='ignore')) for n in z.namelist() if Path(n).suffix.lower() in TEXT_EXTENSIONS and not z.getinfo(n).is_dir())
                if has_contacts and h not in policy.get('allowed_signed_apk_sha256',[]):issues.append(name+': signed APK has contact text; requires an explicit keep/remove choice')
            except zipfile.BadZipFile:pass
            return
        if ext in OFFICE_EXTENSIONS|ARCHIVE_EXTENSIONS:
            try:
                z=zipfile.ZipFile(io.BytesIO(data));counts['archives']+=1;counts['office']+=ext in OFFICE_EXTENSIONS
                for n in z.namelist():
                    info=z.getinfo(n)
                    if info.is_dir():continue
                    if is_survey(n):issues.append(name+'!/'+n+': forbidden survey');continue
                    body=z.read(n)
                    if ext in OFFICE_EXTENSIONS and n.endswith(('.xml','.rels')):
                        try:
                            root=ET.fromstring(body)
                            # Include unused shared strings, hidden field instructions,
                            # metadata and attribute-only links, not just displayed cells.
                            checktext(name+'!/'+n,' '.join(root.itertext()))
                            for e in root.iter():
                                for value in e.attrib.values():checktext(name+'!/'+n,value)
                                if e.tag.split('}')[-1] in {'p','si'}:checktext(name+'!/'+n,''.join(e.itertext()))
                        except ET.ParseError:issues.append(name+'!/'+n+': invalid XML')
                    elif depth<6:inspect(name+'!/'+n,body,depth+1)
            except zipfile.BadZipFile:
                # A historical BIFF workbook is misleadingly named .xlsx.
                if h not in policy.get('reviewed_legacy_sha256',[]):issues.append(name+': unreviewed legacy/corrupt Office file')
        elif ext in {'.pdf','.doc'}:
            key='reviewed_pdf_sha256' if ext=='.pdf' else 'reviewed_legacy_sha256'
            if h not in policy.get(key,[]):issues.append(name+': document changed since contact review; rerun sanitization/review')
            if ext=='.pdf':pdfs.add(h)
        elif ext in TEXT_EXTENSIONS or name.endswith('/config'):
            try:t=data.decode('utf-8-sig')
            except UnicodeDecodeError:
                try:t=data.decode('gb18030')
                except UnicodeDecodeError:return
            checktext(name,t)
    for root in roots:
        for p in sorted(root.rglob('*')):
            if p.is_file():counts['files']+=1;inspect(str(p.relative_to(ROOT)),p.read_bytes())
    counts['reviewed_pdfs']=len(pdfs)
    return sorted(set(issues)),counts

def main():
    import argparse
    a=argparse.ArgumentParser();a.add_argument('--dist',action='store_true');args=a.parse_args()
    if not POLICY.exists():print('Privacy review manifest is missing.',file=sys.stderr);return 1
    policy=json.loads(POLICY.read_text());roots=[ROOT/'dist'] if args.dist else [ROOT/'public',ROOT/'src/data']
    issues,counts=collect_violations(roots,policy)
    if issues:
        print('Privacy verification failed (contact values are not printed):',file=sys.stderr)
        for item in issues[:60]:print(' - '+item,file=sys.stderr)
        return 1
    print('Privacy verification passed: '+json.dumps(counts));return 0
if __name__=='__main__':raise SystemExit(main())
