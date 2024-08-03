p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

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
    title: 'Color grid', //  title displayed
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
    steps: 10,
    interpolated: false,
    collections: toko.COLOR_COLLECTIONS,
    collection: 'basic',
    palette: 'westCoast',
    inverse: false,
    reverse: false,
    sort: false,
    constrainContrast: false,
    interval: { min: 16, max: 48 },
    file: '',
  };

  //
  //  add controls to change the colors
  //
  toko.addPaletteSelector(toko.pane.tab, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  toko.pane.tab.addBinding(p, 'steps', { min: 2, max: 40, step: 1 });
  toko.pane.tab.addBinding(p, 'interpolated');
  toko.pane.tab.addBinding(p, 'reverse', { label: 'reverse palette' });
  toko.pane.tab.addBinding(p, 'sort', { label: 'sort metBrewer' });
  toko.pane.tab.addBinding(p, 'inverse', { label: 'invert bgnd' });
  toko.pane.tab.addBinding(p, 'constrainContrast', { label: 'limit contrast' });

  // toko.pane.tab.addBinding(p, 'interval', {
  //   min: 0,
  //   max: 100,
  //   step: 1,
  // });

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
  console.log('Toko - refresh');

  //
  //  set domain range to number of steps
  //
  const o = {
    domain: [0, p.steps * p.steps],
    reverse: p.reverse,
    sort: p.sort,
    constrainContrast: p.constrainContrast,
  };
  //
  //  get colors
  //
  colors = toko.getColorScale(this.p.palette, o);
  //
  //  redraw with updated parameters
  //
  redraw();
}

function draw () {
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------

  clear();
  noStroke();

  let bgndColor = colors.backgroundColor(p.inverse);
  let drawColor = colors.drawColor(p.inverse);

  background(bgndColor);
  stroke(drawColor);
  strokeWeight(1);

  let m = 75; // margin
  let s = 10; // spacing
  let w = (width - m * 2 - (p.steps - 1) * s) / p.steps;
  let h = (height - m * 2 - (p.steps - 1) * s) / p.steps;

  //
  //  draw a grid with the colors from the palette
  //
  for (let i = 0; i < p.steps; i++) {
    for (let j = 0; j < p.steps; j++) {
      fill(colors.scale(i + j * p.steps, !p.interpolated));
      rect(i * (w + s) + m, j * (h + s) + m, w, h);
    }
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
  //  called when a file is dropped on the sketch
  //  tweakpane settings are automatically updated
  //
  console.log('Toko - receivedFile');
}
