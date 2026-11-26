# feat(tasks): show incomplete task count

## What does this PR do?
Show the number of incomplete tasks beside the heading so users can see their remaining work.

## Main changes
- `frontend/src/App.jsx`: derive the count from the current task list and provide an accessible label.

## Review focus
Human review required: no (kit risk signal; sparse history).

| Need | File | Why |
|---|---|---|
| LOW | frontend/src/App.jsx | Quiet history: two commits, no fixes in six months. |

## Test plan
- [x] Frontend production build.
- [ ] Manually verify count after adding, completing and deleting tasks.

## Notes for the reviewer
Count reflects the fetched list. The existing API's toggle behavior is unchanged. Suggested label: low-risk, subject to repository availability. No PR was opened; this is a local reviewable description.
