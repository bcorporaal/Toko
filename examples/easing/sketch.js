//---------------------------------------------
//
//  EASING
//
//---------------------------------------------

let tokoWrapper = new TokoWrapper({
  title: 'Easing',
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
  collections: toko.COLOR_COLLECTIONS,
  collection: 'judson',
  palette: 'jud_playground',
  reverse: false,
  duotone: 0,
  easingTypeX: toko.EASE_QUAD,
  easingDirectionX: toko.EASE_IN_OUT,
  onOutsideX: true,
  showX: true,
  easingTypeY: toko.EASE_EXPO,
  easingDirectionY: toko.EASE_IN_OUT,
  onOutsideY: false,
  showY: true,
  nrLines: 200,
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
  });

  panelObject.primaryTab.addBinding(p, 'duotone', { min: 0, max: 11, step: 1 });
  panelObject.primaryTab.addBinding(p, 'reverse');

  panelObject.primaryTab.addBlade({ view: 'separator' });

  panelObject.primaryTab.addBinding(p, 'nrLines', { min: 5, max: 500, step: 5 });

  //
  //  x direction controls
  //
  const fx = panelObject.primaryTab.addFolder({
    title: 'x direction',
  });

  panelObject.addEasingSelector(fx, p, {
    typeKey: 'easingTypeX',
    directionKey: 'easingDirectionX',
    test: toko.easeLinear,
  });
  fx.addBinding(p, 'onOutsideX', { label: 'on outside' });
  fx.addBinding(p, 'showX', { label: 'show' });

  //
  //  y direction controls
  //
  const fy = panelObject.primaryTab.addFolder({
    title: 'y direction',
  });

  panelObject.addEasingSelector(fy, p, {
    typeKey: 'easingTypeY',
    directionKey: 'easingDirectionY',
    test: toko.easeLinear,
  });

  fy.addBinding(p, 'onOutsideY', { label: 'on outside' });
  fy.addBinding(p, 'showY', { label: 'show' });
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
    nrDuotones: 12,
  };
  colors = toko.getColorScale(p.palette, o);
  toko.resetSeed();
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  clear();
  background(colors.duotones[p.duotone].backgroundColor);

  strokeWeight(0.5);
  stroke(colors.duotones[p.duotone].drawColor);
  noFill();

  let easingX = toko.getEasingFunction(p.easingTypeX, p.easingDirectionX);
  let easingY = toko.getEasingFunction(p.easingTypeY, p.easingDirectionY);

  for (let i = 0; i < p.nrLines; i++) {
    let t = map(i, 0, p.nrLines, 0, 1);

    let eX = easingX(t);
    let eY = easingY(t);

    let x = map(t, 0, 1, 0, width);
    let y = map(t, 0, 1, 0, height);

    let xEased = map(eX, 0, 1, 0, width);
    let yEased = map(eY, 0, 1, 0, height);

    let xInner, xOuter, yInner, yOuter;

    if (p.onOutsideX) {
      xOuter = xEased;
      xInner = x;
    } else {
      xOuter = x;
      xInner = xEased;
    }

    if (p.onOutsideY) {
      yOuter = yEased;
      yInner = y;
    } else {
      yOuter = y;
      yInner = yEased;
    }

    if (p.showX) {
      beginShape();
      vertex(xOuter, 0);
      vertex(xInner, height / 2);
      vertex(xOuter, height);
      endShape();
    }

    if (p.showY) {
      beginShape();
      vertex(0, yOuter);
      vertex(width / 2, yInner);
      vertex(width, yOuter);
      endShape();
    }
  }
  noLoop();
}
