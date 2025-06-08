const User = require('../models/User.js');
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed

exports.loginuser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Compare password securely
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials!' });
        }
        
        res.json({
            message: 'Login successful',
            role: user.role,
            userId: user._id,
        });
    } catch (error) {
        next(error);
    }
    };