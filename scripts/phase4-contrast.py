#!/usr/bin/env python3
"""Static opaque-color token checks. Not a computed-style, gradient, image or WCAG audit."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
styles=(root/'assets/styles.css').read_text(); phase4=(root/'assets/phase4.css').read_text();css=styles+'\n'+phase4
def token(name):
    if name in {'paper','white','ink','muted','cypress','brick','map-covered'}:
        # The source has two root blocks; check the effective last default declaration.
        values=re.findall(r'--'+re.escape(name)+r':\s*(#[a-fA-F0-9]{6})\b',styles)
        assert values,name
        return values[-1]
    m=re.search(r'--'+re.escape(name)+r':\s*(#[a-fA-F0-9]{6})\b',css)
    assert m,name
    return m.group(1)
def lum(hex):
    x=[int(hex[i:i+2],16)/255 for i in (1,3,5)]
    return sum(w*(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4) for w,v in zip((.2126,.7152,.0722),x))
def pair(label,a,b,minimum):
    x,y=sorted((lum(a),lum(b)));ratio=(y+.05)/(x+.05)
    print(f'{label}: {a} / {b} = {ratio:.2f}:1 (target {minimum}:1)')
    assert ratio>=minimum,label
pairs=[('Light body','ink','paper',4.5),('Light muted text','muted','paper',4.5),('Light muted text on card','muted','white',4.5),('Dark body','calm-text','calm-bg',4.5),('Dark raised body','calm-text','calm-surface-2',4.5),('Dark muted','calm-muted','calm-surface-2',4.5),('Dark link','calm-accent','calm-surface-2',4.5),('Dark control border','calm-border','calm-surface-2',3),('Light control border','control-border','white',3),('Dark crisis card','calm-bg','calm-crisis',4.5),('Focus two-color pair','focus-dark','focus-light',3),('Dark covered map outline','calm-bg','map-covered',3)]
for label,a,b,minimum in pairs:pair(label,token(a),token(b),minimum)
for label,a,b,minimum in [('Light urgent text','#ffffff',token('brick'),4.5),('Dark urgent text','#ffffff',token('calm-danger'),4.5),('Light warning','#0b2d2b','#f2b441',4.5),('Light demo notice','#253330','#fff1c6',4.5),('Dark demo notice','#fff3cc','#2d3024',4.5)]:pair(label,a,b,minimum)
print('17 selected opaque token pairs passed. Computed-style/interactive/AT verification remains pending.')
