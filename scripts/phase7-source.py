#!/usr/bin/env python3
"""Independent static checks, not computed CSS or browser network inspection."""
from pathlib import Path
from html.parser import HTMLParser
import re
ROOT=Path(__file__).resolve().parent.parent
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.tags=[]
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs)
 def attrs(self,tag):return [a for t,a in self.tags if t==tag]
remote=[];referrer_missing=[];blank_missing=[];count=0
for page in sorted(ROOT.rglob('*.html')):
 p=Scan();p.feed(page.read_text());name=page.relative_to(ROOT).as_posix();count+=1
 editable=name=='404.html' or any('styles.css' in a.get('href','') for a in p.attrs('link'))
 if editable:
  assert any(a.get('name')=='referrer' and a.get('content')=='no-referrer' for a in p.attrs('meta')),name
 else:referrer_missing.append(name)
 for tag,a in p.tags:
  for key in ['src','poster']+(['href'] if tag=='link' and a.get('rel') in ('stylesheet','preload','modulepreload','prefetch','preconnect','dns-prefetch') else []):
   if re.match(r'^(https?:)?//',a.get(key,''),re.I):remote.append((name,tag,key,a[key]))
  if editable and tag=='a' and a.get('target')=='_blank' and re.match(r'^(https?:)?//',a.get('href',''),re.I) and not {'noopener','noreferrer'}<=set(a.get('rel','').split()):blank_missing.append((name,a['href']))
 assert any(a.get('name')=='robots' and 'noindex' in a.get('content','') for a in p.attrs('meta')),name
assert not remote,remote
assert not blank_missing,blank_missing
assert not (ROOT/'CNAME').exists()
assert count==66 and len(referrer_missing)==42
for route in ['find-help.html','assets/find-help.html','find-help/find-help.html']:
 html=(ROOT/route).read_text();p=Scan();p.feed(html)
 assert len([a for a in p.attrs('a') if a.get('href')=='tel:211' and 'data-us-referral' in a and 'hidden' in a])==1,route
 assert all('href' not in a for a in p.attrs('a') if 'data-global-emergency' in a or 'data-global-crisis' in a)
 assert all('disabled' in a for a in p.attrs('button') if 'data-query' in a)
 form=re.search(r'<form id="help-search"[\s\S]*?</form>',html)[0];assert not re.search(r'\bname=',form)
 assert 'Your browser or device may retain it.' in html
css=(ROOT/'assets/phase5.css').read_text();assert re.search(r'#guide-answer\.urgent-answer:not\(\[hidden\]\)\s*\{display:block!important',css)
assert 'body.finder-page:not(.reviewing-sheet)' in css
print(f'{count} HTML parsed; 24 editable pages no-referrer; 42 historical pages not upgraded; no remote HTML runtime asset references; no editable external target-blank without noopener/noreferrer; noindex and no CNAME. All 3 finder safety markup and active urgent print override present. Static checks only.')
