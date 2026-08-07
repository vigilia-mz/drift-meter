/**
 * The consent and data-handling step, added in v0.3.
 *
 * Two of the promises on this screen are load-bearing elsewhere: “Leaves the
 * browser: nothing” and “no cookie, no analytics, no fingerprint” are the stated
 * reason the fonts are self-hosted, because a third-party font request would make
 * both false on every page load. If this copy changes, that rule changes with it.
 *
 * The local-only choice is a real branch rather than a courtesy. It is stored on
 * the run and gates every path to the endpoint.
 */

import type { RefObject } from 'preact';
import { CONSENT } from '../content/shell.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly onBegin: (localOnly: boolean) => void;
  readonly onBack: () => void;
}

export function Consent({ containerRef, onBegin, onBack }: Props) {
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={CONSENT.heading}
      standfirst={CONSENT.standfirst}
    >
      <dl class="dm-rows">
        {CONSENT.rows.map((row) => (
          <div class="dm-row" key={row.label}>
            <dt class="dm-row-label">{row.label}</dt>
            <dd class="dm-row-value">{row.value}</dd>
          </div>
        ))}
      </dl>

      <section class="dm-panel" aria-labelledby="dm-reflection">
        <h2 class="dm-panel-heading" id="dm-reflection">
          {CONSENT.reflectionHeading}
        </h2>
        <p class="dm-body">{CONSENT.reflection}</p>
      </section>

      <section aria-labelledby="dm-constructed">
        <h2 class="dm-section-heading" id="dm-constructed">
          {CONSENT.constructedLabel}
        </h2>
        <p class="dm-body">{CONSENT.constructed}</p>
      </section>

      <div class="dm-actions">
        <button
          type="button"
          class="dm-button dm-button-solid"
          onClick={() => {
            onBegin(false);
          }}
        >
          {CONSENT.begin}
        </button>
        <button
          type="button"
          class="dm-button dm-button-ghost"
          onClick={() => {
            onBegin(true);
          }}
        >
          {CONSENT.beginLocal}
        </button>
      </div>

      <button type="button" class="dm-back" onClick={onBack}>
        {CONSENT.back}
      </button>
    </ScreenFrame>
  );
}
