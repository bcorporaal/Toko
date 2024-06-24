import Toko from '../core/main';

//
//  draw a regular polygon shape
//
//  x,y     x,y position of the shape center
//  size    shape size
//  sides   number of sides of the shape
//  spin    rotation around center
//
Toko.prototype.plotPolygon = function (x, y, size = 100, sides = 6, spin = 0, shapeMode = CLOSE) {
  let vertices = this.polygonVertices(x, y, size, sides, spin);
  this.plotVertices(vertices, shapeMode);
};

//
//  get an array of polygon vertices (as p5 vectors)
//
//  x,y     x,y position of the shape center
//  size    shape size
//  sides   number of sides of the shape
//  spin    rotation around center
//

Toko.prototype.polygonVertices = function (x, y, size = 100, sides = 6, spin = 0) {
  let vertices = [];
  let sideAngle = TWO_PI / sides;
  //
  //  some adjustments to the base spin to get a more pleasing default rotation
  //  anything above 12 sides might still need some tweaks
  //
  if (sides == 3) {
    spin += PI / 6;
  } else if (sides == 5) {
    spin += 1.5 * PI;
  } else if (sides == 4) {
    spin += PI / 4;
  } else if (sides == 7) {
    spin += PI / 14;
  } else if (sides == 8) {
    spin += PI / 8;
  } else if (sides == 9) {
    spin -= PI / 18;
  } else if (sides == 11) {
    spin += PI / 22;
  } else if (sides == 12) {
    spin += PI / 12;
  }

  for (let i = 1; i < sides + 1; i++) {
    let xs = x + cos(sideAngle * i + spin) * size;
    let ys = y + sin(sideAngle * i + spin) * size;
    vertices.push(createVector(xs, ys));
  }
  return vertices;
};

//
//  plot an array of vertices
//
//  vertices    an array of p5 vectors, each a single vertex
//  shapeMode   p5 shape mode that defines how the shape is closed
//
Toko.prototype.plotVertices = function (vertices, shapeMode = CLOSE) {
  beginShape();
  vertices.forEach(v => {
    vertex(v.x, v.y);
  });
  endShape(shapeMode);
};
