import { describe, expect, it } from 'vitest';
import { mulberry32, seedFromString } from '../platform/rng.js';
import type { Rng } from '../platform/rng.js';
import { ARM_KEYS, type AssignmentConfig, condFor, randomAssignment } from './assignment.js';

const FREE: AssignmentConfig = { order: 'randomised', slate: 'randomised', arm: 'randomised' };

/** An Rng that records how many values were consumed. */
function counting(values: readonly number[]): Rng & { readonly used: () => number } {
  let i = 0;
  return {
    next: () => values[i++] ?? 0,
    used: () => i,
  };
}

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 10; i++) expect(a.next()).toBe(b.next());
  });

  it('produces different streams for different seeds', () => {
    expect(mulberry32(1).next()).not.toBe(mulberry32(2).next());
  });

  it('stays inside [0, 1)', () => {
    const rng = mulberry32(seedFromString('drift'));
    for (let i = 0; i < 5000; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('seedFromString', () => {
  it('is stable, so a demonstration link keeps meaning the same thing', () => {
    expect(seedFromString('bednets')).toBe(seedFromString('bednets'));
    expect(seedFromString('bednets')).not.toBe(seedFromString('chlorination'));
  });

  it('returns a non-negative 32-bit integer', () => {
    for (const s of ['', 'a', 'drift meter', '42']) {
      const seed = seedFromString(s);
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(2 ** 32);
    }
  });
});

describe('randomAssignment', () => {
  it('reaches all twelve assignment cells, none of them rare', () => {
    // 2 orders × 2 slates × 3 arms. Seeded, so this cannot flake.
    const rng = mulberry32(20260806);
    const seen = new Map<string, number>();
    const DRAWS = 12000;
    for (let i = 0; i < DRAWS; i++) {
      const a = randomAssignment(rng, FREE);
      const key = `${String(a.assistedFirst)}|${a.assistedSlate}|${a.armKey}`;
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    expect(seen.size).toBe(12);
    // Expected 1000 each. A generous floor still catches a broken draw.
    for (const [key, count] of seen) expect(count, key).toBeGreaterThan(500);
  });

  it('draws order and slate independently', () => {
    // This is what v0.2 got wrong: assistance, practice and case difficulty all
    // varied together. If these two were coupled, one of the four combinations
    // would be missing.
    const rng = mulberry32(7);
    const pairs = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const a = randomAssignment(rng, FREE);
      pairs.add(`${String(a.assistedFirst)}|${a.assistedSlate}`);
    }
    expect(pairs.size).toBe(4);
  });

  it('honours a pinned order, slate and arm', () => {
    const rng = mulberry32(1);
    const a = randomAssignment(rng, {
      order: 'assisted-first',
      slate: 'B',
      arm: 'human',
    });
    expect(a).toEqual({ assistedFirst: true, assistedSlate: 'B', armKey: 'human' });

    const b = randomAssignment(mulberry32(1), {
      order: 'unassisted-first',
      slate: 'A',
      arm: 'ai',
    });
    expect(b).toEqual({ assistedFirst: false, assistedSlate: 'A', armKey: 'ai' });
  });

  it('consumes a fixed, documented number of draws', () => {
    // The slate draw always happens; the other two happen only when unpinned. If
    // this changed, an existing seeded link would silently start meaning something
    // else.
    const free = counting([0.1, 0.9, 0.8]);
    randomAssignment(free, FREE);
    expect(free.used()).toBe(3);

    const pinnedOrder = counting([0.1, 0.9, 0.8]);
    randomAssignment(pinnedOrder, { ...FREE, order: 'assisted-first' });
    expect(pinnedOrder.used()).toBe(2);

    const allPinned = counting([0.1, 0.9, 0.8]);
    randomAssignment(allPinned, { order: 'assisted-first', slate: 'A', arm: 'ai' });
    expect(allPinned.used()).toBe(1);
  });

  it('never returns an arm outside the three', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 2000; i++) {
      expect(ARM_KEYS).toContain(randomAssignment(rng, FREE).armKey);
    }
  });
});

describe('condFor', () => {
  it('maps rounds to conditions in the drawn order', () => {
    const first = { assistedFirst: true, assistedSlate: 'A', armKey: 'ai' } as const;
    expect(condFor(first, 1)).toBe('assisted');
    expect(condFor(first, 2)).toBe('unassisted');

    const second = { assistedFirst: false, assistedSlate: 'A', armKey: 'ai' } as const;
    expect(condFor(second, 1)).toBe('unassisted');
    expect(condFor(second, 2)).toBe('assisted');
  });

  it('always shows each condition exactly once', () => {
    for (const assistedFirst of [true, false]) {
      const a = { assistedFirst, assistedSlate: 'B', armKey: 'human' } as const;
      expect(new Set([condFor(a, 1), condFor(a, 2)]).size).toBe(2);
    }
  });
});
