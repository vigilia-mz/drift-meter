# The Drift Meter — source table

Every external claim, its source, whether that source is primary or secondary, and the date last
checked. Rows marked FLAGGED are not cleared for publication: each must be pinned to a primary
source or restated as explicitly hypothetical before this leaves prototype status. PRIMARY AVAILABLE
means a specific primary source is known to exist and has simply not been pinned here yet; FLAGGED
means no particular source has been identified.

ILLUSTRATIVE was added at the v0.6 close of #7, for a figure that is constructed for the exercise and
says so on the page. It is the second of the two exits FLAGGED offers, and it is not a weaker version
of a pinned row: a figure taken from a source and a figure built for a task are different objects,
and the table was previously unable to say which one it held. A row earns it only while the
disclosure is live, which is what `invariants.test.ts` holds in place. It is not CORRECTED — nothing
here was wrong. It was undisclosed, which is a different failure with a different fix.

Last location-and-state pass: 7 Aug 2026 (v0.6). Last source pass: 30 Jul 2026 (v0.3). No row's
source was re-verified in the v0.6 pass, and #7 did not verify one either — every `Primary link:
TODO` below is as open as it was. Restating a figure as illustrative closes the publication
obligation and closes nothing else.

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

Then #7 was closed, by the second of the two exits its own header offers: the four constructed case
figures are restated on the page as illustrative rather than pinned to sources they were never taken
from. Four rows move from FLAGGED to ILLUSTRATIVE, and a fifth case — the transfer check's — turned
out to publish constructed figures and to be tracked by nothing at all. It has a row now. What this
did not do is verify anything. Every `Primary link: TODO` in those rows is still a TODO; they are
simply no longer blocking, because the page no longer presents the figures as findings.

Three of the four FLAGGED rows are a different object and are untouched by that reasoning. They are
the essay pages' empirical claims about students, endoscopists and developers: assertions about the
world, stated as findings, with no citation. A disclosure cannot clear those, because they are not
illustrative — they are either true and uncited or they are not true. They stay FLAGGED.

The fourth arrived with the accessibility sweep and is a different object again. It is not a claim
about the world at all: it is a property of this build's own palette, measured, failing a threshold,
and left standing on an argument. It is FLAGGED because the argument is doing work rather than
confirming a pass, and the fix is a design decision that belongs to the author rather than to the
sweep that found it. Three new rows in this pass are PRIMARY, and two of them are about how this
repository holds itself to an outside standard — the first rows here to cite one.

What no pass has covered: the essays' attributions of position to Beauvoir and Murdoch, and their
generalisations about how experienced users behave. Those are the next tranche, and naming them here
is cheaper than implying the sweep was exhaustive. The accessibility sweep is not exhaustive either,
and says where it stops: twelve of thirteen screens, because the thirteenth has no path to it, and two
axe rules off on one selector each with the clause they stand on.

---

### ILLUSTRATIVE — Bednet commodity cost near $2 against a delivered cost near $4.50

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
- **Restated, 7 Aug 2026 (#7).** The second exit, taken. The intro and the consent screen now say
  that every case is written for this exercise and every figure in it is illustrative, and the
  debrief says it again after the run. The disclosure is deliberately general: it does not name this
  case or this slider, because the instrument observes whether a reader interrogates the load-bearing
  figure without being told which one it is, and a disclosure that pointed at it would leave nothing
  to observe. `invariants.test.ts` asserts both halves — that the three screens call the figures
  illustrative, and that neither pre-run screen names the trap case or its slider.
- **Primary link:** TODO — a named campaign or evaluator report giving delivered cost per net
  including logistics and wastage. Still open, and now optional rather than blocking: pinning it
  would move this row to PRIMARY and would mean changing `$2.00` and `$4.50` to whatever the source
  says, which rewrites all six branches of the trap copy and Round 3's threshold with them.
- **Action before release:** none outstanding. The publication obligation is discharged by the
  disclosure, and the disclosure is the thing to protect: deleting it puts this row back to FLAGGED.

### ILLUSTRATIVE — Chlorination access near 80% against sustained use roughly half that

- **Where:** Slate B, case 3 — `SLATES.B.cases[2]`; trap copy on the result screen.
- **Status:** Illustrative. The access-versus-use distinction is real and is the reason the case
  exists; the numbers are constructed.
- **Now published.** As above: recorded at the v0.6 pass as in the case data and the trap copy and on
  no screen, then published by the rebuilt screens in the same version. The supplied `80%` coverage
  figure opens the assisted round's chlorination slider, and the access-versus-use sentence is in its
  evidence panel. The debrief adds the same “roughly doubles” magnitude, and Round 3 adds the
  threshold “sustained free chlorine residual above 70% at twelve months”.
- **Restated, 7 Aug 2026 (#7).** As above, and by the same three screens — the disclosure is written
  once and covers every case rather than being repeated per figure, which is also why it names
  neither this case nor its slider.
- **Primary link:** TODO — follow-up study reporting measured free chlorine residual against
  installation or access rates. Still open, and now optional rather than blocking, on the same terms.
- **Action before release:** none outstanding, on the same terms as above.

### ILLUSTRATIVE — Cash transfers: the income gain decaying enough to roughly triple the cost per lasting doubling

- **Where:** Slate A, case 1 — `SLATES.A.cases[0]`; Round 3, which replays it. Added when Round 3
  was built, on finding that this case publishes a magnitude and had no row at all — the table
  covered the other four.
- **Status:** Illustrative, and the same construction as the trap figures: the direction is real and
  the multiplier is made for the task. Round 3 also publishes a threshold, “holding above half its
  year-one level” at five years, as the evidence that would change the assistant's view.
- **Restated, 7 Aug 2026 (#7).** Covered by the same disclosure. This row is not named in #7, which
  asked about the two trap figures, but it is the same object — a multiplier built for the task and
  published — and clearing the two while leaving an identical third would make the grade mean the
  issue number rather than the state of the figure.
- **Primary link:** TODO — a long-run cash transfer follow-up reporting consumption or income at
  five years or later against the year-one effect. Still open, and now optional rather than blocking.
- **Action before release:** none outstanding, on the same terms as above.

### ILLUSTRATIVE — Transfer check: 41,000 doses at about $1.90 per dose, reported as $1.90 per child protected

- **Where:** The transfer check — `TRANSFER` in `src/content/transfer.ts`, the summary and the first
  of the four options. Added at the #7 pass, which found the seventh case carrying the same class of
  constructed figure as the six in the slates and tracked by no row at all.
- **Status:** Illustrative, and constructed for the same purpose as the trap: the gap between doses
  delivered and children completing a three-dose course is a real measurement problem, and the
  programme, the country, the dose count and the unit cost are written for the exercise.
- **Restated, 7 Aug 2026 (#7).** Covered by the intro and consent disclosure, which says every case
  here is written for this exercise. The debrief's line lands before this screen, so a reader meets
  the transfer case having been told twice.
- **Primary link:** TODO — an outreach immunisation costing that reports cost per fully immunised
  child alongside cost per dose. Optional rather than blocking, on the same terms as the rows above.
- **Action before release:** none outstanding. Recorded chiefly so that the next reader of this table
  finds the seventh case in it rather than discovering it the way this pass did.

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
  default. The #7 disclosure covers it — the intro and consent screens say every figure in every case
  is illustrative, which includes this one — so the question it raises is now about the design rather
  than about publication.
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
  it now reads as one on a page rather than in a data file. The #7 disclosure covers it on the same
  terms as the deworming row.
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

### PRIMARY — The contrast and target-size thresholds this build is held to are WCAG 2.2's

- **Where:** `src/styles/tokens.css`, `src/styles/app.css` and `src/styles/prose.css` are written
  against them; `scripts/check-contrast.mjs` and `tests/targets.spec.ts` enforce them; the v0.6
  changelog entries cite them by number.
- **The claims:** that body text needs 4.5:1 and large text 3:1 (SC 1.4.3 Contrast (Minimum), AA);
  that non-text carrying information needs 3:1 (SC 1.4.11 Non-text Contrast, AA); that a target must
  be at least 24 × 24 CSS pixels (SC 2.5.8 Target Size (Minimum), AA) and 44 × 44 for the enhanced
  criterion (SC 2.5.5 Target Size (Enhanced), AAA). Also the two exemptions this build stands on: that
  SC 1.4.3 exempts text that is pure decoration, and that it exempts text forming part of an inactive
  user interface component.
- **Status:** Primary, and the primary source is the specification itself rather than a summary of it.
  W3C Recommendation, 12 December 2024: <https://www.w3.org/TR/WCAG22/>. The individual criteria are
  at `#contrast-minimum`, `#non-text-contrast`, `#target-size-minimum` and `#target-size-enhanced`; the
  relative-luminance and contrast-ratio formulae `check-contrast.mjs` implements are in the same
  document's definitions.
- **Checked:** 7 Aug 2026 (v0.6), against the Recommendation.
- **Note:** this row exists because the sweep is the first change here to make a design decision by
  citing an outside standard, and because two of those decisions are exemptions. An exemption is a
  claim about what a standard says, which is exactly the kind of claim this table is for. Both are
  named at the point of use as well — beside the pair in `check-contrast.mjs` and beside the filter in
  `tests/axe.spec.ts` — so neither is a number in a comment.

### PRIMARY — Every contrast ratio in this repository is computed from the palette on every run

- **Where:** `scripts/check-contrast.mjs`, run by `npm run check` and by the first CI job.
- **Status:** Verified per run, and the second row here graded PRIMARY on the grounds that it verifies
  itself. The hexes are read out of `src/styles/tokens.css` and no colour is restated in the script, so
  the ratios cannot describe a palette the repository does not have. Every token must appear in the
  table as text, non-text, surface or alias, so a new colour cannot arrive unmeasured.
- **Checked:** every run.
- **Corrected, and this is why the row exists.** Until v0.6 the ratios lived in a comment in
  `tokens.css`, and one of them was wrong for three versions: the note gave `#6B6358` as 4.76:1 on
  `#ECE8DE` where it measures 4.83:1. The two failing ratios beside it were right; the passing one —
  the number carrying the claim that the fix cleared 4.5:1 — was not. The comment states no ratios now
  and points at the script.
- **What it does not do:** it enforces text and reports non-text, because SC 1.4.11's threshold applies
  only where a graphic carries information and no script can decide that. One non-text pair is under
  3:1 and left to the author — see the row below.

### FLAGGED — `--blue-bar` is under the non-text threshold on the debrief's chart

- **Where:** `src/styles/tokens.css`, `--blue-bar: #6E93A6`; rendered by `.dm-bar-unassisted` in
  `src/ui/PairedBar.tsx`, the control series in the debrief's paired readout.
- **Status:** 2.47:1 against `--dm-track`, the bar's own track. SC 1.4.11 asks 3:1 of a graphical
  object required to understand the content. The assisted series is 5.58:1 and passes.
- **The argument for leaving it:** every bar prints its value in `.dm-bar-value` beside it and repeats
  it in the bar's `aria-label`, so no quantity on that screen is available only from the fill. The bars
  are a redundant rendering of numbers that are already text.
- **Why it is FLAGGED anyway:** that is reasoning doing work rather than confirming a pass, and it is
  the only pair in either palette where it does. A reader who takes the chart at a glance is reading the
  fill, whatever the table beside it says.
- **Action:** the author's. Darkening the control series is a change to the debrief's chart, not
  something an accessibility sweep gets to decide on its way past. `check-contrast.mjs` prints the ratio
  and this argument on every run, so the decision does not go quiet.

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
