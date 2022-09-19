import Toko from './main';

Toko.prototype.steppedRandom = function (min = 0, max = 1, step = 0.1) {
  var n = Math.floor((max - min) / step);
  var r = Math.round(Math.random() * n);
  return min + r * step;
}

Toko.prototype.wrap = function (value, min = 0, max = 100) {
  var vw = value;

  if (value < min) {
    vw = max + (value - min)
  } else if (value > max) {
    vw = min + (value - max)
  }

  return vw
}