p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

let dotQuadtree, points;

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
  let canvasWidth = 0;
  let canvasHeight = 0;

  //
  //  the size is set using the Toko setup options
  //
  p5Canvas = createCanvas(canvasWidth, canvasHeight, P2D);
  p5Canvas.parent(sketchElementId);

  //-------------------------------------------------------
  //
  //  start Toko
  //
  toko.setup({
    //
    //  basic options
    //
    title: 'Poisson Disk sampling', //  title displayed
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
  p = {
    pointSeed: 'POISSON',
    radius: 0.7,
    spacing: 10,
    alpha: 1,
    collections: toko.COLOR_COLLECTIONS,
    collection: 'metbrewer',
    palette: 'archambault',
    inverse: true,
    blendMode: BLEND,
    sequential: false,
    highlightRadius: 100,
    showEdge: false,
  };

  toko.addRandomSeedControl(toko.pane.tab, p, {
    seedStringKey: 'pointSeed',
    label: 'point seed',
  });

  toko.pane.tab.addBlade({ view: 'separator' });

  toko.addPaletteSelector(toko.pane.tab, p, {
    index: 5,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  // add blendmode selector
  toko.addBlendModeSelector(toko.pane.tab, p, {
    blendModeKey: 'blendMode',
  });
  toko.pane.tab.addBinding(p, 'inverse', { label: 'invert bgnd' });
  toko.pane.tab.addBinding(p, 'alpha', { min: 0, max: 1, step: 0.1 });
  toko.pane.tab.addBinding(p, 'sequential');

  toko.pane.tab.addBlade({ view: 'separator' });

  toko.pane.tab.addBinding(p, 'radius', { min: 0.1, max: 5, step: 0.1 });
  toko.pane.tab.addBinding(p, 'spacing', { min: 5, max: 50, step: 5 });

  toko.pane.tab.addBlade({ view: 'separator' });

  toko.pane.tab.addBinding(p, 'highlightRadius', { min: 0, max: 300, step: 5 });
  toko.pane.tab.addBinding(p, 'showEdge');

  //
  //  listen to tweakpane changes
  //
  toko.pane.events.on('change', value => {
    refresh();
  });

  refresh();
  // noLoop();

  //---------------------------------------------
  toko.endSetup();
  //---------------------------------------------
}

function refresh () {
  console.log('Toko - refresh');

  //
  //  create a fresh quadtree
  //
  dotQuadtree = QuadTree.create();
  //
  //  create the distribution
  //
  points = toko.poissonDisk(width, height, p.spacing);
  //
  //  set domain range to number of steps
  //
  const o = {
    domain: [0, 1],
  };
  //
  //  get colors
  //
  colors = toko.getColorScale(this.p.palette, o);
  blendMode(p.blendMode);
  //
  //  add all points to the quadtree and give each point a color
  //
  let n = points.length;
  for (let i = 0; i < points.length; i++) {
    let quadtreeCircle = new Circle(points[i].x, points[i].y, p.radius * p.spacing, { id: i });
    dotQuadtree.insert(quadtreeCircle);
    if (p.sequential) {
      points[i].color = toko.colorAlpha(colors.scale(i / n), 255 * p.alpha);
    } else {
      points[i].color = toko.colorAlpha(colors.randomOriginalColor(), 255 * p.alpha);
    }
  }
  //
  //  redraw with updated parameters
  //
  toko.resetSeed();
  redraw();
}

function draw () {
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------

  clear();
  noStroke();

  let bgndColor = colors.backgroundColor(p.inverse);
  background(bgndColor);

  let areaToCheck = new Circle(mouseX, mouseY, p.highlightRadius / 2);
  let circlesToCheck = dotQuadtree.query(areaToCheck);

  //
  //  to avoid having to reset all the points back to an unhighlighted state
  //  we're given all the highlighted ones the framecount as an unique id
  //
  let fc = frameCount;
  circlesToCheck.forEach(circle => {
    points[circle.data.id].fc = fc;
  });

  //
  //  then we're coloring white all the points with the unique id
  //
  let c;
  for (let i = 0; i < points.length; i++) {
    if (points[i].fc == fc) {
      c = toko.colorAlpha('white', 255 * p.alpha);
    } else {
      c = points[i].color;
    }
    fill(c);
    circle(points[i].x, points[i].y, p.radius * p.spacing);
  }
  //
  //  note that we're skipping the actual radius check and
  //  assuming that the quadtree is sufficiently accurate.
  //

  //
  //  for reference show the edge of the circle of influence
  //
  if (p.showEdge) {
    noFill();
    stroke('yellow');
    strokeWeight(1);
    circle(mouseX, mouseY, p.highlightRadius);
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
