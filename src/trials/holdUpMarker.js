import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import { language } from "../config/main";
import { h1 } from "../lib/markup/tags";
import { photodiodeGhostBox } from "../lib/markup/photodiode";

// TODO: Actually check to see if USB is connected? This isn't testing anything?
function holdUpMarker() {
  return {
    type: htmlButtonResponse,
    stimulus: h1(language.trials.holdUpMarker) + photodiodeGhostBox(),
    choices: [language.prompts.continue.button],
  };
}

export default holdUpMarker;
