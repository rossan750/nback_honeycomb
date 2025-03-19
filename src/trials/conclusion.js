import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import lang from "../config/language.json";
const language = lang.nback;

/** Trial that displays a completion message for 5 seconds */
export const conclusionTrial = {
  type: htmlKeyboardResponse,
  stimulus: `
    <div>
    <h1>${language.end.end}</h1>
    <p>${language.end.thankYou}</p>
  </div>
  `,
  choices: "NO_KEYS",
  trial_duration: 5000,
};
