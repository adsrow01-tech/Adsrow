import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "maplibre-gl": ["maplibre-gl"],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com'],
  },
})
