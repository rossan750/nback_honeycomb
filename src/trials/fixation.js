import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { config } from "../config/main";
import { eventCodes } from "../config/trigger";
import { pdSpotEncode, photodiodeGhostBox } from "../lib/markup/photodiode";
/**
 * Builds a trial with a fixation dot and optional photodiode box.
 * @param {jsPsych} jsPsych The global jsPsych object used to build the trial
 * @param {Object} taskConfig The task configs where we will retrieve fixation settings
 * @returns {Object} A jsPsych trial object
 */
export function buildFixationTrial(jsPsych, taskConfig) {
  const fixationSettings = taskConfig.fixation;
  const fixationCode = eventCodes.fixation;

  return {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    // Display the fixation dot
    stimulus: "",
    prompt: function () {
      // Conditionally display the photodiodeGhostBox
      if (config.USE_PHOTODIODE) return photodiodeGhostBox;
      else return null;
    },
    trial_duration: function () {
      if (fixationSettings.randomize_duration) {
        // Select a random duration from the durations array to show the fixation dot for
        return jsPsych.randomization.sampleWithoutReplacement(fixationSettings.durations, 1)[0];
      } else {
        // Show the fixation dot for default duration seconds
        return fixationSettings.default_duration;
      }
    },
    data: {
      code: fixationCode, // Add event code to the recorded data
    },
    on_load: function () {
      // Conditionally flash the photodiode when the trial first loads
      if (config.USE_PHOTODIODE) pdSpotEncode(fixationCode);
    },
  };
}
