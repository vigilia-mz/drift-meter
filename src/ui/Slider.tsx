/**
 * One assumption slider.
 *
 * A native `<input type="range">` with a real `<label for>`, because the native
 * control already carries the keyboard behaviour, the step arithmetic and the
 * value semantics, and every custom replacement gives some of that back.
 *
 * `aria-valuetext` is the part that matters. Left to itself a screen reader
 * announces the raw number, and this instrument's ranges include values like
 * 0.0006 — meaningless read aloud, where "$2.00" and "85%" are not. `fmtAssump`
 * is the same formatter the sighted reader sees, so both are told the same thing.
 *
 * The supplied-value note is associated with `aria-describedby` rather than left
 * floating beside the control, so a screen-reader user is given the anchor the
 * sighted user is being anchored by.
 */

import type { AssumptionSpec } from '../content/types.js';
import { fmtAssump } from '../domain/model.js';

interface Props {
  readonly id: string;
  readonly spec: AssumptionSpec;
  readonly value: number;
  readonly onInput: (value: number) => void;
  /** The "supplied value" or "starts at the midpoint" note, if the round has one. */
  readonly note?: string;
}

export function Slider({ id, spec, value, onInput, note }: Props) {
  const noteId = `${id}-note`;
  return (
    <div class="dm-slider">
      <div class="dm-slider-head">
        <label class="dm-slider-label" for={id}>
          {spec.label}
        </label>
        <output class="dm-slider-value" for={id}>
          {fmtAssump(spec, value)}
        </output>
      </div>
      <input
        id={id}
        class="dm-slider-input"
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        aria-valuetext={fmtAssump(spec, value)}
        aria-describedby={note === undefined ? undefined : noteId}
        onInput={(event) => {
          onInput(Number(event.currentTarget.value));
        }}
      />
      {note === undefined ? null : (
        <p class="dm-slider-note" id={noteId}>
          {note}
        </p>
      )}
    </div>
  );
}
