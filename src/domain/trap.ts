/**
 * Which branch of the trap debrief a run earned.
 *
 * Each slate carries one planted error: a proxy wearing the name of the thing it
 * stands in for. What the debrief says about it depends on what the reader
 * actually did, and the interesting cases are between "caught" and "missed" —
 * flagging the case without checking the number, leaving the supplied
 * recommendation standing without ever deciding, opening the panel and changing
 * nothing.
 *
 * This returns a branch name and an accent *role*, never copy and never a colour.
 * The copy lives in src/content/trap.ts and the colour in tokens.css, which is
 * what lets the selection logic be tested with no DOM and no strings.
 */

import type { Rec, TrapBranch } from '../content/types.js';
import type { CaseState } from './metrics.js';
import { ownRec } from './metrics.js';

/** Semantic accent for the trap panel. Maps to a `data-accent` value. */
export type TrapAccent = 'caught' | 'declined' | 'neutral';

/** Which heading the panel takes. */
export type TrapHeadingKey =
  'interrogated' | 'declinedToDecide' | 'recommendationLeftStanding' | 'numberNotChecked';

export interface TrapVerdict {
  readonly branch: TrapBranch;
  readonly accent: TrapAccent;
  readonly heading: TrapHeadingKey;
}

export function trapVerdict(input: {
  /** The state of the case carrying the planted error. */
  readonly st: CaseState;
  /** Which of that case's assumptions the error lives in. */
  readonly trapSlider: number;
  /** The recommendation the assistant supplied for that case. */
  readonly suppliedRec: Rec;
  /** Whether the supplied recommendation was pre-selected at all. */
  readonly prefill: boolean;
}): TrapVerdict {
  const { st, trapSlider, suppliedRec, prefill } = input;

  // The one thing that counts as catching it: moving the figure the headline
  // rests on. Not opening the panel, not flagging the case — moving the number.
  const caught = st.touched[trapSlider] === true;

  // Declining to decide protects you from acting on a bad number. It does not
  // tell you the number was bad.
  const declined = !caught && st.flagged;

  const chosen = ownRec(st);

  // Nothing was recorded either way, and the supplied recommendation was a
  // funding call left sitting there. Only reachable when the recommendation was
  // pre-selected in the first place.
  const accepted = !caught && !declined && !st.recTouched && prefill && suppliedRec === 'fund';

  if (caught) {
    return { branch: 'caught', accent: 'caught', heading: 'interrogated' };
  }
  if (declined) {
    return { branch: 'flaggedNotChecked', accent: 'declined', heading: 'declinedToDecide' };
  }
  if (chosen === 'fund') {
    // Made it a top pick on a figure they never moved.
    return { branch: 'missFund', accent: 'neutral', heading: 'numberNotChecked' };
  }
  if (accepted) {
    return {
      branch: 'missAccepted',
      accent: 'neutral',
      heading: 'recommendationLeftStanding',
    };
  }
  if (st.read) {
    // Looked, and left it. Looking is not the same as checking.
    return { branch: 'missOpened', accent: 'neutral', heading: 'numberNotChecked' };
  }
  return { branch: 'miss', accent: 'neutral', heading: 'numberNotChecked' };
}
