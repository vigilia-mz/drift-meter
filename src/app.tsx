/**
 * The shell: one reducer, one screen at a time, and the announcement that stands
 * in for a router.
 *
 * The assignment is drawn here rather than in the reducer, because the reducer is
 * pure and entropy is not. It is drawn exactly once per run, in the event handler
 * that begins the run — not in a render body and not in a hook initialiser, both
 * of which can run twice and would consume a seeded stream twice, quietly
 * changing what every demonstration URL means.
 *
 * Browser history is the second thing here that is not the reducer's business.
 * Only the two reference screens get an entry, and the rules for that live in
 * `platform/history.ts`, where they are pure and tested. This file is where they
 * meet `window`.
 */

import { useEffect, useLayoutEffect, useReducer, useRef } from 'preact/hooks';
import { announceFor, titleFor } from './content/shell.js';
import type { Rec } from './content/types.js';
import { condFor, randomAssignment } from './domain/assignment.js';
import type { Confidence } from './domain/metrics.js';
import { screenFromEntry, syncHistory } from './platform/history.js';
import { parseRunConfig, rngFor, runConfigFromLocation } from './platform/runConfig.js';
import { Consent } from './screens/Consent.js';
import { Debrief } from './screens/Debrief.js';
import { Intro } from './screens/Intro.js';
import { Method } from './screens/Method.js';
import { Process } from './screens/Process.js';
import { Rate } from './screens/Rate.js';
import { Round } from './screens/Round.js';
import { Round3 } from './screens/Round3.js';
import { Spec } from './screens/Spec.js';
import { Stub } from './screens/Stub.js';
import { Transfer } from './screens/Transfer.js';
import { INITIAL_STATE, reducer } from './state/reducer.js';
import { slateFor } from './state/run.js';
import { ordinalOf, screenKey } from './state/screen.js';

/**
 * Whether the assisted round pre-selects the supplied recommendation.
 *
 * A run-level constant rather than a parameter, for now: both the round screen
 * and the debrief's trap verdict must read the same value, and the original's
 * name for the knob that set it did not survive. Pre-selection is what makes
 * "the recommendation you left standing" a reachable outcome, which is the
 * behaviour the instrument is built to observe.
 */
const PREFILL = true;

export function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const containerRef = useRef<HTMLElement>(null);

  const key = screenKey(state.screen);
  const ordinal = ordinalOf(state.screen);

  // Rendered rather than stored. The live region is always in the tree and only
  // its text changes, which is what a polite region needs in order to be read.
  const announcement = announceFor(state.screen.name, ordinal);

  // A layout effect, not an effect. The whole page has swapped and nothing else
  // says so, so focus has to move to the new screen's container — heading first
  // — in the same frame the screen appears in. `useEffect` defers to after paint,
  // which leaves focus on `<body>` for a frame: long enough for a screen reader
  // to start reading the wrong thing, and indefinitely in a tab that is not
  // painting.
  //
  // Keyed on `key`, which encodes the name and the ordinal together. On the name
  // alone this would not re-fire between round one and round two — the single
  // most important transition in the run.
  useLayoutEffect(() => {
    document.title = titleFor(state.screen.name, ordinal);
    containerRef.current?.focus();
  }, [key, state.screen.name, ordinal]);

  // History, in the same pass. `syncHistory` pushes an entry only for the two
  // reference screens, replaces the current one otherwise, and does nothing at all
  // when the entry already names this screen — which is the case immediately after
  // a Back or Forward press, and is what stops this effect from pushing a
  // duplicate of the entry the reader just navigated to.
  //
  // Keyed on the whole state rather than on the screen, because `popTo` can leave
  // the screen where it was while the entry beneath still names somewhere else. It
  // therefore runs on every dispatch, including every slider move — which is free,
  // and which matters: `decideHistory` returns `none` when nothing has moved, so no
  // write reaches the browser and nothing approaches the rate limit on
  // `replaceState`.
  useLayoutEffect(() => {
    syncHistory(window.history, state.screen);
  }, [state]);

  // The other direction. Nothing is read from history on load: an entry names a
  // screen and a reload has no run, so restoring the debrief from one would render
  // a readout of a session that no longer exists.
  //
  // Which is also why this dispatches `popTo` rather than `goto`. The entries
  // beneath survive a reload and the run does not, so a Back press after one can
  // arrive naming a screen this session cannot produce. The reducer holds that
  // check, because it is the only place with the run in hand — a guard closed over
  // here would freeze on the state this listener was mounted with.
  useEffect(() => {
    function onPop(event: PopStateEvent) {
      const screen = screenFromEntry(event.state);
      if (screen !== null) dispatch({ type: 'popTo', screen });
    }
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  /**
   * Leaving a reference screen.
   *
   * `history.back()` rather than a dispatch, so the in-app control and the
   * browser's own Back do the same thing. Dispatching would replace the pushed
   * entry and leave a stale one beneath it, so the reader's next Back press would
   * appear to do nothing.
   */
  function leaveReference() {
    window.history.back();
  }

  function begin(localOnly: boolean) {
    const config = runConfigFromLocation();
    const assign = randomAssignment(rngFor(config), config.assignment);
    dispatch({
      type: 'begin',
      payload: { assign, prefill: PREFILL, forced: config.forced, localOnly },
    });
  }

  return (
    <>
      <div class="dm-live" role="status" aria-live="polite">
        {announcement}
      </div>
      {renderScreen()}
    </>
  );

  function renderScreen() {
    const screen = state.screen;

    if (screen.name === 'intro') {
      return (
        <Intro
          containerRef={containerRef}
          onBegin={() => {
            dispatch({ type: 'goto', screen: { name: 'consent' } });
          }}
          onMethod={() => {
            dispatch({ type: 'goto', screen: { name: 'method' } });
          }}
          onProcess={() => {
            dispatch({ type: 'goto', screen: { name: 'process' } });
          }}
        />
      );
    }

    if (screen.name === 'consent') {
      return (
        <Consent
          containerRef={containerRef}
          onBegin={begin}
          onBack={() => {
            dispatch({ type: 'goto', screen: { name: 'intro' } });
          }}
        />
      );
    }

    if (screen.name === 'round' && state.run.status === 'active') {
      const condition = condFor(state.run.assign, screen.ordinal);
      return (
        <Round
          containerRef={containerRef}
          ordinal={screen.ordinal}
          condition={condition}
          slate={slateFor(state.run.assign, condition)}
          assign={state.run.assign}
          prefill={state.run.prefill}
          data={state.run.working.data}
          onTogglePanel={(caseIndex, panel) => {
            dispatch({ type: 'togglePanel', caseIndex, panel });
          }}
          onSetValue={(caseIndex, sliderIndex, value) => {
            dispatch({ type: 'setValue', caseIndex, sliderIndex, value });
          }}
          onChooseRec={(caseIndex: number, rec: Rec) => {
            dispatch({ type: 'chooseRec', caseIndex, rec });
          }}
          onToggleFlag={(caseIndex) => {
            dispatch({ type: 'toggleFlag', caseIndex });
          }}
          onContinue={() => {
            dispatch({ type: 'goto', screen: { name: 'rate', ordinal: screen.ordinal } });
          }}
        />
      );
    }

    if (screen.name === 'rate' && state.run.status === 'active') {
      return (
        <Rate
          containerRef={containerRef}
          ordinal={screen.ordinal}
          confidence={state.run.working.confidence}
          onRate={(value: Confidence) => {
            dispatch({ type: 'setConfidence', value });
          }}
          onContinue={() => {
            dispatch({ type: 'commitRound' });
          }}
        />
      );
    }

    // The two reference screens, outside the linear path and outside the run.
    // They are documents: reachable from the intro before anything has been
    // drawn and from the debrief after everything has, and they read nothing
    // from the run, so they render the same either way.
    if (screen.name === 'method') {
      return (
        <Method
          containerRef={containerRef}
          onBack={leaveReference}
          onProcess={() => {
            dispatch({ type: 'goto', screen: { name: 'process' } });
          }}
        />
      );
    }

    if (screen.name === 'process') {
      return (
        <Process
          containerRef={containerRef}
          onBack={leaveReference}
          onMethod={() => {
            dispatch({ type: 'goto', screen: { name: 'method' } });
          }}
        />
      );
    }

    // The four screens after the run. Each needs the complete variant, in which
    // both rounds are present by construction — reaching one without a finished
    // run falls through to the stub rather than asserting a round exists.
    if (state.run.status === 'complete') {
      const run = state.run;

      if (screen.name === 'debrief') {
        return (
          <Debrief
            containerRef={containerRef}
            run={run}
            onContinue={() => {
              dispatch({ type: 'goto', screen: { name: 'transfer' } });
            }}
            onMethod={() => {
              dispatch({ type: 'goto', screen: { name: 'method' } });
            }}
            onProcess={() => {
              dispatch({ type: 'goto', screen: { name: 'process' } });
            }}
          />
        );
      }

      if (screen.name === 'transfer') {
        return (
          <Transfer
            containerRef={containerRef}
            pick={run.transfer}
            onPick={(option) => {
              dispatch({ type: 'pickTransfer', option });
            }}
            onContinue={() => {
              dispatch({ type: 'goto', screen: { name: 'round3' } });
            }}
          />
        );
      }

      if (screen.name === 'round3') {
        return (
          <Round3
            containerRef={containerRef}
            assign={run.assign}
            r3={run.r3}
            onSetValue={(slot, sliderIndex, value) => {
              dispatch({ type: 'setR3Value', slot, sliderIndex, value });
            }}
            onCommit={(slot, read, driver) => {
              dispatch({ type: 'commitR3', slot, read, driver });
            }}
            onContinue={() => {
              dispatch({ type: 'goto', screen: { name: 'spec' } });
            }}
          />
        );
      }

      if (screen.name === 'spec') {
        return (
          <Spec
            containerRef={containerRef}
            onContinue={() => {
              dispatch({ type: 'goto', screen: { name: 'encoded' } });
            }}
            onRestart={() => {
              dispatch({ type: 'restart' });
            }}
          />
        );
      }
    }

    // Everything else, plus the two round screens reached without a run — which
    // is what a reader gets by opening a deep link straight into the middle.
    return (
      <Stub
        containerRef={containerRef}
        name={screen.name}
        onRestart={() => {
          dispatch({ type: 'restart' });
        }}
      />
    );
  }
}

/** Re-exported for the tests that drive the parser without a browser. */
export { parseRunConfig };
