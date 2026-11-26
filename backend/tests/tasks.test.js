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

test('DELETE tasks clears the collection', async () => {
  const server = await start();
  const base = `http://localhost:${server.address().port}/api/tasks`;
  try {
    await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'clear me' }) });
    assert.strictEqual((await fetch(base, { method: 'DELETE' })).status, 204);
    assert.deepStrictEqual(await (await fetch(base)).json(), []);
  } finally { server.close(); }
});
