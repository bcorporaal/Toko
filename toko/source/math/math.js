import Toko from '../core/main';

//
//  general math functions
//

//
//  wrap a number around if it goes above the maximum or below the minimum
//
Toko.wrap = function (value, min = 0, max = 100) {
  var vw = value;

  if (value < min) {
    vw = max + (value - min)
  } else if (value > max) {
    vw = min + (value - max)
  }

  return vw
}

