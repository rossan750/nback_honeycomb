import { createNbackTimeline } from "./createNbackTimeline";

/**
 * Experiment-wide settings for jsPsych: https://www.jspsych.org/7.3/overview/experiment-options/
 * Note that Honeycomb combines these with other options required for Honeycomb to operate correctly
 */
const jsPsychOptions = {
  on_trial_finish: function (data) {
    console.log("A trial just ended, here are the latest data:");
    console.log(data);
  },
  default_iti: 250,
};

/**
 * Builds the experiment's timeline that jsPsych will run
 * The instance of jsPsych passed in will include jsPsychOptions from above
 * @param {Object} jsPsych The jsPsych instance that is running the experiment
 */
function buildTimeline(jsPsych) {
  // const timeline = createHoneycombTimeline(jsPsych);
  const timeline = createNbackTimeline(jsPsych);

  return timeline;
}

export { buildTimeline, jsPsychOptions };
