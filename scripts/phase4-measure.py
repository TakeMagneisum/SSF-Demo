#!/usr/bin/env python3
"""Initial referenced JS/CSS count, raw/gzip bytes, HTML. Not real network/latency."""
import gzip,re,sys,zipfile
from pathlib import Path,PurePosixPath
import posixpath
ROOT=Path(__file__).resolve().parent.parent
if len(sys.argv)!=2:raise SystemExit('usage: python scripts/phase4-measure.py /path/to/phase3.zip')
with zipfile.ZipFile(sys.argv[1]) as z:
 prefix=next(n.removesuffix('index.html') for n in z.namelist() if n.endswith('/index.html') and n.count('/')==1)
 print('page,phase,js_count,js_raw,js_gzip,css_count,css_raw,css_gzip,html_raw,html_gzip')
 for page in ['index.html','explore-map.html','find-help.html','discover.html','learn/cpr/index.html','before-you-travel.html','404.html']:
  for phase in [3,4]:
   read=lambda x:z.read(prefix+x) if phase==3 else (ROOT/x).read_bytes()
   html=read(page)
   files=lambda pattern:[read(posixpath.normpath(posixpath.join(posixpath.dirname(page),x.decode()))) for x in re.findall(pattern,html)]
   js=files(rb'<script\b[^>]*\bsrc="([^"?]+)(?:\?[^" ]*)?"')
   css=files(rb'<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"?]+)(?:\?[^" ]*)?"')
   stats=lambda items:[len(items),sum(map(len,items)),sum(len(gzip.compress(x,mtime=0)) for x in items)]
   print(','.join(map(str,[page,phase,*stats(js),*stats(css),len(html),len(gzip.compress(html,mtime=0))])))
