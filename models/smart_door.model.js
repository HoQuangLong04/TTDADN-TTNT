// models/door.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doorSchema = new Schema({
    password:
    {
        type: String,
        required: true
    },
    status: {
        type: String, 
        enum: ['locked', 'unlocked'],
        default: 'locked'
    },
    lastAccessedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Door', doorSchema);
