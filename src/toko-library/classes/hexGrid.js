/**
 * Hexagon Grid System
 * Based on Red Blob Games hexagon grid implementation
 * Provides classes for managing hexagonal grids and individual hexagons with custom data storage
 *
 * @author Based on Red Blob Games (redblobgames.com)
 * @license CC0 - No Rights Reserved
 */

import { HexPoint } from './hexPoint';
import { Hexagon } from './hexagon';

// Static direction and diagonal vectors
Hexagon.DIRECTIONS = [
  new Hexagon(1, 0, -1), // East
  new Hexagon(1, -1, 0), // Northeast
  new Hexagon(0, -1, 1), // Northwest
  new Hexagon(-1, 0, 1), // West
  new Hexagon(-1, 1, 0), // Southwest
  new Hexagon(0, 1, -1), // Southeast
];

Hexagon.DIAGONALS = [
  new Hexagon(2, -1, -1),
  new Hexagon(1, -2, 1),
  new Hexagon(-1, -1, 2),
  new Hexagon(-2, 1, 1),
  new Hexagon(-1, 2, -1),
  new Hexagon(1, 1, -2),
];

/**
 * Orientation class for hexagon layout calculations
 * Used internally by HexGrid for coordinate transformations
 */
export class Orientation {
  /**
   * Create a new Orientation
   * @param {number} f0 - Forward transformation matrix element
   * @param {number} f1 - Forward transformation matrix element
   * @param {number} f2 - Forward transformation matrix element
   * @param {number} f3 - Forward transformation matrix element
   * @param {number} b0 - Backward transformation matrix element
   * @param {number} b1 - Backward transformation matrix element
   * @param {number} b2 - Backward transformation matrix element
   * @param {number} b3 - Backward transformation matrix element
   * @param {number} startAngle - Starting angle for corner calculations
   */
  constructor (f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
    this.f0 = f0;
    this.f1 = f1;
    this.f2 = f2;
    this.f3 = f3;
    this.b0 = b0;
    this.b1 = b1;
    this.b2 = b2;
    this.b3 = b3;
    this.startAngle = startAngle;
  }
}

/**
 * HexGrid class for managing a hexagonal grid layout with hexagon storage
 * Handles coordinate conversions and maintains a collection of hexagons with custom data
 */
export class HexGrid {
  /**
   * Create a new HexGrid
   * @param {string} orientation - 'pointy' or 'flat'
   * @param {HexPoint} size - Size of hexagons (width and height scaling)
   * @param {HexPoint} origin - Origin point of the grid in pixel coordinates
   */
  constructor (orientation = 'pointy', size = new HexPoint(100, 100), origin = new HexPoint(0, 0)) {
    // statics
    HexGrid.ORIENTATION_POINTY = 'pointy';
    HexGrid.ORIENTATION_FLAT = 'flat';

    if (orientation !== HexGrid.ORIENTATION_POINTY && orientation !== HexGrid.ORIENTATION_FLAT) {
      throw new Error('Orientation must be "pointy" or "flat"');
    }

    this.orientation = orientation === HexGrid.ORIENTATION_POINTY ? HexGrid.POINTY : HexGrid.FLAT;
    this.size = size;
    this.origin = origin;

    // Store hexagons using their coordinate hash as key
    this.hexagons = new Map();
  }

  /**
   * Add a hexagon to the grid
   * @param {Hexagon} hexagon - The hexagon to add
   * @returns {this} Returns this grid for method chaining
   */
  addHexagon (hexagon) {
    this.hexagons.set(hexagon.toHash(), hexagon);
    return this;
  }

  /**
   * Create and add a hexagon to the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @param {Object} data - Optional custom data
   * @returns {Hexagon} The created hexagon
   */
  createHexagon (q, r, s = null, data = {}) {
    const hexagon = new Hexagon(q, r, s, data);
    this.addHexagon(hexagon);
    return hexagon;
  }

  /**
   * Get a hexagon from the grid by coordinates
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {Hexagon|null} The hexagon or null if not found
   */
  getHexagon (q, r, s = null) {
    const testHex = new Hexagon(q, r, s);
    return this.hexagons.get(testHex.toHash()) || null;
  }

  /**
   * Get a hexagon from the grid by hash
   * @param {string} hash - The coordinate hash
   * @returns {Hexagon|null} The hexagon or null if not found
   */
  getHexagonByHash (hash) {
    return this.hexagons.get(hash) || null;
  }

  /**
   * Check if a hexagon exists in the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {boolean} True if hexagon exists
   */
  hasHexagon (q, r, s = null) {
    const testHex = new Hexagon(q, r, s);
    return this.hexagons.has(testHex.toHash());
  }

  /**
   * Remove a hexagon from the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {boolean} True if hexagon was removed
   */
  removeHexagon (q, r, s = null) {
    const testHex = new Hexagon(q, r, s);
    return this.hexagons.delete(testHex.toHash());
  }

  /**
   * Clear all hexagons from the grid
   * @returns {this} Returns this grid for method chaining
   */
  clear () {
    this.hexagons.clear();
    return this;
  }

  /**
   * Get the number of hexagons in the grid
   * @returns {number} Number of hexagons
   */
  gridSize () {
    return this.hexagons.size;
  }

  /**
   * Get all hexagons in the grid
   * @returns {Hexagon[]} Array of all hexagons
   */
  getAllHexagons () {
    return Array.from(this.hexagons.values());
  }

  /**
   * Get all hexagon coordinates (without data)
   * @returns {string[]} Array of all coordinate hashes
   */
  getAllCoordinates () {
    return Array.from(this.hexagons.keys());
  }

  /**
   * Iterate over all hexagons in the grid
   * @param {Function} callback - Function to call for each hexagon (hexagon, hash) => {...}
   * @returns {this} Returns this grid for method chaining
   */
  forEach (callback) {
    this.hexagons.forEach(callback);
    return this;
  }

  /**
   * Filter hexagons based on a predicate
   * @param {Function} predicate - Function to test each hexagon (hexagon) => boolean
   * @returns {Hexagon[]} Array of hexagons that pass the test
   */
  filter (predicate) {
    return this.getAllHexagons().filter(predicate);
  }

  /**
   * Find the first hexagon that matches a predicate
   * @param {Function} predicate - Function to test each hexagon (hexagon) => boolean
   * @returns {Hexagon|null} First matching hexagon or null
   */
  find (predicate) {
    for (const hexagon of this.hexagons.values()) {
      if (predicate(hexagon)) {
        return hexagon;
      }
    }
    return null;
  }

  /**
   * Get neighbors of a hexagon that exist in the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {Hexagon[]} Array of neighboring hexagons that exist in the grid
   */
  getNeighbors (q, r, s = null) {
    const neighbors = [];
    const directions = Hexagon.DIRECTIONS;

    // Direct calculation instead of creating hexagon objects
    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      const neighborQ = q + dir.q;
      const neighborR = r + dir.r;
      const neighborS = s !== null ? s + dir.s : -neighborQ - neighborR;

      const neighbor = this.getHexagonByHash(`${neighborQ},${neighborR},${neighborS}`);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  /**
   * Get all neighboring positions that are empty (don't exist in the grid)
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {Hexagon[]} Array of neighboring hexagon coordinates that don't exist in the grid
   */
  getEmptyNeighbors (q, r, s = null) {
    const hex = new Hexagon(q, r, s);
    const emptyNeighbors = [];

    for (const neighborCoord of hex.getAllNeighbors()) {
      const neighbor = this.getHexagonByHash(neighborCoord.toHash());
      if (!neighbor) {
        emptyNeighbors.push(neighborCoord);
      }
    }

    return emptyNeighbors;
  }

  /**
   * Get all hexagons within a range from a center point
   * @param {number} centerQ - Center q coordinate
   * @param {number} centerR - Center r coordinate
   * @param {number} range - Range/radius
   * @param {boolean} includeCenter - Whether to include the center hexagon
   * @returns {Hexagon[]} Array of hexagons within range that exist in the grid
   */
  getHexagonsInRange (centerQ, centerR, range, includeCenter = true) {
    const center = new Hexagon(centerQ, centerR);
    const candidateCoords = center.getHexagonsInRange(range);
    const results = [];

    for (const coord of candidateCoords) {
      if (!includeCenter && coord.equals(center)) continue;

      const hexagon = this.getHexagonByHash(coord.toHash());
      if (hexagon) {
        results.push(hexagon);
      }
    }

    return results;
  }

  /**
   * Get all hexagons at exactly the specified range from a center point
   * @param {number} centerQ - Center q coordinate
   * @param {number} centerR - Center r coordinate
   * @param {number} range - Range/radius
   * @returns {Hexagon[]} Array of hexagons at the ring border that exist in the grid
   */
  getHexagonsAtRange (centerQ, centerR, range) {
    const center = new Hexagon(centerQ, centerR);
    const candidateCoords = center.getHexagonsAtRange(range);
    const results = [];

    for (const coord of candidateCoords) {
      const hexagon = this.getHexagonByHash(coord.toHash());
      if (hexagon) {
        results.push(hexagon);
      }
    }

    return results;
  }

  // =============================================
  // PIXEL COORDINATE METHODS
  // =============================================

  /**
   * Convert hexagon coordinates to pixel coordinates (center of hexagon)
   * @param {Hexagon|number} hex - The hexagon to convert, or q coordinate if using separate parameters
   * @param {number} [r] - The r coordinate (if hex is q coordinate)
   * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
   * @returns {HexPoint} Pixel coordinates of the hexagon center
   */
  hexToPixel (hex, r = null, s = null) {
    // Handle both Hexagon object and separate coordinate parameters
    const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);

    const M = this.orientation;
    const x = (M.f0 * hexagon.q + M.f1 * hexagon.r) * this.size.x;
    const y = (M.f2 * hexagon.q + M.f3 * hexagon.r) * this.size.y;
    return new HexPoint(x + this.origin.x, y + this.origin.y);
  }

  /**
   * Get the pixel coordinates of the center of a hexagon that exists in the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {HexPoint|null} Pixel coordinates of center, or null if hexagon doesn't exist in grid
   */
  getHexagonCenterPixel (q, r, s = null) {
    const hexagon = this.getHexagon(q, r, s);
    if (!hexagon) {
      return null;
    }
    return this.hexToPixel(hexagon);
  }

  /**
   * Get the offset from hex center to a corner
   * @param {number} corner - Corner index (0-5)
   * @returns {HexPoint} Offset to corner from center
   */
  getCornerOffset (corner, scaling = 1) {
    if (corner < 0 || corner > 5) {
      throw new Error('Corner index must be between 0 and 5');
    }
    const M = this.orientation;
    const angle = (2.0 * Math.PI * (M.startAngle - corner)) / 6.0;
    return new HexPoint(scaling * this.size.x * Math.cos(angle), scaling * this.size.y * Math.sin(angle));
  }

  /**
   * Get all corner points of a hexagon in pixel coordinates
   * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
   * @param {number} [r] - The r coordinate (if hex is q coordinate)
   * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
   * @returns {HexPoint[]} Array of 6 corner points in pixel coordinates
   */
  getHexCorners (hex, r = null, s = null, scaling = 1) {
    // Handle both Hexagon object and separate coordinate parameters
    const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);

    const corners = [];
    const center = this.hexToPixel(hexagon);

    for (let i = 0; i < 6; i++) {
      const offset = this.getCornerOffset(i, scaling);
      corners.push(center.add(offset));
    }

    return corners;
  }

  /**
   * Get the corner points of a hexagon that exists in the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {HexPoint[]|null} Array of 6 corner points, or null if hexagon doesn't exist in grid
   */
  getHexagonCornerPixels (q, r, s = null, scaling = 1) {
    const hexagon = this.getHexagon(q, r, s);
    if (!hexagon) {
      return null;
    }
    return this.getHexCorners(hexagon, null, null, scaling);
  }

  /**
   * Get a specific corner point of a hexagon in pixel coordinates
   * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
   * @param {number} corner - Corner index (0-5) or r coordinate if hex is q coordinate
   * @param {number} [r] - The r coordinate (if hex is q coordinate and corner is corner index)
   * @param {number} [s] - The s coordinate (optional, if using separate coordinates)
   * @returns {HexPoint} The specified corner point in pixel coordinates
   */
  getHexCorner (hex, corner, r = null, s = null) {
    let hexagon, cornerIndex;

    // Handle different parameter combinations
    if (hex instanceof Hexagon) {
      hexagon = hex;
      cornerIndex = corner;
    } else if (typeof hex === 'number' && typeof corner === 'number' && r !== null) {
      // hex is q, corner is cornerIndex, r is r coordinate
      hexagon = new Hexagon(hex, r, s);
      cornerIndex = corner;
    } else {
      throw new Error('Invalid parameters: expected (Hexagon, corner) or (q, corner, r, [s])');
    }

    if (cornerIndex < 0 || cornerIndex > 5) {
      throw new Error('Corner index must be between 0 and 5');
    }

    const center = this.hexToPixel(hexagon);
    const offset = this.getCornerOffset(cornerIndex);
    return center.add(offset);
  }

  /**
   * Get all facet midpoint coordinates of a hexagon in pixel coordinates
   * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
   * @param {number} [r] - The r coordinate (if hex is q coordinate)
   * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
   * @returns {HexPoint[]} Array of 6 facet midpoint coordinates in pixel coordinates
   */
  getHexMidpoints (hex, r = null, s = null) {
    // Handle both Hexagon object and separate coordinate parameters
    const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);

    const midpoints = [];
    const center = this.hexToPixel(hexagon);

    for (let i = 0; i < 6; i++) {
      // Get the current corner and the next corner (wrapping around)
      const corner1 = this.getCornerOffset(i);
      const corner2 = this.getCornerOffset((i + 1) % 6);

      // Calculate midpoint between the two corners
      const midpointOffset = new HexPoint((corner1.x + corner2.x) / 2, (corner1.y + corner2.y) / 2);

      midpoints.push(center.add(midpointOffset));
    }

    return midpoints;
  }

  /**
   * Get all pixel coordinates (center + corners) for a hexagon
   * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
   * @param {number} [r] - The r coordinate (if hex is q coordinate)
   * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
   * @returns {Object} Object with 'center' and 'corners' properties containing pixel coordinates
   */
  getHexagonPixelCoordinates (hex, r = null, s = null, scaling = 1) {
    // Handle both Hexagon object and separate coordinate parameters
    const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);
    const center = this.hexToPixel(hexagon);
    const corners = this.getHexCorners(hexagon, null, null, scaling);

    return {
      center: center,
      corners: corners,
    };
  }

  /**
   * Get all pixel coordinates for a hexagon that exists in the grid
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional)
   * @returns {Object|null} Object with 'center' and 'corners' properties, or null if hexagon doesn't exist
   */
  getGridHexagonPixelCoordinates (q, r, s = null, scaling = 1) {
    const hexagon = this.getHexagon(q, r, s);
    if (!hexagon) {
      return null;
    }
    return this.getHexagonPixelCoordinates(hexagon, null, null, scaling);
  }

  /**
   * Get pixel coordinates for multiple hexagons
   * @param {Hexagon[]|Array} hexagons - Array of hexagons or coordinate arrays [[q,r,s], ...]
   * @returns {Array} Array of objects with hexagon coordinates and pixel data
   */
  getMultipleHexagonPixels (hexagons) {
    return hexagons.map(hex => {
      let hexagon;
      if (hex instanceof Hexagon) {
        hexagon = hex;
      } else if (Array.isArray(hex)) {
        hexagon = new Hexagon(hex[0], hex[1], hex[2] || null);
      } else {
        throw new Error('Invalid hexagon format in array');
      }

      return {
        hexagon: hexagon,
        coordinates: { q: hexagon.q, r: hexagon.r, s: hexagon.s },
        pixels: this.getHexagonPixelCoordinates(hexagon),
      };
    });
  }

  /**
   * Get pixel coordinates for all hexagons in the grid
   * @returns {Array} Array of objects with hexagon data and pixel coordinates
   */
  getAllHexagonPixels () {
    const result = [];
    this.forEach(hexagon => {
      result.push({
        hexagon: hexagon,
        coordinates: { q: hexagon.q, r: hexagon.r, s: hexagon.s },
        pixels: this.getHexagonPixelCoordinates(hexagon),
        data: hexagon.data,
      });
    });
    return result;
  }

  /**
   * Create an SVG path string for a hexagon outline
   * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
   * @param {number} [r] - The r coordinate (if hex is q coordinate)
   * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
   * @returns {string} SVG path string for the hexagon
   */

  /**
   * Get bounding box for a hexagon in pixel coordinates
   * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
   * @param {number} [r] - The r coordinate (if hex is q coordinate)
   * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
   * @returns {Object} Bounding box with minX, minY, maxX, maxY, width, height
   */
  getHexagonBounds (hex, r = null, s = null) {
    const corners = this.getHexCorners(hex, r, s);

    let minX = corners[0].x,
      maxX = corners[0].x;
    let minY = corners[0].y,
      maxY = corners[0].y;

    for (let i = 1; i < corners.length; i++) {
      minX = Math.min(minX, corners[i].x);
      maxX = Math.max(maxX, corners[i].x);
      minY = Math.min(minY, corners[i].y);
      maxY = Math.max(maxY, corners[i].y);
    }

    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Get the bounding box for all hexagons in the grid
   * @returns {Object|null} Overall bounding box or null if grid is empty
   */
  getGridBounds () {
    const hexagons = this.getAllHexagons();
    if (hexagons.length === 0) {
      return null;
    }

    let overallMinX = Infinity,
      overallMaxX = -Infinity;
    let overallMinY = Infinity,
      overallMaxY = -Infinity;

    for (const hexagon of hexagons) {
      const bounds = this.getHexagonBounds(hexagon);
      overallMinX = Math.min(overallMinX, bounds.minX);
      overallMaxX = Math.max(overallMaxX, bounds.maxX);
      overallMinY = Math.min(overallMinY, bounds.minY);
      overallMaxY = Math.max(overallMaxY, bounds.maxY);
    }

    return {
      minX: overallMinX,
      minY: overallMinY,
      maxX: overallMaxX,
      maxY: overallMaxY,
      width: overallMaxX - overallMinX,
      height: overallMaxY - overallMinY,
    };
  }

  // =============================================
  // END PIXEL COORDINATE METHODS
  // =============================================

  /**
   * Get all hexagons that intersect with a rectangular area
   * @param {HexPoint} topLeft - Top-left corner of rectangle
   * @param {HexPoint} bottomRight - Bottom-right corner of rectangle
   * @returns {Hexagon[]} Array of hexagons in the area that exist in the grid
   */
  getHexagonsInRectangle (topLeft, bottomRight) {
    const hexagonHashes = new Set();

    // Sample points throughout the rectangle to find all intersecting hexagons
    const stepX = Math.max(1, (bottomRight.x - topLeft.x) / 20);
    const stepY = Math.max(1, (bottomRight.y - topLeft.y) / 20);

    for (let x = topLeft.x; x <= bottomRight.x; x += stepX) {
      for (let y = topLeft.y; y <= bottomRight.y; y += stepY) {
        const hex = this.pixelToHex(new HexPoint(x, y));
        hexagonHashes.add(hex.toHash());
      }
    }

    // Return only hexagons that exist in the grid
    const results = [];
    for (const hash of hexagonHashes) {
      const hexagon = this.getHexagonByHash(hash);
      if (hexagon) {
        results.push(hexagon);
      }
    }

    return results;
  }

  /**
   * Get all hexagons within a circular area
   * @param {HexPoint} center - Center of circle in pixel coordinates
   * @param {number} radius - Radius in pixels
   * @returns {Hexagon[]} Array of hexagons in the circle that exist in the grid
   */
  getHexagonsInCircle (center, radius) {
    const centerHex = this.pixelToHex(center);
    const hexRadius = Math.ceil(radius / Math.min(this.size.x, this.size.y));

    const candidateCoords = centerHex.getHexagonsInRange(hexRadius);
    const results = [];

    for (const coord of candidateCoords) {
      const hexagon = this.getHexagonByHash(coord.toHash());
      if (hexagon) {
        const hexCenter = this.hexToPixel(hexagon);
        if (hexCenter.distanceTo(center) <= radius) {
          results.push(hexagon);
        }
      }
    }

    return results;
  }

  /**
   * Create and add a rectangular grid of hexagons
   * @param {number} width - Width in hexagons
   * @param {number} height - Height in hexagons
   * @param {Hexagon} startHex - Starting hexagon coordinates (default: origin)
   * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
   * @returns {Hexagon[]} Array of created hexagons
   */
  createRectangularGrid (width, height, startHex = new Hexagon(0, 0, 0), dataFactory = null) {
    const hexagons = [];

    for (let r = 0; r < height; r++) {
      const rOffset = Math.floor(r / 2);
      for (let q = -rOffset; q < width - rOffset; q++) {
        const hexQ = startHex.q + q;
        const hexR = startHex.r + r;
        const hexS = startHex.s - q - r;

        const data = dataFactory ? dataFactory(hexQ, hexR, hexS) : {};
        const hexagon = this.createHexagon(hexQ, hexR, hexS, data);
        hexagons.push(hexagon);
      }
    }

    return hexagons;
  }

  /**
   * Create and add a hexagonal grid of hexagons
   * @param {number} radius - Radius of the hexagonal grid
   * @param {Hexagon} centerHex - Center hexagon coordinates (default: origin)
   * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
   * @returns {Hexagon[]} Array of created hexagons
   */
  createHexagonalGrid (radius, centerHex = new Hexagon(0, 0, 0), dataFactory = null) {
    const coordinateList = centerHex.getHexagonsInRange(radius);
    const hexagons = [];

    for (const coord of coordinateList) {
      const data = dataFactory ? dataFactory(coord.q, coord.r, coord.s) : {};
      const hexagon = this.createHexagon(coord.q, coord.r, coord.s, data);
      hexagons.push(hexagon);
    }

    return hexagons;
  }

  /**
   * Create and add hexagons along a line between two points
   * @param {Hexagon} startHex - Starting hexagon coordinates
   * @param {Hexagon} endHex - Ending hexagon coordinates
   * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
   * @returns {Hexagon[]} Array of created hexagons along the line
   */
  createLineOfHexagons (startHex, endHex, dataFactory = null) {
    const coordinateList = startHex.lineTo(endHex);
    const hexagons = [];

    for (const coord of coordinateList) {
      const data = dataFactory ? dataFactory(coord.q, coord.r, coord.s) : {};
      const hexagon = this.createHexagon(coord.q, coord.r, coord.s, data);
      hexagons.push(hexagon);
    }

    return hexagons;
  }

  /**
   * Create a new grid with different orientation
   * @param {string} newOrientation - 'pointy' or 'flat'
   * @returns {HexGrid} New grid with different orientation (hexagons not copied)
   */
  withOrientation (newOrientation) {
    return new HexGrid(newOrientation, this.size, this.origin);
  }

  /**
   * Create a new grid with different size
   * @param {HexPoint} newSize - New size
   * @returns {HexGrid} New grid with different size (hexagons not copied)
   */
  withSize (newSize) {
    const orientationName = this.orientation === HexGrid.POINTY ? 'pointy' : 'flat';
    return new HexGrid(orientationName, newSize, this.origin);
  }

  /**
   * Create a new grid with different origin
   * @param {HexPoint} newOrigin - New origin
   * @returns {HexGrid} New grid with different origin (hexagons not copied)
   */
  withOrigin (newOrigin) {
    const orientationName = this.orientation === HexGrid.POINTY ? 'pointy' : 'flat';
    return new HexGrid(orientationName, this.size, newOrigin);
  }

  /**
   * Clone this grid with all hexagons
   * @returns {HexGrid} New grid with copied hexagons
   */
  clone () {
    const orientationName = this.orientation === HexGrid.POINTY ? 'pointy' : 'flat';
    const newGrid = new HexGrid(orientationName, this.size, this.origin);

    // Copy all hexagons
    this.forEach(hexagon => {
      newGrid.addHexagon(hexagon.clone());
    });

    return newGrid;
  }

  /**
   * Get grid statistics
   * @returns {Object} Object with grid statistics
   */
  getStats () {
    const hexagons = this.getAllHexagons();

    if (hexagons.length === 0) {
      return {
        count: 0,
        bounds: null,
        center: null,
      };
    }

    let minQ = hexagons[0].q,
      maxQ = hexagons[0].q;
    let minR = hexagons[0].r,
      maxR = hexagons[0].r;
    let minS = hexagons[0].s,
      maxS = hexagons[0].s;

    for (const hex of hexagons) {
      minQ = Math.min(minQ, hex.q);
      maxQ = Math.max(maxQ, hex.q);
      minR = Math.min(minR, hex.r);
      maxR = Math.max(maxR, hex.r);
      minS = Math.min(minS, hex.s);
      maxS = Math.max(maxS, hex.s);
    }

    // Calculate center using fractional coordinates first, then round properly
    const centerQ = (minQ + maxQ) / 2;
    const centerR = (minR + maxR) / 2;
    const centerS = (minS + maxS) / 2;

    // Create a fractional hexagon and use the existing round() method
    // which properly maintains the q + r + s = 0 constraint
    const fractionalCenter = new Hexagon(centerQ, centerR, centerS);
    const center = fractionalCenter.round();

    return {
      count: hexagons.length,
      bounds: {
        q: { min: minQ, max: maxQ },
        r: { min: minR, max: maxR },
        s: { min: minS, max: maxS },
      },
      center: center,
    };
  }
  /**
   * Convert pixel coordinates to hexagon coordinates
   * @param {HexPoint} point - Pixel coordinates to convert
   * @returns {Hexagon} The hexagon containing this pixel point
   * OPTIMIZED: Added caching for frequently accessed coordinates
   */
  pixelToHex (point) {
    const M = this.orientation;
    const pt = new HexPoint((point.x - this.origin.x) / this.size.x, (point.y - this.origin.y) / this.size.y);
    const q = M.b0 * pt.x + M.b1 * pt.y;
    const r = M.b2 * pt.x + M.b3 * pt.y;
    const s = -q - r;

    // Create fractional hex and round to nearest integer coordinates
    const fractionalHex = new Hexagon(q, r, s);
    return fractionalHex.round();
  }

  /**
   * Snap pixel coordinates to the center of the containing hexagon
   * @param {HexPoint} point - Pixel coordinates to convert
   * @returns {HexPoint} Pixel coordinates of the hexagon center that contains the input point
   */
  snapToPixelCenter (point) {
    const inputPoint = new HexPoint(point.x, point.y);
    const containingHex = this.pixelToHex(inputPoint);
    return this.hexToPixel(containingHex);
  }

  /**
   * Create and add hexagons within a rectangular pixel area
   * @param {number} x - X coordinate of top-left corner of rectangle
   * @param {number} y - Y coordinate of top-left corner of rectangle
   * @param {number} width - Width of rectangle in pixels
   * @param {number} height - Height of rectangle in pixels
   * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
   * @param {boolean} includePartial - If true, includes hexagons partially in rectangle; if false, only fully contained hexagons
   * @returns {Hexagon[]} Array of created hexagons
   */
  createRectangularGridFromPixels (x, y, width, height, dataFactory = null, includePartial = true) {
    // Input validation
    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('x, y, width, and height must be numbers');
    }

    if (width <= 0 || height <= 0) {
      throw new Error('width and height must be positive');
    }

    if (dataFactory && typeof dataFactory !== 'function') {
      throw new Error('dataFactory must be a function or null');
    }

    const topLeft = new HexPoint(x, y);
    const bottomRight = new HexPoint(x + width, y + height);

    // More efficient approach: determine hex coordinate bounds first
    const cornerHexes = [
      this.pixelToHex(topLeft),
      this.pixelToHex(new HexPoint(x + width, y)), // top-right
      this.pixelToHex(new HexPoint(x, y + height)), // bottom-left
      this.pixelToHex(bottomRight), // bottom-right
    ];

    // Find hex coordinate bounds with padding to ensure we don't miss any
    let minQ = Math.min(...cornerHexes.map(h => h.q)) - 1;
    let maxQ = Math.max(...cornerHexes.map(h => h.q)) + 1;
    let minR = Math.min(...cornerHexes.map(h => h.r)) - 1;
    let maxR = Math.max(...cornerHexes.map(h => h.r)) + 1;

    const hexagons = [];
    const processedHashes = new Set();

    // Iterate through hex coordinate bounds instead of pixel sampling
    for (let q = minQ; q <= maxQ; q++) {
      for (let r = minR; r <= maxR; r++) {
        const s = -q - r; // Maintain hex coordinate constraint
        const candidateHex = new Hexagon(q, r, s);
        const hash = candidateHex.toHash();

        if (processedHashes.has(hash)) continue;
        processedHashes.add(hash);

        let shouldInclude = false;

        if (includePartial) {
          // Include if any part of the hexagon intersects with the rectangle
          shouldInclude = this._hexagonIntersectsRectangle(candidateHex, topLeft, bottomRight);
        } else {
          // Include only if the hexagon is fully contained within the rectangle
          shouldInclude = this._hexagonFullyInRectangle(candidateHex, topLeft, bottomRight);
        }

        if (shouldInclude) {
          // Skip if hexagon already exists in grid (avoid duplicates)
          if (!this.hasHexagon(q, r, s)) {
            const data = dataFactory ? dataFactory(q, r, s) : {};
            const hexagon = this.createHexagon(q, r, s, data);
            hexagons.push(hexagon);
          }
        }
      }
    }

    return hexagons;
  }

  /**
   * Check if a hexagon intersects with a rectangle (any overlap)
   * Uses more precise hexagon corner checking for better accuracy
   * @private
   * @param {Hexagon} hex - The hexagon to check
   * @param {HexPoint} rectTopLeft - Top-left corner of rectangle
   * @param {HexPoint} rectBottomRight - Bottom-right corner of rectangle
   * @returns {boolean} True if hexagon intersects with rectangle
   */
  _hexagonIntersectsRectangle (hex, rectTopLeft, rectBottomRight) {
    // Quick bounding box check first (early rejection)
    const hexBounds = this.getHexagonBounds(hex);
    if (
      hexBounds.maxX < rectTopLeft.x ||
      hexBounds.minX > rectBottomRight.x ||
      hexBounds.maxY < rectTopLeft.y ||
      hexBounds.minY > rectBottomRight.y
    ) {
      return false;
    }

    // If bounding boxes overlap, do more precise check
    // Check if any hex corner is inside rectangle
    const corners = this.getHexCorners(hex);
    for (const corner of corners) {
      if (
        corner.x >= rectTopLeft.x &&
        corner.x <= rectBottomRight.x &&
        corner.y >= rectTopLeft.y &&
        corner.y <= rectBottomRight.y
      ) {
        return true;
      }
    }

    // Check if any rectangle corner is inside hexagon
    const rectCorners = [
      rectTopLeft,
      new HexPoint(rectBottomRight.x, rectTopLeft.y),
      rectBottomRight,
      new HexPoint(rectTopLeft.x, rectBottomRight.y),
    ];

    for (const rectCorner of rectCorners) {
      if (this._pointInHexagon(rectCorner, hex)) {
        return true;
      }
    }

    // Check if rectangle edges cross hexagon edges (covers remaining cases)
    return this._rectangleEdgesCrossHexagon(rectTopLeft, rectBottomRight, corners);
  }

  /**
   * Check if a hexagon is fully contained within a rectangle
   * @private
   * @param {Hexagon} hex - The hexagon to check
   * @param {HexPoint} rectTopLeft - Top-left corner of rectangle
   * @param {HexPoint} rectBottomRight - Bottom-right corner of rectangle
   * @returns {boolean} True if hexagon is fully within rectangle
   */
  _hexagonFullyInRectangle (hex, rectTopLeft, rectBottomRight) {
    // Check if all hexagon corners are within rectangle bounds
    const corners = this.getHexCorners(hex);
    return corners.every(
      corner =>
        corner.x >= rectTopLeft.x &&
        corner.x <= rectBottomRight.x &&
        corner.y >= rectTopLeft.y &&
        corner.y <= rectBottomRight.y,
    );
  }

  /**
   * Check if a point is inside a hexagon using the center and corner positions
   * @private
   * @param {HexPoint} point - Point to test
   * @param {Hexagon} hex - Hexagon to test against
   * @returns {boolean} True if point is inside hexagon
   */
  _pointInHexagon (point, hex) {
    // Convert point to hex coordinates and check if it rounds to the same hex
    const testHex = this.pixelToHex(point);
    return testHex.equals(hex);
  }

  /**
   * Check if rectangle edges cross any hexagon edges
   * Simplified check for edge intersection cases
   * @private
   * @param {HexPoint} rectTopLeft - Rectangle top-left corner
   * @param {HexPoint} rectBottomRight - Rectangle bottom-right corner
   * @param {HexPoint[]} hexCorners - Array of hexagon corner points
   * @returns {boolean} True if edges intersect
   */
  _rectangleEdgesCrossHexagon (rectTopLeft, rectBottomRight, hexCorners) {
    // This is a simplified check - in most practical cases,
    // the corner checks above will catch intersections
    // For a complete implementation, you would need line-line intersection tests

    // Check if rectangle spans across hexagon horizontally or vertically
    const hexBounds = {
      minX: Math.min(...hexCorners.map(c => c.x)),
      maxX: Math.max(...hexCorners.map(c => c.x)),
      minY: Math.min(...hexCorners.map(c => c.y)),
      maxY: Math.max(...hexCorners.map(c => c.y)),
    };

    // Rectangle spans hexagon horizontally and overlaps vertically
    const horizontalSpan =
      rectTopLeft.x <= hexBounds.minX &&
      rectBottomRight.x >= hexBounds.maxX &&
      rectTopLeft.y < hexBounds.maxY &&
      rectBottomRight.y > hexBounds.minY;

    // Rectangle spans hexagon vertically and overlaps horizontally
    const verticalSpan =
      rectTopLeft.y <= hexBounds.minY &&
      rectBottomRight.y >= hexBounds.maxY &&
      rectTopLeft.x < hexBounds.maxX &&
      rectBottomRight.x > hexBounds.minX;

    return horizontalSpan || verticalSpan;
  }
}

// Static orientation configurations
HexGrid.POINTY = new Orientation(
  Math.sqrt(3.0),
  Math.sqrt(3.0) / 2.0,
  0.0,
  3.0 / 2.0,
  Math.sqrt(3.0) / 3.0,
  -1.0 / 3.0,
  0.0,
  2.0 / 3.0,
  0.5,
);

HexGrid.FLAT = new Orientation(
  3.0 / 2.0,
  0.0,
  Math.sqrt(3.0) / 2.0,
  Math.sqrt(3.0),
  2.0 / 3.0,
  0.0,
  -1.0 / 3.0,
  Math.sqrt(3.0) / 3.0,
  0.0,
);

// Constants for offset coordinate types
export const OFFSET_EVEN = 1;
export const OFFSET_ODD = -1;
