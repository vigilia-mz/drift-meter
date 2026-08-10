# Contributing

This is a single-author research artifact. The masthead says "sole author, sole responsibility for
every claim on this page," and that is meant literally — which changes what a useful contribution
looks like here.

## The most valuable thing you can do is disagree precisely

The changelog records that v0.2 could not distinguish "AI degrades judgment" from "handed answers
degrade judgment," and that three things varied at once between the two rounds. Both were fatal to the
claim. Neither was hard to fix. Both were caught by an outside reader rather than by the process.

That correction was worth more than any patch this project has received. So the front door is
[**an issue**](../../issues/new/choose), and the form asks for four things:

- **Which claim or screen.** Point at the specific sentence, figure, or measure.
- **What you think is wrong.** The reasoning, not just the verdict.
- **What would change your mind, or mine.** This is the part that makes a disagreement resolvable.
- **A source, if you have one.** Primary if possible. If you have none, say so — a flagged
  uncertainty is still useful.

Corrections are logged in `CHANGELOG.md` whether or not they are flattering. That is the standard the
project holds itself to, and it applies to corrections that come from outside.

## What I am most looking for

The reviewers table on the publication-process screen names three readers as not yet recruited, and
says the missing one is the real gap:

- **A methods reader** — attack the design. Order effects, the anchoring confound, construct
  definitions, whether the design can actually test the six registered predictions. The project's
  network is philosophy-heavy, which is the right network for the conceptual argument and the wrong
  one for experimental design.
- **An editor** — attack the prose for overclaiming. Given the subject, this is where the risk
  concentrates: an essay arguing that fluent answers get accepted too easily is itself a fluent answer.
- **A naive reader** — not whether you liked it. Where you stopped understanding it, and at which
  sentence.

If you are willing to be any of those, that is the highest-value thing on this list. The route in is
the **Offer to read it** issue form, which asks which of the three and not much else. Each ask is
written out in full in [`docs/review-briefs.md`](docs/review-briefs.md), including what is already
known to be wrong — a reader who spends their pass finding something already published on the site is
a reader who has been wasted.

## Code changes

Pull requests are welcome for the things where correctness is objective: a broken test, a failing
build, an accessibility defect, a typo, a dependency bump, a genuine bug in a derived measure.

**I may decline changes to the instrument itself**, even good ones. The instrument is a measuring
device with registered predictions and stated falsification conditions; changing how it behaves
changes what it measures, which is a research decision rather than an engineering one. If you think
its behaviour is wrong, an issue arguing that is more likely to land than a PR implementing it.

Two behaviours look like bugs and are not. Both are enforced by tests whose names quote the reason:

- A supplied recommendation left standing scores nothing, in any measure. Leaving a default in place
  is not an observation of what the person decided.
- Framing autonomy is `null`, never `0`, in the round where no estimate was supplied. It is undefined
  there, and it is reported as undefined rather than imputed. An earlier version imputed it from an
  invented constant; that was removed in v0.3.

### Before you open a PR

Read [`CLAUDE.md`](CLAUDE.md) first. It is the working agreement for this repository and the rules in
it are load-bearing, not stylistic. In particular: derived measures require a test, factual changes
carry paperwork, the model pin is not routine maintenance, and the prompts are the artifact rather
than implementation detail.

Then:

```bash
npm ci
npm run typecheck && npm run lint && npm test && npm run build
```

`main` is protected — everything lands through a pull request, merged with a merge commit. Squash and
rebase are disallowed, so **PR titles become the permanent history**. Write them as changelog lines:
imperative, specific, no ticket numbers.

The pull request template is a checklist of the paperwork rules. It is short, and it is not
decorative.

## Voice

If you are adding prose of any kind — including a button label, an error message, or a commit subject
— match the register: plain, unhurried, understated. No hype, no exclamation points, no marketing
language. The writing states its own limits rather than hiding them.

## Reporting a security issue

Do not open a public issue. See [`SECURITY.md`](SECURITY.md).
