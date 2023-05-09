import Toko from '../core/main';

//
//  random generators and support
//

//
//  return seeded random function
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
  var r = Math.round(Math.random() * n);
  return min + r * step;
}



