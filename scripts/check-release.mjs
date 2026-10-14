#!/usr/bin/env node
/**
 * Release check: a tagged version is a closed version.
 *
 * WHY THIS EXISTS. The v0.8.0 deposit is a permanent archive whose changelog opens
 * `## v0.8 — In progress`, because the tag was cut from a tree whose heading had not
 * been closed. The closing step was known and written down, and nothing enforced it.
 * The v0.9 entry in `CHANGELOG.md` named the check that would have caught it and said
 * it did not exist yet. This is that check.
 *
 * WHAT IT ASSERTS. The top `## ` heading of `CHANGELOG.md` is the newest version, and
 * it takes one of two forms: `## v0.11 — In progress — Title` while the version is
 * open, and `## v0.11 — 14 Dec 2026 — Title` once it is closed. Then, by mode:
 *
 *   --tag=v0.11.0  On a tag push, from `.github/workflows/release.yml`. The tagged
 *                  tree's top heading must be closed, and must name the tag's series.
 *   (no flag)      In `npm run check` and in CI. No tag may exist for a version the
 *                  file still calls in progress, and none for a version newer than the
 *                  top heading, which would be a release with no entry at all.
 *
 * WHAT IT CANNOT DO, and the limit is the point of saying so. Zenodo archives a release
 * when the release is published, whatever any job says. A tag pushed on its own first,
 * as v0.7.0 and v0.8.0 were, runs the tag job before there is a release, and a red job
 * there is a reason not to publish one. A tag made by publishing the release on GitHub,
 * as v0.9.0 and v0.10.0 were, is archived by the same click that starts the job, so
 * nothing here can stop that deposit. What the check changes is that the mistake turns
 * the tag red when it happens, and fails every later pull request and every local
 * `npm run check` until the heading is closed, rather than waiting for a reader to find
 * it. The step that prevents it is still the order CLAUDE.md gives: close the version
 * in its own pull request, merge, and only then tag.
 *
 * It does not check the date against anything. `scripts/sync-doi.mjs` does that after
 * the deposit, against the publication date Zenodo records, which is the date a
 * citation carries.
 *
 * The rule without a flag needs the tags, and a default CI checkout has none. Rather
 * than pass quietly on a checkout that cannot see them, it fails and says how to fetch
 * them; the check job in `.github/workflows/ci.yml` fetches full history for this.
 *
 *   node scripts/check-release.mjs               # the rule against every local tag
 *   node scripts/check-release.mjs --tag=v0.11.0  # the rule for one tag being pushed
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fail(message) {
  console.error(`check-release: ${message}`);
  process.exit(1);
}

/** `v0.10.0` to `{ name, major: 0, minor: 10, patch: 0 }`, or null for anything else. */
function parseTag(name) {
  const m = /^v(\d+)\.(\d+)\.(\d+)$/.exec(name);
  if (m === null) return null;
  return { name, major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

/** Negative, zero or positive, as a sort comparator would: series only, not patch. */
function compareSeries(a, b) {
  return a.major - b.major || a.minor - b.minor;
}

/**
 * Whether `14 Dec 2026` names a day that exists. A heading reading `31 Sep 2026` is
 * dated in form and not in fact, and would sail past a pattern.
 */
function isRealDate(text) {
  // No leading zero: the changelog writes `5 Oct`, and so does the date sync-doi derives.
  const m = /^([1-9]\d?) ([A-Z][a-z]{2}) (\d{4})$/.exec(text);
  if (m === null) return false;
  const month = MONTHS.indexOf(m[2]);
  if (month < 0) return false;
  const day = new Date(Date.UTC(Number(m[3]), month, Number(m[1])));
  return day.getUTCDate() === Number(m[1]) && day.getUTCMonth() === month;
}

/** The top heading of the changelog, which is the only one this check is about. */
function topHeading() {
  const line = /^## .*$/m.exec(readFileSync('CHANGELOG.md', 'utf8'))?.[0];
  if (line === undefined) fail('CHANGELOG.md has no `## ` heading.');
  const m = /^## v(\d+)\.(\d+) — (.+?) — (.+)$/.exec(line);
  if (m === null) fail(`the top heading does not read \`## vX.Y — date — title\`: ${line}`);
  const open = /^in progress$/i.test(m[3]);
  if (!open && !isRealDate(m[3])) {
    fail(`the top heading is dated “${m[3]}”, which is neither a day nor “In progress”.`);
  }
  return {
    series: `v${m[1]}.${m[2]}`,
    major: Number(m[1]),
    minor: Number(m[2]),
    open,
    date: m[3],
  };
}

const top = topHeading();
const tagFlag = process.argv.find((a) => a.startsWith('--tag='))?.slice('--tag='.length);

if (tagFlag !== undefined) {
  const tag = parseTag(tagFlag);
  if (tag === null) fail(`“${tagFlag}” is not a release tag of the form v0.0.0.`);
  if (compareSeries(tag, top) !== 0) {
    fail(
      `the tag is ${tag.name} and the top entry in CHANGELOG.md is ${top.series}. ` +
        'The tagged tree does not open with the version it releases.',
    );
  }
  if (top.open) {
    fail(
      `${tag.name} was cut from a tree whose changelog still calls ${top.series} in progress, ` +
        'and the deposit made from it will say so permanently. Close the heading on main and ' +
        'record in the next entry that the archive is unfinished, as the v0.9 entry did for v0.8.0.',
    );
  }
  console.log(
    `check-release: ${tag.name} is cut from a tree that closes ${top.series} on ${top.date}.`,
  );
} else {
  let listed;
  try {
    listed = execFileSync('git', ['tag', '--list'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    fail(`could not list the tags — ${error instanceof Error ? error.message : String(error)}`);
  }
  const tags = listed
    .split('\n')
    .map((name) => parseTag(name.trim()))
    .filter((tag) => tag !== null)
    .sort((a, b) => compareSeries(b, a) || b.patch - a.patch);
  if (tags.length === 0) {
    fail(
      'this checkout has no release tags, so the rule that reads them cannot run. ' +
        'Fetch them with `git fetch --tags`; in CI, check out with `fetch-depth: 0`.',
    );
  }

  const names = (list) => list.map((t) => t.name).join(', ');
  const inSeries = tags.filter((t) => compareSeries(t, top) === 0);
  if (top.open && inSeries.length > 0) {
    fail(
      `${names(inSeries)} is tagged, and CHANGELOG.md still calls ${top.series} in progress. ` +
        'Close the heading. An archive made from that tag already calls itself unfinished, and ' +
        'only main can be corrected.',
    );
  }
  const ahead = tags.filter((t) => compareSeries(t, top) > 0);
  if (ahead.length > 0) {
    fail(
      `${names(ahead)} is tagged, and the top entry in CHANGELOG.md is ${top.series}. ` +
        'A tagged version has no entry.',
    );
  }
  console.log(
    `check-release: ${top.series} is ${top.open ? 'open and untagged' : `closed on ${top.date}`}; ` +
      `the newest tag is ${tags[0]?.name ?? 'none'}.`,
  );
}
