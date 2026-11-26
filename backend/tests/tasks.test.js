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

test('toggle changes a task in both directions', async () => {
  const server = await start();
  const base = `http://localhost:${server.address().port}/api/tasks`;
  try {
    const created = await (await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'toggle test' }) })).json();
    const toggle = () => fetch(`${base}/${created.id}/toggle`, { method: 'PUT' });
    assert.strictEqual((await (await toggle()).json()).completed, 1);
    assert.strictEqual((await (await toggle()).json()).completed, 0);
  } finally { server.close(); }
});
