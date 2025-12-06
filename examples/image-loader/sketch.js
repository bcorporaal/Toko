//---------------------------------------------
//
//  IMAGE LOADER
//
//---------------------------------------------

let tileLoader;

let tileSet = [
  { id: 1, url: 'tiles/tile_1.png' },
  { id: 2, url: 'tiles/tile_2.png' },
  { id: 3, url: 'tiles/tile_3.png' },
  { id: 4, url: 'tiles/tile_4.png' },
  { id: 5, url: 'tiles/tile_5.png' },
  { id: 6, url: 'tiles/tile_6.png' },
  { id: 7, url: 'tiles/tile_7.png' },
  { id: 8, url: 'tiles/tile_8.png' },
  { id: 9, url: 'tiles/tile_9.png' },
];

//---------------------------------------------
//
//  TOKOWRAPPER INITIALIZATION
//
//---------------------------------------------
let tokoWrapper = new TokoWrapper({
  title: 'Image loader',
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
  tileSize: 64,
};

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  panelObject.primaryTab.addBinding(p, 'tileSize', { min: 16, max: 256, step: 16 });
}

//---------------------------------------------
//
//  PRELOAD - standard p5.js preload function
//  Only works for p5 v1 and Q5, not p5 v2
//
//---------------------------------------------
async function preload () {
  // This function only runs in p5 v1 and Q5
  // p5 v2 will call this from setup
  tileLoader = new toko.ImageLoader(tileSet);
  await tileLoader.preloadAll();
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

  // Only for p5 v2, call preload from setup and await completion
  if (toko.variant === toko.LIBRARY.P5V2) {
    await preload();
  }
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  let tilesX = Math.ceil(width / p.tileSize);
  let tilesY = Math.ceil(height / p.tileSize);

  let offsetX = (width - tilesX * p.tileSize) / 2;
  let offsetY = (height - tilesY * p.tileSize) / 2;

  clear();

  for (let i = 0; i < tilesX; i++) {
    for (let j = 0; j < tilesY; j++) {
      let x = i * p.tileSize + offsetX;
      let y = j * p.tileSize + offsetY;

      let item = toko.random(tileSet);
      let tile = tileLoader.get(item.id);

      image(tile, x, y, p.tileSize, p.tileSize);
    }
  }

  noLoop();
}
