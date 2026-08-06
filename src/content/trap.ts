/**
 * The trap debrief copy.
 *
 * One set per slate, six branches each. The distinctions between the branches are
 * the point: flagging a case is not the same as checking a number, leaving a
 * default in place is not the same as agreeing with it, and looking at a panel is
 * not the same as interrogating what is in it. Each branch says exactly what can
 * be claimed about the run and no more.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type { SlateId, TrapCopy } from './types.js';

export const TRAP = {
  A: {
    caught:
      'You opened the bednet model and moved the cost-per-net figure off the supplied $2, which is the commodity cost of the net rather than the roughly $4.50 delivered cost. Interrogating the load-bearing number instead of taking the headline on faith is exactly the move that resists drift. You did it here.',
    flaggedNotChecked:
      'You flagged the bednet case as one you could not responsibly decide, which is a real move and a defensible one. It is also not the same as checking the number. The supplied $2 is the commodity cost of the net; delivered cost, with logistics, distribution and wastage, runs closer to $4.50, which roughly doubles the cost per death averted. That figure is still sitting exactly where it was handed to you. Declining to decide protects you from acting on a bad number. It does not tell you the number was bad.',
    missFund:
      'You made the bednet programme a top pick on a supplied figure of $2 a net, and never moved that slider. The $2 is the commodity cost of the net. Delivered cost (logistics, distribution, wastage) runs closer to $4.50, which roughly doubles the cost per death averted and pulls it off the top line. The number was the whole argument, and the number went unchecked.',
    missAccepted:
      'You left the supplied recommendation standing on the bednet case, and never moved the figure it rests on. That is not the same as agreeing with it: nothing here recorded a decision from you either way. What can be said is narrower and still worth saying. The $2 is the commodity cost of the net; delivered cost runs closer to $4.50 once logistics, distribution and wastage are counted, and that roughly doubles the cost per death averted. The recommendation you left in place was built on the figure you left in place.',
    missOpened:
      'You opened the bednet model and left the cost per net exactly where it was supplied. That $2 is the commodity cost of the net; delivered cost, with logistics, distribution and wastage, runs closer to $4.50, which roughly doubles the cost per death averted. Looking is not the same as checking, and the figure carrying the whole argument is the one that went unmoved.',
    miss: 'You never opened the bednet model, so you did not see that the supplied $2 a net is the commodity cost, not the delivered cost, which runs closer to $4.50 and roughly doubles the cost per death averted. This time the figure you did not check happened not to decide the case. It will not always break your way.',
  },

  B: {
    caught:
      'You opened the chlorination model and moved the use rate off the supplied 80%, which is the access rate rather than measured consistent use, meaning chlorine actually detectable in stored water, which runs closer to half that. Catching the moment a proxy is swapped for the thing it stands in for is exactly the move that resists drift. You did it here.',
    flaggedNotChecked:
      'You flagged the chlorination case as one you could not responsibly decide, which is a real move and a defensible one. It is also not the same as checking the number. The supplied 80% is the access rate, not measured consistent use, which runs closer to half that and roughly doubles the cost per death averted. That figure is still sitting exactly where it was handed to you. Declining to decide protects you from acting on a bad number. It does not tell you the number was bad.',
    missFund:
      'You made chlorination a top pick on a supplied use rate of 80%, and never moved that slider. That 80% is the access rate. Measured consistent use, chlorine detectable in stored household water, has run closer to half of it, which roughly doubles the cost per death averted. The distinction was sitting in the evidence panel, one click away, and the number was the whole argument.',
    missAccepted:
      'You left the supplied recommendation standing on the chlorination case, and never moved the figure it rests on. That is not the same as agreeing with it: nothing here recorded a decision from you either way. What can be said is narrower and still worth saying. The supplied 80% is the access rate, not measured consistent use, which runs closer to half that and roughly doubles the cost per death averted. The recommendation you left in place was built on the figure you left in place.',
    missOpened:
      'You opened the chlorination model and left the use rate exactly where it was supplied. That 80% is the access rate, not measured consistent use, which runs closer to half that and roughly doubles the cost per death averted. Looking is not the same as checking, and the figure carrying the whole argument is the one that went unmoved.',
    miss: 'You never opened the chlorination model, so you did not see that the supplied 80% is the access rate rather than measured consistent use, which runs closer to half that and roughly doubles the cost per death averted. This time the figure you did not check happened not to decide the case. It will not always break your way.',
  },
} as const satisfies Record<SlateId, TrapCopy>;

/** Headings, keyed to match `TrapHeadingKey` in the domain layer. */
export const TRAP_HEADINGS = {
  interrogated: 'You interrogated the number',
  declinedToDecide: 'You declined to decide, and the number still stands',
  recommendationLeftStanding: 'The recommendation you left standing',
  numberNotChecked: 'The number you did not check',
} as const;
