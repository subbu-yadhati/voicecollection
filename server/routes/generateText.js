const express = require('express');
const router = express.Router();
const { getNextPassage, getPoolStatus } = require('../services/passagePoolService');

// GET /api/generate-text - Instant response from MongoDB passage pool with background Gemini refill
router.get('/generate-text', async (req, res) => {
  try {
    const passageText = await getNextPassage();
    return res.status(200).json({
      success: true,
      text: passageText
    });
  } catch (error) {
    console.error('Error serving passage:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate reading passage.'
    });
  }
});

// GET /api/passage-pool/status - Check current pool health and count
router.get('/passage-pool/status', async (req, res) => {
  try {
    const status = await getPoolStatus();
    return res.status(200).json({
      success: true,
      pool: status
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

