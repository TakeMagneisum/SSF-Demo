# Phase 1 factual baseline — 2026-11-24

## Scope and method

Inspected the attached `singlestepforward-site-main (2).zip` (401 ZIP entries; about 11.23 MB uncompressed), extracted a **separate** repository copy, enumerated HTML/CSS/JS/source/review/geography artifacts, and ran available validators in a separate test copy before modifying the demo. All counts below are from source or local tooling; **no fresh provider verification was performed**. The original archive remains unchanged outside the demo output.

## Inventory and evidence

| Metric | Observed |
|---|---:|
| Original archive entries (including directories) | 401 |
| HTML pages/files | 66 |
| JavaScript `.js` files | 37 (plus 1 `.cjs` validator) |
| CSS files | 7 prior to demo-only CSS |
| CSV files | 151 total (including 106 registered review CSVs + 41 pending, other research files) |
| `review-sheets/locations.json` guide editions | **106** |
| Edition-listing placements from `validate-data.js` | **3,487** |
| Country allocations | US 60, GB 33, NZ 6, PR 4, CL 3 |
| Manifest jurisdictions | city 46, municipality 37, county 14, metro 9 |
| US state map paths | 51 |
| Georgia counties | 159 |
| Greater London borough routes | 33 |
| Discovery topics | 13 |
| Directory categories | 16 |
| Separate pending research locations | 41 |
| Pending research ledger resource placements | 1,181 |
| Registered evidence-source pages for research ledger | 250 |
| Research coverage category cells | 656 |
| Phase 1 SHA-256 protected data/brand files | **201** |

The README text describes **105** local guides, while the live manifest and validator show **106**. Treat the manifest+runtime validator as the accurate count for this archive; update historical README language separately rather than blindly changing data.

## Baseline validators actually run, before demo edits

| Command | Result | Interpretation |
|---|---|---|
| `node scripts/validate-data.js` | PASS: 106 / 3,487; urgent language cases, review CSVs, data routes | Offline structural integrity only |
| `node scripts/validate-explore-map.cjs` | PASS: 106 list routes; 33 London; 51 US states; 159 GA counties; Back/reset, geometry failure | Node simulated DOM, not real browser interaction |
| `python validate-guides.py` | PASS: 41 / 1,181 / 250 / 656 | Separate pending research ledger; hardcoded November 18 date in report |
| `node scripts/audit-resources.js --offline` | PASS: **0 reported broken, 1 stale, 0 blocked, 0 warnings** | Offline metadata triage; no live HTTP requests or confirmation |
| `node scripts/import-city-review-sheets.js` | PASS: 106 locations; 55 generated editions | Generated `assets/city-resources.js` byte-for-byte identical to input archive |

Tests were run with Node.js 22.16.0 and Python 3.13.5 in the working environment. The offline audit overwrote output reports **only in the scratch validation copy**; the demo retains the original report files, which may be stale and must not be mistaken for a fresh online audit.

## Link and structure audit

- Original HTML scan found **206 root-relative HTML URLs** that would resolve to a GitHub Pages **domain root**, not a project subpath.
- It also found **109 genuine missing relative local asset/page references** in five outdated/copied HTML variants (`assets/index.html`, `assets/find-help.html`, `assets/discover.html`, `assets/404.html`, `find-help/find-help.html`). Another initial scan overcounted to 115 because it mistakenly treated same-page anchors as missing files; corrected classification is authoritative.
- Demo normalization rewrote root-relative `href/src/action` references and repaired unambiguously root-relative copied asset paths. `python scripts/validate-demo-links.py` now passes **66 HTML files / 946 resolved local references / 0 missing** by static existence checks. This does not validate intended navigation semantics in all duplicated pages.
- The source workflow was at `github/workflows/resource-audit.yml`, not `.github/workflows`; therefore it would not run as a normal GitHub Actions workflow from that path. Demo runs deterministic CI instead and preserves the old scheduled workflow for review.
- Root `CNAME` and `assets/CNAME` both named `singlestepforward.com`; these must not be deployed as active CNAME records in the independent demo. Root `robots.txt` and `sitemap.xml` were configured for production indexing.

## Performance observations (not a real network measurement)

On repository bytes, scripts referenced by **homepage** total approximately **3,305 KiB raw**, with local gzip-compression estimate **~402 KiB** (rough illustration, *not actual transferred bytes*). Homepage includes `assets/city-resources.js` (~2,085 KiB raw) and `assets/expanded-editions.js` (~880 KiB raw). `find-help.html` scripts ~3,356 KiB raw; `explore-map.html` scripts ~3,423 KiB raw; `discover.html` scripts ~81 KiB raw. Compression, browser cache, rendering costs, CPU, network timing, and service-worker behavior were **not** measured. Homepage/overview should load only coverage metadata in Phase 2/3.

## Architectural / safety concerns

1. A broad, global JS data registry is loaded before simple map or homepage operations; coupling impedes scaling and lower-end mobile performance.
2. Different geographic hierarchies are implemented via country-specific map logic and crosswalks; need stable international place/guide/coverage contracts.
3. A ZIP lookup is an **approximation of postal area**, not an authority on county residency or eligibility. The existing README documents ZIP mapping limits; retain and strengthen them.
4. Print implementation uses a browser print dialog with PDF fallback, but previously reported iPhone Chrome/Safari print issues remain **not verified fixed**.
5. The local storage of selected guide/country and session storage of print selections can disclose sensitive interests on shared devices; clearing UX is not yet unified.
6. Source-check dates can be mistaken for current service availability. Separate source validation, local reviewer acceptance, and real-time availability.
7. No full screen-reader audit, device-browser QA, measured traffic/latency, emergency-number cross-jurisdiction audit, security penetration test, or human usability acceptance was performed.
8. `OPEN-GUIDES.html` and `research-ledger.json` concern 41 research guides, not an additional 41 approved public editions.

## Demo-only changes and remaining risks

HTML noindex metadata, demo banner, relative link normalization, removal of production canonical/OG URL metadata, CNAME isolation, nonindexing robots, original sitemap archived in `reference/production-metadata/`, immutable data hashes and deterministic CI have been added. No runtime resources or brand art were edited. **Demo safety banners and disallow are not access restrictions.** All future work should verify real devices, route semantics, and any changed privacy claims before public sharing.

## Subsequent demo verification

See `TEST_RESULTS.md`: final demo offline validator suite passes, a local HTTP server returned 200 for six representative project-subpath requests, and Chromium headless visual/DOM testing was inconclusive due to a timeout. **These HTTP successes do not verify JavaScript operation, mobile print, or GitHub-hosted behavior.**

## Phase 2 follow-up

Fresh Phase 1 ZIP rerun passed all six original validators (see `PHASE2_TEST_RESULTS.md` and `qa/phase2-initial.txt`). The full-registry coupling on homepage and map is now removed; directory data remains unchanged. Added independent per-record integrity, exact coverage and static-list generation and picker tests. Actual browser access remained blocked; no new content review. Historical Phase 1 evidence above is retained as a snapshot.

## Phase 3 follow-up

The supplied Phase 2 archive passed fresh baseline and record parity. Phase 3 retains both original snapshots. See `PHASE3_TEST_RESULTS.md` for before/after bytes, actual command logs and remaining verification gates; no actual hosted or interactive browser tests succeeded in this environment.
