const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'helpdesk_it',
  user: process.env.DB_USER || 'helpdesk',
  password: process.env.DB_PASSWORD || 'helpdesk123',
  ssl: String(process.env.DB_SSL).toLowerCase() === 'true' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
