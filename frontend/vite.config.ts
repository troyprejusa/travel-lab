import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backend_server: string = 'http://localhost:8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dev': backend_server,
      '/api/v1': backend_server,
      '/sio': {
        target: backend_server,
        ws: true
      },
    }
  }
})
