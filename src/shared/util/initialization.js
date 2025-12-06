/**
 * Shared initialization utilities for p5.js variant handling
 * Eliminates code duplication between toko-library and toko-wrapper
 */

import { LIBRARY_P5V1, LIBRARY_P5V2, LIBRARY_Q5 } from '../constants/common.js';
import { detectP5Variant } from '../detector.js';

/**
 * Initialize p5.js variant with the provided adapter functions
 * @param {Object} options - Initialization options
 * @param {Object} options.libraryState - Library state object
 * @param {Function} options.initializeP5v1 - p5v1 initialization function
 * @param {Function} options.initializeQ5 - Q5 initialization function
 * @param {Function} options.p5v2Adapter - p5v2 adapter function
 * @param {Function} options.logWarn - Warning logging function
 * @param {string} options.libraryName - Name of the library for logging
 * @returns {string} The detected variant
 * @example
 * const variant = initializeP5Variant({
 *   libraryState,
 *   initializeP5v1,
 *   initializeQ5,
 *   p5v2Adapter,
 *   logWarn,
 *   libraryName: 'Toko'
 * });
 */
export function initializeP5Variant (options) {
  const { libraryState, initializeP5v1, initializeQ5, p5v2Adapter, logWarn, libraryName } = options;

  const variant = detectP5Variant();
  libraryState.variant = variant;

  switch (variant) {
    case LIBRARY_P5V2:
      if (typeof p5 !== 'undefined' && typeof p5.registerAddon === 'function') {
        p5.registerAddon(p5v2Adapter);
      } else {
        logWarn(`${libraryName}: p5 is not available globally or registerAddon is missing.`);
      }
      break;

    case LIBRARY_P5V1:
      initializeP5v1();
      break;

    case LIBRARY_Q5:
      initializeQ5();
      break;

    default:
      logWarn(`${libraryName}: Unknown or unsupported p5 variant`);
      break;
  }

  return variant;
}
