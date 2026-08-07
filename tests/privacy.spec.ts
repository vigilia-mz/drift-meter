/**
 * The consent screen's promises, tested.
 *
 * The screen makes four, and until now nothing checked any of them:
 *
 *   Leaves the browser — "Nothing."
 *   Stored about you — "No cookie, no analytics, no fingerprint."
 *   Where it is going — "Nowhere."
 *   Stays on this page — held in memory, "gone when you close the tab."
 *
 * Two of those are load-bearing beyond this screen: CLAUDE.md gives them as the
 * reason the fonts are self-hosted, because a third-party font request would make
 * both false on every page load. So a font that moved to a CDN would break a
 * promise on a screen nobody edited, and this is where that shows up.
 *
 * The run is taken down the local-only branch, which is the choice the screen
 * offers a reader who does not want even the optional part. It is a real branch —
 * stored on the run and gating every path to the endpoint — rather than a courtesy,
 * and the whole flow is walked under it.
 */
import { expect, test } from '@playwright/test';
import { COPY, SLATE_A, walkWholeFlow } from './flow.js';

test('the consent screen still makes the promises the rest of the repository rests on', async ({
  page,
}) => {
  await page.goto('drift-meter.html');
  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.consent.heading })).toBeVisible();

  const rows = page.locator('.dm-row');
  await expect(rows.filter({ hasText: 'Leaves the browser' })).toContainText(
    COPY.consent.leavesTheBrowser,
  );
  await expect(rows.filter({ hasText: 'Stored about you' })).toContainText(COPY.consent.noCookie);
  await expect(rows.filter({ hasText: 'Where it is going' })).toContainText('Nowhere.');
  await expect(rows.filter({ hasText: 'Stays on this page' })).toContainText(
    'gone when you close the tab',
  );

  // Both buttons, and the exact label of the second one.
  await expect(page.getByRole('button', { name: COPY.consent.begin, exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: COPY.consent.beginLocal, exact: true }),
  ).toBeVisible();
});

test('a local-only run reaches no network and stores nothing', async ({ page, baseURL }) => {
  test.slow();
  if (baseURL === undefined) throw new Error('baseURL is set in playwright.config.ts');
  const site = new URL(baseURL).origin;

  const offOrigin: string[] = [];
  const reflect: string[] = [];
  const nonDocument: string[] = [];

  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.includes('reflect')) reflect.push(request.url());
    if (url.origin !== site && url.protocol !== 'data:') {
      offOrigin.push(request.url());
      return;
    }
    // Everything the instrument is allowed to fetch is a static asset of its own
    // build. Anything with a body — a beacon, a form post, an XHR — is not.
    if (request.method() !== 'GET') nonDocument.push(`${request.method()} ${request.url()}`);
  });

  const screens: string[] = [];
  await walkWholeFlow(
    page,
    SLATE_A,
    (screen) => {
      screens.push(screen);
    },
    { localOnly: true },
  );

  // Twelve screens' worth of a run, on the branch that asks for nothing.
  expect(screens.length).toBeGreaterThan(10);
  expect(reflect, 'the run reached the reflection endpoint').toEqual([]);
  expect(offOrigin, 'the run reached another origin').toEqual([]);
  expect(nonDocument, 'the run sent something').toEqual([]);

  // "No cookie, no analytics, no fingerprint. There is no account and no
  // identifier." Nothing was written anywhere a later visit could read.
  const stored = await page.evaluate(() => ({
    cookie: document.cookie,
    local: window.localStorage.length,
    session: window.sessionStorage.length,
  }));
  expect(stored.cookie).toBe('');
  expect(stored.local).toBe(0);
  expect(stored.session).toBe(0);

  // "It is held in memory for the length of the run and is gone when you close
  // the tab." A reload is the closest a test gets to closing it, and what comes
  // back is the first screen with no run behind it.
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: COPY.intro.heading })).toBeVisible();
});

/**
 * The endpoint is off, and off by construction rather than by configuration.
 *
 * `VITE_REFLECT_ENDPOINT` is empty in the committed `.env`, so every clone and
 * fork is dark and cannot spend the author's API credit. `VITE_*` variables are
 * compiled into the client, which is what makes this checkable from outside: if a
 * URL had been baked in, it would be a string in the bundle.
 */
test('no endpoint URL is compiled into the shipped bundle', async ({ page, baseURL }) => {
  if (baseURL === undefined) throw new Error('baseURL is set in playwright.config.ts');
  await page.goto('drift-meter.html');

  const scripts = await page
    .locator('script[src]')
    .evaluateAll((nodes) => nodes.map((node) => (node as HTMLScriptElement).src));
  expect(scripts.length).toBe(1);

  const source = await (await page.request.get(scripts[0] ?? '')).text();
  expect(source.length).toBeGreaterThan(1000);

  // Nothing that looks like a reflection endpoint, and nothing that looks like a
  // key. The second is CLAUDE.md's second hard rule, and the cheapest possible
  // check of it is to read what shipped.
  expect(source).not.toContain('/api/reflect');
  expect(source).not.toContain('api.anthropic.com');
  expect(source).not.toMatch(/sk-ant-[\w-]/);
  expect(source).not.toContain('ANTHROPIC_API_KEY');
});
