/**
 * The static protocol page carries the whole protocol.
 *
 * `protocol.html` exists because a reviewer could not read the instrument. The
 * protocol screen is inside a Preact app, `drift-meter.html` is a 986-byte shell, and
 * `src/platform/history.ts` deliberately gives the screen no URL — so the seven
 * measures with their formulas, the six predictions with their falsification
 * conditions and the nine limits were unfetchable, uncitable and unarchivable. A
 * generated page fixes that only for as long as it is complete, and a generated page
 * is exactly the kind that goes quietly incomplete: nobody reads its diff.
 *
 * So this reads the content module and holds the built page against it. It is the
 * second test in the suite to import from `src/content/` rather than write its
 * strings out, and for the same reason `tests/prose.spec.ts` gives at length for the
 * first one: these are not a constant equalling itself. The module is what the
 * instrument computes from and the page is a separate rendering of it, and the
 * failure being defended against is the two disagreeing — a measure added to the
 * module and missing from the page, which is the shape the landing page's measure
 * list already went out of sync in once.
 *
 * `tests/prose.spec.ts` covers this page for requesting no JavaScript and reading
 * with scripting off; `tests/axe.spec.ts` sweeps it. This file is only about whether
 * the protocol is all there and whether it can be cited.
 */
import { expect, test } from '@playwright/test';

const PATH = 'protocol.html';

test('every measure appears with its formula and its stated threat', async ({ page }) => {
  const { MEASURE_SPECS } = await import('../src/content/method.js');

  await page.goto(PATH);
  const text = await page.locator('body').innerText();

  for (const measure of MEASURE_SPECS) {
    expect(text, `the page does not name ${measure.key}`).toContain(measure.label);
    // The formula is the half of a measure that a methods reader is here for, and
    // the half a summary would drop first.
    expect(text, `${measure.key} has no formula on the page`).toContain(measure.formula);
    expect(text, `${measure.key} has no stated threat on the page`).toContain(measure.threat);
  }
});

test('every prediction appears with the condition that would falsify it', async ({ page }) => {
  const { PRED_ROWS } = await import('../src/content/method.js');

  await page.goto(PATH);
  const text = await page.locator('body').innerText();

  for (const row of PRED_ROWS) {
    expect(text, `${row.id} is not on the page`).toContain(row.claim);
    expect(text, `${row.id} has no falsification condition on the page`).toContain(row.test);
  }
});

/**
 * P6 before P5, on the page as in the module.
 *
 * `src/content/invariants.test.ts` already asserts the module's order and
 * `METHOD.predictionsOrderNote` says on the page why it is that way. What is
 * unasserted without this is whether the rendering preserved it — a table built by a
 * sort, or by a map over a key set, would tidy it into numerical sequence and make
 * the note beneath it wrong.
 */
test('the predictions are in the order the protocol registers them', async ({ page }) => {
  const { PRED_ROWS } = await import('../src/content/method.js');

  await page.goto(PATH);
  const ids = await page.locator('.data-table tbody th.pred-id').allInnerTexts();

  expect(ids).toEqual(PRED_ROWS.map((row) => row.id));
});

test('every limit appears', async ({ page }) => {
  const { METHOD } = await import('../src/content/method.js');

  await page.goto(PATH);
  const text = await page.locator('body').innerText();

  for (const limit of METHOD.limits) {
    expect(text, 'a limit is missing from the page').toContain(limit);
  }
});

test('the four arms appear, named as the instrument names them', async ({ page }) => {
  const { armRows } = await import('../src/content/method.js');

  await page.goto(PATH);
  const text = await page.locator('body').innerText();

  for (const row of armRows()) {
    expect(text, `the arm ${row.arm} is not on the page`).toContain(row.arm);
    expect(text).toContain(row.isolates);
  }
});

/**
 * The pinned model, which is the one constant here that is not prose.
 *
 * Hard rule 3 makes a model change a re-baseline rather than maintenance. A protocol
 * page naming a model the build does not use would be the quietest possible way to
 * break that, so the page is held against `shared/model.ts` rather than against a
 * string written here.
 */
test('the page names the model the build is pinned to', async ({ page }) => {
  const { PINNED_MODEL } = await import('../shared/model.js');

  await page.goto(PATH);
  await expect(page.locator('code.formula', { hasText: PINNED_MODEL })).toHaveCount(1);
});

/**
 * The citation, held against CITATION.cff rather than against a literal.
 *
 * The three hand-written pages carry their version and DOI by hand and can go stale;
 * this one is generated from the citation file and cannot. That is only true while
 * the generator keeps reading it, which is what this checks.
 */
test('the footer cites the version the citation file names', async ({ page }) => {
  const { readFileSync } = await import('node:fs');
  const cff = readFileSync('CITATION.cff', 'utf8');
  const version = /^version:\s*'?([^'\n]+?)'?\s*$/m.exec(cff)?.[1];
  const doi = /^doi:\s*'?([^'\n]+?)'?\s*$/m.exec(cff)?.[1];
  expect(version, 'CITATION.cff has no version').toBeDefined();
  expect(doi, 'CITATION.cff has no doi').toBeDefined();

  await page.goto(PATH);
  const foot = await page.locator('.foot').innerText();
  expect(foot).toContain(`v${String(version)}`);
  expect(foot).toContain(String(doi));
});

/**
 * The page can be cited by the paragraph rather than as a whole.
 *
 * This is the capability the in-app screen cannot have — it has no URL, so it has no
 * fragments either — and it is most of what a methods reader wants from a protocol.
 * Checked by navigating to each fragment and asking the browser what it resolved to,
 * rather than by looking for the attribute in the markup: an id that exists and does
 * not scroll anywhere is not a working citation.
 */
test('every section and every measure can be linked to', async ({ page, baseURL }) => {
  if (baseURL === undefined) throw new Error('baseURL is set in playwright.config.ts');
  const { MEASURE_SPECS } = await import('../src/content/method.js');

  const fragments = [
    'design',
    'arms',
    'measures',
    'primary-outcome',
    'predictions',
    'provenance',
    'limits',
    ...MEASURE_SPECS.map((measure) => `measure-${measure.key}`),
  ];

  for (const fragment of fragments) {
    await page.goto(`${PATH}#${fragment}`);
    const target = page.locator(`#${fragment}`);
    await expect(target, `#${fragment} addresses nothing on the page`).toHaveCount(1);
    await expect(target, `#${fragment} addresses something invisible`).toBeVisible();
  }
});

/**
 * The instrument's one anchor points at a page this build emits.
 *
 * `dm-link` on the protocol screen is the first anchor the app has ever had, which means
 * v0.8 is the first version in which the app can have a broken link at all. The target
 * ships in the same build as the anchor today; what this defends is that it goes on doing
 * so. A link to `protocol.html` from inside the instrument, in a release where the
 * generator did not run, is a 404 reached from the one screen whose subject is whether
 * this project's claims can be checked.
 *
 * Followed rather than inspected: the assertion is that clicking it arrives somewhere with
 * the protocol on it, which is the property, rather than that an href matches a string.
 */
test('the link out of the instrument reaches the protocol page', async ({ page }) => {
  const { SCREENS } = await import('../src/content/shell.js');

  await page.goto('drift-meter.html');
  await page.getByRole('button', { name: 'Read the protocol first', exact: true }).click();

  const link = page.locator('a.dm-link');
  await expect(link).toHaveCount(1);
  await link.click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(SCREENS.method.title);
  expect(new URL(page.url()).pathname).toContain('protocol.html');
});

/**
 * And the page says, in its own words, that it is the same text as the screen.
 *
 * Two renderings of one module is only an honest arrangement if the page says so.
 * A reader who has read the protocol screen and then finds this page is entitled to
 * know whether they are looking at a second document that might differ.
 */
test('the page discloses that it and the screen are one text', async ({ page }) => {
  await page.goto(PATH);
  const note = page.locator('.protocol-note');
  await expect(note).toHaveCount(1);
  await expect(note).toContainText('one text');
});
