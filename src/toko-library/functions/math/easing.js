/**
 * Easing functions for smooth animations and transitions
 *
 * Based on:
 * - https://gist.github.com/gre/1650294
 * - https://github.com/AndrewRayCode/easing-utils
 *
 * Provides a comprehensive set of easing functions for animations.
 * Each function takes a parameter t (0-1) and returns an eased value (0-1).
 */

/**
 * @namespace Easing
 */
import { logError } from '../utils/logging.js';
import { EASE_LINEAR, EASE_SMOOTH, EASE_QUAD, EASE_IN_OUT } from '../../../shared/constants/common.js';

/**
 * Clamps a value between 0 and 1
 * @param {number} t - Value to clamp
 * @returns {number} Clamped value (0-1)
 */
function clamp01 (t) {
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/**
 * Linear easing - no acceleration or deceleration
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Linear interpolation value
 * @example
 * const value = easeLinear(0.5); // Returns 0.5
 */
export function easeLinear (t) {
  return clamp01(t);
}

/**
 * Sine easing in - slight acceleration from zero to full speed
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with sine acceleration
 * @example
 * const value = easeInSine(0.5); // Returns eased value
 */
export function easeInSine (t) {
  t = clamp01(t);
  return -1 * Math.cos(t * (Math.PI / 2)) + 1;
}

/**
 * Sine easing out - slight deceleration at the end
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with sine deceleration
 * @example
 * const value = easeOutSine(0.5); // Returns eased value
 */
export function easeOutSine (t) {
  t = clamp01(t);
  return Math.sin(t * (Math.PI / 2));
}

/**
 * Sine easing in-out - slight acceleration at beginning and slight deceleration at end
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with sine acceleration and deceleration
 * @example
 * const value = easeInOutSine(0.5); // Returns eased value
 */
export function easeInOutSine (t) {
  t = clamp01(t);
  return -0.5 * (Math.cos(Math.PI * t) - 1);
}

/**
 * Quadratic easing in - accelerating from zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quadratic acceleration
 * @example
 * const value = easeInQuad(0.5); // Returns 0.25
 */
export function easeInQuad (t) {
  t = clamp01(t);
  return t * t;
}

/**
 * Quadratic easing out - decelerating to zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quadratic deceleration
 * @example
 * const value = easeOutQuad(0.5); // Returns eased value
 */
export function easeOutQuad (t) {
  t = clamp01(t);
  return t * (2 - t);
}

/**
 * Quadratic easing in-out - acceleration until halfway, then deceleration
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quadratic acceleration and deceleration
 * @example
 * const value = easeInOutQuad(0.5); // Returns eased value
 */
export function easeInOutQuad (t) {
  t = clamp01(t);
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Cubic easing in - accelerating from zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with cubic acceleration
 * @example
 * const value = easeInCubic(0.5); // Returns 0.125
 */
export function easeInCubic (t) {
  t = clamp01(t);
  return t * t * t;
}

/**
 * Cubic easing out - decelerating to zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with cubic deceleration
 * @example
 * const value = easeOutCubic(0.5); // Returns eased value
 */
export function easeOutCubic (t) {
  t = clamp01(t);
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
}

/**
 * Cubic easing in-out - acceleration until halfway, then deceleration
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with cubic acceleration and deceleration
 * @example
 * const value = easeInOutCubic(0.5); // Returns eased value
 */
export function easeInOutCubic (t) {
  t = clamp01(t);
  if (t < 0.5) {
    return 4 * t * t * t;
  }
  const t1 = t - 1;
  const t2 = 2 * t1;
  return t1 * t2 * t2 + 1;
}

/**
 * Quartic easing in - accelerating from zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quartic acceleration
 * @example
 * const value = easeInQuart(0.5); // Returns 0.0625
 */
export function easeInQuart (t) {
  t = clamp01(t);
  return t * t * t * t;
}

/**
 * Quartic easing out - decelerating to zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quartic deceleration
 * @example
 * const value = easeOutQuart(0.5); // Returns eased value
 */
export function easeOutQuart (t) {
  t = clamp01(t);
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
}

/**
 * Quartic easing in-out - acceleration until halfway, then deceleration
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quartic acceleration and deceleration
 * @example
 * const value = easeInOutQuart(0.5); // Returns eased value
 */
export function easeInOutQuart (t) {
  t = clamp01(t);
  if (t < 0.5) {
    return 8 * t * t * t * t;
  }
  const t1 = t - 1;
  return 1 - 8 * t1 * t1 * t1 * t1;
}

/**
 * Quintic easing in - accelerating from zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quintic acceleration
 * @example
 * const value = easeInQuint(0.5); // Returns 0.03125
 */
export function easeInQuint (t) {
  t = clamp01(t);
  return t * t * t * t * t;
}

/**
 * Quintic easing out - decelerating to zero velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quintic deceleration
 * @example
 * const value = easeOutQuint(0.5); // Returns eased value
 */
export function easeOutQuint (t) {
  t = clamp01(t);
  const t1 = t - 1;
  return 1 + t1 * t1 * t1 * t1 * t1;
}

/**
 * Quintic easing in-out - acceleration until halfway, then deceleration
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with quintic acceleration and deceleration
 * @example
 * const value = easeInOutQuint(0.5); // Returns eased value
 */
export function easeInOutQuint (t) {
  t = clamp01(t);
  if (t < 0.5) {
    return 16 * t * t * t * t * t;
  }
  const t1 = t - 1;
  return 1 + 16 * t1 * t1 * t1 * t1 * t1;
}

/**
 * Exponential easing in - accelerate exponentially until finish
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with exponential acceleration
 * @example
 * const value = easeInExpo(0.5); // Returns eased value
 */
export function easeInExpo (t) {
  t = clamp01(t);
  if (t === 0) {
    return 0;
  }
  return Math.pow(2, 10 * (t - 1));
}

/**
 * Exponential easing out - initial exponential acceleration slowing to stop
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with exponential deceleration
 * @example
 * const value = easeOutExpo(0.5); // Returns eased value
 */
export function easeOutExpo (t) {
  t = clamp01(t);
  if (t === 1) {
    return 1;
  }
  return -Math.pow(2, -10 * t) + 1;
}

/**
 * Exponential easing in-out - exponential acceleration and deceleration
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with exponential acceleration and deceleration
 * @example
 * const value = easeInOutExpo(0.5); // Returns eased value
 */
export function easeInOutExpo (t) {
  t = clamp01(t);
  if (t === 0 || t === 1) {
    return t;
  }
  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 1;
  if (scaledTime < 1) {
    return 0.5 * Math.pow(2, 10 * scaledTime1);
  }
  return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
}

/**
 * Circular easing in - increasing velocity until stop
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with circular acceleration
 * @example
 * const value = easeInCirc(0.5); // Returns eased value
 */
export function easeInCirc (t) {
  t = clamp01(t);
  return -1 * (Math.sqrt(1 - t * t) - 1);
}

/**
 * Circular easing out - start fast, decreasing velocity until stop
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with circular deceleration
 * @example
 * const value = easeOutCirc(0.5); // Returns eased value
 */
export function easeOutCirc (t) {
  t = clamp01(t);
  const t1 = t - 1;
  return Math.sqrt(1 - t1 * t1);
}

/**
 * Circular easing in-out - fast increase in velocity, fast decrease in velocity
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with circular acceleration and deceleration
 * @example
 * const value = easeInOutCirc(0.5); // Returns eased value
 */
export function easeInOutCirc (t) {
  t = clamp01(t);
  const scaledTime = t * 2;
  if (scaledTime < 1) {
    return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
  }
  const scaledTime1 = scaledTime - 2;
  return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
}

/**
 * Back easing in - slow movement backwards then fast snap to finish
 * @param {number} t - Time parameter (0-1)
 * @param {number} [magnitude=1.70158] - The magnitude of the overshoot
 * @returns {number} Eased value with back-in effect
 * @example
 * const value = easeInBack(0.5); // Returns eased value
 * const valueCustom = easeInBack(0.5, 2.0); // Returns eased value with custom magnitude
 */
export function easeInBack (t, magnitude = 1.70158) {
  t = clamp01(t);
  if (magnitude < 0) {
    magnitude = 0;
  }
  return t * t * ((magnitude + 1) * t - magnitude);
}

/**
 * Back easing out - fast snap to backwards point then slow resolve to finish
 * @param {number} t - Time parameter (0-1)
 * @param {number} [magnitude=1.70158] - The magnitude of the overshoot
 * @returns {number} Eased value with back-out effect
 * @example
 * const value = easeOutBack(0.5); // Returns eased value
 * const valueCustom = easeOutBack(0.5, 2.0); // Returns eased value with custom magnitude
 */
export function easeOutBack (t, magnitude = 1.70158) {
  t = clamp01(t);
  if (magnitude < 0) {
    magnitude = 0;
  }
  const t1 = t - 1;
  return t1 * t1 * ((magnitude + 1) * t1 + magnitude) + 1;
}

/**
 * Back easing in-out - slow movement backwards, fast snap to past finish, slow resolve to finish
 * @param {number} t - Time parameter (0-1)
 * @param {number} [magnitude=1.70158] - The magnitude of the overshoot
 * @returns {number} Eased value with back-in-out effect
 * @example
 * const value = easeInOutBack(0.5); // Returns eased value
 * const valueCustom = easeInOutBack(0.5, 2.0); // Returns eased value with custom magnitude
 */
export function easeInOutBack (t, magnitude = 1.70158) {
  t = clamp01(t);
  if (magnitude < 0) {
    magnitude = 0;
  }
  const scaledTime = t * 2;
  const s = magnitude * 1.525;
  if (scaledTime < 1) {
    return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
  }
  const scaledTime2 = scaledTime - 2;
  return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
}
/**
 * Elastic easing in - bounces slowly then quickly to finish
 * @param {number} t - Time parameter (0-1)
 * @param {number} [magnitude=0.7] - The magnitude of the elastic effect (0-1)
 * @returns {number} Eased value with elastic-in effect
 * @example
 * const value = easeInElastic(0.5); // Returns eased value
 * const valueCustom = easeInElastic(0.5, 0.8); // Returns eased value with custom magnitude
 */
export function easeInElastic (t, magnitude = 0.7) {
  t = clamp01(t);
  if (t === 0 || t === 1) {
    return t;
  }
  if (magnitude < 0) {
    magnitude = 0;
  } else if (magnitude >= 1) {
    magnitude = 0.999;
  }
  const t1 = t - 1;
  const p = 1 - magnitude;
  const s = (p / (2 * Math.PI)) * Math.asin(1);
  return -(Math.pow(2, 10 * t1) * Math.sin(((t1 - s) * (2 * Math.PI)) / p));
}

/**
 * Elastic easing out - fast acceleration, bounces to zero
 * @param {number} t - Time parameter (0-1)
 * @param {number} [magnitude=0.7] - The magnitude of the elastic effect (0-1)
 * @returns {number} Eased value with elastic-out effect
 * @example
 * const value = easeOutElastic(0.5); // Returns eased value
 * const valueCustom = easeOutElastic(0.5, 0.8); // Returns eased value with custom magnitude
 */
export function easeOutElastic (t, magnitude = 0.7) {
  t = clamp01(t);
  if (t === 0 || t === 1) {
    return t;
  }
  if (magnitude < 0) {
    magnitude = 0;
  } else if (magnitude >= 1) {
    magnitude = 0.999;
  }
  const p = 1 - magnitude;
  const scaledTime = t * 2;
  const s = (p / (2 * Math.PI)) * Math.asin(1);
  return Math.pow(2, -10 * scaledTime) * Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) + 1;
}

/**
 * Elastic easing in-out - slow start and end, two bounces sandwich a fast motion
 * @param {number} t - Time parameter (0-1)
 * @param {number} [magnitude=0.65] - The magnitude of the elastic effect (0-1)
 * @returns {number} Eased value with elastic-in-out effect
 * @example
 * const value = easeInOutElastic(0.5); // Returns eased value
 * const valueCustom = easeInOutElastic(0.5, 0.8); // Returns eased value with custom magnitude
 */
export function easeInOutElastic (t, magnitude = 0.65) {
  t = clamp01(t);
  if (t === 0 || t === 1) {
    return t;
  }
  if (magnitude < 0) {
    magnitude = 0;
  } else if (magnitude >= 1) {
    magnitude = 0.999;
  }
  const p = 1 - magnitude;
  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 1;
  const s = (p / (2 * Math.PI)) * Math.asin(1);
  if (scaledTime < 1) {
    return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
  }
  return Math.pow(2, -10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) * 0.5 + 1;
}

/**
 * Bounce easing out - bounce to completion
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with bounce-out effect
 * @example
 * const value = easeOutBounce(0.5); // Returns eased value
 */
export function easeOutBounce (t) {
  t = clamp01(t);
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    const t1 = t - 1.5 / 2.75;
    return 7.5625 * t1 * t1 + 0.75;
  } else if (t < 2.5 / 2.75) {
    const t1 = t - 2.25 / 2.75;
    return 7.5625 * t1 * t1 + 0.9375;
  } else {
    const t1 = t - 2.625 / 2.75;
    return 7.5625 * t1 * t1 + 0.984375;
  }
}

/**
 * Bounce easing in - bounce increasing in velocity until completion
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with bounce-in effect
 * @example
 * const value = easeInBounce(0.5); // Returns eased value
 */
export function easeInBounce (t) {
  t = clamp01(t);
  return 1 - easeOutBounce(1 - t);
}

/**
 * Bounce easing in-out - bounce in and bounce out
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with bounce-in-out effect
 * @example
 * const value = easeInOutBounce(0.5); // Returns eased value
 */
export function easeInOutBounce (t) {
  t = clamp01(t);
  if (t < 0.5) {
    return easeInBounce(t * 2) * 0.5;
  }
  return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
}

/**
 * Extra smooth easing - Ken Perlin smoothstep function
 * @param {number} t - Time parameter (0-1)
 * @returns {number} Eased value with extra smooth interpolation
 * @example
 * const value = easeInOutSmoother(0.5); // Returns eased value
 */
export function easeInOutSmoother (t) {
  t = clamp01(t);
  const ts = t * t;
  const tc = ts * t;
  return 6 * tc * ts - 15 * ts * ts + 10 * tc;
}

//
//  get the easing equation based on the type and direction
//
// Precomputed lookup map for faster function retrieval
const EASING_FUNCTION_MAP = new Map([
  ['easeLinear', easeLinear],
  ['easeInSine', easeInSine],
  ['easeOutSine', easeOutSine],
  ['easeInOutSine', easeInOutSine],
  ['easeInQuad', easeInQuad],
  ['easeOutQuad', easeOutQuad],
  ['easeInOutQuad', easeInOutQuad],
  ['easeInCubic', easeInCubic],
  ['easeOutCubic', easeOutCubic],
  ['easeInOutCubic', easeInOutCubic],
  ['easeInQuart', easeInQuart],
  ['easeOutQuart', easeOutQuart],
  ['easeInOutQuart', easeInOutQuart],
  ['easeInQuint', easeInQuint],
  ['easeOutQuint', easeOutQuint],
  ['easeInOutQuint', easeInOutQuint],
  ['easeInExpo', easeInExpo],
  ['easeOutExpo', easeOutExpo],
  ['easeInOutExpo', easeInOutExpo],
  ['easeInCirc', easeInCirc],
  ['easeOutCirc', easeOutCirc],
  ['easeInOutCirc', easeInOutCirc],
  ['easeInBack', easeInBack],
  ['easeOutBack', easeOutBack],
  ['easeInOutBack', easeInOutBack],
  ['easeInElastic', easeInElastic],
  ['easeOutElastic', easeOutElastic],
  ['easeInOutElastic', easeInOutElastic],
  ['easeInBounce', easeInBounce],
  ['easeOutBounce', easeOutBounce],
  ['easeInOutBounce', easeInOutBounce],
  ['easeInOutSmoother', easeInOutSmoother],
]);

/**
 * Retrieves the easing function based on the specified type and direction.
 *
 * @param {string} easeType - The type of easing (e.g., Quad, Cubic, etc.).
 * @param {string} easeDirection - The direction of easing (e.g., In, Out, InOut).
 * @returns {Function|null} The corresponding easing function or null if not found.
 * @example
 * const easingFunc = getEasingFunction('Quad', 'InOut');
 * const value = easingFunc(0.5);
 */
export function getEasingFunction (easeType = EASE_QUAD, easeDirection = EASE_IN_OUT) {
  let easeFunction = 'ease';

  if (easeType !== EASE_LINEAR && easeType !== EASE_SMOOTH) {
    easeFunction += easeDirection;
  }

  easeFunction += easeType;

  const f = EASING_FUNCTION_MAP.get(easeFunction);

  if (typeof f === 'function') {
    return f;
  } else {
    logError(`${easeFunction} is not a function.`);
    return null;
  }
}
