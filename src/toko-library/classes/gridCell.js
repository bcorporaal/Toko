/**
 * GridCell class representing a single cell within a grid
 * Contains position, size, and metadata for grid operations
 *
 * @example
 * // Create a basic cell
 * const cell = new GridCell(10, 20, 50, 30);
 *
 * // Set custom values
 * cell.value = 0.5;
 * cell.counter = 3;
 *
 * @author Bob Corporaal
 * @since 0.0.1
 */
export class GridCell {
  /**
   * Create a new GridCell instance
   * @param {number} x - X position on the canvas
   * @param {number} y - Y position on the canvas
   * @param {number} width - Width of the cell
   * @param {number} height - Height of the cell
   * @param {number} [column=0] - Column position in the grid
   * @param {number} [row=0] - Row position in the grid
   * @param {number} [gridWidth=0] - Total number of columns in the grid
   * @param {number} [gridHeight=0] - Total number of rows in the grid
   */
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
}
