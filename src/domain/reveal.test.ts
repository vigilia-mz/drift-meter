import { describe, expect, it } from 'vitest';
import type { Metrics } from './metrics.js';
import { clamp } from './model.js';
import {
  AUTONOMY_CLOSING_THRESHOLD,
  closingKey,
  GAP_THRESHOLD,
  gapBand,
  HEADLINE_THRESHOLD,
  headlineFor,
} from './reveal.js';

function m(over: Partial<Metrics> = {}): Metrics {
  return {
    engagement: clamp(50),
    range: clamp(50),
    amb: clamp(50),
    auto: clamp(50),
    accuracy: null,
    catchRate: null,
    perceived: clamp(50),
    actual: clamp(50),
    gap: 0,
    opens: 0,
    moved: 0,
    flags: 0,
    investigate: 0,
    recsMade: 0,
    ...over,
  };
}

describe('headlineFor', () => {
  it('says the reader looked less when either measure dropped under assistance', () => {
    expect(headlineFor(m({ engagement: clamp(0) }), m({ engagement: clamp(50) }))).toBe(
      'lookedLess',
    );
    expect(headlineFor(m({ range: clamp(0) }), m({ range: clamp(50) }))).toBe('lookedLess');
  });

  it('is strict at the threshold, so a four-point difference is not a finding', () => {
    // One person, six cases. Calling a delta of exactly four a difference would be
    // the kind of overclaim this project is about.
    const a = m({ engagement: clamp(50), range: clamp(50) });
    const atThreshold = m({
      engagement: clamp(50 + HEADLINE_THRESHOLD),
      range: clamp(50),
    });
    expect(headlineFor(a, atThreshold)).toBe('twoVersions');

    const justOver = m({ engagement: clamp(50 + HEADLINE_THRESHOLD + 1), range: clamp(50) });
    expect(headlineFor(a, justOver)).toBe('lookedLess');
  });

  it('requires both measures to move together before crediting held ground', () => {
    const a = m({ engagement: clamp(60), range: clamp(60) });

    const bothDown = m({ engagement: clamp(50), range: clamp(50) });
    expect(headlineFor(a, bothDown)).toBe('heldGround');

    // Only one moved: not enough.
    const oneDown = m({ engagement: clamp(50), range: clamp(58) });
    expect(headlineFor(a, oneDown)).toBe('twoVersions');
  });

  it('falls back to the neutral headline when nothing moved', () => {
    expect(headlineFor(m(), m())).toBe('twoVersions');
  });
});

describe('gapBand', () => {
  it('names an over-confident gap only past the threshold', () => {
    expect(gapBand(GAP_THRESHOLD)).toBe('aligned');
    expect(gapBand(GAP_THRESHOLD + 1)).toBe('over');
  });

  it('names the self-critical direction, which is the rarer one', () => {
    expect(gapBand(-GAP_THRESHOLD)).toBe('aligned');
    expect(gapBand(-GAP_THRESHOLD - 1)).toBe('under');
  });

  it('treats a small gap in either direction as agreement', () => {
    for (const g of [0, 3, -3, 8, -8]) expect(gapBand(g)).toBe('aligned');
  });
});

describe('closingKey', () => {
  it('does not tell a control-round reader they delegated a model that was never supplied', () => {
    // In JavaScript `null < 40` is true. A naive comparison would print the
    // delegation paragraph for every reader in the round where the measure does
    // not exist.
    expect(closingKey(null)).toBe('keptAuthorship');
  });

  it('names delegation below the threshold and authorship at or above it', () => {
    expect(closingKey(clamp(AUTONOMY_CLOSING_THRESHOLD - 1))).toBe('delegatedModel');
    expect(closingKey(clamp(AUTONOMY_CLOSING_THRESHOLD))).toBe('keptAuthorship');
    expect(closingKey(clamp(0))).toBe('delegatedModel');
    expect(closingKey(clamp(100))).toBe('keptAuthorship');
  });

  it('accepts a zero score as a real value rather than as absence', () => {
    // 0 and null mean different things here: nothing was departed from, versus
    // there was nothing to depart from.
    const zero = clamp(0);
    expect(closingKey(zero)).toBe('delegatedModel');
    expect(closingKey(null)).toBe('keptAuthorship');
  });
});
