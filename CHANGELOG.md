# The Drift Meter — changelog

Experiment 01 of the Agential Drift Research Program.
Author: Megi Pishtari (github.com/vigilia-mz). Sole author, sole responsibility for every claim.

Every release records what changed and why. Retractions are recorded, not deleted.

Versions v0.1 through v0.5 were published from a separate repository, which has since been deleted.
This file is the surviving record of them.

## v0.6 — in progress — Rebuilt from source, and a model re-baseline

**What changed**

- The instrument is being rebuilt from source, in this repository. v0.1 through v0.5 shipped it as a
  single generated file with no editable source on disk, no tests, no types, no linting and no
  continuous integration; the last of them weighed 894 KB. Rebuilt and under test so far: the case
  data, the cost model and the derived measures. Not rebuilt: the screens, the endpoint and the
  model pin. The remaining steps are tracked in the open rather than described as finished.
- **The model for the rebuilt instrument will be pinned to `claude-opus-5`, and that is a
  re-baseline rather than maintenance.** No constant holds it yet — `shared/model.ts` ships with the
  endpoint — so this entry records the decision rather than the change. The consequence is the same
  either way: rubric pass rates on the encoded screen are not comparable to the v0.4 and v0.5 runs,
  and neither is any figure derived from them. The series restarts here.
- `drift-meter.html` serves a page saying the instrument is being rebuilt, in place of the 404 that
  four links on the site were reaching. It carries `noindex`, since it is temporary.
- The footer contact on all four pages is the GitHub profile rather than an email address. The
  address it replaced lived in the deleted repository, and nothing here records it.
- Muted text moved to `#6B6358` in both palettes. It replaces `#A39A8B` (2.27:1) on the instrument
  and `#A39A88` (2.40:1) on the essays, both of which are retained as decoration tokens. On the
  essays' `#F0EEE6` it measures 5.09:1 and is a visible change to caption colour on text down to
  10.5px; on the instrument's `#ECE8DE` it measures 4.83:1, where nothing renders it yet, because no
  stylesheet consumes a `--dm-*` token until the instrument is rebuilt. A two-token revert. It is
  not an accessibility pass either: `--prose-muted-soft` is still 3.19:1 on real text at 11–12.5px,
  `--dm-muted-soft` is 3.14:1 and unrendered, and both are left for the sweep that will lock every
  one of these with a contrast check instead of a comment.
- The case data carries typographic single quotes throughout — two possessive apostrophes and one
  quoted phrase. Typography, not wording. A straight apostrophe in the landing page's footer was
  brought into line in the same pass.
- `docs/deliberate-quirks.md` collects the behaviours that look like defects and are not, each named
  against the test that holds it in place, so that a later reader does not tidy one away.
- `SOURCES.md` re-verified row by row against the rebuild. Four rows locate a claim on a screen this
  build has not reproduced yet, and now say so instead of implying the claim is live. Four external
  claims published on the essay pages had no row locating them there — three untracked entirely, and
  the Project Deal figures tracked only by a row that placed them in a separate document. They have
  rows now. The pass also states what it did not cover, rather than implying it was exhaustive.
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

**Why**

The previous build's central defect was that it could not be corrected with any confidence. There
was no source to correct, and nothing in the process that would have caught an arithmetic error in a
published figure — the ÷6-versus-÷9 bug was found by a reader. Rebuilding from source is the only
version of this project that makes that class of error hard rather than easy.

Four of the bullets above are corrections, and three of them are claims this project made about its
own work: a contrast ratio, a test comment, and a scale qualifier the source table already existed to
prevent. That they survived until someone checked the paperwork against the code is the uncomfortable
part.

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
