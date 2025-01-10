import Toko from '../core/main';

//
// Toko.GridCell = {
//    x          - x position on the canvas
//    y          - y position on the canvas
//    width      - width of the cell
//    height     - height of the cell
//    column     - x position in columns
//    row        - y position in rows
//    gridWidth  - nr of columns wide
//    gridHeight - nr of rows height
//    gridWidth and gridHeight are only applicable for a packed grid
//  }
//
// Set separately
//    value       - value per cell that can be set and used for visual effects
//    counter     - used to track how often a cell is split
//

/**
  /**
   * @param {number} x - x position on the canvas
   * @param {number} y - y position on the canvas
   * @param {number} width - width of the cell
   * @param {number} height - height of the cell
   * @param {number} [column=0] - x position in columns
   * @param {number} [row=0] - y position in rows
   * @param {number} [gridWidth=0] - number of columns wide
   * @param {number} [gridHeight=0] - number of rows height
 * @param {number} [gridWidth=0] - The number of columns wide.
 * @param {number} [gridHeight=0] - The number of rows height.
 * @property {number} value - The value per cell that can be set and used for visual effects. Default is 0.
 * @property {number} counter - Used to track how often a cell is split. Default is 0.
 * @param {number} x - The x position on the canvas.
 * @param {number} y - The y position on the canvas.
 * @param {number} width - The width of the cell.
 * @param {number} height - The height of the cell.
 * @param {number} [column=0] - The x position in columns.
 * @param {number} [row=0] - The y position in rows.
 * @param {number} [gridWidth=0] - The number of columns wide.
 * @param {number} [gridHeight=0] - The number of rows height.
 * @property {number} value - The value per cell that can be set and used for visual effects.
 * @property {number} counter - Used to track how often a cell is split.
 */
Toko.GridCell = class {
  constructor (x, y, width, height, column = 0, row = 0, gridWidth = 0, gridHeight = 0) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._row = row;
    this._column = column;
    this._gridWidth = gridWidth;
    this._gridHeight = gridHeight;
    this._value = 0;
    this._counter = 0;
  }

  get x () {
    return this._x;
  }
  set x (x) {
    this._x = x;
  }

  get y () {
    return this._y;
  }
  set y (y) {
    this._y = y;
  }

  get width () {
    return this._width;
  }
  set width (width) {
    this._width = width;
  }

  get height () {
    return this._height;
  }
  set height (height) {
    this._height = height;
  }

  get row () {
    return this._row;
  }
  set row (row) {
    this._row = row;
  }

  get column () {
    return this._column;
  }
  set column (column) {
    this._column = column;
  }

  get gridWidth () {
    return this._gridWidth;
  }
  set gridWidth (gridWidth) {
    this._gridWidth = gridWidth;
  }

  get gridHeight () {
    return this._gridHeight;
  }
  set gridHeight (gridHeight) {
    this._gridHeight = gridHeight;
  }

  get value () {
    return this._value;
  }
  set value (value) {
    this._value = value;
  }

  get counter () {
    return this._counter;
  }
  set counter (counter) {
    this._counter = counter;
  }
};
