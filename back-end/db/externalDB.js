// db/externalDb.js
const { Pool } = require('pg');
require('dotenv').config();

const externalDb = new Pool({
  connectionString: process.env.EXTERNAL_DB_URL,
});

module.exports = externalDb;
