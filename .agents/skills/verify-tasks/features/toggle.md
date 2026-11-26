# Toggle a task

A user clicks a task to change its completion state.

## Sub-features

- Complete and un-complete a task.

## How to get to it (user POV)

- Click a task title in the list, or PUT `/api/tasks/:id/toggle`.

## Driving it with HTTP and browser

Preconditions: create a task in the isolated backend and record its ID. Run `curl -fsS -X PUT http://127.0.0.1:39181/api/tasks/ID/toggle` twice, replacing ID with that recorded ID. Require completion values 1 then 0. In the UI click the same title twice and check the done styling and GET result after each click.

## Gotchas

- On main the second toggle remains 1. Report the failure; do not weaken the expectation.
