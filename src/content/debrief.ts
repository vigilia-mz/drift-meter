/**
 * The debrief's copy.
 *
 * The screen where the instrument makes its argument, so it is also the screen
 * where overclaiming would cost the most. Every branch paragraph below says what
 * this run can support and stops there: one person on six cases, in one order,
 * in one arm. The comparison the debrief is entitled to make is between the
 * reader's own two rounds, and nothing here compares them to anyone else.
 *
 * Two strings survive from the deleted build and are used verbatim, marked at
 * the point of use: the counterbalancing sentence with its replacement, and the
 * caption on the undefined framing-autonomy bar. Everything else is new prose.
 *
 * The trap paragraphs, the arm notes and the arm tags are NOT here — they are
 * already written in `trap.ts` and `arms.ts`, and this screen renders them.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type { ClosingKey, GapBand, HeadlineKey } from '../domain/reveal.js';

/**
 * The four paired measures, in the order the debrief shows them.
 *
 * `key` names the `Metrics` field. The labels are the ones the landing page
 * already uses for the five measures, so a reader who arrived from there meets
 * the same vocabulary; the `what` line says what was actually counted, because
 * a bar with only a name on it invites the reader to supply their own meaning.
 */
export const MEASURES = [
  {
    key: 'engagement',
    label: 'Evidence engagement',
    what: 'Cases where you opened the estimate or the evidence, as a share of the three.',
  },
  {
    key: 'range',
    label: 'Revision behaviour',
    what: 'Sliders you moved off the value they started on, as a share of all nine.',
  },
  {
    key: 'amb',
    label: 'Ambiguity tolerance',
    what: 'Uncertainty flags and calls to investigate, as a share of the two available per case.',
  },
  {
    key: 'auto',
    label: 'Framing autonomy',
    what: 'How far you departed from the estimate you were given — undefined where none was.',
  },
] as const;

export const DEBRIEF = {
  standfirst:
    'Two rounds of the same kind of work, one with an estimate supplied and one without. What follows is a trace of how you worked, not a score of whether you were right.',

  legendAssisted: 'With a supplied estimate',
  legendUnassisted: 'No estimate supplied',

  /**
   * The undefined bar.
   *
   * Surviving copy, used verbatim. In the control round no frame was supplied,
   * so departure from it is undefined rather than zero, and the bar is hatched
   * and reads `n/a`. An earlier version imputed this value from an invented
   * constant and it was retracted in v0.3, which is why the caption says
   * “reported rather than imputed” instead of quietly showing nothing.
   */
  undefinedBar: 'n/a',
  undefinedCaption: 'Undefined without a supplied frame. Reported rather than imputed.',

  countsHeading: 'What the two rounds recorded',
  /**
   * The counts table's corner cell.
   *
   * Empty on the page, because a two-axis table's corner is empty, and named to a
   * screen reader, because a header cell with nothing in it announces as "blank"
   * and leaves the row labels belonging to nothing. It says what the rows are
   * rather than repeating the section heading above them.
   */
  countsRowAxis: 'What was recorded',
  counts: {
    opens: 'Cases opened',
    moved: 'Sliders moved',
    flags: 'Flagged as uncertain',
    investigate: 'Calls to investigate',
    /** Surviving label. Rendered against the three cases in the round. */
    recsMade: 'Calls you made',
  },

  headlineHeading: 'The comparison',
  /**
   * One paragraph per branch of `headlineFor`.
   *
   * `lookedLess` fires when the control round did more on engagement or on
   * evaluative range; `heldGround` when the assisted round did more on both;
   * `twoVersions` otherwise, including when nothing moved. The threshold is
   * strict — a four-point difference is not a difference — so none of these may
   * describe a small gap as a finding.
   */
  headline: {
    lookedLess:
      'You did less of the work when the estimate was already there. That is the pattern this instrument was built to look for, and you have just produced one instance of it in yourself. One instance is not evidence about anyone, including you: order, fatigue and which slate you drew all sit inside this difference and cannot be separated from it here.',
    heldGround:
      'You did more of the work in the round where an estimate was supplied, not less. That is the opposite of the pattern this instrument was built to look for. It may mean the estimate gave you something to argue with, or that the round you met second was simply the one you had warmed up on. This design cannot tell those apart from a single run.',
    twoVersions:
      'The two rounds came out close enough that this run does not separate them. That is the most common result from six cases and it is not a null finding — it is an absence of one. What the run does give you is two versions of your own working, side by side, and the differences between them are worth reading even when the totals are not.',
  },

  gapHeading: 'Confidence against behaviour',
  /**
   * One paragraph per band of `gapBand`, on `perceived − actual`.
   *
   * The sign is the interesting part, which is why the measure is not clamped.
   */
  gap: {
    over: 'You rated your confidence higher than your working supports. That gap is the thing this project is actually about: not being wrong, but feeling settled sooner than the evidence you gathered would justify. It is also the most ordinary result here, and the least flattering to read.',
    under:
      'You rated your confidence lower than your working supports. That is the rarer direction and the more comfortable one to be in, though it has its own cost: someone who discounts work they have actually done will defer to a supplied answer that did less.',
    aligned:
      'Your confidence and your working came out in roughly the same place. That is what calibration looks like on a task this short, and it is worth noticing that it is a description of one task rather than a property of you.',
  },

  closingHeading: 'What this run can and cannot say',
  /**
   * The third statement of #7's disclosure, after the work rather than before it.
   *
   * It sits in the closing section because that section is already the place
   * where the run's limits are named, and because the trap has been revealed by
   * the time a reader reaches it — so this can say that the planted error was
   * built without telling anyone anything they have not just been shown.
   */
  closingCases:
    'One limit applies to all of the above. The cases were written for this exercise: the programmes are generic, and every figure in them is illustrative, the planted error included. What was recorded about how you worked is real. The numbers you worked on were not.',
  /** One paragraph per branch of `closingKey`. `null` autonomy takes `keptAuthorship`. */
  closing: {
    delegatedModel:
      'You kept the decision and largely accepted the model underneath it. That is the quiet version of the thing this project calls agential drift: not handing over the choice, but handing over the frame the choice is made in, and then experiencing the result as your own judgment.',
    keptAuthorship:
      'You did the work of setting up the problem as well as answering it. Hold that lightly — this was three cases with the clock off and nothing riding on the answer, which is the condition under which anyone is at their most careful.',
  },

  assignmentHeading: 'How this run was assigned',
  assignment: {
    order: 'Order of the two rounds',
    slate: 'Which slate carried the estimate',
    arm: 'Attribution of the estimate',
  },
  /**
   * The disclosure.
   *
   * Both sentences are surviving copy. The first is only true when the draw was
   * actually random; when a URL parameter pinned it, the second is shown in its
   * place. An instrument about unearned confidence cannot misreport its own
   * randomisation, and the difference between these two sentences is the whole
   * of that commitment.
   */
  counterbalanced:
    'Counterbalanced across participants so practice and fatigue do not line up with the condition.',
  forced: 'Fixed by URL parameter on this run, not randomised.',
  randomisedSlate:
    'Drawn independently of the order, so case difficulty cannot stand in for the condition.',
  randomisedArm: 'Drawn uniformly across the three arms.',

  trapHeading: 'The case with something wrong in it',
  trapLead:
    'One case in the round with the supplied estimate carried a planted error: a figure that was not what its label said it was. What follows depends on what you did, not on whether you got the answer right.',

  nextLabel: 'Continue',
  methodLabel: 'Read the method',
  processLabel: 'How this was made',
} as const satisfies {
  readonly headline: Readonly<Record<HeadlineKey, string>>;
  readonly gap: Readonly<Record<GapBand, string>>;
  readonly closing: Readonly<Record<ClosingKey, string>>;
  readonly [k: string]: unknown;
};
