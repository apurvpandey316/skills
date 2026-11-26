# Task lifecycle

A task begins absent. Successful create moves it to incomplete (completed=0). Toggle moves incomplete to complete (1), and complete back to incomplete (0). Delete from either state moves to absent; toggling or deleting an absent ID returns 404. Failed operations preserve state.

On main, toggle always writes 1: incomplete → complete works, but complete → incomplete is a self-loop and violates the lifecycle. A1 changes the update to `1 - completed` and tests both transitions. This assumes binary values; the current SQLite schema defaults to 0 but does not enforce a CHECK constraint. Concurrent updates are atomic in SQLite; a request can still encounter deletion between its lookup and update.
