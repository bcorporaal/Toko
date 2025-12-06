//---------------------------------------------
//
//  COLOR GRID
//
//---------------------------------------------

//---------------------------------------------
//
//  TOKOWRAPPER INITIALIZATION
//
//---------------------------------------------
let tokoWrapper = new TokoWrapper({
  title: 'Color grid',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let p = {
  steps: 10,
  interpolated: false,
  collections: toko.COLOR_COLLECTIONS,
  collection: 'basic',
  palette: 'westCoast',
  inverse: false,
  reverse: false,
  grid: true,
};

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.addPaletteSelector(panelObject.primaryTab, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
    grid: true,
  });
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'steps', { min: 2, max: 100, step: 1, label: 'steps per side' });
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'grid', { label: 'draw grid' });
  panelObject.primaryTab.addBinding(p, 'interpolated', { label: 'interpolated' });
  panelObject.primaryTab.addBinding(p, 'reverse', { label: 'reverse palette' });
  panelObject.primaryTab.addBinding(p, 'inverse', { label: 'invert bgnd' });
}

//---------------------------------------------
//
//  SETUP - standard p5.js setup function
//
//---------------------------------------------
function setup () {
  let p5Canvas = createCanvas(100, 100, tokoWrapper.renderMode);
  p5Canvas.parent(tokoWrapper.sketchElementId);
  tokoWrapper.storeCanvas(p5Canvas);
}

//---------------------------------------------
//
//  REFRESH - called when a parameter changes
//
//---------------------------------------------
function refresh () {
  //
  //  set domain range to number of steps
  //
  const o = {
    domain: [0, p.steps * p.steps],
    reverse: p.reverse,
  };
  //
  //  get colors
  //
  colors = toko.getColorScale(p.palette, o);
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  clear();
  noStroke();

  let bgndColor = colors.backgroundColor(p.inverse);
  let drawColor = colors.drawColor(p.inverse);

  background(bgndColor);
  if (p.grid) {
    stroke(bgndColor);
    strokeWeight(1);
  }

  let m = 25; // margin
  let s = 0; // spacing
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

  noLoop();
}
