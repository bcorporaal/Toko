//---------------------------------------------
//
//  FILE DROP
//
//---------------------------------------------

let img;
let somethingDropped = false;

let tokoWrapper = new TokoWrapper({
  title: 'File drop',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
  acceptDroppedFiles: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let p = {
  pointSize: 10,
  pointSpacing: 10,
  maxPoints: 1000,
  threshold: { min: 0, max: 128 },
};

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.primaryTab.addBinding(p, 'pointSize', {
    min: 1,
    max: 100,
    step: 1,
  });

  panelObject.primaryTab.addBinding(p, 'pointSpacing', {
    min: 5,
    max: 100,
    step: 1,
  });

  panelObject.primaryTab.addBinding(p, 'threshold', {
    min: 0,
    max: 255,
    step: 1,
  });

  panelObject.primaryTab.addBinding(p, 'maxPoints', {
    min: 1,
    max: 10000,
    step: 100,
  });
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
function refresh () {}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  //  nothing much to do here until an image is dropped
  if (!somethingDropped) {
    background('#62BFAD');
    fill('white');
    textFont('Udon mono web');
    textAlign(CENTER, CENTER);
    textSize(30);
    text('Drop a PNG or JPG file on the canvas', width / 2, height / 2);
  } else {
    plotImage();
  }
}

//
//  plot the dropped image
//
function plotImage () {
  somethingDropped = true;
  clear();
  background('white');
  noStroke();

  imageWidth = img.width;
  imageHeight = img.height;
  img.loadPixels();

  let points = toko.poissonDisk(width, height, p.pointSpacing);
  let nrPoints = Math.min(points.length, p.maxPoints);

  toko.shuffle(points);

  let xScale = imageWidth / width;
  let yScale = imageHeight / height;

  for (let i = 0; i < nrPoints; i++) {
    let x = points[i].x;
    let y = points[i].y;
    let rx = Math.round(x * xScale);
    let ry = Math.round(y * yScale);
    fill(toko.getPixelColor(img, rx, ry, imageWidth));
    if (toko.pixelThreshold(img, rx, ry, imageWidth, p.threshold.min, p.threshold.max)) {
      circle(x, y, p.pointSize);
    }
  }
  noLoop();
}

function receivedFile (file) {
  //
  //  check and load the received file
  //
  console.log(`Toko - receivedFile - received a ${file.subtype} file.`);

  if (file.subtype == 'png' || file.subtype == 'jpg' || file.subtype == 'jpeg') {
    loadImage(file.data, imageLoaded);
  } else {
    console.log(`${file.subtype} files are not accepted.`);
  }
}

function imageLoaded (loadedImage) {
  img = loadedImage;
  plotImage();
}
