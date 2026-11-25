# Accessibility engineering and verification plan

**Target:** WCAG 2.2 AA as a development minimum. This is a target, **not** an audited conformance claim. No automated result, screenshot or checklist alone proves conformity.

## Core requirements

| Interaction | Acceptance evidence |
|---|---|
| Keyboard | All site links, map regions, filters, menus, details, dialogs, handouts operate without mouse; no traps; logical focus sequence, visible current focus, Escape closes optional panels |
| Screen readers | Semantic headings/landmarks/labels, announcements for search counts and errors, correct selected/expanded states, map lists and tooltips accessible by keyboard |
| Touch/motor | Large targets, no gesture-only action, tap-to-select region detail, non-drag alternatives for zoom/reposition, one-handed navigation |
| Vision | 320 CSS px responsive reflow; text 200% and 400% browser zoom as relevant; color contrast tested; OS forced colors; no text clipped by sticky bars |
| Cognition | Recognizable words, clear next step, breadcrumb/back/reset, distinguish suggestions from confirmed services, avoid unnecessary animation/overlays |
| Language | Document language; interface UI translations accurate; provider titles retain original language and `lang` attributes where needed; avoid implying all records are translated |
| Alerts | Critical information textually distinct; emergency numbers jurisdiction-aware, never inferred solely from language |
| Forms | Label + instructions + example, validation without losing input, visible error association, no unnecessary collection |
| Motion/sound | `prefers-reduced-motion` respected; no autoplay sound; optional read-aloud requires user action, stop/pause, privacy review |

## Testing matrix

- **Automated:** HTML parsing, data validation, link/routes check, axe-core or equivalent against pages and states, static linting; run on both light and dark variations. Record version, pages, and rules.
- **Manual keyboard:** tab/shift-tab through header/map/search/cards/print; focus never hidden; enter/space selections; browser Back/Forward.
- **Screen reader:** Windows NVDA + Firefox or Chrome; VoiceOver + iOS Safari; optionally TalkBack + Android Chrome. Validate actual announcement and order, not merely generated ARIA properties.
- **Mobile:** 320–390 CSS px; landscape; 200% text; iPhone Safari and Chrome, Android Chrome; large text; virtual keyboard covering controls.
- **Low bandwidth:** throttle network, force SVG geometry failure, load HTML with images blocked, verify that location list and official contact still work.
- **Color/contrast:** normal text 4.5:1, large text 3:1, non-text interactive states 3:1 per applicable WCAG criteria; include forced-colors and dark/light tokens.
- **Usability:** observed tasks with older adults, novice users, assistive-tech users, and people under realistic time/cognitive constraints; obtain consent and avoid collecting sensitive case histories.

## Existing evidence and known gaps

Existing skip link, navigation, text alternatives, menu, Calm View, language selector, status regions, map fallback lists, keyboard SVG selectors, and urgent-language rules are visible in source. `node scripts/validate-data.js` and `node scripts/validate-explore-map.cjs` test aspects of these. **No full WCAG audit, screen-reader test, zoom test, contrast matrix, or cross-browser manual signoff was performed in Phase 1.** Current mobile print behavior needs independent iOS Safari/Chrome investigation (known prior report), not a browser-wide guarantee.

## Accessibility preferences proposal

Prefer CSS variables and small opt-in first-party script, respect system preferences by default, store only non-sensitive mode settings. Include Light/Dark/System; text scale; spacing; comfortable/compact; high contrast; Calm View; reduced motion; list alternative; reset. The preferences pane must be keyboard operable, understandable with settings disabled, and not cause accidental loss of handout state. Do not use accessibility overlays.

## Logging

For each manual test record date, OS/browser/AT version, route, viewport/zoom, task, observed behavior, pass/fail, screenshot/video only with consent, severity and fix. Separate `Validated`, `Verified`, and `Accepted` status. See `ACCEPTANCE_TESTS.md`.

Phase 2 introduces an always-available map list, hides the nonfunctional map filters until metadata initializes, and exposes a status message on coverage failure. The homepage retains direct list and discovery links. The semantic token foundation is implemented; alternate themes and complete translation of new failure messages are not yet evaluated. No full WCAG, screen-reader, touch-device or browser zoom validation was achieved; see Phase 2 test record.

## Phase 3 implementation status

Shared navigation links and skip links are ordinary HTML; mobile menu retains Escape and focus return. World/state/county map shapes expose names/coverage and selection state, with explicit continuation and independent list/search alternatives. London retains its original routes and gains selection/focus affordances. Zoom/reset controls use SVG viewBox; keyboard selection is simulated, but real touch, browser SVG focus, 320 px reflow, zoom/contrast, forced-colors and screen readers are not verified. Existing language choice and Calm View remain; Spanish coverage of new dynamic map copy is incomplete. No accessibility compliance or human acceptance claimed. Phase 4 should resolve layout and preferences with actual device testing.

## Phase 4 implementation and evidence

Native labeled appearance and accessibility controls now available on styled pages; six allow-listed local settings, scoped reset, separate Calm View, live OS changes, reduced motion/forced-color CSS, two-color focus outlines, text/spacing/density, nonmodal keyboard disclosure close/return, mobile wrapping and unbounded geographic lists, print tray reflow and selected-card shortcuts. 17 selected opaque contrast pairs pass; all preference and handout simulations pass. Actual Chromium page navigation blocked by administrator policy. No observed 320/390 or large-text/zoom, mobile, AT, computed-color, forced-color or native printing test succeeded. Actual real-device and human acceptance required. No full WCAG claim. See PHASE4_TEST_RESULTS.md and PHASE4_ADR.md.

## Phase 5

Native details/summary and list layout, visible safety/next steps, status count rather than announcing entire grid, filter removal focus return, answer/results focus targets, copy fallback, responsive controls and no-JS route recovery implemented. 424 mixed urgent queries across 106 guides and DOM state simulations pass. Actual keyboard, AT, layout, computed contrast, native print, clipboard and user evaluation remain open. No WCAG conformance claim.

## Phase 6

Native selected-sheet and directory black-on-white print rules, readable standard and large-print PDF/preview settings; visible sourced urgent/contact/scope/URL/date, explicit iPhone print alternatives. Actual generated PDF checked with text extraction/render and QR decoding; not tagged PDF, not native print or physical device verification. No WCAG/PDF-UA claim. Browser/AT/mobile/zoom/forced-colors remains open.

## Phase 7

Legacy finder markup parity, failed-classifier fallback, urgent print source rule and share clipboard fallback corrected; regression and HTTP checks pass, no rendered-browser or AT claim. Follow PHASE7_EXTERNAL_QA and PHASE8_PROTOCOL for actual keyboard, screen-reader, touch/reflow, contrast, print and human acceptance. Do not proceed to production while safety gate remains failed.
