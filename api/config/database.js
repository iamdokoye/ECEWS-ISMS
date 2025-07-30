// db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Set to true if your internal DB requires SSL
  
  types: {
    getTypeParser: () => (val) => val // Keep dates as strings
  }
});

// Set the timezone for each new client
pool.on('connect', (client) => {
  client.query('SET TIME ZONE UTC;'); // Or your preferred timezone
});

module.exports = pool;
