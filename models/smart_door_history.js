const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doorHistorySchema = new Schema({
  door: { type: Schema.Types.ObjectId, ref: 'Door', required: true },
  action: { type: String, enum: ['open', 'close', 'failed'], required: true },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String }
});

module.exports = mongoose.model('DoorHistory', doorHistorySchema);
