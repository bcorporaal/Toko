p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

// let dotQuadtree, points;

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
    title: 'Easing functions & duotone colors', //  title displayed
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
    collections: toko.COLOR_COLLECTIONS,
    collection: 'judson',
    palette: 'jud_playground',
    reverse: false,
    duotone: 0,
    easingTypeX: toko.EASE_QUAD,
    easingDirectionX: toko.EASE_IN_OUT,
    onOutsideX: true,
    showX: true,
    easingTypeY: toko.EASE_EXPO,
    easingDirectionY: toko.EASE_IN_OUT,
    onOutsideY: false,
    showY: true,
    nrLines: 200,
  };

  //
  //  color controls
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

  toko.pane.tab.addBinding(p, 'duotone', { min: 0, max: 11, step: 1 });
  toko.pane.tab.addBinding(p, 'reverse');

  toko.pane.tab.addBlade({ view: 'separator' });

  toko.pane.tab.addBinding(p, 'nrLines', { min: 5, max: 500, step: 5 });

  //
  //  x direction controls
  //
  const fx = toko.pane.tab.addFolder({
    title: 'x direction',
  });

  toko.addEasingSelector(fx, p, {
    typeKey: 'easingTypeX',
    directionKey: 'easingDirectionX',
    test: toko.easeLinear,
  });
  fx.addBinding(p, 'onOutsideX', { label: 'on outside' });
  fx.addBinding(p, 'showX', { label: 'show' });

  //
  //  y direction controls
  //
  const fy = toko.pane.tab.addFolder({
    title: 'y direction',
  });

  toko.addEasingSelector(fy, p, {
    typeKey: 'easingTypeY',
    directionKey: 'easingDirectionY',
    test: toko.easeLinear,
  });

  fy.addBinding(p, 'onOutsideY', { label: 'on outside' });
  fy.addBinding(p, 'showY', { label: 'show' });

  //
  //  listen to tweakpane changes
  //
  toko.pane.events.on('change', value => {
    refresh();
  });

  noLoop();
  refresh();

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
    domain: [0, 1],
    reverse: p.reverse,
    nrDuotones: 12,
  };
  //
  //  get colors
  //
  colors = toko.getColorScale(this.p.palette, o);
  //
  //  redraw with updated parameters
  //
  toko.resetSeed();
  redraw();
}

function draw () {
  clear();

  background(colors.duotones[p.duotone].backgroundColor);
  strokeWeight(0.5);
  stroke(colors.duotones[p.duotone].drawColor);
  noFill();

  let easingX = toko.getEasingFunction(p.easingTypeX, p.easingDirectionX);
  let easingY = toko.getEasingFunction(p.easingTypeY, p.easingDirectionY);

  for (let i = 0; i < p.nrLines; i++) {
    let t = map(i, 0, p.nrLines, 0, 1);

    let eX = easingX(t);
    let eY = easingY(t);

    let x = map(t, 0, 1, 0, width);
    let y = map(t, 0, 1, 0, height);

    let xEased = map(eX, 0, 1, 0, width);
    let yEased = map(eY, 0, 1, 0, height);

    let xInner, xOuter, yInner, yOuter;

    if (p.onOutsideX) {
      xOuter = xEased;
      xInner = x;
    } else {
      xOuter = x;
      xInner = xEased;
    }

    if (p.onOutsideY) {
      yOuter = yEased;
      yInner = y;
    } else {
      yOuter = y;
      yInner = yEased;
    }

    if (p.showX) {
      beginShape();
      vertex(xOuter, 0);
      vertex(xInner, height / 2);
      vertex(xOuter, height);
      endShape();
    }

    if (p.showY) {
      beginShape();
      vertex(0, yOuter);
      vertex(width / 2, yInner);
      vertex(width, yOuter);
      endShape();
    }
  }
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
