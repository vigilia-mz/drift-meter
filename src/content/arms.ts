/**
 * The three attribution arms.
 *
 * The number, the prose and the recommendation are identical in all three. Only
 * the authority attached to them changes. That is the entire point: anchoring on
 * any supplied figure produces most of the effect, so without a condition where
 * the number comes from a person and one where it comes from nowhere in
 * particular, the finding is "handed answers degrade judgment" — interesting, but
 * not a claim about AI.
 *
 * The fourth arm is the no-estimate control round, which is within-subject rather
 * than an entry here.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type { Arm, ArmKey } from './types.js';

export const ARMS = {
  ai: {
    key: 'ai',
    label: 'Claude’s read',
    who: 'Claude, an AI assistant',
    tag: 'AI-attributed',
  },
  human: {
    key: 'human',
    label: 'Programme officer’s read',
    who: 'a senior programme officer on the grants team',
    tag: 'Human-attributed',
  },
  unlabelled: {
    key: 'unlabelled',
    label: 'Prior estimate on file',
    who: 'an unnamed prior reviewer',
    tag: 'Unattributed',
  },
} as const satisfies Record<ArmKey, Arm>;

/**
 * What the debrief says about the arm the reader was in.
 *
 * Each one states what this design can and cannot support from that arm, and each
 * ends by saying a re-run may draw differently — so the reader does not mistake
 * their single assignment for the finding.
 */
export const ARM_NOTES = {
  ai: 'You were in the AI-attributed arm. The number, the prose and the recommendation are identical in all three arms; only the attribution changes. That is the point: without the human-attributed and unattributed arms, any drop in scrutiny here could just as easily be deference to a supplied figure as anything about AI. Run it again and you may draw a different attribution.',
  human:
    'You were in the human-attributed arm: no AI was involved in the estimate you saw. If your scrutiny dropped anyway, the effect is about deference to a supplied figure with authority attached, not about AI. That distinction is the difference between a claim this design can support and one it cannot. Run it again and you may draw a different attribution.',
  unlabelled:
    'You were in the unattributed arm: the estimate came from nowhere in particular. Any drop in scrutiny here is close to a pure anchoring effect, with no authority attached at all. It is the floor against which the other two arms have to earn their claim. Run it again and you may draw a different attribution.',
} as const satisfies Record<ArmKey, string>;

/**
 * How the supplied recommendation is introduced.
 *
 * The unattributed arm gets a passive construction, because naming a source is
 * exactly what that arm withholds.
 */
export function recSentencePrefix(arm: Arm): string {
  if (arm.key === 'unlabelled') return 'Filed recommendation: ';
  return arm.label.replace(/’s read$/, '') + ' recommends: ';
}

/** What a decision button says. */
export const REC_LABELS = {
  fund: 'Direct funds here',
  investigate: 'Investigate further',
  pass: 'Pass',
} as const;
