/**
 * The four design rules.
 *
 * The screen that turns the finding into a specification. Each rule carries the
 * mechanism it borrows, what it is aimed at, what it costs, and what would show
 * it is wrong — that last field is the one that makes the rest arguable rather
 * than merely stated.
 *
 * This is the text #18 encodes as a system prompt and scores with a rubric.
 * CLAUDE.md rule 8 applies: it is the artifact, not implementation detail, and
 * must not be re-tuned to improve a score.
 */

import type { RefObject } from 'preact';
import { SCREENS } from '../content/shell.js';
import { SPEC_INTRO, SPEC_RULES } from '../content/spec.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly onContinue: () => void;
  readonly onRestart: () => void;
}

export function Spec({ containerRef, onContinue, onRestart }: Props) {
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.spec.title}
      standfirst={SPEC_INTRO.standfirst}
    >
      <p class="dm-body">{SPEC_INTRO.body}</p>

      <ol class="dm-rules">
        {SPEC_RULES.map((rule) => (
          <li class="dm-rule" key={rule.number}>
            <p class="dm-rule-number">{rule.number}</p>
            <h2 class="dm-rule-title">{rule.title}</h2>
            <p class="dm-body">{rule.body}</p>
            <dl class="dm-rows">
              <div class="dm-row">
                <dt class="dm-row-label">{SPEC_INTRO.fields.pedagogy}</dt>
                <dd class="dm-row-value">{rule.pedagogy}</dd>
              </div>
              <div class="dm-row">
                <dt class="dm-row-label">{SPEC_INTRO.fields.targets}</dt>
                <dd class="dm-row-value">{rule.targets}</dd>
              </div>
              <div class="dm-row">
                <dt class="dm-row-label">{SPEC_INTRO.fields.cost}</dt>
                <dd class="dm-row-value">{rule.cost}</dd>
              </div>
              <div class="dm-row">
                <dt class="dm-row-label">{SPEC_INTRO.fields.falsified}</dt>
                <dd class="dm-row-value">{rule.falsified}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-solid" onClick={onContinue}>
          {SPEC_INTRO.continueLabel}
        </button>
        <button type="button" class="dm-button dm-button-ghost" onClick={onRestart}>
          {SPEC_INTRO.restartLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
