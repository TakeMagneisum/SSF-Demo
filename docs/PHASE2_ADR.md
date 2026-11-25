# ADR-002 — Metadata-first loading and design tokens

Status: implemented and offline-validated; interactive browser verification blocked in execution environment. Source: supplied Phase 1 ZIP only for code/data. Date: 2026-11-24 (US Eastern).

## Decision

Keep static HTML, classic deferred JS and CSS on GitHub Pages. No build at deployment, no external API, backend, framework, dependency install or analytics. Generate a small, committed JS coverage projection from the existing ordered runtime registry. Build-time Node VM executes only the repository's trusted data modules; never run arbitrary external code through it. Retain their seven-script order and full records on the directory route. A future per-guide split is not authorized here: handout selection catalog currently reads all areas, and a split must preserve cross-guide selections, urgent routing, direct links, translations and print. No runtime fetch waterfall has been introduced.

| Option | Benefit | Cost/risk | Decision |
|---|---|---|---|
| Keep all globals on every page | Minimal edits | Large, growing homepage/map payload | Reject |
| Generated coverage JS + legacy finder | Exact projection; one deferred request replaces seven; file/static compatibility | Generator must stay in sync | Adopt |
| Async JSON fetch or ESM-only dynamic import | Natural modular syntax | Additional dependency/request timing, failure state and file-preview constraints | Defer until justified |
| Per-guide JSON now | Smaller directory payload | Break potential cross-guide catalog, startup ordering and handout | Defer until Phase 5/6 or separately approved |
| SPA/framework/backend | Larger ecosystem | Added deploy/runtime complexity, URL/history migration, maintenance | Reject absent measured need |

## Boundaries and invariants

- **Navigation:** `area.js` reads `SSF_COVERAGE.guides` on non-finder routes, full `SSF_RESOURCE_AREAS` on finder. Legacy copies can supply full data as before. Explicit selection, storage keys and relative URL generation preserved. `calm.js` owns existing menu and Calm View; `i18n.js` owns UI language. Their public behavior is unchanged; split the menu/preferences controllers in a later phase only with parity tests.
- **Coverage:** `coverage-index.js` generated deterministically by `scripts/phase2-data.cjs`. Schema 1 has guides keyed by stable ID (eight allowlisted fields), country → guide IDs, country:region → guide IDs. No resources, source URLs, emergency text, routing or individual contact data. The map continues deriving visible counts from this projection and uses existing lazy geometry. Country and region index fields support subsequent phases.
- **Map and fallback:** `explore-map.js` consumes coverage only; missing index stops before event wiring, hides inactive filters, retains all 106 static direct guide links, states that filtering failed rather than asserting absent coverage. Static list generated from the same canonical data. No-JS homepage link goes directly to the map list. Initial world geometry remains unchanged; conditional state, county, London and Caribbean geometry is lazy as before.
- **Directory:** `resources.js` and other existing resource modules remain canonical runtime registry. `area.js` sets selected area's records before `guide.js`; `urgent.js`, `handout.js`, PDF/QR assets and printing stay unchanged. No change to provider data or status.
- **Design tokens:** CSS semantic aliases in existing `styles.css` avoid a CSS `@import` request; default surface/text/critical/focus values preserve brand and existing map values. Candidate dark and high-contrast palettes are *not active themes*. `explore-map.css` consumes relevant tokens with existing Calm View precedence. Future themes must migrate component hard-coded colors and validate contrast first.
- **Place metadata:** `reference/place-catalog.json` is a generated engineering reference (not fetched by any public route), derived only from existing country/territory/map-unit keys, 51 states, 159 counties, 33 London boroughs and London grouping. 444 place entries. These are SSF route identifiers, not a comprehensive gazetteer. See DATA_DICTIONARY.md for semantics and geographic source/license notes. ZIP guide suggestions are preserved, not promoted to county crosswalks.
- **Compatibility:** no legacy route deleted/redirected. Old copied HTML remains because relative navigation and historical aliases require independent browser parity. All HTML references to edited shared styles/area script cache-busted. Direct root `404.html` homepage links changed from empty self-reference to `index.html`. Actual GitHub-hosted arbitrary nested missing URLs are not verified; relative 404 assets/links can fail at deeper paths. Phase 3 must address with a documented project-base policy and tests, not hardcoded repo name.

## Rollback and editorial changes

Keep input ZIP as immutable rollback. Restore affected HTML, CSS, JS and validators from Phase 1 together if loading migration fails. Never regenerate `baseline/record-integrity.json` to hide changes. `node scripts/phase2-data.cjs` checks complete field digests, record IDs/order, guide metadata, routing, emergency values, discovery, urgent classifier and map crosswalks; `--generate` is permitted only after parity passes and writes the derived files/HTML list. `--capture-phase1` refuses to overwrite existing snapshot and is historical bootstrap only. Intentional data edits require human approval and explicit record diff before a new versioned baseline. Both snapshots are committed. CI checks generation freshness without rewriting output.

## Remaining gates

Actual hosted and desktop/mobile browser verification, assistive technology, real print/PDF, contrast audit, route alias consolidation and full data partition are open. No production deployment, no new service availability verification. Browser launch succeeded locally but navigation was blocked by environment policy; see PHASE2_TEST_RESULTS.md.
