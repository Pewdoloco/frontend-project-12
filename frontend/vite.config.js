/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

export default defineConfig(({ mode }) => {
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, __dirname)
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_CI': JSON.stringify(env.VITE_CI),
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5001',
          changeOrigin: true,
        },
        '/socket.io': {
          target: 'http://localhost:5001',
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      sourcemap: true,
    },
  }
})
