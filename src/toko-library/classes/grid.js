import { libraryState } from '../core/state';

/**
 * Grid class for creating and manipulating rectangular grids with recursive cell splitting
 * and cell packing capabilities. Supports various splitting strategies and maintains
 * cell relationships for complex grid layouts.
 *
 * @example
 * // Create a basic grid
 * const grid = new Grid(0, 0, 400, 300);
 *
 * // Split recursively
 * grid.splitRecursive(3, Grid.SPLIT_LONGEST);
 *
 * // Get all cells
 * const cells = grid.cells;
 */
export class Grid {
  // Static split strategy constants
  static SPLIT_HORIZONTAL = 'split_horizontal';
  static SPLIT_VERTICAL = 'split_vertical';
  static SPLIT_LONGEST = 'split_longest';
  static SPLIT_MIX = 'split_mix';
  static SPLIT_SQUARE = 'split_square';

  /**
   * Create a new Grid instance
   * @param {number} x - X position on the canvas
   * @param {number} y - Y position on the canvas
   * @param {number} width - Width of the complete grid
   * @param {number} height - Height of the complete grid
   * @param {RNG} [rng=libraryState.RNG] - Random number generator instance
   */
  constructor (x, y, width, height, rng) {
    if (rng === undefined) {
      if (!libraryState.RNG) {
        throw new Error('Toko: Grid requires an RNG instance. Either pass one or ensure toko.init() has been called.');
      }
      rng = libraryState.RNG;
    }
    this._position = createVector(x, y);
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._cells = [new Toko.GridCell(this._x, this._y, this._width, this._height, 0, 0, this._width, this._height)];
    this._points = [];
    this._pointsAreUpdated = false;
    this._openSpaces = [];
    this._rng = rng;
  }

  /**
   * Set the base grid structure with specified rows and columns
   * Resets all existing cells and creates a uniform grid
   * @param {number} [columns=1] - Number of columns in the grid
   * @param {number} [rows=1] - Number of rows in the grid
   * @returns {this} Returns this grid for method chaining
   */
  setBaseGrid (columns = 1, rows = 1) {
    let cellWidth = this._width / columns;
    let cellHeight = this._height / rows;

    this._cells = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        let newCell = new Toko.GridCell(
          this._x + c * cellWidth,
          this._y + r * cellHeight,
          cellWidth,
          cellHeight,
          c,
          r,
          cellWidth,
          cellHeight,
        );
        this._cells.push(newCell);
      }
    }
  }

  /**
   * Collect the coordinates of all unique corner points in the grid
   * Updates the internal points array and marks it as current
   * @returns {p5.Vector[]} Array of unique corner points as p5.Vector objects
   */
  gatherPoints () {
    this._pointsAreUpdated = true;
    this._points = [];
    const pointMap = new Map();

    this._cells.forEach(c => {
      const corners = [
        [c.x, c.y],
        [c.x + c.width, c.y],
        [c.x, c.y + c.height],
        [c.x + c.width, c.y + c.height],
      ];

      corners.forEach(([x, y]) => {
        const key = `${x},${y}`;
        if (!pointMap.has(key)) {
          pointMap.set(key, createVector(x, y));
        }
      });
    });

    this._points = Array.from(pointMap.values());
    return this._points;
  }

  /**
   * Construct a grid by packing cells of different shapes
   * Partly inspired by https://www.gorillasun.de/blog/an-algorithm-for-irregular-grids/
   * @param {number} columns - Number of columns to be packed
   * @param {number} rows - Number of rows to be packed
   * @param {Object[]} cellShapes - Array of objects defining width and height of cell shapes
   * @param {boolean} [fillEmptySpaces=true] - Whether leftover spaces should be filled with 1x1 cells
   * @param {boolean} [snapToPixel=true] - If true, all sizes and positions are rounded to pixels
   * @returns {this} Returns this grid for method chaining
   */
  packGrid (columns, rows, cellShapes, fillEmptySpaces = true, snapToPixel = true) {
    this._pointsAreValid = false;
    this._cells = [];
    let cw, rh;
    if (snapToPixel) {
      cw = Math.round(this._width / columns);
      rh = Math.round(this._height / rows);
    } else {
      cw = this._width / columns;
      rh = this._height / rows;
    }

    this._resetOpenSpaces(columns, rows);

    let spaceCheckInterval = 10;
    let keepGoing = true;
    let shape, w, h, c, r, newCell, keepTryingThisShape;
    let k = 0;
    let fails = 0;
    let maxFails = 1000;
    let triesPerShape = 2500;
    let tryCounter = 0;

    while (keepGoing) {
      // pick random shape
      shape = this._rng.random(cellShapes);
      w = shape[0];
      h = shape[1];

      keepTryingThisShape = true;

      // Skip shapes that are wider or taller than the grid
      if (w > columns || h > rows) {
        fails++;
        keepTryingThisShape = false;
      }

      while (keepTryingThisShape) {
        // pick random location
        c = this._rng.intRange(0, columns - w + 1);
        r = this._rng.intRange(0, rows - h + 1);

        // check if space is available
        if (this._spaceAvailable(c, r, w, h)) {
          newCell = new Toko.GridCell(this._x + c * cw, this._y + r * rh, w * cw, h * rh, c, r, w, h);
          newCell.counter = tryCounter;
          this._cells.push(newCell);
          // claim the space
          this._fillSpace(c, r, w, h);
          // reset
          keepTryingThisShape = false;
          tryCounter = 0;
        } else {
          tryCounter++;
          if (tryCounter > triesPerShape) {
            fails++;
            keepTryingThisShape = false;
          }
        }
      }
      //
      // every once in a while check if there is any space left
      //
      k++;
      if (k % spaceCheckInterval == 0) {
        keepGoing = this._anySpaceLeft();
      }
      //
      //  stop after a max number of fails
      //
      if (fails > maxFails) {
        keepGoing = false;
      }
    }
    //
    //  fill left over spaces
    //
    if (fillEmptySpaces) {
      this._fillEmptySpaces(columns, rows, cellShapes, snapToPixel);
    }
  }

  /**
   * Fill the remaining empty spaces systematically
   * @param {number} columns - Number of columns in the grid
   * @param {number} rows - Number of rows in the grid
   * @param {Array[]} cellShapes - Array of cell shape arrays [width, height]
   * @param {boolean} snapToPixel - Whether to snap to pixel boundaries
   * @private
   */
  _fillEmptySpaces (columns, rows, cellShapes, snapToPixel) {
    // Clone to avoid mutating the caller's array
    cellShapes = [...cellShapes];
    cellShapes.push([1, 1]); // add a 1x1 so we can always fill
    let cw, rh;
    if (snapToPixel) {
      cw = Math.round(this._width / columns);
      rh = Math.round(this._height / rows);
    } else {
      cw = this._width / columns;
      rh = this._height / rows;
    }
    let s, tryingShapes, w, h, newCell;
    //
    //  go through the entire grid and try every shape in every open spot
    //
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        tryingShapes = true;
        s = 0;
        while (tryingShapes) {
          w = cellShapes[s][0];
          h = cellShapes[s][1];
          if (this._spaceAvailable(i, j, w, h)) {
            newCell = new Toko.GridCell(this._x + i * cw, this._y + j * rh, w * cw, h * rh, i, j, cw, rh);
            newCell.counter = s;
            this._cells.push(newCell);
            this._fillSpace(i, j, w, h);
            tryingShapes = false;
          }
          s++;
          if (s >= cellShapes.length) {
            tryingShapes = false;
          }
        }
      }
    }
  }

  /**
   * Check if space is available for this shape
   * @param {number} column - Column position to check
   * @param {number} row - Row position to check
   * @param {number} width - Width of the shape
   * @param {number} height - Height of the shape
   * @returns {boolean} True if space is available
   * @private
   */
  _spaceAvailable (column, row, width, height) {
    if (column + width > this._openSpaces.length) {
      return false;
    }
    if (row + height > this._openSpaces[0].length) {
      return false;
    }
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (!this._openSpaces[column + i][row + j]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Mark a specific area in the grid as no longer open
   * @param {number} column - Column position to mark
   * @param {number} row - Row position to mark
   * @param {number} width - Width of the area to mark
   * @param {number} height - Height of the area to mark
   * @private
   */
  _fillSpace (column, row, width, height) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        this._openSpaces[column + i][row + j] = false;
      }
    }
  }

  /**
   * Reset all the space back to open
   * @param {number} columns - Number of columns in the grid
   * @param {number} rows - Number of rows in the grid
   * @private
   */
  _resetOpenSpaces (columns, rows) {
    this._openSpaces = [];
    for (let i = 0; i < columns; i++) {
      this._openSpaces[i] = Array(rows);
      this._openSpaces[i].fill(true);
    }
  }

  /**
   * Check if there is any space left at all
   * @returns {boolean} True if there is any open space remaining
   * @private
   */
  _anySpaceLeft () {
    let columns = this._openSpaces.length;
    let rows = this._openSpaces[0].length;
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if (this._openSpaces[i][j]) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Split the cells recursively
   * @param {number} [nrLoops=1] - Number of times all cells are evaluated
   * @param {number} [chance=0.5] - The chance a cell is split when evaluated (0-1)
   * @param {number} [minSize=10] - Only splits resulting in new cells larger than this size are considered
   * @param {string} [splitStyle=Grid.SPLIT_MIX] - Defines how the cells should split:
   *   - SPLIT_HORIZONTAL: split a cell horizontally into 2 new cells
   *   - SPLIT_VERTICAL: split a cell vertically into 2 new cells
   *   - SPLIT_LONGEST: split the longest dimension
   *   - SPLIT_MIX: split along both axis randomly
   *   - SPLIT_SQUARE: split cells into 4 new cells
   * @returns {this} Returns this grid for method chaining
   */
  splitRecursive (nrLoops = 1, chance = 0.5, minSize = 10, splitStyle = Grid.SPLIT_MIX) {
    if (splitStyle == Grid.SPLIT_SQUARE) {
      // reduce the chance because the square split creates 4 cells instead of 2
      chance *= 0.5;
    }

    for (let i = 0; i < nrLoops; i++) {
      let newCells = [];
      for (let n = 0; n < this._cells.length; n++) {
        if (this._rng.random() < chance) {
          let c = this._splitCell(this._cells[n], minSize, splitStyle);
          newCells = newCells.concat(c);
        } else {
          newCells.push(this._cells[n]);
        }
      }
      this._cells = [...newCells];
    }
  }

  /**
   * Split a single cell according to the specified style
   * @param {GridCell} cell - The cell to split
   * @param {number} [minSize=10] - Minimum size for resulting cells
   * @param {string} [splitStyle=Grid.SPLIT_MIX] - How to split the cell
   * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
   * @private
   */
  _splitCell (cell, minSize = 10, splitStyle = Grid.SPLIT_MIX) {
    let newCells = [];
    switch (splitStyle) {
      case Grid.SPLIT_SQUARE:
        newCells = this._splitCellSquare(cell, minSize);
        break;
      case Grid.SPLIT_HORIZONTAL:
        newCells = this._splitCellHorizontal(cell, minSize);
        break;
      case Grid.SPLIT_VERTICAL:
        newCells = this._splitCellVertical(cell, minSize);
        break;
      case Grid.SPLIT_LONGEST:
        newCells = this._splitCellLongest(cell, minSize);
        break;
      case Grid.SPLIT_MIX:
        newCells = this._splitCellMix(cell, minSize);
        break;
      default:
        newCells = this._splitCellMix(cell, minSize);
        break;
    }
    return newCells;
  }

  /**
   * Split cell along the longest side
   * @param {GridCell} cell - The cell to split
   * @param {number} [minSize=10] - Minimum size for resulting cells
   * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
   * @private
   */
  _splitCellLongest (cell, minSize = 10) {
    if (cell.width > cell.height) {
      return this._splitCellHorizontal(cell, minSize);
    } else {
      return this._splitCellVertical(cell, minSize);
    }
  }

  /**
   * Split cells randomly along horizontal or vertical axis
   * @param {GridCell} cell - The cell to split
   * @param {number} [minSize=10] - Minimum size for resulting cells
   * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
   * @private
   */
  _splitCellMix (cell, minSize = 10) {
    if (this._rng.random() < 0.5) {
      return this._splitCellHorizontal(cell, minSize);
    } else {
      return this._splitCellVertical(cell, minSize);
    }
  }

  /**
   * Split a cell evenly into 4 cells
   * @param {GridCell} cell - The cell to split
   * @param {number} [minSize=10] - Minimum size for resulting cells
   * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
   * @private
   */
  _splitCellSquare (cell, minSize = 10) {
    let w2 = cell.width / 2;
    let h2 = cell.height / 2;
    let x = cell.x;
    let y = cell.y;
    let c = cell.counter + 1;
    let newCells = [];

    if (w2 > minSize && h2 > minSize) {
      newCells.push(new Toko.GridCell(x, y, w2, h2));
      newCells.push(new Toko.GridCell(x + w2, y, w2, h2));
      newCells.push(new Toko.GridCell(x + w2, y + h2, w2, h2));
      newCells.push(new Toko.GridCell(x, y + h2, w2, h2));
      newCells[0].counter = newCells[1].counter = newCells[2].counter = newCells[3].counter = c;
    } else {
      newCells.push(cell);
    }
    return newCells;
  }

  /**
   * Split a cell horizontally
   * @param {GridCell} cell - The cell to split
   * @param {number} [minSize=10] - Minimum size for resulting cells
   * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
   * @private
   */
  _splitCellHorizontal (cell, minSize = 10) {
    let w2 = cell.width / 2;
    let h = cell.height;
    let x = cell.x;
    let y = cell.y;
    let c = cell.counter + 1;
    let newCells = [];

    if (w2 > minSize) {
      newCells.push(new Toko.GridCell(x, y, w2, h));
      newCells.push(new Toko.GridCell(x + w2, y, w2, h));
      newCells[0].counter = newCells[1].counter = c;
    } else {
      newCells.push(cell);
    }
    return newCells;
  }

  /**
   * Split a cell vertically
   * @param {GridCell} cell - The cell to split
   * @param {number} [minSize=10] - Minimum size for resulting cells
   * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
   * @private
   */
  _splitCellVertical (cell, minSize = 10) {
    let w = cell.width;
    let h2 = cell.height / 2;
    let x = cell.x;
    let y = cell.y;
    let c = cell.counter + 1;
    let newCells = [];

    if (h2 > minSize) {
      newCells.push(new Toko.GridCell(x, y, w, h2));
      newCells.push(new Toko.GridCell(x, y + h2, w, h2));
      newCells[0].counter = newCells[1].counter = c;
    } else {
      newCells.push(cell);
    }
    return newCells;
  }

  //----------------------------------------
  //
  //  Set functions
  //
  //----------------------------------------

  /**
   * Set the offset of the entire grid
   * @param {number} x - New x position for the grid
   * @param {number} y - New y position for the grid
   * @returns {this} Returns this grid for method chaining
   */
  setOffset (x, y) {
    // Calculate the offset difference
    let offsetX = x - this._x;
    let offsetY = y - this._y;

    // Update the grid's base position
    this._x = x;
    this._y = y;
    this._position = createVector(x, y);

    // Update all existing cells to maintain their relative positions
    this._cells.forEach(cell => {
      cell.x += offsetX;
      cell.y += offsetY;
    });

    // Invalidate points cache since positions have changed
    this._pointsAreUpdated = false;
  }

  //----------------------------------------
  //  Get functions
  //----------------------------------------

  /**
   * Get the maximum counter value across all cells
   * @returns {number} The highest counter value, or 0 if no cells exist
   */
  get maxCounter () {
    if (this._cells.length === 0) return 0;
    let maxC = Math.max(...this._cells.map(cell => cell.counter));
    return maxC;
  }

  /**
   * Get the minimum counter value across all cells
   * @returns {number} The lowest counter value, or 0 if no cells exist
   */
  get minCounter () {
    if (this._cells.length === 0) return 0;
    let minC = Math.min(...this._cells.map(cell => cell.counter));
    return minC;
  }

  /**
   * Get the grid width
   * @returns {number} The width of the grid
   */
  get width () {
    return this._width;
  }

  /**
   * Get the grid height
   * @returns {number} The height of the grid
   */
  get height () {
    return this._height;
  }

  /**
   * Get the grid x position
   * @returns {number} The x position of the grid
   */
  get x () {
    return this._x;
  }

  /**
   * Get the grid y position
   * @returns {number} The y position of the grid
   */
  get y () {
    return this._y;
  }

  /**
   * Get all cells in the grid
   * @returns {GridCell[]} Array of all grid cells
   */
  get cells () {
    return this._cells;
  }

  /**
   * Get all unique corner points in the grid
   * Automatically updates points if they're not current
   * @returns {p5.Vector[]} Array of unique corner points
   */
  get points () {
    if (!this._pointsAreUpdated) {
      return this.gatherPoints();
    } else {
      return this._points;
    }
  }
}
