import { useEffect, useState } from 'react';
import { getTasks, addTask, toggleTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const incompleteCount = tasks.filter((task) => !task.completed).length;

  async function refresh() {
    setTasks(await getTasks());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    await addTask(title);
    setTitle('');
    refresh();
  }

  async function handleToggle(id) {
    await toggleTask(id);
    refresh();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    refresh();
  }

  return (
    <div className="container">
      <h1>Tasks <span className="task-count" aria-label={`${incompleteCount} incomplete tasks`}>{incompleteCount}</span></h1>
      <form onSubmit={handleAdd} className="add-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={t.completed ? 'done' : ''}>
            <span className="title" onClick={() => handleToggle(t.id)}>
              {t.title || '(untitled)'}
            </span>
            <button className="delete" onClick={() => handleDelete(t.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className="hint">Click a task to toggle it complete.</p>
    </div>
  );
}
