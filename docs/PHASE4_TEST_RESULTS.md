# Phase 4 verification record — 2026-11-24 (US Eastern)

**Implemented + offline-validated. Browser, hosted, assistive-technology, native printing and human acceptance remain open.** Sole code/data source: supplied Phase 3 demonstration ZIP. Linux; Node v22.16.0, Python 3.13.5, Chromium 144.0.7559.96 (launch only). No live provider checks or production deployment.

## Commands and actual results

Exact stdout/stderr and exit codes: `qa/phase4-initial.txt`, `qa/phase4-incremental.txt`, `qa/phase4-final.txt`, browser/audit logs and `qa/phase4-payload.csv`. All 13 original core commands returned exit 0 on the initial and final copies. Eleven new template/state/contrast/handout/syntax commands returned exit 0 on the final copy (24 final commands in all). Separate offline audit passes recorded in scratch copies.

| Command | Final result |
|---|---|
| `python scripts/phase1-data-baseline.py` | PASS: 201 unchanged protected files |
| `node scripts/validate-data.js` | PASS: 106 editions, 3,487 listings, 16 categories, 13 discovery topics, 140+ urgent cases; existing Omaha gap |
| `node scripts/validate-explore-map.cjs` | PASS: 106 guide routes, 33 boroughs, 51 US state routes, 159 GA counties, lazy geometry, map/list selection/history simulation, failures and ZIP caveats |
| `python validate-guides.py` | PASS: 41 drafts, 1,181 placements, 250 distinct evidence pages; existing check date unchanged |
| `python scripts/validate-demo-links.py --strict-legacy` | PASS: 66 HTML pages, 1,149 resolved local references, 0 primary/legacy issues, noindex/no CNAME |
| `node scripts/phase2-data.cjs` | PASS: exact guide/listing field/order and urgent routing parity; metadata and crosswalk freshness, 444 catalog places |
| `node scripts/phase2-picker.cjs` | PASS: all 106 metadata picker routes, stored choice, failure/default simulations |
| `python scripts/phase2-http-smoke.py` | PASS: 16 routes/assets, twice, local project path |
| `python scripts/phase3-nav.py` | PASS: 18 shared nav pages |
| `node scripts/phase3-postal.cjs` | PASS: 63 original ZIP suggestion groups |
| `node scripts/phase3-region-search.cjs` | PASS: 51 state and 159 county names |
| `node scripts/phase3-interactions.cjs` | PASS: map and search events, direct routes, missing data, emergency scopes for 106 guides, invalid guide safety, static/no-JS links, Calm/language/menu, root/nested 404 simulation |
| `python scripts/phase3-http-smoke.py` | PASS: 13 routes/assets (including Phase 4 CSS/JS), twice; 3 simulated nested 404 responses |
| `python scripts/phase4-template.py` | PASS: exact generated controls/assets across 24 styled primary/legacy pages incl standalone root 404 |
| `node scripts/phase4-preferences.cjs` | PASS: system/light/dark, media changes, higher contrast, motion/forced-color state, reading preferences, Calm override, malformed input, blocked storage, reset isolation, storage/reload/BFCache, Escape/Close/Menu and focus simulation, Spanish map counts, static CSS checks |
| `node scripts/phase4-handout.cjs` | PASS: original Liberty resource/QR encoder + selected-card review, preview, official URL, print handler call, selection persistence, focus return and clear isolation simulation |
| `python scripts/phase4-contrast.py` | PASS: 17 selected opaque color pairs, actual default token override considered; no computed-style audit |
| `node --check assets/{phase4-preferences,handout,phase3-map-ui,phase3-home,explore-map,i18n,calm}.js` (executed individually) | PASS: all seven syntax checks |
| `node scripts/audit-resources.js --offline` (initial/final scratch copies) | PASS: 0 broken, 1 stale, 0 blocked, 0 warnings; not live URL checks |
| `python scripts/phase2-browser-smoke.py` initial | BLOCKED: Chromium launched; first local homepage request `net::ERR_BLOCKED_BY_ADMINISTRATOR`, exit 1 |
| `python scripts/phase4-browser-smoke.py` final | BLOCKED: same policy at first local homepage request, exit 1; no desktop, 320/390, landscape, actual reflow or forced-color assertions executed |

Initial incremental map harness failure: script picked every `<option>` in HTML including new display values; initial fake document lacked preference dataset. Harness corrected to scope country options to `#map-country` and run preference script in dedicated richer simulation. Original map assertions still run and pass. Both baseline JSON files compared byte-for-byte to supplied archive, not regenerated. Offline CI updated; remote CI not run. Original output/audit reports preserved. `qa/phase4-file-diff.txt` records implementation and documentation file changes.

## Static contrast samples

| Pair | Ratio | Target |
|---|---:|---:|
| Light body (#17312f on effective #f4f0e5) | 12.16:1 | 4.5:1 |
| Light muted (#536b67 on #f4f0e5) | 5.03:1 | 4.5:1 |
| Dark raised body (#fbf7ed on #173733) | 12.04:1 | 4.5:1 |
| Dark muted (#d0dcda on #173733) | 9.16:1 | 4.5:1 |
| Dark link (#f2c55c on #173733) | 7.92:1 | 4.5:1 |
| Dark control border (#6e8983 on #173733) | 3.42:1 | 3:1 |
| Light urgent white on #b9473d | 5.21:1 | 4.5:1 |
| Dark urgent white on #a9473f | 5.74:1 | 4.5:1 |

Source-level arithmetic for specific opaque pairs, not measurement of all rendered text/controls. Color alone not used as the only map selection indication; lists remain available. Validate real computed styles, all states, forced-colors, and non-text focus in human/browser review.

## Reproducible payload measurements

`python scripts/phase4-measure.py /path/to/supplied-phase3.zip` counts each initial external JS/CSS tag and raw uncompressed bytes. Gzip estimate sums independent gzip streams (mtime 0); not actual HTTP compression, caching, CPU, latency, lazy geometry or rendering. HTML separately measured; root 404 uses inline CSS/JS and no asset request.

| Page | Raw JS Phase 3 → 4 | Raw CSS Phase 3 → 4 | Initial JS/CSS tags Phase 3 → 4 |
|---|---:|---:|---:|
| Home | 222,263 → 233,645 | 108,151 → 128,673 | 13 → 15 |
| Map | 238,195 → 250,097 | 112,709 → 133,231 | 12 → 14 |
| Finder | 3,439,358 → 3,450,166 | 112,372 → 132,894 | 20 → 22 |
| Discover | 84,638 → 94,656 | 108,151 → 128,673 | 7 → 9 |
| CPR learning | 2,472 → 7,645 | 108,151 → 128,673 | 4 → 6 |
| Travel | 39,522 → 49,540 | 112,909 → 133,431 | 7 → 9 |
| Standalone 404 HTML (inline) | 9,750 → 32,333 bytes HTML | no external CSS | 0 → 0 |

Home and map still never load full registry. The one shared preference script and stylesheet add two initial references; original stylesheet's dark compatibility selector expansion and Spanish labels also add bytes. No new third-party dependency or runtime component fetch. See exact CSV for gzip estimates.

## Open gates and limitations

- Desktop/mobile real-browser rendering, 320/390 CSS px, landscape, 200% text, browser zoom, real keyboard interaction, browser history/refresh, computed contrast, forced colors, screen-reader announcements, system preference changes, actual native print/PDF/QR scanning and GitHub Pages hosting are **not verified**. Simulations and local HTTP checks are not those tests. No workaround to policy attempted. Run optional Phase 4 browser script on an authorized local environment; review actual visual behavior and AT manually. It is a starter test, not full browser coverage.
- Dark mode uses established Calm palette but does not suppress artwork unless Calm active. Light/dark/system requires JS; no-JS remains original readable light with menu links, and CSS OS motion/forced-color rules. Large text presets scale rem; some legacy explicit CSS sizes remain. No blanket WCAG claim; higher contrast strengthens selected pairs, not proof every combination is compliant. No human evaluation.
- Some pages never had translation runtime, and existing translation is incomplete; new key map and settings strings translated but no independent Spanish editorial review. Names/providers and source records not updated. Older duplicate HTML routes kept; no tested redirect plan yet. Root 404 has same embedded script; arbitrary root-hosted nested error recovery limitation inherited from Phase 3. No new postal crosswalk/geometry.
- Narrow/large-text tray uses inline flow and selected-card review shortcuts; desktop floating tray retained. Native iPhone print/PDF issue and actual QR scanning still open, including legacy routes. Existing one stale source check and Omaha pet-assistance coverage gap remain. Source dates not refreshed.
- Phase 5 is specified separately, not implemented or authorized for production. Real-browser/AT and human approval remain release gates. See `PHASE4_ADR.md` for decision rationale and rollback.
