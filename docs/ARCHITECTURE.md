# Architecture — observed state and target

## Observed Phase 1 architecture

Static GitHub Pages site, no build step, root HTML routes. `index.html`, `discover.html`, `find-help.html`, `explore-map.html`, `before-you-call.html`, `before-you-travel.html`, `learn.html`, and folder-based learning/legal/support pages provide entry points. `assets/styles.css` holds global visual styles; `assets/*.js` are classic browser scripts with globals.

`assets/resources.js` and regional modules define early editions. `assets/expanded-editions.js` and generated `assets/city-resources.js` provide additional editions; `review-sheets/locations.json` is the **106-edition manifest**. `review-sheets/*-review.csv` maintain human source review, and `scripts/import-city-review-sheets.js` is the authorized generated-edition importer. Do not edit generated `city-resources.js` in isolation. `assets/area.js` manages guide and country chooser; `assets/guide.js` manages directory search/filters, `assets/urgent.js` is deterministic urgent-language routing, and `assets/discovery*.js` governs US ZIP-based universal discovery.

`assets/explore-map.js` drives country and state/Georgia/London maps, with geometry in `assets/maps/*.js`. Details: `assets/maps/*-SOURCE.md`. Map scripts have both initial geometry and conditional geometry loading. The tested route model uses query parameters and browser history. `assets/handout.js`, `assets/sheet-pdf.js`, `assets/vendor/qr.js` and bundled pdf-lib/font components implement selected handouts/PDF. `assets/calm.js`, `assets/i18n.js`, and global CSS provide existing Calm View and English/Spanish controls.

**Important separation:** `location-plan.json`, `research-ledger.json`, `source-registry.json`, `research-checklist.csv`, and `review-sheets/pending/` form an additional **41-location research workflow**, marked `source_checked_local_review_pending`; they are not an extra 41 publishable guides. See `DATA_DICTIONARY.md`.

## Architectural problems (confirmed or inspection-derived)

1. Heavy classic-script/global coupling: homepage loads about **3.3 MiB raw JS** (indicative local gzip estimate ~402 KiB; not a network measurement), including ~2.09 MiB `city-resources.js`. Map page also loads all guide data even for world-only view. Separate coverage index is preferable.
2. Source ZIP had `CNAME` at root and inside `assets`, root-relative links, a public sitemap/robots policy, and production-domain canonical metadata incompatible with an independent project-subpath demo. Phase 1 includes reversible demo-specific normalization.
3. Extra HTML copies inside `assets/` and `find-help/` existed with broken asset paths, increasing route maintenance complexity; they have been repaired **where direct references could be mapped unambiguously**, but are not established as supported entry points.
4. Research artifacts, generated runtime JS, and reviewer worksheets coexist; accidental regeneration/editing could silently change stable IDs or sources.
5. Workflow in source archive was `github/workflows/resource-audit.yml` (not GitHub’s `.github/workflows`); a network-free demo CI workflow now lives at `.github/workflows/phase1-ci.yml`. The original scheduled source audit is preserved under `reference/production-metadata/` but disabled for demo.
6. Geography layer mixes national/territorial/state/county-specific logic; international expansion needs a stable region data contract.

## Proposed target — static-first

```text
content/          # authored educational pages and plain-language strings
geo/              # country index, administrative hierarchy, aliases, coverage crosswalks
geo/boundaries/   # licensed, versioned simplified SVG geometry by region
data/guides/      # canonical edition metadata and per-guide resources
src/components/   # shared accessible header, map, details panel, resource card, handout
src/search/       # deterministic tokenization, synonyms, safe urgent intents
src/styles/       # brand tokens, contrast variants, density, typography, print
scripts/          # importer, safe build, ID/URL/data validation, link tests
public/           # generated static HTML/JSON/JS/CSS for GitHub Pages
```

This is a proposal, **not** the current tree; Phase 2 may use a simpler equivalent. A small build-time generation step is acceptable if its output is deterministic and can be deployed without a server. Do not adopt a large SPA/framework unless a measured necessity justifies complexity.

## Proposed data contracts

- `Place`: `{id, countryCode, adminLevel, localName, aliases[], parentId, stableAuthorityId?, postalCodeType?, geometryKey?}`; IDs stable, diacritics preserved.
- `Coverage`: `{placeId, guideIds[], coverageKind, status, provenance?, reviewedAt?}`; reviewed guide presence **not** service eligibility.
- `Guide`: `{id, title, locationIds[], reviewedOn, categories[], resourceBundleUrl, published, sourcePolicy}`.
- `Resource`: `{id, name, categories[], summary, scope, officialUrl?, phone?, nextStep?, limitations?, sourceRefs[], sourceCheckedOn?}`.
- Postal association: `{code, postalSystem, placeIds[], source, checkedOn, confidence, caveats}`. Distinguish USPS ZIP from Census ZCTA; preserve multiple jurisdiction associations.
- Geometry: compressed/simplified independent assets, attribution/license/version mandatory. No runtime requirement to load all polygons or resource bundles.

## Routing and path contract

Legacy links that must continue working: `find-help.html?area=<id>`, `discover.html?zip=<5digits>` where currently supported, `explore-map.html?country=US&state=GA&county=<GEOID>`, country and region map routes, city shortcuts, learning/legal/support routes. Inspect actual query names before changing any (the above represent observed/current contract candidates, not a claim every combination is valid). Use relative URLs generated from a configurable `basePath`. Never concatenate leading `/` for project-site links. Preserve `history.pushState` + `popstate`, direct refresh, and safe 404 recovery. Explicit public share links should not include sensitive situation descriptions.

## Migration stages / rollback

1. Freeze/record the Phase 1 201-file hash baseline and run both existing validator families.
2. Introduce stable metadata/coverage index **in parallel**, without altering the published registry; compare all guide IDs, categories, row counts, and links.
3. Replace loading for one noncritical page, then the world map, then regional maps, with request/failure and keyboard tests before broader rollout.
4. Build shared reusable components behind route-level parity tests, with old HTML preserved until URLs are proven equivalent.
5. Only then remove duplicate files; retain a redirect manifest, change log, provenance and rollback point.
6. Production cutover is a separate authorized step after user acceptance; never deploy demo `robots.txt`, noindex, demo banner, or absence of production `CNAME` into production accidentally.

Static publishing: commit repository content to a separate new repository; configure Pages branch/root. Demo is publicly accessible even if `noindex` is present. Use a repository URL such as `https://<account>.github.io/<demo-repo>/` without assuming the account or repo name in code. No current external source availability or real browser performance was proven by Phase 1 baseline validators.

## Phase 2 implemented architecture (supersedes proposed tree where different)

See `PHASE2_ADR.md` for decision alternatives, contract and rollback. Keep root static layout and the existing JS lifecycle. Home and map now use `assets/coverage-index.js`; finder alone among these primary routes uses the ordered complete data scripts. Discovery remains self-contained with `discovery-data.js`. Data build is `node scripts/phase2-data.cjs --generate`; validation is the same command without arguments. `reference/place-catalog.json` is for engineering, not a runtime payload. `baseline/record-integrity.json` complements the Phase 1 byte digest. No build step on GitHub Pages, no new mandatory dependency. Existing regional geometry still lazy loads on demand. Legacy duplicates retained pending a tested redirect manifest. Details and measured bytes: `PHASE2_TEST_RESULTS.md`.

## Phase 3 implemented navigation layer

See `PHASE3_ADR.md`. Static navigation is maintained by `scripts/phase3-nav.py`; `assets/phase3.css` is the shared extension. `phase3-home.js` uses `coverage-index.js`, original world geometry and generated `phase3-region-search.js`. `phase3-map-ui.js` centralizes selection, action and preview behavior for home/world/state/county shapes; `explore-map.js` retains original route and lazy boundary contracts, including London/Caribbean. `phase3-postal.js` is an existing guide-suggestion projection. `404.html` is standalone and computes recovery destinations at runtime for project sites. Directory resource loading and handout implementation remain intact. No new framework, dependencies or full-registry import on home/map.

## Phase 4 display architecture

`assets/phase4-preferences.js` applies allow-listed local display state early, controls native disclosure, system media queries, scoped reset and Calm event. `assets/phase4.css` provides screen appearance/reflow with shared existing tokens/Calm palette. `scripts/phase4-template.py` generates/checks markup for 24 styled pages, including inline root 404 without external path dependency. No runtime fetching; home/map stay metadata-only. Handout review shortcuts reuse original preview/QR and storage, restoring origin focus. Legacy redirect-only pages unchanged. See PHASE4_ADR.md and PHASE4_TEST_RESULTS.md.

## Phase 5 discovery boundary

`guide.js` consumes the existing selected guide and handout API, `phase5-vocabulary.js` supplies presentation-only intent aliases, `phase5.css` uses Phase 4 semantic tokens, `phase5-prep.js` copies only public static text by explicit action. Urgent classifier and routing are unchanged. OR topic filters, list layout, expansion and query exist only in the current document; public legacy `?need=` is read, removed on explicit new filter/search. No new records or route contracts. Complete registry remains on finder for handouts; home/map stay lightweight. See `PHASE5_ADR.md`.

## Phase 6

Keep full directory registry for original cross-guide selection/urgent contract; home/map remain metadata-only. Direct PDF uses local PDFLib/font template only on demand, independent parallel promises and script-relative asset resolution; revision guards and object URL cleanup; native print alternative and local nonpersisted large print. QR local and optional preview fallback. `phase6-privacy.js` only clears two existing location keys on deliberate click. See PHASE6_ADR.md. No new runtime framework or network service.

## Phase 7

Static canonical finder alias generator avoids runtime redirects/fetches and drift. Existing `guide.js` requires urgency classifier before enabling situation matching. Topic browsing, public route semantics, full registry dependency on finder and optional PDF loading retained. No backend, new data or storage. See PHASE7_ADR for rollback and open release gate.
