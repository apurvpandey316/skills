# Due dates and reminders: arena

## Frame

The current app is a single-user React client, Express API and SQLite database. It has no accounts, scheduler or notification provider. Compare approaches on simplicity, recovery, clear user contract, migration/testability, and fit. A reminder's delivery channel is a product choice; no approach should imply an alert while the app is closed unless it provides one.

## Approaches

| Approach | Simplicity | Recovery and reach | Main trade-off |
| --- | --- | --- | --- |
| Browser timer and local storage | Smallest initial change | Timers are throttled and can disappear when the page closes; device-specific state | Fast prototype, weak reliability and cross-device consistency |
| SQLite-backed eligibility, polled in app | No worker or delivery provider; one authoritative task record | Overdue reminders reappear when the app reconnects; polling and outages delay display; no closed-app alert | Recommended for this app if in-app reminders suffice |
| Durable server inbox and scheduled worker, optionally external push/email | More tables, worker and operations; external delivery also needs identity, consent, credentials and retries | Inbox survives restarts and retains history; external channel can reach users outside the app | Better for history or out-of-app reach, but substantially more machinery |

## Recommended design

Store nullable `due_at`, `remind_at`, and `reminder_dismissed_at` on tasks as UTC instants. A versioned migration leaves existing tasks unchanged. Require valid RFC 3339 timestamps with offsets, `remind_at <= due_at`, and no reminder without a due time. UI offers an explicit IANA timezone and resolves ambiguous or nonexistent daylight-saving times rather than silently guessing; date-only semantics need a separate decision. Display the stored instant in the selected zone.

Extend task creation and add `PATCH /api/tasks/:id`: omitted fields are unchanged, explicit null clears them, and invalid combinations return 400. A changed schedule clears dismissal. `GET /api/reminders` derives eligible items from incomplete, undismissed tasks with `remind_at <= now`; an idempotent dismiss endpoint records dismissal. Completion and deletion remove eligibility; reopening revives an undismissed overdue reminder but not a dismissed one. The server clock determines eligibility. React polls while open and on visibility return, displays a dismissible in-app region and errors, and labels the delivery limit clearly. Multiple tabs may show the same item; dismissal is shared. This design does not send OS notifications or guarantee exact timing.

Test schema upgrade with existing rows, validation and null/omission semantics, schedule edits, dismissal, completion/reopening/deletion, overdue recovery after restart, and timezone/DST boundaries with a controlled clock. Check UI polling and failures. Correct the existing main-branch toggle defect before relying on reopening. Authentication and per-user ownership are prerequisites for a multi-user deployment.

## Synthesis and verification

Three independent candidates proposed (1) query-derived in-app reminders, (2) a versioned scheduler and inbox, and (3) a pending/delivered inbox worker. Scoring 1–5 on simplicity, recovery, contract clarity, migration/testability, fit: candidate 1 = 5/4/4/5/5; candidate 2 = 3/4/4/4/3; candidate 3 = 2/4/4/4/3. The independent cross-judge agreed with candidate 1 as the base. Candidate 2 contributed explicit timezone and DST handling; candidate 3 contributed omitted-versus-null semantics and the multi-user boundary. Both worker designs were rejected for this scope because retained history and external delivery are not specified. Candidate 2's proposed overdue reopening policy also needs additional persisted state to match its scheduler query. Candidates converged on persisted schedules, UTC instants, validation and in-app limits. No candidates dropped out. The artifact was checked against current schema, routes and UI; these are design proposals, not measured delivery guarantees. All agents used the available model family; cross-vendor review was unavailable in this harness.
