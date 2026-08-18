const mongoose = require('mongoose');
const { initializePassagePool } = require('../services/passagePoolService');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/speech_collection');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Initialize & seed the passage pool for instant generations
    await initializePassagePool();
  } catch (error) {
    console.warn(`MongoDB Connection Notice: ${error.message}`);
    console.warn('Server will continue running in local fallback mode.');
  }
};

module.exports = connectDB;

