import { describe, expect, it } from 'vitest';
import { SLATES, otherSlate } from '../content/slates.js';
import type { Condition } from '../content/types.js';
import type { Assignment } from '../domain/assignment.js';
import { condFor } from '../domain/assignment.js';
import { metrics } from '../domain/metrics.js';
import { mid } from '../domain/model.js';
import type { Action, AppState } from './reducer.js';
import { INITIAL_STATE, reducer } from './reducer.js';
import { NOTHING_FORCED, slateFor } from './run.js';
import { ordinalOf } from './screen.js';

/**
 * The reducer is where three deliberate behaviours are actually implemented. The
 * domain suite sets `read`, `touched` and `recTouched` by hand and would stay
 * green under any of the obvious mistakes here, so these are the tests that hold
 * them — see `docs/deliberate-quirks.md`.
 */

const ASSIGN: Assignment = { assistedFirst: true, assistedSlate: 'A', armKey: 'ai' };
const UNASSISTED_FIRST: Assignment = { assistedFirst: false, assistedSlate: 'A', armKey: 'ai' };

function begin(assign: Assignment = ASSIGN, prefill = true): AppState {
  return reducer(INITIAL_STATE, {
    type: 'begin',
    payload: { assign, prefill, forced: NOTHING_FORCED, localOnly: false },
  });
}

function run(state: AppState, ...actions: readonly Action[]): AppState {
  return actions.reduce(reducer, state);
}

/** Finish the current round with a rating, so `commitRound` is not refused. */
function rate(state: AppState, value: 1 | 2 | 3 | 4 | 5): AppState {
  return run(state, { type: 'setConfidence', value }, { type: 'commitRound' });
}

function working(state: AppState) {
  if (state.run.status !== 'active') throw new Error('expected an active run');
  return state.run.working;
}

describe('begin', () => {
  it('writes the whole first round at once, so a half-begun run is not representable', () => {
    const state = begin();
    expect(state.screen).toEqual({ name: 'round', ordinal: 1 });
    if (state.run.status !== 'active') throw new Error('expected an active run');
    expect(state.run.assign).toBe(ASSIGN);
    expect(state.run.done).toEqual({});
    expect(state.run.working.confidence).toBe(0);
    expect(state.run.working.data).toHaveLength(SLATES.A.cases.length);
  });

  it('opens the assisted round on the supplied values, so the headline is the supplied one', () => {
    const first = working(begin()).data[0];
    expect(first?.vals).toEqual(SLATES.A.cases[0].a.map((sp) => sp.provided));
    expect(first?.touched).toEqual([false, false, false]);
  });

  it('opens the control round at midpoints, never at the supplied values', () => {
    // Drawn unassisted-first, so round one is the control round.
    const state = begin(UNASSISTED_FIRST);
    const slate = SLATES[otherSlate('A')];
    const first = working(state).data[0];
    expect(first?.vals).toEqual(slate.cases[0].a.map((sp) => mid(sp)));
    expect(first?.vals).not.toEqual(slate.cases[0].a.map((sp) => sp.provided));
  });

  it('never seeds the supplied recommendation into the participant’s own', () => {
    // The assisted round pre-selects a button on screen, but the state it is
    // computed from must stay empty, or ownRec() returns the assistant's answer.
    for (const c of working(begin()).data) {
      expect(c.rec).toBe('');
      expect(c.recTouched).toBe(false);
    }
  });

  it('runs a different slate in each round', () => {
    const state = rate(begin(), 3);
    if (state.run.status !== 'active') throw new Error('expected an active run');
    const one = slateFor(ASSIGN, condFor(ASSIGN, 1));
    const two = slateFor(ASSIGN, condFor(ASSIGN, 2));
    expect(one.id).not.toBe(two.id);
  });
});

describe('read is sticky', () => {
  it('is set by opening either panel', () => {
    for (const panel of ['model', 'evidence'] as const) {
      const state = reducer(begin(), { type: 'togglePanel', caseIndex: 0, panel });
      expect(working(state).data[0]?.read).toBe(true);
    }
  });

  it('survives closing the panel that set it', () => {
    const state = run(
      begin(),
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
    );
    expect(working(state).data[0]?.modelOpen).toBe(false);
    expect(working(state).data[0]?.read).toBe(true);
  });

  it('survives closing both panels, so it is not modelOpen || evidenceOpen', () => {
    const state = run(
      begin(),
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
      { type: 'togglePanel', caseIndex: 0, panel: 'evidence' },
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
      { type: 'togglePanel', caseIndex: 0, panel: 'evidence' },
    );
    const c = working(state).data[0];
    expect(c?.modelOpen).toBe(false);
    expect(c?.evidenceOpen).toBe(false);
    expect(c?.read).toBe(true);
  });

  it('counts a case once however many panels were opened', () => {
    const state = run(
      begin(),
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
      { type: 'togglePanel', caseIndex: 0, panel: 'evidence' },
    );
    const m = metrics({
      data: working(state).data,
      slate: SLATES.A,
      condition: 'assisted',
      confidence: 3,
    });
    expect(m.opens).toBe(1);
  });

  it('does not leak across cases', () => {
    const state = reducer(begin(), { type: 'togglePanel', caseIndex: 1, panel: 'model' });
    expect(working(state).data[0]?.read).toBe(false);
    expect(working(state).data[1]?.read).toBe(true);
  });
});

describe('touched is a movement flag', () => {
  it('is set by any write, including one that changes nothing', () => {
    const start = working(begin()).data[0]?.vals[0];
    if (start === undefined) throw new Error('expected a starting value');
    const state = reducer(begin(), {
      type: 'setValue',
      caseIndex: 0,
      sliderIndex: 0,
      value: start,
    });
    expect(working(state).data[0]?.vals[0]).toBe(start);
    expect(working(state).data[0]?.touched[0]).toBe(true);
  });

  it('survives a return to the starting value', () => {
    const start = working(begin()).data[0]?.vals[0];
    if (start === undefined) throw new Error('expected a starting value');
    const state = run(
      begin(),
      { type: 'setValue', caseIndex: 0, sliderIndex: 0, value: start + 1 },
      { type: 'setValue', caseIndex: 0, sliderIndex: 0, value: start },
    );
    expect(working(state).data[0]?.vals[0]).toBe(start);
    expect(working(state).data[0]?.touched[0]).toBe(true);
  });

  it('marks only the slider that moved', () => {
    const state = reducer(begin(), {
      type: 'setValue',
      caseIndex: 0,
      sliderIndex: 1,
      value: 42,
    });
    expect(working(state).data[0]?.touched).toEqual([false, true, false]);
  });

  it('ignores a slider index the case does not have', () => {
    const before = begin();
    const after = reducer(before, {
      type: 'setValue',
      caseIndex: 0,
      sliderIndex: 9,
      value: 1,
    });
    expect(working(after).data[0]).toEqual(working(before).data[0]);
  });
});

describe('a supplied recommendation left standing scores nothing', () => {
  it('chooseRec is the only thing that sets recTouched', () => {
    // Everything a reader can do short of choosing.
    const state = run(
      begin(),
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
      { type: 'togglePanel', caseIndex: 0, panel: 'evidence' },
      { type: 'setValue', caseIndex: 0, sliderIndex: 0, value: 3 },
      { type: 'toggleFlag', caseIndex: 0 },
    );
    expect(working(state).data[0]?.recTouched).toBe(false);
  });

  it('a whole assisted round left standing scores zero on every affected measure', () => {
    const state = begin();
    const m = metrics({
      data: working(state).data,
      slate: SLATES.A,
      condition: 'assisted',
      confidence: 3,
    });
    expect(m.recsMade).toBe(0);
    expect(m.investigate).toBe(0);
    expect(m.amb).toBe(0);
    expect(m.auto).toBe(0);
  });

  it('records a choice when one is actually made', () => {
    const state = reducer(begin(), { type: 'chooseRec', caseIndex: 0, rec: 'investigate' });
    expect(working(state).data[0]?.rec).toBe('investigate');
    expect(working(state).data[0]?.recTouched).toBe(true);
  });
});

describe('the confidence gate', () => {
  it('refuses to advance while the round is unrated', () => {
    const state = begin();
    expect(reducer(state, { type: 'commitRound' })).toBe(state);
  });

  it('advances once a rating is given', () => {
    const state = rate(begin(), 4);
    expect(state.screen).toEqual({ name: 'round', ordinal: 2 });
  });

  it('starts the second round unrated rather than carrying the first rating over', () => {
    const state = rate(begin(), 5);
    expect(working(state).confidence).toBe(0);
  });
});

describe('completing the run', () => {
  it('reaches the complete variant with both rounds present, not asserted', () => {
    const state = rate(rate(begin(), 4), 2);
    expect(state.screen).toEqual({ name: 'debrief' });
    if (state.run.status !== 'complete') throw new Error('expected a complete run');
    // No non-null assertion is possible here: the type says both exist.
    expect(state.run.rounds.assisted.confidence).toBe(4);
    expect(state.run.rounds.unassisted.confidence).toBe(2);
  });

  it('keys the two records by condition, not by the order they were played', () => {
    // Drawn unassisted-first, so round one's rating belongs to the control round.
    const state = rate(rate(begin(UNASSISTED_FIRST), 1), 5);
    if (state.run.status !== 'complete') throw new Error('expected a complete run');
    expect(state.run.rounds.unassisted.confidence).toBe(1);
    expect(state.run.rounds.assisted.confidence).toBe(5);
  });

  it('does not alias the two rounds’ arrays', () => {
    let state = run(begin(), { type: 'setValue', caseIndex: 0, sliderIndex: 0, value: 1 });
    state = rate(state, 3);
    state = run(state, { type: 'setValue', caseIndex: 0, sliderIndex: 0, value: 999 });
    state = rate(state, 3);
    if (state.run.status !== 'complete') throw new Error('expected a complete run');
    expect(state.run.rounds.assisted.data[0]?.vals[0]).toBe(1);
    expect(state.run.rounds.unassisted.data[0]?.vals[0]).toBe(999);
  });

  it('opens Round 3 on the assisted slate’s two replayed cases', () => {
    const state = rate(rate(begin(), 3), 3);
    if (state.run.status !== 'complete') throw new Error('expected a complete run');
    expect(state.run.r3.map((r) => r.caseIndex)).toEqual([...SLATES.A.r3]);
    for (const r of state.run.r3) {
      expect(r.revealed).toBe(false);
      expect(r.read).toBe('');
      expect(r.driver).toBeNull();
    }
  });
});

describe('writes land in the round being played', () => {
  it('edits the condition the current ordinal maps to', () => {
    for (const assign of [ASSIGN, UNASSISTED_FIRST]) {
      const state = reducer(begin(assign), { type: 'toggleFlag', caseIndex: 0 });
      const ordinal = ordinalOf(state.screen);
      if (ordinal === undefined) throw new Error('expected a round screen');
      const condition: Condition = condFor(assign, ordinal);
      // The flag went into the working record, which commits under this key.
      const committed = rate(state, 3);
      if (committed.run.status !== 'active') throw new Error('expected an active run');
      expect(committed.run.done[condition]?.data[0]?.flagged).toBe(true);
    }
  });

  it('ignores case edits when no run is active', () => {
    expect(reducer(INITIAL_STATE, { type: 'toggleFlag', caseIndex: 0 })).toBe(INITIAL_STATE);
  });

  it('ignores a case index the slate does not have', () => {
    const before = begin();
    expect(reducer(before, { type: 'toggleFlag', caseIndex: 7 })).toBe(before);
  });
});

describe('navigation and restart', () => {
  it('goto moves the screen without touching the run', () => {
    const state = begin();
    const moved = reducer(state, { type: 'goto', screen: { name: 'method' } });
    expect(moved.screen).toEqual({ name: 'method' });
    expect(moved.run).toBe(state.run);
  });

  it('restart clears every field a run accumulated', () => {
    const finished = rate(rate(begin(), 4), 4);
    expect(reducer(finished, { type: 'restart' })).toEqual(INITIAL_STATE);
  });
});

describe('what happens after the debrief cannot change the debrief', () => {
  /** A finished run, with some work done in each round so the measures are not all zero. */
  function finished(): AppState {
    let s = run(
      begin(),
      { type: 'togglePanel', caseIndex: 0, panel: 'model' },
      { type: 'setValue', caseIndex: 0, sliderIndex: 0, value: 3 },
      { type: 'chooseRec', caseIndex: 1, rec: 'investigate' },
      { type: 'toggleFlag', caseIndex: 2 },
    );
    s = rate(s, 4);
    s = run(s, { type: 'setValue', caseIndex: 1, sliderIndex: 2, value: 0.001 });
    return rate(s, 2);
  }

  function scores(state: AppState) {
    if (state.run.status !== 'complete') throw new Error('expected a complete run');
    return (['assisted', 'unassisted'] as const).map((condition) =>
      metrics({
        data: state.run.status === 'complete' ? state.run.rounds[condition].data : [],
        slate: slateFor(ASSIGN, condition),
        condition,
        confidence: state.run.status === 'complete' ? state.run.rounds[condition].confidence : 0,
      }),
    );
  }

  it('the transfer pick feeds no measure', () => {
    const before = finished();
    const after = reducer(before, { type: 'pickTransfer', option: 'proxy' });
    if (after.run.status !== 'complete') throw new Error('expected a complete run');
    expect(after.run.transfer).toBe('proxy');
    expect(scores(after)).toEqual(scores(before));
  });

  it('moving a Round 3 slider does not raise evaluative range after the fact', () => {
    // The whole reason R3CaseState is a separate type. If Round 3 wrote into the
    // records the debrief already reported on, this would move.
    const before = finished();
    const after = run(
      before,
      { type: 'commitR3', slot: 0, read: 'pass', driver: 0 },
      { type: 'setR3Value', slot: 0, sliderIndex: 0, value: 999 },
      { type: 'setR3Value', slot: 1, sliderIndex: 2, value: 0.002 },
    );
    expect(scores(after)).toEqual(scores(before));
    if (after.run.status !== 'complete') throw new Error('expected a complete run');
    expect(after.run.r3[0]?.vals[0]).toBe(999);
  });

  it('commitR3 records the read and the driver, and reveals', () => {
    const after = reducer(finished(), {
      type: 'commitR3',
      slot: 1,
      read: 'fund',
      driver: 2,
    });
    if (after.run.status !== 'complete') throw new Error('expected a complete run');
    expect(after.run.r3[1]).toMatchObject({ read: 'fund', driver: 2, revealed: true });
    // The other slot is untouched.
    expect(after.run.r3[0]?.revealed).toBe(false);
  });

  it('revealing is monotonic, so there is no way back to not having seen it', () => {
    const after = run(
      finished(),
      { type: 'commitR3', slot: 0, read: 'fund', driver: 0 },
      { type: 'commitR3', slot: 0, read: 'pass', driver: 1 },
    );
    if (after.run.status !== 'complete') throw new Error('expected a complete run');
    expect(after.run.r3[0]?.revealed).toBe(true);
  });

  it('ignores a slot or slider the run does not have', () => {
    const before = finished();
    expect(reducer(before, { type: 'commitR3', slot: 9, read: 'fund', driver: 0 })).toBe(before);
    expect(reducer(before, { type: 'setR3Value', slot: 0, sliderIndex: 9, value: 1 })).toBe(before);
    expect(reducer(before, { type: 'setR3Value', slot: 9, sliderIndex: 0, value: 1 })).toBe(before);
  });

  it('refuses all three before the run is complete', () => {
    const midRun = begin();
    for (const action of [
      { type: 'pickTransfer', option: 'proxy' },
      { type: 'commitR3', slot: 0, read: 'fund', driver: 0 },
      { type: 'setR3Value', slot: 0, sliderIndex: 0, value: 1 },
    ] as const) {
      expect(reducer(midRun, action)).toBe(midRun);
    }
  });

  it('restart clears the transfer pick and all of Round 3', () => {
    const after = run(
      finished(),
      { type: 'pickTransfer', option: 'proxy' },
      { type: 'commitR3', slot: 0, read: 'fund', driver: 0 },
      { type: 'restart' },
    );
    expect(after).toEqual(INITIAL_STATE);
  });
});
