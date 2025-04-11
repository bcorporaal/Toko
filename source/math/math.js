import Toko from '../core/main';

//
//  GENERAL MATH FUNCTIONS
//

//
//  wrap a number around if it goes above the maximum or below the minimum
//
Toko.wrap = function (value, min = 0, max = 100) {
  let vw = value;

  if (value < min) {
    vw = max + (value - min);
  } else if (value > max) {
    vw = min + (value - max);
  }

  return vw;
};

//
//  return number of integer digits
//  see https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
//
Toko.numDigits = function (x) {
  return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
};

//
//  map value from the range iStart to iStop, to oStart, oStop
//  if clamp is set to true, the output is clamped to the bounds
//
//  inputs are not validated, hopefully making it a little faster than p5.js
//
Toko.map = function (value, iStart, iStop, oStart, oStop, clamp = false) {
  let val = oStart + (oStop - oStart) * (((value - iStart) * 1.0) / (iStop - iStart));
  if (!clamp) {
    return val;
  }
  if (oStart < oStop) {
    return Math.min(Math.max(val, oStart), oStop);
  } else {
    return Math.min(Math.max(val, oStop), oStart);
  }
};
