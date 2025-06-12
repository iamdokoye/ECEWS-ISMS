const { Pool } = require('pg');
require('dotenv').config();
const config = require('./config');

const pool = new Pool({
  user: config.dbUser,
  host: config.dbHost,
  database: config.dbName,
  password: config.dbPassword,
  port: config.dbPort,
});
pool.on('connect', () => {
  console.log('Connected to the database');
});
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
module.exports = pool;