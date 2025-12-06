//
//  GENERAL MATH FUNCTIONS
//

//
//  wrap a number around if it goes above the maximum or below the minimum
//
// This function ensures a number stays within a range by wrapping it around if it exceeds the bounds.
export function wrap (value, min = 0, max = 100) {
  let vw = value;

  if (value < min) {
    vw = max + (value - min);
  } else if (value > max) {
    vw = min + (value - max);
  }

  return vw;
}

//
//  return number of integer digits of a value
//
//  Note: This implementation uses Math.log10, which may introduce slight inaccuracies
//  for very large or very small numbers due to floating-point precision.
//
export function numDigits (x) {
  return (Math.log10(Math.abs(x)) | 0) + 1;
}

/**
 * Creates evenly distributed values between two numbers
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} segments - Number of segments to divide the range into
 * @param {boolean} includeEndpoints - Whether to include start and end values (default: true)
 * @returns {Array<number>} Array of evenly distributed values
 */
export function interpolate (a, b, segments, includeEndpoints = true) {
  // Minimal validation - only check segments validity
  if (!Number.isInteger(segments) || segments < 0 || (segments == 0 && !includeEndpoints)) {
    throw new Error('Segments must be a positive integer');
  }

  if (segments == 0 && includeEndpoints) {
    return [a, b];
  }

  const count = includeEndpoints ? segments + 1 : segments - 1;
  const result = new Array(count); // Pre-allocate

  if (includeEndpoints) {
    for (let i = 0; i <= segments; i++) {
      result[i] = a + (i / segments) * (b - a);
    }
  } else {
    for (let i = 1; i < segments; i++) {
      result[i - 1] = a + (i / segments) * (b - a);
    }
  }

  return result;
}

/**
 * Creates evenly distributed coordinate points between two coordinate objects
 * @param {Object} pointA - Start coordinate {x, y}
 * @param {Object} pointB - End coordinate {x, y}
 * @param {number} segments - Number of segments to divide the path into
 * @param {boolean} includeEndpoints - Whether to include start and end points (default: true)
 * @returns {Array<Object>} Array of coordinate objects with interpolated x and y values
 */
export function interpolateCoordinates (pointA, pointB, segments, includeEndpoints = true) {
  // Minimal validation
  if (!Number.isInteger(segments) || segments < 0 || (segments == 0 && !includeEndpoints)) {
    throw new Error('Segments must be a positive integer');
  }

  if (segments == 0 && includeEndpoints) {
    return [pointA, pointB];
  }

  const count = includeEndpoints ? segments + 1 : segments - 1;
  const result = new Array(count); // Pre-allocate

  if (includeEndpoints) {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      result[i] = {
        x: pointA.x + t * (pointB.x - pointA.x),
        y: pointA.y + t * (pointB.y - pointA.y),
      };
    }
  } else {
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      result[i - 1] = {
        x: pointA.x + t * (pointB.x - pointA.x),
        y: pointA.y + t * (pointB.y - pointA.y),
      };
    }
  }

  return result;
}

export function lerpCoordinates (p0, p1, fraction) {
  let newVector = {
    x: (p1.x - p0.x) * fraction + p0.x,
    y: (p1.y - p0.y) * fraction + p0.y,
  };
  return newVector;
}
