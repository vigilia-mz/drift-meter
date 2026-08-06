/**
 * The cost model and its formatting.
 *
 * Pure, synchronous, no DOM. Every function here feeds a number the reader sees,
 * so every function here has tests (CLAUDE.md rule 7).
 *
 * The arithmetic is transcribed from the original build character for character.
 * It is deliberately *not* tidied: `mid()` snaps through `toFixed(6)` and its
 * results at a step of 0.0001 sit on rounding boundaries, so "simplifying" it
 * would silently move slider start positions and therefore move the measures.
 */

import type { AssumptionSpec, Case } from '../content/types.js';

/** A measure expressed 0..100. Branded so it cannot be confused with a raw count. */
export type Score = number & { readonly __score: unique symbol };

/** Cost per outcome: cost / (rate × yield). */
export function calc(vals: readonly number[]): number {
  const [cost, ratePercent, perUnit] = vals;
  if (cost === undefined || ratePercent === undefined || perUnit === undefined) {
    throw new Error('calc expects three assumption values');
  }
  const PERCENT = 100;
  return cost / ((ratePercent / PERCENT) * perUnit);
}

/**
 * The midpoint of a slider's plausible range, snapped to its step.
 *
 * This is where the control round's sliders start. The page labels it as an
 * arbitrary starting point rather than a suggestion, and the protocol screen
 * names the resulting asymmetry as a threat to validity: moving off an arbitrary
 * midpoint is a different act from moving off an authoritative number, and it
 * inflates evaluative range in the control round.
 */
export function mid(sp: Pick<AssumptionSpec, 'min' | 'max' | 'step'>): number {
  const HALF = 2;
  const FLOAT_GUARD = 6;
  const raw = (sp.min + sp.max) / HALF;
  const snapped = Math.round(raw / sp.step) * sp.step;
  return Math.max(sp.min, Math.min(sp.max, parseFloat(snapped.toFixed(FLOAT_GUARD))));
}

/**
 * Format a computed cost figure.
 *
 * `n/a` rather than a number for anything non-finite or non-positive: a division
 * that produced Infinity is not a cheap intervention, and printing one would be
 * exactly the kind of plausible-looking figure this project is about.
 */
export function money(n: number): string {
  const CENTS_BELOW = 10;
  const THOUSAND = 1000;
  const CENTS_DP = 2;
  if (!Number.isFinite(n) || n <= 0) return 'n/a';
  if (n < CENTS_BELOW) return '$' + n.toFixed(CENTS_DP);
  if (n < THOUSAND) return '$' + String(Math.round(n));
  return '$' + Math.round(n).toLocaleString('en-US');
}

/**
 * Format an assumption's own value.
 *
 * Note this does *not* route through `money()`: a cost-per-household of 1400
 * prints as `$1400`, without a thousands separator, because it is an input the
 * reader is setting rather than a result being reported. Making these agree would
 * look like a tidy-up and would change the page.
 */
export function fmtAssump(sp: Pick<AssumptionSpec, 'unit' | 'dp'>, v: number): string {
  if (sp.unit === '$') return '$' + v.toFixed(sp.dp);
  if (sp.unit === '%') return v.toFixed(sp.dp) + '%';
  return v.toFixed(sp.dp);
}

/** Clamp to the 0..100 the measures are reported in. */
export function clamp(n: number): Score {
  const MAX = 100;
  return Math.max(0, Math.min(MAX, Math.round(n))) as Score;
}

/**
 * Tie tolerance when deciding which assumption dominates a case.
 *
 * Anything within 5% of the widest multiplicative swing counts as tied. A tie is
 * then named on the page rather than broken silently, because picking a single
 * winner from a near-dead-heat would be asserting a precision the numbers do not
 * have.
 */
export const DOMINANCE_TIE_TOLERANCE = 0.95;

/**
 * Which assumptions move the answer most, by multiplicative swing across their
 * plausible range.
 *
 * Returns every index within the tie tolerance of the widest, so callers must
 * handle more than one. Slate B's vitamin-A case is a genuine two-way tie, and
 * since that slate replays it in Round 3, a slate-B run always exercises the tie
 * branch.
 */
export function dominantSet(c: Case): readonly number[] {
  const EPSILON = 1e-9;
  const ratios = c.a.map((sp) => sp.max / Math.max(sp.min, EPSILON));
  const top = Math.max(...ratios);
  return ratios
    .map((r, i) => ({ r, i }))
    .filter((o) => o.r >= top * DOMINANCE_TIE_TOLERANCE)
    .map((o) => o.i);
}

/**
 * The full plausible interval for a case, cheapest to dearest.
 *
 * Round 3's Rule 2: lead with a range rather than a point estimate. Cheapest
 * comes from the lowest cost against the highest rate and yield; dearest from the
 * opposite corner.
 */
export function intervalFor(c: Case): string {
  const PERCENT = 100;
  const [cost, rate, yield_] = c.a;
  const lo = cost.min / ((rate.max / PERCENT) * yield_.max);
  const hi = cost.max / ((rate.min / PERCENT) * yield_.min);
  return money(lo) + ' – ' + money(hi);
}
