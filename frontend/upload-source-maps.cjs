const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, './.env') });

console.log('Loaded .env token env:', process.env.VITE_ROLLBAR_SERVER_TOKEN);
console.log('Raw env token=>', JSON.stringify(process.env.VITE_ROLLBAR_SERVER_TOKEN));

const accessToken = process.env.VITE_ROLLBAR_SERVER_TOKEN;
const version = process.env.VITE_GIT_SHA || 'unknown';
const sourceMapsDir = path.join(__dirname, 'sourceMaps');
const domain = 'https://frontend-project-12-tw18.onrender.com';

console.log(
  'Using Rollbar server token:',
  accessToken ? `${accessToken.slice(0, 4)}...` : 'Not set'
);
console.log('Version:', version);
console.log('Source maps directory:', sourceMapsDir);

async function uploadSourceMap(filename) {
  const minifiedUrl = `${domain}/assets/${filename.replace('.map', '')}`;
  const sourceMapPath = path.join(sourceMapsDir, filename);

  console.log('Uploading source map:', filename);
  console.log('Minified URL:', minifiedUrl);

  const form = new FormData();
  form.append('access_token', accessToken);
  form.append('version', version);
  form.append('minified_url', minifiedUrl);
  form.append('source_map', fs.createReadStream(sourceMapPath));

  try {
    const response = await axios.post(
      'https://api.rollbar.com/api/1/sourcemap',
      form,
      { headers: form.getHeaders() }
    );
    console.log(
      `Source map ${filename} uploaded successfully:`,
      response.data
    );
  } catch (error) {
    console.error(`Failed to upload source map ${filename}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

fs.readdirSync(sourceMapsDir).forEach((file) => {
  if (file.endsWith('.map')) {
    uploadSourceMap(file);
  }
});
