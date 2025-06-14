// db/internalDb.js
const { Pool } = require('pg');
require('dotenv').config();

const internalDb = new Pool({
  connectionString: process.env.INTERNAL_DB_URL,
});

module.exports = internalDb;
