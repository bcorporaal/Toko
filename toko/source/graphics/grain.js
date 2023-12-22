import Toko from '../core/main';

//
//  BASIC GRAIN FOR IMAGES
//
//  Based on https://www.fxhash.xyz/article/all-about-that-grain

//
//  simple grain function
//  shifts all pixels randomly between -strength & +strength
//
//  strength is a value between 0 and 255
//
Toko.prototype.addSimpleGrain = function (strength) {
  loadPixels();
  const d = pixelDensity();
  const pixelsCount = 4 * (width * d) * (height * d);
  for (let i = 0; i < pixelsCount; i += 4) {
    pixels[i] = pixels[i] + random(-strength, strength);
    pixels[i + 1] = pixels[i + 1] + random(-strength, strength);
    pixels[i + 2] = pixels[i + 2] + random(-strength, strength);
  }
  updatePixels();
};

//
//  adds grain differently across channels
//
//  strength and shift are objects with a value for red, green and blue each
//
//  strength = { red: 10, green: 20, blue: 10}
//  shift = { red: -10, green: 0, blue: 0 }
//
//  each value is between 0 and 255
//
Toko.prototype.addChannelGrain = function (strength, shift) {
  loadPixels();
  const d = pixelDensity();
  const pixelsCount = 4 * (width * d) * (height * d);
  for (let i = 0; i < pixelsCount; i += 4) {
    pixels[i] = pixels[i] + random(-strength.red, strength.red) + shift.red;
    pixels[i + 1] =
      pixels[i + 1] + random(-strength.green, strength.green) + shift.green;
    pixels[i + 2] =
      pixels[i + 2] + random(-strength.blue, strength.blue) + shift.blue;
  }
  updatePixels();
};
