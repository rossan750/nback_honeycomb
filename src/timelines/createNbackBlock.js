import { taskSettings } from "../config/main";
import { p } from "../lib/markup/tags";
import { fixationHTML } from "../lib/markup/fixation";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

const fixation = {
  type: htmlKeyboardResponse,
  stimulus: fixationHTML,
  choices: "NO_KEYS",
  trial_duration: taskSettings.fixation.default_duration,
  data: { test_part: "fixation" },
};

function build_test_trial(jsPsych) {
  const test = {
    type: htmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable("stimulus"),
    choices: ["f", "j"],
    data: jsPsych.timelineVariable("data"),
    trial_duration: taskSettings.nback.letter_duration,
    stimulus_duration: taskSettings.nback.letter_duration,
    on_finish: function (data) {
      // FOR PRACTICE TRIAL...
      // Press "j" on the keyboard if you see "X" and "f" on the keyboard if you see anything else.
      if (data.response === null) data.result = "no_response";
      else if (data.letters_match && data.response === "j") data.result = "correct_match";
      else if (data.letters_match && data.response === "f") data.result = "missed_match";
      else if (!data.letters_match && data.response === "j") data.result = "missed_mismatch";
      else if (!data.letters_match && data.response === "f") data.result = "correct_mismatch";
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
// // const feedback = {};   const feedbackCorrect = {
//     type: htmlKeyboardResponse,
//     stimulus: `<div style="font-size:40px; color: green">${language.feedback.correct}</div>`,
//     choices: "NO_KEYS",
//     trial_duration: taskSettings.nback.feedback_duration,
//     data: { test_part: "feedback" },
//   };

//   const feedbackWrong = {
//     ...feedbackCorrect,
//     stimulus: `<div style="font-size:40px; color: red">${language.feedback.wrong}</div>`,
//   };
//   const feedbackNo = {
//     ...feedbackCorrect,
//     stimulus: `<div style="font-size:40px; color: red">${language.feedback.noResponse}</div>`,
//   };
function build_feedback_trial(jsPsych) {
  return {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    trial_duration: taskSettings.nback.feedback_duration,
    data: { test_part: "feedback" },
    stimulus: function () {
      // let data = jsPsych.data.get().last(1).values();
      // console.log(data);
      const lastTrialData = jsPsych.data.getLastTrialData();
      console.log("last trial data", lastTrialData);
      //TO DO: Determine if last trial was no response, correct response, or incorrect response.
      //TO DO: Display correct feedback based on info.
      return "<div>FEEDBACK</div>";
    },
  };
}

/* define conditional timeline elements for practice */

// const feedBackC = {
//   timeline: [feedbackCorrect],
//   timeline_variables: feedbackCorrect.data,
//   conditional_function: function () {
//     let data = jsPsych.data.get().last(1).values()[0];
//     return data.hit == 1 || data.correct_rejection == 1;
//   },
// };

// const feedBackW = {
//   timeline: [feedbackWrong],
//   timeline_variables: feedbackWrong.data,
//   conditional_function: function () {
//     let data = jsPsych.data.get().last(1).values()[0];
//     return data.hit == 0 || data.correct_rejection == 0;
//   },
// };

// const feedBackN = {
//   timeline: [feedbackNo],
//   timeline_variables: feedbackNo.data,
//   conditional_function: function () {
//     let data = jsPsych.data.get().last(1).values()[0];
//     return (
//       data.hit === 0 && data.correct_rejection === 0 && data.miss === 0 && data.false_alarm === 0
//     );
//   },
// };

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
