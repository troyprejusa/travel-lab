import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend_server: string = 'http://localhost:8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dev': backend_server,
      '/auth': backend_server,
      '/user': backend_server,
      '/trip': backend_server
    }
  }
})
