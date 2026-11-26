# pstack vs ai-workflow-kit — evaluation report

**Author:** Hritik Kumar
**Date:** <!-- fill in -->
**Test bed:** skills-demo (React + Vite / Express + SQLite), 3 tasks (debug, feature+test, review)
**Agent used:** <!-- Claude Code / Cursor / both -->

---

## 1. Summary / TL;DR

<!-- 3-4 sentences: which you'd recommend, for what, and the headline difference. Write this LAST. -->

## 2. What each pack is

**pstack** — Lauren Tan's (Cursor) open-sourced engineering skill pack (~47 skills).
Core is `/poteto-mode`, a router that picks the right playbook per task. Built for
rigor: understand the code → choose a design → verify → review the diff before
claiming done. Notable skills: `/interrogate` (adversarial multi-model review),
`/tdd`, `/figure-it-out`, `/unslop`, `/show-me-your-work`.

**ai-workflow-kit** — bezael's npm pack (`npx ai-workflow-kit`): skills + agents +
git hooks for consistent commit/PR/review. Notable commands: `verify <slug>` (only
ticks a step when its command exits 0), `risk` (scores changed files vs base branch),
`/ak-review` (focuses review on the riskiest files).

## 3. Setup experience

| | pstack | ai-workflow-kit |
|---|---|---|
| Install command | | |
| Time to first run | | |
| Friction / gotchas | | |
| Docs quality | | |

## 4. Task-by-task results

### Task A — Debug (toggle never un-completes)
| | pstack | ai-workflow-kit |
|---|---|---|
| Found root cause? | | |
| Quality of fix | | |
| Verified the fix? | | |
| Hand-holding needed | | |

### Task B — Feature + test (reject empty titles)
| | pstack | ai-workflow-kit |
|---|---|---|
| Approach (test-first?) | | |
| Test quality | | |
| Verified tests pass? | | |
| Hand-holding needed | | |

### Task C — Review the diff
| | pstack | ai-workflow-kit |
|---|---|---|
| Usefulness of review | | |
| Caught real risks? | | |
| Noise / false positives | | |

## 5. Scoring (1–5)

| Criterion | pstack | ai-workflow-kit |
|---|---|---|
| Ease of install | | |
| Output quality | | |
| Rigor / verification | | |
| Speed | | |
| Fit for our team's workflow | | |
| **Overall** | | |

## 6. Recommendation

<!-- Which, when, and why. Note any caveats (e.g. pstack favours Cursor's per-role
models; ai-workflow-kit leans on git hooks / CI). -->
