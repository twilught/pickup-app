const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({ connectionString })
  : new Pool({
      user: process.env.POSTGRES_USER || 'pickup_user',
      password: process.env.POSTGRES_PASSWORD || 'pickup_password',
      host: process.env.DB_HOST || 'db',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      database: process.env.POSTGRES_DB || 'pickup_db',
    });

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  if (rows[0].count === 0) {
    await pool.query(
      `
      INSERT INTO users (name, email, role)
      VALUES 
        ('Alice', 'alice@example.com', 'admin'),
        ('Bob', 'bob@example.com', 'user'),
        ('Charlie', 'charlie@example.com', 'viewer')
      `
    );
  }
}

async function getUsers() {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY id ASC'
  );
  return rows;
}

async function createUser({ name, email, role }) {
  const { rows } = await pool.query(
    `
    INSERT INTO users (name, email, role)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at
    `,
    [name, email, role || 'user']
  );
  return rows[0];
}

async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
}

module.exports = {
  init,
  getUsers,
  createUser,
  deleteUser,
};
