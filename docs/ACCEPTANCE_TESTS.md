# Acceptance tests and evidence requirements

## Automated offline commands (Phase 1 executable)

```sh
python scripts/phase1-data-baseline.py
node scripts/validate-data.js
node scripts/validate-explore-map.cjs
python validate-guides.py
python scripts/validate-demo-links.py
node scripts/audit-resources.js --offline
```

`audit-resources.js --offline` **rewrites** `output/resource-audit.*`; run in a scratch copy during reproducibility checks and do not confuse old live check reports with new data checks. `validate-guides.py` may rewrite `validation-report.json`. `scripts/import-city-review-sheets.js` generates the runtime data; use it only when intentionally validating/generating it, ideally in scratch, and check output byte identity. CI (`.github/workflows/phase1-ci.yml`) runs deterministic offline checks; it does not browse or verify third-party providers.

## User-journey manual acceptance matrix

| Scenario | Steps / expected outcome | Phase 1 status |
|---|---|---|
| World → country → US state → Georgia county → guide | Open map, choose each; see selection, source/coverage caveat, valid link; Back/Forward, direct refresh and reset | Automated map simulator passed; real browser pending |
| No map | Start from homepage search/guide picker or category; reach same supported guide | Source-observed; user verification pending |
| No reviewed guide | Choose uncovered country/region; explain absence of reviewed guide, offer alternative discovery, no false “no help exists” | Map simulator partial; manual pending |
| Ordinary question | Search “cannot afford groceries,” “electricity will be disconnected,” “need a ride,” “dental costs,” or help for someone else; relevant deterministic suggestions, critical route first when appropriate | Existing urgent-language checks; manual pending |
| Search recovery | Invalid/zero-result query, clear filters one-by-one, reset and recover without lost state | Partial source observation; manual pending |
| Critical safety | Different jurisdictions and wrong-language assumptions; never give unverified local number | Human content review pending |
| Card expand/collapse | Tab, Space/Enter, screen reader, focus state, Expand all, Collapse all; crucial contact/warnings always visible | Future revised cards; planned |
| Call/visit & travel | Find preparation tools from resource card, guide and handout; copy questions and contact; clear sensitive input | Current standalone pages; integration planned |
| Selected handout | Select resources, leave/return, print full/selected, download PDF, QR, source date, large print; no unwanted sensitive text | Existing code present; iOS browser verification pending |
| Appearance/accessibility | Light/dark/system; font/spacing/density/Calm View/reduced motion/high contrast; reset; 200% text | Calm View current; other settings planned |
| Keyboard and AT | All routes, nav, map, search, handout, dialog states; screen-reader labels & changes | Partial map scripted test; human AT pending |
| Phone and zoom | 320 CSS px, 390 CSS px, portrait/landscape, 200% text, 400% zoom where applicable; no obscured content | Not performed |
| Poor network | Throttled connection, missing boundary JS, disabled images, JS disabled; core text routes remain | Map simulator tests missing geometry; real browser pending |
| Sensitive preference clearing | Confirm location/language/handout selections and explicit clear actions; shared-device recovery | Current storage inventory; proposed clearing UI pending |
| Project Pages subpath | Host under `/<repo>/` and open deep links, 404, images, CSS, print assets, direct refresh | Static link scan passed; real hosted test pending |
| Privacy and external requests | Inspect DevTools requests, cookies, local/session storage, URL query parameters and outbound prepared search destinations | Code inventory only; real network observation pending |

## Objective release gates

- No loss of original edition IDs, resource entries, sources or provenance without explicitly logged editorial approval.
- Local/static checks green, no unintended project-root paths, no production CNAME, all source/brand checksums preserved for pure UI refactors.
- Critical user journeys verified on desktop/mobile, with keyboard and screen reader; not merely screenshots.
- Browser-level print (iOS Safari/Chrome, Android Chrome, desktop Edge/Chrome/Firefox) tested with fallback as necessary.
- Content claims/source freshness human-reviewed; emergency guidance checked by locale; legal/privacy text reviewed for changed data flows.
- Production migration requires separate human acceptance and rollback drill, never automatic promotion from demo.

## Status definitions

**Planned** requirements, **Implemented** code, **Validated** automated pass, **Verified** actual environment exercise, **Accepted** human usefulness signoff. Every test report must name scope, tool/runtime/browser, date, result, defect, and conditions not tested. Automated accessibility tools cannot independently confer WCAG AA compliance.

## Phase 2 executable gates

```sh
node scripts/phase2-data.cjs
node scripts/phase2-picker.cjs
python scripts/phase2-http-smoke.py
python scripts/validate-demo-links.py --strict-legacy
```

The record comparison checks ordered guide/listing identities and full serializable values, routing and source dates; generated index and fallback list must be byte-current. Homepage and map must not reference any of the seven complete resource scripts; finder must retain them in dependency order. Failed coverage must leave an unfiltered 106-guide list and explicit status, not false uncovered status. Optional `python scripts/phase2-browser-smoke.py` needs locally installed Python Playwright and Chromium (`CHROMIUM_PATH` override); it attempts both desktop and phone-sized viewport, history/refresh, guide picker, urgent query, handout, ZIP, Calm View, language and missing-index/no-JS. Not part of mandatory offline CI. The execution environment blocked browser HTTP navigation; run on your own machine before signoff. Actual native print, mobile Safari/Chrome, AT, zoom, hosted project and arbitrary missing URL behavior need additional testing. See `PHASE2_TEST_RESULTS.md` for evidence and limitations.

## Phase 3 gates

```sh
python scripts/phase3-nav.py
node scripts/phase3-postal.cjs
node scripts/phase3-region-search.cjs
node scripts/phase3-interactions.cjs
python scripts/phase3-http-smoke.py
```

Run these in addition to all Phase 1/2 gates. Verify all 106 finder emergency destinations and explicit invalid-guide failure; no heavy data on home/map; exact routes and existing county/borough targets; pointer/focus/select/continue and clear/zoom; unreviewed region versus missing geometry; explicit guide-level ZIP scope; 404 recovery and no sensitive-path email. Local HTTP and DOM simulations do not establish native browser behavior. Real desktop/mobile/keyboard/AT, 320 CSS px, direct refresh/history, hosted nested 404, no-JS in browser and print remain release gates. See `PHASE3_TEST_RESULTS.md`.

## Phase 4 executable gates

```sh
python scripts/phase4-template.py
node scripts/phase4-preferences.cjs
node scripts/phase4-handout.cjs
python scripts/phase4-contrast.py
```

Run all earlier checks and syntax checks of modified JS. Test system/light/dark, forced colors and OS contrast/motion, 125%/150% text, relaxed spacing, compact density, invalid/blocked storage, isolated reset preserving guide/language/Calm/handout, Back/Forward persisted state, keyboard Escape/Close and menu focus, map labels/ZIP caveats, QR and original selected preview. Optional `python scripts/phase4-browser-smoke.py` requires authorized local Playwright/Chromium; blocked at initial local navigation in this environment. Manual real 320/390, landscape, 200% text, browser zoom/AT/contrast, forced-colors, native iOS/Android print, QR, actual hosted demo and human acceptance still required. Static color checks cover 17 selected opaque pairs, not computed page styles. See PHASE4_TEST_RESULTS.md.

## Phase 5 gates

Run `python scripts/phase5-run.py final` (30 commands). Includes real-source finder DOM simulation (424 urgent cases across 106 guides), visible original fields, expansion and filter recovery, handout API state, aliases, unknown route, unnamed form, clipboard failure and ten project-subpath HTTP paths. Phase 4 real handout simulation also remains required. Browser tests remain open; verify actual native details, keyboard focus, list layout/reflow 320/390, forced colors, AT, direct refresh/history, native print/PDF/QR and clipboard in authorized environment. Confirm no query leakage when JS disabled or navigation fails; no full WCAG or release claim.

## Phase 6 acceptance additions

Run `python scripts/phase6-run.py` (30 prior + 7 new), `python scripts/phase6-http-smoke.py`, and optional `node scripts/phase6-pdf.cjs <scratch>` / `python scripts/phase6-render-check.py <scratch>`. Independent browser tasks: selected pairs/order across guides, Back/Forward and clear isolation, QR fallback, nested asset retry, empty/repeat/large/credit PDF, native iPhone Share/Print and long directory URLs, black-on-white urgent guidance, physical QR scan, private sentinel absent from URL/storage/clipboard/outbound/PDF, suggestion no-JS safety, location clear leaves display/handout. Distinguish source/simulations from actual browser, AT, native print and human results. No release signoff until open gates resolved.

## Phase 7 release gate (open)

Run `python scripts/phase7-run.py` for deterministic regression checks, and separately `node scripts/phase7-urgent-review.cjs` for safety probes (current exit 2, **failed**). Use `docs/PHASE7_EXTERNAL_QA.md` for actual devices, browser, privacy, printing, AT and hosting; `docs/PHASE8_PROTOCOL.md` for controlled human usability. Legacy finder parity and 318 exact local HTTP query responses are not runtime browser verification. Active urgent print override is a source-level correction, native preview must confirm. No release until open safety issue resolved through explicit approved review and actual acceptance gates pass.
