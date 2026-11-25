#!/usr/bin/env python3
"""Deterministic shared primary navigation; no runtime fetch or build at hosting."""
from pathlib import Path
import re, os, sys
ROOT=Path(__file__).resolve().parent.parent
routes=[('Home','index.html'),('Find help','discover.html'),('Explore by map','explore-map.html'),('Learn','learn/index.html'),('Before you call or visit','before-you-call.html'),('Before you travel','before-you-travel.html')]
pattern=re.compile(r'<nav\b[^>]*id="main-navigation"[^>]*>.*?</nav>',re.S)
def render(p,s):
 rel=p.relative_to(ROOT).as_posix()
 current={'find-help.html':'discover.html','learn.html':'learn/index.html'}.get(rel,rel)
 if rel.startswith('learn/'): current='learn/index.html'
 prefix=lambda dest: os.path.relpath(ROOT/dest,p.parent).replace(os.sep,'/')
 links=''.join(f'<a href="{prefix(dest)}"'+((' aria-current="page"' if rel==dest else ' aria-current="location"') if current==dest else '')+'>'+label+'</a>' for label,dest in routes)
 # Preserve language only where the existing translation runtime is supported.
 lang='<label class="language-control"><span aria-hidden="true">文/A</span><span class="sr-only">Language</span><select data-language-select aria-label="Language"><option value="en">English</option><option value="es">Español</option></select></label>' if 'i18n.js' in s else ''
 return pattern.sub(lambda m:'<nav aria-label="Main navigation" id="main-navigation" data-ssf-nav>'+links+'<div class="nav-preferences"><button class="calm-toggle" type="button" data-calm-toggle aria-pressed="false">Calm View</button>'+lang+'</div></nav>',s)
count=0
for p in sorted(ROOT.rglob('*.html')):
 s=p.read_text(); rel=p.relative_to(ROOT).as_posix()
 if rel=='404.html' or rel.startswith(('assets/','find-help/')) or not pattern.search(s): continue
 out=render(p,s);count+=1
 if '--write' in sys.argv: p.write_text(out)
 elif out!=s: raise SystemExit(f'Navigation template stale: {rel}')
print(f'Shared navigation: {count} primary pages')
