import { LIBRARY_UNKNOWN } from '../config/constants.js';
import { DEFAULT_OPTIONS } from '../../shared/constants/defaults.js';

export const libraryState = {
  initialized: false,
  variant: LIBRARY_UNKNOWN,
  x5: null,
  globalFunctionsRegistered: false,
  prototypeFunctionsRegistered: false,
  initColorDone: false,
  initialDrawDone: false,
  options: { ...DEFAULT_OPTIONS },
  fps: null,
};
