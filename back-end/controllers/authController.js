const User = require('../models/User.js');
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed

exports.loginUser = async (req, res, next) => {
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

exports.registerUser = async (req, res, next) => {
    const { name, email, password, role, unit } = req.body;
    try {
        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10), // Hash the password before saving
            role,
            unit
        });
        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id,
            role: user.role
        });
    }
    catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ error: 'Email already exists' });
        }
        next(error);
    }
}