/**
 * The wire contract, imported by both sides.
 *
 * One file so that the endpoint and the client cannot disagree about the shape
 * of a request. Nothing here reaches the network or holds a secret: it is types,
 * bounds, and the canonical serialisation the signature is computed over.
 *
 * THREE MODES, AND ONLY ONE OF THEM TAKES TEXT.
 *
 * - `reflect` sends a summary of the run. Every field is a bounded number or a
 *   fixed label, and `sanitizeReflect` rebuilds the object from the key list
 *   below rather than trusting what arrived — so a field nobody declared cannot
 *   travel, and a number outside its range is clamped rather than forwarded.
 * - `teach` sends a question id and the reader's own read. The id indexes
 *   `TEACH_QUESTIONS`; the read is one of three labels. Neither is text.
 * - `repair` sends back an answer the endpoint itself produced a moment earlier,
 *   which is the one free-text field in the whole contract. It is therefore
 *   authenticated rather than trusted: `teach` returns an HMAC over the result it
 *   generated, and `repair` recomputes and compares in constant time before
 *   spending a call. CLAUDE.md rule 4 requires that this stays the only exception
 *   and that it stays signed.
 *
 * The old `CLAUDE.md` claimed the endpoint took a question index and never free
 * text. That was true of two modes and false of the third, which took two
 * thousand characters straight into a prompt. The signature is what makes the
 * documented invariant true as written.
 */

import type { Rec } from '../src/content/types.js';
import type { RubricItemId, TeachQuestionId } from './teach.js';
import { RUBRIC_ITEM_IDS, isRec, teachQuestion } from './teach.js';

/**
 * The largest body the endpoint will read.
 *
 * Sized from the only mode that carries text. `repair` sends back a teach result:
 * an answer capped by the model's own `max_tokens` plus four rubric reasons. At
 * roughly four characters per token that is about 6 KB of answer and under 1 KB
 * of rubric, so 16 KB leaves room for JSON overhead and a longer-than-expected
 * answer without leaving room for someone to post a novel.
 *
 * The check happens before the body is parsed. A limit applied after parsing is a
 * limit on what the endpoint keeps, not on what it reads.
 */
export const MAX_BODY_BYTES = 16 * 1024;

/**
 * The one origin allowed to call this.
 *
 * Exactly the published site, and nothing else. A previous version allowlisted a
 * GitHub username the author no longer held — re-registrable by anyone, who could
 * then point an allowlisted origin at an endpoint spending real money. Never add
 * a released or unowned domain here (CLAUDE.md rule 4).
 *
 * This stops a browser on another page from using the endpoint with a reader's
 * origin attached. It does not stop anything else: `Origin` is a header, and a
 * header can be forged by anything that is not a browser. The question list and
 * the signature are what make that not matter — see the module comment.
 */
export const ALLOWED_ORIGINS: readonly string[] = ['https://vigilia-mz.github.io'];

/**
 * What a mode costs against the per-visitor budget.
 *
 * Carried forward from v0.4 and v0.5, which recorded a teach run at three and a
 * repair pass at two. These are a cost proxy rather than a call count — a teach
 * run makes two calls and so does a repair — and they are kept at the recorded
 * numbers because changing them would silently change what the published figures
 * described. The limiter they feed is best-effort; see `api/reflect.ts`.
 */
export const MODE_COST = { reflect: 1, teach: 3, repair: 2 } as const;

export type ReflectMode = keyof typeof MODE_COST;

// ---------------------------------------------------------------------------
// reflect
// ---------------------------------------------------------------------------

/**
 * One round's measures, as the endpoint is willing to receive them.
 *
 * Every field is a number the debrief already printed. `auto` is nullable
 * because framing autonomy is undefined in the control round — never zero — and
 * flattening that to a number here would hand the model a value the instrument
 * refuses to draw.
 */
export interface ReflectRound {
  readonly engagement: number;
  readonly range: number;
  readonly amb: number;
  readonly auto: number | null;
  readonly perceived: number;
  readonly actual: number;
  readonly gap: number;
  readonly opens: number;
  readonly moved: number;
  readonly flags: number;
  readonly investigate: number;
  readonly recsMade: number;
}

/** The disclosure fields, all fixed labels or booleans. */
export interface ReflectAssignment {
  readonly assistedFirst: boolean;
  readonly assistedSlate: 'A' | 'B';
  readonly armKey: 'ai' | 'human' | 'unlabelled';
  readonly forcedOrder: boolean;
  readonly forcedSlate: boolean;
  readonly forcedArm: boolean;
}

export interface ReflectSummary {
  readonly assisted: ReflectRound;
  readonly unassisted: ReflectRound;
  readonly assignment: ReflectAssignment;
  /** Which branch of the trap debrief the run earned. A label, never its prose. */
  readonly trapBranch: string | null;
  /** The transfer check's pick. One of four option keys, or null. */
  readonly transfer: string | null;
}

export interface ReflectRequest {
  readonly mode: 'reflect';
  readonly summary: ReflectSummary;
}

export interface ReflectResponse {
  readonly mode: 'reflect';
  readonly text: string;
  /** The ID the API returned. The provenance record — see CLAUDE.md rule 3. */
  readonly model: string;
}

// ---------------------------------------------------------------------------
// teach and repair
// ---------------------------------------------------------------------------

export interface RubricResult {
  readonly id: RubricItemId;
  readonly pass: boolean;
  readonly reason: string;
}

/**
 * What a teach run produced. Also exactly what a repair pass sends back.
 *
 * The signature covers this whole object rather than the answer alone. Signing
 * only the answer would leave the rubric forgeable, and the rubric is what the
 * repair prompt is told to fix — so a caller could mark every item failed and get
 * an arbitrary rewrite of a text the endpoint had blessed.
 */
export interface TeachResult {
  readonly questionId: TeachQuestionId;
  readonly read: Rec;
  readonly answer: string;
  readonly rubric: readonly RubricResult[];
}

export interface TeachRequest {
  readonly mode: 'teach';
  readonly questionId: TeachQuestionId;
  readonly read: Rec;
}

export interface TeachResponse extends TeachResult {
  readonly mode: 'teach';
  /**
   * The same question answered with no rules at all.
   *
   * This is the comparison the encoded screen exists to show, and it is why a
   * teach run is three calls rather than two: the unruled answer, the
   * rule-governed answer, and the grading pass. v0.4 recorded it in those words.
   *
   * Not covered by the signature, and it does not need to be. Only the
   * rule-governed result travels back to the endpoint — a repair pass rewrites
   * that, never this — so there is no path by which a tampered `plain` re-enters a
   * prompt. Signing it would suggest a protection that is not doing any work.
   */
  readonly plain: string;
  readonly signature: string;
  readonly model: string;
}

export interface RepairRequest {
  readonly mode: 'repair';
  readonly result: TeachResult;
  readonly signature: string;
}

export interface RepairResponse {
  readonly mode: 'repair';
  /** The rewrite, and the same rubric run again over it. */
  readonly answer: string;
  readonly rubric: readonly RubricResult[];
  readonly model: string;
}

export type EndpointRequest = ReflectRequest | TeachRequest | RepairRequest;
export type EndpointResponse = ReflectResponse | TeachResponse | RepairResponse;

/** What the endpoint returns when it will not answer. Never carries upstream detail. */
export interface EndpointError {
  readonly error: string;
  /** Present only when the model itself declined; the category, never the prompt. */
  readonly refusal?: string;
}

// ---------------------------------------------------------------------------
// Sanitising
// ---------------------------------------------------------------------------

const PERCENT_MAX = 100;
const GAP_MIN = -100;

/** A finite number inside `[min, max]`, or `fallback`. Never `NaN`, never `Infinity`. */
function bounded(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function boundedOrNull(value: unknown, min: number, max: number): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
}

function label<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.find((a) => a === value) ?? fallback;
}

function labelOrNull<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return allowed.find((a) => a === value) ?? null;
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

/** The counts a three-case round can produce. Nine sliders, three cases. */
const MAX_OPENS = 3;
const MAX_MOVED = 9;
const MAX_FLAGS = 3;

function round(value: unknown): ReflectRound {
  const r = record(value);
  return {
    engagement: bounded(r.engagement, 0, PERCENT_MAX, 0),
    range: bounded(r.range, 0, PERCENT_MAX, 0),
    amb: bounded(r.amb, 0, PERCENT_MAX, 0),
    auto: boundedOrNull(r.auto, 0, PERCENT_MAX),
    perceived: bounded(r.perceived, 0, PERCENT_MAX, 0),
    actual: bounded(r.actual, 0, PERCENT_MAX, 0),
    gap: bounded(r.gap, GAP_MIN, PERCENT_MAX, 0),
    opens: bounded(r.opens, 0, MAX_OPENS, 0),
    moved: bounded(r.moved, 0, MAX_MOVED, 0),
    flags: bounded(r.flags, 0, MAX_FLAGS, 0),
    investigate: bounded(r.investigate, 0, MAX_FLAGS, 0),
    recsMade: bounded(r.recsMade, 0, MAX_OPENS, 0),
  };
}

const SLATE_IDS = ['A', 'B'] as const;
const ARM_KEYS = ['ai', 'human', 'unlabelled'] as const;
const TRAP_BRANCHES = [
  'caught',
  'flaggedNotChecked',
  'missFund',
  'missAccepted',
  'missOpened',
  'miss',
] as const;
const TRANSFER_OPTIONS = ['proxy', 'cost', 'scale', 'none'] as const;

/**
 * Rebuild the reflect payload from a known key list.
 *
 * Rebuild, not validate. A validator answers "is this acceptable?" and forwards
 * what arrived; this constructs a new object from named keys, so a field nobody
 * declared cannot reach the prompt however it was spelled. Together with the
 * question list, this is what makes the endpoint an expensive button rather than
 * an open proxy to the API key.
 *
 * Out-of-range numbers are clamped rather than rejected. The alternative is a
 * 400 on a reader whose run produced an unexpected figure, which would turn a
 * measurement bug into a broken screen; clamping keeps the failure inside the
 * numbers, where the debrief has already shown them.
 */
export function sanitizeReflect(input: unknown): ReflectSummary {
  const raw = record(input);
  const assignment = record(raw.assignment);
  return {
    assisted: round(raw.assisted),
    unassisted: round(raw.unassisted),
    assignment: {
      assistedFirst: assignment.assistedFirst === true,
      assistedSlate: label(assignment.assistedSlate, SLATE_IDS, 'A'),
      armKey: label(assignment.armKey, ARM_KEYS, 'unlabelled'),
      forcedOrder: assignment.forcedOrder === true,
      forcedSlate: assignment.forcedSlate === true,
      forcedArm: assignment.forcedArm === true,
    },
    trapBranch: labelOrNull(raw.trapBranch, TRAP_BRANCHES),
    transfer: labelOrNull(raw.transfer, TRANSFER_OPTIONS),
  };
}

/**
 * Rebuild a teach result from what a repair request sent.
 *
 * Same discipline as `sanitizeReflect`, with one difference that matters: the
 * answer is text and cannot be coerced into a label, so it is not sanitised at
 * all — it is *authenticated*. This function normalises the shape so the
 * signature is computed over the same bytes on both sides; it is the signature
 * check, not this, that decides whether the text may be used.
 *
 * Returns `null` when the shape is wrong, so the caller refuses rather than
 * signing something it invented.
 */
export function parseTeachResult(input: unknown): TeachResult | null {
  const raw = record(input);
  const question = typeof raw.questionId === 'string' ? teachQuestion(raw.questionId) : undefined;
  if (question === undefined) return null;
  if (!isRec(raw.read)) return null;
  if (typeof raw.answer !== 'string' || raw.answer === '') return null;
  if (!Array.isArray(raw.rubric) || raw.rubric.length !== RUBRIC_ITEM_IDS.length) return null;
  // `Array.isArray` narrows to `any[]`, which would make every read below an
  // unchecked `any`. Widening to `unknown[]` keeps the parsing honest.
  const arrived: readonly unknown[] = raw.rubric as readonly unknown[];

  const rubric: RubricResult[] = [];
  for (const id of RUBRIC_ITEM_IDS) {
    const found = arrived.find((item) => record(item).id === id);
    if (found === undefined) return null;
    const item = record(found);
    if (typeof item.pass !== 'boolean' || typeof item.reason !== 'string') return null;
    rubric.push({ id, pass: item.pass, reason: item.reason });
  }

  return { questionId: question.id, read: raw.read, answer: raw.answer, rubric };
}

/**
 * The exact bytes the signature is computed over.
 *
 * Written out by hand rather than `JSON.stringify(result)`, because
 * `JSON.stringify` serialises in insertion order: two objects with the same
 * fields in a different order produce different bytes and therefore a signature
 * that fails against itself. Both sides call this, and the field order here is
 * the contract.
 */
export function canonicalTeachResult(result: TeachResult): string {
  const rubric = RUBRIC_ITEM_IDS.map((id) => {
    const item = result.rubric.find((r) => r.id === id);
    return { id, pass: item?.pass ?? false, reason: item?.reason ?? '' };
  });
  return JSON.stringify({
    questionId: result.questionId,
    read: result.read,
    answer: result.answer,
    rubric: rubric.map((r) => ({ id: r.id, pass: r.pass, reason: r.reason })),
  });
}
