# The Drift Meter — changelog

Experiment 01 of the Agential Drift Research Program.
Author: Megi Pishtari (github.com/vigilia-mz). Sole author, sole responsibility for every claim.

Every release records what changed and why. Retractions are recorded, not deleted.

Versions v0.1 through v0.5 were published from a separate repository, which has since been deleted.
This file is the surviving record of them.

## v0.6 — in progress — Rebuilt from source

**What changed**

- The instrument runs again, from editable source. Six of its thirteen screens are rebuilt — the
  intro, the consent step, and both rounds with their confidence gates — and the remaining seven
  render a page saying they are not finished rather than an empty frame.
- One reducer holds the whole flow, and it is pure: no DOM, no clock, no entropy. The assignment is
  drawn outside it and handed in, which is what lets the thirteen-screen flow be exercised in tests
  with no browser. The previous build kept the two rounds in loose arrays and read them through
  non-null assertions; a completed run is now a type in which both rounds are present.
- The run parameters are back — `?seed=`, `?order=`, `?slate=` and `?arm=` — and a pinned run is
  recorded as pinned, so the debrief can decline to call it counterbalanced. A parameter that fails
  to parse produces an ordinary randomised run and does not claim otherwise.
- Screen changes move focus to the new screen's heading, retitle the document and announce politely.
  There is no router, so without this a keyboard reader gets no signal that the page changed at all.
  The two rounds announce their number, because they are otherwise the same screen twice.
- **Two figures flagged as not cleared for publication are now published.** The bednet case's
  supplied `$2.00` and the chlorination case's `80%` coverage reach a page for the first time in this
  rebuild, along with the evidence text that undoes each. Both rows in `SOURCES.md` said "not cleared
  for publication" and both now say they render. Pinning them, or restating them on the page as
  hypothetical, is now overdue rather than pending.

- The four screens where the instrument makes its argument are back: the debrief, the transfer
  check, Round 3, and the four design rules. Ten of the thirteen screens now render.
- Framing autonomy is drawn as a hatched bar reading `n/a` in the round where no estimate was
  supplied — never as a zero. A zero-width bar would be a claim about the reader; there is no
  measure there to make one from. The v0.2 retraction is the reason this is a rendering rule and
  not a detail.
- A pinned run says so. Where a URL parameter fixed the order, the slate or the arm, the debrief's
  assignment rows read “Fixed by URL parameter on this run, not randomised” in place of the
  counterbalancing sentence.
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
- **Further flagged figures now reach a page.** The debrief's trap paragraphs publish the
  consequence of each planted error — that correcting it “roughly doubles the cost per death
  averted” — which is a magnitude neither evidence panel states. Round 3 publishes the thresholds
  that would change the assistant's view on the same two cases. And the cash transfers case, which
  had no row in `SOURCES.md` at all, publishes a multiplier; it has one now.

**Why**

The previous build shipped the instrument as one generated file with no editable source, which made
it impossible to correct with any confidence — the wrong property for something whose whole claim is
that it measures something. Rebuilding it in reviewable pieces is the only version of this that can
be argued with.

Three behaviours in the rebuilt reducer look like defects and are not: a case stays read once a panel
has been opened, a slider counts as touched even if it is put back, and a supplied recommendation
left standing records nothing. All three were already documented and already tested at the domain
layer, but those tests set the fields by hand and would have stayed green if the reducer wrote them
wrongly. They are now tested where they are actually implemented.

The debrief is the screen where overclaiming would cost most, so what it says is bounded by what one
person on six cases can support: every branch names the confounds it cannot separate, and nothing on
it compares the reader to anyone else. The same discipline is why the transfer check prints its own
weakness beside its verdict, and why Round 3 states that it is excluded from the measures rather than
leaving the reader to assume it. A test now asserts that nothing done after the debrief can change
the debrief — the transfer pick and every Round 3 slider are outside anything the measures read.

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
