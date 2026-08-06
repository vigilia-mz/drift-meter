# Security

## Reporting

Use [GitHub's private vulnerability reporting](../../security/advisories/new) for anything that could
be exploited. If that is unavailable to you, open a public issue saying only that you have a security
report and would like a private channel — no details.

**Please do not describe endpoint abuse vectors in a public issue.** The endpoint spends real money;
a working recipe posted publicly is a bill rather than a bug report.

I am one person and this is not a staffed product. Expect an acknowledgement in days, not hours.

## Threat model, stated plainly

This repository operates one public endpoint that calls a paid API on the author's account. Being
specific about what is and is not at risk seems more useful than a generic policy.

**What an attacker can take:** Anthropic API credit, up to a limit the author sets in the console.
That is the whole of it.

**What they cannot take:** there is no database, no user accounts, no session storage, no analytics,
and nothing written to disk server-side. Readers' runs are held in one browser tab and discarded when
it closes. Nothing about a reader leaves the browser unless they press a button that says it will, and
that button sends about twenty derived integers — no name, no email, no free text.

**Where the key lives:** in the endpoint host's environment, read server-side. It is never in an HTML
file, never in the client bundle, and never in a `VITE_*` variable — those are compiled into the
client and are public by construction. The endpoint's URL is public and is meant to be; its key is not
and never appears in this repository.

## What is deliberately load-bearing

If you are reviewing the endpoint, these are the controls that matter, so that a change which quietly
removes one is recognisable as a regression:

- **The client sends a question index, never text.** The set of questions the endpoint will answer is
  fixed in source. This is what keeps it from being an open proxy to the key.
- **The reflect payload is rebuilt from a known key list**, coercing every value to a bounded integer
  or a fixed label. Nothing a caller sends reaches a prompt as free text.
- **`repair` mode is the one channel that accepts prose, and it is signed.** It takes back an answer
  the endpoint itself produced, so `teach` returns an HMAC of that answer and `repair` verifies it in
  constant time before spending a call.
- **`ALLOWED_ORIGINS` holds only domains the author controls.** A previous version allowlisted a
  GitHub username the author no longer held — anyone could have re-registered it and pointed it here.
  Treat a released or unowned domain in that list as a vulnerability.
- **A bounded request body and per-visitor and per-day call budgets.**

## What is honestly weak

Stating this rather than implying otherwise, since the project's whole argument is about unearned
confidence:

- **The in-process rate limiters are best-effort, not guarantees.** Serverless instances are
  short-lived and run in parallel, so the counters reset and do not coordinate. They are a deterrent.
- **The origin allowlist stops a browser on another site. It does not stop a forged header.** It is
  not a cost control and should not be counted as one.
- **The real guarantees live outside this repository**: a spend limit on the Anthropic console, and
  per-workspace rate limits on the key the endpoint uses. Durable per-visitor budgets are tracked as
  an open issue.

This is an adequate posture for a research prototype with a stated spend cap. It is not a production
posture, and the site says so.
