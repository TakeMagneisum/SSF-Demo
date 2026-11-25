# Safety and privacy — public-service design controls

## Service boundary

Single Step Forward helps a person explore **possible** support, understand unfamiliar terminology and prepare to contact a service. It is not emergency dispatch, live service-availability verification, eligibility adjudication, treatment, legal representation, or a guaranteed referral. Phrase each result as “may help,” explain the service-area limitation, and instruct direct confirmation. Source-check dates must not be read as real-time operational status.

## Known current client-side data handling

Source inspection (not a network traffic capture) identified:

| Key | Storage | Purpose | Risk / desired change |
|---|---|---|---|
| `ssf-selected-area` | localStorage (`assets/area.js`) | Explicit previously opened guide | Place choices may reveal sensitive interest; offer no-remember control/clear action |
| `ssf-selected-country` | localStorage (`assets/area.js`) | Guide country choice | Lower sensitivity, but do not assume harmless |
| `ssf-language` | localStorage (`assets/i18n.js`) | English/Spanish UI | Ordinary preference, persist with clear notice |
| `ssf-calm-view` | localStorage (`assets/calm.js`) | Calm View on/off | Could reveal accessibility preference; minimize and expose clear action |
| `ssf-print-selection-v1` | sessionStorage (`assets/handout.js`) | Selected print-list resources | Sensitive reveal on shared devices; allow clearing, do not upload |

`assets/guide.js` uses the browser print dialog, and `assets/sheet-pdf.js` supports local PDF assembly. No claim of encrypted storage should be made. Sensitive issue descriptions should stay on device and, by default, out of URLs, logs, print filenames, and third-party search queries. A prepared external web search involves sending terms/ZIP to **that search provider**, so distinguish it from local offline matching.

## External connections and claims

The static site loads public external links and includes hosted contact/feedback donation links; user-activated navigation transfers data to those services under their terms. The current source contains no dependency on an external commercial resource-discovery API. External link activation, `mailto:`/`tel:`/SMS, QR and third-party donation/search destinations deserve a full request inventory with browser DevTools before any strengthened “no tracking” claim. Repository inspection alone cannot certify zero external requests or privacy on a compromised/shared device.

## Vulnerable visitor guardrails

- Always foreground immediately actionable safety information when verified for the visitor's jurisdiction, not language; for unknown jurisdiction show general directions to local emergency services instead of guessing a number.
- Do not hide urgent warnings or crisis contact inside collapsed cards or long dialogs. Separate safety language from coercive mental-health routing.
- Do not present map boundaries, ZIPs, geolocation or guide areas as provider service-area guarantees.
- No live shelter/road/wildfire/disaster alerts unless credible official feed supplies timestamp, scope, freshness bounds and failure state; differentiate preparedness content from a current warning.
- Avoid mandatory accounts, ad pixels, analytics identifiers, form autoconfirmation, autoplay, forced popups, surprise downloads and unsolicited notifications.
- Correction/feedback intake should avoid asking for names, case details, addresses or medical histories when unnecessary. Never echo sensitive submissions in public URLs.
- Child-specific/discreet-access/Quick Exit functionality remains a deferred specialist safety project; no decoy page, no unsubstantiated promise that browsing history or monitoring logs are erased.
- Privacy controls must explain their limitations: browser history, OS backups, network operators, shared devices, and external sites remain outside SSF's direct control.

## Threat/failure scenarios and safe responses

1. **Stale aid listing:** show last source-check date; confirm contact and eligibility directly; do not auto-delete on a bot-blocked source check; provide correction route.
2. **Wrong emergency number internationally:** default to a neutral location selector and local official emergency references; never use English or Spanish to infer country.
3. **Failed map/SVG JS or high zoom:** accessible text list, search, category link remain operational.
4. **Wrong county for one ZIP:** display possible regions and ask users to verify residence/service area with source.
5. **Sensitive print list on shared phone:** provide one-tap clear; avoid background sync or opaque print/download filenames; leave no automatic PDFs.
6. **Demo appearing authoritative:** visible demonstration label, noindex, no production canonical, content caveat; note that noindex is not access control.
7. **Live source site inaccessible/changed:** do not claim the service is permanently closed; retain a marked human-review task.

## Pre-release review

Complete real browser storage/network inspection, privacy-policy consistency review, responsible source update policy, emergency routing by jurisdiction, error/fallback testing, and human evaluation with vulnerable-audience advocates. See `ACCEPTANCE_TESTS.md`. Production roll-out requires separate approval.

## Phase 2 review

Coverage projection includes only public guide names, IDs, region keys and original review labels; no resource details, situation text, coordinates or contacts. No new storage keys, outbound runtime requests or telemetry introduced. Existing selected guide/country persistence is unchanged. Missing metadata is distinguished from absence of a reviewed guide; the static guide list is deliberately unfiltered and labeled. Existing generic US emergency links on some shared/static pages and finder pre-JS defaults require jurisdiction-specific review before public international promotion. Do not infer location or present US numbers as universal; Phase 3 must audit visible global emergency copy and safe failure states. No new emergency numbers or verification dates were added. Browser network/storage inspection remains pending.

## Phase 3 changes

Global emergency bars no longer present US numbers as universal. Selected-guide routing is populated only after a valid guide loads; invalid explicit IDs cannot silently become a US guide. US-only discovery links are labeled; unknown areas retain local-emergency guidance. 404 feedback does not automatically include attempted paths/query strings; resource issue links identify the public listing rather than the visitor URL. Existing user-reviewed feedback-note workflow remains. No new telemetry or location requests, and no storage keys added. No live jurisdiction/provider verification or browser network/storage audit performed. See `PHASE3_ADR.md` and `PHASE3_TEST_RESULTS.md`.

## Phase 4 display preferences

New local-only key `ssf-display-preferences-v1` holds exactly six enumerated visual settings (appearance, text, spacing, contrast, motion, density). No URL state, location, situation text, selections, account, timestamps or transmission. Invalid data defaults, blocked storage uses in-page state. Reset removes only this key; existing Calm/language, guide/country and session handout data remain untouched. Privacy policy clarifies limits. No new emergency data, provider claims or active alerts. System appearance/language never imply jurisdiction. Browser network/storage inspection still unverified. See PHASE4_ADR.md.

## Phase 5

Situation form field unnamed and submit disabled until handler attached; autocomplete off. No application-level query storage/URL/transmission. Browser restoration/cache outside application control. Public legacy need parameter read then removed on new local search/filter; no private selection written. Urgency prioritized before ordinary vocabulary; no US fallback on unknown jurisdiction. Clipboard copies fixed public scripts only on click, with manual fallback; no new storage. Existing mailto public listing/guide metadata only, no case details. Full source next step visible even when details collapsed. No new source or availability claims.

## Phase 6

See PHASE6_ADR.md for request/storage inventory, scope of no-referrer, optional suggestions and explicit clearing. No new storage key. Location-only clear on privacy page removes `ssf-selected-area` and `ssf-selected-country`; guide reopening may remember it again. Selection clear is tab-local; display reset only visual key. Suggestion form no native field serialization, deliberate review/copy/email/download. Private situation input excluded from PDF snapshots; no new URLs or telemetry. PDF files/clipboard/browser/OS outside application control. 24 editable pages now have no-referrer; protected historical pages are not altered. Browser traffic inspection still pending.

## Phase 7

All finder routes now share full canonical markup, with scoped referral fallback. Missing urgency script disables situation matching, topic browsing remains. Active urgent response included by directory print stylesheet; native print verification pending. Situation text copy now explicitly distinguishes application behavior from browser/device retention. Clipboard share failure reports accurately. Independent frozen-classifier probes found three emergency misses and two context false positives; release gate failed. No baseline or routing edits; explicit safety review required. No provider requests or captured browser traffic; 42 historical pages retain prior referrer-policy limitation. See PHASE7_ADR and PHASE7_EXTERNAL_QA.
