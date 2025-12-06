/**
 * Creates a linear gradient and applies it to the current drawing context.
 * The gradient transitions from one point to another in a straight line.
 *
 * @param {number} xStart - X coordinate of the gradient start position
 * @param {number} yStart - Y coordinate of the gradient start position
 * @param {number} xEnd - X coordinate of the gradient end position
 * @param {number} yEnd - Y coordinate of the gradient end position
 * @param {Array<{offset: number, color: string}>} stops - Array of color stops, each containing:
 *   - offset: Value between 0 (start) and 1 (end) defining position along gradient
 *   - color: Standard CSS color value (hex, rgb, rgba, hsl, etc.)
 *
 * @example
 * // Create a simple two-color gradient
 * const stops = [
 *   { offset: 0, color: '#ff0000' },
 *   { offset: 1, color: '#0000ff' }
 * ];
 * linearGradient(0, 0, 100, 100, stops);
 * rect(0, 0, 100, 100);
 *
 * @example
 * // Create a multi-stop gradient
 * const stops = [
 *   { offset: 0, color: 'red' },
 *   { offset: 0.5, color: 'yellow' },
 *   { offset: 1, color: 'blue' }
 * ];
 * linearGradient(50, 0, 50, 100, stops);
 * ellipse(50, 50, 80, 80);
 */
export function linearGradient (xStart, yStart, xEnd, yEnd, stops) {
  let gradient = drawingContext.createLinearGradient(xStart, yStart, xEnd, yEnd);
  stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;
}

/**
 * Creates a radial gradient and applies it to the current drawing context.
 * The gradient radiates outward from a center point in concentric circles.
 *
 * @param {number} xStart - X coordinate of the inner circle center
 * @param {number} yStart - Y coordinate of the inner circle center
 * @param {number} rStart - Radius of the inner circle (start of gradient)
 * @param {number} xEnd - X coordinate of the outer circle center
 * @param {number} yEnd - Y coordinate of the outer circle center
 * @param {number} rEnd - Radius of the outer circle (end of gradient)
 * @param {Array<{offset: number, color: string}>} stops - Array of color stops, each containing:
 *   - offset: Value between 0 (start) and 1 (end) defining position along gradient
 *   - color: Standard CSS color value (hex, rgb, rgba, hsl, etc.)
 *
 * @example
 * // Create a simple radial gradient from center
 * const stops = [
 *   { offset: 0, color: '#ffffff' },
 *   { offset: 1, color: '#000000' }
 * ];
 * radialGradient(50, 50, 0, 50, 50, 50, stops);
 * ellipse(50, 50, 100, 100);
 *
 * @example
 * // Create an off-center radial gradient
 * const stops = [
 *   { offset: 0, color: 'rgba(255, 0, 0, 1)' },
 *   { offset: 0.7, color: 'rgba(255, 0, 0, 0.5)' },
 *   { offset: 1, color: 'rgba(255, 0, 0, 0)' }
 * ];
 * radialGradient(30, 30, 0, 50, 50, 40, stops);
 * rect(0, 0, 100, 100);
 */
export function radialGradient (xStart, yStart, rStart, xEnd, yEnd, rEnd, stops) {
  let gradient = drawingContext.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd, rEnd);
  stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;
}

/**
 * Creates a conic (conical) gradient and applies it to the current drawing context.
 * The gradient sweeps around a center point in a circular pattern.
 *
 * @param {number} angle - Start angle in radians, measured clockwise from the positive x-axis (horizontal right)
 * @param {number} x - X coordinate of the gradient center point
 * @param {number} y - Y coordinate of the gradient center point
 * @param {Array<{offset: number, color: string}>} stops - Array of color stops, each containing:
 *   - offset: Value between 0 (start) and 1 (end) defining position around the circle
 *   - color: Standard CSS color value (hex, rgb, rgba, hsl, etc.)
 *
 * @example
 * // Create a rainbow conic gradient
 * const stops = [
 *   { offset: 0, color: '#ff0000' },
 *   { offset: 0.17, color: '#ff8000' },
 *   { offset: 0.33, color: '#ffff00' },
 *   { offset: 0.5, color: '#00ff00' },
 *   { offset: 0.67, color: '#0080ff' },
 *   { offset: 0.83, color: '#8000ff' },
 *   { offset: 1, color: '#ff0000' }
 * ];
 * conicGradient(0, 50, 50, stops);
 * ellipse(50, 50, 80, 80);
 *
 * @example
 * // Create a simple two-color conic gradient
 * const stops = [
 *   { offset: 0, color: 'white' },
 *   { offset: 0.5, color: 'black' },
 *   { offset: 1, color: 'white' }
 * ];
 * conicGradient(PI / 4, 50, 50, stops);
 * rect(0, 0, 100, 100);
 */
export function conicGradient (angle, x, y, stops) {
  let gradient = drawingContext.createConicGradient(angle, x, y);
  stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;
}

/**
 * Generates an array of gradient stops from a Toko color scale.
 * Creates smooth color transitions by sampling the color scale at regular intervals.
 *
 * @param {Object} colors - Toko colors object with scale function and options
 * @param {Function} colors.scale - Color scale function that maps values to colors
 * @param {Object} colors.options - Color options containing domain information
 * @param {Array<number>} colors.options.domain - Array with [min, max] values for the color scale
 * @param {number} [nrStops=50] - Number of color stops to generate (default: 50)
 * @returns {Array<{offset: number, color: string}>} Array of gradient stops with offset and color properties
 *
 * @example
 * // Create gradient stops from a Toko color palette
 * const colors = getColorScale('sunset', { steps: 10 });
 * const stops = makeGradientStops(colors, 20);
 * linearGradient(0, 0, 100, 0, stops);
 * rect(0, 0, 100, 100);
 *
 * @example
 * // Create a radial gradient with many stops for smooth transitions
 * const colors = getColorScale('ocean', { steps: 5 });
 * const stops = makeGradientStops(colors, 100);
 * radialGradient(50, 50, 0, 50, 50, 50, stops);
 * ellipse(50, 50, 100, 100);
 */
export function makeGradientStops (colors, nrStops = 50) {
  let stops = [];
  for (let i = 0; i < nrStops; i++) {
    stops.push({
      offset: map(i, 0, nrStops, 0, 1),
      color: colors.scale(map(i, 0, nrStops, colors.options.domain[0], colors.options.domain[1])),
    });
  }
  return stops;
}

/**
 * Applies shadow effects to subsequent drawing operations.
 * Creates a drop shadow or glow effect with customizable offset, blur, and color.
 *
 * @param {number} xOffset - Horizontal offset of the shadow (positive values move shadow right)
 * @param {number} yOffset - Vertical offset of the shadow (positive values move shadow down)
 * @param {number} blur - Blur radius of the shadow (0 = no blur, higher values = more blur)
 * @param {string} color - Color of the shadow as standard CSS value, including opacity (e.g., 'rgba(0,0,0,0.5)')
 *
 * @example
 * // Create a simple drop shadow
 * shadow(5, 5, 10, 'rgba(0, 0, 0, 0.3)');
 * fill(255, 0, 0);
 * rect(50, 50, 100, 100);
 *
 * @example
 * // Create a glow effect
 * shadow(0, 0, 20, 'rgba(255, 255, 0, 0.8)');
 * fill(255, 255, 0);
 * ellipse(100, 100, 80, 80);
 *
 * @example
 * // Create an upward shadow
 * shadow(0, -10, 15, 'rgba(0, 0, 255, 0.4)');
 * fill(0, 255, 0);
 * triangle(50, 50, 100, 20, 150, 50);
 */
export function shadow (xOffset, yOffset, blur, color) {
  drawingContext.shadowOffsetX = xOffset;
  drawingContext.shadowOffsetY = yOffset;
  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = color;
}
