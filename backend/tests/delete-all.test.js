const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

test('DELETE /api/tasks clears the list and is repeatable', async () => {
  const root = path.resolve(__dirname, '..');
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-delete-test-'));
  let server;
  try {
    for (const file of ['server.js', 'db.js']) fs.copyFileSync(path.join(root, file), path.join(scratch, file));
    fs.cpSync(path.join(root, 'routes'), path.join(scratch, 'routes'), { recursive: true });
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
    const app = require(path.join(scratch, 'server.js'));
    server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const url = `http://127.0.0.1:${server.address().port}/api/tasks`;
    for (const title of ['one', 'two']) {
      const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title }) });
      assert.equal(res.status, 201);
    }
    assert.equal((await (await fetch(url)).json()).length, 2);
    assert.equal((await fetch(url, { method: 'DELETE' })).status, 204);
    assert.deepEqual(await (await fetch(url)).json(), []);
    assert.equal((await fetch(url, { method: 'DELETE' })).status, 204);
    const task = await (await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'third' }) })).json();
    assert.equal((await fetch(`${url}/${task.id}`, { method: 'DELETE' })).status, 204);
    assert.deepEqual(await (await fetch(url)).json(), []);
  } finally {
    if (server) await new Promise(resolve => server.close(resolve));
    const dbPath = path.join(scratch, 'db.js');
    if (require.cache[dbPath]) require.cache[dbPath].exports.close();
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});
