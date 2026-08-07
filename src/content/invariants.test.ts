import { describe, expect, it } from 'vitest';
import * as armsModule from './arms.js';
import * as debriefModule from './debrief.js';
import * as round3Module from './round3.js';
import * as shellModule from './shell.js';
import * as slatesModule from './slates.js';
import * as specModule from './spec.js';
import * as transferModule from './transfer.js';
import * as trapModule from './trap.js';
import type { Slate, TrapBranch } from './types.js';

const { ARM_NOTES, ARMS, recSentencePrefix, REC_LABELS } = armsModule;
const { otherSlate, SLATES } = slatesModule;
const { TRAP, TRAP_HEADINGS } = trapModule;

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

describe('recommendation prefix', () => {
  /**
   * recSentencePrefix strips a possessive off the arm's own label with a regex,
   * so the label and the regex are one thing edited in two places. Normalising
   * the labels' apostrophe, or renaming the suffix on either side alone, leaves
   * the stripping silently inert and the page reading "Claude’s read
   * recommends: ". Nothing else in the codebase would notice.
   */
  const ATTRIBUTED = [ARMS.ai, ARMS.human] as const;

  it('reads as a sentence in every arm', () => {
    expect(recSentencePrefix(ARMS.ai)).toBe('Claude recommends: ');
    expect(recSentencePrefix(ARMS.human)).toBe('Programme officer recommends: ');
    expect(recSentencePrefix(ARMS.unlabelled)).toBe('Filed recommendation: ');
  });

  it('strips the possessive rather than carrying the label through whole', () => {
    for (const arm of ATTRIBUTED) {
      const prefix = recSentencePrefix(arm);
      expect(prefix.startsWith(arm.label), arm.key).toBe(false);
      expect(prefix, arm.key).not.toContain('read');
      expect(prefix, arm.key).not.toMatch(/['’]/);
      expect(prefix, arm.key).toMatch(/ recommends: $/);
    }
  });

  it('keeps the labels in the shape the stripping expects', () => {
    // The other half of the coupling: if a label stops ending this way, the
    // regex above it has nothing to remove.
    for (const arm of ATTRIBUTED) {
      expect(arm.label, arm.key).toMatch(/’s read$/);
    }
  });

  it('names no source in the unattributed arm', () => {
    // Withholding the source is what that arm is for, so the passive
    // construction is load-bearing rather than stylistic.
    const prefix = recSentencePrefix(ARMS.unlabelled);
    expect(prefix).not.toContain(ARMS.unlabelled.label);
    expect(prefix).not.toContain(ARMS.unlabelled.who);
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

  /**
   * The walk is derived from the module namespaces rather than from a list of
   * records typed out here. An earlier version named four records by hand and so
   * checked neither REC_LABELS nor TRAP_HEADINGS — seven on-screen strings that
   * nothing was reading. Anything a content module exports is now checked by the
   * act of exporting it, which is what carried the screen copy in here: the five
   * modules the rebuilt screens brought with them are covered because they are
   * content modules, not because anyone remembered to list them.
   */
  const MODULES = {
    arms: armsModule,
    debrief: debriefModule,
    round3: round3Module,
    shell: shellModule,
    slates: slatesModule,
    spec: specModule,
    transfer: transferModule,
    trap: trapModule,
  };

  const fields: Array<[string, string]> = [];
  for (const [name, mod] of Object.entries(MODULES)) proseOf(mod, name, fields);

  it('has prose to check from every content module', () => {
    expect(fields.length).toBeGreaterThan(100);
    for (const name of Object.keys(MODULES)) {
      expect(
        fields.some(([path]) => path.startsWith(`${name}.`)),
        name,
      ).toBe(true);
    }
  });

  it("uses ’ rather than ' everywhere", () => {
    // Flat, not positional. The earlier form matched letter-apostrophe-letter
    // only, which left a trailing possessive (programmes'), a leading elision
    // ('tis, '90s), a digit (1990's) and an accented stem (café's) all passing.
    // No content string has a use for U+0027, so the ban is the whole rule.
    for (const [path, text] of fields) {
      expect(text, path).not.toContain("'");
    }
  });

  it('uses no straight double quotes', () => {
    for (const [path, text] of fields) {
      expect(text, path).not.toContain('"');
    }
  });
});
