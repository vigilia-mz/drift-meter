import { describe, expect, it } from 'vitest';
import { SLATES } from '../content/slates.js';
import type { Case } from '../content/types.js';
import { calc, clamp, dominantSet, fmtAssump, intervalFor, mid, money } from './model.js';

/**
 * Expected values in this file were derived from an independent re-implementation
 * of the formulas, not from the code under test. Where a case sits on a rounding
 * boundary that is called out explicitly, because JavaScript rounds half away from
 * zero and a "tidier" implementation using banker's rounding would silently move
 * the slider's starting position and therefore move the measures.
 */

/**
 * Assert that a set of slider values is one a reader could actually reach on this
 * case — every value in range and on its step grid — and return it.
 *
 * The two `money` boundary tests below claim a formatting quirk is visible to a
 * reader rather than merely arithmetically possible. That claim is only worth
 * making if the inputs are reachable, so it is checked against the slate instead
 * of asserted in a comment. Widening a slider's range or changing its step will
 * fail here rather than quietly making the comment wrong, which is how the
 * previous version of that comment came to be wrong.
 */
function onStep(c: Case, vals: readonly number[]): readonly number[] {
  const TOLERANCE = 1e-6;
  vals.forEach((v, k) => {
    const sp = c.a[k]!;
    const where = `${c.org} · ${sp.label}`;
    expect(v, `${where} at or above min`).toBeGreaterThanOrEqual(sp.min);
    expect(v, `${where} at or below max`).toBeLessThanOrEqual(sp.max);
    const steps = (v - sp.min) / sp.step;
    expect(Math.abs(steps - Math.round(steps)), `${where} on step`).toBeLessThan(TOLERANCE);
  });
  return vals;
}

describe('calc', () => {
  it('computes cost per outcome as cost / (rate × yield)', () => {
    // Slate A's bednet case at its supplied values. This single figure exercises
    // the cost model, the slate wiring and the formatter at once.
    expect(calc([2, 85, 0.0006])).toBeCloseTo(3921.5686, 3);
    expect(money(calc([2, 85, 0.0006]))).toBe('$3,922');
  });

  it('matches the supplied headline of every case', () => {
    const expected: Record<string, string> = {
      'Direct cash transfers': '$3,778',
      'Insecticide-treated bednets': '$3,922',
      'School-based deworming': '$0.50',
      'Vitamin A supplementation': '$917',
      'Maternal & newborn health package': '$13,333',
      'Safe-water chlorination': '$2,344',
    };
    for (const slate of [SLATES.A, SLATES.B]) {
      for (const c of slate.cases) {
        const supplied = c.a.map((sp) => sp.provided);
        expect(money(calc(supplied)), c.org).toBe(expected[c.org]);
      }
    }
  });

  it('rejects a values array that is not three long', () => {
    expect(() => calc([1, 2])).toThrow();
  });
});

describe('mid', () => {
  // Every one of the eighteen sliders, so a change to the snapping logic cannot
  // pass unnoticed.
  const golden: Record<string, readonly number[]> = {
    'Direct cash transfers': [1050, 40, 0.45],
    'Insecticide-treated bednets': [4.5, 73, 0.0006],
    'School-based deworming': [1.75, 33, 3.0],
    'Vitamin A supplementation': [2.5, 65, 0.0013],
    'Maternal & newborn health package': [75, 58, 0.0035],
    'Safe-water chlorination': [3.5, 53, 0.0006],
  };

  it('snaps the midpoint of all eighteen sliders to the expected value', () => {
    for (const slate of [SLATES.A, SLATES.B]) {
      for (const c of slate.cases) {
        const got = c.a.map((sp) => mid(sp));
        expect(got, c.org).toEqual(golden[c.org]);
      }
    }
  });

  it('rounds half away from zero, not to even', () => {
    // 72.5 must become 73, not 72. Banker's rounding would give 72 and would move
    // the control round's starting point on four of the eighteen sliders.
    expect(mid({ min: 50, max: 95, step: 1 })).toBe(73);
    expect(mid({ min: 30, max: 85, step: 1 })).toBe(58);
    expect(mid({ min: 25, max: 80, step: 1 })).toBe(53);
    expect(mid({ min: 5, max: 60, step: 1 })).toBe(33);
  });

  it('survives a step small enough to expose floating-point error', () => {
    // raw = 0.00055, which is 5.5 steps. The toFixed(6) guard is what keeps this
    // from coming out as 0.0006000000000000001.
    expect(mid({ min: 0.0003, max: 0.0008, step: 0.0001 })).toBe(0.0006);
    expect(mid({ min: 0.0005, max: 0.002, step: 0.0001 })).toBe(0.0013);
  });

  it('clamps a snapped value back inside the range', () => {
    // A step that does not divide the range can snap past the top.
    expect(mid({ min: 0, max: 10, step: 7 })).toBeLessThanOrEqual(10);
    expect(mid({ min: 0, max: 10, step: 7 })).toBeGreaterThanOrEqual(0);
  });

  it('always lands within the slider range, for any range and step', () => {
    for (const slate of [SLATES.A, SLATES.B]) {
      for (const c of slate.cases) {
        for (const sp of c.a) {
          const m = mid(sp);
          expect(m).toBeGreaterThanOrEqual(sp.min);
          expect(m).toBeLessThanOrEqual(sp.max);
        }
      }
    }
  });
});

describe('money', () => {
  it('shows cents below ten', () => {
    expect(money(0.5)).toBe('$0.50');
    expect(money(9.99)).toBe('$9.99');
  });

  it('rounds to whole dollars from ten', () => {
    expect(money(10)).toBe('$10');
    expect(money(999)).toBe('$999');
  });

  it('adds a thousands separator from a thousand', () => {
    expect(money(1000)).toBe('$1,000');
    expect(money(35000)).toBe('$35,000');
    expect(money(3921.5686)).toBe('$3,922');
  });

  it('prints a value that rounds up to a thousand without a separator', () => {
    // A faithful quirk, not a bug. The branch order is `< 1000` before the
    // separator branch, so anything in [999.5, 1000) is routed to the plain
    // whole-dollar format and only then rounded — giving "$1000".
    //
    // This comment said the window was unreachable from the six real cases until
    // v0.6, when the claim was checked instead of repeated. It is reachable, and
    // the assertion below reaches it through the real slate rather than through a
    // literal, so that a slider edit which moved it out of reach would fail here
    // instead of quietly making this comment wrong again. The behaviour is still
    // deliberate; "fixing" it would change a published formatter.
    expect(money(999.6)).toBe('$1000');
    expect(money(999.4)).toBe('$999');
    const vitaminA = SLATES.B.cases[0]; // Slate B, case 1
    expect(money(calc(onStep(vitaminA, [1.2, 80, 0.0015])))).toBe('$1000');
  });

  it('prints a value that rounds up to ten with cents, since the cents branch is chosen first', () => {
    // The same branch-then-round shape as the thousand boundary, one decade down
    // and louder, because the two forms differ by more than a comma: [9.995, 10)
    // takes the cents branch and prints "$10.00", while 10 itself prints "$10".
    // Reachable from Slate A's deworming case, and reached here through the slate.
    expect(money(9.996)).toBe('$10.00');
    const deworming = SLATES.A.cases[2]; // Slate A, case 3
    expect(money(calc(onStep(deworming, [0.7, 7, 1])))).toBe('$10.00');
    expect(money(10)).toBe('$10');
  });

  it('refuses to print a number for a non-finite or non-positive result', () => {
    // A division that produced Infinity is not a cheap intervention, and printing
    // one would be exactly the kind of plausible-looking figure this project is
    // about.
    for (const bad of [0, -5, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN]) {
      expect(money(bad)).toBe('n/a');
    }
  });
});

describe('fmtAssump', () => {
  it('formats by unit at the declared precision', () => {
    expect(fmtAssump({ unit: '$', dp: 2 }, 2)).toBe('$2.00');
    expect(fmtAssump({ unit: '%', dp: 0 }, 85)).toBe('85%');
    expect(fmtAssump({ unit: '', dp: 4 }, 0.0006)).toBe('0.0006');
  });

  it('does not add a thousands separator', () => {
    // This is the test that catches a well-meaning "improvement" routing this
    // through money(). An assumption is an input the reader sets, not a result
    // being reported, and the two are formatted differently on purpose.
    expect(fmtAssump({ unit: '$', dp: 0 }, 1400)).toBe('$1400');
    expect(money(1400)).toBe('$1,400');
  });
});

describe('clamp', () => {
  it('bounds to 0..100 and rounds', () => {
    expect(clamp(-20)).toBe(0);
    expect(clamp(0)).toBe(0);
    expect(clamp(33.4)).toBe(33);
    expect(clamp(66.6)).toBe(67);
    expect(clamp(100)).toBe(100);
    expect(clamp(140)).toBe(100);
  });
});

describe('dominantSet', () => {
  // Widest multiplicative swing decides which assumption moves the answer most.
  const expected: Record<string, readonly number[]> = {
    'Direct cash transfers': [2],
    'Insecticide-treated bednets': [0],
    'School-based deworming': [1],
    'Vitamin A supplementation': [0, 2], // a genuine tie
    'Maternal & newborn health package': [2],
    'Safe-water chlorination': [0],
  };

  it('names the dominant assumption of every case', () => {
    for (const slate of [SLATES.A, SLATES.B]) {
      for (const c of slate.cases) {
        expect(dominantSet(c), c.org).toEqual(expected[c.org]);
      }
    }
  });

  it('returns a tie rather than breaking it silently', () => {
    // Vitamin A: cost swings 4x and yield swings 4x. Naming one winner would
    // assert a precision the numbers do not have.
    expect(dominantSet(SLATES.B.cases[0])).toHaveLength(2);
  });

  it("includes a ratio sitting exactly on the tie tolerance, since the test is '>='", () => {
    const c = {
      ...SLATES.A.cases[0],
      a: [
        { label: 'a', unit: '' as const, dp: 0, min: 1, max: 100, step: 1, provided: 1 },
        { label: 'b', unit: '' as const, dp: 0, min: 1, max: 95, step: 1, provided: 1 },
        { label: 'c', unit: '' as const, dp: 0, min: 1, max: 2, step: 1, provided: 1 },
      ] as const,
    };
    // 95 is exactly 0.95 × 100, so it ties rather than losing.
    expect(dominantSet(c)).toEqual([0, 1]);
  });

  it('always returns at least one index', () => {
    for (const slate of [SLATES.A, SLATES.B]) {
      for (const c of slate.cases) {
        expect(dominantSet(c).length).toBeGreaterThan(0);
      }
    }
  });
});

describe('intervalFor', () => {
  it('spans cheapest to dearest across the full plausible range', () => {
    // Cheapest cost against highest rate and yield; dearest, the opposite corner.
    expect(intervalFor(SLATES.A.cases[0])).toBe('$1,667 – $35,000');
  });

  it('uses an en dash with single spaces', () => {
    expect(intervalFor(SLATES.A.cases[0])).toMatch(/ – /);
    expect(intervalFor(SLATES.A.cases[0])).not.toMatch(/ - /);
  });

  it('produces an interval containing the supplied point estimate', () => {
    // Rule 2's whole claim is that the supplied point estimate sits inside a much
    // wider honest range. If that ever stopped being true the rule would be
    // misrepresenting the case.
    for (const slate of [SLATES.A, SLATES.B]) {
      for (const c of slate.cases) {
        const point = calc(c.a.map((sp) => sp.provided));
        const PERCENT = 100;
        const lo = c.a[0].min / ((c.a[1].max / PERCENT) * c.a[2].max);
        const hi = c.a[0].max / ((c.a[1].min / PERCENT) * c.a[2].min);
        expect(point, c.org).toBeGreaterThanOrEqual(lo);
        expect(point, c.org).toBeLessThanOrEqual(hi);
      }
    }
  });
});
