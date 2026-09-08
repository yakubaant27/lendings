// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kuton66.yakuba-ant27.workers.dev',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});