import { describe, expect, it } from 'vitest';
import { SCREENS, announceFor, titleFor } from '../content/shell.js';
import type { ScreenName } from '../content/types.js';
import type { Screen } from './screen.js';
import {
  ALL_SCREENS,
  LINEAR_PATH,
  REFERENCE_PATH,
  isBuilt,
  isLinear,
  isReference,
  ordinalOf,
  screenKey,
} from './screen.js';

const ALL_NAMES = Object.keys(SCREENS) as readonly ScreenName[];

describe('the screen union', () => {
  it('covers thirteen screens with eleven names', () => {
    expect(ALL_NAMES).toHaveLength(11);
    // Eleven names, of which round and rate render twice: the linear path is
    // eleven entries and the two reference screens sit outside it.
    expect(LINEAR_PATH).toHaveLength(11);
    expect(LINEAR_PATH.filter((s) => s.name === 'round')).toHaveLength(2);
    expect(LINEAR_PATH.filter((s) => s.name === 'rate')).toHaveLength(2);
    expect(REFERENCE_PATH).toHaveLength(2);
    expect(ALL_SCREENS).toHaveLength(13);
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
    for (const screen of REFERENCE_PATH) {
      expect(isLinear(screen), screen.name).toBe(false);
      expect(isReference(screen), screen.name).toBe(true);
    }
  });

  it('starts the flow at the intro and ends it at the live-Claude screen', () => {
    expect(LINEAR_PATH[0]).toEqual({ name: 'intro' });
    expect(LINEAR_PATH[LINEAR_PATH.length - 1]).toEqual({ name: 'encoded' });
  });

  it('has nothing left to rebuild', () => {
    // All thirteen render. `encoded` was the last one outstanding and arrived with
    // the endpoint in #18 — shipped dark, so it renders its "available on request"
    // copy rather than calling a model. Built and switched off is still built.
    //
    // This assertion is worth keeping now that it is empty: it fails the moment a
    // screen is added to the union without being added to BUILT, which would put a
    // stub back into the flow silently.
    expect(ALL_SCREENS.filter((s) => !isBuilt(s))).toEqual([]);
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
    // The history codec identifies an entry by this key, so a collision would send
    // a reader pressing Back to the wrong screen.
    const screens: readonly Screen[] = ALL_SCREENS;
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
