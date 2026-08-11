# The Drift Meter — the three reader briefs

The publication-process screen names three readers and says none of them has been asked. This file is
the ask, written at the length it would be sent, so that recruiting one of them is a matter of sending
a message rather than of composing one first.

**Nobody has been sent any of these.** The file is the ask and not evidence of it. What says who has
read a version is the reviewers table on the publication-process screen, and it still reads “Not
recruited” and “Not assigned”. If a brief below is sent and answered, the status moves there, in the
same pass as the changelog entry recording what the reader said.

Each reader is asked for exactly one thing. That is deliberate. An open-ended request to look at
someone's research prototype is a request for an unbounded amount of work, and the usual answer to it
is a polite yes followed by nothing. One question is answerable in a sitting, and a reader who agrees
to it knows what they agreed to.

Three things hold across all three briefs, and each brief says them rather than assuming them:

- **What is already known to be wrong is handed over first.** A reader who spends their pass finding
  something the author has already published is a reader who has been wasted. Section 6 of the
  protocol screen, `What this build cannot do`, lists nine of those. `What to distrust here` on the
  publication-process screen lists five more. Both are on the site before either reader arrives.
- **Reviewers are named once they have read a version**, because a name is someone who can be asked
  what they actually said. A reader who would rather not be named is recorded as having read it
  without one; the reading is the record, not the credit.
- **What comes back is logged whether or not it is flattering.** That is the standing rule in
  `CHANGELOG.md`, and the correction that produced v0.3 is the reason the rule exists. A reader is not
  being asked for a review that will be filed politely.

The route in is [an issue](https://github.com/vigilia-mz/drift-meter/issues/new/choose) — the
**Offer to read it** form, which asks which of the three and nothing much else. Anyone who would
rather not file in public can message the author through
[github.com/vigilia-mz](https://github.com/vigilia-mz), which is the profile the masthead's Contact row
means and the README now links. The wording below is written to be pasted into a message; the bracketed
parts are the only ones that change.

---

## 1. The methods reader

Sent to someone who designs experiments for a living. This is the one the screen calls the real gap:
the project's network is philosophy-heavy, which is the right network for the conceptual argument and
the wrong one for experimental design. The confound that produced v0.3 is exactly what this reader
exists to catch, and it was caught by an outside reader instead of by the process.

**The ask, in one sentence.** Whether the design can test the six predictions it registers — asked
now, while `n` is zero, because after collection starts the answer is worth much less.

> I have built a prototype instrument and registered six predictions with the conditions that would
> falsify each one. No data has been collected from anyone. I would like one pass from someone who
> designs experiments, on one question: can this design test these predictions, or can it not?
>
> The design, in short. One reader meets three charity cost-effectiveness cases with an estimate
> already worked out for them, and three with nothing filled in. Order is counterbalanced. Which of
> the two case slates carries the supplied estimate is drawn independently of the order. The supplied
> estimate is attributed, at random, to Claude, to a senior programme officer, or to an unnamed prior
> reviewer — the figure, the reasoning and the recommendation are identical in all three, and only the
> authority attached to them changes. One case per slate carries a planted error: a figure that is not
> what its label says it is. A transfer case afterwards asks about the same pattern in a case the
> reader has not seen. Seven measures come out of a run. Four are traces of how the work was done, one
> of which is the primary outcome; a fifth is the signed difference between two of the others; the last
> two ask whether the answer was right — an accuracy score that is undefined at present, and a
> planted-error catch rate that is one observation per reader. The whole thing takes about three
> minutes.
>
> Both of those are on the protocol screen, which is inside the prototype and has no URL of its own:
> open https://vigilia-mz.github.io/drift-meter/drift-meter.html and press “Read the method first”
> rather than “Begin”. The six predictions and their falsification conditions are section 4; the
> measures, each with its formula and the objection to it, are section 3.
>
> That URL serves whatever version is current. The one I am asking about is v0.7.0, archived at
> https://doi.org/10.5281/zenodo.21887595, so that your objection stays attached to what you read.
>
> Four things I already think are wrong, so that you do not spend the pass finding them:
>
> 1. The two rounds do not start from the same place. The control round's sliders open at an arbitrary
>    midpoint and the assisted round's open at a supplied figure, so moving a slider is a smaller act in
>    one round than in the other, and the bias runs in the same direction as P2. The screen calls this
>    the largest single threat on it, and I do not know whether it is repairable by measurement or only
>    by redesign.
> 2. Within a single reader, the condition and the cases move together: the assisted round runs one
>    slate and the control round the other. Drawing the slate independently balances that across readers
>    and does not remove it from one.
> 3. Readers arrive from an essay that states the expected result, which puts a demand characteristic
>    directly upstream of the measurement.
> 4. What is registered is six predictions with falsification conditions and one element of an analysis
>    plan — a primary outcome, fixed before any data exists. There is no test named per prediction, no
>    target `n`, no stopping rule and no correction for testing six at once, and the primary outcome as
>    stated describes a between-arm comparison this build cannot perform.
>
> Whatever form is cheapest for you is the right form: an issue on the repository, a reply to this, or
> four lines. If you tell me a prediction cannot be tested, it comes off the screen and the changelog
> says who said so.
>
> What I am not asking for: a fix, an endorsement, or a second author. One pass, and the version of
> your answer that is least comfortable for me.

**Not to be sent with this.** A request to review the argument, the prose, or the code. Three asks in
one message is the open-ended request this brief exists to avoid.

---

## 2. The editor

Sent to someone who edits prose for a living, or edits it well. The subject makes this the place the
risk concentrates: an essay arguing that fluent answers are accepted too easily is itself a fluent
answer, and the author cannot read it as one.

**The ask, in one sentence.** Where the writing claims more than it has.

> I have written three pages arguing that AI assistance can quietly erode the judgment it assists. I
> would like one pass from an editor on one question: where does the prose claim more than it has?
>
> https://vigilia-mz.github.io/drift-meter/ — the landing page, then “The Atrophy of Judgment”, which
> is the long one at roughly three thousand words, then “Evaluating the Evaluator”, which is short.
>
> The failure mode I suspect and cannot see. The writing states its own limits constantly. I think it
> does that often enough that the limits have started to work as a kind of authority — a page that
> keeps saying what it cannot prove reads as more trustworthy than one that does not, and it has not
> earned anything by saying so. If that is what is happening, it is the exact move the argument warns
> about, performed by the argument. I would rather be told.
>
> Three places to start, though the useful answer may be somewhere else:
>
> - The empirical section of the long essay states three findings — about students, endoscopists and
>   developers — with a population and a direction, and cites none of them. I know these are the worst
>   sentences on the site and they are graded as such in `SOURCES.md`. What I want from you is the
>   weaker sentence that would be defensible, if there is one, rather than agreement that they are
>   weak.
> - Whether “it is a trace, not a finding” is doing work by the fourth time it appears, or providing
>   cover.
> - Whether the opening earns the reader's attention or spends the argument's credibility to get it.
>
> What is most useful back: the sentence, and either the weaker sentence you would put in its place or
> the reason there is not one. A list of sentences with nothing proposed is still useful; a general
> verdict on the tone is not.
>
> What I am not asking for: a copyedit, house style, or the typography. The pages are hand-written and
> the line breaks are deliberate. If you also find a typo I will take it, but that is not the ask.

**Not to be sent with this.** The protocol screen. An editor pointed at the methods material will
review the methods, which is a different reader's job and a different message.

---

## 3. The naive reader

Sent to someone with no stake in any of it: no research background required, no interest in AI
required, and — this is the part that matters — no prior reading of the essays.

**The ask, in one sentence.** Where they stopped understanding it, and at which sentence.

The screen calls this the reader hardest to find and the one worth the most, for a reason worth
repeating here: the instrument recruits from an essay that states its expected result, so the reader
who arrives has usually already been told what to think, which makes them the reader least likely to
be confused by it. A reader who arrives cold is the only one who can find where the thing is
incomprehensible. That is why the brief below asks someone not to prepare.

> Would you look at something for me for about five minutes, without reading up on it first?
>
> https://vigilia-mz.github.io/drift-meter/ — read the front page, then follow “Launch the Drift Meter”
> and use it. It takes about three minutes. Then stop. Please do not read the two essays first, and when
> the prototype offers you “Read the method first”, do not take it; both of those would tell you what
> you are supposed to conclude, and then you would be no use to me.
>
> One question: where did you stop understanding it, and at which sentence?
>
> That is the whole ask. Not whether you liked it, not whether you agree with it, and not whether it
> is any good. If you got two paragraphs in and lost the thread, two paragraphs is the answer and it
> is a more useful answer than finishing would have been. If a screen asked you to do something and
> you could not tell what, that is the answer. If you guessed what a word meant, tell me what you
> guessed.
>
> Half-read is the most useful version of this. Please do not push through to be polite.

**Not to be sent with this.** Any description of what the project is about. The brief works only if
the message does not supply the frame the reading is supposed to test.

---

## 4. The public design review

The publication-process screen says a public design review would substitute for the methods reader
imperfectly, and would timestamp the predictions at the same time — two obligations discharged by one
post, and the cheaper path. It is the substitute rather than the thing: it does not discharge the
obligation above so much as make its absence cheaper.

It is also the one item here with a deadline attached, and the deadline is not a date. It has to go
out before any data exists, because a design review after collection is a review of an analysis that
can be reverse-engineered from what came back.

Where to post it is the author's call and this file does not make it. What the post has to contain is
below, and the draft is written to be posted as it stands.

> **A prototype with six registered predictions, no data, and no methods reader. Please attack it.**
>
> I have built an instrument that tries to measure whether a supplied estimate reduces the scrutiny a
> reader gives the evidence underneath it, and whether attributing that estimate to an AI reduces it
> further than attributing it to a person. Six predictions are registered with the condition that
> would falsify each one. `n` is zero: nothing has been collected from anyone, and nothing on the site
> is a finding.
>
> The design is within-reader. One reader meets three charity cost-effectiveness cases with an
> estimate already worked out and three with nothing filled in; the order is counterbalanced, and
> which slate carries the estimate is drawn independently of the order. The supplied estimate is
> attributed at random to Claude, to a senior programme officer, or to an unnamed prior reviewer, with
> the figure, the reasoning and the recommendation identical in all three. One case per slate carries
> a planted error. A transfer case afterwards asks whether the reader generalised the pattern.
>
> https://vigilia-mz.github.io/drift-meter/drift-meter.html, then “Read the method first” rather than
> “Begin” — the protocol screen is inside the prototype and has no URL of its own. The predictions and
> their falsifiers are section 4; the seven measures, each with its formula and the objection to it,
> are section 3, and one of them is named as the primary outcome. Section 6 is
> the nine things this build cannot do, written before anyone asked.
>
> The version this post is about is v0.7.0, archived at https://doi.org/10.5281/zenodo.21887595. The
> site serves whatever is current, so if you attack something and I change it, that DOI is what your
> objection was against.
>
> I am not a methodologist and this design has been reviewed by nobody. The last time that was true, a
> reader pointed out that the previous version could not distinguish AI degrading judgment from handed
> answers degrading judgment, and that three things varied at once between the rounds. Both were fatal
> and neither was hard to fix, which was the uncomfortable part. I would rather have that conversation
> now than after collection.
>
> The two objections I already hold: the two rounds do not start from the same place, which biases the
> revision measure in the direction the prediction expects; and within one reader the condition and
> the cases move together. Objections beyond those two are what I am asking for.
>
> Wherever is easiest: a reply here, or the repository at
> https://github.com/vigilia-mz/drift-meter, where **Challenge a claim** is a form that asks which
> claim and why. Whatever comes back is answered in the changelog under the name of whoever said it.
>
> This post is also a timestamp, and a weak one. The predictions are registered in a git repository,
> and v0.7.0 is deposited with a DOI and a date, which is better than commit history and still not a
> preregistration on a registry that would not let me alter it. Said here rather than left to be
> assumed.

**What posting it commits to.** Two things, and they should be true before it goes out. The
predictions have to be final at that moment, because the point of the post is the date. And a reply
that kills one has to be answerable in the changelog under its author's name, which is the same
standard the three briefs above set and is the reason this is a substitute for a methods reader rather
than a way around one.

---

## What this file does not do

It does not recruit anyone. Sending these is an action outside the repository, and until one is sent
and answered, the reviewers table is correct as it stands and the caveat that the design has been
“reviewed by nobody” stays on the page. A briefs file that made the screen look busier than the
project is would be the failure this project is about, performed in its own documentation.
