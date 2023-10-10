p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();

function preload() {
  //
  // All loading calls here
  //
}

function setup() {

  //------------------------------------------------------
  //
  //  set base canvas
  //
  let sketchElementId = "sketch-canvas";
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
    title: "Toko basic template",       //  title displayed
    sketchElementId: sketchElementId,   //  id used to create the p5 canvas
    canvasSize: toko.SIZE_DEFAULT,      //  canvas size to use
    //
    //  additional options
    //
    showSaveSketchButton: true,         //  show save image button in tweakpane
    saveSettingsWithSketch: true,       //  save json of settings together with the image
    acceptDroppedSettings: true,        //  accept dropped json files with settings
    useParameterPanel: true,            //  use the tweakpane panel for settings
    showAdvancedOptions: true,          //  show advanced settings in tweakpane, like size
    captureFrames: false,               //  no record option
  });

  //
  //-------------------------------------------------------
  //
  //  sketch parameters
  //
  p = {
    steps: 10,
    interpolated: false,
    collections: ['basic','golid','metbrewer', 'flourish', 'orbifold'],
    collection: 'basic',
    palette: 'westCoast',
  }

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
    paletteKey: 'palette'
  });

  toko.pane.tab.addBinding(p, 'steps', { min: 2, max: 40, step: 1});
  toko.pane.tab.addBinding(p, 'interpolated');

  //
  //  listen to tweakpane changes
  //
  toko.pane.events.on("change", (value) => {
    refresh();
  });
  
  refresh();
  noLoop();

  //---------------------------------------------
  toko.endSetup();
  //---------------------------------------------
}

function refresh() {
  console.log('refresh');
  // console.log(p);

  //
  //  set domain range to number of steps
  //
  const o = {
    domain: [0, p.steps*p.steps],
  }
  //
  //  get colors
  //
  colors = toko.getColorScale(this.p.palette,o);
  //
  //  redraw with updated parameters
  //
  redraw();
}

function draw() {
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------
  
  clear();
  stroke('#fff');
  strokeWeight(2);

  let w = width/p.steps;
  let h = height/p.steps;

  //
  //  draw a grid with the colors from the palette
  //
  for (let i = 0; i < p.steps; i++) {
    for (let j = 0; j < p.steps; j++) {
      if (p.interpolated) {
        fill(colors.scale(i+j*p.steps));
      } else {
        fill(colors.originalScale(i+j*p.steps));
      }
      
      rect(i*w,j*h,w,h);
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

function captureStarted() {
  //
  //  called when capture has started, use to reset visuals
  //
  console.log("Toko - captureStarted");
}

function captureStopped() {
  //
  //  called when capture is stopped, use to reset visuals
  //
  console.log("Toko - captureStopped");
}

function canvasResized() {
  //
  //  called when the canvas was resized
  //
  console.log("Toko - canvasResized");
}

function windowResized() {
  //
  //  resize the canvas when the framing div was resized
  //
  console.log("Toko - windowResized");

  var newWidth = document.getElementById("sketch-canvas").offsetWidth;
  var newHeight = document.getElementById("sketch-canvas").offsetHeight;

  if (newWidth != width || newHeight != height) {
    canvasResized();
  }
}

function receivedFile(file) {
  //
  //  called when a JSON file is dropped on the sketch
  //  tweakpane settings are automatically updated
  //
  console.log("Toko - receivedFile")
}