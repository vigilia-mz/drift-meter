/**
 * The protocol renderer, against content it has never seen.
 *
 * `tests/protocol.spec.ts` checks the real page in a real browser and is the one
 * that would catch a measure going missing. This is the other half: the renderer
 * given synthetic content, so that what is asserted is the rendering rather than
 * the protocol. The same split as `metrics.test.ts` running its assertions against
 * slates of other shapes — a test that only ever sees the real seven measures would
 * pass on a renderer that had the number seven written into it.
 *
 * Escaping is the reason this file is in the fast suite rather than only in the
 * browser one. A page assembled by string concatenation from a module full of
 * ampersands and typographic quotes has exactly one interesting failure mode, and it
 * fails silently: the character is swallowed, the markup still parses, and the page
 * looks fine to everything except a reader who wanted the sentence.
 */
import { describe, expect, it } from 'vitest';
import { renderProtocol } from './render-protocol.mjs';

/** A protocol of two measures and one prediction. Deliberately not the real shape. */
const CONTENT = {
  method: {
    standfirst: 'A standfirst.',
    designHeading: '1 · Design',
    designLead: 'A design lead.',
    designRows: [{ label: 'Order', value: 'Counterbalanced.' }],
    armsHeading: '2 · Arms',
    armsLead: 'An arms lead.',
    armsColumns: { arm: 'Arm', supplied: 'Supplied', isolates: 'Isolates' },
    measuresHeading: '3 · Measures',
    measuresLead: 'A measures lead.',
    measuresFields: { definition: 'What is counted', formula: 'Formula', threat: 'Threat' },
    measuresNote: 'A note about denominators.',
    primaryOutcomeHeading: 'The primary outcome',
    primaryOutcome: 'The outcome.',
    primaryOutcomeWhy: 'Why.',
    primaryOutcomeLimit: 'What this build does with it.',
    predictionsHeading: '4 · Predictions',
    predictionsLead: 'A predictions lead.',
    predictionsColumns: { id: 'ID', claim: 'Prediction', test: 'What would falsify it' },
    predictionsOrderNote: 'An order note.',
    predictionsCaveat: 'A caveat.',
    provenanceHeading: '5 · Provenance',
    stimulusLead: 'A stimulus lead.',
    stimulusRows: [{ label: 'The cases', value: 'Written for this instrument.' }],
    modelLead: 'A model lead.',
    modelPinLabel: 'Pinned to',
    modelPrintedLabel: 'Printed on the page',
    modelPrinted: 'The ID the API returns.',
    modelDarkLabel: 'In this build',
    modelDark: 'Off.',
    limitsHeading: '6 · Limits',
    limitsLead: 'A limits lead.',
    limits: ['n is zero.', 'A run is one sitting.'],
  },
  measures: [
    {
      key: 'engagement',
      label: 'Evidence engagement',
      definition: 'Whether a case was looked at.',
      formula: 'cases opened ÷ 3 cases × 100',
      threat: 'Binary and sticky.',
    },
    {
      key: 'range',
      label: 'Revision behaviour',
      definition: 'How many assumptions moved.',
      formula: 'sliders moved ÷ 9 sliders × 100',
      threat: 'The rounds do not start from the same place.',
    },
  ],
  predictions: [{ id: 'P1', claim: 'Engagement is lower.', test: 'Engagement equal or higher.' }],
  arms: [{ arm: 'AI-attributed', supplied: 'A figure.', isolates: 'The AI condition.' }],
  title: 'Method',
  pinnedModel: 'claude-opus-5',
  citation: { version: '0.7.0', doi: '10.5281/zenodo.21887595', date: '10 Aug 2026' },
};

function render(overrides = {}) {
  return renderProtocol({ ...CONTENT, ...overrides });
}

describe('the page carries the content it was given', () => {
  it('prints every measure, with its formula and its threat', () => {
    const html = render();
    for (const measure of CONTENT.measures) {
      expect(html).toContain(measure.label);
      expect(html).toContain(measure.formula);
      expect(html).toContain(measure.threat);
    }
  });

  it('prints every prediction with the condition that would falsify it', () => {
    const html = render();
    for (const prediction of CONTENT.predictions) {
      expect(html).toContain(prediction.claim);
      expect(html).toContain(prediction.test);
    }
  });

  it('prints every limit', () => {
    const html = render();
    for (const limit of CONTENT.method.limits) expect(html).toContain(limit);
  });

  /**
   * Not a number this file writes down. Two measures in, two `<li>` out — the point
   * is that the count comes from the content, which is the same reason
   * `src/domain/metrics.ts` derives its denominator from the slate.
   */
  it('renders one entry per measure rather than a fixed number of them', () => {
    const one = render({ measures: CONTENT.measures.slice(0, 1) });
    const two = render();
    expect((one.match(/class="spec-item"/g) ?? []).length).toBe(1);
    expect((two.match(/class="spec-item"/g) ?? []).length).toBe(2);
  });

  it('names the pinned model and the citation it was given', () => {
    const html = render();
    expect(html).toContain('claude-opus-5');
    expect(html).toContain('v0.7.0');
    expect(html).toContain('10.5281/zenodo.21887595');
  });
});

describe('escaping', () => {
  it('escapes the four characters that would otherwise open a tag or an entity', () => {
    const html = render({
      measures: [
        {
          key: 'engagement',
          label: 'A & B',
          definition: 'a < b and b > a',
          formula: 'x ÷ y × 100',
          threat: 'He said "so".',
        },
      ],
    });
    expect(html).toContain('A &amp; B');
    expect(html).toContain('a &lt; b and b &gt; a');
    expect(html).toContain('He said &quot;so&quot;.');
  });

  it('does not double-encode an ampersand', () => {
    const html = render({ method: { ...CONTENT.method, limitsLead: 'Tom & Jerry' } });
    expect(html).toContain('Tom &amp; Jerry');
    expect(html).not.toContain('&amp;amp;');
  });

  /**
   * The content modules are written in typographic quotes — `invariants.test.ts`
   * fails a straight one — and they carry ÷, ×, − and both dashes. All of that is
   * UTF-8 under the charset the page declares, and turning it into entities would
   * make the formulas unreadable in the source of a page whose formulas are the
   * artifact.
   */
  it('leaves typographic and mathematical characters as themselves', () => {
    const html = render();
    expect(html).toContain('÷');
    expect(html).toContain('×');
    expect(html).toContain('<meta charset="utf-8">');
  });

  it('cannot be given content that closes a tag', () => {
    const html = render({
      method: { ...CONTENT.method, standfirst: '</p><script>alert(1)</script>' },
    });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('addressability', () => {
  /**
   * The reason the page exists rather than a nicety. The in-app screen has no URL
   * at all — `src/platform/history.ts` declines to write one — so a reviewer could
   * not cite a section of the protocol before this page, and citing one is most of
   * what a methods reader does with it.
   */
  it('gives every section and every measure a fragment identifier', () => {
    const html = render();
    for (const id of ['design', 'arms', 'measures', 'predictions', 'provenance', 'limits']) {
      expect(html, `no id="${id}"`).toContain(`id="${id}"`);
    }
    for (const measure of CONTENT.measures) {
      expect(html).toContain(`id="measure-${measure.key}"`);
    }
    expect(html).toContain('id="p1"');
  });

  it('names each section by its own heading', () => {
    const html = render();
    expect(html).toContain('<section aria-labelledby="measures">');
    expect(html).toContain('<h2 class="section-heading" id="measures">');
  });
});

describe('the page is a prose page', () => {
  /**
   * `scripts/check-size.mjs` asserts this over the built file and `tests/prose.spec.ts`
   * asserts it over a browser's request log. It is here too because those two run
   * against a build, and this one fails in the fast suite the moment the renderer
   * grows a script tag — which for a page that exists to be readable without
   * JavaScript is the one regression worth catching three times.
   */
  it('carries no script and references no JavaScript', () => {
    const html = render();
    expect(html).not.toMatch(/<script\b/i);
    expect(html).not.toMatch(/\.m?js(\?|#|")/i);
  });

  it('declares the favicon the other pages declare', () => {
    expect(render()).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  });
});
