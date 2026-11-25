# Change log

## 2026-11-24 — Phase 1 demonstration baseline

**Implemented (demo copy only):**

- Audited 401 original ZIP entries and documented observed directory, features, data, map routes, storage behavior, review provenance, performance estimates, and migration risks.
- Added root `AGENTS.md` and 12 permanent engineering/specification documents in `docs/`.
- Added `baseline/data-integrity.json`, with byte size + SHA-256 for **201** protected source-data, geographic and brand asset files; `scripts/phase1-data-baseline.py` verifies unchanged files, including additions and removals.
- Added `scripts/validate-demo-links.py` to check local HTML asset/link resolution and project-path-safe navigation. Added `scripts/prepare-demo-html.py` to make independently reproducible demo HTML normalization.
- Converted root-relative internal HTML links to project-path-safe relative links; repaired unambiguous broken relative references in copied legacy HTML pages.
- Added `noindex,nofollow,noarchive` to all 66 HTML files, demo notice to applicable primary pages, and `assets/demo.css`; removed production canonical/OG URL metadata from HTML pages where present.
- Removed active root and `assets/` CNAME; kept exact values as inactive text in `reference/production-metadata/`. Switched demo `robots.txt` to `Disallow: /`; archived original production `sitemap.xml` under `reference/production-metadata/`.
- Moved incorrectly located source workflow to `reference/production-metadata/resource-audit.yml` instead of enabling scheduled live HTTP audits on the demonstration repository. Added `.github/workflows/phase1-ci.yml` for offline push/PR/manual validation.
- No resource content or source-review/brand image was changed.

**Validated (local):** existing data, geo-map, 41-guide ledger, offline source audit and deterministic importer passed; new 201-file digest verification and demo HTML static link checker passed. Regenerated importer output matched original byte-for-byte. **Not yet verified/accepted:** hosted GitHub Pages subpath, independent browser/AT/mobile navigation, contrast, iOS print, real-provider availability.

**Known defects/technical debt:** globally loaded resource bundles; legacy duplicate HTML editions; original production README count 105 versus 106 in actual manifest; source audit 1 stale result; source workflow mislocated; sensitivity of persisted selected-guide history; WCAG and mobile print not yet independently checked. Source `github/gitkeep.txt` is a historical placeholder; the active demo workflow is in `.github/workflows/`.

**Change control:** Every future feature change must update this log with what was modified, tests actually run, affected public routes, data approvals, and rollback. Never “fix” a red data-integrity test by regenerating its baseline automatically.

**Follow-up QA:** The original validator depended on root `sitemap.xml` and production canonical URLs; its demo branch now validates preserved archived sitemap coverage and requires demo noindex instead. Local HTTP responses were 200 for six tested project-subpath URLs; Chromium headless DOM test timed out, with no browser acceptance claimed. Full log: `docs/TEST_RESULTS.md`.

## 2026-11-24 — Phase 2 metadata-first demo foundation

- Introduced deterministic metadata-only `assets/coverage-index.js` (106 guides, 5 country/territory groups, 35 registry region groups); home/map no longer load seven complete resource scripts. Directory stays on canonical full registry. Existing query/history logic retained.
- Generated static fallback list of all 106 exact guide links; hide map filters until data available, explicit failure status, homepage alternative link. Retained legacy copies and paths; fixed direct `404.html` home links; cache-busted changed shared assets.
- Added semantic tokens and inactive alternate palette candidates to global CSS; base/focus/critical and map surfaces/fills consume tokens without rebranding. No user-facing theme toggles.
- Added `scripts/phase2-data.cjs`, immutable `baseline/record-integrity.json`, generated `reference/place-catalog.json`, all-guide picker simulator, optional local Chromium and HTTP smoke scripts. Extended CI and adapted original validator to enforce metadata loading instead of requiring the old heavy scripts.
- Preserved all protected data and brand assets byte-for-byte; no content updates, new postal geography, live source checks or production changes. Original offline audit reports kept unchanged; current rerun recorded separately. See `PHASE2_TEST_RESULTS.md` and `PHASE2_ADR.md`. Browser policy blocked access; native/device/AT/hosted validation remains open. Rollback via original Phase 1 ZIP, never by overwriting baselines.

## 2026-11-24 — Phase 3 navigation and geography demo

Implemented static shared navigation on 18 primary pages, prominent home world map, lightweight place-name search, reusable selection/continue panels, map focus/pointer previews and zoom/reset, explicit zero-coverage/failure copy, Georgia county guide-level ZIP suggestions, neutral unknown-jurisdiction emergency guidance, safe invalid-guide load state, standalone project-subpath 404 and privacy-minimized correction links. Added deterministic navigation/postal/region projection checks, interaction simulations, custom-error HTTP simulation and CI gates. No original resource, geographic source, review dates or protected brand data changed. No legacy routes removed. No new appearance preference modes, card redesign, or Florida expansion. See Phase 3 ADR/test results for tradeoffs, exact measurements and unverified gates.

## 2026-11-24 — Phase 4 display preferences and mobile reflow

- Functional system/light/dark and native accessibility disclosure with six validated local preference enums and isolated reset. Existing Calm View keeps dark/motion/decorative suppression, language and selected guide/handout storage unchanged. Controls generated on 24 styled routes, 404 self-contained. No backend, account, tracking or external component fetch.
- Reused existing dark palette in screen-only CSS, strengthened focus/contrast/forced colors, typography/spacing/density, wrapping, non-sticky header, mobile grids, unbounded state/county lists, selected-card review and inline print tray. Added Spanish settings and key dynamic map messages; remaining translation partial. Preserve print/QR and existing guide safety scope.
- Added deterministic preferences, handout, contrast and template checks; updated old map simulator to scope options to actual country selector, CI and cache tokens. 24 final commands passed; both immutable baseline snapshots byte-identical. Offline audit scratch: one preexisting stale item; Omaha gap remains. Real-browser policy blocked initial/final attempts; no device/AT/native print/hosted/human acceptance. No production changes. Rollback: supplied Phase 3 ZIP, do not rewrite baselines. See PHASE4_ADR.md and PHASE4_TEST_RESULTS.md.

## 2026-11-24 — Phase 5 resource cards, discovery and preparation

- Native resource detail disclosure, list layout, visible source/area/category/purpose/next/contact/urgent/guide-date and handout actions; supplementary links only collapsed. Original records retained. Added OR topic filters, removal and clear recovery, counts, deterministic vocabulary and full positive-score results; urgent classifier/routing unchanged, unknown guide neutral. Read legacy need links; no new sensitive URL/history/storage state. Disabled native form submission and removed field name on all three finder routes. No new record routes or data.
- Integrated public prep questions and static copy scripts on call/travel/handout preview; clipboard failure fallback, no auto transmission. Added localized controls, token-based card CSS and new tests/CI. Kept legacy paths, original PDF/QR engines, Phase 4 preference and handout keys. 30 final offline commands pass, browser policy still blocks real verification. See Phase 5 ADR/results for exact evidence, limitations and rollback.

## 2026-11-24 — Phase 6 (demo only)

- Hardened already-lazy direct PDF dependencies (script-relative root/nested paths, parallel independent retry, timeout/global checks, stale-revision guard, Blob URL cleanup on pagehide/change/repeat). Corrected nested credit image and dynamic legacy map link.
- Added large print, source type/urgency and scope/caveats, black-on-white native print rules, long public URL/annotation and diacritic handling; native printing instructions and QR text fallback. Preserve optional original credit and no auto-send.
- Kept cross-guide ordered pair/session model; restore from current session on BFCache, retain in-memory fallback; clear independent. Added privacy-page location-only clear, no-referrer on editable pages, prevented suggestion GET fallback and show reviewable note. No new data storage keys or resource data edits.
- Updated cache tokens and existing validator expected versions without weakening checks; added actual PDF bytes/annotation tests, optional render/QR decoding, controller, privacy, handout and subpath tests. Initial incremental cache mismatch corrected. Browser blocked; feature freeze pending Phase 7 independent QA.

## Phase 7 — independent QA, feature freeze

- Corrected legacy finder parity at both existing URLs, without redirects or data changes; full canonical picker, scripts, handout, neutral/US-scoped emergency copy and static fallback. 318 exact HTTP query responses plus asset checks.
- Missing urgent classifier no longer silently downgrades situation search to ordinary matching; disable form and quick examples, keep browse available. Active urgent guidance restored in directory print CSS. Share clipboard failure now accurately reported; helper cleaned up. Clarified browser/device retention caveat.
- 43 regression checks pass; independent 11-phrase release probe reports five discrepancies (exit 2), immutable classifier and routing targets unchanged. Real browser blocked; no release acceptance. Actual PDF fixture/render/QR evidence repeated. Added QA matrix, human protocol, CI, ADR and rollback. No deployment, provider refresh or expansion.
