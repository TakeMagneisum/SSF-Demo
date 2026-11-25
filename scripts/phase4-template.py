#!/usr/bin/env python3
"""Deterministic display controls and standalone 404 copy; check by default."""
from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parent.parent
START='<!-- SSF DISPLAY START -->'; END='<!-- SSF DISPLAY END -->'
OPTIONS={
'appearance':('Appearance',[('system','System'),('light','Light'),('dark','Dark')]),
'text':('Text size',[('standard','Standard'),('large','Large (125%)'),('larger','Larger (150%)')]),
'spacing':('Reading spacing',[('standard','Standard'),('relaxed','Relaxed')]),
'contrast':('Contrast',[('system','System / standard'),('high','Higher contrast')]),
'motion':('Motion',[('system','Follow system'),('reduced','Reduce motion')]),
'density':('Layout spacing',[('comfortable','Comfortable'),('compact','Compact')])}
def field(k):
 label,opts=OPTIONS[k];return f'<label'+(' class="ssf-appearance"' if k=='appearance' else '')+f'><span>{label}</span><select data-ssf-preference="{k}">'+''.join(f'<option value="{v}">{text}</option>' for v,text in opts)+'</select></label>'
def controls():
 return START+'<div class="ssf-display" data-ssf-display hidden>'+field('appearance')+'<details><summary>Accessibility settings</summary><div class="ssf-pref-panel"><p>Adjust this website without changing your browser settings. You can still use browser zoom.</p><div class="ssf-pref-grid">'+''.join(field(k) for k in OPTIONS if k!='appearance')+'</div><p>Calm View is separate: it uses dark colors, reduces motion and hides decorative artwork. Turn it off to use your chosen appearance. System reduced motion and forced colors always take priority.</p><p>Display settings are stored on this device when possible. Reset does not change language, Calm View, selected guides or handouts.</p><p role="status" data-ssf-pref-status></p><div class="ssf-pref-actions"><button type="button" data-ssf-pref-reset>Reset display settings</button><button type="button" data-ssf-pref-close>Close settings</button></div></div></details></div>'+END
extra404='''
@media screen {
html{--surface:#f7f4ea;--surface-raised:#fffdf7;--text:#17312f;--text-muted:#506b67;--control-border:#506b67;--focus-dark:#0b2d2b;--focus-light:#fffdf7}
html:is([data-ssf-theme=dark],[data-calm=true]){--calm-bg:#071a19;--calm-surface:#102b29;--calm-text:#fbf7ed;--calm-muted:#d0dcda;--calm-border:#6e8983;--calm-accent:#f2c55c;color-scheme:dark}
html:is([data-ssf-theme=dark],[data-calm=true]) body{background:var(--calm-bg);color:var(--calm-text)}
html:is([data-ssf-theme=dark],[data-calm=true]) .actions a{color:var(--calm-text);border-color:var(--calm-border)}
html:is([data-ssf-theme=dark],[data-calm=true]) .actions a:first-child{background:var(--calm-accent);color:var(--calm-bg)}
html:is([data-ssf-theme=dark],[data-calm=true]) .notice{background:#2d3024;color:#fff3cc}
html[data-ssf-spacing=relaxed] body{line-height:1.85}
header .ssf-display{margin-block:.6rem 0;background:var(--surface);color:var(--text);padding:.65rem;border-radius:.5rem}
html[data-ssf-density=compact] main{padding-block:1rem}
}
'''
count=0
for p in sorted(ROOT.rglob('*.html')):
 s=p.read_text();rel=p.relative_to(ROOT).as_posix();old=s
 if rel=='404.html':
  if START in s:s=re.sub(re.escape(START)+r'.*?'+re.escape(END),'',s,flags=re.S)
  s=re.sub(r'<!-- SSF P4 INLINE START -->.*?<!-- SSF P4 INLINE END -->','',s,flags=re.S)
  s=re.sub(r'<!-- SSF P4 STYLE START -->.*?<!-- SSF P4 STYLE END -->','',s,flags=re.S)
  # standalone path-safe CSS/JS, no network dependency on guessed base
  css=(ROOT/'assets/phase4.css').read_text()+extra404
  js=(ROOT/'assets/phase4-preferences.js').read_text()
  s=s.replace('</header>',controls()+'</header>',1)
  s=s.replace('</head>','<!-- SSF P4 STYLE START --><style>'+css+'</style><!-- SSF P4 STYLE END --></head>',1)
  s=s.replace('</body>','<!-- SSF P4 INLINE START --><script>'+js+'</script><!-- SSF P4 INLINE END --></body>',1)
 else:
  match=re.search(r'<link[^>]+href="([^"?]*styles\.css)(?:\?[^" ]*)?"[^>]*>',s)
  if not match:continue
  prefix=match[1][:-len('styles.css')]
  s=re.sub(re.escape(START)+r'.*?'+re.escape(END),'',s,flags=re.S)
  s=re.sub(r'<!-- SSF P4 ASSETS START -->.*?<!-- SSF P4 ASSETS END -->','',s,flags=re.S)
  s=s.replace('</head>',f'<!-- SSF P4 ASSETS START --><link rel="stylesheet" href="{prefix}phase4.css"><script src="{prefix}phase4-preferences.js"></script><!-- SSF P4 ASSETS END --></head>',1)
  menu=re.search(r'<button[^>]*class="menu-toggle"',s)
  if menu:s=s[:menu.start()]+controls()+s[menu.start():]
  elif '<header' in s:
   brand=re.search(r'<a[^>]*class="brand".*?</a>',s,re.S)
   if not brand:raise SystemExit('Missing legacy brand: '+rel)
   s=s[:brand.end()]+controls()+s[brand.end():]
  else:s=s.replace('<main ',controls()+'<main ',1)
 count+=1
 if '--write' in sys.argv:p.write_text(s)
 elif s!=old:raise SystemExit('Display template stale: '+rel)
print(f'Phase 4 display template: {count} primary/legacy styled pages including standalone 404')
