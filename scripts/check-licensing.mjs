#!/usr/bin/env node
/**
 * Licensing budget.
 *
 * `REUSE.toml` says this repository holds two kinds of thing and licenses them
 * differently, and it says so in six paragraphs of reasoning. What it had no way
 * of saying is whether the reasoning still described the repository. It did not:
 * two of the three licences it names had no text in `LICENSES/`, and six tracked
 * files matched no annotation at all — one of them a `docs/` page added in the
 * same version as this script, by someone who had read the file and still missed
 * that `docs/` was not in it.
 *
 * That is the same failure as the contrast ratios that lived in a comment, and it
 * gets the same fix. Two assertions, both run on every push:
 *
 *   1. Every tracked file is covered by at least one annotation.
 *   2. Every licence named in an annotation has its text in `LICENSES/`, and
 *      every text in `LICENSES/` is named by an annotation.
 *
 * WHAT THIS DOES NOT CHECK, and the limit is the point of saying so. It does not
 * resolve which licence wins where two annotations match the same file — the
 * prose block's `src/content/**` and the code block's `src/**` overlap
 * deliberately, and REUSE's own precedence rules govern that. So this catches a
 * file with no licence and a licence with no text. It does not catch a file with
 * the wrong licence, and nothing here does; that stays a matter of reading the
 * file, which is what the block comments in it are for.
 *
 * It is also not a REUSE conformance check. `reuse lint` reads in-file SPDX
 * headers as well, and this reads only `REUSE.toml`.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';

const REUSE_FILE = 'REUSE.toml';
const LICENSES_DIR = 'LICENSES';

/**
 * Files that carry no licence and are not expected to.
 *
 * The licence texts are the licences, and annotating a copy of Apache-2.0 with a
 * licence is circular. `LICENSE` is the same text again at the root, where GitHub
 * looks for it.
 */
const NOT_ANNOTATED = new Set(['LICENSE']);
const isLicenceText = (path) => path.startsWith(`${LICENSES_DIR}/`);

/**
 * The `[[annotations]]` blocks, read out of the file rather than restated.
 *
 * A TOML parser would be a dependency for two fields. This reads the `path`
 * array and the SPDX identifier out of each block and fails loudly if a block
 * has neither, which is the only way the shortcut could go quietly wrong.
 */
function annotations(toml) {
  const blocks = toml.split(/^\[\[annotations\]\]$/m).slice(1);
  return blocks.map((block, i) => {
    const stripped = block.replace(/^\s*#.*$/gm, '');
    const pathArray = /path\s*=\s*\[([^\]]*)\]/.exec(stripped);
    const single = /path\s*=\s*"([^"]+)"/.exec(stripped);
    const licence = /SPDX-License-Identifier\s*=\s*"([^"]+)"/.exec(stripped);
    if (!licence) throw new Error(`annotation block ${i + 1} names no SPDX-License-Identifier`);
    if (!pathArray && !single) throw new Error(`annotation block ${i + 1} names no path`);
    const paths = pathArray
      ? [...pathArray[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : [single[1]];
    if (paths.length === 0) throw new Error(`annotation block ${i + 1} has an empty path list`);
    return { paths, licences: licence[1].split(/\s+(?:AND|OR)\s+/) };
  });
}

/**
 * A REUSE path pattern as a regular expression.
 *
 * `**` crosses directory separators and `*` does not, which is why `*.ts` in the
 * code block covers `vite.config.ts` and not `src/main.ts`, and why `src/**`
 * covers both. Getting that backwards would make every file look covered.
 */
function pattern(glob) {
  let out = '';
  for (let i = 0; i < glob.length; i += 1) {
    if (glob.startsWith('**', i)) {
      out += '.*';
      i += 1;
    } else if (glob[i] === '*') {
      out += '[^/]*';
    } else if (glob[i] === '?') {
      out += '[^/]';
    } else {
      out += glob[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${out}$`);
}

const toml = readFileSync(REUSE_FILE, 'utf8');
const blocks = annotations(toml);
const compiled = blocks.map((b) => ({ ...b, matchers: b.paths.map(pattern) }));

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);

const failures = [];

const uncovered = tracked.filter(
  (file) =>
    !NOT_ANNOTATED.has(file) &&
    !isLicenceText(file) &&
    !compiled.some((b) => b.matchers.some((m) => m.test(file))),
);
for (const file of uncovered) {
  failures.push(`${file} matches no annotation in ${REUSE_FILE}`);
}

const named = new Set(compiled.flatMap((b) => b.licences));
const present = new Set(
  readdirSync(LICENSES_DIR)
    .filter((f) => f.endsWith('.txt'))
    .map((f) => f.replace(/\.txt$/, '')),
);
for (const licence of [...named].sort()) {
  if (!present.has(licence)) {
    failures.push(`${REUSE_FILE} names ${licence} and ${LICENSES_DIR}/${licence}.txt is missing`);
  }
}
for (const licence of [...present].sort()) {
  if (!named.has(licence)) {
    failures.push(`${LICENSES_DIR}/${licence}.txt is a licence nothing in ${REUSE_FILE} uses`);
  }
}

const counts = compiled.map((b) => {
  const files = tracked.filter((f) => b.matchers.some((m) => m.test(f)));
  return { licences: b.licences.join(' '), paths: b.paths.length, files: files.length };
});

console.log(
  `check-licensing: ${tracked.length} tracked files, ${blocks.length} annotation blocks, ` +
    `${named.size} licences`,
);
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
for (const c of counts) {
  console.log(`  ${c.licences}  ${plural(c.paths, 'pattern')}  ${plural(c.files, 'file')} matched`);
}

if (failures.length > 0) {
  console.error('\ncheck-licensing: failed');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    `\nA new file needs a home in ${REUSE_FILE}. The two blocks are prose and code, and`,
  );
  console.error('the reasoning for which is which is in the comment at the top of that file.');
  console.error('A new licence needs its text in LICENSES/, copied rather than retyped.');
  process.exit(1);
}
