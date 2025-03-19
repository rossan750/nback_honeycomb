// import { eventCodes, taskSettings } from "../config/main";
import { div, p } from "../lib/markup/tags";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import language from "../config/language.json";
import { eventCodes } from "../config/trigger";
import { config } from "../config/main";
import { photodiodeGhostBox, pdSpotEncode } from "../lib/markup/photodiode";
import { buildFixationTrial } from "../trials/fixation";
import { build_debrief_trial, betweenBlockRest, ready } from "../trials/nBackTrials";
import instructionsPlugin from "@jspsych/plugin-instructions";
import { generateNBackStimuli } from "../lib/generateNBackList";

function build_test_trial(jsPsych, taskConfig) {
  const { match_key, mismatch_key, letter_duration } = taskConfig.nback;

  const test = {
    type: htmlKeyboardResponse,
    stimulus: () => {
      return div(jsPsych.timelineVariable("stimulus") + photodiodeGhostBox);
    },
    on_load: function () {
      // Conditionally flashes the photodiode when the trial first loads
      //TODO: we sure we want test_connect here?
      if (config.USE_PHOTODIODE) pdSpotEncode(eventCodes.fixation);
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

function build_feedback_trial(jsPsych, taskConfig) {
  return {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    trial_duration: taskConfig.nback.feedback_duration,
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

export function createNbackBlock(jsPsych, taskConfig, stimuli, block, level) {
  //Build the array of timeline variables.
  const timeline_variables = [];
  for (let i = 0; i < stimuli.length; i++) {
    const letter = stimuli[i];

    let targetLetter;
    if (block === 0) {
      // target stimulus is always X in level 0
      targetLetter = "X";
    } else {
      // target stimulus is 1 or 2 back based on level
      targetLetter = stimuli[i - block];
    }

    const targetMatch = letter === targetLetter;
    timeline_variables.push({
      stimulus: p(letter, {
        class: "stimulus",
        style: `font-size:${taskConfig.nback.letter_size}px`,
      }),
      data: {
        test_part: "test",
        level: level,
        block: block,
        letter: letter,
        letters_match: targetMatch,
      },
    });
  }

  // Build the fixation trial
  const fixationTrial = buildFixationTrial(jsPsych, taskConfig);

  // Build the test trial
  const test_trial = build_test_trial(jsPsych, taskConfig);

  // Build the timeline.
  const timeline = [fixationTrial, test_trial];
  if (block === "practice") timeline.push(build_feedback_trial(jsPsych, taskConfig));

  // return the block of trials
  return {
    repetitions: 1,
    randomize_order: false,
    timeline_variables: timeline_variables,
    timeline: timeline,
  };
}

function addInstructionsTrial(n) {
  let instruction;
  if (n === 0) {
    instruction = language.nback.instructions0back;
  } else if (n === 1) {
    instruction = language.nback.instructions1back;
  } else if (n === 2) {
    instruction = language.nback.instructions2back;
  }

  // trial for displaying the instructions
  const instructions = {
    type: instructionsPlugin,
    pages: [
      `<p>${instruction.letter}</p><p>${instruction.yourTask1}</p><p>${instruction.yourTask2}</p><p>${language.nback.generalInstruction.fastAndAccurate}</p><p>${language.nback.generalInstruction.clickNext}</p>`,
    ],
    show_clickable_nav: true,
    button_label_next: language.nback.button.next,
    button_label_previous: language.nback.button.previous,
  };

  return instructions;
}

export function createAllNbackBlocks(jsPsych, taskConfig) {
  let allNbackBlocks = [];
  //iterate through each n-back type
  const trialConfig = taskConfig.trialConfig;

  for (let n = 0; n < trialConfig.length; n++) {
    // create i nums of blocks for this n-back
    if (trialConfig[n] > 0) {
      //add instructions first, if and only if there are trials for this n-back type
      allNbackBlocks.push(addInstructionsTrial(n));
    }
    for (let i = 0; i < trialConfig[n]; i++) {
      const result = generateNBackStimuli(
        taskConfig.nback.trialCount,
        taskConfig.nback.targetCount,
        n
      );

      const stimuli = result.list.map((item) => item[0]);

      //experiment block
      allNbackBlocks.push(createNbackBlock(jsPsych, taskConfig, stimuli, n, i));
      //accuracy report for block
      const debriefTrial = build_debrief_trial(jsPsych, n, i, taskConfig.nback.trialCount);
      allNbackBlocks.push(debriefTrial);
      //in between block text
      if (i < trialConfig[n] - 1) {
        allNbackBlocks.push(betweenBlockRest, ready);
      }
    }
  }
  return allNbackBlocks;
}
