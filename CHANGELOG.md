# The Drift Meter — changelog

Experiment 01 of the Agential Drift Research Program.
Author: Megi Pishtari (github.com/vigilia-mz). Sole author, sole responsibility for every claim.

Every release records what changed and why. Retractions are recorded, not deleted.

Versions v0.1 through v0.5 were published from a separate repository, which has since been deleted.
This file is the surviving record of them.

## v0.6 — in progress — Rebuilt from source, and a model re-baseline

**What changed**

- The instrument is being rebuilt from source, in this repository, and it runs again. v0.1 through
  v0.5 shipped it as a single generated file with no editable source on disk, no tests, no types, no
  linting and no continuous integration; the last of them weighed 894 KB. Rebuilt and under test so
  far: the case data, the cost model, the derived measures, and twelve of the instrument's thirteen
  screens — the intro, the consent step, both rounds with their confidence gates, the debrief, the
  transfer check, Round 3, the four design rules, and the protocol and publication-process screens.
  The remaining one renders a page saying it is not finished rather than an empty frame. Not
  rebuilt: the endpoint, and the live-Claude screen that needs it. The remaining steps are tracked
  in the open rather than described as finished.
- One reducer holds the whole flow, and it is pure: no DOM, no clock, no entropy. The assignment is
  drawn outside it and handed in, which is what lets the thirteen-screen flow be exercised in tests
  with no browser. The previous build kept the two rounds in loose arrays and read them through
  non-null assertions; a completed run is now a type in which both rounds are present.
- The run parameters are back — `?seed=`, `?order=`, `?slate=` and `?arm=` — and a pinned run is
  recorded as pinned, so the debrief can decline to call it counterbalanced. A parameter that fails
  to parse produces an ordinary randomised run and does not claim otherwise. Where a URL parameter
  fixed the order, the slate or the arm, the debrief's assignment rows read “Fixed by URL parameter
  on this run, not randomised” in place of the counterbalancing sentence.
- Screen changes move focus to the new screen's heading, retitle the document and announce politely.
  There is no router, so without this a keyboard reader gets no signal that the page changed at all.
  The two rounds announce their number, because they are otherwise the same screen twice.
- Framing autonomy is drawn as a hatched bar reading `n/a` in the round where no estimate was
  supplied — never as a zero. A zero-width bar would be a claim about the reader; there is no
  measure there to make one from. The v0.2 retraction is the reason this is a rendering rule and
  not a detail.
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
- **The model for the rebuilt instrument will be pinned to `claude-opus-5`, and that is a
  re-baseline rather than maintenance.** `shared/model.ts` now holds that one exact ID, and the
  protocol screen prints it; the endpoint that will call it does not exist yet, so nothing has been
  served by the new pin and the screen says so. The consequence does not wait for the endpoint:
  rubric pass rates on the encoded screen are not comparable to the v0.4 and v0.5 runs, and neither
  is any figure derived from them. The series restarts here.
- `drift-meter.html` served a page saying the instrument is being rebuilt, in place of the 404 that
  four links on the site were reaching. It carried `noindex`, since it was temporary. Within this
  same version the rebuilt instrument has taken the URL back, which is what the placeholder was
  holding it for.
- The footer contact on all four pages is the GitHub profile rather than an email address. The
  address it replaced lived in the deleted repository, and nothing here records it.
- Muted text moved to `#6B6358` in both palettes. It replaces `#A39A8B` (2.27:1) on the instrument
  and `#A39A88` (2.40:1) on the essays, both of which are retained as decoration tokens. On the
  essays' `#F0EEE6` it measures 5.09:1 and is a visible change to caption colour on text down to
  10.5px; on the instrument's `#ECE8DE` it measures 4.83:1, and the rebuilt screens render it, since
  the instrument's stylesheet consumes `--dm-muted` throughout. A two-token revert. It is not an
  accessibility pass either: `--prose-muted-soft` is still 3.19:1 on real text at 11–12.5px,
  `--dm-muted-soft` is 3.14:1 and still has no consumer, and both are left for the sweep that will
  lock every one of these with a contrast check instead of a comment.
- The case data carries typographic single quotes throughout — two possessive apostrophes and one
  quoted phrase. Typography, not wording. A straight apostrophe in the landing page's footer was
  brought into line in the same pass.
- `docs/deliberate-quirks.md` collects the behaviours that look like defects and are not, each named
  against the test that holds it in place, so that a later reader does not tidy one away.
- `SOURCES.md` re-verified row by row against the rebuild. Rows that locate a claim on a screen this
  build has not reproduced yet say so, instead of implying the claim is live — and where the rebuilt
  screens have since reached the claim, the row records that instead. Four external claims published
  on the essay pages had no row locating them there — three untracked entirely, and the Project Deal
  figures tracked only by a row that placed them in a separate document. They have rows now. The
  pass also states what it did not cover, rather than implying it was exhaustive.
- **Figures flagged as not cleared for publication are now published.** The bednet case's supplied
  `$2.00` and the chlorination case's `80%` coverage reach a page for the first time in this rebuild,
  along with the evidence text that undoes each. The debrief's trap paragraphs add the consequence of
  each planted error — that correcting it “roughly doubles the cost per death averted” — which is a
  magnitude neither evidence panel states, and Round 3 adds the thresholds that would change the
  assistant's view on the same two cases. The cash transfers case, which had no row in `SOURCES.md`
  at all, publishes a multiplier; it has one now. Pinning these, or restating them on the page as
  hypothetical, is overdue rather than pending. The deworming case's lifetime income gain factor of
  3.0 and the vitamin A case's 0.0015 deaths averted per child-year render alongside them, as the
  assisted round's opening position rather than as quoted results; their two rows say so.
- **The case figures are restated on the page as illustrative, which closes #7.** The instrument now
  says, on the intro and on the consent screen before any work starts and once more in the debrief
  after it, that every case is written for the exercise, that the programmes are generic rather than
  real organisations, and that every figure attached to them is illustrative rather than traced to a
  named study. Four rows in `SOURCES.md` move from FLAGGED to a new ILLUSTRATIVE grade: the bednet
  and chlorination trap figures #7 named, the cash transfers multiplier, and the transfer check's
  `$1.90` per dose, which was published by a seventh case that no row tracked at all. The three
  FLAGGED rows on the essay pages are untouched: those are claims about the world stated as findings,
  and a disclosure cannot clear them.
- The disclosure names no case and no slider. It says every figure is illustrative and stops there,
  because what the instrument observes is whether a reader interrogates the load-bearing number
  without being told which one it is. `invariants.test.ts` asserts both halves — that the three
  screens carry the disclosure, and that neither pre-run screen contains the trap case's name or its
  slider's label.
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
  constant against the page's prose. Neither existed when it said so. Both arrived later in this
  same version, with the protocol screen, and the comment now describes what the test actually
  asserts.
- Corrected: `CLAUDE.md` said an end-to-end test asserts the three prose pages issue zero `.js`
  requests, and the same claim sat in a `vite.config.ts` comment. There is no end-to-end test and no
  Playwright in the toolchain; the assertion is scheduled in #19, where the browser dependency was
  deliberately deferred until there are screens to drive. Both now say what holds the property
  today: the pages carry no script tag, so the build emits no chunk for them, and review is the only
  thing enforcing it. The convention also no longer leaves `scripts/check-size.mjs` to imply a
  per-page check — it reports a JavaScript total for the whole build, which would stay quiet if one
  essay gained a script tag and the total still fit the budget.
- Corrected: `CLAUDE.md` said the wording in `src/content/` is snapshot-tested. There are no
  snapshot files. The claim is withdrawn rather than rescheduled: the content modules are the prose
  rather than a rendering of it, so an edit to the author's words is already a reviewable diff in
  the module itself, and whether a snapshot test earns its keep on top of that is left open. The
  invariants test named in the same sentence is real, and the convention now describes what it
  actually asserts.
- The protocol and the publication-process screens are back. That took the count to twelve of the
  thirteen, with only the live-Claude screen outstanding; it arrived with the endpoint later in this
  same version, and the bullet above records it. The protocol
  screen states the design, the four arms, the five measures with their formulas and their threats,
  the six registered predictions, the stimulus and model provenance, and what this build cannot do.
  The process screen carries the masthead, the changelog, the readers, the caveats, the production
  provenance and the source table.
- **The five formulas are published, and a test holds each of them to the code.** Every constant
  printed on the protocol screen — the slider count, the cases, the points per case, the two
  autonomy weights, the confidence scale, and the 0.25 saturation point — is asserted against the
  constant `src/domain/` actually uses, which is also what closes the `metrics.ts` correction above.
  The ÷6-versus-÷9 bug is why: correcting the code and leaving the page describing the old
  arithmetic is the same error wearing better clothes. The prose assertions anchor whole phrases
  rather than bare digits, so tuning a constant to a value whose string is a prefix of the old one
  cannot slip through.
- **The Clio reference is withdrawn rather than carried forward.** `SOURCES.md` locates it on the
  consent screen and in protocol section 1. The consent screen dropped it earlier in this version;
  protocol section 1 was written now and does not add it back, because a citation from memory is
  worst placed on the screen where a reader is deciding whether to trust the page about data
  handling. That discharges the obligation by dropping the claim, which is the weaker of the two
  exits and is recorded as such. The row stays in the table, and a test asserts the word appears on
  neither screen.
- **The pinned model ID reaches a page.** `shared/model.ts` now exists and holds one exact ID, which
  closes the gap the re-baseline bullet above described. The protocol screen prints it beside the
  statement that the pin is not the provenance record — the ID the API returns is. Nothing returns
  one yet, and the screen says that rather than implying a verification that has not happened. A
  test asserts the ID appears nowhere in the screen's prose, so a later re-baseline cannot leave a
  second, stale copy of it in a sentence.
- **Browser Back works, for the protocol and process screens only.** Entering either pushes a
  history entry; every other screen change replaces the current one. A reader who took the intro's
  side door into the protocol screen used to press Back and leave the site. The linear run stays
  state-only, so Back part-way through a round still leaves rather than un-answering the previous
  question, and the URL — including the run parameters — is untouched by either. A history entry
  names a screen and not a run, so a Back press arriving after a reload, when the run it described
  is gone, goes to the start rather than to a screen with nothing behind it.
- **The Clio reference is pinned as well, and the claim it was pinned for is narrower than the row
  said. That closes #8.** The bullet above withdrew the claim, which was the weaker of the two exits
  the issue offered; this is the other one, and it is the first link `SOURCES.md` has held in this
  repository. The other ten rows still read `Primary link: TODO`. The row called Clio the reference
  standard for privacy-preserving measurement over real usage. Anthropic's paper says the core
  technologies underlying Clio are not fundamentally new, says it builds on differential privacy,
  k-anonymity and federated learning, and says formal guarantees of that kind are difficult to apply
  to it; neither the paper nor the research page calls Clio a standard. So the superlative is
  withdrawn, the row claims what the pinned pages support, and it moves from PRIMARY AVAILABLE to
  PRIMARY. The mirrored table on the process screen moves with it, which is the one page change here:
  the published row now carries the narrowed wording, the new grade and the date the source was read.
  Two consequences in the paperwork. The source table's header now defines PRIMARY, which it had left
  to a single self-explaining row, and says of PRIMARY AVAILABLE that an unpinned source is also an
  unread one. And `CLAUDE.md` said the printed model ID is the one row graded `PRIMARY`; it now says
  the row is graded `PRIMARY` on the same grounds, without the count.
- **The endpoint and the live-Claude screen are built, and shipped dark. That closes #18, and all
  thirteen screens now render.** `api/reflect.ts` holds the Anthropic key server-side and is a
  portable `(Request, ReflectEnv) => Promise<Response>` with a Cloudflare Worker adapter as its only
  host-specific line. The encoded screen asks the pinned model the same question twice — once with no
  rules at all, once under the four rules — scores the second against a four-item rubric, and offers
  to feed the failures back and re-score the rewrite. `VITE_REFLECT_ENDPOINT` stays empty in the
  committed `.env`, so a dark build renders the system prompt and the reason it is dark rather than a
  disabled button. Turning it on is a one-line change with its own commit, and #13 holds the console
  actions that come first.
- **A teach run is three calls, and the first one is the argument.** v0.4 recorded it in those words:
  the rules run against the same model with no rules at all, then under them, then a grading pass.
  The rebuild had been designed with two until the changelog was read properly. The unruled answer is
  the control, and without it the rule-governed answer has nothing to be better than.
- **The three system prompts are newly written, and the pass rates they earn are a first baseline.**
  No copy of the deleted build's prompt survives — not in this repository and not anywhere else — and
  this file records only its shape. So `teach-system.ts` encodes the four rules from the previous
  screen, whose bodies were already written as instructions a model can follow and a rubric item can
  check, and adds nothing they do not contain. Rule 8 applies from here: it is not to be re-tuned to
  suit a model or to improve a score. The consequence is stated rather than implied — the v0.4 and
  v0.5 rubric pass rates describe a prompt that no longer exists, on a model that no longer exists, so
  the series restarts twice over.
- **The repair channel is authenticated, which makes the invariant `CLAUDE.md` claimed true as
  written.** The old text said the endpoint took a question index and never free text. That was true
  of two modes and false of the third, which took two thousand characters straight into a prompt.
  `teach` now returns an HMAC over the result it produced and `repair` recomputes and compares before
  spending a call. The signature covers the whole result rather than the answer alone: signing only
  the answer would leave the rubric forgeable, and the rubric is what the repair prompt is told to
  fix, so a caller could mark every item failed and get an arbitrary rewrite of a text the endpoint
  had blessed. The comparison uses `crypto.subtle.verify` rather than a string compare, because a
  string compare returns on the first differing byte and turns forging a signature into sixty-four
  cheap questions instead of one impossible one.
- `sanitizeReflect` rebuilds the reflect payload from a named key list rather than validating what
  arrived, so a field nobody declared cannot travel however it is spelled, and a number outside its
  range is clamped rather than forwarded. `ALLOWED_ORIGINS` is exactly the published site: the
  previous version allowlisted a GitHub username the author no longer held, which anyone could have
  re-registered and pointed at an endpoint spending real money.
- **There is no fallback model, deliberately.** The API offers a parameter that re-runs a declined
  request on a different model and returns its answer. It is the right default for most applications
  and the wrong one here: the served ID is printed on the page as the provenance record, and a silent
  substitution would make results incomparable while still looking like one series. A refusal is
  reported to the reader as a refusal, and the screen says why there is no fallback.
- `max_tokens` went up from the original 320, 420 and 400. Those were sized for a model where the cap
  applied to visible text; on the pinned model thinking is on by default and the cap covers thinking
  plus the response, so the old numbers would have spent the budget reasoning and truncated the answer
  mid-sentence. Thinking is not disabled, which would be the obvious way to save the tokens: on this
  model disabling it can put a tool call into visible text or leak a `<thinking>` tag into prose the
  screen prints verbatim.
- The grader uses structured outputs. The original asked for JSON in prose and then regex-scraped the
  reply, which is what required a parse-failure branch at all; constraining the shape at the API level
  removes the regex and the branch together, and closes #9 by deleting the field rather than rendering
  it.
- The rate limits are in-process and best-effort, and the endpoint says so where the limiter is
  defined rather than implying a budget by having one. Instances are short-lived and parallel, so a
  counter in module memory bounds one instance for as long as it happens to live. The real guarantees
  are the console spend limit and the per-workspace rate limits on the key, both outside this
  repository; durable per-visitor and per-day budgets are #11 and are not claimed here.
- The prompts are typed modules rather than Markdown, which is how this repository already stores
  prose. The endpoint has to import them and does not run through Vite, so `?raw` — a bundler feature
  — would have worked in the browser and broken on a Worker. `CLAUDE.md` said Markdown and now says
  what is there.
- Corrected: the `SOURCES.md` row on the printed model ID said no `api/reflect.ts`, no client and no
  screen that prints a served ID existed. All three now do. The row says what is actually missing — a
  served ID, because the endpoint is dark — and that the distance to a verified row is a one-line
  change rather than more code. The mirrored row on the process screen moves with it.
- Corrected: the Clio row in `SOURCES.md` said the word appeared nowhere in the repository except in
  its own heading. The header of the same file used it too, in the sentence recording that the
  rebuilt consent screen declines to make the claim — added by the merge that rewrote the row's
  sentence, so the sentence was false as soon as it was written, and it survived the rewrite the
  bullet above gave that row. The mirrored table and the test that holds it there put the word in the
  repository again. The row makes no claim about where the word appears now: counting occurrences was
  never what it was for, and the count is what kept going stale.
- **Corrected: three counts of how many screens render, one of them on a published page.** The
  publication-process screen's own v0.6 row said twelve of the thirteen render; `SOURCES.md` said ten,
  in the present tense, in its account of the location pass; and the changelog bullet that took the
  count to twelve read as though the twelfth were still the last. All three are now accurate, and the
  changelog's is fixed by clarifying its tense rather than by editing what it recorded at the time.
  This is the fourth time in this version that a count in prose has gone stale behind the code, which
  is an argument for deriving them rather than writing them: `invariants.test.ts` already holds the
  source table against its mirror, and nothing yet holds a screen count against `BUILT`.
- **#39 is closed as substantially discharged rather than as asked.** It asked for a v0.7 entry
  covering the attribution fix, the protocol screen, the README correction, the two `index.html`
  corrections, the primary measure and the reference-screen history. There is no v0.7: v0.6 is still
  open, and every one of those items except the attribution fix was already recorded under it. So the
  entry it asked for would have split one version's record across two headings for no reader's
  benefit. What was genuinely owed was the attribution fix — which turned out not to be paperwork at
  all but an unreproduced change, and is the bullet above — and the `docs/deliberate-quirks.md` entry
  naming the test that holds it. Both are here. The `SOURCES.md` pass it asked for found one row
  claiming a screen did not render, and #18 had already corrected it.
- **The attribution now stands on every assisted case instead of hiding inside the estimate panel,
  which removes a confound that made one click both the treatment and the outcome.** The arm is the
  manipulation: the number, the prose and the recommendation are identical in all three arms and only
  the authority attached to them changes. That authority sat inside the disclosure, so a reader who
  never opened it was never told where the estimate came from — the treatment reached only readers who
  opened a panel, and `engagement` is the share of cases where a panel was opened. The manipulation
  could therefore only reach a reader who had already scored on the measure it was supposed to move,
  and the debrief told every reader which arm they had been in regardless of whether they had seen it.
  Each assisted case now says `This estimate was supplied by …` above the disclosure, worded
  identically across the three arms with only the source substituted; the estimate's reasoning stays
  behind the panel, which is what opening it should mean. A test asserts both halves at once — the
  attribution is present on all three cases with nothing opened, and the round still records nothing
  opened — so neither the confound nor a fix that inflates engagement can return silently.
  `docs/deliberate-quirks.md` carries it as a quirk that looks like layout and is measurement.
- **The first screen says what one sitting cannot show, which closes #38.** The programme is named
  for a longitudinal claim — a capacity weakening across repeated delegation — and a run is one
  sitting. The sixty-second version on the intro did not say so, and it is what a reader who goes no
  further leaves with. It now names the relationship and states the deflation with it: what a
  sitting records is short-run behaviour under two conditions, which is at most the trace such a
  weakening would leave and is equally consistent with there being no weakening at all. Section 6 of
  the protocol screen gains the same limit stated plainly, in place of implying it through the note
  about stakes and deadlines, which was a claim about how large an effect would be rather than about
  what kind of thing a sitting can observe. `invariants.test.ts` asserts the two screens do not come
  apart on it.
- **There is a browser suite, and the three claims it was written to stand behind are no longer
  unbacked.** Playwright and axe are in the toolchain, driving the built site under `/drift-meter/`
  rather than the dev server, in a CI job of their own. Thirty-three tests. The prose pages issue
  no JavaScript and reach no other origin, and each renders in full with scripting disabled — the
  claim `CLAUDE.md` and `vite.config.ts` both made before it existed, corrected earlier in this
  version to say review was the only thing holding it. A whole run reaches no network at all: no
  request off the origin, nothing with a body, no cookie, nothing in local or session storage, and
  nothing left after a reload, which is the consent screen's four promises taken one at a time. And
  the shipped bundle contains no endpoint URL, no key-shaped string and no `api.anthropic.com`, which
  is the cheapest possible check of the second hard rule.
- The eight assertions #19 asked for are in `tests/instrument.spec.ts`, each one a wiring failure a
  unit test cannot see: the `$3,922` bednet headline on a pinned Slate A run, and the `$2.00`, `85%`
  and `0.0006` it is computed from; a supplied recommendation rendering `aria-checked` while “Calls
  you made” stays 0/3; a case still counted as opened after both its panels are closed; a slider
  moved and returned still counted as moved; the confidence gate opened by keyboard alone, arrow keys
  and one Tab out of the group; both trap branches from two seeded runs, on the two slates that carry
  the trap in different places; and framing autonomy hatched and reading `n/a` with no zero anywhere
  on the row.
- **The accessibility sweep found four controls too small to hit and fixed all four.** At 390×844 the
  disclosure rendered 18px tall and the sliders 16px, both under the 24px WCAG 2.2 requires at AA
  (SC 2.5.8); the uncertainty flag came in at 35 and the decision options at 41, over 24 and under
  the 44 asked for at AAA (SC 2.5.5). All four now answer across 44×44. The flag and the options grew
  by a `min-height` and are visibly a few pixels taller. The disclosure and the back link did not
  change size at all — a transparent pseudo-element carries their hit area, because padding would
  have dropped the rule under the label with it — and the sliders keep their 4px track inside a 44px
  box that a negative margin gives back to the layout, so the design is unmoved and measurably so.
  `tests/targets.spec.ts` probes the hit area with `elementFromPoint` rather than reading a bounding
  box, which is the only way to see a pseudo-element: the disclosure still reports 18px tall and is
  44px live. The same test caught the first attempt at the slider, where the box was 44px and its
  lower 4px answered to the note underneath it.
- **The contrast ratios have moved out of a comment and into a check.** `scripts/check-contrast.mjs`
  reads the hexes out of `tokens.css` and pairs every text role with the surface it sits on; the
  ratios are not written down anywhere any more, because the one that was is the reason this exists.
  It also fails on any token in `tokens.css` that appears in no pairing, so a new colour has to say
  whether it is text, non-text, a surface or an alias before it can ship. Forty-three text pairings
  enforced, one exempt, nineteen non-text measured and reasoned about rather than enforced.
- **The #4 contrast fix is confirmed rather than reverted, and the sweep finishes it.** The failing
  values were failing: `#6B6358` in the muted-text role stays. `--prose-muted-soft` and
  `--dm-muted-soft` were the two left over, a step lighter and both under 4.5:1 on real text at
  11–12.5px, and both now hold the muted value. That is a visible change to `.back`, `.byline`,
  `.eyebrow`, `.spec-label` and `.note-line` on the essay pages, and it costs the soft grade its
  distinction: nothing lighter than `#6B6358` in either palette clears the threshold, so there was no
  lighter passing value to move them to. The names stay, because they say which elements the role
  covers. Four one-line reverts if the author disagrees.
- axe over every screen a reader can reach, at A and AA through WCAG 2.2 with best-practice on, at
  sixteen stops because four screens have a second state carrying markup the first does not. It found
  two things. The debrief's counts table had an empty corner header, which announces as “blank” and
  leaves five row labels belonging to nothing; it now carries “What was recorded”, visible to a screen
  reader and not on the page. And the three prose pages had no `main` landmark at all — the heading,
  the byline and the footer sat in a bare `div` — so `.wrap` is now a `<main>` on each of them. Both
  are real improvements rather than accommodations to a checker.
- **All thirteen screens are swept, and a test says so rather than a list.** The sweep was written
  against twelve, because `process` had nothing navigating to it — `app.tsx` wired `method` from the
  intro and the debrief and had no equivalent — and it recorded that as a skipped test carrying the
  reason rather than counting to twelve and saying thirteen. The protocol and process screens then
  arrived in this same version and closed the gap, so the walk covers every screen in the union, and
  the two reference screens are entered through each other and left by their own Back, which exercises
  the history scheme on the way past. What survives from the shortfall is the assertion that would have
  caught it: the sweep's list of stops is checked against the keys of `SCREENS`, which the compiler
  holds exhaustive, so a fourteenth screen fails here instead of going unswept.
- Found and not fixed: `--blue-bar` is 2.47:1 against the bar track it sits on, under the 3:1 SC
  1.4.11 asks of a graphic that carries information. Every bar prints its value beside it and repeats
  it in an `aria-label`, so nothing on the debrief is available only from the fill — but that is
  reasoning doing work rather than confirming a pass, and it is the one place in the palette where it
  does. Darkening the control series is a change to the debrief's chart and is the author's call, not
  the sweep's. The check prints the ratio and the argument on every run. It has no row of its own in
  `SOURCES.md`: a failing pair is a defect in this build rather than a claim taken from somewhere
  else, and grading it FLAGGED would have made that grade mean both an unpinned assertion about the
  world and a hex that needs changing. It is stated inside the row that pins the standard instead, so
  that row cannot be read as claiming conformance.
- **One end-to-end exemption, down from two, because the screen the other one covered now exists.**
  `region` was off for the stub screens — a page whose only content is that it is not finished should
  not grow a wrapper to satisfy a checker — and the constant carrying it said to delete it rather than
  leave it standing once nothing was a stub. The endpoint arrived, `encoded` became a real screen, and
  it is deleted: every screen is now swept under the same rules with no per-screen exceptions. The
  sweep also asserts that the encoded screen it lands on is the real one, because a dark build that
  rendered an empty frame would sweep clean and "no violations" on a blank screen is not a result. Its
  live states are not swept and cannot be from here — they need a key and three model calls — and that
  gap is stated in the file. `color-contrast` is off for the
  `· · ·` between sections of the long essay, on the exemption SC 1.4.3 writes for pure decoration —
  the paragraph gap is what marks the section, and darkening an ornament to 4.5:1 would make it louder
  than the prose it separates. A test asserts that exemption still matches five nodes, so it cannot
  become dead code that makes the sweep look stricter than it is. The separators also gained
  `aria-hidden`, which is a separate point and not the justification: it stops a screen reader
  announcing five sets of middots.
- Reduced motion is measured rather than assumed: `.dm-button`'s 150ms transition computes to 0.15s
  without the preference and under a millisecond with it, both checked, so a pass means the guard did
  something rather than that there was nothing to guard. There are still no `@keyframes` in the
  instrument — the two entrance animations the original had were not rebuilt — and the suite prints
  the count so that is visible rather than inferred.
- A favicon, which resolves. All four pages declare `public/favicon.svg`, so browsers stop guessing at
  `/favicon.ico` and 404ing on first load. The mark is the instrument's own selected-option glyph,
  `◉`, which the radio groups and the flag already draw; nothing new was designed for it. It is the
  one file outside `tokens.css` that contains a colour literal, because a favicon is fetched as its own
  document and cannot read the page's custom properties, and it says so. Safari before 16 ignores the
  link element and asks the site root, which is not served from this repository; that limit is written
  at the change rather than left to be discovered.
- `scripts/check-size.mjs` now asserts, per page, that each prose page carries no `<script>` and
  references no `.js` — and that `drift-meter.html` carries exactly one, because a check that only ever
  looks for absence would pass just as happily on a build that emitted no JavaScript at all.

**Why**

The previous build's central defect was that it could not be corrected with any confidence. There
was no source to correct, and nothing in the process that would have caught an arithmetic error in a
published figure — the ÷6-versus-÷9 bug was found by a reader. Rebuilding from source is the only
version of this project that makes that class of error hard rather than easy.

Three behaviours in the rebuilt reducer look like defects and are not: a case stays read once a panel
has been opened, a slider counts as touched even if it is put back, and a supplied recommendation
left standing records nothing. All three were already documented and already tested at the domain
layer, but those tests set the fields by hand and would have stayed green if the reducer wrote them
wrongly. They are now tested where they are actually implemented.

Restating the figures rather than pinning them is the honest reading of what they are. They were
built to make a particular error catchable, not taken from a source and then approximated, so pinning
one would mean changing the number to whatever the source said and rewriting the trap copy, Round 3's
thresholds and the transfer case around it — retro-fitting a provenance the figures never had. The
grade exists because the table could not previously say which of the two it held. What the restatement
does not do is verify anything: every `Primary link: TODO` in those rows is still open, and now
optional rather than blocking.

The disclosure is general on purpose, and that is the one place where this change trades against the
instrument. Saying beside the supplied estimate that this figure is illustrative would be the most
transparent version and would leave nothing to measure; a reader told where the planted error is has
not been observed noticing it. Saying only in the debrief would be safest for the measurement and
would still have the reader accept figures for three minutes before being told what they are. Before
and after, worded generally, is the version where both obligations survive.

The debrief is the screen where overclaiming would cost most, so what it says is bounded by what one
person on six cases can support: every branch names the confounds it cannot separate, and nothing on
it compares the reader to anyone else. The same discipline is why the transfer check prints its own
weakness beside its verdict, and why Round 3 states that it is excluded from the measures rather than
leaving the reader to assume it. A test now asserts that nothing done after the debrief can change
the debrief — the transfer pick and every Round 3 slider are outside anything the measures read.

The two reference screens are where the project is checked rather than argued, so both are written
to be used against it. The protocol screen states a threat beside every measure, including the one
that runs in the same direction as the prediction: the control round's sliders start at an arbitrary
midpoint and the assisted round's start at an authoritative figure, which inflates evaluative range
in the control round. The process screen's most important section is the empty one — nobody has read
this yet — and it says so above the table rather than below it.

Pinning the Clio reference was the mildest obligation in the source table, and it turned into a
withdrawal. The publication existed, so the row had been graded since v0.3 as though the pin were
clerical; what nobody did in that time was read the publication against the sentence it was supposed
to support. It does not support it. A source that exists is not a source that agrees, and PRIMARY
AVAILABLE made the difference easy to miss, because the grade is defined by whether a link has been
typed here rather than by whether anyone has read one. Withdrawing the claim from the two screens,
earlier in this version, was the cheaper half: it stopped the site saying the thing without settling
whether the thing was true. Reading the paper settled it. The claim was published on the consent
screen of the build that has since been deleted, which is the screen where a reader is deciding
whether to trust the page about data handling. Nothing in this repository records the sentence
itself, only that it was made.

Seven of the bullets above are corrections. Six are claims this project made about its own work: a
contrast ratio, four claims about its own tests, three of which described tests that did not exist,
and a claim about where a word appears in the repository. The seventh is a scale qualifier on a
published figure, which the source table already existed to prevent. That they survived until
someone checked the paperwork against the code is the uncomfortable part. The withdrawal of
“reference standard” in the Clio bullet is a correction too, and the largest of the pass; it is
filed as a change rather than counted here because what it corrects is a claim about the world, not
a claim about this project's own work.

Two of the seven are in `CLAUDE.md`, which this pass first skipped on the grounds that it is the
working agreement rather than site content. The exemption does not survive the argument. A document
that tells every future contributor which properties are guaranteed, while naming two guarantees the
repository does not provide, is the failure this experiment is about: a claimed test is worse than a
missing one, because it stops anyone from looking for the gap.

The endpoint ships built and switched off, and that is the whole of its design rather than a stage in
it. A repository that can spend money is a different object from one that cannot, and the difference
should be answerable by reading the repository rather than by inspecting a CI setting — so the switch
is a committed file with an empty value, and turning it on is a commit somebody can point at. Every
clone and fork is therefore dark by construction and cannot spend the author's credit, which is the
only version of “try this yourself” that does not bill the author for it.

What the encoded screen demonstrates is narrower than it looks, and it says so twice on the page. The
rubric is a self-grading loop: the same model, on the same pin, scoring an answer produced from a
prompt written by this author, against a rubric written by this author too. And the repair pass
improving on the first attempt is close to guaranteed, because a second attempt with the failures
named is an easier task than the first — what it shows is that the failures were specific enough to act
on, not that the rules are learnable or worth their cost. A pass count that did not carry both
sentences would be the exact failure this project is about.

The signature is the part of this change that would have been easiest to skip. Two of the three modes
are closed by construction — an id and an enum — and it would have been possible to ship the third
with a length cap and a note about the origin check, which is what the deleted build effectively did.
The reason not to is that `CLAUDE.md` already claimed the channel was closed, and a document that tells
every future contributor which properties are guaranteed while naming one the code does not provide is
worse than no document. Making the claim true was cheaper than correcting it.

The re-baseline is recorded on its own because it costs something. A pinned model is what makes two
runs comparable, so moving the pin discards the comparison: the v0.4 and v0.5 rubric pass rates
describe an instrument that no longer exists. Filing that as maintenance would preserve the
appearance of a continuous series while removing the thing that made it one.

The browser suite is late on purpose and was worth waiting for. Playwright was left out of the initial
toolchain because it is a large download and the slowest thing in the pipeline, for value that only
exists once there are screens to drive. What it bought, now that there are, is not regression cover on
markup: it is the first check on three claims this project had been making in prose. Two of the three
were already known to be unbacked — the corrections earlier in this version say so — and the third,
the consent screen's privacy promises, had nobody looking at all. A claim about behaviour that nothing
exercises is the failure this experiment is about, and the essays' zero-JavaScript property was being
held by review, which is another way of saying by memory.

The accessibility work went the same way and produced the same shape of result: the two things the
sweep found that mattered were an empty table header and three pages with no landmark, neither of
which any amount of reading the CSS would have surfaced. Both are ordinary defects that only a tool
that walks the rendered page can see, which is the argument for having one.

One thing this pass got wrong and had corrected for it. The sweep was built while the protocol and
process screens were stubs, and it covered twelve of the thirteen because the thirteenth had no path
into it — recorded honestly, and still a list of screen names that no test held to the union it was
drawn from. Merging the branch that built those two screens is what surfaced it. The fix is not the
three names added to the list; it is the assertion that the list has to match `SCREENS`, so the next
screen cannot arrive unswept and accurate-sounding at the same time.

Where the sweep stops is written down rather than smoothed over. Two axe rules are off, each on one
selector, each with the clause it stands on and a test that the exemption still matches something. One non-text pair is under
its threshold and is left to the author, because darkening the control series in the debrief's chart is
a design decision and the sweep does not get to make design decisions on its way past. The alternative
in each case was a green tick that meant less than it looked like it meant, which is the currency this
project is trying not to accept.

The contrast fix from #4 is confirmed on the merits and the sweep finishes it, at a cost worth naming.
The soft grade in both palettes now holds the same hex as the grade above it, so a distinction the
author drew is gone — not traded away for a threshold, but because no lighter value in either palette
clears 4.5:1 and there was nothing to move it to. Saying that plainly is better than keeping a token
whose name promises a step that its value no longer takes. Four one-line reverts, all four recorded.

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
