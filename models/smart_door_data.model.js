const mongoose = require('mongoose');

const doorDataSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('door_datas', doorDataSchema);
