import { describe, expect, it } from 'vitest';
import { ARM_NOTES, ARMS, REC_LABELS } from './arms.js';
import { DEBRIEF, MEASURES } from './debrief.js';
import { ROUND3 } from './round3.js';
import { CONSENT, INTRO, RATE, ROUND, SCREENS, STUB } from './shell.js';
import { SPEC_INTRO, SPEC_RULES } from './spec.js';
import { TRANSFER } from './transfer.js';
import { otherSlate, SLATES } from './slates.js';
import { TRAP, TRAP_HEADINGS } from './trap.js';
import type { Slate, TrapBranch } from './types.js';

/**
 * Structural facts about the content, asserted so that editing it cannot quietly
 * break the instrument. A slate with a trap index pointing past the end of its
 * cases, or a prose field with a straight quote in it, would both ship silently
 * otherwise.
 */

const slates: readonly Slate[] = [SLATES.A, SLATES.B];
const ALL_BRANCHES: readonly TrapBranch[] = [
  'caught',
  'flaggedNotChecked',
  'missFund',
  'missAccepted',
  'missOpened',
  'miss',
];

describe('slate shape', () => {
  it('each slate has three cases of three assumptions', () => {
    for (const slate of slates) {
      expect(slate.cases, slate.id).toHaveLength(3);
      for (const c of slate.cases) expect(c.a, c.org).toHaveLength(3);
    }
  });

  it('every slider range is ordered and steppable', () => {
    for (const slate of slates) {
      for (const c of slate.cases) {
        for (const sp of c.a) {
          const where = `${c.org} / ${sp.label}`;
          expect(sp.min, where).toBeLessThan(sp.max);
          expect(sp.step, where).toBeGreaterThan(0);
          expect(sp.step, where).toBeLessThanOrEqual(sp.max - sp.min);
          expect(sp.dp, where).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it('every supplied value sits inside its own range', () => {
    // A supplied value outside its slider could not be represented on screen, and
    // framing autonomy would score against a figure the reader never saw.
    for (const slate of slates) {
      for (const c of slate.cases) {
        for (const sp of c.a) {
          const where = `${c.org} / ${sp.label}`;
          expect(sp.provided, where).toBeGreaterThanOrEqual(sp.min);
          expect(sp.provided, where).toBeLessThanOrEqual(sp.max);
        }
      }
    }
  });

  it('trap and Round 3 indices point at cases that exist', () => {
    for (const slate of slates) {
      expect(slate.trapCase, slate.id).toBeGreaterThanOrEqual(0);
      expect(slate.trapCase, slate.id).toBeLessThan(slate.cases.length);
      expect(slate.trapSlider, slate.id).toBeGreaterThanOrEqual(0);
      expect(slate.trapSlider, slate.id).toBeLessThan(slate.cases[slate.trapCase]!.a.length);
      for (const i of slate.r3) {
        expect(i, slate.id).toBeGreaterThanOrEqual(0);
        expect(i, slate.id).toBeLessThan(slate.cases.length);
      }
    }
  });

  it('Round 3 replays two distinct cases', () => {
    for (const slate of slates) {
      expect(new Set(slate.r3).size, slate.id).toBe(2);
    }
  });

  it('each slate carries exactly one planted error, and the two slates hide it differently', () => {
    // Slate A misstates a cost; slate B misstates a rate. Same move, different
    // clothes — which is what makes the transfer check meaningful.
    expect(SLATES.A.cases[SLATES.A.trapCase].a[SLATES.A.trapSlider].unit).toBe('$');
    expect(SLATES.B.cases[SLATES.B.trapCase].a[SLATES.B.trapSlider].unit).toBe('%');
  });

  it('the evidence panel of each trap case contains the fact that undoes the headline', () => {
    // If this ever stopped being true the trap would be unfair rather than
    // instructive: the reader has to be able to find it.
    expect(SLATES.A.cases[SLATES.A.trapCase].evidence).toContain('commodity cost');
    expect(SLATES.B.cases[SLATES.B.trapCase].evidence).toContain('access and use');
  });

  it('otherSlate pairs the two slates', () => {
    expect(otherSlate('A')).toBe('B');
    expect(otherSlate('B')).toBe('A');
  });
});

describe('trap copy', () => {
  it('covers every branch for both slates with real prose', () => {
    for (const id of ['A', 'B'] as const) {
      for (const branch of ALL_BRANCHES) {
        const copy = TRAP[id][branch];
        expect(copy, `${id}/${branch}`).toBeTypeOf('string');
        expect(copy.length, `${id}/${branch}`).toBeGreaterThan(80);
      }
    }
  });

  it('names the right figure in each slate', () => {
    for (const branch of ALL_BRANCHES) {
      expect(TRAP.A[branch], `A/${branch}`).toMatch(/\$2|bednet/);
      expect(TRAP.B[branch], `B/${branch}`).toMatch(/80%|chlorination/);
    }
  });

  it('has a heading for every heading key', () => {
    for (const value of Object.values(TRAP_HEADINGS)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe('attribution arms', () => {
  it('has three arms with distinct tags', () => {
    const tags = Object.values(ARMS).map((a) => a.tag);
    expect(new Set(tags).size).toBe(3);
  });

  it('gives every arm a debrief note that says a re-run may differ', () => {
    // So a reader does not mistake their single assignment for the finding.
    for (const key of ['ai', 'human', 'unlabelled'] as const) {
      expect(ARM_NOTES[key], key).toContain('Run it again');
    }
  });

  it('says explicitly that no AI was involved in the human-attributed arm', () => {
    expect(ARM_NOTES.human).toContain('no AI was involved');
  });

  it('labels all three decisions', () => {
    expect(Object.keys(REC_LABELS).sort()).toEqual(['fund', 'investigate', 'pass']);
  });
});

describe('typography', () => {
  /**
   * The writing uses typographic quotes and dashes throughout. A straight
   * apostrophe would be invisible in review and wrong on the page, so it is
   * asserted rather than trusted.
   */
  function proseOf(value: unknown, path: string, out: Array<[string, string]>): void {
    if (typeof value === 'string') {
      out.push([path, value]);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => proseOf(v, `${path}[${String(i)}]`, out));
    } else if (value !== null && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) proseOf(v, `${path}.${k}`, out);
    }
  }

  const fields: Array<[string, string]> = [];
  proseOf(SLATES, 'SLATES', fields);
  proseOf(TRAP, 'TRAP', fields);
  proseOf(ARMS, 'ARMS', fields);
  proseOf(ARM_NOTES, 'ARM_NOTES', fields);
  // The shell's copy is prose on a page like any other, so it joins the walk in
  // the change that introduces it rather than after someone notices.
  proseOf(SCREENS, 'SCREENS', fields);
  proseOf(INTRO, 'INTRO', fields);
  proseOf(CONSENT, 'CONSENT', fields);
  proseOf(ROUND, 'ROUND', fields);
  proseOf(RATE, 'RATE', fields);
  proseOf(STUB, 'STUB', fields);
  proseOf(DEBRIEF, 'DEBRIEF', fields);
  proseOf(MEASURES, 'MEASURES', fields);
  proseOf(TRANSFER, 'TRANSFER', fields);
  proseOf(ROUND3, 'ROUND3', fields);
  proseOf(SPEC_INTRO, 'SPEC_INTRO', fields);
  proseOf(SPEC_RULES, 'SPEC_RULES', fields);
  // Two on-screen records that were imported and asserted elsewhere but never
  // walked for typography. Closed here rather than left for someone to notice.
  proseOf(REC_LABELS, 'REC_LABELS', fields);
  proseOf(TRAP_HEADINGS, 'TRAP_HEADINGS', fields);

  it('has prose to check', () => {
    expect(fields.length).toBeGreaterThan(50);
  });

  it("uses ’ rather than ' inside words", () => {
    for (const [path, text] of fields) {
      // A straight apostrophe between letters is always a typographic error here.
      expect(text, path).not.toMatch(/[A-Za-z]'[A-Za-z]/);
    }
  });

  it('uses no straight double quotes', () => {
    for (const [path, text] of fields) {
      expect(text, path).not.toContain('"');
    }
  });
});
