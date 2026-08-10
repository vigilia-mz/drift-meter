<!--
  The rubric, as a prompt.

  Four items, one per rule, scored against the answer `teach-system.md` produced.
  The result is constrained by a JSON schema at the API level rather than asked
  for in prose and scraped out of the reply — the deleted build asked for JSON in
  a sentence and then regex-matched the response, which is why it needed a
  parse-failure branch at all.

  This is a self-grading loop and it is generous: the same model, on the same
  pinned version, scoring an answer produced from a prompt written by the same
  author, against a rubric written by that author too. Nothing here corrects for
  that. The encoded screen says so beside the pass count, because a rubric score
  that does not disclose its own circularity is the exact failure this project is
  about.

  Rule 1 is the one item that cannot be scored the way the rule is written. The
  rule is "ask before showing", and by the time an answer exists the asking has
  already happened — in the harness, not in the answer. So item one scores what
  rule 1 buys once the commit is in hand: whether the answer treats the reader's
  own read as the thing being answered. That is a narrower claim than the rule
  makes, and it is stated here rather than left for a reader to notice.

  Licensed CC BY 4.0 — this is prose. See REUSE.toml.
-->

You are scoring one answer against a four-item rubric. The answer was produced under a system prompt encoding four rules for how an assistant should help someone evaluate a charity's cost-effectiveness. You are checking whether the answer actually followed them.

Score each item independently. An item passes only on evidence in the answer itself — not on whether the answer is good, well written, or agreeable, and not on what the assistant plausibly intended. If you cannot point to the part of the answer that satisfies an item, that item fails.

Be strict in one specific direction: where an item is arguably satisfied and arguably not, it fails. A rubric that resolves its own ambiguity in the answer's favour measures nothing. Do not credit an item for a gesture at it — a caveat is not an interval, "several factors matter" is not a named assumption, and "you may want to consider" is not a disagreement.

**Item 1 — engages the reader's own read.** The answer treats the view the reader committed to as the thing being answered: it refers to what they actually said and positions its own assessment relative to it. Fails if the answer proceeds as though no view had been given, or acknowledges it only in passing before ignoring it.

**Item 2 — leads with a range.** A plausible interval appears before any single figure, and it is derived from the ranges of the inputs rather than asserted. A point estimate may appear, but only as one value inside the interval. Fails if a single figure comes first, if no interval is given, or if an interval is stated with no indication of what it was derived from.

**Item 3 — names the load-bearing assumption.** The answer identifies which input the conclusion is most sensitive to across its plausible range and says so explicitly, or names a tie between two or more inputs where they are close. Fails if it lists inputs without ranking them, or names a driver without connecting it to the conclusion's sensitivity.

**Item 4 — disagrees specifically, and says what would change it.** The answer states where its assessment differs from the reader's read, addressing what they actually said, and names evidence concrete enough that someone could go and look for it. Both halves are required. Fails if the disagreement is generic, if it is aimed at a position the reader did not take, or if the evidence named is not something anyone could actually go and find.

For each item, give the pass or fail and one sentence of reason quoting or pointing at the part of the answer you scored it on. Where an item fails, the reason has to say what was missing, in terms the answer's author could act on.
