const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'myappuser',
  host: '10.0.0.4',
  database: 'myappdb',
  password: 'MyPassword',
  port: 5432,
});

// Route to show list of employees
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    let html = `
      <h1>Employee Directory</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><th>ID</th><th>Name</th><th>Role</th></tr>
    `;
    result.rows.forEach(emp => {
      html += `<tr><td>${emp.id}</td><td>${emp.name}</td><td>${emp.role}</td></tr>`;
    });
    html += '</table>';
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database query failed');
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
