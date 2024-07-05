p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

let img;
let somethingDropped = false;

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
    title: 'File drop example', //  title displayed
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
  // let g = new Toko.Grid();

  p = {
    pointSize: 10,
    pointSpacing: 10,
    maxPoints: 1000,
    threshold: { min: 0, max: 128 },
  };

  //
  //  basic controls
  //
  toko.pane.tab.addBinding(p, 'pointSize', {
    min: 1,
    max: 100,
    step: 1,
  });

  toko.pane.tab.addBinding(p, 'pointSpacing', {
    min: 5,
    max: 100,
    step: 1,
  });

  toko.pane.tab.addBinding(p, 'threshold', {
    min: 0,
    max: 255,
    step: 1,
  });

  toko.pane.tab.addBinding(p, 'maxPoints', {
    min: 1,
    max: 10000,
    step: 100,
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
  //  redraw with updated parameters
  //
  redraw();
}

function draw () {
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------

  //  nothing much to do here until an image is dropped
  if (!somethingDropped) {
    background('#62BFAD');
    fill('white');
    textFont('Udon mono web');
    textAlign(CENTER, CENTER);
    textSize(30);
    text('Drop an image file on the canvas', width / 2, height / 2);
  } else {
    plotImage();
  }

  //---------------------------------------------
  toko.endDraw(); // do not remove
  //---------------------------------------------
}

//
//  plot the dropped image
//
function plotImage () {
  somethingDropped = true;
  clear();
  noStroke();

  imageWidth = img.width;
  imageHeight = img.height;
  img.loadPixels();

  let points = toko.poissonDisk(width, height, p.pointSpacing);
  let nrPoints = Math.min(points.length, p.maxPoints);

  toko.shuffle(points);

  let xScale = imageWidth / width;
  let yScale = imageHeight / height;

  for (let i = 0; i < nrPoints; i++) {
    let x = points[i].x;
    let y = points[i].y;
    let rx = Math.round(x * xScale);
    let ry = Math.round(y * yScale);
    fill(toko.getPixelColor(img, rx, ry, imageWidth));
    if (toko.pixelThreshold(img, rx, ry, imageWidth, p.threshold.min, p.threshold.max)) {
      circle(x, y, p.pointSize);
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
  //  check and load the received file
  //
  console.log(`Toko - receivedFile - received a ${file.subtype} file.`);

  if (file.subtype == 'png' || file.subtype == 'jpg') {
    loadImage(file.data, imageLoaded);
  } else {
    console.log(`${file.subtype} files are not accepted.`);
  }
}

function imageLoaded (loadedImage) {
  img = loadedImage;
  plotImage();
}
