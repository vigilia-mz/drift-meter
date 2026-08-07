/**
 * The shell's copy: screen titles, announcements, and the words on the four
 * screens the rebuild has reached.
 *
 * v0.1 through v0.5 lived in a repository that has been deleted, so almost none
 * of the original screen prose survives. What does survive is quoted below at the
 * point of use and marked, because those phrases are load-bearing elsewhere: the
 * consent screen's two privacy promises are the stated reason the fonts are
 * self-hosted (CLAUDE.md), and the local-only button's label is asserted by a
 * planned end-to-end test. Everything else here is newly written to the voice and
 * should be read as new prose rather than as a port.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type { ScreenCopy, ScreenName } from './types.js';

/** Prefixed to every screen title. Matches the three prose pages. */
export const SITE_NAME = 'The Drift Meter';

/**
 * Per-screen title and announcement.
 *
 * Titles are noun phrases, so `document.title` reads as a place rather than an
 * instruction. Announcements say where the reader has arrived and what is being
 * asked of them, because a screen reader user gets no visual cue that the whole
 * page changed. Both are interpolated with the round number where one applies.
 */
export const SCREENS = {
  intro: {
    title: 'Start',
    announce: 'The Drift Meter. An instrument in two rounds, about three minutes.',
  },
  consent: {
    title: 'Before you begin',
    announce: 'Before you begin. What this records, and what leaves your browser.',
  },
  round: {
    title: 'Round',
    announce: 'Three cases to review. Work through them in any order.',
  },
  rate: {
    title: 'Your confidence',
    announce: 'One question about the round you have just finished.',
  },
  debrief: {
    title: 'What changed',
    announce: 'Your readout, comparing the two rounds.',
  },
  transfer: {
    title: 'Transfer check',
    announce: 'One unseen case, and one question about it.',
  },
  round3: {
    title: 'Round 3',
    announce: 'Two cases replayed, with the order of work reversed.',
  },
  spec: {
    title: 'Four rules',
    announce: 'The four design rules this instrument argues for.',
  },
  encoded: {
    title: 'The rules, encoded',
    announce: 'The four rules run as a system prompt, and scored.',
  },
  method: {
    title: 'Method',
    announce: 'The protocol: what is measured, how, and what threatens it.',
  },
  process: {
    title: 'Process',
    announce: 'How this was made, reviewed, and what is still missing.',
  },
} as const satisfies Record<ScreenName, ScreenCopy>;

/** The masthead, on every screen. */
export const KICKER = 'Agential Drift Research Program · Experiment 01';

/**
 * The intro screen.
 *
 * `short` is the sixty-second path added in v0.4, for readers who will not reach
 * the later screens. It states the argument without requiring the instrument to
 * be completed, because a reader who leaves at screen two should still have been
 * told something true.
 *
 * `constructed` is the on-page disclosure required by #7. It is deliberately
 * general: it says that every figure in every case is illustrative, and it does
 * not say which figure carries the planted error or in which direction it is
 * wrong. Naming the slider would tell the reader where to look, and the thing
 * being observed is whether they look unprompted. Disclosing the provenance of
 * the cases and disclosing the answer are not the same act.
 */
export const INTRO = {
  heading: 'The Drift Meter',
  standfirst: 'Evaluating the evaluator under AI assistance.',
  body: [
    'You will review the same kind of charity cost-effectiveness case twice: once with an estimate supplied to you, and once with no estimate at all. Three cases each time, about three minutes in total.',
    'Nothing here scores whether your decisions were right. What it records is the texture of the work — which numbers you moved, which evidence you opened, where you declined to decide, and how confident you felt afterwards.',
  ],
  constructedLabel: 'About the cases',
  constructed:
    'Every case here is written for this exercise. The programmes are generic rather than real organisations, and every figure attached to them is illustrative: built to carry the shape of a disagreement that does occur in this field, not traced to a named study. Nothing on these screens is a finding about a real programme, and none of it should be quoted as one.',
  shortLabel: 'The sixty-second version',
  short: [
    'AI assistance can improve the surface of an answer while changing the person responsible for judging it. The concern is not that people stop deciding. It is that deciding thins into approving.',
    'This instrument tries to make that visible in one reader, on one short task. It is a trace, not a finding: n is zero, and one person on six cases cannot support a claim about anyone else.',
  ],
  begin: 'Begin',
  methodLink: 'Read the method first',
} as const;

/**
 * The consent screen.
 *
 * The two promises quoted in CLAUDE.md as the reason the fonts are self-hosted —
 * “no cookie, no analytics, no fingerprint” and “Leaves the browser: nothing” —
 * appear here verbatim. If either stops being true, a font request or a script
 * somewhere else has broken it, and this screen is the thing that was lied to.
 */
export const CONSENT = {
  heading: 'Before you begin',
  standfirst: 'What this records, and what leaves your browser.',
  rows: [
    {
      label: 'Stays on this page',
      value:
        'Which panels you opened, which sliders you moved, what you decided, and how confident you said you were. It is held in memory for the length of the run and is gone when you close the tab.',
    },
    {
      label: 'Leaves the browser',
      value: 'Nothing.',
    },
    {
      label: 'Stored about you',
      value: 'No cookie, no analytics, no fingerprint. There is no account and no identifier.',
    },
    {
      label: 'Where it is going',
      value:
        'Nowhere. No data has been collected from anyone, and this build has no endpoint to send it to.',
    },
  ],
  reflectionHeading: 'One optional part',
  reflection:
    'A later screen can send a short, anonymous summary of your run to Claude and print what it says back, along with the model ID that served it. It is off in this build. You can also turn it off for yourself now, and the rest of the instrument works unchanged.',
  /**
   * The second half of #7, on the last screen before the work starts.
   *
   * The intro states this too, and a reader who arrives from a direct link, or
   * who skimmed the first screen, would otherwise meet the supplied estimate
   * without having been told what it is. Saying it twice costs two sentences.
   */
  constructedLabel: 'About the cases',
  constructed:
    'They are written for this exercise, and every figure in them is illustrative — including the estimate you will be shown. None of it is traced to a named study, and none of it should be quoted as a finding.',
  begin: 'Begin',
  beginLocal: 'Begin, but keep everything local',
  back: 'Back',
} as const;

/**
 * The round screen's chrome.
 *
 * The case content itself lives in `slates.ts`, and the attribution wording in
 * `arms.ts`. These are the labels around them.
 */
export const ROUND = {
  assistedKicker: 'Round {n} · with a supplied estimate',
  unassistedKicker: 'Round {n} · no estimate supplied',
  assistedLead:
    'Each case below arrives with an estimate already worked out, and a recommendation already selected. Change anything you disagree with.',
  unassistedLead:
    'Each case below arrives with nothing filled in. The sliders start at the midpoint of their range, which is an arbitrary starting point rather than a suggestion.',
  suppliedValue: 'Supplied value',
  suppliedNote: 'Supplied value. Move the slider to use your own.',
  midpointNote: 'Starts at the midpoint of the range. Arbitrary, not a suggestion.',
  showModel: 'Show the estimate',
  hideModel: 'Hide the estimate',
  showEvidence: 'Show the evidence',
  hideEvidence: 'Hide the evidence',
  evidenceHeading: 'Evidence',
  flagOn: 'Flagged as uncertain',
  flagOff: 'Flag as uncertain',
  decisionHeading: 'Your call',
  costPrefix: 'Cost',
  continueLabel: 'Continue',
} as const;

/**
 * The confidence gate.
 *
 * Five points, no zero: zero is the reducer's not-yet-rated sentinel, and letting
 * it advance would publish an unrated round as a self-rating of nothing. The
 * points carry words as well as numbers because “3 out of 5” is not a judgment
 * anyone actually holds.
 */
export const RATE = {
  heading: 'Before the next part',
  question: 'How confident are you in the calls you just made?',
  note: 'There is no right answer, and nothing here is scored against one. The question is asked twice, once after each round, because the interesting number is the difference.',
  scale: [
    { value: 1, label: 'Not at all confident' },
    { value: 2, label: 'Slightly confident' },
    { value: 3, label: 'Moderately confident' },
    { value: 4, label: 'Quite confident' },
    { value: 5, label: 'Very confident' },
  ],
  gateNote: 'Choose a rating to continue.',
  continueLabel: 'Continue',
} as const;

/** Placeholder for the screens the rebuild has not reached. */
export const STUB = {
  heading: 'Not rebuilt yet',
  body: 'This screen has not been rebuilt from source yet. The issues list what is left, and the changelog records what changed in each version and why.',
  back: 'Back to the start',
} as const;

/**
 * How a screen change is announced when the round number matters.
 *
 * Rounds one and two are the same screen name, so an announcement that omitted
 * the ordinal would leave a screen-reader user with no signal at the single most
 * important transition in the run.
 */
export function announceFor(name: ScreenName, ordinal?: 1 | 2): string {
  const base = SCREENS[name].announce;
  if (ordinal === undefined) return base;
  return `Round ${String(ordinal)} of 2. ${base}`;
}

/** `document.title` for a screen. */
export function titleFor(name: ScreenName, ordinal?: 1 | 2): string {
  const base = SCREENS[name].title;
  const withOrdinal = ordinal === undefined ? base : `${base} ${String(ordinal)}`;
  return `${SITE_NAME} — ${withOrdinal}`;
}
