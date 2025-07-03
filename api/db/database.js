// db/internalDb.js
const { Pool } = require('pg');
require('dotenv').config();

const internalDb = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Set to true if your internal DB requires SSL
});

module.exports = internalDb;
