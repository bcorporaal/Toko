import Toko from '../core/main';

//
//  getPixelColor
//
//  image   p5.js image. Use loadPixels first
//  x       pixel x position
//  y       pixel y position
//  width   width of the referenced image
//
Toko.prototype.getPixelColor = function (image, x, y, width) {
  // calculate the index in the pixel array
  let d = image.pixelDensity();
  let index = 4 * (y * d * width * d + x * d);

  // retrieve the color values
  let r = image.pixels[index];
  let g = image.pixels[index + 1];
  let b = image.pixels[index + 2];
  let a = image.pixels[index + 3];

  return [r, g, b, a];
};

//
//  pixelThreshold
//  returns true if average pixel value is between min and max values
//
//  image     p5.js image. Use loadPixels first
//  x         pixel x position
//  y         pixel y position
//  width     width of the referenced image
//  min       lower boundary value, included in selection
//  max       upper boundary value, included in selection
//
Toko.prototype.pixelThreshold = function (image, x, y, width, min = 0, max = 255) {
  // calculate the index in the pixel array
  let d = image.pixelDensity();
  let index = 4 * (y * d * width * d + x * d);

  // retrieve the color values
  let ave = (image.pixels[index] + image.pixels[index + 1] + image.pixels[index + 2]) / 3;
  return ave >= min && ave <= max;
};
