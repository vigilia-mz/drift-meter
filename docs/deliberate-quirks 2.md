# The Drift Meter — deliberate quirks

Behaviours in this repository that look like defects and are not. Each one is here because it is the
kind of thing a careful reader would tidy away, and tidying it would change a published measure or a
published number.

Every entry names the test that holds it in place. Tests are cited by title rather than by line, so
`grep` finds them after the file moves. Where a test does not fully pin the behaviour, the entry says
so — an overstated guarantee is worse than a missing one, because it stops anyone looking.

If you are about to change something on this list, that is fine. Change it deliberately, and take
the paperwork with you: `CLAUDE.md` rule 5 for anything the site asserts, rule 7 for anything that
produces a number.

## The measures

### `read` is sticky, and one case counts once

`CaseState.read` is set when either the model panel or the evidence panel is opened, and closing a
panel never clears it. Opening both does not count twice. `engagement` asks whether a case was looked
at, not for how long or how often, so `metrics()` counts the flag and never the live panel state.

- Where: `read` and its two panel flags in `CaseState`; `opens` in `metrics()`, both in
  `src/domain/metrics.ts`. The other consumer is the `missOpened` branch of `trapVerdict()`.
- Tests: `read is sticky: closing a panel does not un-read the case` and `read is set by either
panel, and opening both still counts once`, in `src/domain/metrics.test.ts`.
- **What the tests do not pin.** Both set `read` by hand, because the reducer that would open a panel
  does not exist yet — `src/state/` has not been rebuilt. They pin how `opens` consumes the flag.
  They would stay green if a future reducer cleared `read` on close, or set it from only one of the
  two panels. That guarantee arrives with the reducer, and it is the reducer's test to write.

### `touched` is a movement flag, not a value comparison

Dragging a slider and returning it to where it started still counts as touched. The behaviour under
observation is the act of interrogating the number, not the arithmetic distance travelled, so
`evaluative range` counts flags rather than comparing values against the starting position.

- Where: `touched` in `CaseState`; `moved` in `metrics()`, in `src/domain/metrics.ts`.
- Test: `touched is a movement flag, not a value comparison`, in `src/domain/metrics.test.ts`. It
  fails under either obvious rewrite to a value comparison.

### A supplied recommendation left standing scores nothing

`effRec()` exists so that in the assisted round the decision row can render pre-selected on the
recommendation the assistant supplied. No screen calls it yet. That display value never reaches a
measure: `ownRec()` returns the empty string until the participant actually clicks, and every measure
reads `ownRec()`. Leaving a default in place is not an observation of what a person decided.

This is the most consequential distinction in the scoring, and the one a refactor is most likely to
erase, because collapsing the two functions looks like removing a duplicate.

- Where: `ownRec()` and `effRec()` in `src/domain/metrics.ts`.
- Tests: `a full assisted round with every supplied recommendation left standing scores nothing`
  — which checks all four affected measures at once — plus `ownRec is empty until the participant
clicks` and `effRec shows the supplied recommendation while ownRec still records nothing`, in
  `src/domain/metrics.test.ts`.

### Framing autonomy is `null`, never `0`

In the control round no frame was supplied, so departure from it is undefined rather than zero. The
measure returns `null`. The reveal screen is to render that as a hatched bar reading `n/a` rather
than impute a number; that screen has not been rebuilt, and the bar is listed at the end of this file
with the other quirks still to land. An earlier version imputed the value from an invented constant;
that was removed in v0.3 and the `null` is the record of it.

The dangerous consumer is the closing paragraph: in JavaScript `null < 40` is `true`, so a naive
comparison tells every control-round reader they delegated a model that was never offered to them.
`closingKey()` carries an explicit null check for exactly that reason.

- Where: `auto` in `Metrics` and its guard in `metrics()`, `src/domain/metrics.ts`; `closingKey()`,
  `src/domain/reveal.ts`.
- Tests: `is null, never zero, in the round where no estimate was supplied` and `is typed as
nullable, so it cannot be widened to a plain number`, in `src/domain/metrics.test.ts`; and `does not
tell a control-round reader they delegated a model that was never supplied`, in
  `src/domain/reveal.test.ts`.

### The behavioural composite excludes framing autonomy

`actual` averages engagement, evaluative range and ambiguity tolerance, and leaves autonomy out
because it does not exist in the control round. So a run can score 100 on framing autonomy and 0
overall, which reads like a bug and is the honest answer: the composite has to mean the same thing in
both rounds to be compared across them. The divisor comes from the array, so adding a measure changes
it automatically.

- Where: `composite` in `metrics()`, `src/domain/metrics.ts`.
- Tests: `excludes framing autonomy, which is undefined in one of the two rounds` and `averages over
the measures defined in both rounds`, in `src/domain/metrics.test.ts`.

### The confidence gap is not clamped

Every other reported measure is a bounded integer from 0 to 100. `gap` is a plain number and may be
negative, because its sign is the finding: confidence running behind behaviour is a different result
from confidence running ahead of it, and flooring it at zero would delete one of them. The property
test that asserts bounded integers deliberately excludes this field.

- Where: `gap` in `Metrics`, `src/domain/metrics.ts`.
- Test: `leaves the gap unclamped, because its sign is the whole point`, in
  `src/domain/metrics.test.ts`.

## Formatting the numbers

### `money(999.6)` prints `$1000`, and `money(1000)` prints `$1,000`

`money()` chooses its branch on the unrounded value and rounds afterwards, so anything in
`[999.5, 1000)` takes the plain whole-dollar branch and prints without a separator. One digit later,
the separator appears.

This window is reachable. Four on-step slider combinations on Slate B's vitamin A case land on
`999.9999999999999` — a float that should have been exactly 1000 and fell one unit in the last place
short — so both forms are available on the same case: four settings print `$1000`, and seven others
print `$1,000`. No single-step move joins the two, which is why nobody found this by fiddling. Until
v0.6 the test comment claimed the window was unreachable; the behaviour was right and the excuse was
wrong.

- Where: `money()` in `src/domain/model.ts`.
- Tests: `prints a value that rounds up to a thousand without a separator`, pinned from the other
  side by `adds a thousands separator from a thousand`, in `src/domain/model.test.ts`.

### `money(9.996)` prints `$10.00`, and `money(10)` prints `$10`

The same branch-then-round shape one decade down, and louder, because the two forms differ by more
than a comma. Reachable from thirty on-step combinations on Slate A's deworming case.

- Where: `money()` in `src/domain/model.ts`.
- Test: `prints a value that rounds up to ten with cents, since the cents branch is chosen first`,
  in `src/domain/model.test.ts`. Added at v0.6; the boundary existed before and nothing held it.

### `money(0)` prints `n/a`, not `$0`

Anything non-finite or non-positive prints `n/a`. A division that produced `Infinity` is not a cheap
intervention, and a cost of zero is not a free one — printing either as a number would be exactly the
plausible-looking figure this project is about.

- Where: `money()` in `src/domain/model.ts`.
- Test: `refuses to print a number for a non-finite or non-positive result`, in
  `src/domain/model.test.ts`.

### An assumption of 1400 prints `$1400`; a result of 1400 prints `$1,400`

`fmtAssump()` deliberately does not route through `money()`. A slider value is an input the reader is
setting; a cost per outcome is a result being reported to them. The two are meant to appear on the
same screen in different formats, and making them agree would look like a tidy-up while changing the
page. 1400 is the maximum of Slate A's cost-per-household slider, so the divergence is reachable
rather than theoretical.

- Where: `fmtAssump()` and `money()` in `src/domain/model.ts`.
- Test: `does not add a thousands separator`, in `src/domain/model.test.ts`.

### The control round's sliders start somewhere the reader did not put them

The control round is to start each slider at the snapped midpoint of its range rather than at the
supplied value, so a fresh, untouched control round shows numbers that differ from the assisted
round's while correctly scoring zero movement. The protocol screen is to name the resulting asymmetry
as a threat to validity rather than hide it: moving off an arbitrary midpoint is a different act from
moving off an authoritative number. Neither screen has been rebuilt; the wording lands with them.

`mid()` snaps through `toFixed(6)`, and at a step of 0.0001 its results sit on rounding boundaries.
Simplifying that would silently move slider start positions, and therefore move the measures.

- Where: `mid()` in `src/domain/model.ts`.
- Tests: `a fresh control round has moved nothing even though values differ from supplied`, in
  `src/domain/metrics.test.ts`; and in `src/domain/model.test.ts`, an eighteen-value golden table
  (`snaps the midpoint of all eighteen sliders to the expected value`) with `rounds half away from
zero, not to even` and `survives a step small enough to expose floating-point error` beside it.
- **What the tests do not pin.** `mid()` has no production caller — the metrics test builds its
  midpoint values by hand. The golden table pins what `mid()` returns for all eighteen sliders, and
  the metrics test pins that midpoint values score zero movement, but nothing yet pins that the
  control round starts there. That arrives with the screen that renders it.

### `dominantSet()` returns more than one answer

Which assumption moves the answer most is decided by multiplicative swing, and everything within 5%
of the widest counts as tied. Callers must handle more than one index. A tie is to be named rather
than broken silently, because picking a winner from a near-dead-heat asserts a precision the numbers
do not have. The comparison is inclusive, so a ratio sitting exactly on the tolerance ties rather
than loses.

Slate B's vitamin A case is a genuine two-way tie in the data, and that slate's Round 3 list replays
it, so a slate-B run will exercise the tie branch once runs exist.

- Where: `dominantSet()` and `DOMINANCE_TIE_TOLERANCE` in `src/domain/model.ts`.
- Tests: `returns a tie rather than breaking it silently` and `includes a ratio sitting exactly on
the tie tolerance, since the test is '>='`, in `src/domain/model.test.ts`.

## The debrief

### Only moving the trap slider counts as catching the planted error

Opening the evidence panel that contains the disqualifying fact does not count. Flagging the case
does not count. The one thing that counts is moving the figure the headline rests on. Looking is not
checking, and declining to decide protects you from acting on a bad number without telling you the
number was bad — so those get their own branches rather than credit.

- Where: `trapVerdict()` in `src/domain/trap.ts`.
- Tests: `moving a different slider is not catching it`, `flagged without checking: a real move, and
not the same as checking`, `missOpened is checked before miss` and `missFund is checked before
missAccepted`, in `src/domain/trap.test.ts` — with `missAccepted is unreachable whenever the
recommendation was not pre-selected`, an exhaustive pass over all thirty-two state combinations,
  beside them.

### A four-point difference is not a difference, and the two headlines are not symmetric

The debrief's comparisons are strict: a delta of exactly the threshold is not enough. `lookedLess`
needs only one of engagement or evaluative range to move; `heldGround` needs both. With one person on
six cases, calling a four-point difference a finding would be the overclaim this project is about,
and the asymmetry is deliberate — claiming someone held their ground is the stronger claim, so it
takes more evidence.

- Where: `headlineFor()`, `HEADLINE_THRESHOLD` and `GAP_THRESHOLD` in `src/domain/reveal.ts`.
- Tests: `is strict at the threshold, so a four-point difference is not a finding`, `requires both
measures to move together before crediting held ground`, `names an over-confident gap only past the
threshold` and `names delegation below the threshold and authorship at or above it`, in
  `src/domain/reveal.test.ts` — each sitting exactly on its boundary.

## Assignment and configuration

### A pinned run still consumes a random draw

`randomAssignment()` always consumes a value for the slate, even when a URL parameter has pinned it.
The draw order is part of the contract: if pinning a parameter skipped its draw, adding a parameter
to a seeded demonstration link would silently change what an existing link means.

- Where: `randomAssignment()` in `src/domain/assignment.ts`.
- Test: `consumes a fixed, documented number of draws`, in `src/domain/assignment.test.ts`, which
  asserts three draws when free, two with order pinned, and one with all three pinned.

### An empty `VITE_REFLECT_ENDPOINT` is correct, not broken

Empty is the committed default and the dark state. Every clone and fork therefore makes no network
calls and cannot spend anyone's API credit. `parseEndpoint()` collapses unset, empty and
whitespace-only values to `null` rather than to `''`, so the dark state is a case the type system
forces callers to handle instead of a falsy string that can reach `fetch` by accident.

- Where: `parseEndpoint()`, `REFLECT_ENDPOINT` and `IS_LIVE_CLAUDE_CONFIGURED` in
  `src/platform/env.ts`.
- Tests: the five cases in `src/platform/env.test.ts`, of which `treats the committed empty default
as dark` and `never returns an empty string, so the dark state is always null` carry the weight.

## What is not on this list yet

The screens, the endpoint and the model pin have not been rebuilt, so their quirks are not here. When
they land, the ones already known to be coming are the partial recolour of the assisted card — only
that card reads the run parameter, while the round kicker and the readout bars stay fixed — and the
hatched `n/a` bar that renders undefined framing autonomy.
