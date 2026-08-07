/**
 * The frame every screen renders into.
 *
 * There is no router here — the whole page swaps in place — so nothing tells a
 * keyboard or screen-reader user that anything happened. The frame is the
 * substitute: a focusable `<main>` with the heading as its first child, which the
 * shell focuses on every screen change.
 *
 * `tabIndex={-1}` makes the container programmatically focusable without adding
 * it to the tab order. Focusing a container rather than the first control means
 * the heading is announced before the reader is dropped into a widget.
 */

import type { ComponentChildren, RefObject } from 'preact';
import { KICKER } from '../content/shell.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly heading: string;
  readonly standfirst?: string;
  /** Small line above the heading — round number, condition, section. */
  readonly kicker?: string;
  /** Semantic accent role. Never a colour: see `tokens.css`. */
  readonly accent?: 'assisted' | 'unassisted' | 'round3' | 'caught' | 'declined' | 'neutral';
  readonly children: ComponentChildren;
}

export function ScreenFrame({
  containerRef,
  heading,
  standfirst,
  kicker,
  accent,
  children,
}: Props) {
  return (
    <main
      ref={containerRef}
      tabIndex={-1}
      class="dm-screen"
      data-accent={accent}
      aria-labelledby="dm-heading"
    >
      <div class="dm-masthead">{KICKER}</div>
      {kicker === undefined ? null : <p class="dm-kicker">{kicker}</p>}
      <h1 id="dm-heading" class="dm-heading">
        {heading}
      </h1>
      {standfirst === undefined ? null : <p class="dm-standfirst">{standfirst}</p>}
      {children}
    </main>
  );
}
