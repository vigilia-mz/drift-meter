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

import type { Condition, Rec, Slate } from '../content/types.js';
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
        const span = sp.max - sp.min;
        if (span > 0) {
          deviation += Math.min(1, Math.abs(v - sp.provided) / span);
          counted += 1;
        }
      });
    });
    const devNorm = counted > 0 ? deviation / counted : 0;

    auto = clamp(
      AUTONOMY_DEPARTURE_WEIGHT * (departures / caseCount) +
        AUTONOMY_DEVIATION_WEIGHT * Math.min(1, devNorm / AUTONOMY_SATURATION),
    );
  }

  const perceived = clamp((confidence / CONFIDENCE_SCALE_MAX) * PERCENT);

  // The composite averages over the measures that are defined in both rounds, so
  // adding one here changes the divisor automatically. `auto` is excluded because
  // it does not exist in the control round.
  const composite = [engagement, range, amb];
  const actual = clamp(composite.reduce((a, b) => a + b, 0) / composite.length);

  return {
    engagement,
    range,
    amb,
    auto,
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
