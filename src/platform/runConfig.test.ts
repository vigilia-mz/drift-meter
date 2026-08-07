import { describe, expect, it } from 'vitest';
import { ARM_KEYS, randomAssignment } from '../domain/assignment.js';
import { parseRunConfig, rngFor } from './runConfig.js';

/**
 * These parameters are a product feature, so they are tested as one. The
 * disclosure half matters most: `forced` is what stops the debrief calling a
 * pinned run counterbalanced, and a parameter that silently failed to apply
 * while still setting `forced` would produce exactly the misreport the
 * disclosure exists to prevent.
 */

describe('parseRunConfig', () => {
  it('randomises everything when the URL says nothing', () => {
    const config = parseRunConfig('');
    expect(config.assignment).toEqual({
      order: 'randomised',
      slate: 'randomised',
      arm: 'randomised',
    });
    expect(config.forced).toEqual({ order: false, slate: false, arm: false });
    expect(config.seed).toBeNull();
  });

  it('pins each parameter it recognises', () => {
    const config = parseRunConfig('?order=unassisted-first&slate=B&arm=human');
    expect(config.assignment).toEqual({
      order: 'unassisted-first',
      slate: 'B',
      arm: 'human',
    });
    expect(config.forced).toEqual({ order: true, slate: true, arm: true });
  });

  it('accepts a slate in either case, since a URL is typed by hand', () => {
    expect(parseRunConfig('?slate=b').assignment.slate).toBe('B');
    expect(parseRunConfig('?slate=A').assignment.slate).toBe('A');
  });

  it('accepts every arm the domain layer knows about', () => {
    for (const arm of ARM_KEYS) {
      expect(parseRunConfig(`?arm=${arm}`).assignment.arm).toBe(arm);
    }
  });

  it('falls back to randomised on an unrecognised value', () => {
    const config = parseRunConfig('?order=sideways&slate=Q&arm=nobody');
    expect(config.assignment).toEqual({
      order: 'randomised',
      slate: 'randomised',
      arm: 'randomised',
    });
  });

  it('does not claim a run was pinned when the parameter was a typo', () => {
    // The disclosure has to describe the draw that happened, not the one asked
    // for. A typo produces an ordinary randomised run and must say so.
    expect(parseRunConfig('?order=sideways').forced.order).toBe(false);
    expect(parseRunConfig('?slate=Q').forced.slate).toBe(false);
    expect(parseRunConfig('?arm=nobody').forced.arm).toBe(false);
  });

  it('forced is true for exactly the parameters that applied', () => {
    const config = parseRunConfig('?slate=A&arm=nobody');
    expect(config.forced).toEqual({ order: false, slate: true, arm: false });
  });

  it('turns a word seed into a number, and treats an empty one as absent', () => {
    expect(parseRunConfig('?seed=bednets').seed).toBeTypeOf('number');
    expect(parseRunConfig('?seed=').seed).toBeNull();
    expect(parseRunConfig('').seed).toBeNull();
  });

  it('ignores parameters it does not know', () => {
    const config = parseRunConfig('?utm_source=newsletter&slate=B');
    expect(config.assignment.slate).toBe('B');
  });
});

describe('a seeded run is reproducible', () => {
  it('draws the same assignment twice from the same seed', () => {
    const config = parseRunConfig('?seed=bednets');
    const first = randomAssignment(rngFor(config), config.assignment);
    const second = randomAssignment(rngFor(config), config.assignment);
    expect(first).toEqual(second);
  });

  it('draws differently from different seeds, over a spread of them', () => {
    const drawn = new Set(
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((word) => {
        const config = parseRunConfig(`?seed=${word}`);
        return JSON.stringify(randomAssignment(rngFor(config), config.assignment));
      }),
    );
    expect(drawn.size).toBeGreaterThan(1);
  });

  it('honours a pin even when a seed would have drawn otherwise', () => {
    for (const word of ['a', 'b', 'c', 'd']) {
      const config = parseRunConfig(`?seed=${word}&slate=B&order=assisted-first&arm=human`);
      const assign = randomAssignment(rngFor(config), config.assignment);
      expect(assign).toEqual({ assistedFirst: true, assistedSlate: 'B', armKey: 'human' });
    }
  });
});
