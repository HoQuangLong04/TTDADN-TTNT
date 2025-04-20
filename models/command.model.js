// const mongoose = require("mongoose");

// const commandSchema = new mongoose.Schema({
//   commandText: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Command", commandSchema);

const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
  commandText: { 
    type: String, 
    required: true,
    trim: true 
  },
  feed: { 
    type: String,
    required: true,
    enum: ['DAT_LED', 'DAT_FAN'],
    message: '{VALUE} không hợp lệ'
  },
  payload: { 
    type: String,
    required: true,
    enum: ['0', '1'], 
    message: '{VALUE} không hợp lệ'
  },

  // actionTye: {
  //   type: String,
  //   enum: ["onoff", "increase", "decrease"],
  //   default: "onoff",
  //   require: true
  // },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Command", commandSchema);