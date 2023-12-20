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
    title: 'Graphics example', //  title displayed
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
    seed: '',
    radius: 0.1,
    steps: 80,
    snapStep: 0.1,
    switches: 150,
    interpolated: true,
    reverseGrad: false,
    reverseBgnd: false,
    shifted: true,
    collections: toko.COLOR_COLLECTIONS,
    collection: 'basic',
    palette: 'westCoast',
    original: false,
    leftRange: { min: 0, max: 0.3 },
    rightRange: { min: 0.7, max: 1 },
    jiggle: 0,
  };

  //
  //  add controls to change the colors
  //

  toko.addRandomSeedControl(toko.pane.tab, p, {
    seedStringKey: 'seed',
    label: 'seed',
  });

  toko.addPaletteSelector(toko.pane.tab, p, {
    index: 3,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  toko.pane.tab.addBinding(p, 'steps', { min: 2, max: 200, step: 1 });
  toko.pane.tab.addBinding(p, 'leftRange', {
    min: -0.5,
    max: 0.5,
    step: 0.1,
  });
  toko.pane.tab.addBinding(p, 'rightRange', {
    min: 0.5,
    max: 1.5,
    step: 0.1,
  });

  toko.pane.tab.addBinding(p, 'reverseGrad');
  toko.pane.tab.addBinding(p, 'reverseBgnd');

  toko.pane.tab.addBinding(p, 'interpolated');
  toko.pane.tab.addBinding(p, 'switches', { min: 0, max: 200, step: 1 });
  toko.pane.tab.addBinding(p, 'radius', { min: 0, max: 1, step: 0.1 });
  toko.pane.tab.addBinding(p, 'snapStep', { min: 0, max: 0.2, step: 0.01 });
  toko.pane.tab.addBinding(p, 'jiggle', { min: 0, max: 10, step: 0.5 });

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
    domain: [0, p.steps],
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
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------

  clear();
  noStroke();

  let cc = p.reverseBgnd ? 1 : 0;
  let bgndColor = colors.contrastColors[cc];
  noStroke();

  background(bgndColor);

  let nrSlices = p.steps;
  let h = height / nrSlices;

  let slices = [];

  for (let i = 0; i < nrSlices; i++) {
    if (p.interpolated) {
      slices[i] = {
        colorLeft: colors.scale(i),
        colorRight: colors.scale(i),
      };
    } else {
      slices[i] = {
        colorLeft: colors.originalScale(i),
        colorRight: colors.originalScale(i),
      };
    }
  }

  let maxDistance = p.steps * p.radius;

  for (let i = 0; i < p.switches; i++) {
    let origin = floor(toko.random() * p.steps);
    let destination = origin + toko.intRange(-1 * maxDistance, maxDistance);
    if (destination < 0) {
      destination = 0;
    } else if (destination > p.steps - 1) {
      destination = p.steps - 1;
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

  for (let i = 0; i < nrSlices; i++) {
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
    // translate(xc, yc);
    // rotate(spin * TWO_PI);
    // translate(-xc, -yc);

    toko.rotateAround(xc, yc, spin * TWO_PI);

    toko.linearGradient(x1, y, x2, y, [
      { offset: 0, color: c1 },
      { offset: 1, color: c2 },
    ]);

    c1.setAlpha(120);

    toko.shadow(0, 0, 40, c1);

    rect(x1, y, w, h);
    pop();
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
