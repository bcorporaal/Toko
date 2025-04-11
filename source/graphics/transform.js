import Toko from '../core/main';

//
//  TRANSFORMATION SHORTCUTS
//

//
//  rotate current transformation matrix around a specific point
//
Toko.prototype.rotateAround = function (x, y, inAngle) {
  translate(x, y);
  rotate(inAngle);
  translate(-x, -y);
};

//
//  scale current transformation matrix around a specific point
//
Toko.prototype.scaleAround = function (x, y, inScale) {
  translate(x, y);
  scale(inScale);
  translate(-x, -y);
};
