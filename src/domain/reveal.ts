/**
 * The debrief's thresholds.
 *
 * The reveal screen chooses between a few authored sentences based on how the two
 * rounds compare. The thresholds are small integers chosen by eye, like the
 * autonomy saturation constant, and they are named here rather than buried in a
 * conditional so that they can be tested and argued with.
 *
 * These return keys, not sentences. The sentences live in src/content.
 */

import type { Metrics } from './metrics.js';
import type { Score } from './model.js';

/**
 * How much of a difference between rounds counts as a difference at all.
 *
 * Comparisons are strict: a delta of exactly this much is *not* enough. With one
 * person on six cases, calling a 4-point difference a finding would be the kind
 * of overclaim this project is about.
 */
export const HEADLINE_THRESHOLD = 4;

/** How far confidence must run ahead of behaviour before the gap is named. */
export const GAP_THRESHOLD = 8;

/** Below this, the closing paragraph says the model was delegated even if the decision was not. */
export const AUTONOMY_CLOSING_THRESHOLD = 40;

export type HeadlineKey = 'lookedLess' | 'heldGround' | 'twoVersions';

/**
 * Which headline the debrief opens with.
 *
 * `u` is the control round, `a` the supplied-estimate round, so a positive delta
 * means the reader did more when no estimate was supplied.
 */
export function headlineFor(a: Metrics, u: Metrics): HeadlineKey {
  const dEngagement = u.engagement - a.engagement;
  const dRange = u.range - a.range;

  if (dEngagement > HEADLINE_THRESHOLD || dRange > HEADLINE_THRESHOLD) {
    return 'lookedLess';
  }
  // Both measures have to move together before claiming they held their ground.
  if (dEngagement < -HEADLINE_THRESHOLD && dRange < -HEADLINE_THRESHOLD) {
    return 'heldGround';
  }
  return 'twoVersions';
}

export type GapBand = 'over' | 'under' | 'aligned';

/** Whether confidence ran ahead of, behind, or level with the behavioural composite. */
export function gapBand(gap: number): GapBand {
  if (gap > GAP_THRESHOLD) return 'over';
  if (gap < -GAP_THRESHOLD) return 'under';
  return 'aligned';
}

export type ClosingKey = 'delegatedModel' | 'keptAuthorship';

/**
 * Which closing paragraph the debrief ends on.
 *
 * Note the explicit null check. In JavaScript `null < 40` is true, so a naive
 * comparison would tell every control-round reader that they had delegated the
 * model — in the round where the measure does not exist.
 */
export function closingKey(auto: Score | null): ClosingKey {
  if (auto === null) return 'keptAuthorship';
  return auto < AUTONOMY_CLOSING_THRESHOLD ? 'delegatedModel' : 'keptAuthorship';
}
