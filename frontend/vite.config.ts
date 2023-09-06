import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const backend_server: string = 'http://localhost:8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('/Users/troyprejusa/Dev/dev-certs/travel-lab-certs/localhost+1-key.pem'),
      cert: fs.readFileSync('/Users/troyprejusa/Dev/dev-certs/travel-lab-certs/localhost+1.pem'),
    },
    proxy: {
      '/dev': backend_server,
      '/auth': backend_server,
      '/user': backend_server,
      '/trip': backend_server
    }
  }
})
