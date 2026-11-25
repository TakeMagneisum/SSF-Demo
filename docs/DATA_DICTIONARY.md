# Data dictionary and authoritative-source boundaries

## Actual Phase 1 sources

| File / module | Role | Editing rules |
|---|---|---|
| `review-sheets/locations.json` | 106-edition live guide manifest | Stable `id` and `constant`; do not duplicate or invent entries |
| `review-sheets/<edition>-review.csv` | Human-facing reviewed-edition worksheet (106 CSVs) | For generated editions, CSV is canonical edited source; run import + validations |
| `assets/city-resources.js` | Generated runtime JS for 55 editions (per successful importer output) | Do not hand-edit in isolation |
| `assets/resources.js`, regional `*-resources.js`, `assets/expanded-editions.js` | Other runtime editions, resource data, area registry | Preserve IDs, phone, source URL, categories and source dates |
| `assets/discovery-data.js` | 13 general discovery topics, prepared ZIP search and associated area suggestions | Do not imply ZIP means eligible or county-exclusive |
| `assets/maps/*` | Geometry, region naming/crosswalk, map source metadata | Keep GEOIDs and attribution/version; geometry is approximate |
| `location-plan.json` | 41-location *research plan*, explicitly not a production manifest | No automatic publication |
| `research-ledger.json` | 1,181 research resource placements; verification state pending local review | Separate from runtime 3,487 edition-listings |
| `source-registry.json` | 250 evidence-source pages and source-check metadata | Never manufacture source evidence |
| `research-checklist.csv` | 656 research category-coverage cells | Preserve category and source mapping |
| `review-sheets/pending/` | 41 locally pending reviewer CSVs | No claiming locally accepted/available assistance |
| `review-sheets/ssf-verified-resource-registry.json` | Other resource review registry | Preserve; validate on editorial changes |
| `baseline/data-integrity.json` | SHA-256 and byte counts for 201 protected source/brand files | Update only after reviewed and documented intended changes |

## Observed schema examples

`review-sheets/locations.json` entries include `id`, `file`, `constant`, `name`, `type` (`city`, `county`, `metro`, `municipality`), `state`, `state_code`, `reviewed`, optionally `country`, `register`, `generate`, coverage and routing metadata. They are not a comprehensive ISO or postal standard.

A runtime resource in the original manual modules includes `id`, `title`, `categories`, `keywords`, `source`, `scope`, `summary`, `next`, `phone`, `phoneDisplay`, `url`; some records add `address`, `featured`, `priority`, and status-specific fields. Preserve original fields while a future canonical serializer is evaluated. No universal schema is presently guaranteed across all modules.

A research-ledger entry includes `resource`, `category`, `categories`, `scope`, `phone`, `url`, `next_step`, `source_id`, `local_route`, `source_checked_on`, `verification_status`, `row_id`, and `location_id`. Those records have `source_checked_local_review_pending` status, not an availability guarantee. `source-registry.json` entries include source ID, URL, title, access method, date, status and evidence summary. A validated page is not a provider-answered phone call.

The 41 research guide validation specifies `source_checked_on = 2026-11-18`; its generated `validation-report.json` has a hardcoded `checked_on` date. A fresh validator pass must not be described as fresh external re-verification. A separate offline audit indicates stale source checks independently of data integrity.

## Identifier and provenance rules

- Edition `id` is immutable once public and is used in `find-help.html?area=<id>`; public page aliases need tested redirects.
- Georgia county parameter is stable five-digit Census GEOID; do not substitute county name slug.
- Phone numbers have machine-readable dialing and human display forms. **Do not create voice `tel:` links for text-only services.**
- Official URL must be a trusted scheme, traceable source, and accurate contact target. URLs can be inaccessible to robots while still working for humans.
- `reviewed` and `source_checked_on` are provenance dates; `published`, `available_now`, `locally_verified`, and `eligible` are **different claims**.
- Country hierarchy and postal formats must be country-defined. USPS ZIPs and Census ZCTAs differ; one postal code may map to multiple counties; no synthetic mappings.
- Show unknown, not “none”, when evidence is absent. Never mark a provider unavailable based solely on a bot-blocked result.
- Handle non-ASCII names (Bayamón, Valparaíso), diacritics and aliases without dropping display fidelity.

## Data-integrity release gates

Run `python scripts/phase1-data-baseline.py` before and after non-data refactors, plus both validation suites. If data intentionally changes, log reviewer approval, field-level change, source and date, regenerate only the appropriate generated output, re-check IDs and links, **then** consciously write a new integrity snapshot. Build a record-level manifest comparison in Phase 2 so intentional updates can be reviewed without masking unrelated field changes.

## Phase 2 contracts (implemented and offline-validated)

`assets/coverage-index.js` exposes `window.SSF_COVERAGE = {schema: 1, guides, countries, regions}`. `guides[id]` projects only `id,name,label,shortLabel,country,state,stateCode,reviewed` if present. `countries[code]` and `regions[country:stateCode]` are ordered guide ID arrays. The 5 country/territory route groups and 35 region keys are existing registry groupings, not authoritative national subdivisions. No resource records or crisis routing are in this file. Absence of guide IDs means no linked SSF guide in this index, not no available assistance.

`reference/place-catalog.json` is an offline generated route-catalog example, not a new gazetteer and not loaded by the homepage. Schema 1: `places` object keyed by namespaced `id` (string), with `kind`, `name`, `countryCode` (existing SSF route code), `parentId` (nullable stable ID), `authorityId` (nullable string), `authority` (description of ID system), `source` (relative provenance document), `guideIds` (existing IDs), `route` (relative navigational URL). Kind values are `country-or-map-unit`, `territory`, `state-or-federal-district`, `county`, `region`, `borough-or-city`. `country:<code>` uses source map units, including non-ISO and disputed-area route codes; it is not a sovereignty statement. PR retains separate guide routing and existing US territory parent. `US:state:<postal-abbreviation>` and `US:county:<5-digit GEOID>` distinguish codes; `GB:borough:<GSS code>` and `GB:region:greater-london` preserve source hierarchy/grouping (intermediate administrative levels not asserted). The borough route points to its existing guide because no independent borough query route existed. Guide coverage is a many-to-many association; Atlanta appears under two counties because its documented city coverage spans portions, not all residents. Additional administrative types may be added only with sourced names, parents and stable IDs. Multiple aliases or alternative hierarchies are future optional fields; no inferred aliases were generated. No deduplication of source country map-unit codes into sovereign states has been attempted.

`postalGuideAssociations[]` contains `guideId`, `codes[]` (strings preserving leading zero), `postalSystem`, `relationship`, `source`. The 63 existing ZIP suggestion groups are carried verbatim as guide suggestions. They are not verified ZIP-to-county associations, USPS address validation, Census ZCTAs or eligibility boundaries. Preserve overlaps (e.g. Carmel/Indianapolis) and disclose alternatives. New geographic postal relations need dated authoritative source, methodology, code type, relationship, coverage limits and possible multiple place IDs; if evidence is absent, do not display a county ZIP list. No non-US postal format inferred.

### Geometry provenance and reuse

| Geometry | Source/version/scale | License / attribution | Caveat |
|---|---|---|---|
| World and Caribbean | Natural Earth Admin 0 Map Units v5.1.1, 1:110m / 1:50m; `assets/maps/OVERVIEW-SOURCE.md` | Public domain, [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/); preserve credit | Generalized orientation, map units not sovereignty determinations |
| US states and DC | Census 2024 Cartographic Boundary Files, 1:20m; `assets/maps/US-STATE-SOURCE.md` | U.S. federal government geographic work, public-domain treatment under 17 USC 105; preserve Census credit, confirm exact source archive metadata before any new redistribution | Alaska/Hawaii insets; approximate small-scale geometry |
| Georgia counties | Census 2024 Cartographic Boundary Files, 1:5m; `assets/maps/GA-COUNTY-SOURCE.md` | Same Census attribution and public-domain treatment | 159 counties; five-digit GEOID; not legal/survey or provider boundaries |
| Greater London | GLA statistical GIS boundary files, 2011 layer; `assets/maps/LONDON-SOURCE.md` | OGL v2, National Statistics data and Ordnance Survey data © Crown copyright and database right [2015]; preserve exact source credit | Generalized shapes, 32 boroughs + City of London |

Census source: [2024 cartographic files](https://www.census.gov/geographies/mapping-files/2024/geo/carto-boundary-file.html) and [cartographic file description](https://www.census.gov/programs-surveys/geography/technical-documentation/naming-convention/cartographic-boundary-file.html); existing bundled geometry retained byte-identically. Source ZIPs were not independently downloaded/relicensed. All source records remain as supplied.

### Record integrity

`baseline/record-integrity.json` contains one canonical JSON SHA-256 digest per edition metadata record and listing placement, plus ordered resource IDs, routing and emergency digests, discovery and urgent classifier and map crosswalk digests. Object keys sorted recursively, arrays preserve order. Compare both guide and `(guideId, resourceId)` identities; repeated provider IDs across guides are legitimate. Every serializable field (including URLs, dates, contact, next steps, categories and source values) participates in the digest. This complements the immutable byte-level Phase 1 manifest; it does not independently establish accuracy of providers. Generator is deterministic; CI fails on stale generated files, missing IDs or changed field values and names the affected guide/listing. The baseline is not automatically updated.

## Phase 3 derived navigation data

`assets/phase3-region-search.js` is generated from the existing map state names and Georgia county name/identifier map (51 and 159 respectively); it is not a worldwide gazetteer or new source. `assets/phase3-postal.js` is a projection of existing protected guide-level ZIP suggestions (63 guide groups); these are examples of guide associations, not county coverage, USPS delivery-boundary or ZCTA mappings. No new postal association, verification date or eligibility claim. Validate freshness with the corresponding `scripts/phase3-region-search.cjs` and `scripts/phase3-postal.cjs`; regenerate only derived outputs after editorial review of source changes. Immutable record and file baselines remain separate and unchanged.

## Phase 5 presentation boundary

No canonical changes. `SSF_SEARCH_VOCABULARY` is a category-to-phrase mapping in UI code, not provider data or an urgent classifier. No explicit uniform resource-type/eligibility schema, so source/summary/next remain unmodified and no invented labels. Runtime `data-resource-id` is scoped to the loaded guide; handout key remains the original pair. Guide date shown as guide source check, never a per-record new verification.

## Phase 6

No schema change. Existing handout selection session key contains ordered JSON-stringified `[areaId, resourceId]` pairs; canonical scope/source/urgent/summary/next/contact/address/URL and guide reviewed date rendered, no new provider claims. Large print is in-page only, not stored. PDF is a derived public sheet, not a source record; no source date rewrite.
