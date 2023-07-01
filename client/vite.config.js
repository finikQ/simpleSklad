import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './../server/public',
    rollupOptions: {
      input: {
        main: './src/index.jsx',
        index: './index.html',
      }
    }
  },
  server: {
    historyApiFallback: {
      index: '/index.html'
    }
  },
});