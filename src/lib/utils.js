/**
 * Pauses program execution for a given amount of time
 * @param {number} ms The number of milliseconds to sleep for
 * @returns A resolved promise after ms milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Add a random number between 0 and offset to the base number
 * @param {number} base The starting number
 * @param {number} offset The maximum addition to base
 * @returns The base number jittered by the offset
 */
function jitter(base, offset) {
  return base + Math.floor(Math.random() * Math.floor(offset));
}

/**
 * Add a random number between 0 and 50 to the base number
 * @param {number} base The starting number
 * @returns The base number jittered by 50
 */
function jitter50(base) {
  return jitter(base, 50);
}

/**
 * Flips a coin
 * @returns Returns true or false randomly
 */
function randomTrue() {
  return Math.random() > 0.5;
}

/**
 * Deeply copies an object
 * @param {Object} obj The starting object
 * @returns An exact copy of obj
 */
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format a number as a US dollar amount
 * @param {number} amount Dollar amount
 * @returns The string representation of amount in USD
 */
function formatDollars(amount) {
  return "$" + parseFloat(amount).toFixed(2);
}

/**
 * Adds a wait period before a trial begins
 * @param {Object} trial The trial to add a wait period to
 * @param {number} waitTime The amount of time to wait by
 * @returns The given trial with a waiting period before it
 */
// TODO 162: This should be a trial not a utility? It"s adding a separate trial in and of itself
// TODO 162: JsPsych has a property for the wait time before moving to the next trial
function generateWaitSet(trial, waitTime) {
  const waitTrial = Object.assign({}, trial);
  waitTrial.trial_duration = waitTime;
  waitTrial.response_ends_trial = false;
  waitTrial.prompt = "-";

  return [waitTrial, trial];
}

/**
 * Starts the JsPsych keyboard response listener
 * @param  jsPsych The jsPsych instance running the task.
 */
function startKeypressListener(jsPsych) {
  const keypressResponse = (info) => {
    const data = { key_press: info.key };
    jsPsych.finishTrial(data);
  };

  const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressResponse,
    valid_responses: ["ALL_KEYS"],
    persist: false,
  });

  return keyboardListener;
}

/**
 * Gets the value of a given variable from the URL search parameters
 * @param {any} variable The key of the variable in the search parameters
 * @returns The value of variable in the search parameters
 */
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

/**
 * Gets the ID of a prolific user from the URL search parameters
 * @returns
 */
function getProlificId() {
  const prolificId = getQueryVariable("PROLIFIC_PID");
  return prolificId;
}

/**
 * Emits an audible beep
 * @param {Object} audioCodes The type/frequency of the beep
 */
function beep(audioCodes) {
  const context = new AudioContext(); // eslint-disable-line no-undef
  const o = context.createOscillator();
  const g = context.createGain();
  o.type = audioCodes.type;
  o.connect(g);
  o.frequency.setValueAtTime(audioCodes.frequency, 0);
  console.log(context.currentTime);
  g.connect(context.destination);
  o.start();
  o.stop(context.currentTime + 0.4);
}

/**
 * Interleave a value before/after every element in an array
 * @param {Array<any>} arr The original array
 * @param {any} val The value to interleave inside the array
 * @param {boolean} addBefore Whether to add val before or after each element in array
 * @returns The original array with val interleaved between every element
 */
function interleave(arr, val, addBefore = true) {
  return [].concat(...arr.map((n) => (addBefore ? [val, n] : [n, val])));
}

//from https://stackoverflow.com/questions/8816729/javascript-equivalent-for-inverse-normal-function-eg-excels-normsinv-or-nor
function NormSInv(p) {
  var a1 = -39.6968302866538,
    a2 = 220.946098424521,
    a3 = -275.928510446969;
  var a4 = 138.357751867269,
    a5 = -30.6647980661472,
    a6 = 2.50662827745924;
  var b1 = -54.4760987982241,
    b2 = 161.585836858041,
    b3 = -155.698979859887;
  var b4 = 66.8013118877197,
    b5 = -13.2806815528857,
    c1 = -7.78489400243029e-3;
  var c2 = -0.322396458041136,
    c3 = -2.40075827716184,
    c4 = -2.54973253934373;
  var c5 = 4.37466414146497,
    c6 = 2.93816398269878,
    d1 = 7.78469570904146e-3;
  var d2 = 0.32246712907004,
    d3 = 2.445134137143,
    d4 = 3.75440866190742;
  var p_low = 0.02425,
    p_high = 1 - p_low;
  var q, r;
  var retVal;

  if (p < 0 || p > 1) {
    alert("NormSInv: Argument out of range.");
    retVal = 0;
  } else if (p < p_low) {
    q = Math.sqrt(-2 * Math.log(p));
    retVal =
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (p <= p_high) {
    q = p - 0.5;
    r = q * q;
    retVal =
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    retVal =
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }

  return retVal;
}

export {
  beep,
  deepCopy,
  formatDollars,
  generateWaitSet,
  getProlificId,
  interleave,
  jitter,
  jitter50,
  NormSInv,
  randomTrue,
  sleep,
  startKeypressListener,
};
