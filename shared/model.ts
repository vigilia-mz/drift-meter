/**
 * The pinned model.
 *
 * One exact ID, in one place, imported by the protocol screen and — when #18
 * builds it — by the endpoint. CLAUDE.md rule 3 is the whole of this file:
 *
 * - The instrument contains a model, so results are comparable only within a
 *   pinned version. Changing this constant is a re-baseline, not maintenance: it
 *   makes rubric pass rates and any future cohort figures incomparable to earlier
 *   runs, and it belongs in `CHANGELOG.md` said in those words.
 * - Current-generation Claude IDs carry no date suffix. `claude-opus-5` *is* the
 *   exact ID; appending a date produces a 404. So the discipline is not “use a
 *   dated ID” but “change this deliberately and never incidentally.”
 * - This constant is the pin. It is not the provenance record. The provenance
 *   record is the ID the API returns, printed on the page beside every response,
 *   and it is the one row in `SOURCES.md` graded PRIMARY because it is the only
 *   claim on the site that verifies itself.
 *
 * The endpoint does not exist yet and is dark when it does, so nothing has yet
 * been served by this ID. The protocol screen says that rather than implying a
 * verification that has not happened.
 */

export const PINNED_MODEL = 'claude-opus-5';
