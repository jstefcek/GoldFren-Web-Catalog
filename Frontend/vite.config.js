import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Define plugins for React and Tailwind CSS support
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Optimize dependencies for faster development builds
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'i18next',
      'react-i18next',
      'lucide-react',
    ],
  },

  build: {
    // Target configuration for optimized builds
    target: 'esnext',

    // Source map and CSS code splitting configuration for better performance
    sourcemap: false,
    cssCodeSplit: true,

    // Performance optimizations for production builds
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 4096,
    modulePreload: { polyfill: true },

    // Custom Rollup options for better caching and code splitting
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        codeSplitting: {
          groups: [
            { name: 'react',     test: /node_modules\/(react|react-dom)\//, priority: 40 },
            { name: 'router',    test: /node_modules\/react-router(-dom)?\//, priority: 30 },
            { name: 'i18n',      test: /node_modules\/(i18next|react-i18next|i18next-browser-languagedetector)\//, priority: 30 },
            { name: 'xlsx',      test: /node_modules\/xlsx\//, priority: 20 },
            { name: 'icons',     test: /node_modules\/lucide-react\//, priority: 20 },
            { name: 'analytics', test: /node_modules\/react-ga4\//, priority: 10 },
            { name: 'cookie',    test: /node_modules\/react-cookie-manager\//, priority: 10 },
          ],
        },
      },
    },

  },
})