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
import { FOOT, KICKER } from '../content/shell.js';

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
    <>
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
      {/*
      A sibling of `<main>` rather than a child, which is not a style preference:
      `contentinfo` may not sit inside another landmark, and axe fails the sweep on
      every screen when it does. `<footer>` here is a top-level element, so it carries
      the role implicitly and a screen reader can reach it by landmark from anywhere in
      a run — which is the point, since no screen in the instrument has an address.

      The inner div is what carries the rule and the row. The footer owns the same
      680px column as `.dm-screen`, and a border on that box would run 32px past the
      text on both sides; putting it inside the padding is what lines the rule up with
      the prose above it, without writing 680 − 64 anywhere.
    */}
      <footer class="dm-foot">
        <div class="dm-foot-row">
          <a class="dm-foot-link" href="index.html">
            {FOOT.homeLabel}
          </a>
          <a class="dm-foot-link" href={FOOT.profileUrl}>
            {FOOT.profileLabel}
          </a>
        </div>
      </footer>
    </>
  );
}
