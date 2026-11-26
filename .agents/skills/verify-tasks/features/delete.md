# Delete a task

A user removes a task from the list.

## Sub-features

- Delete an existing task and confirm it is absent.

## How to get to it (user POV)

- Click the delete button beside a task, or DELETE `/api/tasks/:id`.

## Driving it with HTTP and browser

Preconditions: create a task in the isolated backend and record its ID. Run `curl -i -X DELETE http://127.0.0.1:39181/api/tasks/ID`, replacing ID with the recorded ID; require 204, then GET `/api/tasks` and confirm the ID is absent. In the UI click the button next to the task and verify both disappearance and the GET result.

## Gotchas

- Delete buttons have no accessible name beyond the cross symbol; select the button within the intended task row.
