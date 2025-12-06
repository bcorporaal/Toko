//---------------------------------------------
//
//  POISSON DISK
//
//---------------------------------------------

let dotQuadtree, points;

let tokoWrapper = new TokoWrapper({
  title: 'Poisson disk',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let pointRNG = new Toko.RNG();
let p = {
  pointSeed: 'POISSON',
  radius: 0.7,
  spacing: 10,
  alpha: 1,
  collections: toko.COLOR_COLLECTIONS,
  collection: 'metbrewer',
  palette: 'archambault',
  inverse: true,
  highlightRadius: 200,
  showEdge: false,
  showHighlight: true,
};

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
  });

  panelObject.primaryTab.addBinding(p, 'inverse', { label: 'invert bgnd' });
  panelObject.primaryTab.addBinding(p, 'alpha', { min: 0, max: 1, step: 0.1 });

  panelObject.primaryTab.addBlade({ view: 'separator' });

  panelObject.primaryTab.addBinding(p, 'radius', { min: 0.1, max: 5, step: 0.1 });
  panelObject.primaryTab.addBinding(p, 'spacing', { min: 5, max: 50, step: 5 });

  panelObject.primaryTab.addBlade({ view: 'separator' });

  panelObject.primaryTab.addBinding(p, 'showHighlight');
  panelObject.primaryTab.addBinding(p, 'highlightRadius', { min: 0, max: 300, step: 5 });
  panelObject.primaryTab.addBinding(p, 'showEdge');
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
  //  create a fresh quadtree
  //
  dotQuadtree = Toko.QuadTree.create();
  //
  //  create the distribution
  //
  points = toko.poissonDisk(width, height, p.spacing);
  //
  //  get the color scale
  //
  const o = {
    domain: [0, 1],
  };

  colors = toko.getColorScale(p.palette, o);
  //
  //  add all points to the quadtree and give each point a color
  //
  let n = points.length;
  for (let i = 0; i < points.length; i++) {
    let quadtreeCircle = new Toko.QuadTreeCircle(points[i].x, points[i].y, p.radius * p.spacing, { id: i });
    dotQuadtree.insert(quadtreeCircle);
    points[i].color = toko.colorAlpha(colors.randomOriginalColor(), 255 * p.alpha);
  }
  //
  //  reset the random seed to get the same output again
  //
  toko.resetSeed();
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

  let areaToCheck = new Toko.QuadTreeCircle(mouseX, mouseY, p.highlightRadius / 2);
  let circlesToCheck = dotQuadtree.query(areaToCheck);

  //
  //  to avoid having to reset all the points back to an unhighlighted state
  //  we're given all the highlighted ones the current framecount as an unique id
  //
  let fc = frameCount;
  circlesToCheck.forEach(circle => {
    points[circle.data.id].fc = fc;
  });

  //
  //  then we're coloring white all the points with the current framecount
  //
  let c;
  for (let i = 0; i < points.length; i++) {
    if (points[i].fc == fc && p.showHighlight) {
      c = toko.colorAlpha('white', 255 * p.alpha);
    } else {
      c = points[i].color;
    }
    fill(c);
    circle(points[i].x, points[i].y, p.radius * p.spacing);
  }
  //
  //  note that we're skipping the actual radius check and
  //  assuming that the quadtree is sufficiently accurate.
  //

  //
  //  for reference show the edge of the circle of influence
  //
  if (p.showEdge) {
    noFill();
    stroke('yellow');
    strokeWeight(1);
    circle(mouseX, mouseY, p.highlightRadius);
  }
}
