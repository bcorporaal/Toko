p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

let seedHistory = [],
  seedHistoryIndex = 0,
  colorRNG,
  gridRNG;

function preload () {
  //
  // All loading calls here
  //
}

function setup () {
  //------------------------------------------------------
  //
  //  set base canvas
  //
  let sketchElementId = 'sketch-canvas';
  let canvasWidth = 0; // can be 0 because it is set based on the size in the html
  let canvasHeight = 0;

  //
  //  the size is set using the Toko setup options
  //
  p5Canvas = createCanvas(canvasWidth, canvasHeight, SVG);
  p5Canvas.parent(sketchElementId);

  //-------------------------------------------------------
  //
  //  start Toko
  //
  toko.setup({
    //
    //  basic options
    //
    title: 'Toko grid - SVG version', //  title displayed
    sketchElementId: sketchElementId, //  id used to create the p5 canvas
    canvasSize: toko.SIZE_DEFAULT, //  canvas size to use
    //
    //  additional options
    //
    showSaveSketchButton: true, //  show save image button in tweakpane
    saveSettingsWithSketch: true, //  save json of settings together with the image
    acceptDroppedSettings: true, //  accept dropped json files with settings
    useParameterPanel: true, //  use the tweakpane panel for settings
    showAdvancedOptions: true, //  show advanced settings in tweakpane, like size
    captureFrames: false, //  no record option
  });

  //
  //-------------------------------------------------------
  //
  //  sketch parameters
  //
  let g = new Toko.Grid();

  p = {
    // seed: 29,
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
    splitType: g.SPLIT_MIX,
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

  colorRNG = new Toko.RNG();
  gridRNG = new Toko.RNG();

  toko.addRandomSeedControl(toko.pane.tab, p, {
    seedStringKey: 'gridSeed',
    label: 'grid seed',
    rng: gridRNG,
  });

  toko.pane.tab.addBlade({ view: 'separator' });

  //
  //  add controls for the grid selector
  //
  toko.pane.tab.addBlade({ view: 'separator' });
  toko.pane.tab.addBinding(p, 'gridType', {
    options: {
      recursive: 'recursive',
      packed: 'packed',
    },
  });
  toko.pane.tab.addBlade({ view: 'separator' });
  // toko.pane.tab.addBinding(p, 'seed', {
  //   min: 1,
  //   max: 2000,
  //   step: 1,
  // });
  //
  //  add controls for the base grid rows and columns
  //
  f0 = toko.pane.tab.addFolder({
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
  //
  //  add controls for the recursive grid
  //
  f1 = toko.pane.tab.addFolder({
    title: 'Recursive grid',
  });
  f1.addBinding(p, 'nrLoops', {
    min: 1,
    max: 25,
    step: 1,
  });
  f1.addBinding(p, 'splitType', {
    options: {
      horizontal: g.SPLIT_HORIZONTAL,
      vertical: g.SPLIT_VERTICAL,
      longest: g.SPLIT_LONGEST,
      mix: g.SPLIT_MIX,
      square: g.SPLIT_SQUARE,
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
  //
  //  add controls for the packed grid
  //
  f2 = toko.pane.tab.addFolder({
    title: 'Packed grid',
  });
  f2.addBinding(p, 'cellShapes');
  f2.addBinding(p, 'noEmptySpaces');
  f2.addBinding(p, 'snapToPixel');
  //
  //  add controls to change the colors
  //
  f6 = toko.pane.tab.addFolder({
    title: 'Colors',
    expanded: false,
  });
  toko.addPaletteSelector(f6, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  f6.addBlade({ view: 'separator' });

  toko.addRandomSeedControl(f6, p, {
    seedStringKey: 'colorSeed',
    label: 'color seed',
    rng: colorRNG,
  });

  f6.addBinding(p, 'colorShift');

  //
  //  add controls to change the colors
  //
  f7 = toko.pane.tab.addFolder({
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
  //
  //  listen to tweakpane changes
  //
  toko.pane.events.on('change', value => {
    refresh();
  });

  refresh();
  noLoop();

  //---------------------------------------------
  toko.endSetup();
  //---------------------------------------------
}

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

  //  redraw with updated parameters
  //
  redraw();
}

function draw () {
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------

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
  colors = toko.getColorScale(this.p.palette, o);

  //
  //  set the background and stroke colors
  //
  let bgndColor = colors.backgroundColor(p.invertBgnd);
  let drawColor = colors.drawColor(p.invertBgnd);

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
    fill(colors.randomOriginalColor(colorShift));

    c = gridSet.cells[i];
    rect(c.x, c.y, c.width, c.height);
  }

  //---------------------------------------------
  toko.endDraw(); // do not remove
  //---------------------------------------------
}

//---------------------------------------------
//
//  EVENTS
//
//---------------------------------------------

function captureStarted () {
  //
  //  called when capture has started, use to reset visuals
  //
  console.log('Toko - captureStarted');
}

function captureStopped () {
  //
  //  called when capture is stopped, use to reset visuals
  //
  console.log('Toko - captureStopped');
}

function canvasResized () {
  //
  //  called when the canvas was resized
  //
  console.log('Toko - canvasResized');
}

function windowResized () {
  //
  //  resize the canvas when the framing div was resized
  //
  console.log('Toko - windowResized');

  var newWidth = document.getElementById('sketch-canvas').offsetWidth;
  var newHeight = document.getElementById('sketch-canvas').offsetHeight;

  if (newWidth != width || newHeight != height) {
    canvasResized();
  }
}

function receivedFile (file) {
  //
  //  called when a JSON file is dropped on the sketch
  //  tweakpane settings are automatically updated
  //
  console.log('Toko - receivedFile');
}
