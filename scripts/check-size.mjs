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
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

const BUDGETS = {
  jsGzipBytes: 60 * 1024,
  totalBytes: 400 * 1024,
};

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

const failures = [];
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

if (failures.length > 0) {
  console.error('\ncheck-size: over budget');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('\nEither trim the output or raise the budget in scripts/check-size.mjs,');
  console.error('in a commit that says why.');
  process.exit(1);
}
