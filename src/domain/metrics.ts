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

import type { AssumptionSpec, Condition, Rec, Slate } from '../content/types.js';
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
  const composite = [engagement, range, amb];
  const actual = clamp(composite.reduce((a, b) => a + b, 0) / composite.length);

  return {
    engagement,
    range,
    amb,
    auto,
    accuracy,
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
