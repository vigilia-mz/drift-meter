/**
 * The two case slates.
 *
 * Six charity cost-effectiveness cases, three per slate. Which slate carries the
 * supplied estimate is randomised independently of condition order, so case
 * difficulty cannot be mistaken for a condition effect.
 *
 * Each slate contains exactly one planted error, named by `trapCase` and
 * `trapSlider`. In both cases the error is the same move in different clothes: a
 * proxy wearing the name of the thing it stands in for. Slate A supplies the
 * commodity cost of a bednet as though it were the delivered cost. Slate B
 * supplies the chlorination access rate as though it were measured use. In both,
 * the fact that undoes the headline is sitting in the evidence panel, one click
 * away.
 *
 * The figures are illustrative and carry the shape of real, documented disputes.
 * They are not traced to named studies, and both trap rows are FLAGGED in
 * SOURCES.md as not cleared for publication. Do not quote them.
 */

import type { Slate, SlateId } from './types.js';

export const SLATES = {
  A: {
    id: 'A',
    name: 'Slate A',
    trapCase: 1,
    trapSlider: 0,
    r3: [0, 1],
    cases: [
      {
        org: 'Direct cash transfers',
        cause: 'Poverty · East Africa',
        outcome: 'per income-doubling',
        rec: 'investigate',
        summary:
          'A clean, well-evidenced benchmark. Large RCT base, low overhead, money goes straight to recipients. Solid, though rarely the most cost-effective option on the margin.',
        evidence:
          'Among the best-studied interventions in development, with multiple randomised trials showing real consumption and asset gains. The open question is persistence: how much of the gain survives five years out, where the evidence thins and estimates diverge sharply.',
        disagree:
          'the persistence question is not a detail at the edge of this estimate, it is most of the estimate. If the income gain decays fast, the cost per lasting doubling roughly triples, and the five-year evidence is exactly where the studies stop agreeing.',
        changeMind:
          'a well-powered follow-up at five years or later showing the consumption gain holding above half its year-one level.',
        a: [
          {
            label: 'Cost per household reached',
            unit: '$',
            dp: 0,
            min: 700,
            max: 1400,
            step: 10,
            provided: 850,
          },
          {
            label: 'Share with a lasting income gain',
            unit: '%',
            dp: 0,
            min: 20,
            max: 60,
            step: 1,
            provided: 45,
          },
          {
            label: 'Income-doublings per household',
            unit: '',
            dp: 2,
            min: 0.2,
            max: 0.7,
            step: 0.01,
            provided: 0.5,
          },
        ],
      },
      {
        // The planted error. $2 is what a net costs, not what delivering one costs.
        org: 'Insecticide-treated bednets',
        cause: 'Malaria · Sahel',
        outcome: 'per death averted',
        rec: 'fund',
        summary:
          'The textbook top pick. At about $2 a net with strong mortality evidence, this is among the cheapest ways to avert a death anywhere. Recommend directing funds here.',
        evidence:
          'The mortality evidence is genuinely strong. One thing the summary leaves out: the $2 figure is the commodity cost of the net itself. Delivered cost, including distribution, logistics, campaign overhead and wastage, has run closer to $4.50 per net in recent programmes. Usage also decays across a net’s lifespan.',
        disagree:
          'the headline rests on a cost figure that is not the cost of the intervention. Two dollars buys the net; it does not deliver it, hang it, or replace it. Delivered cost has run around double that, which moves this off the top line without touching the mortality evidence at all.',
        changeMind:
          'a delivered-cost figure from a recent campaign, including wastage and campaign overhead, that comes in materially under three dollars a net.',
        a: [
          {
            label: 'Cost per net delivered',
            unit: '$',
            dp: 2,
            min: 2,
            max: 7,
            step: 0.25,
            provided: 2.0,
          },
          { label: 'Net usage rate', unit: '%', dp: 0, min: 50, max: 95, step: 1, provided: 85 },
          {
            label: 'Deaths averted per net',
            unit: '',
            dp: 4,
            min: 0.0003,
            max: 0.0008,
            step: 0.0001,
            provided: 0.0006,
          },
        ],
      },
      {
        org: 'School-based deworming',
        cause: 'Parasites · South Asia',
        outcome: 'per child treated',
        rec: 'investigate',
        summary:
          'Extraordinary cost-effectiveness on paper, often well under a dollar per child, with a long-run income story behind it. Promising, worth a close look.',
        evidence:
          'Treatment is genuinely cheap and safe. But the entire economic case rests on one contested long-run income finding, whose replication and effect size are heavily debated. Depending on how much you discount that evidence, the cost-effectiveness swings by more than fiftyfold.',
        disagree:
          'the cheapness is not in dispute and it is also not the question. The whole case turns on a single long-run income result whose replication is contested, which means the honest output here is a range spanning two orders of magnitude, not a number.',
        changeMind:
          'an independent replication of the long-run income effect at a comparable effect size in a different setting.',
        a: [
          {
            label: 'Cost per child treated',
            unit: '$',
            dp: 2,
            min: 0.5,
            max: 3,
            step: 0.05,
            provided: 0.75,
          },
          {
            label: 'Probability the income effect is real',
            unit: '%',
            dp: 0,
            min: 5,
            max: 60,
            step: 1,
            provided: 50,
          },
          {
            label: 'Lifetime income gain factor',
            unit: '',
            dp: 1,
            min: 1,
            max: 5,
            step: 0.1,
            provided: 3.0,
          },
        ],
      },
    ],
  },

  B: {
    id: 'B',
    name: 'Slate B',
    trapCase: 2,
    trapSlider: 1,
    r3: [0, 2],
    cases: [
      {
        org: 'Vitamin A supplementation',
        cause: 'Child mortality · West Africa',
        outcome: 'per death averted',
        rec: 'fund',
        summary:
          'A cheap, simple, well-evidenced mortality intervention, delivered through existing campaigns at low marginal cost. Among the strongest options on this slate.',
        evidence:
          'A cheap, simple intervention with a strong evidence base for reducing child mortality. The size of the mortality effect depends heavily on baseline vitamin A deficiency in the population, which varies widely by region, and deficiency has been falling in several of the places these programmes still run.',
        disagree:
          'the mortality effect is not a property of the supplement, it is a property of the population’s deficiency rate. Where deficiency has fallen, the same programme buys much less, and the summary quietly assumes the deficiency levels of the trials rather than of the target region.',
        changeMind:
          'recent serum-retinol or dietary-deficiency data from the specific target districts, rather than a national average carried over from trial-era populations.',
        a: [
          {
            label: 'Cost per child supplemented per year',
            unit: '$',
            dp: 2,
            min: 1,
            max: 4,
            step: 0.1,
            provided: 1.1,
          },
          { label: 'Coverage reached', unit: '%', dp: 0, min: 40, max: 90, step: 1, provided: 80 },
          {
            label: 'Deaths averted per child-year',
            unit: '',
            dp: 4,
            min: 0.0005,
            max: 0.002,
            step: 0.0001,
            provided: 0.0015,
          },
        ],
      },
      {
        org: 'Maternal & newborn health package',
        cause: 'Maternal health · Guatemala highlands',
        outcome: 'per death averted',
        rec: 'investigate',
        summary:
          'Links indigenous midwives to referral hospitals through translation and transport. Locally trusted, plausibly high-impact, and cheap relative to facility-based alternatives.',
        evidence:
          'Links indigenous midwives to referral hospitals through a translation and transport system. The model is promising and locally trusted, but outcome data is uneven and skilled-attendance uptake is the main lever on impact.',
        disagree:
          '‘locally trusted’ is doing rhetorical work that the outcome data cannot support yet. The mechanism is plausible and the uptake figure is the whole ballgame, and uptake in referral-linkage programmes has a long history of coming in far below the pilot number.',
        changeMind:
          'administrative uptake data from a full year at scale, rather than from the pilot cohort.',
        a: [
          {
            label: 'Cost per birth covered',
            unit: '$',
            dp: 0,
            min: 30,
            max: 120,
            step: 5,
            provided: 45,
          },
          {
            label: 'Skilled-attendance uptake',
            unit: '%',
            dp: 0,
            min: 30,
            max: 85,
            step: 1,
            provided: 75,
          },
          {
            label: 'Deaths averted per birth',
            unit: '',
            dp: 4,
            min: 0.001,
            max: 0.006,
            step: 0.0005,
            provided: 0.0045,
          },
        ],
      },
      {
        // The planted error. 80% is who can get chlorine, not who is drinking it.
        org: 'Safe-water chlorination',
        cause: 'Clean water · rural East Africa',
        outcome: 'per under-5 death averted',
        rec: 'fund',
        summary:
          'In-line and dispenser chlorination is cheap to deploy, reaches around 80% of households in programme areas, and a recent meta-analysis revised the child-mortality benefit sharply upward. Strong candidate.',
        evidence:
          'In-line and dispenser chlorination is cheap to deploy. The crux is the difference between access and use: installation and access rates run near 80%, but measured consistent use, meaning chlorine actually detectable in stored household water, has run closer to half that in follow-up studies. A recent meta-analysis revised the child-mortality benefit upward, and the result is still debated.',
        disagree:
          'the 80% figure is access, not use. Chlorine detectable in stored water is the thing that averts a death, and measured consistent use has run around half the access rate, which roughly doubles the cost per death averted.',
        changeMind:
          'household water-testing data, not installation counts, showing sustained free chlorine residual above 70% at twelve months.',
        a: [
          {
            label: 'Cost per person-year of clean water',
            unit: '$',
            dp: 2,
            min: 1,
            max: 6,
            step: 0.25,
            provided: 1.5,
          },
          {
            label: 'Consistent use rate',
            unit: '%',
            dp: 0,
            min: 25,
            max: 80,
            step: 1,
            provided: 80,
          },
          {
            label: 'Deaths averted per person-year',
            unit: '',
            dp: 4,
            min: 0.0002,
            max: 0.001,
            step: 0.0001,
            provided: 0.0008,
          },
        ],
      },
    ],
  },
} as const satisfies Record<SlateId, Slate>;

/** The other slate. The assisted slate is drawn; the control round gets this one. */
export function otherSlate(id: SlateId): SlateId {
  return id === 'A' ? 'B' : 'A';
}
