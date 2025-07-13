const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'myappuser',
  host: '10.0.0.4',
  database: 'myappdb',
  password: 'MyPassword',
  port: 5432,
});

// Utility to escape HTML (prevent XSS)
const escapeHtml = (unsafe) => 
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Route to show list of employees
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    const rows = result.rows;

    let html = `
      <html>
        <head>
          <title>Employee Directory</title>
          <style>
            table { border-collapse: collapse; width: 60%; margin: 20px auto; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Employee Directory</h1>
          <table>
            <tr><th>ID</th><th>Name</th><th>Role</th></tr>
    `;

    if (rows.length === 0) {
      html += `<tr><td colspan="3">No employees found</td></tr>`;
    } else {
      rows.forEach(emp => {
        html += `
          <tr>
            <td>${escapeHtml(String(emp.id))}</td>
            <td>${escapeHtml(emp.name)}</td>
            <td>${escapeHtml(emp.role)}</td>
          </tr>
        `;
      });
    }

    html += `
          </table>
        </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Internal Server Error: Unable to fetch employees');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
