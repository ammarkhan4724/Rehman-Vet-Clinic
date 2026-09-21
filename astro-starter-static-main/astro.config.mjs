// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * Static only. CLAUDE.md hard rule: no SSR, no adapter, no request-time routes.
 * Cloudflare Pages Functions in functions/ are a separate runtime and keep
 * working alongside this static output.
 *
 * Tailwind CSS v4 is the official Astro 7 path: `@tailwindcss/vite` here,
 * `@import "tailwindcss"` in src/styles/global.css. Do not add
 * `@astrojs/tailwind` (that is the Tailwind 3 integration).
 *
 * Replace `site` with the client's public origin when you create a repo from
 * this template. A wrong origin makes every canonical and Open Graph URL lie.
 */
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
