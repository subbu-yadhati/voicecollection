const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  consent: {
    type: Boolean,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  fileName: {
    type: String,
    required: true
  },
  driveFileId: {
    type: String,
    default: ''
  },
  openSourceConsent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Participant', participantSchema);
