/**
 * The trap debrief copy.
 *
 * Six branches, one frame each, and the case-specific correction supplied by the
 * case. The distinctions between the branches are the point: flagging a case is
 * not the same as checking a number, leaving a default in place is not the same as
 * agreeing with it, and looking at a panel is not the same as interrogating what
 * is in it. Each branch says exactly what can be claimed about the run and no more.
 *
 * WHY THIS IS COMPOSED AND NOT TWELVE PARAGRAPHS. Until #31 this file held one set
 * of six per slate, and the two sets were the same six paragraphs with one
 * correction swapped in — so the bednet figures were written out six times and the
 * chlorination figures six times. `SOURCES.md` names the cost of that in the rows
 * for both: pinning either figure to a source “rewrites all six branches of the
 * trap copy”. A planted error is now a property of a case rather than of a slate
 * and any case may carry one, which would have made that twelve paragraphs, then
 * eighteen. The figure is stated once, on the trap, and the frames below say the
 * part that is about the reader rather than about the case.
 *
 * This is composition of the kind `armRows()` and `standingAttribution()` already
 * use — one fact, one place, joined at the point of use — and not the kind
 * `method.ts` refuses. The formulas there are written out in full because a formula
 * is a sentence a reader checks against a constant by eye, and interpolating it
 * would make the test that guards it vacuous. Nothing here is checked against a
 * constant.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type { Trap, TrapBranch } from './types.js';

/**
 * One branch's paragraph, in two halves.
 *
 * The correction sits between them, because in every branch the reader is told
 * what they did, then what the figure actually was, then what can and cannot be
 * concluded from the pair. Splitting it there is what lets the third part differ
 * per branch, which is the whole reason there are six branches rather than two.
 */
export interface TrapFrame {
  /** What the reader did. Ends with a full stop. */
  readonly opening: string;
  /** What follows from it. Ends with a full stop. */
  readonly closing: string;
}

export const TRAP_FRAMES = {
  caught: {
    opening:
      'You moved the figure this case’s headline rests on, off the value it was supplied at.',
    closing:
      'Catching the moment a proxy is swapped for the thing it stands in for, rather than taking the headline on faith, is exactly the move that resists drift. You did it here.',
  },
  flaggedNotChecked: {
    opening:
      'You flagged this case as one you could not responsibly decide, which is a real move and a defensible one. It is also not the same as checking the number.',
    closing:
      'That figure is still sitting exactly where it was handed to you. Declining to decide protects you from acting on a bad number. It does not tell you the number was bad.',
  },
  missFund: {
    opening: 'You made this case a top pick on a supplied figure you never moved.',
    closing:
      'The distinction was sitting in the evidence panel, one click away. The number was the whole argument, and the number went unchecked.',
  },
  missAccepted: {
    opening:
      'You left the supplied recommendation standing on this case, and never moved the figure it rests on. That is not the same as agreeing with it: nothing here recorded a decision from you either way. What can be said is narrower and still worth saying.',
    closing: 'The recommendation you left in place was built on the figure you left in place.',
  },
  missOpened: {
    opening: 'You opened this case and left the supplied figure exactly where it was.',
    closing:
      'Looking is not the same as checking, and the figure carrying the whole argument is the one that went unmoved.',
  },
  miss: {
    opening: 'You never opened this case, so you never saw what was wrong with it.',
    closing:
      'This time the figure you did not check happened not to decide the case. It will not always break your way.',
  },
} as const satisfies Readonly<Record<TrapBranch, TrapFrame>>;

/**
 * The correction, from the trap itself.
 *
 * Two sentences rather than one clause, because the two halves are the whole of
 * what a planted error is: a label that claims one quantity and a figure that is a
 * different one. Reading them as a pair is the skill the instrument is about.
 */
function trapCorrection(trap: Trap): string {
  return `The label says ${trap.whatTheLabelSays}. The figure is ${trap.whatTheFigureIs}.`;
}

/** The paragraph the debrief prints for one trapped case. */
export function trapParagraph(branch: TrapBranch, trap: Trap): string {
  const frame = TRAP_FRAMES[branch];
  return `${frame.opening} ${trapCorrection(trap)} ${frame.closing}`;
}

/** Headings, keyed to match `TrapHeadingKey` in the domain layer. */
export const TRAP_HEADINGS = {
  interrogated: 'You interrogated the number',
  declinedToDecide: 'You declined to decide, and the number still stands',
  recommendationLeftStanding: 'The recommendation you left standing',
  numberNotChecked: 'The number you did not check',
} as const;
