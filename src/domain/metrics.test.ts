import fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { SLATES } from '../content/slates.js';
import type { AssumptionSpec, Rec, Slate } from '../content/types.js';
import { clamp, mid, type Score } from './model.js';
import {
  AMBIGUITY_POINTS_PER_CASE,
  AUTONOMY_SATURATION,
  type CaseState,
  type Confidence,
  effRec,
  type Metrics,
  metrics,
  ownRec,
  sliderCount,
} from './metrics.js';

// --- helpers -----------------------------------------------------------------

function spec(over: Partial<AssumptionSpec> = {}): AssumptionSpec {
  return { label: 'x', unit: '', dp: 2, min: 0, max: 100, step: 1, provided: 50, ...over };
}

/** A slate of an arbitrary shape, for proving the denominators are derived. */
function synthSlate(caseCount: number, slidersPerCase: number, rec: Rec = 'fund'): Slate {
  const cases = Array.from({ length: caseCount }, (_, i) => ({
    org: `case-${i}`,
    cause: 'c',
    outcome: 'o',
    rec,
    summary: 's',
    evidence: 'e',
    disagree: 'd',
    changeMind: 'm',
    a: Array.from({ length: slidersPerCase }, () => spec()),
  })) as unknown as Slate['cases'];
  return { id: 'A', name: 'synthetic', trapCase: 0, trapSlider: 0, r3: [0, 0], cases };
}

function blank(slate: Slate, over: Partial<CaseState> = {}): CaseState[] {
  return slate.cases.map((c) => ({
    modelOpen: false,
    evidenceOpen: false,
    read: false,
    vals: c.a.map((sp) => sp.provided),
    touched: c.a.map(() => false),
    rec: '',
    recTouched: false,
    flagged: false,
    ...over,
  }));
}

const run = (
  slate: Slate,
  data: readonly CaseState[],
  condition: 'assisted' | 'unassisted' = 'assisted',
  confidence: Confidence = 0,
): Metrics => metrics({ data, slate, condition, confidence });

// --- the bug class this file exists to prevent -------------------------------

describe('denominators are derived from the slate, never written as literals', () => {
  /**
   * The previous build shipped a measure that divided by six sliders when there
   * are nine. It was caught by a reader, not by the code. These cases run the
   * same assertions against slates of other shapes, so a re-introduced literal
   * fails here instead of on a published page.
   */

  it('counts the real slates at nine sliders', () => {
    expect(sliderCount(SLATES.A)).toBe(9);
    expect(sliderCount(SLATES.B)).toBe(9);
  });

  it.each([
    [2, 3],
    [3, 3],
    [5, 2],
    [3, 4],
    [1, 1],
  ])('scores evaluative range correctly on a %i×%i slate', (caseCount, slidersPerCase) => {
    const slate = synthSlate(caseCount, slidersPerCase);
    const total = caseCount * slidersPerCase;
    expect(sliderCount(slate)).toBe(total);

    // Touch exactly one slider on the first case.
    const data = blank(slate);
    data[0] = { ...data[0]!, touched: data[0]!.touched.map((_, i) => i === 0) };

    const PERCENT = 100;
    expect(run(slate, data).range).toBe(clamp((1 / total) * PERCENT));
  });

  it.each([
    [2, 3],
    [3, 3],
    [5, 2],
    [3, 4],
  ])('scores engagement and ambiguity against the case count on a %i×%i slate', (n, k) => {
    const slate = synthSlate(n, k);
    const PERCENT = 100;

    const oneOpen = blank(slate);
    oneOpen[0] = { ...oneOpen[0]!, read: true };
    expect(run(slate, oneOpen).engagement).toBe(clamp((1 / n) * PERCENT));

    const oneFlag = blank(slate);
    oneFlag[0] = { ...oneFlag[0]!, flagged: true };
    expect(run(slate, oneFlag).amb).toBe(clamp((1 / (n * AMBIGUITY_POINTS_PER_CASE)) * PERCENT));
  });

  it('range is 100 exactly when every slider moved, and 0 when none did', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), fc.integer({ min: 1, max: 5 }), (n, k) => {
        const slate = synthSlate(n, k);
        const none = blank(slate);
        const all = blank(slate).map((st) => ({ ...st, touched: st.touched.map(() => true) }));
        return run(slate, none).range === 0 && run(slate, all).range === 100;
      }),
      { numRuns: 60 },
    );
  });

  it('range rises monotonically with the number of sliders touched', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 5 }), fc.integer({ min: 1, max: 4 }), (n, k) => {
        const slate = synthSlate(n, k);
        const total = n * k;
        let previous = -1;
        for (let touchedCount = 0; touchedCount <= total; touchedCount++) {
          const data = blank(slate).map((st, ci) => ({
            ...st,
            touched: st.touched.map((_, si) => ci * k + si < touchedCount),
          }));
          const r: number = run(slate, data).range;
          if (r < previous) return false;
          previous = r;
        }
        return true;
      }),
      { numRuns: 40 },
    );
  });
});

// --- invariants --------------------------------------------------------------

describe('every reported measure is a bounded integer', () => {
  it('holds for arbitrary runs', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            read: fc.boolean(),
            flagged: fc.boolean(),
            recTouched: fc.boolean(),
            rec: fc.constantFrom<Rec>('fund', 'investigate', 'pass'),
            touched: fc.array(fc.boolean(), { minLength: 3, maxLength: 3 }),
          }),
          { minLength: 3, maxLength: 3 },
        ),
        fc.constantFrom<Confidence>(0, 1, 2, 3, 4, 5),
        fc.constantFrom<'assisted' | 'unassisted'>('assisted', 'unassisted'),
        (rows, confidence, condition) => {
          const slate = SLATES.A;
          const data: CaseState[] = slate.cases.map((c, i) => ({
            modelOpen: false,
            evidenceOpen: false,
            read: rows[i]!.read,
            vals: c.a.map((sp) => sp.provided),
            touched: rows[i]!.touched,
            rec: rows[i]!.rec,
            recTouched: rows[i]!.recTouched,
            flagged: rows[i]!.flagged,
          }));
          const m = metrics({ data, slate, condition, confidence });

          for (const key of ['engagement', 'range', 'amb', 'perceived', 'actual'] as const) {
            const v: number = m[key];
            if (!Number.isInteger(v) || v < 0 || v > 100) return false;
          }
          if (m.auto !== null && (!Number.isInteger(m.auto) || m.auto < 0 || m.auto > 100)) {
            return false;
          }
          return true;
        },
      ),
      { numRuns: 300 },
    );
  });
});

// --- framing autonomy --------------------------------------------------------

describe('framing autonomy', () => {
  it('is null, never zero, in the round where no estimate was supplied', () => {
    // Undefined rather than absent: there is no supplied frame to depart from. The
    // reveal screen reports it as undefined instead of imputing it, because an
    // earlier version imputed it from an invented constant and that was retracted
    // in v0.3.
    const m = run(SLATES.B, blank(SLATES.B), 'unassisted');
    expect(m.auto).toBeNull();
    expect(m.auto).not.toBe(0);
  });

  it('is typed as nullable, so it cannot be widened to a plain number', () => {
    expectTypeOf<Metrics['auto']>().toEqualTypeOf<Score | null>();
  });

  it('is 0 when nothing was departed from and nothing moved', () => {
    const data = blank(SLATES.A);
    expect(run(SLATES.A, data).auto).toBe(0);
  });

  it('is 100 when every recommendation departed and every slider moved to an extreme', () => {
    const slate = SLATES.A;
    const data: CaseState[] = slate.cases.map((c, i) => ({
      ...blank(slate)[i]!,
      recTouched: true,
      rec: c.rec === 'fund' ? 'pass' : 'fund',
      vals: c.a.map((sp) => (sp.provided === sp.max ? sp.min : sp.max)),
    }));
    expect(run(slate, data).auto).toBe(100);
  });

  it('saturates once mean deviation reaches the stated quarter-range', () => {
    const slate = synthSlate(1, 1);
    // One slider, range 0..100, provided 50. Moving it 25 is a quarter of range.
    const atSaturation = blank(slate).map((st) => ({ ...st, vals: [75] }));
    const beyond = blank(slate).map((st) => ({ ...st, vals: [100] }));
    const half = blank(slate).map((st) => ({ ...st, vals: [62.5] }));

    const DEVIATION_WEIGHT = 50;
    expect(run(slate, atSaturation).auto).toBe(DEVIATION_WEIGHT);
    // Past saturation the deviation term is capped, so it cannot exceed its half.
    expect(run(slate, beyond).auto).toBe(DEVIATION_WEIGHT);
    expect(run(slate, half).auto).toBe(clamp(DEVIATION_WEIGHT * (0.125 / AUTONOMY_SATURATION)));
  });

  it('counts a departure only when the participant actually clicked', () => {
    const slate = SLATES.A;
    // rec differs from the supplied one, but recTouched is false: nothing was
    // recorded, so nothing departed.
    const untouched: CaseState[] = blank(slate).map((st) => ({
      ...st,
      rec: 'pass',
      recTouched: false,
    }));
    expect(run(slate, untouched).auto).toBe(0);
  });
});

// --- the composite -----------------------------------------------------------

describe('the behavioural composite', () => {
  it('excludes framing autonomy, which is undefined in one of the two rounds', () => {
    const slate = SLATES.A;
    // Depart from every recommendation and move every slider to an extreme, but
    // open nothing and flag nothing: autonomy is high, the composite is zero.
    const data: CaseState[] = slate.cases.map((c, i) => ({
      ...blank(slate)[i]!,
      recTouched: true,
      rec: c.rec === 'fund' ? 'pass' : 'fund',
      vals: c.a.map((sp) => (sp.provided === sp.max ? sp.min : sp.max)),
      touched: c.a.map(() => false),
      read: false,
      flagged: false,
    }));
    const m = run(slate, data);
    expect(m.auto).toBe(100);
    // 'pass' is neither a flag nor an investigate call, so ambiguity stays 0.
    expect(m.engagement).toBe(0);
    expect(m.range).toBe(0);
    expect(m.amb).toBe(0);
    expect(m.actual).toBe(0);
  });

  it('averages over the measures defined in both rounds', () => {
    const slate = SLATES.A;
    const data = blank(slate).map((st) => ({ ...st, read: true }));
    const m = run(slate, data);
    const COMPOSITE_TERMS = 3;
    expect(m.actual).toBe(clamp((m.engagement + m.range + m.amb) / COMPOSITE_TERMS));
  });
});

// --- confidence and the gap --------------------------------------------------

describe('confidence and the gap', () => {
  it('rescales the five-point rating', () => {
    const slate = SLATES.A;
    const scale: Array<[Confidence, number]> = [
      [0, 0],
      [1, 20],
      [2, 40],
      [3, 60],
      [4, 80],
      [5, 100],
    ];
    for (const [confidence, expected] of scale) {
      expect(run(slate, blank(slate), 'assisted', confidence).perceived).toBe(expected);
    }
  });

  it('leaves the gap unclamped, because its sign is the whole point', () => {
    const slate = SLATES.A;

    // Full confidence on a run where nothing was interrogated.
    const dead = run(slate, blank(slate), 'assisted', 5);
    expect(dead.gap).toBe(100);

    // Low confidence on a thorough run: the self-critical direction, and negative.
    const thorough: CaseState[] = blank(slate).map((st, i) => ({
      ...st,
      read: true,
      flagged: true,
      recTouched: true,
      rec: 'investigate',
      touched: slate.cases[i]!.a.map(() => true),
    }));
    const humble = run(slate, thorough, 'assisted', 1);
    expect(humble.gap).toBeLessThan(0);
    expect(humble.gap).toBe(humble.perceived - humble.actual);
  });
});

// --- ownRec / effRec ---------------------------------------------------------

describe('ownRec and effRec', () => {
  const base: CaseState = {
    modelOpen: false,
    evidenceOpen: false,
    read: false,
    vals: [1, 2, 3],
    touched: [false, false, false],
    rec: 'fund',
    recTouched: false,
    flagged: false,
  };

  it('ownRec is empty until the participant clicks', () => {
    expect(ownRec({ ...base, recTouched: false })).toBe('');
    expect(ownRec({ ...base, recTouched: true })).toBe('fund');
  });

  it('effRec shows the supplied recommendation while ownRec still records nothing', () => {
    // The single most consequential distinction in the scoring. The button renders
    // pre-selected; nothing has been observed about what the person decided.
    const st = { ...base, recTouched: false };
    const opts = { assisted: true, prefill: true, suppliedRec: 'fund' as Rec };
    expect(effRec(st, opts)).toBe('fund');
    expect(ownRec(st)).toBe('');
  });

  it.each([
    [true, true, true, 'fund'],
    [true, true, false, 'fund'],
    [true, false, true, 'fund'],
    [true, false, false, 'fund'],
    [false, true, true, 'fund'],
    [false, true, false, ''],
    [false, false, true, ''],
    [false, false, false, ''],
  ])(
    'effRec(recTouched=%s, assisted=%s, prefill=%s) is %s',
    (recTouched, assisted, prefill, expected) => {
      expect(effRec({ ...base, recTouched }, { assisted, prefill, suppliedRec: 'fund' })).toBe(
        expected,
      );
    },
  );

  it('a full assisted round with every supplied recommendation left standing scores nothing', () => {
    // Leaving a default in place is not an observation of what the person decided,
    // so it must contribute to no measure at all.
    const slate = SLATES.A;
    const data: CaseState[] = blank(slate).map((st, i) => ({
      ...st,
      rec: slate.cases[i]!.rec,
      recTouched: false,
    }));
    const m = run(slate, data);
    expect(m.recsMade).toBe(0);
    expect(m.investigate).toBe(0);
    expect(m.amb).toBe(0);
    expect(m.auto).toBe(0);
  });
});

// --- sticky read, movement flag ---------------------------------------------

describe('deliberate behaviours that look like bugs', () => {
  it('read is sticky: closing a panel does not un-read the case', () => {
    const slate = SLATES.A;
    const data = blank(slate);
    // Opened, then closed. `read` stays true.
    data[0] = { ...data[0]!, modelOpen: false, evidenceOpen: false, read: true };
    expect(run(slate, data).opens).toBe(1);
  });

  it('read is set by either panel, and opening both still counts once', () => {
    const slate = SLATES.A;
    const both = blank(slate);
    both[0] = { ...both[0]!, modelOpen: true, evidenceOpen: true, read: true };
    expect(run(slate, both).opens).toBe(1);
  });

  it('touched is a movement flag, not a value comparison', () => {
    // Dragging a slider and returning it to its original value still counts. The
    // behaviour being observed is the act of interrogating the number.
    const slate = SLATES.A;
    const data = blank(slate);
    data[0] = {
      ...data[0]!,
      vals: slate.cases[0].a.map((sp) => sp.provided), // back where it started
      touched: [true, false, false],
    };
    const m = run(slate, data);
    expect(m.moved).toBe(1);
    expect(m.moved).not.toBe(0);
  });

  it('counts sliders moved across all cases', () => {
    const slate = SLATES.B;
    const data = blank(slate).map((st) => ({ ...st, touched: [true, true, false] }));
    expect(run(slate, data).moved).toBe(6);
  });
});

// --- the control round's starting position -----------------------------------

describe('the control round starts at midpoints', () => {
  it('a fresh control round has moved nothing even though values differ from supplied', () => {
    const slate = SLATES.B;
    const data: CaseState[] = slate.cases.map((c) => ({
      modelOpen: false,
      evidenceOpen: false,
      read: false,
      vals: c.a.map((sp) => mid(sp)),
      touched: c.a.map(() => false),
      rec: '',
      recTouched: false,
      flagged: false,
    }));
    const m = run(slate, data, 'unassisted');
    expect(m.moved).toBe(0);
    expect(m.range).toBe(0);
    expect(m.auto).toBeNull();
  });
});
