#!/usr/bin/env python3
"""Compare initial external JS and HTML bytes against original ZIP. No network timing."""
import gzip,re,sys,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
if len(sys.argv)!=2: raise SystemExit('usage: python scripts/phase2-measure.py /path/to/phase1.zip')
with zipfile.ZipFile(sys.argv[1]) as z:
    entry=next(n for n in z.namelist() if n.endswith('/index.html') and n.count('/')==1)
    prefix=entry.removesuffix('index.html')
    print('page,phase,initial external JS count,raw JS bytes,per-file gzip JS bytes,raw HTML bytes,gzip HTML bytes')
    for page in ['index.html','explore-map.html','find-help.html','discover.html']:
        for phase in [1,2]:
            read=lambda x:z.read(prefix+x) if phase==1 else (ROOT/x).read_bytes()
            html=read(page); paths=re.findall(rb'<script\b[^>]*\bsrc="([^"?]+)(?:\?[^" ]*)?"',html); files=[read(x.decode()) for x in paths]
            print(','.join(map(str,[page,phase,len(files),sum(map(len,files)),sum(len(gzip.compress(x,mtime=0)) for x in files),len(html),len(gzip.compress(html,mtime=0))])))
