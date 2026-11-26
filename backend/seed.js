const db = require('./db');

db.prepare('DELETE FROM tasks').run();

const insert = db.prepare('INSERT INTO tasks (title, completed) VALUES (?, ?)');
insert.run('Read the pstack README', 0);
insert.run('Install ai-workflow-kit', 0);
insert.run('Write the comparison report', 0);

console.log('Seeded 3 tasks.');
