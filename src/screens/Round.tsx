/**
 * A round of three cases, in one of the two conditions.
 *
 * One component, not two. The conditions differ in what is shown — the assisted
 * round adds a supplied read and pre-selects a recommendation — and in nothing
 * else, so keeping them apart is how a fix to one silently fails to reach the
 * other.
 *
 * The important line in this file is the `effRec` call. In the assisted round the
 * decision row renders on the supplied recommendation, so the button looks
 * chosen; `ownRec` — which is what every measure reads — stays empty until the
 * participant clicks. Nothing here may write that choice back into state.
 */

import type { RefObject } from 'preact';
import { ARMS, REC_LABELS, recSentencePrefix } from '../content/arms.js';
import { ROUND } from '../content/shell.js';
import type { Case, Condition, Rec, Slate } from '../content/types.js';
import type { Assignment } from '../domain/assignment.js';
import type { CaseState } from '../domain/metrics.js';
import { effRec } from '../domain/metrics.js';
import { calc, money } from '../domain/model.js';
import type { Ordinal } from '../state/screen.js';
import { FlagButton } from '../ui/FlagButton.js';
import { RadioGroup } from '../ui/RadioGroup.js';
import type { RadioOption } from '../ui/RadioGroup.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';
import { Slider } from '../ui/Slider.js';

const REC_OPTIONS: readonly RadioOption<Rec>[] = [
  { value: 'fund', label: REC_LABELS.fund },
  { value: 'investigate', label: REC_LABELS.investigate },
  { value: 'pass', label: REC_LABELS.pass },
];

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly ordinal: Ordinal;
  readonly condition: Condition;
  readonly slate: Slate;
  readonly assign: Assignment;
  readonly prefill: boolean;
  readonly data: readonly CaseState[];
  readonly onTogglePanel: (caseIndex: number, panel: 'model' | 'evidence') => void;
  readonly onSetValue: (caseIndex: number, sliderIndex: number, value: number) => void;
  readonly onChooseRec: (caseIndex: number, rec: Rec) => void;
  readonly onToggleFlag: (caseIndex: number) => void;
  readonly onContinue: () => void;
}

export function Round({
  containerRef,
  ordinal,
  condition,
  slate,
  assign,
  prefill,
  data,
  onTogglePanel,
  onSetValue,
  onChooseRec,
  onToggleFlag,
  onContinue,
}: Props) {
  const assisted = condition === 'assisted';
  const arm = ARMS[assign.armKey];
  const kicker = (assisted ? ROUND.assistedKicker : ROUND.unassistedKicker).replace(
    '{n}',
    String(ordinal),
  );

  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={slate.name}
      standfirst={assisted ? ROUND.assistedLead : ROUND.unassistedLead}
      kicker={kicker}
      accent={condition}
    >
      <ol class="dm-cases">
        {slate.cases.map((c: Case, caseIndex: number) => {
          const st = data[caseIndex];
          if (st === undefined) return null;

          const cost = money(calc(st.vals));
          const shown = effRec(st, { assisted, prefill, suppliedRec: c.rec });
          const headingId = `dm-case-${String(caseIndex)}`;
          const decisionId = `dm-decision-${String(caseIndex)}`;

          return (
            <li class="dm-case" key={c.org}>
              <h2 class="dm-case-org" id={headingId}>
                {c.org}
              </h2>
              <p class="dm-case-cause">{c.cause}</p>

              {assisted ? (
                <div class="dm-supplied">
                  <button
                    type="button"
                    class="dm-disclosure"
                    aria-expanded={st.modelOpen}
                    onClick={() => {
                      onTogglePanel(caseIndex, 'model');
                    }}
                  >
                    {st.modelOpen ? ROUND.hideModel : ROUND.showModel}
                  </button>
                  {st.modelOpen ? (
                    <div class="dm-supplied-body">
                      <p class="dm-supplied-heading">{arm.label}</p>
                      <p class="dm-body">{c.summary}</p>
                      <p class="dm-supplied-rec">
                        {recSentencePrefix(arm)}
                        {REC_LABELS[c.rec]}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div class="dm-readout">
                <span class="dm-readout-label">
                  {ROUND.costPrefix} {c.outcome}
                </span>
                <span class="dm-readout-figure">{cost}</span>
              </div>

              <div class="dm-sliders">
                {c.a.map((spec, sliderIndex) => (
                  <Slider
                    key={spec.label}
                    id={`dm-s-${String(caseIndex)}-${String(sliderIndex)}`}
                    spec={spec}
                    value={st.vals[sliderIndex] ?? spec.min}
                    note={assisted ? ROUND.suppliedNote : ROUND.midpointNote}
                    onInput={(value) => {
                      onSetValue(caseIndex, sliderIndex, value);
                    }}
                  />
                ))}
              </div>

              <div class="dm-evidence">
                <button
                  type="button"
                  class="dm-disclosure"
                  aria-expanded={st.evidenceOpen}
                  onClick={() => {
                    onTogglePanel(caseIndex, 'evidence');
                  }}
                >
                  {st.evidenceOpen ? ROUND.hideEvidence : ROUND.showEvidence}
                </button>
                {st.evidenceOpen ? <p class="dm-body dm-evidence-body">{c.evidence}</p> : null}
              </div>

              <div class="dm-decision">
                <p class="dm-decision-heading" id={decisionId}>
                  {ROUND.decisionHeading}
                </p>
                <RadioGroup
                  labelledBy={decisionId}
                  options={REC_OPTIONS}
                  value={shown === '' ? null : shown}
                  orientation="horizontal"
                  onChange={(rec) => {
                    onChooseRec(caseIndex, rec);
                  }}
                />
                <FlagButton
                  pressed={st.flagged}
                  onLabel={ROUND.flagOn}
                  offLabel={ROUND.flagOff}
                  onToggle={() => {
                    onToggleFlag(caseIndex);
                  }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-solid" onClick={onContinue}>
          {ROUND.continueLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
