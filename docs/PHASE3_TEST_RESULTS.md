# Phase 3 verification record — 2026-11-24 (US Eastern)

**Status:** implemented and offline-validated. Real browser, hosted project, AT and human acceptance remain open. Code/data came exclusively from the supplied Phase 2 demo ZIP. Linux, Node 22.16.0, Python 3.13.5; browser attempt used the preexisting optional Playwright/Chromium script. No live provider checks or production deployment.

## Exact gate results

| Command | Result |
|---|---|
| `python scripts/phase1-data-baseline.py` | PASS — all 201 protected files unchanged |
| `node scripts/validate-data.js` | PASS — 106 guides, 3,487 listings, 16 categories, 13 discovery topics, 140+ urgent-language cases; existing Omaha gap disclosed |
| `node scripts/validate-explore-map.cjs` | PASS — 106 guide routes, 51 states, 159 Georgia counties, 33 London boroughs, regional/map fallback and history simulations, new selection/preview and ZIP caveats |
| `python validate-guides.py` | PASS — 41 pending drafts, 1,181 placements, 250 evidence sources; historical check date unchanged |
| `python scripts/validate-demo-links.py --strict-legacy` | PASS — 66 HTML files, 1,103 resolved references, zero primary or legacy link issues; noindex/no CNAME |
| `node scripts/phase2-data.cjs` | PASS — exact full record parity and generated coverage/catalog freshness, 444 catalog places |
| `node scripts/phase2-picker.cjs` | PASS — 106 picker destinations, neutral/failure/stored-choice simulations |
| `python scripts/phase2-http-smoke.py` | PASS — 16 routes/assets served twice under local project subpath |
| `python scripts/phase3-nav.py` | PASS — shared navigation on 18 primary pages |
| `node scripts/phase3-postal.cjs` | PASS — exact existing guide ZIP projection, 63 groups |
| `node scripts/phase3-region-search.cjs` | PASS — exact existing 51 state and 159 county name projection |
| `node scripts/phase3-interactions.cjs` | PASS — home map and search, focus/pointer/click/keyboard events, selection/guide links, zoom/reset, uncovered and missing-data states, all 106 existing emergency destinations, invalid ID safety, static/no-JS links, menu Escape, Calm View, language and 404 simulations |
| `python scripts/phase3-http-smoke.py` | PASS — 11 routes/assets served twice; three nested missing paths return custom 404 body in local handler simulation |
| `node scripts/audit-resources.js --offline` | PASS initial and final scratch copies — 0 broken, 1 stale, 0 blocked, 0 warnings; not live URL checks |
| `python scripts/phase2-browser-smoke.py` | BLOCKED initial and final — Chromium starts but `Page.goto` fails with `net::ERR_BLOCKED_BY_ADMINISTRATOR` on localhost; no desktop or phone assertions completed |

Initial and final command outputs, incremental output, scratch audit output and browser error logs are preserved in `qa/phase3-*.txt`. Both original immutable baseline files are unchanged; no regenerated review records or source dates. Existing audit reports were not refreshed in main tree. CI extends deterministic offline gates; remote CI has not been executed.

## Reproducible before/after byte measurements

`python scripts/phase3-measure.py /path/to/phase2.zip` compares the exact supplied ZIP and final Phase 3 files. Counts include initial external JS references only (query versions stripped); gzip estimates sum separate streams with mtime=0. HTML reported separately. Does not measure latency, browser CPU, caching, CSS/images, inline scripts, lazy regional geometry or conditional PDF libraries.

| Page | Raw external JS, Phase 2 → 3 | Gzip estimate, Phase 2 → 3 | Raw HTML, Phase 2 → 3 |
|---|---:|---:|---:|
| Home | 86,737 → 222,263 | 24,881 → 72,659 | 38,724 → 41,690 |
| Explore map | 208,064 → 238,195 | 66,689 → 75,776 | 17,605 → 21,400 |
| Finder | 3,436,909 → 3,439,358 | 427,061 → 427,838 | 45,285 → 45,800 |
| Discovery | 82,995 → 84,638 | 25,207 → 25,624 | 12,753 → 13,083 |

Home intentionally gains ~135.5 KB raw JS for world geometry, interaction and region search; map gains ~30.1 KB raw for interaction and existing postal suggestions. Both still exclude full registry scripts. Compared with Phase 1, home initial JS remains ~93.4% smaller and map ~93.2% smaller by raw bytes. No speed or user-experience multiplier inferred. Exact CSV: `qa/phase3-payload.csv`.

## Open gates and limitations

- Actual desktop/mobile rendering, touch, browser SVG focus/AT announcements, 320 px/200% text/zoom, contrast, native browser history/refresh, no-JS browser and hosted project/404 are **not verified**. Local HTTP serving and simulated DOM/history do not establish these. Browser administrator policy blocked both attempts. No production deployment.
- Nested 404 recovery assumes one repository path segment for GitHub Pages project sites. Direct root 404 and nested project routes are simulated; root-hosted nested missing paths and no-JS project-path inference are not verified. No-JS instructions point users to repo root. No automatic attempted URL is included in feedback.
- Region names and guide presence are limited to existing datasets. County ZIP crosswalks, broader geography, verified operating status and current emergency-source review are not added. Existing guide-level ZIP associations are not county lists. No invented geography. One stale source and the documented Omaha category gap remain.
- Existing Spanish language and Calm controls pass state simulations; translation coverage of new dynamic map strings is incomplete, and whole-page Spanish/Calm visual behavior is unverified. Simple zoom/reset is implemented; free pan/step zoom-out not added. Phase 4 should address reflow/contrast, map control usability and translation gaps. Legacy duplicate routes are preserved, not consolidated.
- Existing handout/PDF/QR scripts and source records retained, but native printing, iPhone print issue and QR scanning remain unverified. All acceptance requiring human observation remains open. No WCAG certification, provider verification, or human approval claimed.

See `PHASE3_ADR.md` for decision boundaries and rollback; use `PHASE4_PROMPT.md` only after reviewing the remaining gates.
