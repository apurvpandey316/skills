# Verify pagination

From the repository root, install the backend dependencies and run:

```sh
npm --prefix backend install
.agents/skills/verify-tasks/scripts/verify-pagination.cjs /tmp/tasks-pagination-evidence.txt
cat /tmp/tasks-pagination-evidence.txt
```

The executable starts the real API with an empty disposable SQLite database on an ephemeral port. It creates five tasks through POST, checks the unpaged list, two full pages, the partial last page, an out-of-range page and offset-only query, and asserts 400 responses for invalid inputs. It exits nonzero on a failed assertion; it closes the server and removes scratch data while preserving the evidence file. Results are deterministic because equal timestamps use descending task IDs. Omitted limit means unlimited, omitted offset means zero; supplied limit must be a positive integer and offset a non-negative integer. The response remains an array on this branch.
