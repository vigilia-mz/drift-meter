# The Drift Meter — changelog

Experiment 01 of the Agential Drift Research Program.
Author: Megi Pishtari (github.com/vigilia-mz). Sole author, sole responsibility for every claim.

Every release records what changed and why. Retractions are recorded, not deleted.

Versions v0.1 through v0.5 were published from a separate repository, which has since been deleted.
This file is the surviving record of them.

## Unreleased — Two tests CLAUDE.md claimed, and does not have

Folds into the v0.6 entry when #20 writes it.

**What changed**

- `CLAUDE.md` asserted, in the present tense, that an end-to-end test checks the three prose pages
  issue zero `.js` requests. There is no end-to-end test and no Playwright in the toolchain. The
  sentence now says what holds the property today — the pages carry no script tag, so the build
  emits no chunk for them, and review is the only thing enforcing it — and points at #19, where
  the assertion was always scheduled. `scripts/check-size.mjs` is described as what it is: a
  JavaScript total for the whole build, which would stay quiet if one essay gained a script tag and
  the total still fit the budget.
- The same claim in the `vite.config.ts` comment, corrected in the same pass.
- `CLAUDE.md` also asserted that the wording in `src/content/` is snapshot-tested. There are no
  snapshot files. That claim is withdrawn rather than rescheduled: the content modules are the
  prose rather than a rendering of it, so an edit to the author's words is already a reviewable
  diff in the module itself, and whether a snapshot test earns its keep on top of that is left as
  an open call. The invariants test named in the same sentence is real, and the paragraph now
  describes what it actually asserts.

**Why**

The v0.6 paperwork pass (#20) corrected this class of error in `tokens.css`,
`src/domain/model.test.ts` and `src/domain/metrics.ts`, and left `CLAUDE.md` alone on the grounds
that it is the working agreement rather than site content. That exemption does not survive the
argument the project is making. A document that tells every future contributor which properties are
guaranteed, while naming two guarantees that do not exist, is the failure this experiment is about:
a claimed test is worse than a missing one, because it stops anyone from looking for the gap. No
guarantee was lost here — there was never one to lose, which is the point.

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
