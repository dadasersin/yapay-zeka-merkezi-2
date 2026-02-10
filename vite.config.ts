
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // API keys should be loaded from environment variables
    // Use .env file for local development
    // Example: VITE_GEMINI_API_KEY=your_key_here
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    strictPort: false
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
