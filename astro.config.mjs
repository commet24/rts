import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    build: {
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false,
      assetsInlineLimit: 4096,
    },
  },
});
