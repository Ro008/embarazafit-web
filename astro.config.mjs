// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.embarazafit.com',
  output: 'static',
  adapter: vercel(),

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/dashboard'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});