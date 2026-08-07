/**
 * The browser suite.
 *
 * Playwright was deliberately left out of the initial toolchain: roughly 500 MB
 * of browser download and the slowest thing in the pipeline, for value that only
 * exists once there are screens to drive. There are now ten of them, and three
 * claims this repository makes in prose have had nothing behind them — that the
 * essays issue no JavaScript, that the whole run reaches no network, and that the
 * instrument is usable by keyboard and screen reader. This is what puts something
 * behind them.
 *
 * Against the BUILT SITE, not the dev server. `vite.config.ts` sets
 * `base: '/drift-meter/'`, so every asset URL is rewritten under that prefix in
 * the build and the pages are served from it — a suite pointed at `vite dev`
 * would be testing a URL layout the published site does not have. `baseURL`
 * therefore carries the prefix, and every `page.goto` below is relative to it.
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/** The trailing slash matters: `goto('drift-meter.html')` resolves against it. */
const BASE_URL = `http://localhost:${String(PORT)}/drift-meter/`;

const isCi = process.env.CI !== undefined && process.env.CI !== '';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCi,

  // No retries, on purpose. Every assertion here pins a claim the site makes in
  // prose, and an assertion that passes on the second attempt has not told
  // anybody whether the claim holds. A flake is a defect in the test or in the
  // instrument, and either way it should be visible rather than absorbed.
  retries: 0,
  workers: isCi ? 2 : undefined,

  // `github` annotates the failing line in the diff; `html` is what the CI job
  // uploads, and is where a trace from a failed run can actually be opened.
  reporter: isCi ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },

  // One browser. The suite checks structure, arithmetic, focus order and network
  // behaviour, none of which is engine-specific, and a second engine would double
  // the slowest job in CI to re-check them. Where something is engine-specific —
  // the SVG favicon, which Safari before 16 ignores — it is written down at the
  // site of the change rather than pretended away by a matrix.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: `npm run build && npx vite preview --port ${String(PORT)} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !isCi,
    timeout: 180_000,
  },
});
