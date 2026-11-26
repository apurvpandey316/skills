# A3 adversarial review

Intent: toggling a completed task must make it incomplete, and empty or whitespace-only task titles must be rejected with HTTP 400.

## Verified finding, fixed

The A1 regression test created a task in the application's persistent database without deleting it. After `cd backend && npm run seed && npm test && npm test`, querying `SELECT count(*) AS count FROM tasks WHERE title = 'Toggle regression'` returned `{ count: 2 }`. Repeated test runs polluted the task list. The toggle reviewer found this; I reproduced it and added cleanup through the DELETE API in a `finally` block. The same sequence now returns `{ count: 0 }` and the suite passes.

## Other review

The validation reviewer exercised empty, whitespace-only, nonbreaking-space, valid, padded valid, null, and numeric titles against the A2 API. Invalid titles returned 400; valid titles returned 201 with their text retained. No other verified findings were reported. No proposed findings were dropped. Review used two targeted adversaries, not the full multi-model arena; no claim of exhaustive coverage is made.
