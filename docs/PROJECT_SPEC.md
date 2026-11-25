# Product specification — Single Step Forward 2.0

## Mission and scope

Help visitors recognize possible assistance, learn the names of services, discover a relevant starting point, and prepare a realistic next action. Every page must answer: **Where am I? What options are here? What can I do next? What if that fails?** This is awareness, education, and navigation; **not** emergency response, legal/clinical advice, eligibility determination, a promise that a service is open, or a substitute for a provider.

## Audience and design constraints

Prioritize people in distress; older visitors; young visitors with ordinary reading ability; visitors with low literacy or cognitive load; low vision, motor, hearing, and reading impairments; screen-reader/switch/voice users; visitors without precise geographic knowledge; advocates helping someone else; multilingual visitors; budget phones, spotty networks, damaged screens, outdoor conditions, and one-handed use. **No map, hover gesture, fine-point drag, advanced vocabulary, persistent selection, or language preference may be required to find help.**

## Functional product requirements

| Area | Planned requirement / invariant |
|---|---|
| Safety | Unambiguous jurisdiction-specific crisis guidance, direct emergency route, general preparedness versus live verified alerts clearly distinguished |
| Orientation | Always-visible brand/navigation; headings, breadcrumbs, Back/Reset, clear reviewed/unreviewed indicators; recovery from dead ends |
| Search | Direct location entry independent of map; accessible category navigation; plain-language descriptions and deterministic intent-to-topic mapping |
| Homepage | Concise mission and location entry; large world map *after* primary navigation and direct location search; topics, preparation, learning, methodology/support |
| Geography | Configurable administrative hierarchy by country (not hard-coded state/county/ZIP); aliases, diacritics, persistent selection panel, keyboard and list equivalent, exact shareable routes |
| Region panel | Name, parent area, reviewed guides/count, verified municipality/postal associations, status, service-area caveat, direct guide action or discovery fallback |
| Resource cards | Recognition (title, who/where), immediate action (verified phone/site/urgent caveat), expanded preparation/eligibility/source/handout details |
| Preparation | Before You Call or Visit; Before You Travel; address/phone copy; interpreters, appointment, fees, documents, return trip, rejection fallback |
| Appearance | Light/dark/system modes; accessibility button by menu; text size/spacing, high contrast, Calm View, motion, density, list preference, reset |
| Language | Plain-language UI + official terms explained; accurate localized interfaces; no machine-translation claim for provider details |
| Handouts | Accurate chosen resources, phone/website/source dates, print and mobile download fallback, readable large print, QR, sensitive privacy defaults |
| Trust | Visible source provenance, last reviewed, limitation notices, correction channel, no fabricated results |
| Performance | Serve global navigation metadata separately from local records; lazy region data; static hosting; resilient offline/error states |

## Exact map interaction requirements

- Desktop pointer hover and keyboard focus show a **short label** (name, coverage status). Selection visibly persists and opens a separate nonblocking details region.
- Touch: first tap selects and reveals a readable persistent panel; explicit Open guide/Explore further button performs navigation. No hover-only essential data. Pan and zoom controls must be labeled and keyboard operable; map reset and accessible location list are peers, not fallbacks hidden in a menu.
- Full region details: parent areas; reviewed guide count/links; optional city/postal lists (expandable); stable official identifier; service-area qualification; discovery even when no reviewed guide exists.
- A small region must be selectable from an accessible text list regardless of SVG area size. Multi-county ZIP and city overlap must display choices rather than silently assigning one county.
- Treat coverage as **guide presence** rather than guaranteed ability to serve residents. Do not invent ZIP-to-county mappings or classify US ZCTAs as USPS delivery ZIPs.

## Content rules

Use plain language *before* institutional terminology: “Who can get help (eligibility),” “How to begin (intake),” “Where they help (service area),” “Does someone need to send you (referral).” Examples: groceries, disconnection, shelter, dental, transport, helping someone else. Explain missing results and suggested broader routes. “Available now,” “free,” “qualifies,” “open,” “verified,” and time-sensitive claims require appropriate current evidence.

## Explicit exclusions and decisions

No AI requirement for ordinary searches, third-party accessibility overlay, mandatory consent wall, unsolicited audio/geolocation, ad tracking, unverified live weather feed, decoy website, child-safe-mode claim, or stealth Quick Exit claim. Child-oriented and discreet-access designs require separate specialist risk assessment. Florida expansion follows stabilization and regression acceptance, not a Florida-specific rewrite. See `ROADMAP.md`.

## Definition of done

Each feature advances from planned → implemented → validated → browser-verified → user-accepted. Meet WCAG 2.2 AA development targets, but do not claim conformance without documented manual and assistive-technology evaluation. Preserve every existing valuable route and record or provide a tested redirect/equivalent. Accessibility is a property of the default interface, not a toggle users must discover.

## Phase 5 implementation status

Directory recognition and safe progressive disclosure, local deterministic topic/situation search, recovery and public preparation tools implemented. Keep full sourced next step visible, guide source check not availability, no inferred provider type, no mandatory AI or private query retention. Release remains gated on browser/AT/human validation.
