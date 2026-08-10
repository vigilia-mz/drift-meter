/**
 * Driving the instrument, and the words it is driven by.
 *
 * COPY IS WRITTEN OUT HERE RATHER THAN IMPORTED FROM `src/content/`. That is the
 * point of it. A test that imports the label it asserts on has checked that a
 * constant equals itself; these strings are published prose, and pinning them
 * means writing them down a second time so that changing one is a two-file diff.
 * `src/content/shell.ts` says as much of the local-only button: "the local-only
 * button's label is asserted by a planned end-to-end test."
 *
 * There is no deep link to a screen and there is no test hook. `runConfig.ts`
 * takes `?seed=`, `?order=`, `?slate=` and `?arm=` and nothing else, and says why:
 * those four are a product feature — how a demonstration link shows one specific
 * run — and there is deliberately no `window.__TEST__` anywhere. So the suite
 * walks the flow the way a reader does, which is slower and is also the only
 * version that proves the flow works.
 */
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export type SlateId = 'A' | 'B';
export type Order = 'assisted-first' | 'unassisted-first';
export type ArmKey = 'ai' | 'human' | 'unlabelled';

/** A pinned run. Every part fixed, so nothing in the suite depends on a draw. */
export interface Pins {
  readonly order: Order;
  readonly slate: SlateId;
  readonly arm: ArmKey;
}

/** Assisted-first on Slate A: the run that carries the $2.00 bednet trap. */
export const SLATE_A: Pins = { order: 'assisted-first', slate: 'A', arm: 'ai' };

/** Assisted-first on Slate B: the same trap as an 80% access rate. */
export const SLATE_B: Pins = { order: 'assisted-first', slate: 'B', arm: 'ai' };

export const COPY = {
  intro: {
    heading: 'The Drift Meter',
    begin: 'Begin',
    method: 'Read the method first',
    process: 'How this was made',
  },
  consent: {
    heading: 'Before you begin',
    begin: 'Begin',
    /** Surviving copy. The privacy branch this suite exercises. */
    beginLocal: 'Begin, but keep everything local',
    back: 'Back',
    /** The two promises CLAUDE.md names as the reason the fonts are self-hosted. */
    leavesTheBrowser: 'Nothing.',
    noCookie: 'No cookie, no analytics, no fingerprint. There is no account and no identifier.',
  },
  round: {
    showModel: 'Show the estimate',
    hideModel: 'Hide the estimate',
    showEvidence: 'Show the evidence',
    hideEvidence: 'Hide the evidence',
    decisionHeading: 'Your call',
    flagOff: 'Flag as uncertain',
    flagOn: 'Flagged as uncertain',
    suppliedNote: 'Supplied value. Move the slider to use your own.',
    midpointNote: 'Starts at the midpoint of the range. Arbitrary, not a suggestion.',
    continue: 'Continue',
  },
  rec: {
    fund: 'Direct funds here',
    investigate: 'Investigate further',
    pass: 'Pass',
  },
  rate: {
    heading: 'Before the next part',
    question: 'How confident are you in the calls you just made?',
    gateNote: 'Choose a rating to continue.',
    continue: 'Continue',
    scale: [
      'Not at all confident',
      'Slightly confident',
      'Moderately confident',
      'Quite confident',
      'Very confident',
    ],
  },
  debrief: {
    heading: 'What changed',
    countsHeading: 'What the two rounds recorded',
    /** Surviving label. Rendered against the three cases in the round. */
    recsMade: 'Calls you made',
    moved: 'Sliders moved',
    opens: 'Cases opened',
    framingAutonomy: 'Framing autonomy',
    legendAssisted: 'With a supplied estimate',
    legendUnassisted: 'No estimate supplied',
    /** Surviving copy. Never a zero — see `PairedBar`. */
    undefinedBar: 'n/a',
    undefinedCaption: 'Undefined without a supplied frame. Reported rather than imputed.',
    trapHeading: 'The case with something wrong in it',
    continue: 'Continue',
    method: 'Read the method',
  },
  trapHeadings: {
    interrogated: 'You interrogated the number',
    declinedToDecide: 'You declined to decide, and the number still stands',
    recommendationLeftStanding: 'The recommendation you left standing',
    numberNotChecked: 'The number you did not check',
  },
  transfer: {
    heading: 'Transfer check',
    question: 'Before funding this, which one figure would you check first?',
    proxy: 'How many children completed all three doses, not how many doses were delivered',
    continue: 'Continue',
  },
  round3: {
    heading: 'Round 3',
    readPrompt: 'On what you can see so far, what would you do with this?',
    driverPrompt: 'Which of the three assumptions do you think the answer rests on most?',
    commit: 'Commit and show the estimate',
    continue: 'Continue',
  },
  spec: {
    heading: 'Four rules',
    continue: 'Continue',
    restart: 'Start again',
  },
  /**
   * The two reference screens.
   *
   * Documents rather than steps, reachable from the intro and from the debrief, and
   * the only two that get a history entry — so their Back is `history.back()`
   * rather than a dispatch, and the walk below uses it as one.
   */
  method: {
    heading: 'Method',
    back: 'Back',
    process: 'How this was made',
  },
  process: {
    heading: 'Process',
    back: 'Back',
    method: 'Read the method',
  },
  /**
   * The encoded screen, in the state it ships in.
   *
   * Built and switched off. It renders the system prompt in full and says why it is
   * dark, so the walk lands on a real screen rather than on a stub — the `Stub`
   * component is no longer reachable through the flow at all.
   */
  encoded: {
    heading: 'The rules, encoded',
    promptHeading: 'The system prompt, in full',
    darkHeading: 'Available on request',
  },
} as const;

/** The name the round screen's `<h1>` takes: the slate is the heading. */
export function slateHeading(slate: SlateId): string {
  return `Slate ${slate}`;
}

/** Open the instrument on a fully pinned run. */
export async function open(page: Page, pins: Pins): Promise<void> {
  const query = new URLSearchParams({
    order: pins.order,
    slate: pins.slate,
    arm: pins.arm,
  });
  await page.goto(`drift-meter.html?${query.toString()}`);
  await expect(page.getByRole('heading', { level: 1, name: COPY.intro.heading })).toBeVisible();
}

/**
 * Intro → consent → round one.
 *
 * `localOnly` takes the second consent button, which is the branch the privacy
 * spec runs the whole flow under.
 */
export async function begin(
  page: Page,
  pins: Pins,
  options: { readonly localOnly?: boolean } = {},
): Promise<void> {
  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.consent.heading })).toBeVisible();
  const label = options.localOnly === true ? COPY.consent.beginLocal : COPY.consent.begin;
  await page.getByRole('button', { name: label, exact: true }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: slateHeading(pins.slate) }),
  ).toBeVisible();
}

/** The three cases of the round on screen, in slate order. */
export function cases(page: Page): Locator {
  return page.locator('.dm-case');
}

/**
 * Leave a round: rate the confidence, then continue.
 *
 * The rating is the gate. `Confidence` uses 0 as its not-yet-rated sentinel and
 * the reducer refuses the transition, so a helper that skipped it would sit on a
 * disabled button.
 */
export async function leaveRound(page: Page, rating: number): Promise<void> {
  await page.getByRole('button', { name: COPY.round.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.rate.heading })).toBeVisible();
  const point = COPY.rate.scale[rating - 1];
  if (point === undefined) throw new Error(`no confidence point ${String(rating)}`);
  await page.getByRole('radio', { name: point }).click();
  await page.getByRole('button', { name: COPY.rate.continue }).click();
}

/**
 * Walk from a fresh load to the debrief, doing as little as possible on the way.
 *
 * Deliberately minimal: no panel opened, no slider moved, no recommendation
 * chosen. That is the run the trap's `missAccepted` branch describes, and it is
 * the baseline the other specs deviate from one action at a time.
 */
export async function reachDebrief(
  page: Page,
  pins: Pins,
  options: { readonly localOnly?: boolean } = {},
): Promise<void> {
  await open(page, pins);
  await begin(page, pins, options);
  await leaveRound(page, 4);
  const second: SlateId = pins.slate === 'A' ? 'B' : 'A';
  await expect(page.getByRole('heading', { level: 1, name: slateHeading(second) })).toBeVisible();
  await leaveRound(page, 2);
  await expect(page.getByRole('heading', { level: 1, name: COPY.debrief.heading })).toBeVisible();
}

/** Debrief → transfer check, answering it correctly. */
export async function reachRound3(page: Page): Promise<void> {
  await page.getByRole('button', { name: COPY.debrief.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.transfer.heading })).toBeVisible();
  await page.getByRole('radio', { name: COPY.transfer.proxy }).click();
  await page.getByRole('button', { name: COPY.transfer.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.round3.heading })).toBeVisible();
}

/**
 * Commit both of Round 3's replayed cases, which is what enables Continue.
 *
 * The reveal is monotonic and the screen offers no path back, so the gate is the
 * commit rather than anything after it. Each commit removes its own block from the
 * tree, so the loop always takes the first one still standing.
 */
export async function commitRound3(page: Page): Promise<void> {
  const remaining = await page.getByRole('button', { name: COPY.round3.commit }).count();
  for (let i = 0; i < remaining; i += 1) {
    const block = page.locator('.dm-commit').first();
    await block.getByRole('radio', { name: COPY.rec.investigate }).click();
    // The last radio in the block is the last driver option. Which one is picked
    // does not matter here — `driverSentence` handles right, wrong and tied.
    await block.locator('[role="radio"]').last().click();
    await block.getByRole('button', { name: COPY.round3.commit }).click();
  }
  await expect(page.locator('.dm-commit')).toHaveCount(0);
}

/** Round 3 → the four rules. */
export async function reachSpec(page: Page): Promise<void> {
  await commitRound3(page);
  await page.getByRole('button', { name: COPY.round3.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.spec.heading })).toBeVisible();
}

/**
 * Every state a reader can reach, handed to a callback as it arrives.
 *
 * All thirteen screens, at seventeen stops. Four of them have a second state
 * carrying DOM the first does not — an opened estimate panel, a transfer verdict, a
 * revealed Round 3 case — and a sweep that only saw the first would have missed the
 * markup those states introduce.
 *
 * The two reference screens are entered through each other rather than one at a
 * time, and left by their own Back, which is `history.back()`. That is the shape a
 * reader gets and it exercises the history scheme on the way past: the intro pushes
 * an entry to reach the protocol screen, the protocol screen pushes another to
 * reach the process screen, and two Back presses come all the way home.
 */
export async function walkWholeFlow(
  page: Page,
  pins: Pins,
  onScreen: (name: string) => void | Promise<void>,
  options: { readonly localOnly?: boolean } = {},
): Promise<void> {
  await open(page, pins);
  await onScreen('intro');

  await page.getByRole('button', { name: COPY.intro.method, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.method.heading })).toBeVisible();
  await onScreen('method');

  await page.getByRole('button', { name: COPY.method.process, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.process.heading })).toBeVisible();
  await onScreen('process');

  await page.getByRole('button', { name: COPY.process.back, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.method.heading })).toBeVisible();
  await page.getByRole('button', { name: COPY.method.back, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.intro.heading })).toBeVisible();

  await page.getByRole('button', { name: COPY.intro.begin, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.consent.heading })).toBeVisible();
  await onScreen('consent');

  const label = options.localOnly === true ? COPY.consent.beginLocal : COPY.consent.begin;
  await page.getByRole('button', { name: label, exact: true }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: slateHeading(pins.slate) }),
  ).toBeVisible();
  await onScreen('round:1');

  // Both disclosures on the first case. The assisted round is the only place the
  // estimate panel exists, and it is markup nothing else on the flow produces.
  const first = cases(page).first();
  await first.getByRole('button', { name: COPY.round.showModel }).click();
  await first.getByRole('button', { name: COPY.round.showEvidence }).click();
  await onScreen('round:1:panels-open');

  await page.getByRole('button', { name: COPY.round.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.rate.heading })).toBeVisible();
  await onScreen('rate:1');

  await page.getByRole('radio', { name: COPY.rate.scale[3] }).click();
  await page.getByRole('button', { name: COPY.rate.continue }).click();
  const other: SlateId = pins.slate === 'A' ? 'B' : 'A';
  await expect(page.getByRole('heading', { level: 1, name: slateHeading(other) })).toBeVisible();
  await onScreen('round:2');

  await page.getByRole('button', { name: COPY.round.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.rate.heading })).toBeVisible();
  await onScreen('rate:2');

  await page.getByRole('radio', { name: COPY.rate.scale[1] }).click();
  await page.getByRole('button', { name: COPY.rate.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.debrief.heading })).toBeVisible();
  await onScreen('debrief');

  await page.getByRole('button', { name: COPY.debrief.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.transfer.heading })).toBeVisible();
  await onScreen('transfer');
  await page.getByRole('radio', { name: COPY.transfer.proxy }).click();
  await onScreen('transfer:answered');

  await page.getByRole('button', { name: COPY.transfer.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.round3.heading })).toBeVisible();
  await onScreen('round3');

  await commitRound3(page);
  await onScreen('round3:revealed');

  await page.getByRole('button', { name: COPY.round3.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.spec.heading })).toBeVisible();
  await onScreen('spec');

  await page.getByRole('button', { name: COPY.spec.continue }).click();
  await expect(page.getByRole('heading', { level: 1, name: COPY.encoded.heading })).toBeVisible();
  await onScreen('encoded');
}
