import { describe, expect, it } from 'vitest';
import type { Screen } from '../state/screen.js';
import { ALL_SCREENS, LINEAR_PATH, screenKey } from '../state/screen.js';
import type { HistoryLike } from './history.js';
import { decideHistory, entryFor, screenFromEntry, syncHistory } from './history.js';

/**
 * Browser Back, driven the way the shell drives it and read the way a reader
 * experiences it.
 *
 * The fake below is a real session history: a stack, a cursor, and a push that
 * discards the forward entries — because the behaviours worth testing here are all
 * about the stack rather than about any one call. `visit` is what the shell's
 * effect does on a screen change, and `press` is what a Back or Forward press does
 * to the shell: the browser moves the cursor, `popstate` hands over the entry, the
 * reducer goes there, and the effect runs again on the way out. That last step is
 * the one that used to push a duplicate.
 */

interface FakeHistory extends HistoryLike {
  back(): void;
  forward(): void;
  readonly entries: readonly unknown[];
  /** Whether a Back press would leave the site rather than move within it. */
  readonly atBottom: boolean;
}

function fakeHistory(initial: unknown = null): FakeHistory {
  const entries: unknown[] = [initial];
  let cursor = 0;
  return {
    get state() {
      return entries[cursor];
    },
    get entries() {
      return entries;
    },
    get atBottom() {
      return cursor === 0;
    },
    pushState(data: unknown) {
      entries.length = cursor + 1;
      entries.push(data);
      cursor += 1;
    },
    replaceState(data: unknown) {
      entries[cursor] = data;
    },
    back() {
      if (cursor > 0) cursor -= 1;
    },
    forward() {
      if (cursor < entries.length - 1) cursor += 1;
    },
  };
}

/**
 * A reader working through the instrument with a history behind them.
 *
 * `visit` is the shell's effect on a screen change. `back` and `forward` are the
 * whole round trip of a press: the browser moves the cursor, `popstate` hands the
 * entry over, the reducer goes there, and the effect runs again on the way out.
 * That last step is the one that used to push a duplicate.
 */
function reader(initial: unknown = null) {
  const history = fakeHistory(initial);
  let showing: Screen = { name: 'intro' };

  function land() {
    showing = screenFromEntry(history.state) ?? showing;
    syncHistory(history, showing);
  }

  return {
    history,
    get showing(): Screen {
      return showing;
    },
    visit(screen: Screen) {
      showing = screen;
      syncHistory(history, screen);
    },
    back() {
      history.back();
      land();
    },
    forward() {
      history.forward();
      land();
    },
  };
}

describe('the history entry', () => {
  it('round-trips every screen the instrument can show', () => {
    for (const screen of ALL_SCREENS) {
      expect(screenFromEntry(entryFor(screen)), screenKey(screen)).toEqual(screen);
    }
  });

  it('keeps the two rounds apart', () => {
    // The same failure as `screenKey`: an entry that stored only the name would
    // send a reader pressing Back from the protocol screen into round one when
    // they left from round two.
    const first = entryFor({ name: 'round', ordinal: 1 });
    expect(screenFromEntry(first)).toEqual({ name: 'round', ordinal: 1 });
    expect(screenFromEntry(first)).not.toEqual({ name: 'round', ordinal: 2 });
  });

  it('reads nothing out of an entry this app did not write', () => {
    for (const foreign of [
      null,
      undefined,
      42,
      'method',
      {},
      { screen: 'method' },
      { driftMeter: null },
      { driftMeter: 'method' },
    ]) {
      expect(screenFromEntry(foreign)).toBeNull();
    }
  });

  it('rejects a marked entry that does not name a screen in the union', () => {
    // Matched against the list of real screens rather than reassembled from parts,
    // so a round with no ordinal cannot become a `Screen` that the reducer would
    // then have to cope with.
    for (const bad of [
      { driftMeter: { name: 'nowhere' } },
      { driftMeter: { name: 'round' } },
      { driftMeter: { name: 'round', ordinal: 3 } },
      { driftMeter: { name: 'intro', ordinal: 1 } },
    ]) {
      expect(screenFromEntry(bad)).toBeNull();
    }
  });
});

describe('deciding what to write', () => {
  it('adds an entry for the two reference screens and only those', () => {
    // From an entry naming no screen, so that arriving at the intro is a move like
    // any other rather than the one case that is already where it is going.
    for (const screen of ALL_SCREENS) {
      const expected = screen.name === 'method' || screen.name === 'process' ? 'push' : 'replace';
      expect(decideHistory(null, screen), screenKey(screen)).toBe(expected);
    }
  });

  it('does nothing when the entry already names the screen being shown', () => {
    // This is what makes the effect safe to run after a Back press: the browser has
    // already moved to the entry, so there is nothing left to write. Without it,
    // one Back press would need two.
    for (const screen of ALL_SCREENS) {
      expect(decideHistory(entryFor(screen), screen), screenKey(screen)).toBe('none');
    }
  });

  it('treats an unrecognised current entry as somewhere else', () => {
    expect(decideHistory(null, { name: 'intro' })).toBe('replace');
    expect(decideHistory(null, { name: 'method' })).toBe('push');
  });
});

describe('walking the instrument', () => {
  it('adds no entries along the linear path, so Back still leaves the site', () => {
    // The run is not a place to go back to. Pressing Back part-way through a round
    // should leave, not un-answer the previous question.
    const r = reader();
    for (const screen of LINEAR_PATH) r.visit(screen);
    expect(r.history.entries).toHaveLength(1);
    expect(r.history.atBottom).toBe(true);
    expect(screenFromEntry(r.history.state)).toEqual(LINEAR_PATH[LINEAR_PATH.length - 1]);
  });

  it('returns a reader to the intro they stepped aside from', () => {
    // The reason this module exists. Before it, a reader who took the intro's side
    // door into the protocol screen pressed Back and left the site.
    const r = reader();
    r.visit({ name: 'intro' });
    r.visit({ name: 'method' });
    expect(r.history.entries).toHaveLength(2);

    r.back();
    expect(r.showing).toEqual({ name: 'intro' });
    expect(r.history.atBottom).toBe(true);
  });

  it('returns a reader to the debrief they stepped aside from', () => {
    const r = reader();
    for (const screen of LINEAR_PATH) r.visit(screen);
    r.visit({ name: 'debrief' });
    r.visit({ name: 'method' });

    r.back();
    expect(r.showing).toEqual({ name: 'debrief' });
  });

  it('needs one Back press per step, not two', () => {
    // The duplicate-push bug, pinned. The shell's effect runs again after the
    // dispatch that `popstate` causes, and if it pushed there, the entry the reader
    // just arrived at would be re-added on top of itself.
    const r = reader();
    r.visit({ name: 'intro' });
    r.visit({ name: 'method' });
    const depth = r.history.entries.length;

    r.back();
    expect(r.showing).toEqual({ name: 'intro' });
    expect(r.history.entries).toHaveLength(depth);
  });

  it('goes forward again into the screen it came out of', () => {
    const r = reader();
    r.visit({ name: 'intro' });
    r.visit({ name: 'method' });
    r.back();
    r.forward();
    expect(r.showing).toEqual({ name: 'method' });
  });

  it('stacks the two reference screens, so Back walks out the way it came in', () => {
    const r = reader();
    r.visit({ name: 'intro' });
    r.visit({ name: 'method' });
    r.visit({ name: 'process' });

    r.back();
    expect(r.showing).toEqual({ name: 'method' });
    r.back();
    expect(r.showing).toEqual({ name: 'intro' });
    expect(r.history.atBottom).toBe(true);
  });

  it('leaves an entry to go back to even when the protocol screen is the first move', () => {
    // A reader who opens the instrument in a fresh tab and clicks straight through
    // to the protocol screen still has somewhere to return to, because the entry
    // they arrived on is written on the way past.
    const r = reader();
    r.visit({ name: 'intro' });
    r.visit({ name: 'method' });
    expect(r.history.atBottom).toBe(false);
    r.back();
    expect(r.showing).toEqual({ name: 'intro' });
  });

  it('keeps the entry beneath describing where the reader actually was', () => {
    // Stepping aside from round two and coming back should not arrive at round one.
    const r = reader();
    r.visit({ name: 'intro' });
    r.visit({ name: 'round', ordinal: 1 });
    r.visit({ name: 'round', ordinal: 2 });
    r.visit({ name: 'method' });
    r.back();
    expect(r.showing).toEqual({ name: 'round', ordinal: 2 });
  });
});
