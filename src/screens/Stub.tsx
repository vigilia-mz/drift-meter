/**
 * A screen the rebuild has not reached.
 *
 * It says so rather than rendering an empty frame, for the same reason
 * `drift-meter.html` said so rather than 404ing: a page that is not finished is
 * more useful when it admits it than when it looks broken.
 */

import type { RefObject } from 'preact';
import { SCREENS, STUB } from '../content/shell.js';
import type { ScreenName } from '../content/types.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly name: ScreenName;
  readonly onRestart: () => void;
}

export function Stub({ containerRef, name, onRestart }: Props) {
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS[name].title}
      standfirst={STUB.heading}
    >
      <p class="dm-body">{STUB.body}</p>
      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-ghost" onClick={onRestart}>
          {STUB.back}
        </button>
      </div>
    </ScreenFrame>
  );
}
