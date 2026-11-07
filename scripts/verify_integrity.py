import os
import json

WEBSITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(WEBSITE_DIR, "dist")
PUBLIC_DIR = os.path.join(WEBSITE_DIR, "public")
DATA_DIR = os.path.join(WEBSITE_DIR, "src", "data")
EDITIONS_DIR = os.path.join(DATA_DIR, "editions")

def verify():
    print("=== STARTING INTEGRITY VERIFICATION ===")
    errors = []
    warnings = []

    # 1. Verify Editions
    edition_files = [f for f in os.listdir(EDITIONS_DIR) if f.endswith(".json")]
    print(f"Checking {len(edition_files)} editions in {EDITIONS_DIR}...")
    
    total_projects = 0
    checked_files = 0

    for ef in sorted(edition_files):
        with open(os.path.join(EDITIONS_DIR, ef), "r", encoding="utf-8") as f:
            ed = json.load(f)
        
        y = ed.get("year")
        projects = ed.get("projects", [])
        total_projects += len(projects)

        # Check documents
        for doc in ed.get("documents", []):
            if doc:
                doc_path = doc if isinstance(doc, str) else (doc.get("url") or doc.get("path") or "")
                if doc_path:
                    path = os.path.join(PUBLIC_DIR, doc_path.lstrip("/"))
                    if not os.path.exists(path):
                        errors.append(f"[{y}] Document not found: {doc_path}")
                    else:
                        checked_files += 1

        # Check gallery
        for g in ed.get("gallery", []):
            src = g.get("src")
            if src:
                path = os.path.join(PUBLIC_DIR, src.lstrip("/"))
                if not os.path.exists(path):
                    errors.append(f"[{y}] Gallery image not found: {src}")
                else:
                    checked_files += 1

        # Check edition downloads
        for d in ed.get("downloads", []):
            url = d.get("url")
            if url:
                dpath = os.path.join(PUBLIC_DIR, url.lstrip("/"))
                if not os.path.exists(dpath):
                    errors.append(f"[{y}] Edition download file not found: {url}")
                else:
                    checked_files += 1

        # Check projects
        for p in projects:
            pid = p.get("id")
            # Check video
            if p.get("video"):
                v_src = p["video"].get("src")
                v_poster = p["video"].get("poster")
                if v_src and not os.path.exists(os.path.join(PUBLIC_DIR, v_src.lstrip("/"))):
                    errors.append(f"[{pid}] Video not found: {v_src}")
                else:
                    checked_files += 1
                if v_poster and not os.path.exists(os.path.join(PUBLIC_DIR, v_poster.lstrip("/"))):
                    errors.append(f"[{pid}] Video poster not found: {v_poster}")
                else:
                    checked_files += 1

            # Check demos
            for d in p.get("interactiveDemos", []):
                if d.get("swfFile"):
                    swf = d["swfFile"]
                    if not os.path.exists(os.path.join(PUBLIC_DIR, swf.lstrip("/"))):
                        errors.append(f"[{pid}] Flash SWF not found: {swf}")
                    else:
                        checked_files += 1
                if d.get("entryUrl"):
                    url = d["entryUrl"]
                    if url.startswith("/"):
                        if not os.path.exists(os.path.join(PUBLIC_DIR, url.lstrip("/"))):
                            errors.append(f"[{pid}] Demo entryUrl not found: {url}")
                        else:
                            checked_files += 1

            # Check code
            archives_to_check = []
            if p.get("hasCode"):
                if p.get("codeArchives"):
                    for ca in p["codeArchives"]:
                        archives_to_check.append(ca["id"])
                elif p.get("codeArchiveId"):
                    archives_to_check.append(p["codeArchiveId"])

            for cid in set(archives_to_check):
                cpath = os.path.join(PUBLIC_DIR, "data", "code", f"{cid}.json")
                if not os.path.exists(cpath):
                    errors.append(f"[{pid}] Code archive not found: {cid}.json")
                else:
                    checked_files += 1

            # Check project gallery
            for g in p.get("gallery", []):
                src = g.get("src")
                if src:
                    path = os.path.join(PUBLIC_DIR, src.lstrip("/"))
                    if not os.path.exists(path):
                        errors.append(f"[{pid}] Project gallery image not found: {src}")
                    else:
                        checked_files += 1

            # Check project downloads
            for d in p.get("downloads", []):
                url = d.get("url")
                if url:
                    dpath = os.path.join(PUBLIC_DIR, url.lstrip("/"))
                    if not os.path.exists(dpath):
                        errors.append(f"[{pid}] Download file not found: {url}")
                    else:
                        checked_files += 1

    print(f"Total verified files & links: {checked_files}")
    print(f"Total projects verified: {total_projects}")

    # Check people.json
    people_file = os.path.join(DATA_DIR, "people.json")
    if os.path.exists(people_file):
        with open(people_file, "r", encoding="utf-8") as f:
            p_data = json.load(f)
        print(f"People index: {len(p_data.get('students', []))} students, {len(p_data.get('judges', []))} judges.")
    else:
        errors.append("people.json is missing!")

    if errors:
        print(f"\n❌ FOUND {len(errors)} ERRORS:")
        for e in errors:
            print(" -", e)
    else:
        print("\n✅ ALL ASSETS, VIDEOS, DEMOS, AND CODE ARCHIVES RESOLVED WITH 0 ERRORS!")

if __name__ == "__main__":
    verify()
