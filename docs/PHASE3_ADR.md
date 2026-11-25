# ADR — Phase 3 shared navigation and geography

Status: implemented, validated by offline gates; real browser and human acceptance pending. Only supplied Phase 2 ZIP was used as code/data input.

## Decisions

- Static shared navigation regenerated/checkable by `scripts/phase3-nav.py` on 18 primary pages. Ordinary HTML links survive no JS; existing Calm View/menu/language scripts remain. Do not introduce template fetches, SPA router or a build dependency. Shared `assets/phase3.css` layers on Phase 2 tokens; preserve legacy routes, including duplicate historical files, without asserting redirect equivalence.
- Homepage puts orientation and direct guide/ZIP/topic entry ahead of the world map. The homepage loads original world geometry, coverage metadata and derived existing state/Georgia county names; no full resource registry. `phase3-home.js` searches known names and guide labels with diacritic folding; capped results explain narrowing. Static guide list link remains usable without JS. No new external data or geolocation.
- `phase3-map-ui.js` shared by home and overview/state/county shapes: pointer/focus preview, click/Enter/Space selects, explicit action continues, selected state is indicated by stroke and ARIA state, clear/zoom/reset and direct guide links. Existing London shape/list routing is preserved; added focus preview, selection details and controls. Region lists remain direct links, independent of geometry precision. No new London borough query contract. Back/Forward derives from existing URL routes; transient selection is not a URL or storage change until continue.
- `phase3-postal.cjs` projects existing `SSF_REVIEWED_ZIP_GROUPS` only. 63 guide groups; show expandable guide-level suggestions, not county ZIP lists. Atlanta city overlap caveat retained; no county-level postal claim. `phase3-region-search.cjs` derives existing 51 state/159 Georgia county names. Do not alter map source or baselines. Geographic attribution remains as in Phase 2.
- Unknown/global emergency orientation is neutral. US ZIP discovery explicitly scopes prepared US links; finder only activates numbers for valid loaded guide (existing explicit emergency metadata or existing US/PR fallback), invalid explicit IDs fail safely. Existing source/routing records unchanged. Correctness of provider numbers is not re-verified. Explicitly selected guide is not user location. Global/static copy not jurisdiction-inferred. 
- Standalone 404 has inline style/script and embedded original brand/Dawn; project path derived from first path segment, not hardcoded repo. No failed pathname/query in feedback body. Direct root `/404.html` and a project subpath simulated; actual GitHub Pages behavior and root-hosted *nested* errors are not proven. Without JS arbitrary nested path cannot be inferred by static HTML; instructions explain returning to repository root. Retains Calm View using existing preference key.
- Existing feedback note workflow remains user-initiated; guide report no longer includes full URL. No new storage keys, analytics or third-party requests introduced. No new modes or inert appearance toggles; appearance/accessibility controls are Phase 4.

## Alternatives rejected

Dynamic shared header fetch (failure/no-JS barrier), SPA routing (breaks established static routes), new map libraries or geocoding (unnecessary dependency and privacy risks), new county ZIP crosswalk (unapproved evidence), automatic selection navigation (touch discoverability and accidental activation). Map zoom is simple SVG viewBox zoom/reset; free pan, zoom-out step and complete keyboard/AT behavior require further review. Map list navigation remains the reliable alternative.

## Rollback

Restore the complete supplied Phase 2 ZIP if interaction regressions occur. For narrow rollback restore changed HTML and paired JS/CSS/validators together; remove new Phase 3 generated assets/scripts only after references are gone. Never regenerate immutable baselines to mask failures. Run strict links, protected data, record parity and map regression after rollback. No deployment performed. See `PHASE3_TEST_RESULTS.md` and `qa/phase3-*` for evidence.
