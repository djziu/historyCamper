import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/historyCamper/', // GitHub Pages repository name
  plugins: [react()],
  server: {
    proxy: {
      '/api-gocamping': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-gocamping/, '')
      }
    }
  }
})
