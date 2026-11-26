# Create a task

A user adds a title to the list.

## Sub-features

- Submit a task and observe it in the list.

## How to get to it (user POV)

- Use the `New task...` field and `Add` button, or POST `/api/tasks`.

## Driving it with HTTP and browser

Preconditions: isolated backend per the skill. Run `curl -fsS -H 'Content-Type: application/json' -d '{"title":"Verify creation"}' http://127.0.0.1:39181/api/tasks`, then `curl -fsS http://127.0.0.1:39181/api/tasks`; the returned task must appear in the list. In the UI enter the title and click Add, then verify the visible title and the GET result.

## Gotchas

- Main permits blank titles; do not treat that as validated input.
