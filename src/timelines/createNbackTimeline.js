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

// TO-DO: Make sure practice trials are running correctly
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

  /*create blocks*/

  // Initialize nbackStimuli
  // nbackStimuli.stimuliFirstBlock = [];
  // nbackStimuli.stimuliSecondBlock = [];
  // nbackStimuli.stimuliPractice = [];
  // nbackStimuli.correctResponse;
  // nbackStimuli.target;

  // TO-DO: Update if statements to stimuli from json file
  let nbackStimuli;
  if (level === 0) {
    // nbackStimuli = defineNullBack(nbackStimuli);
    nbackStimuli = stimuli.level_zero;
  } else if (level === 1) {
    // nbackStimuli = defineOneBack(nbackStimuli);
    nbackStimuli = stimuli.level_one;
  } else if (level === 2) {
    // nbackStimuli = defineTwoBack(nbackStimuli);
    nbackStimuli = stimuli.level_two;
  } else if (level === 3) {
    // nbackStimuli = defineThreeBack(nbackStimuli);
    nbackStimuli = stimuli.level_three;
  }
  // Block is added to the third parameter here. We need to return it in a way that adds the block to the correct place.
  // createBlocks(nbackStimuli, nbackStimuli.practiceList, nbackStimuli.stimuliPractice, level);
  // createBlocks(
  //   nbackStimuli,
  //   nbackStimuli.stimuliListFirstBlock,
  //   nbackStimuli.stimuliFirstBlock,
  //   level
  // );
  // createBlocks(
  //   nbackStimuli,
  //   nbackStimuli.stimuliListSecondBlock,
  //   nbackStimuli.stimuliSecondBlock,
  //   level
  // );

  //TO-DO: Create blocks should return the block trials given the array of letters.
  const practice_block = createNbackBlock(jsPsych, level, "practice", nbackStimuli.practice);
  // const block_one = createNbackBlock(level, "block_one", nbackStimuli.block_one);
  // const block_two = createNbackBlock(level, "block_two", nbackStimuli.block_two);
  console.log(practice_block);
  /* define practice feedback trials */

  // const feedbackCorrect = {
  //   type: htmlKeyboardResponse,
  //   stimulus: `<div style="font-size:40px; color: green">${language.feedback.correct}</div>`,
  //   choices: "NO_KEYS",
  //   trial_duration: taskSettings.nback.feedback_duration,
  //   data: { test_part: "feedback" },
  // };

  // const feedbackWrong = {
  //   ...feedbackCorrect,
  //   stimulus: `<div style="font-size:40px; color: red">${language.feedback.wrong}</div>`,
  // };
  // const feedbackNo = {
  //   ...feedbackCorrect,
  //   stimulus: `<div style="font-size:40px; color: red">${language.feedback.noResponse}</div>`,
  // };

  /* define task trials */

  // const fixation = {
  //   type: htmlKeyboardResponse,
  //   stimulus: '<div style="font-size:30px;">+</div>',
  //   choices: "NO_KEYS",
  //   trial_duration: taskSettings.fixation.default_duration,
  //   data: { test_part: "fixation" },
  // };

  // const test = {
  //   type: htmlKeyboardResponse,
  //   stimulus: jsPsych.timelineVariable("stimulus"),
  //   choices: buttonToPressForTarget,
  //   data: jsPsych.timelineVariable("data"),
  //   trial_duration: taskSettings.nback.letter_duration,
  //   stimulus_duration: taskSettings.nback.letter_duration,
  //   on_finish: function (data) {
  //     if (data.correct_response == "f" && data.key_press == 70) {
  //       data.correct_rejection = 1;
  //     } else {
  //       data.correct_rejection = 0;
  //     }
  //     if (data.correct_response == "j" && data.key_press == 70) {
  //       data.miss = 1;
  //     } else {
  //       data.miss = 0;
  //     }
  //     if (data.correct_response == "j" && data.key_press == 74) {
  //       data.hit = 1;
  //     } else {
  //       data.hit = 0;
  //     }
  //     if (data.correct_response == "f" && data.key_press == 74) {
  //       data.false_alarm = 1;
  //     } else {
  //       data.false_alarm = 0;
  //     }
  //   },
  // };

  /* define conditional timeline elements for practice */

  // const feedBackC = {
  //   timeline: [feedbackCorrect],
  //   timeline_variables: feedbackCorrect.data,
  //   conditional_function: function () {
  //     let data = jsPsych.data.get().last(1).values()[0];
  //     return data.hit == 1 || data.correct_rejection == 1;
  //   },
  // };

  // const feedBackW = {
  //   timeline: [feedbackWrong],
  //   timeline_variables: feedbackWrong.data,
  //   conditional_function: function () {
  //     let data = jsPsych.data.get().last(1).values()[0];
  //     return data.hit == 0 || data.correct_rejection == 0;
  //   },
  // };

  // const feedBackN = {
  //   timeline: [feedbackNo],
  //   timeline_variables: feedbackNo.data,
  //   conditional_function: function () {
  //     let data = jsPsych.data.get().last(1).values()[0];
  //     return (
  //       data.hit === 0 && data.correct_rejection === 0 && data.miss === 0 && data.false_alarm === 0
  //     );
  //   },
  // };

  /*************** TIMELINE ***************/

  // const practice = {
  //   ...timelineElementStructure,
  //   timeline_variables: nbackStimuli.stimuliPractice,
  //   timeline: [fixation, test, feedBackN, feedBackC, feedBackW],
  // };
  // const firstBlock = {
  //   ...timelineElementStructure,
  //   timeline_variables: nbackStimuli.stimuliFirstBlock,
  //   timeline: [fixation, test],
  // };
  // const secondBlock = { ...firstBlock, timeline_variables: nbackStimuli.stimuliSecondBlock };

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
