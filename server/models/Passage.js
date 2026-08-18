const mongoose = require('mongoose');

const passageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  theme: {
    type: String,
    default: 'General Telugu-English Code Switching'
  },
  source: {
    type: String,
    enum: ['seed', 'gemini'],
    default: 'gemini'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Passage', passageSchema);
