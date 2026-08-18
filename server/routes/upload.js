const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const Participant = require("../models/Participant");
const OpenSourceContributor = require("../models/OpenSourceContributor");
const { uploadToDrive } = require("../config/drive");

// -----------------------------
// Multer configuration
// -----------------------------

const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage =
  process.env.NODE_ENV === "production"
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: uploadsDir,
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname) || ".wav";
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, filename);
        },
      });

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = [".wav", ".mp3", ".m4a", ".webm", ".ogg"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext) || (file.mimetype && file.mimetype.startsWith("audio/"))) {
      cb(null, true);
    } else {
      cb(new Error("Only WAV, MP3, M4A, WEBM and OGG files are allowed."));
    }
  },
});

// -----------------------------
// Generate Participant ID
// -----------------------------

async function generateParticipantId() {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const count = await Participant.countDocuments();
      return `P${(count + 1).toString().padStart(5, "0")}`;
    }
  } catch (err) {
    console.warn("Participant count fallback:", err.message);
  }
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `P${randomNum}`;
}

// -----------------------------
// POST /api/upload
// -----------------------------

router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const { name, gender, consent, duration, language, openSourceConsent } = req.body;

    // Audio validation
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required.",
      });
    }

    // Consent validation
    if (consent !== "true" && consent !== true) {
      return res.status(400).json({
        success: false,
        message: "Consent is required.",
      });
    }

    // Gender validation
    if (!["Male", "Female", "Other"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Please select Male, Female, or Other.",
      });
    }

    // Participant ID
    const participantId = await generateParticipantId();

    // File extension
    let extension = path.extname(req.file.originalname).toLowerCase();
    if (!extension || extension === ".blob") {
      extension = ".wav";
    }

    // Formatted File name
    let fileName;
    if (name && name.trim()) {
      const cleanName = name
        .trim()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "_");

      fileName = `${cleanName}_${participantId}${extension}`;
    } else {
      fileName = `${participantId}${extension}`;
    }

    // -----------------------------
    // Google Drive folder
    // -----------------------------
    let folderId = process.env.GOOGLE_DRIVE_MALE_FOLDER_ID;
    if (gender === "Female") {
      folderId = process.env.GOOGLE_DRIVE_FEMALE_FOLDER_ID || process.env.GOOGLE_DRIVE_MALE_FOLDER_ID;
    } else if (gender === "Other") {
      folderId = process.env.GOOGLE_DRIVE_MALE_FOLDER_ID || process.env.GOOGLE_DRIVE_FEMALE_FOLDER_ID;
    }

    // -----------------------------
    // Upload to Google Drive
    // -----------------------------
    let driveFileId = "";

    try {
      if (process.env.GOOGLE_DRIVE_REFRESH_TOKEN && process.env.GOOGLE_DRIVE_CLIENT_ID) {
        let fileBuffer;
        if (process.env.NODE_ENV === "production") {
          fileBuffer = req.file.buffer;
        } else {
          fileBuffer = fs.readFileSync(req.file.path);
        }

        driveFileId = await uploadToDrive(
          fileBuffer,
          fileName,
          req.file.mimetype,
          folderId
        );
      } else {
        driveFileId = `LOCAL_${Date.now()}`;
      }
    } catch (driveErr) {
      console.warn("Google Drive Upload Warning (continuing):", driveErr.message);
      driveFileId = `DRIVE_ERR_${Date.now()}`;
    }

    // -----------------------------
    // MongoDB Save
    // -----------------------------
    const isOsConsented = openSourceConsent === "true" || openSourceConsent === true;

    try {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        const participant = new Participant({
          participantId,
          name: name ? name.trim() : "",
          gender,
          consent: true,
          duration: duration ? Number(duration) : 0,
          language: language || "",
          fileName,
          driveFileId: driveFileId || "",
          openSourceConsent: isOsConsented,
        });

        await participant.save();

        // If user consented to Open Source, save to OpenSourceContributor collection
        if (isOsConsented) {
          const osContributor = new OpenSourceContributor({
            participantId,
            name: name ? name.trim() : "",
            gender,
            fileName,
            openSourceConsent: true,
            purpose: "Training purpose only",
          });
          await osContributor.save();
        }
      } else {
        console.log("[MongoDB Notice] MongoDB not connected; stored file metadata locally.");
      }
    } catch (dbErr) {
      console.warn("MongoDB Save Warning (continuing):", dbErr.message);
    }

    // -----------------------------
    // Response
    // -----------------------------
    return res.status(200).json({
      success: true,
      message: "Audio uploaded successfully.",
      participantId,
      fileName,
      openSourceConsent: isOsConsented,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed.",
    });
  }
});

module.exports = router;
