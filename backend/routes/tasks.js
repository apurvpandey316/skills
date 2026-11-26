const express = require('express');
const db = require('../db');

const router = express.Router();

// List all tasks (newest first)
router.get('/', (req, res) => {
  const parse = (value, fallback) => value === undefined ? fallback : (/^\d+$/.test(value) ? Number(value) : NaN);
  const limit = parse(req.query.limit, 100);
  const offset = parse(req.query.offset, 0);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset)) {
    return res.status(400).json({ error: 'Invalid limit or offset' });
  }
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?').all(limit, offset);
  res.json(tasks);
});

// Create a task
router.post('/', (req, res) => {
  const { title } = req.body;
  const value = typeof title === 'string' ? title : '';
  const info = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(value);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(task);
});

// Toggle a task's completed state
router.put('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?').run(id);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updated);
});

// Delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

module.exports = router;
