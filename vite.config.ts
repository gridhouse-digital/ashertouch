import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://ashertouch-hc.com',
      dynamicRoutes: ['/services', '/services/rates', '/about', '/areas', '/careers', '/contact', '/privacy'],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
});
