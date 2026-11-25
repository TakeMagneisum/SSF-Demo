# Roadmap — dependencies and exit gates

| Phase | Work | Entry/exit gates |
|---|---|---|
| **1 — completed at implementation/validation level** | Audit, protected hashes, docs, demo isolation, project-path static links, offline CI | Source integrity and existing validators pass; independent archive delivered; browser human acceptance still pending |
| **2 — shared design + data-loading foundation** | Decide minimal build setup, semantic tokens, stable guide/coverage index, modular loader, component contracts, record-level diff, CI update | No loss of 106 IDs/3,487 placements; compatibility routes; measurable reduced homepage data dependency; rollback ready |
| **3 — homepage/geography** | World map prominence, country/state/county reuse, tooltips/selection panels, list alternatives, search and map navigation | Touch/keyboard parity, Back/Forward, first-tap/second-action semantics, GEOIDs, unmatched regions |
| **4 — appearance/accessibility/mobile** | Light/dark/system; accessibility preferences; focus/reflow/forced-colors; contrast; Calm View integration | Automated + manual keyboard, screen reader, 320px and 200% text; no overlays |
| **5 — cards/discovery/prep** | Progressive-disclosure cards, deterministic synonym search, filter recovery, integrated call/visit/travel preparation | Safe urgent info always visible, selection preservation, ambiguous postal codes handled |
| **6 — print/privacy/performance** | Mobile PDF/print investigation, handout accuracy, privacy clear action, audit requests, region-based lazy data, failure states | iOS/Android tested, no unapproved telemetry, image/geometry fail fallback, measured improvements |
| **7 — independent QA** | CI expansion, browser test matrix, accessibility/language/security/geo/source reviews | All critical scenarios pass; defects classified, regressions addressed |
| **8 — human usability** | Novice, older, AT, low-bandwidth and stress-context observation; correction loop | Human task completion/understanding and recovery accepted |
| **9 — production migration** | Diff and provenance migration, canonical/SEO/policy/DNS planning, link redirects and rollback rehearsal | Explicit authorization, signoff and verified production readiness |
| **10 — Florida expansion** | Add geography/reviewed source records into stable reusable architecture | Same editorial controls, performance and accessibility tests inherited |

## Phase 2 prerequisite decisions

Use minimal static technology unless actual measurements justify a build-time generator or library; retain source data unchanged during separation. Decide one canonical data contract, bridge legacy `window.SSF_RESOURCE_AREAS`, declare state of published versus pending research, and identify authoritative map-data sources with licensing. Generate a **coverage metadata index** separate from resource bundles; preserve direct links to each existing guide. Test on the actual demo project subpath and commit a rollback snapshot before removing old scripts.

## Deferred specialist projects

Discreet/quick-exit and child-oriented experiences, live disaster alert integration, voice read-aloud accessibility, international postal resolution, accessible generated PDFs, backend feedback moderation, AI suggestions, app packaging, and production SEO/trademark planning each require separate product/privacy/safety/legal evaluation. They are **not** features authorized for unilateral Phase 1 or 2 implementation.

## Phase 2 handoff

Phase 2 implementation and offline validation complete; hosted/browser and human acceptance open. Phase 3 should use coverage metadata and semantic tokens, implement shared navigation and map-forward home in narrow passes, maintain deterministic list/search access, and close the browser/404/global emergency-copy issues before wider demo sharing. Do not start Phase 4 appearance controls, Phase 5 card redesign, or Florida expansion until map navigation passes acceptance. See `PHASE3_PROMPT.md`.

## Phase 3 handoff

Implemented and offline-validated; actual browser/hosted/AT/human acceptance remains open. Do not mark Phase 3 user-accepted. Phase 4 should first attempt the blocked browser gates and address defects, then implement functional appearance/accessibility preferences and mobile reflow only. See `PHASE4_PROMPT.md`. No Phase 5 card/search expansion or Florida expansion authorized.

## Phase 4 handoff

Appearance/accessibility/reflow implemented and offline-validated; actual browser, mobile, AT and human acceptance still open. Phase 5 card/discovery/prep specification: `PHASE5_PROMPT.md`. First address observed defects and attempt the blocked real-browser gates; do not use offline results as release signoff. Phase 6 print/privacy/performance, Florida and production deployment remain out of scope.

## Phase 5 handoff

Resource card/discovery/prep implemented and offline-validated, not user accepted. Phase 6 print/privacy/performance prompt: `PHASE6_PROMPT.md`. Attempt actual browser gates before additional expansion; keep Phase 7 integrated independent QA, Phase 8 human review, Phase 9 production release and Phase 10 Florida separate.

## Phase 6 handoff

Printing/privacy/performance hardening implemented; direct-PDF file/QR checks and offline gates locally validated, native printing and browser/human acceptance not closed. Feature freeze for Phase 7 independent QA (`PHASE7_PROMPT.md`); defer further resource-loading restructuring until integrated verification. No production or Florida expansion.

## Phase 7 handoff — release blocked

Independent regression checks passed, but the separate urgent-classification gate failed (five discrepancies; frozen classifier). Real browser navigation blocked, native print/AT/hosted/human acceptance open. See PHASE7_ADR, PHASE7_TEST_RESULTS and PHASE7_EXTERNAL_QA. Phase 8 controlled fictional usability protocol may be run on authorized devices, not on real help-seeking participants as a public service. Safety review and explicit approval required before modifying classifier/baseline or production migration/Florida.
