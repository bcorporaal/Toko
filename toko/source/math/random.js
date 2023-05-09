import Toko from '../core/main';

//
//  random generators and support
//

//  use Toko.random() for a random number between 0 and 1

//
//  init the random generator for this instance
//
Toko.seedRandom = function(seed) {
  this.rng = Toko.rand(seed);
}
//
//  returns seeded random function
//  see https://github.com/cprosche/mulberry32
//
Toko.rand = function (seed) {
  if (seed == undefined) { seed = Date.now(); }
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

//
//  generate a random number snapped to steps
//
Toko.steppedRandom = function (min = 0, max = 1, step = 0.1) {
  var n = Math.floor((max - min) / step);
  var r = Math.round(this.rng() * n);
  return min + r * step;
}

//
//  Return a random floating-point number
//
//  0 arguments - random number between 0 and 1
//  1 argument & number - random number between 0 and the number (but not including)
//  1 argument & array  - random element from the array
//  2 arguments & number - random number from 1st number to 2nd number (but not including)
//
//  adapted from p5.js code
//
Toko.random = function(min, max) {
  let rand = this.rng();

  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};


