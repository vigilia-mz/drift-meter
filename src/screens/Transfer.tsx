/**
 * The transfer check.
 *
 * One unseen case carrying the same class of planted error, one question, and a
 * verdict either way. The pick is stored on the run and feeds no measure — the
 * debrief has already been shown, and a question asked afterwards must not be
 * able to change it.
 *
 * The verdict appears only after a pick, which is the same commit-then-reveal
 * shape Round 3 uses, for the same reason: an answer visible beside the question
 * is not a question.
 */

import type { RefObject } from 'preact';
import { SCREENS } from '../content/shell.js';
import { TRANSFER } from '../content/transfer.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';
import { RadioGroup } from '../ui/RadioGroup.js';
import type { RadioOption } from '../ui/RadioGroup.js';

const OPTIONS: readonly RadioOption<string>[] = TRANSFER.options.map((o) => ({
  value: o.key,
  label: o.label,
}));

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly pick: string | null;
  readonly onPick: (option: string) => void;
  readonly onContinue: () => void;
}

export function Transfer({ containerRef, pick, onPick, onContinue }: Props) {
  const caught = pick === 'proxy';
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.transfer.title}
      standfirst={TRANSFER.standfirst}
      accent="round3"
    >
      <div class="dm-case">
        <h2 class="dm-case-org">{TRANSFER.org}</h2>
        <p class="dm-case-cause">{TRANSFER.cause}</p>
        <p class="dm-body">{TRANSFER.summary}</p>
        <p class="dm-body">{TRANSFER.detail}</p>
      </div>

      <p class="dm-question" id="dm-transfer-q">
        {TRANSFER.question}
      </p>
      <RadioGroup labelledBy="dm-transfer-q" options={OPTIONS} value={pick} onChange={onPick} />

      {pick === null ? null : (
        <section
          class="dm-panel"
          data-accent={caught ? 'caught' : 'neutral'}
          aria-labelledby="dm-verdict"
        >
          <h2 class="dm-trap-heading" id="dm-verdict">
            {caught ? TRANSFER.verdictHeading.caught : TRANSFER.verdictHeading.missed}
          </h2>
          <p class="dm-body">{caught ? TRANSFER.verdict.caught : TRANSFER.verdict.missed}</p>
        </section>
      )}

      <p class="dm-note">{TRANSFER.caveat}</p>

      <div class="dm-actions">
        <button
          type="button"
          class="dm-button dm-button-solid"
          disabled={pick === null}
          onClick={onContinue}
        >
          {TRANSFER.continueLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
