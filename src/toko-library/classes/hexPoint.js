/**
 * Hexagon Grid System
 * Based on Red Blob Games hexagon grid implementation
 * Provides classes for managing hexagonal grids and individual hexagons with custom data storage
 *
 * @author Based on Red Blob Games (redblobgames.com)
 * @license CC0 - No Rights Reserved
 */

/**
 * Represents a 2D point with x and y coordinates
 */
export class HexPoint {
  /**
   * Create a new HexPoint
   * @param {number} x - The x coordinate
   * @param {number} y - The y coordinate
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add another point to this point
   * @param {HexPoint} other - The point to add
   * @returns {HexPoint} New point with summed coordinates
   */
  add (other) {
    return new HexPoint(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtract another point from this point
   * @param {HexPoint} other - The point to subtract
   * @returns {HexPoint} New point with difference coordinates
   */
  subtract (other) {
    return new HexPoint(this.x - other.x, this.y - other.y);
  }

  /**
   * Scale this point by a factor
   * @param {number} factor - The scaling factor
   * @returns {HexPoint} New scaled point
   */
  scale (factor) {
    return new HexPoint(this.x * factor, this.y * factor);
  }

  /**
   * Calculate distance to another point
   * @param {HexPoint} other - The other point
   * @returns {number} Euclidean distance
   */
  distanceTo (other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if this point equals another point
   * @param {HexPoint} other - The other point
   * @returns {boolean} True if points are equal
   */
  equals (other) {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Convert to string representation
   * @returns {string} String representation of the point
   */
  toString () {
    return `(${this.x}, ${this.y})`;
  }
}
