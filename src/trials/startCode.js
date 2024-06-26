import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { eventCodes, language } from "../config/main";
import { photodiodeSpot, photodiodeGhostBox } from "../lib/markup/photodiode";
import { baseStimulus } from "../lib/markup/stimuli";
import { h1 } from "../lib/markup/tags";

function startCode() {
  const startCodeMarkup = h1(language.prompts.settingUp);
  return {
    type: htmlKeyboardResponse,
    stimulus: baseStimulus(startCodeMarkup, true) + photodiodeGhostBox(),
    trial_duration: 2000,
    on_load: () => {
      // Displays the photodiode spot and plays an audible beep when the trial first loads
      photodiodeSpot(eventCodes.open_task);
    },
  };
}

export default startCode;
