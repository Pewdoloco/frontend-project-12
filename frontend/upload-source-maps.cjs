const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const accessToken = process.env.VITE_ROLLBAR_SERVER_TOKEN;
const version = process.env.VITE_GIT_SHA || 'unknown';
const sourceMapsDir = path.join(__dirname, 'sourceMaps');
const domain = 'https://frontend-project-12-tw18.onrender.com';

console.log('Using Rollbar server token:', accessToken ? `${accessToken.slice(0, 4)}...` : 'Not set');
console.log('Version:', version);
console.log('Source maps directory:', sourceMapsDir);

async function uploadSourceMap(filename) {
  const minifiedUrl = `${domain}/assets/${filename.replace('.map', '')}`;
  const sourceMapPath = path.join(sourceMapsDir, filename);

  console.log('Uploading source map:', filename);
  console.log('Minified URL:', minifiedUrl);

  try {
    const response = await axios.post(
      'https://api.rollbar.com/api/1/sourcemap',
      {
        access_token: accessToken,
        version,
        minified_url: minifiedUrl,
        source_map: fs.createReadStream(sourceMapPath),
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(`Source map ${filename} uploaded successfully:`, response.data);
  } catch (error) {
    console.error(`Failed to upload source map ${filename}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

try {
  const files = fs.readdirSync(sourceMapsDir);
  const mapFiles = files.filter(file => file.endsWith('.map'));
  if (mapFiles.length === 0) {
    console.warn('No source map files found in sourceMaps directory.');
    return;
  }
  mapFiles.forEach(file => uploadSourceMap(file));
} catch (err) {
  console.error('Error reading source maps directory:', err.message);
}