p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();
let f0, f1, f2, f3, f4, f5, f6;
let colors;

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
  let canvasWidth = 0;  // can be 0 because it is set based on the size in the html
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
    title: "Toko template",                 //  title displayed
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
    seed: 0,
    // grid
    margin: 0,
    rows: 10,
    columns: 2,
    nrLoops: 10,
    minSize: 10,
    gridType: 'recursive',
    cellShapes: '[1,2],[2,1],[2,2]',
    noEmptySpaces: true,
    snapToPixel: true,
    // color
    collections: ['basic','d3','duotone','golid', 'system'],
    collection: 'basic',
    palette: 'westCoast',
    invertBgnd: false,
    invertScale: false,
    useScale: true,
    stroke: true,
    strokeWeight: 0.1,
    strokeAlpha: 100,
    interpolate: true,
  }

  //
  //  add controls for the grid selector
  //
  toko.pane.tab.addSeparator();
  toko.pane.tab.addInput(p, 'gridType', {
    options: {
      recursive: 'recursive',
      packed: 'packed',
    },
  });
  toko.pane.tab.addSeparator();
  toko.pane.tab.addInput(p, 'seed', {
    min: 1,
    max: 2000,
    step: 1
  });

  //
  //  add controls for the base grid rows and columns
  //
  f0 = toko.pane.tab.addFolder({
    title: 'Base grid',
  });
  f0.addInput(p, 'columns', {
    min: 1,
    max: 100,
    step: 1
  });
  f0.addInput(p, 'rows', {
    min: 1,
    max: 100,
    step: 1
  });
  //
  //  add controls for the recursive grid
  //
  f1 = toko.pane.tab.addFolder({
    title: 'Recursive grid',
  });
  f1.addInput(p, 'nrLoops', {
    min: 1,
    max: 25,
    step: 1
  });
  f1.addInput(p, 'minSize', {
    min: 1,
    max: 25,
    step: 1
  });
  //
  //  add controls for the packed grid
  //
  f2 = toko.pane.tab.addFolder({
    title: 'Packed grid',
  });
  f2.addInput(p, 'cellShapes');
  f2.addInput(p, 'noEmptySpaces');
  f2.addInput(p, 'snapToPixel');
  //
  //  add controls to change the colors
  //
  f6 = toko.pane.tab.addFolder({
    title: 'Colors',
  });
  toko.addCollectionSelector(f6, p, 'collections', 'collection', 'palette', 0);
  toko.addPaneNavButtons(f6, p, 'palette', 'collection');
  f6.addInput(p, 'useScale');
  f6.addInput(p, 'invertScale');
  f6.addInput(p, 'interpolate');
  //
  //  add controls to change the colors
  //
  f7 = toko.pane.tab.addFolder({
    title: 'Grid frame',
  });
  f7.addInput(p, 'margin', {
    min: 0,
    max: 100,
    step: 1
  });
  f7.addInput(p, 'invertBgnd');
  f7.addInput(p, 'stroke');
  f7.addInput(p, 'strokeWeight', {
    min: 0.1,
    max: 4,
    step: 0.1
  });
  f7.addInput(p, 'strokeAlpha', {
    min: 0,
    max: 100,
    step: 5
  });
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
  //  reseed the random generator
  //
  Toko.seedRandom(p.seed);

  //
  //  redraw with updated parameters
  //
  redraw();
}

function draw() {
  //---------------------------------------------
  toko.startDraw(); // do not remove
  //---------------------------------------------
  
  let c, n;
  clear();

  //
  //  grid
  //
  //  make grid object with basic positioning and sizing
  gridSet = new Toko.Grid(p.margin,p.margin,width-2*p.margin,height-2*p.margin);
  //  set the base of rows and columns
  gridSet.setBaseGrid(p.columns,p.rows);
  
  if (p.gridType == 'recursive') {
    // split the grid recursively
    gridSet.splitRecursive(p.nrLoops, 0.5, p.minSize, gridSet.SPLIT_MIX);
  } else {
    // pack the grid with cells
    cellShapes = JSON.parse('['+p.cellShapes+']');
    gridSet.packGrid(p.columns,p.rows,cellShapes, p.noEmptySpaces, p.snapToPixel);
  }

  // 
  //
  //  set domain range to number of cells
  //
  n = gridSet.cells.length;
  const o = {
    reverse: p.invertScale,
    domain: [0, n],
  }

  //
  //  get colors
  //
  colors = toko.getColorScale(this.p.palette,o);

  //
  //  set the colors
  //
  background(colors.contrastColors[(p.invertBgnd?1:0)]);
  if (p.stroke) {
    strokeWeight(p.strokeWeight);
    let sc = color(colors.contrastColors[(p.invertBgnd?1:0)]);
    sc.setAlpha(p.strokeAlpha/100*255);
    stroke(sc);
  } else {
    noStroke();
  }
  
  //
  //  plot cells
  //
  for (var i = 0; i < n; i++) {
    if (p.useScale) {
      if (p.interpolate) {
        fill(colors.scale(i));
      } else {
        fill(colors.originalScale(i));
      }
      
    } else {
      fill(colors.contrastColors[(p.invert?0:1)]);
    }
    
    c = gridSet.cells[i];
    rect(c.x,c.y,c.width,c.height);
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