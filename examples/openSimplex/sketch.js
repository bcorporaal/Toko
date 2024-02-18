// import FastNoiseLite from '../../assets/js/fastNoiseLite/FastNoiseLite';

p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();
let baseNoise, startFrame;

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
    title: 'OpenSimplex noise demo', //  title displayed
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
    seed: 'FAST',
    radius: 0.7,
    spacing: 10,
    alpha: 1,
    collections: toko.COLOR_COLLECTIONS,
    collection: 'exposito',
    palette: 'exposito',
    reverse: false,
    steps: 200,
    frequency: 20,
    speed: 20,
    cutoff: 1.0,
  };

  toko.addRandomSeedControl(toko.pane.tab, p, {
    seedStringKey: 'seed',
    label: 'seed',
  });

  toko.pane.tab.addBlade({ view: 'separator' });

  toko.addPaletteSelector(toko.pane.tab, p, {
    index: 4,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  toko.pane.tab.addBinding(p, 'reverse', { label: 'reverse colors' });
  toko.pane.tab.addBlade({ view: 'separator' });
  toko.pane.tab.addBinding(p, 'cutoff', { min: 0, max: 1, step: 0.1 });
  toko.pane.tab.addBlade({ view: 'separator' });
  toko.pane.tab.addBinding(p, 'frequency', { min: 0, max: 100, step: 5 });
  toko.pane.tab.addBinding(p, 'speed', { min: 0, max: 100, step: 1 });

  //
  //  listen to tweakpane changes
  //
  toko.pane.events.on('change', value => {
    refresh();
  });

  refresh();

  //---------------------------------------------
  toko.endSetup();
  //---------------------------------------------
}

function refresh () {
  console.log('Toko - refresh');

  //
  //  init openSimplex noise
  //
  toko.resetSeed();
  let seed = Math.floor(toko.random(99999));
  baseNoise = toko.openSimplexNoise(seed);
  startFrame = frameCount;
  //
  //  get colors
  //
  const o = {
    domain: [0, 1],
    reverse: p.reverse,
  };
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
  background(bgndColor);

  let w = width / p.steps;
  let h = height / p.steps;

  for (let i = 0; i < p.steps; i++) {
    for (let j = 0; j < p.steps; j++) {
      let x = w * i;
      let y = h * j;

      let v = (frameCount - startFrame) * p.speed * 0.001;
      let f = map(p.frequency, 0, 100, 0.001, 0.1);

      let r = baseNoise.noise3D(x * f, y * f, v);
      r = map(r, -p.cutoff, p.cutoff, 0, 1, true);

      fill(colors.scale(r));
      rect(x, y, w, h);
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
  //  called when a JSON file is dropped on the sketch
  //  tweakpane settings are automatically updated
  //
  console.log('Toko - receivedFile');
}
