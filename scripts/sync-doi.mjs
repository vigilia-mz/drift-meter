#!/usr/bin/env node
/**
 * Reads the DOI Zenodo minted for this release, and writes it into every document
 * that names one.
 *
 * WHY THIS IS A SCRIPT AND NOT A CHECKLIST. The version-and-DOI pairing is one
 * two-value fact stated in nine places, and until this script existed the only thing
 * joining the fact to the places was a person copying a string. The invariant in
 * `src/content/invariants.test.ts` catches a mismatch, which is worth having and is
 * the wrong end of the problem: it fails *after* the transcription, and a release is
 * exactly the moment someone is copying a number they have never typed before.
 * Reading the DOI out of the record that minted it removes the transcription rather
 * than checking it — the same move as `build-protocol.mjs` reading the footer out of
 * `CITATION.cff` instead of restating it, and as `check-contrast.mjs` reading the
 * hexes out of `tokens.css` instead of commenting them.
 *
 * WHY IT CANNOT WRITE A STALE DOI. The concept DOI resolves to whatever version is
 * newest, so polling it before Zenodo has finished returns the *previous* release —
 * the one failure mode that would look entirely correct on the page, because a real
 * DOI for a real version of this artifact is exactly what a wrong answer looks like
 * here. So the version is asserted before anything is written: the record's
 * `metadata.version` has to be the version this repository is releasing, or the
 * script writes nothing and says which version it found instead. Polling early is
 * therefore safe, and is the expected way to use it — Zenodo takes a minute or two
 * after the GitHub release, and this waits.
 *
 * WHERE THE RECORD ID COMES FROM. Not from here. It is the concept DOI in
 * `CITATION.cff`, which is the identifier listed under `identifiers:` that is not the
 * top-level `doi:`. A record number typed into this file would be one more copy of
 * the fact the script exists to stop copying.
 *
 * WHAT IT WILL NOT DO. It substitutes values; it does not write prose. Exactly one
 * sentence changes meaning rather than values at a release — the masthead's Version
 * row, which stops saying a version is in progress and starts saying it is the one to
 * cite — and that sentence is the author's to write. The audit at the end fails
 * loudly if it has been left in its pre-release form.
 *
 * That is owed at every release rather than once, and the reason is worth writing
 * down: opening the next version's changelog entry puts the row back into the
 * in-progress form, because an invariant requires the masthead to name the version at
 * the top of the changelog and not the one below it. So the row alternates by design,
 * and a substitution rule for it would be a rule that is wrong half the time. The
 * arrangement is the one the rest of this repository uses: the machine holds what a
 * person would forget, and the person writes what a machine would get wrong.
 *
 * WHAT IT DOES NOT KNOW. Whether the resulting sentences are true, well phrased, or
 * still say what they meant. It knows that a version string and a DOI string appear
 * where they are supposed to appear, and that no document was left naming the
 * previous pairing. `npm run check` is still the gate, and `npm run format` may have
 * to run first: a version or DOI of a different width will pull the README's table
 * out of alignment, and `format:check` is part of the gate.
 *
 *   node scripts/sync-doi.mjs                 # poll, assert, write
 *   node scripts/sync-doi.mjs --dry-run       # say what it would write, write nothing
 *   node scripts/sync-doi.mjs --expect=0.9.0  # a version package.json has not reached
 */
import { readFileSync, writeFileSync } from 'node:fs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ZENODO_API = 'https://zenodo.org/api/records';
const DEFAULT_WAIT_SECONDS = 900;
const DEFAULT_INTERVAL_SECONDS = 15;

function fail(message) {
  console.error(`sync-doi: ${message}`);
  process.exit(1);
}

function flag(name) {
  return process.argv.includes(`--${name}`);
}

function option(name, fallback) {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found === undefined ? fallback : found.slice(name.length + 3);
}

/**
 * `2026-08-14` to `14 Aug 2026`, which is the form the footers and the changelog
 * headings use. Derived the same way `build-protocol.mjs` derives it, because the
 * date it renders into `protocol.html` and the date this writes into the three
 * hand-written footers have to be the same string.
 */
function displayDate(iso) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (parts === null) fail(`date “${iso}” is not YYYY-MM-DD.`);
  const month = MONTHS[Number(parts[2]) - 1];
  if (month === undefined) fail(`date “${iso}” has month ${parts[2]}.`);
  return `${String(Number(parts[3]))} ${month} ${parts[1]}`;
}

/** `0.8.0` to `v0.8`, which is how the changelog and the masthead name a version. */
function series(version) {
  return `v${version.split('.').slice(0, 2).join('.')}`;
}

/**
 * The pairing this repository currently publishes, read off `CITATION.cff`.
 *
 * Anchored to the start of a line for `doi:` so that the `value:` entries nested
 * under `identifiers:` cannot match it, and the concept DOI is then found as the
 * identifier that is not that one. Getting these two the wrong way round is the
 * substitution that would look right and cite nothing in particular.
 */
function readCitation() {
  const cff = readFileSync('CITATION.cff', 'utf8');
  const field = (name) => {
    const match = new RegExp(`^${name}:\\s*'?([^'\\n]+?)'?\\s*$`, 'm').exec(cff);
    if (match === null) fail(`CITATION.cff has no top-level \`${name}:\` field.`);
    return match[1];
  };

  const doi = field('doi');
  const identifiers = [...cff.matchAll(/^\s+value:\s*(\S+)\s*$/gm)].map((m) => m[1]);
  const conceptDoi = identifiers.find((value) => value !== doi);
  if (conceptDoi === undefined) fail('CITATION.cff lists no concept DOI under `identifiers:`.');

  const iso = field('date-released');
  return { version: field('version'), doi, conceptDoi, iso, date: displayDate(iso) };
}

/**
 * The newest deposit in this concept record's series, once it is the one expected.
 *
 * Returns only on a match. Every other outcome — a slow mint, a network failure, a
 * record that answers with the previous version — is a retry until the wait runs out,
 * and then a non-zero exit having written nothing.
 */
async function poll({ recordId, expected, conceptDoi, waitMs, intervalMs }) {
  const deadline = Date.now() + waitMs;
  // Left unassigned rather than seeded: every path through the loop below writes it
  // before anything reads it, and a seed here would be a string that can never print.
  let lastSeen;

  for (;;) {
    try {
      const response = await fetch(`${ZENODO_API}/${recordId}`, {
        redirect: 'follow',
        headers: { accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const record = await response.json();

      // Asserted before the version, because a version match against the wrong
      // series would be a correct-looking answer about a different artifact.
      if (record.conceptdoi !== conceptDoi) {
        fail(
          `record ${recordId} belongs to concept DOI ${String(record.conceptdoi)}, ` +
            `and CITATION.cff names ${conceptDoi}.`,
        );
      }

      const found = String(record.metadata?.version ?? '').replace(/^v/, '');
      lastSeen = found === '' ? 'a record with no version' : `v${found}`;
      if (found === expected) {
        const doi = String(record.doi ?? '');
        if (doi === record.conceptdoi) fail('the record reports the concept DOI as its own.');
        if (!/^10\.\d{4,}\/zenodo\.\d+$/.test(doi)) fail(`DOI “${doi}” is not a Zenodo DOI.`);
        const iso = String(record.metadata?.publication_date ?? '');
        return { version: expected, doi, iso, date: displayDate(iso), record: String(record.id) };
      }
    } catch (error) {
      lastSeen = `an error — ${error instanceof Error ? error.message : String(error)}`;
    }

    if (Date.now() + intervalMs >= deadline) {
      fail(
        `waited for v${expected} on Zenodo record ${recordId} and saw ${lastSeen}. ` +
          'Nothing was written. Re-run when the deposit has landed.',
      );
    }
    console.log(`  … saw ${lastSeen}, waiting for v${expected}`);
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

function substitute(text, find, replace) {
  if (find instanceof RegExp) {
    const flags = find.flags.includes('g') ? find.flags : `${find.flags}g`;
    const global = new RegExp(find.source, flags);
    return { out: text.replace(global, replace), count: [...text.matchAll(global)].length };
  }
  const parts = text.split(find);
  return { out: parts.join(replace), count: parts.length - 1 };
}

/**
 * Every edit a release makes, declared with the number of times it must apply.
 *
 * The counts are the point. A substitution that silently matched nothing would leave
 * a document citing the previous version and report success, which is the failure the
 * whole script exists to remove — so a count that comes back wrong stops the run
 * before anything is written to disk.
 *
 * The concept DOI is never searched for and never replaced. It is on the README badge
 * deliberately, it resolves to whatever is newest, and a release that updated every
 * DOI it found would break the one identifier that is supposed to move on its own.
 */
function plan(now, next) {
  const cite = (v) =>
    `Cite the version you read: v${v.version}, ${v.date} &mdash; ` +
    `<a href="https://doi.org/${v.doi}">doi:${v.doi}</a>`;
  const row = new RegExp(`(version: '${series(next.version)}',\\s*\\n\\s*date: ')In progress(')`);

  return [
    {
      file: 'CITATION.cff',
      edits: [
        { find: `\nversion: ${now.version}\n`, replace: `\nversion: ${next.version}\n`, need: 1 },
        { find: `\ndate-released: '${now.iso}'\n`, replace: `\ndate-released: '${next.iso}'\n`, need: 1 }, // prettier-ignore
        // Twice: the top-level `doi:` and the matching entry under `identifiers:`.
        { find: now.doi, replace: next.doi, need: 2 },
        { find: `This version, v${now.version}.`, replace: `This version, v${next.version}.`, need: 1 }, // prettier-ignore
        { find: `closed ${series(now.version)} entry`, replace: `closed ${series(next.version)} entry`, need: 1 }, // prettier-ignore
      ],
    },
    {
      file: 'CHANGELOG.md',
      edits: [
        {
          find: `## ${series(next.version)} — In progress — `,
          replace: `## ${series(next.version)} — ${next.date} — `,
          need: 1,
        },
      ],
    },
    ...['index.html', 'essay.html', 'atrophy.html'].map((file) => ({
      file,
      edits: [{ find: cite(now), replace: cite(next), need: 1 }],
    })),
    {
      file: 'README.md',
      edits: [
        { find: `v${now.version} (${now.date})`, replace: `v${next.version} (${next.date})`, need: 1 }, // prettier-ignore
        { find: `[${now.doi}](https://doi.org/${now.doi})`, replace: `[${next.doi}](https://doi.org/${next.doi})`, need: 1 }, // prettier-ignore
        {
          find: `${series(now.version)}, dated ${now.date} and tagged \`v${now.version}\``,
          replace: `${series(next.version)}, dated ${next.date} and tagged \`v${next.version}\``,
          need: 1,
        },
      ],
    },
    {
      file: 'src/content/process.ts',
      edits: [
        // The changelog mirror's own row for this version, which an invariant holds
        // against the heading closed in CHANGELOG.md above.
        { find: row, replace: `$1${next.date}$2`, need: 1 },
        // The masthead's Version row is deliberately absent from this list. See the
        // header: it is the one sentence whose meaning changes at a release, and the
        // audit refuses the run while it is still in its pre-release form.
        {
          find: `v${now.version} is tagged and deposited, and its own DOI is ${now.doi}`,
          replace: `v${next.version} is tagged and deposited, and its own DOI is ${next.doi}`,
          need: 1,
        },
      ],
    },
    {
      file: 'docs/review-briefs.md',
      // Global within this file: it names the versioned DOI twice and the version
      // three times, and never mentions the concept DOI at all.
      edits: [
        { find: `v${now.version}`, replace: `v${next.version}`, need: 3 },
        { find: now.doi, replace: next.doi, need: 2 },
      ],
    },
  ];
}

/** The masthead's Version row, pulled out of the content module as source text. */
function mastheadVersionRow(source) {
  const match = /label:\s*'Version',\s*\n\s*value:\s*\n?\s*'((?:[^'\\]|\\.)*)'/.exec(source);
  return match === null ? null : match[1];
}

/**
 * The mirror of the invariant, run against what was just written.
 *
 * `invariants.test.ts` is the real check and runs in the suite; this exists so that a
 * release that has left a document behind hears about it from the script that wrote
 * the others, rather than four commands later.
 */
function audit(next) {
  const read = (file) => readFileSync(file, 'utf8');
  const process_ = read('src/content/process.ts');
  const mastheadRow = mastheadVersionRow(process_);
  const stale = [];

  const carriers = [
    ['CITATION.cff', read('CITATION.cff'), true],
    ['index.html', read('index.html'), true],
    ['essay.html', read('essay.html'), true],
    ['atrophy.html', read('atrophy.html'), true],
    ['README.md', read('README.md'), true],
    ['docs/review-briefs.md', read('docs/review-briefs.md'), true],
    ['the caveat about the moving URL', process_, true],
    ['the masthead Version row', mastheadRow ?? '', false],
  ];

  for (const [name, text, alsoDoi] of carriers) {
    if (text === '') stale.push(`${name} could not be read — the lookup above has gone stale`);
    else if (!text.includes(`v${next.version}`))
      stale.push(`${name} does not name v${next.version}`);
    if (alsoDoi && !text.includes(next.doi)) stale.push(`${name} does not name ${next.doi}`);
  }

  // The one sentence this script deliberately does not write. It says a version is in
  // progress until a person says it is not, and a release that leaves it saying so has
  // published a masthead contradicting the footer three pages away.
  if (mastheadRow !== null && /in progress/i.test(mastheadRow)) {
    stale.push(
      'the masthead Version row still says a version is in progress — that sentence ' +
        'changes meaning at a release and is yours to write, in src/content/process.ts',
    );
  }
  return stale;
}

const dryRun = flag('dry-run');
const expected = option('expect', String(JSON.parse(readFileSync('package.json', 'utf8')).version));
const now = readCitation();
const recordId = /zenodo\.(\d+)$/.exec(now.conceptDoi)?.[1];
if (recordId === undefined) fail(`concept DOI “${now.conceptDoi}” has no Zenodo record number.`);

console.log(`sync-doi: CITATION.cff publishes v${now.version} — ${now.doi} (${now.date})`);
console.log(`sync-doi: asking Zenodo record ${recordId} for v${expected}`);

const next = await poll({
  recordId,
  expected,
  conceptDoi: now.conceptDoi,
  waitMs: Number(option('wait', DEFAULT_WAIT_SECONDS)) * 1000,
  intervalMs: Number(option('interval', DEFAULT_INTERVAL_SECONDS)) * 1000,
});

console.log(
  `sync-doi: Zenodo record ${next.record} is v${next.version} — ${next.doi} (${next.date})`,
);

if (next.doi === now.doi && next.version === now.version) {
  console.log('sync-doi: the citation file already publishes that pairing. Nothing to write.');
} else {
  // Planned in full and checked in full before a byte is written, so that a run that
  // fails on the last file has not left the repository half-released.
  const written = [];
  for (const { file, edits } of plan(now, next)) {
    let text = readFileSync(file, 'utf8');
    for (const { find, replace, need } of edits) {
      const { out, count } = substitute(text, find, replace);
      // Every edit keeps its exact count, because a substitution that quietly matched
      // nothing is the failure this script exists to remove: it would leave a document
      // citing the previous version and report success. Re-running is safe without a
      // per-edit escape hatch, because a second run finds the pairing already current
      // and never reaches this loop.
      if (count !== need) {
        fail(
          `${file}: expected ${need} occurrence(s) of ${String(find)}, found ${count}. ` +
            'Nothing was written. The document has been reworded — fix the plan, not the file.',
        );
      }
      text = out;
    }
    written.push([file, text]);
  }

  for (const [file, text] of written) {
    if (!dryRun) writeFileSync(file, text);
    console.log(`  ${dryRun ? 'would rewrite' : 'rewrote'} ${file}`);
  }
}

const stale = dryRun ? [] : audit(next);
if (stale.length > 0) {
  // Accumulated rather than thrown one at a time, on the same grounds as the
  // invariant: a run that names the first stale document sends someone round the loop
  // once per document, and one run should print the whole list.
  console.error('\nsync-doi: documents left citing a previous version:');
  for (const line of stale) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(dryRun ? '\nsync-doi: dry run, nothing written.' : '\nsync-doi: run `npm run format`, then `npm run check`.'); // prettier-ignore
