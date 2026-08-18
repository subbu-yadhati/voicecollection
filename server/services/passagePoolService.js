const mongoose = require('mongoose');
const Passage = require('../models/Passage');
const { generatePassageText } = require('../config/gemini');

// Target number of pre-generated passages to keep ready in the DB
const TARGET_POOL_SIZE = 5;
const MIN_POOL_SIZE = 2;
const MAX_CONCURRENT_REFILLS = 2;

let activeRefills = 0;

// Curated initial seed passages so the DB is instantly primed on startup
const SEED_PASSAGES = [
  {
    theme: 'AI & Research in Daily Life',
    text: `Artificial Intelligence domain lo Machine Learning focus ekkuva ga undi. Computer algorithms access vast amounts of training data, identify complex patterns, and make highly accurate predictions without explicit manual programming. Research labs & academic institutions everyday scalable solutions execute chestunnaru. Speech Recognition & Natural Language Processing systems multilingual inputs accept cheyagalavu. Code-switching models evaluate cheyataniki naturally spoken data chala crucial. Participants real-world conversations record chesthe research accuracy improve avutundi.`
  },
  {
    theme: 'Modern Tech & Web Development',
    text: `Today's technology trends fast ga change avutunnayi. Software developers modern web frameworks and cloud infrastructure use chesi innovative products build chestunnaru. Everyday communication lo mana daily life and professional interactions lo English and Telugu words smoothly mix avutayi. Online learning platforms student education experience ki digital tools integrate chestunnayi. Academic researchers speech synthesis and voice collection benchmarks test cheyataniki real-world speech samples collect chestunnaru.`
  },
  {
    theme: 'Deepfake Audio & Speech Processing',
    text: `Deepfake Audio Detection research lo multilingual speech processing ki high demand undi. Acoustic features like MFCCs, Spectrograms, and Pitch cadence clear ga capture cheydaniki high quality voice recordings require autayi. Participants Telugu and English natural flow lo conversation speak chesthunapudu phonetic boundaries clear ga map chestamu. This dataset directly helps build robust synthetic voice classifiers.`
  },
  {
    theme: 'Data Privacy & Speech Datasets',
    text: `Data privacy & encryption standards online platforms lo standards safeguard cheydaniki encryption mechanisms build chestunnaru. User voice samples complete anonymization tho store chestamu. Academic researchers open-source language models refine cheyataniki cross-lingual acoustic datasets collect chestunnaru. Contributing your voice empowers reliable speech recognition for Indian regional languages.`
  },
  {
    theme: 'College Life & Technology Projects',
    text: `College lo final year project work start chesinappudu chala ideas discuss chesamu. Team members andaru different technologies explore chesi natural language processing and voice interfaces select chesukunnaru. Daily lab sessions lo coding practice chesthu, open source libraries integrate chesthunnamu. Faculty guidance tho dataset collection and testing smooth ga jarugutundi. Real time audio samples analyze chesi project documentation complete chesthunnamu.`
  },
  {
    theme: 'Smartphones & Everyday Communication',
    text: `Manam daily use chese smartphones lo voice assistants chala common aipoyayi. Reminders set cheyadam, messages send cheyadam, navigation check cheyadam anni voice commands tho jarugutundi. Kaani mana regional languages lo conversational style lo voice recognize cheyatam inka develop avvalsindi undi. Ila Telugu and English mix chesi matladina audio data train chesthe voice recognition systems inka accurate ga work chestayi.`
  }
];

const path = require('path');
const fs = require('fs');

// Helper to load seed passages from scripts_extended.json or fallback list
function getInitialSeedPassages() {
  try {
    const scriptsPath = path.resolve(__dirname, '../../scripts_extended.json');
    if (fs.existsSync(scriptsPath)) {
      const data = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));
      return Object.values(data).map(item => ({
        theme: item.category ? `${item.category} - ${item.title}` : (item.title || 'General Telugu-English Code Switching'),
        text: item.content ? item.content.trim() : ''
      })).filter(p => p.text.length > 0);
    }
  } catch (e) {
    console.warn('[Passage Pool] Notice loading scripts_extended.json:', e.message);
  }
  return SEED_PASSAGES;
}

/**
 * Initialize the passage pool on server startup or when DB connects.
 * Ensures initial passages exist and kicks off background refill if below target.
 */
async function initializePassagePool() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Passage Pool] MongoDB not connected yet. Waiting for connection...');
      return;
    }

    const count = await Passage.countDocuments();
    console.log(`[Passage Pool] Current passages in DB: ${count}`);

    if (count < MIN_POOL_SIZE) {
      console.log('[Passage Pool] Seeding initial passages into MongoDB...');
      const allSeeds = getInitialSeedPassages();
      const seedsToInsert = allSeeds.map(item => ({
        text: item.text,
        theme: item.theme,
        source: 'seed'
      }));
      await Passage.insertMany(seedsToInsert);
      console.log(`[Passage Pool] Successfully seeded ${seedsToInsert.length} initial passages.`);
    }

    // Trigger background replenish if needed
    replenishPoolInBackground();
  } catch (error) {
    console.error('[Passage Pool] Initialization error:', error.message);
  }
}

/**
 * Atomically fetch and delete the oldest available passage from MongoDB.
 * Then immediately triggers a background replenish with Gemini.
 */
async function getNextPassage() {
  try {
    if (mongoose.connection.readyState === 1) {
      // Find oldest passage and delete atomically (FIFO)
      const passageDoc = await Passage.findOneAndDelete({}, { sort: { createdAt: 1 } });

      if (passageDoc && passageDoc.text) {
        console.log(`[Passage Pool] Served passage from DB (Source: ${passageDoc.source}, ID: ${passageDoc._id})`);
        // Trigger non-blocking background refill to keep the pool full
        setImmediate(() => replenishPoolInBackground());
        return passageDoc.text;
      }
    }
  } catch (err) {
    console.warn('[Passage Pool] Error fetching from DB pool:', err.message);
  }

  // Fallback if DB is empty or disconnected
  console.log('[Passage Pool] Pool empty or DB offline. Generating fallback passage...');
  const fallbackText = await generatePassageText();

  // Try to replenish pool in background
  setImmediate(() => replenishPoolInBackground());

  return fallbackText;
}

/**
 * Background worker that refills the pool using Gemini API when below TARGET_POOL_SIZE.
 * Non-blocking, concurrency-safe, and self-contained.
 */
async function replenishPoolInBackground() {
  if (mongoose.connection.readyState !== 1) return;
  if (activeRefills >= MAX_CONCURRENT_REFILLS) return;

  try {
    const currentCount = await Passage.countDocuments();
    if (currentCount >= TARGET_POOL_SIZE) {
      return;
    }

    activeRefills++;
    console.log(`[Passage Pool] Pool count (${currentCount}) is below target (${TARGET_POOL_SIZE}). Starting background refill (Active: ${activeRefills})...`);

    // Call Gemini to generate a fresh passage
    const newPassageText = await generatePassageText();

    if (newPassageText && newPassageText.trim().length > 30) {
      await Passage.create({
        text: newPassageText.trim(),
        theme: 'Dynamic Telugu-English Code Switching',
        source: 'gemini',
        createdAt: new Date()
      });

      const updatedCount = await Passage.countDocuments();
      console.log(`[Passage Pool] Successfully generated & saved fresh passage via Gemini. Pool size now: ${updatedCount}`);
    }
  } catch (err) {
    console.warn('[Passage Pool] Background refill failed:', err.message);
  } finally {
    activeRefills = Math.max(0, activeRefills - 1);

    // If still below TARGET_POOL_SIZE, queue another refill after a short pause
    try {
      if (mongoose.connection.readyState === 1) {
        const checkCount = await Passage.countDocuments();
        if (checkCount < TARGET_POOL_SIZE && activeRefills < MAX_CONCURRENT_REFILLS) {
          setTimeout(() => replenishPoolInBackground(), 2000);
        }
      }
    } catch (_) {}
  }
}

/**
 * Get current pool status (useful for monitoring/health checks)
 */
async function getPoolStatus() {
  try {
    if (mongoose.connection.readyState !== 1) {
      return { connected: false, count: 0, target: TARGET_POOL_SIZE, activeRefills };
    }
    const count = await Passage.countDocuments();
    return {
      connected: true,
      count,
      target: TARGET_POOL_SIZE,
      activeRefills
    };
  } catch (err) {
    return { connected: false, error: err.message, activeRefills };
  }
}

module.exports = {
  initializePassagePool,
  getNextPassage,
  replenishPoolInBackground,
  getPoolStatus
};
