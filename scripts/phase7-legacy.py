#!/usr/bin/env python3
"""Keep historic finder URLs as full pages, with the same root-relative-to-project targets. No redirect or query manipulation."""
import re,sys,posixpath
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
source=(ROOT/'find-help.html').read_text()
def render(page):
 def attr(m):
  value=m[2]
  if not value or value.startswith(('#','?','//')) or re.match(r'^[a-z][a-z0-9+.-]*:',value,re.I):return m[0]
  path,sep,suffix=re.match(r'^([^?#]*)([?#]?)(.*)$',value).groups()
  assert not path.startswith('/'),value
  return m[1]+posixpath.relpath(path,posixpath.dirname(page))+sep+suffix+'"'
 return re.sub(r'(\b(?:href|src|action)=")([^"]*)"',attr,source)
for route in ['assets/find-help.html','find-help/find-help.html']:
 path=ROOT/route;expected=render(route)
 if '--write' in sys.argv:path.write_text(expected)
 else:assert path.read_text()==expected,route+' drifted from root finder'
 print(route,'full canonical finder parity, unchanged route/query/hash contract')
