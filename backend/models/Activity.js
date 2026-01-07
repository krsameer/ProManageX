const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'created',
      'status_changed',
      'priority_changed',
      'assignee_changed',
      'commented',
      'updated',
      'deleted'
    ]
  },
  field: {
    type: String,
    default: ''
  },
  oldValue: {
    type: String,
    default: ''
  },
  newValue: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
activitySchema.index({ issue: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
