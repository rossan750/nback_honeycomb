/* 
Created by Teodora Vekony (vekteo@gmail.com)
MEMO Team (PI: Dezso Nemeth)
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Github:https://github.com/vekteo/Nback_JSPsych
*/

import { language as lang, stimuli, taskSettings } from "../config/main";
import instructionsPlugin from "@jspsych/plugin-instructions";
import { preamble } from "./preamble";
import { createNbackBlock } from "./createNbackBlock";
import { exitFullscreen } from "../trials/fullscreen";

import "./style.css";
import {
  build_debrief_trial,
  betweenBlockRest,
  ready,
  startPractice,
  afterPractice,
} from "../trials/nBackTrials";
const language = lang.nback;

/*************** VARIABLES ***************/

/**
 * Builds the experiment's timeline that jsPsych will run
 * The instance of jsPsych passed in will include jsPsychOptions from above
 * @param {Object} jsPsych The jsPsych instance that is running the experiment
 * @param {Object} taskConfig The configuration object use to build the timeline
 */
export function createNbackTimeline(jsPsych, taskConfig) {
  console.log("INSIDE createNbackTimeline", jsPsych, taskConfig);
  let timeline = [];
  // const { level } = taskSettings.nback;
  const { level } = taskConfig.nback;

  if (level < 0 || level > 3)
    throw new Error("Invalid level. Only levels 0 through 3 have been created");

  // Get instructions from language file.
  let instruction;
  if (level === 0) {
    instruction = language.instructions0back;
  } else if (level === 1) {
    instruction = language.instructions1back;
  } else if (level === 2) {
    instruction = language.instructions2back;
  } else if (level === 3) {
    instruction = language.instructions3back;
  }

  // trial for displaying the instructions
  const instructions = {
    type: instructionsPlugin,
    pages: [
      `<h1>${language.welcomePage.welcome}</h1><br><p>${language.welcomePage.clickNext}</p>`,
      `<p>${instruction.letter}</p><p>${instruction.yourTask1}</p><p>${instruction.yourTask2}</p><p>${language.generalInstruction.fastAndAccurate}</p><p>${language.generalInstruction.clickNext}</p>`,
    ],
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
  };

  /*create stimuli*/

  let nbackStimuli;
  if (level === 0) {
    nbackStimuli = stimuli.level_zero;
  } else if (level === 1) {
    nbackStimuli = stimuli.level_one;
  } else if (level === 2) {
    nbackStimuli = stimuli.level_two;
  } else if (level === 3) {
    nbackStimuli = stimuli.level_three;
  }

  /*************** TIMELINE ***************/

  /*create blocks*/

  const practice_block = createNbackBlock(jsPsych, level, "practice", nbackStimuli.practice);
  const block_one = createNbackBlock(jsPsych, level, "block_one", nbackStimuli.block_one);
  const block_two = createNbackBlock(jsPsych, level, "block_two", nbackStimuli.block_two);

  // Build the actual timeline
  const debriefTrials = build_debrief_trial(jsPsych);

  timeline.push(
    preamble,
    instructions,
    // startPractice,
    // practice_block,
    // afterPractice,
    // block_one,
    // betweenBlockRest,
    // ready,
    // block_two,
    // debriefTrials,
    exitFullscreen
  );
  return timeline;
}
