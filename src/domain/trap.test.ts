import { describe, expect, it } from 'vitest';
import { SLATES } from '../content/slates.js';
import { TRAP_FRAMES, trapParagraph } from '../content/trap.js';
import type { Rec, Slate, Trap, TrapBranch } from '../content/types.js';
import type { CaseState } from './metrics.js';
import { trappedCases } from './metrics.js';
import { trapVerdicts } from './trap.js';

const base: CaseState = {
  modelOpen: false,
  evidenceOpen: false,
  read: false,
  vals: [2, 85, 0.0006],
  touched: [false, false, false],
  rec: '',
  recTouched: false,
  flagged: false,
};

const TRAP_SLIDER = 0;

const trap = (slider = TRAP_SLIDER): Trap => ({
  slider,
  whatTheLabelSays: 'the label',
  whatTheFigureIs: 'something else',
});

/**
 * A slate whose cases carry exactly the traps asked for.
 *
 * Built rather than borrowed, and of arbitrary shape, for the same reason
 * `metrics.test.ts` builds synthetic slates: the content authors one planted error
 * per slate, so a suite that only ever ran the real slates would pass on a
 * mechanism that still handled exactly one. These are the shapes the mechanism has
 * to hold and the content does not yet produce.
 */
function synthSlate(traps: readonly (Trap | null)[], rec: Rec | readonly Rec[] = 'fund'): Slate {
  const cases = traps.map((t, i) => ({
    org: `case-${String(i)}`,
    cause: 'c',
    outcome: 'o',
    rec: typeof rec === 'string' ? rec : rec[i],
    summary: 's',
    evidence: 'e',
    disagree: 'd',
    changeMind: 'm',
    trap: t,
    a: [0, 1, 2].map(() => ({
      label: 'x',
      unit: '' as const,
      dp: 0,
      min: 0,
      max: 10,
      step: 1,
      provided: 5,
      supported: null,
      supportedNote: 'Synthetic.',
    })),
  })) as unknown as Slate['cases'];
  return { id: 'A', name: 'synthetic', r3: [0, 0], cases };
}

/** The verdict on a one-trapped-case slate, which is the branch table's subject. */
const verdict = (st: Partial<CaseState>, prefill = true, suppliedRec: Rec = 'fund') => {
  const all = trapVerdicts({
    data: [{ ...base, ...st }],
    slate: synthSlate([trap()], suppliedRec),
    prefill,
  });
  const only = all[0];
  if (only === undefined) throw new Error('the synthetic slate carries one planted error');
  return only;
};

describe('trapVerdicts', () => {
  it('caught: the figure the headline rests on was moved', () => {
    const v = verdict({ touched: [true, false, false] });
    expect(v.branch).toBe('caught');
    expect(v.accent).toBe('caught');
    expect(v.heading).toBe('interrogated');
  });

  it('caught beats flagged: moving the number outranks declining to decide', () => {
    const v = verdict({ touched: [true, false, false], flagged: true });
    expect(v.branch).toBe('caught');
  });

  it('moving a different slider is not catching it', () => {
    // Interrogating the usage rate is real work, and it is not the planted error.
    const v = verdict({ touched: [false, true, true] });
    expect(v.branch).not.toBe('caught');
  });

  it('flagged without checking: a real move, and not the same as checking', () => {
    const v = verdict({ flagged: true });
    expect(v.branch).toBe('flaggedNotChecked');
    expect(v.accent).toBe('declined');
    expect(v.heading).toBe('declinedToDecide');
  });

  it('missFund: made it a top pick on a figure never moved', () => {
    const v = verdict({ rec: 'fund', recTouched: true });
    expect(v.branch).toBe('missFund');
    expect(v.heading).toBe('numberNotChecked');
  });

  it('missFund is checked before missAccepted', () => {
    // An explicit funding call is a decision; a left-standing default is not. The
    // copy differs precisely on that point, so the order matters.
    const v = verdict({ rec: 'fund', recTouched: true, read: true });
    expect(v.branch).toBe('missFund');
  });

  it('missAccepted: nothing recorded either way, and the supplied call left standing', () => {
    const v = verdict({});
    expect(v.branch).toBe('missAccepted');
    expect(v.heading).toBe('recommendationLeftStanding');
  });

  it('missOpened is checked before miss', () => {
    // Looking is not the same as checking, and the copy says so.
    const v = verdict({ read: true, recTouched: true, rec: 'pass' });
    expect(v.branch).toBe('missOpened');
  });

  it('miss: never opened the model at all', () => {
    const v = verdict({ recTouched: true, rec: 'pass' });
    expect(v.branch).toBe('miss');
  });

  it('a non-funding supplied recommendation cannot produce missAccepted', () => {
    // The branch exists to describe a funding call left in place. On a case whose
    // supplied read was "investigate" there is no such call to leave.
    const v = verdict({}, true, 'investigate');
    expect(v.branch).not.toBe('missAccepted');
    expect(v.branch).toBe('miss');
  });

  it('reads the supplied recommendation off the case it is scoring, not off the slate', () => {
    // Two trapped cases with different supplied reads. Before #31 there was one
    // trapped case and one `suppliedRec` argument, so a per-case read could not be
    // wrong; now it can, and a run where both cases were left alone must produce
    // `missAccepted` only on the one whose supplied call was a funding call.
    const slate = synthSlate([trap(), trap()], ['fund', 'investigate']);
    const verdicts = trapVerdicts({ data: [base, base], slate, prefill: true });
    expect(verdicts.map((v) => v.branch)).toEqual(['missAccepted', 'miss']);
  });

  it('returns one verdict per trapped case, in slate order, and none for the others', () => {
    // The whole of #31: the mechanism holds more than one planted error per slate.
    const slate = synthSlate([null, trap(), null, trap(2)] as readonly (Trap | null)[]);
    const verdicts = trapVerdicts({
      data: [base, { ...base, touched: [true, false, false] }, base, base],
      slate,
      prefill: true,
    });

    expect(verdicts).toHaveLength(2);
    expect(verdicts.map((v) => v.trapped.index)).toEqual([1, 3]);
    // Different branches in the same run, which the slate-level field could not
    // represent at all: one interrogated, one left standing.
    expect(verdicts.map((v) => v.branch)).toEqual(['caught', 'missAccepted']);
    expect(verdicts[1]?.trapped.trap.slider).toBe(2);
  });

  it('returns nothing at all for a slate that carries no planted error', () => {
    // Not an empty verdict and not a `miss`: the debrief drops the section entirely,
    // because there is nothing it could truthfully say about a trap that is not there.
    expect(
      trapVerdicts({ data: [base, base], slate: synthSlate([null, null]), prefill: true }),
    ).toEqual([]);
  });

  it('skips a trapped case the round has no recorded state for', () => {
    // A slate longer than its data is not a run this can describe, and inventing a
    // verdict for it would print a paragraph about a case nobody worked.
    const verdicts = trapVerdicts({
      data: [base],
      slate: synthSlate([trap(), trap()]),
      prefill: true,
    });
    expect(verdicts).toHaveLength(1);
    expect(verdicts[0]?.trapped.index).toBe(0);
  });

  it('missAccepted is unreachable whenever the recommendation was not pre-selected', () => {
    // The `claudeAssertiveness: 'Subtle'` invariant, proved rather than assumed:
    // with no pre-selected recommendation there is nothing left standing, so the
    // debrief must never claim there was. Exhaustive over all 2^5 input states.
    const flags = [false, true];
    let checked = 0;
    for (const touchedTrap of flags) {
      for (const read of flags) {
        for (const flagged of flags) {
          for (const recTouched of flags) {
            for (const rec of ['fund', 'pass'] as const) {
              const v = trapVerdicts({
                data: [
                  { ...base, touched: [touchedTrap, false, false], read, flagged, recTouched, rec },
                ],
                slate: synthSlate([trap()]),
                prefill: false,
              })[0];
              expect(
                v?.branch,
                JSON.stringify({ touchedTrap, read, flagged, recTouched, rec }),
              ).not.toBe('missAccepted');
              checked += 1;
            }
          }
        }
      }
    }
    expect(checked).toBe(2 ** 5);
  });

  it('always returns a branch that has a frame, so no paragraph can come out empty', () => {
    // A branch with no frame would render half a sentence on a published page.
    const branches = new Set<TrapBranch>();
    const flags = [false, true];
    for (const touchedTrap of flags) {
      for (const read of flags) {
        for (const flagged of flags) {
          for (const recTouched of flags) {
            for (const rec of ['fund', 'investigate', 'pass'] as const) {
              for (const prefill of flags) {
                const v = trapVerdicts({
                  data: [
                    {
                      ...base,
                      touched: [touchedTrap, false, false],
                      read,
                      flagged,
                      recTouched,
                      rec,
                    },
                  ],
                  slate: synthSlate([trap()]),
                  prefill,
                })[0];
                if (v !== undefined) branches.add(v.branch);
              }
            }
          }
        }
      }
    }
    for (const branch of branches) {
      expect(TRAP_FRAMES[branch].opening.length, branch).toBeGreaterThan(0);
      expect(TRAP_FRAMES[branch].closing.length, branch).toBeGreaterThan(0);
      expect(trapParagraph(branch, trap()), branch).toContain('something else');
    }
    // Every branch except one is reachable with a 'fund' supplied recommendation.
    expect(branches.size).toBeGreaterThanOrEqual(5);
  });

  it('names the planted error on the case that carries it, in both slates', () => {
    // Slate A hides it in the cost per net; slate B in the use rate. Read off the
    // cases rather than off a slate-level index, which is what #31 removed.
    const a = trappedCases(SLATES.A);
    const b = trappedCases(SLATES.B);
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
    expect(a[0]?.case.org).toBe('Insecticide-treated bednets');
    expect(a[0]?.case.a[a[0].trap.slider]?.label).toBe('Cost per net delivered');
    expect(b[0]?.case.org).toBe('Safe-water chlorination');
    expect(b[0]?.case.a[b[0].trap.slider]?.label).toBe('Consistent use rate');
  });
});
