/**
 * Randomised assignment.
 *
 * Three independent draws, and the independence is the design:
 *
 * 1. **Condition order** — half the readers meet the supplied estimate first.
 *    Counterbalanced so that practice and fatigue do not line up with the
 *    condition of interest.
 * 2. **Which slate is assisted** — drawn separately from order, so case difficulty
 *    cannot masquerade as a condition effect. This is what v0.2 got wrong:
 *    assistance, practice and the cases themselves all varied at once.
 * 3. **Attribution arm** — uniform over three. The number, the prose and the
 *    recommendation are identical in all three; only the authority attached to
 *    them changes. Without the human-attributed and unattributed arms, any drop in
 *    scrutiny could just as easily be deference to a supplied figure as anything
 *    about AI.
 */

import type { ArmKey, Condition, SlateId } from '../content/types.js';
import type { Rng } from '../platform/rng.js';

export interface Assignment {
  readonly assistedFirst: boolean;
  readonly assistedSlate: SlateId;
  readonly armKey: ArmKey;
}

/** What a run parameter may pin. `'randomised'` leaves the draw alone. */
export interface AssignmentConfig {
  readonly order: 'randomised' | 'assisted-first' | 'unassisted-first';
  readonly slate: 'randomised' | SlateId;
  readonly arm: 'randomised' | ArmKey;
}

export const ARM_KEYS: readonly ArmKey[] = ['ai', 'human', 'unlabelled'];

/**
 * Draw an assignment.
 *
 * Draw order matters and is part of the contract: `assistedSlate` always consumes
 * a value, while `assistedFirst` and `armKey` consume one only when they are not
 * pinned. A seeded demonstration link would otherwise change meaning as soon as
 * another parameter was added to it.
 */
export function randomAssignment(rng: Rng, config: AssignmentConfig): Assignment {
  const COIN = 0.5;

  const assistedFirst =
    config.order === 'assisted-first'
      ? true
      : config.order === 'unassisted-first'
        ? false
        : rng.next() < COIN;

  const drawnSlate: SlateId = rng.next() < COIN ? 'A' : 'B';
  const assistedSlate = config.slate === 'randomised' ? drawnSlate : config.slate;

  const armKey =
    config.arm === 'randomised'
      ? (ARM_KEYS[Math.floor(rng.next() * ARM_KEYS.length)] ?? 'unlabelled')
      : config.arm;

  return { assistedFirst, assistedSlate, armKey };
}

/** Which condition a given round shows. */
export function condFor(assignment: Assignment, ordinal: 1 | 2): Condition {
  const first: Condition = assignment.assistedFirst ? 'assisted' : 'unassisted';
  const second: Condition = assignment.assistedFirst ? 'unassisted' : 'assisted';
  return ordinal === 1 ? first : second;
}
