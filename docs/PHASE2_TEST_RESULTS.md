# Phase 2 verification record — 2026-11-24 (US Eastern)

**Status:** implemented, offline-validated; interactive browser verification incomplete. All code/data from the supplied Phase 1 ZIP, tested locally under Linux with Node 22.16.0 and Python 3.13.5. No production changes, live provider checks, or GitHub deployment. Exact command output: `qa/phase2-initial.txt`, `qa/phase2-final.txt`, `qa/phase2-browser-attempt.txt`, `qa/phase2-payload.csv` (repository-relative paths).

## Fresh initial baseline and final results

| Command | Initial | Final |
|---|---|---|
| `python scripts/phase1-data-baseline.py` | PASS 201 | PASS 201, byte-exact |
| `node scripts/validate-data.js` | PASS 106 editions, 3,487 placements, 13 discovery topics, 16 categories, 140+ urgent cases | PASS, same totals and urgent tests; updated loading contract |
| `node scripts/validate-explore-map.cjs` | PASS 106 routes, 51 states, 159 GA counties, 33 London | PASS, same route/fallback tests against metadata; extra failed-index check |
| `python validate-guides.py` | PASS 41 drafts, 1,181 placements, 250 evidence sources | PASS, unchanged; source date remains 2026-11-18 |
| `python scripts/validate-demo-links.py` | PASS 66 HTML, 946 resolved refs | PASS strict legacy: 66 HTML, 1,045 refs, 0 main/legacy issues; noindex/no CNAME |
| `node scripts/audit-resources.js --offline` | PASS: 0 broken, 1 stale, 0 blocked/warnings | PASS same (scratch), not live checks |
| `node scripts/import-city-review-sheets.js` | Not rerun at initial baseline | PASS (scratch): 55 generated editions, byte-identical JS |
| `node scripts/phase2-data.cjs` | Snapshot captured before data-loading edits | PASS all 106 guides, 3,487 resource IDs/order and full serialized values, routing/emergency/urgent-classifier and ZIP/discovery/map crosswalks; 444 catalog entries; generated outputs exact |
| `node scripts/phase2-picker.cjs` | N/A | PASS all 106 picker route targets and country filters, neutral selection, storage, failure fallback, simulated DOM |
| `python scripts/phase2-http-smoke.py` | N/A | PASS 16 routes/assets twice under `/ssf-demo/`, including direct GA county and London selection routes; static HTTP, not JS execution |
| `python scripts/phase2-browser-smoke.py` | N/A | BLOCKED, exit 1: Chromium 144.0.7559.96 launched, first `page.goto` returned `net::ERR_BLOCKED_BY_ADMINISTRATOR` on local project path. No desktop/phone assertions executed. |

During development, the old `validate-data.js` failed five checks after metadata substitution (two obsolete homepage script requirements and three version token checks). Updated the validator to enforce the new coverage import, explicitly prohibit all seven resource imports on home/map, require full finder imports, and recognize cache tokens. Final rerun green; no data-validation rule weakened. Original audit reports retained, not relabeled as current. Original Phase 1 archived validation dates retained.

## Byte measurements (initial external JS only)

Method: enumerate each root HTML's external `script src` references, strip query version, read corresponding files from exact Phase 1 ZIP and final Phase 2 tree; sum raw bytes and independent Python gzip streams (`mtime=0`, default compression). No browser cache/transfer compression/CPU/latency measured. Inline JS, CSS, images, regional lazy geometry and conditional PDF libraries are excluded. Static HTML size shown separately, since the no-JS map list increases HTML. Reproduce with `python scripts/phase2-measure.py /path/to/phase1.zip`.

| Page | Initial external JS files (old→new) | Raw JS bytes (old→new) | Gzip estimates (old→new) | Raw HTML (old→new) |
|---|---:|---:|---:|---:|
| Home | 12→6 | 3,383,996→86,737 | 411,514→24,881 | 38,820→38,724 |
| Explore map | 12→6 | 3,505,245→208,064 | 453,284→66,689 | 8,142→17,605 |
| Finder | 15→15 | 3,436,564→3,436,909 | 426,931→427,061 | 45,297→45,285 |
| Discovery | 4→4 | 82,995→82,995 | 25,207→25,207 | 12,757→12,753 |

Home raw JS reduction 97.4%; map raw JS reduction 94.1%. Gzip JS estimates fall 94.0% and 85.3%, respectively. No user-visible speed multiplier claimed. Coverage index alone is about 26 KB raw, with no resource-list arrays. The map fallback adds ~9.5 KB uncompressed HTML (~1.7 KB gzip); deliberate resilience tradeoff. Finder still loads every edition on a directory route; future split requires handout parity.

## Risks, unverified acceptance, next actions

- No actual desktop or phone rendering/JS navigation, interactive refresh/Back/Forward or browser resource network capture verified in this environment. Map and picker are Node simulations; HTTP 200 verifies serving only. Optional browser script is a proposed runnable test, not a passing browser suite. Run on a permitted machine under real project subpath. Verify all control selectors and expand assertions as needed.
- No native print dialog, actual PDF output, QR scanning, mobile Safari/Chrome, screen reader, browser zoom, visual layout, contrast or WCAG compliance tested. Existing iOS print issue remains.
- Direct `/ssf-demo/404.html` serves correctly and direct home href now points to index. Arbitrarily deep missing URLs on actual GitHub Pages can still resolve relative assets incorrectly; verify/fix before wider release. Historical duplicate HTML routes remain; no tested redirect plan yet.
- Existing US emergency defaults on international/no-JS/static pages need a jurisdiction-specific review; no emergency data altered. Existing language control unchanged; new fallback strings not independently localized. Existing selected-guide storage unchanged; sensitive data clearing still planned.
- Existing Omaha pet-listing gap, one stale source audit item and pending local research verification remain. No fresh source availability claims. Geometry licenses rely on original provenance plus cited official descriptions; source archives not redownloaded or independently revalidated.
- No human usability acceptance, public release or production deployment. CI configuration updated but GitHub Actions execution not observed. Keep production and demo separate.
