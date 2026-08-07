/**
 * Semantic tones for the two reference screens.
 *
 * The protocol and process screens print several tables whose rows mean different
 * things — a source that is pinned against one that is not, a reader who has been
 * asked against one who has not, a paragraph Claude drafted against one that was
 * cut. Those differences are worth a colour, and CLAUDE.md is explicit that domain
 * code returns a role name and never a colour.
 *
 * So these functions return a tone, `tokens.css` binds each tone to one custom
 * property, and no file between the two knows a hex. `tone.test.ts` asserts the
 * mappings are exhaustive and that every tone has a binding in the stylesheet — an
 * unbound tone would render an unstyled row rather than fail.
 */

import type { ReviewerStatus, SourceGrade } from '../content/types.js';

/**
 * The tones the stylesheet binds.
 *
 * `kept` and `cut` name what happened to a line of the page; `rule`, a statement
 * about how the work is done; `open` and `partial`, an obligation that is unmet or
 * half met. `open` and `cut` share a colour and are still two names, because they
 * are two different things going wrong.
 */
export type Tone = 'kept' | 'cut' | 'rule' | 'open' | 'partial';

/**
 * How well a source is pinned, as a tone.
 *
 * `Flagged` is the only one that means "not cleared for publication", and it is
 * the only one that gets the tone reserved for an unmet obligation.
 *
 * `Illustrative` and `Corrected` share the rule tone, and neither is a pin. Both
 * are statements about how a claim came to be on the page — one built for the
 * exercise and disclosed as such, one wrong and fixed — rather than about a source
 * it was taken from. Colouring either of them as settled would say the row had
 * been checked against something, and neither has.
 */
export function gradeTone(grade: SourceGrade): Tone {
  switch (grade) {
    case 'Flagged':
      return 'open';
    case 'Secondary':
    case 'Primary available':
      return 'partial';
    case 'Primary':
      return 'kept';
    case 'Illustrative':
    case 'Corrected':
      return 'rule';
  }
}

/** Whether a reader has been asked. Nobody has, so nothing here returns `kept`. */
export function statusTone(status: ReviewerStatus): Tone {
  switch (status) {
    case 'Not recruited':
    case 'Not assigned':
      return 'open';
    case 'Planned before collection':
      return 'partial';
  }
}
