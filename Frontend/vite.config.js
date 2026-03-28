import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Minification and source map settings
    minify: 'esbuild', 
    sourcemap: false,
    cssCodeSplit: true,

    // Bundle analysis configuration
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'vendor-charts': ['@nivo/core', '@nivo/bar', '@nivo/line', '@nivo/pie', '@nivo/geo'],
          'vendor-utils': ['xlsx', 'react-ga4', 'react-cookie-manager'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Ensure compatibility with modern browsers
    target: 'es2022',
    emptyOutDir: true,
  },
})
