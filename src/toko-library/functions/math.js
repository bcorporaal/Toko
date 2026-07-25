//
//  GENERAL MATH FUNCTIONS
//

/**
 * Wraps a number around when it exceeds the specified range.
 * If the value goes above the maximum, it wraps around to the minimum.
 * If the value goes below the minimum, it wraps around to the maximum.
 * @param {number} value - The value to wrap
 * @param {number} [min=0] - Minimum value of the range
 * @param {number} [max=100] - Maximum value of the range
 * @returns {number} The wrapped value within the range
 * @example
 * // Wrap around a 0-100 range
 * toko.wrap(120, 0, 100); // Returns 20
 * toko.wrap(-10, 0, 100); // Returns 90
 *
 * // Default range is 0-100
 * toko.wrap(150); // Returns 50
 */
export function wrap(value, min = 0, max = 100) {
  let vw = value;

  if (value < min) {
    vw = max + (value - min);
  } else if (value > max) {
    vw = min + (value - max);
  }

  return vw;
}

/**
 * Returns the number of integer digits in a value.
 * Works for positive and negative numbers.
 * @param {number} x - The value to count digits of
 * @returns {number} The count of integer digits
 * @example
 * // Count digits in positive numbers
 * toko.numDigits(1234); // Returns 4
 * toko.numDigits(7); // Returns 1
 *
 * // Count digits in negative numbers
 * toko.numDigits(-123); // Returns 3
 */
export function numDigits(x) {
  return (Math.log10(Math.abs(x)) | 0) + 1;
}

/**
 * Creates evenly distributed values between two numbers
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} segments - Number of segments to divide the range into
 * @param {boolean} includeEndpoints - Whether to include start and end values (default: true)
 * @returns {Array<number>} Array of evenly distributed values
 * @example
 * // Create 5 evenly spaced values between 0 and 10
 * toko.interpolate(0, 10, 5); // Returns [0, 2.5, 5, 7.5, 10]
 *
 * // Create values without endpoints
 * toko.interpolate(0, 10, 5, false); // Returns [2, 4, 6, 8]
 */
export function interpolate(a, b, segments, includeEndpoints = true) {
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
 * @example
 * // Create 5 points between (0,0) and (100,50)
 * toko.interpolateCoordinates({x: 0, y: 0}, {x: 100, y: 50}, 5);
 * // Returns [{x: 0, y: 0}, {x: 25, y: 12.5}, {x: 50, y: 25}, {x: 75, y: 37.5}, {x: 100, y: 50}]
 */
export function interpolateCoordinates(pointA, pointB, segments, includeEndpoints = true) {
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

/**
 * Linear interpolation between two coordinates at a given fraction.
 * @param {Object} p0 - Start coordinate {x, y}
 * @param {Object} p1 - End coordinate {x, y}
 * @param {number} fraction - Interpolation fraction between 0 and 1
 * @returns {Object} Interpolated coordinate {x, y}
 * @example
 * // Get the midpoint between (0,0) and (100,50)
 * toko.lerpCoordinates({x: 0, y: 0}, {x: 100, y: 50}, 0.5); // Returns {x: 50, y: 25}
 *
 * // Get a point 25% of the way
 * toko.lerpCoordinates({x: 0, y: 0}, {x: 100, y: 50}, 0.25); // Returns {x: 25, y: 12.5}
 */
export function lerpCoordinates(p0, p1, fraction) {
  let newVector = {
    x: (p1.x - p0.x) * fraction + p0.x,
    y: (p1.y - p0.y) * fraction + p0.y,
  };
  return newVector;
}
