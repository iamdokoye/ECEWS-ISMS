// db/externalDb.js
const { Pool } = require('pg');
require('dotenv').config();

const externalDb = new Pool({
  connectionString: process.env.EXTERNAL_DB_URL,
  ssl: false, // Set to true if your external DB requires SSL
});

module.exports = externalDb;
