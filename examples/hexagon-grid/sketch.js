//---------------------------------------------
//
//  HEXAGON GRID
//
//---------------------------------------------

let tokoWrapper = new TokoWrapper({
  title: 'Hexagon grid',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
hexSizeRNG = new Toko.RNG();
hexPositionRNG = new Toko.RNG();
hexColorRNG = new Toko.RNG();

p = {
  size: 10,
  count: 100,
  scale: 1,
  randomScale: false,
  randomScaleRange: {
    min: 0.5,
    max: 1.5,
  },
  wireframe: false,
  interpolated: false,
  collections: toko.COLOR_COLLECTIONS,
  collection: 'basic',
  palette: 'westCoast',
  inverse: false,
  reverse: false,
  randomColor: false,
  sort: false,
  constrainContrast: false,

  sizeSeed: 'waves',
  positionSeed: 'turtle',
  colorSeed: 'shark',

  blendMode: toko.BLEND_MODE.BLEND,
};

hexPositionRNG.seed = p.positionSeed;
hexSizeRNG.seed = p.sizeSeed;
hexColorRNG.seed = p.colorSeed;

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.addRandomSeedControl(panelObject.primaryTab, p, {
    rng: hexSizeRNG,
    seedStringKey: p.sizeSeed,
    label: 'size seed',
  });

  panelObject.addRandomSeedControl(panelObject.primaryTab, p, {
    rng: hexPositionRNG,
    seedStringKey: p.positionSeed,
    label: 'position seed',
  });

  panelObject.addRandomSeedControl(panelObject.primaryTab, p, {
    rng: hexColorRNG,
    seedStringKey: p.colorSeed,
    label: 'color seed',
  });

  panelObject.primaryTab.addBlade({
    view: 'separator',
  });

  panelObject.addPaletteSelector(panelObject.primaryTab, p, {
    index: 8,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });

  panelObject.primaryTab.addBlade({
    view: 'separator',
  });

  panelObject.addBlendModeSelector(panelObject.primaryTab, p, {
    blendModeKey: 'blendMode',
  });
  panelObject.primaryTab.addBinding(p, 'interpolated');
  panelObject.primaryTab.addBinding(p, 'randomColor');
  panelObject.primaryTab.addBinding(p, 'wireframe');

  panelObject.primaryTab.addBlade({
    view: 'separator',
  });

  panelObject.primaryTab.addBinding(p, 'size', { min: 2, max: 100, step: 1 });
  panelObject.primaryTab.addBinding(p, 'count', { min: 1, max: 20000, step: 50 });
  panelObject.primaryTab.addBinding(p, 'scale', { min: 0, max: 4, step: 0.1 });
  panelObject.primaryTab.addBinding(p, 'randomScale');
  panelObject.primaryTab.addBinding(p, 'randomScaleRange', { min: 0, max: 4, step: 0.1 });
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
  const o = {
    domain: [0, 1],
    reverse: p.reverse,
    sort: p.sort,
    constrainContrast: p.constrainContrast,
    rng: hexColorRNG,
  };

  // get colors
  colors = toko.getColorScale(this.p.palette, o);

  // reset the RNGs
  hexPositionRNG.resetSeed();
  hexSizeRNG.resetSeed();
  hexColorRNG.resetSeed();
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
  stroke(drawColor);
  strokeWeight(1);

  blendMode(p.blendMode);

  // create a grid with pointy orientation
  let cx = width / 2;
  let cy = height / 2;

  const grid = new Toko.HexGrid(
    HexGrid.ORIENTATION_POINTY,
    new Toko.HexPoint(p.size, p.size),
    new Toko.HexPoint(cx, cy),
  );

  // set central hex
  grid.createHexagon(0, 0, 0);

  let n = p.count;
  for (let index = 0; index < n; index++) {
    let pickedOne = false;
    while (!pickedOne) {
      let allHex = grid.getAllHexagons();
      let randomHex = hexPositionRNG.random(allHex);
      let placementOptions = grid.getEmptyNeighbors(randomHex.q, randomHex.r, randomHex.s);
      let newSpot = hexPositionRNG.random(placementOptions);
      if (newSpot) {
        grid.createHexagon(newSpot.q, newSpot.r, newSpot.s);
        pickedOne = true;
      } else {
        // No available spot, break to avoid infinite loop
        pickedOne = true;
      }
    }
  }

  // Plot all hexagons
  const allHexagons = grid.getAllHexagons();
  noFill();
  allHexagons.forEach((hex, index) => {
    if (!p.wireframe) {
      if (p.randomColor) {
        fill(colors.randomColor(!p.interpolated));
      } else {
        fill(colors.scale(index / allHexagons.length, !p.interpolated));
      }
    }

    let sc = p.scale;
    if (p.randomScale) {
      sc = hexSizeRNG.random(p.randomScaleRange.min, p.randomScaleRange.max);
    }
    let coordinates = grid.getHexCorners(hex, null, null, sc);
    beginShape();
    coordinates.forEach(corner => {
      vertex(corner.x, corner.y);
    });
    endShape(CLOSE);
  });

  noLoop();
}
