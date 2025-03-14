const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
  commandText: { 
    type: String, 
    required: true,
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Command", commandSchema);
