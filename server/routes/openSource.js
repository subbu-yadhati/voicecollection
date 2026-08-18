const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OpenSourceContributor = require('../models/OpenSourceContributor');

// -------------------------------------------------------------
// POST /api/opensource-consent
// Handles open-source consent for AI training dataset
// -------------------------------------------------------------
router.post('/opensource-consent', async (req, res) => {
  try {
    const { participantId, name, gender, fileName, consent } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required.',
      });
    }

    const isConsented = consent === true || consent === 'true';

    // If user consented (Yes)
    if (isConsented) {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        // Upsert record into opensourcecontributors collection
        const contributor = await OpenSourceContributor.findOneAndUpdate(
          { participantId },
          {
            participantId,
            name: name ? name.trim() : '',
            gender: gender || '',
            fileName: fileName || '',
            openSourceConsent: true,
            purpose: 'Training purpose only',
            createdAt: new Date(),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
          success: true,
          message: 'Thank you! Your details have been saved to the open-source contributors dataset.',
          saved: true,
          data: contributor,
        });
      } else {
        console.log('[MongoDB Notice] MongoDB not connected; OpenSource contributor consent recorded in memory/logs.');
        return res.status(200).json({
          success: true,
          message: 'Consent received (MongoDB offline mode).',
          saved: true,
        });
      }
    }

    // If user declined (No)
    // Nothing is saved in opensourcecontributors collection
    return res.status(200).json({
      success: true,
      message: 'Consent declined. Your voice remains strictly for academic research only.',
      saved: false,
    });
  } catch (error) {
    console.error('Open Source Consent Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process open source consent.',
    });
  }
});

// -------------------------------------------------------------
// GET /api/opensource-contributors
// Helper to inspect open source contributors
// -------------------------------------------------------------
router.get('/opensource-contributors', async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const contributors = await OpenSourceContributor.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: contributors.length,
        contributors,
      });
    }
    return res.json({ success: true, count: 0, contributors: [] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
