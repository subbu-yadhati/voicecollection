const express = require('express');
const router = express.Router();
const { generatePassageText } = require('../config/gemini');

// GET /api/generate-text
router.get('/generate-text', async (req, res) => {
  try {
    const passageText = await generatePassageText();
    return res.status(200).json({
      success: true,
      text: passageText
    });
  } catch (error) {
    console.error('Error generating text:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate reading passage.'
    });
  }
});

module.exports = router;
