import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/question-service': {
        target: 'http://localhost:8765',
        changeOrigin: true,
      },
      '/quiz-service': {
        target: 'http://localhost:8765',
        changeOrigin: true,
      }
    }
  }
})
