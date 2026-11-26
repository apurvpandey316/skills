# Multiple task lists

## Model and migration
Add `lists(id INTEGER PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL)` and `tasks.list_id` referencing lists. In a transactional, versioned SQLite migration create a default list, rebuild tasks with a non-null foreign key, copy all existing tasks into that list, recreate indexes, and enable foreign keys on every connection. Back up the database first; test migration on populated and empty databases and rollback on failure. Index `(list_id, created_at)`.

## API
Expose `GET/POST /api/lists`, `PATCH/DELETE /api/lists/:id`, and `GET/POST /api/lists/:id/tasks`. Keep existing task operations by id; validate names and list ownership/existence, return 400 for invalid input and 404 for missing resources. Initially reject deletion of nonempty lists with 409; the user can move or delete tasks first. Preserve `/api/tasks` as the default-list compatibility endpoint during migration and document its eventual retirement.

## UI
A list picker and create/rename controls select the active list; task requests are scoped to it. Show loading, empty, and error states; confirm list deletion and explain the nonempty restriction. Keep selection in the URL for linking and handle a deleted list by returning to the default.

## Review
No critical design issue found. Important: SQLite foreign keys must be enabled on every connection, and rebuilding the table needs tested transactional migration and backup. Compatibility routing and nonempty deletion policy should be tested. The model keeps existing tasks and the deletion policy prevents accidental loss.
