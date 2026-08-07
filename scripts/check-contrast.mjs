#!/usr/bin/env node
/**
 * Contrast budget.
 *
 * `tokens.css` used to carry its own contrast ratios in a comment. One of them
 * was wrong for three versions — the note claimed 4.76:1 for the value the whole
 * fix rested on, where the real figure is 4.83:1 — and nobody caught it, because
 * a number in a comment is not checked by anything. This is that comment, run.
 *
 * Two halves, and the split matters:
 *
 *   - The HEXES are read out of `src/styles/tokens.css`. Nothing here restates a
 *     colour. Editing a token changes what this script measures, which is the
 *     only arrangement under which the check cannot go stale (CLAUDE.md rule 7:
 *     the denominator comes from the same source as the thing being counted).
 *
 *   - The PAIRINGS are declared below, because which surface a text role sits on
 *     is a fact about the design and not one a stylesheet parser can recover
 *     through the cascade. So the table is the author's, and the arithmetic is
 *     not. To stop the table drifting away from the palette, every token in
 *     tokens.css must appear in it — as text, as non-text, or as a surface — and
 *     an unclassified token fails the run. Adding a colour without saying what it
 *     is for is the failure mode this catches.
 *
 * Thresholds are WCAG 2.2: 4.5:1 for text, 3:1 for large text (>=24px, or >=18.66px
 * bold), from SC 1.4.3. Non-text is reported and not enforced — SC 1.4.11 asks
 * 3:1 of a graphic only where it carries information the reader needs, and that
 * is a judgement rather than a computation. Where this repository has made that
 * judgement, it is written next to the pair.
 *
 * `tests/axe.spec.ts` runs the same rule the other way round, against the real
 * rendered DOM in a browser. This script covers what that cannot: tokens no
 * screen has consumed yet. Three of the thirteen screens are still stubs, so
 * that is not a hypothetical.
 */
import { readFileSync } from 'node:fs';

const TOKENS = 'src/styles/tokens.css';

/** SC 1.4.3. Large is >=24px, or >=18.66px bold. */
const AA_TEXT = 4.5;
const AA_LARGE = 3;
/** SC 1.4.11, for reference in the report. Not enforced — see the header. */
const NON_TEXT = 3;

/**
 * Every text role, the surface it renders on, and where.
 *
 * `size` is the smallest px size the role is used at, because the threshold
 * depends on it and the smallest use is the one that has to pass. `large: true`
 * says the role is only ever set at >=24px, or >=18.66px bold.
 */
const TEXT = [
  // --- The instrument: src/styles/app.css on --dm-bg, or on a panel ----------
  {
    fg: '--dm-ink',
    bg: '--dm-bg',
    size: 34,
    where: '.dm-heading, .dm-readout-figure',
    large: true,
  },
  { fg: '--dm-ink', bg: '--dm-bg', size: 13.5, where: '.dm-slider-value, .dm-radio[aria-checked]' },
  { fg: '--dm-ink-serif', bg: '--dm-bg', size: 19, where: '.dm-standfirst' },
  { fg: '--dm-ink-body', bg: '--dm-bg', size: 13.5, where: '.dm-slider-label, .dm-row-value' },
  { fg: '--dm-ink-body', bg: '--dm-card', size: 13.5, where: '.dm-radio, .dm-table tbody th' },
  { fg: '--dm-ink-tertiary', bg: '--dm-bg', size: 15, where: 'declared; no consumer yet' },
  { fg: '--dm-muted', bg: '--dm-bg', size: 11, where: '.dm-panel-heading, .dm-bar-series' },
  { fg: '--dm-muted', bg: '--dm-card', size: 11, where: '.dm-panel-heading inside .dm-panel' },
  { fg: '--dm-muted', bg: '--orange-panel', size: 11, where: '.dm-supplied-heading' },
  { fg: '--dm-muted-soft', bg: '--dm-bg', size: 11, where: 'declared; no consumer yet' },
  {
    fg: '--green',
    bg: '--dm-bg',
    size: 11.5,
    where: '.dm-disclosure, .dm-kicker, .dm-button-ghost',
  },
  { fg: '--green', bg: '--orange-panel', size: 11.5, where: '.dm-disclosure inside .dm-supplied' },
  { fg: '--green', bg: '--dm-card', size: 13.5, where: '.dm-radio-mark' },
  { fg: '--green-deep', bg: '--dm-bg', size: 15, where: 'hover, italic key columns' },
  { fg: '--orange', bg: '--dm-bg', size: 11, where: '.dm-rule-number, .dm-flag[aria-pressed]' },
  { fg: '--orange', bg: '--dm-card', size: 13, where: '.dm-flag[aria-pressed] inside a panel' },
  { fg: '--dm-on-dark', bg: '--green', size: 14, where: '.dm-button-solid' },
  { fg: '--dm-on-dark', bg: '--dm-ink', size: 15, where: 'the dark panel' },
  { fg: '--dm-on-dark-soft', bg: '--dm-ink', size: 11, where: 'the dark panel, muted' },
  { fg: '--green-pale', bg: '--dm-ink', size: 11, where: '--dm-on-dark-eyebrow' },
  { fg: '--red-on-dark', bg: '--dm-ink', size: 11, where: 'flagged sources on a dark panel' },
  { fg: '--red', bg: '--dm-bg', size: 13, where: 'flagged sources, cut items' },
  { fg: '--blue', bg: '--dm-bg', size: 11.5, where: "[data-accent='unassisted'] .dm-kicker" },
  { fg: '--fail', bg: '--dm-ink', size: 11, where: 'rubric fail marker (#18)' },
  { fg: '--pass', bg: '--dm-ink', size: 11, where: 'rubric pass marker (#18)' },

  // --- The prose pages: src/styles/prose.css on --prose-bg, or on the card ---
  { fg: '--prose-ink', bg: '--prose-bg', size: 12, where: '.essay strong, body default' },
  { fg: '--prose-ink-index', bg: '--prose-bg', size: 15, where: 'body.page-index' },
  { fg: '--prose-ink-article', bg: '--prose-bg', size: 17, where: 'article p' },
  { fg: '--prose-ink-essay', bg: '--prose-bg', size: 17, where: 'p.essay' },
  { fg: '--prose-ink-body', bg: '--prose-bg', size: 15, where: 'sans body copy' },
  { fg: '--prose-ink-strong', bg: '--prose-bg', size: 15, where: 'strong' },
  { fg: '--prose-series-ink', bg: '--prose-bg', size: 11, where: 'the unassisted series label' },
  { fg: '--prose-muted', bg: '--prose-bg', size: 10.5, where: '.kicker, captions, footer' },
  { fg: '--prose-muted', bg: '--prose-card', size: 10.5, where: 'captions on .prose-card' },
  {
    fg: '--prose-muted-soft',
    bg: '--prose-bg',
    size: 11,
    where: '.back, .byline, .eyebrow, .spec-label, .note-line',
  },
  { fg: '--prose-muted-soft', bg: '--prose-card', size: 11, where: '.spec-label on the card' },
  { fg: '--prose-legend', bg: '--prose-bg', size: 11, where: '.legend' },
  { fg: '--prose-desc', bg: '--prose-bg', size: 15, where: '.idx-desc' },
  { fg: '--prose-closer', bg: '--prose-bg', size: 17, where: 'the closing paragraph' },
  { fg: '--prose-on-accent', bg: '--green', size: 14, where: 'text on a green button' },
  { fg: '--green', bg: '--prose-bg', size: 15, where: 'inline links, .standfirst' },
  { fg: '--red', bg: '--prose-bg', size: 13, where: 'flagged sources' },
  { fg: '--blue', bg: '--prose-bg', size: 13, where: 'the control series' },
];

/**
 * Text that WCAG itself exempts, with the clause named.
 *
 * One pair, and it is not a loophole: SC 1.4.3 says in terms that "text or images
 * of text that are part of an inactive user interface component" have no contrast
 * requirement. A disabled button that read as clearly as an enabled one would have
 * lost the thing that says it is disabled.
 *
 * The ratio is still printed. An exemption is a reason not to fail, not a reason
 * not to look — and 4.45:1 is close enough to the threshold that the next change
 * to either token is worth seeing.
 */
const EXEMPT_TEXT = [
  {
    fg: '--dm-muted',
    bg: '--dm-track',
    size: 14,
    where: '.dm-button:disabled — the confidence gate, and Round 3 before its commits',
    exemption: 'SC 1.4.3: part of an inactive user interface component.',
  },
];

/**
 * Non-text roles: rules, tracks, bar fills, control borders.
 *
 * Reported, not enforced. `note` says why, one pair at a time, so that an
 * exemption is a sentence somebody wrote rather than an absence.
 */
const NON_TEXT_PAIRS = [
  {
    fg: '--dm-rule',
    bg: '--dm-bg',
    where: 'hairlines, slider track, control borders',
    note: 'A .dm-radio in its unselected state is bounded by this. State is carried by the ◉/○ glyph and by the border switching to --green, both well over 3:1, so the boundary itself is not what identifies the control.',
  },
  {
    fg: '--dm-rule-dashed',
    bg: '--dm-card',
    where: '.dm-evidence-body left rule',
    note: 'Decorative indent.',
  },
  { fg: '--dm-card-rule', bg: '--dm-card', where: '.dm-panel border', note: 'Decorative.' },
  { fg: '--dm-track', bg: '--dm-bg', where: '.dm-bar-track', note: 'The unfilled part of a bar.' },
  {
    fg: '--dm-track-alt',
    bg: '--dm-track',
    where: '.dm-bar-undefined hatching',
    note: 'The hatch says "no measure here". It is also stated as the literal text n/a in .dm-bar-value and in the bar\'s aria-label, so the hatching is not the only carrier.',
  },
  { fg: '--green', bg: '--dm-track', where: '.dm-bar-assisted', note: 'Over 3:1 already.' },
  {
    fg: '--blue-bar',
    bg: '--dm-track',
    where: '.dm-bar-unassisted',
    note: "UNDER 3:1. Every bar prints its value beside it and repeats it in aria-label, so nothing is available only from the fill — but this is the one pair here where the reasoning is doing work rather than confirming a pass. Recorded in SOURCES.md and CHANGELOG.md as found and not fixed: darkening it is a change to the debrief's chart, which is the author's call and not the sweep's.",
  },
  {
    fg: '--green-border',
    bg: '--dm-bg',
    where: '.dm-button-ghost border',
    note: 'The button is identified by its label and its --green text at 6:1, not by its border.',
  },
  {
    fg: '--green-rule',
    bg: '--dm-bg',
    where: '.dm-disclosure underline',
    note: 'Decorative; the label carries the affordance.',
  },
  {
    fg: '--orange-rule',
    bg: '--orange-panel',
    where: 'rule beside a supplied estimate; no consumer',
    note: 'Decorative.',
  },
  { fg: '--dm-on-dark-rule', bg: '--dm-ink', where: 'rules on a dark panel', note: 'Decorative.' },
  {
    fg: '--dm-dark-hover',
    bg: '--dm-ink',
    where: 'hover on a dark panel',
    note: 'Hover feedback, not state.',
  },
  {
    fg: '--dm-decor',
    bg: '--dm-bg',
    where: 'NON-TEXT only; no consumer',
    note: 'Retained from the pre-v0.6 palette.',
  },
  {
    fg: '--dm-decor-alt',
    bg: '--dm-bg',
    where: 'NON-TEXT only; no consumer',
    note: 'Retained from the pre-v0.6 palette.',
  },
  {
    fg: '--prose-rule',
    bg: '--prose-bg',
    where: 'section and footer hairlines',
    note: 'Decorative.',
  },
  {
    fg: '--prose-rule-soft',
    bg: '--prose-bg',
    where: 'specimen border, row rules',
    note: 'Decorative.',
  },
  {
    fg: '--prose-track',
    bg: '--prose-bg',
    where: 'bar track',
    note: 'The unfilled part of a bar.',
  },
  {
    fg: '--prose-sep',
    bg: '--prose-bg',
    where: 'the · · · section break in atrophy.html',
    note: 'Text in the DOM and pure decoration in fact — the paragraph gap is what marks the section, and the middots are the one thing in either palette that is genuinely ornamental. SC 1.4.3 exempts pure decoration by name. axe reports the five separators anyway, correctly, because they are visible text; tests/axe.spec.ts drops that one rule on that one selector and asserts the exemption still matches something. The separators also carry aria-hidden, which is a separate point: it stops a screen reader announcing five sets of middots, and does nothing for contrast.',
  },
  {
    fg: '--prose-decor',
    bg: '--prose-bg',
    where: 'NON-TEXT only; no consumer',
    note: 'Retained from the pre-v0.6 palette.',
  },
];

/** Surfaces: tokens that are a background rather than a foreground. */
const SURFACES = [
  '--dm-bg',
  '--dm-card',
  '--dm-ink',
  '--orange-panel',
  '--green',
  '--prose-bg',
  '--prose-card',
];

/**
 * Tokens that are another token under a second name.
 *
 * Classified rather than paired, and the classification is checked: the script
 * asserts each one resolves to the same hex as the token it claims to be, so an
 * alias that quietly stops being one fails here rather than escaping the table.
 */
const ALIASES = [
  { name: '--dm-on-dark-eyebrow', sameAs: '--green-pale' },
  { name: '--dm-accent-assisted', sameAs: '--green' },
];

/**
 * The accent indirection.
 *
 * `--accent` has no value of its own. Six `[data-accent=…]` blocks bind it, and
 * this is what lets domain code return a role name and never a colour. It is not
 * a palette entry, so it is not paired — instead every value it is bound to has
 * to be a token that already appears as a foreground above, which is the property
 * that actually matters: an accent can only ever be a colour this table measured.
 */
const INDIRECTION = '--accent';

/** Tokens that are not colours and so have no ratio. */
const NOT_A_COLOUR = /^--(font|measure)-/;

// ---------------------------------------------------------------------------
// The arithmetic. WCAG 2.2, "relative luminance" and "contrast ratio".
// ---------------------------------------------------------------------------

function channel(eightBit) {
  const SRGB = eightBit / 255;
  const KNEE = 0.03928;
  const SLOPE = 12.92;
  const OFFSET = 0.055;
  const SCALE = 1.055;
  const GAMMA = 2.4;
  return SRGB <= KNEE ? SRGB / SLOPE : Math.pow((SRGB + OFFSET) / SCALE, GAMMA);
}

function luminance(hex) {
  const R = [0.2126, 0.7152, 0.0722];
  const bytes = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return bytes.reduce((total, byte, i) => total + R[i] * channel(byte), 0);
}

function contrast(a, b) {
  const FUDGE = 0.05;
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + FUDGE) / (Math.min(la, lb) + FUDGE);
}

// ---------------------------------------------------------------------------
// Reading the palette.
// ---------------------------------------------------------------------------

/**
 * Every `--name: value;` in tokens.css, keeping all of them.
 *
 * All, not the last: `--accent` is declared six times and the six are the point.
 */
function readTokens(css) {
  const found = new Map();
  const declaration = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gim;
  let match;
  while ((match = declaration.exec(css)) !== null) {
    const list = found.get(match[1]) ?? [];
    list.push(match[2].trim());
    found.set(match[1], list);
  }
  return found;
}

/** Follow `var(--other)` to the hex it ends at. */
function resolveValue(tokens, value, seen) {
  const hex = /^#[0-9a-f]{6}$/i.exec(value);
  if (hex !== null) return value.toLowerCase();
  const alias = /^var\(\s*(--[a-z0-9-]+)\s*\)$/i.exec(value);
  if (alias !== null) return resolve(tokens, alias[1], seen);
  return null;
}

function resolve(tokens, name, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const values = tokens.get(name);
  if (values === undefined) return null;
  return resolveValue(tokens, values[values.length - 1], seen);
}

const css = readFileSync(TOKENS, 'utf8');
const tokens = readTokens(css);
const failures = [];
const rows = [];

function ratioFor(pair) {
  const fg = resolve(tokens, pair.fg);
  const bg = resolve(tokens, pair.bg);
  if (fg === null) {
    failures.push(`${pair.fg} is paired in check-contrast.mjs and is not a colour in ${TOKENS}`);
    return null;
  }
  if (bg === null) {
    failures.push(`${pair.bg} is paired in check-contrast.mjs and is not a colour in ${TOKENS}`);
    return null;
  }
  return { fg, bg, ratio: contrast(fg, bg) };
}

for (const pair of TEXT) {
  const measured = ratioFor(pair);
  if (measured === null) continue;
  const threshold = pair.large === true ? AA_LARGE : AA_TEXT;
  const passes = measured.ratio >= threshold;
  rows.push({ kind: 'text', pair, ...measured, threshold, passes });
  if (!passes) {
    failures.push(
      `${pair.fg} ${measured.fg} on ${pair.bg} ${measured.bg} is ${measured.ratio.toFixed(2)}:1, ` +
        `under ${String(threshold)}:1 for text at ${String(pair.size)}px — ${pair.where}`,
    );
  }
}

for (const pair of EXEMPT_TEXT) {
  const measured = ratioFor(pair);
  if (measured === null) continue;
  rows.push({ kind: 'exempt', pair, ...measured, threshold: AA_TEXT, passes: true });
}

for (const pair of NON_TEXT_PAIRS) {
  const measured = ratioFor(pair);
  if (measured === null) continue;
  rows.push({
    kind: 'non-text',
    pair,
    ...measured,
    threshold: NON_TEXT,
    passes: measured.ratio >= NON_TEXT,
  });
}

// An alias has to still be one.
for (const { name, sameAs } of ALIASES) {
  const here = resolve(tokens, name);
  const there = resolve(tokens, sameAs);
  if (here === null || there === null || here !== there) {
    failures.push(
      `${name} is classified as an alias of ${sameAs} and resolves to ${String(here)} ` +
        `where ${sameAs} resolves to ${String(there)}. Either restore the alias or pair it as ` +
        `a colour of its own.`,
    );
  }
}

// Every accent an element can take must be a colour this table has measured.
const measuredForegrounds = new Set(TEXT.map((p) => resolve(tokens, p.fg)));
for (const binding of tokens.get(INDIRECTION) ?? []) {
  const hex = resolveValue(tokens, binding, new Set());
  if (hex === null || !measuredForegrounds.has(hex)) {
    failures.push(
      `${INDIRECTION} is bound to ${binding} (${String(hex)}), which is not a foreground ` +
        `measured above. An accent may only be a colour this table has checked.`,
    );
  }
}

// Every colour token must be classified. A new hex with no pairing is the way
// this table goes quietly out of date.
const classified = new Set([
  ...TEXT.flatMap((p) => [p.fg, p.bg]),
  ...EXEMPT_TEXT.flatMap((p) => [p.fg, p.bg]),
  ...NON_TEXT_PAIRS.flatMap((p) => [p.fg, p.bg]),
  ...SURFACES,
  ...ALIASES.map((a) => a.name),
  INDIRECTION,
]);
const unclassified = [...tokens.keys()].filter(
  (name) => !NOT_A_COLOUR.test(name) && !classified.has(name),
);
for (const name of unclassified) {
  failures.push(
    `${name} is declared in ${TOKENS} and appears in no pairing here. ` +
      `Add it to TEXT, to NON_TEXT_PAIRS, to SURFACES or to ALIASES — saying which it is, ` +
      `is the check.`,
  );
}

// ---------------------------------------------------------------------------
// The report.
// ---------------------------------------------------------------------------

function line(row) {
  const mark = row.passes ? ' ' : row.kind === 'text' ? '✗' : '·';
  const ratio = `${row.ratio.toFixed(2)}:1`.padStart(7);
  return `  ${mark} ${ratio}  ${row.pair.fg} on ${row.pair.bg}  — ${row.pair.where}`;
}

console.log(`check-contrast: ${String(tokens.size)} tokens in ${TOKENS}`);
console.log(`\nText — ${String(AA_TEXT)}:1, or ${String(AA_LARGE)}:1 large (WCAG 2.2 SC 1.4.3)`);
for (const row of rows.filter((r) => r.kind === 'text')) console.log(line(row));

console.log('\nText that WCAG exempts. Measured anyway, and not enforced.');
for (const row of rows.filter((r) => r.kind === 'exempt')) {
  console.log(line(row));
  console.log(`      ${row.pair.exemption}`);
}

console.log(
  `\nNon-text — ${String(NON_TEXT)}:1 where it carries information (SC 1.4.11). Reported, not enforced.`,
);
for (const row of rows.filter((r) => r.kind === 'non-text')) {
  console.log(line(row));
  if (!row.passes) console.log(`      under ${String(NON_TEXT)}:1 — ${row.pair.note}`);
}

const under = rows.filter((r) => r.kind === 'non-text' && !r.passes).length;
console.log(
  `\ncheck-contrast: ${String(rows.filter((r) => r.kind === 'text').length)} text pairings enforced, ` +
    `${String(rows.filter((r) => r.kind === 'exempt').length)} exempt, ` +
    `${String(rows.filter((r) => r.kind === 'non-text').length)} non-text, ` +
    `${String(under)} non-text under ${String(NON_TEXT)}:1 and reasoned about above.`,
);

if (failures.length > 0) {
  console.error('\ncheck-contrast: failed');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('\nEither move the token to a value that clears the threshold — staying inside');
  console.error('the palette — or, if it is not text, move it to NON_TEXT_PAIRS with a reason.');
  process.exit(1);
}
