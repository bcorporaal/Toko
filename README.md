<p align="center"><img src="/assets/images/toko_header.png" alt="Toko header"></p>

# Toko: expanding p5.js with handy features

Toko is a framework to expand p5.js for creative coding with grids, color palettes, image loading, parameter panels, svg rendering, image and video capture, and more. Toko works (sort of) seamlessly with p5.js v1, v2, and Q5 variants, making it easier to switch for between them for performance or support.

For examples of generative art created with Toko see [Late Night Noodles on Instagram](https://www.instagram.com/_late_night_noodles_/).

> [!NOTE]
> This framework continues to evolve. Be prepared for breaking changes in every update.

## Features

- Easy capturing options for images and video using p5.capture
- Create and save SVG images using p5.js-svg (also with p5.js v2)
- Switching between canvas sizes on the fly
- Larger canvas sizes are scaled to fit on the screen
- Camera class to set the viewport on large canvasses
- Tweakpane integration to easily change sketch parameters
- Large collection of color palettes
- Easy selection and usage of (custom) color palettes
- Saving and loading (through drag and drop on the canvas) of sketch parameters
- Seeded random number generator class
- Addition noise and random functions
- Grid generation and modification
- Quadtrees
- Hexagon grids
- Image loader and manager

See the [function reference](functions.md) and the [examples](/examples) for more details of implementation and usage.

### Installation

To use only the base functionality without the wrapper, include p5.toko in your HTML file:

```html
<!-- For p5.js v1 and v2 -->
<script src="path/to/p5.js"></script>
<script src="path/to/p5.toko.js"></script>

<!-- For Q5 -->
<script src="path/to/q5.js"></script>
<script src="path/to/p5.toko.js"></script>
```

For additional functionality and convenience, use Toko-wrapper as well. See the [`examples`](/examples) for details of this implementation.

### Toko basic Usage

```javascript
// Toko automatically initializes and detects your p5.js variant
// Access functions and classes through the global toko instance or Toko class
// Both toko (lowercase) and Toko (capital) work for accessing classes

function setup() {
  createCanvas(800, 600);

  // Create a grid with recursive splitting
  // Note: Split constants are accessed via Toko.Grid (e.g., Toko.Grid.SPLIT_LONGEST)
  const grid = new Toko.Grid(0, 0, width, height);
  grid.splitRecursive(3, 0.5, 20, Toko.Grid.SPLIT_LONGEST);

  // Use seeded random number generation (global RNG)
  toko.setSeed('mySeed123');
  const randomValue = toko.random(0, 100);

  // Or create individual RNG instances for independent random sequences
  const myRNG = new Toko.RNG('mySeed123');
  const anotherValue = myRNG.random(0, 100);

  // Generate noise
  const noiseValue = toko.openSimplexNoise('seed').noise2D(10.5, 20.3);
}

function draw() {
  background(220);

  // Draw grid cells
  grid.cells.forEach(cell => {
    fill(toko.random(100, 255));
    rect(cell.x, cell.y, cell.width, cell.height);
  });
}
```

### TokoWrapper basic usage (See /examples for details)

```javascript
// Include the wrapper for full features and supporting libraries
<script src='path/to/p5.tokoWrapper.js'></script>;

// Initialize with options
// Note: TokoWrapper.RENDER_MODES provides render mode constants (P2D, WEBGL, SVG, WEBGPU)
const tokoWrapper = new TokoWrapper({
  title: 'My Generative Project',
  useParameterPanel: true,
  showCaptureOptions: true,
  canvasSize: TokoWrapper.SIZE_1080P,
  renderMode: TokoWrapper.RENDER_MODES.P2D, // or WEBGL, SVG, WEBGPU
});

function setup() {
  // TokoWrapper handles canvas setup automatically
  // Your sketch code here
}
```

## Architecture

Toko is built as a set of two libraries:

### Core Library (`toko-library`)

Provides utility functions independent of any other libraries or html setup.

### Wrapper (`toko-wrapper`)

Integrates libraries like Tweakpane and p5.capture, into a html template to add functions like video and image capture, parameter panel and easy resizing.

Because I like to keep things simple and avoid commandline tools, I'm using [CodeKit](https://codekitapp.com/) to compile the files. This means that the importing of classes follows a specific structure that works well with CodeKit but might not be what you're used to or is best practice. Ah well…

## Key Classes & Functions

See the [functions reference](functions.md) for more.

### Grid System

```javascript
// Create a grid (both toko.Grid and Toko.Grid work)
const grid = new Toko.Grid(x, y, width, height);

// Split constants are accessed via Toko.Grid:
// - Toko.Grid.SPLIT_HORIZONTAL
// - Toko.Grid.SPLIT_VERTICAL
// - Toko.Grid.SPLIT_LONGEST
// - Toko.Grid.SPLIT_MIX
// - Toko.Grid.SPLIT_SQUARE
grid.splitRecursive(loops, chance, minSize, Toko.Grid.SPLIT_LONGEST);
grid.packGrid(columns, rows, cellShapes);
```

### Random Number Generation

```javascript
// Global RNG functions (use the shared RNG instance)
toko.setSeed('mySeed');
toko.random(min, max);
toko.poissonDisk(width, height, radius);
toko.shuffle(array);

// Individual RNG instances (for independent random sequences)
const myRNG = new Toko.RNG('mySeed');
const value = myRNG.random(0, 100);
const anotherRNG = new Toko.RNG('differentSeed');
```

### Noise Functions

```javascript
const noiseSource = toko.openSimplexNoise('seed');
noiseSource.noise2D(x, y);
noiseSource.noise3D(x, y, z);
noiseSource.noise4D(x, y, z, w);
```

### Spatial Queries

```javascript
const quadTree = new Toko.QuadTree(boundary, capacity);
quadTree.insert(point);
const nearby = quadTree.query(range);
```

### Color Functions

```javascript
// Get a color scale from a palette
const colors = toko.getColorScale('viridis', {
  domain: [0, 1],
  reverse: false,
});
const color = colors.scale(0.5); // Get color at position 0.5

// Create colors with alpha transparency
const transparentRed = toko.colorAlpha('#ff0000', 128);
```

### Graphics Functions

```javascript
// Transformations
toko.rotateAround(centerX, centerY, angle);
toko.scaleAround(centerX, centerY, scale);

// Polygon drawing
toko.plotPolygon(x, y, size, sides, rotation);
const vertices = toko.polygonVertices(x, y, size, sides);
toko.plotVertices(vertices);
```

### Utility Functions

```javascript
// Animation utilities
const pulseValue = toko.pulse(0.05); // Pulsing value between 0 and 1

// Information
const info = toko.getInfo(); // Get library information
```

## Examples

See the [online examples](https://bcorporaal.github.io/Toko/) or the [`examples/`](examples/) folder for more on the features of Toko.

## Code Organization

```
src/
├── shared/             # Common components between libraries
│   ├── adapters/       # Base adapter for cross-variant compatibility
│   ├── constants/      # Shared constants and configuration
│   ├── util/           # Shared utility functions
│   ├── detector.js     # p5.js variant detection
│   └── register.js     # Function and class registration
├── toko-library/       # Core creative coding functions
│   ├── classes/        # Grid, QuadTree, RNG, HexGrid, etc.
│   ├── color-palettes/ # Color palette collections
│   ├── config/         # Library configuration and constants
│   ├── core/           # Main library initialization and state
│   ├── functions/      # Math, graphics, color, utils
│   │   ├── color/      # Color manipulation functions
│   │   ├── graphics/   # Graphics and drawing utilities
│   │   ├── math/       # Mathematical functions and noise
│   │   └── utils/      # General utility functions
│   ├── lifecycle/      # Lifecycle event handlers
│   ├── adapters/       # Variant-specific implementations
│   ├── toko-library.js
│   └── toko-library-min.js # Used to compile minified version
└── toko-wrapper/       # Integration layer and UI
    ├── adapters/       # Wrapper-specific adapters
    ├── canvas/         # Canvas management and sizing
    ├── config/         # Wrapper configuration
    ├── core/           # Canvas, capture, tweakpane setup
    ├── lifecycle/      # Lifecycle event handlers
    ├── media/          # Capture, file handling, save/load
    ├── ui/             # Tweakpane and UI controls
    ├── util/           # Wrapper utility functions
    ├── toko-wrapper.js
    └── toko-wrapper-min.js # Used to compile minified version
```

## Contributing

While I mostly made this for myself, I certainly welcome feedback and contributions! Here's how you can help:

### Ways to Contribute

- ⭐ **Star the repository** - if you use and like Toko
- 🐛 **Report bugs** - [Open issues](https://github.com/bcorporaal/toko/issues)
- 💡 **Suggest features** - [Feature requests](https://github.com/bcorporaal/toko/issues)
- 🔧 **Submit fixes** - [Pull requests](https://github.com/bcorporaal/toko/pulls)
- 🎨 **Share what you make** - I'd love to hear if you made anything cool with this

## Contact

If you have any questions or comments you can also contact me via [email](mailto:bob@latenightnoodles.net).

## Credits

Many thanks to all the creators whose code or work has influenced Toko, in big or small ways.

### Color Palettes

Toko includes color palettes from the following sources:

- [Chromotome](https://github.com/kgolid/chromotome) by Kjetil Midtgarden Golid. MIT License.
- [D3](https://github.com/d3/d3) by Mike Bostock and others. ISC License.
- [Feathers](https://github.com/shandiya/feathers) by Shandiya Balasubramaniam. MIT License.
- [Lospec](https://lospec.com/palette-list) by various contributors. Unknown license.
- [Metbrewer](https://github.com/BlakeRMills/MetBrewer) by Blake Robert Mills. CC0-1.0 License.
- [MoMAColors](https://github.com/BlakeRMills/MoMAColors) by Blake Robert Mills. MIT License.

### Core Algorithms

Toko includes code from the following projects:

- [SimplexNoiseJS](https://github.com/blindman67/SimplexNoiseJS) by Mark Spronck for OpenSimplex Noise. Unlicense.
- [Quadtree](https://github.com/CodingTrain/QuadTree) by Daniel Shiffman / Coding Train for quadtree. MIT License.
- [BezierEasing](https://github.com/thednp/bezier-easing/) by thednp. MIT License.
- [p5.fps](https://github.com/taylorvance/p5.fps) by Taylor Vance. MIT License.
- [p5.js-svg](https://github.com/zenozeng/p5.js-svg) modified from the original by Zeno Zeng. MIT License.

### Dependencies

Toko makes use of the following libraries:

- [p5.js](https://github.com/processing/p5.js) by [many contributors](https://github.com/processing/p5.js?tab=readme-ov-file#contributors). LGPL-2.1 license.
- [q5.js](https://github.com/q5js/q5.js) by Quinton Ashley. LGPL-3.0 license.
- [Tweakpane](https://github.com/cocopon/tweakpane) by Hiroki Kokubun for controls. MIT License.
- [p5.capture](https://github.com/tapioca24/p5.capture) by tapioca24 for video capture. MIT License.
- [Chroma.js](https://github.com/gka/chroma.js) by Gregor Aisch for color manipulations. Apache License.

## License

Copyright (c) 2025 Bob Corporaal  
Licensed under the MIT license, parts might have a different license as noted above.
