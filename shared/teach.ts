/**
 * The complete set of questions the endpoint will answer.
 *
 * CLAUDE.md rule 4: the client sends a `questionId`, never text. This table is
 * the whole of what that buys — the endpoint looks the id up here and builds the
 * prompt from what it finds, so a caller cannot put words into the model's mouth
 * by editing a request. There is no free-text path into `teach`, and the one
 * free-text path that exists at all — `repair`, which takes back an answer the
 * endpoint itself produced — is authenticated rather than trusted.
 *
 * The reader's own read travels the same way: not as prose, but as one of the
 * three recommendation labels the instrument already uses. That is what makes
 * rule 1 expressible over a closed channel. Rule 1 asks for the person's view
 * before the estimate; the encoded screen collects it as a choice between three
 * options, so the commit is real and the payload is still an enum.
 *
 * Three questions, drawn from cases the reader has already worked. That is
 * deliberate: by the time this screen is reachable they have completed both
 * rounds, been shown the trap, and read the four rules, so a question about a
 * case they have seen is a question they can judge the answer to. A question
 * about something new would be a demonstration they have no purchase on.
 *
 * The question text is the author's prose and is licensed CC BY 4.0 — see
 * REUSE.toml, which names this file in the prose annotation for that reason.
 */

import type { Rec } from '../src/content/types.js';

/** The id the client sends. Anything else is rejected before a call is spent. */
export type TeachQuestionId = 'bednets' | 'chlorination' | 'deworming';

export interface TeachQuestion {
  readonly id: TeachQuestionId;
  /** Shown on the screen as the question being asked. */
  readonly label: string;
  /** Handed to the model as the question. Never assembled from a request. */
  readonly question: string;
}

export const TEACH_QUESTIONS = [
  {
    id: 'bednets',
    label: 'Insecticide-treated bednets',
    question:
      'A funder is considering insecticide-treated bednet distribution in the Sahel. The figures they have been given are a cost of $2.00 per net, a net usage rate of 85%, and 0.0006 deaths averted per net. What is the cost per death averted, and should they fund it?',
  },
  {
    id: 'chlorination',
    label: 'Safe-water chlorination',
    question:
      'A funder is considering safe-water chlorination in rural East Africa. The figures they have been given are a cost of $1.50 per person-year of clean water, a use rate of 80%, and 0.0008 under-five deaths averted per person-year. What is the cost per death averted, and should they fund it?',
  },
  {
    id: 'deworming',
    label: 'School-based deworming',
    question:
      'A funder is considering school-based deworming in South Asia. The figures they have been given are a cost of $0.75 per child treated, a 50% probability that the long-run income effect is real, and a lifetime income gain factor of 3.0. What is the cost per unit of income gain, and should they fund it?',
  },
] as const satisfies readonly TeachQuestion[];

/**
 * The question a valid id names, or `undefined`.
 *
 * `undefined` rather than a default, because a request carrying an id this table
 * does not contain is a request the endpoint should refuse rather than answer
 * with something plausible.
 */
export function teachQuestion(id: string): TeachQuestion | undefined {
  return TEACH_QUESTIONS.find((q) => q.id === id);
}

/** Whether a value is one of the three reads the reader may commit to. */
export function isRec(value: unknown): value is Rec {
  return value === 'fund' || value === 'investigate' || value === 'pass';
}

/**
 * The four rubric items, one per rule.
 *
 * The ids are stable and the endpoint returns them rather than prose, so the
 * screen chooses its own copy and the grader's wording cannot become screen copy
 * by accident. `rule` is the number in `src/content/spec.ts`, so a reader can go
 * from a failed item to the rule it failed.
 *
 * Item 1 scores a narrower thing than rule 1 states, and `grader-system.md` says
 * so: the asking half of rule 1 happens in the harness, before any answer
 * exists, so what an answer can be scored on is whether it engages the read the
 * reader committed.
 */
export const RUBRIC_ITEMS = [
  { id: 'ownRead', rule: '1', label: 'Engages the reader’s own read' },
  { id: 'interval', rule: '2', label: 'Leads with a range' },
  { id: 'driver', rule: '3', label: 'Names the load-bearing assumption' },
  { id: 'disagreement', rule: '4', label: 'Disagrees specifically, and says what would change it' },
] as const;

export type RubricItemId = (typeof RUBRIC_ITEMS)[number]['id'];

/** The ids in rule order, for the schema's `required` list and for iteration. */
export const RUBRIC_ITEM_IDS: readonly RubricItemId[] = RUBRIC_ITEMS.map((item) => item.id);
