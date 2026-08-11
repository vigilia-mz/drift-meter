import { MEASURES } from './debrief.js';
import { trappedCases } from '../domain/metrics.js';
import { describe, expect, it } from 'vitest';
// The two paperwork files as text, through the bundler rather than through
// `node:fs`. They are part of the artifact, and the two tables on the process
// screen mirror them, so the mirror is checked against the record rather than
// against a memory of it.
import changelogFile from '../../CHANGELOG.md?raw';
// The citation metadata, and the record for two things rather than one: the version
// and DOI the three prose pages tell a reader to cite, and the DOI the reader briefs
// quote at a reviewer. GitHub and Zenodo read this file, so a version it names and the
// pages do not is a citation pointing at a build the reader was never shown.
import citationFile from '../../CITATION.cff?raw';
// The landing page as text, for the one claim on it that a source row depends on.
// `index.html` is hand-written and carries no content module, so this is the only
// way to hold its disclosure from here.
import indexPage from '../../index.html?raw';
// The other two prose pages, for the version line their footers now carry. Each is a
// hand-written document with no content module, so the file is what a test can read.
import essayPage from '../../essay.html?raw';
import atrophyPage from '../../atrophy.html?raw';
// The reader briefs are prose about the site rather than prose in it, and they quote
// three counts back at the reader. Same reason as `index.html`: no content module, so
// the file itself is what a test has to read.
import readerBriefs from '../../docs/review-briefs.md?raw';
// The README, for one claim the masthead makes about it: that the repository links the
// author's profile. It did not, for as long as the row has said so.
import readmeFile from '../../README.md?raw';
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

const { ARM_NOTES, ARMS, recSentencePrefix, REC_LABELS, standingAttribution } = armsModule;
const { DEBRIEF } = debriefModule;
const { MEASURE_SPECS, METHOD, PRED_ROWS } = methodModule;
const { CHANGELOG_ROWS, PROCESS, PROVENANCE_ROWS, REVIEWER_ROWS, SOURCE_ROWS } = processModule;
const { CONSENT, INTRO } = shellModule;
const { otherSlate, SLATES } = slatesModule;
const { TRAP_FRAMES, TRAP_HEADINGS, trapParagraph } = trapModule;
const ARM_KEYS_FOR_TEST = ['ai', 'human', 'unlabelled'] as const;

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

  it('every trap slider points at an assumption of its own case', () => {
    for (const slate of slates) {
      for (const trapped of trappedCases(slate)) {
        const where = `${slate.id} / ${trapped.case.org}`;
        expect(trapped.trap.slider, where).toBeGreaterThanOrEqual(0);
        expect(trapped.trap.slider, where).toBeLessThan(trapped.case.a.length);
      }
    }
  });

  it('Round 3 indices point at cases that exist, and replay two distinct ones', () => {
    for (const slate of slates) {
      for (const i of slate.r3) {
        expect(i, slate.id).toBeGreaterThanOrEqual(0);
        expect(i, slate.id).toBeLessThan(slate.cases.length);
      }
      expect(new Set(slate.r3).size, slate.id).toBe(2);
    }
  });

  it('each slate carries at least one planted error, and the two slates hide it differently', () => {
    // At least one rather than exactly one: a planted error is a property of a case
    // since #31, so a slate may carry up to three. What must not happen is a slate
    // carrying none — the assisted round would then have nothing with a right answer
    // in it and the catch rate would be undefined for every reader who drew it.
    //
    // Slate A misstates a cost; slate B misstates a rate. Same move, different
    // clothes — which is what makes the transfer check meaningful.
    for (const slate of slates) {
      expect(trappedCases(slate).length, slate.id).toBeGreaterThanOrEqual(1);
    }
    const units = (slate: (typeof slates)[number]) =>
      trappedCases(slate).map((t) => t.case.a[t.trap.slider]?.unit);
    expect(units(SLATES.A)).toContain('$');
    expect(units(SLATES.B)).toContain('%');
  });

  it('a planted error sits where the evidence contradicts the label, and where nothing supports it yet', () => {
    // Two halves of the same invariant.
    //
    // First, the reader has to be able to find it: the fact that undoes the headline
    // is in the evidence panel, one click away, or the trap is unfair rather than
    // instructive.
    //
    // Second, the issue's own definition — a trap is `provided ≠ supported` on a
    // named slider (#31). Every `supported` is unauthored today, so the assertion is
    // conditional and will start biting when one is written. The converse is
    // deliberately not asserted: an assumption whose supported value differs from its
    // supplied one is not thereby a planted error. A figure can be arguable without
    // its label being a lie, and requiring every such slider to be a trap would
    // forbid the ordinary case the accuracy measure exists to score.
    expect(SLATES.A.cases[1].evidence).toContain('commodity cost');
    expect(SLATES.B.cases[2].evidence).toContain('access and use');
    expect(SLATES.A.cases[1].trap).not.toBeNull();
    expect(SLATES.B.cases[2].trap).not.toBeNull();

    for (const slate of slates) {
      for (const trapped of trappedCases(slate)) {
        const sp = trapped.case.a[trapped.trap.slider];
        const where = `${slate.id} / ${trapped.case.org}`;
        expect(sp, where).toBeDefined();
        if (sp?.supported != null) {
          expect(sp.provided, where).not.toBe(sp.supported);
        }
      }
    }
  });

  it('otherSlate pairs the two slates', () => {
    expect(otherSlate('A')).toBe('B');
    expect(otherSlate('B')).toBe('A');
  });
});

describe('trap copy', () => {
  it('covers every branch with real prose, on every planted error that exists', () => {
    // Composed since #31 — a frame per branch and the correction from the case — so
    // the assertion is over the paragraph a reader is actually shown rather than over
    // a stored string. That is also what keeps this honest as planted errors are
    // added: a new one with an empty `whatTheFigureIs` fails here in six branches.
    for (const slate of slates) {
      for (const trapped of trappedCases(slate)) {
        for (const branch of ALL_BRANCHES) {
          const copy = trapParagraph(branch, trapped.trap);
          const where = `${slate.id}/${trapped.case.org}/${branch}`;
          expect(copy, where).toBeTypeOf('string');
          expect(copy.length, where).toBeGreaterThan(80);
          // Both halves of the correction reach the page. A frame that stopped
          // interpolating one of them would still read as a sentence.
          expect(copy, where).toContain(trapped.trap.whatTheLabelSays);
          expect(copy, where).toContain(trapped.trap.whatTheFigureIs);
        }
      }
    }
  });

  it('names the right figure in each slate, in every branch', () => {
    const paragraphs = (slate: (typeof slates)[number]) =>
      trappedCases(slate).flatMap((t) => ALL_BRANCHES.map((b) => trapParagraph(b, t.trap)));
    for (const copy of paragraphs(SLATES.A)) expect(copy).toMatch(/\$2|bednet|net/);
    for (const copy of paragraphs(SLATES.B)) expect(copy).toMatch(/80%|chlorinated/);
  });

  it('states the figure once per planted error rather than once per branch', () => {
    // The reason for composing. Before #31 the bednet figures were written out six
    // times and the chlorination figures six times, and `SOURCES.md` names the cost:
    // pinning either to a source “rewrites all six branches of the trap copy”. The
    // frames must therefore carry no figure of their own.
    for (const frame of Object.values(TRAP_FRAMES)) {
      for (const half of [frame.opening, frame.closing]) {
        expect(half).not.toMatch(/\d/);
      }
    }
  });

  it('has a heading for every heading key', () => {
    for (const value of Object.values(TRAP_HEADINGS)) {
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it('has a plural heading and lead, and they say something the singular does not', () => {
    // Unreachable through the flow: one planted error is authored per slate, so every
    // run takes the singular. That is exactly why it is asserted here — the browser
    // suite pins the copy a reader sees, and pinning a string no run produces would
    // be a test of this module rather than of the page. The day a second planted
    // error is authored, this is the copy that ships without anyone having read it.
    expect(DEBRIEF.trapHeading.many).not.toBe(DEBRIEF.trapHeading.one);
    expect(DEBRIEF.trapLead.many).not.toBe(DEBRIEF.trapLead.one);
    expect(DEBRIEF.trapHeading.one).toContain('case with');
    expect(DEBRIEF.trapHeading.many).toContain('cases with');
    // The plural has to tell the reader there is more than one panel below it, or the
    // second panel arrives unannounced.
    expect(DEBRIEF.trapLead.many).toContain('for each');
    expect(DEBRIEF.trapLead.one.length).toBeGreaterThan(80);
    expect(DEBRIEF.trapLead.many.length).toBeGreaterThan(80);
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

  it('dates every version the same way the changelog file dates it', () => {
    // The gap this closes: the test above compares version strings and their order
    // and never looks at the date, so dating a heading in `CHANGELOG.md` and leaving
    // `date` here reading “In progress” passed the whole suite. That is a published
    // screen saying a version is unfinished inside a release said to be closed, and
    // it is the shape this repository keeps catching — a mirror that agrees about the
    // rows and disagrees about what they say.
    //
    // The file is the record and the screen is the mirror, so the file is read for
    // the expected value rather than the two being compared to a third constant.
    for (const entry of CHANGELOG_ROWS) {
      const heading = new RegExp(`^## ${entry.version} — ([^—]+) — `, 'm').exec(changelogFile);
      expect(heading, `no dated heading for ${entry.version}`).not.toBeNull();
      expect(entry.date, entry.version).toBe(heading?.[1]?.trim());
    }
  });

  it('quotes the counts in the reader briefs correctly', () => {
    // `docs/review-briefs.md` is written to be pasted into a message and sent, and it
    // tells the recipient how many limits, measures and caveats the site publishes. All
    // three counts were wrong at once when the DOI landed — nine limits described as
    // eight, twice, and seven measures described as six — in the document whose first
    // reader is the one recruited to find exactly that. Nothing read this file, because
    // it is documentation rather than screen copy, and rule 5 covers what the site
    // asserts. It is sent under the author's name, so it is held here anyway.
    const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    const limits = WORDS[METHOD.limits.length];
    expect(limits, `no number word for ${String(METHOD.limits.length)} limits`).toBeDefined();
    expect(readerBriefs).toContain(`lists ${String(limits)} of those`);
    expect(readerBriefs).toContain(`the ${String(limits)} things this build cannot do`);

    const measures = WORDS[MEASURE_SPECS.length];
    expect(readerBriefs).toContain(`the ${String(measures)} measures`);

    const caveats = WORDS[PROCESS.caveats.length];
    expect(readerBriefs).toContain(`lists ${String(caveats)} more`);
  });

  it('splits the seven measures the way the protocol screen splits them', () => {
    // The counts above were pinned and the split between them was not, so the briefs
    // could say five measures are traces of how the work was done while section 3 said
    // four, and they did. A methodologist reading both stops at the disagreement, and
    // both readings were defensible — the briefs were counting the confidence gap as a
    // trace, the screen brackets it as the seventh and a signed difference.
    //
    // Neither number is written here. The three exceptions are, because each is
    // documented as an exception in the docstring above `MEASURE_SPECS`, and the counts
    // fall out of them: a measure added to the array moves both numbers, and a measure
    // added that is not a trace fails here until it is named below.
    const NOT_TRACES = ['accuracy', 'catchRate']; // ask whether the answer was right
    const SIGNED = ['gap']; // a difference between two of the others, on its own scale
    const keys = MEASURE_SPECS.map((m) => m.key);
    for (const key of [...NOT_TRACES, ...SIGNED]) expect(keys, key).toContain(key);

    const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
    const word = (n: number) => {
      const w = WORDS[n];
      expect(w, `no number word for ${String(n)}`).toBeDefined();
      return String(w);
    };
    const scaled = MEASURE_SPECS.length - SIGNED.length;
    const traces = scaled - NOT_TRACES.length;
    const Traces = word(traces).charAt(0).toUpperCase() + word(traces).slice(1);

    // The screen is the record and the briefs are the mirror, so both are read against
    // the arrays rather than against each other.
    expect(METHOD.measuresLead).toContain(
      `${Traces} of the ${word(scaled)} are traces of how the work was done`,
    );
    expect(readerBriefs).toContain(`${Traces} are traces of how the work was done`);
  });

  it('sends the reader briefs against a version rather than a moving URL', () => {
    // The site serves whatever is current, so a critique of "the Drift Meter" is a
    // critique of nothing in particular. Both asks that go to a reviewer name the
    // archived version, and the DOI they name is the one in CITATION.cff — the
    // versioned one, not the concept DOI that resolves to the newest release.
    const versioned = '10.5281/zenodo.21887595';
    expect(citationFile).toContain(`doi: ${versioned}`);
    const mentions = readerBriefs.split(versioned).length - 1;
    expect(mentions, 'the methods brief and the design-review post').toBe(2);
  });

  it('links the profile the Contact row sends a reader to', () => {
    const contact = PROCESS.mastheadRows.find((r) => r.label === 'Contact');
    expect(contact?.value, 'the masthead has no Contact row').toBeDefined();
    // The row says to come through the GitHub profile linked from the repository, and
    // there was no such link: the profile appears in the three prose-page footers and
    // appeared nowhere in the README, which is the repository as a reader on GitHub
    // meets it. The reader briefs repeated the same instruction, so a published route
    // for anyone who would rather not file in public was a dead end in both.
    //
    // Conditional on the promise, deliberately: a row rewritten to name the profile
    // outright would not need the README link, and this should not fail for that.
    if (/linked from the repository/.test(contact?.value ?? '')) {
      expect(readmeFile, 'README.md links no profile').toMatch(
        /\]\(https:\/\/github\.com\/vigilia-mz\)/,
      );
    }
  });

  it('names the newest version on the masthead, and not the one below it', () => {
    // The same gap as the test above, one row higher. That one closed the case
    // where the file dated a version and the table under it still called the
    // version unfinished; this one closes the case where the table opens a version
    // and the masthead above it still names the closed one. Both are a mirror
    // agreeing about the rows and disagreeing about what they say.
    const version = PROCESS.mastheadRows.find((r) => r.label === 'Version');
    expect(version?.value, 'the masthead has no Version row').toBeDefined();
    // `CHANGELOG_ROWS` is a non-empty `as const` tuple, so the first entry is not
    // possibly undefined and guarding it is what the linter calls an unnecessary
    // conditional. The type carries the guarantee here.
    expect(version?.value).toContain(CHANGELOG_ROWS[0].version);
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

  it('corrects the verbatim note from outside it, and leaves the note alone', () => {
    // The methods reader's note is surviving copy. It dates the confound to v0.1
    // where the changelog dates the objection to v0.2, and the fix is a gloss
    // beside it rather than an edit inside it — a passage marked verbatim that
    // has been quietly corrected is worth less than one that disagrees in the
    // open, because nothing on the page would say which had happened.
    const methods = REVIEWER_ROWS.find((r) => r.role === 'Methods reader');
    expect(methods?.note).toContain('The confound in v0.1');
    expect(methods?.note).not.toContain('v0.2');
    expect(methods?.noteGloss).toContain('v0.1');
    expect(methods?.noteGloss).toContain('v0.2');
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

describe('standing attribution', () => {
  /**
   * The source of the number is stated before any panel is opened, and it has to
   * stay that way. If it moves back inside the disclosure, a reader who never
   * opens the panel is told in the debrief which arm they were in without ever
   * having been in it — and `engagement`, which P1 is a claim about, becomes both
   * an outcome measure and the delivery mechanism for the manipulation P5 is a
   * claim about.
   */
  it('names a source in every arm, including the unattributed one', () => {
    for (const key of ARM_KEYS_FOR_TEST) {
      const line = standingAttribution(ARMS[key]);
      expect(line, key).toContain(ARMS[key].who);
      expect(line.endsWith('.'), key).toBe(true);
    }
  });

  it('distinguishes the three arms', () => {
    const lines = Object.values(ARMS).map((a) => standingAttribution(a));
    expect(new Set(lines).size).toBe(3);
  });

  it('names Claude in the AI arm and nowhere else', () => {
    expect(standingAttribution(ARMS.ai)).toContain('Claude');
    expect(standingAttribution(ARMS.human)).not.toContain('Claude');
    expect(standingAttribution(ARMS.unlabelled)).not.toContain('Claude');
  });

  it('attributes the human arm to a person, with no AI in the sentence', () => {
    const line = standingAttribution(ARMS.human);
    expect(line).toContain('programme officer');
    expect(line.toLowerCase()).not.toContain(' ai ');
  });

  it('withholds an identity in the unattributed arm without withholding the fact of a source', () => {
    const line = standingAttribution(ARMS.unlabelled);
    expect(line).toContain('unnamed');
    expect(line).not.toContain('Claude');
    expect(line).not.toContain('programme officer');
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
    //
    // Derived from the cases rather than from a slate-level index since #31, which
    // also makes it cover a second planted error the day one is authored — the
    // version that read `slate.trapCase` would have kept checking one of them.
    const spoilers = slates.flatMap((slate) =>
      trappedCases(slate).flatMap((trapped) => {
        const sp = trapped.case.a[trapped.trap.slider];
        if (sp === undefined) throw new Error(`${slate.id}: trap slider out of range`);
        return [trapped.case.org, sp.label];
      }),
    );

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

describe('the landing page says its specimen bars are invented', () => {
  /**
   * The specimen readout draws three pairs of bars at fixed widths. They are not a
   * run and there is no cohort; the caption is the only thing on the page that says
   * so, and a row in `SOURCES.md` is graded ILLUSTRATIVE on the strength of it.
   *
   * That grade is defined as holding only while the disclosure is live, so the
   * disclosure has to be held by something. For the four case figures that is the
   * disclosure test above, which reads the content modules. `index.html` has no
   * content module — it is a finished hand-written document — so this reads the page
   * itself. Without it the row rests on review, which is what the row said until
   * this test existed.
   *
   * The word is asserted rather than the sentence. "Illustrative" is what the
   * caption said until v0.7, and it is the same word an invented cohort dashboard
   * could have carried on the page whose own method note explains why that
   * dashboard was retracted; rule 6 asks for the plainer word, so the plainer word
   * is what is pinned.
   */
  it('carries the word invented in the specimen caption', () => {
    const caption = indexPage.match(/<p class="spec-caption">([\s\S]*?)<\/p>/)?.[1];
    expect(caption, 'the specimen caption is in index.html').toBeDefined();
    expect(caption).toContain('invented');
  });

  it('says n is zero and that nothing was collected, in the same caption', () => {
    // The word alone would leave "invented" doing the work of a disclosure while
    // the reader still had no idea whether a run stands behind the shape.
    const caption = indexPage.match(/<p class="spec-caption">([\s\S]*?)<\/p>/)?.[1] ?? '';
    expect(caption).toContain('n is zero');
    expect(caption).toContain('nothing has been collected');
  });

  it('keeps a row in SOURCES.md graded ILLUSTRATIVE for those bars', () => {
    // The other half: the caption without the row is an undisclosed figure as far
    // as the table is concerned, and the row without the caption is a grade resting
    // on nothing. Neither may be removed alone.
    expect(sourcesFile).toContain('### ILLUSTRATIVE — Landing page specimen readout');
    expect(SOURCE_ROWS.some((r) => r.grade === 'Illustrative' && /specimen/i.test(r.claim))).toBe(
      true,
    );
  });
});

describe('the prose pages name the version to cite', () => {
  /**
   * Citability reached the masthead inside the instrument, the changelog heading,
   * `CITATION.cff`, the README and the first git tag — and not the three pages a
   * reader arrives on, reads the argument from, and would quote. The footers carry
   * it now, and this holds it there.
   *
   * `CITATION.cff` is the record rather than `CHANGELOG.md`, because it is the file
   * GitHub and Zenodo read: a version and a DOI it names and the pages do not is a
   * citation pointing at metadata the reader was never shown. The pages name the
   * version to cite and not the version in progress, deliberately — that keeps one
   * number from one source, changes the line only when a version closes, and leaves
   * nothing on the page that a test cannot check.
   *
   * Looped over all three for the reason the CARRIERS loop above exists: any one of
   * them could lose the line alone without anything else here going red.
   */
  const PAGES: ReadonlyArray<readonly [string, string]> = [
    ['index.html', indexPage],
    ['essay.html', essayPage],
    ['atrophy.html', atrophyPage],
  ];
  const cited = /^version:\s*(\S+)/m.exec(citationFile)?.[1] ?? '';
  const doi = /^doi:\s*(\S+)/m.exec(citationFile)?.[1] ?? '';
  const footOf = (page: string) => /<div class="foot">([\s\S]*?)<\/div>/.exec(page)?.[1] ?? '';

  it('reads a version and a DOI out of the citation file', () => {
    // Guards the two patterns above. If either stops matching, every assertion below
    // would pass against an empty string and this whole block would assert nothing.
    expect(cited, 'CITATION.cff has no version:').toMatch(/^\d+\.\d+\.\d+$/);
    expect(doi, 'CITATION.cff has no doi:').toMatch(/^10\.\d{4,}\//);
  });

  it('names that version, with its DOI, in every prose page footer', () => {
    for (const [name, page] of PAGES) {
      const foot = footOf(page);
      expect(foot, `${name} has no .foot block`).not.toBe('');
      expect(foot, name).toContain(`v${cited}`);
      expect(foot, name).toContain(doi);
    }
  });

  it('dates the cited version the way the changelog dates it', () => {
    const closed = [...changelogFile.matchAll(/^## (v\d+\.\d+) — ([^—]+) — /gm)]
      .map((m) => ({ version: (m[1] ?? '').trim(), date: (m[2] ?? '').trim() }))
      .find((h) => !/in progress/i.test(h.date));
    expect(closed, 'CHANGELOG.md records no closed version').toBeDefined();
    // The cited version and the newest closed one are the same thing. If they part,
    // the pages are pointing a citer at a version the record has not closed.
    expect(`v${cited}`).toContain(closed?.version ?? 'no closed version');
    for (const [name, page] of PAGES) {
      expect(footOf(page), name).toContain(closed?.date ?? 'no date');
    }
  });

  it('adds no script to a page that is meant to carry none', () => {
    // The line is a sentence and two links. `scripts/check-size.mjs` and
    // `tests/prose.spec.ts` hold this from the built output and from a browser; this
    // holds it in the source, where the edit is actually made.
    for (const [name, page] of PAGES) {
      expect(footOf(page), name).not.toContain('<script');
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
