import { MEASURES } from './debrief.js';
import { describe, expect, it } from 'vitest';
// The two paperwork files as text, through the bundler rather than through
// `node:fs`. They are part of the artifact, and the two tables on the process
// screen mirror them, so the mirror is checked against the record rather than
// against a memory of it.
import changelogFile from '../../CHANGELOG.md?raw';
import sourcesFile from '../../SOURCES.md?raw';
import * as armsModule from './arms.js';
import * as debriefModule from './debrief.js';
import * as methodModule from './method.js';
import * as processModule from './process.js';
import * as round3Module from './round3.js';
import * as shellModule from './shell.js';
import * as slatesModule from './slates.js';
import * as specModule from './spec.js';
import * as transferModule from './transfer.js';
import * as trapModule from './trap.js';
import type { PredictionRow, Slate, SourceGrade, TrapBranch } from './types.js';

const { ARM_NOTES, ARMS, recSentencePrefix, REC_LABELS } = armsModule;
const { DEBRIEF } = debriefModule;
const { METHOD, PRED_ROWS } = methodModule;
const { CHANGELOG_ROWS, PROCESS, PROVENANCE_ROWS, REVIEWER_ROWS, SOURCE_ROWS } = processModule;
const { CONSENT, INTRO } = shellModule;
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

describe('the registered predictions', () => {
  /**
   * The order is P1, P2, P3, P4, P6, P5.
   *
   * P6 sits before P5 on the published page and is preserved here. It is not a
   * sorting mistake and must not be quietly corrected into numerical sequence:
   * P1 to P4 are contrasts inside one reader's own two rounds, and P6 sits with
   * the trap prediction it follows from rather than at the end. The screen says
   * so; this asserts it.
   */
  const PRINTED_ORDER: readonly PredictionRow['id'][] = ['P1', 'P2', 'P3', 'P4', 'P6', 'P5'];

  it('prints P6 before P5, as the original did', () => {
    expect(PRED_ROWS.map((p) => p.id)).toEqual(PRINTED_ORDER);
  });

  it('registers six, each exactly once', () => {
    expect(new Set(PRED_ROWS.map((p) => p.id)).size).toBe(PRED_ROWS.length);
    expect(PRED_ROWS).toHaveLength(6);
  });

  it('gives every prediction a condition that would defeat it', () => {
    // A prediction with no falsification condition is a hope. The page claims
    // these were registered with one each, and this is that claim.
    for (const row of PRED_ROWS) {
      expect(row.test.length, row.id).toBeGreaterThan(40);
      expect(row.claim.length, row.id).toBeGreaterThan(40);
    }
  });

  it('says on the page why the order is what it is', () => {
    expect(METHOD.predictionsOrderNote).toContain('P6');
    expect(METHOD.predictionsOrderNote).toContain('P5');
  });
});

describe('the protocol screen', () => {
  it('numbers its sections the way SOURCES.md refers to them', () => {
    // `SOURCES.md` sites two claims by section number. Renumbering the screen
    // without updating the file would leave the source table pointing at the
    // wrong part of the page.
    expect(METHOD.designHeading).toMatch(/^1 · /);
    expect(METHOD.provenanceHeading).toMatch(/^5 · /);
  });

  it('does not carry the claim the rebuild withdrew', () => {
    // The Clio row is unpinned and the rebuilt consent screen dropped it. Section
    // 1 is the other place it was cited; citing it from memory here would put the
    // debt back without pinning it.
    expect(JSON.stringify(METHOD)).not.toContain('Clio');
    expect(JSON.stringify(CONSENT)).not.toContain('Clio');
  });

  it('states what the build cannot do before anyone asks', () => {
    expect(METHOD.limits.length).toBeGreaterThanOrEqual(5);
    expect(METHOD.limits.join(' ')).toContain('n is zero');
  });

  it('counts the graded rows the way the source table counts them', () => {
    // Both reference screens state a count in words: how many case figures carry
    // the grade that means built for the exercise, and how many rows are still not
    // cleared for publication. A reader who follows a stale number miscounts the
    // project's own outstanding debt — the exact failure the source table exists
    // to prevent, committed by the pages describing it. The words are written out
    // rather than interpolated, so this can fail.
    const WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six'] as const;
    const countOf = (grade: SourceGrade) => {
      const n = SOURCE_ROWS.filter((r) => r.grade === grade).length;
      const word = WORDS[n];
      expect(word, `no number word for ${String(n)} ${grade} rows`).toBeDefined();
      return String(word);
    };

    const figures = METHOD.stimulusRows.find((r) => r.label === 'The figures');
    expect(figures?.value.toLowerCase()).toContain(`${countOf('Illustrative')} rows`);
    expect(PROCESS.sourcesLead.toLowerCase()).toContain(
      `${countOf('Flagged')} rows still carry it`,
    );
  });

  it('says what the rows still graded flagged actually are', () => {
    // They are no longer case figures. Restating those as illustrative cleared
    // them; what is left are the essays' empirical claims, which a disclosure
    // cannot clear because they are either true and uncited or they are not true.
    for (const row of SOURCE_ROWS.filter((r) => r.grade === 'Flagged')) {
      expect(row.where, row.claim).toContain('essay');
    }
    expect(PROCESS.sourcesLead).toContain('no disclosure can clear them');
  });
});

describe('the process screen', () => {
  it('keeps the retraction in the list', () => {
    // A changelog that quietly loses the version where something was withdrawn is
    // worth less than no changelog, because it looks like one.
    const retraction = CHANGELOG_ROWS.find((e) => e.version === 'v0.2');
    expect(retraction?.title).toContain('removed');
    expect(retraction?.why).toContain('invented numbers');
  });

  it('lists every version the changelog file records, newest first', () => {
    for (const entry of CHANGELOG_ROWS) {
      expect(changelogFile, entry.version).toContain(`## ${entry.version} —`);
    }
    const fileOrder = [...changelogFile.matchAll(/^## (v\d+\.\d+) —/gm)].map((m) => m[1]);
    expect(CHANGELOG_ROWS.map((e) => e.version)).toEqual(fileOrder);
  });

  it('grades the same claims the source file grades', () => {
    // The screen is a mirror of `SOURCES.md` at the length a screen can carry. If
    // a row is added to the file and not to the screen, the page is quietly
    // publishing a shorter table than the one it says it is showing.
    const fileGrades = [...sourcesFile.matchAll(/^### ([A-Z ]+) — /gm)].map((m) =>
      (m[1] ?? '').trim(),
    );
    const screenGrades = SOURCE_ROWS.map((r) => r.grade.toUpperCase());
    expect(screenGrades.length).toBe(fileGrades.length);
    expect([...screenGrades].sort()).toEqual([...fileGrades].sort());
  });

  it('names three readers and says none of them has read it', () => {
    const readers = REVIEWER_ROWS.filter((r) => r.status !== 'Planned before collection');
    expect(readers).toHaveLength(3);
    for (const row of REVIEWER_ROWS) {
      expect(row.status, row.role).not.toBe('Read');
      expect(row.brief.length, row.role).toBeGreaterThan(40);
    }
    expect(PROCESS.reviewersLead).toContain('Nobody, yet');
  });

  it('keeps the row saying what Claude drafted that was cut', () => {
    // All three were produced fluently on request and all three are the thing this
    // project argues against. Retractions stay in.
    const cut = PROVENANCE_ROWS.find((r) => r.tone === 'cut');
    expect(cut?.value).toContain('cohort dashboard');
    expect(cut?.value).toContain('personality verdict');
    expect(cut?.value).toContain('imputed');
  });

  it('says there is one published copy and where it is', () => {
    const where = PROCESS.mastheadRows.find((r) => r.label === 'Where it lives');
    expect(where?.value).toContain('vigilia-mz.github.io/drift-meter');
    expect(where?.value).toContain('One published copy');
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
    method: methodModule,
    process: processModule,
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

describe('the illustrative disclosure', () => {
  /**
   * #7's resolution. The case figures are constructed, and the page now says so
   * rather than a comment in `slates.ts` saying it to nobody. Three screens
   * carry it, and deleting one would otherwise be invisible: the disclosure is
   * prose, so nothing else in this suite would go red.
   */
  const BEFORE_THE_WORK: ReadonlyArray<readonly [string, string]> = [
    ['INTRO.constructed', INTRO.constructed],
    ['CONSENT.constructed', CONSENT.constructed],
  ];

  const EVERYWHERE: ReadonlyArray<readonly [string, string]> = [
    ...BEFORE_THE_WORK,
    ['DEBRIEF.closingCases', DEBRIEF.closingCases],
  ];

  it('calls the figures illustrative on all three screens that carry it', () => {
    for (const [path, text] of EVERYWHERE) {
      expect(text, path).toContain('illustrative');
    }
  });

  it('names no trap case and no trap slider before the reader has worked them', () => {
    // Disclosing that the cases are built is not the same as disclosing which
    // number is wrong. What the instrument observes is whether the reader
    // interrogates the load-bearing figure unprompted, so a disclosure that
    // pointed at the slider would leave nothing to observe. The debrief is
    // exempt: by then the trap has been shown.
    const spoilers = slates.flatMap((slate) => {
      const c = slate.cases[slate.trapCase];
      if (c === undefined) throw new Error(`${slate.id}: trapCase out of range`);
      const sp = c.a[slate.trapSlider];
      if (sp === undefined) throw new Error(`${slate.id}: trapSlider out of range`);
      return [c.org, sp.label];
    });

    // Without this the loop below would pass on an empty list, which is the
    // failure mode this project keeps finding in its own tests.
    expect(spoilers).toHaveLength(slates.length * 2);

    for (const [path, text] of BEFORE_THE_WORK) {
      for (const spoiler of spoilers) {
        expect(text.toLowerCase(), `${path} names ${spoiler}`).not.toContain(spoiler.toLowerCase());
      }
    }
  });
});

describe('what one sitting cannot show', () => {
  /**
   * #38. The programme is named for a claim about change over repeated
   * delegation, and a run is one sitting — so the name on the masthead reaches
   * further than the instrument under it does. Section 6 of the protocol screen
   * carries that limit. The intro screen did not, and the intro screen is what a
   * reader who takes the sixty-second path leaves with.
   *
   * Both carry it now, and the reason to assert it on both is that either could
   * lose it alone without anything else here going red: this is prose, and the
   * two screens are edited by different errands.
   */
  const CARRIERS: ReadonlyArray<readonly [string, string]> = [
    ['INTRO.short', INTRO.short.join(' ')],
    ['METHOD.limits', METHOD.limits.join(' ')],
  ];

  it('names the hypothesis as longitudinal and the run as one sitting, on both screens', () => {
    for (const [path, text] of CARRIERS) {
      expect(text, path).toContain('longitudinal');
      expect(text, path).toContain('one sitting');
    }
  });

  it('says on both screens that the trace is equally consistent with no drift', () => {
    // The deflation is the disclosure. Naming the horizon and leaving the reader
    // to work out what follows would be a limit that reads as rigour while
    // costing the claim nothing, which is the failure this project is about.
    for (const [path, text] of CARRIERS) {
      expect(text, path).toContain('equally consistent');
    }
  });
});

describe('every bar says why it would read n/a', () => {
  it('gives each measure its own reason, and does not reuse the frame one', () => {
    for (const bar of MEASURES) {
      expect(bar.undefinedCaption.length, bar.key).toBeGreaterThan(20);
    }
    // Framing autonomy is undefined because no estimate was supplied; accuracy is
    // undefined because no supported value has been authored. Sharing one caption
    // would tell a reader the wrong thing about one of them.
    const auto = MEASURES.find((b) => b.key === 'auto');
    const accuracy = MEASURES.find((b) => b.key === 'accuracy');
    expect(auto?.undefinedCaption).not.toBe(accuracy?.undefinedCaption);
    expect(accuracy?.undefinedCaption).not.toContain('supplied frame');
  });
});
