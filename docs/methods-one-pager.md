# Four decisions on a design with no data yet

I have built an instrument and registered six predictions with the condition that would falsify each
one. Nothing has been collected from anyone: `n` is zero, and I would rather have this conversation
now than after collection, when the answer is worth much less.

**The ask.** Four decisions, below. Each is a choice I cannot make and have written the options for,
so that answering is a sentence rather than a review. If you only have time for one, make it the
first — it decides whether anything I collect this year is worth keeping.

**The protocol, as a page you can read without running anything:**
https://vigilia-mz.github.io/drift-meter/protocol.html — seven measures with their formulas and the
objection to each at `#measures`, the six predictions with their falsifiers at `#predictions`, and
nine things this build cannot do at `#limits`. The version I am asking about is v0.8.0, archived at
https://doi.org/10.5281/zenodo.21935816, so that your answer stays attached to what you read.

**The design, in short.** Within-subject. One reader meets three charity cost-effectiveness cases
with an estimate already worked out for them, and three with nothing filled in. Order is
counterbalanced; which slate carries the estimate is drawn independently of the order. The supplied
estimate is attributed, at random, to Claude, to a senior programme officer, or to an unnamed prior
reviewer — figure, reasoning and recommendation identical in all three, so only the authority
changes. One case per slate carries a planted error. A transfer case afterwards asks about the same
pattern in a case the reader has not seen. About three minutes.

---

## 1. The anchoring confound: measurable, or fatal?

The control round's sliders open at an arbitrary midpoint. The assisted round's open at the supplied
figure. So moving a slider is a smaller act in one round than in the other, and **the bias runs in
the same direction as the prediction** — less revision under assistance is what the starting
positions alone would produce, with no drift involved.

I do not know whether this is repairable by measurement or only by redesign.

- **(a)** Repairable — model the starting position as a covariate, or report revision as distance
  travelled from a common reference rather than from the anchor.
- **(b)** Redesign — both rounds must open from the same place, and everything collected before that
  is unusable.
- **(c)** Something else.

**This is the blocking one.** If (b), I should not collect anything until it is fixed.

## 2. The primary outcome names a comparison this build cannot compute

I declared a primary outcome before any data existed, which I still think was right. But as stated it
describes a between-arm comparison, and every between-subject comparison this design supports needs a
cohort — one run produces one reader, one arm, one slate, one order.

- **(a)** Restate it as a within-reader contrast the instrument does produce, and say in the record
  that it was changed and why.
- **(b)** Keep it and mark it explicitly as awaiting a cohort, with a within-reader outcome named as
  the one a single run can speak to.

## 3. There is no analysis plan behind the six predictions

Six predictions with falsification conditions, and then: no test named per prediction, no target `n`,
no stopping rule, no correction for testing six at once. I am aware that this makes the registration
weaker than it looks.

- **(a)** Name one confirmatory prediction, treat the other five as exploratory and say so.
- **(b)** Keep all six confirmatory with a correction — which one, at what target `n`?
- **(c)** The registration is not salvageable in its current form and should be restated.

## 4. Which of the hand-chosen constants actually matter?

Several quantities were chosen by eye and never calibrated: the saturation point at which slider
movement counts as full framing autonomy, two weights inside the autonomy measure, three debrief
thresholds, and the equal weights averaging three process measures into a confidence composite.

I am not asking you to supply values. I am asking **which of these the conclusions are actually
sensitive to**, so I calibrate three things rather than nine.

---

## What I already think is wrong, so you do not spend the pass finding it

Beyond the four above: readers arrive from an essay that states the expected result, which puts a
demand characteristic directly upstream of the measurement. Within one reader the condition and the
cases move together. Nothing verifies the attribution manipulation was noticed. The planted-error
catch rate is one observation per reader. The full list of nine is at `#limits` on the protocol page,
written before anyone asked.

## What I am not asking for

A fix, an endorsement, a second author, or a review of the prose or the code. Four answers, in
whatever form is cheapest for you — a reply to this, or an issue on the repository at
github.com/vigilia-mz/drift-meter.

Whatever comes back is recorded in the changelog whether or not it is flattering, under your name if
you want it there and without one if you would rather. If you tell me a prediction cannot be tested,
it comes off the page and the record says who said so.
