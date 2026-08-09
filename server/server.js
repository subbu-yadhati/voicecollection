require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const uploadRoutes = require('./routes/upload');
const generateTextRoutes = require('./routes/generateText');

const app = express();

// 1. Connect to MongoDB
connectDB();

const path = require('path');
const fs = require('fs');

// 2. Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded audio files statically
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// 3. API Routes
app.use('/api', generateTextRoutes);
app.use('/api', uploadRoutes);

// Route to list all uploaded audio files
app.get('/api/uploads', (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ success: true, count: 0, files: [] });
    }
    const files = fs.readdirSync(uploadsDir)
      .filter(f => f !== '.gitkeep' && !f.startsWith('.'))
      .map(f => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        return {
          fileName: f,
          sizeBytes: stat.size,
          createdAt: stat.birthtime || stat.mtime,
          url: `/uploads/${f}`
        };
      });

    return res.json({
      success: true,
      count: files.length,
      files: files
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString() });
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Multilingual Speech Collection API Server is running...');
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
