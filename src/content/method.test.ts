import { describe, expect, it } from 'vitest';
import { PINNED_MODEL } from '../../shared/model.js';
import { ARM_KEYS } from '../domain/assignment.js';
import {
  AMBIGUITY_POINTS_PER_CASE,
  AUTONOMY_DEPARTURE_WEIGHT,
  AUTONOMY_DEVIATION_WEIGHT,
  AUTONOMY_SATURATION,
  CONFIDENCE_SCALE_MAX,
  metrics,
  sliderCount,
  trappedCases,
} from '../domain/metrics.js';
import { freshRound, slateFor } from '../state/run.js';
import { ARMS } from './arms.js';
import { MEASURES } from './debrief.js';
import { armRows, MEASURE_SPECS, METHOD } from './method.js';
import { SLATES } from './slates.js';

/**
 * The protocol screen against the code it describes.
 *
 * This is the most on-thesis test in the suite. The screen prints a formula per
 * measure and the constants inside them, and those constants are transcribed rather than
 * interpolated — because a formula is a sentence a reader checks by eye, and
 * interpolating it would make this file vacuous. So the arithmetic is written out
 * once in prose and once in code, and this is what stops the two versions from
 * drifting apart.
 *
 * The ÷6-versus-÷9 bug is the reason. It was an arithmetic error in a published
 * derived measure, caught by a reader rather than by the code. The equivalent
 * error now available is subtler and worse: correcting the code and leaving the
 * page describing the old arithmetic, which looks like nothing at all.
 */

const slate = SLATES.A;
const CASES = slate.cases.length;

function specFor(key: (typeof MEASURE_SPECS)[number]['key']) {
  const found = MEASURE_SPECS.find((m) => m.key === key);
  if (found === undefined) throw new Error(`the protocol screen has no measure named ${key}`);
  return found;
}

describe('the seven measures', () => {
  it('names seven, with no repeats', () => {
    expect(MEASURE_SPECS).toHaveLength(7);
    expect(new Set(MEASURE_SPECS.map((m) => m.key)).size).toBe(MEASURE_SPECS.length);
  });

  it('says in the heading how many it names', () => {
    // A count in prose beside a list is the shape that goes stale silently, and this
    // build has already published a landing page naming five measures when there
    // were six. The word is written out rather than interpolated so this can fail.
    const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'] as const;
    const word = WORDS[MEASURE_SPECS.length];
    expect(word, `no number word for ${String(MEASURE_SPECS.length)} measures`).toBeDefined();
    expect(METHOD.measuresHeading).toContain(`The ${String(word)} measures`);
  });

  it('names only measures the instrument actually computes', () => {
    const assign = { assistedFirst: true, assistedSlate: 'A', armKey: 'ai' } as const;
    const computed = metrics({
      data: freshRound(assign, 'assisted').data,
      slate: slateFor(assign, 'assisted'),
      condition: 'assisted',
      confidence: 3,
    });
    for (const measure of MEASURE_SPECS) {
      expect(Object.hasOwn(computed, measure.key), measure.key).toBe(true);
    }
  });

  it('uses the same words for a measure as the debrief does', () => {
    // A reader meets most of these as bars on the debrief and then reads about
    // them here. Two vocabularies for one measure would be the reader's problem
    // rather than the author's, which is the wrong way round.
    for (const bar of MEASURES) {
      expect(specFor(bar.key).label, bar.key).toBe(bar.label);
    }
  });

  it('says in its own row why each measure with no bar has none', () => {
    // Two measures are computed and not drawn: `gap`, because it is a difference
    // rather than a pair, and `catchRate`, because one planted error per slate makes
    // it one observation and a bar invites reading 0 or 100 as a rate. Naming them
    // here rather than counting them means adding a third silently fails.
    const unbarred = MEASURE_SPECS.filter((m) => !MEASURES.some((b) => b.key === m.key));
    expect(unbarred.map((m) => m.key)).toEqual(['catchRate', 'gap']);
    expect(specFor('gap').definition).toContain('signed difference');
    expect(specFor('catchRate').threat).toContain('not drawn as a bar');
  });

  it('states the number of planted errors the slates actually carry', () => {
    // The catch rate's weakness is a count, published in prose, and it is the count
    // this whole issue is about. Written out as a word so that authoring a second
    // planted error fails here and sends the author to the sentence.
    const WORDS = ['no', 'one', 'two', 'three'] as const;
    const perSlate = trappedCases(SLATES.A).length;
    expect(trappedCases(SLATES.B).length).toBe(perSlate);
    const word = WORDS[perSlate];
    expect(word, `no number word for ${String(perSlate)} planted errors`).toBeDefined();
    expect(specFor('catchRate').threat).toContain(`authors ${String(word)} planted error`);
    // Lower-cased, because the same count opens a sentence in the limits list.
    expect(METHOD.limits.join(' ').toLowerCase()).toContain(
      `${String(word)} planted error is authored per slate`,
    );
  });

  it('states a threat against every one of them', () => {
    for (const measure of MEASURE_SPECS) {
      expect(measure.threat.length, measure.key).toBeGreaterThan(120);
      expect(measure.definition.length, measure.key).toBeGreaterThan(60);
    }
  });
});

describe('the formulas against the constants they describe', () => {
  it('divides the evaluative range by the sliders that exist', () => {
    // The published error this whole discipline exists because of: dividing by six
    // sliders when there are nine. The denominator in code is derived from the
    // slate; this asserts the denominator in the prose is the same number.
    const sliders = sliderCount(slate);
    expect(sliderCount(SLATES.B)).toBe(sliders);
    expect(specFor('range').formula).toContain(`÷ ${String(sliders)} sliders`);
  });

  it('divides evidence engagement by the cases that exist', () => {
    expect(specFor('engagement').formula).toContain(`÷ ${String(CASES)} cases`);
  });

  it('gives ambiguity tolerance the points per case the code gives it', () => {
    expect(specFor('amb').formula).toContain(
      `(${String(CASES)} cases × ${String(AMBIGUITY_POINTS_PER_CASE)} points)`,
    );
  });

  it('splits framing autonomy the way the code splits it', () => {
    const formula = specFor('auto').formula;
    expect(formula).toContain(`${String(AUTONOMY_DEPARTURE_WEIGHT)} × (departures`);
    expect(formula).toContain(`+ ${String(AUTONOMY_DEVIATION_WEIGHT)} × min(1,`);
    expect(AUTONOMY_DEPARTURE_WEIGHT + AUTONOMY_DEVIATION_WEIGHT).toBe(100);
    // The departure half has a denominator too, and it is the same case count as
    // the other two measures. Left unasserted it would be the one printed
    // denominator on the screen that nothing holds to the code.
    expect(formula).toContain(`departures ÷ ${String(CASES)} cases`);
  });

  it('prints the saturation point the code saturates at, in the formula and in the prose', () => {
    // The sentence about “the 0.25 saturation point” and the arithmetic beside it
    // can no longer silently disagree with `AUTONOMY_SATURATION`. Tuning the
    // constant without rewriting the screen fails here.
    //
    // Both assertions anchor the number rather than searching for it bare. A bare
    // `toContain('0.2')` passes on prose that still says 0.25, because one string
    // is a prefix of the other — which would leave exactly the stale-published-
    // arithmetic failure this file exists to prevent.
    const auto = specFor('auto');
    expect(auto.formula).toContain(`÷ ${String(AUTONOMY_SATURATION)})`);
    expect(auto.threat).toContain(`The ${String(AUTONOMY_SATURATION)} saturation point`);
  });

  it('rescales confidence by the top of the scale the reader was offered', () => {
    expect(specFor('gap').formula).toContain(`÷ ${String(CONFIDENCE_SCALE_MAX)} ×`);
  });
});

describe('the four arms', () => {
  it('is three attributed arms and the control round', () => {
    expect(armRows()).toHaveLength(ARM_KEYS.length + 1);
  });

  it('describes the stimulus with the strings the round screen actually prints', () => {
    // `label` is the heading the round screen puts above the supplied read. If
    // this table retyped it, the protocol screen could go on describing a heading
    // no reader has seen since somebody edited `arms.ts`.
    const rows = armRows();
    for (const [i, key] of ARM_KEYS.entries()) {
      expect(rows[i]?.arm, key).toBe(ARMS[key].tag);
      expect(rows[i]?.supplied, key).toContain(ARMS[key].label);
      expect(rows[i]?.supplied, key).toContain(ARMS[key].who);
    }
  });

  it('ends on the arm that supplies nothing', () => {
    const last = armRows()[armRows().length - 1];
    expect(last).toEqual(METHOD.armsControl);
    expect(last?.supplied).toContain('Nothing');
  });
});

describe('model provenance', () => {
  it('holds the pinned ID in one place, and not in the prose', () => {
    // The screen renders `PINNED_MODEL` directly. A copy of the ID written into a
    // sentence is a second pin that a re-baseline would not move, which is the one
    // way this section could end up asserting something untrue.
    expect(JSON.stringify(METHOD)).not.toContain(PINNED_MODEL);
  });

  it('says the printed ID is the record, and that nothing has been printed yet', () => {
    expect(METHOD.modelPrinted).toContain('verifies itself');
    expect(METHOD.modelDark).toContain('no call is made');
  });
});
