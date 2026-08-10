/**
 * The debrief.
 *
 * Renders from the complete run only, which is a type in which both rounds are
 * present — so nothing here asserts that a round exists. Every threshold and
 * branch it uses is already implemented and tested in `reveal.ts` and `trap.ts`;
 * this file chooses copy by key and never re-derives a comparison.
 *
 * Two things it must not do. It must not render framing autonomy's `null` as a
 * zero (see `PairedBar`). And it must not describe a pinned run as
 * counterbalanced — `Run.forced` was snapshotted at the draw for exactly this.
 */

import type { RefObject } from 'preact';
import { ARM_NOTES, ARMS } from '../content/arms.js';
import { DEBRIEF, MEASURES } from '../content/debrief.js';
import { SCREENS } from '../content/shell.js';
import { TRAP, TRAP_HEADINGS } from '../content/trap.js';
import type { Metrics } from '../domain/metrics.js';
import { metrics } from '../domain/metrics.js';
import { closingKey, gapBand, headlineFor } from '../domain/reveal.js';
import { trapVerdict } from '../domain/trap.js';
import type { Run } from '../state/run.js';
import { slateFor } from '../state/run.js';
import { PairedBar } from '../ui/PairedBar.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  /** Narrowed by the caller: the debrief exists only for a finished run. */
  readonly run: Extract<Run, { status: 'complete' }>;
  readonly onContinue: () => void;
  readonly onMethod: () => void;
  readonly onProcess: () => void;
}

function valueOf(m: Metrics, key: (typeof MEASURES)[number]['key']) {
  return m[key];
}

export function Debrief({ containerRef, run, onContinue, onMethod, onProcess }: Props) {
  const assistedSlate = slateFor(run.assign, 'assisted');
  const unassistedSlate = slateFor(run.assign, 'unassisted');

  const a = metrics({
    data: run.rounds.assisted.data,
    slate: assistedSlate,
    condition: 'assisted',
    confidence: run.rounds.assisted.confidence,
  });
  const u = metrics({
    data: run.rounds.unassisted.data,
    slate: unassistedSlate,
    condition: 'unassisted',
    confidence: run.rounds.unassisted.confidence,
  });

  const headline = headlineFor(a, u);
  const arm = ARMS[run.assign.armKey];

  // The trap lives in the assisted round. Every branch of its copy names a
  // supplied figure or a supplied recommendation, neither of which exists in the
  // control round — running it against that round would print prose about a
  // number the reader was never shown.
  const trapState = run.rounds.assisted.data[assistedSlate.trapCase];
  const trapCase = assistedSlate.cases[assistedSlate.trapCase];
  const verdict =
    trapState === undefined || trapCase === undefined
      ? null
      : trapVerdict({
          st: trapState,
          trapSlider: assistedSlate.trapSlider,
          suppliedRec: trapCase.rec,
          prefill: run.prefill,
        });

  const caseCount = assistedSlate.cases.length;

  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.debrief.title}
      standfirst={DEBRIEF.standfirst}
    >
      <section aria-labelledby="dm-measures">
        <h2 class="dm-section-heading" id="dm-measures">
          {DEBRIEF.headlineHeading}
        </h2>
        <p class="dm-body">{DEBRIEF.headline[headline]}</p>

        {MEASURES.map((measure) => (
          <PairedBar
            key={measure.key}
            label={measure.label}
            what={measure.what}
            assisted={valueOf(a, measure.key)}
            unassisted={valueOf(u, measure.key)}
            assistedLabel={DEBRIEF.legendAssisted}
            unassistedLabel={DEBRIEF.legendUnassisted}
            undefinedText={DEBRIEF.undefinedBar}
            undefinedCaption={DEBRIEF.undefinedCaption}
          />
        ))}
      </section>

      <section aria-labelledby="dm-counts">
        <h2 class="dm-section-heading" id="dm-counts">
          {DEBRIEF.countsHeading}
        </h2>
        <table class="dm-table">
          <thead>
            <tr>
              {/* Empty on the page, named to a screen reader. See `countsRowAxis`. */}
              <th scope="col">
                <span class="dm-sr-only">{DEBRIEF.countsRowAxis}</span>
              </th>
              <th scope="col">{DEBRIEF.legendAssisted}</th>
              <th scope="col">{DEBRIEF.legendUnassisted}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{DEBRIEF.counts.opens}</th>
              <td>{`${String(a.opens)}/${String(caseCount)}`}</td>
              <td>{`${String(u.opens)}/${String(caseCount)}`}</td>
            </tr>
            <tr>
              <th scope="row">{DEBRIEF.counts.moved}</th>
              <td>{a.moved}</td>
              <td>{u.moved}</td>
            </tr>
            <tr>
              <th scope="row">{DEBRIEF.counts.flags}</th>
              <td>{a.flags}</td>
              <td>{u.flags}</td>
            </tr>
            <tr>
              <th scope="row">{DEBRIEF.counts.investigate}</th>
              <td>{a.investigate}</td>
              <td>{u.investigate}</td>
            </tr>
            <tr>
              <th scope="row">{DEBRIEF.counts.recsMade}</th>
              <td>{`${String(a.recsMade)}/${String(caseCount)}`}</td>
              <td>{`${String(u.recsMade)}/${String(caseCount)}`}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="dm-gap">
        <h2 class="dm-section-heading" id="dm-gap">
          {DEBRIEF.gapHeading}
        </h2>
        <p class="dm-body">{DEBRIEF.gap[gapBand(a.gap)]}</p>
      </section>

      {verdict === null ? null : (
        <section class="dm-panel" data-accent={verdict.accent} aria-labelledby="dm-trap">
          <p class="dm-panel-heading">{DEBRIEF.trapHeading}</p>
          <p class="dm-note">{DEBRIEF.trapLead}</p>
          <h2 class="dm-trap-heading" id="dm-trap">
            {TRAP_HEADINGS[verdict.heading]}
          </h2>
          <p class="dm-body">{TRAP[assistedSlate.id][verdict.branch]}</p>
        </section>
      )}

      <section aria-labelledby="dm-assignment">
        <h2 class="dm-section-heading" id="dm-assignment">
          {DEBRIEF.assignmentHeading}
        </h2>
        <dl class="dm-rows">
          <div class="dm-row">
            <dt class="dm-row-label">{DEBRIEF.assignment.order}</dt>
            <dd class="dm-row-value">
              {run.assign.assistedFirst
                ? `${DEBRIEF.legendAssisted} first. `
                : `${DEBRIEF.legendUnassisted} first. `}
              {run.forced.order ? DEBRIEF.forced : DEBRIEF.counterbalanced}
            </dd>
          </div>
          <div class="dm-row">
            <dt class="dm-row-label">{DEBRIEF.assignment.slate}</dt>
            <dd class="dm-row-value">
              {`${assistedSlate.name}. `}
              {run.forced.slate ? DEBRIEF.forced : DEBRIEF.randomisedSlate}
            </dd>
          </div>
          <div class="dm-row">
            <dt class="dm-row-label">{DEBRIEF.assignment.arm}</dt>
            <dd class="dm-row-value">
              {`${arm.tag}. `}
              {run.forced.arm ? DEBRIEF.forced : DEBRIEF.randomisedArm}
            </dd>
          </div>
        </dl>
        <p class="dm-body">{ARM_NOTES[run.assign.armKey]}</p>
      </section>

      <section aria-labelledby="dm-closing">
        <h2 class="dm-section-heading" id="dm-closing">
          {DEBRIEF.closingHeading}
        </h2>
        <p class="dm-body">{DEBRIEF.closing[closingKey(a.auto)]}</p>
        <p class="dm-body">{DEBRIEF.closingCases}</p>
      </section>

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-solid" onClick={onContinue}>
          {DEBRIEF.nextLabel}
        </button>
        <button type="button" class="dm-button dm-button-ghost" onClick={onMethod}>
          {DEBRIEF.methodLabel}
        </button>
        <button type="button" class="dm-button dm-button-ghost" onClick={onProcess}>
          {DEBRIEF.processLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
