const express = require('express');
const db = require('../db');

const taskRouter = express.Router();

// This handler handles the request to list all of the task records, ordered from the newest records first.
taskRouter.get('/', (requestObject, responseObject) => {
  const allTaskRecords = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  responseObject.json(allTaskRecords);
});

// This handler creates a new task record in the database when a task is submitted.
taskRouter.post('/', (requestObject, responseObject) => {
  const { title } = requestObject.body;
  const value = typeof title === 'string' ? title : '';
  const info = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(value);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  responseObject.status(201).json(task);
});

// This handler updates the completed state of the task record identified by the supplied identifier.
taskRouter.put('/:id/toggle', (requestObject, responseObject) => {
  const { id } = requestObject.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) return responseObject.status(404).json({ error: 'Task not found' });
  db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?').run(id);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  responseObject.json(updated);
});

// This handler deletes a task record from the database by its identifier.
taskRouter.delete('/:id', (requestObject, responseObject) => {
  const { id } = requestObject.params;
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  if (info.changes === 0) return responseObject.status(404).json({ error: 'Task not found' });
  responseObject.status(204).end();
});

module.exports = taskRouter;
