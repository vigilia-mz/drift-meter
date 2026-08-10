/**
 * Which branch of the trap debrief each planted error earned.
 *
 * A planted error is a property of a case rather than of a slate (#31), so this
 * returns one verdict per trapped case rather than one per run. The branch logic is
 * unchanged and is applied per case: a reader can interrogate one planted error and
 * leave another standing, and the debrief now says both rather than picking one.
 *
 * A planted error is a proxy wearing the name of the thing it stands in for. What
 * the debrief says about it depends on what the reader actually did, and the
 * interesting cases are between "caught" and "missed" — flagging the case without
 * checking the number, leaving the supplied recommendation standing without ever
 * deciding, opening the panel and changing nothing.
 *
 * This returns a branch name and an accent *role*, never a paragraph and never a
 * colour. The copy lives in src/content/trap.ts and the colour in tokens.css, which
 * is what lets the selection logic be tested with no DOM and no strings. It hands
 * back the `TrappedCase` it scored so the panel does not have to find it a second
 * time and narrow `trap` again; that is the case it was given, not copy it chose.
 */

import type { Slate, TrapBranch } from '../content/types.js';
import type { CaseState, TrappedCase } from './metrics.js';
import { caughtTrap, ownRec, trappedCases } from './metrics.js';

/** Semantic accent for the trap panel. Maps to a `data-accent` value. */
export type TrapAccent = 'caught' | 'declined' | 'neutral';

/** Which heading the panel takes. */
export type TrapHeadingKey =
  'interrogated' | 'declinedToDecide' | 'recommendationLeftStanding' | 'numberNotChecked';

export interface TrapVerdict {
  /** Which case this verdict is about, and what was planted in it. */
  readonly trapped: TrappedCase;
  readonly branch: TrapBranch;
  readonly accent: TrapAccent;
  readonly heading: TrapHeadingKey;
}

/**
 * One verdict per planted error on the slate, in the order the slate lists them.
 *
 * A case carrying no planted error produces no verdict, and neither does a trapped
 * case with no recorded state — a slate longer than the data it is scored against
 * is not a run this can describe. So the length of the result is the number of
 * planted errors the reader actually met, which is what the debrief counts to decide
 * whether it is speaking about one case or several.
 *
 * Nothing here is called on the control round. Every branch's copy names a supplied
 * figure or a supplied recommendation, and neither exists there.
 */
export function trapVerdicts(input: {
  /** The assisted round's recorded state, in slate order. */
  readonly data: readonly CaseState[];
  readonly slate: Slate;
  /** Whether the assisted round pre-selected the supplied recommendation. */
  readonly prefill: boolean;
}): readonly TrapVerdict[] {
  const { data, slate, prefill } = input;
  return trappedCases(slate).flatMap((trapped) => {
    const st = data[trapped.index];
    if (st === undefined) return [];
    return [verdictFor(st, trapped, prefill)];
  });
}

function verdictFor(st: CaseState, trapped: TrappedCase, prefill: boolean): TrapVerdict {
  const suppliedRec = trapped.case.rec;

  // The one thing that counts as catching it: moving the figure the headline
  // rests on. Not opening the panel, not flagging the case — moving the number.
  // Decided by `caughtTrap` rather than here, so the paragraph a reader is shown
  // and the catch rate they are counted in cannot come apart.
  const caught = caughtTrap(st, trapped.trap);

  // Declining to decide protects you from acting on a bad number. It does not
  // tell you the number was bad.
  const declined = !caught && st.flagged;

  const chosen = ownRec(st);

  // Nothing was recorded either way, and the supplied recommendation was a
  // funding call left sitting there. Only reachable when the recommendation was
  // pre-selected in the first place.
  const accepted = !caught && !declined && !st.recTouched && prefill && suppliedRec === 'fund';

  const of = (branch: TrapBranch, accent: TrapAccent, heading: TrapHeadingKey): TrapVerdict => ({
    trapped,
    branch,
    accent,
    heading,
  });

  if (caught) {
    return of('caught', 'caught', 'interrogated');
  }
  if (declined) {
    return of('flaggedNotChecked', 'declined', 'declinedToDecide');
  }
  if (chosen === 'fund') {
    // Made it a top pick on a figure they never moved.
    return of('missFund', 'neutral', 'numberNotChecked');
  }
  if (accepted) {
    return of('missAccepted', 'neutral', 'recommendationLeftStanding');
  }
  if (st.read) {
    // Looked, and left it. Looking is not the same as checking.
    return of('missOpened', 'neutral', 'numberNotChecked');
  }
  return of('miss', 'neutral', 'numberNotChecked');
}
