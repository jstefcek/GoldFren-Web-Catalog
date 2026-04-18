import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,

    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules\/(react|react-dom)\// },
            { name: 'router', test: /node_modules\/react-router-dom\// },
            { name: 'i18n', test: /node_modules\/(i18next|react-i18next|i18next-browser-languagedetector)\// },
            { name: 'analytics', test: /node_modules\/react-ga4\// },
            { name: 'xlsx', test: /node_modules\/xlsx\// },
            { name: 'icons', test: /node_modules\/lucide-react\// },
            { name: 'cookie', test: /node_modules\/react-cookie-manager\// },
          ],
        },
      },
    },
  },
}))