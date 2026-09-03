import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:7842',
      '/assets': 'http://127.0.0.1:7842',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    emptyOutDir: true,
  },
});
