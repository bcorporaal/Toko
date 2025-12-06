import { LIBRARY_P5V1, LIBRARY_P5V2, LIBRARY_Q5, LIBRARY_UNKNOWN } from './constants/common.js';

/**
 * Detects the variant of the p5 library being used in the current environment.
 * This is shared between toko-library and toko-wrapper to eliminate duplication.
 *
 * @returns {string} Returns one of the constants: LIBRARY_P5V1, LIBRARY_P5V2, LIBRARY_Q5, or LIBRARY_UNKNOWN
 * @example
 * const variant = detectP5Variant();
 * if (variant === LIBRARY_Q5) {
 *   // Q5-specific code
 * }
 */
export function detectP5Variant () {
  // q5.js check - check both global Q5 and window.Q5
  if (typeof Q5 !== 'undefined' || (typeof window !== 'undefined' && typeof window.Q5 !== 'undefined')) {
    return LIBRARY_Q5;
  }

  // p5.js checks - check both global p5 and window.p5
  if (typeof p5 !== 'undefined' || (typeof window !== 'undefined' && typeof window.p5 !== 'undefined')) {
    const p5Instance = typeof p5 !== 'undefined' ? p5 : window.p5;

    // Quick v2 detection
    if (typeof p5Instance.VERSION === 'string' && p5Instance.VERSION.startsWith('2.')) {
      return LIBRARY_P5V2;
    }
    if (p5Instance && typeof p5Instance.Graphics2D !== 'undefined') {
      return LIBRARY_P5V2; // Beta version of p5.js with Graphics2D feature
    }
    return LIBRARY_P5V1;
  }

  return LIBRARY_UNKNOWN;
}
