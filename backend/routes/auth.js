const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { internalPool, externalPool } = require('../db');
const router = express.Router();


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Request received:', req.body);
    res.status(200).json({ message: 'Login endpoint hit', received: true, body: req.body });

    // Email Validation
    try {
        // Check if the user exists in the internal database
        const intUserRes = await internalPool.query('SELECT * FROM users WHERE email = $1', [email]);

        // If user exists, verify password
        if (intUserRes.rowCount > 0) {
            const user = intUserRes.rows[0];

            if (!user.password) {
                return res.status(401).json({ error: 'Password not set for this user. Contact HR.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

            // Generate JWT token
            const token = jwt.sign({ userId: user.id, role:user.role }, process.env.JWT_SECRET);
            return res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
        }
        // If user does not exist in internal DB, check external database
        if (!email.endsWith('@ecews.org')) {
            return res.status(401).json({ error: 'Invalid email domain' });
        }
        const extUserRes = await externalPool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (extUserRes.rowCount === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        const extUser = extUserRes.rows[0];
        const valid = await bcrypt.compare(password, extUser.password);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        // Insert user into internal database if not already present (First time login)
        const intInsertRes = await internalPool.query(
            'INSERT INTO users (id, email, role, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            [extUser.id, extUser.email, extUser.role, extUser.password]
        );
        if (intInsertRes.rowCount === 0) {
            console.log('User already exists in internal database');
        } else {
            console.log('User inserted into internal database');
        }

        // Generate JWT token
        const newUser = intInsertRes.rows[0] || extUser; // Use the inserted user or the external user if not inserted
        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET);
        return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, role: newUser.role } });

    } catch (error) {
        console.error('Email validation error:', error);
        return res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

module.exports = router;