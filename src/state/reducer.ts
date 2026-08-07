/**
 * The one reducer.
 *
 * `begin` writes the whole first round at once and `restart` clears every field a
 * run accumulated, which is a reducer by definition: the original kept these as
 * loose setter calls and the atomicity was a convention rather than a guarantee.
 *
 * Three behaviours in here look like defects and are not. Each is documented at
 * the write site and pinned by a test, because the domain layer's own tests set
 * these fields by hand and would stay green if the reducer got them wrong:
 *
 * - `read` is sticky. Opening either panel sets it; closing never clears it.
 * - `touched[k]` is a movement flag. Any write sets it, including a write that
 *   returns the slider to where it started.
 * - `recTouched` is set only by an explicit choice. Nothing else may write it.
 *
 * See `docs/deliberate-quirks.md`.
 */

import type { Condition, Rec } from '../content/types.js';
import type { Assignment } from '../domain/assignment.js';
import { condFor } from '../domain/assignment.js';
import type { CaseState, Confidence } from '../domain/metrics.js';
import type { Ordinal, Screen } from './screen.js';
import { INTRO_SCREEN, ordinalOf } from './screen.js';
import type { Forced, RoundRecord, Run } from './run.js';
import { NOT_STARTED, freshR3, freshRound } from './run.js';

export interface AppState {
  readonly screen: Screen;
  readonly run: Run;
}

export const INITIAL_STATE: AppState = { screen: INTRO_SCREEN, run: NOT_STARTED };

/** Everything `begin` needs, drawn outside so the reducer stays pure. */
export interface BeginPayload {
  readonly assign: Assignment;
  readonly prefill: boolean;
  readonly forced: Forced;
  readonly localOnly: boolean;
}

export type Action =
  | { readonly type: 'goto'; readonly screen: Screen }
  /**
   * A Back or Forward press, which is not the same thing as a `goto`.
   *
   * A history entry names a screen, not a run. After a reload the entries beneath
   * the current one still describe a session that no longer exists, so a Back
   * press can arrive naming the debrief when there is no run to draw one from.
   * `goto` would take it, and the shell would fall through to the not-rebuilt
   * stub — a false statement about a screen that is built. This action goes to
   * the intro instead. Nothing else may use it: within a session every entry is
   * reachable and this behaves exactly like `goto`.
   */
  | { readonly type: 'popTo'; readonly screen: Screen }
  | { readonly type: 'begin'; readonly payload: BeginPayload }
  | {
      readonly type: 'togglePanel';
      readonly caseIndex: number;
      readonly panel: 'model' | 'evidence';
    }
  | {
      readonly type: 'setValue';
      readonly caseIndex: number;
      readonly sliderIndex: number;
      readonly value: number;
    }
  | { readonly type: 'chooseRec'; readonly caseIndex: number; readonly rec: Rec }
  | { readonly type: 'toggleFlag'; readonly caseIndex: number }
  | { readonly type: 'setConfidence'; readonly value: Confidence }
  | { readonly type: 'commitRound' }
  // The three below write only into a complete run. They exist after the debrief,
  // and none of them can reach a `RoundRecord` — which is the point: the transfer
  // check and Round 3 are excluded from the measures by construction, and the
  // only way to keep that true is for them to have nowhere to write.
  | { readonly type: 'pickTransfer'; readonly option: string }
  | {
      readonly type: 'commitR3';
      readonly slot: number;
      readonly read: Rec;
      readonly driver: number;
    }
  | {
      readonly type: 'setR3Value';
      readonly slot: number;
      readonly sliderIndex: number;
      readonly value: number;
    }
  | { readonly type: 'restart' };

/**
 * Whether a screen has the run behind it that it needs in order to say anything.
 *
 * Mirrors the shell's own render: the intro, the consent step and the two
 * reference screens read nothing from the run; the round and rating screens need
 * one in progress; everything after the debrief needs a finished one. Only
 * `popTo` consults this, because only a history entry can name a screen the
 * current session cannot produce.
 */
function canShow(screen: Screen, run: Run): boolean {
  switch (screen.name) {
    case 'intro':
    case 'consent':
    case 'method':
    case 'process':
      return true;
    case 'round':
    case 'rate':
      return run.status === 'active';
    case 'debrief':
    case 'transfer':
    case 'round3':
    case 'spec':
    case 'encoded':
      return run.status === 'complete';
  }
}

/** Which condition the screen's ordinal is currently writing into. */
function activeCondition(state: AppState): Condition | null {
  if (state.run.status !== 'active') return null;
  const ordinal = ordinalOf(state.screen);
  if (ordinal === undefined) return null;
  return condFor(state.run.assign, ordinal);
}

/**
 * Apply a change to one case of the working round.
 *
 * Copies at every level. If a commit stored the working array by reference and
 * round two then wrote into it, both records would alias one object and the
 * debrief would compare a round against itself.
 */
function editCase(state: AppState, caseIndex: number, edit: (c: CaseState) => CaseState): AppState {
  if (state.run.status !== 'active') return state;
  const current = state.run.working.data[caseIndex];
  if (current === undefined) return state;

  const data = state.run.working.data.map((c, i) => (i === caseIndex ? edit(c) : c));
  return { ...state, run: { ...state.run, working: { ...state.run.working, data } } };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'goto':
      return { ...state, screen: action.screen };

    case 'popTo':
      return {
        ...state,
        screen: canShow(action.screen, state.run) ? action.screen : INTRO_SCREEN,
      };

    case 'begin': {
      // Eight fields, written together. A run that is half-begun — an assignment
      // drawn but no data built, or data built for the wrong condition — is not
      // representable.
      const { assign, prefill, forced, localOnly } = action.payload;
      const first: Ordinal = 1;
      return {
        screen: { name: 'round', ordinal: first },
        run: {
          status: 'active',
          assign,
          prefill,
          forced,
          localOnly,
          done: {},
          working: freshRound(assign, condFor(assign, first)),
        },
      };
    }

    case 'togglePanel':
      return editCase(state, action.caseIndex, (c) => {
        const open = action.panel === 'model' ? !c.modelOpen : !c.evidenceOpen;
        return {
          ...c,
          modelOpen: action.panel === 'model' ? open : c.modelOpen,
          evidenceOpen: action.panel === 'evidence' ? open : c.evidenceOpen,
          // Sticky. Set when either panel opens, never cleared by closing, and
          // not accumulated by re-opening: the measure is "was this case looked
          // at", not "for how long".
          read: c.read || open,
        };
      });

    case 'setValue':
      return editCase(state, action.caseIndex, (c) => {
        if (c.vals[action.sliderIndex] === undefined) return c;
        return {
          ...c,
          vals: c.vals.map((v, i) => (i === action.sliderIndex ? action.value : v)),
          // A movement flag, not a value comparison. Dragging a slider back to
          // where it started still counts, because the behaviour being observed
          // is the act of interrogating the number.
          touched: c.touched.map((t, i) => (i === action.sliderIndex ? true : t)),
        };
      });

    case 'chooseRec':
      // The only writer of `recTouched`. No mount effect, no focus handler and no
      // controlled-value sync may set it: a supplied recommendation left standing
      // must score nothing, and flipping this flag is how it would stop doing so.
      return editCase(state, action.caseIndex, (c) => ({
        ...c,
        rec: action.rec,
        recTouched: true,
      }));

    case 'toggleFlag':
      return editCase(state, action.caseIndex, (c) => ({ ...c, flagged: !c.flagged }));

    case 'setConfidence': {
      if (state.run.status !== 'active') return state;
      return {
        ...state,
        run: { ...state.run, working: { ...state.run.working, confidence: action.value } },
      };
    }

    case 'commitRound': {
      if (state.run.status !== 'active') return state;
      const condition = activeCondition(state);
      if (condition === null) return state;
      // The gate. Zero is the not-yet-rated sentinel, and `metrics()` rescales it
      // to a real self-rating of nothing, so advancing on it would publish a
      // rating the reader never gave.
      if (state.run.working.confidence === 0) return state;

      const done: Partial<Record<Condition, RoundRecord>> = {
        ...state.run.done,
        [condition]: state.run.working,
      };

      const assisted = done.assisted;
      const unassisted = done.unassisted;
      if (assisted !== undefined && unassisted !== undefined) {
        // Both rounds are in hand, so the run can enter the variant where the
        // debrief can read them without asserting they exist.
        return {
          screen: { name: 'debrief' },
          run: {
            status: 'complete',
            assign: state.run.assign,
            prefill: state.run.prefill,
            forced: state.run.forced,
            localOnly: state.run.localOnly,
            rounds: { assisted, unassisted },
            transfer: null,
            r3: freshR3(state.run.assign),
          },
        };
      }

      const second: Ordinal = 2;
      return {
        screen: { name: 'round', ordinal: second },
        run: {
          ...state.run,
          done,
          // Fresh data and a fresh rating. Carrying the previous round's
          // confidence forward would make the two rounds' `perceived` identical
          // and delete the comparison the instrument exists to make.
          working: freshRound(state.run.assign, condFor(state.run.assign, second)),
        },
      };
    }

    case 'pickTransfer': {
      if (state.run.status !== 'complete') return state;
      // Stored on the run and nowhere near a `RoundRecord`. `metrics()` takes
      // `data` and `confidence`; there is no path from here into either.
      return { ...state, run: { ...state.run, transfer: action.option } };
    }

    case 'commitR3': {
      if (state.run.status !== 'complete') return state;
      const target = state.run.r3[action.slot];
      if (target === undefined) return state;
      // Commit-then-reveal, and `revealed` is monotonic: there is no path back to
      // the state before the figure appeared, which is why the screen must not
      // offer one. Committing a second time cannot un-reveal.
      const r3 = state.run.r3.map((r, i) =>
        i === action.slot ? { ...r, read: action.read, driver: action.driver, revealed: true } : r,
      );
      return { ...state, run: { ...state.run, r3 } };
    }

    case 'setR3Value': {
      if (state.run.status !== 'complete') return state;
      const target = state.run.r3[action.slot];
      if (target === undefined || target.vals[action.sliderIndex] === undefined) return state;
      // No `touched` array here, deliberately. Round 3 is excluded from the
      // measures, so there is nothing for a movement flag to feed.
      const r3 = state.run.r3.map((r, i) =>
        i === action.slot
          ? { ...r, vals: r.vals.map((v, k) => (k === action.sliderIndex ? action.value : v)) }
          : r,
      );
      return { ...state, run: { ...state.run, r3 } };
    }

    case 'restart':
      // Everything a run accumulated, gone in one write: both rounds, both
      // ratings, the transfer pick, all of Round 3, the consent choice and the
      // assignment itself. The next run draws again.
      return INITIAL_STATE;
  }
}
