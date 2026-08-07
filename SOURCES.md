# The Drift Meter — source table

Every external claim, its source, whether that source is primary or secondary, and the date last
checked. Rows marked FLAGGED are not cleared for publication: each must be pinned to a primary
source or restated as explicitly hypothetical before this leaves prototype status. PRIMARY AVAILABLE
means a specific primary source is known to exist and has simply not been pinned here yet; FLAGGED
means no particular source has been identified.

Last location-and-state pass: 7 Aug 2026 (v0.6). Last source pass: 30 Jul 2026 (v0.3). No row's
source was re-verified in the v0.6 pass — every `Primary link: TODO` below is as open as it was.

The v0.6 pass was run against the rebuild rather than against the deleted build these rows were
written for, which changed two things. Several rows locate a claim on a screen the rebuild has not
reproduced yet; those carry a **State in this build** line rather than a quieter status, because a
row that reads as live when nothing renders it is the same failure as a figure without its scale.
And the pass found four external claims on the essay pages that no row located there — three
untracked entirely, and the Project Deal figures tracked only by the CORRECTED row, which placed them
in a separate document. They have rows now.

What the pass did not cover: the essays' attributions of position to Beauvoir and Murdoch, and their
generalisations about how experienced users behave. Those are the next tranche, and naming them here
is cheaper than implying the sweep was exhaustive.

---

### FLAGGED — Bednet commodity cost near $2 against a delivered cost near $4.50

- **Where:** Slate A, case 2 — `SLATES.A.cases[1]`, since this file numbers cases from one and the
  array is indexed from zero; trap copy on the result screen.
- **Status:** Illustrative. Carries the shape of a real, well-documented gap between commodity
  and delivered cost in net distribution. The specific figures are constructed for the task.
- **State in this build:** present in the case data and in all six branches of the trap copy; the
  result screen that would show either does not exist yet, so neither figure is published anywhere.
  The row is not satisfied, only unexercised — nothing but this row stands between the figures and a
  screen once one is wired up.
- **Primary link:** TODO — a named campaign or evaluator report giving delivered cost per net
  including logistics and wastage.
- **Action before release:** pin the primary source, or restate the figures as explicitly hypothetical.

### FLAGGED — Chlorination access near 80% against sustained use roughly half that

- **Where:** Slate B, case 3 — `SLATES.B.cases[2]`; trap copy on the result screen.
- **Status:** Illustrative. The access-versus-use distinction is real and is the reason the case
  exists; the numbers are constructed.
- **State in this build:** as above — in the case data and the trap copy, on no screen.
- **Primary link:** TODO — follow-up study reporting measured free chlorine residual against
  installation or access rates.
- **Action before release:** as above.

### FLAGGED — Students with ChatGPT practised better and scored worse on exams taken without it

- **Where:** `atrophy.html`, the empirical section. Added at the v0.6 pass.
- **Status:** Stated on the page as a finding, with a population and a direction, and no citation
  anywhere on the site. A reader who wants to check it has nothing to check it against.
- **Primary link:** TODO — the study, with its design and the size of the reversal.
- **Action before release:** pin it, or restate it on the page as reported rather than established.

### FLAGGED — Endoscopists' independent detection rates declined after AI-assisted screening was withdrawn

- **Where:** `atrophy.html`, the empirical section. Added at the v0.6 pass.
- **Status:** As above — stated as a finding about experts, uncited. It carries more weight than the
  others, because the essay uses it to move the argument from students to practitioners.
- **Primary link:** TODO.
- **Action before release:** as above.

### FLAGGED — Developers using AI coding assistants took longer while believing they were faster

- **Where:** `atrophy.html`, the empirical section. Added at the v0.6 pass.
- **Status:** As above, uncited. The belief-versus-outcome gap is the essay's own thesis in
  miniature, which is a reason to be more careful with it rather than less.
- **Primary link:** TODO.
- **Action before release:** as above.

### SECONDARY — The long-run income effect of deworming is contested

- **Where:** Slate A, case 3 — `SLATES.A.cases[2]`.
- **Status:** A real, ongoing dispute in development economics, stated here as a dispute rather
  than as a result. Held as secondary knowledge.
- **State in this build:** the copy still states a dispute and quotes no effect size, so the row's
  condition below has not been tripped. The case does carry a "Lifetime income gain factor" slider
  defaulting to 3.0; that is a starting position for the reader to move, not a quoted result, but it
  will look like one on a screen and should be decided deliberately before the screen exists.
- **Primary link:** TODO — the original long-run income paper and the principal replication or
  reanalysis on the other side.
- **Action before release:** required only if a version quotes an effect size.

### SECONDARY — Vitamin A mortality benefit scales with baseline deficiency

- **Where:** Slate B, case 1 — `SLATES.B.cases[0]`.
- **Status:** Directionally well established, quantitatively illustrative. The case turns on the
  distinction, not on the magnitude.
- **State in this build:** the copy argues the scaling relation and quotes no magnitude. The case
  does carry a "Deaths averted per child-year" slider defaulting to 0.0015; as with the deworming
  row, that is a starting position rather than a quoted result, but it is a magnitude and it will
  read as one on a screen.
- **Primary link:** TODO.
- **Action before release:** required only if a version quotes a magnitude. This row had no stated
  release condition until the v0.6 pass; it now carries the deworming row's.

### PRIMARY AVAILABLE — Clio as the reference standard for privacy-preserving measurement over real usage

- **Where:** Consent screen; protocol section 1.
- **Status:** Anthropic has published on this directly.
- **State in this build:** neither screen exists, and the word appears nowhere in the repository
  except in this heading. The claim is not currently made anywhere, which is a reprieve rather than
  a clearance — it returns the moment the consent screen is written.
- **Primary link:** TODO — pin the canonical Anthropic page or paper. Do not paraphrase from memory.
- **Action before release:** pin it before the consent screen is written. This row had no stated
  release condition until the v0.6 pass either.

### PRIMARY AVAILABLE — Project Deal: 186 transactions worth just over $4,000, and fairness rated 4.05 against 4.06 on a seven-point scale

- **Where:** `atrophy.html`, the opening two paragraphs of the article; `essay.html`, the paragraph
  beginning "Anthropic's Project Deal makes the problem concrete". Added at the v0.6 pass, which
  found the claim published on two pages and located by no row.
- **Status:** Anthropic's own published experiment, and the empirical anchor both essays open on.
  Held from the write-up rather than from a pinned page, which is the condition that produced the
  CORRECTED row below.
- **Primary link:** TODO — pin Anthropic's published account. Do not paraphrase from memory.
- **Action before release:** pin it. Two pages lean on these figures, and this is the one claim on
  the site that has already been got wrong once.

### PRIMARY — The reflection was served by the pinned model, and the served ID is printed

- **Where:** Result screen; protocol section 5.
- **Status:** Verified per request, in the builds that had an endpoint. The model ID is returned by
  the API in the response body and printed verbatim on the page.
- **Checked:** every request, in v0.3 through v0.5. Nothing has been checked in this build.
- **State in this build:** dormant. Nothing in this repository can check it. There is no
  `shared/model.ts`, no `PINNED_MODEL`, no `api/reflect.ts`, no result screen, and no code anywhere
  that prints a served model ID. The grade is kept because the mechanism it describes is the one
  claim here that verifies itself once it runs, not because anything currently verifies it.
- **Note:** the re-baseline to `claude-opus-5` is recorded in `CHANGELOG.md` under v0.6 as a
  re-baseline rather than as maintenance — rubric pass rates from v0.4 and v0.5 are not comparable
  to runs after it. The pin will live in `shared/model.ts`. Until that file exists, the changelog
  entry is the whole of the record, and this row cannot be used to check it.

### CORRECTED — Project Deal: figures right, 1-to-7 scale omitted

- **Where:** Originally a separate document. At the v0.6 pass, in this build too: `essay.html` gave
  the 4.05 and 4.06 fairness ratings with no scale stated anywhere on the page, while `atrophy.html`
  stated it. Corrected in `essay.html` in the same pass.
- **Status:** The error that caused this table to exist. Correct numbers with a missing qualifier
  is the exact class of mistake a source table catches and a careful read does not, because
  nothing in the sentence looks wrong. Both pages now state the scale explicitly.
- **Action:** corrected twice; kept here as the standing reason for the process. That the same
  omission was live on a page of this build, with the row already written, is the more useful half of
  the record.
