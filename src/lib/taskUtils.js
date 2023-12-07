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

export function setArrays() {
  nbackStimuli = {};
  nbackStimuli.stimuliFirstBlock = [];
  nbackStimuli.stimuliSecondBlock = [];
  nbackStimuli.stimuliPractice = [];
  nbackStimuli.correctResponse;
  nbackStimuli.target;
}

export function defineNullBack() {
  nbackStimuli.practiceList = ["B", "P", "X", "K", "H", "M", "Q", "X", "N", "T"];
  nbackStimuli.stimuliListFirstBlock = [
    "R",
    "B",
    "Q",
    "N",
    "Q",
    "K",
    "X",
    "X",
    "N",
    "R",
    "B",
    "X",
    "M",
    "H",
    "X",
    "T",
    "R",
    "X",
    "P",
    "P",
    "M",
    "M",
    "Q",
    "K",
    "T",
    "P",
    "X",
    "H",
    "N",
    "T",
    "X",
    "H",
    "Q",
    "N",
    "R",
    "K",
    "M",
    "K",
    "B",
    "X",
    "K",
    "T",
    "B",
    "X",
    "R",
    "P",
    "N",
    "H",
    "B",
    "X",
  ];
  nbackStimuli.stimuliListSecondBlock = [
    "H",
    "Q",
    "X",
    "R",
    "M",
    "R",
    "Q",
    "H",
    "Q",
    "X",
    "H",
    "T",
    "X",
    "Q",
    "B",
    "N",
    "K",
    "P",
    "K",
    "R",
    "B",
    "X",
    "R",
    "X",
    "X",
    "N",
    "K",
    "X",
    "P",
    "N",
    "P",
    "X",
    "T",
    "P",
    "T",
    "B",
    "H",
    "M",
    "M",
    "Q",
    "N",
    "M",
    "K",
    "X",
    "H",
    "M",
    "T",
    "X",
    "B",
    "P",
  ];
}

export function defineOneBack() {
  nbackStimuli.practiceList = ["B", "P", "K", "K", "H", "M", "Q", "Q", "X", "N"];
  nbackStimuli.stimuliListFirstBlock = [
    "H",
    "H",
    "T",
    "X",
    "H",
    "N",
    "X",
    "B",
    "N",
    "M",
    "X",
    "X",
    "B",
    "R",
    "X",
    "Q",
    "B",
    "Q",
    "T",
    "T",
    "Q",
    "M",
    "R",
    "N",
    "P",
    "P",
    "B",
    "B",
    "P",
    "M",
    "R",
    "R",
    "N",
    "N",
    "K",
    "Q",
    "Q",
    "K",
    "K",
    "T",
    "P",
    "K",
    "P",
    "M",
    "M",
    "K",
    "R",
    "H",
    "T",
    "H",
  ];
  nbackStimuli.stimuliListSecondBlock = [
    "K",
    "R",
    "N",
    "P",
    "H",
    "B",
    "B",
    "T",
    "H",
    "H",
    "X",
    "K",
    "M",
    "K",
    "K",
    "P",
    "P",
    "B",
    "X",
    "M",
    "X",
    "X",
    "R",
    "Q",
    "N",
    "H",
    "P",
    "Q",
    "Q",
    "H",
    "P",
    "B",
    "N",
    "M",
    "M",
    "B",
    "K",
    "M",
    "Q",
    "X",
    "N",
    "N",
    "T",
    "R",
    "R",
    "T",
    "T",
    "R",
    "T",
    "Q",
  ];
}

export function defineTwoBack() {
  nbackStimuli.practiceList = ["B", "K", "P", "K", "H", "Q", "M", "Q", "X", "N"];
  nbackStimuli.stimuliListFirstBlock = [
    "H",
    "M",
    "N",
    "K",
    "B",
    "K",
    "R",
    "T",
    "K",
    "B",
    "X",
    "R",
    "K",
    "R",
    "N",
    "X",
    "Q",
    "X",
    "T",
    "M",
    "Q",
    "P",
    "R",
    "H",
    "B",
    "M",
    "B",
    "P",
    "M",
    "N",
    "M",
    "H",
    "Q",
    "N",
    "X",
    "N",
    "P",
    "R",
    "H",
    "P",
    "H",
    "P",
    "T",
    "X",
    "B",
    "Q",
    "T",
    "Q",
    "T",
    "K",
  ];
  nbackStimuli.stimuliListSecondBlock = [
    "T",
    "B",
    "T",
    "B",
    "Q",
    "P",
    "T",
    "M",
    "K",
    "M",
    "K",
    "X",
    "Q",
    "K",
    "B",
    "H",
    "Q",
    "P",
    "Q",
    "H",
    "N",
    "N",
    "H",
    "H",
    "B",
    "M",
    "R",
    "M",
    "P",
    "R",
    "P",
    "T",
    "X",
    "K",
    "N",
    "P",
    "N",
    "X",
    "M",
    "R",
    "T",
    "R",
    "B",
    "Q",
    "H",
    "X",
    "R",
    "X",
    "K",
    "N",
  ];
}

export function defineThreeBack() {
  nbackStimuli.practiceList = ["B", "K", "P", "H", "K", "Q", "M", "X", "Q", "N"];
  nbackStimuli.stimuliListFirstBlock = [
    "N",
    "K",
    "X",
    "Q",
    "M",
    "X",
    "Q",
    "X",
    "T",
    "P",
    "Q",
    "T",
    "P",
    "K",
    "Q",
    "N",
    "R",
    "B",
    "T",
    "R",
    "N",
    "X",
    "K",
    "N",
    "R",
    "K",
    "Q",
    "M",
    "R",
    "B",
    "K",
    "P",
    "M",
    "H",
    "N",
    "M",
    "T",
    "P",
    "X",
    "B",
    "H",
    "T",
    "B",
    "B",
    "H",
    "P",
    "M",
    "H",
    "R",
    "H",
  ];
  nbackStimuli.stimuliListSecondBlock = [
    "T",
    "P",
    "H",
    "M",
    "P",
    "K",
    "X",
    "Q",
    "K",
    "P",
    "Q",
    "T",
    "M",
    "R",
    "Q",
    "X",
    "K",
    "B",
    "R",
    "X",
    "B",
    "P",
    "H",
    "M",
    "T",
    "H",
    "M",
    "N",
    "K",
    "X",
    "N",
    "R",
    "X",
    "T",
    "K",
    "P",
    "T",
    "M",
    "B",
    "Q",
    "B",
    "N",
    "H",
    "N",
    "H",
    "R",
    "B",
    "Q",
    "R",
    "N",
  ];
}

export function statCalculation(trial, jsPsych) {
  let hit = jsPsych.data.get().filterCustom(function (trial) {
    return (trial.block === 1 || trial.block === 2) && trial.hit === 1;
  });
  let miss = jsPsych.data.get().filterCustom(function (trial) {
    return (trial.block === 1 || trial.block === 2) && trial.miss === 1;
  });
  let falseAlarm = jsPsych.data.get().filterCustom(function (trial) {
    return (trial.block === 1 || trial.block === 2) && trial.false_alarm === 1;
  });
  let correctRejection = jsPsych.data.get().filterCustom(function (trial) {
    return (trial.block === 1 || trial.block === 2) && trial.correct_rejection === 1;
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
      (trial.block === 1 || trial.block === 2) &&
      trial.test_part === "test" &&
      trial.key_press !== null
    );
  }); //beleszámoljuk-e a hiányzó választ?????
  let correctTrials = jsPsych.data.get().filterCustom(function (trial) {
    return trial.hit === 1 || trial.correct_rejection === 1;
  });

  trial.test_part = "debrief";
  trial.STAT_nr_hit = hit.count();
  trial.STAT_nr_miss = miss.count();
  trial.STAT_nr_false_alarm = falseAlarm.count();
  trial.STAT_nr_correct_rejection = correctRejection.count();
  trial.STAT_nr_response = trials.count();
  trial.STAT_nr_no_response = jsPsych.data
    .get()
    .filterCustom(function (trial) {
      return (
        (trial.block === 1 || trial.block === 2) &&
        trial.test_part === "test" &&
        trial.key_press == null
      );
    })
    .count();
  trial.STAT_accuracy = ((hit.count() + correctRejection.count()) / trials.count()) * 100;
  trial.STAT_rt_mean = Math.round(trials.select("rt").mean());
  trial.STAT_rt_median = Math.round(trials.select("rt").median());
  trial.STAT_hit_rt_mean = Math.round(hit.select("rt").mean());
  trial.STAT_hit_rt_median = Math.round(hit.select("rt").median());
  trial.STAT_false_alarm_rt_mean = Math.round(falseAlarm.select("rt").mean());
  trial.STAT_false_alarm_rt_median = Math.round(falseAlarm.select("rt").median());
  trial.STAT_correct_rejection_rt_mean = Math.round(correctRejection.select("rt").mean());
  trial.STAT_correct_rejection_rt_median = Math.round(correctRejection.select("rt").median());
  trial.STAT_miss_rt_mean = Math.round(miss.select("rt").mean());
  trial.STAT_miss_rt_median = Math.round(miss.select("rt").median());
  trial.STAT_dprime = normHit - normFa;
}
