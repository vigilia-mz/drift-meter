/**
 * Randomness, injected rather than global.
 *
 * `Math.random` is banned everywhere else by an ESLint rule. Assignment takes an
 * `Rng`, which makes it deterministic under test and drivable from a URL parameter
 * for demonstrations — without a test-only branch anywhere in the application.
 *
 * This is the one file allowed to reach for a source of entropy.
 */

/** A source of uniform values in [0, 1). */
export interface Rng {
  next(): number;
}

/**
 * mulberry32 — a small, fast, well-distributed 32-bit PRNG.
 *
 * Used for seeded runs. Not cryptographic, and does not need to be: it decides
 * which of two case slates a reader sees.
 */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0;
  return {
    next(): number {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

/** Turn an arbitrary string into a seed, so `?seed=bednets` works. */
export function seedFromString(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * The production source: the platform's CSPRNG.
 *
 * Real participants get real randomness. `crypto.getRandomValues` is available in
 * every browser this site supports.
 */
export const cryptoRng: Rng = {
  next(): number {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return (buf[0] ?? 0) / 4294967296;
  },
};
