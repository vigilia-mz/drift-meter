/**
 * Round 3: the four rules, run.
 *
 * Commit then reveal. The reader gives a read and a guess at the driving
 * assumption before any figure exists on the page — and `revealed` is monotonic,
 * so there is no path back. The screen says so rather than offering a control
 * that pretends otherwise.
 *
 * Nothing here is measured. Round 3 replays two of the assisted slate's cases,
 * and if it wrote into the records the debrief already reported on, moving a
 * slider here would raise evaluative range after the reader had been shown it.
 * `R3CaseState` has no `touched` array for exactly that reason.
 *
 * The tie is reachable and is handled rather than broken. `dominantSet` returns
 * every assumption within 5% of the widest swing; slate B's vitamin A case is a
 * genuine two-way tie and slate B always replays it, so a slate-B run always
 * lands here.
 */

import { useState } from 'preact/hooks';
import type { RefObject } from 'preact';
import { ROUND3 } from '../content/round3.js';
import { SCREENS } from '../content/shell.js';
import { SLATES } from '../content/slates.js';
import type { Case, Rec } from '../content/types.js';
import { REC_LABELS } from '../content/arms.js';
import type { Assignment } from '../domain/assignment.js';
import { calc, dominantSet, intervalFor, money } from '../domain/model.js';
import type { R3CaseState } from '../state/run.js';
import { RadioGroup } from '../ui/RadioGroup.js';
import type { RadioOption } from '../ui/RadioGroup.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';
import { Slider } from '../ui/Slider.js';

const READ_OPTIONS: readonly RadioOption<Rec>[] = [
  { value: 'fund', label: REC_LABELS.fund },
  { value: 'investigate', label: REC_LABELS.investigate },
  { value: 'pass', label: REC_LABELS.pass },
];

/** The sentence naming what the answer rests on, tie included. */
function driverSentence(c: Case, picked: number | null): string {
  const dominant = dominantSet(c);
  const names = dominant.map((i) => c.a[i]?.label.toLowerCase() ?? '');
  const correct = picked !== null && dominant.includes(picked);

  if (dominant.length > 1) {
    const lead = correct ? ROUND3.driverTiedCorrect : ROUND3.driverWrong;
    return `${lead}${ROUND3.driverTiePrefix}${names.join(' and ')}. ${ROUND3.driverTieNote}`;
  }
  const lead = correct ? ROUND3.driverRight : ROUND3.driverWrong;
  return `${lead}${ROUND3.driverIsPrefix}${names.join('')}.`;
}

function ReplayedCase({
  slot,
  c,
  st,
  onSetValue,
  onCommit,
}: {
  readonly slot: number;
  readonly c: Case;
  readonly st: R3CaseState;
  readonly onSetValue: (slot: number, sliderIndex: number, value: number) => void;
  readonly onCommit: (slot: number, read: Rec, driver: number) => void;
}) {
  const [read, setRead] = useState<Rec | null>(null);
  const [driver, setDriver] = useState<number | null>(null);

  const driverOptions: readonly RadioOption<number>[] = c.a.map((spec, i) => ({
    value: i,
    label: spec.label,
  }));

  const readId = `dm-r3-read-${String(slot)}`;
  const driverId = `dm-r3-driver-${String(slot)}`;

  return (
    <li class="dm-case">
      <p class="dm-kicker">{ROUND3.caseLabel.replace('{n}', String(slot + 1))}</p>
      <h2 class="dm-case-org">{c.org}</h2>
      <p class="dm-case-cause">{c.cause}</p>
      <p class="dm-body">{c.evidence}</p>

      {st.revealed ? null : (
        <div class="dm-commit">
          <p class="dm-panel-heading">{ROUND3.commitHeading}</p>

          <p class="dm-question" id={readId}>
            {ROUND3.readPrompt}
          </p>
          <RadioGroup
            labelledBy={readId}
            options={READ_OPTIONS}
            value={read}
            orientation="horizontal"
            onChange={setRead}
          />

          <p class="dm-question" id={driverId}>
            {ROUND3.driverPrompt}
          </p>
          <RadioGroup
            labelledBy={driverId}
            options={driverOptions}
            value={driver}
            onChange={setDriver}
          />

          <div class="dm-actions">
            <button
              type="button"
              class="dm-button dm-button-solid"
              disabled={read === null || driver === null}
              onClick={() => {
                if (read !== null && driver !== null) onCommit(slot, read, driver);
              }}
            >
              {ROUND3.commitLabel}
            </button>
          </div>
          <p class="dm-note">{ROUND3.commitNote}</p>
        </div>
      )}

      {st.revealed ? (
        <div class="dm-revealed">
          <p class="dm-panel-heading">{ROUND3.rangeHeading}</p>
          <p class="dm-interval">{intervalFor(c)}</p>
          <p class="dm-note">{ROUND3.rangeNote}</p>
          <div class="dm-readout">
            <span class="dm-readout-label">{ROUND3.pointLabel}</span>
            <span class="dm-readout-figure">{money(calc(c.a.map((sp) => sp.provided)))}</span>
          </div>

          <div class="dm-sliders">
            {c.a.map((spec, sliderIndex) => (
              <Slider
                key={spec.label}
                id={`dm-r3-${String(slot)}-${String(sliderIndex)}`}
                spec={spec}
                value={st.vals[sliderIndex] ?? spec.min}
                onInput={(value) => {
                  onSetValue(slot, sliderIndex, value);
                }}
              />
            ))}
          </div>
          <div class="dm-readout">
            <span class="dm-readout-label">{c.outcome}</span>
            <span class="dm-readout-figure">{money(calc(st.vals))}</span>
          </div>

          <p class="dm-panel-heading">{ROUND3.driverHeading}</p>
          <p class="dm-body">{driverSentence(c, st.driver)}</p>

          <p class="dm-panel-heading">{ROUND3.disagreeHeading}</p>
          <p class="dm-body">
            {st.read === '' ? '' : ROUND3.disagreePrefix[st.read]}
            {c.disagree}
          </p>
          <p class="dm-body">
            {ROUND3.changeMindPrefix}
            {c.changeMind}
          </p>
        </div>
      ) : null}
    </li>
  );
}

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly assign: Assignment;
  readonly r3: readonly R3CaseState[];
  readonly onSetValue: (slot: number, sliderIndex: number, value: number) => void;
  readonly onCommit: (slot: number, read: Rec, driver: number) => void;
  readonly onContinue: () => void;
}

export function Round3({ containerRef, assign, r3, onSetValue, onCommit, onContinue }: Props) {
  const slate = SLATES[assign.assistedSlate];
  const allRevealed = r3.every((r) => r.revealed);

  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.round3.title}
      standfirst={ROUND3.standfirst}
      accent="round3"
    >
      <p class="dm-note">{ROUND3.excluded}</p>
      <ol class="dm-cases">
        {r3.map((st, slot) => {
          const c = slate.cases[st.caseIndex];
          if (c === undefined) return null;
          return (
            <ReplayedCase
              key={c.org}
              slot={slot}
              c={c}
              st={st}
              onSetValue={onSetValue}
              onCommit={onCommit}
            />
          );
        })}
      </ol>

      <div class="dm-actions">
        <button
          type="button"
          class="dm-button dm-button-solid"
          disabled={!allRevealed}
          onClick={onContinue}
        >
          {ROUND3.nextLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
