## What changed and why

<!--
Merges use a merge commit, so this PR's title becomes the permanent history.
Write it as a changelog line: imperative, specific, no ticket numbers.
-->

## Paperwork

These are the rules in CLAUDE.md at the point where they matter. Tick what applies; strike out what
does not.

- [ ] Touches an external claim, a figure, or a source → `SOURCES.md` updated **in this PR**
- [ ] Changes what the site asserts, or removes something published → `CHANGELOG.md` entry with
      **What changed** and **Why**
- [ ] Touches a derived measure → a test covers it, and no denominator is a literal
- [ ] Changes the pinned model → recorded as a **re-baseline**, not maintenance, and the changelog
      says results are no longer comparable to earlier runs
- [ ] No invented numbers. Anything illustrative says so on the page
- [ ] Any added prose matches the voice: plain, unhurried, understated, no exclamation points

## Checks

- [ ] `npm run typecheck && npm run lint && npm test && npm run build` passes locally
- [ ] No secret, and nothing derived from one, reaches a `VITE_*` variable or the client bundle
- [ ] Actions referenced by full commit SHA, not a tag
