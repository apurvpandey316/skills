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


test('GET /api/tasks returns an envelope with a matching count', async () => {
  const server = await start();
  try {
    const res = await fetch(`http://localhost:${server.address().port}/api/tasks`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data));
    assert.strictEqual(body.count, body.data.length);
  } finally {
    server.close();
  }
});
