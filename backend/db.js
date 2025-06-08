require('dotenv').config();
const { Pool } = require('pg');

// Internal DB
const internalPool = new Pool({
    connectionString: process.env.ISMS_DATABASE_URL,
});

// External DB
const externalPool = new Pool({
    connectionString: process.env.ECEWS_DATABASE_URL,
});

internalPool.on('connect', () => {
    console.log('Connected to the ISMS database');
});

internalPool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = {internalPool, externalPool};
