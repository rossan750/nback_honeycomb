import { initJsPsych } from "jspsych";
import React, { useEffect, useState } from "react";

import { config } from "../../config/main";
import { initParticipant } from "../deployments/firebase";
import { buildTimeline, jsPsychOptions } from "../../timelines/main";

export default function JsPsychExperiment({
  ipcRenderer,
  studyId,
  participantId,
  taskVersion,
  dataUpdateFunction,
  dataFinishFunction,
}) {
  // This will be the div in the dom that holds the experiment.
  // We reference it explicitly here so we can do some plumbing with react, jspsych, and events.
  const experimentDivId = "experimentWindow";
  const experimentDiv = React.useRef(null);

  const [jsPsych, setJsPsych] = useState();
  const [taskConfig, setTaskConfig] = useState();

  // Combine custom options imported from timelines/maine.js, with necessary Honeycomb options.
  const combinedOptions = {
    ...jsPsychOptions,
    display_element: experimentDivId,
    on_data_update: (data) => {
      // update data from honeycomb
      dataUpdateFunction(data);
    },
    on_finish: (data) => dataFinishFunction(data),
  };

  /**
   * Create the instance of JsPsych whenever the studyId, participantId, or taskVersion changes,
   * which occurs then the user logs in.
   *
   * This instance of jsPsych is passed to any trials that need it when the timeline is built.
   */
  useEffect(() => {
    async function loadJsPsych() {
      // TODO 169: JsPsych has a built in timestamp function
      // Start date of the experiment - used as the UID of the session
      const startDate = new Date().toISOString();

      // Write the initial record to Firestore
      if (config.USE_FIREBASE) initParticipant(studyId, participantId, startDate);

      const jsPsychInternal = initJsPsych(combinedOptions);

      const taskConfigInternal = await ipcRenderer.invoke("syncConfig", studyId, participantId);
      setTaskConfig(taskConfigInternal);

      // For testing and debugging purposes
      console.log({ "Task Configuration": taskConfigInternal });

      // Add experiment properties into jsPsych directly
      jsPsychInternal.data.addProperties({
        study_id: studyId,
        participant_id: participantId,
        start_date: startDate,
        task_version: taskVersion,
        taskConfig: taskConfigInternal,
      });

      setJsPsych(jsPsychInternal);
    }

    loadJsPsych();
  }, [studyId, participantId, taskVersion]);

  // Build the experiment timeline
  useEffect(() => {
    if (jsPsych && taskConfig) {
      // TODO: Have Electron load a default json file if none is present (need to combine stimuli.json and config.json)
      const timeline = buildTimeline(jsPsych, taskConfig);
      jsPsych.run(timeline);
    }
  }, [jsPsych]);

  return <div id={experimentDivId} ref={experimentDiv} className="App" />;
}
