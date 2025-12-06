/**
 * Draw a regular polygon shape
 * @param {number} x - X position of the shape center in pixels
 * @param {number} y - Y position of the shape center in pixels
 * @param {number} [size=100] - Size of the polygon in pixels
 * @param {number} [sides=6] - Number of sides (3+ for valid polygon)
 * @param {number} [spin=0] - Rotation around center in radians
 * @param {number} [shapeMode=CLOSE] - p5.js shape mode (CLOSE, OPEN, etc.)
 * @example
 * // Draw a hexagon
 * toko.plotPolygon(width/2, height/2, 100, 6);
 *
 * // Draw a rotated triangle
 * toko.plotPolygon(200, 200, 80, 3, PI/4);
 */
export function plotPolygon (x, y, size = 100, sides = 6, spin = 0, shapeMode = CLOSE) {
  let vertices = this.polygonVertices(x, y, size, sides, spin);
  this.plotVertices(vertices, shapeMode);
}

/**
 * Get an array of polygon vertices as p5.Vector objects
 * @param {number} x - X position of the shape center in pixels
 * @param {number} y - Y position of the shape center in pixels
 * @param {number} [size=100] - Size of the polygon in pixels
 * @param {number} [sides=6] - Number of sides (3+ for valid polygon)
 * @param {number} [spin=0] - Rotation around center in radians
 * @returns {p5.Vector[]} Array of p5.Vector objects representing polygon vertices
 * @example
 * // Get hexagon vertices
 * const vertices = toko.polygonVertices(width/2, height/2, 100, 6);
 * vertices.forEach(v => circle(v.x, v.y, 5));
 *
 * // Use vertices for custom drawing
 * const triangle = toko.polygonVertices(200, 200, 80, 3, PI/4);
 * beginShape();
 * triangle.forEach(v => vertex(v.x, v.y));
 * endShape(CLOSE);
 */
export function polygonVertices (x, y, size = 100, sides = 6, spin = 0) {
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
}

/**
 * Plot an array of vertices as a shape
 * @param {p5.Vector[]} vertices - Array of p5.Vector objects representing shape vertices
 * @param {number} [shapeMode=CLOSE] - p5.js shape mode (CLOSE, OPEN, etc.)
 * @example
 * // Plot custom vertices
 * const vertices = [
 *   createVector(100, 100),
 *   createVector(200, 100),
 *   createVector(150, 200)
 * ];
 * toko.plotVertices(vertices);
 *
 * // Plot as open shape
 * toko.plotVertices(vertices, OPEN);
 */
export function plotVertices (vertices, shapeMode = CLOSE) {
  beginShape();
  vertices.forEach(v => {
    vertex(v.x, v.y);
  });
  endShape(shapeMode);
}
