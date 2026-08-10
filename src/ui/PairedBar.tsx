/**
 * One measure, both rounds, side by side.
 *
 * The undefined case is the reason this is a component rather than two divs. In
 * the control round framing autonomy is `null` — not zero — because no frame was
 * supplied and the measure does not exist. A zero-width bar would read as "you
 * departed from the frame not at all", which is a claim about the reader; a
 * hatched bar reading `n/a` is the absence of a claim. An earlier version
 * imputed this value from an invented constant and it was retracted in v0.3.
 *
 * The bars are not accented. `tokens.css` records that only the assisted card
 * takes the run-parameter accent while the readout stays fixed, and that partial
 * recolour is reproduced from the original on purpose.
 */

import type { Score } from '../domain/model.js';

interface Props {
  readonly label: string;
  readonly what: string;
  /**
   * Marks the pre-specified primary outcome. `null` on every other measure.
   *
   * It is a separate element rather than an addition to `label`, because a test
   * asserts that each bar's label is the one the protocol screen prints for the
   * same measure, and folding a tag into the label would either break that or
   * force the same tag onto the protocol screen's table.
   *
   * Explicitly `null` rather than optional, which is how `assisted` says the same
   * thing: `exactOptionalPropertyTypes` is on, so an optional prop cannot be handed
   * an `undefined`, and every call site saying what it means is better than a spread
   * that hides which measures are unmarked.
   */
  readonly tag: string | null;
  /** `null` renders as hatched and `n/a`, never as zero. */
  readonly assisted: Score | null;
  readonly unassisted: Score | null;
  readonly assistedLabel: string;
  readonly unassistedLabel: string;
  readonly undefinedText: string;
  readonly undefinedCaption: string;
}

function Row({
  value,
  seriesLabel,
  series,
  undefinedText,
}: {
  readonly value: Score | null;
  readonly seriesLabel: string;
  readonly series: 'assisted' | 'unassisted';
  readonly undefinedText: string;
}) {
  const defined = value !== null;
  return (
    <div class="dm-bar-row">
      <span class="dm-bar-series">{seriesLabel}</span>
      <div
        class="dm-bar-track"
        role="img"
        aria-label={`${seriesLabel}: ${defined ? `${String(value)} out of 100` : undefinedText}`}
      >
        {defined ? (
          <div class={`dm-bar dm-bar-${series}`} style={{ width: `${String(value)}%` }} />
        ) : (
          <div class="dm-bar dm-bar-undefined" />
        )}
      </div>
      <span class="dm-bar-value">{defined ? String(value) : undefinedText}</span>
    </div>
  );
}

export function PairedBar({
  label,
  what,
  tag,
  assisted,
  unassisted,
  assistedLabel,
  unassistedLabel,
  undefinedText,
  undefinedCaption,
}: Props) {
  return (
    <div class="dm-measure">
      <p class="dm-measure-label">
        {label}
        {tag === null ? null : <span class="dm-measure-tag">{tag}</span>}
      </p>
      <p class="dm-measure-what">{what}</p>
      <Row
        value={assisted}
        seriesLabel={assistedLabel}
        series="assisted"
        undefinedText={undefinedText}
      />
      <Row
        value={unassisted}
        seriesLabel={unassistedLabel}
        series="unassisted"
        undefinedText={undefinedText}
      />
      {assisted === null || unassisted === null ? (
        <p class="dm-measure-caption">{undefinedCaption}</p>
      ) : null}
    </div>
  );
}
