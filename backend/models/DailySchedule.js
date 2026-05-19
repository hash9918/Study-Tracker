const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // Format: "HH:MM"
  endTime: { type: String, required: true },   // Format: "HH:MM"
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const DailyScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  blocks: [BlockSchema]
});

// Ensure a user can only have one schedule per date
DailyScheduleSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailySchedule', DailyScheduleSchema);
