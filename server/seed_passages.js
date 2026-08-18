require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Passage = require('./models/Passage');

async function seedMongoPassages() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/speech_collection';
  console.log(`Connecting to MongoDB at: ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // Load scripts_extended.json
    const scriptsPath = path.resolve(__dirname, '../scripts_extended.json');
    if (!fs.existsSync(scriptsPath)) {
      console.error(`File not found: ${scriptsPath}`);
      process.exit(1);
    }

    const scriptsData = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));
    const entries = Object.entries(scriptsData);
    console.log(`Found ${entries.length} passages in scripts_extended.json.`);

    let insertedCount = 0;
    let existingCount = 0;

    for (const [key, item] of entries) {
      const text = item.content ? item.content.trim() : '';
      const theme = item.category ? `${item.category} - ${item.title}` : (item.title || 'General Telugu-English Code Switching');

      if (!text) continue;

      // Check if passage already exists with identical text
      const exists = await Passage.findOne({ text });
      if (!exists) {
        await Passage.create({
          text,
          theme,
          source: 'seed',
          createdAt: new Date()
        });
        insertedCount++;
      } else {
        existingCount++;
      }
    }

    const totalInDb = await Passage.countDocuments();
    console.log(`\n[MongoDB Seed Report]`);
    console.log(`- New passages inserted: ${insertedCount}`);
    console.log(`- Already existing: ${existingCount}`);
    console.log(`- Total passages currently in MongoDB: ${totalInDb}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('Error seeding MongoDB passages:', err.message);
  }
}

seedMongoPassages();
