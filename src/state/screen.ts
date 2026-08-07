/**
 * Which screen is showing.
 *
 * Eleven names cover thirteen screens, because `round` and `rate` each render
 * twice and carry an ordinal instead of existing as four separate members. That
 * collapse is the point of the union: the original build had four code paths for
 * what is one screen asked twice, and keeping them apart is how an assisted-round
 * fix fails to reach the control round.
 *
 * The ordinal is the round number, never the condition. `condFor()` in
 * `src/domain/assignment.ts` is the only translation from one to the other, so
 * that a run drawn unassisted-first cannot quietly render its rounds in the
 * drawn-for order.
 */

import type { ScreenName } from '../content/types.js';

/** The round number. Not the condition — see `condFor`. */
export type Ordinal = 1 | 2;

export type Screen =
  | { readonly name: 'intro' }
  | { readonly name: 'consent' }
  | { readonly name: 'round'; readonly ordinal: Ordinal }
  | { readonly name: 'rate'; readonly ordinal: Ordinal }
  | { readonly name: 'debrief' }
  | { readonly name: 'transfer' }
  | { readonly name: 'round3' }
  | { readonly name: 'spec' }
  | { readonly name: 'encoded' }
  | { readonly name: 'method' }
  | { readonly name: 'process' };

/** The first screen of a session. */
export const INTRO_SCREEN: Screen = { name: 'intro' };

/**
 * The ordinal a screen carries, if it carries one.
 *
 * Returns `undefined` rather than defaulting to 1, so that a caller which forgets
 * to handle the two-round screens gets nothing instead of silently getting round
 * one's copy on round two.
 */
export function ordinalOf(screen: Screen): Ordinal | undefined {
  return screen.name === 'round' || screen.name === 'rate' ? screen.ordinal : undefined;
}

/**
 * A stable identity for a screen, for the focus and title effect.
 *
 * Rounds one and two share a name. An effect keyed on the name alone does not
 * re-fire between them, which would leave a keyboard user unannounced at the
 * single most important transition in the run — so the ordinal is part of the
 * key.
 */
export function screenKey(screen: Screen): string {
  const ordinal = ordinalOf(screen);
  return ordinal === undefined ? screen.name : `${screen.name}:${String(ordinal)}`;
}

/**
 * The linear path through the instrument, in order.
 *
 * `method` and `process` are absent on purpose: they are reference screens
 * reachable from the intro and the debrief rather than steps, and they are the
 * only two that get a history entry.
 */
export const LINEAR_PATH: readonly Screen[] = [
  { name: 'intro' },
  { name: 'consent' },
  { name: 'round', ordinal: 1 },
  { name: 'rate', ordinal: 1 },
  { name: 'round', ordinal: 2 },
  { name: 'rate', ordinal: 2 },
  { name: 'debrief' },
  { name: 'transfer' },
  { name: 'round3' },
  { name: 'spec' },
  { name: 'encoded' },
];

/** The two screens outside the linear path. */
export const REFERENCE_PATH: readonly Screen[] = [{ name: 'method' }, { name: 'process' }];

/**
 * Every screen the instrument can show, in one list.
 *
 * The history codec matches a stored entry against this rather than reassembling
 * a `Screen` from a name and an ordinal, so a malformed entry — a round with no
 * ordinal, an intro carrying one — finds no match and is rejected instead of
 * producing a screen that is not in the union.
 */
export const ALL_SCREENS: readonly Screen[] = [...LINEAR_PATH, ...REFERENCE_PATH];

/** Whether a screen is a step in the run rather than a reference screen. */
export function isLinear(screen: Screen): boolean {
  return LINEAR_PATH.some((s) => screenKey(s) === screenKey(screen));
}

/** Reference screens get a history entry; steps in a run do not. */
export function isReference(screen: Screen): boolean {
  return screen.name === 'method' || screen.name === 'process';
}

/**
 * The screens the rebuild has actually reached. Everything else renders a stub
 * that says so rather than an empty page.
 *
 * `encoded` is the last one outstanding: it is the live-Claude screen, and it
 * arrives with the endpoint in `#18`.
 */
const BUILT: readonly ScreenName[] = [
  'intro',
  'consent',
  'round',
  'rate',
  'debrief',
  'transfer',
  'round3',
  'spec',
  'method',
  'process',
];

export function isBuilt(screen: Screen): boolean {
  return BUILT.includes(screen.name);
}
