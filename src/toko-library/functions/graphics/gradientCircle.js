/**
 * Draw a circle with a radial gradient from center to edge
 * @param {number} x - X position of the circle center in pixels
 * @param {number} y - Y position of the circle center in pixels
 * @param {number} size - Diameter of the circle in pixels
 * @param {string|p5.Color} centerColor - Color at the center of the circle
 * @param {string|p5.Color} edgeColor - Color at the edge of the circle
 * @example
 * // Draw a gradient circle from white to black
 * toko.gradientCircle(width/2, height/2, 200, 'white', 'black');
 *
 * // Draw a warm gradient circle
 * toko.gradientCircle(300, 200, 150, '#ff6b6b', '#4ecdc4');
 */
export function gradientCircle (x, y, size, centerColor, edgeColor) {
  this.push();

  const steps = 50;
  const stepSize = size / (steps * 2);

  for (let i = steps; i > 0; i--) {
    const alpha = this.map(i, 0, steps, 0, 1);
    const currentColor = this.lerpColor(this.color(centerColor), this.color(edgeColor), alpha);

    this.fill(currentColor);
    this.noStroke();
    this.circle(x, y, i * stepSize * 2);
  }

  this.pop();
}
