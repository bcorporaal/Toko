/**
 * CubicBezier easing function implementation
 *
 * Based on https://github.com/thednp/bezier-easing/ by thednp
 *
 * Creates a cubic Bézier easing function for smooth animations and transitions.
 * Uses Newton-Raphson method with bisection fallback for precise curve solving.
 *
 * @example
 * // Create a custom easing function
 * const easing = toko.cubicBezier(0.25, 0.1, 0.25, 1, 'custom');
 * const value = easing(0.5); // Get eased value at t=0.5
 *
 * // Use preset easing functions
 * const easeInOut = toko.cubicBezier.presets.easeInOut();
 * const easedValue = easeInOut(0.3);
 *
 * // Use https://cubic-bezier.com/ to find suitable parameters
 *
 * @param {number} [x1=0] - X coordinate of first control point
 * @param {number} [y1=0] - Y coordinate of first control point
 * @param {number} [x2=1] - X coordinate of second control point
 * @param {number} [y2=1] - Y coordinate of second control point
 * @param {string} [customName=null] - Custom name for the easing function
 * @returns {Function} Easing function that takes t (0-1) and returns eased value
 *
 * @author thednp (original), Bob Corporaal (adapted)
 */
export function cubicBezier (x1 = 0, y1 = 0, x2 = 1, y2 = 1, customName = null) {
  // Validate inputs
  const isNumber = val => typeof val === 'number';
  const allNumbers = [x1, y1, x2, y2].every(isNumber);

  // Store control points
  const controlPoints = { x1, y1, x2, y2 };

  // Generate name for the easing function
  const name = customName || (allNumbers ? `cubic-bezier(${[x1, y1, x2, y2].join(',')})` : 'linear');

  // Calculate coefficients for the cubic bezier curve
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  // Sample the curve at parameter t for X coordinate
  function sampleCurveX (t) {
    return ((ax * t + bx) * t + cx) * t;
  }

  // Sample the curve at parameter t for Y coordinate
  function sampleCurveY (t) {
    return ((ay * t + by) * t + cy) * t;
  }

  // Calculate the derivative of the curve at parameter t for X coordinate
  function sampleCurveDerivativeX (t) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  // Solve for t given x using Newton-Raphson method with bisection fallback
  function solveCurveX (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    let x2, d2;

    // Newton-Raphson iteration
    for (let i = 0; i < 8; i++) {
      x2 = sampleCurveX(t) - x;
      if (Math.abs(x2) < 1e-6) return t;

      d2 = sampleCurveDerivativeX(t);
      if (Math.abs(d2) < 1e-6) break;

      t -= x2 / d2;
    }

    // Fallback to bisection method
    let t0 = 0;
    let t1 = 1;
    t = x;

    while (t0 < t1) {
      x2 = sampleCurveX(t);
      if (Math.abs(x2 - x) < 1e-6) return t;

      if (x > x2) {
        t0 = t;
      } else {
        t1 = t;
      }

      t = (t1 - t0) * 0.5 + t0;
    }

    return t;
  }

  // Main easing function - given input t (0-1), return eased value
  function easingFunction (t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return sampleCurveY(solveCurveX(t));
  }

  // Add properties to the function for compatibility and debugging
  Object.defineProperty(easingFunction, 'name', {
    writable: true,
    value: name,
  });
  easingFunction.x1 = x1;
  easingFunction.y1 = y1;
  easingFunction.x2 = x2;
  easingFunction.y2 = y2;
  easingFunction.controlPoints = controlPoints;

  // Add the original ease method for backward compatibility
  easingFunction.ease = easingFunction;

  // Add toString method
  easingFunction.toString = () => name;

  return easingFunction;
}

/**
 * Static presets for common easing functions
 * Each preset returns a callable easing function
 * @namespace cubicBezier.presets
 */
cubicBezier.presets = {
  linear: () => cubicBezier(0, 0, 1, 1, 'linear'),
  ease: () => cubicBezier(0.25, 0.1, 0.25, 1, 'ease'),
  easeIn: () => cubicBezier(0.42, 0, 1, 1, 'ease-in'),
  easeOut: () => cubicBezier(0, 0, 0.58, 1, 'ease-out'),
  easeInOut: () => cubicBezier(0.42, 0, 0.58, 1, 'ease-in-out'),
  easeInBack: () => cubicBezier(0.6, -0.28, 0.735, 0.045, 'ease-in-back'),
  easeOutBack: () => cubicBezier(0.175, 0.885, 0.32, 1.275, 'ease-out-back'),
  easeInOutBack: () => cubicBezier(0.68, -0.55, 0.265, 1.55, 'ease-in-out-back'),
};
