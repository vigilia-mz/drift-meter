# The Drift Meter — changelog

Experiment 01 of the Agential Drift Research Program.
Author: Megi Pishtari (github.com/vigilia-mz). Sole author, sole responsibility for every claim.

Every release records what changed and why. Retractions are recorded, not deleted.

Versions v0.1 through v0.5 were published from a separate repository, which has since been deleted.
This file is the surviving record of them.

## v0.6 — in progress — Rebuilt from source, and a model re-baseline

**What changed**

- The instrument is being rebuilt from source, in this repository, and it runs again. v0.1 through
  v0.5 shipped it as a single generated file with no editable source on disk, no tests, no types, no
  linting and no continuous integration; the last of them weighed 894 KB. Rebuilt and under test so
  far: the case data, the cost model, the derived measures, and ten of the instrument's thirteen
  screens — the intro, the consent step, both rounds with their confidence gates, the debrief, the
  transfer check, Round 3 and the four design rules. The remaining three render a page saying they
  are not finished rather than an empty frame. Not rebuilt: the endpoint and the model pin. The
  remaining steps are tracked in the open rather than described as finished.
- One reducer holds the whole flow, and it is pure: no DOM, no clock, no entropy. The assignment is
  drawn outside it and handed in, which is what lets the thirteen-screen flow be exercised in tests
  with no browser. The previous build kept the two rounds in loose arrays and read them through
  non-null assertions; a completed run is now a type in which both rounds are present.
- The run parameters are back — `?seed=`, `?order=`, `?slate=` and `?arm=` — and a pinned run is
  recorded as pinned, so the debrief can decline to call it counterbalanced. A parameter that fails
  to parse produces an ordinary randomised run and does not claim otherwise. Where a URL parameter
  fixed the order, the slate or the arm, the debrief's assignment rows read “Fixed by URL parameter
  on this run, not randomised” in place of the counterbalancing sentence.
- Screen changes move focus to the new screen's heading, retitle the document and announce politely.
  There is no router, so without this a keyboard reader gets no signal that the page changed at all.
  The two rounds announce their number, because they are otherwise the same screen twice.
- Framing autonomy is drawn as a hatched bar reading `n/a` in the round where no estimate was
  supplied — never as a zero. A zero-width bar would be a claim about the reader; there is no
  measure there to make one from. The v0.2 retraction is the reason this is a rendering rule and
  not a detail.
- Round 3 withholds every figure until the reader has committed a read and a guess at which
  assumption the answer rests on, and the reveal is one-way. Where two assumptions tie, the screen
  names the tie rather than breaking it.
- The transfer check asks one question about one unseen case and scores nothing. It says on the page
  that it is the weakest measurement here, because one item asked ninety seconds after the same
  error was explained tests recognition rather than transfer.
- **The four design rules are published, and two of the four are newly written.** Rule 2 survives
  verbatim from the previous build and Rule 4 survives in substance. Rules 1 and 3 are
  reconstructed from what Round 3 collects. The mapping of each rule to its learning-science
  mechanism is an authorial judgement rather than a recovery, and `spec.ts` says so.
- **The model for the rebuilt instrument will be pinned to `claude-opus-5`, and that is a
  re-baseline rather than maintenance.** No constant holds it yet — `shared/model.ts` ships with the
  endpoint — so this entry records the decision rather than the change. The consequence is the same
  either way: rubric pass rates on the encoded screen are not comparable to the v0.4 and v0.5 runs,
  and neither is any figure derived from them. The series restarts here.
- `drift-meter.html` served a page saying the instrument is being rebuilt, in place of the 404 that
  four links on the site were reaching. It carried `noindex`, since it was temporary. Within this
  same version the rebuilt instrument has taken the URL back, which is what the placeholder was
  holding it for.
- The footer contact on all four pages is the GitHub profile rather than an email address. The
  address it replaced lived in the deleted repository, and nothing here records it.
- Muted text moved to `#6B6358` in both palettes. It replaces `#A39A8B` (2.27:1) on the instrument
  and `#A39A88` (2.40:1) on the essays, both of which are retained as decoration tokens. On the
  essays' `#F0EEE6` it measures 5.09:1 and is a visible change to caption colour on text down to
  10.5px; on the instrument's `#ECE8DE` it measures 4.83:1, and the rebuilt screens render it, since
  the instrument's stylesheet consumes `--dm-muted` throughout. A two-token revert. It is not an
  accessibility pass either: `--prose-muted-soft` is still 3.19:1 on real text at 11–12.5px,
  `--dm-muted-soft` is 3.14:1 and still has no consumer, and both are left for the sweep that will
  lock every one of these with a contrast check instead of a comment.
- The case data carries typographic single quotes throughout — two possessive apostrophes and one
  quoted phrase. Typography, not wording. A straight apostrophe in the landing page's footer was
  brought into line in the same pass.
- `docs/deliberate-quirks.md` collects the behaviours that look like defects and are not, each named
  against the test that holds it in place, so that a later reader does not tidy one away.
- `SOURCES.md` re-verified row by row against the rebuild. Rows that locate a claim on a screen this
  build has not reproduced yet say so, instead of implying the claim is live — and where the rebuilt
  screens have since reached the claim, the row records that instead. Four external claims published
  on the essay pages had no row locating them there — three untracked entirely, and the Project Deal
  figures tracked only by a row that placed them in a separate document. They have rows now. The
  pass also states what it did not cover, rather than implying it was exhaustive.
- **Figures flagged as not cleared for publication are now published.** The bednet case's supplied
  `$2.00` and the chlorination case's `80%` coverage reach a page for the first time in this rebuild,
  along with the evidence text that undoes each. The debrief's trap paragraphs add the consequence of
  each planted error — that correcting it “roughly doubles the cost per death averted” — which is a
  magnitude neither evidence panel states, and Round 3 adds the thresholds that would change the
  assistant's view on the same two cases. The cash transfers case, which had no row in `SOURCES.md`
  at all, publishes a multiplier; it has one now. Pinning these, or restating them on the page as
  hypothetical, is overdue rather than pending. The deworming case's lifetime income gain factor of
  3.0 and the vitamin A case's 0.0015 deaths averted per child-year render alongside them, as the
  assisted round's opening position rather than as quoted results; their two rows say so.
- **The case figures are restated on the page as illustrative, which closes #7.** The instrument now
  says, on the intro and on the consent screen before any work starts and once more in the debrief
  after it, that every case is written for the exercise, that the programmes are generic rather than
  real organisations, and that every figure attached to them is illustrative rather than traced to a
  named study. Four rows in `SOURCES.md` move from FLAGGED to a new ILLUSTRATIVE grade: the bednet
  and chlorination trap figures #7 named, the cash transfers multiplier, and the transfer check's
  `$1.90` per dose, which was published by a seventh case that no row tracked at all. The three
  FLAGGED rows on the essay pages are untouched: those are claims about the world stated as findings,
  and a disclosure cannot clear them.
- The disclosure names no case and no slider. It says every figure is illustrative and stops there,
  because what the instrument observes is whether a reader interrogates the load-bearing number
  without being told which one it is. `invariants.test.ts` asserts both halves — that the three
  screens carry the disclosure, and that neither pre-run screen contains the trap case's name or its
  slider's label.
- **The Clio reference is pinned, and the claim it was pinned for is narrower than the row said,
  which closes #8.** It is the first link this table has held in this repository; the other ten rows
  still read `Primary link: TODO`. #8 asked for the reference to be pinned or for the claim to stop
  being made. The reference is pinned, and the row's own characterisation is narrowed rather than
  dropped. The row called Clio the reference standard for privacy-preserving measurement over real
  usage. Anthropic's paper says the core technologies underlying Clio are not fundamentally new, says
  it builds on differential privacy, k-anonymity and federated learning, and says formal guarantees
  of that kind are difficult to apply to it; neither the paper nor the research page calls Clio a
  standard. So the superlative is withdrawn, the row claims what the pinned pages support, and it
  moves from PRIMARY AVAILABLE to PRIMARY. No page changes: the rebuilt consent screen already
  declined the comparison, and the protocol screen that also carried it is still a route to the
  not-rebuilt stub. Two consequences elsewhere. The table's header now defines PRIMARY, which it had
  left to a single self-explaining row, and says of PRIMARY AVAILABLE that an unpinned source is also
  an unread one. And `CLAUDE.md` said the printed model ID is the one row graded `PRIMARY`; it now
  says the row is graded `PRIMARY` on the same grounds, without the count.
- Corrected: the contrast note in `tokens.css` gave `#6B6358` as 4.76:1 on `#ECE8DE`. It measures
  4.83:1. The two failing ratios in the same note were right; the passing one — the number carrying
  the claim that the fix clears 4.5:1 — was not.
- Corrected: `essay.html` gave the Project Deal fairness figures, 4.05 and 4.06, without the
  seven-point scale they sit on. `atrophy.html` states the scale; the essay did not. That is the
  precise omission the CORRECTED row in `SOURCES.md` exists to memorialise, reproduced on a page of
  this build.
- Corrected: the test pinning `money(999.6)` said the values that print `$1000` were unreachable
  from the six real cases. Four on-step slider combinations on Slate B's vitamin A case reach it.
  The behaviour is unchanged and still deliberate; the comment justifying it was wrong.
- Corrected: a comment in `metrics.ts` said a test cross-checks the 0.25 autonomy saturation
  constant against the page's prose. There is no such test, and no such prose yet.
- Corrected: `CLAUDE.md` said an end-to-end test asserts the three prose pages issue zero `.js`
  requests, and the same claim sat in a `vite.config.ts` comment. There is no end-to-end test and no
  Playwright in the toolchain; the assertion is scheduled in #19, where the browser dependency was
  deliberately deferred until there are screens to drive. Both now say what holds the property
  today: the pages carry no script tag, so the build emits no chunk for them, and review is the only
  thing enforcing it. The convention also no longer leaves `scripts/check-size.mjs` to imply a
  per-page check — it reports a JavaScript total for the whole build, which would stay quiet if one
  essay gained a script tag and the total still fit the budget.
- Corrected: `CLAUDE.md` said the wording in `src/content/` is snapshot-tested. There are no
  snapshot files. The claim is withdrawn rather than rescheduled: the content modules are the prose
  rather than a rendering of it, so an edit to the author's words is already a reviewable diff in
  the module itself, and whether a snapshot test earns its keep on top of that is left open. The
  invariants test named in the same sentence is real, and the convention now describes what it
  actually asserts.
- Corrected: the Clio row in `SOURCES.md` said the word appeared nowhere in the repository except in
  its own heading, and that the protocol screen does not exist. The header of the same file uses the
  word too, in the sentence recording that the rebuilt consent screen declines to make the claim —
  added by the merge that rewrote the row's sentence, so the sentence was false as soon as it was
  written. The protocol screen is a route that is reachable from the intro and the debrief and lands
  on the not-rebuilt stub. The row now names the file rather than counting the places, and says what
  the route does.

**Why**

The previous build's central defect was that it could not be corrected with any confidence. There
was no source to correct, and nothing in the process that would have caught an arithmetic error in a
published figure — the ÷6-versus-÷9 bug was found by a reader. Rebuilding from source is the only
version of this project that makes that class of error hard rather than easy.

Three behaviours in the rebuilt reducer look like defects and are not: a case stays read once a panel
has been opened, a slider counts as touched even if it is put back, and a supplied recommendation
left standing records nothing. All three were already documented and already tested at the domain
layer, but those tests set the fields by hand and would have stayed green if the reducer wrote them
wrongly. They are now tested where they are actually implemented.

Restating the figures rather than pinning them is the honest reading of what they are. They were
built to make a particular error catchable, not taken from a source and then approximated, so pinning
one would mean changing the number to whatever the source said and rewriting the trap copy, Round 3's
thresholds and the transfer case around it — retro-fitting a provenance the figures never had. The
grade exists because the table could not previously say which of the two it held. What the restatement
does not do is verify anything: every `Primary link: TODO` in those rows is still open, and now
optional rather than blocking.

The disclosure is general on purpose, and that is the one place where this change trades against the
instrument. Saying beside the supplied estimate that this figure is illustrative would be the most
transparent version and would leave nothing to measure; a reader told where the planted error is has
not been observed noticing it. Saying only in the debrief would be safest for the measurement and
would still have the reader accept figures for three minutes before being told what they are. Before
and after, worded generally, is the version where both obligations survive.

The debrief is the screen where overclaiming would cost most, so what it says is bounded by what one
person on six cases can support: every branch names the confounds it cannot separate, and nothing on
it compares the reader to anyone else. The same discipline is why the transfer check prints its own
weakness beside its verdict, and why Round 3 states that it is excluded from the measures rather than
leaving the reader to assume it. A test now asserts that nothing done after the debrief can change
the debrief — the transfer pick and every Round 3 slider are outside anything the measures read.

Pinning the Clio reference was the mildest obligation in the source table, and it turned into a
withdrawal. The publication existed, so the row had been graded since v0.3 as though the pin were
clerical; what nobody did in that time was read the publication against the sentence it was supposed
to support. It does not support it. A source that exists is not a source
that agrees, and PRIMARY AVAILABLE made the difference easy to miss, because the grade is defined by
whether a link has been typed here rather than by whether anyone has read one. The claim was
published on the consent screen of the build that has since been deleted, which is the screen where a
reader is deciding whether to trust the page about data handling. Nothing in this repository records
the sentence itself, only that it was made.

Seven of the bullets above are corrections. Six are claims this project made about its own work: a
contrast ratio, four claims about its own tests, three of which describe tests that do not exist, and
a claim about where a word appears in the repository. The seventh is a scale qualifier on a published
figure, which the source table already existed to prevent. That they survived until someone checked
the paperwork against the code is the uncomfortable part. The withdrawal of “reference standard” in
the Clio bullet is a correction too, and the largest of the pass; it is filed as a change rather than
counted here because what it corrects is a claim about the world, not a claim about this project's
own work.

Two of the seven are in `CLAUDE.md`, which this pass first skipped on the grounds that it is the
working agreement rather than site content. The exemption does not survive the argument. A document
that tells every future contributor which properties are guaranteed, while naming two guarantees the
repository does not provide, is the failure this experiment is about: a claimed test is worse than a
missing one, because it stops anyone from looking for the gap.

The re-baseline is recorded on its own because it costs something. A pinned model is what makes two
runs comparable, so moving the pin discards the comparison: the v0.4 and v0.5 rubric pass rates
describe an instrument that no longer exists. Filing that as maintenance would preserve the
appearance of a continuous series while removing the thing that made it one.

## v0.5 — 30 Jul 2026 — It teaches, it checks, and it says who wrote it

**What changed**

- Transfer check added after the debrief: one unseen case carrying the same class of planted
  error (a proxy standing in for the outcome), one question, verdict either way.
- Repair pass on the encoded screen: failed rubric items are fed back as instructions, the
  answer is rewritten against them, and the rewrite is re-scored by the same grader.
  Before-and-after pass counts are shown, along with why a self-grading loop is generous.
- Production provenance section: what Claude drafted on this page, what it was never allowed
  to touch, what it drafted that was cut, and the rule that fell out of it.
- Registered prediction P6 added for transfer, with its own indefensibility stated.
- Endpoint gains `mode: "repair"`; a repair pass costs two against the per-visitor budget.

**Why**

A teaching instrument that never checks whether it taught is a diagnosis with good manners.
A score that goes nowhere is a report card rather than a system. And a page built with Claude
that will not say which parts is asking for a trust it has not earned.

## v0.4 — 30 Jul 2026 — The rules, encoded and scored

**What changed**

- New live screen: the four design rules run as a system prompt against the same model with no
  rules at all, on a learner question the reader picks. Three calls per run (default answer,
  rule-governed answer, grading pass).
- Four-item rubric scored live against the rule-governed answer. Failures are shown, not hidden.
- The system prompt is displayed in full on the page. It is the artifact, not an implementation detail.
- Specification reframed for teaching: each rule now names the learning-science mechanism behind it
  (generation and pretesting, desirable difficulty, refutation, calibration).
- Sixty-second path added to the landing screen for readers who will not reach screen ten.
- Endpoint gains a `mode: "teach"` branch; a teach run costs three against the per-visitor budget.

**Why**

A specification nobody can run is an opinion, and a quality bar held in one person's taste does
not survive contact with scale. Writing the rules down as a prompt and a rubric is the only
version of this argument that can be argued with, versioned, or proved wrong.

## v0.3 — 30 Jul 2026 — Protocol rebuild

**What changed**

- Condition order counterbalanced; slate assignment randomised independently of order. Assistance, practice and case difficulty no longer vary together.
- Three attribution arms added (AI-attributed, human-attributed, unattributed) against a no-estimate control round. The supplied number is identical across arms; only the authority attached to it varies.
- Consent and data-handling step added before the first round, with a local-only option that disables the live reflection.
- Every measure given an explicit formula and a stated threat to validity. Constants flagged as arbitrary pending calibration.
- Framing autonomy reported as undefined in the control round rather than imputed from an invented constant.
- Five predictions registered with their falsification conditions, before any collection.
- Reflection model pinned to an exact ID and printed on the page; the API-returned ID is displayed alongside every response.
- Round 3 added: four design rules that turn the finding into a specification. Excluded from the measures by construction.
- Bug: evaluative range was dividing by six sliders when there are nine. Fixed.

**Why**

An outside reader pointed out that v0.2 could not distinguish "AI degrades judgment" from
"handed answers degrade judgment", and that three things varied at once between the two rounds
(assistance, practice, and the cases themselves). Both were fatal to the claim and neither was
hard to fix, which is the uncomfortable part.

## v0.2 — Jul 2026 — Cohort dashboard removed

**What changed** — Deleted the cohort comparison screen and its figures from the page and from
the source. Replaced with a methodology screen stating what would need to be measured.

**Why** — The figures were illustrative and the page implied they were measured. n was zero.
A prototype about people accepting numbers they have not checked cannot ship invented numbers.

## v0.1 — Jul 2026 — First public build

**What changed** — Two-round instrument, five dimensions, live Claude reflection endpoint with
the API key held server-side.

**Why** — Initial release.
