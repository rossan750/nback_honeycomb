import { initJsPsych } from "jspsych";
import PropTypes from "prop-types";
import React from "react";

import { config } from "../../config/main";
import { buildTimeline, jsPsychOptions } from "../../timelines/main";
import { initParticipant } from "../deployments/firebase";

export default function JsPsychExperiment({
  studyID,
  participantID,
  trialConfig,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
}) {
  // ID used to identify the DOM element that holds the experiment.
  const experimentDivId = "experimentWindow";
  const experimentDiv = React.useRef(null);

  const [jsPsych, setJsPsych] = React.useState();
  const [timeline, setTimeline] = React.useState();
  const [taskConfig, setTaskConfig] = React.useState();

  /**
   * Create the instance of JsPsych whenever the studyID or participantID changes, which occurs then the user logs in.
   *
   * This instance of jsPsych is passed to any trials that need it when the timeline is built.
   */
  React.useEffect(() => {
    async function initializeJsPsych() {
      // Start date of the experiment - used as the UID of the session
      const startDate = new Date().toISOString();

      // Write the initial record to Firestore
      if (config.USE_FIREBASE) initParticipant(studyID, participantID, startDate);

      // Initialize the instance of jsPsych that will be used on the next render
      const nextJsPsych = initJsPsych({
        // Combine necessary Honeycomb options with custom ones (src/timelines/main.js)
        ...jsPsychOptions,
        display_element: experimentDivId,
        on_data_update: (data) => {
          jsPsychOptions.on_data_update && jsPsychOptions.on_data_update(data); // Call custom on_data_update function (if provided)
          dataUpdateFunction(data); // Call Honeycomb's on_data_update function
        },
        on_finish: (data) => {
          jsPsychOptions.on_finish && jsPsychOptions.on_finish(data); // Call custom on_finish function (if provided)
          dataFinishFunction(data); // Call Honeycomb's on_finish function
        },
      });

      const taskConfigInternal = await window.electronAPI.syncConfig(studyID, participantID);

      //If taskConfig not properly set up during login, default to defaultTaskConfig.json nback trials configuration
      const trialConfiguration =
        trialConfig.length > 0 ? trialConfig.split(",") : taskConfigInternal.nback.nbackTrials;

      setTaskConfig({
        ...taskConfigInternal,
        trialConfig: trialConfiguration,
      });

      // For testing and debugging purposes
      console.log({ "Task Configuration": taskConfigInternal });

      // Adds experiment data into jsPsych directly. These properties will be added to all trials
      nextJsPsych.data.addProperties({
        study_id: studyID,
        participant_id: participantID,
        start_date: startDate,
        task_version: taskVersion,
      });

      setJsPsych(nextJsPsych);
    }

    initializeJsPsych();
  }, [studyID, participantID, taskVersion]);

  /** Asynchronously builds the timeline once jsPsych is initialized */
  React.useEffect(() => {
    if (!jsPsych || !taskConfig) return; // Early exit when jsPsych hasn't been initialized (initial render)

    async function initializeTimeline() {
      // Build the timeline that will be used on the next render
      const nextTimeline = await buildTimeline(jsPsych, taskConfig);
      setTimeline(nextTimeline);
    }
    initializeTimeline();
  }, [jsPsych]);

  /** Runs the experiment once the timeline is initialized */
  React.useEffect(() => {
    if (!timeline) return; // Early exit when timeline hasn't been initialized (initial render)
    jsPsych.run(timeline);
  }, [timeline]);

  return <div id={experimentDivId} ref={experimentDiv} className="App" />;
}

JsPsychExperiment.propTypes = {
  studyID: PropTypes.string,
  participantID: PropTypes.string,
  dataUpdateFunction: PropTypes.func,
  dataFinishFunction: PropTypes.func,
};
