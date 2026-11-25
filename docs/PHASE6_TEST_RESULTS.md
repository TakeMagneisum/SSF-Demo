# Single Step Forward 2.0 — Phase 6 validation report

**Implemented and offline-validated. Not release-accepted.** Source: supplied Phase 5 demonstration ZIP only. Environment: Linux, Python 3.13.5, Node v22.16.0, Chromium 144.0.7559.96 (launch only); actual PDF renderer PyMuPDF 1.26.7, OpenCV 4.13.0. No production, deployment, new data, provider or DNS changes.

## Baseline and final checks

Initial `python scripts/phase5-run.py final` **30/30 pass**. Final `python scripts/phase6-run.py` **8/8 command groups**, comprising all 30 earlier commands plus seven new commands (37 individual checks); `python scripts/phase6-http-smoke.py` also passed (38 individual offline checks total). Separate actual PDF render check passed. Exact commands, stdout/stderr and exits in `qa/phase6-initial.txt`, `qa/phase6-incremental.txt`, `qa/phase6-final.txt`, `qa/phase6-http.txt`, `qa/phase6-pdf-render.txt`, `qa/phase6-audit.txt`, and browser logs. First incremental run failed the existing cache-token assertion for nine updated references; validator now checks exact new phase6 tokens and unchanged tokens for other assets. Final 30/30 prior checks passed; no data or record assertions relaxed.

| Gate | Result |
|---|---|
| `python scripts/phase1-data-baseline.py` | 201 protected files unchanged |
| `node scripts/validate-data.js` | 106 editions, 3,487 placements, 16 directory categories, 13 topics, routing and 140+ urgent-language cases |
| `node scripts/validate-explore-map.cjs` | 51 US state paths, 159 GA counties, 33 London borough targets, all guide routes |
| `python validate-guides.py` | 41 research drafts, separate historical research ledger |
| `python scripts/validate-demo-links.py --strict-legacy` | 66 HTML, 1,168 resolved local references, zero main or legacy static issues; noindex/CNAME checks |
| `node scripts/phase2-data.cjs` | exact 106 guides/3,487 listing fields and order, urgent targets, discovery and geographic data |
| Remaining Phase 2–5 commands | all pass; see exact final log including 424 urgent combinations, picker, map, preference, 17 contrast pairs, handout and prep simulations and HTTP smoke tests |
| `node --check assets/sheet-pdf.js` / `assets/phase6-privacy.js` / `assets/site.js` | pass |
| `node scripts/phase6-pdf.cjs` | actual PDFLib and QR engine, all original sheet-field font coverage, 1-page standard and 5-page large-print PDFs, original links, optional credit, empty rejection |
| `node scripts/phase6-controller.cjs` | simulated empty, nested script-relative paths, lazy parallel load, independent failed-dependency retry, actual source snapshot, private sentinel excluded, repeated generation, large print, stale completion cancellation and URL cleanup |
| `node scripts/phase6-privacy.cjs` | blocked storage, clear location only, unnamed forms, disabled fallback, referrer policy and no heavy home/map imports |
| `node scripts/phase6-handout.cjs` | actual ordered Liberty/London ID pairs, restored-page selection reconciliation, missing-QR public link, blocked storage in-memory choices, clear isolation; simulated DOM |
| `python scripts/phase6-http-smoke.py` | root and nested full finder, six exact script-relative asset responses per route, privacy page/reset asset HTTP 200 |
| `node scripts/audit-resources.js --offline` (scratch copy only) | 0 broken, 1 stale, 0 blocked, 0 warnings, exit 0; not current live source check |
| `python scripts/phase4-browser-smoke.py` before and after | Chromium launched; exit 1 at first localhost page `ERR_BLOCKED_BY_ADMINISTRATOR`; no browser interaction assertions executed; no bypass |

Both original baseline snapshots compared byte-for-byte against supplied ZIP; unchanged. All canonical source fields, dates, emergency classifier and routing, geographic associations, and protected brand/assets preserved. No removed archive files. CI includes new checks; remote execution not verified.

## Actual generated PDF evidence

Reproduce in disposable directory: `node scripts/phase6-pdf.cjs /tmp/ssf-pdf-fixtures` then `python scripts/phase6-render-check.py /tmp/ssf-pdf-fixtures` (optional Python renderer requires PyMuPDF, OpenCV and NumPy). Tests use original resource fields from Liberty, Santiago, Long Beach and London Enfield, including urgent support, international diacritics, longest original URL and optional production credit. Node asserts annotations target original HTTPS URLs (1 annotation single, 17 large including wrapped URLs/credit). PyMuPDF extracts all expected fixture field text, checks text bounding boxes and renders all six pages. OpenCV decodes exactly 15 expected QR symbols from rendered PDFs at 3x resolution; no physical scan claim. All 3,487 placements tested for character coverage in embedded font on relevant fields. Standard example 83,450 bytes; large 118,834 bytes (generation metadata may vary). Fixture PDFs are not deployed, and no new provider records are generated. Test snapshots constructed from actual original fields; separate DOM controller simulation checks snapshot exclusion of a private sentinel. No actual browser-integrated PDF click workflow tested. Visual review of first standard and large page showed legible spacing and wrapped URLs; remaining pages checked by text bounds/render/decoding, not full human visual QA. No tagged PDF/PDF-UA claim.

## Performance (raw file sizes, not measured speed)

`python scripts/phase6-measure.py /path/to/phase5.zip` yields `qa/phase6-payload.csv`; gzip estimates are independent file streams. Initial referenced external JS/CSS tags and sum of bytes:

| Page | Phase 5 raw JS+CSS | Phase 6 raw JS+CSS | JS+CSS references |
|---|---:|---:|---:|
| Home | 364,639 | 365,177 | 15 → 15 |
| Explore map | 385,649 | 385,753 | 14 → 14 |
| Finder | 3,595,427 | 3,599,803 | 25 → 25 |
| Discovery | 225,650 | 225,754 | 9 → 9 |

Finder increase 4,376 bytes raw, 1,321 bytes estimated gzip; no increase in initial external JS/CSS tags. Existing optional PDFLib and font assets total 671,696 raw bytes / 301,780 independent gzip bytes; still omitted from initial load and requested only on explicit generation. This is preservation of preexisting lazy loading, not a new payload saving. No actual network/cache/load/CPU measurement possible. Full registry retained in directory because cross-guide selection and urgent routing use it; no full registry on home/map. No new mandatory external runtime service.

## Open gates / limitations

Native Safari/Chrome iPhone Share/Print, Android, actual PDF download/share and permissions, keyboard/AT, 320/390/landscape/reflow/zoom, computed contrast/forced colors, history/BFCache and focus, actual network/storage/referrers, hosted project subpath/404, remote CI and human acceptance remain unverified. The oldest historical assets/find-help.html route still lacks complete registry/handout dependencies; root and nested full finder get print improvements. 42 protected historical HTML files lack added referrer metadata; 24 editable styled/404 pages use no-referrer. Protected pages were not altered. Source audit found no remote runtime asset tags or editable external target-blank anchors lacking both noopener/noreferrer, not a traffic capture. Privacy tools do not clear OS/browser history/cache/clipboard/downloads or prevent device monitoring. Existing one stale source-review item, Omaha pet-assistance gap, partial Spanish localization, and legacy route limitations remain. No live source check or eligibility/availability claim. Feature freeze for Phase 7 independent QA; production and Florida expansion not authorized.
