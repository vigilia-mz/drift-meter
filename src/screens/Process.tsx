/**
 * The publication-process screen.
 *
 * The second of the two reference screens, and the second of the two that gets a
 * browser history entry. Like the protocol screen its Back control calls
 * `history.back()`, so the in-app control and the browser's own Back agree.
 *
 * Three of its tables carry a tone — a source that is not cleared, a reader who
 * has not been asked, a paragraph that was cut. The tone is a role name returned
 * by `src/domain/tone.ts` and bound to a colour in `tokens.css`; nothing in this
 * file knows a hex.
 */

import type { RefObject } from 'preact';
import {
  CHANGELOG_ROWS,
  PROCESS,
  PROVENANCE_ROWS,
  REVIEWER_ROWS,
  SOURCE_ROWS,
} from '../content/process.js';
import type { ReviewerRow } from '../content/types.js';
import { SCREENS } from '../content/shell.js';
import { gradeTone, statusTone } from '../domain/tone.js';
import { ScreenFrame } from '../ui/ScreenFrame.js';

interface Props {
  readonly containerRef: RefObject<HTMLElement>;
  readonly onBack: () => void;
  readonly onMethod: () => void;
}

export function Process({ containerRef, onBack, onMethod }: Props) {
  return (
    <ScreenFrame
      containerRef={containerRef}
      heading={SCREENS.process.title}
      standfirst={PROCESS.standfirst}
    >
      <section aria-labelledby="dm-masthead-section">
        <h2 class="dm-section-heading" id="dm-masthead-section">
          {PROCESS.mastheadHeading}
        </h2>
        <dl class="dm-rows">
          {PROCESS.mastheadRows.map((row) => (
            <div class="dm-row" key={row.label}>
              <dt class="dm-row-label">{row.label}</dt>
              <dd class="dm-row-value">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p class="dm-body">{PROCESS.whyLead}</p>
        <p class="dm-body">{PROCESS.whyFollow}</p>
      </section>

      <section aria-labelledby="dm-changelog">
        <h2 class="dm-section-heading" id="dm-changelog">
          {PROCESS.changelogHeading}
        </h2>
        <p class="dm-body">{PROCESS.changelogLead}</p>
        <ol class="dm-specs">
          {CHANGELOG_ROWS.map((entry) => (
            <li class="dm-spec" key={entry.version}>
              <p class="dm-spec-kicker">
                <span class="dm-mono">{entry.version}</span>
                <span class="dm-spec-date">{entry.date}</span>
              </p>
              <h3 class="dm-spec-title">{entry.title}</h3>
              <dl class="dm-rows dm-rows-tight">
                <div class="dm-row">
                  <dt class="dm-row-label">{PROCESS.changelogFields.what}</dt>
                  <dd class="dm-row-value">{entry.what}</dd>
                </div>
                <div class="dm-row">
                  <dt class="dm-row-label">{PROCESS.changelogFields.why}</dt>
                  <dd class="dm-row-value">{entry.why}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
        <p class="dm-note">{PROCESS.changelogFullNote}</p>
      </section>

      <section aria-labelledby="dm-reviewers">
        <h2 class="dm-section-heading" id="dm-reviewers">
          {PROCESS.reviewersHeading}
        </h2>
        <p class="dm-body">{PROCESS.reviewersLead}</p>
        <div class="dm-scroll">
          <table class="dm-table dm-table-prose">
            <thead>
              <tr>
                <th scope="col">{PROCESS.reviewersColumns.role}</th>
                <th scope="col">{PROCESS.reviewersColumns.status}</th>
                <th scope="col">{PROCESS.reviewersColumns.brief}</th>
              </tr>
            </thead>
            <tbody>
              {/*
                Read as the interface rather than as the literal tuple: `noteGloss`
                is optional and only one row carries it, so the tuple's union does
                not have the property on every member.
              */}
              {(REVIEWER_ROWS as readonly ReviewerRow[]).map((row) => (
                <tr key={row.role}>
                  <th scope="row">{row.role}</th>
                  <td>
                    <span class="dm-tone" data-tone={statusTone(row.status)}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.brief}
                    <span class="dm-cell-note">{row.note}</span>
                    {/* Outside the note, never inside it: the note is verbatim. */}
                    {row.noteGloss !== undefined && (
                      <span class="dm-cell-note">{row.noteGloss}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p class="dm-body">{PROCESS.reviewersNaming}</p>
        <p class="dm-note">{PROCESS.reviewersNote}</p>
        {/* Printed, not linked. The reason is in the docstring beside the copy. */}
        <p class="dm-note">{PROCESS.reviewersOffer}</p>
      </section>

      <section aria-labelledby="dm-caveats">
        <h2 class="dm-section-heading" id="dm-caveats">
          {PROCESS.caveatsHeading}
        </h2>
        <p class="dm-body">{PROCESS.caveatsLead}</p>
        <ul class="dm-list">
          {PROCESS.caveats.map((caveat) => (
            <li class="dm-list-item" key={caveat}>
              {caveat}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dm-production">
        <h2 class="dm-section-heading" id="dm-production">
          {PROCESS.provenanceHeading}
        </h2>
        <p class="dm-body">{PROCESS.provenanceLead}</p>
        <dl class="dm-rows">
          {PROVENANCE_ROWS.map((row) => (
            <div class="dm-row" key={row.label}>
              <dt class="dm-row-label dm-toned" data-tone={row.tone}>
                {row.label}
              </dt>
              <dd class="dm-row-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="dm-sources">
        <h2 class="dm-section-heading" id="dm-sources">
          {PROCESS.sourcesHeading}
        </h2>
        <p class="dm-body">{PROCESS.sourcesLead}</p>
        <div class="dm-scroll">
          <table class="dm-table dm-table-prose">
            <thead>
              <tr>
                <th scope="col">{PROCESS.sourcesColumns.claim}</th>
                <th scope="col">{PROCESS.sourcesColumns.grade}</th>
                <th scope="col">{PROCESS.sourcesColumns.standing}</th>
              </tr>
            </thead>
            <tbody>
              {SOURCE_ROWS.map((row) => (
                <tr key={row.claim}>
                  {/* The claim alone. A row header is announced again for every
                      cell in its row, so the forty words of standing that follow
                      it go in the cell they are about rather than in here. */}
                  <th scope="row">{row.claim}</th>
                  <td>
                    <span class="dm-tone" data-tone={gradeTone(row.grade)}>
                      {row.grade}
                    </span>
                  </td>
                  <td>
                    {row.where}
                    <span class="dm-cell-note">{row.note}</span>
                    <span class="dm-cell-note">
                      {PROCESS.sourcesCheckedLabel}
                      {row.checked}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p class="dm-note">{PROCESS.sourcesFullNote}</p>
        <p class="dm-note">{PROCESS.sourcesOrigin}</p>
      </section>

      <div class="dm-actions">
        <button type="button" class="dm-button dm-button-solid" onClick={onBack}>
          {PROCESS.backLabel}
        </button>
        <button type="button" class="dm-button dm-button-ghost" onClick={onMethod}>
          {PROCESS.methodLabel}
        </button>
      </div>
    </ScreenFrame>
  );
}
