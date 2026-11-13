import { defineConfig } from 'astro/config';

// Change `site` if the Cloudflare Pages project ends up with a different name.
export default defineConfig({
  site: 'https://roots-and-pantry-demo.pages.dev',
  output: 'static',
  build: { format: 'directory' },
});
