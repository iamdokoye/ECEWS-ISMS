const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    // Find a user by email in internal database
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    // Auto-create staff for @ecews.org emails
    autoCreateStaff: async (email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
        const values = [email, hashedPassword, 'staff'];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
};

module.exports = User;