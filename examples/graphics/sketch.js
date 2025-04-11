p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();
// let colorVariations;
let jiggleRNG = new Toko.RNG();

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
    title: 'Graphical effects - noise & glow', //  title displayed
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
  //  sketch parameters
  //
  p = {
    // rng seed
    seed: '',

    // color & effects
    collections: toko.COLOR_COLLECTIONS,
    collection: 'jung',
    palette: 'jung_croc',
    glow: true,
    interpolated: false,
    reverseGrad: false,
    reverseBgnd: false,

    // geometry
    nrSlices: 24,
    snapStep: 0.04,
    leftRange: { min: 0, max: 0.3 },
    rightRange: { min: 0.7, max: 1 },
    jiggle: 3,

    // shuffle
    switches: 100,
    radius: 0.3,
  };

  //
  //  controls for the RNG seed
  //
  const fr = toko.pane.tab.addFolder({
    title: 'RNG',
  });

  toko.addRandomSeedControl(fr, p, {
    seedStringKey: 'seed',
    label: 'seed',
  });

  //
  //  controls for the color settings
  //
  const fc = toko.pane.tab.addFolder({
    title: 'Color & effects',
  });

  toko.addPaletteSelector(fc, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  fc.addBinding(p, 'reverseGrad');
  fc.addBinding(p, 'reverseBgnd');
  fc.addBinding(p, 'interpolated');

  fc.addBlade({ view: 'separator' });
  fc.addBinding(p, 'glow');

  //
  //  controls for the slices and position
  //
  const fg = toko.pane.tab.addFolder({
    title: 'Geometry',
  });

  fg.addBinding(p, 'nrSlices', { min: 2, max: 200, step: 1 });
  fg.addBinding(p, 'leftRange', {
    min: -0.5,
    max: 0.5,
    step: 0.1,
  });
  fg.addBinding(p, 'rightRange', {
    min: 0.5,
    max: 1.5,
    step: 0.1,
  });
  fg.addBinding(p, 'snapStep', { min: 0, max: 0.2, step: 0.01 });
  fg.addBinding(p, 'jiggle', { min: 0, max: 10, step: 0.5 });

  //
  //  controls for how slices get shuffled
  //
  const fs = toko.pane.tab.addFolder({
    title: 'Shuffle',
  });

  fs.addBinding(p, 'switches', { min: 0, max: 200, step: 1 });
  fs.addBinding(p, 'radius', { min: 0, max: 1, step: 0.1 });

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
  //  reset the seed to get the same results again
  //
  toko.resetSeed();

  //
  //  set domain range to number of steps
  //
  const o = {
    domain: [0, p.nrSlices],
    reverse: p.reverseGrad,
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
  clear();

  let bgndColor = colors.backgroundColor(p.reverseBgnd);
  noStroke();
  background(bgndColor);

  let h = height / p.nrSlices;

  //
  //  assign a color to each slice
  //
  let slices = [];
  for (let i = 0; i < p.nrSlices; i++) {
    slices[i] = {
      colorLeft: colors.scale(i, !p.interpolated),
      colorRight: colors.scale(i, !p.interpolated),
    };
  }

  //
  //  shuffle colors on each side of the slice
  //
  let maxDistance = p.nrSlices * p.radius;
  for (let i = 0; i < p.switches; i++) {
    let origin = floor(toko.random() * p.nrSlices);
    let destination = origin + toko.intRange(-1 * maxDistance, maxDistance);
    if (destination < 0) {
      destination = 0;
    } else if (destination > p.nrSlices - 1) {
      destination = p.nrSlices - 1;
    }

    if (origin != destination) {
      if (toko.randomBool()) {
        let temp = slices[origin].colorLeft;
        slices[origin].colorLeft = slices[destination].colorLeft;
        slices[destination].colorLeft = temp;
      } else {
        let temp = slices[origin].colorRight;
        slices[origin].colorRight = slices[destination].colorRight;
        slices[destination].colorRight = temp;
      }
    }
  }

  //
  //  position and draw each slice
  //
  for (let i = 0; i < p.nrSlices; i++) {
    let y = h * i;
    let x1 = toko.steppedRandom(p.leftRange.min, p.leftRange.max, p.snapStep);
    let x2 = toko.steppedRandom(p.rightRange.min, p.rightRange.max, p.snapStep);

    x1 *= width;
    x2 *= width;
    let w = x2 - x1;

    let c1 = color(slices[i].colorLeft);
    let c2 = color(slices[i].colorRight);

    let xc = x1 + w / 2;
    let yc = y + h / 2;

    let spin = jiggleRNG.random(-p.jiggle / 500, p.jiggle / 500);

    push();
    toko.rotateAround(xc, yc, spin * TWO_PI);
    toko.linearGradient(x1, y, x2, y, [
      { offset: 0, color: c1 },
      { offset: 1, color: c2 },
    ]);

    if (p.glow) {
      c1.setAlpha(120);
      toko.shadow(0, 0, 60, c1);
    }

    rect(x1, y, w, h);
    pop();
  }

  toko.addChannelGrain(
    {
      red: 10,
      green: 10,
      blue: 10,
    },
    {
      red: 0,
      green: 0,
      blue: 0,
    },
  );
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
