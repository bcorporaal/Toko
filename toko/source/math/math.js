import Toko from '../core/main';

//
//  general math functions
//

//
//  wrap a number around if it goes above the maximum or below the minimum
//
Toko.wrap = function (value, min = 0, max = 100) {
  let vw = value;

  if (value < min) {
    vw = max + (value - min)
  } else if (value > max) {
    vw = min + (value - max)
  }

  return vw
}

//
//  return number of integer digits
//  see https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
//
Toko.numDigits = function(x) {
  return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}

