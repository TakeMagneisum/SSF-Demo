"""Static project-subpath asset resolution; not a browser test."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.request import urlopen
from urllib.parse import urljoin
import functools,tempfile,threading
ROOT=Path(__file__).resolve().parent.parent
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
with tempfile.TemporaryDirectory() as tmp:
 Path(tmp,'ssf-phase6').symlink_to(ROOT,target_is_directory=True)
 with ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=tmp)) as http:
  threading.Thread(target=http.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{http.server_port}/ssf-phase6/'
  try:
   for route,prefix in [('find-help.html?area=liberty','assets/'),('find-help/find-help.html?area=london-enfield','../assets/')]:
    page=urljoin(base,route)
    with urlopen(page,timeout=5) as r:assert r.status==200 and b'id="sheet-large"' in r.read()
    js=urljoin(page,prefix+'sheet-pdf.js?v=phase6')
    for path in ['vendor/pdf-lib.min.js','vendor/sheet-font.js','vendor/qr.js','dawn-portait.webp','sheet-pdf.js','handout.js']:
     u=urljoin(js,path);assert u.startswith(base+'assets/')
     with urlopen(u,timeout=5) as r:assert r.status==200 and r.read()==(ROOT/'assets'/path).read_bytes()
    print('HTTP 200 and exact asset bytes:',route,'six script-relative assets')
   with urlopen(base+'privacy-policy/',timeout=5) as r:assert r.status==200 and b'clear-remembered-location' in r.read()
   with urlopen(base+'assets/phase6-privacy.js',timeout=5) as r:assert r.status==200 and r.read()==(ROOT/'assets/phase6-privacy.js').read_bytes()
   print('HTTP 200: privacy policy and isolated reset script')
  finally:http.shutdown()
