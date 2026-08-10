/**
 * The rules, encoded.
 *
 * The one screen here that calls a model live, and the argumentative payload of
 * v0.4 and v0.5: the four rules run as a system prompt against the same model with
 * no rules at all, scored by a rubric, with a repair pass that feeds the failures
 * back.
 *
 * Rule 1 is performed by this screen rather than passed to the model. The reader
 * commits a read before anything is asked, and only then does the request go — so
 * the answer arrives as something to compare against rather than something to
 * adopt. Everything after the commit is display.
 *
 * Nothing here is measured. Like Round 3 and the transfer check, it lives on the
 * complete run and has no path into a `RoundRecord`, so no amount of clicking on
 * this screen can move a figure the debrief already showed.
 *
 * `IS_LIVE_CLAUDE_CONFIGURED` is checked before any control is offered. A dark
 * build renders the prompt and the reason it is dark, which is a screen rather than
 * a disabled button: the prompt is the artifact, and it is readable and arguable
 * without a call being made.
 */

import { useState } from 'preact/hooks';
import type { RefObject } from 'preact';
import { REC_LABELS } from '../content/arms.js';
import { ENCODED } from '../content/encoded.js';
import { SCREENS } from '../content/shell.js';
import type { Rec } from '../content/types.js';
import { IS_LIVE_CLAUDE_CONFIGURED } from '../platform/env.js';
import { passCount, requestRepair, requestTeach } from '../api/reflect.js';
import { TEACH_SYSTEM } from '../prompts/teach-system.js';
import { RUBRIC_ITEMS, TEACH_QUESTIONS } from '../../shared/teach.js';
import type { TeachQuestionId } from '../../shared/teach.js';
import type { Encoded as EncodedState, EncodedExchange } from '../state/run.js';
import { RadioGroup } from '../ui/RadioGroup.js';
import type { RadioOption } from '../ui/RadioGroup.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

const QUESTION_OPTIONS: readonly RadioOption<TeachQuestionId>[] = TEACH_QUESTIONS.map((q) => ({
  value: q.id,
  label: q.label,
}));

const READ_OPTIONS: readonly RadioOption<Rec>[] = [
  { value: 'fund', label: REC_LABELS.fund },
  { value: 'investigate', label: REC_LABELS.investigate },
  { value: 'pass', label: REC_LABELS.pass },
];

const RUBRIC_TOTAL = RUBRIC_ITEMS.length;

function count(template: string, n: number): string {
  return template.replace('{n}', String(n));
}

/** The prompt, shown in full. Rule 8: it is the artifact, not implementation detail. */
function Prompt() {
  return (
    <section class="dm-panel" aria-labelledby="dm-prompt">
      <h2 class="dm-panel-heading" id="dm-prompt">
        {ENCODED.promptHeading}
      </h2>
      <p class="dm-note">{ENCODED.promptNote}</p>
      <pre class="dm-prompt">{TEACH_SYSTEM}</pre>
    </section>
  );
}

function Rubric({
  rubric,
  heading,
}: {
  readonly rubric: EncodedExchange['result']['rubric'];
  readonly heading: string;
}) {
  return (
    <section aria-labelledby="dm-rubric">
      <h2 class="dm-section-heading" id="dm-rubric">
        {heading}
      </h2>
      <p class="dm-measure-label">{count(ENCODED.rubricCount, passCount(rubric))}</p>
      <ul class="dm-rules">
        {rubric.map((item) => {
          const meta = RUBRIC_ITEMS.find((r) => r.id === item.id);
          return (
            <li class="dm-rule" key={item.id} data-tone={item.pass ? 'kept' : 'cut'}>
              <p class="dm-rule-number">
                {/* The glyph duplicates the label, so it is not read twice. */}
                <span aria-hidden="true">{item.pass ? '◉ ' : '○ '}</span>
                {item.pass ? ENCODED.rubricPass : ENCODED.rubricFail} · Rule {meta?.rule ?? '?'}
              </p>
              <p class="dm-measure-label">{meta?.label ?? item.id}</p>
              <p class="dm-note">{item.reason}</p>
            </li>
          );
        })}
      </ul>
      <p class="dm-note">{ENCODED.rubricCaveat}</p>
    </section>
  );
}

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly encoded: EncodedState;
  readonly onEncoded: (encoded: EncodedState) => void;
  readonly onRestart: () => void;
}

export function Encoded({ containerRef, encoded, onEncoded, onRestart }: Props) {
  const [questionId, setQuestionId] = useState<TeachQuestionId | null>(null);
  const [read, setRead] = useState<Rec | null>(null);

  async function ask(): Promise<void> {
    if (questionId === null || read === null) return;
    onEncoded({ status: 'running' });
    const outcome = await requestTeach(questionId, read);
    if (outcome.kind === 'unconfigured') return onEncoded({ status: 'unconfigured' });
    if (outcome.kind === 'refused') {
      return onEncoded({ status: 'refused', category: outcome.category });
    }
    if (outcome.kind === 'error') return onEncoded({ status: 'error', message: outcome.message });

    const { plain, signature, model, ...result } = outcome.value;
    onEncoded({
      status: 'done',
      exchange: {
        plain,
        signature,
        model,
        result: {
          questionId: result.questionId,
          read: result.read,
          answer: result.answer,
          rubric: result.rubric,
        },
        repair: null,
        repairError: null,
      },
    });
  }

  async function repair(exchange: EncodedExchange): Promise<void> {
    onEncoded({ status: 'repairing', exchange });
    const outcome = await requestRepair(exchange.result, exchange.signature);
    if (outcome.kind === 'ok') {
      return onEncoded({
        status: 'done',
        exchange: {
          ...exchange,
          repair: {
            answer: outcome.value.answer,
            rubric: outcome.value.rubric,
            model: outcome.value.model,
          },
          repairError: null,
        },
      });
    }
    // A failed repair leaves the first answer standing rather than replacing the
    // screen with an error: the reader has already been shown a result, and losing
    // it to a second request that did not work would be the worse outcome.
    const message =
      outcome.kind === 'refused'
        ? ENCODED.refused
        : outcome.kind === 'unconfigured'
          ? ENCODED.dark
          : outcome.message;
    onEncoded({ status: 'done', exchange: { ...exchange, repairError: message } });
  }

  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.encoded.title}
      standfirst={ENCODED.standfirst}
      accent="round3"
    >
      {IS_LIVE_CLAUDE_CONFIGURED ? <p class="dm-body">{ENCODED.lead}</p> : null}

      <Prompt />

      {IS_LIVE_CLAUDE_CONFIGURED ? null : (
        <section aria-labelledby="dm-dark">
          <h2 class="dm-section-heading" id="dm-dark">
            {ENCODED.darkHeading}
          </h2>
          <p class="dm-body">{ENCODED.dark}</p>
          <p class="dm-note">{ENCODED.darkNote}</p>
        </section>
      )}

      {IS_LIVE_CLAUDE_CONFIGURED && encoded.status === 'idle' ? (
        <>
          <p class="dm-question" id="dm-question">
            {ENCODED.questionHeading}
          </p>
          <p class="dm-note">{ENCODED.questionNote}</p>
          <RadioGroup
            labelledBy="dm-question"
            options={QUESTION_OPTIONS}
            value={questionId}
            onChange={setQuestionId}
          />

          <p class="dm-question" id="dm-read">
            {ENCODED.readHeading}
          </p>
          <p class="dm-note">{ENCODED.readNote}</p>
          <RadioGroup
            labelledBy="dm-read"
            options={READ_OPTIONS}
            orientation="horizontal"
            value={read}
            onChange={setRead}
          />

          <div class="dm-actions">
            <button
              type="button"
              class="dm-button dm-button-solid"
              disabled={questionId === null || read === null}
              onClick={() => {
                void ask();
              }}
            >
              {ENCODED.run}
            </button>
          </div>
        </>
      ) : null}

      {encoded.status === 'running' ? <p class="dm-body">{ENCODED.running}</p> : null}

      {encoded.status === 'unconfigured' ? <p class="dm-body">{ENCODED.dark}</p> : null}

      {encoded.status === 'refused' ? (
        <section aria-labelledby="dm-refused">
          <h2 class="dm-section-heading" id="dm-refused">
            {ENCODED.refusedHeading}
          </h2>
          <p class="dm-body">{ENCODED.refused}</p>
        </section>
      ) : null}

      {encoded.status === 'error' ? (
        <section aria-labelledby="dm-error">
          <h2 class="dm-section-heading" id="dm-error">
            {ENCODED.errorHeading}
          </h2>
          <p class="dm-body">{encoded.message}</p>
          <div class="dm-actions">
            <button
              type="button"
              class="dm-button dm-button-ghost"
              onClick={() => {
                onEncoded({ status: 'idle' });
              }}
            >
              {ENCODED.retry}
            </button>
          </div>
        </section>
      ) : null}

      {encoded.status === 'done' || encoded.status === 'repairing' ? (
        <Answered
          exchange={encoded.exchange}
          repairing={encoded.status === 'repairing'}
          onRepair={() => {
            void repair(encoded.exchange);
          }}
        />
      ) : null}

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-ghost" onClick={onRestart}>
          {ENCODED.restart}
        </button>
      </div>
    </ScreenFrame>
  );
}

function Answered({
  exchange,
  repairing,
  onRepair,
}: {
  readonly exchange: EncodedExchange;
  readonly repairing: boolean;
  readonly onRepair: () => void;
}) {
  const before = passCount(exchange.result.rubric);
  const failed = RUBRIC_TOTAL - before;

  return (
    <>
      <section aria-labelledby="dm-plain">
        <h2 class="dm-section-heading" id="dm-plain">
          {ENCODED.plainHeading}
        </h2>
        <p class="dm-answer">{exchange.plain}</p>
      </section>

      <section aria-labelledby="dm-ruled">
        <h2 class="dm-section-heading" id="dm-ruled">
          {ENCODED.ruledHeading}
        </h2>
        <p class="dm-answer">{exchange.result.answer}</p>
        <div class="dm-readout">
          <span class="dm-readout-label">{ENCODED.servedBy}</span>
          <span class="dm-served">{exchange.model}</span>
        </div>
        <p class="dm-note">{ENCODED.servedByNote}</p>
      </section>

      <Rubric rubric={exchange.result.rubric} heading={ENCODED.rubricHeading} />

      <section class="dm-panel" aria-labelledby="dm-repair">
        <h2 class="dm-panel-heading" id="dm-repair">
          {ENCODED.repairHeading}
        </h2>
        {failed === 0 && exchange.repair === null ? (
          <p class="dm-body">{ENCODED.repairNothing}</p>
        ) : null}

        {failed > 0 && exchange.repair === null ? (
          <>
            <p class="dm-body">{ENCODED.repairLead}</p>
            {repairing ? (
              <p class="dm-body">{ENCODED.repairing}</p>
            ) : (
              <div class="dm-actions">
                <button type="button" class="dm-button dm-button-solid" onClick={onRepair}>
                  {ENCODED.repair}
                </button>
              </div>
            )}
          </>
        ) : null}

        {exchange.repairError !== null ? <p class="dm-note">{exchange.repairError}</p> : null}

        {exchange.repair !== null ? (
          <>
            <p class="dm-measure-label">
              {ENCODED.repairedCount
                .replace('{before}', String(before))
                .replace('{after}', String(passCount(exchange.repair.rubric)))}
            </p>
            <p class="dm-answer">{exchange.repair.answer}</p>
            <p class="dm-note">{ENCODED.repairCaveat}</p>
          </>
        ) : null}
      </section>
    </>
  );
}
