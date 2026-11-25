"""Static HTTP, not browser interaction or GitHub Pages verification."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.request import urlopen
import functools,tempfile,threading
ROOT=Path(__file__).resolve().parent.parent
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
with tempfile.TemporaryDirectory() as tmp:
 Path(tmp,'ssf-phase5').symlink_to(ROOT,target_is_directory=True)
 with ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=tmp)) as http:
  threading.Thread(target=http.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{http.server_port}/ssf-phase5/'
  try:
   for route in ['find-help.html?area=liberty&need=mental-health','find-help.html?area=london-enfield','assets/find-help.html?area=liberty','find-help/find-help.html?area=liberty','before-you-call.html','before-you-travel.html','assets/phase5.css','assets/phase5-vocabulary.js','assets/phase5-prep.js','assets/guide.js?v=phase5']:
    for _ in range(2):
     with urlopen(base+route,timeout=5) as r:assert r.status==200 and r.read()
    print('HTTP 200 x2:',route)
  finally:http.shutdown()
