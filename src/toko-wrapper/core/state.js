import { LIBRARY_UNKNOWN } from '../config/constants.js';

export let libraryState = {
  initialized: false,
  variant: LIBRARY_UNKNOWN,
  x5: null,
  options: null,
  p5Canvas: null,
  tweakpane: null,
  initialRefreshCallDone: false,
  paletteSelectorData: {},
  // globalFunctionsRegistered: false,
  // prototypeFunctionsRegistered: false,
};
