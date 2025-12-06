/**
 * Generate a pulsing value between 0 and 1 using sine wave
 * @param {number} [speed=0.05] - Speed of the pulse animation (higher = faster)
 * @returns {number} Pulsing value between 0 and 1
 * @example
 * // Create a slow pulsing effect
 * const alpha = toko.pulse(0.02);
 * fill(255, 255, 255, alpha * 255);
 * circle(width/2, height/2, 100);
 *
 * // Create a fast pulsing effect
 * const size = toko.pulse(0.1) * 50 + 25;
 * circle(width/2, height/2, size);
 */
export function pulse (speed = 0.05) {
  return (this.sin(this.millis() * speed) + 1) / 2;
}
