/**
 * Camera class for mapping world coordinates to canvas coordinates
 * Uses p5.js transformation functions for efficient rendering
 */
export class Camera {
  constructor (canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Default world properties
    this.worldWidth = 1000;
    this.worldHeight = 1000;

    // Default focus area properties
    this.focusX = 0;
    this.focusY = 0;
    this.focusWidth = 200;
    this.focusHeight = 200;

    // Calculated transformation properties
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.updateTransform();
  }

  /**
   * Set the world dimensions
   * @param {number} width - Width of the world in world coordinates
   * @param {number} height - Height of the world in world coordinates
   * @returns {this} Returns this camera for method chaining
   */
  setWorld (width, height) {
    this.worldWidth = width;
    this.worldHeight = height;
    this.updateTransform();
    return this;
  }

  /**
   * Set the focus area (the part of the world to fit in canvas)
   * @param {number} centerX - X coordinate of the focus area center in world coordinates
   * @param {number} centerY - Y coordinate of the focus area center in world coordinates
   * @param {number} width - Width of the focus area in world coordinates
   * @param {number} height - Height of the focus area in world coordinates
   * @returns {this} Returns this camera for method chaining
   */
  setFocus (centerX, centerY, width, height) {
    this.focusX = centerX;
    this.focusY = centerY;
    this.focusWidth = width;
    this.focusHeight = height;
    this.updateTransform();
    return this;
  }

  /**
   * Update canvas dimensions (call when canvas is resized)
   * @param {number} width - New canvas width in pixels
   * @param {number} height - New canvas height in pixels
   * @returns {this} Returns this camera for method chaining
   */
  setCanvas (width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.updateTransform();
    return this;
  }

  /**
   * Calculate the transformation parameters
   * Ensures focus area fits entirely within canvas with proportional scaling
   * @returns {void}
   */
  updateTransform () {
    // Calculate scale to fit focus area in canvas (choose smaller scale to ensure full containment)
    const scaleX = this.canvasWidth / this.focusWidth;
    const scaleY = this.canvasHeight / this.focusHeight;
    this.scale = Math.min(scaleX, scaleY);

    // Calculate the top-left corner of the focus area in world coordinates
    const focusLeft = this.focusX - this.focusWidth / 2;
    const focusTop = this.focusY - this.focusHeight / 2;

    // Calculate offset to center the scaled focus area on canvas
    const scaledFocusWidth = this.focusWidth * this.scale;
    const scaledFocusHeight = this.focusHeight * this.scale;

    this.offsetX = (this.canvasWidth - scaledFocusWidth) / 2 - focusLeft * this.scale;
    this.offsetY = (this.canvasHeight - scaledFocusHeight) / 2 - focusTop * this.scale;
  }

  /**
   * Apply the camera transformation to p5.js
   * Call this before drawing world objects
   */
  apply () {
    push();
    translate(this.offsetX, this.offsetY);
    scale(this.scale);
  }

  /**
   * Remove the camera transformation
   * Call this after drawing world objects
   */
  unapply () {
    pop();
  }

  /**
   * Transform world coordinates to screen coordinates
   * @param {number} worldX - X coordinate in world space
   * @param {number} worldY - Y coordinate in world space
   * @returns {Object} Object with x and y properties in screen coordinates
   */
  worldToScreen (worldX, worldY) {
    return {
      x: worldX * this.scale + this.offsetX,
      y: worldY * this.scale + this.offsetY,
    };
  }

  /**
   * Transform screen coordinates to world coordinates
   * Handles high-DPI displays automatically via p5.js
   * @param {number} screenX - X coordinate in screen space
   * @param {number} screenY - Y coordinate in screen space
   * @returns {Object} Object with x and y properties in world coordinates
   */
  screenToWorld (screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale,
    };
  }

  /**
   * Get the current view bounds in world coordinates
   * @returns {Object} Object with left, top, right, bottom, width, and height properties
   */
  getViewBounds () {
    const topLeft = this.screenToWorld(0, 0);
    const bottomRight = this.screenToWorld(this.canvasWidth, this.canvasHeight);

    return {
      left: topLeft.x,
      top: topLeft.y,
      right: bottomRight.x,
      bottom: bottomRight.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    };
  }

  /**
   * Check if a world coordinate point is visible on screen
   * @param {number} worldX - X coordinate in world space
   * @param {number} worldY - Y coordinate in world space
   * @param {number} [margin=0] - Additional margin around the view bounds
   * @returns {boolean} True if the point is visible within the view bounds
   */
  isVisible (worldX, worldY, margin = 0) {
    const bounds = this.getViewBounds();
    return (
      worldX >= bounds.left - margin &&
      worldX <= bounds.right + margin &&
      worldY >= bounds.top - margin &&
      worldY <= bounds.bottom + margin
    );
  }

  /**
   * Get current scale factor
   * @returns {number} The current scale factor
   */
  getScale () {
    return this.scale;
  }

  /**
   * Get current offset
   * @returns {Object} Object with x and y properties representing the current offset
   */
  getOffset () {
    return { x: this.offsetX, y: this.offsetY };
  }

  /**
   * Setup high-DPI support for the current canvas
   * Call this after creating a Camera if you need high-DPI support
   */
}
