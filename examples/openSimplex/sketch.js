//---------------------------------------------
//
//  OPENSIMPLEX NOISE
//
//---------------------------------------------
let baseNoise, startFrame;

let tokoWrapper = new TokoWrapper({
  title: 'OpenSimplex noise',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
  showFPS: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let p = {
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

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.addRandomSeedControl(panelObject.primaryTab, p, {
    seedStringKey: 'seed',
    label: 'seed',
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
  });

  panelObject.primaryTab.addBinding(p, 'reverse', { label: 'reverse colors' });
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'cutoff', { min: 0, max: 1, step: 0.1 });
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'frequency', { min: 0, max: 100, step: 5 });
  panelObject.primaryTab.addBinding(p, 'speed', { min: 0, max: 100, step: 1 });
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
}
