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
import type { DebriefMeasure } from './types.js';

/**
 * The five paired measures, in the order the debrief shows them.
 *
 * This said four until the primary outcome was declared, and it had said four
 * since estimate accuracy joined them — a count in a comment beside the list it
 * counts, which is the shape this repository keeps finding stale. Nothing
 * published was wrong, because a comment is not screen copy; the counts that are
 * screen copy are held against the array by tests instead.
 *
 * `key` names the `Metrics` field. The labels are the ones the landing page
 * already uses for the measures, so a reader who arrived from there meets
 * the same vocabulary; the `what` line says what was actually counted, because
 * a bar with only a name on it invites the reader to supply their own meaning.
 */
/**
 * Why a bar reads `n/a`, per measure.
 *
 * Per measure rather than one shared line, because the two measures that can be
 * undefined are undefined for unrelated reasons: framing autonomy has no supplied
 * frame to depart from in the control round, and accuracy has no authored supported
 * value to be close to. One caption covering both would have to be vague enough to
 * be true of either, and “reported rather than imputed” is a promise about a
 * specific thing rather than a general disclaimer.
 */
const NO_FRAME = 'Undefined without a supplied frame. Reported rather than imputed.';
const ALWAYS_DEFINED = 'Undefined. Reported rather than imputed.';

export const MEASURES = [
  {
    key: 'engagement',
    label: 'Evidence engagement',
    what: 'Cases where you opened the estimate or the evidence, as a share of the three.',
    undefinedCaption: ALWAYS_DEFINED,
    primary: true,
  },
  {
    key: 'range',
    label: 'Revision behaviour',
    what: 'Sliders you moved off the value they started on, as a share of all nine.',
    undefinedCaption: ALWAYS_DEFINED,
  },
  {
    key: 'amb',
    label: 'Ambiguity tolerance',
    what: 'Uncertainty flags and calls to investigate, as a share of the two available per case.',
    undefinedCaption: ALWAYS_DEFINED,
  },
  {
    key: 'auto',
    label: 'Framing autonomy',
    what: 'How far you departed from the estimate you were given — undefined where none was.',
    undefinedCaption: NO_FRAME,
  },
  {
    key: 'accuracy',
    label: 'Estimate accuracy',
    what: 'How close your final values came to what the evidence supports, where it supports a number.',
    undefinedCaption:
      'No assumption here carries a supported value yet, so accuracy is undefined rather than perfect. Reported rather than imputed.',
  },
] as const satisfies readonly DebriefMeasure[];

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
  undefinedCaption: NO_FRAME,

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
   * The primary outcome, marked on the bar and named under it.
   *
   * Five bars drawn as peers is a forking path drawn in the interface: whichever
   * moved most reads as the result, and nothing on the screen distinguishes a
   * prediction from a preference formed after seeing the numbers. One measure is
   * therefore fixed in advance, and the protocol screen states the comparison it
   * belongs to. A test holds the two screens to the same measure.
   *
   * Secondary is not a demotion, and the copy has to say which sense it means.
   * These four are the same traces they were before anything was declared; what
   * changed is that they can no longer be promoted after the fact.
   */
  primaryTag: 'Primary outcome',
  primaryNote:
    'Evidence engagement is the primary outcome, and it was fixed before any data existed. The other four are secondary, which here means reported and worth reading rather than set aside: they are the same traces they were before one of them was named, and naming one in advance is what stops whichever bar moved most from being read afterwards as the result.',

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

  /**
   * The two halves of the comparison, printed side by side and never subtracted.
   *
   * The difference used to be reported as the measure, and it was the quantity on
   * this screen that most looked like a number and least was one: a five-point
   * self-report rescaled to 0–100, minus a mean of three unlike process measures
   * carrying equal weights. Both halves are authorial choices, so the difference
   * inherits both and states neither.
   *
   * What survives of it is direction. `gapBand` reads the sign to choose the
   * paragraph above, which is a claim this design can make; the distance is not,
   * and the note says so on the page rather than in this comment.
   */
  gapComponentsRowAxis: 'Figure',
  gapComponents: {
    perceived: 'What you said: your confidence rating, as a share of the five-point scale',
    actual:
      'What you did: the mean of evidence engagement, revision behaviour and ambiguity tolerance',
  },
  gapComponentsNote:
    'These two are not subtracted here. One is what you said about a round and the other summarises what you did in it, and a difference between them would be a figure in units that do not exist. The paragraph above reads which way they part rather than how far.',

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

  /**
   * The trap section, in a singular and a plural form.
   *
   * Two forms rather than one that covers both, because a planted error is now a
   * property of a case and any case may carry one (#31) — so the number a run meets
   * is a fact about the slate rather than a constant. One is authored per slate
   * today, which means the singular is what every reader currently sees and the
   * plural is the form that arrives with the second planted error. Writing "one or
   * more" would have been a sentence that is never quite true of the page it is on.
   */
  trapHeading: {
    one: 'The case with something wrong in it',
    many: 'The cases with something wrong in them',
  },
  trapLead: {
    one: 'One case in the round with the supplied estimate carried a planted error: a figure that was not what its label said it was. What follows depends on what you did, not on whether you got the answer right.',
    many: 'More than one case in the round with the supplied estimate carried a planted error: a figure that was not what its label said it was. There is a panel below for each, and what each one says depends on what you did, not on whether you got the answer right.',
  },

  nextLabel: 'Continue',
  methodLabel: 'Read the method',
  processLabel: 'How this was made',
} as const satisfies {
  readonly headline: Readonly<Record<HeadlineKey, string>>;
  readonly gap: Readonly<Record<GapBand, string>>;
  readonly closing: Readonly<Record<ClosingKey, string>>;
  readonly [k: string]: unknown;
};
