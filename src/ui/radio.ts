/**
 * The radio group's keyboard arithmetic, kept away from the DOM.
 *
 * This is the one primitive built once and used five times — the three decision
 * buttons on every case, the confidence scale, the transfer options, and Round
 * 3's reads and drivers — so getting the key handling wrong gets it wrong
 * everywhere at once. Splitting the arithmetic out means it can be tested under
 * the existing Vitest config, which collects `.test.ts` files under `src` and
 * does not collect `.tsx`: a component test here would pass by never running.
 *
 * The behaviour is the WAI-ARIA radio group pattern. Arrows move and select in
 * one step, which is why there is no separate "commit" key: in a radio group the
 * focused option is the chosen option, and Space is only a way to choose the one
 * already focused.
 */

/** Keys this primitive claims. Anything else falls through to the browser. */
export type RadioKey =
  'ArrowRight' | 'ArrowDown' | 'ArrowLeft' | 'ArrowUp' | 'Home' | 'End' | ' ' | 'Spacebar';

const FORWARD: readonly string[] = ['ArrowRight', 'ArrowDown'];
const BACKWARD: readonly string[] = ['ArrowLeft', 'ArrowUp'];
const SELECT: readonly string[] = [' ', 'Spacebar'];

/**
 * Which option a key press moves to.
 *
 * Returns `null` when the key is not one this group handles, so the caller knows
 * to leave the event alone rather than calling `preventDefault` on every key and
 * swallowing Tab.
 *
 * `current` may be `-1` for a group with nothing selected yet, which is the
 * starting state of every group in this instrument. From there a forward key
 * lands on the first option and a backward key on the last, so a reader who
 * arrows into an untouched group gets an end rather than the middle.
 *
 * Both directions wrap, per the pattern.
 */
export function nextRadioIndex(key: string, current: number, count: number): number | null {
  if (count <= 0) return null;

  if (FORWARD.includes(key)) {
    return current < 0 ? 0 : (current + 1) % count;
  }
  if (BACKWARD.includes(key)) {
    return current < 0 ? count - 1 : (current - 1 + count) % count;
  }
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  // Space chooses whatever is focused. With nothing focused there is nothing to
  // choose, and the browser should keep the keystroke.
  if (SELECT.includes(key)) return current < 0 ? null : current;

  return null;
}

/**
 * Which option carries `tabIndex={0}` — the roving tabindex.
 *
 * Exactly one option in a group is tabbable, so Tab moves past the whole group
 * rather than through each of its options. When nothing is selected the first
 * option holds it, so the group is reachable at all.
 */
export function rovingTabIndex(optionIndex: number, selectedIndex: number): 0 | -1 {
  if (selectedIndex < 0) return optionIndex === 0 ? 0 : -1;
  return optionIndex === selectedIndex ? 0 : -1;
}
