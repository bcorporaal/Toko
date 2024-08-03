p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

let font;

function preload () {
  font = loadFont('../../assets/fonts/ttf/UdonMonoWeb-Regular.ttf');
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
    title: 'Colors', //  title displayed
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
    steps: 2000,
    interpolated: false,
    collections: toko.COLOR_COLLECTIONS,
    collection: 'basic',
    palette: 'donut',
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

  // toko.pane.tab.addBinding(p, 'steps', { min: 2, max: 40, step: 1 });
  // toko.pane.tab.addBinding(p, 'interpolated');
  toko.pane.tab.addBinding(p, 'reverse', { label: 'reverse palette' });
  // toko.pane.tab.addBinding(p, 'sort', { label: 'sort metBrewer' });
  toko.pane.tab.addBinding(p, 'inverse', { label: 'invert bgnd' });
  // toko.pane.tab.addBinding(p, 'constrainContrast', { label: 'limit contrast' });

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
    domain: [0, p.steps],
    reverse: p.reverse,
    sort: p.sort,
    constrainContrast: false,
    useSpectral: false,
    nrDuotones: 12,
  };
  //
  //  get colors
  //
  colors = toko.getColorScale(this.p.palette, o);

  const oSpectral = {
    domain: [0, p.steps],
    reverse: p.reverse,
    sort: p.sort,
    constrainContrast: false,
    useSpectral: true,
    nrDuotones: 12,
  };
  colorsSpectral = toko.getColorScale(this.p.palette, oSpectral);

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
  noFill();
  stroke(drawColor);
  strokeWeight(1);

  // noStroke();
  // fill(drawColor);
  textFont(font);

  let margin = 60;
  let nrRows = 4;
  let rowHeight = (height - 5 * margin) / nrRows;
  let x = margin;
  let y = 0;
  let w = width - 2 * margin;
  let d = w / p.steps;

  //
  //  original palette
  //
  y = margin;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('ORIGINAL COLORS', margin, y - 10);
  stroke(drawColor);

  rect(margin, y, w, rowHeight);

  let nrColors = colors.originalColors.length;
  let cw = w / nrColors;

  colors.originalColors.forEach((col, i) => {
    fill(col);
    rect(margin + i * cw, y, cw, rowHeight);
  });
  noFill();

  //
  //  default scale
  //
  y = 2 * margin + rowHeight;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('COLOR SCALE USING SPECTRAL', margin, y - 10);
  stroke(drawColor);

  for (let i = 0; i < p.steps; i++) {
    let x = margin + i * d;
    stroke(colorsSpectral.scale(i));
    line(x, y, x, y + rowHeight);
  }

  stroke(drawColor);
  noFill();
  rect(margin, y, w, rowHeight);

  //
  //  adjusted scale
  //
  y = 3 * margin + 2 * rowHeight;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('COLOR SCALE WITHOUT SPECTRAL', margin, y - 10);
  stroke(drawColor);

  for (let i = 0; i < p.steps; i++) {
    let x = margin + i * d;
    stroke(colors.scale(i));
    line(x, y, x, y + rowHeight);
  }

  stroke(drawColor);
  noFill();
  rect(margin, y, w, rowHeight);

  //
  //  duotones
  //
  y = 4 * margin + 3 * rowHeight;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('DUOTONES', margin, y - 10);
  stroke(drawColor);

  let nrDuotones = colors.duotones.length;
  let subMargin = 20;
  let subWidth = (w - (nrDuotones - 1) * subMargin) / nrDuotones;

  x = margin;
  stroke(drawColor);
  colors.duotones.forEach((dt, i) => {
    fill(dt.backgroundColor);
    rect(x, y, subWidth, rowHeight / 2);
    fill(dt.drawColor);
    rect(x, y + rowHeight / 2, subWidth, rowHeight / 2);
    x += subMargin + subWidth;
  });

  //---------------------------------------------
  toko.endDraw(); // do not remove
  //---------------------------------------------
}

findDuotones = function (inPalette, minLength, reverse) {
  let nrColors = inPalette.length;
  let duotones = [];

  for (let i = 0; i < nrColors; i++) {
    for (let j = i + 1; j < nrColors; j++) {
      let c1 = inPalette[i];
      let c2 = inPalette[j];

      let contrast = chroma.contrast(c1, c2);

      //
      //  arrange colors by luminance
      //
      let cB, cA;
      let lum1 = chroma(c1).hsl()[2];
      let lum2 = chroma(c2).hsl()[2];

      if (reverse) {
        cA = lum1 < lum2 ? c1 : c2;
        cB = lum1 < lum2 ? c2 : c1;
      } else {
        cA = lum1 > lum2 ? c1 : c2;
        cB = lum1 > lum2 ? c2 : c1;
      }

      duotones.push({
        colors: [cA, cB],
        backgroundColor: cA,
        drawColor: cB,
        contrast: contrast,
      });
    }
  }

  //  sort from high to low
  duotones.sort((a, b) => b.contrast - a.contrast);

  //  interleave from start and middle
  //  [1,2,3,4,5,6] -> [1,4,2,5,3,6]
  const n = duotones.length;
  const mid = Math.floor(n / 2);
  const interleaved = [];
  for (let i = 0; i < mid; i++) {
    interleaved.push(duotones[i]);
    if (i + mid < n) {
      interleaved.push(duotones[i + mid]);
    }
  }
  duotones = [...interleaved];

  //
  //  copy items if there are fewer than minLength
  //
  if (duotones.length < minLength) {
    let needed = minLength - duotones.length;
    while (needed > 0) {
      let itemsToCopy = Math.min(duotones.length, needed);
      duotones.push(...duotones.slice(0, itemsToCopy));
      needed -= itemsToCopy;
    }
  }

  return duotones.slice(0, minLength);
};

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
