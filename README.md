# The Drift Meter

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21887594.svg)](https://doi.org/10.5281/zenodo.21887594)

**Evaluating the evaluator under AI assistance.** Experiment 01 of the Agential Drift Research
Program, by Megi Pishtari.

The Drift Meter asks what AI assistance changes in the person responsible for judging the answer:
their attention, confidence, assumptions, tolerance for ambiguity, and willingness to revise. The
underlying concept is _agential drift_ — the gradual weakening of evaluative independence through
small, reasonable acts of delegation.

**Status: prototype. n = 0.** No data has been collected from anyone. This is an instrument and a
design argument, not a finding, and every screen that could be mistaken for a result says so.

**The rebuild is complete, and it reached every screen.** In place and under test: the three prose
pages, the design system, the case data, the cost model, the derived measures, all thirteen screens,
the pinned model and the endpoint that calls it. The endpoint ships **switched off** — see below — so
nothing here can spend anyone's API credit. The rebuild is recorded as v0.6 in
[`CHANGELOG.md`](CHANGELOG.md); v0.8, dated 14 Aug 2026 and tagged `v0.8.0`, is what has changed
since.

## What is here

| Page               | What it is                                                                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`       | Landing page — what the instrument measures and why.                                                                                                                                                                                                           |
| `essay.html`       | _Evaluating the Evaluator_ — the short companion essay.                                                                                                                                                                                                        |
| `atrophy.html`     | _The Atrophy of Judgment_ — the long essay.                                                                                                                                                                                                                    |
| `drift-meter.html` | The instrument — two slates of charity cost-effectiveness cases, completed with and without a supplied estimate, then a debrief on what changed in the texture of your judgment, the four design rules, and those rules run live against the model and scored. |

Two documents are part of the artifact rather than notes about it: [`CHANGELOG.md`](CHANGELOG.md), recording what
changed in each version and why with retractions kept in; and [`SOURCES.md`](SOURCES.md), recording every external
claim, its source, whether that source is primary or secondary, and the date last checked.

A third is a note to whoever edits next: [`docs/deliberate-quirks.md`](docs/deliberate-quirks.md), listing the
behaviours that look like defects and are not, each against the test that holds it in place.

## Running it locally

Requires Node (see [`.nvmrc`](.nvmrc)).

```bash
npm install
npm run dev
```

Other scripts: `npm test` (unit suite, including the endpoint's refusal paths), `npm run build`
(produces `dist/`), `npm run typecheck`, `npm run lint`, `npm run check:size`,
`npm run check:contrast` (every colour token against the surface it sits on), `npm run check:licensing`
(every tracked file against `REUSE.toml`, and every licence it names against `LICENSES/`).

`npm run test:e2e` is the browser suite: Playwright drives the built site, sweeps every screen a
reader can reach with axe, measures the touch targets, and counts what the three essay pages request.
It needs a browser — `npx playwright install chromium`, roughly 100 MB, once — which is why it is
separate from `npm test` and runs as its own job in CI.

The endpoint in [`api/reflect.ts`](api/reflect.ts) is deployed separately and by hand — CI publishes
`dist/` to GitHub Pages and does not touch it. Its two secrets, the Anthropic key and the key that
signs the repair channel, live in the host's environment and never in this repository; see
[`wrangler.toml`](wrangler.toml), which has deliberately no `[vars]` block.

The live-Claude features are **off by default** — `VITE_REFLECT_ENDPOINT` is empty in the committed
`.env`, so the instrument degrades to its "available on request" state and no clone can spend anyone's
API credit. The screen that would use them still shows the system prompt it would run, in full, so it
can be read and argued with without a call being made.

## History

This is a rebuild. Versions v0.1 through v0.5 lived in a separate repository, now deleted, where the
instrument shipped as a single generated bundle with no editable source on disk and no tests; the
last of them weighed 894 KB. The prose, the case data and the changelog are carried over; none of the
code is. The protocol comes back with the screen that states it. `CHANGELOG.md` is the surviving
record of those versions.

The rebuild's own rationale is in [`CLAUDE.md`](CLAUDE.md), which is the working agreement for anyone
— human or model — editing this repository.

## Citing this

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21887594.svg)](https://doi.org/10.5281/zenodo.21887594)

Archived on Zenodo, with [`CITATION.cff`](CITATION.cff) in the repository for GitHub's own citation
box. **Cite the version you read, not the badge.** The badge above is the concept DOI, which always
resolves to whatever the newest version is — useful for pointing at the project, and no better than
the bare URL for pointing at a claim.

| What you mean                      | DOI                                                                |
| ---------------------------------- | ------------------------------------------------------------------ |
| This version, v0.8.0 (14 Aug 2026) | [10.5281/zenodo.21935816](https://doi.org/10.5281/zenodo.21935816) |
| The project, all versions          | [10.5281/zenodo.21887594](https://doi.org/10.5281/zenodo.21887594) |

The distinction is the reason this artifact wanted a DOI at all. [`CHANGELOG.md`](CHANGELOG.md)
records a retraction — an invented cohort dashboard, published in v0.1 and removed in v0.2 — so “the
Drift Meter” without a version cannot distinguish the build that shipped it from the build that took
it out. A version DOI can.

## Contributing

The most useful contribution here is an argument, not a patch. If you think a claim on the site is
wrong, [say which one and why](../../issues/new/choose) — the changelog shows that the single most
valuable input this project has received was an outside reader pointing out a confound. See
[`CONTRIBUTING.md`](CONTRIBUTING.md).

Anything you would rather not put in a public issue can go to the author's profile,
[github.com/vigilia-mz](https://github.com/vigilia-mz).

## Licence

Two licences, because this repository holds two kinds of thing.

- **Code** — [Apache License 2.0](LICENSE).
- **Prose** — [CC BY 4.0](LICENSES/CC-BY-4.0.txt). Covers the three essay pages, all screen copy, the
  system prompts in `src/prompts/`, `CHANGELOG.md` and `SOURCES.md`. Reuse it freely with attribution;
  the claims stay attached to their author.

Per-path assignments are machine-readable in [`REUSE.toml`](REUSE.toml). Self-hosted fonts are
[SIL Open Font License 1.1](https://openfontlicense.org/), with their licences beside them in
`public/fonts/`.
