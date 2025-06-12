const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // If email is from ecews.org, auto-create staff user
        const isEcewsEmail = email.endsWith('@ecews.org');
        if (isEcewsEmail) {
            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (!existingUser) {
                // Auto-create staff user
                const newUser = await User.autoCreateStaff(email, password);
                if (!newUser) {
                    return res.status(500).json({ message: 'Failed to create staff user' });
                }
            }
        }
        // If email is not from ecews.org, proceed with normal login
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Access denied: User not found.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}