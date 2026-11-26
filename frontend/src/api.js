const BASE = '/api/tasks';

export async function getTasks() {
  const res = await fetch(BASE);
  return res.json();
}

export async function addTask(title) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function toggleTask(id) {
  const res = await fetch(`${BASE}/${id}/toggle`, { method: 'PUT' });
  return res.json();
}

export async function deleteTask(id) {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
}
