# Phase 8 — human usability protocol (feature freeze)

Use the complete Phase 7 repository and PHASE7_EXTERNAL_QA.md. This is controlled evaluation, not public release or expansion. **P7-06 and blocked browser gates remain open.** Resolve safety classifier issue with separate explicit authorization before real-world use; do not expose volunteers to unsolicited crisis examples. Only fictional ordinary navigation tasks in Phase 8 until safety gates are closed. No production deployment or live-source contact.

## Recruitment and consent

Aim for 6–10 willing volunteers as a practical first qualitative round, including novice users, older adults, people who already use screen magnification or screen readers, and varied mobile/low-bandwidth access; sample size is not statistical accessibility certification. Invite people to use their familiar device/AT and settings. No need to disclose disability, health, finances, housing, immigration status or reasons for wanting help. Explain demo status, fictional tasks, optional participation and right to stop without explanation. No real emergencies, provider calls, emails, submissions or actual applications. Record only a tester code, device/browser/AT and task outcomes. No recording by default; obtain explicit consent for any screen capture, only fictional data, delete promptly. Never solicit case histories or observe sensitive browser tabs. Keep notes locally with restricted access; agreed deletion deadline, no identities in ZIP or public issues.

## Session flow (20–35 minutes, flexible)

1. Read consent and demo disclaimer. Explain there is no right way to navigate, and participants should avoid entering personal data. Allow break or exit.
2. Observe without coaching initially. Use neutral prompts: “What would you try next?” and “What does this mean to you?” Record task completion independently, with prompt, incomplete, blocked, or stopped. Count wrong turns and assistance requests; time approximate if consented, never penalize accessibility tools or slow users.
3. Assign 4–6 tasks from below, rotate order and device conditions to reduce learning bias. Allow participant's preferred mode; repeat a task with keyboard or AT if they choose and know those tools. Use authorized demo or local environment; no outgoing provider interactions. Ask participants to explain whether a guide promises help (it does not) and how to recover from no results.
4. Debrief with plain questions: “What was unclear?”, “What did you expect?”, “Could you find a different place to start?”, “What would make this easier?” Record observations, not personal stories.

| Task | Fictional scenario / success evidence |
|---|---|
| H01 | Help a fictional person in Liberty County, Georgia find food options using home search or guide picker. They can reach a relevant resource and explain what to confirm first. |
| H02 | Find a reviewed guide for London Enfield using map or text alternatives; identify parent region and scope caveat. No precision gesture required. |
| H03 | Use ZIP 31320 and explore a topic; choose a location with no reviewed guide and explain alternative discovery. No external search required. |
| H04 | Search “groceries” or “help with electricity bill”; choose two topics, remove one, recover from fictional gibberish query. No private text. |
| H05 | Change appearance or text size, use menu, return to original display preferences. Demonstrate readable layout and independent reset. |
| H06 | Open Before You Call or Visit, identify questions about area, cost, hours or interpreter; copy public script only if comfortable. |
| H07 | Select two public resources across two guides, review sheet, return and remove one. Direct PDF save only in disposable local test context; clear sheet when finished. |
| H08 | Simulate slow network/blocked optional geometry with authorized facilitator; find the static list or use alternate navigation. Test safe recovery without interpreting missing data as no help. |

## Worksheet (one row per fictional task)

Tester code: ____  Date/build: ____  Device/OS/browser/version: ____  AT (optional): ____  Viewport/mode: ____  Consent recorded separately: ____

| Task | Outcome (independent / prompted / incomplete / stopped / blocked) | Wrong turns or obstacles | Approx time (optional) | Understanding / recovery | Severity / issue | Retest |
|---|---|---|---|---|---|---|
| | | | | | | |

## Signoff and next steps

Separate engineering regression evidence, observed human outcomes and safety review. Fix demonstrable defects narrowly and rerun exact baselines; do not silently change frozen urgent classifier or source data. Repeat relevant tasks after fixes with at least one independent tester and accessible-device coverage. Require each critical task successful on required profiles without dangerous misleading output, no major task failures unresolved, and explicit safety/privacy/accessibility reviewer and project-owner acceptance. Document any minor deferred issue and rationale. If blocked, stop release progression, not the participant. No claim of WCAG certification, provider availability or representative statistics from this sample. Phase 9 production migration and Phase 10 Florida expansion require separate explicit signoff; neither is authorized by this protocol.
