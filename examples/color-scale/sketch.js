//---------------------------------------------
//
//  COLOR SCALE
//
//---------------------------------------------

let font;

let tokoWrapper = new TokoWrapper({
  title: 'Color scale',
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
  steps: 2000,
  interpolated: false,
  collections: toko.COLOR_COLLECTIONS,
  collection: 'basic',
  palette: 'fullRainbow',
  inverse: false,
  reverse: false,
  sort: false,
  constrainContrast: false,
  interval: { min: 16, max: 48 },
  file: '',
  easingParameters: [0.25, 0.25, 0.75, 0.75],
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

  panelObject.primaryTab.addBinding(p, 'inverse', { label: 'inverse bgnd' });
  panelObject.primaryTab.addBinding(p, 'reverse', { label: 'reverse palette' });

  panelObject.primaryTab
    .addBlade({
      view: 'cubicbezier',
      value: p.easingParameters,
      expanded: true,
      label: 'easing',
      picker: 'inline',
    })
    .on('change', ev => {
      p.easingParameters = ev.value.comps_;
    });
}

//---------------------------------------------
//
//  SETUP - standard p5.js setup function
//
//---------------------------------------------
async function setup () {
  let p5Canvas = createCanvas(100, 100, tokoWrapper.renderMode);
  p5Canvas.parent(tokoWrapper.sketchElementId);
  tokoWrapper.storeCanvas(p5Canvas);
  font = await loadFont('../../assets/fonts/ttf/UdonMonoWeb-Regular.ttf');
}

//---------------------------------------------
//
//  REFRESH - called when a parameter changes
//
//---------------------------------------------
function refresh () {
  //
  //  palette variation #1
  //
  const o1 = {
    domain: [0, p.steps],
    reverse: p.reverse,
    sort: true,
    constrainContrast: false,
    mode: 'oklab',
    nrDuotones: 12,
    gamma: 1,
  };
  colors1 = toko.getColorScale(p.palette, o1);

  //
  //  palette variation #2
  //
  const o2 = {
    domain: [0, p.steps],
    reverse: p.reverse,
    sort: false,
    constrainContrast: false,
    mode: 'oklab',
    nrDuotones: 12,
    useEasing: true,
    easingParameters: p.easingParameters,
    gamma: 1,
  };
  colors2 = toko.getColorScale(p.palette, o2);
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  clear();
  noStroke();

  let bgndColor = colors1.backgroundColor(p.inverse);
  let drawColor = colors1.drawColor(p.inverse);

  background(bgndColor);
  noFill();
  stroke(drawColor);
  strokeWeight(1);

  textFont(font);

  let margin = 60;
  let nrRows = 4;
  let rowHeight = (height - 5 * margin) / nrRows;
  let x = margin;
  let y = 0;
  let w = width - 2 * margin;
  let d = w / p.steps;

  //
  //  original palette
  //
  y = margin;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('PALETTE COLORS', margin, y - 10);
  stroke(drawColor);

  rect(margin, y, w, rowHeight);

  let nrColors = colors2.originalColors.length;
  let cw = w / nrColors;

  colors2.originalColors.forEach((col, i) => {
    fill(col);
    rect(margin + i * cw, y, cw, rowHeight);
  });
  noFill();

  //
  //  default scale
  //
  y = 2 * margin + rowHeight;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('COLOR SCALE WITHOUT EASING', margin, y - 10);
  stroke(drawColor);

  for (let i = 0; i < p.steps; i++) {
    let x = margin + i * d;
    stroke(colors1.scale(i));
    line(x, y, x, y + rowHeight);
  }

  stroke(drawColor);
  noFill();
  rect(margin, y, w, rowHeight);

  //
  //  adjusted scale
  //
  y = 3 * margin + 2 * rowHeight;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('COLOR SCALE WITH BEZIER EASING', margin, y - 10);
  stroke(drawColor);

  for (let i = 0; i < p.steps; i++) {
    let x = margin + i * d;
    stroke(colors2.scale(i));
    line(x, y, x, y + rowHeight);
  }

  stroke(drawColor);
  noFill();
  rect(margin, y, w, rowHeight);

  //
  //  duotones
  //
  y = 4 * margin + 3 * rowHeight;
  noStroke();
  fill(drawColor);
  textSize(14);
  text('DUOTONES', margin, y - 10);
  stroke(drawColor);

  let nrDuotones = colors1.duotones.length;
  let subMargin = 20;
  let subWidth = (w - (nrDuotones - 1) * subMargin) / nrDuotones;

  x = margin;
  stroke(drawColor);
  colors1.duotones.forEach((dt, i) => {
    fill(dt.backgroundColor);
    rect(x, y, subWidth, rowHeight / 2);
    fill(dt.drawColor);
    rect(x, y + rowHeight / 2, subWidth, rowHeight / 2);
    x += subMargin + subWidth;
  });

  noLoop();
}
