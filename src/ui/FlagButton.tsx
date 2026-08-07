/**
 * The uncertainty flag.
 *
 * A real `<button aria-pressed>` rather than a checkbox, because the act is
 * "flag this" rather than "tick a field", and the pressed state is what a screen
 * reader should hear. The ◉/○ glyph is decoration: it duplicates what
 * `aria-pressed` already says, so it is hidden rather than read out twice.
 */

interface Props {
  readonly pressed: boolean;
  readonly onLabel: string;
  readonly offLabel: string;
  readonly onToggle: () => void;
}

export function FlagButton({ pressed, onLabel, offLabel, onToggle }: Props) {
  return (
    <button type="button" class="dm-flag" aria-pressed={pressed} onClick={onToggle}>
      <span class="dm-flag-mark" aria-hidden="true">
        {pressed ? '◉' : '○'}
      </span>
      {pressed ? onLabel : offLabel}
    </button>
  );
}
