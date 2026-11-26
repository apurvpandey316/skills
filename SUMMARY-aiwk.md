# ai-workflow-kit evaluation

| Task | Skill / command | Goal | Tests / checks | Verdict |
|---|---|---|---|---|
| A1 toggle | ak-review, risk | Met | 2 backend tests pass, including toggle | Atomic toggle works; risk history was sparse. |
| A2 validation | verify, risk | Met | 2 backend tests pass; verify executed and exited 0 | Verify ran the specified proof and ticked its step. |
| A3 review | ak-review, risk | Met | 3 backend tests pass | Combined review found the unenforced binary completion invariant; scores were recorded. |
| B1 multilist | plain, ak-review | Met | Not run; design only | Review helped surface migration and compatibility risks; no architect analog. |
| B2 due dates | plain | Met | Not run; design only | Three approaches compared by the agent; no arena analog. |
| B3 responsive | plain | Met | Backend test and frontend build pass; no browser test | Loading and retry feedback provides a small first step; no figure-it-out analog. |
| B4 statechart | plain | Met | Not run; analysis only | State model exposed the main branch toggle defect; no statechart analog. |
| C1 API shape | risk, ak-review | Met for repository caller | 2 backend tests and build pass; no browser E2E | Risk listed the changed frontend caller but cannot discover untouched clients. |
| C2 pagination | verify, risk | Met | 2 backend tests and build pass; verify executed and exited 0 | Verification was real but depends on authored tests; default cap limits the current UI to 100. |
| D1 cleanup | plain | Met | Backend test passes | Cleanup retained behavior; no unslop analog. |
| D2 ship flow | ak-commit, ak-pr, risk | Met locally | Frontend build passes; manual interaction not run | Conventional commit and structured local PR description; no active hooks fired or remote PR opened. |
| D3 two tasks | plain | Met | 2 backend tests and build pass | Sequential implementation and DELETE test; no swarm analog. |

## Overall

Risk was most useful as a per-file review ordering and an explicit warning about sparse history; it is not a correctness finding and cannot trace unchanged callers. It also included untracked plan files before commits. Verify actually ran the defined commands and gated checkboxes on exit status, but the quality of proof is limited by the authored checks. The commit/PR workflows provided a conventional message, review focus and honest test plan; installed Git hooks were absent, so no hook checks were observed. No remote PR was opened.

The kit lacks dedicated equivalents for architect, arena, figure-it-out, statechart, unslop and swarm in these tasks; the agent handled each plainly. Compared with a full task driver, the kit supplied focused review and verification tools but did not itself orchestrate the end-to-end multi-branch evaluation or preserve a comprehensive decision trail. This is based on this run, not a head-to-head execution of pstack. A1's note incorrectly claimed a database constraint; A3 corrected it: the schema does not enforce binary completion.
