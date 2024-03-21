/* 
Created by Teodora Vekony (vekteo@gmail.com)
MEMO Team (PI: Dezso Nemeth)
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Github:https://github.com/vekteo/Nback_JSPsych
*/

import { language as lang, stimuli, taskSettings } from "../config/main";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import instructionsPlugin from "@jspsych/plugin-instructions";
import preloadPlugin from "@jspsych/plugin-preload";
import { createBlocks, statCalculation } from "../lib/taskUtils";
import { preamble } from "./preamble";
import { createNbackBlock } from "./createNbackBlock";
import { exitFullscreen } from "../trials/fullscreen";

import "./style.css";
const language = lang.nback;

/*************** VARIABLES ***************/

export function createNbackTimeline(jsPsych) {
  let timeline = [];
  const { level } = taskSettings.nback;
  console.log("level:", level);

  // Trial for loading all of the images.
  const preload = {
    type: preloadPlugin,
    images: [
      "/assets/instruction_0back_en.gif",
      "/assets/instruction_1back_en.gif",
      "/assets/instruction_2back_en.gif",
      "/assets/instruction_3back_en.gif",
    ],
  };

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

  // const betweenBlockRest = {
  //   type: htmlKeyboardResponse,
  //   stimulus: `<p>${language.betweenBlocks.rest}</p><p>${language.betweenBlocks.pressKey}</p>`,
  // };
  // const ready = {
  //   type: htmlKeyboardResponse,
  //   stimulus: `<p>${language.betweenBlocks.continue}</p>`,
  // };
  const startPractice = {
    type: htmlKeyboardResponse,
    stimulus: `<p>${language.practice.practice}</p><p>${language.practice.startPractice}<p>`,
  };
  const afterPractice = {
    type: htmlKeyboardResponse,
    stimulus: `<h2>${language.practice.end}</h2><p>${language.task.start}</p><p>${language.task.press}<p>`,
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

  //TO-DO: Create blocks should return the block trials given the array of letters.
  const practice_block = createNbackBlock(jsPsych, level, "practice", nbackStimuli.practice);
  // const block_one = createNbackBlock(level, "block_one", nbackStimuli.block_one);
  // const block_two = createNbackBlock(level, "block_two", nbackStimuli.block_two);

  // TO DO: Fix debrief block.
  const debriefBlock = {
    type: htmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: function () {
      let trials = jsPsych.data.get().filterCustom(function (trial) {
        return (trial.block === 1 || trial.block === 2) && trial.test_part === "test";
      });
      let correct_trials = trials.filterCustom(function (trial) {
        return trial.hit === 1 || trial.correct_rejection === 1;
      });
      let accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
      let rt = Math.round(correct_trials.select("rt").mean());

      return `
    <h2>${language.end.end}</h2>
    <p>${language.feedback.accuracy}${accuracy}${language.feedback.accuracy2}</p>
    <p>${language.feedback.rt}${rt}${language.feedback.rt2}</p>
    <p>${language.end.thankYou}</p>`;
    },
    trial_duration: 3000,
    on_finish: function (trial) {
      statCalculation(trial, jsPsych);
    },
  };

  // Build the actual timeline

  timeline.push(
    // preamble,
    preload,
    instructions,
    startPractice,
    practice_block,
    afterPractice,
    // firstBlock,
    // betweenBlockRest,
    // ready,
    // secondBlock,
    // debriefBlock,
    exitFullscreen
  );
  return timeline;
}
