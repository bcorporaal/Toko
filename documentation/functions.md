# Function Reference

An overview of some of the functionality in Toko. See the included example sketches for more details.

### `new TokoWrapper(options)`

Creates a new TokoWrapper instance with the specified configuration options.

**Parameters:**

- `{Object} [options={}]` - Configuration options
  - `{string} [options.title='untitled sketch']` - Title for the sketch
  - `{string} [options.sketchElementId='sketch-canvas']` - ID of the canvas container element
  - `{Object} [options.canvasSize=TokoWrapper.SIZE_DEFAULT]` - Canvas size configuration
  - `{boolean} [options.useParameterPanel=true]` - Enable parameter panel
  - `{boolean} [options.hideParameterPanelOnStart=false]` - Hide panel initially
  - `{boolean} [options.showCanvasSizeOptions=false]` - Show canvas size controls
  - `{boolean} [options.showSaveSketchButton=false]` - Show save button
  - `{boolean} [options.saveSettingsWithSketch=false]` - Save settings with sketch
  - `{boolean} [options.acceptDroppedSettings=true]` - Accept dropped settings files
  - `{boolean} [options.acceptDroppedFiles=false]` - Accept dropped image files
  - `{boolean} [options.captureFrames=false]` - Enable frame capture
  - `{Array} [options.additionalCanvasSizes=[]]` - Additional canvas size options
  - `{string} [options.seedString='']` - Default seed string
  - `{number} [options.debounceDelay=100]` - Debounce delay for parameter changes

**Example:**

```javascript
const wrapper = new TokoWrapper({
  title: 'My Sketch',
  canvasSize: TokoWrapper.SIZE_4K,
  useParameterPanel: true,
  showSaveSketchButton: true,
});
```

### Canvas Size Constants

TokoWrapper provides predefined canvas sizes for common use cases:

```javascript
TokoWrapper.SIZE_DEFAULT; // 800x800
TokoWrapper.SIZE_FULL; // Full window
TokoWrapper.SIZE_1080P; // 1920x1080
TokoWrapper.SIZE_1080P_PORTRAIT; // 1080x1920
TokoWrapper.SIZE_4K; // 3840x2160
TokoWrapper.SIZE_4K_PORTRAIT; // 2160x3840
TokoWrapper.SIZE_IPHONE_11_WALLPAPER; // 1436x3113
TokoWrapper.SIZE_WIDE_SCREEN; // 2560x1440
TokoWrapper.SIZE_MACBOOK_14_WALLPAPER; // 3024x1964
TokoWrapper.SIZE_MACBOOK_16_WALLPAPER; // 3072x1920
```

### Parameter Panel Integration

TokoWrapper integrates with Tweakpane to provide interactive parameter controls:

```javascript
// Add controls to the parameter panel
function addPanelControls(panel) {
  // Basic controls
  panel.primaryTab.addBinding(p, 'steps', { min: 2, max: 20 });
  panel.primaryTab.addBinding(p, 'rotation', { min: 0, max: TWO_PI });

  // Color palette selector
  panel.addPaletteSelector(panel.primaryTab, p, {
    collectionKey: 'collection',
    paletteKey: 'palette',
    sorted: true,
    navButtons: true,
  });

  // Blend mode selector
  panel.addBlendModeSelector(panel.primaryTab, p, 'blendMode');
}
```

### Capture System

TokoWrapper includes a comprehensive capture system for recording videos and saving images:

```javascript
// Capture options
const wrapper = new TokoWrapper({
  captureFrames: true,
  captureOptions: {
    format: 'mp4', // mp4, webm, png, jpg, gif, webp
    framerate: 30, // 15, 24, 25, 30, 60
    duration: 300, // Number of frames to record
    fixedDuration: true, // Use fixed duration
    refreshBeforeCapture: true, // Refresh sketch before recording
  },
});
```

### File Handling

TokoWrapper supports drag-and-drop functionality:

```javascript
const wrapper = new TokoWrapper({
  acceptDroppedSettings: true, // Accept .json settings files
  acceptDroppedFiles: true, // Accept image files
});

// Handle dropped files
function fileDropped(file) {
  if (file.type === 'application/json') {
    // Load settings
    loadSettings(file);
  } else if (file.type.startsWith('image/')) {
    // Load image
    loadImage(file, img => {
      // Use the image in your sketch
    });
  }
}
```

### Save Functionality

```javascript
const wrapper = new TokoWrapper({
  showSaveSketchButton: true,
  saveSettingsWithSketch: true,
});

// Save functions are automatically added to the parameter panel
// when showSaveSketchButton is true
```

## Core Library

### `toko.getInfo()`

Returns information about the toko library and detected p5.js variant.

```javascript
const info = toko.getInfo();
console.log(`Using ${info.name} v${info.version} with ${info.variant}`);
// Output: "Using Toko v0.0.1 with p5v2"
```

**Returns:**

- `{Object}` Library information object
  - `{string} name` - The library name ("Toko")
  - `{string} version` - The library version
  - `{string} variant` - The detected p5.js variant (p5v1, p5v2, q5, or unknown)

### `toko.detectVariant()`

Detects the current p5.js variant.

```javascript
const variant = toko.detectVariant();
switch (variant) {
  case 'q5':
    console.log('Using q5.js');
    break;
  case 'p5v2':
    console.log('Using p5.js v2');
    break;
  case 'p5v1':
    console.log('Using p5.js v1');
    break;
  default:
    console.log('No supported library detected');
}
```

**Returns:**

- `{string}` The detected p5.js variant

## Random Functions

Toko provides additional random number functionality with seed control and shortcuts.

### Seed Management

```javascript
// Set a specific seed for reproducible randomness
setSeed(42);
const num1 = random(0, 100);
setSeed(42);
const num2 = random(0, 100); // num1 === num2

// Get current seed
const currentSeed = getSeed();

// Generate a random seed
const newSeed = randomSeed();
setSeed(newSeed);

// Navigate through seed sequence
const next = nextSeed();
const prev = previousSeed();
```

### Random Number Generation

```javascript
// Basic random numbers
const decimal = random(); // 0 to 1
const ranged = random(10, 20); // 10 to 20

// Random integers
const dice = intRange(1, 6); // 1 to 6
const index = intRange(0, array.length - 1);

// Random boolean
if (randomBool()) {
  console.log('Heads!');
}

// Stepped random numbers
const stepped = steppedRandom(0, 10, 2); // Returns 0, 2, 4, 6, 8, or 10
```

### String and Character Generation

```javascript
// Random characters
const letter = randomChar(); // Random lowercase letter
const digit = randomChar('0123456789'); // Random digit

// Random strings
const word = randomString(5); // Random 5-letter word
const password = randomString(8, 'abcdefghijklmnopqrstuvwxyz0123456789');
```

### Array and Sequence Functions

```javascript
// Shuffle arrays
const cards = ['A', 'K', 'Q', 'J'];
shuffle(cards); // Shuffles in place

// Random sequences
const sequence = intSequence(1, 5); // [3, 1, 5, 2, 4] (random order)

// Random vectors
const direction = random2DVector(); // Random 2D unit vector
```

### Poisson Disk Sampling

```javascript
// Generate evenly distributed points
const points = poissonDisk(400, 300, 20);
points.forEach(point => {
  circle(point.x, point.y, 5);
});
```

## Color Palettes

p5.toko includes an extensive collection of curated color palettes.

### Basic Usage

```javascript
// Get a color scale
const colors = toko.getColorScale('westCoast', { steps: 10 });

// Use colors
fill(colors.scale(0)); // First color
fill(colors.scale(5)); // Middle color
fill(colors.scale(9)); // Last color

// Get background and draw colors
const bgColor = colors.backgroundColor();
const drawColor = colors.drawColor();
```

### Available Palettes

p5.toko includes palettes from:

- [Chromotome](https://github.com/kgolid/chromotome) by Kjetil Midtgarden Golid. MIT License.
- [D3](https://github.com/d3/d3) by Mike Bostock and others. ISC License.
- [Feathers](https://github.com/shandiya/feathers) by Shandiya Balasubramaniam. MIT License.
- [Lospec](https://lospec.com/palette-list) by various contributors. Unknown license.
- [Metbrewer](https://github.com/BlakeRMills/MetBrewer) by Blake Robert Mills. CC0-1.0 License.
- [MoMAColors](https://github.com/BlakeRMills/MoMAColors) by Blake Robert Mills. MIT License.

### Color Options

```javascript
const colors = toko.getColorScale('westCoast', {
  steps: 10, // Number of color steps
  reverse: false, // Reverse the palette
  sort: false, // Sort colors by brightness
  constrainContrast: false, // Limit contrast
  domain: [0, 1], // Input domain
  mode: 'oklab', // Color space
});
```

## Utility Classes

### Grid

```javascript
// Create a grid
const grid = new toko.Grid(10, 10, width, height);

// Access grid cells
const cell = grid.getCell(5, 3);
console.log(cell.x, cell.y, cell.width, cell.height);

// Iterate through all cells
grid.forEachCell((cell, col, row) => {
  fill(random(255));
  rect(cell.x, cell.y, cell.width, cell.height);
});
```

### HexGrid

```javascript
// Create a hexagonal grid
const hexGrid = new toko.HexGrid(20, 20, 30);

// Get hexagon at position
const hex = hexGrid.getHex(5, 3);
const vertices = hex.vertices();

// Draw hexagon
beginShape();
vertices.forEach(vertex => {
  vertex(vertex.x, vertex.y);
});
endShape(CLOSE);
```

### QuadTree

```javascript
// Create a quadtree
const quadTree = new toko.QuadTree(0, 0, width, height);

// Insert points
quadTree.insert(new toko.QuadTreePoint(100, 100));
quadTree.insert(new toko.QuadTreePoint(200, 150));

// Query points in a region
const points = quadTree.query(new toko.QuadTreeRectangle(50, 50, 100, 100));
```

### RNG (Random Number Generator)

```javascript
// Create a custom RNG instance
const rng = new toko.RNG(42);

// Use the RNG
const num = rng.random(0, 100);
const bool = rng.randomBool();
const char = rng.randomChar();
```

## Visual Effects

### Gradients

These only work in P2D render mode.

```javascript
// Linear gradient
const gradient = toko.linearGradient(0, 0, width, 0, [
  { color: color(255, 0, 0), position: 0 },
  { color: color(0, 0, 255), position: 1 },
]);

// Radial gradient
const radialGrad = toko.radialGradient(width / 2, height / 2, 0, width / 2, height / 2, 100, [
  { color: color(255, 255, 255), position: 0 },
  { color: color(0, 0, 0), position: 1 },
]);
```

### Grain Effect

```javascript
// Add grain to the canvas
toko.addSimpleGrain(0.1); // Light grain
toko.addChannelGrain(0.2, 0.1); // Channel-specific grain
```

### Shapes

```javascript
// Draw polygons
toko.plotPolygon(width / 2, height / 2, 50, 6, 0); // Hexagon

// Get polygon vertices
const vertices = toko.polygonVertices(width / 2, height / 2, 50, 8, PI / 4);
beginShape();
vertices.forEach(vertex => {
  vertex(vertex.x, vertex.y);
});
endShape(CLOSE);
```

## Noise Functions

```javascript
// Create noise instance
const noise = toko.openSimplexNoise(42);

// Generate noise values
const value2D = noise.noise2D(0.1, 0.2);
const value3D = noise.noise3D(0.1, 0.2, 0.3);
const value4D = noise.noise4D(0.1, 0.2, 0.3, 0.4);
```

## Easing Functions

```javascript
// Basic easing
const eased = toko.easeInOutQuad(0.5); // 0.5

// Get easing function
const easeFunc = toko.getEasingFunction(toko.EASE_CUBIC, toko.EASE_IN_OUT);
const result = easeFunc(0.5);
```
