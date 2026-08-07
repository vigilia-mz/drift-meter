/**
 * The run parameters, read from the URL.
 *
 * `?seed=`, `?order=`, `?slate=` and `?arm=` pin what would otherwise be drawn.
 * These are a product feature rather than test scaffolding: they are how a
 * demonstration link shows one specific run, and five such knobs shipped as
 * author-facing props in the original build. There is deliberately no
 * `window.__TEST__` and no `import.meta.env.MODE` branch anywhere in the
 * application — tests drive these the same way a reader would.
 *
 * Parsing is pure and takes a query string, so it is testable with no DOM.
 * `runConfigFromLocation` is the only part that touches the browser.
 *
 * Every pin is also recorded in `forced`, because a pinned run is not a
 * counterbalanced one and the debrief has to say so. An instrument about
 * unearned confidence cannot misreport its own randomisation.
 */

import type { ArmKey, SlateId } from '../content/types.js';
import { ARM_KEYS } from '../domain/assignment.js';
import type { AssignmentConfig } from '../domain/assignment.js';
import type { Forced } from '../state/run.js';
import type { Rng } from './rng.js';
import { cryptoRng, mulberry32, seedFromString } from './rng.js';

export interface RunConfig {
  /** What to pin and what to draw. Handed straight to `randomAssignment`. */
  readonly assignment: AssignmentConfig;
  /** Which parts were pinned, for disclosure on the page. */
  readonly forced: Forced;
  /** The seed, if one was given. `null` means use real entropy. */
  readonly seed: number | null;
}

const ORDERS: readonly AssignmentConfig['order'][] = ['assisted-first', 'unassisted-first'];
const SLATE_IDS: readonly SlateId[] = ['A', 'B'];

/**
 * Parse a query string into a run configuration.
 *
 * Unrecognised values fall back to `'randomised'` rather than throwing or
 * half-applying. A typo in a demonstration link should produce an ordinary
 * randomised run, not a broken one — and, because it was not in fact pinned, the
 * disclosure must not claim it was.
 */
export function parseRunConfig(search: string): RunConfig {
  const params = new URLSearchParams(search);

  const rawOrder = params.get('order');
  const order = ORDERS.find((o) => o === rawOrder) ?? 'randomised';

  const rawSlate = params.get('slate')?.toUpperCase();
  const slate = SLATE_IDS.find((s) => s === rawSlate) ?? 'randomised';

  const rawArm = params.get('arm');
  const arm = ARM_KEYS.find((a) => a === rawArm) ?? 'randomised';

  const rawSeed = params.get('seed');
  const seed = rawSeed === null || rawSeed === '' ? null : seedFromString(rawSeed);

  return {
    assignment: { order, slate, arm },
    forced: {
      order: order !== 'randomised',
      slate: slate !== 'randomised',
      arm: arm !== 'randomised',
    },
    seed,
  };
}

/**
 * The generator a run should draw from.
 *
 * A seeded run is reproducible; an unseeded one uses the platform CSPRNG,
 * because real participants get real randomness.
 */
export function rngFor(config: RunConfig): Rng {
  return config.seed === null ? cryptoRng : mulberry32(config.seed);
}

/** The browser-facing entry point. The only part of this module that is not pure. */
export function runConfigFromLocation(): RunConfig {
  return parseRunConfig(window.location.search);
}

/** Re-exported so callers do not need a second import to name an arm. */
export type { ArmKey };
