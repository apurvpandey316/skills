import { useEffect, useState } from 'react';
import { getTasks, addTask, toggleTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

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
      <h1>Tasks <span aria-label={`${tasks.filter((task) => !task.completed).length} incomplete tasks`}>{tasks.filter((task) => !task.completed).length}</span></h1>
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
