const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/plants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plants ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

app.post('/plants', async (req, res) => {
  try {
    const { name, strain, status } = req.body;

    const result = await pool.query(
      'INSERT INTO plants (name, strain, status) VALUES ($1, $2, $3) RETURNING *',
      [name, strain, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

app.get('/packages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM packages ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

app.post('/packages', async (req, res) => {
  try {
    const { name, quantity, status } = req.body;

    const result = await pool.query(
      'INSERT INTO packages (name, quantity, status) VALUES ($1, $2, $3) RETURNING *',
      [name, quantity, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create package' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Basic route to check if the server is running
  app.get('/', (req, res) => {
  res.send('Green Track API is running');
});

});
