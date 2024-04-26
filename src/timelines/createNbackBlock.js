import { eventCodes, taskSettings } from "../config/main";
import { div, p } from "../lib/markup/tags";
import { fixationHTML } from "../lib/markup/fixation";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { language } from "../config/main";
import { photodiodeGhostBox, photodiodeSpot } from "../lib/markup/photodiode";

const fixation = {
  type: htmlKeyboardResponse,
  stimulus: fixationHTML + photodiodeGhostBox(),
  choices: "NO_KEYS",
  trial_duration: taskSettings.fixation.default_duration,
  data: { test_part: "fixation" },
  on_load: () => {
    // Flashes the photodiode spot when the trial first loads
    photodiodeSpot(eventCodes.fixation);
  },
};

function build_test_trial(jsPsych) {
  const { match_key, mismatch_key, letter_duration } = taskSettings.nback;
  const test = {
    type: htmlKeyboardResponse,
    // stimulus: jsPsych.timelineVariable("stimulus") + photodiodeGhostBox(),
    stimulus: () => {
      return div(jsPsych.timelineVariable("stimulus") + photodiodeGhostBox());
    },
    on_load: () => {
      // Flashes the photodiode spot when the trial first loads
      photodiodeSpot(eventCodes.test);
    },
    // choices: ["f", "j"],
    choices: [match_key, mismatch_key],
    data: jsPsych.timelineVariable("data"),
    trial_duration: letter_duration,
    stimulus_duration: letter_duration,
    on_finish: function (data) {
      // FOR PRACTICE TRIAL...
      // Press "5" on the numeric keypad if you see "X" and "0" on the numeric keypad if you see anything else.
      if (data.response === null) data.result = "no_response";
      else if (data.letters_match && data.response === match_key) data.result = "correct_match";
      else if (data.letters_match && data.response === mismatch_key) data.result = "missed_match";
      else if (!data.letters_match && data.response === match_key) data.result = "missed_mismatch";
      else if (!data.letters_match && data.response === mismatch_key)
        data.result = "correct_mismatch";
      else throw new Error("Invalid Response");
      data.correct_response = data.result === "correct_match" || data.result === "correct_mismatch";

      // ORIGINAL TRIAL DATA
      // if (data.correct_response == "f" && data.key_press == 70) {
      //   data.correct_rejection = 1;
      // } else {
      //   data.correct_rejection = 0;
      // }
      // if (data.correct_response == "j" && data.key_press == 70) {
      //   data.miss = 1;
      // } else {
      //   data.miss = 0;
      // }
      // if (data.correct_response == "j" && data.key_press == 74) {
      //   data.hit = 1;
      // } else {
      //   data.hit = 0;
      // }
      // if (data.correct_response == "f" && data.key_press == 74) {
      //   data.false_alarm = 1;
      // } else {
      //   data.false_alarm = 0;
      // }
    },
  };
  return test;
}
function build_feedback_trial(jsPsych) {
  return {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    trial_duration: taskSettings.nback.feedback_duration,
    data: { test_part: "feedback" },
    stimulus: function () {
      const lastTrialData = jsPsych.data.getLastTrialData();
      const previousResult = lastTrialData.trials[0].result;
      if (previousResult === "no_response") {
        // User did not respond
        return `<div style="font-size:40px; color: red">${language.nback.feedback.noResponse}</div>`;
      } else if (previousResult === "correct_match" || previousResult === "correct_mismatch") {
        // User responded correct
        return `<div style="font-size:40px; color: green">${language.nback.feedback.correct}</div>`;
      } else if (previousResult === "missed_match" || previousResult === "missed_mismatch") {
        // User responded incorrectly
        return `<div style="font-size:40px; color: red">${language.nback.feedback.wrong}</div>`;
      }
      throw new Error("Invalid response");
    },
  };
}

export function createNbackBlock(jsPsych, level, block, stimuli) {
  //Build the array of timeline variables.
  const timeline_variables = [];
  for (let i = 0; i < stimuli.length; i++) {
    const letter = stimuli[i];

    let targetLetter;
    if (level === 0) {
      // target stimulis is always X in level 0
      targetLetter = "X";
    } else {
      // target stimulis is 1 or 2 back based on level
      targetLetter = stimuli[i - level];
    }

    const targetMatch = letter === targetLetter;
    timeline_variables.push({
      stimulus: p(letter, { class: "stimulus" }),
      data: {
        test_part: "test",
        level: level,
        block: block,
        letter: letter,
        letters_match: targetMatch,
      },
    });
  }
  // Build the timeline.
  const test_trial = build_test_trial(jsPsych);
  const timeline = [fixation, test_trial];
  if (block === "practice") timeline.push(build_feedback_trial(jsPsych));
  // return the block of trials
  return {
    repetitions: 1,
    randomize_order: false,
    timeline_variables: timeline_variables,
    timeline: timeline,
  };
}
