//
//  BASIC GRAIN FOR IMAGES
//
//  Based on https://www.fxhash.xyz/article/all-about-that-grain

/**
 * Add simple grain effect to the current canvas by shifting all pixels randomly
 * @param {number} strength - Grain strength (0-255 range, higher = more grain)
 * @example
 * // Add subtle grain
 * toko.addSimpleGrain(10);
 *
 * // Add heavy grain effect
 * toko.addSimpleGrain(50);
 */
export function addSimpleGrain (strength) {
  loadPixels();
  const d = pixelDensity();
  const pixelsCount = 4 * (width * d) * (height * d);
  for (let i = 0; i < pixelsCount; i += 4) {
    pixels[i] = pixels[i] + random(-strength, strength);
    pixels[i + 1] = pixels[i + 1] + random(-strength, strength);
    pixels[i + 2] = pixels[i + 2] + random(-strength, strength);
  }
  updatePixels();
}

/**
 * Add grain effect with different strength and shift values for each color channel
 * @param {Object} strength - Object with red, green, blue values (0-255 range)
 * @param {Object} shift - Object with red, green, blue shift values (can be negative)
 * @example
 * // Add grain with different channel strengths
 * toko.addChannelGrain(
 *   { red: 10, green: 20, blue: 10 },
 *   { red: -5, green: 0, blue: 5 }
 * );
 *
 * // Create warm grain effect
 * toko.addChannelGrain(
 *   { red: 15, green: 10, blue: 5 },
 *   { red: 10, green: 5, blue: 0 }
 * );
 */
export function addChannelGrain (strength, shift) {
  loadPixels();
  const d = pixelDensity();
  const pixelsCount = 4 * (width * d) * (height * d);
  for (let i = 0; i < pixelsCount; i += 4) {
    pixels[i] = pixels[i] + random(-strength.red, strength.red) + shift.red;
    pixels[i + 1] = pixels[i + 1] + random(-strength.green, strength.green) + shift.green;
    pixels[i + 2] = pixels[i + 2] + random(-strength.blue, strength.blue) + shift.blue;
  }
  updatePixels();
}
