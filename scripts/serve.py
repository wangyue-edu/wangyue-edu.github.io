import os
import sys
import socket
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")

class SPAServer(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Resolve path
        path = self.translate_path(self.path)
        # If path does not exist:
        if not os.path.exists(path):
            if "." not in os.path.basename(self.path):
                self.path = "/index.html"
            elif "/assets/index-" in self.path:
                ext = ".js" if self.path.endswith(".js") else ".css"
                assets_dir = os.path.join(DIST_DIR, "assets")
                if os.path.exists(assets_dir):
                    matches = [f for f in os.listdir(assets_dir) if f.startswith("index-") and f.endswith(ext)]
                    if matches:
                        self.path = f"/assets/{matches[0]}"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

class ReusableThreadingServer(ThreadingHTTPServer):
    allow_reuse_address = True
    allow_reuse_port = True

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving {DIST_DIR} on http://localhost:{port}")
    server = ReusableThreadingServer(("", port), SPAServer)
    server.serve_forever()
