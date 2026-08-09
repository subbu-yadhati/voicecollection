const { google } = require("googleapis");
const { Readable } = require("stream");


// Create Google Drive service
function getDriveService() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  });

  return google.drive({
    version: "v3",
    auth,
  });
}


// Upload audio file to Google Drive
async function uploadToDrive(
  fileBuffer,
  fileName,
  mimeType,
  folderId
) {
  try {
    const drive = getDriveService();

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: mimeType || "audio/wav",
      body: Readable.from(fileBuffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log(`Google Drive upload successful: ${fileName}`);

    return response.data.id;

  } catch (error) {
    console.error(
      "Google Drive Upload Error:",
      error.message
    );

    throw new Error(
      `Google Drive Upload Failed: ${error.message}`
    );
  }
}


module.exports = {
  uploadToDrive,
};

// const { google } = require('googleapis');
// const fs = require('fs');

// // Initialize Google Auth using Service Account credentials from .env
// const getDriveService = () => {
//   const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
//   let privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
  
//   if (privateKey) {
//     // Clean wrapping quotes and convert unescaped or raw newlines
//     privateKey = privateKey.trim().replace(/^"|"$/g, '');
//     privateKey = privateKey.replace(/\\n/g, '\n');
//   }

//   const auth = new google.auth.JWT(
//     clientEmail,
//     null,
//     privateKey,
//     ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive']
//   );

//   return google.drive({ version: 'v3', auth });
// };

// /**
//  * Uploads a file to a specific Google Drive folder
//  * @param {string} filePath Local path of the audio file
//  * @param {string} fileName Name of file on Google Drive
//  * @param {string} mimeType MIME type of the audio file
//  * @param {string} folderId Target Google Drive folder ID
//  * @returns {Promise<string>} Uploaded Google Drive File ID
//  */
// const uploadToDrive = async (filePath, fileName, mimeType, folderId) => {
//   try {
//     const drive = getDriveService();

//     const fileMetaData = {
//       name: fileName,
//       parents: folderId ? [folderId] : []
//     };

//     const media = {
//       mimeType: mimeType || 'audio/wav',
//       body: fs.createReadStream(filePath)
//     };

//     const response = await drive.files.create({
//       resource: fileMetaData,
//       media: media,
//       fields: 'id'
//     });

//     return response.data.id;
//   } catch (error) {
//     console.error('Google Drive Upload Error:', error.message);
//     throw new Error(`Google Drive Upload Failed: ${error.message}`);
//   }
// };

// module.exports = {
//   uploadToDrive
// };
