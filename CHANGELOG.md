# The Drift Meter — changelog

Experiment 01 of the Agential Drift Research Program.
Author: Megi Pishtari (github.com/vigilia-mz). Sole author, sole responsibility for every claim.

Every release records what changed and why. Retractions are recorded, not deleted.

Versions v0.1 through v0.5 were published from a separate repository, which has since been deleted.
This file is the surviving record of them.

## v0.8 — In progress — The page now says what the papers say

**What changed**

- **v0.7.0 is deposited, and the artifact has a DOI for the first time.** Zenodo archives the tagged
  release and mints two identifiers: one for this version, `10.5281/zenodo.21887595`, and a concept DOI,
  `10.5281/zenodo.21887594`, which always resolves to whatever the newest version is. `CITATION.cff`
  records the versioned one as its `doi:` and lists the concept DOI under `identifiers` as what it is,
  because the reason this artifact wanted an archived identifier was to distinguish one version from
  another and the concept DOI does what the bare URL already did. The README carries the badge and a
  table saying which of the two to cite for which purpose.
- **The caveat that said there is no citable identifier is replaced rather than deleted, and it does not
  simply close.** The identifier exists; what it does not fix is that the published URL still serves
  whatever version is current, so citing the page still says nothing about which version was read. The
  caveat now says that, names the versioned DOI, and states plainly that the concept DOI is not a
  substitute for it. The docstring above the section that lists the three places this screen fails its
  own standard drops from three to two — named readers and three unpinned figures remain.
- Corrected: the reader briefs quoted three of the site's counts back at the recipient and two were
  wrong. `docs/review-briefs.md` said the protocol screen lists eight things this build cannot do, in
  two places, and there are nine; the public design-review draft said six measures, and there are seven.
  The file is written to be pasted into a message and sent under the author's name, and the first
  recipient of the first brief is the reader recruited to find exactly this. Nothing read the file,
  because rule 5 governs what the site asserts and this is documentation about it; two cases in
  `invariants.test.ts` now hold all three counts against the arrays they count, on the same grounds as
  the cases that read `index.html`.
- Both asks that go to a reviewer now name the archived version rather than only the URL. A critique of
  a page that serves whatever is current is a critique of nothing in particular, so the methods brief
  and the design-review draft both cite `10.5281/zenodo.21887595`, and a test holds that the DOI they
  quote is the one `CITATION.cff` declares — the versioned one, not the concept DOI. The draft's
  timestamp paragraph is also narrowed: a deposit with a date is better than commit history and is
  still not a registry that would refuse to let the author alter it.
- **The three prose pages name the version to cite, which is the last place citability had not
  reached.** Closing v0.7 and depositing it reached the masthead inside the instrument, the changelog
  heading, `CITATION.cff`, the README and the first git tag — and not `index.html`, `essay.html` or
  `atrophy.html`, which are the pages a reader arrives on, reads the argument from, and would quote.
  Each footer now carries one sentence: cite v0.7.0, dated, with its versioned DOI as a link, and this
  URL serves whatever version is current.
- **The line states the version to cite and not the version in progress, deliberately.** An earlier
  draft of it named both, which meant two numbers from two sources — `CITATION.cff` says `0.7.0` and
  `package.json` says `0.8.0` — so only half of it could be held, and every version bump would then have
  to edit three hand-written HTML files. In a repository whose recurring defect is a count in prose that
  nothing checks, that adds three places to go stale in order to fix one. What is on the pages is the
  one string a reader can act on, it changes only when a version closes, and it is checked in full.
- **That line is held against the citation file rather than typed four times and trusted.** The three
  pages are hand-written documents with no content module, so an invariant reads the footer out of each
  one and the version and DOI out of `CITATION.cff` — the file GitHub and Zenodo read — and requires all
  three pages to agree with it. The same test holds the masthead row against the newest version in the
  changelog mirror, which is the neighbouring gap: the row above the table could name the closed version
  while the table below it opened a new one. This follows the pattern the sweep already uses for a
  sentence carried on two screens, because either page could lose the line alone without anything else
  going red.
- Corrected in passing: the masthead said the site was v0.7. It is v0.8 in progress, on the v0.7.0
  release, and the row now says which version is the one with a DOI. `package.json` moved to `0.8.0`
  with it.
- **The reader briefs handed over a URL that does not go where the brief says it goes.** Both asks that
  send a reviewer to the protocol screen cited its sections 3, 4 and 6 and then linked
  `vigilia-mz.github.io/drift-meter/`, which is the landing page. The protocol screen is inside the
  prototype and has no URL of its own — deliberately, and `src/platform/history.ts` says why: a URL that
  does not survive a reload is not honest. So a methodologist who agreed to one bounded pass began with
  a hunt through a site whose landing page links three documents, none of them the screen named. Both
  asks now link `drift-meter.html` and name the button to press, `Read the method first`, rather than
  `Begin`. The naive-reader brief had the mirror image of the same fault: it asked the reader to follow
  the link into the prototype and then not to follow the link to the protocol, and on the landing page
  those are the same link. It now names the button not to press, which is where the two actually part.
- **A message sent under the author's name ended in a dead end.** The briefs and the masthead's Contact
  row both said that anyone who would rather not file in public can come through the GitHub profile
  linked from the repository. The profile is linked from the three prose-page footers and was linked
  nowhere in the README, which is the repository as a reader on GitHub meets it. The README now links it,
  the briefs name it outright rather than describing a link, and a test holds the two together for as
  long as the row makes the promise.
- **The methods brief broke the rule this file opens with.** The file argues that an unbounded request
  gets a polite yes followed by nothing, and asks each reader for exactly one thing; the methods brief
  then ran to 733 words and five question marks — one ask, four further questions, and three known-wrong
  items with a fourth appended after them. The four questions are gone, and the appended item is now the
  fourth entry in the list rather than an afterthought, which was the other half of the same fault: 733
  words to 610, and five question marks to the one the ask is. It is still the longest of the four,
  because handing over what is already known to be wrong is the file's own first principle and that is
  what the length now is.
- Corrected: the briefs said five of the seven measures are traces of how the work was done and the
  protocol screen says four of the six, with the seventh bracketed as a signed difference. Both readings
  were defensible and a methods reader holding both stops at the disagreement. The briefs now say what
  the screen says, and the split is derived in `invariants.test.ts` from `MEASURE_SPECS` rather than
  written in either place — the three exceptions are named, the two counts fall out of them, and #55
  pinned the counts while leaving the split between them to be typed twice.
- The design-review post gave no route for the attack it asks for: a site URL, a DOI, and no repository
  or issue link. On a venue with threaded comments that is enough; anywhere else it is a dead drop. The
  post now carries the repository and names the `Challenge a claim` form. That paragraph then promised,
  in public and about other people, that whatever comes back is answered in the changelog under the name
  of whoever said it — which is not the author's to promise. Both forms it routes a reader to make being
  named an opt-in, each with its own unticked checkbox. It now says the changelog answers under your
  name if you want it there.
- **The screen stopped saying a public design review is the path currently planned.** It was the one
  sentence on the publication-process screen claiming a future action, and it is no longer the route
  being taken first: the three briefs and the two issue forms are. The clause is deleted rather than
  replaced, so the sentence ends where what is settled ends, at `That may be the cheaper path`. Nothing
  moves with it. The reviewers table still reads “Not recruited”, “Not assigned” and “Planned
  before collection”, the design-review row's own note still hedges the same thing correctly as
  planned rather than scheduled, and nothing has been sent to anyone.
- **A reader who would volunteer had nowhere on the screen to say so.** The reviewers section says
  nobody has read this, names three readers, and says what each would be asked for — and then stopped.
  The README and both briefs got their route in earlier in this version, which left the screen making
  the case as the last place without one. It now names the form and prints the repository as text:
  `github.com/vigilia-mz/drift-meter`, and the `Offer to read it` form on it, which asks which of the
  three and little else. Printed rather than linked, deliberately. There is no anchor element anywhere
  in `src/screens/` or `src/ui/` — the application renders no links at all — and making this the first
  one is a decision about the application rather than a fix to one paragraph. It is a capability and not
  a status: no row in the table moves until a reader answers.
- The briefs quote three button labels back at a stranger — `Read the method first`, `Begin` and
  `Launch the Drift Meter`, at six places between them — and nothing held either half to the other. Two
  of the three are `INTRO` fields in `shell.ts` and the third is markup in `index.html`, so renaming one
  would have left a document sent under the author's name telling a reader to press a control that does
  not exist. `invariants.test.ts` now reads all three out of their sources and asserts each is quoted in
  the briefs, which puts the failure on the rename rather than on the edit to the briefs that would
  follow it.
- **Corrected: all three of the long essay's empirical claims were wrong, and were also uncited.** The
  three rows `SOURCES.md` has graded FLAGGED since the v0.6 pass are the essay's findings about
  students, endoscopists and developers. The obvious debt was the missing citation. The debt that
  mattered was that the sentences misstated the studies, so citing them as they stood would have been
  worse than leaving them bare: the source would then contradict the sentence in a reader's hands
  rather than in a file nobody outside this repository reads.
  - _Students._ The page said students “with access to ChatGPT did markedly better during practice but
    scored worse on exams taken without it.” The trial has more than one assisted arm and the reversal
    belongs to one of them — the students given a standard ChatGPT interface. The students given a
    tutor version built with pedagogical safeguards are not reported as harmed. One arm's result was
    published as the study's, and no reader could have found the distinction from the page. It now
    names all three conditions, says which one carries the harm, and says the design was randomised.
    The sentence after it, that students “felt more capable while the underlying competence failed to
    consolidate,” is gone: it is a claim about what students believed and nothing here supports one.
  - _Endoscopists._ The closest of the three to accurate, which is worth saying rather than implying
    three equal faults. The direction held, and it did not make the error this correction went looking
    for — it said detection rates, not cancer detection. What it did not say was anything else. No
    measure, so a reader could not know it was adenoma detection; no magnitude; and no design, which
    for this claim is most of what decides its weight, because the study is an observational
    before-and-after comparison rather than a trial. It also described the tool being “removed”, where
    the comparison is of unassisted procedures before and after those centres adopted it. And the
    sentence after it, that “many practitioners did not register the decline as it occurred”, is gone:
    the study measured detection, not what clinicians noticed. The page now gives 28.4% to 22.4%, says
    that six percentage points and about a fifth are one result rather than two, and says that whether
    the endoscopists noticed is not a question the study asked.
  - _Developers._ The worst of the three, on the claim closest to this project's own thesis. The page
    said “studies of software developers: those using AI coding assistants took longer to complete
    tasks than those working unaided”. It is one study rather than a literature. It randomises tasks
    inside the same sixteen developers rather than setting one group of people against another, so the
    sentence described a design nobody ran. And it quoted no figure at all. The page now names the
    report, gives 246 tasks across sixteen developers working in repositories they maintain, states the
    slowdown as 19% and the developers' own after-the-fact estimate of a 20% speedup separately, and
    says in terms that the two are a measurement and a belief about it — adding them would produce a
    percentage-point gap the report does not contain, which is the error this claim was most likely to
    acquire next. It also says that sixteen developers is a small study to rest an argument on.
- **The three rows move to PRIMARY AVAILABLE and not to PRIMARY, and that difference is the point of
  the change rather than a technicality about it.** `SOURCES.md` defines PRIMARY as pinned here and read
  on a stated date, and nobody has read these papers. Each row carries its citation, `Checked: TODO`,
  and a note saying which figures came from the issue that asked for the correction and which from an
  unverified account of the study; each also lists what a reading has to confirm, including a DOI, an
  author list and three sample sizes that are deliberately absent from the page, because a count is the
  kind of detail that reads as verified. No row is graded FLAGGED now, for the first time since the
  grade existed, and the table's preamble says what that does and does not close.
- **Four invariants read `atrophy.html`, one per claim and one for the state of the rows.** They pin the
  error each sentence used to make rather than the presence of a citation: that the students paragraph
  names all three arms and attaches the harm to the unrestricted one, that the endoscopy paragraph says
  adenoma and not cancer and keeps the absolute and relative falls as one result, and that the developer
  paragraph carries both figures and never their sum. The fourth asserts all three rows still read
  unread, in the file and in the screen's mirror of it, so a promotion to PRIMARY has to be a deliberate
  edit here rather than a quiet one. The pages are hand-written and have no content module, so these read
  the file, on the same grounds as the cases that read `index.html`.
- The mirrored source table moved with the grade, and so did four sentences around it that were
  statements about these three rows: the table's lead, the line saying which of the five checkable things
  this screen still fails, the note under the table, and the docstring explaining what `Flagged` is for.
  Leaving them would have published a screen contradicting its own table. `docs/review-briefs.md` told
  the editor the empirical section “cites none of them”, in the one document written to be sent to a
  reader recruited to find exactly that; it now says what is true and asks the harder question, which is
  whether the rewritten sentences still claim more than the studies support.
- **Then the papers were read, and two of the three corrections above were themselves wrong.** The
  author supplied the articles the same day. This is the first time any claim in `SOURCES.md` has been
  checked against a source since #8, and it is the most useful bullet in this entry, because what it
  documents is a correction pass being corrected by the act of doing properly what it had done from a
  summary.
  - _The citation named the wrong paper._ The students row cited “Generative AI Can Harm Learning”,
    PNAS 2025. That is the 2024 SSRN working paper's title attached to the journal version, which PNAS
    published as “Generative AI without guardrails can harm learning: Evidence from high school
    mathematics” — retitled, that is, to name the exact distinction the correction had been made to
    draw. The page and the row now carry the published title, its DOI, and the article's own published
    correction, which fixes an author affiliation and touches no result.
  - _A true sentence had been deleted for being unverifiable._ The pass cut the claim that students
    “felt more capable while the underlying competence failed to consolidate”, on the ground that
    nothing here supported a claim about belief. The paper has a section on precisely this, and reports
    something stronger: the students who did worse “did not perceive that they performed worse or
    learned less”, and the tutor arm, which did no better than the control, “perceived that they
    performed significantly better”. The finding is back on the page in the paper's terms. Deleting an
    unverified claim costs nothing and deleting a true one costs the argument, and both happened here.
  - _The remaining figures held._ Randomised controlled trial, nearly a thousand students, three arms,
    48% and 127% gains on the practice problems, and on the unassisted exam GPT Base 17% below the
    control while GPT Tutor was “statistically indistinguishable” from it. The page now states the 17%
    and the scope the authors themselves state: one subject, one high school in Turkey, autumn 2023,
    on GPT-4.
- **The developer claim was stale, which no amount of care about its wording would have caught.** The
  METR trial measures the tools available February to June 2025. Its own authors ran the experiment
  again from August 2025 and published on 24 Feb 2026 that among returning developers the sign had
  reversed, to an estimated 18% speedup — on intervals that contain zero, and alongside their own
  reasons not to trust the number: developers increasingly declined to take part rather than work
  without AI, and 30–50% of those who did held back the tasks they least wanted to attempt unassisted.
  An essay dated 2026 was citing the early-2025 slowdown as a present fact, which is the argument's own
  mistake performed by the argument. The page now names the season the trial measured and carries the
  follow-up with METR's own verdict on it.
- **And then the correction to that correction, which is the one worth reading twice.** The first draft
  of the paragraph above said the sign “had reversed” and that only the calibration gap survived. Both
  gave the follow-up an authority it disclaims of itself. An acknowledged-unreliable experiment does not
  supersede a clean one: the 19% still stands for those sixteen developers, those 246 tasks and those
  tools, and what fails is carrying it forward as a current or portable estimate. The page says that in
  those terms, and says what does last — the calibration failure, which the follow-up cannot repair by
  being wrong in the other direction. Getting this wrong would have been the more interesting failure of
  the two: correcting a stale confident number by overstating the thing that unsettled it.
- **A point estimate was standing in for an interval, and the regression was re-run rather than
  believed.** 19% is the point estimate; running METR's published `regression.py` against its published
  `data_complete.csv` returns a speedup of 0.188 on a 95% interval of (0.013, 0.394). So the trial
  establishes that these sixteen developers were slowed, not by how much, and the page says so. Also
  verified from the paper: 246 tasks, task-level randomisation, the 24% forecast made before the tasks
  and the 20% estimate made after them — the page had one of those two — and the eligibility rule that
  the phrase “repositories they maintain” rests on, which is six months as an active maintainer.
- **The endoscopy article was read last, because it was obtained last, and it corrected the design.**
  Budzyń et al., _Lancet Gastroenterol Hepatol_ 2025; 10: 896–903, with a correction of 11 Sep 2025
  restoring a covariate to a supplementary analysis and stated not to affect interpretation. The
  numbers hold: adenoma detection rate in standard non-AI colonoscopies 28·4% before routine AI
  exposure (226/795) against 22·4% after (145/648), −6·0 percentage points, 95% CI −10·5 to −1·6,
  p=0·0089, adjusted OR 0·69. Two things the reading added. Colorectal cancer detection did _not_
  change significantly — six cases against eight, p=0·35 — which turns the page's cautious “not cancer
  detection” into a positive finding worth stating. And the design was misdescribed: AI was adopted at
  the four centres and never withdrawn, examination dates being randomised AI-on or AI-off afterwards,
  so the comparison is pre-adoption non-AI procedures against post-adoption AI-off ones. “When the tool
  was removed”, the wording published until v0.8, is true only of individual procedures and misleading
  of the study. The page now carries the design, the nineteen endoscopists, the 1,443 unassisted
  procedures, and the interval.
- **The endoscopy paragraph now says what the finding is not.** It reported only the decline, which
  left a reader able to finish it believing the study found that AI makes colonoscopy worse. It does
  not: trials have found AI improves adenoma detection while it is active, and the narrower finding is
  that once AI became routine the same endoscopists detected fewer adenomas working without it. The
  qualification takes no source row of its own, because the paper discusses those earlier trials
  directly and the row is pinned to the paper and read. Areia et al.'s 2022 cost-effectiveness
  modelling study was read and set aside for the same sentence: it projects forward from an assumed
  detection gain rather than measuring one, and would belong here only if the essay discussed costs or
  downstream health benefits. The row records the decision, because a source read and rejected is a
  decision and the absence of a row does not say so.
- **A fourth claim was found in the same class as the three, and it had outlived the pass that should
  have caught them.** The essay said experienced users “already show signs of shifting from sustained
  evaluative engagement to something more passive” — a population, a direction, a present tense, and
  the sentence form of a finding — with a theoretical synthesis behind it rather than a study. It
  survived the correction of the other three precisely because it named no study, so it did not read
  as a citation waiting to happen. The sentence now claims a mechanism and hedges it, and says the
  offloading is hard to notice from inside the task, which is what the source is actually about. It
  has a SECONDARY row: Macnamara et al., _Cognitive Research: Principles and Implications_ 2024;
  9(1): 46, labelled a theoretical perspective and not primary evidence for the behaviour, since its
  own conclusion is that the research to establish these effects still needs doing. Two invariants
  hold the hedge and the row together, on the same terms as the illustrative disclosures.
- **The essay made that generalisation twice, and the second one is rewritten rather than hedged.**
  The paragraph on autonomous agents said users “in practice” begin by reviewing each action and
  gradually step in only when something looks obviously wrong: a frequency and a trajectory, asserted.
  Attaching the same hedge as the first would have put two near-identical qualifications in adjacent
  sections, which is how stating one's limits turns into a register rather than a disclosure. So the
  sentence now says what the design makes available instead of what people are observed to do —
  agents make a looser supervisory posture possible, the user can wait for an obvious failure before
  intervening, and the risk is that exception-handling gradually substitutes for active judgment.
- **And it marks the step it takes, which is the part worth keeping.** Macnamara is about performing
  a task with assistance. Supervising a system that performs it is a different activity, and carrying
  the mechanism across is an inference nobody has studied. The page says that in those words. Applying
  a cited mechanism to an uncited setting is how a page that has just cited everything quietly
  acquires a new unsourced claim, and it is the one move this version was in the best position to make
  by accident. One row covers both locations, and an invariant holds the marker and bans the frequency
  claim from returning.
- **All three rows are PRIMARY, read by the author on 13 Aug 2026.** That is the first time this table
  has held more than one pinned-and-read row, and the grade was earned rather than assumed: the
  readings changed four things the wording passes had not. Two rows record more than the grade asks
  for — the developer figure was recomputed here from METR's published data rather than taken from the
  abstract, and the endoscopy counts were checked against each other — and both say so in the row
  instead of inventing a grade for it. An invariant now holds all three to a dated `Checked:` line and
  fails if any of them returns to promising a source nobody opened.
- Two invariants added and one rewritten to match. The developer cases now pin the interval, the
  season and the follow-up, and the guard against publishing a slowdown added to a perceived speedup
  had to change shape: it banned the digits `39`, and 39% is the honest upper bound of the trial's own
  interval. It now requires that wherever 39% appears on the page it appears as a confidence bound.
  The last case asserts all three rows are still short of pinned, which is the one that will go red on
  the day the author reads the papers and promotes them — deliberately, since that edit should not be
  possible to make by accident.
- The total-size budget is raised from 416 KB to 440 KB, and this is the second time it has been moved
  by prose rather than by code. The build came in at 421.0 KB. What grew is the long essay, which now
  states each study's design, sample and interval where it used to state a direction, and the mirrored
  source table, which carries what each reading changed. The note beside the number at #30 says that
  shaving a published sentence to fit a round number is the wrong trade here, and that reasoning holds
  unchanged. What the note also asked for was enough margin that the next content change would be a
  decision about content — that margin lasted a version and a half. The comment now records the
  proportions, because a third raise would be a pattern and not an event: 48% of the build is
  self-hosted fonts, 35% is the instrument's JavaScript and CSS, and the three prose pages together are
  under 10%. What a reader actually waits for is the gzipped JavaScript, which is at 48 KB of a 60 KB
  budget and untouched.
- **The version is retitled, which is itself a correction.** It opened as “The artifact has an archived
  identifier, and the front door names it” and that was accurate for about a day. What the version
  became is the source pass, and a heading naming the deposit would have left the changelog describing
  a release by its smallest true item — on the file whose whole purpose is that a reader can tell which
  build they are citing. The DOI keeps its bullets and loses the headline. The mirrored row on the
  process screen is retitled with it and its summary reordered to match, since that row is the short
  form a reader actually sees.
- The Budzyń row now separates bibliographic identity from the copy that was inspected. The DOI is the
  canonical record; the full text was read through a third-party reproduction hosted on Scribd, and the
  row says so and names the host. No author manuscript, repository deposit or preprint of the Article
  exists to prefer — the publisher's page and ScienceDirect serve abstracts, ResearchGate serves a
  request — so a disclosed route of last resort is what there is, and describing it vaguely would have
  been the same move as citing a paper one had not opened. The row also separates the four Lancet items
  that share this subject: the Article, its correction notice, the editorial, and post-publication
  correspondence that has not been read here. Only the first is the study, and a row that let the
  correspondence pass for it would have been claiming a reading nobody did.
- Recorded because it was caught by CI rather than before it: `npm run check` does not run the size
  budget. `check:size` needs a build and is a separate job, so the local gate can be green on a change
  that fails the remote one. That is a property of the split rather than a defect in it — the fast gate
  is meant to fail in seconds — but it is worth knowing that the gate does not cover everything, and
  the two commits it took to land this are the record of not knowing it.
- This entry exists because v0.7 was closed and dated before any of the above happened. Nothing in the
  toolchain would have stopped these bullets being appended to a released version's entry, and the
  version boundary is drawn on comparability rather than on convenience: the deposited archive is what
  v0.7.0 contains, and the site has changed since.

**Why**

This version was opened to record a deposit and closed having rewritten the three sentences the site is
least able to defend. The title says the second thing, because that is what the version became: the
DOI is an item on the list below rather than the argument of the release. What follows is the reasoning
for both, in the order they happened.

The DOI is the last item on the publication-process screen's own list of what makes a claim checkable
without an institution behind it, and it is the one that took a step outside the repository — an archive
had to be authorised against the account before a release could mint anything. That is also why the
citation file shipped one version without a `doi:` field: writing one before the deposit existed would
have been a claim about an archive that did not exist, on the page whose argument is about exactly that
kind of confidence.

Citability was the whole point of closing v0.7 and it stopped at the door most readers come through. The
version was already in the masthead, the changelog, the citation file, the README and the tag; the three
pages a reader actually lands on were not among them, and those are the pages the argument is on. The
unflattering half is that this was noticed twice in one session and not acted on either time.

What deserves stating is how little the DOI fixes. It makes one version of this artifact permanently
addressable, which matters because the changelog records a retraction and an unversioned reference cannot
distinguish the build that shipped an invented cohort dashboard from the build that removed it. It does
not make the instrument better, it does not add a reader, and it did not close any of the three FLAGGED
source rows — a later item in this same version did, and not by adding an identifier. A citable prototype
is still a prototype, and n is still zero.

The three FLAGGED rows were the oldest open item on this site and the easiest to describe as a paperwork
gap, which is how this file and the process screen described them: three findings with nothing to check
them against. That framing was wrong in the direction this project is meant to notice. The sentences were
not accurate claims missing a footnote. They were one arm's result generalised into a study's, a design
described as its opposite, and two assertions about what people felt or noticed that no study on the list
measured. Every one of them read as careful. Nothing in the prose looked wrong, which is the condition the
source table exists for and the one a careful read does not catch — the same shape as the omitted
seven-point scale that put the table here in the first place. Citing them as written would have been the
worse outcome, because a citation turns an unsupported sentence into a checkable false one.

What this does not fix is the thing the new grade says out loud. Three rows now name a paper nobody here
has opened. The figures came from the issue that asked for the correction and from an unverified account
of each study, which is better provenance than memory and is not a reading. Until someone reads all three,
the page is more precise than it is verified — and being more precise is exactly what makes an unverified
sentence easier to trust, which is the argument the essay is making about everything else. That is the
risk this version takes on deliberately, and it is why the sample sizes that would have made the sentences
sound authoritative are not on the page.

The papers arrived the same afternoon, and the paragraph above turned out to be the most accurate thing
in the pass. Reading them found that the correction had introduced a wrong citation, deleted a sentence
that was true, misdescribed a study's design, and left standing a figure that had stopped being current —
four faults in work done carefully, in one morning, by someone who had just written at length about the
cost of citing what one has not read. It is worth being exact about which part of the process caught
which. The wording discipline caught the arm generalisation, the missing design and the invented
percentage-point gap, and it could not have caught any of the other four: nothing about the sentence
“Generative AI Can Harm Learning, PNAS 2025” looks wrong, a withdrawal and an adoption read the same at
the length the essay was giving it, and a stale finding reads exactly like a current one. Only the reading
caught those, which is the whole argument for the grade this table reserves for having done it.

The pass also did the thing it was warning about, in miniature and in the other direction. It deleted a
claim about what students believed because it could not verify one — and the paper reports it, in a
section of its own, more strongly than the sentence that was cut. Caution is not neutral. A page that
removes what it cannot check ends up shaped by what was easy to check, and that is a bias with better
manners than the one this project usually looks for.

## v0.7 — 10 Aug 2026 — The attribution reaches every reader, and a measure that can lose

**What changed**

- **The attribution arm is delivered to every reader, not only to the ones who opened a panel.** The
  arm's label rendered inside the expanded estimate panel, which starts closed. A reader who never
  opened it never learned whether the number came from Claude, from a programme officer, or from
  nowhere in particular — and the debrief told them their arm regardless. That reader is the one the
  instrument exists to observe: P1 is a claim about low engagement, so the manipulation P5 is built
  on was undelivered for exactly the subgroup that separates the two. Opening the panel was measuring
  evidence engagement and delivering the treatment at once, which makes an outcome measure its own
  independent variable. The source is now a standing line above the disclosure and the panel still
  holds the reasoning and the recommendation.
- **What holds the attribution there is split in two, because one half of it cannot see the page.**
  Five invariants hold the sentence — every arm names a source, the three lines differ, Claude
  appears only in the AI arm, the human arm names a person and no AI, and the unattributed arm
  withholds an identity without withholding that there was a source. None of them can see where the
  sentence renders: they call the function and read the string, so a refactor that moved the
  paragraph back inside the panel would keep all five green. The position is held separately, by a
  browser test that reads the line in all three arms with the panel still shut, finds no supplied
  body in the DOM at that moment, and finds no attribution at all in the round where no estimate is
  supplied. That test exists because the browser suite arrived in v0.6; before it there was nothing
  but the note in `docs/deliberate-quirks.md`, which stays, and which says why moving it back would
  be a measurement error rather than a layout preference.
- The instrument can now produce a result that counts against its own hypothesis. A sixth measure,
  estimate accuracy, scores how close the reader's final values came to what the evidence supports,
  normalised by each slider's own range — the same convention the framing-autonomy term already used,
  now a shared function rather than a repeated one. Until this, every measure recorded how someone
  worked and none recorded whether they were right, which meant reduced scrutiny of an estimate that
  happened to be correct was indistinguishable from drift, and no run could disconfirm anything. It
  is reported beside the behavioural measures and deliberately never averaged into them: how
  carefully someone worked and whether they landed on the right answer are different claims, and
  averaging them would collapse the distinction the gap measure depends on.
- Retired a published claim in the process, and it was v0.6's. The protocol screen said all five
  measures were “traces of how the work was done rather than scores of whether the answer was right,”
  and that “nothing here is compared to a correct answer, because for these cases there is not one.”
  That was an accurate description of the build and a defect in it rather than a principle, and it is
  recorded here rather than quietly overwritten. The screen now says which measures are traces, which
  one is not, and that the sixth is undefined at present.
- Accuracy is undefined in every run today, and says so on the page. None of the eighteen assumptions
  carries a supported value: the machinery shipped with all eighteen `null` and the figures left to be
  authored separately, because inventing them to complete the measure is the exact failure this
  project is about (rule 6). The bar is hatched, reads `n/a`, and carries its own caption — undefined
  because nothing has been authored, which is a different reason from framing autonomy's undefined,
  and the two no longer share one line of copy. Several of these quantities should stay `null`
  permanently; cash-transfer persistence at five years is disputed and the case's own evidence panel
  says so.
- A planted error is now a property of a case rather than of a slate, and a seventh measure reports
  what was done about them. `Slate.trapCase` and `Slate.trapSlider` are gone; `Case.trap` is nullable
  and any case may carry one. `trapVerdict()` became `trapVerdicts()` and returns one verdict per
  trapped case with the six-branch logic unchanged per case, so the debrief prints one panel per
  planted error and a reader who interrogates one and leaves another standing is told both. The
  planted-error catch rate joins the measures: caught errors over the errors the slate carries,
  undefined rather than zero in the round where nothing was supplied — framing autonomy's rule, for
  framing autonomy's reason — and undefined where a slate carries none. It is not folded into the
  behavioural composite, on both of the other exclusions' grounds at once. What did not change is the
  content: one planted error is still authored per slate, which the protocol screen now names as the
  catch rate's weakness rather than leaving it to be inferred from a number.
- The trap copy is composed rather than duplicated, which is a change to published prose. It held one
  set of six paragraphs per slate, and the two sets were the same six with one correction swapped in —
  the bednet figures written out six times and the chlorination figures six times. `SOURCES.md` had
  already recorded the cost of that in both rows: pinning either figure to a source “rewrites all six
  branches of the trap copy”. There is now one frame per branch, saying the part that is about the
  reader, and the correction comes from the case, so each figure is stated once. The wording changed
  where the two sets differed only by phrasing; the six distinctions between the branches, which are
  the reason there are six, are all still there and still separately asserted.
- The landing page and the protocol screen say seven measures, because there are seven. This is the
  second time a count of measures on the front door has had to be corrected — the first, five against
  six, is recorded under v0.6 — and it is now asserted rather than remembered: a test reads the number
  of measures the protocol screen defines and requires the heading to name it in words, and the
  existing browser test that the landing page names every measure caught the omission before a human
  did.
- The reflect payload carries a branch per planted error rather than one branch. `trapBranch` became
  `trapBranches`, a list bounded at one per case, rebuilt from the known label set like everything
  else in `sanitizeReflect`. Nothing populates it yet — no screen builds a summary — so this is a
  contract that stopped describing the mechanism rather than a behaviour that changed.
- **A primary outcome is declared, while there is still nothing to choose from.** Five bars on the
  debrief and seven measures on the protocol screen, all reported as peers, is a forking path drawn in
  the interface: whichever moved most could have been presented afterwards as the result without
  contradicting anything registered. Six predictions were already registered with the condition that
  would falsify each; what none of them said is which measure the design turns on. Evidence engagement
  is now fixed as the primary outcome, marked on its own bar, and the protocol screen states the
  comparison it belongs to — the difference in evidence engagement between conditions, within the
  AI-attributed arm, tested against the same difference in the other two arms. The rest are secondary in
  the sense that they are reported and worth reading rather than set aside, which both screens say in
  those words, because the other sense of secondary would have a reader stop at the first bar. Three
  assertions hold it: exactly one measure carries the flag, the protocol screen names the same measure
  the debrief marks, and the copy says which sense of secondary it means. A fourth holds both remainder
  counts against the arrays they count — five bars on the debrief and seven measures on the protocol
  screen, which are different sets and therefore different number words — because holding one of two
  published counts is how the other goes stale, and this is the fourth measure count in this version
  written in prose beside the list it counts.
- **The statement names an analysis no run performs, and the page says so immediately after it.** One
  reader draws one arm, nothing is stored and no two runs are compared, so a run yields the within-reader
  difference for a single arm and no between-arm contrast at all. The comparison that was just registered
  needs a cohort that does not exist. Registering it anyway is the whole of what pre-specification does —
  it cannot be chosen later — and publishing it without that limit beside it would have been the
  overclaim this project is named for. The design section's older and broader sentence stays exactly as
  it was: the within-reader comparison is the only one this build is entitled to make.
- Corrected: the reviewers table asked a methods reader about six predictions "registered with their
  falsification conditions and without an analysis plan". A primary outcome fixed in advance is an
  analysis-plan element, so leaving that row would have had the site assert and deny an analysis plan on
  two screens at once. The row now names the one element that exists and the four that still do not — no
  test per prediction, no target `n`, no stopping rule, no correction for testing six predictions at
  once. This is the second correction to that row in this version, the first for overstating the
  paperwork and this one for understating it.
- Corrected: the limits list opened its fifth item with "The measures are process traces." That blanket
  was retired earlier in this same version, in the paragraph above the measure table, and the limits
  list was not moved with it — so a claim this version had already recorded as a defect rather than a
  principle was still being published two sections further down. The item now says the narrower and more
  uncomfortable thing: the measure fixed in advance is a process trace and a weak one, chosen for being
  what P1 is about rather than for being the best of the seven, and it cannot distinguish a reflexive
  click from a careful read.
- Corrected: the comment above `MEASURES` said "The four paired measures" and there have been five since
  estimate accuracy arrived earlier in this version. It was accurate for the whole of v0.6, when there
  were four, and wrong from the commit that added the fifth bar until this one — inside a single
  unreleased version rather than across two. Nothing published was false, because a comment is not
  screen copy, which is why nothing caught it; it is also the likely source of the count in the issue
  that asked for this change, which described the debrief as drawing four bars.
- **The confidence gap is no longer reported as a quantity.** It subtracted a five-point self-report,
  rescaled to 0–100, from a mean of three unlike process measures carrying equal weights. Both halves
  are authorial choices, so the difference inherited both and declared neither, and it was the figure
  in the instrument that most looked like a measurement and least was one. The debrief now prints the
  two components side by side, each named with the scale it came from, and says on the page that they
  are not subtracted and why. The protocol screen's row stops calling the difference a calibration
  measure and states the same thing in the measure's own words. What the change does not do is retire
  the composite or reweight it: there is no basis for other weights, and picking some would be worse
  than equal weights honestly labelled, so the question waits on a pilot showing whether the three load
  together. The subtraction itself survives in one narrower place, which the row now says: `gapBand`
  reads the sign of the difference to choose which of three paragraphs the debrief prints. Direction is
  a claim this design can make and distance is not, so the sign stayed and the magnitude came off the
  screen. The count of measures does not move — the measure is still reported, and what changed is what
  it reports.
- Found while scoping the above, and worth recording because the record was the thing that was wrong:
  the issue asking for this said the magnitude was printed on screen and named `closingKey()` as the
  function that reads the gap. Neither was true. The debrief printed only a qualitative band, and
  `closingKey()` takes framing autonomy and never sees the gap; the reader of the gap is `gapBand()`,
  and it uses a threshold on the difference rather than only its sign. A plan for a correction that
  misdescribes the thing it is correcting is the same defect as a stale claim on the page, one file
  further out, and it is the second such case in this version.
- **The landing page said the review is completed once with AI assistance and once without it.** It
  is completed with and without a supplied estimate, with the attribution randomised across it, which
  is what the protocol screen's arm table and P5 are both about. The front door was asserting the
  claim the three arms exist to avoid making. Corrected, with the three arms named there.
- **The specimen readout on the landing page says its three bars are invented.** They were labelled
  “Illustrative”, which is the same word an invented cohort dashboard could have carried, on the page
  whose own method note explains why that dashboard was retracted. Rule 6 asks for the plainer
  sentence and it now carries it.
- Corrected: `README.md` said the repository was mid-rebuild with the instrument's screens not yet
  rebuilt, and that `drift-meter.html` served a placeholder. Both had stopped being true before the
  protocol and process screens landed in v0.6. It now says the rebuild has reached every screen, names
  the endpoint as built and shipped switched off, and points here. The correction travelled with the
  attribution fix and was not recorded in this file until the pass below, which is the same gap in
  miniature: the change was made and the paperwork was not.
- **The landing page's specimen readout has a row in `SOURCES.md`, and it is the last claim on the site
  to get one.** Three pairs of bars, six invented percentages, published on the front door since v0.1
  and located by no row in the table — not by the v0.6 location pass, and not by #7, which is the pass
  that gave every other constructed figure on the site a row. Both ran against the instrument, where a
  constructed figure is data in a content module; these six numbers are style attributes in a
  hand-written page, so both looked past them. The row is graded ILLUSTRATIVE and is the fifth to carry
  that grade, which moves the count the protocol screen states in prose and fails the test that holds
  the screen's count to the file's — the intended behaviour of that test, and the reason the count is
  written out rather than computed. It carries no `Primary link: TODO`: unlike the four case figures,
  these bars approximate nothing that has a source, and what would retire the row is a run, which is
  #34, with n still zero. The row was published saying the caption it rests on was held by review and
  nothing else, because `index.html` is a finished hand-written document with no content module for a
  test to read. It is held now: three cases in `invariants.test.ts` read the page itself and pin the
  word `invented` in the caption, the sentence that n is zero and nothing was collected, and this row
  at this grade — so the caption and the row cannot be removed one without the other. Stating the gap
  is what made it cheap to close; the row records that it stood open for a version.
- Corrected: `docs/deliberate-quirks.md` described four behaviours as unpinned on the grounds that the
  code which would pin them had not been rebuilt. All four had been, in v0.6. The reducer pins that
  `read` survives closing either panel and that the control round opens at midpoints; `mid()` has two
  production callers rather than none; the debrief renders the hatched `n/a` bar. The four entries now
  name the tests that hold them. The section listing what was still to come is rewritten with them: of
  the two quirks it predicted, the hatched bar landed and is written up, and the partial recolour of
  the assisted card did not arrive in that shape at all, because the accent is set once on the round
  screen and rebinds one property for everything inside it. The accuracy entry added earlier in this
  version is also refiled — it had been appended under that trailing heading, and therefore under the
  claim that it was not on the list yet, when it is live and tested; it now sits beside the composite
  it warns against being folded into. A file that exists to stop a later reader tidying something away
  is worth less for every version it spends describing a repository that has moved on, and this one had
  spent one.
- **The reviewers table asked a methods reader whether the registered analysis plan can test the
  predictions. There is no analysis plan.** What is registered is six predictions and the condition
  that would falsify each one — no test named per prediction, no target `n`, no stopping rule, and no
  correction for testing six things at once. Calling that an analysis plan overstated the paperwork to
  the one reader recruited to find exactly that kind of overstatement, and it was the shortest
  overclaim on the site. The row now says what is registered and says what is not. `CONTRIBUTING.md`
  carried the same phrase and, separately, still asked about five predictions after P6 was registered
  in v0.5; both corrected there.
- The gloss on the methods reader's note moved outside the note. The note is surviving copy used
  verbatim, and it dates the confound to v0.1 where this file dates the objection to v0.2. The
  correction was first appended inside the note's own string, marked as a gloss; it is now a separate
  field rendered beside it, because a passage marked verbatim that carries editorial text inside it is
  not verbatim, and the shortest way to say which is which is to keep them in different fields. A test
  holds the note free of the gloss's dates rather than trusting the arrangement to stay.
- **The three asks are written out rather than described.** `docs/review-briefs.md` holds each of them
  at the length it would be sent, with the known defects handed over first and the naive reader's brief
  asking its reader not to prepare, plus a draft of the public design review the process screen says is
  the cheaper substitute. There is a route in for someone offering to be one of the three, which there
  was not. None of this recruits anyone: nothing has been sent, the reviewers table still reads “Not
  recruited” and “Not assigned”, and a briefs file that made the screen look busier than the project is
  would be this project's own failure mode in its own documentation.

- **A declared licence has its text.** `REUSE.toml` has named `OFL-1.1` for the self-hosted fonts since
  they arrived, with no `LICENSES/OFL-1.1.txt` beside it — the one thing REUSE asks of a declared
  licence, missing for four versions, and enforced by nothing: there is no `reuse lint` in CI or in
  `npm run check`. The file is the generic licence rather than either font's copy of it, and the
  distinction is the whole of the care here. Both `public/fonts/LICENSE-*.txt` open with a font-specific
  copyright naming a particular `.ttf`, so serving either as the licence for the other font would be
  wrong in both directions. From their ninth line to their last the two are byte-identical to each
  other, name no font, and are the OFL text proper. That is what was copied — copied rather than
  retyped, because a licence transcribed by hand is a licence with a typo in it — and the one-line
  `diff` that re-derives it is written beside the declaration.
- **`REUSE.toml` explained at length how this repository licenses two kinds of thing, and had stopped
  describing the repository.** `Apache-2.0` was named with no text in `LICENSES/`, so the file asserted
  terms the repository did not carry — the same defect as the OFL gap above, found in the same reading,
  and left standing when that one was closed. Six tracked files matched no annotation at all:
  `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/`, `drift-meter.html` and `wrangler.toml`, plus
  the config files. One of the six is a `docs/` page added in this same version by someone who had read
  `REUSE.toml` and still missed that `docs/` was not in it. The prose documentation now has its own
  block at CC BY 4.0, listed separately from the artifact rather than folded into it, because notes
  about the work and the work are different standings at the same terms. The missing text is copied from
  the copy this repository already shipped — the root `LICENSE` — rather than retyped, because a licence
  transcribed by hand is a licence with a typo in it.
- Found by reading, and closed in the same version: nothing checked that a licence this repository
  declares has its text on disk, which is how the gap above survived four versions.
  `scripts/check-licensing.mjs` now asserts that every tracked file is covered by an annotation, that
  every licence named in one has its text in `LICENSES/`, and that every text in `LICENSES/` is named by
  an annotation. It runs in `npm run check` and on every push, and it states in its own header what it
  does not check — which of two overlapping annotation blocks wins, which is REUSE's question and not a
  script's. What the line recording this as found and not fixed had recorded is worth keeping: the gap
  was found by reading rather than by a check, which is the fact that made the check worth writing.

- **The version is closed, dated and tagged, and the artifact is citable by version for the first
  time.** `v0.7.0` is the repository's first git tag; nothing was tagged before, so a reader could point
  only at a URL that serves whatever is current. `CITATION.cff` is added, which GitHub and Zenodo both
  read, and `.zenodo.json` sets the metadata an archive would use. Closing the version is what makes the
  tag mean something: the changelog heading carries a date, and the process screen's changelog mirror
  carries the same date, which it did not before.
- **The mirror's dates are now held against the file, because dating one and not the other passed every
  check.** The only test over the process screen's changelog table compared version strings and their
  order and never looked at the date. So the file could say `## v0.7 — 10 Aug 2026` while the published
  screen said the version was in progress, and the suite would stay green — a screen calling a release
  unfinished inside the release itself. The test now reads the date out of the heading and requires the
  mirror to match it, per version, with the file as the record and the screen as the mirror rather than
  both compared to a third constant.
- The caveat that said there is no citable identifier now says there is no _archived_ one, which is a
  smaller claim and the true one. A dated, tagged version is something to cite; a DOI is not minted, and
  minting one needs an archive outside this repository. `CITATION.cff` carries no `doi:` field for the
  same reason, and says in its own comment that adding one before an archive exists would be the kind of
  unearned claim this project is about. Both change again when the DOI exists, in their own commit.
- The process screen's summary of this version had stopped describing it. The mirror still said a sixth
  measure had been added, before the catch rate made seven; it did not mention that the confidence gap
  stopped being reported as a quantity, or that a primary outcome had been declared. A mirror is only
  worth having if it is re-read when the thing it mirrors changes, and closing a version is the last
  point at which that is cheap.

**Why**

The attribution fix is the one correction here that changes what the instrument would measure rather
than what it says. Everything else in this version is the site catching up with the artifact. That one
was the artifact disagreeing with itself: the design's whole claim to be about AI rather than about
handed answers rests on the three arms, and a third of the readers most relevant to that claim were
never in an arm at all. It was found in a review pass, not by a test, which is the same way the
÷6-versus-÷9 bug was found — and the tests added with it exist so that the next person to tidy the
panel has to argue with the measurement rather than only with the markup.

The accuracy measure is another change that is about the design rather than about the paperwork, and
it is the one that lets the design lose. Every measure before it recorded how a reader worked and none
recorded whether they were right, so a reader who delegated and happened to be correct was
indistinguishable from a reader who drifted. An instrument whose every outcome is consistent with its
own hypothesis is not an instrument. It ships undefined, because the values it would score against
have not been authored and inventing them is the failure this project is named for.

Moving the planted error onto the case is not a refactor and it does not, by itself, fix anything. The
catch rate is the only measure here with a right answer behind it, and two of the six registered
predictions rest on it. It was one observation per reader, which is a coin flip rather than a rate, and
the slate-level field meant a second planted error had nowhere to live — the limitation was in the type
rather than in the authoring. It is now in the authoring, which is the correct place for it and is also
a weaker claim than the change might look like from the diff: nothing a reader sees is different, one
planted error is still all the content carries, and the protocol screen says so in the measure's own
row and in the list of what this build cannot do. What the change buys is that authoring the second one
is a content change with a source row, rather than a code change first.

The catch rate is computed and deliberately not drawn as a bar, which is the one place the debrief now
reports less than the instrument knows. With one planted error the measure takes two values, 0 and 100,
and a bar is a shape that reads as a rate; either end of it off a single observation would look like a
finding. The debrief prints a paragraph per planted error instead, which says what was actually done
and claims nothing more. The omission is stated in the measure's row rather than left as an absence,
because a measure computed and not shown is exactly the kind of thing this project has no business
keeping quiet.

Composing the trap copy rewrites prose already published, which was worth being reluctant about. The
repository's convention is that the content modules are the prose rather than a rendering of it, and
`method.ts` writes its formulas out in full for that reason. The distinction that decided it: a formula
is a sentence a reader checks against a constant by eye, and interpolating one would make the test that
guards it vacuous, whereas the trap correction is checked against nothing — it is a fact stated twelve
times, which is the shape that goes out of date. Six copies of a figure per slate is how the
÷6-versus-÷9 bug would have arrived in prose, and it would have arrived slower and been harder to see.

Closing the version is the change with the least code in it and the most consequence for anyone who
wants to refer to this. The changelog already recorded a retraction — an invented cohort dashboard,
published and then removed — which is precisely the case where an unversioned citation is worthless: the
URL serves whatever is current, so "the Drift Meter" could mean the build that shipped the dashboard or
the build that took it out. A tag and a dated entry make those two different things to point at. The DOI
is the part that is not done, and it is not done because it cannot be done from inside the repository;
what is inside the repository is the metadata an archive will read, and a caveat that now claims exactly
as much as is true.

Declaring a primary outcome is the cheapest change in this version and the one with the shortest window
in which it is worth anything. With n at zero there is no result to prefer, so naming the measure costs
nothing and forecloses the move it exists to foreclose; after collection starts, the same sentence is
unfalsifiable as a claim about when it was written. What it does not do is improve the measure. Evidence
engagement is a binary, sticky flag that cannot tell a habitual click from a careful read, and fixing it
in advance makes that the stated weakness of the primary outcome rather than of one measure among peers —
which is a worse-sounding sentence and a more accurate one. It was chosen for being the measure P1 is
about, not for being the best of the seven, and the limits list now says so in those words.

The uncomfortable part is what the statement describes. It names a between-arm contrast and this build
computes nothing of the kind: one reader, one arm, nothing stored, no two runs ever compared. A
pre-specified analysis that the instrument cannot run is still worth registering — that is what
registration is for — but a page that published it without saying so would be doing the thing this
project was built to argue against, in the section where it explains its own method. So the limit is
stated on the page, immediately after the statement, and the older and broader sentence in the design
section is left exactly as it was.

The paperwork pass at the end of this version was asked for as bookkeeping and turned up a claim
nobody had tracked. Most of what it went looking for had already been paid, by the commits that made
the changes rather than by a pass afterwards, which is the right way round. What it found instead is
that every location pass this table has had was pointed at the instrument, and the site's front door
publishes six invented numbers that none of them saw. That is not a lapse in any one pass; it is what a
pass is, and the fix is to say where this one stopped rather than to imply the file is now complete.
The same shape accounts for the quirks file: four of its entries described a repository that had been
rebuilt underneath them, all four understating the guarantees rather than overstating them, which is
the safer direction to be wrong in and still wrong.

This is a version of its own rather than more of v0.6 because v0.6 is the rebuild, and these changes
are what happened once the rebuild was complete. The boundary is not cosmetic: the attribution fix
changes what a run would measure, so runs before and after it are not comparable to each other, and
that is exactly the kind of line a version number exists to draw. The protocol and process screens
stay in v0.6, where the rebuild that produced them is recorded, even though the paperwork for them was
paid here.

## v0.6 — 10 Aug 2026 — Rebuilt from source, and a model re-baseline

**What changed**

- The instrument is being rebuilt from source, in this repository, and it runs again. v0.1 through
  v0.5 shipped it as a single generated file with no editable source on disk, no tests, no types, no
  linting and no continuous integration; the last of them weighed 894 KB. Rebuilt and under test so
  far: the case data, the cost model, the derived measures, and all thirteen of the instrument's
  screens — the intro, the consent step, both rounds with their confidence gates, the debrief, the
  transfer check, Round 3, the four design rules, the protocol and publication-process screens, and
  the encoded-rules screen. Nothing renders a stub any longer, and the axe exemption the stub needed
  was deleted rather than left standing. The endpoint exists too, and is dark by default: the key
  lives in its own environment and `VITE_REFLECT_ENDPOINT` is empty in the committed `.env`, so every
  clone is off and cannot spend the author's credit. The remaining steps are tracked in the open
  rather than described as finished.
- Corrected four claims this build made about itself, all of them overtaken by work in this same
  version. The landing page named five measures and there are six; the process screen said twelve of
  the thirteen screens render and all thirteen do; `SOURCES.md` said ten of the thirteen; and this
  entry itself said the endpoint and the live-Claude screen were not rebuilt, which stopped being
  true when they were. The landing page now also says the sixth measure reports as undefined, because
  naming a measure on the front door without saying it has no values yet is the overclaim this
  project exists to argue against. Recorded rather than quietly fixed: a version whose own changelog
  described the version before it is exactly the failure this file is meant to catch, and it went
  three merges without being caught by anything but a hand count. One of the four, the landing page's
  measure count, turns on the sixth measure, which is recorded under v0.7; the other three are this
  version's own state.
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
- The protocol and the publication-process screens are back. Twelve of the thirteen screens now
  render; only the live-Claude screen is outstanding, and it arrives with the endpoint. The protocol
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

Nine of the bullets above are corrections, and between them they correct twelve claims. Eleven are
claims this project made about its own work: a contrast ratio; four claims about its own tests, three
of which described tests that did not exist; a claim about where a word appears in the repository; a
source row that reported three files as missing when all three existed; and four claims about how much
of itself was built, caught in one pass by a hand count. The twelfth is a scale qualifier on a
published figure, which the source table already existed to prevent. That they survived until someone
checked the paperwork against the code is the uncomfortable part.

This tally has now been wrong twice, both times in the same direction. It read seven and six, which was
right when it was written, and neither the endpoint pass nor the self-claims pass came back to it after
each added a correction. A count of this project's own corrections went stale twice inside one version.
That is the failure this file exists to catch, turned on the file itself, and it is recorded here for
the same reason everything else in this paragraph is. That they survived until
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
