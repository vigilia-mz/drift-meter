/**
 * The publication-process screen.
 *
 * The screen that says who made this, what changed, who has read it, and what is
 * still wrong with it. It exists because the project's argument is about unearned
 * confidence, and a page arguing that while presenting itself as finished would be
 * making the mistake it describes.
 *
 * THREE PASSAGES SURVIVE and are used verbatim, marked at the point of use: the
 * paragraph on why visible process substitutes for an institution, the sentence on
 * why reviewers are named, and the methods reader's note about the network behind
 * this project being the wrong one for experimental design. They survive because
 * they were quoted into the issue tracker before the original repository was
 * deleted. Everything else here is newly written.
 *
 * TWO TABLES ARE MIRRORS, NOT SOURCES. The changelog rows and the source rows
 * restate `CHANGELOG.md` and `SOURCES.md` at the length a screen can carry. The
 * files are the record; the screen says so and links a reader to them. Where the
 * two could disagree, the invariants test pins the parts that matter — the v0.2
 * retraction stays in the list, and the row that grades the model ID stays graded
 * PRIMARY.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

import type {
  ChangelogEntry,
  LabelledRow,
  ProvenanceRow,
  ReviewerRow,
  SourceRow,
} from './types.js';

export const PROCESS = {
  standfirst:
    'Who made this, what has changed in it, who has read it, and what is still wrong with it. A prototype about unearned confidence is the last thing that should present itself as finished.',

  mastheadHeading: 'Masthead',
  mastheadRows: [
    {
      label: 'Author',
      value: 'Megi Pishtari. Sole author, and sole responsibility for every claim on this site.',
    },
    { label: 'Project', value: 'Experiment 01 of the Agential Drift Research Program.' },
    {
      label: 'Version',
      value:
        'v0.7, on the v0.6 rebuild. The changelog below records every version and what it changed.',
    },
    {
      label: 'Status',
      value:
        'Prototype. n is zero: no data has been collected from anyone, and nothing here is a finding.',
    },
    {
      label: 'Where it lives',
      value:
        'One published copy, at vigilia-mz.github.io/drift-meter. There is deliberately no second one — two live copies of a research artifact is a citation problem.',
    },
    {
      label: 'Licence',
      value:
        'The prose, including every word of screen copy, under CC BY 4.0. The code under Apache 2.0. Reuse either with attribution; the claims stay attached to their author.',
    },
    {
      label: 'Contact',
      value:
        'Through the GitHub profile linked from the repository. Disagreement is more useful here than a patch.',
    },
  ] as const satisfies readonly LabelledRow[],

  /**
   * Surviving copy, used verbatim.
   *
   * It is the argument for this whole screen, and it is the standard the rest of
   * the screen is failing to meet in three places — no named readers, three
   * unpinned figures, no citable identifier.
   */
  whyLead:
    'Anyone can publish a prototype. Without an institution behind it, the visible process is what makes a claim checkable: a version, a record of what changed and why, named readers who tried to break it, stated conditions of defeat, and every external claim traced to where it came from.',
  whyFollow:
    'Four of those five are in place below. The third is absent — nobody has read this yet, and the section that says so is the most important one on the page. The fifth is in place and three of its rows are not: the essays state three findings about students, endoscopists and developers with nothing on the site to check them against.',

  changelogHeading: 'What changed, and why',
  changelogLead:
    'Every version, newest first, with the retractions kept in. Versions v0.1 to v0.5 were published from a repository that has since been deleted, which makes the changelog the only surviving record of them and the reason it is reproduced here rather than only linked.',
  changelogFields: { what: 'What changed', why: 'Why' },
  changelogFullNote:
    'This is the short form. The full entries, with everything each version changed, are in CHANGELOG.md in the repository.',

  reviewersHeading: 'Who has read this',
  reviewersLead:
    'Nobody, yet. Three readers are named below by the job they would do rather than by name, because none of them has been asked. Each is asked for exactly one thing, so that a reader who agrees to help knows what they are agreeing to.',
  reviewersColumns: { role: 'Reader', status: 'Status', brief: 'Asked for' },
  /** Surviving copy, used verbatim. */
  reviewersNaming:
    'Reviewers are acknowledged by name once they have read a version, because a name is someone who can be asked what they actually said.',
  reviewersNote:
    'A public design review would substitute for the first of these imperfectly, and would timestamp the predictions at the same time — two obligations discharged by one post. That may be the cheaper path, and it is the one currently planned.',

  caveatsHeading: 'What to distrust here',
  caveatsLead:
    'Stated by the author rather than left for a reader to find, on the grounds that a list of one’s own weaknesses is cheap to write and expensive to omit.',
  caveats: [
    'The author is not a methodologist. The design below has been reasoned through carefully and reviewed by nobody, and the single most valuable correction this project has received came from an outside reader noticing a confound the author had not.',
    'The argument and the instrument were built by the same person, in that order. An instrument built to find a pattern by someone who expects the pattern is not neutral about what it counts, and no amount of care inside the code fixes that.',
    'Parts of this site were drafted with Claude, which is the subject of the argument being made. The provenance table below says which parts, including the ones that were cut for being exactly the kind of thing the argument warns about.',
    'Every figure in every case is written for the exercise, and the instrument says so before the run and again after it. What that disclosure does not do is verify anything: the figures are still not traced to any source, and the reason they are cleared is that the page no longer presents them as findings. It is the weaker of the two exits, taken deliberately, and it is worth reading as such.',
    'There is no citable identifier. A reader can point at this URL, which serves whatever version is current, and not at the version that shipped the retracted dashboard or at the version that removed it.',
  ],

  provenanceHeading: 'How this page was produced',
  provenanceLead:
    'A page arguing about AI-assisted work that will not say which parts of itself were AI-assisted is asking for a trust it has not earned. This table is the answer, including the part that is unflattering.',

  sourcesHeading: 'Every external claim',
  sourcesLead:
    'The claims on this site that come from somewhere other than the site itself, with how well each is pinned. Illustrative is not a weaker grade than pinned — it means the figure was built for the exercise and the page says so, which is a different object from a figure taken from a study. Flagged is the one grade that means not cleared for publication, and three rows still carry it: the essays’ empirical claims about students, endoscopists and developers. Those are assertions about the world stated as findings, and no disclosure can clear them.',
  sourcesColumns: { claim: 'Claim', grade: 'Grade', standing: 'Standing' },
  /** Prefixed to a row's `checked` value. Screen copy, so it lives here. */
  sourcesCheckedLabel: 'Checked: ',
  sourcesFullNote:
    'The full table, with the primary source each row still needs and what each pass did not cover, is SOURCES.md in the repository. One row is pinned to its source and was read on the date beside it: the Clio row, whose wording that reading narrowed. No source was re-verified when the figures were restated as illustrative, and every other primary link that was open is still open.',
  sourcesOrigin:
    'The table exists because of the last row in it. Correct figures with a missing qualifier is the class of error a source table catches and a careful read does not, because nothing in the sentence looks wrong.',

  backLabel: 'Back',
  methodLabel: 'Read the method',
} as const;

/**
 * The versions, newest first.
 *
 * v0.2 is a retraction and stays in the list. A changelog that quietly loses the
 * version where something was withdrawn is worth less than no changelog, because
 * it looks like one.
 */
export const CHANGELOG_ROWS = [
  {
    version: 'v0.7',
    date: 'In progress',
    title: 'The attribution reaches every reader, and a measure that can lose',
    what: 'The arm’s label moved out of the estimate panel, which starts closed, so a reader who never opened it was never in an arm while the debrief told them which one they drew. A sixth measure, estimate accuracy, scores the reader against what the evidence supports and is reported beside the behavioural measures, never averaged into them; it is undefined in every run today because the values it would score against have not been authored. The landing page stopped saying the review is done once with AI assistance and once without it, and its specimen bars now say they are invented. Three files of paperwork corrected, and one claim nobody had tracked given a row.',
    why: 'Opening the panel was measuring evidence engagement and delivering the treatment at once, and a measure cannot also be its own independent variable — P1 is a claim about exactly the readers the manipulation was not reaching. The accuracy measure is what lets the design lose: until it, every outcome was consistent with the hypothesis, which is not an instrument. Both were found by reading rather than by a test, which is how the ÷6-versus-÷9 bug was found too.',
  },
  {
    version: 'v0.6',
    date: '10 Aug 2026',
    title: 'Rebuilt from source, and a model re-baseline',
    what: 'The instrument runs again from editable source, with one pure reducer, typed content modules and a test suite; the previous build shipped as a single generated bundle whose source existed nowhere. All thirteen screens render, and the endpoint exists and is dark by default. The case figures are restated on the page as illustrative. Eleven claims this project made about its own work are corrected, four of them claims about its own tests. The model is re-baselined.',
    why: 'A build that cannot be corrected with confidence is the wrong property for something whose whole claim is that it measures something. The corrections are the uncomfortable part: a claimed test is worse than a missing one, because it stops anyone looking for the gap. The model change is a re-baseline rather than maintenance — rubric pass rates from v0.4 and v0.5 are not comparable to runs after it, and the series restarts here.',
  },
  {
    version: 'v0.5',
    date: '30 Jul 2026',
    title: 'It teaches, it checks, and it says who wrote it',
    what: 'Transfer check added after the debrief. A repair pass feeds failed rubric items back as instructions and re-scores the rewrite. Production provenance published. Prediction P6 registered.',
    why: 'A teaching instrument that never checks whether it taught is a diagnosis with good manners, and a page built with Claude that will not say which parts is asking for a trust it has not earned.',
  },
  {
    version: 'v0.4',
    date: '30 Jul 2026',
    title: 'The rules, encoded and scored',
    what: 'The four design rules run as a system prompt against the same model with no rules at all, and are scored live by a four-item rubric. The prompt is displayed in full on the page. Sixty-second path added to the landing screen.',
    why: 'A specification nobody can run is an opinion, and a quality bar held in one person’s taste does not survive contact with scale.',
  },
  {
    version: 'v0.3',
    date: '30 Jul 2026',
    title: 'Protocol rebuild',
    what: 'Order counterbalanced and slate assignment drawn independently of it. Three attribution arms added against the control round. Every measure given a formula and a stated threat. Five predictions registered. Framing autonomy reported as undefined in the control round rather than imputed. The evaluative range was dividing by six sliders when there are nine; fixed.',
    why: 'An outside reader pointed out that v0.2 could not distinguish AI degrading judgment from handed answers degrading judgment, and that three things varied at once between the rounds. Both were fatal to the claim and neither was hard to fix, which is the uncomfortable part.',
  },
  {
    version: 'v0.2',
    date: 'Jul 2026',
    title: 'Cohort dashboard removed',
    what: 'Deleted the cohort comparison screen and its figures from the page and from the source, and replaced it with a methodology screen stating what would need to be measured.',
    why: 'The figures were illustrative and the page implied they were measured. n was zero. A prototype about people accepting numbers they have not checked cannot ship invented numbers.',
  },
  {
    version: 'v0.1',
    date: 'Jul 2026',
    title: 'First public build',
    what: 'Two-round instrument, five dimensions, and a live reflection endpoint holding the API key server-side.',
    why: 'Initial release.',
  },
] as const satisfies readonly ChangelogEntry[];

/**
 * The three readers, and the substitute currently planned in place of the first.
 *
 * Each is asked for one thing. The methods reader's note is surviving copy and is
 * used verbatim: it is the strongest argument in the project for why this section
 * is empty and should not be.
 */
export const REVIEWER_ROWS = [
  {
    role: 'Methods reader',
    status: 'Not recruited',
    brief:
      'Attack the design: order effects, the anchoring confound, construct definitions, and whether the six registered predictions can be tested by it. They are registered with their falsification conditions and without an analysis plan.',
    note: 'This is the real gap. The network behind this project is philosophy-heavy, which is the right network for the conceptual argument and the wrong one for experimental design. The confound in v0.1 is precisely what this reader exists to catch, and it was caught by an outside reader instead of by the process.',
    noteGloss:
      '[Introduced in v0.1, recorded at v0.2. Editorial gloss, outside the surviving note.]',
  },
  {
    role: 'Editor',
    status: 'Not assigned',
    brief: 'Attack the prose for overclaiming — where the risk concentrates, given the subject.',
    note: 'The writing states its own limits often enough that the limits themselves start to read as a kind of authority. That is the failure mode an editor would catch and the author would not.',
  },
  {
    role: 'Naive reader',
    status: 'Not assigned',
    brief: 'Not whether they liked it. Where they stopped understanding it, and at which sentence.',
    note: 'The instrument recruits from an essay that states its expected result, so the reader who arrives is already the reader least likely to be confused by it. That makes this the reader hardest to find and the one worth the most.',
  },
  {
    role: 'Public design review',
    status: 'Planned before collection',
    brief:
      'Post the design and the six predictions publicly, before any data exists, and let anyone attack either.',
    note: 'An imperfect substitute for the methods reader, and the only one that also timestamps the predictions. Planned rather than scheduled, and it does not discharge the obligation above so much as make its absence cheaper.',
  },
] as const satisfies readonly ReviewerRow[];

/**
 * What Claude drafted, what it was never handed, what it drafted that was cut,
 * and the rule that fell out of it.
 *
 * The cut row is the point of the table and stays as written. All three of the
 * things listed in it are the kind of thing this project exists to argue against,
 * and all three were produced fluently on request.
 */
export const PROVENANCE_ROWS = [
  {
    label: 'Drafted with Claude',
    value:
      'The implementation, the tests, and a first pass at most of the screen copy — then rewritten by hand where the register was wrong, which was most places. The four design rules, the debrief branches and this table were all drafted in a session and then argued with.',
    tone: 'kept',
  },
  {
    label: 'Never handed over',
    value:
      'The argument, the six predictions and their falsification conditions, the grading of every source, and the decision to retract anything. Those are the parts a reader is being asked to trust the author on, and delegating them would make the byline false.',
    tone: 'rule',
  },
  {
    label: 'Drafted and cut',
    value:
      'A cohort dashboard with invented figures, a personality verdict for the reader at the end of the run, and a constant imputed to fill the gap where framing autonomy is undefined. Each was produced quickly, looked right, and was exactly the thing this project argues against. Two of the three shipped before they were cut: the dashboard until v0.2, the imputed constant until v0.3.',
    tone: 'cut',
  },
  {
    label: 'The rule that fell out of it',
    value:
      'Fluent output is easiest to accept where it is least checkable — a plausible figure, a confident summary, a number standing in for one that does not exist. Everything on this site that produces a number now has a test, and no denominator is written as a literal.',
    tone: 'rule',
  },
] as const satisfies readonly ProvenanceRow[];

/**
 * Every external claim, and how well it is pinned.
 *
 * Mirrors `SOURCES.md`, one row per entry, at the length a screen can carry. The
 * file is the record; the invariants test asserts that the two hold the same
 * claims at the same grades, so a row cannot be added to one and forgotten in the
 * other.
 *
 * Two things this table says that are easy to misread. `Illustrative` is not a
 * weaker `Primary`: it means the figure was built for the exercise and the page
 * says so, which is the other exit from `Flagged` and not a pin. And the three
 * rows still graded `Flagged` are not case figures — they are the essays'
 * empirical claims about students, endoscopists and developers, stated as findings
 * with nothing to check them against. A disclosure cannot clear those, because
 * they are either true and uncited or they are not true.
 *
 * The Clio row is a claim the rebuild stopped making: it was cited on the consent
 * screen and in protocol section 1 from memory, and neither screen carries it now.
 * The row stays, because a claim withdrawn is part of the record. The publication
 * has since been pinned in the file as well, and reading it narrowed the claim —
 * the wording here is the narrowed one, and the grade moved with it.
 */
export const SOURCE_ROWS = [
  {
    claim: 'Bednet commodity cost near $2 against a delivered cost near $4.50.',
    where:
      'Slate A, case 2. The supplied figure, the evidence panel, and the case’s own trap record, which the debrief’s paragraph is composed from.',
    grade: 'Illustrative',
    checked: 'Restated 7 Aug 2026',
    note: 'Constructed for the task. The gap between commodity and delivered cost in net distribution is real and well documented; these particular figures are not taken from it. The disclosure that says so is general on purpose — naming this case would tell the reader where the planted error is, and leave nothing to observe.',
  },
  {
    claim: 'Chlorination access near 80% against sustained use roughly half that.',
    where:
      'Slate B, case 3. The supplied figure, the evidence panel, and the case’s own trap record, which the debrief’s paragraph is composed from.',
    grade: 'Illustrative',
    checked: 'Restated 7 Aug 2026',
    note: 'Constructed on the same terms. The access-versus-use distinction is real and is the reason the case exists; the numbers are made for the exercise.',
  },
  {
    claim:
      'Cash transfer income gains decaying enough to roughly triple the cost per lasting doubling.',
    where: 'Slate A, case 1, and Round 3, which replays it and publishes a five-year threshold.',
    grade: 'Illustrative',
    checked: 'Restated 7 Aug 2026',
    note: 'Not named in the issue that cleared the other two, and cleared with them anyway: it is the same object, and grading an identical third differently would make the grade mean an issue number rather than the state of the figure.',
  },
  {
    claim: 'Transfer check: 41,000 doses at about $1.90 per dose, reported as $1.90 per child.',
    where: 'The transfer check, in its summary and in the first of its four options.',
    grade: 'Illustrative',
    checked: 'Restated 7 Aug 2026',
    note: 'The seventh case, and the last to get a row. The gap between doses delivered and children completing a three-dose course is a real measurement problem; the programme, the country, the dose count and the unit cost are written for the exercise.',
  },
  {
    claim:
      'The landing page’s specimen readout: three pairs of bars showing the shape of a result.',
    where: 'The landing page, between the opening and the section on what the instrument measures.',
    grade: 'Illustrative',
    checked: 'Added 10 Aug 2026',
    note: 'Invented, and the caption says so in those words: no run produced them, n is zero, nothing has been collected from anyone. Unlike the case figures these approximate nothing — they are a drawing of the readout, for a reader who will not start the instrument. The last claim on the site to get a row, because every earlier pass ran against the instrument and these six numbers are markup in a hand-written page. The caption they rest on is tested by reading the page itself, since it has no content module to read instead.',
  },
  {
    claim: 'Students with ChatGPT practised better and scored worse on exams taken without it.',
    where: 'The long essay, in its empirical section.',
    grade: 'Flagged',
    checked: '7 Aug 2026',
    note: 'Stated as a finding, with a population and a direction, and cited nowhere on this site. A reader who wants to check it has nothing to check it against. Not illustrative: it is either true and uncited, or it is not true.',
  },
  {
    claim:
      'Endoscopists’ independent detection rates declined after AI-assisted screening was withdrawn.',
    where: 'The long essay, in its empirical section.',
    grade: 'Flagged',
    checked: '7 Aug 2026',
    note: 'As above, and carrying more weight than the others: it is the claim the essay uses to move the argument from students to practitioners.',
  },
  {
    claim: 'Developers using AI coding assistants took longer while believing they were faster.',
    where: 'The long essay, in its empirical section.',
    grade: 'Flagged',
    checked: '7 Aug 2026',
    note: 'As above. The belief-versus-outcome gap is this project’s own thesis in miniature, which is a reason to be more careful with it rather than less.',
  },
  {
    claim: 'The long-run income effect of deworming is contested.',
    where: 'Slate A, case 3.',
    grade: 'Secondary',
    checked: '30 Jul 2026',
    note: 'A real and ongoing dispute in development economics, stated on the page as a dispute rather than as a result. A pin is needed only if a version quotes an effect size; the case does supply a lifetime income gain factor as the assisted round’s opening position, which the disclosure covers.',
  },
  {
    claim: 'The mortality benefit of vitamin A supplementation scales with baseline deficiency.',
    where: 'Slate B, case 1, and Round 3, which replays it.',
    grade: 'Secondary',
    checked: '30 Jul 2026',
    note: 'Directionally well established and quantitatively illustrative. The case turns on the distinction rather than the magnitude, and its Round 3 text quotes none — though its supplied deaths-averted figure is a magnitude, and now reads as one on a page rather than in a data file.',
  },
  {
    claim:
      'Clio as Anthropic’s published system for privacy-preserving analysis of real-world usage.',
    where: 'Nowhere in this build. It was on the consent screen and in protocol section 1.',
    grade: 'Primary',
    checked: '7 Aug 2026',
    note: 'Anthropic has published on this directly and the row went unpinned for three versions. Rather than cite from memory on the screen where a reader is deciding whether to trust the page about data handling, the rebuild stopped making the claim; the paper is now pinned as well, so both of the exits the issue offered are taken. Reading it narrowed the claim. The row used to say reference standard, and the paper says the technologies underneath Clio are not fundamentally new and that it builds on differential privacy and k-anonymity. Neither the paper nor the research page calls Clio a standard: that word was this site’s, not the source’s.',
  },
  {
    claim:
      'Project Deal: 186 transactions worth just over $4,000, and fairness rated 4.05 against 4.06.',
    where: 'The opening of the long essay, and the companion essay’s paragraph on it.',
    grade: 'Primary available',
    checked: '7 Aug 2026',
    note: 'Anthropic’s own published experiment, and the empirical anchor both essays open on — held from the write-up rather than from a pinned page, which is the condition that produced the corrected row below. It is also the one claim on this site that has already been got wrong once.',
  },
  {
    claim: 'The reflection was served by the pinned model, and the served ID is printed.',
    where: 'The debrief’s reflection, the encoded screen, and protocol section 5.',
    grade: 'Primary',
    checked: 'Every request, once there is an endpoint',
    note: 'The only claim here that verifies itself: the ID comes back in the response body and is printed verbatim beside the response. The whole mechanism now exists — the pin, the endpoint that reads the served ID, and the screen that prints it. None of it has run: the endpoint URL is empty in this build, so nothing has been spent and nothing has been verified. What is left is a one-line change, not more code.',
  },
  {
    claim: 'The contrast and target-size thresholds this build is held to are WCAG 2.2’s.',
    where: 'The stylesheets are written against them; two checks enforce them.',
    grade: 'Primary',
    checked: '7 Aug 2026',
    note: 'The specification itself, not a summary of it: 4.5:1 for text, 3:1 for large text and for non-text that carries information, 24 × 24 for a target and 44 × 44 for the enhanced criterion. Two of this build’s decisions are exemptions the same criterion writes — for pure decoration, and for an inactive control — and an exemption is a claim about what a standard says, which is what put this row here.',
  },
  {
    claim: 'Every contrast ratio in this repository is computed from the palette on every run.',
    where: 'The contrast check, run by the first CI job.',
    grade: 'Primary',
    checked: 'Every run',
    note: 'The second claim here that verifies itself. The hexes are read out of the token file and none is restated, so the ratios cannot describe a palette this build does not have, and a token that appears in no pairing fails the run. The ratios used to live in a comment, where one of them was wrong for three versions.',
  },
  {
    claim: 'Accuracy: the eighteen supported values are unauthored, so the measure is undefined.',
    where: 'The case data, and the accuracy row on the protocol screen.',
    grade: 'Primary available',
    checked: '10 Aug 2026',
    note: 'A row for an absence. The machinery to score a reader against what the evidence supports arrived without the values it would score against, and grading the gap here is what makes authoring one a change that comes through this table. Some should stay unauthored — cash-transfer persistence at five years is disputed, and the case’s own evidence panel says so — so the measure reports its coverage rather than waiting to be complete.',
  },
  {
    claim: 'Project Deal: figures right, the seven-point scale omitted.',
    where: 'The companion essay, corrected. Originally a separate document.',
    grade: 'Corrected',
    checked: '7 Aug 2026',
    note: 'The error that caused this table to exist, and then reproduced on a page of this build: correct numbers with a missing qualifier, which is exactly what a careful read does not catch, because nothing in the sentence looks wrong. Kept as the standing reason for the process.',
  },
] as const satisfies readonly SourceRow[];
