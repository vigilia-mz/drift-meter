/**
 * The instrument, driven.
 *
 * The first eight assertions are the ones #19 asked for, in its order, and each is
 * here because a refactor could break it without breaking a unit test. The domain
 * layer is already covered: `metrics.test.ts` sets `CaseState` fields by hand and
 * checks the arithmetic, `reducer.test.ts` checks that the reducer writes those
 * fields correctly. What neither can see is whether the screen is wired to them —
 * whether the slider the reader drags is the one `touched[k]` records, whether the
 * pre-selected button writes `recTouched`, whether the figure on the page is the
 * one `calc` produced.
 *
 * The ninth arrived after them, for the same reason and from the other direction:
 * the standing attribution has five unit invariants over the sentence it prints
 * and none of them can see the markup, so the position — which is the whole point
 * of it — was held by a comment until there was a browser here to hold it.
 */
import { expect, test } from '@playwright/test';
import {
  COPY,
  SLATE_A,
  SLATE_B,
  begin,
  cases,
  leaveRound,
  open,
  reachDebrief,
  slateHeading,
} from './flow.js';
import type { Pins } from './flow.js';

/**
 * 1. The $3,922 headline.
 *
 * `calc` on the bednet case's supplied values: 2.00 ÷ (0.85 × 0.0006) = 3921.57,
 * which `money` rounds and separates. One assertion over the cost model, the
 * formatter, the slate wiring and the pinning, and if any of the four moves it is
 * this figure that changes.
 *
 * Note it is the ASSISTED round that shows it. The control round opens at snapped
 * midpoints — 4.50, 73%, 0.0006 — and reads $10,274, so the figure is also a check
 * that the two rounds did not open on the same values.
 */
test('the assisted bednet case reads $3,922 on a pinned Slate A run', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);

  const bednet = cases(page).nth(1);
  await expect(bednet.getByRole('heading', { level: 2 })).toHaveText('Insecticide-treated bednets');
  await expect(bednet.locator('.dm-readout-figure')).toHaveText('$3,922');

  // The supplied values it is computed from, as the reader sees them.
  await expect(bednet.locator('.dm-slider-value').nth(0)).toHaveText('$2.00');
  await expect(bednet.locator('.dm-slider-value').nth(1)).toHaveText('85%');
  await expect(bednet.locator('.dm-slider-value').nth(2)).toHaveText('0.0006');
});

/**
 * 2. A supplied recommendation renders as chosen and counts as nothing.
 *
 * The most consequential distinction in the scoring, and the one a refactor
 * breaks: `effRec` puts the supplied recommendation on the button so it looks
 * selected, while `ownRec` stays empty because `recTouched` is false. Any mount
 * effect or controlled-value sync that wrote the displayed value back into state
 * would make "Calls you made" read 3/3 with the reader having decided nothing, and
 * every measure downstream would inherit it.
 */
test('a supplied recommendation renders aria-checked while Calls you made stays 0/3', async ({
  page,
}) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);

  // Slate A supplies investigate, fund, investigate — pre-selected, all three.
  const supplied = [COPY.rec.investigate, COPY.rec.fund, COPY.rec.investigate];
  for (const [index, label] of supplied.entries()) {
    const group = cases(page).nth(index).getByRole('radiogroup');
    await expect(group.getByRole('radio', { name: label })).toHaveAttribute('aria-checked', 'true');
  }

  await leaveRound(page, 4);
  await expect(page.getByRole('heading', { level: 1, name: slateHeading('B') })).toBeVisible();
  await leaveRound(page, 2);

  const row = page.getByRole('row', { name: new RegExp(COPY.debrief.recsMade) });
  await expect(row.getByRole('cell').nth(0)).toHaveText('0/3');
  await expect(row.getByRole('cell').nth(1)).toHaveText('0/3');
});

/**
 * 3. `read` is sticky.
 *
 * Opening either panel sets it and closing never clears it, because the measure is
 * "was this case looked at" rather than "for how long". Asserted through the
 * debrief's count, which is the only place a reader can see it: open both panels
 * on one case, close both, and the case still counts as opened.
 */
test('a case stays counted as opened after its panels are closed again', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);

  const first = cases(page).first();
  await first.getByRole('button', { name: COPY.round.showModel }).click();
  await first.getByRole('button', { name: COPY.round.hideModel }).click();
  await first.getByRole('button', { name: COPY.round.showEvidence }).click();
  await first.getByRole('button', { name: COPY.round.hideEvidence }).click();
  await expect(first.getByRole('button', { name: COPY.round.showModel })).toBeVisible();
  await expect(first.getByRole('button', { name: COPY.round.showEvidence })).toBeVisible();

  await leaveRound(page, 3);
  await expect(page.getByRole('heading', { level: 1, name: slateHeading('B') })).toBeVisible();
  await leaveRound(page, 3);

  const row = page.getByRole('row', { name: new RegExp(COPY.debrief.opens) });
  await expect(row.getByRole('cell').nth(0)).toHaveText('1/3');
  await expect(row.getByRole('cell').nth(1)).toHaveText('0/3');
});

/**
 * 4. `touched` survives a return to the original value.
 *
 * A movement flag, not a value comparison. Dragging a slider and putting it back
 * still counts, because the behaviour being observed is the act of interrogating
 * the number rather than the arithmetic outcome of having done so.
 *
 * The slider is driven by keyboard: ArrowRight then ArrowLeft leaves the value
 * exactly where it started, one step out and one step back, which is the cleanest
 * possible version of "moved and returned".
 */
test('a slider moved and returned still counts as moved', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);

  const bednet = cases(page).nth(1);
  const slider = bednet.locator('.dm-slider-input').first();
  const readout = bednet.locator('.dm-slider-value').first();

  await expect(readout).toHaveText('$2.00');
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(readout).toHaveText('$2.25');
  await slider.press('ArrowLeft');
  await expect(readout).toHaveText('$2.00');

  // And the case's figure is back where it was, so nothing but the flag moved.
  await expect(bednet.locator('.dm-readout-figure')).toHaveText('$3,922');

  await leaveRound(page, 3);
  await expect(page.getByRole('heading', { level: 1, name: slateHeading('B') })).toBeVisible();
  await leaveRound(page, 3);

  const row = page.getByRole('row', { name: new RegExp(COPY.debrief.moved) });
  await expect(row.getByRole('cell').nth(0)).toHaveText('1');
  await expect(row.getByRole('cell').nth(1)).toHaveText('0');
});

/**
 * 5. The confidence gate, by keyboard only.
 *
 * The gate exists because 0 is the not-yet-rated sentinel and `metrics()` rescales
 * it to a self-rating of nothing, so the reducer refuses the transition and the
 * screen disables the button — a keyboard user has to meet the same wall as
 * everyone else rather than pressing something that does nothing.
 *
 * The radio group is one tab stop with arrows that move and select in a single
 * step, per the WAI-ARIA pattern. So: Tab to the group, arrow to a point, Tab to
 * the button, Enter. No pointer anywhere.
 */
test('the confidence gate opens by keyboard alone', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);
  await page.getByRole('button', { name: COPY.round.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.rate.heading })).toBeVisible();

  const advance = page.getByRole('button', { name: COPY.rate.continue });
  await expect(advance).toBeDisabled();
  await expect(page.getByText(COPY.rate.gateNote)).toBeVisible();

  // The container is focused on every screen change, so Tab from here lands on
  // the group's single tabbable option.
  await page.keyboard.press('Tab');
  const options = page.getByRole('radio');
  await expect(options.first()).toBeFocused();

  // A forward key on a group with nothing selected lands on the first option
  // rather than the second, which is what `nextRadioIndex(key, -1, n)` returns:
  // arrowing into an untouched group gets you an end, not the middle.
  await page.keyboard.press('ArrowRight');
  await expect(options.nth(0)).toBeFocused();
  await expect(options.nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(advance).toBeEnabled();

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(options.nth(2)).toBeFocused();
  await expect(options.nth(2)).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText(COPY.rate.gateNote)).toHaveCount(0);

  // One Tab out of the group, because the roving tabindex leaves exactly one
  // option in the tab order. Four options behind a single Tab is the property.
  await page.keyboard.press('Tab');
  await expect(advance).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: slateHeading('B') })).toBeVisible();
});

/**
 * 6. Both trap branches.
 *
 * Two seeded runs, one branch each, chosen to be the pair that is easiest to get
 * wrong: moving the planted figure is the only thing that counts as catching it,
 * and leaving the pre-selected recommendation standing is not the same as agreeing
 * with it. `trapVerdict` distinguishes six branches; these two are the ones whose
 * copy makes a claim about the reader, so they are the two worth pinning to a run.
 *
 * The slates carry the trap in different places — Slate A on case 2's cost per
 * net, Slate B on case 3's use rate — so running one branch on each also checks
 * that `trapCase` and `trapSlider` are read from the slate rather than assumed.
 */
test('moving the planted figure earns the caught branch', async ({ page }) => {
  await open(page, SLATE_A);
  await begin(page, SLATE_A);

  const trap = cases(page).nth(1);
  const slider = trap.locator('.dm-slider-input').first();
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(trap.locator('.dm-slider-value').first()).toHaveText('$2.25');

  await leaveRound(page, 3);
  await expect(page.getByRole('heading', { level: 1, name: slateHeading('B') })).toBeVisible();
  await leaveRound(page, 3);

  const panel = page.locator('.dm-panel', { hasText: COPY.debrief.trapHeading });
  await expect(panel.getByRole('heading', { level: 2 })).toHaveText(COPY.trapHeadings.interrogated);
  await expect(panel).toHaveAttribute('data-accent', 'caught');
  await expect(panel).toContainText('moved the cost-per-net figure off the supplied $2');
});

test('leaving the supplied recommendation standing earns the left-standing branch', async ({
  page,
}) => {
  // Slate B's trap case supplies `fund`, which is what makes this branch
  // reachable: it is the one that describes a funding call nobody made.
  await reachDebrief(page, SLATE_B);

  const panel = page.locator('.dm-panel', { hasText: COPY.debrief.trapHeading });
  await expect(panel.getByRole('heading', { level: 2 })).toHaveText(
    COPY.trapHeadings.recommendationLeftStanding,
  );
  await expect(panel).toHaveAttribute('data-accent', 'neutral');
  await expect(panel).toContainText('nothing here recorded a decision from you either way');
});

/**
 * 7. The hatched bar for undefined framing autonomy.
 *
 * In the control round no frame was supplied, so departure from it does not exist.
 * A zero-width bar would read as "you departed from the frame not at all", which
 * is a claim about the reader; the bar is hatched and reads `n/a`, and the caption
 * says the value is reported rather than imputed. An earlier version imputed it
 * from an invented constant and it was retracted in v0.3, which is why this is a
 * rendering rule and not a detail.
 */
test('framing autonomy is hatched and reads n/a in the round with no estimate', async ({
  page,
}) => {
  await reachDebrief(page, SLATE_A);

  const measure = page.locator('.dm-measure', { hasText: COPY.debrief.framingAutonomy });
  const assisted = measure.locator('.dm-bar-row').nth(0);
  const unassisted = measure.locator('.dm-bar-row').nth(1);

  await expect(assisted.locator('.dm-bar-undefined')).toHaveCount(0);
  await expect(assisted.locator('.dm-bar-assisted')).toHaveCount(1);

  await expect(unassisted.locator('.dm-bar-undefined')).toHaveCount(1);
  await expect(unassisted.locator('.dm-bar-value')).toHaveText(COPY.debrief.undefinedBar);
  await expect(unassisted.getByRole('img')).toHaveAttribute(
    'aria-label',
    `${COPY.debrief.legendUnassisted}: ${COPY.debrief.undefinedBar}`,
  );
  await expect(measure).toContainText(COPY.debrief.undefinedCaption);

  // Nowhere on the row is a zero. That is the whole of the v0.3 retraction.
  await expect(unassisted).not.toContainText('0');
});

/**
 * 8. Unconfigured degradation.
 *
 * `VITE_REFLECT_ENDPOINT` is empty in the committed `.env`, so every clone and
 * fork is dark and cannot spend the author's API credit. Nothing in the build
 * should therefore reach a network at all, and the way to know that is to count.
 *
 * This is the half of the assertion that can stand today. The other half — that
 * the encoded screen shows its "available on request" copy rather than a broken
 * control — waits on #18, which builds the screen; it is a stub until then, and
 * `tests/axe.spec.ts` sweeps it as one.
 */
test('a whole run makes no request off the origin, and none to the endpoint', async ({
  page,
  baseURL,
}) => {
  if (baseURL === undefined) throw new Error('baseURL is set in playwright.config.ts');
  const site = new URL(baseURL).origin;
  const offOrigin: string[] = [];
  const reflect: string[] = [];

  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.includes('reflect')) reflect.push(request.url());
    if (url.origin !== site && url.protocol !== 'data:') offOrigin.push(request.url());
  });

  await reachDebrief(page, SLATE_A);
  await page.getByRole('button', { name: COPY.debrief.continue }).click();
  await page.getByRole('radio', { name: COPY.transfer.proxy }).click();
  await page.getByRole('button', { name: COPY.transfer.continue }).click();

  expect(reflect).toEqual([]);
  expect(offOrigin).toEqual([]);
});

/**
 * 9. The attribution is delivered before anything is opened.
 *
 * The one assertion in this file that exists because the unit tests cannot make
 * it. The five invariants in `standing attribution` call `standingAttribution()`
 * and read the string; none of them renders a screen, so all five stay green on a
 * build that has quietly moved the line back inside the estimate panel — which is
 * where it used to live, and where it visually belongs.
 *
 * That position is not a layout preference. `CaseState.modelOpen` starts false, so
 * an attribution rendered only inside the panel is delivered only to readers who
 * opened it. Those are the readers `engagement` is highest for, P1 is a claim
 * about the ones who did not, and P5 needs all of them to have been in an arm. The
 * panel would be measuring evidence engagement and delivering the manipulation at
 * once, and the debrief would still tell every reader which arm they drew.
 *
 * So: the line is visible with the panel shut, in all three arms, and absent from
 * the round where nothing is supplied.
 */
for (const arm of ['ai', 'human', 'unlabelled'] as const) {
  test(`the ${arm} attribution is on screen before the estimate panel is opened`, async ({
    page,
  }) => {
    const pins: Pins = { order: 'assisted-first', slate: 'A', arm };
    await open(page, pins);
    await begin(page, pins);

    // Every case carries it, and every panel is still shut.
    await expect(cases(page)).toHaveCount(3);
    await expect(page.locator('.dm-attribution')).toHaveCount(3);
    await expect(page.locator('.dm-attribution').first()).toBeVisible();
    await expect(page.locator('.dm-attribution').first()).toHaveText(COPY.round.attribution[arm]);

    // The disclosure has not been touched, so nothing inside it is in the DOM.
    await expect(page.locator('.dm-supplied-body')).toHaveCount(0);
    await expect(page.getByRole('button', { name: COPY.round.showModel }).first()).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    // And the panel still carries the arm's own heading once it is opened, so
    // this asserts the source moved out rather than that the label moved away.
    await page.getByRole('button', { name: COPY.round.showModel }).first().click();
    await expect(page.locator('.dm-supplied-body').first()).toBeVisible();
    await expect(page.locator('.dm-attribution')).toHaveCount(3);
  });
}

test('the round with no estimate supplied carries no attribution at all', async ({ page }) => {
  // The other half of the same guarantee. An attribution in the control round
  // would put a source on a number nobody supplied. Reached the long way, through
  // round one, because the control round is whichever one did not draw the slate.
  await open(page, SLATE_A);
  await begin(page, SLATE_A);
  await expect(page.locator('.dm-attribution')).toHaveCount(3);

  await leaveRound(page, 4);
  await expect(page.getByRole('heading', { level: 1, name: slateHeading('B') })).toBeVisible();

  await expect(cases(page)).toHaveCount(3);
  await expect(page.locator('.dm-attribution')).toHaveCount(0);
  await expect(page.locator('.dm-supplied-body')).toHaveCount(0);
});
