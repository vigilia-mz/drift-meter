import { describe, expect, it } from 'vitest';
import { nextRadioIndex, rovingTabIndex } from './radio.js';

/**
 * This primitive is used five times, so a wrong key map is wrong in five places.
 * The arithmetic is tested here rather than through the component because the
 * Vitest config collects `.test.ts` files under `src` only — a `.test.tsx`
 * beside the component would pass by never running, which on this project would
 * be a confident false green about accessibility.
 */

const COUNT = 3;

describe('nextRadioIndex', () => {
  it('moves forward on both forward keys, and wraps', () => {
    for (const key of ['ArrowRight', 'ArrowDown']) {
      expect(nextRadioIndex(key, 0, COUNT)).toBe(1);
      expect(nextRadioIndex(key, 1, COUNT)).toBe(2);
      expect(nextRadioIndex(key, 2, COUNT)).toBe(0);
    }
  });

  it('moves backward on both backward keys, and wraps', () => {
    for (const key of ['ArrowLeft', 'ArrowUp']) {
      expect(nextRadioIndex(key, 2, COUNT)).toBe(1);
      expect(nextRadioIndex(key, 1, COUNT)).toBe(0);
      expect(nextRadioIndex(key, 0, COUNT)).toBe(2);
    }
  });

  it('enters an untouched group at an end rather than in the middle', () => {
    // Nothing selected is the starting state of every group in the instrument.
    expect(nextRadioIndex('ArrowRight', -1, COUNT)).toBe(0);
    expect(nextRadioIndex('ArrowDown', -1, COUNT)).toBe(0);
    expect(nextRadioIndex('ArrowLeft', -1, COUNT)).toBe(COUNT - 1);
    expect(nextRadioIndex('ArrowUp', -1, COUNT)).toBe(COUNT - 1);
  });

  it('jumps to the ends on Home and End', () => {
    expect(nextRadioIndex('Home', 2, COUNT)).toBe(0);
    expect(nextRadioIndex('End', 0, COUNT)).toBe(COUNT - 1);
  });

  it('lets Space choose the focused option, and do nothing when none is focused', () => {
    for (const key of [' ', 'Spacebar']) {
      expect(nextRadioIndex(key, 1, COUNT)).toBe(1);
      expect(nextRadioIndex(key, -1, COUNT)).toBeNull();
    }
  });

  it('returns null for keys it does not claim, so Tab is not swallowed', () => {
    for (const key of ['Tab', 'Enter', 'Escape', 'a', 'PageDown']) {
      expect(nextRadioIndex(key, 0, COUNT)).toBeNull();
    }
  });

  it('returns null for an empty group rather than an index into nothing', () => {
    for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End', ' ']) {
      expect(nextRadioIndex(key, -1, 0)).toBeNull();
    }
  });

  it('always returns an index inside the group', () => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End', ' '];
    for (let count = 1; count <= 6; count++) {
      for (let current = -1; current < count; current++) {
        for (const key of keys) {
          const next = nextRadioIndex(key, current, count);
          if (next === null) continue;
          expect(next).toBeGreaterThanOrEqual(0);
          expect(next).toBeLessThan(count);
        }
      }
    }
  });
});

describe('rovingTabIndex', () => {
  it('gives exactly one option the tab stop, whatever is selected', () => {
    for (let selected = -1; selected < COUNT; selected++) {
      const stops = Array.from({ length: COUNT }, (_, i) => rovingTabIndex(i, selected)).filter(
        (t) => t === 0,
      );
      expect(stops, `selected=${String(selected)}`).toHaveLength(1);
    }
  });

  it('puts the tab stop on the selection once there is one', () => {
    expect(rovingTabIndex(1, 1)).toBe(0);
    expect(rovingTabIndex(0, 1)).toBe(-1);
  });

  it('puts it on the first option while nothing is selected, so the group is reachable', () => {
    expect(rovingTabIndex(0, -1)).toBe(0);
    expect(rovingTabIndex(1, -1)).toBe(-1);
  });
});
