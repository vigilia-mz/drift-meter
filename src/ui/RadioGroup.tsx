/**
 * The radio group, built once and used five times.
 *
 * Not `<input type="radio">`, because these are wide labelled cards rather than
 * dots, and restyling a native radio into one reliably means hiding the control
 * that carries the semantics. So the semantics are supplied explicitly, to the
 * WAI-ARIA pattern: a `radiogroup` wrapping `radio` children, one tab stop for
 * the whole group, and arrow keys that move and select in a single step.
 *
 * The key arithmetic lives in `radio.ts`, where it is unit-tested. This file is
 * the wiring.
 */

import { useRef } from 'preact/hooks';
import { nextRadioIndex, rovingTabIndex } from './radio.js';

export interface RadioOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
  /** Optional second line, associated with the option rather than read as its name. */
  readonly hint?: string;
}

interface Props<T extends string | number> {
  /** Accessible name for the group. Rendered visually by the caller. */
  readonly labelledBy: string;
  readonly options: readonly RadioOption<T>[];
  /** `null` until the participant chooses. Never pre-filled from a supplied value. */
  readonly value: T | null;
  readonly onChange: (value: T) => void;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly describedBy?: string;
}

export function RadioGroup<T extends string | number>({
  labelledBy,
  options,
  value,
  onChange,
  orientation = 'vertical',
  describedBy,
}: Props<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const selectedIndex = options.findIndex((o) => o.value === value);

  function onKeyDown(event: KeyboardEvent) {
    const next = nextRadioIndex(event.key, selectedIndex, options.length);
    if (next === null) return;

    const option = options[next];
    if (option === undefined) return;

    // Only now, once the key is one this group claims. Calling preventDefault
    // unconditionally would swallow Tab and trap the reader in the group.
    event.preventDefault();
    onChange(option.value);

    // Moving selection moves focus with it, which is what makes the group a
    // single tab stop rather than a list the reader has to walk out of.
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[next]?.focus();
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-orientation={orientation}
      class={`dm-radiogroup dm-radiogroup-${orientation}`}
      onKeyDown={onKeyDown}
    >
      {options.map((option, index) => {
        const checked = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={rovingTabIndex(index, selectedIndex)}
            class="dm-radio"
            onClick={() => {
              onChange(option.value);
            }}
          >
            <span class="dm-radio-mark" aria-hidden="true">
              {checked ? '◉' : '○'}
            </span>
            <span class="dm-radio-text">
              <span class="dm-radio-label">{option.label}</span>
              {option.hint === undefined ? null : <span class="dm-radio-hint">{option.hint}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
