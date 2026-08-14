#!/usr/bin/env node
/**
 * Prints the repository's own counts, derived from the source rather than from prose.
 *
 * WHY THIS EXISTS. A count stated in a document outside this repository drifts from
 * the count inside it, and this project has now logged that four times: the measure
 * count corrected twice, five to six to seven; the public design-review draft saying
 * six measures when there are seven; and a CV drafted this week claiming five measures
 * and 314 unit tests. Every one was caught by a person re-reading, and this
 * repository's standing position is that an invariant depending on human diligence is
 * unenforced. This does not enforce anything — it makes the true numbers cheap enough
 * to read that there is no excuse for writing them from memory.
 *
 * WHY THE TEST COUNTS COME FROM THE RUNNERS AND NOT FROM A GREP. Counting `it(` in the
 * unit suite gives 318 where vitest runs 389, and counting `test(` in the browser suite
 * gives 44 where Playwright lists 55; the gaps are parameterised cases, which are one
 * line of source and many cases. A grep would therefore publish a confident wrong
 * number — the exact defect this script was written to stop — so the runners are asked
 * instead. `vitest --reporter=json` reports what it ran; `playwright --list` collects
 * without running, so the browser count costs no browser.
 *
 * WHAT IT WILL NOT DO. Guess. There is no fallback value anywhere here: if a source
 * cannot be read or a runner cannot be asked, the key prints `unavailable` and the
 * process exits non-zero. A counts script that quietly substituted a stale number for
 * one it could not derive would be worse than no counts script, because its output
 * looks the same either way.
 *
 * WHAT IT DOES NOT KNOW. Whether any document outside this repository agrees with it.
 * Keeping a CV, a bio or a talk abstract in sync is the author's; this only makes the
 * repository's side of that comparison a single command.
 *
 *   npm run counts
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';

/** Ordered, because the output is meant to be pasted and diffed. */
const results = [];
let failed = false;

/**
 * Runs one derivation. A thrown error is a missing number, never a substituted one —
 * the key still prints, so a reader sees which of the seven could not be derived
 * rather than a short list that looks complete.
 */
function derive(key, fn) {
  try {
    const value = fn();
    if (value === undefined || value === null || value === '') throw new Error('empty');
    results.push([key, String(value)]);
  } catch (error) {
    results.push([key, 'unavailable']);
    console.error(`counts: ${key} — ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}

/**
 * The citation pair, read off the top level of `CITATION.cff`.
 *
 * Anchored to the start of a line so the `value:` entries nested under `identifiers:`
 * cannot match — one of them is the concept DOI, which resolves to whatever is newest
 * and is the wrong answer to "which version is this".
 */
function citationField(name) {
  const cff = readFileSync('CITATION.cff', 'utf8');
  const match = new RegExp(`^${name}:\\s*'?([^'\\n]+?)'?\\s*$`, 'm').exec(cff);
  if (match === null) throw new Error(`CITATION.cff has no top-level \`${name}:\``);
  return match[1];
}

/**
 * The content module, loaded through Vite for the reason `build-protocol.mjs` gives:
 * `method.ts` imports `./arms.js`, an extension that does not exist on disk, and Node's
 * own type stripping fails to resolve it. This uses the resolver the application uses
 * rather than a second toolchain that behaves differently. Nothing is served.
 */
const server = await createServer({
  configFile: false,
  logLevel: 'silent',
  server: { middlewareMode: true },
});

let method;
let arms;
try {
  method = await server.ssrLoadModule('/src/content/method.ts');
  arms = await server.ssrLoadModule('/src/content/arms.ts');
} catch (error) {
  console.error(`counts: could not load the content modules — ${String(error)}`);
} finally {
  await server.close();
}

derive('version', () => citationField('version'));
derive('doi', () => citationField('doi'));
derive('measures', () => method.MEASURE_SPECS.length);
derive('predictions', () => method.PRED_ROWS.length);
// Both, because one number here would be read as the other. The protocol's section 2
// is headed "The four arms" and means three attribution arms against the no-estimate
// control round; `arms.ts` models only the three that carry an attribution. Printing
// `arms: 3` beside a page that says four is the drift this script exists to stop.
derive('arms', () => method.armRows().length);
derive('attribution-arms', () => Object.keys(arms.ARMS).length);

derive('unit-test-cases', () => {
  const out = execFileSync('npx', ['vitest', 'run', '--reporter=json', '--silent'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  // The reporter writes one JSON document; anything before it is noise from the run.
  const start = out.indexOf('{');
  if (start < 0) throw new Error('vitest produced no JSON');
  const total = JSON.parse(out.slice(start)).numTotalTests;
  if (typeof total !== 'number') throw new Error('vitest reported no numTotalTests');
  return total;
});

derive('browser-specs', () => {
  const out = execFileSync('npx', ['playwright', 'test', '--list', '--reporter=json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const start = out.indexOf('{');
  if (start < 0) throw new Error('playwright produced no JSON');
  const count = (function walk(node) {
    return (
      (node.suites ?? []).reduce((sum, child) => sum + walk(child), 0) + (node.specs ?? []).length
    );
  })({ suites: JSON.parse(out.slice(start)).suites ?? [] });
  if (count === 0) throw new Error('playwright listed no specs');
  return count;
});

for (const [key, value] of results) console.log(`${key}: ${value}`);
if (failed) process.exit(1);
