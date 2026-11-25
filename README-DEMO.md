# Independent Single Step Forward 2.0 demonstration

This is a **Phase 4 appearance, accessibility and mobile-reflow demo**, not the live production site and not a claim that the future redesigned UI is already available. Resource material is preserved from the supplied source ZIP; contact/eligibility/operating hours should always be confirmed with providers. The site is publicly accessible if published, even with noindex.

## Deploy to a separate GitHub Pages repository

1. Create a **new repository** for this demo, such as `ssf-2-demo` (this is an example, not a hardcoded name).
2. Upload the **contents** of this repository folder to its root. Keep `.nojekyll`, `.github/workflows/phase1-ci.yml`, `assets/`, HTML, datasets, scripts and documentation.
3. In GitHub Settings → Pages, publish **main / (root)**; open `https://<account>.github.io/<demo-repo>/`.
4. Never set a custom domain for this demo. Do not add a root `CNAME`, and do not point production DNS here.
5. Verify direct link refresh, Back/Forward, `explore-map.html?country=US&state=GA`, `find-help.html?area=liberty`, `discover.html`, learning/support pages, and selected-resource PDF/print under the actual project subpath. Log manual results.

## Local smoke test

From this folder, run:

```sh
python scripts/phase1-data-baseline.py
node scripts/validate-data.js
node scripts/validate-explore-map.cjs
python validate-guides.py
python scripts/validate-demo-links.py --strict-legacy
node scripts/phase2-data.cjs
node scripts/phase2-picker.cjs
python scripts/phase2-http-smoke.py
python scripts/phase3-nav.py
node scripts/phase3-postal.cjs
node scripts/phase3-region-search.cjs
node scripts/phase3-interactions.cjs
python scripts/phase3-http-smoke.py
python -m http.server 8000
```

For **subpath** simulation instead of a root preview, serve this folder as a subdirectory of another local directory, e.g. `/demo/`. Use Python/Node HTTP server rather than relying on `file://` for dynamic relative paths.

The demonstration banner appears on active pages. `robots.txt` disallows crawlers and HTML pages contain noindex metadata; **neither provides confidentiality or password protection**. The demo should not be shared as a verified emergency source or final accessible product. The original production indexing sitemap and scheduled network audit workflow are preserved as *inactive references* under `reference/production-metadata/`.

Read `docs/BASELINE_REPORT.md` for what was tested, `docs/ROADMAP.md` for development sequence, and `docs/PHASE4_PROMPT.md` for the next execution instruction; read `docs/PHASE3_TEST_RESULTS.md` before claiming browser readiness.

## Phase 4 checks

```sh
python scripts/phase4-template.py
node scripts/phase4-preferences.cjs
node scripts/phase4-handout.cjs
python scripts/phase4-contrast.py
```

See `docs/PHASE4_TEST_RESULTS.md` and `docs/PHASE4_ADR.md`. Browser test remains blocked in the authoring environment; run `python scripts/phase4-browser-smoke.py` only in a permitted local installation. No WCAG or human acceptance claim. Next pass: `docs/PHASE5_PROMPT.md`.

## Phase 5 QA

Run `python scripts/phase5-run.py final` from root (30 offline commands). See `docs/PHASE5_ADR.md`, `docs/PHASE5_TEST_RESULTS.md`, `qa/phase5-final.txt` and `docs/PHASE6_PROMPT.md`. Actual browser navigation blocked in authoring environment; no release acceptance. Keep original ZIP for rollback.

## Phase 7 — feature freeze / NOT RELEASE-READY

`python scripts/phase7-run.py` runs 43 deterministic offline regression checks. The separate `node scripts/phase7-urgent-review.cjs` returns exit 2 for known frozen-classifier safety discrepancies. Do not mark release accepted. See `docs/PHASE7_TEST_RESULTS.md`, `docs/PHASE7_EXTERNAL_QA.md`, `docs/PHASE8_PROTOCOL.md` for device and volunteer test worksheets. No production deployment or Florida expansion authorized.
