#!/usr/bin/env node
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../../..');
const evidence = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'tasks-pagination-evidence.txt'));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-verify-'));
let server;
(async () => {
  const backend = path.join(scratch, 'backend');
  fs.mkdirSync(backend);
  for (const file of ['server.js', 'db.js']) fs.copyFileSync(path.join(root, 'backend', file), path.join(backend, file));
  fs.cpSync(path.join(root, 'backend/routes'), path.join(backend, 'routes'), { recursive: true });
  fs.symlinkSync(path.join(root, 'backend/node_modules'), path.join(backend, 'node_modules'), 'dir');
  const app = require(path.join(backend, 'server.js'));
  server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');
  const created = [];
  for (const title of ['one', 'two', 'three', 'four', 'five']) {
    const res = await fetch(`${base}/api/tasks`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({title})});
    assert.equal(res.status, 201); created.push(await res.json());
  }
  const get = async query => { const res = await fetch(`${base}/api/tasks${query}`); assert.equal(res.status, 200); return res.json(); };
  const all = await get('');
  const first = await get('?limit=2&offset=0');
  const second = await get('?limit=2&offset=2');
  const last = await get('?limit=2&offset=4');
  const beyond = await get('?limit=2&offset=5');
  const offsetOnly = await get('?offset=3');
  const ids = rows => rows.map(row => row.id);
  const expected = created.map(row => row.id).reverse();
  assert.deepEqual(ids(all), expected);
  assert.deepEqual(ids(first), expected.slice(0, 2));
  assert.deepEqual(ids(second), expected.slice(2, 4));
  assert.deepEqual(ids(last), expected.slice(4));
  assert.deepEqual(ids(beyond), []);
  assert.deepEqual(ids(offsetOnly), expected.slice(3));
  for (const query of ['?limit=0', '?limit=-1', '?limit=1.5', '?offset=-1', '?offset=abc', '?limit=1&limit=2']) {
    assert.equal((await fetch(base + '/api/tasks' + query)).status, 400, query);
  }
  fs.mkdirSync(path.dirname(evidence), {recursive:true});
  fs.writeFileSync(evidence, JSON.stringify({doctor:'GET /api/health: 200 ok', created:ids(created), all:ids(all), first:ids(first), second:ids(second), last:ids(last), beyond:ids(beyond), offsetOnly:ids(offsetOnly), invalid:'all 400', result:'PASS'}, null, 2) + '\n');
  console.log(`PASS: pagination API; evidence: ${evidence}`);
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  fs.rmSync(scratch, {recursive:true, force:true});
});
