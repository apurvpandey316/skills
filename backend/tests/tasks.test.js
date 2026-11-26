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


test('pagination rejects invalid query parameters', async () => {
  const server = await start();
  try {
    for (const query of ['limit=0', 'limit=-1', 'limit=1.5', 'offset=-1', 'offset=abc']) {
      const res = await fetch(`http://localhost:${server.address().port}/api/tasks?${query}`);
      assert.strictEqual(res.status, 400, query);
    }
  } finally {
    server.close();
  }
});
