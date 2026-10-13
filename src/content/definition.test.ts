import { describe, expect, it } from 'vitest';
import indexPage from '../../index.html?raw';
import essayPage from '../../essay.html?raw';
import atrophyPage from '../../atrophy.html?raw';
import readmeFile from '../../README.md?raw';

/**
 * Agential drift has one definition, and every page that defines it uses it.
 *
 * Until v0.10 the site carried three: the landing page and the README had the settled
 * wording, the long essay defined drift as a weakening of the capacity to judge, and
 * the short essay as evaluative independence weakening through delegation. The
 * changelog then said the landing page had taken the long essay's definition, and
 * nobody had checked that against the sentence that does the defining. A reader who
 * arrives from a citation and clicks through should meet one concept.
 *
 * Written out here rather than imported, because there is no content module to import
 * it from: all four carriers are hand-written documents. The README wraps lines, so
 * whitespace is collapsed before the comparison.
 */
const DEFINITION =
  'the incremental transfer of evaluative authority to AI through delegations that each look reasonable';

const flat = (text: string) => text.replace(/\s+/g, ' ');

describe('the definition of agential drift', () => {
  const CARRIERS: ReadonlyArray<readonly [string, string]> = [
    ['index.html', indexPage],
    ['essay.html', essayPage],
    ['atrophy.html', atrophyPage],
    ['README.md', readmeFile],
  ];

  it('is the same sentence on every page that defines it', () => {
    const missing = CARRIERS.filter(([, text]) => !flat(text).includes(DEFINITION)).map(
      ([name]) => name,
    );
    expect(missing.join(', '), 'pages without the settled definition').toBe('');
  });

  it('does not come back in either of the older wordings', () => {
    for (const [name, text] of CARRIERS) {
      expect(flat(text), name).not.toContain(
        'capacity to exercise judgment through habitual reliance',
      );
      expect(flat(text), name).not.toContain('evaluative independence weakening');
    }
  });
});
