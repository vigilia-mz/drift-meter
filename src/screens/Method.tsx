/**
 * The protocol screen.
 *
 * A reference document rather than a step: reachable from the intro and from the
 * debrief, outside the linear path, and one of the two screens that gets a browser
 * history entry. Its Back control calls `history.back()` rather than dispatching,
 * so the in-app control and the browser's own Back do the same thing.
 *
 * It renders and computes nothing. Every constant it prints is transcribed from
 * `src/domain/`, and `method.test.ts` fails if any of them stops matching.
 */

import type { RefObject } from 'preact';
import { armRows, MEASURE_SPECS, METHOD, PRED_ROWS } from '../content/method.js';
import { SCREENS } from '../content/shell.js';
import { PINNED_MODEL } from '../../shared/model.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly onBack: () => void;
  readonly onProcess: () => void;
}

export function Method({ containerRef, onBack, onProcess }: Props) {
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.method.title}
      standfirst={METHOD.standfirst}
    >
      <section aria-labelledby="dm-design">
        <h2 class="dm-section-heading" id="dm-design">
          {METHOD.designHeading}
        </h2>
        <p class="dm-body">{METHOD.designLead}</p>
        <dl class="dm-rows">
          {METHOD.designRows.map((row) => (
            <div class="dm-row" key={row.label}>
              <dt class="dm-row-label">{row.label}</dt>
              <dd class="dm-row-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="dm-arms">
        <h2 class="dm-section-heading" id="dm-arms">
          {METHOD.armsHeading}
        </h2>
        <p class="dm-body">{METHOD.armsLead}</p>
        <div class="dm-scroll">
          <table class="dm-table dm-table-prose">
            <thead>
              <tr>
                <th scope="col">{METHOD.armsColumns.arm}</th>
                <th scope="col">{METHOD.armsColumns.supplied}</th>
                <th scope="col">{METHOD.armsColumns.isolates}</th>
              </tr>
            </thead>
            <tbody>
              {armRows().map((row) => (
                <tr key={row.arm}>
                  <th scope="row">{row.arm}</th>
                  <td>{row.supplied}</td>
                  <td>{row.isolates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="dm-measures-spec">
        <h2 class="dm-section-heading" id="dm-measures-spec">
          {METHOD.measuresHeading}
        </h2>
        <p class="dm-body">{METHOD.measuresLead}</p>

        {/*
          Before the table rather than after it. A reader who stops at the first
          measure should already know that one of the seven was named in advance,
          and that the naming buys nothing this build can compute.
        */}
        <h3 class="dm-spec-title">{METHOD.primaryOutcomeHeading}</h3>
        <p class="dm-body">{METHOD.primaryOutcome}</p>
        <p class="dm-body">{METHOD.primaryOutcomeWhy}</p>
        <p class="dm-note">{METHOD.primaryOutcomeLimit}</p>

        <ol class="dm-specs">
          {MEASURE_SPECS.map((measure) => (
            <li class="dm-spec" key={measure.key}>
              <h3 class="dm-spec-title">{measure.label}</h3>
              <dl class="dm-rows dm-rows-tight">
                <div class="dm-row">
                  <dt class="dm-row-label">{METHOD.measuresFields.definition}</dt>
                  <dd class="dm-row-value">{measure.definition}</dd>
                </div>
                <div class="dm-row">
                  <dt class="dm-row-label">{METHOD.measuresFields.formula}</dt>
                  <dd class="dm-row-value">
                    <code class="dm-formula">{measure.formula}</code>
                  </dd>
                </div>
                <div class="dm-row">
                  <dt class="dm-row-label">{METHOD.measuresFields.threat}</dt>
                  <dd class="dm-row-value">{measure.threat}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>

        <p class="dm-note">{METHOD.measuresNote}</p>
      </section>

      <section aria-labelledby="dm-predictions">
        <h2 class="dm-section-heading" id="dm-predictions">
          {METHOD.predictionsHeading}
        </h2>
        <p class="dm-body">{METHOD.predictionsLead}</p>
        <div class="dm-scroll">
          <table class="dm-table dm-table-prose">
            <thead>
              <tr>
                <th scope="col">{METHOD.predictionsColumns.id}</th>
                <th scope="col">{METHOD.predictionsColumns.claim}</th>
                <th scope="col">{METHOD.predictionsColumns.test}</th>
              </tr>
            </thead>
            <tbody>
              {PRED_ROWS.map((row) => (
                <tr key={row.id}>
                  <th scope="row" class="dm-mono">
                    {row.id}
                  </th>
                  <td>{row.claim}</td>
                  <td>{row.test}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p class="dm-note">{METHOD.predictionsOrderNote}</p>
        <p class="dm-note">{METHOD.predictionsCaveat}</p>
      </section>

      <section aria-labelledby="dm-provenance">
        <h2 class="dm-section-heading" id="dm-provenance">
          {METHOD.provenanceHeading}
        </h2>
        <p class="dm-body">{METHOD.stimulusLead}</p>
        <dl class="dm-rows">
          {METHOD.stimulusRows.map((row) => (
            <div class="dm-row" key={row.label}>
              <dt class="dm-row-label">{row.label}</dt>
              <dd class="dm-row-value">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p class="dm-body">{METHOD.modelLead}</p>
        <dl class="dm-rows">
          <div class="dm-row">
            <dt class="dm-row-label">{METHOD.modelPinLabel}</dt>
            <dd class="dm-row-value">
              <code class="dm-formula">{PINNED_MODEL}</code>
            </dd>
          </div>
          <div class="dm-row">
            <dt class="dm-row-label">{METHOD.modelPrintedLabel}</dt>
            <dd class="dm-row-value">{METHOD.modelPrinted}</dd>
          </div>
          <div class="dm-row">
            <dt class="dm-row-label">{METHOD.modelDarkLabel}</dt>
            <dd class="dm-row-value">{METHOD.modelDark}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="dm-limits">
        <h2 class="dm-section-heading" id="dm-limits">
          {METHOD.limitsHeading}
        </h2>
        <p class="dm-body">{METHOD.limitsLead}</p>
        <ul class="dm-list">
          {METHOD.limits.map((limit) => (
            <li class="dm-list-item" key={limit}>
              {limit}
            </li>
          ))}
        </ul>
      </section>

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-solid" onClick={onBack}>
          {METHOD.backLabel}
        </button>
        <button type="button" class="dm-button dm-button-ghost" onClick={onProcess}>
          {METHOD.processLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
