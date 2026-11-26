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

test('a completed task can be toggled off and back on', async () => {
  const server = await start();
  const base = `http://localhost:${server.address().port}/api/tasks`;
  try {
    const created = await (await fetch(base, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Toggle regression' })
    })).json();
    const toggle = () => fetch(`${base}/${created.id}/toggle`, { method: 'PUT' }).then(res => res.json());
    assert.strictEqual((await toggle()).completed, 1);
    assert.strictEqual((await toggle()).completed, 0);
    assert.strictEqual((await toggle()).completed, 1);
  } finally {
    server.close();
  }
});
