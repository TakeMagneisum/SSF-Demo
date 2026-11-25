#!/usr/bin/env python3
"""Create/check a byte-exact digest inventory for SSF protected source material.

Use --write only after a deliberate, reviewed data/brand change. Standard use:
python scripts/phase1-data-baseline.py
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT = ROOT / 'baseline' / 'data-integrity.json'
FILES = [
    'research-ledger.json', 'source-registry.json', 'location-plan.json',
    'location-index.csv', 'research-checklist.csv',
]
GLOBS = [
    'review-sheets/**/*.csv', 'review-sheets/*.csv',
    'review-sheets/**/*.json', 'review-sheets/*.json',
    'assets/*-resources.js', 'assets/resources.js',
    'assets/expanded-editions.js', 'assets/discovery-data.js',
    'assets/maps/*.js', 'assets/maps/*-SOURCE.md',
    'assets/*.svg', 'assets/*.webp', 'assets/*.png',
]

def collect():
    paths = {ROOT / p for p in FILES}
    for pattern in GLOBS:
        paths.update(ROOT.glob(pattern))
    if not all(p.is_file() for p in paths):
        raise RuntimeError('A protected source file is missing')
    result = {}
    for p in sorted(paths):
        data = p.read_bytes()
        result[p.relative_to(ROOT).as_posix()] = {
            'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)
        }
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true', help='Replace baseline after approved changes')
    args = parser.parse_args()
    actual = collect()
    if args.write:
        SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
        SNAPSHOT.write_text(json.dumps({
            'schema': 1, 'purpose': 'Phase 1 immutable reference for protected datasets, provenance and brand assets',
            'files': actual,
        }, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
        print(f'Baseline written: {len(actual)} protected files')
        return
    expected = json.loads(SNAPSHOT.read_text(encoding='utf-8'))['files']
    added = sorted(set(actual) - set(expected))
    missing = sorted(set(expected) - set(actual))
    changed = sorted(k for k in set(expected) & set(actual) if expected[k] != actual[k])
    if added or missing or changed:
        for k, paths in [('ADDED', added), ('MISSING', missing), ('CHANGED', changed)]:
            for p in paths: print(f'{k}: {p}')
        raise SystemExit(1)
    print(f'Protected data baseline passed: {len(actual)} unchanged files')

if __name__ == '__main__': main()
