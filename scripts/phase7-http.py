#!/usr/bin/env python3
"""All original guide IDs on three retained finder URLs; HTTP/HTML only, not DOM browser verification."""
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urljoin,urlsplit,urlencode
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,tempfile,threading,re,json
ROOT=Path(__file__).resolve().parent.parent
ids=list(json.loads((ROOT/'baseline/record-integrity.json').read_text())['guides'])
assert len(ids)==106
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
with tempfile.TemporaryDirectory() as tmp:
 Path(tmp,'independent.qa').symlink_to(ROOT,target_is_directory=True)
 with ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=tmp)) as http:
  threading.Thread(target=http.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{http.server_port}/independent.qa/'
  try:
   for path in ['find-help.html','assets/find-help.html','find-help/find-help.html']:
    canonical=(ROOT/path).read_bytes();html=canonical.decode()
    opts=re.search(r'<select id="area-select-help"[\s\S]*?</select>',html)[0]
    assert set(re.findall(r'<option value="([^"\s]+)"',opts))==set(ids),path
    for area in ids:
     url=base+path+'?'+urlencode({'area':area,'need':'food'})
     with urlopen(url,timeout=5) as r:assert r.status==200 and r.geturl()==url and r.read()==canonical,(path,area)
    # Verify every startup JS/CSS path resolves to same canonical files.
    refs=re.findall(r'<script\b[^>]*\bsrc="([^"]+)"',html)+re.findall(r'<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"',html)
    assert len(refs)==25,(path,len(refs))
    for ref in refs:
     target=urljoin(base+path,ref);assert target.startswith(base+'assets/'),target
     local=ROOT/urlsplit(target).path.removeprefix('/independent.qa/')
     with urlopen(target,timeout=5) as r:assert r.status==200 and r.read()==local.read_bytes(),target
    for name in ['vendor/pdf-lib.min.js','vendor/sheet-font.js','vendor/qr.js','dawn-portait.webp']:
     js=urljoin(base+path,next(x for x in refs if 'sheet-pdf.js' in x));target=urljoin(js,name)
     with urlopen(target,timeout=5) as r:assert r.status==200 and r.read()==(ROOT/'assets'/name).read_bytes()
    assert 'data-us-referral hidden href="tel:211"' in html
    assert 'id="sheet-preview"' in html and 'id="sheet-large"' in html and 'id="finder-load-warning"' in html
    assert 'id="situation-unavailable"' in html
    print(f'{path}: {len(ids)} exact HTTP 200 query responses, {len(refs)} startup assets, 4 local optional assets, full guide picker/handout/safety markup; no redirect.')
  finally:http.shutdown()
