/**
 * Round 3's scaffolding.
 *
 * The substantive prose of this screen is not here — it is already written, in
 * `slates.ts`, as each case's `disagree` and `changeMind`. Both are lower-case
 * sentence fragments because they are continuations of a lead-in this module
 * supplies, and the disagreement lead-in is keyed on the read the participant
 * committed. Everything in this file is that scaffolding, and all of it is new.
 *
 * Round 3 is excluded from the measures by construction. It replays two of the
 * assisted slate's cases, and if it wrote into the records the debrief has
 * already reported on, moving a slider here would raise evaluative range after
 * the reader had been shown it. The screen says so rather than relying on the
 * reader to assume it.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type { Rec } from './types.js';

export const ROUND3 = {
  standfirst:
    'The same cases, worked the other way round. You commit a view first, and the estimate answers you.',

  excluded:
    'Nothing on this screen is measured. The debrief you have already seen is final, and no slider here changes it — this round exists to show what the four rules feel like from the inside, not to score you again.',

  /** Rule 1. The commit gate, before any figure exists on the page. */
  commitHeading: 'Your read, before the number',
  readPrompt: 'On what you can see so far, what would you do with this?',
  driverPrompt: 'Which of the three assumptions do you think the answer rests on most?',
  commitLabel: 'Commit and show the estimate',
  commitNote:
    'Once you commit, the figure appears and this case stays open. There is no way back to not having seen it, which is the point.',

  /** Rule 2. The interval, rather than a point estimate. */
  rangeHeading: 'The plausible range',
  rangeNote:
    'Cheapest against dearest, across the full range of all three assumptions. The single number you would have been handed sits somewhere inside this.',
  pointLabel: 'The estimate you would have been given',

  /** Rule 3. What actually drives the answer. */
  driverHeading: 'What the answer rests on',
  driverRight: 'That is the one. ',
  driverWrong: 'Not quite. ',
  driverIsPrefix: 'Across its plausible range, the assumption that moves this answer most is ',
  /**
   * The tie.
   *
   * `dominantSet` returns every assumption within 5% of the widest swing, and
   * slate B's vitamin A case is a genuine two-way tie that slate always replays.
   * The copy names the tie instead of breaking it, because picking one winner
   * from a near-dead-heat asserts a precision the numbers do not have.
   */
  driverTiePrefix: 'Two of them tie, within a few per cent of each other: ',
  driverTieNote:
    'The instrument does not break the tie. Naming one of them the winner would assert a precision these ranges do not support.',
  driverTiedCorrect: 'Either counts, and you picked one of them. ',

  /** Rule 4. Where the estimate disagrees with you, and what would move it. */
  disagreeHeading: 'Where this disagrees with you',
  /**
   * Keyed on the read the participant committed, and joined to the case's own
   * lower-case `disagree` fragment.
   */
  disagreePrefix: {
    fund: 'You would fund it. The case against that is that ',
    investigate:
      'You would investigate further, which is close to where this lands. The sharper version is that ',
    pass: 'You would pass. That may be right, though for a different reason than the obvious one: ',
  } satisfies Record<Rec, string>,
  changeMindPrefix: 'What would move this view: ',

  nextLabel: 'Continue',
  caseLabel: 'Case {n} of 2',
} as const;
