/**
 * The confidence gate, between the two rounds and after the second.
 *
 * A gate rather than a question the reader can skip past. `Confidence` uses 0 as
 * its not-yet-rated sentinel, and `metrics()` rescales 0 to a perceived score of
 * nothing — so letting an unrated round through would publish a self-rating the
 * reader never gave, and a confidence gap of minus their whole behavioural score.
 * The reducer refuses the transition; this screen says why, and disables the
 * control so a keyboard user meets the same wall as everyone else rather than
 * pressing a button that does nothing.
 */

import type { RefObject } from 'preact';
import { RATE } from '../content/shell.js';
import type { Confidence } from '../domain/metrics.js';
import type { Ordinal } from '../state/screen.js';
import { RadioGroup } from '../ui/RadioGroup.js';
import type { RadioOption } from '../ui/RadioGroup.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

const OPTIONS: readonly RadioOption<number>[] = RATE.scale.map((point) => ({
  value: point.value,
  label: point.label,
}));

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly ordinal: Ordinal;
  readonly confidence: Confidence;
  readonly onRate: (value: Confidence) => void;
  readonly onContinue: () => void;
}

export function Rate({ containerRef, ordinal, confidence, onRate, onContinue }: Props) {
  const rated = confidence !== 0;
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={RATE.heading}
      kicker={`Round ${String(ordinal)} of 2`}
    >
      <p class="dm-question" id="dm-confidence">
        {RATE.question}
      </p>
      <RadioGroup
        labelledBy="dm-confidence"
        describedBy="dm-confidence-note"
        options={OPTIONS}
        value={rated ? confidence : null}
        onChange={(value) => {
          // The scale only ever offers 1..5; 0 is the sentinel and has no option.
          onRate(value as Confidence);
        }}
      />
      <p class="dm-note" id="dm-confidence-note">
        {RATE.note}
      </p>

      <div class="dm-actions">
        <button
          type="button"
          class="dm-button dm-button-solid"
          disabled={!rated}
          onClick={onContinue}
        >
          {RATE.continueLabel}
        </button>
        {rated ? null : <p class="dm-note dm-gate">{RATE.gateNote}</p>}
      </div>
    </ScreenFrame>
  );
}
