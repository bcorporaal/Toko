/**
 * QuadTree implementation for efficient spatial queries
 *
 * Original code by Daniel Shiffman
 * http://codingtra.in
 * http://patreon.com/codingtrain
 * https://github.com/CodingTrain/QuadTree
 *
 * MIT License - Copyright (c) 2021 Coding Train
 *
 * A QuadTree is a tree data structure in which each internal node has exactly four children.
 * It's used to partition a two-dimensional space by recursively subdividing it into four
 * quadrants or regions. This makes it efficient for spatial queries like finding all
 * points within a given range.
 *
 * @example
 * // Create a QuadTree with a boundary
 * const boundary = new QuadTreeRectangle(400, 300, 800, 600);
 * const qt = new QuadTree(boundary, 4);
 *
 * // Insert points
 * qt.insert(new QuadTreePoint(100, 100));
 * qt.insert(new QuadTreePoint(200, 200));
 *
 * // Query points in a range
 * const range = new QuadTreeRectangle(50, 50, 200, 200);
 * const found = qt.query(range);
 *
 * @author Daniel Shiffman (original), Bob Corporaal (adapted)
 */
export class QuadTree {
  /**
   * Create a new QuadTree instance
   * @param {QuadTreeRectangle} boundary - The rectangular boundary for this QuadTree node
   * @param {number} [capacity=8] - Maximum number of points before subdividing
   * @param {number} [_depth=0] - Current depth in the tree (internal use)
   * @throws {TypeError} If boundary is null/undefined or not a QuadTreeRectangle
   * @throws {TypeError} If capacity is not a number
   * @throws {RangeError} If capacity is less than 1
   */
  constructor (boundary, capacity = 8, _depth = 0) {
    if (!boundary) {
      throw TypeError('boundary is null or undefined');
    }
    if (!(boundary instanceof QuadTreeRectangle)) {
      throw TypeError('boundary should be a Rectangle');
    }
    if (typeof capacity !== 'number') {
      throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
    }
    if (capacity < 1) {
      throw RangeError('capacity must be greater than 0');
    }

    this.MAX_DEPTH = 8;

    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;

    this.depth = _depth;
  }

  /**
   * Get all child nodes of this QuadTree
   * @returns {QuadTree[]} Array of child nodes, or empty array if not divided
   */
  get children () {
    if (this.divided) {
      return [this.northeast, this.northwest, this.southeast, this.southwest];
    } else {
      return [];
    }
  }

  /**
   * Clear all points from this QuadTree and remove subdivisions
   * @returns {void}
   */
  clear () {
    this.points = [];

    if (this.divided) {
      this.divided = false;
      delete this.northwest;
      delete this.northeast;
      delete this.southwest;
      delete this.southeast;
    }
  }

  /**
   * Create a new QuadTree with various parameter options
   * @param {QuadTreeRectangle|number} [boundary] - Boundary rectangle or x coordinate
   * @param {number} [y] - Y coordinate (if boundary is x coordinate)
   * @param {number} [width] - Width (if using separate coordinates)
   * @param {number} [height] - Height (if using separate coordinates)
   * @param {number} [capacity] - Maximum capacity before subdividing
   * @returns {QuadTree} New QuadTree instance
   * @throws {TypeError} If no global width/height defined or invalid parameters
   */
  static create () {
    if (arguments.length === 0) {
      if (typeof width === 'undefined') {
        throw new TypeError('No global width defined');
      }
      if (typeof height === 'undefined') {
        throw new TypeError('No global height defined');
      }
      let bounds = new QuadTreeRectangle(width / 2, height / 2, width, height);
      return new QuadTree(bounds, this.DEFAULT_CAPACITY);
    }
    if (arguments[0] instanceof QuadTreeRectangle) {
      let capacity = arguments[1] || this.DEFAULT_CAPACITY;
      return new QuadTree(arguments[0], capacity);
    }
    if (
      typeof arguments[0] === 'number' &&
      typeof arguments[1] === 'number' &&
      typeof arguments[2] === 'number' &&
      typeof arguments[3] === 'number'
    ) {
      let capacity = arguments[4] || this.DEFAULT_CAPACITY;
      return new QuadTree(new QuadTreeRectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
    }
    throw new TypeError('Invalid parameters');
  }

  /**
   * Convert QuadTree to JSON representation
   * @returns {Object} JSON object representing the QuadTree structure
   */
  toJSON () {
    let obj = {};

    if (this.divided) {
      if (this.northeast.divided || this.northeast.points.length > 0) {
        obj.ne = this.northeast.toJSON();
      }
      if (this.northwest.divided || this.northwest.points.length > 0) {
        obj.nw = this.northwest.toJSON();
      }
      if (this.southeast.divided || this.southeast.points.length > 0) {
        obj.se = this.southeast.toJSON();
      }
      if (this.southwest.divided || this.southwest.points.length > 0) {
        obj.sw = this.southwest.toJSON();
      }
    } else {
      obj.points = this.points;
    }

    if (this.depth === 0) {
      obj.capacity = this.capacity;
      obj.x = this.boundary.x;
      obj.y = this.boundary.y;
      obj.w = this.boundary.w;
      obj.h = this.boundary.h;
    }

    return obj;
  }

  /**
   * Create QuadTree from JSON representation
   * @param {Object} obj - JSON object representing the QuadTree
   * @param {number} [x] - X coordinate (if not in obj)
   * @param {number} [y] - Y coordinate (if not in obj)
   * @param {number} [w] - Width (if not in obj)
   * @param {number} [h] - Height (if not in obj)
   * @param {number} [capacity] - Capacity (if not in obj)
   * @param {number} [depth] - Depth (if not in obj)
   * @returns {QuadTree} New QuadTree instance
   * @throws {TypeError} If JSON missing boundary information
   */
  static fromJSON (obj, x, y, w, h, capacity, depth) {
    if (typeof x === 'undefined') {
      if ('x' in obj) {
        x = obj.x;
        y = obj.y;
        w = obj.w;
        h = obj.h;
        capacity = obj.capacity;
        depth = 0;
      } else {
        throw TypeError('JSON missing boundary information');
      }
    }

    let qt = new QuadTree(new QuadTreeRectangle(x, y, w, h), capacity, depth);

    const hasChildren = 'ne' in obj || 'nw' in obj || 'se' in obj || 'sw' in obj;
    if (hasChildren) {
      qt.points = null; // points are set to null on subdivide
      qt.divided = true;
    } else {
      qt.points = Array.isArray(obj.points) ? obj.points : [];
      qt.divided = false;
    }

    if ('ne' in obj || 'nw' in obj || 'se' in obj || 'sw' in obj) {
      const x = qt.boundary.x;
      const y = qt.boundary.y;
      const w = qt.boundary.w / 2;
      const h = qt.boundary.h / 2;

      if ('ne' in obj) {
        qt.northeast = QuadTree.fromJSON(obj.ne, x + w / 2, y - h / 2, w, h, capacity, depth + 1);
      } else {
        qt.northeast = new QuadTree(qt.boundary.subdivide('ne'), capacity, depth + 1);
      }
      if ('nw' in obj) {
        qt.northwest = QuadTree.fromJSON(obj.nw, x - w / 2, y - h / 2, w, h, capacity, depth + 1);
      } else {
        qt.northwest = new QuadTree(qt.boundary.subdivide('nw'), capacity, depth + 1);
      }
      if ('se' in obj) {
        qt.southeast = QuadTree.fromJSON(obj.se, x + w / 2, y + h / 2, w, h, capacity, depth + 1);
      } else {
        qt.southeast = new QuadTree(qt.boundary.subdivide('se'), capacity, depth + 1);
      }
      if ('sw' in obj) {
        qt.southwest = QuadTree.fromJSON(obj.sw, x - w / 2, y + h / 2, w, h, capacity, depth + 1);
      } else {
        qt.southwest = new QuadTree(qt.boundary.subdivide('sw'), capacity, depth + 1);
      }
    }

    return qt;
  }

  /**
   * Subdivide this QuadTree into four child nodes
   * @returns {void}
   * @throws {RangeError} If capacity is not greater than 0
   */
  subdivide () {
    this.northeast = new QuadTree(this.boundary.subdivide('ne'), this.capacity, this.depth + 1);
    this.northwest = new QuadTree(this.boundary.subdivide('nw'), this.capacity, this.depth + 1);
    this.southeast = new QuadTree(this.boundary.subdivide('se'), this.capacity, this.depth + 1);
    this.southwest = new QuadTree(this.boundary.subdivide('sw'), this.capacity, this.depth + 1);

    this.divided = true;

    // Move points to children.
    // This improves performance by placing points
    // in the smallest available rectangle.
    for (const p of this.points) {
      const inserted =
        this.northeast.insert(p) || this.northwest.insert(p) || this.southeast.insert(p) || this.southwest.insert(p);

      if (!inserted) {
        throw RangeError('capacity must be greater than 0');
      }
    }

    this.points = null;
  }

  /**
   * Insert a point into the QuadTree
   * @param {QuadTreePoint} point - The point to insert
   * @returns {boolean} True if the point was successfully inserted
   */
  insert (point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      if (this.points.length < this.capacity || this.depth === this.MAX_DEPTH) {
        this.points.push(point);
        return true;
      }

      this.subdivide();
    }

    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point)
    );
  }

  /**
   * Query points within a given range
   * @param {QuadTreeRectangle|QuadTreeCircle} range - The range to search within
   * @param {QuadTreePoint[]} [found] - Array to store found points (optional)
   * @returns {QuadTreePoint[]} Array of points within the range
   */
  query (range, found) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(this.boundary)) {
      return found;
    }

    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
      return found;
    }

    for (const p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }

    return found;
  }

  /**
   * Delete all points within a given range
   * @param {QuadTreeRectangle|QuadTreeCircle} range - The range to delete points from
   * @returns {void}
   */
  deleteInRange (range) {
    if (this.divided) {
      this.northwest.deleteInRange(range);
      this.northeast.deleteInRange(range);
      this.southwest.deleteInRange(range);
      this.southeast.deleteInRange(range);
    }

    // Delete points within range (points is null when subdivided)
    if (this.points) {
      this.points = this.points.filter(point => !range.contains(point));
    }
  }

  /**
   * Find the closest points to a search point
   * @param {QuadTreePoint} searchPoint - The point to search from
   * @param {number} [maxCount=1] - Maximum number of points to return
   * @param {number} [maxDistance=Infinity] - Maximum distance to search
   * @returns {QuadTreePoint[]} Array of closest points
   * @throws {TypeError} If searchPoint is undefined
   */
  closest (searchPoint, maxCount = 1, maxDistance = Infinity) {
    if (typeof searchPoint === 'undefined') {
      throw TypeError("Method 'closest' needs a point");
    }

    const sqMaxDistance = maxDistance ** 2;
    return this._kNearest(searchPoint, maxCount, sqMaxDistance, 0, 0).found;
  }

  /**
   * Find k nearest points using internal algorithm
   * @param {QuadTreePoint} searchPoint - The point to search from
   * @param {number} maxCount - Maximum number of points to return
   * @param {number} sqMaxDistance - Maximum squared distance to search
   * @param {number} furthestSqDistance - Current furthest squared distance
   * @param {number} foundSoFar - Number of points found so far
   * @returns {Object} Object with found points and furthest distance
   * @private
   */
  _kNearest (searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar) {
    let found = [];

    if (this.divided) {
      this.children
        .sort((a, b) => a.boundary.sqDistanceFrom(searchPoint) - b.boundary.sqDistanceFrom(searchPoint))
        .forEach(child => {
          const sqDistance = child.boundary.sqDistanceFrom(searchPoint);
          if (sqDistance > sqMaxDistance) {
            return;
          } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
            const result = child._kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar);
            const childPoints = result.found;
            found = found.concat(childPoints);
            foundSoFar += childPoints.length;
            furthestSqDistance = result.furthestSqDistance;
          }
        });
    } else {
      this.points
        .sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint))
        .forEach(p => {
          const sqDistance = p.sqDistanceFrom(searchPoint);
          if (sqDistance > sqMaxDistance) {
            return;
          } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
            found.push(p);
            furthestSqDistance = Math.max(sqDistance, furthestSqDistance);
            foundSoFar++;
          }
        });
    }

    return {
      found: found.sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint)).slice(0, maxCount),
      furthestSqDistance: furthestSqDistance,
    };
  }

  /**
   * Execute a function for each point in the QuadTree
   * @param {Function} fn - Function to execute for each point
   * @returns {void}
   */
  forEach (fn) {
    if (this.divided) {
      this.northeast.forEach(fn);
      this.northwest.forEach(fn);
      this.southeast.forEach(fn);
      this.southwest.forEach(fn);
    } else {
      this.points.forEach(fn);
    }
  }

  /**
   * Filter points in the QuadTree based on a predicate function
   * @param {Function} fn - Predicate function to test each point
   * @returns {QuadTree} New QuadTree containing only points that pass the test
   */
  filter (fn) {
    let filtered = new QuadTree(this.boundary, this.capacity);

    this.forEach(point => {
      if (fn(point)) {
        filtered.insert(point);
      }
    });

    return filtered;
  }

  /**
   * Merge this QuadTree with another QuadTree
   * @param {QuadTree} other - The other QuadTree to merge with
   * @param {number} capacity - Capacity for the merged QuadTree
   * @returns {QuadTree} New QuadTree containing all points from both trees
   */
  merge (other, capacity) {
    let left = Math.min(this.boundary.left, other.boundary.left);
    let right = Math.max(this.boundary.right, other.boundary.right);
    let top = Math.min(this.boundary.top, other.boundary.top);
    let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);

    let height = bottom - top;
    let width = right - left;

    let midX = left + width / 2;
    let midY = top + height / 2;

    let boundary = new QuadTreeRectangle(midX, midY, width, height);
    let result = new QuadTree(boundary, capacity);

    this.forEach(point => result.insert(point));
    other.forEach(point => result.insert(point));

    return result;
  }

  /**
   * Get the total number of points in this QuadTree
   * @returns {number} Total number of points
   */
  get length () {
    if (this.divided) {
      return this.northwest.length + this.northeast.length + this.southwest.length + this.southeast.length;
    }

    return this.points.length;
  }
}

//
//------------------------------------------------------------------------------------------------------------------
//

/**
 * Circle class for circular range queries in QuadTree
 * Used to define circular search areas when querying a QuadTree
 *
 * @example
 * // Create a circular query area
 * const circle = new QuadTreeCircle(100, 100, 50);
 *
 * // Query points within the circle
 * const pointsInCircle = quadTree.query(circle);
 *
 * @author Daniel Shiffman (original), Toko Library (adapted)
 * @since 0.0.1
 */
export class QuadTreeCircle {
  /**
   * Create a new QuadTreeCircle
   * @param {number} x - X coordinate of the circle center
   * @param {number} y - Y coordinate of the circle center
   * @param {number} r - Radius of the circle
   * @param {*} [data] - Optional data to store with the circle
   */
  constructor (x, y, r, data) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
    this.data = data;
  }

  /**
   * Check if a point is contained within this circle
   * @param {QuadTreePoint} point - The point to check
   * @returns {boolean} True if the point is within the circle
   */
  contains (point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rSquared;
  }

  /**
   * Check if this circle intersects with a rectangular range
   * @param {QuadTreeRectangle} range - The rectangular range to check
   * @returns {boolean} True if the circle intersects with the range
   */
  intersects (range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;

    let w = range.w / 2;
    let h = range.h / 2;

    let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

    // no intersection
    if (xDist > r + w || yDist > r + h) return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h) return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

/**
 * Point class for QuadTree operations
 * Represents a point in 2D space with optional user data
 *
 * @example
 * // Create a point with data
 * const point = new QuadTreePoint(100, 200, { id: 'point1' });
 *
 * // Calculate distance to another point
 * const distance = point.distanceFrom(otherPoint);
 *
 * @author Daniel Shiffman (original), Toko Library (adapted)
 * @since 0.0.1
 */
export class QuadTreePoint {
  /**
   * Create a new QuadTreePoint
   * @param {number} x - X coordinate of the point
   * @param {number} y - Y coordinate of the point
   * @param {*} [data] - Optional data to store with the point
   */
  constructor (x, y, data) {
    this.x = x;
    this.y = y;
    this.userData = data;
  }

  /**
   * Calculate squared distance to another point (faster than distanceFrom)
   * @param {QuadTreePoint} other - The other point
   * @returns {number} Squared distance between points
   */
  sqDistanceFrom (other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;

    return dx * dx + dy * dy;
  }

  /**
   * Calculate Euclidean distance to another point
   * @param {QuadTreePoint} other - The other point
   * @returns {number} Distance between points
   */
  distanceFrom (other) {
    return Math.sqrt(this.sqDistanceFrom(other));
  }
}

/**
 * Rectangle class for QuadTree operations
 * Represents a rectangular boundary for QuadTree nodes and queries
 *
 * @example
 * // Create a rectangle boundary
 * const rect = new QuadTreeRectangle(400, 300, 800, 600);
 *
 * // Check if a point is contained
 * const contains = rect.contains(point);
 *
 * @author Daniel Shiffman (original), Toko Library (adapted)
 * @since 0.0.1
 */
export class QuadTreeRectangle {
  /**
   * Create a new QuadTreeRectangle
   * @param {number} x - X coordinate of the rectangle center
   * @param {number} y - Y coordinate of the rectangle center
   * @param {number} w - Width of the rectangle
   * @param {number} h - Height of the rectangle
   */
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.left = x - w / 2;
    this.right = x + w / 2;
    this.top = y - h / 2;
    this.bottom = y + h / 2;
  }

  /**
   * Check if a point is contained within this rectangle
   * @param {QuadTreePoint} point - The point to check
   * @returns {boolean} True if the point is within the rectangle
   */
  contains (point) {
    return this.left <= point.x && point.x <= this.right && this.top <= point.y && point.y <= this.bottom;
  }

  /**
   * Check if this rectangle intersects with another range
   * @param {QuadTreeRectangle|QuadTreeCircle} range - The range to check intersection with
   * @returns {boolean} True if the ranges intersect
   */
  intersects (range) {
    return !(this.right < range.left || range.right < this.left || this.bottom < range.top || range.bottom < this.top);
  }

  /**
   * Subdivide this rectangle into a quadrant
   * @param {string} quadrant - Quadrant to create ('ne', 'nw', 'se', 'sw')
   * @returns {QuadTreeRectangle} New rectangle for the specified quadrant
   */
  subdivide (quadrant) {
    switch (quadrant) {
      case 'ne':
        return new QuadTreeRectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
      case 'nw':
        return new QuadTreeRectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
      case 'se':
        return new QuadTreeRectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
      case 'sw':
        return new QuadTreeRectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
    }
  }

  /**
   * Calculate X distance from a point to this rectangle
   * @param {QuadTreePoint} point - The point to measure distance from
   * @returns {number} X distance (0 if point is within rectangle bounds)
   */
  xDistanceFrom (point) {
    if (this.left <= point.x && point.x <= this.right) {
      return 0;
    }

    return Math.min(Math.abs(point.x - this.left), Math.abs(point.x - this.right));
  }

  /**
   * Calculate Y distance from a point to this rectangle
   * @param {QuadTreePoint} point - The point to measure distance from
   * @returns {number} Y distance (0 if point is within rectangle bounds)
   */
  yDistanceFrom (point) {
    if (this.top <= point.y && point.y <= this.bottom) {
      return 0;
    }

    return Math.min(Math.abs(point.y - this.top), Math.abs(point.y - this.bottom));
  }

  /**
   * Calculate squared distance from a point to this rectangle (faster than distanceFrom)
   * @param {QuadTreePoint} point - The point to measure distance from
   * @returns {number} Squared distance to the rectangle
   */
  sqDistanceFrom (point) {
    const dx = this.xDistanceFrom(point);
    const dy = this.yDistanceFrom(point);

    return dx * dx + dy * dy;
  }

  /**
   * Calculate Euclidean distance from a point to this rectangle
   * @param {QuadTreePoint} point - The point to measure distance from
   * @returns {number} Distance to the rectangle
   */
  distanceFrom (point) {
    return Math.sqrt(this.sqDistanceFrom(point));
  }
}
