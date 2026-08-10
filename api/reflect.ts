/**
 * The endpoint that holds the Anthropic API key.
 *
 * It never reaches the browser. `VITE_*` variables are compiled into the client
 * and are public by construction — the endpoint's URL belongs there, the key never
 * does (CLAUDE.md rule 2). The key is read from this function's own environment,
 * server-side, and nothing derived from it is returned to a caller.
 *
 * PORTABLE, PLUS ONE ADAPTER. `handleReflect` is a plain
 * `(Request, ReflectEnv) => Promise<Response>` over Web-standard types, so the
 * host is a swappable detail rather than a dependency: it runs unchanged on a
 * Cloudflare Worker, a Vercel edge function, Deno, or `node --experimental-*`
 * behind any adapter that hands it a `Request`. The default export at the bottom
 * is the Worker adapter and is the only host-specific line in the file.
 *
 * WHAT MAKES THIS AN EXPENSIVE BUTTON RATHER THAN AN OPEN PROXY. Four things, and
 * CLAUDE.md rule 4 requires all four:
 *
 *   1. `TEACH_QUESTIONS` is the complete set of questions it will answer. The
 *      client sends an id; the prompt is built here from what that id names.
 *   2. `sanitizeReflect` rebuilds the reflect payload from a known key list,
 *      coercing every value to a bounded number or a fixed label.
 *   3. `repair` — the one free-text channel — is authenticated. `teach` returns an
 *      HMAC over the result it produced; `repair` recomputes and compares in
 *      constant time before spending a call.
 *   4. `ALLOWED_ORIGINS` holds exactly the published site, and the rate limits
 *      below cap what any one caller can spend in a window.
 *
 * The origin check is the weakest of the four and is not load-bearing on its own:
 * `Origin` is a header, and a header can be forged by anything that is not a
 * browser. It stops a page on another site from spending the author's credit with
 * a reader's origin attached. The other three are what stop everything else.
 *
 * THE MODEL IS PINNED AND THERE IS NO FALLBACK. `PINNED_MODEL` is the only model
 * this endpoint will call. The API's `fallbacks` parameter would re-run a declined
 * request on a different model and return its answer, which is the right default
 * for most applications and the wrong one here: the ID the API returns is printed
 * on the page as the provenance record, and a silent substitution would make the
 * instrument's results incomparable while still looking like one series. A refusal
 * is reported as a refusal. See CLAUDE.md rule 3 and the PRIMARY row in SOURCES.md.
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  ALLOWED_ORIGINS,
  MAX_BODY_BYTES,
  MODE_COST,
  parseTeachResult,
  sanitizeReflect,
} from '../shared/api-contract.js';
import type {
  ReflectMode,
  ReflectSummary,
  RubricResult,
  TeachResult,
} from '../shared/api-contract.js';
import { PINNED_MODEL } from '../shared/model.js';
import { RUBRIC_ITEMS, RUBRIC_ITEM_IDS, isRec, teachQuestion } from '../shared/teach.js';
import type { RubricItemId } from '../shared/teach.js';
import { signTeachResult, verifyTeachResult } from '../shared/hmac.js';
import { GRADER_SYSTEM } from '../src/prompts/grader-system.js';
import { REPAIR_SYSTEM } from '../src/prompts/repair-system.js';
import { TEACH_SYSTEM } from '../src/prompts/teach-system.js';

/** What the host must supply. Both are secrets and neither has a default. */
export interface ReflectEnv {
  readonly ANTHROPIC_API_KEY?: string;
  readonly REFLECT_SIGNING_KEY?: string;
}

/**
 * Output caps, per mode.
 *
 * These had to go up. The original shipped 320, 420 and 400, sized for a model
 * where `max_tokens` capped visible text; on the pinned model thinking is on by
 * default and `max_tokens` caps thinking *plus* the response, so the old numbers
 * would spend the budget reasoning and truncate the answer mid-sentence.
 *
 * Sized as visible answer plus headroom. A teach answer that leads with an
 * interval, names a driver and states a disagreement runs 300–500 tokens; the
 * grader returns four verdicts and four one-sentence reasons, call it 250; a
 * repair rewrite is the teach answer again. The rest is room for adaptive
 * thinking at `effort: 'low'`, which is where this is run — deep reasoning is not
 * what the screen is demonstrating, and the rules are in the prompt rather than
 * something the model has to work out.
 *
 * Thinking is deliberately NOT disabled. On this model disabling it can put a
 * tool call into the visible text or leak a `<thinking>` tag into prose a reader
 * sees, and the screen prints the answer verbatim.
 */
const MAX_TOKENS: Readonly<Record<ReflectMode, number>> = {
  reflect: 2_000,
  teach: 4_000,
  repair: 4_000,
};

/** Adaptive thinking, kept shallow. The rules are given, not derived. */
const EFFORT = 'low' as const;

/**
 * The grader's schema, enforced at the API level.
 *
 * The original asked for JSON in prose and then regex-scraped the reply with
 * `match(/\{[\s\S]*\}/)`, which needed a parse-failure branch and sometimes took
 * it. Constraining the shape here removes both the regex and the branch — see #9.
 *
 * Written to the structured-output subset: `additionalProperties: false` on every
 * object, a `required` list on every object, and no numeric or string length
 * constraints, none of which that subset supports.
 */
const RUBRIC_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'pass', 'reason'],
        properties: {
          id: { type: 'string', enum: [...RUBRIC_ITEM_IDS] },
          pass: { type: 'boolean' },
          reason: { type: 'string' },
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Rate limits
// ---------------------------------------------------------------------------

/**
 * Best-effort, and the word is load-bearing.
 *
 * Instances are short-lived and parallel, so a counter in this module's memory
 * bounds one instance for as long as it happens to live. It is a courtesy against
 * a loop, not a budget. The real guarantees are the Anthropic console spend limit
 * and the per-workspace rate limits on the key, both of which live outside this
 * repository. Durable per-visitor and per-day budgets are #11, and until that
 * lands this is what there is — said here rather than implied by the presence of a
 * limiter.
 *
 * The key is the caller's IP, which is the only thing available: the consent
 * screen promises no cookie and no identifier, so there is no visitor to count.
 * Nothing is stored — the map is memory in a process that will be recycled, it is
 * never written anywhere, and it is never joined to run data.
 */
const WINDOW_MS = 60 * 60 * 1000;
const UNITS_PER_WINDOW = 12;
const UNITS_PER_INSTANCE_DAY = 400;

const spend = new Map<string, { units: number; resetAt: number }>();
let instanceUnits = 0;
let instanceResetAt = 0;

function withinBudget(caller: string, cost: number, now: number): boolean {
  if (now > instanceResetAt) {
    instanceUnits = 0;
    instanceResetAt = now + 24 * WINDOW_MS;
  }
  if (instanceUnits + cost > UNITS_PER_INSTANCE_DAY) return false;

  const entry = spend.get(caller);
  const live = entry !== undefined && now <= entry.resetAt ? entry : undefined;
  const used = live?.units ?? 0;
  if (used + cost > UNITS_PER_WINDOW) return false;

  spend.set(caller, { units: used + cost, resetAt: live?.resetAt ?? now + WINDOW_MS });
  instanceUnits += cost;

  // The map is bounded so a stream of distinct callers cannot grow it without
  // limit: anything expired goes on the next write.
  if (spend.size > 1_000) {
    for (const [key, value] of spend) if (now > value.resetAt) spend.delete(key);
  }
  return true;
}

/** Reset the in-process counters. Exported for the tests, never called in a request. */
export function resetBudgets(): void {
  spend.clear();
  instanceUnits = 0;
  instanceResetAt = 0;
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin !== null && ALLOWED_ORIGINS.includes(origin);
  return {
    'content-type': 'application/json',
    // Echoed only when it matched. A wildcard here would make the allowlist
    // decorative, and reflecting an unmatched origin would make it worse.
    ...(allowed ? { 'access-control-allow-origin': origin } : {}),
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

/**
 * A refusal to answer, in the same shape every time.
 *
 * The message is written for the reader, not for a log: it says what happened and
 * never carries an upstream body, a request id, a stack, or anything that would
 * describe the key or the account behind it.
 */
function fail(message: string, status: number, origin: string | null): Response {
  return json({ error: message }, status, origin);
}

// ---------------------------------------------------------------------------
// The model calls
// ---------------------------------------------------------------------------

/** The visible text of a response, joined. Thinking blocks are not text blocks. */
function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

class Refused extends Error {
  constructor(readonly category: string) {
    super('refused');
  }
}

class Truncated extends Error {}

/**
 * One call, with the two stop reasons that are not an answer handled first.
 *
 * `refusal` arrives as a successful HTTP 200 with an empty or partial body, so
 * reading `content` before checking would return a plausible fragment of a
 * response the model declined to give. `max_tokens` means the cap above was too
 * low for what was asked, which is a defect in this file rather than something to
 * show a reader as an answer.
 */
async function call(
  client: Anthropic,
  mode: ReflectMode,
  system: string | undefined,
  prompt: string,
  format?: Record<string, unknown>,
): Promise<{ text: string; model: string }> {
  const message = await client.messages.create({
    model: PINNED_MODEL,
    max_tokens: MAX_TOKENS[mode],
    // Omitted entirely for the baseline answer. "No rules at all" means no system
    // prompt, not a system prompt that says to have none.
    ...(system === undefined ? {} : { system }),
    messages: [{ role: 'user', content: prompt }],
    output_config:
      format === undefined
        ? { effort: EFFORT }
        : { effort: EFFORT, format: { type: 'json_schema', schema: format } },
  });

  if (message.stop_reason === 'refusal') {
    throw new Refused(message.stop_details?.category ?? 'unspecified');
  }
  if (message.stop_reason === 'max_tokens') throw new Truncated();

  return { text: textOf(message), model: message.model };
}

/** The grader's reply, parsed. The schema guarantees the shape; this checks it anyway. */
function parseRubric(raw: string): readonly RubricResult[] {
  const parsed: unknown = JSON.parse(raw);
  const items = (parsed as { items?: unknown }).items;
  if (!Array.isArray(items)) throw new Error('grader returned no items');
  const arrived: readonly unknown[] = items as readonly unknown[];

  return RUBRIC_ITEM_IDS.map((id: RubricItemId) => {
    const found = arrived.find((item) => (item as { id?: unknown }).id === id) as
      { pass?: unknown; reason?: unknown } | undefined;
    return {
      id,
      pass: found?.pass === true,
      reason: typeof found?.reason === 'string' ? found.reason : '',
    };
  });
}

function rubricPrompt(question: string, read: string, answer: string): string {
  return [
    'The question the assistant was asked:',
    question,
    '',
    `The read the reader committed to before seeing the answer: ${read}.`,
    '',
    'The answer to score:',
    answer,
  ].join('\n');
}

async function grade(
  client: Anthropic,
  mode: ReflectMode,
  question: string,
  read: string,
  answer: string,
): Promise<readonly RubricResult[]> {
  const graded = await call(
    client,
    mode,
    GRADER_SYSTEM,
    rubricPrompt(question, read, answer),
    RUBRIC_SCHEMA,
  );
  return parseRubric(graded.text);
}

function reflectPrompt(summary: ReflectSummary): string {
  // The summary is already rebuilt from a known key list, so this is the only
  // place it is turned into prose and there is nothing in it but numbers and
  // labels. Serialised rather than narrated: a template would be one more place
  // for a field to be described in words the sanitiser never saw.
  return [
    'A reader has completed both rounds of the instrument. Their measures follow, as JSON.',
    'Every figure is 0-100 unless its name says otherwise. `auto` is null in the round with no',
    'supplied estimate, because departure from a frame that was never supplied is undefined',
    'rather than zero — do not treat it as a low score.',
    '',
    JSON.stringify(summary, null, 2),
  ].join('\n');
}

// ---------------------------------------------------------------------------
// The handler
// ---------------------------------------------------------------------------

export async function handleReflect(request: Request, env: ReflectEnv): Promise<Response> {
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== 'POST') return fail('This endpoint takes POST.', 405, origin);
  if (origin === null || !ALLOWED_ORIGINS.includes(origin)) {
    return fail('Not an allowed origin.', 403, origin);
  }

  // Before the body is read, not after: a limit applied after parsing is a limit
  // on what the endpoint keeps rather than on what it reads.
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return fail('That request is too large.', 413, origin);
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) return fail('That request is too large.', 413, origin);

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return fail('That request is not JSON.', 400, origin);
  }

  const mode = (payload as { mode?: unknown }).mode;
  if (mode !== 'reflect' && mode !== 'teach' && mode !== 'repair') {
    return fail('Unknown mode.', 400, origin);
  }

  const apiKey = env.ANTHROPIC_API_KEY ?? '';
  if (apiKey === '') return fail('This endpoint is not configured.', 503, origin);

  const caller = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!withinBudget(caller, MODE_COST[mode], Date.now())) {
    return fail('This has been used enough for now. Try again later.', 429, origin);
  }

  const client = new Anthropic({ apiKey });

  try {
    if (mode === 'reflect') {
      const summary = sanitizeReflect((payload as { summary?: unknown }).summary);
      const answered = await call(client, 'reflect', TEACH_SYSTEM, reflectPrompt(summary));
      return json({ mode, text: answered.text, model: answered.model }, 200, origin);
    }

    if (mode === 'teach') {
      const raw = payload as { questionId?: unknown; read?: unknown };
      const question =
        typeof raw.questionId === 'string' ? teachQuestion(raw.questionId) : undefined;
      if (question === undefined) return fail('Unknown question.', 400, origin);
      if (!isRec(raw.read)) return fail('Unknown read.', 400, origin);

      const signingKey = env.REFLECT_SIGNING_KEY ?? '';
      if (signingKey === '') return fail('This endpoint is not configured.', 503, origin);

      // Three calls, and the first one is the point. v0.4: "the four design rules
      // run as a system prompt against the same model with no rules at all… Three
      // calls per run (default answer, rule-governed answer, grading pass)." The
      // screen is a comparison, so the unruled answer is not an extra — it is the
      // control, and dropping it would leave the rule-governed answer with nothing
      // to be better than.
      //
      // Sequential rather than concurrent, deliberately. Two calls in flight on one
      // key doubles the peak against the workspace rate limit for no reader-visible
      // gain, and the grading pass has to wait for the answer anyway.
      const withRead = `${question.question}\n\nThe reader's own read, committed before this answer: ${raw.read}.`;
      const plain = await call(client, 'teach', undefined, withRead);
      const answered = await call(client, 'teach', TEACH_SYSTEM, withRead);
      const rubric = await grade(client, 'teach', question.question, raw.read, answered.text);
      const result: TeachResult = {
        questionId: question.id,
        read: raw.read,
        answer: answered.text,
        rubric,
      };
      return json(
        {
          mode,
          ...result,
          plain: plain.text,
          signature: await signTeachResult(signingKey, result),
          model: answered.model,
        },
        200,
        origin,
      );
    }

    // repair. The one free-text channel, and the reason it is authenticated.
    const raw = payload as { result?: unknown; signature?: unknown };
    const result = parseTeachResult(raw.result);
    if (result === null) return fail('That is not a result this endpoint produced.', 400, origin);
    if (typeof raw.signature !== 'string') return fail('Missing signature.', 400, origin);

    const signingKey = env.REFLECT_SIGNING_KEY ?? '';
    if (signingKey === '') return fail('This endpoint is not configured.', 503, origin);
    if (!(await verifyTeachResult(signingKey, result, raw.signature))) {
      // Deliberately the same message as a malformed result. A caller probing the
      // signature learns nothing from the difference between "wrong shape" and
      // "wrong signature", and there is no reason to teach them which.
      return fail('That is not a result this endpoint produced.', 400, origin);
    }

    const failed = result.rubric.filter((item) => !item.pass);
    if (failed.length === 0)
      return fail('Nothing failed, so there is nothing to repair.', 400, origin);

    const question = teachQuestion(result.questionId);
    if (question === undefined) return fail('Unknown question.', 400, origin);

    const named = failed
      .map((item) => {
        const rule = RUBRIC_ITEMS.find((r) => r.id === item.id);
        return `- Rule ${rule?.rule ?? '?'}, ${rule?.label ?? item.id}: ${item.reason}`;
      })
      .join('\n');

    const rewritten = await call(
      client,
      'repair',
      REPAIR_SYSTEM,
      [
        'The question the assistant was asked:',
        question.question,
        '',
        `The read the reader committed to: ${result.read}.`,
        '',
        'The rules the answer was written under:',
        TEACH_SYSTEM,
        '',
        'The answer to rewrite:',
        result.answer,
        '',
        'The rubric items it failed, with the grader’s reason for each:',
        named,
      ].join('\n'),
    );
    const regraded = await grade(client, 'repair', question.question, result.read, rewritten.text);
    return json(
      { mode, answer: rewritten.text, rubric: regraded, model: rewritten.model },
      200,
      origin,
    );
  } catch (error) {
    if (error instanceof Refused) {
      // A refusal is reported, not routed around. There is no fallback model here
      // on purpose — see the header.
      return json({ error: 'The model declined this one.', refusal: error.category }, 200, origin);
    }
    if (error instanceof Truncated) {
      return fail(
        'The answer came back truncated. That is a bug here, not in your run.',
        502,
        origin,
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return fail('The model is rate limited. Try again in a minute.', 429, origin);
    }
    if (
      error instanceof Anthropic.AuthenticationError ||
      error instanceof Anthropic.PermissionDeniedError
    ) {
      // The reader cannot fix this and must not be told anything about the key.
      return fail('This endpoint is not configured correctly.', 503, origin);
    }
    if (error instanceof Anthropic.APIError) {
      return fail('The model could not be reached.', 502, origin);
    }
    return fail('Something went wrong here.', 500, origin);
  }
}

/**
 * The Cloudflare Worker adapter, and the only host-specific line in the file.
 *
 * Swapping hosts means replacing this and nothing above it.
 */
export default {
  fetch(request: Request, env: ReflectEnv): Promise<Response> {
    return handleReflect(request, env);
  },
};
