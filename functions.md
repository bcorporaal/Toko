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
setSeed('mySeed');
const num1 = random(0, 100);
setSeed('mySeed');
const num2 = random(0, 100); // num1 === num2

// Get current seed
const currentSeed = getSeed();

// Generate a random seed
const newSeed = randomSeed();
setSeed(newSeed);

// Reset seed to restart the sequence
resetSeed();

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
const colors = toko.getColorScale('viridis', { steps: 10 });

// Use colors with scale function
fill(colors.scale(0.0)); // First color (at domain start)
fill(colors.scale(0.5)); // Middle color
fill(colors.scale(1.0)); // Last color (at domain end)

// Get background and draw colors
const bgColor = colors.backgroundColor();
const drawColor = colors.drawColor();
```

### Create Custom Color Scale

```javascript
// Create scale from custom colors
const customColors = ['#ff0000', '#00ff00', '#0000ff'];
const scale = toko.createColorScale(customColors);

// Create scale with extra contrast colors
const extraColors = ['#ffffff', '#000000'];
const scaleWithContrast = toko.createColorScale(customColors, {}, extraColors);
```

### Palette Navigation

```javascript
// Get next palette
const next = toko.getNextPalette('viridis');

// Get previous palette
const prev = toko.getPreviousPalette('viridis');

// Get random palette
const random = toko.getRandomPalette('viridis');

// Get palette of specific type
const nextWarm = toko.getNextPalette('viridis', 'warm', true);
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
const colors = toko.getColorScale('viridis', {
  steps: 10, // Number of color steps
  reverse: false, // Reverse the palette
  sort: false, // Sort colors by brightness
  constrainContrast: false, // Limit contrast
  domain: [0, 1], // Input domain
  mode: 'oklab', // Color space (oklab, rgb, hsl, etc.)
  useEasing: false, // Use easing for color interpolation
  easing: toko.easeInOutQuad, // Easing function
});
```

## Utility Classes

### Grid

```javascript
// Create a grid
const grid = new toko.Grid(0, 0, width, height);

// Set base grid structure
grid.setBaseGrid(10, 10); // 10 columns, 10 rows

// Split recursively
grid.splitRecursive(3, 0.5, 10, toko.Grid.SPLIT_LONGEST);

// Access grid cells
const cells = grid.cells;
cells.forEach(cell => {
  fill(random(255));
  rect(cell.x, cell.y, cell.width, cell.height);
});

// Gather all unique corner points
const points = grid.gatherPoints();
points.forEach(point => {
  circle(point.x, point.y, 5);
});

// Pack grid with different cell shapes
const cellShapes = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
];
grid.packGrid(20, 20, cellShapes, true, true);
```

### HexGrid

```javascript
// Create a hexagonal grid
const hexGrid = new toko.HexGrid('pointy', new toko.HexPoint(30, 30), new toko.HexPoint(width / 2, height / 2));

// Create and add hexagons
const hex = hexGrid.createHexagon(0, 0, 0, { value: 42 });

// Get hexagon at position
const existingHex = hexGrid.getHexagon(0, 0, 0);

// Get hexagon corners in pixel coordinates
const corners = hexGrid.getHexCorners(hex);
beginShape();
corners.forEach(corner => {
  vertex(corner.x, corner.y);
});
endShape(CLOSE);

// Convert between hex and pixel coordinates
const pixelPos = hexGrid.hexToPixel(hex);
const hexCoord = hexGrid.pixelToHex(new toko.HexPoint(mouseX, mouseY));

// Create rectangular grid of hexagons
hexGrid.createRectangularGrid(10, 10);

// Create hexagonal grid pattern
hexGrid.createHexagonalGrid(5); // radius of 5

// Get neighbors
const neighbors = hexGrid.getNeighbors(0, 0, 0);
```

### QuadTree

```javascript
// Create a quadtree with boundary rectangle
const boundary = new toko.QuadTreeRectangle(width / 2, height / 2, width, height);
const quadTree = new toko.QuadTree(boundary, 4); // capacity of 4

// Insert points
quadTree.insert(new toko.QuadTreePoint(100, 100, { id: 'point1' }));
quadTree.insert(new toko.QuadTreePoint(200, 150, { id: 'point2' }));

// Query points in a rectangular region
const rect = new toko.QuadTreeRectangle(50, 50, 100, 100);
const pointsInRect = quadTree.query(rect);

// Query points in a circular region
const circle = new toko.QuadTreeCircle(150, 150, 50);
const pointsInCircle = quadTree.query(circle);

// Find closest points
const closest = quadTree.closest(new toko.QuadTreePoint(100, 100), 3, 100);

// Iterate over all points
quadTree.forEach(point => {
  circle(point.x, point.y, 5);
});
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
const stops = [
  { offset: 0, color: '#ff0000' },
  { offset: 1, color: '#0000ff' },
];
toko.linearGradient(0, 0, width, 0, stops);
rect(0, 0, width, height);

// Multi-stop linear gradient
const multiStops = [
  { offset: 0, color: 'red' },
  { offset: 0.5, color: 'yellow' },
  { offset: 1, color: 'blue' },
];
toko.linearGradient(50, 0, 50, 100, multiStops);
ellipse(50, 50, 80, 80);

// Radial gradient
const radialStops = [
  { offset: 0, color: '#ffffff' },
  { offset: 1, color: '#000000' },
];
toko.radialGradient(width / 2, height / 2, 0, width / 2, height / 2, 100, radialStops);
ellipse(width / 2, height / 2, 200, 200);

// Conic (conical) gradient
const conicStops = [
  { offset: 0, color: '#ff0000' },
  { offset: 0.17, color: '#ff8000' },
  { offset: 0.33, color: '#ffff00' },
  { offset: 0.5, color: '#00ff00' },
  { offset: 0.67, color: '#0080ff' },
  { offset: 0.83, color: '#8000ff' },
  { offset: 1, color: '#ff0000' },
];
toko.conicGradient(0, width / 2, height / 2, conicStops);
ellipse(width / 2, height / 2, 160, 160);

// Create gradient stops from Toko color scale
const colors = toko.getColorScale('sunset', { steps: 10 });
const gradientStops = toko.makeGradientStops(colors, 20);
toko.linearGradient(0, 0, width, 0, gradientStops);
rect(0, 0, width, height);
```

### Shadow Effects

```javascript
// Simple drop shadow
toko.shadow(5, 5, 10, 'rgba(0, 0, 0, 0.3)');
fill(255, 0, 0);
rect(50, 50, 100, 100);

// Glow effect
toko.shadow(0, 0, 20, 'rgba(255, 255, 0, 0.8)');
fill(255, 255, 0);
ellipse(100, 100, 80, 80);
```

### Grain Effect

```javascript
// Add simple grain to the canvas
toko.addSimpleGrain(10); // Light grain (0-255 range)

// Add channel-specific grain
toko.addChannelGrain(
  { red: 10, green: 20, blue: 10 }, // Strength per channel
  { red: -5, green: 0, blue: 5 }, // Shift per channel
);

// Create warm grain effect
toko.addChannelGrain({ red: 15, green: 10, blue: 5 }, { red: 10, green: 5, blue: 0 });
```

### Shapes

```javascript
// Draw polygons
toko.plotPolygon(width / 2, height / 2, 50, 6, 0); // Hexagon
toko.plotPolygon(200, 200, 80, 3, PI / 4); // Rotated triangle

// Get polygon vertices
const vertices = toko.polygonVertices(width / 2, height / 2, 50, 8, PI / 4);
beginShape();
vertices.forEach(vertex => {
  vertex(vertex.x, vertex.y);
});
endShape(CLOSE);

// Plot vertices directly
const customVertices = [createVector(100, 100), createVector(200, 100), createVector(150, 200)];
toko.plotVertices(customVertices); // Closed shape
toko.plotVertices(customVertices, OPEN); // Open shape
```

### Transformations

```javascript
// Rotate around a specific point
toko.rotateAround(width / 2, height / 2, PI / 4);
rect(0, 0, 100, 100);

// Rotate around mouse position
toko.rotateAround(mouseX, mouseY, frameCount * 0.01);
triangle(0, 0, 50, 0, 25, 50);

// Scale around a specific point
toko.scaleAround(width / 2, height / 2, 1.5);
rect(0, 0, 100, 100);

// Scale around mouse with pulsing effect
let scale = 1 + sin(frameCount * 0.1) * 0.5;
toko.scaleAround(mouseX, mouseY, scale);
ellipse(0, 0, 50, 50);
```

### Color Utilities

```javascript
// Create color with alpha transparency
const redWithAlpha = toko.colorAlpha('#ff0000', 128); // 50% opacity
const blue = toko.colorAlpha('#0000ff'); // Full opacity
fill(redWithAlpha);
rect(50, 50, 100, 100);
```

## Noise Functions

```javascript
// Create noise instance with seed (string or number)
const noise = toko.openSimplexNoise('mySeed');
// or
const noise2 = toko.openSimplexNoise(42);

// Generate 2D noise
const value2D = noise.noise2D(10.5, 20.3);

// Generate 3D noise
const value3D = noise.noise3D(10.5, 20.3, 5.7);

// Generate 4D noise
const value4D = noise.noise4D(10.5, 20.3, 5.7, 2.1);

// Use in animation
for (let x = 0; x < width; x += 10) {
  for (let y = 0; y < height; y += 10) {
    const n = noise.noise2D(x * 0.01, y * 0.01);
    fill(n * 255);
    rect(x, y, 10, 10);
  }
}
```

## Utility Functions

### Pulse Animation

```javascript
// Create a slow pulsing effect
const alpha = toko.pulse(0.02);
fill(255, 255, 255, alpha * 255);
circle(width / 2, height / 2, 100);

// Create a fast pulsing effect for size
const size = toko.pulse(0.1) * 50 + 25;
circle(width / 2, height / 2, size);
```

## Easing Functions

Toko provides a comprehensive set of easing functions for smooth animations. Each function takes a parameter `t` (0-1) and returns an eased value (0-1).

### Basic Easing Functions

```javascript
// Linear (no easing)
const linear = toko.easeLinear(0.5); // Returns 0.5

// Sine easing
const inSine = toko.easeInSine(0.5);
const outSine = toko.easeOutSine(0.5);
const inOutSine = toko.easeInOutSine(0.5);

// Quadratic easing
const inQuad = toko.easeInQuad(0.5); // Returns 0.25
const outQuad = toko.easeOutQuad(0.5);
const inOutQuad = toko.easeInOutQuad(0.5);

// Cubic easing
const inCubic = toko.easeInCubic(0.5); // Returns 0.125
const outCubic = toko.easeOutCubic(0.5);
const inOutCubic = toko.easeInOutCubic(0.5);

// Quartic easing
const inQuart = toko.easeInQuart(0.5);
const outQuart = toko.easeOutQuart(0.5);
const inOutQuart = toko.easeInOutQuart(0.5);

// Quintic easing
const inQuint = toko.easeInQuint(0.5);
const outQuint = toko.easeOutQuint(0.5);
const inOutQuint = toko.easeInOutQuint(0.5);

// Exponential easing
const inExpo = toko.easeInExpo(0.5);
const outExpo = toko.easeOutExpo(0.5);
const inOutExpo = toko.easeInOutExpo(0.5);

// Circular easing
const inCirc = toko.easeInCirc(0.5);
const outCirc = toko.easeOutCirc(0.5);
const inOutCirc = toko.easeInOutCirc(0.5);

// Back easing (with overshoot)
const inBack = toko.easeInBack(0.5);
const outBack = toko.easeOutBack(0.5);
const inOutBack = toko.easeInOutBack(0.5);
// Custom magnitude
const customBack = toko.easeInBack(0.5, 2.0);

// Elastic easing (with bounce)
const inElastic = toko.easeInElastic(0.5);
const outElastic = toko.easeOutElastic(0.5);
const inOutElastic = toko.easeInOutElastic(0.5);
// Custom magnitude (0-1)
const customElastic = toko.easeInElastic(0.5, 0.8);

// Bounce easing
const inBounce = toko.easeInBounce(0.5);
const outBounce = toko.easeOutBounce(0.5);
const inOutBounce = toko.easeInOutBounce(0.5);

// Extra smooth easing (Ken Perlin smoothstep)
const smoother = toko.easeInOutSmoother(0.5);
```

### Get Easing Function by Type

```javascript
// Get easing function dynamically
const easeFunc = toko.getEasingFunction(toko.EASE_QUAD, toko.EASE_IN_OUT);
const result = easeFunc(0.5);

// Use in animation
function draw() {
  const t = (frameCount % 120) / 120; // 0 to 1 over 120 frames
  const eased = toko.easeInOutQuad(t);
  const x = eased * width;
  circle(x, height / 2, 50);
}
```
