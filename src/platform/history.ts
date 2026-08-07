/**
 * Browser Back, for the two reference screens only.
 *
 * The instrument has no router: the whole page swaps in place and the reducer
 * holds where the reader is. That is right for the run — a Back button that
 * un-answers a question is worse than no Back button — and wrong for the protocol
 * and process screens, which are documents a reader steps aside into. Before this,
 * a reader who entered the protocol screen from the intro's side door pressed Back
 * and left the site.
 *
 * So exactly two screens get a history entry:
 *
 * - Entering `method` or `process` pushes an entry. Back returns the reader to
 *   whatever they stepped aside from, and Forward brings them back to it.
 * - Every other screen change replaces the current entry instead, which keeps the
 *   entry beneath the reference screen describing where the reader actually was.
 *   No entry is added, so Back from anywhere on the linear path still leaves the
 *   site rather than rewinding the run.
 *
 * Three decisions worth stating, because each looks like an omission:
 *
 * **The URL does not change.** A pushed entry keeps the current URL, query string
 * and all. Writing `?screen=method` would produce a link that, reloaded, shows the
 * intro — a URL that lies about what it addresses — and it would also have to
 * carry the run parameters through untouched. Two history entries on one URL is
 * honest; a URL that does not survive a reload is not.
 *
 * **Nothing is read from history on load.** The stored entry names a screen, not a
 * run, and a reload has no run. Restoring the debrief from a history entry would
 * render a readout of a session that no longer exists. Entries are read only in
 * response to `popstate`, where the reducer state is still in hand.
 *
 * That has a consequence worth stating rather than discovering. A reader who
 * reloads while stepped aside into one of these screens leaves stale entries
 * beneath them, still naming screens from the session they just lost. The reducer
 * handles it — `popTo` sends a Back press that names a screen the session cannot
 * produce to the intro, rather than to a stub claiming the screen is unbuilt. What
 * remains is that a Back press immediately after a reload can land on the screen
 * already showing, and so appear to do nothing. Fixing that would mean trusting an
 * entry on load, which is the thing this design declines to do.
 *
 * **The in-app Back on those screens calls `history.back()`** rather than
 * dispatching. Dispatching would replace the pushed entry and leave a stale one
 * beneath it, so the reader's next Back press would appear to do nothing.
 *
 * The parsing and the push-or-replace decision are pure and take plain values, so
 * the whole scheme is exercised in Vitest with no browser.
 */

import { SCREENS } from '../content/shell.js';
import type { Ordinal, Screen } from '../state/screen.js';
import { ALL_SCREENS, isReference, ordinalOf, screenKey } from '../state/screen.js';

/**
 * The key this app writes into a history entry.
 *
 * Namespaced, so an entry written by something else — a browser extension, a
 * previous page on the same origin — reads as foreign and is ignored rather than
 * half-parsed.
 */
const MARKER = 'driftMeter';

/** The part of `window.history` this module uses. Kept small so a test can fake it. */
export interface HistoryLike {
  readonly state: unknown;
  pushState(data: unknown, unused: string): void;
  replaceState(data: unknown, unused: string): void;
}

/** What `syncHistory` did, returned so a test can assert on it. */
export type HistoryAction = 'push' | 'replace' | 'none';

/** The value stored in a history entry for a screen. */
export function entryFor(screen: Screen): unknown {
  const ordinal = ordinalOf(screen);
  return {
    [MARKER]: ordinal === undefined ? { name: screen.name } : { name: screen.name, ordinal },
  };
}

/**
 * The screen a history entry names, or `null` if it names nothing this app wrote.
 *
 * Matched against `ALL_SCREENS` rather than reassembled from its parts, so a
 * round with no ordinal or an intro carrying one is rejected instead of producing
 * a screen the union does not contain.
 */
export function screenFromEntry(state: unknown): Screen | null {
  if (typeof state !== 'object' || state === null) return null;
  const marked = (state as Record<string, unknown>)[MARKER];
  if (typeof marked !== 'object' || marked === null) return null;

  const { name, ordinal } = marked as { readonly name?: unknown; readonly ordinal?: unknown };
  if (typeof name !== 'string' || !Object.hasOwn(SCREENS, name)) return null;

  const parsed: Ordinal | undefined = ordinal === 1 || ordinal === 2 ? ordinal : undefined;
  return ALL_SCREENS.find((s) => s.name === name && ordinalOf(s) === parsed) ?? null;
}

/**
 * Whether arriving at `next` should add a history entry, rewrite the current one,
 * or leave history alone.
 *
 * `none` is what makes this safe to run on every screen change. After a Back or a
 * Forward press the browser has already moved to an entry that names the screen
 * being rendered, so the effect that follows the resulting dispatch finds nothing
 * to do — rather than pushing a duplicate of the entry the reader just navigated
 * to, which would make one Back press require two.
 */
export function decideHistory(currentEntry: unknown, next: Screen): HistoryAction {
  const current = screenFromEntry(currentEntry);
  if (current !== null && screenKey(current) === screenKey(next)) return 'none';
  return isReference(next) ? 'push' : 'replace';
}

/**
 * Bring history into line with the screen being shown.
 *
 * Called on every screen change. Both writes omit the URL argument, which leaves
 * the address bar — and therefore the run parameters — exactly as they were.
 */
export function syncHistory(history: HistoryLike, next: Screen): HistoryAction {
  const action = decideHistory(history.state, next);
  if (action === 'push') history.pushState(entryFor(next), '');
  if (action === 'replace') history.replaceState(entryFor(next), '');
  return action;
}
