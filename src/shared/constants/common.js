// Common constants shared between toko-library and toko-wrapper

/**
 * Library version
 * @readonly
 * @enum {string}
 */
export const VERSION = '1.0.1';

/**
 * Library variant constants
 * @readonly
 * @enum {string}
 */
export const LIBRARY_P5V1 = 'p5v1';
export const LIBRARY_P5V2 = 'p5v2';
export const LIBRARY_Q5 = 'q5';
export const LIBRARY_UNKNOWN = 'unknown';

export const LIBRARY = {
  P5V1: LIBRARY_P5V1,
  P5V2: LIBRARY_P5V2,
  Q5: LIBRARY_Q5,
  UNKNOWN: LIBRARY_UNKNOWN,
};

/**
 * Easing type constants
 * @readonly
 * @enum {string}
 */
export const EASE_LINEAR = 'Linear';
export const EASE_SMOOTH = 'InOutSmoother';
export const EASE_QUAD = 'Quad';
export const EASE_CUBIC = 'Cubic';
export const EASE_QUART = 'Quart';
export const EASE_QUINT = 'Quint';
export const EASE_EXPO = 'Expo';
export const EASE_CIRC = 'Circ';
export const EASE_ELASTIC = 'Elastic';
export const EASE_BOUNCE = 'Bounce';
export const EASE_BACK = 'Back';

/**
 * Easing direction constants
 * @readonly
 * @enum {string}
 */
export const EASE_IN = 'In';
export const EASE_OUT = 'Out';
export const EASE_IN_OUT = 'InOut';
