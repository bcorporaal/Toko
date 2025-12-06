/**
 * @fileoverview Transformation utility functions for p5.js creative coding.
 * Provides convenient shortcuts for rotating and scaling around specific points.
 *
 * @example
 * // Rotate a shape around its center
 * rotateAround(width/2, height/2, PI/4);
 * rect(0, 0, 100, 100);
 *
 * // Scale a shape around a specific point
 * scaleAround(mouseX, mouseY, 1.5);
 * ellipse(0, 0, 50, 50);
 */

/**
 * Rotates the current transformation matrix around a specific point.
 * This is equivalent to translating to the point, rotating, then translating back.
 *
 * @param {number} x - X coordinate of the rotation center point
 * @param {number} y - Y coordinate of the rotation center point
 * @param {number} inAngle - Rotation angle in radians (positive values rotate clockwise)
 *
 * @example
 * // Rotate around the center of the canvas
 * rotateAround(width/2, height/2, PI/4);
 * rect(0, 0, 100, 100);
 *
 * @example
 * // Rotate around mouse position
 * rotateAround(mouseX, mouseY, frameCount * 0.01);
 * triangle(0, 0, 50, 0, 25, 50);
 */
export function rotateAround (x, y, inAngle) {
  translate(x, y);
  rotate(inAngle);
  translate(-x, -y);
}

/**
 * Scales the current transformation matrix around a specific point.
 * This is equivalent to translating to the point, scaling, then translating back.
 *
 * @param {number} x - X coordinate of the scaling center point
 * @param {number} y - Y coordinate of the scaling center point
 * @param {number} inScale - Scale factor (1.0 = no change, >1.0 = larger, <1.0 = smaller)
 *
 * @example
 * // Scale around the center of the canvas
 * scaleAround(width/2, height/2, 1.5);
 * rect(0, 0, 100, 100);
 *
 * @example
 * // Scale around mouse position with pulsing effect
 * let scale = 1 + sin(frameCount * 0.1) * 0.5;
 * scaleAround(mouseX, mouseY, scale);
 * ellipse(0, 0, 50, 50);
 */
export function scaleAround (x, y, inScale) {
  translate(x, y);
  scale(inScale);
  translate(-x, -y);
}
