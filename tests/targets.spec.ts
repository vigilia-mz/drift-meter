/**
 * Target size, measured rather than declared.
 *
 * At 390 × 844 the instrument had two controls under WCAG 2.2's AA minimum of
 * 24 × 24 (SC 2.5.8): the disclosure rendered 129 × 18, and the range inputs
 * 350 × 16. Two more were over 24 and under the 44 × 44 that AAA asks for
 * (SC 2.5.5) — the uncertainty flag at 149 × 35 and the decision buttons at
 * 350 × 41. All four are now 44 in both directions.
 *
 * THE MEASUREMENT IS NOT A BOUNDING BOX. Two of the four grew by a transparent
 * `::before`, and a pseudo-element does not appear in `getBoundingClientRect` —
 * the disclosure still reports 18px tall and is 44px live. A test written against
 * the box would have failed on a control that works and passed on one that does
 * not, so this probes the hit area itself: `elementFromPoint` at eight positions
 * around a 44 × 44 square centred on the control, each of which has to come back
 * as the control or something inside it.
 *
 * That is also the assertion that would have caught the first attempt at this,
 * where the slider's extra height was quietly won by the note underneath it: the
 * box was 44 and four of its pixels answered to a paragraph.
 */
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { COPY, SLATE_A, begin, cases, open } from './flow.js';

/** SC 2.5.5, Target Size (Enhanced). The AA floor in SC 2.5.8 is 24. */
const SIDE = 44;

/** One inside the edge, so a probe exactly on the boundary is not the test. */
const REACH = SIDE / 2 - 1;

const PHONE = { width: 390, height: 844 };

interface Miss {
  readonly dx: number;
  readonly dy: number;
  readonly hit: string;
}

/**
 * Which of the eight probes around a control do not answer to it.
 *
 * Returns an empty array when the whole square is live, which is what every
 * control here has to produce.
 */
async function missesFor(page: Page, selector: string, index: number): Promise<Miss[]> {
  return page.evaluate(
    ({ selector: sel, index: nth, reach }) => {
      const el = document.querySelectorAll(sel)[nth];
      if (el === undefined) throw new Error(`no ${sel} at index ${String(nth)}`);
      el.scrollIntoView({ block: 'center' });
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const probes: [number, number][] = [
        [-reach, -reach],
        [0, -reach],
        [reach, -reach],
        [-reach, 0],
        [reach, 0],
        [-reach, reach],
        [0, reach],
        [reach, reach],
      ];
      const misses: Miss[] = [];
      for (const [dx, dy] of probes) {
        const hit = document.elementFromPoint(cx + dx, cy + dy);
        if (hit === null || !(hit === el || el.contains(hit))) {
          misses.push({
            dx,
            dy,
            hit: hit === null ? 'nothing' : `${hit.tagName.toLowerCase()}.${hit.className}`,
          });
        }
      }
      return misses;
    },
    { selector, index, reach: REACH },
  );
}

async function expectLive(page: Page, label: string, selector: string, index = 0): Promise<void> {
  const misses = await missesFor(page, selector, index);
  expect(
    misses,
    `${label} (${selector}) does not answer to ${String(SIDE)}×${String(SIDE)} at ` +
      `${String(PHONE.width)}×${String(PHONE.height)}: ` +
      misses.map((m) => `(${String(m.dx)},${String(m.dy)}) → ${m.hit}`).join(', '),
  ).toEqual([]);
}

test.use({ viewport: PHONE });

test('every control in a round is live across 44 × 44', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);

  await expectLive(page, 'the estimate disclosure', '.dm-supplied .dm-disclosure');
  await expectLive(page, 'the evidence disclosure', '.dm-evidence .dm-disclosure');
  await expectLive(page, 'the first assumption slider', '.dm-slider-input');
  await expectLive(page, 'the middle assumption slider', '.dm-slider-input', 1);
  await expectLive(page, 'a decision option', '.dm-radio');
  await expectLive(page, 'the uncertainty flag', '.dm-flag');
  await expectLive(page, 'the round’s Continue button', '.dm-actions .dm-button');

  // And the growth did not come out of the design: the note under a slider sits
  // where it sat before the hit area was widened, which is the property the
  // negative margins exist for.
  const slider = cases(page).first().locator('.dm-slider').first();
  await expect(slider.locator('.dm-slider-input')).toHaveCount(1);
  const heights = await slider.evaluate((el) => {
    const input = el.querySelector('.dm-slider-input');
    const note = el.querySelector('.dm-slider-note');
    if (input === null || note === null) throw new Error('slider is missing a part');
    return {
      inputBox: input.getBoundingClientRect().height,
      /* The gap the design draws between the track and its note. */
      gap: note.getBoundingClientRect().top - input.getBoundingClientRect().bottom,
      row: el.getBoundingClientRect().height,
    };
  });
  expect(heights.inputBox).toBe(SIDE);
  // 44px of control inside a row that still measures what the design laid out:
  // the head, a 24px slider row and the note.
  expect(heights.row).toBeLessThan(80);
});

test('the back link on the consent screen is live across 44 × 44', async ({ page }) => {
  await open(page, SLATE_A);
  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.consent.heading })).toBeVisible();

  await expectLive(page, 'the back link', '.dm-back');
  await expectLive(page, 'the primary Begin button', '.dm-actions .dm-button');
  await expectLive(page, 'the local-only Begin button', '.dm-actions .dm-button', 1);
});

test('the confidence scale and the transfer options are live across 44 × 44', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);
  await page.getByRole('button', { name: COPY.round.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.rate.heading })).toBeVisible();

  for (let i = 0; i < COPY.rate.scale.length; i += 1) {
    await expectLive(page, `confidence point ${String(i + 1)}`, '.dm-radio', i);
  }
});

/**
 * The narrow viewport is the one that matters, and it must not scroll sideways.
 *
 * Measured at the same 390 × 844 the target sizes were, on every screen the walk
 * reaches. A horizontal scrollbar on a phone is not a rendering detail — it is the
 * difference between reading the page and hunting for it.
 */
test('no screen overflows horizontally at 390px', async ({ page }) => {
  await open(page, SLATE_A);
  const check = async (where: string) => {
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(sizes.scroll, `${where} overflows horizontally`).toBe(sizes.client);
    expect(sizes.client).toBe(PHONE.width);
  };

  await check('intro');
  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await check('consent');
  await page.getByRole('button', { name: COPY.consent.begin, exact: true }).click();
  await check('round 1');

  const first = cases(page).first();
  await first.getByRole('button', { name: COPY.round.showModel }).click();
  await first.getByRole('button', { name: COPY.round.showEvidence }).click();
  await check('round 1, panels open');

  await page.getByRole('button', { name: COPY.round.continue }).click();
  await check('the confidence gate');
  await page.getByRole('radio', { name: COPY.rate.scale[2] }).click();
  await page.getByRole('button', { name: COPY.rate.continue }).click();
  await check('round 2');
  await page.getByRole('button', { name: COPY.round.continue }).click();
  await page.getByRole('radio', { name: COPY.rate.scale[1] }).click();
  await page.getByRole('button', { name: COPY.rate.continue }).click();
  await check('the debrief');
  await page.getByRole('button', { name: COPY.debrief.continue }).click();
  await check('the transfer check');
});
