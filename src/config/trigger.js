/**
 * Custom codes for specific task events - used to parse the EEG data
 * NOTE - these event codes must match what is in public/config/trigger.js
 */
const eventCodes = {
  fixation: 1,
  test: 2,
  test_connect: 32,
  open_task: 18,
};

// Note that this is module.exports so it can be imported into the electron app
// TODO: Do this for the firebase functions too?
module.exports = { eventCodes };
