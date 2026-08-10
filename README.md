# The Drift Meter

**Evaluating the evaluator under AI assistance.** Experiment 01 of the Agential Drift Research
Program, by Megi Pishtari.

The Drift Meter asks what AI assistance changes in the person responsible for judging the answer:
their attention, confidence, assumptions, tolerance for ambiguity, and willingness to revise. The
underlying concept is _agential drift_ — the gradual weakening of evaluative independence through
small, reasonable acts of delegation.

**Status: prototype. n = 0.** No data has been collected from anyone. This is an instrument and a
design argument, not a finding, and every screen that could be mistaken for a result says so.

**The instrument runs.** A full pass is intro, consent, two rounds of three cases, a confidence
question after each, the debrief, a transfer item, a replay round and the four rules: about three
minutes. The protocol screen states the design, the five measures with their formulas, the six
registered predictions with the condition that would falsify each, and the provenance; the process
screen mirrors the changelog and the source table.

**Still to build:** the Claude endpoint and the encoded screen, shipped dark (issue #18), and the
accessibility and end-to-end sweep (#19). Any screen the rebuild has not reached says so where it
stands rather than rendering an empty frame. The rebuild is recorded from v0.6 in
[`CHANGELOG.md`](CHANGELOG.md).

## What is here

| Page               | What it is                                                                                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`       | Landing page — what the instrument measures and why.                                                                                                                                                                                                                        |
| `essay.html`       | _Evaluating the Evaluator_ — the short companion essay.                                                                                                                                                                                                                     |
| `atrophy.html`     | _The Atrophy of Judgment_ — the long essay.                                                                                                                                                                                                                                 |
| `drift-meter.html` | The instrument — two slates of charity cost-effectiveness cases, completed with and without a supplied estimate, then a debrief on what changed in the texture of your judgment. The protocol and process screens are reachable from the first screen and from the debrief. |

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

Other scripts: `npm test` (unit suite), `npm run build` (produces `dist/`), `npm run typecheck`,
`npm run lint`, `npm run check:size`.

The live-Claude features are **off by default** — `VITE_REFLECT_ENDPOINT` is empty in the committed
`.env`, so the instrument degrades to its "available on request" state and no clone can spend anyone's
API credit.

## History

This is a rebuild. Versions v0.1 through v0.5 lived in a separate repository, now deleted, where the
instrument shipped as a single generated bundle with no editable source on disk and no tests; the
last of them weighed 894 KB. The prose, the case data and the changelog are carried over; none of the
code is. The protocol comes back with the screen that states it. `CHANGELOG.md` is the surviving
record of those versions.

The rebuild's own rationale is in [`CLAUDE.md`](CLAUDE.md), which is the working agreement for anyone
— human or model — editing this repository.

## Contributing

The most useful contribution here is an argument, not a patch. If you think a claim on the site is
wrong, [say which one and why](../../issues/new/choose) — the changelog shows that the single most
valuable input this project has received was an outside reader pointing out a confound. See
[`CONTRIBUTING.md`](CONTRIBUTING.md).

## Licence

Two licences, because this repository holds two kinds of thing.

- **Code** — [Apache License 2.0](LICENSE).
- **Prose** — [CC BY 4.0](LICENSES/CC-BY-4.0.txt). Covers the three essay pages, all screen copy, the
  system prompts in `src/prompts/`, `CHANGELOG.md` and `SOURCES.md`. Reuse it freely with attribution;
  the claims stay attached to their author.

Per-path assignments are machine-readable in [`REUSE.toml`](REUSE.toml). Self-hosted fonts are
[SIL Open Font License 1.1](https://openfontlicense.org/), with their licences beside them in
`public/fonts/`.
