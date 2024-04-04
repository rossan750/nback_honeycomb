import { language as lang } from "../config/main";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { statCalculation } from "../lib/taskUtils";
const language = lang.nback;

export function build_debrief_trial(jsPsych) {
  const debriefBlock = {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: function () {
      let trials = jsPsych.data.get().filterCustom(function (trial) {
        return (trial.block === 1 || trial.block === 2) && trial.test_part === "test";
      });
      let correct_trials = trials.filterCustom(function (trial) {
        return trial.hit === 1 || trial.correct_rejection === 1;
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
