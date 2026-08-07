/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact()],
  // The site is published at https://vigilia-mz.github.io/drift-meter/, so every
  // asset URL is rewritten under this prefix. It is set here rather than injected
  // by actions/configure-pages at build time, so the base path is visible in the
  // repository instead of being a property of the CI environment.
  //
  // A custom domain would remove the prefix — see the open issue. If one is
  // added, this becomes '/'.
  base: '/drift-meter/',
  build: {
    target: 'es2022',
    // The prose pages ship no JavaScript, so there is nothing to preload for
    // them and no reason to pay for the polyfill.
    modulePreload: { polyfill: false },
    rollupOptions: {
      // One entry per page. The three prose pages carry no <script>, so Rollup
      // emits no JavaScript chunk for them — a property an end-to-end test
      // asserts, because it is easy to break by accident and is the reason the
      // essays can be read with scripting disabled.
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        essay: resolve(import.meta.dirname, 'essay.html'),
        atrophy: resolve(import.meta.dirname, 'atrophy.html'),
        driftMeter: resolve(import.meta.dirname, 'drift-meter.html'),
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
