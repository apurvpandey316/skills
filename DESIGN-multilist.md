# Multiple task lists

## Context and alternatives

Today SQLite owns one `tasks` table, `/api/tasks` exposes the whole collection, and React holds one flat array. Two shapes are plausible: (1) a `lists` table with a foreign key on each task, or (2) a list identifier stored as text on tasks with no list entity. Choose (1): lists have an independent identity and name, empty lists exist, and SQLite enforces membership. One list owns each task; the server owns persistence and the client owns only selection and displayed data.

## Data and migration

Add `lists(id INTEGER PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))` and a non-null `tasks.list_id` referencing `lists(id)`. Enable SQLite foreign keys on every connection; index `(list_id, created_at)`. Choose `ON DELETE RESTRICT` and require an explicit move or deletion of tasks before deleting a non-empty list. Validate nonblank list names at the API boundary. List names need not be unique; IDs are stable identity.

Use a versioned, transactional SQLite migration, not only `CREATE TABLE IF NOT EXISTS`: create lists and a default list, rebuild tasks with the foreign key and copy every existing ID, title, completed value and timestamp into that list, verify counts and foreign keys, then swap tables and update the schema version. Preserve autoincrement behavior. Back up the database before migration; rollback the transaction on failure. Fresh databases follow the same versioned schema. Update seed data to create a default list before tasks.

## API

- `GET /api/lists` returns list objects; `POST /api/lists` creates one from `{name}`; `PATCH /api/lists/:id` renames it; `DELETE /api/lists/:id` returns 204 for an empty list, 409 for a non-empty list, 404 if absent.
- `GET /api/lists/:id/tasks` returns tasks in that list, newest first; `POST /api/lists/:id/tasks` creates a task in it and returns 201. Unknown list IDs return 404; invalid names or titles return 400.
- Existing `PUT /api/tasks/:id/toggle` and `DELETE /api/tasks/:id` retain task-ID semantics. Add `PATCH /api/tasks/:id` with `{listId}` to move a task, atomically checking the destination. Return 404 for missing task or destination and 400 for invalid input.
- During migration of clients, retain `GET` and `POST /api/tasks` as explicit default-list aliases; document and remove them only after callers migrate. No list ID supplied by a client silently selects a different list.

## UI and verification

Load lists on startup and select the default list; show a list selector, creation/rename controls, and an empty-list state. Fetch tasks for the selected ID, discard stale responses after selection changes, and scope creation to that selection. Offer move and deletion with an explanation when the list is non-empty. Preserve task toggling and deletion; surface errors and loading states. Test migration with existing completed and incomplete tasks, IDs and timestamps, foreign-key enforcement, empty lists, move/delete cases, and UI selection races. This is a design only; no implementation is included.
