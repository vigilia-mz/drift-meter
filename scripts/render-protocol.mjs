/**
 * The protocol, rendered as a page a reader can fetch.
 *
 * The instrument's protocol screen is the most citable thing on this site — seven
 * measures with their arithmetic and a stated threat each, six predictions with the
 * condition that would falsify each one, and nine limits — and until this file it
 * was the least reachable. `drift-meter.html` is a 986-byte shell with a script tag
 * in it, so a reviewer fetching the URL got a title and a `<noscript>` paragraph. A
 * reviewer said so, and was right about something worse than they described: the
 * screen has no address at all. `src/platform/history.ts` declines to write
 * `?screen=method` on the grounds that a URL which shows the intro when reloaded is
 * a URL that lies, which is correct for a run-state screen and leaves the protocol
 * unlinkable, uncrawlable and unarchivable as a side effect.
 *
 * WHY GENERATED RATHER THAN WRITTEN. The obvious fix is a fourth hand-written prose
 * page. That is the ÷6-versus-÷9 bug with a new address: two copies of a published
 * formula, maintained apart, disagreeing quietly until a reader finds it. So this
 * renders from `src/content/method.ts` — the same module `src/screens/Method.tsx`
 * renders — and the page and the screen are one text with two outputs. What
 * `method.test.ts` already guarantees about the screen, it now guarantees about the
 * page: every printed constant is cross-checked against the constant the code uses.
 *
 * WHY IT IS NOT COMMITTED. `protocol.html` is written to the repository root at
 * build time and is gitignored, like `dist/`. Hard rule 1 forbids committing build
 * output and forbids a step that produces a file which is then edited by hand; this
 * is neither. It sits at the root rather than somewhere tidier because Vite names an
 * HTML output after its path relative to the project root, and `dist/protocol.html`
 * is the URL that has to exist.
 *
 * WHAT THIS DOES NOT COVER. The process screen — `src/content/process.ts`, "How this
 * was made" — has the identical problem and no static page. The renderer takes its
 * content as arguments rather than importing it, so a second caller is the way that
 * gets fixed, but nothing here does it yet.
 *
 * This module is pure: content in, HTML string out, no filesystem and no Vite. The
 * loading and the writing are `build-protocol.mjs`, and the split is what lets
 * `render-protocol.test.mjs` check the escaping and the structure against synthetic
 * content in the fast suite.
 */

/**
 * Text to markup.
 *
 * The content modules are written in typographic quotes and carry ÷, ×, −, ≤ and
 * both dashes, all of which are UTF-8 and need no help. What needs escaping is the
 * four characters that would otherwise open a tag or an entity. One pass, so `&`
 * cannot be double-encoded by a later rule.
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

function escape(text) {
  return String(text).replace(/[&<>"]/g, (character) => ESCAPES[character]);
}

/**
 * A `<dl>` of label/value pairs — the shape the screen calls `dm-rows`.
 *
 * `label` is text and is escaped here. `html` is markup and is not, because two of
 * these rows carry a `<code>` element. The field is named for what it is so that a
 * caller passing a content string into it is doing something visibly wrong rather
 * than something that merely looks fine.
 */
function rows(pairs) {
  const items = pairs
    .map(
      ({ label, html }) =>
        `        <div class="row">\n` +
        `          <dt class="row-label">${escape(label)}</dt>\n` +
        `          <dd class="row-value">${html}</dd>\n` +
        `        </div>`,
    )
    .join('\n');
  return `      <dl class="rows">\n${items}\n      </dl>`;
}

/** The common case: a row whose value is content and therefore escaped. */
function textRows(source) {
  return rows(source.map(({ label, value }) => ({ label, html: escape(value) })));
}

/** A three-column table, wrapped in the scroller that keeps it off the page margin. */
function table(columns, body) {
  const head = columns
    .map((column) => `            <th scope="col">${escape(column)}</th>`)
    .join('\n');
  return (
    `      <div class="table-scroll">\n` +
    `        <table class="data-table">\n` +
    `          <thead>\n            <tr>\n${head}\n            </tr>\n          </thead>\n` +
    `          <tbody>\n${body}\n          </tbody>\n` +
    `        </table>\n` +
    `      </div>`
  );
}

/**
 * A section, with its heading named as the section's accessible name.
 *
 * The id is also the fragment a citation would use. That is the half of this page
 * the screen cannot offer at all: `#measures` and `#measure-range` address a
 * paragraph of a protocol, and no arrangement of the in-app screen addresses
 * anything.
 */
function section(id, heading, inner) {
  return (
    `    <section aria-labelledby="${escape(id)}">\n` +
    `      <h2 class="section-heading" id="${escape(id)}">${escape(heading)}</h2>\n` +
    `${inner}\n` +
    `    </section>`
  );
}

function paragraph(text, className = 'body') {
  return `      <p class="${className}">${escape(text)}</p>`;
}

/**
 * The page.
 *
 * Everything factual comes in through `method`, `measures`, `predictions`, `arms`
 * and `pinnedModel`; everything citational comes in through `citation`, which
 * `build-protocol.mjs` reads out of `CITATION.cff` so that the footer here cannot
 * name a version the citation file does not.
 */
export function renderProtocol({
  method,
  measures,
  predictions,
  arms,
  title,
  pinnedModel,
  citation,
}) {
  const design = section(
    'design',
    method.designHeading,
    [paragraph(method.designLead), textRows(method.designRows)].join('\n'),
  );

  const armsBody = arms
    .map(
      (row) =>
        `            <tr>\n` +
        `              <th scope="row">${escape(row.arm)}</th>\n` +
        `              <td>${escape(row.supplied)}</td>\n` +
        `              <td>${escape(row.isolates)}</td>\n` +
        `            </tr>`,
    )
    .join('\n');

  const armsSection = section(
    'arms',
    method.armsHeading,
    [
      paragraph(method.armsLead),
      table(
        [method.armsColumns.arm, method.armsColumns.supplied, method.armsColumns.isolates],
        armsBody,
      ),
    ].join('\n'),
  );

  const specs = measures
    .map(
      (measure) =>
        `        <li class="spec-item" id="measure-${escape(measure.key)}">\n` +
        `          <h3 class="spec-heading">${escape(measure.label)}</h3>\n` +
        `          <dl class="rows rows-tight">\n` +
        `            <div class="row">\n` +
        `              <dt class="row-label">${escape(method.measuresFields.definition)}</dt>\n` +
        `              <dd class="row-value">${escape(measure.definition)}</dd>\n` +
        `            </div>\n` +
        `            <div class="row">\n` +
        `              <dt class="row-label">${escape(method.measuresFields.formula)}</dt>\n` +
        `              <dd class="row-value"><code class="formula">${escape(measure.formula)}</code></dd>\n` +
        `            </div>\n` +
        `            <div class="row">\n` +
        `              <dt class="row-label">${escape(method.measuresFields.threat)}</dt>\n` +
        `              <dd class="row-value">${escape(measure.threat)}</dd>\n` +
        `            </div>\n` +
        `          </dl>\n` +
        `        </li>`,
    )
    .join('\n');

  const measuresSection = section(
    'measures',
    method.measuresHeading,
    [
      paragraph(method.measuresLead),
      // Before the list rather than after it, as on the screen: a reader who stops
      // at the first measure should already know one of the seven was named in
      // advance, and that the naming buys nothing this build can compute.
      `      <h3 class="spec-heading" id="primary-outcome">${escape(method.primaryOutcomeHeading)}</h3>`,
      paragraph(method.primaryOutcome),
      paragraph(method.primaryOutcomeWhy),
      paragraph(method.primaryOutcomeLimit, 'note'),
      `      <ol class="specs">\n${specs}\n      </ol>`,
      paragraph(method.measuresNote, 'note'),
    ].join('\n'),
  );

  const predictionsBody = predictions
    .map(
      (row) =>
        `            <tr id="${escape(row.id.toLowerCase())}">\n` +
        `              <th scope="row" class="pred-id">${escape(row.id)}</th>\n` +
        `              <td>${escape(row.claim)}</td>\n` +
        `              <td>${escape(row.test)}</td>\n` +
        `            </tr>`,
    )
    .join('\n');

  const predictionsSection = section(
    'predictions',
    method.predictionsHeading,
    [
      paragraph(method.predictionsLead),
      table(
        [
          method.predictionsColumns.id,
          method.predictionsColumns.claim,
          method.predictionsColumns.test,
        ],
        predictionsBody,
      ),
      paragraph(method.predictionsOrderNote, 'note'),
      paragraph(method.predictionsCaveat, 'note'),
    ].join('\n'),
  );

  const provenance = section(
    'provenance',
    method.provenanceHeading,
    [
      paragraph(method.stimulusLead),
      textRows(method.stimulusRows),
      paragraph(method.modelLead),
      rows([
        {
          label: method.modelPinLabel,
          html: `<code class="formula">${escape(pinnedModel)}</code>`,
        },
        { label: method.modelPrintedLabel, html: escape(method.modelPrinted) },
        { label: method.modelDarkLabel, html: escape(method.modelDark) },
      ]),
    ].join('\n'),
  );

  const limits = section(
    'limits',
    method.limitsHeading,
    [
      paragraph(method.limitsLead),
      `      <ul class="limits">\n` +
        method.limits.map((limit) => `        <li class="limit">${escape(limit)}</li>`).join('\n') +
        `\n      </ul>`,
    ].join('\n'),
  );

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>${escape(title)} — The Drift Meter — Megi Pishtari</title>
<meta name="description" content="The Drift Meter&rsquo;s protocol: the design, the four arms, the seven measures with their formulas and stated threats, the six registered predictions with their falsification conditions, and what this build cannot do.">
<link rel="stylesheet" href="/src/styles/prose.css">
</head>
<body class="page-protocol">
  <main class="wrap">
    <div class="topline">
      <div class="kicker">Agential Drift Research Program &nbsp;&middot;&nbsp; Experiment 01</div>
      <a class="back" href="index.html">&larr; Back</a>
    </div>

    <h1>${escape(title)}</h1>
    <p class="standfirst">${escape(method.standfirst)}</p>
    <p class="byline">Megi Pishtari</p>

    <p class="protocol-note">This page and the instrument&rsquo;s protocol screen are one text, rendered from the same module. The screen sits inside the instrument, needs JavaScript, and has no address of its own; this page is the copy that can be linked to, fetched and archived.</p>

    <div class="protocol">
${design}

${armsSection}

${measuresSection}

${predictionsSection}

${provenance}

${limits}
    </div>

    <div class="endnav">
      <a class="btn solid" href="drift-meter.html">Launch the Drift Meter &rarr;</a>
      <a class="btn ghost" href="index.html">Back to the index</a>
    </div>

    <div class="foot">
      Built by Megi Pishtari as part of a larger research and editorial project on AI, oversight, and what becomes of human judgment.<br>
      <a href="https://github.com/vigilia-mz">github.com/vigilia-mz</a><br>
      Cite the version you read: v${escape(citation.version)}, ${escape(citation.date)} &mdash; <a href="https://doi.org/${escape(citation.doi)}">doi:${escape(citation.doi)}</a>. This URL serves whatever version is current; <a href="https://github.com/vigilia-mz/drift-meter/blob/main/CHANGELOG.md">the changelog</a> records every version and what changed.
    </div>
  </main>
</body>
</html>
`;
}
