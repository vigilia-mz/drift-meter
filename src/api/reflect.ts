/**
 * The client half. Knows a URL and a contract, and nothing else.
 *
 * There is no key here and there is no path to one: `REFLECT_ENDPOINT` is a
 * `VITE_*` variable, compiled into the bundle and public by construction, and the
 * key lives in the endpoint's own environment (CLAUDE.md rule 2).
 *
 * THE DARK STATE IS THE DEFAULT AND IS NOT AN ERROR. `VITE_REFLECT_ENDPOINT` is
 * empty in the committed `.env`, so every clone and fork reaches this module,
 * finds no endpoint, and returns `unconfigured` without touching the network. The
 * screen then renders its "available on request" copy. That is why the return type
 * is a union with `unconfigured` in it rather than a promise that rejects: a fork
 * being dark is a state the compiler makes callers handle, not a failure they can
 * forget to catch.
 */

import type {
  RepairResponse,
  RubricResult,
  TeachResponse,
  TeachResult,
} from '../../shared/api-contract.js';
import type { TeachQuestionId } from '../../shared/teach.js';
import type { Rec } from '../content/types.js';
import { REFLECT_ENDPOINT } from '../platform/env.js';

/**
 * What a call can come back as.
 *
 * `refused` is its own case rather than an error. The model declining is a real
 * outcome of asking a model something, and the screen says so plainly instead of
 * showing a reader a failure that implies something broke.
 */
export type Outcome<T> =
  | { readonly kind: 'ok'; readonly value: T }
  | { readonly kind: 'unconfigured' }
  | { readonly kind: 'refused'; readonly category: string }
  | { readonly kind: 'error'; readonly message: string };

/** Long enough for three sequential model calls, short enough to give up on. */
const TIMEOUT_MS = 120_000;

async function send<T>(body: unknown): Promise<Outcome<T>> {
  if (REFLECT_ENDPOINT === null) return { kind: 'unconfigured' };

  // An abort rather than a hung promise: a reader who has been staring at a
  // spinner for two minutes is owed a sentence, not more spinner.
  const abort = new AbortController();
  const timer = setTimeout(() => {
    abort.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(REFLECT_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: abort.signal,
    });

    const parsed: unknown = await response.json().catch(() => null);
    const asError = parsed as { error?: unknown; refusal?: unknown } | null;

    if (typeof asError?.refusal === 'string') {
      return { kind: 'refused', category: asError.refusal };
    }
    if (!response.ok) {
      return {
        kind: 'error',
        message: typeof asError?.error === 'string' ? asError.error : 'The endpoint refused that.',
      };
    }
    if (parsed === null)
      return { kind: 'error', message: 'The endpoint sent something unreadable.' };
    return { kind: 'ok', value: parsed as T };
  } catch {
    // One message for every transport failure. The client cannot tell a DNS
    // failure from a dropped connection from a timeout, and inventing a
    // distinction for the reader would be guessing on their behalf.
    return { kind: 'error', message: 'The endpoint could not be reached.' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ask the question under the four rules, and get the unruled answer beside it.
 *
 * Three calls happen on the other side of this, which is why it is slow and why
 * the screen says so before the reader presses anything.
 */
export function requestTeach(
  questionId: TeachQuestionId,
  read: Rec,
): Promise<Outcome<TeachResponse>> {
  return send<TeachResponse>({ mode: 'teach', questionId, read });
}

/**
 * Send back the result the endpoint produced, with the signature it returned.
 *
 * The signature is not optional and is not something this module computes — it
 * cannot, and that is the point. It is opaque here: received from `teach`, held,
 * and handed back untouched.
 */
export function requestRepair(
  result: TeachResult,
  signature: string,
): Promise<Outcome<RepairResponse>> {
  return send<RepairResponse>({ mode: 'repair', result, signature });
}

/** How many rubric items passed. The screen prints this before and after a repair. */
export function passCount(rubric: readonly RubricResult[]): number {
  return rubric.filter((item) => item.pass).length;
}
