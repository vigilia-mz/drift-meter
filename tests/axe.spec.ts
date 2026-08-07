/**
 * axe over every screen a reader can reach.
 *
 * One test that walks the flow rather than thirteen that each re-walk it. The
 * walk is the expensive part — reaching the debrief means two rounds and two
 * confidence gates — and doing it once per screen would multiply the slowest job
 * in CI by twelve to re-check markup that has not changed. The cost of the single
 * walk is that one failure stops the rest, so every violation is reported with the
 * screen it was found on and the whole set is printed before the test fails.
 *
 * TWELVE, NOT THIRTEEN. `process` is in the `Screen` union, has copy in
 * `shell.ts` and a title in `SCREENS`, and nothing in the application navigates to
 * it: `app.tsx` wires `onMethod` from the intro and the debrief, and there is no
 * equivalent for `process`. So it cannot be swept, and the count is recorded here
 * rather than being quietly absorbed into a passing run.
 *
 * ONE RULE IS OFF, AND ONLY FOR THE STUBS. See `STUB_EXEMPT` below.
 */
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { COPY, SLATE_A, walkWholeFlow } from './flow.js';

/**
 * The rule tags.
 *
 * A/AA through WCAG 2.2, plus best-practice. Best-practice is on because this is
 * a published research artifact rather than a product shipping to a deadline: the
 * rules in it — landmark structure, heading order, a unique `main` — are the ones
 * that make a page navigable by someone using a screen reader, and turning them
 * off because they are not legally required is the sort of reasoning this project
 * is about.
 */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * `region` is disabled on the three stub screens and nowhere else.
 *
 * A stub is a heading, one paragraph and a button inside `<main>`. The rule wants
 * every piece of content inside a landmark, and it is satisfied on every built
 * screen; on a stub it fires because the paragraph is a direct child of `main`
 * rather than of a `section` within it. Adding a wrapper to satisfy a rule on a
 * page whose only content is "this is not finished yet" would be markup written
 * for the checker. The exemption goes away with the screens, in #18.
 */
const STUB_EXEMPT = ['region'];
const STUBS = new Set(['method', 'encoded']);

interface Violation {
  readonly screen: string;
  readonly id: string;
  readonly impact: string;
  readonly help: string;
  readonly targets: string;
}

/**
 * Nothing is still moving.
 *
 * `.dm-button` declares `transition: background 0.15s ease` and does not transition
 * `color`. So for 150ms after a confidence gate opens, the button's text is already
 * its enabled colour while its background is still the disabled grey, and a
 * contrast check that lands in that window reports 1.2:1 on a control that settles
 * at 6.75:1. The first version of this sweep did exactly that, on two screens, and
 * the finding was entirely an artefact of when it looked.
 *
 * A reduced-motion context does not fix it: the block collapses the duration to
 * 0.01ms and the transition is still registered as running on the frame the click
 * returns, so the computed background is still the start value. Only waiting for it
 * gives the settled answer, and `getAnimations()` is the exact question — no
 * timeout matched by hand to a duration in the stylesheet.
 */
async function settled(page: Page): Promise<void> {
  await page.waitForFunction(
    () => !document.getAnimations().some((animation) => animation.playState === 'running'),
  );
}

async function scan(page: Page, screen: string): Promise<Violation[]> {
  await settled(page);
  let builder = new AxeBuilder({ page }).withTags(TAGS);
  if (STUBS.has(screen)) builder = builder.disableRules(STUB_EXEMPT);
  const results = await builder.analyze();
  return results.violations.map((violation) => ({
    screen,
    id: violation.id,
    impact: violation.impact ?? 'unknown',
    help: violation.help,
    targets: violation.nodes
      .map(
        (node) => `${node.target.join(' ')} :: ${(node.failureSummary ?? '').replace(/\s+/g, ' ')}`,
      )
      .join('\n      '),
  }));
}

test('every reachable screen of the instrument is free of axe violations', async ({ page }) => {
  test.slow();

  const found: Violation[] = [];
  const swept: string[] = [];

  await walkWholeFlow(page, SLATE_A, async (screen) => {
    swept.push(screen);
    found.push(...(await scan(page, screen)));
  });

  for (const violation of found) {
    console.error(
      `axe: ${violation.screen}: ${violation.id} (${violation.impact}) — ${violation.help}\n` +
        `      ${violation.targets}`,
    );
  }

  expect(found).toEqual([]);

  // Sixteen stops over twelve screens. Written down so that a walk which silently
  // stopped short — a button renamed, a gate that no longer opens — fails here
  // instead of reporting a clean sweep of four screens.
  expect(swept).toEqual([
    'intro',
    'method',
    'consent',
    'round:1',
    'round:1:panels-open',
    'rate:1',
    'round:2',
    'rate:2',
    'debrief',
    'transfer',
    'transfer:answered',
    'round3',
    'round3:revealed',
    'spec',
    'encoded',
  ]);
});

/**
 * The thirteenth screen.
 *
 * Skipped with its reason rather than left out of the list, because a sweep that
 * covers twelve of thirteen and says "thirteen" is the kind of claim this
 * repository exists to not make.
 */
test('the process screen is swept', () => {
  test.skip(
    true,
    'No navigation reaches `process` in this build. It is in the Screen union and in ' +
      'SCREENS, and nothing links to it — see src/app.tsx, which wires `method` from the ' +
      'intro and the debrief and has no equivalent. Unskip this when a link exists.',
  );
});

/**
 * One node, one rule, exempted with the clause.
 *
 * `.sep` is the `· · ·` between sections of the long essay, five of them, at
 * 1.82:1 on the paper. axe reports it as failing text and axe is not wrong that it
 * is text: `aria-hidden` stops a screen reader reading it and does nothing for a
 * sighted reader with low vision, so hiding it from the tree is not the argument.
 *
 * The argument is the exemption WCAG 2.2 writes into SC 1.4.3 itself: text that is
 * pure decoration has no contrast requirement. Three middots between two paragraphs
 * carry nothing — the gap is what marks the section — and darkening them to 4.5:1
 * would make an ornament louder than the prose it separates, which is a design
 * change with no reader on the other end of it.
 *
 * So the exemption is one rule on one selector, applied by filtering rather than by
 * `exclude()`, which would have dropped `.sep` from every other rule too. If a
 * heading or a paragraph ever fails `color-contrast`, this still catches it.
 */
const DECORATIVE_TEXT = { page: 'atrophy.html', rule: 'color-contrast', selector: '.sep' };

/** The three prose pages, which carry no script and are swept as documents. */
for (const [path, name] of [
  ['index.html', 'the landing page'],
  ['essay.html', 'Evaluating the Evaluator'],
  ['atrophy.html', 'The Atrophy of Judgment'],
] as const) {
  test(`${name} is free of axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    const violations = results.violations
      .map((violation) => {
        if (path !== DECORATIVE_TEXT.page || violation.id !== DECORATIVE_TEXT.rule) {
          return violation;
        }
        const nodes = violation.nodes.filter(
          (node) => !node.target.some((t) => String(t).startsWith(DECORATIVE_TEXT.selector)),
        );
        return { ...violation, nodes };
      })
      .filter((violation) => violation.nodes.length > 0);

    for (const violation of violations) {
      console.error(
        `axe: ${path}: ${violation.id} (${violation.impact ?? 'unknown'}) — ${violation.help}\n` +
          `      ${violation.nodes.map((node) => node.target.join(' ')).join(' | ')}`,
      );
    }
    expect(violations).toEqual([]);
  });
}

/**
 * And the exemption above is a real one, not a selector that matches nothing.
 *
 * A filter written against a class that has been renamed away silently stops being
 * an exemption and starts being dead code that makes the sweep look stricter than
 * it is. This asserts the five separators are still there and still the only thing
 * the filter drops.
 */
test('the decorative-text exemption still describes something on the page', async ({ page }) => {
  await page.goto(DECORATIVE_TEXT.page);
  const separators = page.locator(DECORATIVE_TEXT.selector);
  await expect(separators).toHaveCount(5);
  await expect(separators.first()).toHaveAttribute('aria-hidden', 'true');

  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const dropped = results.violations
    .filter((violation) => violation.id === DECORATIVE_TEXT.rule)
    .flatMap((violation) => violation.nodes)
    .map((node) => node.target.join(' '));
  expect(dropped.length).toBe(5);
  for (const target of dropped) expect(target.startsWith(DECORATIVE_TEXT.selector)).toBe(true);
});

/**
 * What axe cannot see, asserted directly.
 *
 * Automated checks reach about a third of WCAG, and the parts of this instrument
 * that matter most to a screen-reader user are in the other two thirds: the
 * announcement that stands in for a router, the value text on a slider whose raw
 * number is meaningless, the supplied-value note as a description rather than a
 * floating paragraph. None of those produce an axe violation when they are absent.
 */
test('the shell announces screen changes and moves focus to the heading', async ({ page }) => {
  await page.goto(`drift-meter.html?order=assisted-first&slate=A&arm=ai`);

  const live = page.locator('.dm-live');
  await expect(live).toHaveAttribute('role', 'status');
  await expect(live).toHaveAttribute('aria-live', 'polite');
  await expect(live).toHaveText(
    'The Drift Meter. An instrument in two rounds, about three minutes.',
  );

  // Focus lands on the container, not the first control, so the heading is read
  // before the reader is dropped into a widget.
  await expect(page.locator('main.dm-screen')).toBeFocused();
  await expect(page).toHaveTitle('The Drift Meter — Start');

  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await expect(live).toHaveText(
    'Before you begin. What this records, and what leaves your browser.',
  );
  await expect(page).toHaveTitle('The Drift Meter — Before you begin');

  await page.getByRole('button', { name: COPY.consent.begin, exact: true }).click();
  // The ordinal is in the announcement because rounds one and two are the same
  // screen name, and an effect keyed on the name alone would not re-fire between
  // them — the single most important transition in the run.
  await expect(live).toHaveText(
    'Round 1 of 2. Three cases to review. Work through them in any order.',
  );
  await expect(page).toHaveTitle('The Drift Meter — Round 1');
  await expect(page.locator('main.dm-screen')).toBeFocused();

  await page.getByRole('button', { name: COPY.round.continue }).click();
  await page.getByRole('radio', { name: COPY.rate.scale[2] }).click();
  await page.getByRole('button', { name: COPY.rate.continue }).click();
  await expect(live).toHaveText(
    'Round 2 of 2. Three cases to review. Work through them in any order.',
  );
  await expect(page).toHaveTitle('The Drift Meter — Round 2');
});

test('a slider announces its formatted value and its supplied-value note', async ({ page }) => {
  await page.goto(`drift-meter.html?order=assisted-first&slate=A&arm=ai`);
  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await page.getByRole('button', { name: COPY.consent.begin, exact: true }).click();

  // "0.0006" read aloud is not a quantity anybody holds. "$2.00" and "85%" are,
  // and `aria-valuetext` is what makes the announcement the same thing the sighted
  // reader is looking at.
  const bednet = page.locator('.dm-case').nth(1);
  const sliders = bednet.getByRole('slider');
  await expect(sliders.nth(0)).toHaveAttribute('aria-valuetext', '$2.00');
  await expect(sliders.nth(1)).toHaveAttribute('aria-valuetext', '85%');
  await expect(sliders.nth(2)).toHaveAttribute('aria-valuetext', '0.0006');

  // A real <label for>, so the control has a name at all.
  await expect(sliders.nth(0)).toHaveAccessibleName('Cost per net delivered');

  // And the anchor the reader is being anchored by, as a description rather than
  // a paragraph sitting nearby.
  await expect(sliders.nth(0)).toHaveAccessibleDescription(COPY.round.suppliedNote);

  const value = await sliders.nth(0).getAttribute('aria-valuetext');
  await sliders.nth(0).focus();
  await sliders.nth(0).press('ArrowRight');
  await expect(sliders.nth(0)).not.toHaveAttribute('aria-valuetext', value ?? '');
});

test('the uncertainty flag is a pressed button, and its glyph is not read out', async ({
  page,
}) => {
  await page.goto(`drift-meter.html?order=assisted-first&slate=A&arm=ai`);
  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await page.getByRole('button', { name: COPY.consent.begin, exact: true }).click();

  const flag = page.locator('.dm-case').first().locator('.dm-flag');
  await expect(flag).toHaveAttribute('aria-pressed', 'false');
  // The ◉/○ glyph duplicates what aria-pressed already says, so the accessible
  // name is the label alone rather than the label with a symbol read in front.
  await expect(flag).toHaveAccessibleName(COPY.round.flagOff);

  await flag.click();
  await expect(flag).toHaveAttribute('aria-pressed', 'true');
  await expect(flag).toHaveAccessibleName(COPY.round.flagOn);
});

/**
 * Reduced motion.
 *
 * The guard is a universal selector, so it collapses anything that animates
 * whether or not the animation existed when the guard was written. What this test
 * checks is that it is still shipped, and that a transition really does come out
 * at nothing under the preference — measured, rather than inferred from the
 * stylesheet.
 *
 * There are no `@keyframes` in the instrument yet: the two entrance animations the
 * original had were not rebuilt. The count is reported so that the day one lands,
 * a reviewer can see the guard was standing by rather than assume it.
 */
test('a reduced-motion preference collapses the instrument’s transitions', async ({ browser }) => {
  const measure = async (reducedMotion: 'reduce' | 'no-preference') => {
    const context = await browser.newContext({ reducedMotion });
    const page = await context.newPage();
    await page.goto('drift-meter.html');
    const duration = await page
      .locator('.dm-button')
      .first()
      .evaluate((el) => Number.parseFloat(getComputedStyle(el).transitionDuration));
    const css = await page.evaluate(async () => {
      const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')];
      const bodies = await Promise.all(links.map(async (link) => (await fetch(link.href)).text()));
      return bodies.join('\n');
    });
    await context.close();
    return { duration, css };
  };

  // `.dm-button` declares `transition: background 0.15s ease`. Both preferences are
  // measured, so a pass means the guard did something rather than that the
  // stylesheet declared nothing to guard.
  const plain = await measure('no-preference');
  expect(plain.duration).toBeCloseTo(0.15, 3);

  const reduced = await measure('reduce');
  expect(reduced.duration).toBeLessThan(0.001);

  expect(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(reduced.css),
    'the reduced-motion block is still in the instrument stylesheet',
  ).toBe(true);

  const keyframes = (reduced.css.match(/@keyframes\s+[\w-]+/g) ?? []).length;
  // eslint-disable-next-line no-console -- a count worth seeing in the run log
  console.log(`reduced-motion: ${String(keyframes)} @keyframes in the instrument stylesheet`);
});
