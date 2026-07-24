//---------------------------------------------
//
//  GRID
//
//---------------------------------------------

let seedHistory = [],
  seedHistoryIndex = 0,
  colorRNG,
  gridRNG,
  g;

var tokoWrapper = new TokoWrapper({
  title: 'Grid',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let p = {
  gridSeed: 'ABCDEF',
  colorSeed: 'ghijkl',
  // grid
  margin: 30,
  rows: 12,
  columns: 12,
  nrLoops: 5,
  splitChance: 0.5,
  minSize: 10,
  gridType: 'packed',
  splitType: 'split_mix',
  cellShapes: '[2,2],[3,1],[1,3]',
  noEmptySpaces: true,
  snapToPixel: true,
  // color
  collections: ['basic', 'd3', 'duotone', 'golid', 'system', 'orbifold'],
  collection: 'basic',
  palette: 'donut',
  invertBgnd: true,
  useScale: true,
  stroke: true,
  strokeWeight: 1.5,
  strokeAlpha: 100,
  colorShift: true,
};

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.addRandomSeedControl(panelObject.primaryTab, p, {
    seedStringKey: 'gridSeed',
    label: 'grid seed',
    rng: gridRNG,
  });

  panelObject.primaryTab.addBlade({ view: 'separator' });

  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'gridType', {
    options: {
      recursive: 'recursive',
      packed: 'packed',
    },
  });

  f0 = panelObject.primaryTab.addFolder({
    title: 'Base grid',
  });
  f0.addBinding(p, 'columns', {
    min: 1,
    max: 100,
    step: 1,
  });
  f0.addBinding(p, 'rows', {
    min: 1,
    max: 100,
    step: 1,
  });

  f1 = panelObject.primaryTab.addFolder({
    title: 'Recursive grid',
  });
  f1.addBinding(p, 'nrLoops', {
    min: 1,
    max: 25,
    step: 1,
  });
  f1.addBinding(p, 'splitType', {
    options: {
      horizontal: Toko.Grid.SPLIT_HORIZONTAL,
      vertical: Toko.Grid.SPLIT_VERTICAL,
      longest: Toko.Grid.SPLIT_LONGEST,
      mix: Toko.Grid.SPLIT_MIX,
      square: Toko.Grid.SPLIT_SQUARE,
    },
  });
  f1.addBinding(p, 'splitChance', {
    min: 0,
    max: 1,
    step: 0.1,
  });
  f1.addBinding(p, 'minSize', {
    min: 1,
    max: 25,
    step: 1,
  });

  f2 = panelObject.primaryTab.addFolder({
    title: 'Packed grid',
  });
  f2.addBinding(p, 'cellShapes');
  f2.addBinding(p, 'noEmptySpaces');
  f2.addBinding(p, 'snapToPixel');

  f6 = panelObject.primaryTab.addFolder({
    title: 'Colors',
    expanded: false,
  });
  panelObject.addPaletteSelector(f6, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  f6.addBlade({ view: 'separator' });

  panelObject.addRandomSeedControl(f6, p, {
    seedStringKey: 'colorSeed',
    label: 'color seed',
    rng: colorRNG,
  });

  f6.addBinding(p, 'colorShift');

  f7 = panelObject.primaryTab.addFolder({
    title: 'Grid frame',
    expanded: false,
  });
  f7.addBinding(p, 'margin', {
    min: 0,
    max: 100,
    step: 1,
  });
  f7.addBinding(p, 'invertBgnd');
  f7.addBinding(p, 'stroke');
  f7.addBinding(p, 'strokeWeight', {
    min: 0.1,
    max: 4,
    step: 0.1,
  });
  f7.addBinding(p, 'strokeAlpha', {
    min: 0,
    max: 100,
    step: 5,
  });
}

//---------------------------------------------
//
//  SETUP - standard p5.js setup function
//
//---------------------------------------------
function setup () {
  let p5Canvas = createCanvas(100, 100, tokoWrapper.renderMode);
  p5Canvas.parent(tokoWrapper.sketchElementId);
  tokoWrapper.storeCanvas(p5Canvas);

  //
  //  initialize the RNGs and grid
  //  doing this here to ensure p5 functions are available
  //
  colorRNG = new Toko.RNG();
  gridRNG = new Toko.RNG();
}

//---------------------------------------------
//
//  REFRESH - called when a parameter changes
//
//---------------------------------------------
function refresh () {
  //
  //  toggle panels
  //
  if (p.gridType == 'recursive') {
    f1.expanded = true;
    f2.expanded = false;
  } else {
    f1.expanded = false;
    f2.expanded = true;
  }
  //
  //  reset both RNG's to seed to ensure result is identical
  //
  gridRNG.resetSeed();
  colorRNG.resetSeed();
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  let c, n;
  clear();
  //
  //  grid
  //
  //  make grid object with basic positioning and sizing
  gridSet = new Toko.Grid(p.margin, p.margin, width - 2 * p.margin, height - 2 * p.margin, gridRNG);

  //
  //  create the grid
  //
  if (p.gridType == 'recursive') {
    // create a recursive grid starting with a base set of rows and columns
    gridSet.setBaseGrid(p.columns, p.rows);
    gridSet.splitRecursive(p.nrLoops, p.splitChance, p.minSize, p.splitType);
  } else {
    // create a packed grid
    let cellShapes = JSON.parse('[' + p.cellShapes + ']');
    gridSet.packGrid(p.columns, p.rows, cellShapes, p.noEmptySpaces, p.snapToPixel);
  }

  //
  //  set domain range to number of cells
  //
  n = gridSet.cells.length;
  const o = {
    reverse: p.invertScale,
    domain: [0, n],
    rng: colorRNG,
  };

  //
  //  get colors
  //
  colors = toko.getColorScale(p.palette, o);

  //
  //  set the background and stroke colors
  //
  let bgndColor = colors.backgroundColor(p.invertBgnd);
  background(bgndColor);
  if (p.stroke) {
    strokeWeight(p.strokeWeight);
    let sc = toko.colorAlpha(bgndColor, (p.strokeAlpha / 100) * 255);
    stroke(sc);
  } else {
    noStroke();
  }

  //
  //  draw the cells
  //
  let colorShift = { h: 0, s: 0, l: 0 };
  if (p.colorShift) {
    colorShift = { h: 0, s: 0.1, l: 0.1 };
  }
  for (var i = 0; i < n; i++) {
    fill(colors.randomColor(true, colorShift));
    c = gridSet.cells[i];
    rect(c.x, c.y, c.width, c.height);
  }

  noLoop();
}
