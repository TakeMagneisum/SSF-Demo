#!/usr/bin/env python3
"""Static link audit for the GitHub Pages project-subpath demo.

Does not replace browser QA or check external website availability.
"""
import argparse
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
LEGACY = {
    'find-help/find-help.html',
    'assets/index.html', 'assets/find-help.html',
    'assets/discover.html', 'assets/404.html',
}

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.urls = []; self.ids = set()
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'): self.ids.add(values['id'])
        for field in ('href', 'src', 'action'):
            if values.get(field): self.urls.append((field, values[field]))

def main():
    argp = argparse.ArgumentParser()
    argp.add_argument('--strict-legacy', action='store_true', help='Fail for broken legacy HTML too')
    args = argp.parse_args()
    issues = []; legacy_issues = []; counters = Counter()
    for forbidden in ('CNAME', 'assets/CNAME'):
        if (ROOT / forbidden).exists(): issues.append((forbidden, 'active production-domain CNAME forbidden'))
    robots = ROOT / 'robots.txt'
    if not robots.exists() or 'Disallow: /' not in robots.read_text(encoding='utf-8'):
        issues.append(('robots.txt', 'missing demo crawler disallow'))
    for html in sorted(ROOT.rglob('*.html')):
        rel = html.relative_to(ROOT).as_posix()
        page = Parser(); page.feed(html.read_text(encoding='utf-8', errors='replace'))
        legacy = rel in LEGACY
        counters['html'] += 1
        content = html.read_text(encoding='utf-8', errors='replace')
        if 'name="robots" content="noindex' not in content:
            (legacy_issues if legacy else issues).append((rel, 'missing demo noindex'))
        if 'rel="canonical"' in content or 'property="og:url"' in content:
            (legacy_issues if legacy else issues).append((rel, 'demo must not claim a production canonical/OG URL'))
        for field, url in page.urls:
            url = url.strip(); target_spec = urlsplit(url)
            if url.startswith('//') or target_spec.scheme: continue
            if url.startswith('/'):
                (legacy_issues if legacy else issues).append((rel, f'root-relative {field}: {url}'))
                continue
            if not target_spec.path:
                if target_spec.fragment and target_spec.fragment not in page.ids:
                    (legacy_issues if legacy else issues).append((rel, f'missing fragment: {url}'))
                continue
            local = html.parent / unquote(target_spec.path)
            if local.is_dir(): local /= 'index.html'
            if not local.is_file():
                (legacy_issues if legacy else issues).append((rel, f'missing local {field}: {url}'))
            else: counters['resolved_refs'] += 1
    for rel, msg in issues:
        print('FAIL', rel, msg)
    for rel, msg in legacy_issues:
        print('LEGACY', rel, msg)
    print(f'{counters["html"]} HTML files; {counters["resolved_refs"]} resolved local references; {len(issues)} main-route issues; {len(legacy_issues)} legacy issues')
    if issues or (args.strict_legacy and legacy_issues): raise SystemExit(1)

if __name__ == '__main__': main()
