/**
 * @fileoverview This file contains the static string names of attributes used by the audio recorder.
 */

/**
 * The state attribute.
 * @type {"state"}
 */
export const STATE = "state";

/**
 * The onplay attribute - the event that fires when the audio is played.
 * @type {"onplay"}
 */
export const ONPLAY = "onplay";

/**
 * The onpause attribute - the event that fires when the audio is paused.
 * @type {"onpause"}
 */
export const ONPAUSE = "onpause";

/**
 * The onrecord attribute - the event that fires when the audio is recorded.
 * @type {"onrecord"}
 */
export const ONRECORD = "onrecord";

/**
 * @typedef {STATE|ONPLAY|ONPAUSE|ONRECORD} attribute
 */

export default {
  STATE,
  ONPLAY,
  ONPAUSE,
  ONRECORD,
};
