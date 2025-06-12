const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Set to true in production with a valid certificate
    },
});
pool.on('connect', () => {
  console.log('Connected to the database');
});
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
module.exports = pool;