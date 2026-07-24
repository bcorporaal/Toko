/**
 * Color utility functions
 *
 * @namespace Color
 */

/**
 * Create a p5.js color object with a hex code and alpha value
 * Simple shortcut for setting color with transparency
 *
 * @example
 * // Create a red color with 50% opacity
 * const redWithAlpha = colorAlpha('#ff0000', 128);
 *
 * // Create a blue color with full opacity
 * const blue = colorAlpha('#0000ff');
 *
 * @param {string} hexColor - Hex color code (e.g., '#ff0000' or 'ff0000')
 * @param {number} [alpha=255] - Alpha value (0-255, where 255 is fully opaque)
 * @returns {p5.Color} p5.js color object with specified alpha
 */
export function colorAlpha (hexColor, alpha = 255) {
  if (hexColor == null || hexColor === '') {
    console.warn('Toko: colorAlpha received an invalid color value.');
    return null;
  }
  let c = color(hexColor);
  // Check if setAlpha method exists (p5.js and q5.js integer mode)
  if (typeof c.setAlpha === 'function') {
    c.setAlpha(alpha);
  } else {
    // WEBGPU float mode - convert alpha from 0-255 to 0-1
    // Check color format by looking at r value (if > 1, it's integer format)
    if (c.r !== undefined && c.r > 1) {
      // Integer format - alpha is already in 0-255 range
      c.a = alpha;
    } else {
      // Float format - convert alpha from 0-255 to 0-1
      c.a = alpha / 255;
    }
  }
  return c;
}
