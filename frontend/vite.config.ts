import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import Sitemap from 'vite-plugin-sitemap'

// Main site routes for sitemap generation
const routes = [
  '/',
  '/chi-sono',
  '/maternita',
  '/trattamenti',
  '/consulenze',
  '/yoga-e-meditazione',
  '/laboratori-eventi',
  '/blog',
  '/contatti'
]

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || 'https://www.arpelux.it';

  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths(),
      Sitemap({
        hostname: siteUrl,
        dynamicRoutes: routes,
        generateRobotsTxt: true,
        robots: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/admin/*'],
          }
        ]
      }),
    ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Docker/Colima volume mounts don't forward FS events into the VM, so
    // Vite's watcher misses edits. Polling makes HMR fire reliably in the
    // container (harmless outside it — just a small CPU cost in dev).
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      '/uploads': {
        target: 'http://backend:8080',
      },
      '/api': {
        target: 'http://backend:8080',
      },
    },
    },
  };
});
