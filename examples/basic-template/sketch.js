//---------------------------------------------
//
//  BASIC TEMPLATE
//
//---------------------------------------------

//---------------------------------------------
//
//  TOKOWRAPPER INITIALIZATION
//
//  TokoWrapper provides:
//  - Canvas management and sizing
//  - Tweakpane parameter panel integration (through Tweakpane)
//  - Frame capture and recording tools (through p5.Capture)
//  - File drop handling
//  - Cross-variant p5.js support (v1, v2, Q5)
//  - Additional lifecycle hooks for setting up the parameter controls and refreshing the sketch
//
//---------------------------------------------
let tokoWrapper = new TokoWrapper({
  //
  //  As an example all the available options are shown here, including those set to default values.
  //  Other example sketches only have the necessary options.
  //

  //
  //  Basic options
  //
  title: 'Basic template', //  title displayed in the browser (default: 'untitled sketch')
  sketchElementId: 'sketch-canvas', //  ID of the canvas container element (default: 'sketch-canvas')
  renderMode: TokoWrapper.RENDER_MODES.P2D, //  render mode: P2D, WEBGL, SVG, or WEBGPU (default: P2D, can be overridden via URL parameter ?r=)
  //
  //  Display options
  //
  addInfoToTitle: true, //  debug option: add render mode and variant to title (default: false)
  showFPS: false, //  show FPS counter on canvas (default: false)
  //
  //  Parameter panel options
  //
  useParameterPanel: true, //  use the tweakpane panel for settings (default: true)
  hideParameterPanelOnStart: false, //  hide the parameter panel by default (show by pressing 'p') (default: false)
  //
  //  Canvas size options
  //
  canvasSize: TokoWrapper.SIZE_DEFAULT, //  canvas size configuration object (default: SIZE_DEFAULT)
  showCanvasSizeOptions: true, //  show canvas size options in the parameter panel (default: false)
  additionalCanvasSizes: [
    //  Example custom canvas size: 1000 x 800 pixels used as default
    {
      name: 'exampleSize',
      width: 1000,
      height: 800,
      pixelDensity: 2,
      useThisSizeAsDefault: true, // if set to false it is in the menu but not the default (default: false)
    },
  ], //  array of additional custom canvas size objects (default: [])
  //
  //  File and save options
  //
  showSaveSketchButton: true, //  show save image button in tweakpane (default: false)
  saveSettingsWithSketch: false, //  save settings JSON file along with the sketch image (default: false)
  acceptDroppedSettings: false, //  accept dropped settings JSON files to load parameters (default: false)
  acceptDroppedFiles: false, //  accept dropped image files for processing (default: false)
  //
  //  Capture options
  //
  captureFrames: false, //  enable frame capture for animation recording (default: false)
  showCaptureOptions: true, //  show capture options in the parameter panel (default: true)
  captureOptions: {
    //  capture configuration options
    format: 'png', //  capture format: 'png', 'jpg', 'webp', 'gif', 'webm', or 'mp4' (default: 'png')
    framerate: 30, //  framerate for video capture: 15, 24, 25, 30, or 60 (default: 30)
    bitrate: 5000, //  bitrate for video capture in kbps (default: 5000)
    quality: 0.95, //  quality for video/image capture, 0-1 range (default: 0.95)
    width: null, //  custom width for capture (null uses canvas width) (default: null)
    height: null, //  custom height for capture (null uses canvas height) (default: null)
    duration: 100, //  duration in frames for fixed duration capture (default: 100)
    autoSaveDuration: null, //  auto-save duration in frames (null disables auto-save) (default: null)
    fixedDuration: false, //  use fixed duration instead of manual stop (default: false)
    refreshBeforeCapture: true, //  refresh the sketch before starting capture (default: true)
    recordButtonOnMainTab: true, //  show record button on main parameters tab (default: true)
  },
  //
  //  Other options
  //
  shiftCanvasForWebGL: true, //  shift the canvas for webgl if enabled to put the origin in the top left corner (default: true)
  seedString: '', //  default seed string for random number generation (default: '')
  debounceDelay: 100, //  debounce delay in milliseconds for parameter changes (default: 100)
  loggingEnabled: true, //  enable logging system (default: true)
  logLevel: 'info', //  log level: 'error', 'warn', 'info', or 'debug' (default: 'info')
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//  This object holds all the parameters for the sketch.
//  Tweakpane can be used to control these parameters.
//
//  When a parameter changes in the Tweakpane panel, TokoWrapper will:
//  1. Update the value in this object
//  2. Call your refresh() function (if defined)
//  3. Trigger a redraw of the canvas
//
//---------------------------------------------
let p = {
  collections: toko.COLOR_COLLECTIONS,
  collection: 'momacolors',
  palette: 'Warhol',
  reverse: false,
  inverse: false,
  interpolated: false,
  size: 80,
  nrSteps: 200,
};

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//  This function is automatically called by TokoWrapper after setup() completes.
//  It receives a panelObject that contains the Tweakpane instance and tabs.
//
//  Integration flow:
//  1. TokoWrapper creates the Tweakpane panel in postSetupHook()
//  2. TokoWrapper looks for a global setupPanelControls() function
//  3. If found, it calls it with the panel object: setupPanelControls(libraryState.tweakpane)
//  4. Add bindings that connect the 'p' object properties to UI controls
//
//  The panelObject structure:
//  - panelObject.primaryTab: The main parameters tab
//  - panelObject.advancedTab: Advanced settings tab (if enabled)
//  - panelObject.captureTab: Capture/recording tab (if enabled)
//
//  When a user changes a control, the value in the 'p' object is automatically
//  updated, and refresh() is called if defined.
//
//---------------------------------------------
function setupPanelControls (panelObject) {
  tokoWrapper.logDebug('setupPanelControls');
  //
  //  Add the tweakpane panel controls for the parameters.
  //  Each addBinding() call creates a UI control.
  //

  //
  //  Add the palette selector, which is a combination of multiple controls.
  //
  panelObject.addPaletteSelector(panelObject.primaryTab, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });
  //
  //  Add other controls.
  //
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'reverse', { label: 'reverse palette' });
  panelObject.primaryTab.addBinding(p, 'inverse', { label: 'invert bgnd' });
  panelObject.primaryTab.addBinding(p, 'interpolated');
  panelObject.primaryTab.addBlade({ view: 'separator' });
  panelObject.primaryTab.addBinding(p, 'size', { min: 0, max: 100, step: 1, label: 'size & angle' });
  panelObject.primaryTab.addBinding(p, 'nrSteps', { min: 1, max: 500, step: 5, label: 'number of steps' });
}

//---------------------------------------------
//
//  SETUP
//
//  This is the standard p5.js setup() function.
//
//---------------------------------------------
function setup () {
  tokoWrapper.logDebug('setup');
  //
  //  Create the p5.js canvas
  //  - The initial size (100, 100) is temporary; TokoWrapper will resize it later.
  //  - tokoWrapper.renderMode sets the render mode (P2D, WEBGL, SVG, or WEBGPU).
  //  - tokoWrapper.renderMode is from the tokoWrapper options, or the URL parameter ?r=.
  //  - tokoWrapper.sketchElementId is the container element from the HTML.
  //
  let p5Canvas = createCanvas(100, 100, tokoWrapper.renderMode);
  p5Canvas.parent(tokoWrapper.sketchElementId);

  //
  //  Store the canvas with TokoWrapper so it can manage sizing, capture, etc.
  //
  tokoWrapper.storeCanvas(p5Canvas);
}

//---------------------------------------------
//
//  REFRESH
//
//  This function is automatically called by TokoWrapper when:
//  - A parameter changes in the Tweakpane panel
//  - The canvas is resized
//  - After setup() completes (in postSetupHook)
//
//  Use this to:
//  - Recalculate values based on new parameters
//  - Regenerate data structures (arrays, grids, etc.)
//  - Parse color strings or other complex parameters
//  - Update any cached calculations
//
//  If you don't need to do anything on parameter changes, you can omit this.
//
//---------------------------------------------
function refresh () {
  //
  //
  //  get colors
  //
  const o = {
    domain: [0, 1], // domain range, [0, 1] is the default
    reverse: p.reverse, // reverse the color scale if true
  };
  colors = toko.getColorScale(p.palette, o);
}

//---------------------------------------------
//
//  DRAW
//
//  This is the standard p5.js draw() function, called automatically p5.js
//  TokoWrapper doesn't modify this.
//
//---------------------------------------------
function draw () {
  clear();
  noStroke();
  rectMode(CENTER);

  //
  //  get duotone colors based on the palette
  //
  let bgndColor = colors.backgroundColor(p.inverse);
  let drawColor = colors.drawColor(p.inverse);

  background(bgndColor);
  stroke(drawColor);
  fill(bgndColor);
  strokeWeight(0.5);

  //
  //  draw the shapes
  //
  push();
  let endAngle = p.size * 0.01 * TWO_PI;
  for (let i = 0; i < 1; i += 1 / p.nrSteps) {
    let angle = i * endAngle;
    let size = (p.size / 100) * width * (1 - i);

    fill(colors.scale(i, !p.interpolated));

    toko.rotateAround(width / 2, height / 2, angle);
    rect(width / 2, height / 2, size, size);
  }
  pop();

  //
  //  draw frame
  //
  strokeWeight(8);
  noFill();
  beginShape();
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  noLoop();
}
