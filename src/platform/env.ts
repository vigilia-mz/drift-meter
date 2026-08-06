/**
 * Build-time configuration.
 *
 * `VITE_REFLECT_ENDPOINT` is the public URL of the serverless function that
 * holds the Anthropic API key. It is compiled into the client bundle and is
 * meant to be public; the key itself lives in that function's environment and
 * never appears in this repository (CLAUDE.md rule 2).
 *
 * An empty value is the committed default and is not a misconfiguration — it is
 * the dark state. Every clone and fork therefore makes no network calls and
 * cannot spend anyone's API credit, and the instrument renders its
 * "available on request" copy instead.
 */

/**
 * Normalise a raw endpoint value into either a usable URL or `null`.
 *
 * Returning `null` rather than an empty string is deliberate: it makes the dark
 * state a distinct case the type system forces callers to handle, instead of a
 * falsy string that can be passed to `fetch` by accident.
 */
export function parseEndpoint(raw: string | undefined): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  return trimmed;
}

export const REFLECT_ENDPOINT: string | null = parseEndpoint(import.meta.env.VITE_REFLECT_ENDPOINT);

/** True when the live-Claude features can be reached at all. */
export const IS_LIVE_CLAUDE_CONFIGURED: boolean = REFLECT_ENDPOINT !== null;
