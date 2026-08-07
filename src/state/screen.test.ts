import { describe, expect, it } from 'vitest';
import { SCREENS, announceFor, titleFor } from '../content/shell.js';
import type { ScreenName } from '../content/types.js';
import type { Screen } from './screen.js';
import { LINEAR_PATH, isBuilt, isLinear, isReference, ordinalOf, screenKey } from './screen.js';

const ALL_NAMES = Object.keys(SCREENS) as readonly ScreenName[];

describe('the screen union', () => {
  it('covers thirteen screens with eleven names', () => {
    expect(ALL_NAMES).toHaveLength(11);
    // Eleven names, of which round and rate render twice: the linear path is
    // eleven entries and the two reference screens sit outside it.
    expect(LINEAR_PATH).toHaveLength(11);
    expect(LINEAR_PATH.filter((s) => s.name === 'round')).toHaveLength(2);
    expect(LINEAR_PATH.filter((s) => s.name === 'rate')).toHaveLength(2);
    const rendered =
      LINEAR_PATH.length + ALL_NAMES.filter((n) => n === 'method' || n === 'process').length;
    expect(rendered).toBe(13);
  });

  it('gives every name copy, and every copy a name', () => {
    for (const name of ALL_NAMES) {
      expect(SCREENS[name].title, name).not.toBe('');
      expect(SCREENS[name].announce, name).not.toBe('');
    }
  });

  it('puts every linear screen in the union and none of the reference screens', () => {
    for (const screen of LINEAR_PATH) {
      expect(isLinear(screen), screen.name).toBe(true);
      expect(isReference(screen), screen.name).toBe(false);
    }
    for (const screen of [{ name: 'method' }, { name: 'process' }] as const) {
      expect(isLinear(screen)).toBe(false);
      expect(isReference(screen)).toBe(true);
    }
  });

  it('starts the flow at the intro and ends the built part at the four rules', () => {
    expect(LINEAR_PATH[0]).toEqual({ name: 'intro' });
    const built = LINEAR_PATH.filter(isBuilt);
    // Ten of the thirteen rendered screens: six from #15, four more from #16.
    expect(built).toHaveLength(10);
    expect(built[built.length - 1]).toEqual({ name: 'spec' });
  });
});

describe('ordinalOf', () => {
  it('reports the ordinal on the two-round screens', () => {
    expect(ordinalOf({ name: 'round', ordinal: 2 })).toBe(2);
    expect(ordinalOf({ name: 'rate', ordinal: 1 })).toBe(1);
  });

  it('returns undefined elsewhere rather than defaulting to round one', () => {
    for (const screen of [{ name: 'intro' }, { name: 'debrief' }] as const) {
      expect(ordinalOf(screen)).toBeUndefined();
    }
  });
});

describe('screenKey', () => {
  it('separates the two rounds, so the focus effect re-fires between them', () => {
    // The single most important transition in the run. A key on the name alone
    // would leave a keyboard user unannounced at it.
    expect(screenKey({ name: 'round', ordinal: 1 })).not.toBe(
      screenKey({ name: 'round', ordinal: 2 }),
    );
    expect(screenKey({ name: 'rate', ordinal: 1 })).not.toBe(
      screenKey({ name: 'rate', ordinal: 2 }),
    );
  });

  it('is unique across every screen the instrument can show', () => {
    const screens: readonly Screen[] = [...LINEAR_PATH, { name: 'method' }, { name: 'process' }];
    expect(new Set(screens.map(screenKey)).size).toBe(screens.length);
    expect(screens).toHaveLength(13);
  });
});

describe('titles and announcements', () => {
  it('names the site in every title', () => {
    for (const name of ALL_NAMES) {
      expect(titleFor(name)).toContain('The Drift Meter');
    }
  });

  it('distinguishes the two rounds in both the title and the announcement', () => {
    expect(titleFor('round', 1)).not.toBe(titleFor('round', 2));
    expect(announceFor('round', 1)).not.toBe(announceFor('round', 2));
    expect(announceFor('round', 1)).toContain('Round 1');
  });

  it('leaves the ordinal out where there is not one', () => {
    expect(titleFor('debrief')).toBe('The Drift Meter — What changed');
    expect(announceFor('debrief')).toBe(SCREENS.debrief.announce);
  });
});
