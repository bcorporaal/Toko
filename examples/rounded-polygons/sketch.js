//---------------------------------------------
//
//  ROUNDED POLYGONS
//
//---------------------------------------------

let pointRNG;

//---------------------------------------------
//
//  TOKOWRAPPER INITIALIZATION
//
//---------------------------------------------
let tokoWrapper = new TokoWrapper({
  title: 'Rounded polygons',
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
  pointSeed: 'ABCDEF',
  steps: 10,
  radius: { min: 50, max: 400, step: 1 },
  cornerRadius: 50,
  interpolated: false,
  collections: toko.COLOR_COLLECTIONS,
  collection: 'basic',
  palette: 'westCoast',
  inverse: true,
  plotPoints: true,
};

pointRNG = new Toko.RNG();

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.addRandomSeedControl(panelObject.primaryTab, p, {
    seedStringKey: 'pointSeed',
    label: 'point seed',
    rng: pointRNG,
  });

  panelObject.primaryTab.addBlade({ view: 'separator' });

  panelObject.addPaletteSelector(panelObject.primaryTab, p, {
    index: 4,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
    grid: true,
  });
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'steps', { min: 3, max: 30, step: 1, label: 'steps' });
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'cornerRadius', { min: 0, max: 250, step: 1 });
  panelObject.primaryTab.addBinding(p, 'plotPoints');
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
  //  refresh RNG
  //
  pointRNG.resetSeed();
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
  noStroke();
  fill(drawColor);

  const centerX = width / 2;
  const centerY = height / 2;
  let vertices = [];

  stroke(drawColor);
  strokeWeight(1);
  noFill();

  for (let i = 0; i < p.steps; i++) {
    let angle = map(i, 0, p.steps, 0, TWO_PI);
    let radius = pointRNG.random(p.radius.min, p.radius.max);
    let x = centerX + Math.cos(angle) * radius;
    let y = centerY + Math.sin(angle) * radius;
    vertices.push({ x: x, y: y });
    if (p.plotPoints) {
      circle(x, y, 8);
    }
  }

  toko.plotRoundedVertices(vertices, p.cornerRadius, true);

  noLoop();
}
