/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    target: 'es2022',
    // The prose pages ship no JavaScript, so there is nothing to preload for
    // them and no reason to pay for the polyfill.
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
  test: {
    // The domain core and the reducer are pure: no DOM, no framework. Component
    // tests add their own jsdom environment per file.
    environment: 'node',
    include: ['src/**/*.test.ts', 'shared/**/*.test.ts'],
    restoreMocks: true,
  },
});
