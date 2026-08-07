import { describe, expect, it } from 'vitest';
import { PROVENANCE_ROWS } from '../content/process.js';
import type { ReviewerStatus, SourceGrade } from '../content/types.js';
// The stylesheet as text, through the bundler rather than through `node:fs`. The
// application has no filesystem and its tests do not get one either.
import tokens from '../styles/tokens.css?raw';
import type { Tone } from './tone.js';
import { gradeTone, statusTone } from './tone.js';

/**
 * Tones, and the promise that each one is actually bound to a colour.
 *
 * CLAUDE.md puts hex literals in `tokens.css` and nowhere else, which means the
 * link between a role name and a colour is a CSS attribute selector — and a role
 * with no selector fails by rendering an unstyled row rather than by throwing.
 * That is the failure this file exists to catch, so it reads the stylesheet.
 */

const GRADES: readonly SourceGrade[] = [
  'Flagged',
  'Secondary',
  'Primary available',
  'Primary',
  'Corrected',
];

const STATUSES: readonly ReviewerStatus[] = [
  'Not recruited',
  'Not assigned',
  'Planned before collection',
];

function bound(tone: Tone): boolean {
  return tokens.includes(`[data-tone='${tone}']`);
}

describe('gradeTone', () => {
  it('maps every grade', () => {
    for (const grade of GRADES) {
      expect(gradeTone(grade), grade).toBeTypeOf('string');
    }
  });

  it('reserves the unmet-obligation tone for the grade that means not cleared', () => {
    // `SOURCES.md` says a flagged row is not cleared for publication. It is the
    // only grade that means an obligation is outstanding, so it is the only one
    // that gets that tone.
    expect(gradeTone('Flagged')).toBe('open');
    for (const grade of GRADES.filter((g) => g !== 'Flagged')) {
      expect(gradeTone(grade), grade).not.toBe('open');
    }
  });

  it('gives the self-verifying row the only settled tone', () => {
    expect(gradeTone('Primary')).toBe('kept');
  });
});

describe('statusTone', () => {
  it('maps every status, and none of them to a settled tone', () => {
    // Nobody has read this yet. If a status ever means someone has, it will need a
    // tone that is not on this list, and this assertion is where that surfaces.
    for (const status of STATUSES) {
      expect(statusTone(status), status).not.toBe('kept');
    }
  });
});

describe('the stylesheet', () => {
  it('binds every tone the mapping functions can return', () => {
    for (const grade of GRADES) {
      expect(bound(gradeTone(grade)), `${grade} → ${gradeTone(grade)}`).toBe(true);
    }
    for (const status of STATUSES) {
      expect(bound(statusTone(status)), `${status} → ${statusTone(status)}`).toBe(true);
    }
  });

  it('binds every tone the provenance table writes directly', () => {
    for (const row of PROVENANCE_ROWS) {
      expect(bound(row.tone), `${row.label} → ${row.tone}`).toBe(true);
    }
  });

  it('is still the only place a colour is named', () => {
    // The tone bindings resolve to other custom properties, never to a hex. A hex
    // appearing here would be a colour chosen for a role at the point of use.
    const bindings = tokens.match(/\[data-tone='[a-z]+'\]\s*\{[^}]*\}/g) ?? [];
    expect(bindings.length).toBeGreaterThan(0);
    for (const binding of bindings) {
      expect(binding, binding).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });
});
