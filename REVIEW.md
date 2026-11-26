## Review: A1 and A2 against main

### Critical
- None found in the intended API paths.

### Important
- `backend/db.js`: The database does not constrain `completed` to 0/1. The toggle assumes that invariant; externally inserted non-binary values would produce non-binary results. Existing API writes only 0/1, so consider a CHECK constraint or normalization if external writes are supported.

### Suggestion
- Cover missing/non-string titles and the missing task toggle response as additional edge cases.

### What's good
- Toggle is a single atomic SQL update. API tests exercise both directions and whitespace rejection.

### Risk (base main, six months)
- backend/routes/tasks.js: MEDIUM, 3 commits, 1 fix, churn 42.
- backend/tests/tasks.test.js: MEDIUM, 3 commits, 1 fix, churn 48.
- NOTES.md: MEDIUM, 2 commits, 1 fix, churn 16.
- specs/a2-validation/plan.md: low, 1 commit, 0 fixes, churn 3.

History is sparse; these are review priorities, not findings. No matching full SDD spec was present; the A2 verify plan was inspected. Seed and three backend tests passed.
