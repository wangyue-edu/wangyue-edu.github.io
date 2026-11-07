"""Contact privacy rules shared by the sanitizer and the build-time verifier."""
from __future__ import annotations
import re

# Contact values only: QQ framework/API references and account input fields stay usable.
EMAIL = re.compile(r"(?<![\w.+%-])[\w.+%-]+\s*@\s*[\w-]+(?:\s*\.\s*[\w-]+)+", re.UNICODE)
QQ = re.compile(r"(?i)((?<![A-Za-z0-9_])q\s*q\s*(?:号码|账号|帐号|群号|号|群|id|number|num)?[\s\"']{0,8}[:：=]?[\s\"']{0,8})([1-9]\d{4,11})(?!\d)")
QQ_CONTEXT = re.compile(r"(?i)((?<![A-Za-z0-9_])q\s*q(?:[^0-9<>{}\r\n]{0,32}[:：])\s*)([1-9]\d{4,11})(?!\d)")
QQ_LINK = re.compile(r"(?i)((?:[?&](?:uin|qq|qqnum)|[\"'](?:uin|qqnum|qqnumber)[\"'])\s*[=:]\s*[\"']?)([1-9]\d{4,11})(?!\d)")
TEXT_EXTENSIONS = {'.txt','.md','.py','.c','.cpp','.cc','.h','.hpp','.java','.js','.jsx','.ts','.tsx','.html','.htm','.css','.json','.xml','.rels','.yaml','.yml','.ini','.conf','.config','.properties','.sh','.ino','.cs','.aspx','.sql','.log','.csv','.env','.sol','.wxml','.wxss','.omt','.kt','.gradle','.mjs','.rst','.dox','.lisp','.ps1','.bat','.cmd'}
OFFICE_EXTENSIONS = {'.docx','.pptx','.xlsx'}
ARCHIVE_EXTENSIONS = {'.zip','.sb3','.aab'}
SURVEY_MARKERS = ('问卷调查','招新问卷','survey_responses','recruitment_survey')

OFFICIAL_PUBLIC_EMAILS = {
    'wangyue-scholarship-application+2026@googlegroups.com',
}

def is_survey(name: str) -> bool:
    return any(part in name.lower() for part in SURVEY_MARKERS)

def is_private_metadata(name: str) -> bool:
    parts = name.replace('\\','/').split('/')
    return any(part in {'.git','__MACOSX','.DS_Store','Thumbs.db'} or part.startswith('._') for part in parts)

def contact_spans(text: str):
    found = []
    for m in EMAIL.finditer(text):
        val = m.group(0).strip().lower()
        if val not in OFFICIAL_PUBLIC_EMAILS:
            found.append((m.start(), m.end(), 'email'))
    found += [(m.start(2),m.end(2),'qq') for pattern in (QQ,QQ_CONTEXT,QQ_LINK) for m in pattern.finditer(text)]
    return sorted(set(found))

def redact_contacts(text: str) -> str:
    # Preserve character count for Office run boundaries and historical layout.
    for start,end,_ in reversed(contact_spans(text)):
        text = text[:start] + ''.join('\n' if c=='\n' else '\r' if c=='\r' else '*' for c in text[start:end]) + text[end:]
    return text
