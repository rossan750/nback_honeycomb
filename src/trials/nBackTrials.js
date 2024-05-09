import { language as lang } from "../config/main";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { statCalculation } from "../lib/taskUtils";
const language = lang.nback;

export const betweenBlockRest = {
  type: htmlKeyboardResponse,
  stimulus: `<p>${language.betweenBlocks.rest}</p><p>${language.betweenBlocks.pressKey}</p>`,
};
export const ready = {
  type: htmlKeyboardResponse,
  stimulus: `<p>${language.betweenBlocks.continue}</p>`,
};
export const startPractice = {
  type: htmlKeyboardResponse,
  stimulus: `<p>${language.practice.practice}</p><p>${language.practice.startPractice}<p>`,
};
export const afterPractice = {
  type: htmlKeyboardResponse,
  stimulus: `<h2>${language.practice.end}</h2><p>${language.task.start}</p><p>${language.task.press}<p>`,
};

export function build_debrief_trial(jsPsych) {
  const debriefBlock = {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: function () {
      let trials = jsPsych.data.get().filterCustom(function (trial) {
        return (
          (trial.block === "block_one" || trial.block === "block_two") && trial.test_part === "test"
        );
      });
      let correct_trials = trials.filterCustom(function (trial) {
        return trial.correct_response;
      });
      let accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
      let rt = Math.round(correct_trials.select("rt").mean());

      return `
    <h2>${language.end.end}</h2>
    <p>${language.feedback.accuracy}${accuracy}${language.feedback.accuracy2}</p>
    <p>${language.feedback.rt}${rt}${language.feedback.rt2}</p>
    <p>${language.end.thankYou}</p>`;
    },
    trial_duration: 3000,
    on_finish: function (trial) {
      statCalculation(trial, jsPsych);
    },
  };
  return debriefBlock;
}
