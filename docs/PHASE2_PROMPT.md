# Execution prompt — Phase 2: Shared design system and modular loading

Act as the principal architect, accessibility engineer, performance engineer and QA engineer for Single Step Forward 2.0. **Use the attached completed Phase 1 demonstration repository ZIP as the only code source of truth.** Do not edit the production repository, DNS or Cloudflare configuration. This is Phase 2, **not** permission to implement the whole future homepage, map UX, card redesign or accessibility preferences at once.

## Before changing code

1. Read `AGENTS.md` and all `docs/` specifications, especially `BASELINE_REPORT.md`, `ARCHITECTURE.md`, `DATA_DICTIONARY.md`, `FEATURE_INVENTORY.md`, `SAFETY_AND_PRIVACY.md`, and `ACCEPTANCE_TESTS.md`.
2. Run all existing offline validators, the demo link checker and `scripts/phase1-data-baseline.py`; record exact initial status. Do not assume previous passes still apply.
3. Inspect current HTML and classic JS globals; trace which pages need guide metadata versus actual resource lists, which files contribute to first-load weight, and which references rely on existing query routes.
4. Propose the smallest maintainable architecture that works under a **GitHub Pages project subpath**, with no mandatory backend, API keys, commercial services, analytics or unnecessary framework. Document design alternatives and your reasons.

## Phase 2 work authorized

- Establish a documented, small semantic **design-token system**, preserving Cypress `#0b2d2b`, sea green `#6fb3a0`, sage `#b9cea5`, amber `#f2b441`, cream `#f7f4ea`, Dawn, established icon language and typography. Tokens must support future dark/contrast/light appearances, but **do not add inert user-facing toggles**.
- Create a separate lightweight **country/region/guide coverage index** so `index.html` and initial `explore-map.html` can display guide coverage without importing all 3,487 listings. Avoid request waterfalls. Prefer deterministic build-time generated static JSON/JS, with no server runtime. Retain complete guide records for the directory page and load them only when actually necessary.
- Introduce clear reusable module/component boundaries for navigation, map coverage, resource content and global preferences, while preserving current routes, legacy query parameters, urgent routing, ZIP discovery, map list fallbacks, and existing printing behavior.
- Define a verified country-agnostic place schema, stable geographic identifiers, administrative hierarchy and ZIP/postal relationship semantics; **do not fabricate new geography or USPS-ZCTA crosswalks**. Identify authoritative source and license for every geometry type.
- Add record-level migration comparison for guide IDs, resource IDs/field values, source URLs, review dates and urgent-routing targets, complementing `baseline/data-integrity.json`.
- Improve static paths, testability, failure behavior and HTML semantics where clear and low risk. Normalize legacy duplicate HTML routes only with a proven redirect/URL-compatibility plan.
- Update docs, CI, changelog and acceptance tests so the next phase can safely implement the map-forward homepage.

## Explicit protections

Preserve all **106** guide editions, **3,487** edition-listing placements, **13** discovery topics, **16** directory categories, 51 US state paths, 159 Georgia county paths, 33 London borough paths, 41 separate pending research drafts, source-review metadata and valid public links. Preserve state/area/county/query navigation, Back/Forward, printing, QR, Calm View and language controls. Do not confuse original source-check dates with current service availability or claim new human verification. Do not add accounts, intrusive overlays, automated geolocation, emergency predictions, decoy sites or unapproved telemetry. Any measured improvement must state test environment and method.

## Testing and acceptance

Run Node/Python legacy validators; protected file checks; new record-level comparisons; static link and noindex checks; exercise direct navigation and refresh at `/<demo-repo>/index.html`, `find-help.html?area=liberty`, Georgia county, London borough, ZIP discovery and 404. Verify against desktop/phone browsing where tools permit; explicitly list anything untested. If shared data modules change, prove no lost content or urgent route. No production deployment. **Deliver a full updated Phase 2 ZIP**, change log, architecture decision record, measurements with caveats, passing/failing commands, known limitations and a Phase 3 execution prompt.
