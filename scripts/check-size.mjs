#!/usr/bin/env node
/**
 * Bundle size budget.
 *
 * The previous build shipped the instrument as a single 894 KB generated file.
 * This turns that failure mode into a check that cannot be forgotten, rather
 * than a lesson someone has to remember.
 *
 * Two budgets:
 *   - total JavaScript, gzipped, across the whole build
 *   - total build output, uncompressed
 *
 * Raising either is allowed. Raising either silently is not: the number lives
 * here, in the diff, next to the reason it exists.
 *
 * And one property that is not a budget: the three prose pages ship no
 * JavaScript. A total for the whole build would stay quiet if one essay gained a
 * script tag and the total still fit, so the pages are checked one at a time.
 * `tests/prose.spec.ts` asserts the same thing from the other side, by counting
 * what a browser actually requests; this half runs without one, and is what the
 * deploy job has.
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

const BUDGETS = {
  jsGzipBytes: 60 * 1024,
  /**
   * Raised from 400 KB at #30, which is the sixth measure and its paperwork.
   *
   * The measure came in at 400.1 KB — a hundred bytes over — and the alternative
   * was shaving a sentence off a published formula or a stated threat to fit a
   * round number. That is the wrong trade in this repository: the protocol screen
   * giving every measure its arithmetic and its objection is the artifact, and a
   * budget that quietly edits it is a budget doing the wrong job.
   *
   * Raised with margin rather than to 401 KB, so the next content change is a
   * decision about the content and not about this line. What actually governs what
   * a reader waits for is `jsGzipBytes`, which is at 43 KB of 60 and untouched;
   * this total is dominated by the self-hosted fonts, which are a promise on the
   * consent screen rather than an optimisation to revisit.
   *
   * Raised again from 416 KB in v0.8, by the source pass on the essays' three
   * empirical claims, and for the same reason as the first time. The build came in
   * at 421.0 KB, five kilobytes over. What grew is prose: the long essay now states
   * each study's design, sample and interval where it used to state a direction,
   * and the mirrored source table carries what each reading changed. Both are the
   * thing this artifact is, and the margin the note above asked for turned out to be
   * a version and a half rather than a long time.
   *
   * The proportions are worth writing down, since this is the second raise and a
   * third would be a pattern rather than an event. The build is 48% self-hosted
   * fonts and 35% the instrument's own JavaScript and CSS; the three prose pages
   * together are under 10%, and `atrophy.html` is the largest of them at 25.7 KB.
   * `jsGzipBytes` is what a reader actually waits for and it is at 48 KB of 60,
   * so nothing here is a performance decision yet. If this number is hit a third
   * time by content, the honest response is to say what the fonts are costing
   * rather than to move the line again.
   */
  totalBytes: 440 * 1024,
};

/**
 * The pages that carry no script, and the one that does.
 *
 * The instrument is listed too, and expected to carry exactly one: a check that
 * only ever looks for absence would pass just as happily on a build that emitted
 * no JavaScript at all, which is a different bug wearing the same green tick.
 */
const SCRIPTLESS_PAGES = ['index.html', 'essay.html', 'atrophy.html'];
const SCRIPTED_PAGES = { 'drift-meter.html': 1 };

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else if (entry.isFile()) out.push(path);
  }
  return out;
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(`check-size: no ${DIST}/ directory. Run \`npm run build\` first.`);
  process.exit(1);
}

if (files.length === 0) {
  console.error(`check-size: ${DIST}/ is empty.`);
  process.exit(1);
}

let jsGzip = 0;
let total = 0;
const jsFiles = [];

for (const file of files) {
  const size = statSync(file).size;
  total += size;
  if (file.endsWith('.js') || file.endsWith('.mjs')) {
    const gz = gzipSync(readFileSync(file)).byteLength;
    jsGzip += gz;
    jsFiles.push({ file: relative(DIST, file), size, gz });
  }
}

/** Every `src=` and `href=` in a page, however quoted. */
function referencedUrls(html) {
  const attribute = /\b(?:src|href)\s*=\s*("([^"]*)"|'([^']*)'|([^\s">]+))/gi;
  const urls = [];
  let match;
  while ((match = attribute.exec(html)) !== null) {
    urls.push(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return urls;
}

function scriptTagCount(html) {
  return (html.match(/<script\b/gi) ?? []).length;
}

const failures = [];

for (const page of SCRIPTLESS_PAGES) {
  let html;
  try {
    html = readFileSync(join(DIST, page), 'utf8');
  } catch {
    failures.push(`${page} is not in ${DIST}/ — the build no longer emits it`);
    continue;
  }
  const scripts = scriptTagCount(html);
  if (scripts > 0) {
    failures.push(
      `${page} carries ${String(scripts)} <script> tag(s). The prose pages are finished ` +
        `documents and are readable with scripting off; that is the property this defends.`,
    );
  }
  const js = referencedUrls(html).filter((url) => /\.m?js(\?|#|$)/i.test(url));
  if (js.length > 0) {
    failures.push(`${page} references JavaScript: ${js.join(', ')}`);
  }
}

for (const [page, expected] of Object.entries(SCRIPTED_PAGES)) {
  let html;
  try {
    html = readFileSync(join(DIST, page), 'utf8');
  } catch {
    failures.push(`${page} is not in ${DIST}/ — the build no longer emits it`);
    continue;
  }
  const scripts = scriptTagCount(html);
  if (scripts !== expected) {
    failures.push(
      `${page} carries ${String(scripts)} <script> tag(s), expected ${String(expected)}. ` +
        `The instrument needs its entry point; a count of zero means the build stopped ` +
        `emitting one and the scriptless check above would not have noticed.`,
    );
  }
}

if (jsGzip > BUDGETS.jsGzipBytes) {
  failures.push(`JavaScript is ${kb(jsGzip)} gzipped, over the ${kb(BUDGETS.jsGzipBytes)} budget`);
}
if (total > BUDGETS.totalBytes) {
  failures.push(`Build output is ${kb(total)}, over the ${kb(BUDGETS.totalBytes)} budget`);
}

console.log(`check-size: ${files.length} files, ${kb(total)} total`);
console.log(
  `check-size: JavaScript ${kb(jsGzip)} gzipped / ${kb(BUDGETS.jsGzipBytes)} budget` +
    (jsFiles.length === 0 ? ' (no JavaScript emitted)' : ''),
);
for (const { file, size, gz } of jsFiles.sort((a, b) => b.gz - a.gz)) {
  console.log(`  ${file}  ${kb(size)} → ${kb(gz)} gzipped`);
}
console.log(
  `check-size: ${SCRIPTLESS_PAGES.join(', ')} carry no script; ` +
    `${Object.keys(SCRIPTED_PAGES).join(', ')} carries its entry point`,
);

if (failures.length > 0) {
  console.error('\ncheck-size: failed');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('\nA budget can be raised in scripts/check-size.mjs, in a commit that says why.');
  console.error('A script tag on a prose page is not a budget — those pages are meant to be');
  console.error('readable with scripting off, and the fix is to remove the tag.');
  process.exit(1);
}
