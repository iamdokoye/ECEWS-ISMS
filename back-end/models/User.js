const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Student', 'Supervisor', 'Admin', 'Staff'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    default: {
        type: String,
        default: 'Student'
    },
});

module.exports = mongoose.model('User', userSchema);