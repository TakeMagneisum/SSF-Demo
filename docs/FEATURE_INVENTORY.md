# Protected functionality inventory — source-observed baseline

Evidence levels: **Source-observed** = relevant markup/code present; **Validated** = existing automated checks passed; **Not verified** = interactive real-browser or user testing not performed. An existing defect is not an intentionally protected behavior.

| Existing capability | Source / known route | Baseline evidence | Migration contract |
|---|---|---|---|
| Homepage, purpose, ZIP CTA, category education | `index.html`, `assets/site.js`, `assets/discovery.js` | Source-observed | Retain clear mission and direct non-map starting point; improve length |
| Brand/Dawn, topic artwork, icons | `assets/brand-mark.svg`, `assets/dawn-*.{png,webp}`, `assets/icon-*.webp`, `assets/styles.css` | Source-observed; byte hashes preserved | Preserve identity and attribution |
| World map and Caribbean overview | `explore-map.html`, `assets/explore-map.js`, `assets/maps/world-overview.js`, `caribbean-overview.js` | Map validator passed | Click/keyboard/list/back/fallback; no root-only URL assumption |
| US 51 state routes | `assets/maps/us-state-boundaries.js` | Map validator passed | Deep links, state list and coverage, keyboard and history |
| Georgia 159 county map / GEOID | `assets/maps/georgia-county-*.js`; `assets/explore-map.js` | Map validator passed | Preserve county URLs, crosswalk, multi-guide behavior, small area alternative |
| London 33 boroughs | `assets/maps/london-boundaries.js` | Map validator passed | 33 region routes/accessible selection |
| Country/territory selectors / reviewed guides | `assets/area.js`; `review-sheets/locations.json`; `assets/*resources.js`, `assets/expanded-editions.js` | 106 editions / 3,487 listings validator passed | Stable edition IDs, direct `?area=` links, explicit open action, no silent guide deletion |
| Universal US ZIP discovery | `discover.html`, `assets/discovery-data.js`, `assets/discovery.js` | 13 topics validated; query behavior source-observed | ZIP caveats, prepared search, when no reviewed guide; no worldwide ZIP assumption |
| Category browser + everyday-language filter | `find-help.html`, `assets/guide.js`, `assets/urgent.js` | 16 categories, 140+ urgent-language cases validated | Deterministic, recoverable, crisis-first matching |
| Area-specific emergency/care guidance | `find-help.html`, `assets/area.js`, `assets/urgent.js` | Some urgent routing tested | Jurisdiction-specific verified references, warnings remain visible |
| Local directory / listing action | `find-help.html`, resource modules | Source-observed, data validation passed | Scope, name, contact, URL, next step, source date, links |
| Before You Call or Visit | `before-you-call.html` | Route source-observed | Make available within guide/listings and print workflow |
| Before You Travel | `before-you-travel.html` | Route source-observed | Trip planning / confirmation and return-journey prompts |
| Selected resource handouts and print | `assets/handout.js`, `assets/handout.css`, `assets/sheet-pdf.js`, `assets/sheet-pdf.css`, `assets/vendor` | Source-observed; no real mobile print verification | Preserve selection, PDF fallback, QR, large print, browser print |
| Calm View | `assets/calm.js`, `assets/styles.css` | Existing validator checks presence | Preserve non-stimulating view without hiding emergency colors |
| English/Spanish interface controls | `assets/i18n.js` | Existing validator checks key UI | Preserve, test translated labels and avoid automatic provider translation |
| Accessibility foundations | Skip links, landmarks, semantic elements, SVG labels, CSS focus | Source-observed; partial test coverage | WCAG 2.2 AA target; add manual/AT testing |
| Educational center | `learn.html`, `learn/index.html`, `learn/*/index.html` | Source-observed | Keep all instructional routes and links |
| Website support/correction | `support/index.html`, footer `mailto:` paths | Source-observed | Keep accessible correction channel; avoid sensitive submission |
| Support/donation | `support-the-project/index.html` | Source-observed | Preserve clear voluntary separation from assistance search |
| Privacy/terms and error recovery | `privacy-policy/index.html`, `terms-of-service/index.html`, `404.html` | Source-observed | Consistent privacy claims, cross-page navigation, subpath-safe 404 |
| Source review data and provenance | `review-sheets/`, `source-registry.json`, `research-ledger.json`, `research-checklist.csv` | 41-guide ledger validator passed | Keep source metadata; research-pending != published/operationally validated |
| Existing audits and imports | `scripts/validate-data.js`, `scripts/validate-explore-map.cjs`, `validate-guides.py`, `scripts/audit-resources.js`, importer | All offline checks passed at audit time | Continue checks; add record/ID comparisons and human reviews |
| Publication, share and browser history | HTML links, `assets/explore-map.js`, `assets/area.js` | Map simulator tests Back and routes | Support GitHub Pages root and project subpath; browser-verify |

## Current supported geography (manifest, not service availability)

`review-sheets/locations.json` has **106** guide entries: **60 US, 33 UK (Greater London), 6 New Zealand, 4 Puerto Rico, 3 Chile**. Manifest jurisdiction types: **46 city, 37 municipality, 14 county, 9 metro**. These labels reflect existing metadata rather than a universal international administrative model. 106 reviewer CSVs exist for published-edition workflow; an additional 41 **pending** review CSVs serve a different research workstream.

## Important caveats

Existing directory validator discloses an **Omaha pet listing gap**. `OPEN-GUIDES.html` is a separate 41-guide research presentation with its own static integrity validator; it should **not** be merged blindly into the 106 publicly registered guide count. Several historical HTML copies were present inside `assets/` and `find-help/` and may not represent supported current routes. See `BASELINE_REPORT.md` for detailed findings and `ACCEPTANCE_TESTS.md` for unverified browser behavior.

## Phase 2 changes to implementation locations

Home guide chooser and map now consume `assets/coverage-index.js`, generated from the unchanged canonical full registry. `area.js` uses separate metadata/full-record branches. All 106 picker routes and map routes validated by simulated DOM, static fallback contains exact guide IDs. Failure leaves complete links and truthful load status, not an unsupported coverage claim. Full finder, urgent classifier, handout, PDF, QR, Calm View, language and discovery remain source-identical except shared CSS/area script and cache references. Existing static 404 home self-link corrected. Original source and all 201 protected byte hashes retained; 41 draft research records remain separate. Browser, hosted 404 and native print verification open.

## Phase 3 update

Implemented shared static navigation and demo homepage world map, geographic place search, selection/detail/continue contract, guide-level ZIP suggestion display for Georgia, map failure alternatives, and standalone 404 recovery. Existing topic, preparation, learning, legal/support, print/QR, directory, language/Calm and correction paths retained; legacy duplicates not deleted. No new appearance modes or card redesign. Browser/AT/print acceptance remains open; see `PHASE3_TEST_RESULTS.md`.

## Phase 4 additions

- Appearance/system and reading preferences, independent Calm View, native accessibility disclosure: `assets/phase4-preferences.js`, `assets/phase4.css`, `scripts/phase4-template.py` (24 styled routes including root 404); local scope/reset/blocked storage and state simulated; browser/AT pending.
- Narrow/large-text reflow, unbounded map lists, focus/forced-colors, partial new Spanish labels: `phase4.css`, `i18n.js`, map UI; simulated and static validation only.
- Selected-card print review and inline tray recovery: `handout.js`, finder markup and phase4.css; real original resource and QR generator exercised in DOM simulation; native print/scan not verified.
- No protected resource/geo/urgent content updates or production deployment. Existing route inventory unchanged.

## Phase 5 changes

Finder: native details, list layout, OR filters, removal, result counts, deterministic aliases, explicit zero-match fallback, urgent-before-relevance, neutral invalid guide, no named situation field. Prep: original standalone pages and handout script with deliberate copy; no personal inputs/storage. All 3 finder paths retained; oldest asset duplicate lacks current handout dependencies, guard prevents renderer crash but parity not claimed. All Phase 1–4 gates pass; actual browser/AT/print pending.

## Phase 6

Print/handout: `assets/handout.js`, `assets/sheet-pdf.js`, `assets/sheet-pdf.css`, `assets/phase5.css` now implement optional local large print, lazy PDF recovery, script-relative paths, original QR and cross-guide selection. Privacy location clear `assets/phase6-privacy.js`; suggestion native GET guard `assets/site.js` and two homepage forms. Actual generated PDF output validated; native print, mobile/AT and legacy oldest finder incomplete, see Phase 6 report. No removed public routes.

## Phase 7 update

`find-help.html` is the full canonical finder; `assets/find-help.html` and `find-help/find-help.html` retain their URLs, generated full equivalent documents by `scripts/phase7-legacy.py`. No redirect. All guide IDs, local link targets, handout/prep dependencies and scoped emergency markup now equivalent at source/HTTP level. Integrated browser acceptance remains open. See PHASE7_ADR.
