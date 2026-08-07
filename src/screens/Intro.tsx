/**
 * The first screen.
 *
 * It carries the sixty-second path added in v0.4, for readers who will not reach
 * the later screens. That is not a summary of the instrument; it is the argument
 * stated in full at a length someone will actually read, so that leaving early
 * still leaves with something true.
 */

import type { RefObject } from 'preact';
import { INTRO } from '../content/shell.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly onBegin: () => void;
  readonly onMethod: () => void;
}

export function Intro({ containerRef, onBegin, onMethod }: Props) {
  return (
    <ScreenFrame containerRef={containerRef} heading={INTRO.heading} standfirst={INTRO.standfirst}>
      {INTRO.body.map((p) => (
        <p key={p} class="dm-body">
          {p}
        </p>
      ))}

      <section aria-labelledby="dm-constructed">
        <h2 class="dm-section-heading" id="dm-constructed">
          {INTRO.constructedLabel}
        </h2>
        <p class="dm-body">{INTRO.constructed}</p>
      </section>

      <section class="dm-panel" aria-labelledby="dm-short">
        <h2 class="dm-panel-heading" id="dm-short">
          {INTRO.shortLabel}
        </h2>
        {INTRO.short.map((p) => (
          <p key={p} class="dm-body">
            {p}
          </p>
        ))}
      </section>

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-solid" onClick={onBegin}>
          {INTRO.begin}
        </button>
        <button type="button" class="dm-button dm-button-ghost" onClick={onMethod}>
          {INTRO.methodLink}
        </button>
      </div>
    </ScreenFrame>
  );
}
