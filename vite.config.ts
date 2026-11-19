import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false,
        includeAssets: [
          'apple-touch-icon.png',
          'icons/favicon-*.png',
          'manifest-*.webmanifest',
          'assets/mascot/*.png',
        ],
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 2.5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2,webmanifest}'],
          globIgnores: [
            '**/assets/aistudio/**',
            '**/assets/mascot/moments/**',
            '**/icons/pwa-*.png',
            '**/icons/apple-touch-icon-*.png',
          ],
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              urlPattern: /\/(?:icons\/(?:pwa|apple-touch-icon)-.+\.png|assets\/mascot\/moments\/.+\.webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'achsoo-mascot-media-v1',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('src/data/cardsData')) {
              return 'vocab-dataset';
            }
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/')
            ) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/@supabase/')) {
              return 'vendor-supabase';
            }
            if (id.includes('node_modules/recharts')) {
              return 'vendor-charts';
            }
            return undefined;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
