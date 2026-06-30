import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/subway': {
        target: 'http://swopenapi.seoul.go.kr',
        changeOrigin: true,
      },
      '/sk-api': {
        target: 'https://apis.openapi.sk.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sk-api/, '')
      }
    }
  }
})
