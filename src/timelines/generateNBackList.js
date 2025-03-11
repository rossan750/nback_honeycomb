/**
 * Generates a list of items for an n-back task with a specified number of targets
 * Special case: When n=0, targets are 'X' characters and non-targets are other consonants
 *
 * @param {number} length - Total length of the stimulus list
 * @param {number} targets - Number of target items to include
 * @param {number} nBack - The n in n-back (positions apart for targets)
 * @returns {Object} Object containing the list, actual number of targets, and raw stimuli
 */
export function generateNBackStimuli(length, targets, nBack) {
  // Define stimuli similar to the Matlab code
  const rawStimuli = [
    "B",
    "C",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "V",
    "W",
    "X",
    "Z",
  ];

  const rawStimuliMinusX = [
    "B",
    "C",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "V",
    "W",
    "Z",
  ];
  // Special case for n=0
  if (nBack === 0) {
    return generateZeroBackList(length, targets, rawStimuliMinusX);
  }

  // Initialize the list with arrays where [stimulus, targetFlag]
  // stimulus represents index of a letter from rawStimuli
  // targetFlag represents either 0 or 1
  const list = Array(length)
    .fill()
    .map(() => [0, 0]);

  const iterLimit = 500; // Maximum number of iterations to prevent infinite loops (from Matlab code)

  // Track which positions we've explicitly designated as targets
  const plannedTargetPositions = new Set();

  // Generate positions for targets
  let targetCount = 0;
  let iterations = 0;

  while (targetCount < targets && iterations < iterLimit) {
    // choose a random position for the target
    const i = Math.floor(Math.random() * (length - nBack));
    // position for the target, "n" back of i index
    const targetPos = i + nBack;

    // Check if both positions are available and target position isn't already planned
    if (list[i][0] === 0 && list[targetPos][0] === 0 && !plannedTargetPositions.has(targetPos)) {
      // Choose a random stimulus
      const stimulusIndex = Math.floor(Math.random() * rawStimuli.length);

      // Place the same stimulus at both positions
      list[i][0] = stimulusIndex;
      list[targetPos][0] = stimulusIndex;

      // Mark second position as target
      list[targetPos][1] = 1;

      // record that we've planned this target
      plannedTargetPositions.add(targetPos);

      targetCount++;
    }
    iterations++;
  }

  // If we have wrong number of targets added to the list, remove until its correct
  const currentTargetCount = list.filter((item) => item[1] === 1).length;
  if (currentTargetCount > targets) {
    // Remove excess targets one by one
    let excessTargets = currentTargetCount - targets;
    for (let i = length - 1; i >= 0 && excessTargets > 0; i--) {
      if (list[i][1] === 1) {
        list[i] = [0, 0]; // Reset this position
        excessTargets--;
      }
    }
  }

  // Fill remaining positions with random stimuli
  for (let i = 0; i < length; i++) {
    if (list[i][0] === 0) {
      // Get the letters to avoid (the ones that would create targets)
      const lettersToAvoid = new Set();

      // Check if there's a letter n positions before
      if (i >= nBack && list[i - nBack][0] !== 0) {
        lettersToAvoid.add(list[i - nBack][0]);
      }

      // Check if there's a letter n positions after
      if (i + nBack < length && list[i + nBack][0] !== 0) {
        lettersToAvoid.add(list[i + nBack][0]);
      }

      // create array of valid indices (all indices except those to avoid)
      const validIndices = [];
      for (let j = 0; j < rawStimuli.length; j++) {
        if (!lettersToAvoid.has(j)) {
          validIndices.push(j);
        }
      }

      // if we have valid options, select randomly from them
      if (validIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * validIndices.length);
        list[i][0] = validIndices[randomIndex];
      }
    }
  }

  // Convert indices to actual letters for the final output
  const finalList = list.map((item) => {
    return [rawStimuli[item[0]], item[1]];
  });

  // Verify the final target count
  const actualTargetCount = finalList.filter((item) => item[1] === 1).length;
  return {
    list: finalList,
    targetCount: actualTargetCount,
    rawStimuli,
  };
}

/**
 * Generates a list for the special case of n=0 where 'X' characters are targets
 *
 * @param {number} length - Total length of the stimulus list
 * @param {number} targets - Number of 'X' characters to include
 * @param {Array<string>} rawStimuli - Array of available stimuli (minus X)
 * @returns {Object} Object containing the list, target count, and raw stimuli
 */
function generateZeroBackList(length, targets, rawStimuli) {
  // Create a list of the correct length
  const list = Array(length)
    .fill()
    .map(() => [0, 0]);

  // First, randomly place 'X' characters (targets) in the list
  let targetPositions = [];
  while (targetPositions.length < targets) {
    const pos = Math.floor(Math.random() * length);
    if (!targetPositions.includes(pos)) {
      targetPositions.push(pos);
    }
  }

  // Fill the list with 'X' at target positions and random non-X stimuli elsewhere
  let targetCount = 0;
  for (let i = 0; i < length; i++) {
    if (targetPositions.includes(i)) {
      // This is a target position, use 'X'
      list[i] = ["X", 1]; // Mark as target (1)
      targetCount += 1;
    } else {
      // non-target position, use random non-X stimulus
      const randIndex = Math.floor(Math.random() * rawStimuli.length);
      list[i] = [rawStimuli[randIndex], 0];
    }
  }

  return {
    list,
    targetCount: targetCount,
    rawStimuli,
  };
}
