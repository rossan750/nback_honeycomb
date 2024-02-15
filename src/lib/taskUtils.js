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
  // let correctTrials = jsPsych.data.get().filterCustom(function (trial) {
  //   return trial.hit === 1 || trial.correct_rejection === 1;
  // });

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
export function createBlock(level, stimuli) {
  console.log(level);
  console.log(stimuli);
}
export function createBlocks(nbackStimuli, list, stimuli, level) {
  let block, target, correctResponse, targetStimulus;
  for (let i = 0; i < list.length; i++) {
    if (level === 0) {
      targetStimulus = "X";
    } else {
      targetStimulus = list[i - level];
    }

    if (i > 0) {
      if (list[i] === targetStimulus) {
        correctResponse = "j";
        target = 1;
      } else {
        correctResponse = "f";
        target = 0;
      }
    } else {
      correctResponse = "f";
      target = 0;
    }
    //TO-DO: Need to make sure this equality check is working.
    if (list == nbackStimuli.practiceList) {
      block = 0;
    } else if (list == nbackStimuli.stimuliListFirstBlock) {
      block = 1;
    } else {
      block = 2;
    }

    let newElement = {
      stimulus: "<p class='stimulus'>" + list[i] + "</p>",
      data: {
        test_part: "test",
        level: level,
        correct_response: correctResponse,
        block: block,
        trial_number: i + 1,
        target: target,
        letter: list[i],
      },
    };
    stimuli.push(newElement);
  }
}
