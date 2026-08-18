const mongoose = require('mongoose');

const openSourceContributorSchema = new mongoose.Schema({
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
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  openSourceConsent: {
    type: Boolean,
    default: true
  },
  purpose: {
    type: String,
    default: 'Training purpose only'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Explicitly register with collection name 'opensourcecontributors'
module.exports = mongoose.model('OpenSourceContributor', openSourceContributorSchema, 'opensourcecontributors');
