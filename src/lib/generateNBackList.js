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

  // Check if requested targets exceeds theoretical maximum
  const maxPossibleTargets = length - nBack;

  // Return empty array if requested targets exceed what's possible
  if (targets > maxPossibleTargets) {
    console.log(`Cannot generate stimuli with given configurations`);
    return [];
  }

  // Initialize the list with null values
  // Each item will be [stimulusIndex, targetFlag]
  const list = Array(length)
    .fill()
    .map(() => [null, 0]);

  // First, place targets and their matching positions
  let targetPositionsSet = new Set();
  let placedTargets = 0;

  // Keep trying until we place all requested targets or reach max attempts
  let attempts = 0;
  const maxAttempts = 1000;

  while (placedTargets < targets && attempts < maxAttempts) {
    attempts++;

    // Select a random position for a target (must be at least n positions from start)
    const targetPos = nBack + Math.floor(Math.random() * (length - nBack));

    // Skip if this position is already used as a target
    if (targetPositionsSet.has(targetPos)) {
      continue;
    }

    // Calculate the position that should match this target (n positions back)
    const matchPos = targetPos - nBack;

    // Skip if the match position is already part of another target pair
    if (list[matchPos][1] === 1 || (matchPos + nBack !== targetPos && list[matchPos][0] !== null)) {
      continue;
    }

    // Generate a random stimulus
    const stimulusIndex = Math.floor(Math.random() * rawStimuli.length);

    // Place the same stimulus at both positions
    list[matchPos][0] = stimulusIndex;
    list[targetPos][0] = stimulusIndex;

    // Mark the target position
    list[targetPos][1] = 1;

    // Record the target position
    targetPositionsSet.add(targetPos);

    placedTargets++;
  }

  // Now fill any remaining positions with random stimuli that don't create unintended targets
  for (let i = 0; i < length; i++) {
    if (list[i][0] === null) {
      // We need to select a stimulus that doesn't create an unintended target
      const avoidIndices = new Set();

      // If this could make the next position a target, avoid that letter
      if (i + nBack < length && !targetPositionsSet.has(i + nBack) && list[i + nBack][0] !== null) {
        avoidIndices.add(list[i + nBack][0]);
      }

      // If this could be a target because of the previous position, avoid that letter
      if (i >= nBack && !targetPositionsSet.has(i) && list[i - nBack][0] !== null) {
        avoidIndices.add(list[i - nBack][0]);
      }

      // Create a list of valid stimulus indices
      const validIndices = [];
      for (let j = 0; j < rawStimuli.length; j++) {
        if (!avoidIndices.has(j)) {
          validIndices.push(j);
        }
      }

      // Choose a random valid stimulus
      const randomIndex = Math.floor(Math.random() * validIndices.length);
      list[i][0] = validIndices[randomIndex];
    }
  }

  // Double-check that all targets match correctly and no unintended targets exist
  for (let i = nBack; i < length; i++) {
    const isTarget = list[i][1] === 1;
    const hasMatch = list[i][0] === list[i - nBack][0];

    if (isTarget && !hasMatch) {
      // This is a target without a matching stimulus
      // fix by making it matching
      list[i][0] = list[i - nBack][0];
    } else if (!isTarget && hasMatch) {
      // This is an unintended match
      // Fix it by changing this position to a new letter
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * rawStimuli.length);
      } while (newIndex === list[i - nBack][0]);
      list[i][0] = newIndex;
    }
  }

  // Convert indices to actual letters for the final output
  const finalList = list.map((item) => {
    return [rawStimuli[item[0]], item[1]];
  });

  // Verify final target count
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
