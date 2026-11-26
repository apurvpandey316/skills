const express = require('express');
const db = require('../db');

const router = express.Router();

// List all tasks (newest first)
router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
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

// Delete all tasks
router.delete('/', (req, res) => {
  db.prepare('DELETE FROM tasks').run();
  res.status(204).end();
});

// Delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

module.exports = router;
