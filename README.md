# The Drift Meter

**Evaluating the evaluator under AI assistance.** Experiment 01 of the Agential Drift Research
Program, by Megi Pishtari.

The Drift Meter asks what AI assistance changes in the person responsible for judging the answer:
their attention, confidence, assumptions, tolerance for ambiguity, and willingness to revise. The
underlying concept is *agential drift* — the gradual weakening of evaluative independence through
small, reasonable acts of delegation.

**Status: prototype. n = 0.** No data has been collected from anyone. This is an instrument and a
design argument, not a finding, and every screen that could be mistaken for a result says so.

**This repository is mid-rebuild.** The working agreement is in place; the site itself is being ported
version by version. Until that lands, the published copy is not yet served from here.

## What will be here

| Page | What it is |
|---|---|
| `index.html` | Landing page — what the instrument measures and why. |
| `essay.html` | *Evaluating the Evaluator* — the short companion essay. |
| `atrophy.html` | *The Atrophy of Judgment* — the long essay. |
| `drift-meter.html` | The instrument. Two slates of charity cost-effectiveness cases, completed with and without a supplied estimate, then a debrief on what changed in the texture of your judgment. |

Two documents will be part of the artifact rather than notes about it: `CHANGELOG.md`, recording what
changed in each version and why with retractions kept in; and `SOURCES.md`, recording every external
claim, its source, whether that source is primary or secondary, and the date last checked.

## Running it locally

Once the toolchain lands:

```bash
npm install
npm run dev
```

Other scripts will be `npm test` (unit suite), `npm run build` (produces `dist/`), `npm run typecheck`,
and `npm run lint`.

The live-Claude features are **off by default** — `VITE_REFLECT_ENDPOINT` is empty in the committed
`.env`, so the instrument degrades to its "available on request" state and no clone can spend anyone's
API credit.

## History

This is a rebuild. Versions v0.1 through v0.5 lived in a separate repository, now deleted, where the
instrument shipped as a single 894 KB generated bundle with no editable source on disk and no tests.
The prose, the case data, the protocol and the changelog are being carried over; none of the code is.
`CHANGELOG.md` will be the surviving record of those versions.

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
- **Prose** — CC BY 4.0, landing with the essays. This will cover the three essay pages, all screen
  copy, the system prompts in `src/prompts/`, `CHANGELOG.md` and `SOURCES.md`. Reuse it freely with
  attribution; the claims stay attached to their author.

Per-path assignments will be machine-readable in `REUSE.toml`. Self-hosted fonts are
[SIL Open Font License 1.1](https://openfontlicense.org/).
