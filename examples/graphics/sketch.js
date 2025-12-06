//---------------------------------------------
//
//  GRAPHICS
//
//---------------------------------------------

let jiggleRNG = new Toko.RNG();

let tokoWrapper = new TokoWrapper({
  title: 'Graphics',
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

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  const fr = panelObject.primaryTab.addFolder({
    title: 'RNG',
  });

  panelObject.addRandomSeedControl(fr, p, {
    seedStringKey: 'seed',
    label: 'seed',
  });

  const fc = panelObject.primaryTab.addFolder({
    title: 'Color & effects',
  });

  panelObject.addPaletteSelector(fc, p, {
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

  const fg = panelObject.primaryTab.addFolder({
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

  const fs = panelObject.primaryTab.addFolder({
    title: 'Shuffle',
  });

  fs.addBinding(p, 'switches', { min: 0, max: 200, step: 1 });
  fs.addBinding(p, 'radius', { min: 0, max: 1, step: 0.1 });
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
  toko.resetSeed();
  const o = {
    domain: [0, p.nrSlices],
    reverse: p.reverseGrad,
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

  noLoop();
}
