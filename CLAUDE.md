# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

The Drift Meter — Experiment 01 of the Agential Drift Research Program. A published research
artifact: three hand-written essay pages, one interactive instrument, and one serverless endpoint
that calls Claude. Sole author: Megi Pishtari.

This is a rebuild. Versions v0.1 through v0.5 lived in a separate repository that has since been
deleted; `CHANGELOG.md` carries that record forward and is the only surviving account of it. The
rebuild is v0.6.

The previous build shipped the instrument as a single 894 KB bundler output with no editable source
on disk, and had no tests, no CI, no types, and no linting. It also shipped, and later fixed, an
arithmetic error in a published derived measure: evaluative range divided by six sliders when there
are nine. This repository exists to make that class of error hard rather than easy.

## Files

| Path                                       | What it is                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| `index.html`, `essay.html`, `atrophy.html` | The three prose pages. Hand-authored, no JavaScript.                         |
| `drift-meter.html`                         | The instrument's entry point. Mounts the app; carries no content of its own. |
| `src/content/`                             | Every word of screen copy and every case table, as typed modules.            |
| `src/domain/`                              | The pure functions. No DOM, no framework, fully unit-tested.                 |
| `src/state/`                               | The reducer and the screen/run unions.                                       |
| `src/prompts/`                             | The three system prompts, as typed modules. Licensed CC BY 4.0.              |
| `api/reflect.ts`                           | The endpoint that holds the Anthropic API key. Never reaches the browser.    |
| `src/api/`                                 | The client half. Knows a public URL and a contract; never a key.             |
| `shared/`                                  | Types and constants imported by both the endpoint and the front end.         |
| `tests/`                                   | The browser suite: Playwright and axe over the built site. Not Vitest.       |
| `scripts/`                                 | The three budgets: bundle size, colour contrast, and licensing coverage.     |
| `CHANGELOG.md`                             | Versioned record of what changed and why. Retractions stay in.               |
| `SOURCES.md`                               | Every external claim, its source, and its clearance status.                  |

## Hard rules

**1. There is no generated artifact. Every file here is hand-written source.**
Do not commit build output, and do not introduce a step that produces a file which is then edited by
hand. `dist/` is gitignored and is rebuilt from source on every deploy. The previous build's central
defect was a committed bundle whose source did not exist anywhere; if you find yourself editing
something a tool produced, stop and fix the tool's input instead.

**2. The API key never touches the browser.**
`api/reflect.ts` reads the key from its host's environment, server-side. Do not introduce a code path
that puts a key, or anything derived from one, into an HTML file, a client bundle, or `import.meta.env`.
`VITE_*` variables are compiled into the client and are therefore public by construction — the
endpoint URL belongs there, the key never does.

**3. The model is pinned, and a model change is a re-baseline rather than maintenance.**
The instrument contains a model, so results are comparable only within a pinned version. Two things
carry that guarantee, and both matter:

- `PINNED_MODEL` in `shared/model.ts` holds one exact model ID. Current-generation Claude IDs carry
  no date suffix — `claude-opus-5` _is_ the exact ID, and appending a date produces a 404. So the
  discipline is no longer "use a dated ID"; it is "change this constant deliberately and never
  incidentally."
- The ID the API returns is printed in the UI alongside every response. That printed value is the
  actual provenance record — it is graded `PRIMARY` in `SOURCES.md`, on the grounds that it is the
  only claim on the page that verifies itself. Keep it.

Do not upgrade the model as routine maintenance or as part of an unrelated change. An upgrade is a
re-baseline: it makes rubric pass rates and any future cohort figures incomparable to earlier runs,
and it belongs in `CHANGELOG.md` said in those words.

**4. The endpoint answers from a fixed question list, and the one free-text channel is signed.**
`TEACH_QUESTIONS` is the complete set of questions the endpoint will answer; the client sends
`questionId`, never text. `sanitizeReflect` rebuilds the reflect payload from a known key list,
coercing every value to a bounded number or a fixed label. Both exist so the function is not an open
proxy to the API key — the origin check alone does not stop a forged header.

`repair` mode is the exception and must stay the only one: it takes back an answer the endpoint
itself produced. It is therefore authenticated rather than trusted — `teach` returns an HMAC of the
answer it generated, and `repair` recomputes and compares in constant time before spending a call.
Preserve that shape, along with the rate limits, `MAX_BODY_BYTES`, and `ALLOWED_ORIGINS`.

Never add a released or unowned domain to `ALLOWED_ORIGINS`. A previous version allowlisted a GitHub
username the author no longer held, which anyone could have re-registered and pointed at this
endpoint.

**5. Factual changes carry paperwork.**
This project's argument is about unearned confidence, so its own claims are tracked. If a change
touches an external claim, a figure, or a source, update `SOURCES.md` in the same pass (rows are
`FLAGGED` / `ILLUSTRATIVE` / `SECONDARY` / `PRIMARY AVAILABLE` / `PRIMARY` / `CORRECTED`). If it
changes what the site asserts, or removes something previously published, add a `CHANGELOG.md` entry
with **What changed** and **Why**. Errors get recorded, not deleted.

**6. Do not invent numbers.**
No illustrative-but-unlabelled figures, no cohort data, no placeholder statistics. A prior version
shipped an invented cohort dashboard and it was retracted (v0.2). Anything illustrative must say so
on the page — on the page, not in a comment beside the data, which is where the case figures said it
until #7. Every case is disclosed as constructed on the intro, the consent screen and the debrief,
generally rather than per figure, so that the disclosure does not name the planted error. That copy
is what the `ILLUSTRATIVE` rows in `SOURCES.md` rest on; `src/content/invariants.test.ts` asserts it
is present and that the two pre-run screens do not name the trap case or its slider.

**7. Derived measures require a test.**
Any function that produces a number appearing on screen, or in the reflect payload, has a Vitest case.
Any denominator is derived from the same source as the thing being counted — never written as a
literal. `src/domain/metrics.ts` computes its slider count from the slate rather than hard-coding
nine, and the suite runs the same assertions against synthetic slates of other shapes so a
re-introduced literal fails immediately. This rule exists because of the ÷6-versus-÷9 bug: it was
caught by a reader, not by the code, and it should not have been possible to ship.

**8. The prompts are the artifact, not implementation detail.**
`src/prompts/teach-system.ts` is displayed in full on the page and is the thing the encoded screen
puts under test. Do not re-tune it to suit a new model or to improve its rubric score — that is
editing the experiment to flatter the result. If a prompt genuinely needs to change, that is a
content change under rule 5.

## Conventions

**The three prose pages carry no JavaScript.** They are finished documents. `vite.config.ts` lists
them as entries with no script tag, so the build emits no JS chunk for them, and two checks hold that
from opposite sides. `scripts/check-size.mjs` asserts, per page, that each built prose page carries no
`<script>` and references no `.js` — and that `drift-meter.html` carries exactly one, so a build that
stopped emitting JavaScript altogether cannot pass as a clean sheet. `tests/prose.spec.ts` counts what
a browser actually requests from each page, which is the only way to catch JavaScript arriving through
something that is not a script tag, and loads each page with scripting disabled to check the whole
document is still there. Keep both — they are the reason a reader can have the essays with scripting
off.

**Two palettes, deliberately.** The prose pages are `#F0EEE6` on `#1A1916`; the instrument is
`#ECE8DE` on `#1F1B16`. They read as the same paper and are not the same hex. Tokens are namespaced
`--prose-*` and `--dm-*` in `src/styles/tokens.css`, sharing only the semantic accent roles. Do not
unify them.

**Colours are roles, not hexes, above the token layer.** The assisted, unassisted and Round 3 accents
(`#2E5E4F`, `#3C5A74`, `#7A4E2D`) are selected by a `data-accent` attribute that rebinds one custom
property. Domain code returns a role name; it never returns a colour. Hex literals live only in
`tokens.css`, with one unavoidable exception: `public/favicon.svg` is fetched as its own document and
cannot read the page's custom properties, so it copies two of them and says so.

**Contrast is checked, not commented.** `scripts/check-contrast.mjs` reads the hexes out of
`tokens.css` — it never restates one — and pairs each text role with the surface it sits on. Every text
pair must clear 4.5:1, and every token in `tokens.css` must appear in the table as text, as non-text,
as a surface or as an alias; an unclassified token fails the run. That last part is the point: adding a
colour without saying what it is for is how the table would go quietly out of date. Non-text pairs are
measured and not enforced, because 1.4.11's threshold applies only where a graphic carries information
and that is a judgement — so where this repository has made one, it is a sentence beside the pair.
Ratios used to live in a comment in `tokens.css`; one of them was wrong for three versions. Do not put
them back.

**Licensing is checked on the same terms.** Two kinds of thing, licensed differently, and the reasoning
for which is which lives in `REUSE.toml` — where it went out of date, because six paragraphs of prose
about a set of globs cannot tell you whether the globs still cover the repository. They did not.
`scripts/check-licensing.mjs` asserts that every tracked file matches an annotation and that every
licence named has its text in `LICENSES/`. A new file therefore needs a home in that file, and the
choice is prose or code. What the check does not do is say a file has the _right_ licence: two blocks
overlap deliberately and REUSE's precedence rules settle that, so a wrong home is still caught by
reading rather than by running. The limit is written into the script's header rather than left to be
discovered.

**Fonts are self-hosted.** Newsreader, IBM Plex Sans and IBM Plex Mono ship from `public/fonts/`. This
is not a performance preference: the consent screen tells the reader "no cookie, no analytics, no
fingerprint" and "Leaves the browser: nothing," and a third-party font request would make both false.

**Content lives in typed modules, and its structure is asserted.** `src/content/` holds the prose as
`as const` records so the compiler can check exhaustiveness. Because the modules are the prose rather
than a rendering of it, an edit to the author's words is already a reviewable diff in the module
itself; there is no snapshot test over the wording, and adding one is an open call rather than a
convention this repository currently keeps. What is asserted is structure.
`src/content/invariants.test.ts` checks that trap indices point at cases that exist, that every
supplied value sits inside its own slider range, and that no prose field contains a straight quote —
the writing uses typographic quotes throughout.

**Randomisation is injected, and disclosed.** `Math.random` is banned outside `src/platform/rng.ts`.
Assignment takes an `Rng`, so it is deterministic under test and drivable from URL parameters for
demonstrations. When a parameter forces an assignment, the debrief says so on the page instead of
claiming the run was counterbalanced. An instrument about unearned confidence cannot misreport its
own randomisation.

**Two suites, one repository, no test hooks.** Vitest is the unit suite over `src/**/*.test.ts` and
`shared/**/*.test.ts`; Playwright owns `tests/` and drives the built site. They do not overlap by
accident — `vite.config.ts` excludes `tests/` from the Vitest glob, and a Playwright spec collected by
Vitest would fail on its first `page` fixture.

The browser suite drives the instrument the way a reader does, through `?seed=`, `?order=`, `?slate=`
and `?arm=`. Those four exist because a demonstration link needs them, not because a test does, and
there is deliberately no `window.__TEST__` and no `import.meta.env.MODE` branch anywhere in the
application. Do not add one. The suite is also where copy is pinned: `tests/flow.ts` writes out the
labels it asserts rather than importing them from `src/content/`, because a test that imports the
string it checks has checked that a constant equals itself.

**End-to-end exemptions are one rule on one selector, with the clause.** Two are live. `region` is off
for the one stub screen, because a page whose only content is "this is not finished yet" should not grow
a wrapper to satisfy a checker; it goes with `encoded` in #18, and when nothing is a stub the constant
should be deleted rather than left standing. `color-contrast` is off for `.sep` — the
`· · ·` between sections of the long essay — on the exemption SC 1.4.3 writes for pure decoration, and
a test asserts the exemption still matches five nodes so that it cannot become dead code that makes the
sweep look stricter than it is. Neither is a blanket `disableRules` and neither is silent. Do not add a
third without the same shape.

## Voice

Plain, unhurried, understated. No hype, no flattery, no exclamation points, no marketing register.
The writing states its own limits rather than hiding them ("It is a trace, not a finding"). Match this
in any prose added to the site — including microcopy, error messages, and commit subjects.

## Running and deploying

- **Locally:** `npm install`, then `npm run dev`. `npm run check` is the gate the first CI job runs —
  typecheck, lint, format, the unit suite, the contrast budget, the licensing budget, and the protocol
  page. `npm run build` produces `dist/`.
  The last of those is there for one check rather than for the page. `scripts/build-protocol.mjs`
  asserts that no field the protocol renderer picks up refers to “this screen” deictically, and that
  assertion used to run only inside `npm run build` — so the local gate went green on a violation and
  CI went red on it. A gate that disagrees with CI teaches people to trust the push rather than the
  gate. It regenerates `protocol.html`, which is gitignored and rebuilt by `dev` and `build` anyway.
- **The browser suite is separate, and slower.** `npm run test:e2e` needs a browser
  (`npx playwright install chromium`, roughly 100 MB, once) and builds the site before it runs, because
  the published site sits under `/drift-meter/` and a suite pointed at the dev server would be testing a
  URL layout that does not exist. It is its own CI job so that a typo fails in seconds rather than behind
  a Chromium install, and so that a red X says which of the two kinds of check went red.
- **Publishing:** GitHub Actions builds `dist/` and deploys it to GitHub Pages on every push to
  `main`. `https://vigilia-mz.github.io/drift-meter/` is the canonical URL and the only live copy.
  Two live copies of a research artifact is a citation problem; do not create a second one.
- **Releasing is one edit and a check, in that order.** The versioned DOI is minted by the deposit, so
  it cannot be written before the deposit exists: merge, verify the live site, tag, let Zenodo mint,
  and only then edit `CITATION.cff` — `version`, `date-released`, `doi`, and the `identifiers` entry
  that names the version. Everything else follows from that file. The three prose-page footers, the
  README, the process screen's masthead row and its caveat, and the reader briefs all name the citable
  version too; `src/content/invariants.test.ts` holds every one of them against `CITATION.cff` and
  prints the whole list of stale ones in a single run, so the way to find them is to bump the file and
  run the suite rather than to keep a list here. The concept DOI stays on the README badge and is
  asserted to stay there — it resolves to whatever is newest, which is what the published URL already
  does, and a release that updated every DOI it saw would break it by being thorough. `protocol.html`
  needs no edit: it reads the citation file at build time.
- **Actions must be SHA-pinned.** The repository requires it. Dependabot is configured for the
  `github-actions` ecosystem because pinning without automated bumps rots into old actions with known
  vulnerabilities.
- **`main` is protected.** There is no push to `main`, for anyone, including the owner. All work lands
  through a pull request, merged with a merge commit — squash and rebase are both disallowed, so PR
  titles become the permanent history. Write them as changelog lines.
- **The live-Claude endpoint is off by default.** `VITE_REFLECT_ENDPOINT` is empty in the committed
  `.env`, and the instrument degrades to its "available on request" copy. Every clone and fork is
  therefore dark and cannot spend the author's API credit. Turning it on is a one-line change with its
  own commit; treat that commit as going live.
- **Cost:** the endpoint's in-process rate limiters are best-effort — instances are short-lived and
  parallel. The real guarantees are the Anthropic console spend limit and the per-workspace rate
  limits on the key the endpoint uses. Both live outside this repository.
