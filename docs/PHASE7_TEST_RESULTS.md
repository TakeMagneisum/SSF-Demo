# Single Step Forward 2.0 — Phase 7 independent QA evidence

**Release gate failed / not accepted.** Feature freeze. Source: supplied complete Phase 6 ZIP, SHA-256 `6b3a3a4c823db33fb7b036b14aa0f433ba739e3208b59bc4e9326d0e0aaea3a6`. Linux 6.18.57 x86_64, Node 22.16.0, Python 3.13.5; Chromium 144.0.7559.96 launch only; PyMuPDF 1.26.7, OpenCV 4.13.0, NumPy 2.3.5. No live sources/provider requests, deployment or production configuration changes.

## Gates and reproducibility

| Command | Initial | Final / disposition |
|---|---|---|
| `python scripts/phase6-run.py` | Exit 0; 37 individual checks | Exit 0 within final runner |
| `python scripts/phase6-http-smoke.py` | Exit 0; 38th check | Exit 0 |
| `node scripts/phase6-pdf.cjs /tmp/ssf7-pdf` | Exit 0 | Exit 0, separate final scratch directory |
| `python scripts/phase6-render-check.py /tmp/ssf7-pdf` | Exit 0 | Exit 0, separate final scratch directory |
| `python scripts/phase4-browser-smoke.py` | Exit 1; first navigation blocked by administrator | No browser assertions executed; all device gates pending, no bypass |
| `node scripts/audit-resources.js --offline` | Exit 0 in scratch copy only | 0 broken, 1 stale, 0 blocked, 0 warnings; not a live check |
| `python scripts/phase7-run.py` | Not applicable | Exit 0: 7 command groups = 38 prior + 5 new regression checks |
| `node scripts/phase7-urgent-review.cjs` | Independent probes | **Exit 2: 5 discrepancies / 11 probes. Release gate failed.** |

Exact output: `qa/phase7-initial.txt`, `qa/phase7-final.txt`, `qa/phase7-browser.txt`, `qa/phase7-audit.txt`, `qa/phase7-urgent-review.txt`, `qa/phase7-final-pdf.txt`. Source audit ran on a temporary copy, not on the archival audit reports. Final runner includes Phase 5 harness extension exercising missing classifier, 424 original mixed urgent cases and all earlier checks. No old assertions removed except version expectations updated for actual changed assets. Static HTML check 66 files, 1,207 resolved local references, no main/legacy issues. New standalone source scan 24 editable pages with no-referrer and 42 historical pages not upgraded; no remote runtime asset tags or editable external HTTP(S) target-blank without both rel values; no CNAME/noindex regressions. Not a traffic capture. No source verification dates changed.

## Findings register

| ID / severity | Reproduction and observed defect | Disposition / verification |
|---|---|---|
| P7-01 Major; safety implications | Open `assets/find-help.html?area=london-enfield`; source lacks expanded registry and handout dependencies, US referral unconditional. Nested full finder missing Savannah/Chatham picker entry and newer links/styles. | Full canonical markup at all three original URLs; no redirect; scoped referral and full dependencies; all 106 IDs at each route returned exact HTTP 200, 25 startup and 4 optional assets each; old fragment IDs and HTTP(S) links retained. Real browser pending. |
| P7-02 Critical under failed load | Remove urgency script in simulated finder; Phase 6 fallback classifier always empty, ordinary results for urgent input. | Disable situation and example controls, show explicit failure and neutral emergency instruction, preserve topic browse; direct submit guarded. Simulation passes. Device failure test pending. |
| P7-03 Major print safety | Directory urgent search, inspect `styles.css` print rule hiding all answer panels, including active urgent result. | Higher-specificity print-only override for visible urgent answer, hides controls, black-on-white. Static rule verified; native print preview not verified. |
| P7-04 Minor | Denied Clipboard API and legacy `execCommand` false or throw: misleading success or uncleared helper. | Actual discovery handler simulation checks denial, missing clipboard, fallback false/throw, cleanup, manual address, success/cancel. No new external destination. |
| P7-05 Minor privacy | Finder says text not saved without browser retention caveat. | Application-level wording and explicit browser/device caveat. Static markup all routes. |
| P7-06 Critical safety review, OPEN | Synthetic classifier probes “my baby stopped breathing”, “my friend is choking”, “I am having a stroke” → ordinary instead of emergency. “I do not have chest pain” → emergency; “suicide prevention training” → suicide rather than ordinary. | Frozen classifier hash protected in record snapshot. No unapproved change; **release blocked**. Explicit safety/editorial review and authorization required, then bilingual variant/priority/false-positive/negative tests and human review. These are selected probes, not a statistical sensitivity/specificity estimate. |
| P7-07 Major verification blocker, OPEN | Chromium administrator policy refuses local URL at first navigation. | Real browser desktop/phone/AT/print/zoom/forced colors/history/BFCache/network/hosted tasks blocked or not run; use external matrix. No bypass. |
| P7-08 Minor/major depending on context, OPEN | 42 historical pages lack newer no-referrer meta; partial Spanish localization; no tagged accessible PDF; one stale review and Omaha pet-assistance gap. | Preserve historical bytes; editorial/accessibility review and scoped authorization needed; no new source claims. |

A finder URL without an explicit area can still use remembered/default Liberty guide; existing labels state numbers are guide-specific rather than inferred physical location. Verify comprehension in external QA. No guarantee of medical triage; fixed wording is not a safety classifier certification. Public service release must not rely on this literal phrase matcher for emergency assessment.

## Protected parity and actual generated PDF

201 protected files, both baseline JSON snapshots and `assets/urgent.js` byte-identical to input. Record-level hash parity: 106 IDs, 3,487 placements/full fields/order, original urgent targets, 13 topics, 16 categories, 51 US states, 159 Georgia counties, 33 London boroughs, 41 separate pending drafts. No new geographic/source data, no removed input files. Home/map still metadata-only. Actual PDF fixture generation using original records repeated final: standard 1 page 83,450 bytes, large 5 pages 118,834 bytes, 18 link annotations checked; 15/15 QR symbols decoded by software from actual rendered pages; all fixture text and bounds checks pass. Font coverage across all 3,487 placements. Not native printing, physical QR scan, direct browser download, accessible tagged PDF, or user acceptance.

## Static payload measurements

`python scripts/phase7-measure.py <phase6.zip>`; exact CSV `qa/phase7-payload.csv`. External JS+CSS tags and raw bytes (sum of referenced files), gzip estimate independent per file. No measured browser transfer/cache/CPU/load latency. Optional PDF assets unchanged, local and lazy; directory still needs full cross-guide registry.

| Page | Phase 6 → Phase 7 raw bytes | Tag count |
|---|---:|---:|
| Home | 365,177 → 365,491 | 15 → 15 |
| Explore map | 385,753 → 385,753 | 14 → 14 |
| Canonical finder | 3,599,803 → 3,600,977 | 25 → 25 |
| Discovery | 225,754 → 226,068 | 9 → 9 |
| Oldest finder | 2,641,819 → 3,600,977 | 17 → 25 |

Legacy increase intentional: complete registry, QR/PDF/handout/prep dependencies and parity rather than incomplete task support. No speed claim. See `PHASE7_ADR.md` for decisions and rollback; `PHASE7_EXTERNAL_QA.md` for exact runnable external matrix; `PHASE8_PROTOCOL.md` for controlled volunteer testing. Remote CI and actual hosted paths unverified. No production migration or Florida until explicit accepted signoff.
