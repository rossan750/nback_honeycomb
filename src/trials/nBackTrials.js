import lang from "../config/language.json";

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

export function build_debrief_trial(jsPsych, block, level, totalTrialCount) {
  const debriefBlock = {
    type: htmlKeyboardResponse,
    choices: "ALL_KEYS",
    stimulus: function () {
      let trials = jsPsych.data.get().filterCustom(function (trial) {
        return trial.block === block && trial.level === level && trial.test_part === "test";
      });
      let correct_trials = trials.filterCustom(function (trial) {
        return trial.correct_response;
      });
      let accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
      let rt = Math.round(correct_trials.select("rt").mean());

      return `
        <p>${language.feedback.accuracy}${accuracy}${language.feedback.accuracy2}</p>
        ${!isNaN(rt) ? `<p>${language.feedback.rt}${rt}${language.feedback.rt2}</p>` : ""}
        <p>Press any key to continue.</p>
      `;
    },
    on_finish: function (trial) {
      statCalculation(trial, jsPsych, block, level, totalTrialCount);
    },
  };
  return debriefBlock;
}
