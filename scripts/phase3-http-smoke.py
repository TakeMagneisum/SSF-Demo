#!/usr/bin/env python3
"""Static HTTP simulation of a project-hosted custom error body; not GitHub Pages verification."""
import tempfile, threading, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen
from urllib.error import HTTPError
ROOT=Path(__file__).resolve().parent.parent
class ProjectHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
    def send_error(self,code,message=None,explain=None):
        if code==404:
            body=(ROOT/'404.html').read_bytes();self.send_response(404);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        else: super().send_error(code,message,explain)
with tempfile.TemporaryDirectory() as tmp:
    Path(tmp,'arbitrary.demo-name').symlink_to(ROOT,target_is_directory=True)
    with ThreadingHTTPServer(('127.0.0.1',0),functools.partial(ProjectHandler,directory=tmp)) as http:
        threading.Thread(target=http.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{http.server_port}/arbitrary.demo-name/'
        try:
            for path in ['index.html','explore-map.html?country=US&state=GA&county=13179','explore-map.html?country=GB','discover.html?zip=31320','find-help.html?area=liberty','assets/phase3.css','assets/phase3-home.js','assets/phase3-map-ui.js','assets/phase3-region-search.js','assets/phase3-postal.js','assets/phase4.css','assets/phase4-preferences.js','404.html']:
                for _ in range(2):
                    with urlopen(base+path,timeout=5) as r: assert r.status==200 and r.read()
                print('HTTP 200 x2:',path)
            for path in ['missing','a/b/c/missing.html','a/b/c/']:
                try: urlopen(base+path,timeout=5);raise AssertionError('Expected 404: '+path)
                except HTTPError as e:
                    assert e.code==404 and e.read()==(ROOT/'404.html').read_bytes(),path
                print('HTTP 404 custom body (local simulation):',path)
        finally: http.shutdown()
