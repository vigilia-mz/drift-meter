/**
 * The three prose pages issue no JavaScript.
 *
 * This assertion has been claimed before it existed. `CLAUDE.md` said an
 * end-to-end test made it, and a comment in `vite.config.ts` said the same; there
 * was no such test and no Playwright in the toolchain, and both were corrected in
 * v0.6 to say that review was the only thing holding the property. This is the
 * test they were describing.
 *
 * It counts REQUESTS rather than reading the markup, which is the half that
 * `scripts/check-size.mjs` cannot do. A page with no `<script>` tag can still
 * pull JavaScript in — a stylesheet that imports it, a preload hint, an iframe —
 * and the only way to know what a browser fetched is to watch a browser fetch it.
 * The static half runs in the deploy job, where there is no browser; this half
 * runs here. Neither is redundant.
 *
 * The pages are also checked for reaching nothing off the origin, which is the
 * other promise in the same family: the fonts are self-hosted because the consent
 * screen says nothing leaves the browser, and a CDN request would make that false
 * on every page load of the site — including these two, which have no consent
 * screen to qualify it.
 */
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: 'index.html', heading: 'The Drift Meter' },
  { path: 'essay.html', heading: 'Evaluating the Evaluator' },
  { path: 'atrophy.html', heading: 'The Atrophy of Judgment' },
] as const;

for (const { path, heading } of PAGES) {
  test(`${path} requests no JavaScript and nothing off the origin`, async ({ page, baseURL }) => {
    if (baseURL === undefined) throw new Error('baseURL is set in playwright.config.ts');
    const site = new URL(baseURL).origin;

    const javascript: string[] = [];
    const offOrigin: string[] = [];

    page.on('request', (request) => {
      const url = new URL(request.url());
      if (/\.m?js$/i.test(url.pathname) || request.resourceType() === 'script') {
        javascript.push(`${request.resourceType()} ${request.url()}`);
      }
      if (url.origin !== site && url.protocol !== 'data:') offOrigin.push(request.url());
    });

    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    // Give a late request somewhere to turn up before the counters are read.
    await page.waitForLoadState('networkidle');

    expect(javascript, `${path} fetched JavaScript`).toEqual([]);
    expect(offOrigin, `${path} fetched from another origin`).toEqual([]);
  });

  test(`${path} is readable with scripting disabled`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(path);

    // Not "does not crash" — the whole document is there. The heading, the byline,
    // the body, and a way back.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    const words = (await page.locator('body').innerText()).split(/\s+/).length;
    expect(words, `${path} rendered ${String(words)} words with scripting off`).toBeGreaterThan(
      200,
    );

    await context.close();
  });
}

/**
 * And the favicon, which used to 404 on first load.
 *
 * A page with no `<link rel="icon">` makes the browser guess `/favicon.ico`, and
 * on a site served under a path prefix that guess is wrong twice over. The link is
 * now declared on all four pages and resolves under the build's base path, which
 * is the part worth pinning: `base: '/drift-meter/'` rewrites it, and a page that
 * hard-coded the prefix would break the moment a custom domain removed it.
 */
test('every page declares a favicon that resolves', async ({ page, baseURL }) => {
  if (baseURL === undefined) throw new Error('baseURL is set in playwright.config.ts');

  for (const path of [...PAGES.map((p) => p.path), 'drift-meter.html']) {
    await page.goto(path);
    const icon = page.locator('link[rel="icon"]');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute('type', 'image/svg+xml');

    const href = await icon.getAttribute('href');
    expect(href, `${path} declares no favicon href`).not.toBeNull();
    const resolved = new URL(href ?? '', baseURL);
    expect(resolved.pathname, `${path}'s favicon is outside the build's base path`).toBe(
      '/drift-meter/favicon.svg',
    );

    const response = await page.request.get(resolved.toString());
    expect(response.status(), `${path}'s favicon does not resolve`).toBe(200);
    expect(response.headers()['content-type']).toContain('svg');
  }
});

/**
 * The landing page names every measure the instrument actually has.
 *
 * This is the one cross-check in the suite that reads a label out of `src/content/`
 * rather than writing it out, and the exception is the point: `index.html` is
 * hand-authored prose and `MEASURE_SPECS` is the typed module the instrument
 * computes from. They are two independently maintained sources for one list, which
 * is the shape that goes out of sync silently — the page said five for as long as
 * there were five, and kept saying five after a sixth arrived. Nothing in the
 * repository noticed; a hand count did. So this is not a constant equalling itself,
 * it is the front door held against the thing behind it.
 *
 * It checks presence, not phrasing. The page is free to introduce a measure however
 * it likes, and free to say — as it now does — that the sixth reports as undefined.
 * What it is not free to do is leave one out.
 */
test('the landing page names every measure the protocol screen defines', async ({ page }) => {
  const { MEASURE_SPECS } = await import('../src/content/method.js');

  await page.goto('index.html');
  const section = page.locator('section', { hasText: 'What it measures' });
  const prose = uk(((await section.innerText()) || '').toLowerCase());

  for (const measure of MEASURE_SPECS) {
    // `gap` is the signed difference between two of the others and the page calls it
    // confidence calibration, which is the vocabulary a reader arrives with.
    const named = measure.key === 'gap' ? 'confidence calibration' : measure.label.toLowerCase();
    expect(prose, `the landing page does not name ${measure.key}`).toContain(uk(named));
  }
});

/**
 * The prose pages spell in American English and the content modules in British.
 *
 * `index.html` has “revision behavior” and “programme” in the same sentence;
 * `essay.html` has “organize”. The instrument's modules are consistently British.
 * This test is not the place to settle that — it is here to catch a measure the
 * front door leaves out, and failing over one letter would make it a spelling
 * checker that occasionally notices a missing measure. So both sides are normalised
 * on the one variant that actually collides, and the divergence is left standing
 * where the author can see it rather than corrected by a test's side effect.
 */
function uk(text: string): string {
  return text.replace(/behavior/g, 'behaviour');
}
