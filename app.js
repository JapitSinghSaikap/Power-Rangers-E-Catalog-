const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const drive = google.drive({ version: 'v3' });

const oauth2Client = new google.auth.OAuth2(
  '360260876435-iujtal0bslui61vqipcs1jc5eg7h988n.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);

// Set up the authentication credentials
const credentials = {
  access_token: 'ACCESS_TOKEN',
  refresh_token: 'REFRESH_TOKEN',
  scope: 'https://www.googleapis.com/auth/drive',
  token_type: 'Bearer',
  expiry_date: 123456789, // Replace with actual expiry date
};
oauth2Client.setCredentials(credentials);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };
    const response = await drive.files.create({
      auth: oauth2Client,
      resource: fileMetadata,
      media: media,
    });
    res.send('File uploaded to Google Drive.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file to Google Drive.');
  }
});

// Fetch route
app.get('/fetch/:fileId', async (req, res) => {
  const { fileId } = req.params;
  const dest = fs.createWriteStream(`downloads/${fileId}`);
  try {
    const response = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    response.data
      .on('end', () => {
        console.log('File downloaded successfully');
        res.send('File downloaded from Google Drive.');
      })
      .on('error', (err) => {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file from Google Drive.');
      })
      .pipe(dest);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).send('Error fetching file from Google Drive.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});