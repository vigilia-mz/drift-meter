/**
 * The protocol screen.
 *
 * The largest volume of prose in the project and almost none of its logic. Every
 * threshold, weight and denominator this screen prints is already implemented in
 * `src/domain/`, and the numbers below are transcribed rather than recomputed —
 * so `method.test.ts` cross-checks each printed constant against the constant the
 * code actually uses. That test is the reason the sentence about “the 0.25
 * saturation point” cannot go on saying 0.25 after someone has tuned
 * `AUTONOMY_SATURATION` to something else.
 *
 * WHAT SURVIVES. Almost nothing, in wording. The deleted build's protocol screen
 * is gone with the repository that held it, and what is recoverable is its
 * structure — six measures each with a formula and a stated threat, six
 * predictions registered with falsification conditions and printed P6 before P5,
 * and the section numbering that `SOURCES.md` still refers to (section 1 is the
 * design, section 5 is provenance). The prose here is newly written to that shape.
 *
 * ONE DELIBERATE OMISSION. `SOURCES.md` records a claim about Clio as the
 * reference standard for privacy-preserving measurement over real usage, sited on
 * “the consent screen; protocol section 1”. The rebuilt consent screen does not
 * carry it and neither does section 1 below, because the row is unpinned and
 * issue #8 offers exactly two resolutions: pin the publication, or drop the
 * sentence. Dropping it is the one that does not require citing from memory on
 * the screen where a reader is deciding whether to trust the page. The row is
 * updated to say so rather than left describing a screen that no longer exists.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import { ARMS } from './arms.js';
import type { ArmKey, ArmRow, LabelledRow, MeasureSpec, PredictionRow } from './types.js';
import { ARM_KEYS } from '../domain/assignment.js';

export const METHOD = {
  /**
   * “Here” rather than “this screen”, in four places on this module, since v0.8.
   *
   * The protocol is published twice — this screen and `protocol.html` — so a
   * sentence that says *screen* is false on the page and one that says *page* is
   * false on the screen. “Here” is the only word that stays true on both, which
   * makes it the correct fix rather than the neutral one. The four are this
   * standfirst, `measuresNote`, and the threats on revision behaviour and the catch
   * rate. Two other sentences in this module keep the word: they name the debrief
   * and the encoded screen as objects, where *screen* is referential and accurate.
   * The distinction is deictic against referential, and only the deictic ones break.
   */
  standfirst:
    'What this instrument does, what it counts, and what each of those counts would fail to mean. Nothing here has been run on anyone: n is zero, and what is described here is a design rather than a result.',

  designHeading: '1 · The design, and what it controls for',
  designLead:
    'One reader meets the same kind of task twice — three charity cost-effectiveness cases with an estimate already worked out, and three with nothing filled in. The comparison is within the reader, between their own two rounds, and that is the only comparison this build is entitled to make.',
  designRows: [
    {
      label: 'Order',
      value:
        'Counterbalanced. Half of readers meet the supplied estimate first, so practice and fatigue do not line up with the condition of interest. A run pinned by URL parameter is recorded as pinned and the debrief declines to call it counterbalanced.',
    },
    {
      label: 'Cases',
      value:
        'Two slates of three, and which slate carries the estimate is drawn independently of the order. This is what v0.2 got wrong: assistance, practice and the cases themselves varied together, so nothing could be attributed to any one of them.',
    },
    {
      label: 'Attribution',
      value:
        'One of three arms, drawn uniformly. The number, the prose and the recommendation are identical in all three; only the authority attached to them changes.',
    },
    {
      label: 'Held constant',
      value:
        'The cost model’s arithmetic and the wording of every question. Within a case, the sliders, their ranges and the evidence text are the same in either condition, so the only thing the manipulation changes about a case is whether an estimate was supplied and therefore where the sliders start.',
    },
    {
      label: 'Not controlled',
      value:
        'Which slate a reader met in which round. The assisted round runs one slate and the control round the other, so within a single reader the condition and the cases move together, and any difference between their two rounds contains whatever difference there is between the slates. Drawing the slate independently balances that across readers; it does not remove it from one.',
    },
    {
      label: 'Also not controlled',
      value:
        'Time on task, interruptions, whether the reader has read the essays first, and whether they came expecting the argument. All of these sit inside every difference this instrument reports and none of them can be separated out from a single run.',
    },
  ] as const satisfies readonly LabelledRow[],

  armsHeading: '2 · The four arms',
  armsLead:
    'Three attribution arms against a no-estimate control round. The control is within-subject — every reader meets it — and the three attributions are between-subject, one drawn per run. Without the second and third arms, any drop in scrutiny would be a finding about handed answers rather than a finding about AI, and those are different claims.',
  armsColumns: { arm: 'Arm', supplied: 'What is supplied', isolates: 'What it isolates' },
  /**
   * Two fragments, joined around what `ARMS` already holds.
   *
   * The heading is `ARMS[key].label`, which is the exact string the round screen
   * prints above the supplied read, so this table describes the stimulus the
   * reader was actually shown rather than a second description of it. `who` is the
   * mid-sentence phrase the same record carries. Neither is retyped here.
   */
  suppliedPrefix: 'A figure, a written read and a recommendation, headed ',
  suppliedJoin: ' and attributed to ',
  armsIsolate: {
    ai: 'The AI-attributed condition itself. On its own it cannot distinguish deference to an assistant from deference to any supplied number, which is what the other two arms are for.',
    human:
      'Authority without AI. If scrutiny drops here too, the effect belongs to supplied figures carrying someone’s name on them, and the AI framing is decoration.',
    unlabelled:
      'Anchoring with no authority attached at all. This is the floor the other two arms have to clear before either earns a claim.',
  } satisfies Record<ArmKey, string>,
  armsControl: {
    arm: 'No estimate supplied',
    supplied:
      'Nothing. The sliders open at the midpoint of each range and no recommendation is shown.',
    isolates:
      'The reader’s own working, as a baseline for their own assisted round. It is within-subject, so it is the one comparison here that does not depend on anyone else existing.',
  } as const satisfies ArmRow,

  measuresHeading: '3 · The seven measures',
  measuresLead:
    'Six are reported on a 0–100 scale; the seventh is the signed difference between two of the others and runs from −100 to +100. Four of the six are traces of how the work was done. The other two are not, and they are here so that a run can count against this project’s own hypothesis: estimate accuracy asks whether the reader was right, and the catch rate asks whether they found what was misstated. Three of the seven report as undefined rather than zero in at least one round — framing autonomy and the catch rate in the round where nothing was supplied, because neither a frame nor a misstated figure exists there, and accuracy in every run at present, for the reason in its row. Earlier versions said all of these were traces of how the work was done, and that nothing here was compared to a correct answer — true, and a defect rather than a principle: a design where reduced scrutiny of an estimate that happened to be right is indistinguishable from drift cannot produce a result that counts against its own hypothesis.',
  /**
   * The primary outcome, stated rather than left to be chosen afterwards.
   *
   * Seven measures reported as peers is a forking path drawn in the interface. The
   * statement below is one element of a registered analysis plan and not a
   * description of the readout — the same narrowing the process screen's reviewers
   * row makes, because four elements of a plan are still missing and this version
   * has already corrected that row once for overstating the paperwork. It names a
   * between-arm contrast, and one reader draws one arm, so no
   * run computes it. The limit is stated on the page immediately after it rather
   * than left for a reader to derive from the design section — see
   * `primaryOutcomeLimit`, and `limits` for the same absence in the general case.
   *
   * The word *primary* is doing different work here from the `PRIMARY` grade in
   * `SOURCES.md`, which says a source was pinned and read on a stated date. The
   * two vocabularies meet on the process screen, so this one says *outcome* every
   * time it is used.
   */
  primaryOutcomeHeading: 'The primary outcome, fixed in advance',
  primaryOutcome:
    'The primary outcome is the difference in evidence engagement between conditions, within the AI-attributed arm, tested against the same difference in the human-attributed and unattributed arms, fixed before any data exists.',
  primaryOutcomeWhy:
    'Reported as peers, whichever measure moved most could have been presented afterwards as the result without contradicting anything registered. Six predictions are registered below with the condition that would falsify each, which is what stops a claim being invented after the fact; what none of them said is which measure the design turns on, and that is the gap this closes. Naming one measure in advance is the cheapest guard against it, and it is only available while n is zero. The other six are secondary in the sense that they are reported and worth reading rather than set aside; none of them is retired, and the debrief says the same thing in its own words.',
  primaryOutcomeLimit:
    'What this build does with that statement is nothing, and the statement is worth less if it does not say so. One reader draws one arm, so a run yields the within-reader difference for a single arm and no between-arm contrast at all; nothing is stored and no two runs are ever compared. The comparison above needs a cohort that does not exist. It is registered here so that it cannot be chosen later, which is the only thing pre-specification does.',

  measuresFields: {
    definition: 'What is counted',
    formula: 'Formula',
    threat: 'What threatens it',
  },
  measuresNote:
    'The denominators above are derived in code from the slate being scored, never written as literals. A previous version divided the evaluative range by six sliders when there are nine — an arithmetic error in a published figure, found by a reader rather than by the code. Every formula here is cross-checked against the constant the code uses by a test that fails if the two disagree.',

  predictionsHeading: '4 · The registered predictions',
  predictionsLead:
    'Registered before any data exists, with the condition that would falsify each one. They are registered in this repository and the git history is the only timestamp on them, which is weaker than a registry and is said here rather than left to be assumed.',
  predictionsColumns: { id: 'ID', claim: 'Prediction', test: 'What would falsify it' },
  /**
   * Why P6 is printed before P5.
   *
   * Not a sorting mistake. P1 to P4 are contrasts inside one reader's own two
   * rounds; P6 and P5 both need a cohort, and P6 sits with the trap prediction it
   * follows from rather than at the end. The order is asserted by the content
   * invariants test so that it cannot be silently tidied into numerical sequence.
   */
  predictionsOrderNote:
    'P6 is listed before P5 on purpose. P1 to P4 are contrasts inside one reader’s own two rounds, so a single run produces both sides of each. P6 and P5 both need a cohort — one compares readers who caught the planted error against readers who missed it, the other compares the three arms — and P6 sits here because it follows from P4 rather than because it is easier to test.',
  predictionsCaveat:
    'None of these has been tested, and none of them can be by one reader. With n at zero the honest status of every row below is “registered”, and the most likely outcome of a first collection is that the instrument turns out to be measuring something narrower than the claim.',

  provenanceHeading: '5 · Stimulus and model provenance',
  stimulusLead:
    'The six cases are constructed. They are shaped after real interventions and real disputes in cost-effectiveness estimation, and the specific figures in them are made for the task rather than reported from a study.',
  stimulusRows: [
    {
      label: 'The cases',
      value:
        'Written for this instrument. Each carries three assumptions with plausible ranges, and a cost model that is the same three-term arithmetic in every case.',
    },
    {
      label: 'The planted errors',
      value:
        'A property of a case rather than of a slate, so any case may carry one: a figure that is not what its label says it is. One is authored per slate today, in the same shape both times — slate A misstates a cost and slate B misstates a rate, so that the transfer check is asking about a pattern rather than about a number the reader has already seen. The catch-rate row above says what one per slate costs the measurement.',
    },
    {
      label: 'The figures',
      value:
        'Illustrative, and the instrument says so before the run and again after it. Five rows in the repository’s source table carry the grade that means built for the exercise rather than taken from anywhere: the four case figures, and the specimen readout on the landing page, which is a drawing of a result rather than a result. The disclosure names no case and no slider, because what this measures is whether a reader interrogates the load-bearing figure without being told which one it is.',
    },
    {
      label: 'The estimates',
      value:
        'Computed on the page from the slider values by the same function in both rounds. Nothing shown as a cost was written by hand.',
    },
  ] as const satisfies readonly LabelledRow[],
  modelLead:
    'Two screens of this instrument call a model: the debrief, which can send a short anonymous summary of the run and print what comes back, and the screen that runs the four design rules as a system prompt and scores the answer against a rubric. Both call the same model, pinned to one exact ID, and a change to that pin is a re-baseline rather than maintenance: it makes rubric pass rates incomparable to earlier runs, and it is recorded in the changelog in those words.',
  modelPinLabel: 'Pinned to',
  modelPrintedLabel: 'Printed on the page',
  modelPrinted:
    'The ID the API returns with each response, verbatim, beside the response. That printed value is the provenance record — not the constant above, which is only what was asked for. It is the single claim on this site that verifies itself.',
  modelDarkLabel: 'In this build',
  modelDark:
    'Off. The endpoint URL is empty in the committed configuration, so no call is made, nothing is spent, and no served model ID has been printed yet. Turning it on is a one-line change with its own commit.',

  limitsHeading: '6 · What this build cannot do',
  limitsLead:
    'The list below is not a disclaimer attached to a result. There is no result. It is the set of things that would have to be different before anything measured here could be reported as a finding about anyone.',
  limits: [
    'n is zero. Nothing has been collected from anyone, and no figure on this site is a measurement of a population.',
    'Drift is longitudinal — a capacity weakening across repeated delegation — and a run is one sitting. What a run records is short-run behaviour under two conditions, which is at most the trace such a weakening would leave on its way through, and is equally consistent with there being no weakening at all. No arrangement of a single sitting distinguishes those two; a design that returns to the same readers over time is the only thing that would.',
    'Six cases in one sitting, with no stakes and no clock, is the condition under which a reader is at their most careful. Whatever drift exists in real work under real deadlines, this is the setting least likely to show it.',
    'Readers arrive from an essay that states the expected result. That is a demand characteristic sitting directly upstream of the measurement, and the instrument has no version of itself that does not have it.',
    'The primary outcome is a process trace, and a weak one. A reader who opens every panel out of habit scores full marks on evidence engagement without having read anything, and nothing here can tell the two apart — so the measure fixed in advance is the measure that cannot distinguish a reflexive click from a careful one. It was chosen for being the one P1 is about rather than for being the best of the seven. Of the two that are not traces at all, accuracy is undefined in every run today and the catch rate is one observation per reader.',
    'The saturation point, the two autonomy weights and the three debrief thresholds were all chosen by eye. They need calibrating against how experienced evaluators actually work these slates before any of them means anything.',
    'The control round’s sliders open at an arbitrary midpoint and the assisted round’s open at an authoritative number. Moving off those two starting points is not the same act, and the difference inflates the control round on one measure.',
    'One reader, one arm, one slate, one order per run. Every between-subject comparison this design is built to support needs a cohort, and there is not one.',
    'One planted error is authored per slate, so the catch rate — the only measure here with a right answer behind it — is one observation per reader. A single observation is a coin flip, and two of the six registered predictions rest on it. The instrument now records a planted error per case rather than per slate, so more can be authored; until they are, this is the weakest denominator here.',
  ],

  /**
   * The address this screen does not have.
   *
   * `src/platform/history.ts` declines to write `?screen=method`, on the grounds
   * that a URL which shows the intro when reloaded is a URL that lies. That is the
   * right call and it left the protocol uncitable: a reviewer reading this project
   * with a text-based tool got `drift-meter.html`, which is a script tag, and one
   * said so. `protocol.html` is this screen rendered from this module at build time,
   * so the two cannot disagree, and it is what a citation, a crawler or an archive
   * can actually hold. Said here rather than left for a reader to discover, because
   * a reader who wants to cite a protocol should not have to guess whether they may.
   *
   * These two fields say “this screen” where the standfirst says “here”, and the
   * difference is deliberate: `render-protocol.mjs` does not render them. They are
   * the screen telling a reader about the page, which is a sentence the page has no
   * use for. A field added here that the renderer does pick up takes the “here” rule
   * with it.
   */
  permalinkLead:
    'This protocol is also published as a page of its own, rendered from the same source as this screen. The screen has no address — the instrument keeps where you are in memory rather than in the URL — so a citation, a fetch or an archive needs the page.',
  permalinkLabel: 'The protocol as a page',

  backLabel: 'Back',
  processLabel: 'How this was produced',
} as const;

/**
 * The seven measures, with their arithmetic and the objection to each.
 *
 * `key` is a field of `Metrics`, so this screen cannot name a measure the
 * instrument does not compute, and every measure the debrief draws as a paired bar
 * shares its label with the entry here, which a test asserts.
 *
 * The reverse does not hold, and two entries prove it. The confidence gap has no bar
 * because since #37 it is two figures printed beside each other rather than one value
 * per round — drawing them as a pair of bars would restate as a single shape the
 * commensurability the change exists to stop asserting. The catch rate has none because it
 * is one observation per reader while one planted error is authored per slate, and a
 * bar is a shape that invites reading 0 or 100 as a rate; the debrief gives it a
 * paragraph per planted error instead. Both exclusions are stated in their own rows,
 * because a measure computed and not shown is a thing a reader is entitled to know
 * about.
 */
export const MEASURE_SPECS = [
  {
    key: 'engagement',
    label: 'Evidence engagement',
    definition:
      'Whether a case was looked at. Opening either the supplied read or the evidence panel marks the case, and closing it again does not unmark it.',
    formula: 'cases opened ÷ 3 cases × 100',
    threat:
      'Binary and sticky by design, which makes it a measure of whether the reader went looking rather than of what they found. It cannot distinguish reading the evidence from opening the panel and scrolling past it, and it rewards a reflexive click exactly as much as a careful one.',
  },
  {
    key: 'range',
    label: 'Revision behaviour',
    definition:
      'How many of the assumptions underneath the estimates the reader moved. A slider dragged and returned to where it started still counts, because the act being observed is the interrogation rather than the disagreement.',
    formula: 'sliders moved ÷ 9 sliders × 100',
    threat:
      'The two rounds do not start from the same place. The control round opens at an arbitrary midpoint and the assisted round opens at a supplied figure, so moving a slider is a smaller act in one round than in the other — and the effect inflates this measure in the control round, in the same direction as the prediction. This is the largest single threat listed here.',
  },
  {
    key: 'amb',
    label: 'Ambiguity tolerance',
    definition:
      'Uncertainty flags raised, plus calls to investigate rather than to fund or pass. Two points are available per case.',
    formula: '(flags + investigate calls) ÷ (3 cases × 2 points) × 100',
    threat:
      'It treats declining to decide and deciding to look further as the same act, and weights them equally. Those are different behaviours and one of them is sometimes just avoidance. It should be two measures, and it will be one until there is evidence that they load together.',
  },
  {
    key: 'auto',
    label: 'Framing autonomy',
    definition:
      'How far the reader departed from the frame they were handed: half for overriding the supplied recommendation, half for moving the supplied numbers.',
    formula:
      '50 × (departures ÷ 3 cases) + 50 × min(1, mean slider deviation ÷ 0.25), capped at 100',
    threat:
      'The 0.25 saturation point — moving every slider a quarter of its range, on average, counted as full autonomy — was chosen by eye and has never been calibrated against anyone’s actual behaviour. The measure is also undefined in the control round, where no frame was supplied, so it is reported as undefined there rather than imputed. An earlier version imputed it from an invented constant and that was retracted.',
  },
  {
    key: 'accuracy',
    label: 'Estimate accuracy',
    definition:
      'How close the reader’s final values came to what the evidence supports, over the assumptions that carry a supported value — currently none of the eighteen, so the measure is undefined in every run. Each distance is a share of that slider’s own range, the convention the autonomy measure uses, so a cost in dollars and a rate in percent count comparably. Defined in both rounds: being right does not depend on having been given a frame.',
    formula:
      '100 − mean(min(1, |final − supported| ÷ slider range)) × 100, over supported assumptions',
    threat:
      'No assumption carries a supported value yet, so the measure is undefined in every run and the bar reads n/a. Several of these quantities have no single defensible number — cash-transfer persistence at five years is disputed, and the case’s own evidence panel says so — and inventing one to complete the measure would be the failure this instrument is about. Where a value is authored the measure inherits its contestability: a reader is then scored against one reading of the evidence, which is not the same as being wrong. It is reported beside the behavioural measures and never averaged into them.',
  },
  {
    key: 'catchRate',
    label: 'Planted-error catch rate',
    definition:
      'Of the cases carrying a planted error — a figure that is not what its label says it is — the share on which the reader moved the misstated figure. Moving that one slider is the whole of it: opening the evidence panel that carries the correction does not count, and flagging the case does not count. Undefined rather than zero in the round where no estimate was supplied, because nothing was misstated there and a zero would say the reader missed something that was never set.',
    formula:
      'planted errors whose figure was moved ÷ planted errors on the slate × 100, undefined where the slate carries none',
    threat:
      'The content authors one planted error per slate, so for a single reader this is one observation on the only thing here with a right answer, and one observation is a coin flip rather than a rate. Until #31 it could not have been more: the slate named a single trapped case, and a second one had nowhere to live. The mechanism now carries any number per slate and the content carries one, which is a limit of the authoring and is why this measure is reported here and not drawn as a bar beside the others — a bar reading 0 or 100 off a single observation would look like a rate. What the debrief shows instead is one paragraph per planted error, saying what was done about that one.',
  },
  {
    key: 'gap',
    label: 'Confidence against behaviour',
    definition:
      'The reader’s own confidence rating for a round, reported beside a composite of what they actually did in it. The two are printed side by side and are not subtracted on the page: one is a five-point self-report rescaled and the other is a mean of three unlike process measures, and their difference would be a quantity in units that do not exist.',
    formula: 'rating ÷ 5 × 100, printed beside mean(engagement, revision, ambiguity)',
    threat:
      'The composite is three process measures averaged with equal weights, and those weights are an authorial choice rather than a result. Taking the magnitude off the page does not retire that choice: the sign of the difference still selects which of three paragraphs the debrief prints, so the subtraction has left the screen and not the instrument. What would settle the weights is a pilot showing whether the three load together, which is not yet run.',
  },
] as const satisfies readonly MeasureSpec[];

/**
 * The registered predictions, in the order the page prints them.
 *
 * P6 sits before P5. See `METHOD.predictionsOrderNote` for why, and the content
 * invariants test for the assertion that keeps it that way.
 */
export const PRED_ROWS = [
  {
    id: 'P1',
    claim:
      'Evidence engagement is lower in the round where an estimate is supplied than in the round where none is.',
    test: 'Engagement equal or higher in the assisted round, across readers.',
  },
  {
    id: 'P2',
    claim:
      'Fewer of the assumptions underneath the estimate are moved when a figure is already in the box.',
    test: 'Revision behaviour equal or higher in the assisted round once the difference in starting points is accounted for.',
  },
  {
    id: 'P3',
    claim:
      'Self-rated confidence is higher after the assisted round than after the control round, whatever the working shows.',
    test: 'Confidence equal or lower after the assisted round.',
  },
  {
    id: 'P4',
    claim:
      'The planted error is caught less often when the case arrives with a recommendation already selected than when it does not.',
    test: 'Catch rate equal or higher with the recommendation pre-selected, or no difference once the arm is accounted for.',
  },
  {
    id: 'P6',
    claim:
      'Readers who caught the planted error name the right figure on the unseen transfer case more often than readers who missed it.',
    test: 'Transfer performance equal or lower among readers who caught the planted error than among readers who missed it.',
  },
  {
    id: 'P5',
    claim:
      'The drop in scrutiny is larger in the AI-attributed arm than in the human-attributed arm, and both are larger than the unattributed arm.',
    test: 'Any ordering other than that one, including no difference between the three arms — which would make the finding about supplied figures rather than about AI.',
  },
] as const satisfies readonly PredictionRow[];

/**
 * The arm table's rows, composed rather than written out.
 *
 * The three attributed rows take their name, their heading and their attribution
 * phrase from `ARMS` — the same record the round screen renders — so the protocol
 * screen cannot describe an arm the instrument does not run. The fourth is the
 * control round, which is not an `ArmKey` because no attribution is drawn for it.
 */
export function armRows(): readonly ArmRow[] {
  const attributed = ARM_KEYS.map((key) => ({
    arm: ARMS[key].tag,
    supplied: `${METHOD.suppliedPrefix}“${ARMS[key].label}”${METHOD.suppliedJoin}${ARMS[key].who}.`,
    isolates: METHOD.armsIsolate[key],
  }));
  return [...attributed, METHOD.armsControl];
}
