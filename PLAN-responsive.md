# Responsive task list plan

## Frame

The current React UI waits for each mutation and a subsequent full refresh. During add, the button gives no indication of work, and repeat submissions are possible. Faster can mean lower actual latency or earlier, truthful feedback; no latency baseline has been measured, so do not claim a speedup. Done for this branch means the add button visibly says `Adding…` and cannot be submitted again while its POST is pending, returns to normal after success or failure, and the production build succeeds. This is a small, reversible client change; no backend or database migration is needed.

## Workflow and decisions

1. Baseline: inspect `handleAdd` and render. Before the change, there is no pending state, disabled button, or pending label. Use the build plus a targeted deferred-request interaction check after the change.
2. Lowest risk: track the add request's pending state, guard repeated submission, and reset it in `finally`. Keep existing server-confirmed updates; do not predict a successful task or alter toggle/delete behavior. Verify pending, success, failure, and retry behavior.
3. Later: show an actionable error for failed requests and check HTTP statuses. Separately measure request and render timings before deciding whether to replace full refreshes with response-based updates or optimistic mutations. Those options need race handling and rollback, especially with the current toggle bug on main.

## Decision trail

- Baseline: add had no visible pending feedback and no duplicate-submission guard. Hypothesis: immediate pending feedback makes the wait understandable without claiming a network speedup.
- Scope: implement step 2 only. More invasive optimistic updates are deferred until API error and concurrency behavior are designed.
- Verification: Vite production build passed. A headless Chrome check against the real UI intercepted API calls and held the POST open: the button displayed `Adding…` and was disabled; after success and an aborted network request it returned to `Add`, and a retry made a third POST. The current app does not show an error on failure; that remains a separate item above.
