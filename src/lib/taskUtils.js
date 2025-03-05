// utilities specific to this app/task

import _ from "lodash";
import { NormSInv } from "./utils";

// initialize starting conditions for each trial within a block
export const generateStartingOpts = (blockSettings) => {
  const startingOptions = blockSettings.conditions.map((c) => {
    // Repeat each starting condition the same number of times
    return _.range(blockSettings.repeats_per_condition).map(() => c);
  });

  return _.shuffle(_.flatten(startingOptions));
};

// Copied functions from Nback task stimuli.js

export function statCalculation(trial, jsPsych, block, level) {
  let hit = jsPsych.data.get().filterCustom(function (trial) {
    return trial.block === block && trial.level === level && trial.result === "correct_match";
  });
  let miss = jsPsych.data.get().filterCustom(function (trial) {
    return trial.block === block && trial.level === level && trial.result === "missed_match";
  });
  let falseAlarm = jsPsych.data.get().filterCustom(function (trial) {
    return trial.block === block && trial.level === level && trial.result === "missed_mismatch";
  });
  let correctRejection = jsPsych.data.get().filterCustom(function (trial) {
    return trial.block === block && trial.level === level && trial.result === "correct_mismatch";
  });

  let phit;
  let pfa;
  if (miss.count() > 0) {
    phit = hit.count() / (miss.count() + hit.count());
  } else {
    phit = hit.count() - 0.5 / (miss.count() + hit.count());
  }

  if (falseAlarm.count() > 0) {
    pfa = falseAlarm.count() / (falseAlarm.count() + correctRejection.count());
  } else {
    pfa = 0.5 / (falseAlarm.count() + correctRejection.count());
  }

  let normHit = NormSInv(phit);
  let normFa = NormSInv(pfa);

  let trials = jsPsych.data.get().filterCustom(function (trial) {
    return (
      (trial.block === "block_one" || trial.block === "block_two") &&
      trial.test_part === "test" &&
      trial.key_press !== null
    );
  }); //beleszámoljuk-e a hiányzó választ?????
  // let correctTrials = jsPsych.data.get().filterCustom(function (trial) {
  //   return trial.hit === 1 || trial.correct_rejection === 1;
  // });

  trial.test_part = "debrief";
  trial.STAT_nr_correct_match = hit.count();
  trial.STAT_nr_missed_match = miss.count();
  trial.STAT_nr_missed_mismatch = falseAlarm.count();
  trial.STAT_nr_correct_mismatch = correctRejection.count();
  trial.STAT_nr_response = trials.count();
  trial.STAT_nr_no_response = jsPsych.data
    .get()
    .filterCustom(function (trial) {
      return (
        (trial.block === "block_one" || trial.block === "block_two") &&
        trial.test_part === "test" &&
        trial.key_press == null
      );
    })
    .count();
  trial.STAT_accuracy = ((hit.count() + correctRejection.count()) / trials.count()) * 100;
  trial.STAT_rt_mean = Math.round(trials.select("rt").mean());
  trial.STAT_rt_median = Math.round(trials.select("rt").median());
  trial.STAT_correct_match_rt_mean = Math.round(hit.select("rt").mean());
  trial.STAT_correct_match_rt_median = Math.round(hit.select("rt").median());
  trial.STAT_missed_mismatch_rt_mean = Math.round(falseAlarm.select("rt").mean());
  trial.STAT_missed_mismatch_rt_median = Math.round(falseAlarm.select("rt").median());
  trial.STAT_correct_mismatch_rt_mean = Math.round(correctRejection.select("rt").mean());
  trial.STAT_correct_mismatch_rt_median = Math.round(correctRejection.select("rt").median());
  trial.STAT_missed_match_rt_mean = Math.round(miss.select("rt").mean());
  trial.STAT_missed_match_rt_median = Math.round(miss.select("rt").median());
  trial.STAT_dprime = normHit - normFa;
}
