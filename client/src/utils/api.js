// src/utils/api.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Generate reading passage
export async function fetchGeneratedPassage() {
  const response = await fetch(`${API_URL}/api/generate-text`);
  if (!response.ok) {
    throw new Error("Failed to generate passage.");
  }

  return await response.json();
}

// Upload audio
export async function uploadSpeechRecording(formData) {
  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Upload failed with status ${response.status}`);
  }

  return data;
}

// Health check
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}