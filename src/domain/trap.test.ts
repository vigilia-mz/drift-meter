import { describe, expect, it } from 'vitest';
import { TRAP } from '../content/trap.js';
import { SLATES } from '../content/slates.js';
import type { Rec, TrapBranch } from '../content/types.js';
import type { CaseState } from './metrics.js';
import { trapVerdict } from './trap.js';

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
const verdict = (st: Partial<CaseState>, prefill = true, suppliedRec: Rec = 'fund') =>
  trapVerdict({ st: { ...base, ...st }, trapSlider: TRAP_SLIDER, suppliedRec, prefill });

describe('trapVerdict', () => {
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
              const v = trapVerdict({
                st: {
                  ...base,
                  touched: [touchedTrap, false, false],
                  read,
                  flagged,
                  recTouched,
                  rec,
                },
                trapSlider: TRAP_SLIDER,
                suppliedRec: 'fund',
                prefill: false,
              });
              expect(
                v.branch,
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

  it('always returns a branch that has copy for both slates', () => {
    // A branch with no copy would render an empty paragraph on a published page.
    const branches = new Set<TrapBranch>();
    const flags = [false, true];
    for (const touchedTrap of flags) {
      for (const read of flags) {
        for (const flagged of flags) {
          for (const recTouched of flags) {
            for (const rec of ['fund', 'investigate', 'pass'] as const) {
              for (const prefill of flags) {
                branches.add(
                  trapVerdict({
                    st: {
                      ...base,
                      touched: [touchedTrap, false, false],
                      read,
                      flagged,
                      recTouched,
                      rec,
                    },
                    trapSlider: TRAP_SLIDER,
                    suppliedRec: 'fund',
                    prefill,
                  }).branch,
                );
              }
            }
          }
        }
      }
    }
    for (const branch of branches) {
      expect(TRAP.A[branch].length, `A/${branch}`).toBeGreaterThan(0);
      expect(TRAP.B[branch].length, `B/${branch}`).toBeGreaterThan(0);
    }
    // Every branch except one is reachable with a 'fund' supplied recommendation.
    expect(branches.size).toBeGreaterThanOrEqual(5);
  });

  it('names the planted error on the case the slate says carries it', () => {
    // Slate A hides it in the cost per net; slate B in the use rate.
    expect(SLATES.A.cases[SLATES.A.trapCase].org).toBe('Insecticide-treated bednets');
    expect(SLATES.A.cases[SLATES.A.trapCase].a[SLATES.A.trapSlider].label).toBe(
      'Cost per net delivered',
    );
    expect(SLATES.B.cases[SLATES.B.trapCase].org).toBe('Safe-water chlorination');
    expect(SLATES.B.cases[SLATES.B.trapCase].a[SLATES.B.trapSlider].label).toBe(
      'Consistent use rate',
    );
  });
});
