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
  preload,
  betweenBlockRest,
  ready,
  startPractice,
  afterPractice,
} from "../trials/nBackTrials";
const language = lang.nback;

/*************** VARIABLES ***************/

export function createNbackTimeline(jsPsych) {
  let timeline = [];
  const { level } = taskSettings.nback;
  console.log("level:", level);

  // Get instructions from language file.
  let instruction;
  if (level == 0) {
    instruction = language.instructions0back;
  } else if (level == 1) {
    instruction = language.instructions1back;
  } else if (level == 2) {
    instruction = language.instructions2back;
  } else if (level == 3) {
    instruction = language.instructions3back;
  }

  // trial for displaying the instructions
  const instructions = {
    type: instructionsPlugin,
    pages: [
      `<h1>${language.welcomePage.welcome}</h1><br><p>${language.welcomePage.clickNext}</p>`,
      `<p>${instruction.letter}</p><p>${instruction.yourTask1}</p><p>${instruction.yourTask2}</p><p>${language.generalInstruction.fastAndAccurate}</p>${instruction.image}<p>${language.generalInstruction.clickNext}</p>`,
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
    preload,
    instructions,
    startPractice,
    practice_block,
    afterPractice,
    block_one,
    betweenBlockRest,
    ready,
    block_two,
    debriefTrials,
    exitFullscreen
  );
  return timeline;
}
