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

The screens then arrived in the same version, before the pass had cooled, and overtook most of what
it had recorded. Ten of the thirteen render, so the bednet, chlorination, deworming and vitamin A
figures are on a page rather than in a data file, the trap copy is published by the debrief, the
consent screen exists and declines to make the Clio claim, and one case that had no row at all turned
out to publish a multiplier. Those rows say where the claim appears now. A **State in this build**
line that reports a claim as unexercised is worth exactly as long as that stays true, which here was
days.

What the pass did not cover: the essays' attributions of position to Beauvoir and Murdoch, and their
generalisations about how experienced users behave. Those are the next tranche, and naming them here
is cheaper than implying the sweep was exhaustive.

---

### FLAGGED — Bednet commodity cost near $2 against a delivered cost near $4.50

- **Where:** Slate A, case 2 — `SLATES.A.cases[1]`, since this file numbers cases from one and the
  array is indexed from zero; trap copy on the result screen.
- **Status:** Illustrative. Carries the shape of a real, well-documented gap between commodity
  and delivered cost in net distribution. The specific figures are constructed for the task.
- **Now published.** The v0.6 location pass found these figures in the case data and in all six
  branches of the trap copy, on no screen, and recorded the row as unexercised rather than satisfied.
  The rebuilt screens arrived in the same version and closed that gap. They now render: the supplied
  `$2.00` opens the assisted round's bednet slider, and the `$4.50` delivered cost is in the evidence
  panel one click away. The debrief adds the consequence — that correcting the figure “roughly
  doubles the cost per death averted” — which is a magnitude neither evidence panel states, and Round
  3 adds the threshold “materially under three dollars a net”. The row said “not cleared for
  publication” and three figures are now published, which is a gap that closes by pinning the source
  or by restating them on the page as hypothetical, not by leaving this note here.
- **Primary link:** TODO — a named campaign or evaluator report giving delivered cost per net
  including logistics and wastage.
- **Action before release:** pin the primary source, or restate the figures as explicitly hypothetical.

### FLAGGED — Chlorination access near 80% against sustained use roughly half that

- **Where:** Slate B, case 3 — `SLATES.B.cases[2]`; trap copy on the result screen.
- **Status:** Illustrative. The access-versus-use distinction is real and is the reason the case
  exists; the numbers are constructed.
- **Now published.** As above: recorded at the v0.6 pass as in the case data and the trap copy and on
  no screen, then published by the rebuilt screens in the same version. The supplied `80%` coverage
  figure opens the assisted round's chlorination slider, and the access-versus-use sentence is in its
  evidence panel. The debrief adds the same “roughly doubles” magnitude, and Round 3 adds the
  threshold “sustained free chlorine residual above 70% at twelve months”.
- **Primary link:** TODO — follow-up study reporting measured free chlorine residual against
  installation or access rates.
- **Action before release:** as above.

### FLAGGED — Cash transfers: the income gain decaying enough to roughly triple the cost per lasting doubling

- **Where:** Slate A, case 1 — `SLATES.A.cases[0]`; Round 3, which replays it. Added when Round 3
  was built, on finding that this case publishes a magnitude and had no row at all — the table
  covered the other four.
- **Status:** Illustrative, and the same construction as the trap figures: the direction is real and
  the multiplier is made for the task. Round 3 also publishes a threshold, “holding above half its
  year-one level” at five years, as the evidence that would change the assistant's view.
- **Primary link:** TODO — a long-run cash transfer follow-up reporting consumption or income at
  five years or later against the year-one effect.
- **Action before release:** pin it, or restate the multiplier on the page as hypothetical.

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
  supplied at 3.0, and the rebuilt round renders it as the assisted round's opening position on this
  case. That is a starting position for the reader to move rather than a quoted result, and the
  screen labels it "Supplied value. Move the slider to use your own." It is still a number on a page,
  and it should be decided deliberately rather than left standing because it was written as a
  default.
- **Primary link:** TODO — the original long-run income paper and the principal replication or
  reanalysis on the other side.
- **Action before release:** required only if a version quotes an effect size.

### SECONDARY — Vitamin A mortality benefit scales with baseline deficiency

- **Where:** Slate B, case 1 — `SLATES.B.cases[0]`; Round 3, which replays it.
- **Status:** Directionally well established, quantitatively illustrative. The case turns on the
  distinction, not on the magnitude — and its Round 3 text quotes none, which keeps it consistent
  with that framing. It is also the dominance tie, so Round 3 names two of its assumptions rather
  than one.
- **State in this build:** the copy argues the scaling relation and quotes no magnitude. The case
  does carry a "Deaths averted per child-year" slider supplied at 0.0015, which the rebuilt round
  renders as the assisted round's opening position on this case. As with the deworming row, that is a
  starting position rather than a quoted result, and the screen says so — but it is a magnitude, and
  it now reads as one on a page rather than in a data file.
- **Primary link:** TODO.
- **Action before release:** required only if a version quotes a magnitude. This row had no stated
  release condition until the v0.6 pass; it now carries the deworming row's.

### PRIMARY AVAILABLE — Clio as the reference standard for privacy-preserving measurement over real usage

- **Where:** Consent screen; protocol section 1.
- **Status:** Anthropic has published on this directly.
- **State in this build:** the consent screen has since been rebuilt and does not make this claim;
  the protocol screen does not exist. The word appears nowhere in the repository except in this
  heading. That the rewritten consent copy leaves the comparison out is a reprieve rather than a
  clearance — the claim returns the moment anything reinstates it.
- **Primary link:** TODO — pin the canonical Anthropic page or paper. Do not paraphrase from memory.
- **Action before release:** pin it before anything reinstates the comparison. The condition this row
  carried at the v0.6 pass — pin it before the consent screen is written — was overtaken in the same
  version and met by omission rather than by pinning, which is not the same thing. This row had no
  stated release condition until that pass either.

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
  `shared/model.ts`, no `PINNED_MODEL`, no `api/reflect.ts`, and no code anywhere that prints a
  served model ID. The debrief — the screen this row calls the result screen — has since been
  rebuilt, and prints no model ID, because there is nothing yet to print one from. The consent screen
  says the reflection is off in this build, which is the only place the mechanism is mentioned at
  all. The grade is kept because the mechanism it describes is the one claim here that verifies
  itself once it runs, not because anything currently verifies it.
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
