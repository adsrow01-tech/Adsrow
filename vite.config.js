import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const analyzeBundle = process.env.ANALYZE === 'true'

export default defineConfig(async () => {
  const plugins = [
    react(),
    tailwindcss(),
  ]
  if (analyzeBundle) {
    const { visualizer } = await import('rollup-plugin-visualizer')
    plugins.push(visualizer({
      filename: 'docs/reports/adsrow-bundle-treemap.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }))
  }

  return {
    plugins,
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
  }
})
