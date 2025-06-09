const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    added_by_hr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: null
    },
    it_status: {
        type: String,
        enum: ['Current', 'Past'],
        default: 'Active'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);