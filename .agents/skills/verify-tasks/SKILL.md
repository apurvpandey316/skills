---
name: verify-tasks
description: Verify the Tasks app's web UI and Express HTTP API with an isolated database and retained evidence.
---

# Verify Tasks

Read `features/README.md` and the relevant feature file before driving. The primary surface is the React web app; the API is a second surface. Normal development uses `cd backend && npm install && npm run seed && npm start` on port 3001 and `cd frontend && npm install && npm run dev` on port 5173. The seed deletes existing tasks. Never seed a shared instance. Vite proxies `/api` to port 3001, so do not run two normal stacks against the same database or assume an existing port is yours.

## Launch

For pagination proof, from the repository root run `npm --prefix backend install` once, then `.agents/skills/verify-tasks/scripts/verify-pagination.cjs /tmp/tasks-pagination-evidence.txt`. The executable creates an empty disposable backend copy and database, starts the real Express app on an ephemeral localhost port, creates five tasks through HTTP, and owns its teardown. It does not use the normal shared `backend/data` directory. Node 20+ and backend dependencies are required.

For other HTTP journeys, launch an isolated backend copy in a shell that owns its lifetime:

```sh
TASKS_VERIFY_DIR=$(mktemp -d)
mkdir "$TASKS_VERIFY_DIR/backend"
cp backend/server.js backend/db.js "$TASKS_VERIFY_DIR/backend/"
cp -R backend/routes "$TASKS_VERIFY_DIR/backend/routes"
ln -s "$PWD/backend/node_modules" "$TASKS_VERIFY_DIR/backend/node_modules"
(cd "$TASKS_VERIFY_DIR/backend" && PORT=39181 node server.js) > "$TASKS_VERIFY_DIR/server.log" 2>&1 &
TASKS_VERIFY_PID=$!
```

The `Backend running` log line signals readiness. If port 39181 is occupied choose a free port consistently in the following commands. For a UI journey, start a separate Vite server with its proxy pointed at that backend; verify its port and proxy before driving. The default Vite config points to port 3001, not this isolated instance. No authentication is used.

## Doctor

For the manual instance, `kill -0 "$TASKS_VERIFY_PID" && curl -fsS http://127.0.0.1:39181/api/health` must show `{"status":"ok"}`; check the startup log and port ownership correspond to the process just launched. For the pagination helper, its first HTTP operation checks the isolated instance's health, and failures exit nonzero.

## Drive and evidence

Run the pagination helper above. It records created IDs, unpaged and page results, invalid-query outcomes and PASS in the specified evidence file. The helper asserts disjoint consecutive pages, final and out-of-range pages, offset-only behavior and malformed inputs. For manual journeys use the feature map's exact HTTP paths, or drive the UI by its `New task...` placeholder, `Add` button, task title, and delete button. Record each action, responses and resulting state, and UI screenshots when using the browser. Use real HTTP and a real browser, not internal state setters or mocked app behavior. Store evidence outside the scratch directory, for example `/tmp/tasks-pagination-evidence.txt`.

## Cleanup

The helper closes its own server and deletes its scratch database on success or failure; it leaves evidence intact. For a manual run, `kill "$TASKS_VERIFY_PID"; wait "$TASKS_VERIFY_PID" 2>/dev/null; rm -rf "$TASKS_VERIFY_DIR"`. Kill only the process you started. Check the evidence file still exists after cleanup. Use `/maintain-verification-skill` to update this map when behavior changes.
