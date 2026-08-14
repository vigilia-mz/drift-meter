#!/usr/bin/env node
/**
 * Writes `protocol.html`, the static half of the protocol screen.
 *
 * `render-protocol.mjs` is the page; this is the loading and the writing. It runs
 * before `vite build`, and the file it writes is a Vite input like the three
 * hand-written prose pages, so the built page gets the same treatment as they do:
 * the stylesheet hashed, the base path applied, the favicon rewritten. Doing it in
 * a plugin instead would mean re-implementing that.
 *
 * WHY VITE LOADS THE CONTENT. `src/content/method.ts` is TypeScript and imports
 * `./arms.js`, which is the extension the source is written with and not the
 * extension on disk. Node's own type stripping does not rewrite that specifier and
 * fails to resolve it; Vite's resolver is what the application already uses for the
 * same imports, so the module is loaded through a Vite server in middleware mode
 * rather than through a second, differently-behaved toolchain. Nothing is served —
 * the server exists for its module graph and is closed on the next line.
 *
 * WHY THE CITATION IS PARSED RATHER THAN TYPED HERE. The footer names a version, a
 * date and a DOI. Those three already have a home in `CITATION.cff`, and a second
 * copy of a DOI is the same failure as a second copy of a formula — so they are read
 * from it, and a missing field stops the build rather than shipping a page whose
 * footer disagrees with the citation file. The three prose pages still carry theirs
 * by hand, which is a divergence worth naming: this page cannot go stale, and they
 * can.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'vite';
import { renderProtocol } from './render-protocol.mjs';

const OUT = 'protocol.html';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The three citation fields, read off the top level of `CITATION.cff`.
 *
 * Anchored to the start of a line so that the `value:` entries nested under
 * `identifiers:` — one of which is the concept DOI, which is the wrong one — cannot
 * match. The concept DOI resolving to whatever is newest is exactly what a citation
 * of a specific version must not do.
 */
function readCitation() {
  const cff = readFileSync('CITATION.cff', 'utf8');
  const field = (name) => {
    const match = new RegExp(`^${name}:\\s*'?([^'\\n]+?)'?\\s*$`, 'm').exec(cff);
    if (match === null) {
      throw new Error(`build-protocol: CITATION.cff has no top-level \`${name}:\` field.`);
    }
    return match[1];
  };

  const released = field('date-released');
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(released);
  if (parts === null) {
    throw new Error(`build-protocol: date-released is “${released}”, expected YYYY-MM-DD.`);
  }
  const month = MONTHS[Number(parts[2]) - 1];
  if (month === undefined) {
    throw new Error(`build-protocol: date-released has month ${parts[2]}.`);
  }

  return {
    version: field('version'),
    doi: field('doi'),
    date: `${String(Number(parts[3]))} ${month} ${parts[1]}`,
  };
}

/**
 * No deictic screen reference may reach the page.
 *
 * The protocol is one text on two surfaces, so a sentence saying *screen* is false on the
 * page and one saying *page* is false on the screen. “Here” is true on both, and the four
 * sentences that needed it were found by reading. That is the problem: reading is what
 * found them, and reading is not repeatable. A docstring in `src/content/process.ts` said
 * there was no anchor anywhere in `src/screens/`, which was true when written and was
 * falsified by a link added three files away — nothing detected it, and a human happened
 * to re-read the file. This is the same class, so it is a check rather than a note.
 *
 * It runs over the rendered HTML rather than over a list of field names, which is what
 * scopes it correctly for free: `permalinkLead` and `permalinkLabel` say “this screen”
 * legally, because they are the screen telling a reader about the page and the renderer
 * does not pick them up. A field that starts being rendered starts being checked, with no
 * list to remember to update.
 *
 * Referential uses are not matched and could not be, by any pattern: “the encoded screen”
 * names a screen you could point at from elsewhere and is correct on both surfaces. The
 * three phrases below are deictic in every use this repository has had, which is what makes
 * them safe to match on. A referential sentence that trips this is a false positive worth
 * having — it costs a rewording and it means someone looked.
 */
const DEICTIC = ['this screen', 'on this screen', 'on the screen'];

/**
 * Which field a phrase came from, so the failure names it rather than the file.
 *
 * Walks the content the renderer was handed and returns the path to the offending string.
 * A miss returns null rather than throwing: an unnamed failure is still a failure, and the
 * phrase itself is enough to find it by hand.
 */
function fieldContaining(content, phrase) {
  const walk = (value, path) => {
    if (typeof value === 'string') return value.toLowerCase().includes(phrase) ? path : null;
    if (value === null || typeof value !== 'object') return null;
    for (const [key, inner] of Object.entries(value)) {
      const found = walk(inner, path === '' ? key : `${path}.${key}`);
      if (found !== null) return found;
    }
    return null;
  };
  return walk(content, '');
}

function assertNoDeixis(html, content) {
  // Tags stripped first, so a class or an id can carry a word the prose may not.
  const text = html.replace(/<[^>]*>/g, ' ').toLowerCase();
  const found = DEICTIC.filter((phrase) => text.includes(phrase));
  if (found.length === 0) return;

  const named = found.map((phrase) => {
    const field = fieldContaining(content, phrase);
    return `  “${phrase}” — ${field === null ? 'field not located' : field}`;
  });
  throw new Error(
    `build-protocol: a rendered field refers to “this screen” deictically.\n${named.join('\n')}\n\n` +
      `The protocol is published twice, as a screen and as protocol.html, so “screen” is\n` +
      `false on the page and “page” is false on the screen. Use “here”, which is true on\n` +
      `both. A sentence that names a specific screen as an object — the debrief, the\n` +
      `encoded screen — is referential and correct; reword it so this check can tell.\n\n` +
      `${SCOPE_LIMIT}`,
  );
}

/**
 * What this check does not cover, printed on every build rather than filed in a comment.
 *
 * The check reads the rendered HTML, so it covers exactly what `render-protocol.mjs`
 * renders — `src/content/method.ts` and nothing else. Every other content module is
 * outside it, and `src/content/process.ts` is the one that matters: its wording was
 * neutralised to “here” ahead of a page that does not exist yet, and nothing enforces
 * that it stays neutral. A second caller of the renderer must bring this check with it.
 *
 * This is printed rather than documented because the last thing to go wrong here was a
 * docstring that was true when written, was falsified by a change three files away, and
 * was caught by a human happening to re-read it. A scope limit recorded only in a comment
 * is the same artifact. One line on every successful build is the cost of it being seen.
 */
const SCOPE_LIMIT =
  'Scope: this covers src/content/method.ts, the only module render-protocol.mjs\n' +
  'renders. process.ts is neutralised by hand and unenforced — a second caller of the\n' +
  'renderer has to extend this check, or its page ships the defect this one prevents.';

const server = await createServer({
  configFile: false,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
});

try {
  const method = await server.ssrLoadModule('/src/content/method.ts');
  const shell = await server.ssrLoadModule('/src/content/shell.ts');
  const model = await server.ssrLoadModule('/shared/model.ts');

  const content = {
    method: method.METHOD,
    measures: method.MEASURE_SPECS,
    predictions: method.PRED_ROWS,
    arms: method.armRows(),
    title: shell.SCREENS.method.title,
    pinnedModel: model.PINNED_MODEL,
    citation: readCitation(),
  };

  const html = renderProtocol(content);
  assertNoDeixis(html, content);

  writeFileSync(OUT, html);
  console.log(
    `build-protocol: ${OUT} — ${String(method.MEASURE_SPECS.length)} measures, ` +
      `${String(method.PRED_ROWS.length)} predictions, ${String(method.METHOD.limits.length)} limits, ` +
      `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`,
  );
  console.log(`build-protocol: no deictic screen reference reached the page. ${SCOPE_LIMIT}`);
} finally {
  await server.close();
}
