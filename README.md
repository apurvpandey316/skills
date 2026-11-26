# Skills Demo — Tasks App

A tiny full-stack Tasks app used to test AI coding-agent skill packs
(**pstack** and **ai-workflow-kit**) on a real, running codebase.

- **Frontend:** React + Vite (`frontend/`)
- **Backend:** Express + SQLite via better-sqlite3 (`backend/`)

The app is intentionally small but *not* perfect — it contains a couple of
real defects and a test gap. That's deliberate: it gives the skills something
genuine to find, fix, and verify.

---

## Prerequisites

- Node.js 18+ (20+ recommended — the backend tests use the built-in test runner and `fetch`)
- npm

## Setup & run

Open **two terminals**.

### 1. Backend

```bash
cd backend
npm install
npm run seed      # creates the SQLite DB and inserts 3 sample tasks
npm start         # http://localhost:3001
```

Check it: `curl http://localhost:3001/api/tasks`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` to the backend.

### Run the backend tests

```bash
cd backend
npm test
```

One health-check test passes. Everything else is missing on purpose.

---

## The test tasks (run each through *both* skill packs)

Do each task twice — once driven by a pstack skill, once by an ai-workflow-kit
skill — and record what happened in `REPORT_TEMPLATE.md`. Reset the code
(`git stash` or `git checkout .`) between the two runs so each pack starts clean.

**Task A — Debug:** "In the app, clicking a completed task doesn't un-complete
it. Investigate and fix the toggle behaviour."

**Task B — Feature + test:** "Empty tasks can be created. Reject blank/whitespace
titles with a 400 error, and add tests that prove it."

**Task C — Review:** "Review the current diff and tell me what's risky before I
open a PR."

For each, note: setup friction, whether the skill found the *root cause* (not
just symptoms), code quality, how much it verified vs. just claimed, and how
much hand-holding you had to do.

---

## Project layout

```
skills-demo/
├── backend/
│   ├── server.js          # express app + health route
│   ├── db.js              # sqlite connection + schema
│   ├── routes/tasks.js    # CRUD endpoints
│   ├── seed.js            # sample data
│   └── tests/tasks.test.js
└── frontend/
    ├── vite.config.js     # /api proxy -> :3001
    └── src/
        ├── App.jsx
        └── api.js
```
