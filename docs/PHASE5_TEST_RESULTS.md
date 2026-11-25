# Phase 5 verification — 2026-11-24 (US Eastern)

**Implemented and offline-validated; not browser/AT/human accepted.** Linux, Node v22.16.0, Python 3.13.5, Chromium 144.0.7559.96 (launch only). Supplied Phase 4 ZIP only. Exact commands, stdout/stderr, exit codes in `qa/phase5-initial.txt`, `qa/phase5-incremental.txt`, `qa/phase5-final.txt`, browser and scratch-audit logs. Run `python scripts/phase5-run.py final` from repository root. Initial 24/24 old gates, final 30/30 gates, each exit 0. An incremental vocabulary binding error was corrected (`category` destructuring); template freshness initially failed because new prep assets followed Phase 4 generated marker, then existing generator restored required ordering. No baseline rewritten.

| Gate | Final evidence |
|---|---|
| `python scripts/phase1-data-baseline.py` | 201 protected files unchanged |
| `node scripts/validate-data.js` | 106 guides, 3,487 listings, 16 categories, 13 discovery topics, 140+ classifier cases, Omaha gap disclosed |
| `node scripts/validate-explore-map.cjs` | 106 guide routes, 51 US states, 159 GA counties, 33 London borough targets, selection/fallback/history simulation |
| `python validate-guides.py` | 41 research drafts, 1,181 research placements, 250 distinct evidence pages; historic 2026-11-18 check date unchanged |
| `python scripts/validate-demo-links.py --strict-legacy` | 66 HTML files, no unresolved primary/legacy local links, noindex/no CNAME; exact count in final log |
| `node scripts/phase2-data.cjs` | exact guide/listing fields/order, discovery, urgency targets/classifier and crosswalk parity |
| `node scripts/phase2-picker.cjs` | all 106 guide picker routes, stored choice/failure simulation |
| `python scripts/phase2-http-smoke.py` | 16 local project subpath URLs twice |
| `python scripts/phase3-nav.py` | 18 shared nav pages |
| `node scripts/phase3-postal.cjs` | 63 original ZIP suggestion groups |
| `node scripts/phase3-region-search.cjs` | 51/159 names |
| `node scripts/phase3-interactions.cjs` | map events/URL/history/failure, 106 guide emergency scopes, invalid route, menu/language/Calm, 404 simulation |
| `python scripts/phase3-http-smoke.py` | 13 URLs twice, 3 custom 404 responses |
| `python scripts/phase4-template.py` | 24 styled routes including inline 404 |
| `node scripts/phase4-preferences.cjs` | preference and reset isolation, blocked storage, OS state, menu/focus, CSS checks |
| `node scripts/phase4-handout.cjs` | real Liberty record, original handout and QR encoder, selection/review/back/clear, print handler invocation simulation |
| `python scripts/phase4-contrast.py` | 17 static contrast pairs (not new rendered card contrast) |
| Seven previous `node --check` commands | all passed |
| `node --check assets/guide.js` and `node --check assets/phase5-vocabulary.js` and `node --check assets/phase5-prep.js` | all passed |
| `node scripts/phase5-finder.cjs` | actual renderer with all original guide records, 424 mixed urgent-query cases across 106 guides, exact route IDs/order, unknown route neutral, original summaries/next/date/URL, native detail state, OR filters/removal/focus, simulated handout interface state, four new phrase/misspelling searches, zero close matches, query privacy/static no-JS form and no-heavy-data checks |
| `node scripts/phase5-prep.cjs` | click-only static text, clipboard missing/denied fallback and status simulation |
| `python scripts/phase5-http-smoke.py` | 10 URLs twice under project subpath incl both legacy finder paths, primary need link, new assets and prep routes |
| `node scripts/audit-resources.js --offline` initial/final scratch copies | 0 broken, 1 stale, 0 blocked, 0 warnings; no live URL checks |
| `python scripts/phase4-browser-smoke.py` initial/final attempt | exit 1, Chromium policy `ERR_BLOCKED_BY_ADMINISTRATOR` at first localhost homepage; no subsequent assertions executed; no circumvention |

Both original baseline files byte-identical to input archive. All public resource records and historic dates unchanged. No network source reviews; original audit reports preserved. CI amended to run new checks; remote CI not run. `qa/phase5-file-diff.txt` lists changes.

## Raw initial payload (not latency)

`python scripts/phase5-measure.py /path/to/phase4.zip` counts initial external JS/CSS tags and sums raw file sizes; gzip estimates independent streams, no actual compression/network/cache/CPU/rendering measurements. Exact per-page CSV: `qa/phase5-payload.csv`. Shared translation table +2,321 JS bytes on pages importing it. Main finder adds two scripts and one stylesheet (~12.4 KB raw combined); home/map stay metadata-only. Directory still uses full registry. No new third-party runtime fetches. HTML separately measured.

## Release gates not closed

Real desktop/mobile 320/390, landscape, keyboard, screen readers, zoom/reflow, forced colors, computed card contrast, real history/BFCache, native iPhone printing/PDF and QR scanning, clipboard permissions, actual GitHub Pages, remote CI and human usability have not been verified. Existing 17 contrast calculations are not all card state measurements. DOM simulations do not prove native details, focus/print/AT. Handout integration tested in separate existing real-code simulation; Phase 5 finder uses a handout API stub, not integrated native browser. Partial translation and oldest legacy finder dependency/handout limitation remain. No-JS still offers static map list and discovery, not full interactive cards. Current scoring broad/no eligibility guarantee. Existing one stale item and Omaha gap remain; no new resource data. Phase 6 must first attempt browser gates, then focus on printing/privacy/performance; no release or Florida expansion authorized.
