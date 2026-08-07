# The Drift Meter — source table

Every external claim, its source, whether that source is primary or secondary, and the date last
checked. Rows marked FLAGGED are not cleared for publication: each must be pinned to a primary
source or restated as explicitly hypothetical before this leaves prototype status.

Last full pass: 30 Jul 2026 (v0.3).

---

### FLAGGED — Bednet commodity cost near $2 against a delivered cost near $4.50

- **Where:** Slate A, case 2; trap copy on the result screen.
- **Status:** Illustrative. Carries the shape of a real, well-documented gap between commodity
  and delivered cost in net distribution. The specific figures are constructed for the task.
- **Now published.** Until the round screen was rebuilt these figures existed only in the case data
  and reached no page. They now render: the supplied `$2.00` opens the assisted round's bednet
  slider, and the `$4.50` delivered cost is in the evidence panel one click away. The debrief adds
  the consequence — that correcting the figure “roughly doubles the cost per death averted” — which
  is a magnitude neither evidence panel states, and Round 3 adds the threshold “materially under
  three dollars a net”. The row said “not cleared for publication” and three figures are now
  published, which is a gap that closes by pinning the source or by restating them on the page as
  hypothetical, not by leaving this note here.
- **Primary link:** TODO — a named campaign or evaluator report giving delivered cost per net
  including logistics and wastage.
- **Action before release:** pin the primary source, or restate the figures as explicitly hypothetical.

### FLAGGED — Chlorination access near 80% against sustained use roughly half that

- **Where:** Slate B, case 3; trap copy on the result screen.
- **Status:** Illustrative. The access-versus-use distinction is real and is the reason the case
  exists; the numbers are constructed.
- **Now published.** As above: the supplied `80%` coverage figure opens the assisted round's
  chlorination slider, and the access-versus-use sentence is in its evidence panel. The debrief adds
  the same “roughly doubles” magnitude, and Round 3 adds the threshold “sustained free chlorine
  residual above 70% at twelve months”.
- **Primary link:** TODO — follow-up study reporting measured free chlorine residual against
  installation or access rates.
- **Action before release:** as above.

### FLAGGED — Cash transfers: the income gain decaying enough to roughly triple the cost per lasting doubling

- **Where:** Slate A, case 1; Round 3, which replays it. Added when Round 3 was built, on finding
  that this case publishes a magnitude and had no row at all — the table covered the other four.
- **Status:** Illustrative, and the same construction as the trap figures: the direction is real and
  the multiplier is made for the task. Round 3 also publishes a threshold, “holding above half its
  year-one level” at five years, as the evidence that would change the assistant's view.
- **Primary link:** TODO — a long-run cash transfer follow-up reporting consumption or income at
  five years or later against the year-one effect.
- **Action before release:** pin it, or restate the multiplier on the page as hypothetical.

### SECONDARY — The long-run income effect of deworming is contested

- **Where:** Slate A, case 3.
- **Status:** A real, ongoing dispute in development economics, stated here as a dispute rather
  than as a result. Held as secondary knowledge.
- **Primary link:** TODO — the original long-run income paper and the principal replication or
  reanalysis on the other side.
- **Action before release:** required only if a version quotes an effect size.

### SECONDARY — Vitamin A mortality benefit scales with baseline deficiency

- **Where:** Slate B, case 1; Round 3, which replays it.
- **Status:** Directionally well established, quantitatively illustrative. The case turns on the
  distinction, not on the magnitude — and its Round 3 text quotes none, which keeps it consistent
  with that framing. It is also the dominance tie, so Round 3 names two of its assumptions rather
  than one.
- **Primary link:** TODO.
- **Action before release:** required only if a version quotes a magnitude.

### PRIMARY AVAILABLE — Clio as the reference standard for privacy-preserving measurement over real usage

- **Where:** Consent screen; protocol section 1.
- **Status:** Anthropic has published on this directly.
- **Primary link:** TODO — pin the canonical Anthropic page or paper. Do not paraphrase from memory.

### PRIMARY — The reflection was served by the pinned model, and the served ID is printed

- **Where:** Result screen; protocol section 5.
- **Status:** Verified per request. The model ID is returned by the API in the response body and
  printed verbatim on the page. This is the only claim here that verifies itself.
- **Checked:** every request.
- **Note:** the pin is recorded in `shared/model.ts`. It moved at v0.6, and that move is recorded in
  `CHANGELOG.md` as a re-baseline rather than as maintenance — rubric pass rates from v0.4 and v0.5
  are not comparable to runs after it.

### CORRECTED — Project Deal: figures right, 1-to-7 scale omitted

- **Where:** A separate document, not this build.
- **Status:** The error that caused this table to exist. Correct numbers with a missing qualifier
  is the exact class of mistake a source table catches and a careful read does not, because
  nothing in the sentence looks wrong. The primary page states the scale explicitly.
- **Action:** corrected; kept here as the standing reason for the process.
