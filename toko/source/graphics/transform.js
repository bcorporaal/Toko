import Toko from '../core/main';

//
//  rotate current transformation matrix around a specific point
//
Toko.prototype.rotateAround = function (x, y, angle) {
  translate(x, y);
  rotate(angle);
  translate(-x, -y);
};

//
//  rotate current transformation matrix around a specific point
//
Toko.prototype.scaleAround = function (x, y, scale) {
  translate(x, y);
  scale(scale);
  translate(-x, -y);
};
