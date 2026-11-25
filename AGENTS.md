# Single Step Forward — coding-agent operating rules

**Read first:** `docs/PROJECT_SPEC.md`, `docs/FEATURE_INVENTORY.md`, `docs/ARCHITECTURE.md`, `docs/SAFETY_AND_PRIVACY.md`, and `docs/ACCEPTANCE_TESTS.md`. This is a **separate GitHub Pages demonstration**, not the production repository. The original ZIP was the Phase 1 source of truth.

## Nonnegotiable protections

1. Do not delete, conflate, silently edit, fabricate, or mark newly verified any public resource record, reviewer sheet, source reference, metadata, ZIP association, jurisdiction code, or official contact. A source check is **not** an eligibility or service-availability guarantee.
2. Preserve existing entry points, `?area=`, `?country=`, `?state=`, `?county=`, `?region=`, `?topic=`, and ZIP discovery behavior unless an intentionally versioned migration provides equivalent working routes and Back/Forward support.
3. Maintain non-map navigation, accessible alternatives, emergency/urgent-language routing, Calm View, Spanish UI, preparation tools, selected-resource handouts, PDF/print fallbacks, and feedback/support/legal pages.
4. Never infer the correct emergency telephone number from language or presumed location. Do not display active alerts without authoritative source, timestamp, and scope. Keep crisis/safety warnings visible in collapsed cards.
5. No mandatory backend, account, analytics, commercial API, intrusive overlays, unapproved location access, hidden location tracking, or transmission of sensitive situation text.
6. Do not introduce a production `CNAME`, canonical URLs to the production domain, production DNS changes, or root-relative site links in this demo. `robots.txt` and page-level `noindex` discourage indexing but **are not access controls**.
7. Protect Cypress/sea green/sage/amber/cream brand and Dawn mascot; accessibility color variants are permitted. Use semantic HTML, keyboard input, readable controls, reduced-motion support, and visible focus.
8. Do not create lookalike emergency services, pretend to qualify users for aid, or silently swap source-checked records with generated content. Use licensed/attributed map boundaries. ZIPs are not county polygons.
9. Do not treat automated checker success as full accessibility, browser, security, or content verification.

## Required change sequence

- Inspect the affected source, dependency graph, reviewers' provenance, and route contract first.
- Before changing data, run `python scripts/phase1-data-baseline.py`; byte differences require a **documented human-reviewed change** and a new intentional baseline, never an automatic regeneration.
- Make narrow changes; do not simultaneously change the dataset and the map engine without separate tests.
- Run, at minimum:

```sh
python scripts/phase1-data-baseline.py
node scripts/validate-data.js
node scripts/validate-explore-map.cjs
python validate-guides.py
python scripts/validate-demo-links.py
```

- Test via a static HTTP server **under a non-root project path**; test both mobile and desktop, keyboard, browser history, page refresh, no-JS alternatives, and print. Log what was **actually** tested.
- Update the relevant living specification, `docs/CHANGELOG.md`, and acceptance criteria with each material change. Record source, rationale, old behavior, new behavior, risk, and rollback.
- Keep the demo's `.github/workflows/phase1-ci.yml` offline and deterministic. The original scheduled resource audit is preserved at `reference/production-metadata/resource-audit.yml` for future review; do not reactivate external network probes without authorization.

## Status terms

**Planned** = specified; **Implemented** = code changed; **Validated** = automated checks pass; **Verified** = exercised in an appropriate environment; **Accepted** = human testing confirms usability. Never substitute one status for another.

## Rollback

The source ZIP remains an immutable external reference. The committed baseline is `baseline/data-integrity.json` (201 protected files as of Phase 1). If an update fails, revert the responsible change; do not update the hash baseline to hide a regression. See `docs/BASELINE_REPORT.md` for preexisting defects.

## Phase 2 additions

Read `docs/PHASE2_ADR.md`, `docs/PHASE2_TEST_RESULTS.md` and `docs/DATA_DICTIONARY.md` for the implemented metadata boundary. `assets/coverage-index.js` is generated; home/map must never load the full seven resource modules. `node scripts/phase2-data.cjs` verifies immutable record parity and exact derived files; `--generate` regenerates only derived outputs after parity passes. Do not overwrite either baseline automatically. Run `node scripts/phase2-picker.cjs` and `python scripts/phase2-http-smoke.py` along with Phase 1 gates. Keep static list fallback and distinguish load failure from zero coverage. Do not enable incomplete theme controls. Optional Chromium smoke needs a permitted local browser. Update documentation and evidence with every material change.

## Phase 3 additions

Read `docs/PHASE3_ADR.md` and `docs/PHASE3_TEST_RESULTS.md`. Keep static shared navigation (check `python scripts/phase3-nav.py`); preserve all public/legacy routes. `phase3-map-ui.js` owns selection semantics, separate from navigation. `phase3-region-search.js` and `phase3-postal.js` are derived existing data; verify with their matching scripts. Postal suggestions are guide-level examples, never county crosswalks. No global phone defaults; use the existing guide jurisdiction only when a valid guide is loaded, and keep neutral local emergency guidance. `404.html` is intentionally standalone and project-path-aware; do not send attempted paths or queries in feedback. Run `node scripts/phase3-interactions.cjs` and `python scripts/phase3-http-smoke.py` in addition to Phase 1/2 gates. Browser verification is not waived. Phase 4 is appearance/accessibility/reflow only; Phase 5 cards/search and Florida expansion remain deferred.

## Phase 4 additions

Read `docs/PHASE4_ADR.md`, `docs/PHASE4_TEST_RESULTS.md`. `assets/phase4-preferences.js` owns the six allow-listed local display settings; no sensitive fields, requests or analytics. `assets/phase4.css` owns screen appearance/reflow; retain system preference precedence, existing Calm and language keys, isolated reset and no-JS fallback. `scripts/phase4-template.py` checks static controls on styled pages and inline 404 (use `--write` only to regenerate intentionally). Run `node scripts/phase4-preferences.cjs`, `node scripts/phase4-handout.cjs`, `python scripts/phase4-contrast.py` plus all earlier checks. Static ratio/simulated passes are not real accessibility, browser or print verification. Phase 5 is specified in `docs/PHASE5_PROMPT.md`; close material browser/AT/mobile gates before release. Never replace either original baseline to conceal a regression.

## Phase 5 additions

Read `docs/PHASE5_ADR.md` and `docs/PHASE5_TEST_RESULTS.md`. `assets/guide.js` renders sourced fields; critical summary/next/contact/scope/date/handout stay visible outside native details. `assets/phase5-vocabulary.js` extends ordinary category matching only after immutable urgency classifier. Browse OR filters, expansion and situation text stay in page memory; read legacy `?need=`, do not serialize private text or new selections. All finder variants must have unnamed situation field and disabled submit until initialized. Keep native static prep text and deliberate copy-only `assets/phase5-prep.js`. Run `python scripts/phase5-run.py final` for 30 offline gates. Preserve source records and both baselines; use `docs/PHASE6_PROMPT.md` for next pass. Real browser/AT/native print/hosted/human acceptance still open.

## Phase 6 additions

Read `docs/PHASE6_ADR.md`, `docs/PHASE6_TEST_RESULTS.md`. Preserve existing selection pair/session key, scoped resets and original QR/credit URLs. PDFLib/font stay lazy and local, resolve relative to script, never auto-download/share. Direct PDF snapshot public sheet content only; no situation data. Run `python scripts/phase6-run.py`, `python scripts/phase6-http-smoke.py` and optional real PDF render check using scratch fixtures. Feature freeze; Phase 7 independent QA per `docs/PHASE7_PROMPT.md`. No production or Florida until human acceptance and explicit release authorization. Do not bypass browser policy.

## Phase 7 feature freeze

Read `docs/PHASE7_ADR.md`, `docs/PHASE7_TEST_RESULTS.md`, `docs/PHASE7_EXTERNAL_QA.md`, and `docs/PHASE8_PROTOCOL.md`. Run `python scripts/phase7-run.py` (43 regression checks) and separately `node scripts/phase7-urgent-review.cjs` (current exit 2; known open safety gate). Never hide that result or modify immutable classifier/baselines without explicit authorized safety review. Canonical finder aliases generated by `python scripts/phase7-legacy.py --write` only when intentional; check by default. Keep both URLs, query/hash contract, neutral failure, explicit missing-classifier warning and printable urgent guidance. Real browser/AT/print/hosted/human testing still open. No production or Florida until gates close and explicit signoff.
