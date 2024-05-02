import { config } from "../config/main";

import { enterFullscreen } from "../trials/fullscreen";
import holdUpMarker from "../trials/holdUpMarker";
import startCode from "../trials/startCode";
import { nameTrial } from "../trials/welcome";

/**
 * Timeline of initial trials used for setup and instructions
 */
// TO-DO: Do we need welcome trial?
const timeline = [nameTrial, enterFullscreen];

// Add photodiode trials
if (config.USE_PHOTODIODE) {
  timeline.push(holdUpMarker());
  timeline.push(startCode());
}
export const preamble = {
  timeline,
};
