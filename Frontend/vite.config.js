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
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    // Bundle analysis configuration
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          analytics: ['react-ga4'],
          xlsx: ['xlsx'],
          icons: ['lucide-react'],
          react_cookie_manager: ['react-cookie-manager'],
        },
      },
    },
    // Ensure compatibility with modern browsers
    target: 'esnext',
  },
})
