/* eslint-env node */
/* global __dirname, process */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const dotenv = require('dotenv')

const currentDir = path.dirname(require.main ? require.main.filename : __dirname)

dotenv.config({ path: path.resolve(currentDir, '../.env') })

const accessToken = process.env.VITE_ROLLBAR_SERVER_TOKEN
const version = process.env.VITE_GIT_SHA || 'unknown'
const sourceMapsDir = path.join(currentDir, 'sourceMaps')
const domain = 'https://frontend-project-12-tw18.onrender.com'

async function uploadSourceMap(filename) {
  const minifiedUrl = `${domain}/assets/${filename.replace('.map', '')}`
  const sourceMapPath = path.join(sourceMapsDir, filename)

  try {
    await axios.post(
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
      },
    )
  }
  catch {
    // Обработка ошибки
  }
}

try {
  const files = fs.readdirSync(sourceMapsDir)
  const mapFiles = files.filter((file) => file.endsWith('.map'))
  if (mapFiles.length === 0) {
    process.exit(0)
  }
  mapFiles.forEach((file) => uploadSourceMap(file));
} catch {
  // Обработка ошибки
}
