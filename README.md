# Multilingual Speech Data Collection Platform

A simple web platform for collecting Telugu-English code-switching speech recordings for academic research.

---

## 🚀 Features

- 🎙️ **Live Recording**: Record speech directly from your browser.
- 📁 **File Upload**: Upload pre-recorded audio files (`.wav`, `.mp3`, `.m4a`, `.webm`, `.ogg`).
- 🤖 **AI Reading Passages**: Generates conversational Telugu-English reading passages via Google Gemini API.
- 🔒 **Privacy & Consent**: Built-in consent policy ensuring data is strictly used for academic research.
- ☁️ **Storage**: Automatically saves audio recordings to Google Drive and local storage (`server/uploads/`), with metadata saved to MongoDB.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer, Google Drive API, Google Gemini API

---

## 📦 Quick Start

### 1. Start the Server (Backend)

```bash
cd server
npm install
npm run dev
```
> Server runs on `http://localhost:5000`

### 2. Start the Client (Frontend)

```bash
cd client
npm install
npm run dev
```
> Client runs on `http://localhost:5173`

---

## ⚙️ Configuration (`server/.env`)

Create a `.env` file in the `server` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/speech_collection

# Optional: Google Gemini API (for passage generation)
GEMINI_API_KEY=your_gemini_api_key

# Optional: Google Drive Uploads (categorized by gender)
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_MALE_FOLDER_ID=your_male_folder_id
GOOGLE_DRIVE_FEMALE_FOLDER_ID=your_female_folder_id
```

*(If Gemini or Google Drive keys are not provided, the app will automatically use built-in reading passages and local storage in `server/uploads/`)*

---

## 📁 Project Structure

```
WEBSITE/
├── client/          # Frontend React + Vite app
│   └── src/
│       ├── components/  # UI Components (Hero, Recording, ReadingPassage, etc.)
│       └── App.jsx
├── server/          # Backend Express app
│   ├── config/      # DB, Gemini, and Google Drive configs
│   ├── models/      # MongoDB Schemas
│   ├── routes/      # API Routes (upload, generateText)
│   ├── uploads/     # Local audio files storage
│   └── server.js
└── README.md
```

---

## 📄 License

Academic Research Project — Department of Computer Science & Engineering.
