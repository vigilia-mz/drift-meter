/**
 * Content types.
 *
 * The screen copy and the case data live in typed modules rather than JSON, so
 * the compiler can check that every branch of every union is covered. `TRAP`,
 * for example, is a record keyed by a six-value union that the reveal screen
 * switches on: a missing branch is a build error rather than an empty paragraph
 * on a published page.
 *
 * All of this is prose by function, and is licensed CC BY 4.0 — see REUSE.toml.
 */

/** Which of the two case slates. */
export type SlateId = 'A' | 'B';

/** What the participant can decide about a case. `''` means they have not decided. */
export type Rec = 'fund' | 'investigate' | 'pass';

/** The two conditions every participant meets. */
export type Condition = 'assisted' | 'unassisted';

/**
 * One of the three assumptions underneath a case's estimate.
 *
 * `provided` is the value handed to the participant in the assisted round. In the
 * control round the slider opens at the midpoint of `min`..`max` instead, which
 * the page labels as arbitrary rather than as a suggestion.
 */
export interface AssumptionSpec {
  /** Shown beside the slider. Lower-cased when quoted back in Round 3 prose. */
  readonly label: string;
  /** `'$'`, `'%'`, or `''` for a bare number. */
  readonly unit: '$' | '%' | '';
  /** Decimal places for display. */
  readonly dp: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  /** The value supplied in the assisted round. */
  readonly provided: number;
}

/**
 * One charity cost-effectiveness case.
 *
 * `summary` is the supplied assistant read and appears only in the assisted
 * round. `evidence` is available in both rounds, one click away — which is the
 * point: in the trap cases it contains the fact that undoes the headline.
 */
export interface Case {
  readonly org: string;
  readonly cause: string;
  /** Unit of the computed figure, e.g. 'per death averted'. */
  readonly outcome: string;
  /** The supplied recommendation. Display-only until the participant clicks. */
  readonly rec: Rec;
  readonly summary: string;
  readonly evidence: string;
  /** Round 3, Rule 4: appended to a prefix keyed on the participant's own read. */
  readonly disagree: string;
  /** Round 3, Rule 4: what would move the assistant's view. */
  readonly changeMind: string;
  /** Exactly three, in the order the cost model consumes them. */
  readonly a: readonly [AssumptionSpec, AssumptionSpec, AssumptionSpec];
}

/**
 * A slate of three cases.
 *
 * `trapCase` names the case carrying the planted error and `trapSlider` the
 * assumption that error lives in — the figure whose value decides the answer and
 * which the supplied summary misstates. `r3` names the two cases replayed in
 * Round 3.
 */
export interface Slate {
  readonly id: SlateId;
  readonly name: string;
  readonly trapCase: number;
  readonly trapSlider: number;
  readonly r3: readonly [number, number];
  readonly cases: readonly [Case, Case, Case];
}

/**
 * How the supplied estimate is attributed.
 *
 * The number, the prose and the recommendation are identical across all three
 * arms. Only the authority attached to them varies. That is the whole design:
 * without the human-attributed and unattributed arms, any drop in scrutiny could
 * just as easily be deference to a supplied figure as anything about AI.
 */
export type ArmKey = 'ai' | 'human' | 'unlabelled';

export interface Arm {
  readonly key: ArmKey;
  /** Column heading above the supplied read. */
  readonly label: string;
  /** Phrase used mid-sentence: "an estimate supplied by {who}". */
  readonly who: string;
  /** Name used in the debrief. */
  readonly tag: 'AI-attributed' | 'Human-attributed' | 'Unattributed';
}

/**
 * Which branch of the trap debrief a run earned.
 *
 * Six branches rather than "caught / missed", because the interesting cases are
 * in between: flagging the case without checking the number, leaving the supplied
 * recommendation standing without ever deciding, and opening the panel but
 * changing nothing.
 */
export type TrapBranch =
  'caught' | 'flaggedNotChecked' | 'missFund' | 'missAccepted' | 'missOpened' | 'miss';

export type TrapCopy = Readonly<Record<TrapBranch, string>>;

/** A label/value pair, used by every table on the protocol and process screens. */
export interface LabelledRow {
  readonly label: string;
  readonly value: string;
}

/** One of the four design rules, as a specification rather than a complaint. */
export interface SpecRule {
  readonly number: string;
  readonly title: string;
  readonly body: string;
  /** The learning-science mechanism the rule targets. */
  readonly pedagogy: string;
  /** Which measure it is aimed at. */
  readonly targets: string;
  readonly cost: string;
  readonly falsified: string;
}

/** A registered prediction, with the condition that would falsify it. */
export interface PredictionRow {
  readonly id: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
  readonly claim: string;
  readonly test: string;
}

/** How well a source is pinned. Drives the colour the row is printed in. */
export type SourceGrade = 'Flagged' | 'Secondary' | 'Primary available' | 'Primary' | 'Corrected';

export interface SourceRow {
  readonly claim: string;
  readonly where: string;
  readonly grade: SourceGrade;
  readonly checked: string;
  readonly note: string;
}

export interface ChangelogEntry {
  readonly version: string;
  readonly date: string;
  readonly title: string;
  readonly what: string;
  readonly why: string;
}

/** Recruitment status of a reader the process screen names. */
export type ReviewerStatus = 'Not recruited' | 'Not assigned' | 'Planned before collection';

export interface ReviewerRow {
  readonly role: string;
  readonly status: ReviewerStatus;
  /** The single thing this reader is asked for. */
  readonly brief: string;
  readonly note: string;
}

/** One row of the production-provenance table: where the line sits. */
export interface ProvenanceRow {
  readonly label: string;
  readonly value: string;
  /** Which semantic colour the label takes. */
  readonly tone: 'kept' | 'cut' | 'rule';
}
