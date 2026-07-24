/**
 * Converts two points into a normalized vector with polar coordinates
 * @param {Object} fromPoint - Starting point {x, y}
 * @param {Object} toPoint - Ending point {x, y}
 * @param {Object} vector - Vector object to populate (modified in place)
 * @param {number} epsilon - Minimum length threshold for valid vectors
 */
function calculateVector (fromPoint, toPoint, vector, epsilon) {
  // Calculate vector components
  vector.x = toPoint.x - fromPoint.x;
  vector.y = toPoint.y - fromPoint.y;

  // Calculate magnitude (length)
  vector.len = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  // Handle zero-length vectors
  if (vector.len < epsilon) {
    vector.nx = vector.ny = vector.ang = 0;
    return;
  }

  // Calculate normalized components (unit vector)
  vector.nx = vector.x / vector.len;
  vector.ny = vector.y / vector.len;

  // Calculate angle in radians
  vector.ang = Math.atan2(vector.ny, vector.nx);
}

/**
 * Calculates the optimal arc parameters for a vertex
 * @param {Object} currentVertex - Current vertex point
 * @param {Object} previousVertex - Previous vertex point
 * @param {Object} nextVertex - Next vertex point
 * @param {number} defaultCornerRadius - Default radius for corners
 * @param {Object} vector1 - Reusable vector object for previous edge
 * @param {Object} vector2 - Reusable vector object for next edge
 * @param {number} epsilon - Minimum length threshold for valid vectors
 * @returns {Object} Arc parameters {centerX, centerY, radius, startAngle, endAngle, numSegments}
 */
function calculateArcParameters (
  currentVertex,
  previousVertex,
  nextVertex,
  defaultCornerRadius,
  vector1,
  vector2,
  epsilon,
) {
  // Calculate vectors from current vertex to previous and next vertices
  calculateVector(currentVertex, previousVertex, vector1, epsilon);
  calculateVector(currentVertex, nextVertex, vector2, epsilon);

  // Calculate the interior angle using cross product for orientation
  // Cross product gives us the sine of the angle between vectors
  const crossProduct = vector1.nx * vector2.ny - vector1.ny * vector2.nx;

  // Dot product helps determine if angle is acute or obtuse
  const dotProduct = vector1.nx * vector2.nx + vector1.ny * vector2.ny;

  // Use arcsin with clamping to prevent numerical errors
  // The max/min ensures we stay within the valid range [-1, 1]
  let interiorAngle = Math.asin(Math.max(-1, Math.min(1, crossProduct)));

  // Determine arc direction based on angle orientation
  let arcDirection = 1; // 1 for counterclockwise, -1 for clockwise

  if (dotProduct < 0) {
    // Obtuse angle case
    if (interiorAngle < 0) {
      interiorAngle = Math.PI + interiorAngle;
    } else {
      interiorAngle = Math.PI - interiorAngle;
      arcDirection = -1;
    }
  } else {
    // Acute angle case
    if (interiorAngle > 0) {
      arcDirection = -1;
    } else {
      interiorAngle = Math.PI * 2 + interiorAngle;
    }
  }

  // Use vertex-specific radius if available, otherwise use default
  const cornerRadius = currentVertex.radius !== undefined ? currentVertex.radius : defaultCornerRadius;

  // Calculate half the interior angle for arc calculations
  const halfAngle = interiorAngle / 2;

  // Handle collinear or near-collinear edges where sin(halfAngle) is zero or near-zero
  // In this case, skip rounding and return a degenerate arc (radius 0, straight line segment)
  if (Math.abs(Math.sin(halfAngle)) < epsilon) {
    return {
      centerX: currentVertex.x,
      centerY: currentVertex.y,
      radius: 0,
      startAngle: 0,
      endAngle: 0,
      angleDiff: 0,
      numSegments: 0,
    };
  }

  // Calculate the distance from vertex to arc center
  // This is derived from trigonometry: distance = radius / tan(halfAngle)
  let distanceToArcCenter = Math.abs((Math.cos(halfAngle) * cornerRadius) / Math.sin(halfAngle));

  // Prevent the arc from extending beyond the available edge length
  // This ensures the rounded corners don't overlap or extend past the polygon edges
  const maxDistance = Math.min(vector1.len / 2, vector2.len / 2);
  let actualRadius = cornerRadius;

  if (distanceToArcCenter > maxDistance) {
    // Adjust the radius to fit within the available space
    distanceToArcCenter = maxDistance;
    actualRadius = Math.abs((distanceToArcCenter * Math.sin(halfAngle)) / Math.cos(halfAngle));
  }

  // Calculate the arc center position
  // Start from the vertex and move along the "next" edge
  let arcCenterX = currentVertex.x + vector2.nx * distanceToArcCenter;
  let arcCenterY = currentVertex.y + vector2.ny * distanceToArcCenter;

  // Offset perpendicular to the edge to position the arc center correctly
  arcCenterX += -vector2.ny * actualRadius * arcDirection;
  arcCenterY += vector2.nx * actualRadius * arcDirection;

  // Calculate arc angles
  let startAngle = vector1.ang + (Math.PI / 2) * arcDirection;
  let endAngle = vector2.ang - (Math.PI / 2) * arcDirection;

  // Ensure we take the shorter arc by checking the angle difference
  let angleDiff = endAngle - startAngle;
  if (angleDiff > Math.PI) {
    angleDiff -= Math.PI * 2;
  } else if (angleDiff < -Math.PI) {
    angleDiff += Math.PI * 2;
  }

  // Calculate adaptive number of arc segments based on radius and angle
  const arcLength = Math.abs(angleDiff) * actualRadius;
  const numArcSegments = Math.max(3, Math.min(50, Math.ceil(arcLength / 5)));

  return {
    centerX: arcCenterX,
    centerY: arcCenterY,
    radius: actualRadius,
    startAngle: startAngle,
    endAngle: endAngle,
    angleDiff: angleDiff,
    numSegments: numArcSegments,
  };
}

/**
 * Draws an arc segment using multiple vertices
 * @param {number} centerX - Arc center X coordinate
 * @param {number} centerY - Arc center Y coordinate
 * @param {number} radius - Arc radius
 * @param {number} startAngle - Starting angle in radians
 * @param {number} angleDiff - Angle difference for the arc
 * @param {number} numSegments - Number of arc segments
 */
function drawArcSegment (centerX, centerY, radius, startAngle, angleDiff, numSegments) {
  for (let j = 0; j <= numSegments; j++) {
    const t = j / numSegments;
    const angle = startAngle + angleDiff * t;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    vertex(x, y);
  }
}

/**
 * Draws a polygon or polyline with rounded corners using p5.js
 *
 * This function creates a path with rounded corners by calculating arc segments
 * at each vertex. The rounding is achieved by finding the angle between adjacent
 * edges, calculating the optimal arc radius and position, and drawing arc segments
 * that smoothly connect the edges.
 *
 * @param {Array<{x: number, y: number, radius?: number}>} points - Array of vertex points with optional per-point radius
 * @param {number} defaultCornerRadius - Default radius for all corners in pixels (can be overridden per point)
 * @param {boolean} [isPathClosed=true] - Whether to close the path (polygon) or leave it open (polyline)
 * @returns {void}
 * @example
 * // Basic closed polygon with uniform rounding
 * const points = [{x: 100, y: 100}, {x: 200, y: 100}, {x: 200, y: 200}, {x: 100, y: 200}];
 * plotRoundedVertices(points, 20);
 *
 * @example
 * // Open polyline with mixed rounding
 * const points = [
 *   {x: 50, y: 50, radius: 10},
 *   {x: 150, y: 50},
 *   {x: 150, y: 150, radius: 30}
 * ];
 * plotRoundedVertices(points, 15, false);
 */
export function plotRoundedVertices (points, defaultCornerRadius, isPathClosed = true) {
  // Early exit for invalid inputs
  if (!points || points.length < 2 || defaultCornerRadius < 0) {
    console.warn('plotRoundedVertices: Invalid parameters');
    return;
  }

  // For open paths, we need at least 2 points; for closed paths, at least 3
  if (isPathClosed && points.length < 3) {
    console.warn('plotRoundedVertices: Closed path requires at least 3 points');
    return;
  }

  const numVertices = points.length;

  // Pre-calculate constants
  const EPSILON = 1e-10;

  // Reusable vector objects to avoid repeated allocations
  const vector1 = { x: 0, y: 0, len: 0, nx: 0, ny: 0, ang: 0 };
  const vector2 = { x: 0, y: 0, len: 0, nx: 0, ny: 0, ang: 0 };

  // For open paths, we process fewer vertices (no rounding at endpoints)
  const startIndex = isPathClosed ? 0 : 1;
  const endIndex = isPathClosed ? numVertices : numVertices - 1;

  // Start with the appropriate initial point
  let previousVertex = isPathClosed ? points[numVertices - 1] : points[0];

  // Start the shape
  if (!isPathClosed) {
    noFill(); // Prevent auto-filling of open polylines
  }
  beginShape();

  // For open paths, add the first point without rounding
  if (!isPathClosed) {
    vertex(points[0].x, points[0].y);
  }

  // Process each vertex that needs rounding
  for (let i = startIndex; i < endIndex; i++) {
    const currentVertex = points[i];
    const nextVertex = points[(i + 1) % numVertices];

    // For open paths, handle the last point differently
    if (!isPathClosed && i === numVertices - 1) {
      vertex(currentVertex.x, currentVertex.y);
      break;
    }

    // Calculate arc parameters for this vertex
    const arcParams = calculateArcParameters(
      currentVertex,
      previousVertex,
      nextVertex,
      defaultCornerRadius,
      vector1,
      vector2,
      EPSILON,
    );

    // Draw the arc segment using the calculated parameters
    drawArcSegment(
      arcParams.centerX,
      arcParams.centerY,
      arcParams.radius,
      arcParams.startAngle,
      arcParams.angleDiff,
      arcParams.numSegments,
    );

    // Move to the next vertex
    previousVertex = currentVertex;
  }

  // For open paths, ensure we end at the last point
  if (!isPathClosed && numVertices > 1) {
    const lastVertex = points[numVertices - 1];
    vertex(lastVertex.x, lastVertex.y);
  }

  // End the shape
  if (isPathClosed) {
    endShape(CLOSE);
  } else {
    endShape();
  }
}
