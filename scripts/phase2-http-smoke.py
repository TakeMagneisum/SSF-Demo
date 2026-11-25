#!/usr/bin/env python3
"""Static HTTP subpath smoke (does not execute JavaScript or emulate hosted 404s)."""
import tempfile,threading,functools
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.request import urlopen
ROOT=Path(__file__).resolve().parent.parent
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
routes=['index.html','explore-map.html','explore-map.html?country=US&state=GA&county=13179','explore-map.html?country=GB','find-help.html?area=london-enfield','find-help.html?area=liberty','discover.html?zip=31320','404.html','assets/coverage-index.js','assets/styles.css','assets/explore-map.css','assets/maps/georgia-county-boundaries.js','assets/maps/london-boundaries.js','before-you-call.html','before-you-travel.html','learn/ai-safety/']
with tempfile.TemporaryDirectory() as tmp:
    Path(tmp,'ssf-demo').symlink_to(ROOT,target_is_directory=True)
    with ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=tmp)) as http:
        threading.Thread(target=http.serve_forever,daemon=True).start()
        try:
            base=f'http://127.0.0.1:{http.server_port}/ssf-demo/'
            for route in routes:
                for attempt in range(2):
                    with urlopen(base+route,timeout=5) as r:
                        assert r.status==200 and r.read(),route
                print('HTTP 200 x2:',route)
        finally: http.shutdown()
