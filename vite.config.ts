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
      // emits no JavaScript chunk for them. Nothing asserts that per page yet —
      // the end-to-end check is scheduled in issue #19 — so until it lands the
      // property is held by review alone. It is easy to break by accident, and
      // it is the reason the essays can be read with scripting disabled.
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
    // `api/` is in the glob because the endpoint holds the API key, and the paths
    // that decide whether to spend it — the origin check, the size cap, the
    // question list, the signature on the repair channel — are exactly the ones
    // that should not be held by review alone. None of them need a network: they
    // all run before a client is constructed.
    include: ['src/**/*.test.ts', 'shared/**/*.test.ts', 'api/**/*.test.ts'],
    restoreMocks: true,
    // Vitest replaces CSS with an empty string by default, which is right for
    // every stylesheet here except one. `tokens.css` is the only file allowed to
    // name a colour, and `tone.test.ts` reads it as text to assert that every
    // semantic role the domain layer can return is actually bound to one — an
    // unbound role renders an unstyled row rather than failing. That test needs
    // the real file, so the stub is narrowed to everything else rather than
    // turned off. It is also why the test can read the stylesheet without
    // `node:fs`, which the application deliberately has no types for.
    css: { include: [/tokens\.css/] },
  },
});
