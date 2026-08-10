/**
 * The encoded screen's copy.
 *
 * The screen where the argument stops being a complaint and becomes something that
 * can be run and argued with. It asks the pinned model the same question twice —
 * once with no rules at all, once under the four rules — scores the second against
 * a four-item rubric, and offers to feed the failures back and re-score the
 * rewrite.
 *
 * Three things this copy has to keep saying, because each is a place the screen
 * could overclaim:
 *
 * - The rubric is a self-grading loop and it is generous. Same model, same pin, an
 *   answer from a prompt by this author, against a rubric by this author.
 * - The repair pass improving on the first attempt is close to guaranteed and is
 *   not evidence the rules are teachable. A second attempt with the failures named
 *   is an easier task than the first.
 * - The served model ID is the provenance record and the pin is not. The pin says
 *   what was asked for; the printed ID says what answered.
 *
 * Licensed CC BY 4.0 — this is prose. See REUSE.toml.
 */

export const ENCODED = {
  standfirst:
    'The four rules, run. The same question goes to the model twice — once with no rules at all, once under the rules — and the second answer is scored against them.',

  /** Before anything is asked. */
  lead: 'This is the only screen here that calls a model live. Three calls per run: the answer with no rules, the answer under them, and the pass that scores the second. It takes a little while, and it spends the author’s API credit rather than yours.',

  promptHeading: 'The system prompt, in full',
  promptNote:
    'Displayed rather than described, because it is the artifact and not an implementation detail. It encodes the four rules from the previous screen and adds nothing they do not contain. It is newly written for this version: the prompt the earlier builds shipped does not survive, so the pass rates below are a first baseline rather than a continuation of theirs.',

  questionHeading: 'Pick a case',
  questionNote: 'All three are cases you have already worked, so you can judge the answer.',

  readHeading: 'Your own read first',
  readNote:
    'Rule 1 is the one rule this screen has to perform rather than pass on: the model is asked only after you have committed. Choosing here is what makes the answer something to compare against rather than something to adopt.',

  run: 'Ask the model',
  running: 'Asking. Three calls, so this takes a moment.',

  plainHeading: 'With no rules',
  ruledHeading: 'Under the four rules',
  servedBy: 'Answered by',
  servedByNote:
    'The ID the API returned, printed rather than assumed. The pinned ID says what was asked for; this says what answered, and it is the only claim on this site that verifies itself.',

  rubricHeading: 'Scored against the rules',
  rubricPass: 'Met',
  rubricFail: 'Not met',
  rubricCount: '{n} of 4 met',
  rubricCaveat:
    'This is a self-grading loop and it is generous. The same model, on the same pinned version, scoring an answer produced from a prompt written by this author, against a rubric written by this author too. Nothing here corrects for that. A score that did not say so would be the exact failure this project is about.',

  repairHeading: 'The repair pass',
  repairLead:
    'The failed items can be fed back as instructions and the answer rewritten against them, then scored again by the same grader.',
  repair: 'Feed the failures back',
  repairing: 'Rewriting, then re-scoring.',
  repairedHeading: 'Rewritten',
  repairedCount: '{before} of 4 before, {after} of 4 after',
  repairCaveat:
    'A second attempt with the failures named is an easier task than the first, so an improvement between those two numbers is close to guaranteed. It is not evidence that the rules are learnable, teachable, or worth what they cost. What it shows is narrower: that the failures were specific enough to act on.',
  repairNothing: 'Every item was met, so there is nothing to repair.',

  /** The committed default. Not an error. */
  darkHeading: 'Available on request',
  dark: 'This screen is built and switched off. The endpoint that holds the API key is not connected in this build, so nothing here calls a model and no clone or fork can spend anyone’s credit. Turning it on is a one-line change with its own commit, and the repository records whether it has been made — which is the point of keeping the switch in the open rather than in a settings page.',
  darkNote:
    'The system prompt above is the whole of what this screen would run. You can read it, disagree with it, and check it against the four rules without a single call being made.',

  refusedHeading: 'The model declined',
  refused:
    'The model declined this request rather than answering it. That is a real outcome of asking a model something and it is reported rather than routed around: there is deliberately no fallback to a different model here, because the answer would then come from a model other than the pinned one and the comparison this screen exists to make would be quietly gone.',

  errorHeading: 'That did not work',
  retry: 'Try again',

  restart: 'Start again',
} as const;
