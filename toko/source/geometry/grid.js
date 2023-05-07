import Toko from '../core/main';

//
//  grid generators
//
//  create grids by recursive splitting cells or packing cells
//
//
// Toko.Grid = {
//    x          - x position on the canvas
//    y          - y position on the canvas
//    width      - width of the complete grid
//    height     - width of the complete grid
//  }
//
// External functions
//  setBaseGrid       - reset all cells and start with a rectangular grid of celles
//  packGrid          - pack the grid with cells of predefined sizes
//  splitRecursive    - split all the cells recursively for a number of loops
//
// Values
//  minCounter        - lowest number of splits for a recursive grid
//  maxCounter        - highest number of splits for a recursive grid
//  cells             - get an array of all the current cells
//  points            - get an array of all the corner points for the current grid of cells
//

Toko.Grid = class {

  SPLIT_HORIZONTAL = "split_horizonal";
  SPLIT_VERTICAL = "split_vertical";
  SPLIT_LONGEST = "split_longest";
  SPLIT_MIX = "split_mix";
  SPLIT_SQUARE = "split_square";

	constructor(x,y,width,height) {
    this._position = createVector(x,y);
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._cells = [
      new Toko.GridCell(this._x,this._y,this._width,this._height, 0, 0, this._width, this._height)
    ];
    this._points = [];
    this._pointsAreUpdated = false;
    this._openSpaces = [];
  }

  //
  //  set the base rows and columns for the grid
  //
  setBaseGrid(columns = 1, rows = 1) {
    let cellWidth = this._width/columns;
    let cellHeight = this._height/rows;

    this._cells = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        let newCell = new Toko.GridCell(
          this._x + c * cellWidth,
          this._y + r* cellHeight,
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

  //
  //  collect the coordinates of all unique points on the grid
  //
  gatherPoints() {
    this._pointsAreUpdated = true;
    this._points = [];
    let tempPoints = [];
    let uniquePoints = [];
    let c;
    //
    //  gather all points as strings
    //
    for (let n = 0; n < this._cells.length; n++) {
      c = this._cells[n];
      // top left corner
      tempPoints.push(`${c.x}-${c.y}`);
      // top right corner
      tempPoints.push(`${c.x+c.width}-${c.y}`);
      // bottom left corner
      tempPoints.push(`${c.x}-${c.y+c.height}`);
      // bottom right corner
      tempPoints.push(`${c.x+c.width}-${c.y+c.height}`);
    }
    //
    //  deduplicate using a set
    //
    uniquePoints = [...new Set(tempPoints)];
    //
    // parse back to vectors
    //
    uniquePoints.forEach(element => {
      let a = element.split('-');
      this._points.push(createVector(parseFloat(a[0]),parseFloat(a[1])));
    });

    return this._points;
  }

  //
  //  construct a grid by packing shapes
  //  partly inspired by
  //  https://www.gorillasun.de/blog/an-algorithm-for-irregular-grids/
  //
  //  columns         - number of columns to be packed
  //  rows            - number of rows to be packed
  //  cellShapes      - array of cells defining width and height of cell shapes
  //  fillEmptySpaces - whether left over spaces should be filled with 1x1 cells
  //  snapToPixel     - if set to true all sizes and positions are rounded to a pixel
  //                    This can result in the cells not filling the complete grid space
  //
  packGrid(columns,rows,cellShapes, fillEmptySpaces = true, snapToPixel = true) {
    this._pointsAreValid = false;
    this._cells = [];
    let cw, rh;
    if (snapToPixel) {
      cw = Math.round(this._width/columns);
      rh = Math.round(this._height/rows);
    } else {
      cw = this._width/columns;
      rh = this._height/rows;
    }
    
    this.resetOpenSpaces(columns,rows);
    let spaceCheckInterval = 10;
    let keepGoing = true;
    let shape, w, h, c, r, newCell, keepTryingThisShape;
    let k = 0;
    let fails = 0;
    let maxFails = 10000;
    let triesPerShape = 2500; 
    let tryCounter = 0;

    while (keepGoing) {
      // pick random shape
      shape = random(cellShapes);
      w = shape[0];
      h = shape[1];

      keepTryingThisShape = true;
      while (keepTryingThisShape) {
        // pick random location
        c = floor(random(0, columns - w + 1));
        r = floor(random(0, rows - h + 1));

        // check if space is available
        if (this.spaceAvailable(c,r,w,h)) {
          newCell = new Toko.GridCell(this._x+c*cw, this._y+r*rh, w*cw, h*rh, c, r, w, h);
          newCell.counter = tryCounter;
          this._cells.push(newCell);
          this.fillSpace(c,r,w,h);
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
      if (k%spaceCheckInterval == 0) {
        keepGoing = this.anySpaceLeft();
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
      this.fillEmptySpaces(columns,rows,cellShapes, snapToPixel);
    }
    
  }

  //
  //  fill the remaining empty spaces systematically
  //
  fillEmptySpaces(columns,rows,cellShapes, snapToPixel) {
    cellShapes.push([1,1]); // add a 1x1 so we can always fill
    let cw, rh;
    if (snapToPixel) {
      cw = Math.round(this._width/columns);
      rh = Math.round(this._height/rows);
    } else {
      cw = this._width/columns;
      rh = this._height/rows;
    }
    let s, tryingShapes, w, h, newCell;
    //
    //  go through the entire grid and try every space in every open spot
    //
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        tryingShapes = true;
        s = 0;
        while (tryingShapes) {
          w = cellShapes[s][0];
          h = cellShapes[s][1];
          if (this.spaceAvailable(i,j,w,h)) {
            newCell = new Toko.GridCell(this._x+i*cw, this._y+j*rh, w*cw, h*rh, i, j, cw, rh);
            newCell.counter = s;
            this._cells.push(newCell);
            this.fillSpace(i,j,w,h);
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

  //
  //  check if space is available for this shape
  //
  spaceAvailable(column,row,width,height) {
    if ((column+width) > this._openSpaces.length) {
      return false;
    }
    if ((row+height) > this._openSpaces[0].length) {
      return false;
    }
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (!this._openSpaces[column+i][row+j]) {
          return false;
        }
      }
    }
    return true;
  }

  //
  //  mark a specific area in the grid as no longer open
  //
  fillSpace(column,row,width,height) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        this._openSpaces[column+i][row+j] = false;
      }
    }
  }

  //
  //  reset all the space back to open
  //
  resetOpenSpaces(columns, rows) {
    this._openSpaces = [];
    for (let i = 0; i < columns; i++) {
      this._openSpaces[i] = new Array();
      for (let j = 0; j < rows; j++) {
        this._openSpaces[i][j] = true;
      }
    }
  }

  //
  //  check if there is any space left at all
  //
  anySpaceLeft() {
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
  
  //
  //  split the cells recursively
  //
  //  nrLoops         - number times all cells are evaluated
  //  chance          - the chance a cell is split when evaluated
  //  minSize         - only splits resulting in new cells larger than this size are considered
  //  splitStyle      - defines how the cells should split
  //                    SPLIT_HORIZONTAL  = split a cell horizontally into 2 new cells
  //                    SPLIT_VERTICAL    = split a cell vertically into 2 new cells
  //                    SPLIT_LONGEST     = split the longest dimension
  //                    SPLIT_MIX         = split along both axis randomly
  //                    SPLIT_SQUARE      = split cells into 4 new cells
  //                    
  splitRecursive(nrLoops = 1, chance = 0.5, minSize = 10, splitStyle = this.SPLIT_MIX) {
    if (splitStyle == this.SPLIT_SQUARE) {
      // reduce the chance because the square split creates 4 cells instead of 2
      chance *= 0.5;
    }

    for (let i = 0; i < nrLoops; i++) {
      let newCells = [];
      for (let n = 0; n < this._cells.length; n++) {
        if (Math.random() < chance) {
          let c = this.splitCell(this._cells[n],minSize, splitStyle);
          newCells = newCells.concat(c);
        } else {
          newCells.push(this._cells[n]);
        }
      }
      this._cells = [...newCells];
    }
  }

  //
  //  direct to right split style
  //
  splitCell(cell, minSize = 10, splitStyle = this.SPLIT_MIX) {
    let newCells = [];
    switch (splitStyle) {
      case this.SPLIT_SQUARE:
        newCells = this.splitCellSquare(cell, minSize);
        break;
      case this.SPLIT_HORIZONTAL:
        newCells = this.splitCellHorizontal(cell, minSize);
        break;
      case this.SPLIT_VERTICAL:
        newCells = this.splitCellVertical(cell, minSize);
        break;
      case this.SPLIT_LONGEST:
        newCells = this.splitCellLongest(cell, minSize);
        break;
      case this.SPLIT_MIX:
        newCells = this.splitCellMix(cell, minSize);
        break;
      default:
        newCells = this.splitCellMix(cell, minSize);
        break;
    }
    return newCells;
  }

  //
  //  split cell along the longest side
  //
  splitCellLongest(cell, minSize = 10) {
    if (cell.width > cell.height) {
      return this.splitCellHorizontal(cell, minSize);
    } else {
      return this.splitCellVertical(cell, minSize);
    }
  }

  //
  //  split cells randomly along horizontal or vertical axis
  //
  splitCellMix(cell, minSize = 10) {
    if (Math.random() < 0.5) {
      return this.splitCellHorizontal(cell, minSize);
    } else {
      return this.splitCellVertical(cell, minSize);
    }
  }

  //
  //  split a cell evenly into 4 cells
  //
  splitCellSquare(cell, minSize = 10) {
    let w2 = cell.width/2;
    let h2 = cell.height/2;
    let x = cell.x;
    let y = cell.y;
    let c = cell.counter + 1;
    let newCells = [];

    if (w2 > minSize && h2 > minSize) {
        newCells.push(new Toko.GridCell(x,y,w2,h2));
        newCells.push(new Toko.GridCell(x+w2,y,w2,h2));
        newCells.push(new Toko.GridCell(x+w2,y+h2,w2,h2));
        newCells.push(new Toko.GridCell(x,y+h2,w2,h2));
        newCells[0].counter = newCells[1].counter = newCells[2].counter = newCells[3].counter = c;
    } else {
      newCells.push(cell);
    }
    return newCells;
  }

  //
  //  split a cell horizontally
  //
  splitCellHorizontal(cell, minSize = 10) {
    let w2 = cell.width/2;
    let h = cell.height;
    let x = cell.x;
    let y = cell.y;
    let c = cell.counter + 1;
    let newCells = [];

    if (w2 > minSize) {
        newCells.push(new Toko.GridCell(x,y,w2,h));
        newCells.push(new Toko.GridCell(x+w2,y,w2,h));
        newCells[0].counter = newCells[1].counter = c;
    } else {
      newCells.push(cell);
    }
    return newCells;
  }

  //
  //  split a cell vertically
  //
  splitCellVertical(cell, minSize = 10) {
    let w = cell.width;
    let h2 = cell.height/2;
    let x = cell.x;
    let y = cell.y;
    let c = cell.counter + 1;
    let newCells = [];

    if (h2 > minSize) {
        newCells.push(new Toko.GridCell(x,y,w,h2));
        newCells.push(new Toko.GridCell(x,y+h2,w,h2));
        newCells[0].counter = newCells[1].counter = c;
    } else {
      newCells.push(cell);
    }
    return newCells;
  }

  //----------------------------------------
  //
  //  Get and set functions
  //
  //----------------------------------------

  get maxCounter() {
    //
    //  find the max value of counter in all the cells
    //  see https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
    //
    let maxC = this._cells.reduce((a,b)=>a.counter > b.counter ?a:b).counter;
    return maxC;
  }

  get minCounter() {
    let minC = this._cells.reduce((a,b)=>a.counter < b.counter ?a:b).counter;
    return minC;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get cells() {
    return this._cells;
  }

  get points() {
    if (!this._pointsAreUpdated) {
      return this.gatherPoints();
    } else {
      return this._points;
    }
  }
}
