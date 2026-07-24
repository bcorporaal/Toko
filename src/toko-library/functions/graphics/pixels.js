/**
 * Get pixel density from an image object in a cross-variant compatible way
 * @param {p5.Image|Q5.Image} image - Image object
 * @returns {number} Pixel density value (defaults to 1)
 */
function getImagePixelDensity (image) {
  // p5.js uses pixelDensity() as a method
  if (typeof image.pixelDensity === 'function') {
    return image.pixelDensity();
  }
  // Q5.js stores it as _pixelDensity property
  if (typeof image._pixelDensity !== 'undefined') {
    return image._pixelDensity;
  }
  // Fallback to 1 if neither is available
  return 1;
}

/**
 * Get the RGBA color values of a specific pixel in an image
 * @param {p5.Image} image - p5.js image object (must call loadPixels() first)
 * @param {number} x - X position of the pixel
 * @param {number} y - Y position of the pixel
 * @param {number} width - Width of the referenced image
 * @returns {number[]} Array of RGBA values [red, green, blue, alpha] (0-255 range)
 * @example
 * // Load and get pixel color
 * img.loadPixels();
 * const color = toko.getPixelColor(img, 100, 50, img.width);
 * console.log(`R:${color[0]} G:${color[1]} B:${color[2]} A:${color[3]}`);
 */
export function getPixelColor (image, x, y, width) {
  if (!image || !image.pixels) {
    console.warn('Toko: getPixelColor requires an image with loaded pixels. Call loadPixels() first.');
    return [0, 0, 0, 0];
  }

  // calculate the index in the pixel array
  let d = getImagePixelDensity(image);
  let index = 4 * (y * d * width * d + x * d);

  if (index < 0 || index + 3 >= image.pixels.length) {
    console.warn('Toko: getPixelColor coordinates out of bounds.');
    return [0, 0, 0, 0];
  }

  // retrieve the color values
  let r = image.pixels[index];
  let g = image.pixels[index + 1];
  let b = image.pixels[index + 2];
  let a = image.pixels[index + 3];

  return [r, g, b, a];
}

/**
 * Check if a pixel's average brightness is within a threshold range
 * @param {p5.Image} image - p5.js image object (must call loadPixels() first)
 * @param {number} x - X position of the pixel
 * @param {number} y - Y position of the pixel
 * @param {number} width - Width of the referenced image
 * @param {number} [min=0] - Lower boundary value (0-255 range)
 * @param {number} [max=255] - Upper boundary value (0-255 range)
 * @returns {boolean} True if pixel brightness is within the threshold range
 * @example
 * // Check if pixel is bright
 * img.loadPixels();
 * const isBright = toko.pixelThreshold(img, 100, 50, img.width, 200, 255);
 *
 * // Check if pixel is dark
 * const isDark = toko.pixelThreshold(img, 100, 50, img.width, 0, 50);
 */
export function pixelThreshold (image, x, y, width, min = 0, max = 255) {
  if (!image || !image.pixels) {
    console.warn('Toko: pixelThreshold requires an image with loaded pixels. Call loadPixels() first.');
    return false;
  }

  // calculate the index in the pixel array
  let d = getImagePixelDensity(image);
  let index = 4 * (y * d * width * d + x * d);

  if (index < 0 || index + 2 >= image.pixels.length) {
    console.warn('Toko: pixelThreshold coordinates out of bounds.');
    return false;
  }

  // retrieve the color values
  let ave = (image.pixels[index] + image.pixels[index + 1] + image.pixels[index + 2]) / 3;
  return ave >= min && ave <= max;
}
