# Phase 1 execution record — 2026-11-24 (US Eastern)

All checks were run against the uploaded archive or the independent demo copy. No production deployment or provider website verification occurred.

| Test | Environment | Outcome |
|---|---|---|
| Source `node scripts/validate-data.js` | Node 22.16.0 | PASS, 106 editions / 3,487 listings |
| Source `node scripts/validate-explore-map.cjs` | Node 22.16.0 simulated DOM | PASS, all 51 states, 159 Georgia counties, 33 London boroughs, list/history/geometry fallbacks |
| Source `python validate-guides.py` | Python 3.13.5 | PASS, distinct 41-draft research ledger (not current service availability) |
| Source `node scripts/audit-resources.js --offline` | Offline on scratch copy | PASS, reported 0 broken, 1 stale; did not check live URLs |
| Source `node scripts/import-city-review-sheets.js` | Node 22.16.0 on scratch copy | PASS, generated JS identical to original |
| Demo `python scripts/phase1-data-baseline.py` | Python 3.13.5 | PASS, 201 files and original SHA-256 digests unchanged |
| Demo `node scripts/validate-data.js` | Node 22.16.0 | PASS with demo-only sitemap/canonical distinction |
| Demo `node scripts/validate-explore-map.cjs` | Node 22.16.0 | PASS |
| Demo `python validate-guides.py` | Python 3.13.5 | PASS |
| Demo `python scripts/validate-demo-links.py` | Python 3.13.5 | PASS: 66 HTML files, 946 local references resolved, 0 missing/absolute local references; no active CNAME |
| Local server GET under `/ssf-demo/` | Python HTTP server and `urllib` | PASS HTTP 200: index, assets/demo.css, find-help.html?area=liberty, explore-map.html?country=US&state=GA, learn/ai-safety/, 404.html |
| Chromium headless DOM smoke | Chromium CLI | INCONCLUSIVE: process did not return within execution window. Do not claim interactive browser verification. |
| Human screen-reader, iOS/Android, contrast, print, actual GitHub Pages | Not performed | OPEN — see `ACCEPTANCE_TESTS.md` |

No claim is made that a source date is a provider availability check or that server HTTP 200 validates JS functionality. CLI and basic route testing need to be followed by human-accessibility and realistic-device verification before demo promotion or production cutover.

Phase 2 has its own fresh baseline and final evidence in `PHASE2_TEST_RESULTS.md` and `qa/`. Historical Phase 1 test entries above remain unchanged.
