/**
 * Hexagon Grid System
 * Based on Red Blob Games hexagon grid implementation
 * Provides classes for managing hexagonal grids and individual hexagons with custom data storage
 *
 * @author Based on Red Blob Games (redblobgames.com)
 * @license CC0 - No Rights Reserved
 */

/**
 * Represents a hexagon using cube coordinates (q, r, s) with support for custom data
 * Cube coordinates have the constraint that q + r + s = 0
 */
export class Hexagon {
  /**
   * Create a new Hexagon
   * @param {number} q - The q coordinate
   * @param {number} r - The r coordinate
   * @param {number} s - The s coordinate (optional, will be calculated if not provided)
   * @param {Object} data - Optional custom data object to store with this hexagon
   */
  constructor(q, r, s = null, data = {}) {
    this.q = q;
    this.r = r;
    this.s = s !== null ? s : -q - r;
    this.data = { ...data }; // Create a copy to avoid reference sharing

    // Validate cube coordinate constraint
    if (Math.round(this.q + this.r + this.s) !== 0) {
      throw new Error(
        'Toko: Hexagon cube coordinates must satisfy q + r + s = 0. This is a fundamental property of cube coordinates.',
      );
    }
  }

  /**
   * Set a custom data property
   * @param {string} key - The property key
   * @param {*} value - The property value
   * @returns {this} Returns this hexagon for method chaining
   */
  setData(key, value) {
    this.data[key] = value;
    return this;
  }

  /**
   * Get a custom data property
   * @param {string} key - The property key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} The property value or default
   */
  getData(key, defaultValue = undefined) {
    return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : defaultValue;
  }

  /**
   * Check if a data property exists
   * @param {string} key - The property key
   * @returns {boolean} True if property exists
   */
  hasData(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  /**
   * Remove a data property
   * @param {string} key - The property key
   * @returns {boolean} True if property was removed
   */
  removeData(key) {
    if (Object.prototype.hasOwnProperty.call(this.data, key)) {
      delete this.data[key];
      return true;
    }
    return false;
  }

  /**
   * Get all data keys
   * @returns {string[]} Array of all data property keys
   */
  getDataKeys() {
    return Object.keys(this.data);
  }

  /**
   * Clear all custom data
   * @returns {this} Returns this hexagon for method chaining
   */
  clearData() {
    this.data = {};
    return this;
  }

  /**
   * Clone this hexagon with optional new coordinates and data
   * @param {number} q - New q coordinate (optional, defaults to current)
   * @param {number} r - New r coordinate (optional, defaults to current)
   * @param {number} s - New s coordinate (optional, defaults to current)
   * @param {Object} data - New data object (optional, defaults to copy of current)
   * @returns {Hexagon} New hexagon with copied or new values
   */
  clone(q = this.q, r = this.r, s = this.s, data = this.data) {
    return new Hexagon(q, r, s, data);
  }

  /**
   * Add another hexagon to this one (coordinates only, data is not combined)
   * @param {Hexagon} other - The hexagon to add
   * @returns {Hexagon} New hexagon with summed coordinates and empty data
   */
  add(other) {
    return new Hexagon(this.q + other.q, this.r + other.r, this.s + other.s);
  }

  /**
   * Subtract another hexagon from this one (coordinates only)
   * @param {Hexagon} other - The hexagon to subtract
   * @returns {Hexagon} New hexagon with difference coordinates and empty data
   */
  subtract(other) {
    return new Hexagon(this.q - other.q, this.r - other.r, this.s - other.s);
  }

  /**
   * Scale this hexagon by a factor (coordinates only)
   * @param {number} k - The scaling factor
   * @returns {Hexagon} New scaled hexagon with empty data
   */
  scale(k) {
    return new Hexagon(this.q * k, this.r * k, this.s * k);
  }

  /**
   * Rotate this hexagon left (counterclockwise) by 60 degrees
   * @returns {Hexagon} New rotated hexagon with empty data
   */
  rotateLeft() {
    return new Hexagon(-this.s, -this.q, -this.r);
  }

  /**
   * Rotate this hexagon right (clockwise) by 60 degrees
   * @returns {Hexagon} New rotated hexagon with empty data
   */
  rotateRight() {
    return new Hexagon(-this.r, -this.s, -this.q);
  }

  /**
   * Get the direction vector for a given direction (0-5)
   * @param {number} direction - Direction index (0-5)
   * @returns {Hexagon} Direction vector
   */
  static direction(direction) {
    if (direction < 0 || direction > 5) {
      throw new Error('Toko: Direction must be between 0 and 5. Hexagons have 6 directions (0-5).');
    }
    return Hexagon.DIRECTIONS[direction];
  }

  /**
   * Get all direction vectors
   * @returns {Hexagon[]} Array of all 6 direction vectors
   */
  static getAllDirections() {
    return [...Hexagon.DIRECTIONS];
  }

  /**
   * Get a neighbor in the specified direction
   * @param {number} direction - Direction index (0-5)
   * @returns {Hexagon} Neighboring hexagon coordinates (no data)
   */
  neighbor(direction) {
    return this.add(Hexagon.direction(direction));
  }

  /**
   * Get all 6 neighbors of this hexagon
   * @returns {Hexagon[]} Array of all neighboring hexagon coordinates (no data)
   */
  getAllNeighbors() {
    return Hexagon.DIRECTIONS.map((dir) => this.add(dir));
  }

  /**
   * Get a diagonal neighbor in the specified direction
   * @param {number} direction - Direction index (0-5)
   * @returns {Hexagon} Diagonal neighboring hexagon coordinates (no data)
   */
  diagonalNeighbor(direction) {
    if (direction < 0 || direction > 5) {
      throw new Error('Toko: Direction must be between 0 and 5. Hexagons have 6 directions (0-5).');
    }
    return this.add(Hexagon.DIAGONALS[direction]);
  }

  /**
   * Get all 6 diagonal neighbors
   * @returns {Hexagon[]} Array of all diagonal neighbor coordinates (no data)
   */
  getAllDiagonalNeighbors() {
    return Hexagon.DIAGONALS.map((diag) => this.add(diag));
  }

  /**
   * Calculate the Manhattan distance from origin (0,0,0)
   * @returns {number} Distance from origin
   */
  length() {
    return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
  }

  /**
   * Calculate distance to another hexagon
   * @param {Hexagon} other - The other hexagon
   * @returns {number} Distance between hexagons
   */
  distanceTo(other) {
    return this.subtract(other).length();
  }

  /**
   * Round fractional cube coordinates to nearest integer coordinates
   * @returns {Hexagon} Hexagon with rounded coordinates and empty data
   */
  round() {
    let qi = Math.round(this.q);
    let ri = Math.round(this.r);
    let si = Math.round(this.s);

    const qDiff = Math.abs(qi - this.q);
    const rDiff = Math.abs(ri - this.r);
    const sDiff = Math.abs(si - this.s);

    if (qDiff > rDiff && qDiff > sDiff) {
      qi = -ri - si;
    } else if (rDiff > sDiff) {
      ri = -qi - si;
    } else {
      si = -qi - ri;
    }

    return new Hexagon(qi, ri, si);
  }

  /**
   * Linear interpolation between this hexagon and another
   * @param {Hexagon} target - Target hexagon
   * @param {number} t - Interpolation parameter (0-1)
   * @returns {Hexagon} Interpolated hexagon with empty data
   */
  lerp(target, t) {
    return new Hexagon(
      this.q * (1 - t) + target.q * t,
      this.r * (1 - t) + target.r * t,
      this.s * (1 - t) + target.s * t,
    );
  }

  /**
   * Get all hexagons on the line between this hexagon and another
   * @param {Hexagon} target - Target hexagon
   * @returns {Hexagon[]} Array of hexagon coordinates forming a line (no data)
   */
  lineTo(target) {
    const distance = this.distanceTo(target);
    const nudgeA = new Hexagon(this.q + 1e-6, this.r + 1e-6, this.s - 2e-6);
    const nudgeB = new Hexagon(target.q + 1e-6, target.r + 1e-6, target.s - 2e-6);

    const results = [];
    const step = 1.0 / Math.max(distance, 1);

    for (let i = 0; i <= distance; i++) {
      results.push(nudgeA.lerp(nudgeB, step * i).round());
    }

    return results;
  }

  /**
   * Get all hexagons within a certain range (ring)
   * @param {number} range - The range/radius
   * @returns {Hexagon[]} Array of hexagon coordinates within range (no data)
   */
  getHexagonsInRange(range) {
    const results = [];
    for (let q = -range; q <= range; q++) {
      const r1 = Math.max(-range, -q - range);
      const r2 = Math.min(range, -q + range);
      for (let r = r1; r <= r2; r++) {
        results.push(new Hexagon(this.q + q, this.r + r, this.s - q - r));
      }
    }
    return results;
  }

  /**
   * Get all hexagons at exactly the specified range (ring border)
   * @param {number} range - The range/radius
   * @returns {Hexagon[]} Array of hexagon coordinates at the ring border (no data)
   */
  getHexagonsAtRange(range) {
    if (range === 0) return [new Hexagon(this.q, this.r, this.s)];

    const results = [];
    let hex = this.add(Hexagon.direction(4).scale(range));

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < range; j++) {
        results.push(hex);
        hex = hex.neighbor(i);
      }
    }

    return results;
  }

  /**
   * Check if this hexagon equals another hexagon (coordinates only)
   * @param {Hexagon} other - The other hexagon
   * @returns {boolean} True if coordinates are equal
   */
  equals(other) {
    return this.q === other.q && this.r === other.r && this.s === other.s;
  }

  /**
   * Create a hexagon from offset coordinates
   * @param {number} col - Column coordinate
   * @param {number} row - Row coordinate
   * @param {number} offset - Offset type (1 for even, -1 for odd)
   * @param {string} type - 'q' for q-offset, 'r' for r-offset
   * @param {Object} data - Optional custom data
   * @returns {Hexagon} New hexagon
   */
  static fromOffset(col, row, offset, type = 'q', data = {}) {
    if (type === 'q') {
      const parity = col & 1;
      const q = col;
      const r = row - (col + offset * parity) / 2;
      return new Hexagon(q, r, -q - r, data);
    } else if (type === 'r') {
      const parity = row & 1;
      const q = col - (row + offset * parity) / 2;
      const r = row;
      return new Hexagon(q, r, -q - r, data);
    } else {
      throw new Error('Toko: Offset type must be "q" or "r".');
    }
  }

  /**
   * Convert to offset coordinates
   * @param {number} offset - Offset type (1 for even, -1 for odd)
   * @param {string} type - 'q' for q-offset, 'r' for r-offset
   * @returns {Object} Object with col and row properties
   */
  toOffset(offset, type = 'q') {
    if (type === 'q') {
      const parity = this.q & 1;
      return {
        col: this.q,
        row: this.r + (this.q + offset * parity) / 2,
      };
    } else if (type === 'r') {
      const parity = this.r & 1;
      return {
        col: this.q + (this.r + offset * parity) / 2,
        row: this.r,
      };
    } else {
      throw new Error('Toko: Offset type must be "q" or "r".');
    }
  }

  /**
   * Convert to string representation
   * @returns {string} String representation of the hexagon
   */
  toString() {
    return `Hex(${this.q}, ${this.r}, ${this.s})`;
  }

  /**
   * Convert to hash string for use as Map/Set key
   * @returns {string} Hash string
   */
  toHash() {
    return `${this.q},${this.r},${this.s}`;
  }

  /**
   * Create hexagon from hash string
   * @param {string} hash - Hash string created by toHash()
   * @param {Object} data - Optional custom data
   * @returns {Hexagon} New hexagon
   */
  static fromHash(hash, data = {}) {
    const [q, r, s] = hash.split(',').map(Number);
    return new Hexagon(q, r, s, data);
  }
}
