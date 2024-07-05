import Toko from '../core/main';

//
//  STANDARD GRADIENTS
//

//
//  linearGradiant
//
//  xStart  x coordinate of start position
//  yStart  y coordinate of start position
//  xEnd    x coordinate of end position
//  yEnd    y coordinate of end position
//  stops   array of all the color stops each an object with:
//            stop    value between 0 (start) and 1 (end)
//            color   standard css color value
//
Toko.prototype.linearGradient = function (xStart, yStart, xEnd, yEnd, stops) {
  let gradient = drawingContext.createLinearGradient(xStart, yStart, xEnd, yEnd);
  stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;
};

//
//  radialGradiant
//
//  xStart  x coordinate of start position
//  yStart  y coordinate of start position
//  rStart  start radius
//  xEnd    x coordinate of end position
//  yEnd    y coordinate of end position
//  rEnd    end radius
//  stops   array of all the color stops each an object with:
//            stop    value between 0 (start) and 1 (end)
//            color   standard css color value
//
Toko.prototype.radialGradient = function (xStart, yStart, rStart, xEnd, yEnd, rEnd, stops) {
  let gradient = drawingContext.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd, rEnd);
  stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;
};

//
//  conicGradiant
//
//  angle   start angle in radians, clockwise from horizontal right
//  x       x coordinate of the gradient center
//  y       y coordinate of the gradient center
//  stops   array of all the color stops each an object with:
//            stop    value between 0 (start) and 1 (end)
//            color   standard css color value
//
Toko.prototype.conicGradient = function (angle, x, y, stops) {
  let gradient = drawingContext.createConicGradient(angle, x, y);
  stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });
  drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;
};

//
//  SHADOW & GLOW EFFECTS
//

//
//  shadow
//
//  xOffset   the distance that shadows will be offset horizontally - positive is right
//  yOffset   the distance that shadows will be offset vertically - positive is down
//  blur      level of blur of the shadow, 0 is no shadow
//  shadow    color of the shadow as standard css value, including opacity
//
Toko.prototype.shadow = function (xOffset, yOffset, blur, color) {
  drawingContext.shadowOffsetX = xOffset;
  drawingContext.shadowOffsetY = yOffset;
  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = color;
};
