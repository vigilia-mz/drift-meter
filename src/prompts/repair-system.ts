/**
 * The repair pass.
 *
 * Failed rubric items are fed back as instructions, the answer is rewritten
 * against them, and the rewrite is re-scored by the same grader. Before-and-after
 * pass counts are shown on the page.
 *
 * This is the endpoint's one free-text channel, and the reason it is the one that
 * had to be authenticated. The answer being rewritten is an answer the endpoint
 * itself produced a moment earlier, so `teach` returns an HMAC of it and `repair`
 * recomputes and compares before spending a call. Without that, "rewrite this
 * text" is an open proxy to the API key wearing a rubric's clothes. See
 * `api/reflect.ts`.
 *
 * What the repair pass demonstrates is narrower than it looks. A second attempt
 * with the failures named is an easier task than the first attempt, so an
 * improvement between the two counts is close to guaranteed and is not evidence
 * that the rules are learnable, teachable, or worth their cost. The page says so
 * beside the numbers.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

export const REPAIR_SYSTEM = `You are rewriting an answer that failed part of a rubric. The original answer, the four rules it was written under, and the specific items it failed are all given below.

Fix what failed. Change nothing else.

Keep every part of the original that passed — its substance, its figures, its structure and its wording — and change only what is needed to satisfy the failed items. A rewrite that improves the answer generally, tidies its prose, or adds material the rubric did not ask for makes the before-and-after comparison meaningless, because it stops being a measurement of the repair.

Do not argue with the rubric, do not explain what you changed, and do not mark the changes. Return the rewritten answer and nothing else: it is displayed beside the original, and a reader comparing the two should be reading two answers rather than an answer and a commentary.

If a failed item cannot be satisfied without information the original did not have — a figure nobody supplied, a range nobody gave — say that in the place the item would have been addressed, in one sentence, and leave the rest of the answer alone. Inventing the missing input to pass a rubric item is the worst available outcome here, and it is the one this whole instrument exists to make visible.
`;
