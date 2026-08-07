/**
 * The transfer check.
 *
 * One case the reader has not seen, carrying the same class of planted error as
 * the trap: a proxy wearing the name of the thing it stands in for. One
 * question, and a verdict either way.
 *
 * It exists because a teaching instrument that never checks whether it taught is
 * a diagnosis with good manners. It is also the weakest thing here, and says so
 * on the page: one item, immediately after being told the answer to a structurally
 * identical item, is the easiest possible test of transfer and the one most
 * likely to flatter the instrument.
 *
 * None of this survives from the deleted build. The case, the question, the
 * options and both verdicts are newly written; only the shape is recovered, from
 * the v0.5 changelog entry.
 *
 * `pick` feeds no measure. It is stored on the run outside anything `metrics()`
 * reads, and that is deliberate: scoring it would make the debrief's numbers
 * depend on a question asked after the debrief.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

/** The option keys. `proxy` is the one the case is built around. */
export type TransferOption = 'proxy' | 'cost' | 'scale' | 'none';

export const TRANSFER = {
  standfirst: 'One case you have not seen, and one question about it.',

  org: 'Routine childhood immunisation outreach',
  cause: 'Child mortality · rural Indonesia',
  summary:
    'The programme reaches remote villages by motorbike on a fixed monthly circuit. In the last campaign year it delivered 41,000 doses at a cost of about $1.90 per dose, which the team reports as $1.90 per child protected. On that figure it is among the cheapest interventions on the shortlist.',
  detail:
    'The schedule the programme follows requires three doses at set intervals for a child to count as fully immunised. The circuit reaches each village monthly, and the team tracks doses delivered rather than children completing the course.',

  question: 'Before funding this, which one figure would you check first?',
  options: [
    {
      key: 'proxy',
      label: 'How many children completed all three doses, not how many doses were delivered',
    },
    {
      key: 'cost',
      label: 'Whether $1.90 per dose holds once motorbike and staff costs are counted',
    },
    {
      key: 'scale',
      label: 'Whether the programme can be scaled beyond the villages on the circuit',
    },
    { key: 'none', label: 'Nothing — $1.90 per child protected is already cheap enough to fund' },
  ],

  verdictHeading: {
    caught: 'You went for the proxy',
    missed: 'The figure that was not what it said it was',
  },
  verdict: {
    caught:
      'Doses delivered is not children protected, and the gap between them is the whole of the case. Three doses are needed and the circuit is monthly, so every child who misses one is counted three times in the numerator and zero times in the thing the numerator is supposed to measure. The real cost per child protected is the reported figure divided by the completion rate, and the completion rate is the number the programme does not track.',
    missed:
      'The figure to check first was the completion rate. The programme reports $1.90 per dose as $1.90 per child protected, but three doses are needed and only doses are counted — so the reported cost is right and the label on it is wrong, in exactly the way the case you just saw in the debrief was wrong. The other three questions are all reasonable. None of them is the one that decides the case.',
  },

  /**
   * The caveat, on the page rather than in a footnote.
   *
   * A transfer item this close to the thing it is testing measures recognition
   * of a pattern named ninety seconds ago. That is worth knowing and is not
   * worth much.
   */
  caveat:
    'This is the weakest measurement in the instrument and it is not scored. One item, asked immediately after the same error was explained, tests whether you can still recognise a pattern you were just handed. Real transfer would be a different task, days later, with no cue.',

  continueLabel: 'Continue',
} as const;
