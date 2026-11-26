# Eval Test Plan — pstack vs ai-workflow-kit (~1.5 days)

Goal: exercise the **headline, user-facing** skills of both packs on the
`skills-demo` app, head-to-head where an analog exists, and record enough to
write an honest comparison in `REPORT_TEMPLATE.md`.

Scope note for the report: pstack ships ~60 skills, but most are `principle-*`
entries the `poteto-mode` router applies *automatically* — you don't invoke
them directly. This plan tests the skills you actually drive. List tested vs.
untested skills in the report rather than claiming a full sweep.

---

## Pre-flight

1. Confirm Codex sees the skills (it loads them when you mention them by name):
   ```bash
   ls .adal/skills        # pstack skill names
   codex --enable skills  # if not already enabled
   ```
2. You're on `main` with the baseline commit. Commit this plan so it survives
   resets, then branch per pack:
   ```bash
   git add TEST_PLAN.md && git commit -m "add test plan"
   ```

## The loop (per task)

1. On the pack's branch, run the prompt in Codex.
2. `git add -A && git commit -m "<task-id>: <what it did>"`
3. Ping me ("done, pstack A1" or paste Codex's summary) — I read the diff and
   run `npm test` from here for an independent verdict.
4. Record observations in `REPORT_TEMPLATE.md`.

Branches:
```bash
git checkout main && git checkout -b pstack            # do every task here first
# ...later...
git checkout main && git checkout -b ai-workflow-kit   # repeat the same tasks
```
Compare at the end: `git diff main..pstack` vs `git diff main..ai-workflow-kit`.

---

# Phase A — Core engineering loop (head-to-head)

### A1 — Debug: toggle won't un-complete
*Root cause: the toggle endpoint hardcodes `completed = 1` instead of flipping.*

- **pstack:** `Use poteto-mode to fix this bug: clicking a completed task does not un-complete it. Find and fix the root cause.`
- **ai-workflow-kit:** `Fix the bug where a completed task can't be toggled back to incomplete.` → then `/ak-review`, then `npx ai-workflow-kit risk`
- **Exercises:** poteto-mode routing, principle-fix-root-causes, principle-prove-it-works // ak review + risk
- **Record:** found the real cause vs. a patch? Did it add/run a test? How much steering?

### A2 — Feature + tests: reject empty titles
*Empty/whitespace titles are silently accepted; should be a 400.*

- **pstack:** `Use tdd to reject empty or whitespace-only task titles with a 400 — write the failing test first, then the fix.`
- **ai-workflow-kit:** `Reject empty/whitespace titles with a 400 and add tests.` → `npx ai-workflow-kit verify <slug>` → `npx ai-workflow-kit risk`
- **Exercises:** tdd, principle-test-behavior-not-implementation // verify (exit-0 gated), risk
- **Record:** genuinely test-first? Test quality? Did `verify` actually run the commands?

### A3 — Review the branch diff before a PR
- **pstack:** `Use interrogate to adversarially review the diff of this branch vs main and flag what's risky before a PR.` (then optionally `Use correct to fix the issues interrogate raised.`)
- **ai-workflow-kit:** `/ak-review` → `npx ai-workflow-kit risk` (base = main)
- **Exercises:** interrogate, correct // ak-review, risk
- **Record:** real risks vs. noise? Useful prioritisation? False positives?

---

# Phase B — Design & exploration (pstack strengths; log ai-workflow-kit gaps)

### B1 — Architect a feature: multiple task lists
- **pstack:** `Use architect to design support for multiple task lists (projects): data model, API, and UI changes. Design only — no code yet.`
- **ai-workflow-kit:** no design skill — do it plainly (`Propose a design for multiple task lists`), then `/ak-review` the notes. Record that there's no analog.
- **Exercises:** architect, principle-model-the-domain, principle-exhaust-the-design-space // (ak gap)

### B2 — Arena: compare approaches for due-date reminders  *(pstack signature)*
- **pstack:** `Use arena to propose and compare 2-3 approaches for adding due dates with reminders, then recommend one with trade-offs.`
- **ai-workflow-kit:** no analog — record the gap (this is a sharp differentiator).
- **Exercises:** arena // (ak gap)

### B3 — Figure-it-out: a deliberately vague ask
- **pstack:** `Use figure-it-out: "make the task list feel faster and more responsive." Produce an auditable plan before touching code.`
- **ai-workflow-kit:** same vague ask, plainly — compare how it copes with ambiguity.
- **Exercises:** figure-it-out, principle-foundational-thinking // (ambiguity handling)

### B4 — Statechart: model task state *(optional, pstack-only)*
- **pstack:** `Use statechart to model a task's lifecycle (active ⇄ completed, plus deletion) and check the toggle logic against it.`
- **Exercises:** statechart

---

# Phase C — Rigor: impact, migration, verification

### C1 — Breaking change + migration: reshape the API
- **pstack:** `Use poteto-mode to change GET /api/tasks to return {data:[...], count} and migrate the frontend to match. Identify the blast radius first.`
- **ai-workflow-kit:** `Change GET /api/tasks to return {data:[...], count} and update the frontend.` → `npx ai-workflow-kit risk` (risk scoring should shine on a multi-file change)
- **Exercises:** blast-radius, principle-migrate-callers-then-delete-legacy-apis // risk
- **Record:** did it catch every caller (frontend `api.js`, tests)? Did risk flag the right files?

### C2 — Verifiable feature: pagination with proof
- **pstack:** `Use create-verification-skill to add pagination to GET /api/tasks (?limit & ?offset) and build a verification that proves it works.`
- **ai-workflow-kit:** `Add ?limit & ?offset pagination to GET /api/tasks`, define verify steps, then `npx ai-workflow-kit verify <slug>`
- **Exercises:** create-verification-skill, principle-prove-it-works // verify (machine-checkable plan)
- **Record:** is the "proof" real (commands that exit 0) or just prose?

---

# Phase D — Output quality & ship process

### D1 — Unslop: clean up verbose code *(pstack-only)*
- First, have one pack implement something intentionally verbose (or point at a chatty file), then:
- **pstack:** `Use unslop (and no-comments) to clean up <file>: strip filler comments and make it read plainly without changing behaviour.`
- **ai-workflow-kit:** no direct analog — record the gap.
- **Exercises:** unslop, in-your-own-words, no-comments // (ak gap)

### D2 — Ship flow: commits, PR, hooks vs. decision trail
- **ai-workflow-kit:** use its commit/PR workflow to make a conventional commit and open a PR; note whether git hooks fire and what they gate. *(ak strength)*
- **pstack:** `Use show-me-your-work for an autonomous run of <a small task> so I get a reviewable decision trail.`
- **Exercises:** show-me-your-work // commit/PR conventions + hooks
- **Record:** which gives more confidence before merging, and why?

### D3 — Swarm: parallel agents *(optional, pstack-only)*
- **pstack:** `Use swarm to work on two independent tasks in parallel: (1) add a task-count badge to the UI, (2) add a DELETE-all endpoint.`
- **Exercises:** swarm // (ak gap) — note this needs an agent that supports parallel subagents; record if Codex can't.

---

# Phase E — Synthesis

1. `git diff main..pstack` and `git diff main..ai-workflow-kit` — eyeball the totals.
2. Fill the scoring table in `REPORT_TEMPLATE.md` (install, output quality, rigor/verification, speed, workflow fit).
3. Write the TL;DR last.

---

## Coverage matrix

| Capability | pstack skill(s) | ai-workflow-kit | Task |
|---|---|---|---|
| Debug / root cause | poteto-mode, fix-root-causes | plain + review | A1 |
| Feature + tests | tdd | plain + verify | A2 |
| Code review | interrogate, correct | ak-review | A3 |
| Risk scoring | (via review) | risk | A3, C1 |
| Design | architect, model-the-domain | — gap | B1 |
| Solution comparison | arena | — gap | B2 |
| Ambiguity → plan | figure-it-out | plain | B3 |
| State modelling | statechart | — gap | B4 |
| Impact / migration | blast-radius, migrate-callers | risk | C1 |
| Verification | create-verification-skill, prove-it-works | verify | C2 |
| Output cleanup | unslop, no-comments | — gap | D1 |
| Ship / audit | show-me-your-work | commit/PR + hooks | D2 |
| Parallel execution | swarm | — gap | D3 |

**Not directly tested** (applied indirectly by poteto-mode, or out of scope):
most `principle-*` skills, plus recall/reflect/reframe/sharpen/teach/
technical-writing/ketchup/make-bot-ui/benchmark-checklist/automate-me. Note
this in the report.
