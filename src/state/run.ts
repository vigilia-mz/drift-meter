/**
 * What a run holds.
 *
 * The union exists to discharge one specific debt. The original build kept two
 * loose arrays, `dA` and `dU`, and every debrief read them through a non-null
 * assertion — `dA!` — which is a promise made to the compiler and to nobody else.
 * Here the completed run is a variant in which both records are present by
 * construction, so the debrief cannot be written against a run that has not
 * finished.
 *
 * Nothing in this file touches the DOM, reads a URL, or draws a random number.
 * Entropy arrives as a payload, which is what lets the whole thirteen-screen flow
 * be exercised in Vitest with no browser.
 */

import { SLATES, otherSlate } from '../content/slates.js';
import type { Case, Condition, Rec, SlateId, Slate } from '../content/types.js';
import type { Assignment } from '../domain/assignment.js';
import type { CaseState, Confidence } from '../domain/metrics.js';
import { mid } from '../domain/model.js';

/**
 * Which parts of the assignment a URL parameter pinned.
 *
 * Snapshotted onto the run when the draw happens rather than re-read later: a
 * reader who edits the URL mid-run would otherwise get a disclosure describing a
 * draw that never took place.
 */
export interface Forced {
  readonly order: boolean;
  readonly slate: boolean;
  readonly arm: boolean;
}

export const NOTHING_FORCED: Forced = { order: false, slate: false, arm: false };

/** Whether any part of the assignment was pinned rather than drawn. */
export function anyForced(forced: Forced): boolean {
  return forced.order || forced.slate || forced.arm;
}

/**
 * One completed round: exactly what `metrics()` needs, and nothing more.
 *
 * The slate is deliberately absent. It is derived from the assignment and the
 * condition key, so the two cannot disagree — storing it would create a state in
 * which a round's data belongs to a different slate than its scoring.
 */
export interface RoundRecord {
  readonly data: readonly CaseState[];
  readonly confidence: Confidence;
}

/**
 * One of Round 3's replayed cases.
 *
 * A separate type from `CaseState` on purpose. Round 3 replays two of the
 * assisted slate's cases and is excluded from the measures by construction; if it
 * wrote back into the `CaseState[]` the debrief has already reported on, moving a
 * Round 3 slider would raise evaluative range after the reader had been shown it.
 */
export interface R3CaseState {
  /** Index into the assisted slate's `cases`. */
  readonly caseIndex: number;
  readonly vals: readonly number[];
  /** The reader's own read, committed before any figure appears. */
  readonly read: Rec | '';
  /** Index into `case.a` — which assumption the reader thinks drives the answer. */
  readonly driver: number | null;
  /** Monotonic. The figure is absent from the output until this is true. */
  readonly revealed: boolean;
}

/** What every started run carries, whatever stage it has reached. */
interface RunBase {
  readonly assign: Assignment;
  /**
   * Whether the assisted round pre-selects the supplied recommendation.
   *
   * Read by `effRec` on the round screen and by `trapVerdict` on the debrief.
   * Both must read the same stored value: if they disagree, the debrief can
   * report a recommendation "left standing" on a run where nothing was ever
   * pre-selected.
   */
  readonly prefill: boolean;
  readonly forced: Forced;
  /** The consent screen's local-only choice. Gates every path to the endpoint. */
  readonly localOnly: boolean;
}

export type Run =
  | { readonly status: 'not-started' }
  | (RunBase & {
      readonly status: 'active';
      /**
       * Rounds already committed, keyed by condition. Empty during round one.
       *
       * Partial by construction, because mid-run one of the two genuinely does
       * not exist. Nothing reads it except the commit that builds `complete`.
       */
      readonly done: Readonly<Partial<Record<Condition, RoundRecord>>>;
      /** The round being worked on now. */
      readonly working: RoundRecord;
    })
  | (RunBase & {
      readonly status: 'complete';
      /** Both rounds, total rather than partial. This is what replaces `dA!`. */
      readonly rounds: Readonly<Record<Condition, RoundRecord>>;
      /** The transfer check's single pick. Feeds no measure, deliberately. */
      readonly transfer: string | null;
      /** Round 3's two replayed cases, in the order the slate lists them. */
      readonly r3: readonly R3CaseState[];
    });

export const NOT_STARTED: Run = { status: 'not-started' };

/** Which slate a condition runs, derived rather than stored. */
export function slateIdFor(assign: Assignment, condition: Condition): SlateId {
  return condition === 'assisted' ? assign.assistedSlate : otherSlate(assign.assistedSlate);
}

export function slateFor(assign: Assignment, condition: Condition): Slate {
  return SLATES[slateIdFor(assign, condition)];
}

/**
 * A case as it opens, before the reader has touched anything.
 *
 * The two conditions differ in exactly one respect: where the sliders start. The
 * assisted round opens on the supplied values, so its headline figure is the one
 * the estimate asserts. The control round opens at the snapped midpoint of each
 * range, which the screen labels as arbitrary rather than as a suggestion — using
 * `provided` there would leak the supplied figure into the round that exists to
 * withhold it.
 *
 * `rec` is empty and `recTouched` false in BOTH rounds. The assisted round's
 * pre-selected button is produced by `effRec()` at render time and never by
 * seeding this. Seeding it would make `ownRec()` return the assistant's answer as
 * the participant's, which is the single most consequential distinction in the
 * scoring.
 */
export function freshCase(c: Case, condition: Condition): CaseState {
  const vals = condition === 'assisted' ? c.a.map((sp) => sp.provided) : c.a.map((sp) => mid(sp));
  return {
    modelOpen: false,
    evidenceOpen: false,
    read: false,
    vals,
    touched: c.a.map(() => false),
    rec: '',
    recTouched: false,
    flagged: false,
  };
}

/** A whole round as it opens: three untouched cases and no rating yet. */
export function freshRound(assign: Assignment, condition: Condition): RoundRecord {
  return {
    data: slateFor(assign, condition).cases.map((c) => freshCase(c, condition)),
    confidence: 0,
  };
}

/** Round 3's two replayed cases, opening at midpoints with nothing committed. */
export function freshR3(assign: Assignment): readonly R3CaseState[] {
  const slate = SLATES[assign.assistedSlate];
  return slate.r3.map((caseIndex) => ({
    caseIndex,
    vals: slate.cases[caseIndex].a.map((sp) => mid(sp)),
    read: '' as const,
    driver: null,
    revealed: false,
  }));
}
