# List and paginate tasks

A user sees tasks in the web list; an API consumer can request pages.

## Sub-features

- List all tasks, page with limit and offset, handle invalid queries.

## How to get to it (user POV)

- Open the app's task list, or GET `/api/tasks`.

## Driving it with HTTP and browser

Preconditions: follow the skill's isolated launch. For the API use `.agents/skills/verify-tasks/scripts/verify-pagination.cjs /tmp/tasks-pagination-evidence.txt` and require exit 0 and PASS in the retained evidence. For UI, start Vite with the isolated backend proxy, open it and check `.task-list .title` against tasks created through the API.

## Gotchas

- Pagination is API-only; the UI currently loads all tasks. The helper does not prove the UI. Equal timestamps are ordered by descending ID.
