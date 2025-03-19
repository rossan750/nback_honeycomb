/* 
Created by Teodora Vekony (vekteo@gmail.com)
MEMO Team (PI: Dezso Nemeth)
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Github:https://github.com/vekteo/Nback_JSPsych
*/

import { buildStartProcedure } from "./startProcedure";
import { createAllNbackBlocks } from "./createNbackBlock";
import { conclusionTrial as conclusion } from "../trials/conclusion";
import { exitFullscreen } from "../trials/fullscreen";
import "./style.css";

/*************** VARIABLES ***************/

/**
 * Builds the experiment's timeline that jsPsych will run
 * The instance of jsPsych passed in will include jsPsychOptions from above
 * @param {JsPsych} jsPsych The jsPsych instance that is running the experiment
 * @param {Object} taskConfig The configuration object use to build the timeline
 */
export function createNbackTimeline(jsPsych, taskConfig) {
  let timeline = [];

  /*************** TIMELINE ***************/
  const startProcedure = buildStartProcedure(jsPsych);

  /*create all blocks based on task configs*/
  const allNbackBlocks = createAllNbackBlocks(jsPsych, taskConfig, timeline);

  timeline.push(startProcedure, ...allNbackBlocks, conclusion, exitFullscreen);

  return timeline;
}
