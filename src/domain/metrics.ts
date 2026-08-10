/**
 * The derived measures.
 *
 * This file is the instrument. Everything the reveal screen claims about a run
 * comes from here, so CLAUDE.md rule 7 applies with full force: every function
 * has tests, and no denominator is a literal.
 *
 * That last part is not stylistic. The previous build shipped, and later fixed, a
 * measure that divided by six sliders when there are nine — an arithmetic error in
 * a published figure, caught by a reader rather than by the code. Here every count
 * is derived from the same source as the thing being counted, and the suite runs
 * the same assertions against synthetic slates of other shapes so that
 * re-introducing a literal fails immediately rather than shipping.
 */

import type { AssumptionSpec, Case, Condition, Rec, Slate, Trap } from '../content/types.js';
import { clamp, type Score } from './model.js';

/** Confidence is a single five-point self-rating. 0 means not yet rated. */
export type Confidence = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * What was recorded for one case.
 *
 * Two fields are subtler than they look, and both are load-bearing:
 *
 * - `read` is sticky. It is set when either the model panel or the evidence panel
 *   is opened, and closing a panel never clears it. Re-opening does not
 *   accumulate. The measure is "did this case get looked at", not "how long for".
 *
 * - `touched[k]` is a movement flag, not a value comparison. Dragging a slider and
 *   returning it to where it started still counts as touched, because the
 *   behaviour being observed is the act of interrogating the number.
 */
export interface CaseState {
  readonly modelOpen: boolean;
  readonly evidenceOpen: boolean;
  readonly read: boolean;
  readonly vals: readonly number[];
  readonly touched: readonly boolean[];
  readonly rec: Rec | '';
  readonly recTouched: boolean;
  readonly flagged: boolean;
}

/**
 * What the participant actually chose.
 *
 * Empty until they click, and it never inherits the supplied recommendation. This
 * is the single most consequential distinction in the scoring: a supplied
 * recommendation left standing scores nothing, in this measure or any other,
 * because leaving a default in place is not an observation of what the person
 * decided.
 */
export function ownRec(st: CaseState): Rec | '' {
  return st.recTouched ? st.rec : '';
}

/**
 * What the decision row *shows*.
 *
 * In the assisted round this starts on the supplied recommendation, so the button
 * renders pre-selected. Display only — `ownRec` is what every measure reads.
 */
export function effRec(
  st: CaseState,
  opts: { readonly assisted: boolean; readonly prefill: boolean; readonly suppliedRec: Rec },
): Rec | '' {
  if (st.recTouched) return st.rec;
  if (opts.assisted && opts.prefill) return opts.suppliedRec;
  return '';
}

/**
 * One case that carries a planted error, and where on it.
 *
 * Non-null by construction, which is the point. Every consumer of the traps —
 * `trapVerdicts()` on the debrief, the catch rate below, and the invariants test —
 * walks this rather than indexing `slate.cases` and narrowing `trap` again in three
 * places.
 */
export interface TrappedCase {
  /** Index into the slate's `cases`, so a caller can find the recorded state. */
  readonly index: number;
  readonly case: Case;
  readonly trap: Trap;
}

/**
 * The slate's planted errors, derived from the cases rather than counted anywhere.
 *
 * This is the catch rate's denominator, and rule 7 is why it is a walk rather than
 * a number: a slate that gains a second planted error changes the denominator by
 * gaining it, and no literal has to be found and edited to keep up. It is the same
 * discipline as `sliderCount` below, for the same published reason.
 */
export function trappedCases(slate: Slate): readonly TrappedCase[] {
  return slate.cases.flatMap((c, index) =>
    c.trap === null ? [] : [{ index, case: c, trap: c.trap }],
  );
}

/**
 * The one thing that counts as catching a planted error: moving the figure.
 *
 * Not opening the evidence panel that contains the correction, and not flagging
 * the case. Defined once and read by both consumers — the debrief's branch logic in
 * `trap.ts` and the catch rate below — because two definitions of "caught" is the
 * shape where the paragraph a reader is shown and the number they are counted in
 * can disagree.
 */
export function caughtTrap(st: CaseState, trap: Trap): boolean {
  return st.touched[trap.slider] === true;
}

/**
 * Points available per case in the ambiguity-tolerance measure: one for an
 * explicit uncertainty flag, one for choosing to investigate over a funding call.
 *
 * The protocol screen names the weakness: this conflates declining to decide with
 * deciding to look further, and treats them as equal. It should be two measures
 * until there is evidence they load together.
 */
export const AMBIGUITY_POINTS_PER_CASE = 2;

/** The confidence scale's top value. */
export const CONFIDENCE_SCALE_MAX = 5;

/** Framing autonomy splits evenly between departing and revising. */
export const AUTONOMY_DEPARTURE_WEIGHT = 50;
export const AUTONOMY_DEVIATION_WEIGHT = 50;

/**
 * Where framing autonomy saturates: moving each slider a quarter of its range, on
 * average, counts as full autonomy.
 *
 * An arbitrary constant chosen by eye. It needs calibrating against expert
 * behaviour on the same slates before it means anything, and the protocol screen
 * says so in those words.
 *
 * The prose and the cross-check both arrived with that screen. `method.test.ts`
 * asserts that the page's sentence about "the 0.25 saturation point", and the
 * formula printed beside it, both name this constant — anchored on the whole
 * phrase rather than on the digits, so that tuning this to a value whose string
 * is a prefix of the old one cannot leave the published arithmetic describing
 * something the code no longer does.
 *
 * Until v0.6 this comment claimed that cross-check while neither the test nor the
 * prose existed. That is recorded in `CHANGELOG.md` as a correction rather than
 * quietly made true.
 */
export const AUTONOMY_SATURATION = 0.25;

/**
 * How far one value sits from a target, as a share of that slider's own range.
 *
 * Both distance terms in this file go through here, and that is the point rather
 * than tidiness. The autonomy term measures distance from the *supplied* value and
 * the accuracy term measures distance from the *supported* value, and #30 settled
 * that they normalise the same way: by the slider's own range, so a $2–$7 cost and
 * a 50–95% rate contribute comparably and neither dominates by unit. A second
 * convention would make the two numbers look like the same kind of quantity while
 * being different ones. Sharing the function is what stops that drifting apart —
 * a comment saying "same as above" would not have.
 *
 * Capped at 1 so one value parked at the far end of its range cannot outweigh
 * everything else, and `null` for a zero-width slider, which has no scale to be a
 * share of.
 */
function normalisedDistance(value: number, target: number, spec: AssumptionSpec): number | null {
  const span = spec.max - spec.min;
  if (span <= 0) return null;
  return Math.min(1, Math.abs(value - target) / span);
}

export interface Metrics {
  /** Cases where a panel was opened, as a share of cases. */
  readonly engagement: Score;
  /** Sliders moved off their starting value, as a share of all sliders. */
  readonly range: Score;
  /** Flags plus investigate calls, as a share of the points available. */
  readonly amb: Score;
  /**
   * Departure from the supplied frame.
   *
   * `null` — never 0 — in the control round, where no frame was supplied and the
   * measure is therefore undefined. The reveal screen renders it as a hatched bar
   * reading "n/a" and says it is reported rather than imputed. An earlier version
   * imputed it from an invented constant; that was removed in v0.3.
   */
  readonly auto: Score | null;
  /**
   * How close the final values came to what the evidence supports.
   *
   * Higher is more accurate, so it reads the same direction as everything beside
   * it. Built from the mean normalised distance between each final value and its
   * supported value (#30), expressed as its complement: 100 is on the supported
   * value throughout, 0 is a full slider-range away on every assumption.
   *
   * `null` — never 0 — when no assumption in play carries a supported value, which
   * is currently every run, because rule 6 forbids inventing the figures and none
   * has been authored yet. Zero would say the reader was maximally wrong. Null says
   * the instrument has no opinion, which is the true thing.
   *
   * This is the measure that lets the design lose. Every other measure here scores
   * how someone worked; this one scores whether they were right. Without it,
   * reduced scrutiny of an estimate that was already correct is indistinguishable
   * from drift, and no result could count against the hypothesis.
   *
   * Deliberately NOT in the `actual` composite — see the note at the composite.
   */
  readonly accuracy: Score | null;
  /**
   * Planted errors whose misstated figure the reader moved, as a share of the
   * planted errors on the slate.
   *
   * `null` — never 0 — in the control round, on exactly framing autonomy's grounds:
   * no estimate is supplied there, so no figure is misstated and there is nothing to
   * catch. Zero would say the reader missed something that was never set. Also
   * `null` where the slate carries no planted error at all, which is the accuracy
   * measure's rule for the same reason.
   *
   * Reported here and deliberately not drawn as a bar on the debrief. One planted
   * error is authored per slate, so for a single reader this is one observation, and
   * a bar reading 0 or 100 off one observation looks like a rate. The debrief prints
   * one paragraph per planted error instead, which says what was actually done.
   *
   * Deliberately NOT in the `actual` composite — see the note at the composite.
   */
  readonly catchRate: Score | null;
  /** The self-rating, rescaled. */
  readonly perceived: Score;
  /** The behavioural composite. Excludes `auto`, which is undefined in one round. */
  readonly actual: Score;
  /** perceived − actual. Not clamped: the sign is the interesting part. */
  readonly gap: number;
  readonly opens: number;
  readonly moved: number;
  readonly flags: number;
  readonly investigate: number;
  readonly recsMade: number;
}

/** Total sliders on a slate, derived from the slate rather than assumed. */
export function sliderCount(slate: Slate): number {
  return slate.cases.reduce((total, c) => total + c.a.length, 0);
}

export function metrics(input: {
  readonly data: readonly CaseState[];
  readonly slate: Slate;
  readonly condition: Condition;
  readonly confidence: Confidence;
}): Metrics {
  const { data, slate, condition, confidence } = input;
  const PERCENT = 100;

  const caseCount = slate.cases.length;
  const sliders = sliderCount(slate);

  const opens = data.filter((x) => x.read).length;
  const moved = data.reduce((t, x) => t + x.touched.filter(Boolean).length, 0);
  const flags = data.filter((x) => x.flagged).length;
  const own = data.map((st) => ownRec(st));
  const investigate = own.filter((r) => r === 'investigate').length;

  const engagement = clamp((opens / caseCount) * PERCENT);
  const range = clamp((moved / sliders) * PERCENT);
  const amb = clamp(((flags + investigate) / (caseCount * AMBIGUITY_POINTS_PER_CASE)) * PERCENT);

  let auto: Score | null = null;
  if (condition === 'assisted') {
    const departures = data.filter((x, i) => {
      const supplied = slate.cases[i]?.rec;
      return x.recTouched && x.rec !== supplied;
    }).length;

    let deviation = 0;
    let counted = 0;
    data.forEach((x, i) => {
      x.vals.forEach((v, k) => {
        const sp = slate.cases[i]?.a[k];
        if (sp === undefined) return;
        const d = normalisedDistance(v, sp.provided, sp);
        if (d === null) return;
        deviation += d;
        counted += 1;
      });
    });
    const devNorm = counted > 0 ? deviation / counted : 0;

    auto = clamp(
      AUTONOMY_DEPARTURE_WEIGHT * (departures / caseCount) +
        AUTONOMY_DEVIATION_WEIGHT * Math.min(1, devNorm / AUTONOMY_SATURATION),
    );
  }

  // Accuracy, over the subset of assumptions that carry a supported value.
  //
  // Defined in both rounds, unlike `auto`: being right does not depend on having
  // been given a frame. The denominator counts what it actually summed rather than
  // the slider total, so an unauthored `supported` lowers coverage instead of
  // silently scoring as a perfect hit — which is what a `?? 0` here would have
  // done, and it would have read as flawless accuracy across the board.
  let distance = 0;
  let scored = 0;
  data.forEach((x, i) => {
    x.vals.forEach((v, k) => {
      const sp = slate.cases[i]?.a[k];
      if (sp === undefined || sp.supported === null) return;
      const d = normalisedDistance(v, sp.supported, sp);
      if (d === null) return;
      distance += d;
      scored += 1;
    });
  });
  // Null rather than 0 where nothing was scorable. `scored` is derived from the
  // slate by construction — it counts the terms that were summed — so rule 7's ban
  // on a written denominator holds here without a literal to get wrong.
  const accuracy: Score | null = scored > 0 ? clamp(PERCENT - (distance / scored) * PERCENT) : null;

  // The catch rate, over the planted errors the slate actually carries.
  //
  // Assisted round only. In the control round nothing is supplied, so no figure
  // misstates anything and there is no planted error in play — `null`, not 0, for the
  // same reason framing autonomy is. `trapped.length` is the denominator and it is a
  // walk of the slate rather than a number, so authoring a second planted error moves
  // it without anyone editing a literal (rule 7).
  const trapped = trappedCases(slate);
  let catchRate: Score | null = null;
  if (condition === 'assisted' && trapped.length > 0) {
    const caught = trapped.filter((t) => {
      const st = data[t.index];
      return st !== undefined && caughtTrap(st, t.trap);
    }).length;
    catchRate = clamp((caught / trapped.length) * PERCENT);
  }

  const perceived = clamp((confidence / CONFIDENCE_SCALE_MAX) * PERCENT);

  // The composite averages over the measures that are defined in both rounds, so
  // adding one here changes the divisor automatically. That convenience is also a
  // hazard, so both exclusions are stated:
  //
  //   `auto` is out because it does not exist in the control round.
  //
  //   `accuracy` is out on purpose, and must stay out (#30). Every term here scores
  //   how someone worked; accuracy scores whether they were right. Averaging the two
  //   collapses the distinction the whole instrument rests on — a reader who barely
  //   looked but happened to land on the supported values would post a healthy
  //   `actual`, and the gap against `perceived` would stop meaning anything. They are
  //   reported side by side and never summed.
  //
  //   `catchRate` is out on both counts at once (#31): it does not exist in the
  //   control round, and it is a normative measure rather than a trace. It is also the
  //   coarsest number here — one observation per reader today — so averaging it in
  //   would let a single coin flip move the composite the gap measure is read against.
  const composite = [engagement, range, amb];
  const actual = clamp(composite.reduce((a, b) => a + b, 0) / composite.length);

  return {
    engagement,
    range,
    amb,
    auto,
    accuracy,
    catchRate,
    perceived,
    actual,
    gap: perceived - actual,
    opens,
    moved,
    flags,
    investigate,
    recsMade: own.filter((r) => r !== '').length,
  };
}
