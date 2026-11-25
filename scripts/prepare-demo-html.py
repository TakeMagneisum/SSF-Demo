#!/usr/bin/env python3
"""One-time idempotent static-site normalization for GitHub Pages project subpaths.

Changes HTML links and demo presentation only; does not alter resource datasets.
"""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import os
import re

ROOT = Path(__file__).resolve().parent.parent
BANNER = ('<aside class="ssf-demo-banner" role="note" aria-label="Demonstration website">'
          '<strong>Demonstration website.</strong> Interface improvements are in progress. '
          'Details may change; confirm assistance directly with providers.</aside>')
STYLE = '''/* Demo-only identification; not a replacement for accessible shared design tokens. */
.ssf-demo-banner{background:#fff1c6;color:#253330;border-bottom:2px solid #80600c;
  padding:.8rem max(1rem,calc((100vw - 73rem)/2));font:500 1rem/1.5 system-ui,sans-serif}
.ssf-demo-banner strong{font-weight:750}
@media (prefers-color-scheme:dark){.ssf-demo-banner{background:#2d3024;color:#fff3cc;border-color:#f2b441}}
@media (forced-colors:active){.ssf-demo-banner{border-bottom:2px solid CanvasText}}
'''
(ROOT / 'assets/demo.css').write_text(STYLE, encoding='utf-8')

def relative(path: Path, from_dir: Path):
    return Path(os.path.relpath(path, from_dir)).as_posix()

changes = 0
for html in ROOT.rglob('*.html'):
    text = html.read_text(encoding='utf-8')
    if '<!-- SSF DEMO NORMALIZED -->' in text: continue
    original = text
    # HTML canonical/OG URLs must not point to the production site from demo.
    text = re.sub(r'\s*<link\b[^>]*\brel="canonical"[^>]*>', '', text, flags=re.I)
    text = re.sub(r'\s*<meta\b[^>]*\bproperty="og:url"[^>]*>', '', text, flags=re.I)
    def linkfix(match):
        field, quote, value = match.group(1), match.group(2), match.group(3)
        spec = urlsplit(value)
        if value.startswith('/') and not value.startswith('//'):
            # Convert only same-site absolute paths, preserving query and fragment.
            target = ROOT / unquote(spec.path.lstrip('/'))
            if not spec.path.strip('/'): target = ROOT / 'index.html'
            elif spec.path.endswith('/'): target = target / 'index.html'
            new = relative(target, html.parent)
            if spec.path.endswith('/') and new.endswith('index.html'):
                new = new[:-len('index.html')]
            return field + '=' + quote + new + (('?' + spec.query) if spec.query else '') + (('#' + spec.fragment) if spec.fragment else '') + quote
        # Repair broken root-based asset references in old copied HTML pages
        # only if the referenced file exists unambiguously at repository root.
        if not value.startswith('//') and not spec.scheme and spec.path:
            local = html.parent / unquote(spec.path)
            root_candidate = ROOT / unquote(spec.path)
            if not local.exists() and root_candidate.is_file():
                return field + '=' + quote + relative(root_candidate, html.parent) + (('?' + spec.query) if spec.query else '') + (('#' + spec.fragment) if spec.fragment else '') + quote
        return match.group(0)
    text = re.sub(r'\b(href|src|action)=(\"|\')(.*?)\2', linkfix, text, flags=re.I|re.S)
    head = re.search(r'<head\b[^>]*>', text, re.I)
    if head:
        insert = ('\n  <!-- SSF DEMO NORMALIZED -->'
                  '\n  <meta name="robots" content="noindex,nofollow,noarchive">'
                  f'\n  <link rel="stylesheet" href="{relative(ROOT / "assets/demo.css", html.parent)}">')
        text = text[:head.end()] + insert + text[head.end():]
    if not head:
        htmltag = re.search(r'<html\b[^>]*>', text, re.I)
        if htmltag:
            insert = ('\n<!-- SSF DEMO NORMALIZED -->'
                      '\n<meta name="robots" content="noindex,nofollow,noarchive">'
                      f'\n<link rel="stylesheet" href="{relative(ROOT / "assets/demo.css", html.parent)}">')
            text = text[:htmltag.end()] + insert + text[htmltag.end():]
    body = re.search(r'<body\b[^>]*>', text, re.I)
    if body:
        text = text[:body.end()] + '\n  ' + BANNER + text[body.end():]
    elif html.name == 'OPEN-GUIDES.html':
        text = text.replace('<main>', BANNER + '<main>', 1)
    if text != original:
        html.write_text(text, encoding='utf-8')
        changes += 1
print(f'Demo HTML normalized: {changes} pages')
