const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../server');

function start() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('GET /api/health returns ok', async () => {
  const server = await start();
  const { port } = server.address();
  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
  } finally {
    server.close();
  }
});

// NOTE: there are deliberately NO tests for toggle behaviour or for
// title validation yet. That gap is part of the exercise.

test('pagination limits and offsets results and rejects invalid input', async () => {
  const server = await start();
  const base = `http://localhost:${server.address().port}/api/tasks`;
  try {
    const all = await (await fetch(base)).json();
    const page = await (await fetch(`${base}?limit=1&offset=1`)).json();
    assert.ok(all.length >= 2);
    assert.deepStrictEqual(page, all.slice(1, 2));
    for (const query of ['limit=0', 'limit=101', 'offset=-1', 'limit=abc']) {
      assert.strictEqual((await fetch(`${base}?${query}`)).status, 400);
    }
  } finally { server.close(); }
});
