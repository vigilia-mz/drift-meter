/**
 * The signature on the repair channel.
 *
 * `repair` is the endpoint's only free-text field, and it exists to take back an
 * answer the endpoint itself produced. So it is authenticated rather than
 * trusted: `teach` returns an HMAC over the result it generated, and `repair`
 * recomputes and compares before spending a call. CLAUDE.md rule 4 requires both
 * halves, and requires the comparison to be constant-time.
 *
 * WHAT THIS PREVENTS, AND WHAT IT DOES NOT. It prevents a caller putting their
 * own text through the repair prompt: without a signature over bytes the endpoint
 * produced, "rewrite this" is a general-purpose completion API spending the
 * author's credit. It does not authenticate the *requester* — anyone holding a
 * teach response holds a valid signature for it, and can replay that one repair
 * as often as the rate limiter allows. That is the intended shape. The thing being
 * protected is the prompt's contents, not the reader's identity, and there is no
 * identity here to protect: the consent screen promises no account and no
 * identifier, so an authenticated *user* is not available and is not wanted.
 *
 * WebCrypto rather than `node:crypto`, because the endpoint runs on an edge
 * runtime where `node:crypto` may not exist and `crypto.subtle` always does. It
 * is also what lets this file be tested under the existing Vitest config with no
 * platform shim: Node has had the same global since 18.
 */

import { canonicalTeachResult } from './api-contract.js';
import type { TeachResult } from './api-contract.js';

/** The name of the environment variable holding the signing key. Never a default. */
export const SIGNING_KEY_VAR = 'REFLECT_SIGNING_KEY';

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const;

/** SHA-256 is 32 bytes, so a hex signature is always exactly this long. */
const SIGNATURE_HEX_LENGTH = 64;

async function importKey(secret: string, usage: readonly KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), ALGORITHM, false, [
    ...usage,
  ]);
}

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hex back to bytes, or `null`.
 *
 * `null` rather than a throw or a partial parse: a signature that is the wrong
 * length or carries a character outside the alphabet is not a signature, and the
 * caller's job is to fail closed rather than to compare something it made up.
 */
function fromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (hex.length !== SIGNATURE_HEX_LENGTH) return null;
  if (!/^[0-9a-f]+$/.test(hex)) return null;
  // Backed by an explicit ArrayBuffer: `crypto.subtle.verify` takes a
  // BufferSource, which a Uint8Array over a SharedArrayBuffer does not satisfy.
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2));
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Sign a teach result. The bytes signed are `canonicalTeachResult`, not the object. */
export async function signTeachResult(secret: string, result: TeachResult): Promise<string> {
  const key = await importKey(secret, ['sign']);
  const data = new TextEncoder().encode(canonicalTeachResult(result));
  return toHex(await crypto.subtle.sign(ALGORITHM.name, key, data));
}

/**
 * Whether a signature is the one this key would have produced for this result.
 *
 * `crypto.subtle.verify` rather than recomputing and comparing strings. A string
 * comparison returns on the first differing byte, which leaks how much of a
 * guess was right and turns forging a signature into sixty-four cheap questions
 * instead of one impossible one. The platform's verify is constant-time by
 * contract, which is the property rule 4 asks for, and it is better to use the
 * primitive that has it than to hand-roll a loop that looks like it does.
 *
 * Fails closed on every unusable input: a malformed signature, an empty key, or a
 * result whose shape does not serialise. There is no path here that answers
 * "true" by default.
 */
export async function verifyTeachResult(
  secret: string,
  result: TeachResult,
  signature: string,
): Promise<boolean> {
  if (secret === '') return false;
  const bytes = fromHex(signature);
  if (bytes === null) return false;
  const key = await importKey(secret, ['verify']);
  const data = new TextEncoder().encode(canonicalTeachResult(result));
  return crypto.subtle.verify(ALGORITHM.name, key, bytes, data);
}
