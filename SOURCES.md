# The Drift Meter — source table

Every external claim, its source, whether that source is primary or secondary, and the date last
checked. Rows marked FLAGGED are not cleared for publication: each must be pinned to a primary
source or restated as explicitly hypothetical before this leaves prototype status. PRIMARY AVAILABLE
means a specific primary source is known to exist and has simply not been pinned here yet, which also
means nobody has read it against the claim; FLAGGED means no particular source has been identified.
PRIMARY means the source is pinned here and was read on a stated date. The model row is the one
exception, and it is exempt from both halves — it pins no address, and nothing in this build verifies
it — because the claim it describes is the one here that would verify itself once it runs.

ILLUSTRATIVE was added at the v0.6 close of #7, for a figure that is constructed for the exercise and
says so on the page. It is the second of the two exits FLAGGED offers, and it is not a weaker version
of a pinned row: a figure taken from a source and a figure built for a task are different objects,
and the table was previously unable to say which one it held. A row earns it only while the
disclosure is live. For the four case rows that is held by `invariants.test.ts`; for the landing
page's specimen readout it is held by review, and that row says so. It is not CORRECTED — nothing
here was wrong. It was undisclosed, which is a different failure with a different fix.

Last location-and-state pass: 10 Aug 2026 (#39). Last source pass: 30 Jul 2026 (v0.3). First source
pinned: 7 Aug 2026 (#8). No row's source was re-verified in the v0.6 pass, and #7 did not verify one
either; #8 verified one, and the ten `Primary link: TODO` lines that remain below are as open as they
were. Restating a figure as illustrative closes the publication obligation and closes nothing else.

The v0.6 pass was run against the rebuild rather than against the deleted build these rows were
written for, which changed two things. Several rows locate a claim on a screen the rebuild has not
reproduced yet; those carry a **State in this build** line rather than a quieter status, because a
row that reads as live when nothing renders it is the same failure as a figure without its scale.
And the pass found four external claims on the essay pages that no row located there — three
untracked entirely, and the Project Deal figures tracked only by the CORRECTED row, which placed them
in a separate document. They have rows now.

The screens then arrived in the same version, before the pass had cooled, and overtook most of what
it had recorded. All thirteen now render, so the bednet, chlorination, deworming and vitamin A
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

The three FLAGGED rows that remain are a different object and are untouched by that reasoning. They
are the essay pages' empirical claims about students, endoscopists and developers: assertions about
the world, stated as findings, with no citation. A disclosure cannot clear those, because they are not
illustrative — they are either true and uncited or they are not true. They stay FLAGGED.

The accessibility sweep then added two PRIMARY rows, the first here to cite an outside standard rather
than a study. It also found one thing this build does not meet, and that is deliberately not a row of
its own: a failing contrast pair is a defect in this build, not a claim taken from somewhere else, and
this table is for claims. Grading it FLAGGED would have made that grade mean two different things — an
unpinned assertion about the world, and a hex that needs changing — and the fix for it is not a
citation. It is stated inside the row that pins the standard, so that row cannot be read as claiming
conformance, and it is in `CHANGELOG.md` and in the check's own output on every run.

Then #8, which asked for the Clio reference to be pinned or for the claim to stop being made. Both
have happened, in that order. The rebuild stopped making it — the consent screen dropped the
comparison and protocol section 1 declined to add it back — and this pass pins the publication.
Reading the paper against this table's heading found the heading overstating it: Anthropic describes
a system for privacy-preserving analysis of real-world usage and says it builds on the privacy
literature, not a standard for the field. The superlative is withdrawn and the row claims what the
pinned pages support. That row carries the first link in this table, and it is the only claim here
checked against a source since 30 Jul 2026.

Then #39, which asked what paperwork the August patch owed. Most of it had been paid inside the same
version, by the commits that made the changes rather than by a pass afterwards. What the question also
turned up is the row below on the landing page's specimen readout: six invented bar widths, published
on the front door since v0.1 and located by nothing here. Every pass above ran against the instrument
— its content modules, its screens, its case data — and this claim is markup in a hand-written page,
so each of them looked past it. A location pass is only as wide as the thing it was pointed at, and
saying so here is cheaper than implying this file is now complete.

What no pass has covered: the essays' attributions of position to Beauvoir and Murdoch, and their
generalisations about how experienced users behave. Those are the next tranche, and naming them here
is cheaper than implying the sweep was exhaustive. The accessibility sweep is not exhaustive either,
and says where it stops: two axe rules off on one selector each with the clause they stand on, and one
non-text pair under its threshold and left to the author.

**This table is now mirrored on the publication-process screen**, one row per entry, each printed
with its grade and with the note that explains it. The file stays the record: the screen carries the
short form and says so, and `invariants.test.ts` asserts that the two hold the same claims at the
same grades, so a row added here and forgotten there fails rather than quietly shortening the
published table. What the screen does not reproduce is the per-row history above — the state lines,
the superseded conditions, the account of which pass found what. That is the part a reader who wants
to argue with the grading needs, and it is the reason the screen links here rather than replacing it.

The protocol screen states the same thing from the other side, in its stimulus provenance section:
that the case figures are built for the exercise, that five rows here carry the grade saying so — the
four case figures and the landing page's specimen readout — and
that the disclosure the reader met names no case and no slider.

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

### ILLUSTRATIVE — Landing page specimen readout: three pairs of bars, at 84 against 43, 71 against 39, and 31 against 72

- **Where:** `index.html`, the specimen block between the hero and the section on what the instrument
  measures. Six bar widths, written as percentages in the markup.
- **Status:** Illustrative, and a different kind of thing from the four rows above. Those approximate
  quantities that exist; these approximate nothing. They are a drawing of the readout's shape, put on
  the landing page so a reader who will not start the instrument can see what it produces. There is no
  run behind them and there is no cohort.
- **Disclosed on the page, in those words.** The caption says the three bars are invented, that no run
  has produced them, that n is zero, and that nothing has been collected from anyone.
- **Added 10 Aug 2026 (#39).** Neither the v0.6 location pass nor the #7 pass found this claim, and #7
  is where it belonged: that pass gave a row to every other constructed figure on the site, and this
  is the only set of them on the front door. Both passes ran against the instrument, where a
  constructed figure lives in a content module as data, and these six numbers are style attributes in
  a hand-written page. The sweep found what it was pointed at.
- **Primary link:** none, and not TODO. The other ILLUSTRATIVE rows carry an open link that pinning
  would convert to PRIMARY. This one has nothing to pin, because the bars are not an estimate of
  anything. What would retire the row is a run, which is #34, and n is zero.
- **Action before release:** none outstanding while the caption stands, and the caption is the whole of
  what this grade rests on. Two conditions on it. It may not be shortened back to a one-word label: it
  read “Illustrative” until 10 Aug 2026, which is the same word an invented cohort dashboard could have
  carried, on the page whose own method note explains why that dashboard was retracted — rule 6 asks
  for the sentence. And nothing tests it. The instrument's disclosure is held by `invariants.test.ts`,
  but `index.html` has no content module and no test reads its prose, so this caption is held by review
  alone. That is the weakest support under any row in this table, and it is stated here rather than
  left to be inferred from the absence of a test name.

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

### PRIMARY — Clio as Anthropic's published system for privacy-preserving analysis of real-world usage

- **Where:** Consent screen; protocol section 1.
- **Status:** Anthropic has published on this directly, and the publication is now pinned below.
- **State in this build:** withdrawn as an assertion. Both screens this row locates the claim on
  have now been rebuilt, and neither makes it. The consent screen dropped it first; protocol section
  1 was written later in the same version and does not add it back, because a citation from memory
  is worst placed on the screen where a reader is deciding whether to trust the page about data
  handling. `invariants.test.ts` asserts that neither screen's copy contains it. What the
  publication-process screen does carry is this row, in the mirrored table, so the claim is
  published as something tracked rather than as something the site says. That was one of the two
  resolutions the open issue offered, and the weaker one: it discharges the obligation by not making
  the claim.
- **Pinned and narrowed, 7 Aug 2026 (#8).** The stronger resolution, taken after the weaker one, and
  between them the issue is answered both ways it asked for. The paper does not support the sentence
  this row was written for. The heading called Clio the reference standard for privacy-preserving
  measurement over real usage. The paper says the core technologies underlying Clio are not
  fundamentally new (§6.1), places itself as building on differential privacy, k-anonymity and
  federated learning (§7.2), and says formal guarantees of that kind are difficult to apply to it,
  so its own approach to privacy is statistical and empirical rather than formal (§2.3). What it
  does claim is priority and scale for the analysis — the first in-depth analysis of direct traffic
  on a major AI assistant (§7.1) — and a platform it validates, not a standard for the field.
  Neither the paper nor the research page calls Clio a standard. So the link is pinned for what it
  establishes and the superlative is withdrawn, on this row and in the mirrored table with it.
- **Primary link:** the paper is the version to cite: “Clio: Privacy-Preserving Insights into
  Real-World AI Use”, Tamkin, McCain et al., arXiv:2412.13678v1, 18 Dec 2024 —
  https://arxiv.org/abs/2412.13678v1. The versioned address cannot move, and the abs page listed v1
  as the only version when it was read. Anthropic's plain-language account of the same system is the
  research page, “Clio: A system for privacy-preserving insights into real-world AI use”,
  12 Dec 2024 — https://www.anthropic.com/research/clio, which carries a note dated 14 January 2025
  saying its own links to the paper now point at the arXiv version. The PDF on `assets.anthropic.com`
  is deliberately not pinned: the path is an opaque asset ID.
- **Checked:** 7 Aug 2026 — both pages opened and read against the claim this row makes rather than
  recalled, which is how the claim came to be narrowed. Nothing else in this table has been checked
  against a source since 30 Jul 2026.
- **Action before release:** none outstanding for the source. What remains is a wording condition
  rather than a paperwork one: anything reinstating the comparison has to say what the pinned pages
  say, which is that Clio is Anthropic's system for this and not the standard for it. The condition
  this row carried at the v0.6 pass — pin it before the consent screen is written — was overtaken in
  the same version and met by omission rather than by pinning, which is not the same thing. This row
  had no stated release condition until that pass either.
- **The row is kept rather than deleted.** A claim the site used to make and no longer makes is part
  of the record.

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

- **Where:** Result screen and the encoded screen; protocol section 5, which names both call sites.
- **Status:** Verified per request, in the builds that had an endpoint. The model ID is returned by
  the API in the response body and printed verbatim on the page.
- **Checked:** every request, in v0.3 through v0.5. Nothing has been checked in this build.
- **State in this build:** the whole mechanism now exists and none of it has run. `api/reflect.ts`
  reads the served ID off the response and returns it; the encoded screen prints it beside the
  answer, under a note saying that the printed value is the provenance record and the pinned constant
  is only what was asked for. What is still missing is a served ID, and it is missing by choice:
  `VITE_REFLECT_ENDPOINT` is empty in the committed `.env`, so no call is made, nothing is spent and
  nothing has been verified. The distance between this row and a verified one is now a one-line
  change with its own commit, plus the console actions in #13 — not any more code. The grade is kept
  on the same grounds as before: the mechanism it describes is the one claim here that verifies
  itself once it runs.
- **Note:** the re-baseline to `claude-opus-5` is recorded in `CHANGELOG.md` under v0.6 as a
  re-baseline rather than as maintenance — rubric pass rates from v0.4 and v0.5 are not comparable
  to runs after it. The pin now lives in `shared/model.ts` and a test asserts the ID appears nowhere
  in the protocol screen's prose, so a later re-baseline cannot leave a second, stale copy of it in a
  sentence.

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
- **What this build does not meet, said here so the row cannot be read as claiming conformance:**
  `--blue-bar`, the control series on the debrief's chart, measures 2.47:1 against its own track where
  SC 1.4.11 asks 3:1 of a graphic that carries information. Every bar prints its value beside it and
  repeats it in an `aria-label`, so no quantity on that screen is available only from the fill — but
  that is an argument doing work rather than a pass, and it is the only place in either palette where
  it is. Darkening the chart is the author's call and not the sweep's. It has no row of its own because
  it is a defect in this build rather than a claim taken from somewhere else, and this table is for
  claims; `check-contrast.mjs` prints the ratio and the argument on every run, and `CHANGELOG.md`
  records it under v0.6 as found and not fixed.

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

### PRIMARY AVAILABLE — Accuracy: the eighteen supported values are unauthored

- **Where:** `src/content/slates.ts`, `supported` on every `AssumptionSpec`; the accuracy row on the
  protocol screen (`src/content/method.ts`).
- **Status:** Nothing is asserted. All eighteen are `null`, so the measure is undefined in every run
  and the debrief bar reads `n/a` with a caption saying why. This row exists because the _absence_ is
  the thing worth tracking: the machinery to score a reader against the evidence landed in v0.6
  (#30), and the values it would score against did not. Grading it here rather than leaving the field
  blank is what makes authoring one a change that has to come through this table.
- **Action:** each `supported` value that is ever authored needs its own row and its own source
  before it ships — a number that a reader is scored against is the strongest claim this project
  could make, and it is the one that must not arrive as a plausible guess. Some of these have no
  defensible single value and should stay `null` permanently: cash-transfer persistence at five years
  is genuinely disputed and the case's own evidence panel says so. A partial measure that states its
  coverage is worth more than a complete one that invented its way to completeness.
