(function () {
  'use strict';

  /**
   * @module Constants
   * @submodule Constants
   * @for p5
   */

  const _PI = Math.PI;

  /**
   * Version of this p5.js.
   * @property {String} VERSION
   * @final
   */
  const VERSION = '2.2.0';

  // GRAPHICS RENDERER
  /**
   * The default, two-dimensional renderer in p5.js.
   *
   * Use this when calling <a href="#/p5/createCanvas"> (for example,
   * `createCanvas(400, 400, P2D)`) to specify a 2D context.
   *
   * @typedef {'p2d'} P2D
   * @property {P2D} P2D
   * @final
   */
  const P2D = 'p2d';

  /**
   * A high-dynamic-range (HDR) variant of the default, two-dimensional renderer.
   *
   * When available, this mode can allow for extended color ranges and more
   * dynamic color representation. Use it similarly to `P2D`:
   * `createCanvas(400, 400, P2DHDR)`.
   *
   * @typedef {'p2d-hdr'} P2DHDR
   * @property {P2DHDR} P2DHDR
   * @final
   */

  const P2DHDR = 'p2d-hdr';

  /**
   * One of the two render modes in p5.js, used for computationally intensive tasks like 3D rendering and shaders.
   *
   * `WEBGL` differs from the default <a href="/reference/p5/P2D">`P2D`</a> renderer in the following ways:
   *
   * - **Coordinate System** - When drawing in `WEBGL` mode, the origin point (0,0,0) is located at the center of the screen, not the top-left corner. See <a href="https://p5js.org/tutorials/coordinates-and-transformations/">the tutorial page about coordinates and transformations</a>.
   * - **3D Shapes** - `WEBGL` mode can be used to draw 3-dimensional shapes like <a href="#/p5/box">box()</a>, <a href="#/p5/sphere">sphere()</a>, <a href="#/p5/cone">cone()</a>, and <a href="https://p5js.org/reference/#3D%20Primitives">more</a>. See <a href="https://p5js.org/tutorials/custom-geometry/">the tutorial page about custom geometry</a> to make more complex objects.
   * - **Shape Detail** - When drawing in `WEBGL` mode, you can specify how smooth curves should be drawn by using a `detail` parameter. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#3d-primitives-shapes">the wiki section about shapes</a> for a more information and an example.
   * - **Textures** - A texture is like a skin that wraps onto a shape. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#textures">the wiki section about textures</a> for examples of mapping images onto surfaces with textures.
   * - **Materials and Lighting** - `WEBGL` offers different types of lights like <a href="#/p5/ambientLight">ambientLight()</a> to place around a scene. Materials like <a href="#/p5/specularMaterial">specularMaterial()</a> reflect the lighting to convey shape and depth. See <a href="https://p5js.org/tutorials/lights-camera-materials/">the tutorial page for styling and appearance</a> to experiment with different combinations.
   * - **Camera** - The viewport of a `WEBGL` sketch can be adjusted by changing camera attributes. See <a href="https://p5js.org/tutorials/lights-camera-materials#camera-and-view">the tutorial page section about cameras</a> for an explanation of camera controls.
   * - **Text** - `WEBGL` requires opentype/truetype font files to be preloaded using <a href="#/p5/loadFont">loadFont()</a>. See <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#text">the wiki section about text</a> for details, along with a workaround.
   * - **Shaders** - Shaders are hardware accelerated programs that can be used for a variety of effects and graphics. See the <a href="https://p5js.org/tutorials/intro-to-shaders/">introduction to shaders</a> to get started with shaders in p5.js.
   * - **Graphics Acceleration** - `WEBGL` mode uses the graphics card instead of the CPU, so it may help boost the performance of your sketch (example: drawing more shapes on the screen at once).
   *
   * To learn more about WEBGL mode, check out <a href="https://p5js.org/tutorials/#webgl">all the interactive WEBGL tutorials</a> in the "Tutorials" section of this website, or read the wiki article <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5">"Getting started with WebGL in p5"</a>.
   *
   * @typedef {'webgl'} WEBGL
   * @property {WEBGL} WEBGL
   * @final
   */
  const WEBGL = 'webgl';
  /**
   * One of the two possible values of a WebGL canvas (either WEBGL or WEBGL2),
   * which can be used to determine what capabilities the rendering environment
   * has.
   * @typedef {'webgl2'} WEBGL2
   * @property {WEBGL2} WEBGL2
   * @final
   */
  const WEBGL2 = 'webgl2';

  /**
   * A constant used for creating a WebGPU rendering context
   * @property {'webgpu'} WEBGPU
   * @final
   */
  const WEBGPU = 'webgpu';

  // ENVIRONMENT
  /**
   * @typedef {'default'} ARROW
   * @property {ARROW} ARROW
   * @final
   */
  const ARROW = 'default';

  /**
   * @property {String} SIMPLE
   * @final
   */
  const SIMPLE = 'simple';
  /**
   * @property {String} FULL
   * @final
   */
  const FULL = 'full';

  /**
   * @typedef {'crosshair'} CROSS
   * @property {CROSS} CROSS
   * @final
   */
  const CROSS = 'crosshair';
  /**
   * @typedef {'pointer'} HAND
   * @property {HAND} HAND
   * @final
   */
  const HAND = 'pointer';
  /**
   * @typedef {'move'} MOVE
   * @property {MOVE} MOVE
   * @final
   */
  const MOVE = 'move';
  /**
   * @typedef {'text'} TEXT
   * @property {TEXT} TEXT
   * @final
   */
  const TEXT = 'text';
  /**
   * @typedef {'wait'} WAIT
   * @property {WAIT} WAIT
   * @final
   */
  const WAIT = 'wait';

  // TRIGONOMETRY

  /**
   * A `Number` constant that's approximately 1.5708.
   *
   * `HALF_PI` is half the value of the mathematical constant π. It's useful for
   * many tasks that involve rotation and oscillation. For example, calling
   * `rotate(HALF_PI)` rotates the coordinate system `HALF_PI` radians, which is
   * a quarter turn (90˚).
   *
   * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
   * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
   *
   * @property {Number} HALF_PI
   * @final
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw an arc from 0 to HALF_PI.
   *   arc(50, 50, 80, 80, 0, HALF_PI);
   *
   *   describe('The bottom-right quarter of a circle drawn in white on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw a line.
   *   line(0, 0, 40, 0);
   *
   *   // Rotate a quarter turn.
   *   rotate(HALF_PI);
   *
   *   // Draw the same line, rotated.
   *   line(0, 0, 40, 0);
   *
   *   describe('Two black lines on a gray background. One line extends from the center to the right. The other line extends from the center to the bottom.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A red circle and a blue circle oscillate from left to right on a gray background. The red circle appears to chase the blue circle.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Calculate the x-coordinates.
   *   let x1 = 40 * sin(frameCount * 0.05);
   *   let x2 = 40 * sin(frameCount * 0.05 + HALF_PI);
   *
   *   // Style the oscillators.
   *   noStroke();
   *
   *   // Draw the red oscillator.
   *   fill(255, 0, 0);
   *   circle(x1, 0, 20);
   *
   *   // Draw the blue oscillator.
   *   fill(0, 0, 255);
   *   circle(x2, 0, 20);
   * }
   * </code>
   * </div>
   */
  const HALF_PI = _PI / 2;

  /**
   * A `Number` constant that's approximately 3.1416.
   *
   * `PI` is the mathematical constant π. It's useful for many tasks that
   * involve rotation and oscillation. For example, calling `rotate(PI)` rotates
   * the coordinate system `PI` radians, which is a half turn (180˚).
   *
   * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
   * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
   *
   * @property {Number} PI
   * @final
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw an arc from 0 to PI.
   *   arc(50, 50, 80, 80, 0, PI);
   *
   *   describe('The bottom half of a circle drawn in white on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw a line.
   *   line(0, 0, 40, 0);
   *
   *   // Rotate a half turn.
   *   rotate(PI);
   *
   *   // Draw the same line, rotated.
   *   line(0, 0, 40, 0);
   *
   *   describe('A horizontal black line on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A red circle and a blue circle oscillate from left to right on a gray background. The circles drift apart, then meet in the middle, over and over again.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Calculate the x-coordinates.
   *   let x1 = 40 * sin(frameCount * 0.05);
   *   let x2 = 40 * sin(frameCount * 0.05 + PI);
   *
   *   // Style the oscillators.
   *   noStroke();
   *
   *   // Draw the red oscillator.
   *   fill(255, 0, 0);
   *   circle(x1, 0, 20);
   *
   *   // Draw the blue oscillator.
   *   fill(0, 0, 255);
   *   circle(x2, 0, 20);
   * }
   * </code>
   * </div>
   */
  const PI = _PI;

  /**
   * A `Number` constant that's approximately 0.7854.
   *
   * `QUARTER_PI` is one-fourth the value of the mathematical constant π. It's
   * useful for many tasks that involve rotation and oscillation. For example,
   * calling `rotate(QUARTER_PI)` rotates the coordinate system `QUARTER_PI`
   * radians, which is an eighth of a turn (45˚).
   *
   * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
   * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
   *
   * @property {Number} QUARTER_PI
   * @final
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw an arc from 0 to QUARTER_PI.
   *   arc(50, 50, 80, 80, 0, QUARTER_PI);
   *
   *   describe('A one-eighth slice of a circle drawn in white on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw a line.
   *   line(0, 0, 40, 0);
   *
   *   // Rotate an eighth turn.
   *   rotate(QUARTER_PI);
   *
   *   // Draw the same line, rotated.
   *   line(0, 0, 40, 0);
   *
   *   describe('Two black lines that form a "V" opening towards the bottom-right corner of a gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A red circle and a blue circle oscillate from left to right on a gray background. The red circle appears to chase the blue circle.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Calculate the x-coordinates.
   *   let x1 = 40 * sin(frameCount * 0.05);
   *   let x2 = 40 * sin(frameCount * 0.05 + QUARTER_PI);
   *
   *   // Style the oscillators.
   *   noStroke();
   *
   *   // Draw the red oscillator.
   *   fill(255, 0, 0);
   *   circle(x1, 0, 20);
   *
   *   // Draw the blue oscillator.
   *   fill(0, 0, 255);
   *   circle(x2, 0, 20);
   * }
   * </code>
   * </div>
   */
  const QUARTER_PI = _PI / 4;

  /**
   * A `Number` constant that's approximately 6.2382.
   *
   * `TAU` is twice the value of the mathematical constant π. It's useful for
   * many tasks that involve rotation and oscillation. For example, calling
   * `rotate(TAU)` rotates the coordinate system `TAU` radians, which is one
   * full turn (360˚). `TAU` and `TWO_PI` are equal.
   *
   * Note: `TAU` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
   * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
   *
   * @property {Number} TAU
   * @final
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw an arc from 0 to TAU.
   *   arc(50, 50, 80, 80, 0, TAU);
   *
   *   describe('A white circle drawn on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw a line.
   *   line(0, 0, 40, 0);
   *
   *   // Rotate a full turn.
   *   rotate(TAU);
   *
   *   // Style the second line.
   *   strokeWeight(5);
   *
   *   // Draw the same line, shorter and rotated.
   *   line(0, 0, 20, 0);
   *
   *   describe(
   *     'Two horizontal black lines on a gray background. A thick line extends from the center toward the right. A thin line extends from the end of the thick line.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A red circle with a blue center oscillates from left to right on a gray background.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Calculate the x-coordinates.
   *   let x1 = 40 * sin(frameCount * 0.05);
   *   let x2 = 40 * sin(frameCount * 0.05 + TAU);
   *
   *   // Style the oscillators.
   *   noStroke();
   *
   *   // Draw the red oscillator.
   *   fill(255, 0, 0);
   *   circle(x1, 0, 20);
   *
   *   // Draw the blue oscillator, smaller.
   *   fill(0, 0, 255);
   *   circle(x2, 0, 10);
   * }
   * </code>
   * </div>
   */
  const TAU = _PI * 2;

  /**
   * A `Number` constant that's approximately 6.2382.
   *
   * `TWO_PI` is twice the value of the mathematical constant π. It's useful for
   * many tasks that involve rotation and oscillation. For example, calling
   * `rotate(TWO_PI)` rotates the coordinate system `TWO_PI` radians, which is
   * one full turn (360˚). `TWO_PI` and `TAU` are equal.
   *
   * Note: `TWO_PI` radians equals 360˚, `PI` radians equals 180˚, `HALF_PI`
   * radians equals 90˚, and `QUARTER_PI` radians equals 45˚.
   *
   * @property {Number} TWO_PI
   * @final
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw an arc from 0 to TWO_PI.
   *   arc(50, 50, 80, 80, 0, TWO_PI);
   *
   *   describe('A white circle drawn on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw a line.
   *   line(0, 0, 40, 0);
   *
   *   // Rotate a full turn.
   *   rotate(TWO_PI);
   *
   *   // Style the second line.
   *   strokeWeight(5);
   *
   *   // Draw the same line, shorter and rotated.
   *   line(0, 0, 20, 0);
   *
   *   describe(
   *     'Two horizontal black lines on a gray background. A thick line extends from the center toward the right. A thin line extends from the end of the thick line.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A red circle with a blue center oscillates from left to right on a gray background.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Calculate the x-coordinates.
   *   let x1 = 40 * sin(frameCount * 0.05);
   *   let x2 = 40 * sin(frameCount * 0.05 + TWO_PI);
   *
   *   // Style the oscillators.
   *   noStroke();
   *
   *   // Draw the red oscillator.
   *   fill(255, 0, 0);
   *   circle(x1, 0, 20);
   *
   *   // Draw the blue oscillator, smaller.
   *   fill(0, 0, 255);
   *   circle(x2, 0, 10);
   * }
   * </code>
   * </div>
   */
  const TWO_PI = _PI * 2;

  /**
   * @property {Number} DEG_TO_RAD
   * @final
   */
  const DEG_TO_RAD = _PI / 180.0;

  /**
   * @property {Number} RAD_TO_DEG
   * @final
   */
  const RAD_TO_DEG = 180.0 / _PI;

  // SHAPE
  /**
   * @typedef {'corner'} CORNER
   * @property {CORNER} CORNER
   * @final
   */
  const CORNER = 'corner';
  /**
   * @typedef {'corners'} CORNERS
   * @property {CORNERS} CORNERS
   * @final
   */
  const CORNERS = 'corners';
  /**
   * @typedef {'radius'} RADIUS
   * @property {RADIUS} RADIUS
   * @final
   */
  const RADIUS = 'radius';
  /**
   * @typedef {'right'} RIGHT
   * @property {RIGHT} RIGHT
   * @final
   */
  const RIGHT = 'right';
  /**
   * @typedef {'left'} LEFT
   * @property {LEFT} LEFT
   * @final
   */
  const LEFT = 'left';
  /**
   * @typedef {'center'} CENTER
   * @property {CENTER} CENTER
   * @final
   */
  const CENTER = 'center';
  /**
   * @typedef {'top'} TOP
   * @property {TOP} TOP
   * @final
   */
  const TOP = 'top';
  /**
   * @typedef {'bottom'} BOTTOM
   * @property {BOTTOM} BOTTOM
   * @final
   */
  const BOTTOM = 'bottom';
  /**
   * @typedef {'alphabetic'} BASELINE
   * @property {BASELINE} BASELINE
   * @final
   */
  const BASELINE = 'alphabetic';
  /**
   * @typedef {0x0000} POINTS
   * @property {POINTS} POINTS
   * @final
   */
  const POINTS = 0x0000;
  /**
   * @typedef {0x0001} LINES
   * @property {LINES} LINES
   * @final
   */
  const LINES = 0x0001;
  /**
   * @typedef {0x0003} LINE_STRIP
   * @property {LINE_STRIP} LINE_STRIP
   * @final
   */
  const LINE_STRIP = 0x0003;
  /**
   * @typedef {0x0002} LINE_LOOP
   * @property {LINE_LOOP} LINE_LOOP
   * @final
   */
  const LINE_LOOP = 0x0002;
  /**
   * @typedef {0x0004} TRIANGLES
   * @property {TRIANGLES} TRIANGLES
   * @final
   */
  const TRIANGLES = 0x0004;
  /**
   * @typedef {0x0006} TRIANGLE_FAN
   * @property {TRIANGLE_FAN} TRIANGLE_FAN
   * @final
   */
  const TRIANGLE_FAN = 0x0006;
  /**
   * @typedef {0x0005} TRIANGLE_STRIP
   * @property {TRIANGLE_STRIP} TRIANGLE_STRIP
   * @final
   */
  const TRIANGLE_STRIP = 0x0005;
  /**
   * @typedef {'quads'} QUADS
   * @property {QUADS} QUADS
   * @final
   */
  const QUADS = 'quads';
  /**
   * @typedef {'quad_strip'} QUAD_STRIP
   * @property {QUAD_STRIP} QUAD_STRIP
   * @final
   */
  const QUAD_STRIP = 'quad_strip';
  /**
   * @typedef {'tess'} TESS
   * @property {TESS} TESS
   * @final
   */
  const TESS = 'tess';
  /**
   * @typedef {0x0007} EMPTY_PATH
   * @property {EMPTY_PATH} EMPTY_PATH
   * @final
   */
  const EMPTY_PATH = 0x0007;
  /**
   * @typedef {0x0008} PATH
   * @property {PATH} PATH
   * @final
   */
  const PATH = 0x0008;
  /**
   * @typedef {'close'} CLOSE
   * @property {CLOSE} CLOSE
   * @final
   */
  const CLOSE = 'close';
  /**
   * @typedef {'open'} OPEN
   * @property {OPEN} OPEN
   * @final
   */
  const OPEN = 'open';
  /**
   * @typedef {'chord'} CHORD
   * @property {CHORD} CHORD
   * @final
   */
  const CHORD = 'chord';
  /**
   * @typedef {'pie'} PIE
   * @property {PIE} PIE
   * @final
   */
  const PIE = 'pie';
  /**
   * @typedef {'square'} PROJECT
   * @property {PROJECT} PROJECT
   * @final
   */
  const PROJECT = 'square'; // PEND: careful this is counterintuitive
  /**
   * @typedef {'butt'} SQUARE
   * @property {SQUARE} SQUARE
   * @final
   */
  const SQUARE = 'butt';
  /**
   * @typedef {'round'} ROUND
   * @property {ROUND} ROUND
   * @final
   */
  const ROUND = 'round';
  /**
   * @typedef {'bevel'} BEVEL
   * @property {BEVEL} BEVEL
   * @final
   */
  const BEVEL = 'bevel';
  /**
   * @typedef {'miter'} MITER
   * @property {MITER} MITER
   * @final
   */
  const MITER = 'miter';

  // DOM EXTENSION
  /**
   * AUTO allows us to automatically set the width or height of an element (but not both),
   * based on the current height and width of the element. Only one parameter can
   * be passed to the <a href="/reference/p5.Element/size">size</a> function as AUTO, at a time.
   *
   * @typedef {'auto'} AUTO
   * @property {AUTO} AUTO
   * @final
   */
  const AUTO = 'auto';
  // INPUT
  /**
   * @typedef {'Alt'} ALT
   * @property {ALT} ALT
   * @final
   */
  const ALT = 'Alt';

  /**
   * @typedef {'Backspace'} BACKSPACE
   * @property {BACKSPACE} BACKSPACE
   * @final
   */
  const BACKSPACE = 'Backspace';

  /**
   * @typedef {'Control' | 'Control'} CONTROL
   * @property {CONTROL} CONTROL
   * @final
   */
  const CONTROL = 'Control';

  /**
   * @typedef {'Delete'} DELETE
   * @property {DELETE} DELETE
   * @final
   */
  const DELETE = 'Delete';

  /**
   * @typedef {'ArrowDown'} DOWN_ARROW
   * @property {DOWN_ARROW} DOWN_ARROW
   * @final
   */
  const DOWN_ARROW = 'ArrowDown';

  /**
   * @typedef {'Enter'} ENTER
   * @property {ENTER} ENTER
   * @final
   */
  const ENTER = 'Enter';

  /**
   * @typedef {'Escape'} ESCAPE
   * @property {ESCAPE} ESCAPE
   * @final
   */
  const ESCAPE = 'Escape';

  /**
   * @typedef {'ArrowLeft'} LEFT_ARROW
   * @property {LEFT_ARROW} LEFT_ARROW
   * @final
   */
  const LEFT_ARROW = 'ArrowLeft';

  /**
   * @typedef {'Alt'} OPTION
   * @property {OPTION} OPTION
   * @final
   */
  const OPTION = 'Alt';

  /**
   * @typedef {'Enter'} RETURN
   * @property {RETURN} RETURN
   * @final
   */
  const RETURN = 'Enter';

  /**
   * @typedef {'ArrowRight'} RIGHT_ARROW
   * @property {RIGHT_ARROW} RIGHT_ARROW
   * @final
   */
  const RIGHT_ARROW = 'ArrowRight';

  /**
   * @typedef {'Shift'} SHIFT
   * @property {SHIFT} SHIFT
   * @final
   */
  const SHIFT = 'Shift';

  /**
   * @typedef {'Tab'} TAB
   * @property {TAB} TAB
   * @final
   */
  const TAB = 'Tab';

  /**
   * @typedef {'ArrowUp'} UP_ARROW
   * @property {UP_ARROW} UP_ARROW
   * @final
   */
  const UP_ARROW = 'ArrowUp';

  // RENDERING
  /**
   * @typedef {'source-over'} BLEND
   * @property {BLEND} BLEND
   * @final
   */
  const BLEND = 'source-over';
  /**
   * @typedef {'destination-out'} REMOVE
   * @property {REMOVE} REMOVE
   * @final
   */
  const REMOVE = 'destination-out';
  /**
   * @typedef {'lighter'} ADD
   * @property {ADD} ADD
   * @final
   */
  const ADD = 'lighter';
  /**
   * @typedef {'darken'} DARKEST
   * @property {DARKEST} DARKEST
   * @final
   */
  const DARKEST = 'darken';
  /**
   * @typedef {'lighten'} LIGHTEST
   * @property {LIGHTEST} LIGHTEST
   * @final
   */
  const LIGHTEST = 'lighten';
  /**
   * @typedef {'difference'} DIFFERENCE
   * @property {DIFFERENCE} DIFFERENCE
   * @final
   */
  const DIFFERENCE = 'difference';
  /**
   * @typedef {'subtract'} SUBTRACT
   * @property {SUBTRACT} SUBTRACT
   * @final
   */
  const SUBTRACT = 'subtract';
  /**
   * @typedef {'exclusion'} EXCLUSION
   * @property {EXCLUSION} EXCLUSION
   * @final
   */
  const EXCLUSION = 'exclusion';
  /**
   * @typedef {'multiply'} MULTIPLY
   * @property {MULTIPLY} MULTIPLY
   * @final
   */
  const MULTIPLY = 'multiply';
  /**
   * @typedef {'screen'} SCREEN
   * @property {SCREEN} SCREEN
   * @final
   */
  const SCREEN = 'screen';
  /**
   * @typedef {'copy'} REPLACE
   * @property {REPLACE} REPLACE
   * @final
   */
  const REPLACE = 'copy';
  /**
   * @typedef {'overlay'} OVERLAY
   * @property {OVERLAY} OVERLAY
   * @final
   */
  const OVERLAY = 'overlay';
  /**
   * @typedef {'hard-light'} HARD_LIGHT
   * @property {HARD_LIGHT} HARD_LIGHT
   * @final
   */
  const HARD_LIGHT = 'hard-light';
  /**
   * @typedef {'soft-light'} SOFT_LIGHT
   * @property {SOFT_LIGHT} SOFT_LIGHT
   * @final
   */
  const SOFT_LIGHT = 'soft-light';
  /**
   * @typedef {'color-dodge'} DODGE
   * @property {DODGE} DODGE
   * @final
   */
  const DODGE = 'color-dodge';
  /**
   * @typedef {'color-burn'} BURN
   * @property {BURN} BURN
   * @final
   */
  const BURN = 'color-burn';

  // FILTERS
  /**
   * @typedef {'threshold'} THRESHOLD
   * @property {THRESHOLD} THRESHOLD
   * @final
   */
  const THRESHOLD = 'threshold';
  /**
   * @typedef {'gray'} GRAY
   * @property {GRAY} GRAY
   * @final
   */
  const GRAY = 'gray';
  /**
   * @typedef {'opaque'} OPAQUE
   * @property {OPAQUE} OPAQUE
   * @final
   */
  const OPAQUE = 'opaque';
  /**
   * @typedef {'invert'} INVERT
   * @property {INVERT} INVERT
   * @final
   */
  const INVERT = 'invert';
  /**
   * @typedef {'posterize'} POSTERIZE
   * @property {POSTERIZE} POSTERIZE
   * @final
   */
  const POSTERIZE = 'posterize';
  /**
   * @typedef {'dilate'} DILATE
   * @property {DILATE} DILATE
   * @final
   */
  const DILATE = 'dilate';
  /**
   * @typedef {'erode'} ERODE
   * @property {ERODE} ERODE
   * @final
   */
  const ERODE = 'erode';
  /**
   * @typedef {'blur'} BLUR
   * @property {BLUR} BLUR
   * @final
   */
  const BLUR = 'blur';

  // TYPOGRAPHY
  /**
   * @typedef {'normal'} NORMAL
   * @property {NORMAL} NORMAL
   * @final
   */
  const NORMAL = 'normal';
  /**
   * @typedef {'italic'} ITALIC
   * @property {ITALIC} ITALIC
   * @final
   */
  const ITALIC = 'italic';
  /**
   * @typedef {'bold'} BOLD
   * @property {BOLD} BOLD
   * @final
   */
  const BOLD = 'bold';
  /**
   * @typedef {'bold italic'} BOLDITALIC
   * @property {BOLDITALIC} BOLDITALIC
   * @final
   */
  const BOLDITALIC = 'bold italic';
  /**
   * @typedef {'CHAR'} CHAR
   * @property {CHAR} CHAR
   * @final
   */
  const CHAR = 'CHAR';
  /**
   * @typedef {'WORD'} WORD
   * @property {WORD} WORD
   * @final
   */
  const WORD = 'WORD';

  // TYPOGRAPHY-INTERNAL
  const _DEFAULT_TEXT_FILL = '#000000';
  const _DEFAULT_LEADMULT = 1.25;
  const _CTX_MIDDLE = 'middle';

  // VERTICES
  /**
   * @typedef {'linear'} LINEAR
   * @property {LINEAR} LINEAR
   * @final
   */
  const LINEAR = 'linear';
  /**
   * @typedef {'quadratic'} QUADRATIC
   * @property {QUADRATIC} QUADRATIC
   * @final
   */
  const QUADRATIC = 'quadratic';
  /**
   * @typedef {'bezier'} BEZIER
   * @property {BEZIER} BEZIER
   * @final
   */
  const BEZIER = 'bezier';
  /**
   * @typedef {'curve'} CURVE
   * @property {CURVE} CURVE
   * @final
   */
  const CURVE = 'curve';

  // WEBGL DRAWMODES
  /**
   * @typedef {'stroke'} STROKE
   * @property {STROKE} STROKE
   * @final
   */
  const STROKE = 'stroke';
  /**
   * @typedef {'fill'} FILL
   * @property {FILL} FILL
   * @final
   */
  const FILL = 'fill';
  /**
   * @typedef {'texture'} TEXTURE
   * @property {TEXTURE} TEXTURE
   * @final
   */
  const TEXTURE = 'texture';
  /**
   * @typedef {'immediate'} IMMEDIATE
   * @property {IMMEDIATE} IMMEDIATE
   * @final
   */
  const IMMEDIATE = 'immediate';

  // WEBGL TEXTURE MODE
  // NORMAL already exists for typography
  /**
   * @typedef {'image'} IMAGE
   * @property {IMAGE} IMAGE
   * @final
   */
  const IMAGE = 'image';

  // WEBGL TEXTURE WRAP AND FILTERING
  // LINEAR already exists above
  /**
   * @typedef {'linear_mipmap'} LINEAR_MIPMAP
   * @property {LINEAR_MIPMAP} LINEAR_MIPMAP
   * @final
   * @private
   */
  const LINEAR_MIPMAP = 'linear_mipmap';
  /**
   * @typedef {'nearest'} NEAREST
   * @property {NEAREST} NEAREST
   * @final
   */
  const NEAREST = 'nearest';
  /**
   * @typedef {'repeat'} REPEAT
   * @property {REPEAT} REPEAT
   * @final
   */
  const REPEAT = 'repeat';
  /**
   * @typedef {'clamp'} CLAMP
   * @property {CLAMP} CLAMP
   * @final
   */
  const CLAMP = 'clamp';
  /**
   * @typedef {'mirror'} MIRROR
   * @property {MIRROR} MIRROR
   * @final
   */
  const MIRROR = 'mirror';

  // WEBGL GEOMETRY SHADING
  /**
   * @typedef {'flat'} FLAT
   * @property {FLAT} FLAT
   * @final
   */
  const FLAT = 'flat';
  /**
   * @typedef {'smooth'} SMOOTH
   * @property {SMOOTH} SMOOTH
   * @final
   */
  const SMOOTH = 'smooth';

  // DEVICE-ORIENTATION
  /**
   * @typedef {'landscape'} LANDSCAPE
   * @property {LANDSCAPE} LANDSCAPE
   * @final
   */
  const LANDSCAPE = 'landscape';
  /**
   * @typedef {'portrait'} PORTRAIT
   * @property {PORTRAIT} PORTRAIT
   * @final
   */
  const PORTRAIT = 'portrait';

  // DEFAULTS
  const _DEFAULT_STROKE = '#000000';
  const _DEFAULT_FILL = '#FFFFFF';

  /**
   * @typedef {'grid'} GRID
   * @property {GRID} GRID
   * @final
   */
  const GRID = 'grid';

  /**
   * @typedef {'axes'} AXES
   * @property {AXES} AXES
   * @final
   */
  const AXES = 'axes';

  /**
   * @typedef {'label'} LABEL
   * @property {LABEL} LABEL
   * @final
   */
  const LABEL = 'label';
  /**
   * @typedef {'fallback'} FALLBACK
   * @property {FALLBACK} FALLBACK
   * @final
   */
  const FALLBACK = 'fallback';

  /**
   * @typedef {'contain'} CONTAIN
   * @property {CONTAIN} CONTAIN
   * @final
   */
  const CONTAIN = 'contain';

  /**
   * @typedef {'cover'} COVER
   * @property {COVER} COVER
   * @final
   */
  const COVER = 'cover';

  /**
   * @typedef {'unsigned-byte'} UNSIGNED_BYTE
   * @property {UNSIGNED_BYTE} UNSIGNED_BYTE
   * @final
   */
  const UNSIGNED_BYTE = 'unsigned-byte';

  /**
   * @typedef {'unsigned-int'} UNSIGNED_INT
   * @property {UNSIGNED_INT} UNSIGNED_INT
   * @final
   */
  const UNSIGNED_INT = 'unsigned-int';

  /**
   * @typedef {'float'} FLOAT
   * @property {FLOAT} FLOAT
   * @final
   */
  const FLOAT = 'float';

  /**
   * @typedef {'half-float'} HALF_FLOAT
   * @property {HALF_FLOAT} HALF_FLOAT
   * @final
   */
  const HALF_FLOAT = 'half-float';

  /**
   * The `splineProperty('ends')` mode where splines curve through
   * their first and last points.
   * @typedef {unique symbol} INCLUDE
   * @property {INCLUDE} INCLUDE
   * @final
   */
  const INCLUDE = Symbol('include');

  /**
   * The `splineProperty('ends')` mode where the first and last points in a spline
   * affect the direction of the curve, but are not rendered.
   * @typedef {unique symbol} EXCLUDE
   * @property {EXCLUDE} EXCLUDE
   * @final
   */
  const EXCLUDE = Symbol('exclude');

  /**
   * The `splineProperty('ends')` mode where the spline loops back to its first point.
   * Only used internally.
   * @typedef {unique symbol} JOIN
   * @property {JOIN} JOIN
   * @final
   * @private
   */
  const JOIN = Symbol('join');

  var constants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ADD: ADD,
    ALT: ALT,
    ARROW: ARROW,
    AUTO: AUTO,
    AXES: AXES,
    BACKSPACE: BACKSPACE,
    BASELINE: BASELINE,
    BEVEL: BEVEL,
    BEZIER: BEZIER,
    BLEND: BLEND,
    BLUR: BLUR,
    BOLD: BOLD,
    BOLDITALIC: BOLDITALIC,
    BOTTOM: BOTTOM,
    BURN: BURN,
    CENTER: CENTER,
    CHAR: CHAR,
    CHORD: CHORD,
    CLAMP: CLAMP,
    CLOSE: CLOSE,
    CONTAIN: CONTAIN,
    CONTROL: CONTROL,
    CORNER: CORNER,
    CORNERS: CORNERS,
    COVER: COVER,
    CROSS: CROSS,
    CURVE: CURVE,
    DARKEST: DARKEST,
    DEG_TO_RAD: DEG_TO_RAD,
    DELETE: DELETE,
    DIFFERENCE: DIFFERENCE,
    DILATE: DILATE,
    DODGE: DODGE,
    DOWN_ARROW: DOWN_ARROW,
    EMPTY_PATH: EMPTY_PATH,
    ENTER: ENTER,
    ERODE: ERODE,
    ESCAPE: ESCAPE,
    EXCLUDE: EXCLUDE,
    EXCLUSION: EXCLUSION,
    FALLBACK: FALLBACK,
    FILL: FILL,
    FLAT: FLAT,
    FLOAT: FLOAT,
    FULL: FULL,
    GRAY: GRAY,
    GRID: GRID,
    HALF_FLOAT: HALF_FLOAT,
    HALF_PI: HALF_PI,
    HAND: HAND,
    HARD_LIGHT: HARD_LIGHT,
    IMAGE: IMAGE,
    IMMEDIATE: IMMEDIATE,
    INCLUDE: INCLUDE,
    INVERT: INVERT,
    ITALIC: ITALIC,
    JOIN: JOIN,
    LABEL: LABEL,
    LANDSCAPE: LANDSCAPE,
    LEFT: LEFT,
    LEFT_ARROW: LEFT_ARROW,
    LIGHTEST: LIGHTEST,
    LINEAR: LINEAR,
    LINEAR_MIPMAP: LINEAR_MIPMAP,
    LINES: LINES,
    LINE_LOOP: LINE_LOOP,
    LINE_STRIP: LINE_STRIP,
    MIRROR: MIRROR,
    MITER: MITER,
    MOVE: MOVE,
    MULTIPLY: MULTIPLY,
    NEAREST: NEAREST,
    NORMAL: NORMAL,
    OPAQUE: OPAQUE,
    OPEN: OPEN,
    OPTION: OPTION,
    OVERLAY: OVERLAY,
    P2D: P2D,
    P2DHDR: P2DHDR,
    PATH: PATH,
    PI: PI,
    PIE: PIE,
    POINTS: POINTS,
    PORTRAIT: PORTRAIT,
    POSTERIZE: POSTERIZE,
    PROJECT: PROJECT,
    QUADRATIC: QUADRATIC,
    QUADS: QUADS,
    QUAD_STRIP: QUAD_STRIP,
    QUARTER_PI: QUARTER_PI,
    RADIUS: RADIUS,
    RAD_TO_DEG: RAD_TO_DEG,
    REMOVE: REMOVE,
    REPEAT: REPEAT,
    REPLACE: REPLACE,
    RETURN: RETURN,
    RIGHT: RIGHT,
    RIGHT_ARROW: RIGHT_ARROW,
    ROUND: ROUND,
    SCREEN: SCREEN,
    SHIFT: SHIFT,
    SIMPLE: SIMPLE,
    SMOOTH: SMOOTH,
    SOFT_LIGHT: SOFT_LIGHT,
    SQUARE: SQUARE,
    STROKE: STROKE,
    SUBTRACT: SUBTRACT,
    TAB: TAB,
    TAU: TAU,
    TESS: TESS,
    TEXT: TEXT,
    TEXTURE: TEXTURE,
    THRESHOLD: THRESHOLD,
    TOP: TOP,
    TRIANGLES: TRIANGLES,
    TRIANGLE_FAN: TRIANGLE_FAN,
    TRIANGLE_STRIP: TRIANGLE_STRIP,
    TWO_PI: TWO_PI,
    UNSIGNED_BYTE: UNSIGNED_BYTE,
    UNSIGNED_INT: UNSIGNED_INT,
    UP_ARROW: UP_ARROW,
    VERSION: VERSION,
    WAIT: WAIT,
    WEBGL: WEBGL,
    WEBGL2: WEBGL2,
    WEBGPU: WEBGPU,
    WORD: WORD,
    _CTX_MIDDLE: _CTX_MIDDLE,
    _DEFAULT_FILL: _DEFAULT_FILL,
    _DEFAULT_LEADMULT: _DEFAULT_LEADMULT,
    _DEFAULT_STROKE: _DEFAULT_STROKE,
    _DEFAULT_TEXT_FILL: _DEFAULT_TEXT_FILL
  });

  function getStrokeDefs(shaderConstant) {
    const STROKE_CAP_ENUM = {};
    const STROKE_JOIN_ENUM = {};
    let lineDefs = "";
    const defineStrokeCapEnum = function (key, val) {
      lineDefs += shaderConstant(`STROKE_CAP_${key}`, `${val}`, 'u32');
      STROKE_CAP_ENUM[constants[key]] = val;
    };
    const defineStrokeJoinEnum = function (key, val) {
      lineDefs += shaderConstant(`STROKE_JOIN_${key}`, `${val}`, 'u32');
      STROKE_JOIN_ENUM[constants[key]] = val;
    };

    // Define constants in line shaders for each type of cap/join, and also record
    // the values in JS objects
    defineStrokeCapEnum("ROUND", 0);
    defineStrokeCapEnum("PROJECT", 1);
    defineStrokeCapEnum("SQUARE", 2);
    defineStrokeJoinEnum("ROUND", 0);
    defineStrokeJoinEnum("MITER", 1);
    defineStrokeJoinEnum("BEVEL", 2);

    return { STROKE_CAP_ENUM, STROKE_JOIN_ENUM, lineDefs };
  }

  /////////////////////
  // Enums for nodes //
  /////////////////////
  const NodeType = {
    OPERATION: 'operation',
    LITERAL: 'literal',
    VARIABLE: 'variable',
    CONSTANT: 'constant',
    STRUCT: 'struct',
    PHI: 'phi',
    STATEMENT: 'statement',
    ASSIGNMENT: 'assignment',
  };
  const NodeTypeToName = Object.fromEntries(
    Object.entries(NodeType).map(([key, val]) => [val, key])
  );
  const NodeTypeRequiredFields = {
    [NodeType.OPERATION]: ["opCode", "dependsOn", "dimension", "baseType"],
    [NodeType.LITERAL]: ["value", "dimension", "baseType"],
    [NodeType.VARIABLE]: ["identifier", "dimension", "baseType"],
    [NodeType.CONSTANT]: ["value", "dimension", "baseType"],
    [NodeType.STRUCT]: [""],
    [NodeType.PHI]: ["dependsOn", "phiBlocks", "dimension", "baseType"],
    [NodeType.STATEMENT]: ["statementType"],
    [NodeType.ASSIGNMENT]: ["dependsOn"]
  };
  const StatementType = {
    DISCARD: 'discard',
    BREAK: 'break',
    EARLY_RETURN: 'early_return',
    EXPRESSION: 'expression', // Used when we want to output a single expression as a statement, e.g. a for loop condition
    EMPTY: 'empty', // Used for empty statements like ; in for loops
  };
  const BaseType = {
    FLOAT: "float",
    INT: "int",
    BOOL: "bool",
    MAT: "mat",
    DEFER: "defer",
    SAMPLER2D: "sampler2D",
    SAMPLER: "sampler",
  };
  const BasePriority = {
    [BaseType.FLOAT]: 3,
    [BaseType.INT]: 2,
    [BaseType.BOOL]: 1,
    [BaseType.MAT]: 0,
    [BaseType.DEFER]: -1,
    [BaseType.SAMPLER2D]: -10,
    [BaseType.SAMPLER]: -11,
  };
  const DataType = {
    float1: { fnName: "float", baseType: BaseType.FLOAT, dimension:1, priority: 3,  },
    float2: { fnName: "vec2", baseType: BaseType.FLOAT, dimension:2, priority: 3,  },
    float3: { fnName: "vec3", baseType: BaseType.FLOAT, dimension:3, priority: 3,  },
    float4: { fnName: "vec4", baseType: BaseType.FLOAT, dimension:4, priority: 3,  },
    int1: { fnName: "int", baseType: BaseType.INT, dimension:1, priority: 2,  },
    int2: { fnName: "ivec2", baseType: BaseType.INT, dimension:2, priority: 2,  },
    int3: { fnName: "ivec3", baseType: BaseType.INT, dimension:3, priority: 2,  },
    int4: { fnName: "ivec4", baseType: BaseType.INT, dimension:4, priority: 2,  },
    bool1: { fnName: "bool", baseType: BaseType.BOOL, dimension:1, priority: 1,  },
    bool2: { fnName: "bvec2", baseType: BaseType.BOOL, dimension:2, priority: 1,  },
    bool3: { fnName: "bvec3", baseType: BaseType.BOOL, dimension:3, priority: 1,  },
    bool4: { fnName: "bvec4", baseType: BaseType.BOOL, dimension:4, priority: 1,  },
    mat2: { fnName: "mat2x2", baseType: BaseType.MAT, dimension:2, priority: 0,  },
    mat3: { fnName: "mat3x3", baseType: BaseType.MAT, dimension:3, priority: 0,  },
    mat4: { fnName: "mat4x4", baseType: BaseType.MAT, dimension:4, priority: 0,  },
    defer: { fnName:  null, baseType: BaseType.DEFER, dimension: null, priority: -1 },
    sampler2D: { fnName: "sampler2D", baseType: BaseType.SAMPLER2D, dimension: 1, priority: -10 },
    sampler: { fnName: "sampler", baseType: BaseType.SAMPLER, dimension: 1, priority: -11 },
  };
  function isStructType(typeInfo) {
    return !!(typeInfo && typeInfo.properties);
  }
  const GenType = {
    FLOAT: { baseType: BaseType.FLOAT, dimension: null, priority: 3 },
    INT: { baseType: BaseType.INT, dimension: null, priority: 2 },
    BOOL: { baseType: BaseType.BOOL, dimension: null, priority: 1 },
  };
  function typeEquals(nodeA, nodeB) {
    return (nodeA.dimension === nodeB.dimension) && (nodeA.baseType === nodeB.baseType);
  }
  Object.fromEntries(
    Object.values(DataType)
      .filter(info => info.fnName !== null)
      .map(info => [info.fnName, info])
  );
  const OpCode = {
    Binary: {
      ADD: 0,
      SUBTRACT: 1,
      MULTIPLY: 2,
      DIVIDE: 3,
      MODULO: 4,
      EQUAL: 5,
      NOT_EQUAL: 6,
      GREATER_THAN: 7,
      GREATER_EQUAL: 8,
      LESS_THAN: 9,
      LESS_EQUAL: 10,
      LOGICAL_AND: 11,
      LOGICAL_OR: 12,
      MEMBER_ACCESS: 13,
    },
    Unary: {
      LOGICAL_NOT: 100,
      NEGATE: 101,
      PLUS: 102,
      SWIZZLE: 103,
    },
    Nary: {
      FUNCTION_CALL: 200,
      CONSTRUCTOR: 201,
    }};
  const OperatorTable = [
    { arity: "unary", name: "not", symbol: "!", opCode: OpCode.Unary.LOGICAL_NOT },
    { arity: "unary", name: "neg", symbol: "-", opCode: OpCode.Unary.NEGATE },
    { arity: "unary", name: "plus", symbol: "+", opCode: OpCode.Unary.PLUS },
    { arity: "binary", name: "add", symbol: "+", opCode: OpCode.Binary.ADD },
    { arity: "binary", name: "sub", symbol: "-", opCode: OpCode.Binary.SUBTRACT },
    { arity: "binary", name: "mult", symbol: "*", opCode: OpCode.Binary.MULTIPLY },
    { arity: "binary", name: "div", symbol: "/", opCode: OpCode.Binary.DIVIDE },
    { arity: "binary", name: "mod", symbol: "%", opCode: OpCode.Binary.MODULO },
    { arity: "binary", name: "equalTo", symbol: "==", opCode: OpCode.Binary.EQUAL },
    { arity: "binary", name: "notEqual", symbol: "!=", opCode: OpCode.Binary.NOT_EQUAL },
    { arity: "binary", name: "greaterThan", symbol: ">", opCode: OpCode.Binary.GREATER_THAN },
    { arity: "binary", name: "greaterEqual", symbol: ">=", opCode: OpCode.Binary.GREATER_EQUAL },
    { arity: "binary", name: "lessThan", symbol: "<", opCode: OpCode.Binary.LESS_THAN },
    { arity: "binary", name: "lessEqual", symbol: "<=", opCode: OpCode.Binary.LESS_EQUAL },
    { arity: "binary", name: "and", symbol: "&&", opCode: OpCode.Binary.LOGICAL_AND },
    { arity: "binary", name: "or", symbol: "||", opCode: OpCode.Binary.LOGICAL_OR },
  ];
  // export const SymbolToOpCode = {};
  const OpCodeToSymbol = {};
  for (const { symbol, opCode, name, arity } of OperatorTable) {
    // SymbolToOpCode[symbol] = opCode;
    OpCodeToSymbol[opCode] = symbol;
  }
  const BlockType = {
    GLOBAL: 'global',
    FUNCTION: 'function',
    BRANCH: 'branch',
    IF_COND: 'if_cond',
    IF_BODY: 'if_body',
    ELSE_COND: 'else_cond',
    SCOPE_START: 'scope_start',
    SCOPE_END: 'scope_end',
    FOR: 'for',
    MERGE: 'merge',
    DEFAULT: 'default',
  };
  Object.fromEntries(
    Object.entries(BlockType).map(([key, val]) => [val, key])
  );

  const uniforms$4 = `
struct Uniforms {
// @p5 ifdef Vertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uViewMatrix: mat4x4<f32>,
  uModelNormalMatrix: mat3x3<f32>,
  uCameraNormalMatrix: mat3x3<f32>,
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
// @p5 endif
  uProjectionMatrix: mat4x4<f32>,
  uMaterialColor: vec4<f32>,
  uUseVertexColor: u32,
};
`;

  const colorVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
  @location(3) aVertexColor: vec4<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vVertexNormal: vec3<f32>,
  @location(1) vVertTexCoord: vec2<f32>,
  @location(2) vColor: vec4<f32>,
};

${uniforms$4}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct Vertex {
  position: vec3<f32>,
  normal: vec3<f32>,
  texCoord: vec2<f32>,
  color: vec4<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  HOOK_beforeVertex();
  var output: VertexOutput;

  let useVertexColor = (uniforms.uUseVertexColor != 0 && input.aVertexColor.x >= 0.0);
  var inputs = Vertex(
    input.aPosition,
    input.aNormal,
    input.aTexCoord,
    select(uniforms.uMaterialColor, input.aVertexColor, useVertexColor)
  );

// @p5 ifdef Vertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  inputs.position = (uniforms.uModelMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uModelNormalMatrix * inputs.normal;
  inputs = HOOK_getWorldInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uniforms.uViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uCameraNormalMatrix * inputs.normal;
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  // Apply both at once
  inputs.position = (uniforms.uModelViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uNormalMatrix * inputs.normal;
// @p5 endif

// @p5 ifdef Vertex getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
// @p5 endif

  output.vVertTexCoord = inputs.texCoord;
  output.vVertexNormal = normalize(inputs.normal);
  output.vColor = inputs.color;

  output.Position = uniforms.uProjectionMatrix * vec4<f32>(inputs.position, 1.0);

  HOOK_afterVertex();
  return output;
}
`;

  const colorFragmentShader = `
struct FragmentInput {
  @location(0) vVertexNormal: vec3<f32>,
  @location(1) vVertTexCoord: vec2<f32>,
  @location(2) vColor: vec4<f32>,
};

${uniforms$4}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;


@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();
  var outColor = HOOK_getFinalColor(input.vColor);
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  HOOK_afterFragment();
  return outColor;
}
`;

  const uniforms$3 = `
struct Uniforms {
// @p5 ifdef StrokeVertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uViewMatrix: mat4x4<f32>,
// @p5 endif
// @p5 ifndef StrokeVertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
// @p5 endif
  uMaterialColor: vec4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uStrokeWeight: f32,
  uUseLineColor: f32,
  uSimpleLines: f32,
  uViewport: vec4<f32>,
  uPerspective: u32,
  uStrokeCap: u32,
  uStrokeJoin: u32,
}`;

  const lineVertexShader = `
struct StrokeVertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aSide: f32,
  @location(2) aTangentIn: vec3<f32>,
  @location(3) aTangentOut: vec3<f32>,
  @location(4) aVertexColor: vec4<f32>,
};

struct StrokeVertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vColor: vec4<f32>,
  @location(1) vTangent: vec2<f32>,
  @location(2) vCenter: vec2<f32>,
  @location(3) vPosition: vec2<f32>,
  @location(4) vMaxDist: f32,
  @location(5) vCap: f32,
  @location(6) vJoin: f32,
  @location(7) vStrokeWeight: f32,
};

${uniforms$3}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct StrokeVertex {
  position: vec3<f32>,
  tangentIn: vec3<f32>,
  tangentOut: vec3<f32>,
  color: vec4<f32>,
  weight: f32,
}

fn lineIntersection(aPoint: vec2f, aDir: vec2f, bPoint: vec2f, bDir: vec2f) -> vec2f {
  // Rotate and translate so a starts at the origin and goes out to the right
  var bMutPoint = bPoint;
  bMutPoint -= aPoint;
  var rotatedBFrom = vec2<f32>(
    bMutPoint.x*aDir.x + bMutPoint.y*aDir.y,
    bMutPoint.y*aDir.x - bMutPoint.x*aDir.y
  );
  var bTo = bMutPoint + bDir;
  var rotatedBTo = vec2<f32>(
    bTo.x*aDir.x + bTo.y*aDir.y,
    bTo.y*aDir.x - bTo.x*aDir.y
  );
  var intersectionDistance =
    rotatedBTo.x + (rotatedBFrom.x - rotatedBTo.x) * rotatedBTo.y /
    (rotatedBTo.y - rotatedBFrom.y);
  return aPoint + aDir * intersectionDistance;
}

@vertex
fn main(input: StrokeVertexInput) -> StrokeVertexOutput {
  HOOK_beforeVertex();
  var output: StrokeVertexOutput;
  let simpleLines = (uniforms.uSimpleLines != 0.);
  if (!simpleLines) {
    if (all(input.aTangentIn == vec3<f32>()) != all(input.aTangentOut == vec3<f32>())) {
      output.vCap = 1.;
    } else {
      output.vCap = 0.;
    }
    let conditionA = any(input.aTangentIn != vec3<f32>());
    let conditionB = any(input.aTangentOut != vec3<f32>());
    let conditionC = any(input.aTangentIn != input.aTangentOut);
    if (conditionA && conditionB && conditionC) {
      output.vJoin = 1.;
    } else {
      output.vJoin = 0.;
    }
  }
  var lineColor: vec4<f32>;
  if (uniforms.uUseLineColor != 0.) {
    lineColor = input.aVertexColor;
  } else {
    lineColor = uniforms.uMaterialColor;
  }
  var inputs = StrokeVertex(
    input.aPosition.xyz,
    input.aTangentIn,
    input.aTangentOut,
    lineColor,
    uniforms.uStrokeWeight
  );

// @p5 ifdef StrokeVertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef StrokeVertex getWorldInputs
  inputs.position = (uniforms.uModelMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uniforms.uModelMatrix * vec4<f32>(input.aTangentIn, 1.)).xyz;
  inputs.tangentOut = (uniforms.uModelMatrix * vec4<f32>(input.aTangentOut, 1.)).xyz;
  inputs = HOOK_getWorldInputs(inputs);
// @p5 endif

// @p5 ifdef StrokeVertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uniforms.uViewMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uniforms.uViewMatrix * vec4<f32>(input.aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uniforms.uViewMatrix * vec4<f32>(input.aTangentOut, 0.)).xyz;
// @p5 endif
// @p5 ifndef StrokeVertex getWorldInputs
  // Apply both at once
  inputs.position = (uniforms.uModelViewMatrix * vec4<f32>(inputs.position, 1.)).xyz;
  inputs.tangentIn = (uniforms.uModelViewMatrix * vec4<f32>(input.aTangentIn, 0.)).xyz;
  inputs.tangentOut = (uniforms.uModelViewMatrix * vec4<f32>(input.aTangentOut, 0.)).xyz;
// @p5 endif
// @p5 ifdef StrokeVertex getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
// @p5 endif

  var posp = vec4<f32>(inputs.position, 1.);
  var posqIn = vec4<f32>(inputs.position + inputs.tangentIn, 1.);
  var posqOut = vec4<f32>(inputs.position + inputs.tangentOut, 1.);
  output.vStrokeWeight = inputs.weight;

  var facingCamera = pow(
    // The word space tangent's z value is 0 if it's facing the camera
    abs(normalize(posqIn-posp).z),

    // Using pow() here to ramp 'facingCamera' up from 0 to 1 really quickly
    // so most lines get scaled and don't get clipped
    0.25
  );

  // Moving vertices slightly toward the camera
  // to avoid depth-fighting with the fill triangles.
  // A mix of scaling and offsetting is used based on distance
  // Discussion here:
  // https://github.com/processing/p5.js/issues/7200

  // using a scale <1 moves the lines towards nearby camera
  // in order to prevent popping effects due to half of
  // the line disappearing behind the geometry faces.
  var zDistance = -posp.z;
  var distanceFactor = smoothstep(0., 800., zDistance);

  // Discussed here:
  // http://www.opengl.org/discussion_boards/ubbthreads.php?ubb=showflat&Number=252848
  var scale = mix(1., 0.995, facingCamera);
  var dynamicScale = mix(scale, 1.0, distanceFactor); // Closer = more scale, farther = less

  posp = vec4<f32>(posp.xyz * dynamicScale, posp.w);
  posqIn = vec4<f32>(posqIn.xyz * dynamicScale, posqIn.w);
  posqOut= vec4<f32>(posqOut.xyz * dynamicScale, posqOut.w);

  // Moving vertices slightly toward camera when far away
  // https://github.com/processing/p5.js/issues/6956
  var zOffset = mix(0., -1., facingCamera);
  var dynamicZAdjustment = mix(0., zOffset, distanceFactor); // Closer = less zAdjustment, farther = more

  posp.z -= dynamicZAdjustment;
  posqIn.z -= dynamicZAdjustment;
  posqOut.z -= dynamicZAdjustment;

  var p = uniforms.uProjectionMatrix * posp;
  var qIn = uniforms.uProjectionMatrix * posqIn;
  var qOut = uniforms.uProjectionMatrix * posqOut;

  var tangentIn = normalize((qIn.xy * p.w - p.xy * qIn.w) * uniforms.uViewport.zw);
  var tangentOut = normalize((qOut.xy * p.w - p.xy * qOut.w) * uniforms.uViewport.zw);

  var curPerspScale = vec2<f32>();
  if (uniforms.uPerspective == 1) {
    // Perspective ---
    // convert from world to clip by multiplying with projection scaling factor
    // to get the right thickness (see https://github.com/processing/processing/issues/5182)

    // The y value of the projection matrix may be flipped if rendering to a Framebuffer.
    // Multiplying again by its sign here negates the flip to get just the scale.
    curPerspScale = (uniforms.uProjectionMatrix * vec4(1., sign(uniforms.uProjectionMatrix[1][1]), 0., 0.)).xy;
  } else {
    // No Perspective ---
    // multiply by W (to cancel out division by W later in the pipeline) and
    // convert from screen to clip (derived from clip to screen above)
    curPerspScale = p.w / (0.5 * uniforms.uViewport.zw);
  }

  var offset = vec2<f32>();
  if (output.vJoin == 1. && !simpleLines) {
    output.vTangent = normalize(tangentIn + tangentOut);
    var normalIn = vec2<f32>(-tangentIn.y, tangentIn.x);
    var normalOut = vec2<f32>(-tangentOut.y, tangentOut.x);
    var side = sign(input.aSide);
    var sideEnum = abs(input.aSide);

    // We generate vertices for joins on either side of the centerline, but
    // the "elbow" side is the only one needing a join. By not setting the
    // offset for the other side, all its vertices will end up in the same
    // spot and not render, effectively discarding it.
    if (sign(dot(tangentOut, vec2<f32>(-tangentIn.y, tangentIn.x))) != side) {
      // Side enums:
      //   1: the side going into the join
      //   2: the middle of the join
      //   3: the side going out of the join
      if (sideEnum == 2.) {
        // Calculate the position + tangent on either side of the join, and
        // find where the lines intersect to find the elbow of the join
        var c = (posp.xy / posp.w + vec2<f32>(1.)) * 0.5 * uniforms.uViewport.zw;

        var intersection = lineIntersection(
          c + (side * normalIn * inputs.weight / 2.),
          tangentIn,
          c + (side * normalOut * inputs.weight / 2.),
          tangentOut
        );
        offset = intersection - c;


        // When lines are thick and the angle of the join approaches 180, the
        // elbow might be really far from the center. We'll apply a limit to
        // the magnitude to avoid lines going across the whole screen when this
        // happens.
        var mag = length(offset);
        var maxMag = 3. * inputs.weight;
        if (mag > maxMag) {
          offset *= maxMag / mag;
        }
      } else if (sideEnum == 1.) {
          offset = side * normalIn * inputs.weight / 2.;
      } else if (sideEnum == 3.) {
          offset = side * normalOut * inputs.weight / 2.;
      }
    }
    if (uniforms.uStrokeJoin == 2) {
      var avgNormal = vec2<f32>(-output.vTangent.y, output.vTangent.x);
      output.vMaxDist = abs(dot(avgNormal, normalIn * inputs.weight / 2.));
    } else {
      output.vMaxDist = inputs.weight / 2.;
    }
  } else {
    var tangent: vec2<f32>;
    if (all(input.aTangentIn == vec3<f32>())) {
      tangent = tangentOut;
    } else {
      tangent = tangentIn;
    }
    output.vTangent = tangent;
    var normal = vec2<f32>(-tangent.y, tangent.x);

    var normalOffset = sign(input.aSide);
    // Caps will have side values of -2 or 2 on the edge of the cap that
    // extends out from the line
    var tangentOffset = abs(input.aSide) - 1.;
    offset = (normal * normalOffset + tangent * tangentOffset) *
      inputs.weight * 0.5;
    output.vMaxDist = inputs.weight / 2.;
  }
  output.vCenter = p.xy;
  output.vPosition = output.vCenter + offset;
  output.vColor = inputs.color;

  output.Position = vec4<f32>(
    p.xy + offset.xy * curPerspScale,
    p.zw
  );
  HOOK_afterVertex();
  return output;
}`;

  const lineFragmentShader = `
struct StrokeFragmentInput {
  @location(0) vColor: vec4<f32>,
  @location(1) vTangent: vec2<f32>,
  @location(2) vCenter: vec2<f32>,
  @location(3) vPosition: vec2<f32>,
  @location(4) vMaxDist: f32,
  @location(5) vCap: f32,
  @location(6) vJoin: f32,
  @location(7) vStrokeWeight: f32,
}

${uniforms$3}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;


fn distSquared(a: vec2<f32>, b: vec2<f32>) -> f32 {
  return dot(b - a, b - a);
}

struct Inputs {
  color: vec4<f32>,
  tangent: vec2<f32>,
  center: vec2<f32>,
  position: vec2<f32>,
  strokeWeight: f32,
}

@fragment
fn main(input: StrokeFragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();

  var inputs: Inputs;
  inputs.color = input.vColor;
  inputs.tangent = input.vTangent;
  inputs.center = input.vCenter;
  inputs.position = input.vPosition;
  inputs.strokeWeight = input.vStrokeWeight;
  inputs = HOOK_getPixelInputs(inputs);

  if (input.vCap > 0.) {
    if (
      uniforms.uStrokeCap == STROKE_CAP_ROUND &&
      HOOK_shouldDiscard(distSquared(inputs.position, inputs.center) > inputs.strokeWeight * inputs.strokeWeight * 0.25)
    ) {
      discard;
    } else if (
      uniforms.uStrokeCap == STROKE_CAP_SQUARE &&
      HOOK_shouldDiscard(dot(inputs.position - inputs.center, inputs.tangent) > 0.)
    ) {
      discard;
    } else if (HOOK_shouldDiscard(false)) {
      discard;
    }
  } else if (input.vJoin > 0.) {
    if (
      uniforms.uStrokeJoin == STROKE_JOIN_ROUND &&
      HOOK_shouldDiscard(distSquared(inputs.position, inputs.center) > inputs.strokeWeight * inputs.strokeWeight * 0.25)
    ) {
      discard;
    } else if (uniforms.uStrokeJoin == STROKE_JOIN_BEVEL) {
      let normal = vec2<f32>(-inputs.tangent.y, -inputs.tangent.x);
      if (HOOK_shouldDiscard(abs(dot(inputs.position - inputs.center, normal)) > input.vMaxDist)) {
        discard;
      }
    } else if (HOOK_shouldDiscard(false)) {
      discard;
    }
  }
  var col = HOOK_getFinalColor(inputs.color);
  col = vec4<f32>(col.rgb, 1.0) * col.a;
  HOOK_afterFragment();
  return vec4<f32>(col);
}
`;

  const uniforms$2 = `
struct Uniforms {
// @p5 ifdef Vertex getWorldInputs
  uModelMatrix: mat4x4<f32>,
  uModelNormalMatrix: mat3x3<f32>,
  uCameraNormalMatrix: mat3x3<f32>,
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  uModelViewMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
// @p5 endif
  uViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uMaterialColor: vec4<f32>,
  uUseVertexColor: u32,

  uHasSetAmbient: u32,
  uAmbientColor: vec3<f32>,
  uSpecularMatColor: vec4<f32>,
  uAmbientMatColor: vec4<f32>,
  uEmissiveMatColor: vec4<f32>,

  uTint: vec4<f32>,
  isTexture: u32,

  uCameraRotation: mat3x3<f32>,

  uDirectionalLightCount: i32,
  uLightingDirection: array<vec3<f32>, 5>,
  uDirectionalDiffuseColors: array<vec3<f32>, 5>,
  uDirectionalSpecularColors: array<vec3<f32>, 5>,

  uPointLightCount: i32,
  uPointLightLocation: array<vec3<f32>, 5>,
  uPointLightDiffuseColors: array<vec3<f32>, 5>,
  uPointLightSpecularColors: array<vec3<f32>, 5>,

  uSpotLightCount: i32,
  uSpotLightAngle: vec4<f32>,
  uSpotLightConc: vec4<f32>,
  uSpotLightDiffuseColors: array<vec3<f32>, 4>,
  uSpotLightSpecularColors: array<vec3<f32>, 4>,
  uSpotLightLocation: array<vec3<f32>, 4>,
  uSpotLightDirection: array<vec3<f32>, 4>,

  uSpecular: u32,
  uShininess: f32,
  uMetallic: f32,

  uConstantAttenuation: f32,
  uLinearAttenuation: f32,
  uQuadraticAttenuation: f32,

  uUseImageLight: u32,
  uUseLighting: u32,
};
`;

  const materialVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
  @location(3) aVertexColor: vec4<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vNormal: vec3<f32>,
  @location(1) vTexCoord: vec2<f32>,
  @location(2) vViewPosition: vec3<f32>,
  @location(4) vColor: vec4<f32>,
};

${uniforms$2}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct Vertex {
  position: vec3<f32>,
  normal: vec3<f32>,
  texCoord: vec2<f32>,
  color: vec4<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  HOOK_beforeVertex();
  var output: VertexOutput;

  let useVertexColor = (uniforms.uUseVertexColor != 0 && input.aVertexColor.x >= 0.0);
  var inputs = Vertex(
    input.aPosition,
    input.aNormal,
    input.aTexCoord,
    select(uniforms.uMaterialColor, input.aVertexColor, useVertexColor)
  );

// @p5 ifdef Vertex getObjectInputs
  inputs = HOOK_getObjectInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  inputs.position = (uniforms.uModelMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uModelNormalMatrix * inputs.normal;
  inputs = HOOK_getWorldInputs(inputs);
// @p5 endif

// @p5 ifdef Vertex getWorldInputs
  // Already multiplied by the model matrix, just apply view
  inputs.position = (uniforms.uViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uCameraNormalMatrix * inputs.normal;
// @p5 endif
// @p5 ifndef Vertex getWorldInputs
  // Apply both at once
  inputs.position = (uniforms.uModelViewMatrix * vec4<f32>(inputs.position, 1.0)).xyz;
  inputs.normal = uniforms.uNormalMatrix * inputs.normal;
// @p5 endif

// @p5 ifdef Vertex getCameraInputs
  inputs = HOOK_getCameraInputs(inputs);
// @p5 endif

  output.vViewPosition = inputs.position;
  output.vTexCoord = inputs.texCoord;
  output.vNormal = normalize(inputs.normal);
  output.vColor = inputs.color;

  output.Position = uniforms.uProjectionMatrix * vec4<f32>(inputs.position, 1.0);

  HOOK_afterVertex();
  return output;
}
`;

  const materialFragmentShader = `
struct FragmentInput {
  @location(0) vNormal: vec3<f32>,
  @location(1) vTexCoord: vec2<f32>,
  @location(2) vViewPosition: vec3<f32>,
  @location(4) vColor: vec4<f32>,
};

${uniforms$2}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(0) @binding(1) var uSampler: texture_2d<f32>;
@group(0) @binding(2) var uSampler_sampler: sampler;

@group(0) @binding(3) var environmentMapDiffused: texture_2d<f32>;
@group(0) @binding(4) var environmentMapDiffused_sampler: sampler;
@group(0) @binding(5) var environmentMapSpecular: texture_2d<f32>;
@group(0) @binding(6) var environmentMapSpecular_sampler: sampler;

struct ColorComponents {
  baseColor: vec3<f32>,
  opacity: f32,
  ambientColor: vec3<f32>,
  specularColor: vec3<f32>,
  diffuse: vec3<f32>,
  ambient: vec3<f32>,
  specular: vec3<f32>,
  emissive: vec3<f32>,
}

struct Inputs {
  normal: vec3<f32>,
  texCoord: vec2<f32>,
  ambientLight: vec3<f32>,
  ambientMaterial: vec3<f32>,
  specularMaterial: vec3<f32>,
  emissiveMaterial: vec3<f32>,
  color: vec4<f32>,
  shininess: f32,
  metalness: f32,
}


struct LightResult {
  diffuse: vec3<f32>,
  specular: vec3<f32>,
}
struct LightIntensityResult {
  diffuse: f32,
  specular: f32,
}

const specularFactor = 2.0;
const diffuseFactor = 0.73;
const PI = 3.14159265359;

fn mapTextureToNormal(v: vec3<f32>) -> vec2<f32> {
  // x = r sin(phi) cos(theta)
  // y = r cos(phi)
  // z = r sin(phi) sin(theta)
  let phi = acos(v.y);
  // if phi is 0, then there are no x, z components
  var theta = 0.0;
  // else
  theta = acos(v.x / sin(phi));
  let sinTheta = v.z / sin(phi);
  if (sinTheta < 0.0) {
    // Turn it into -theta, but in the 0-2PI range
    theta = 2.0 * PI - theta;
  }
  theta = theta / (2.0 * PI);
  let phiNorm = phi / PI;

  let angles = vec2<f32>(fract(theta + 0.25), 1.0 - phiNorm);
  return angles;
}

fn calculateImageDiffuse(vNormal: vec3<f32>, vViewPosition: vec3<f32>, metallic: f32) -> vec3<f32> {
  // make 2 seperate builds
  let worldCameraPosition = vec3<f32>(0.0, 0.0, 0.0);  // hardcoded world camera position
  let worldNormal = normalize(vNormal * uniforms.uCameraRotation);
  let newTexCoord = mapTextureToNormal(worldNormal);
  let texture = textureSample(environmentMapDiffused, environmentMapDiffused_sampler, newTexCoord);
  // this is to make the darker sections more dark
  // png and jpg usually flatten the brightness so it is to reverse that
  return mix(smoothstep(vec3<f32>(0.0), vec3<f32>(1.0), texture.xyz), vec3<f32>(0.0), metallic);
}

fn calculateImageSpecular(vNormal: vec3<f32>, vViewPosition: vec3<f32>, shininess: f32, metallic: f32) -> vec3<f32> {
  let worldCameraPosition = vec3<f32>(0.0, 0.0, 0.0);
  let worldNormal = normalize(vNormal);
  let lightDirection = normalize(vViewPosition - worldCameraPosition);
  let R = reflect(lightDirection, worldNormal) * uniforms.uCameraRotation;
  let newTexCoord = mapTextureToNormal(R);

  // In p5js the range of shininess is >= 1,
  // Therefore roughness range will be ([0,1]*8)*20 or [0, 160]
  // The factor of 8 is because currently the getSpecularTexture
  // only calculated 8 different levels of roughness
  // The factor of 20 is just to spread up this range so that,
  // [1, max] of shininess is converted to [0,160] of roughness
  let roughness = 20.0 / shininess;
  let outColor = textureSampleLevel(environmentMapSpecular, environmentMapSpecular_sampler, newTexCoord, roughness * 8.0 - 1.);

  // this is to make the darker sections more dark
  // png and jpg usually flatten the brightness so it is to reverse that
  return mix(
    pow(outColor.xyz, vec3<f32>(10.0)),
    pow(outColor.xyz, vec3<f32>(1.2)),
    metallic
  );
}

fn phongSpecular(
  lightDirection: vec3<f32>,
  viewDirection: vec3<f32>,
  surfaceNormal: vec3<f32>,
  shininess: f32
) -> f32 {
  let R = reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

fn lambertDiffuse(lightDirection: vec3<f32>, surfaceNormal: vec3<f32>) -> f32 {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

fn singleLight(
  viewDirection: vec3<f32>,
  normal: vec3<f32>,
  lightVector: vec3<f32>,
  shininess: f32,
  metallic: f32
) -> LightIntensityResult {
  let lightDir = normalize(lightVector);
  let specularIntensity = mix(1.0, 0.4, metallic);
  let diffuseIntensity = mix(1.0, 0.1, metallic);
  let diffuse = lambertDiffuse(lightDir, normal) * diffuseIntensity;
  let specular = select(
    0.,
    phongSpecular(lightDir, viewDirection, normal, shininess) * specularIntensity,
    uniforms.uSpecular == 1
  );
  return LightIntensityResult(diffuse, specular);
}

fn totalLight(
  modelPosition: vec3<f32>,
  normal: vec3<f32>,
  shininess: f32,
  metallic: f32
) -> LightResult {
  var totalSpecular = vec3<f32>(0.0, 0.0, 0.0);
  var totalDiffuse = vec3<f32>(0.0, 0.0, 0.0);

  if (uniforms.uUseLighting == 0) {
    return LightResult(vec3<f32>(1.0, 1.0, 1.0), totalSpecular);
  }

  let viewDirection = normalize(-modelPosition);

  for (var j = 0; j < 5; j++) {
    if (j < uniforms.uDirectionalLightCount) {
      let lightVector = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uLightingDirection[j],
        0.0
      )).xyz;
      let lightColor = uniforms.uDirectionalDiffuseColors[j];
      let specularColor = uniforms.uDirectionalSpecularColors[j];
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }

    if (j < uniforms.uPointLightCount) {
      let lightPosition = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uPointLightLocation[j],
        1.0
      )).xyz;
      let lightVector = modelPosition - lightPosition;
      let lightDistance = length(lightVector);
      let lightFalloff = 1.0 / (
        uniforms.uConstantAttenuation +
        lightDistance * uniforms.uLinearAttenuation +
        lightDistance * lightDistance * uniforms.uQuadraticAttenuation
      );
      let lightColor = uniforms.uPointLightDiffuseColors[j] * lightFalloff;
      let specularColor = uniforms.uPointLightSpecularColors[j] * lightFalloff;
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }

    if (j < uniforms.uSpotLightCount) {
      let lightPosition = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uSpotLightLocation[j],
        1.0
      )).xyz;
      let lightVector = modelPosition - lightPosition;
      let lightDistance = length(lightVector);
      var lightFalloff = 1.0 / (
        uniforms.uConstantAttenuation +
        lightDistance * uniforms.uLinearAttenuation +
        lightDistance * lightDistance * uniforms.uQuadraticAttenuation
      );
      let lightDirection = (uniforms.uViewMatrix * vec4<f32>(
        uniforms.uSpotLightDirection[j],
        0.0
      )).xyz;
      let spotDot = dot(normalize(lightVector), normalize(lightDirection));
      let spotFalloff = select(
        0.0,
        pow(spotDot, uniforms.uSpotLightConc[j]),
        spotDot < uniforms.uSpotLightAngle[j]
      );
      lightFalloff *= spotFalloff;
      let lightColor = uniforms.uSpotLightDiffuseColors[j];
      let specularColor = uniforms.uSpotLightSpecularColors[j];
      let result = singleLight(viewDirection, normal, lightVector, shininess, metallic);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * specularColor;
    }
  }

  // Image light contribution
  if (uniforms.uUseImageLight != 0) {
    totalDiffuse += calculateImageDiffuse(normal, modelPosition, metallic);
    totalSpecular += calculateImageSpecular(normal, modelPosition, shininess, metallic);
  }

  return LightResult(
    totalDiffuse * diffuseFactor,
    totalSpecular * specularFactor
  );
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  HOOK_beforeFragment();

  let color = select(
    input.vColor,
    textureSample(uSampler, uSampler_sampler, input.vTexCoord) * (uniforms.uTint/255.0),
    uniforms.isTexture == 1
  ); // TODO: check isTexture and apply tint
  var inputs = Inputs(
    normalize(input.vNormal),
    input.vTexCoord,
    uniforms.uAmbientColor,
    select(color.rgb, uniforms.uAmbientMatColor.rgb, uniforms.uHasSetAmbient == 1),
    uniforms.uSpecularMatColor.rgb,
    uniforms.uEmissiveMatColor.rgb,
    color,
    uniforms.uShininess,
    uniforms.uMetallic
  );
  inputs = HOOK_getPixelInputs(inputs);

  let light = totalLight(
    input.vViewPosition,
    inputs.normal,
    inputs.shininess,
    inputs.metalness
  );

  let baseColor = inputs.color;
  let components = ColorComponents(
    baseColor.rgb,
    baseColor.a,
    inputs.ambientMaterial,
    inputs.specularMaterial,
    light.diffuse,
    inputs.ambientLight,
    light.specular,
    inputs.emissiveMaterial
  );

  var outColor = HOOK_getFinalColor(
    HOOK_combineColors(components)
  );
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  HOOK_afterFragment();
  return outColor;
}
`;

  const uniforms$1 = `
struct Uniforms {
  uModelViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uStrokeImageSize: vec2<i32>,
  uCellsImageSize: vec2<i32>,
  uGridImageSize: vec2<i32>,
  uGridOffset: vec2<i32>,
  uGridSize: vec2<i32>,
  uGlyphRect: vec4<f32>,
  uGlyphOffset: f32,
  uMaterialColor: vec4<f32>,
};
`;

  const fontVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aTexCoord: vec2<f32>,
};

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) vTexCoord: vec2<f32>,
};

${uniforms$1}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  var positionVec4 = vec4<f32>(input.aPosition, 1.0);

  // scale by the size of the glyph's rectangle
  positionVec4.x = positionVec4.x * (uniforms.uGlyphRect.z - uniforms.uGlyphRect.x);
  positionVec4.y = positionVec4.y * (uniforms.uGlyphRect.w - uniforms.uGlyphRect.y);

  // Expand glyph bounding boxes by 1px on each side to give a bit of room
  // for antialiasing
  let newOrigin = (uniforms.uModelViewMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0)).xyz;
  let newDX = (uniforms.uModelViewMatrix * vec4<f32>(1.0, 0.0, 0.0, 1.0)).xyz;
  let newDY = (uniforms.uModelViewMatrix * vec4<f32>(0.0, 1.0, 0.0, 1.0)).xyz;
  let pixelScale = vec2<f32>(
    1.0 / length(newOrigin - newDX),
    1.0 / length(newOrigin - newDY)
  );
  let offset = pixelScale * normalize(input.aTexCoord - vec2<f32>(0.5, 0.5));
  let textureOffset = offset * (1.0 / vec2<f32>(
    uniforms.uGlyphRect.z - uniforms.uGlyphRect.x,
    uniforms.uGlyphRect.w - uniforms.uGlyphRect.y
  ));

  // move to the corner of the glyph
  positionVec4.x = positionVec4.x + uniforms.uGlyphRect.x;
  positionVec4.y = positionVec4.y + uniforms.uGlyphRect.y;

  // move to the letter's line offset
  positionVec4.x = positionVec4.x + uniforms.uGlyphOffset;

  positionVec4.x = positionVec4.x + offset.x;
  positionVec4.y = positionVec4.y + offset.y;

  output.Position = uniforms.uProjectionMatrix * uniforms.uModelViewMatrix * positionVec4;
  output.vTexCoord = input.aTexCoord + textureOffset;

  return output;
}
`;

  const fontFragmentShader = `
struct FragmentInput {
  @location(0) vTexCoord: vec2<f32>,
};

${uniforms$1}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(1) @binding(0) var uSamplerStrokes: texture_2d<f32>;
@group(1) @binding(1) var uSamplerStrokes_sampler: sampler;
@group(1) @binding(2) var uSamplerRowStrokes: texture_2d<f32>;
@group(1) @binding(3) var uSamplerRowStrokes_sampler: sampler;
@group(1) @binding(4) var uSamplerRows: texture_2d<f32>;
@group(1) @binding(5) var uSamplerRows_sampler: sampler;
@group(1) @binding(6) var uSamplerColStrokes: texture_2d<f32>;
@group(1) @binding(7) var uSamplerColStrokes_sampler: sampler;
@group(1) @binding(8) var uSamplerCols: texture_2d<f32>;
@group(1) @binding(9) var uSamplerCols_sampler: sampler;

// some helper functions
fn ROUND_f32(v: f32) -> i32 { return i32(floor(v + 0.5)); }
fn ROUND_vec2(v: vec2<f32>) -> vec2<i32> { return vec2<i32>(floor(v + 0.5)); }
fn saturate_f32(v: f32) -> f32 { return clamp(v, 0.0, 1.0); }
fn saturate_vec2(v: vec2<f32>) -> vec2<f32> { return clamp(v, vec2<f32>(0.0), vec2<f32>(1.0)); }

fn mul_f32_i32(v1: f32, v2: i32) -> i32 {
  return i32(floor(v1 * f32(v2)));
}

fn mul_vec2_ivec2(v1: vec2<f32>, v2: vec2<i32>) -> vec2<i32> {
  return vec2<i32>(floor(v1 * vec2<f32>(v2) + 0.5));
}

// unpack a 16-bit integer from a float vec2
fn getInt16(v: vec2<f32>) -> i32 {
  let iv = ROUND_vec2(v * 255.0);
  return iv.x * 128 + iv.y;
}

const minDistance: f32 = 1.0/8192.0;
const hardness: f32 = 1.05; // amount of antialias

// the maximum number of curves in a glyph
const N: i32 = 250;

// retrieves an indexed pixel from a texture
fn getTexel(texture: texture_2d<f32>, samp: sampler, pos: i32, size: vec2<i32>) -> vec4<f32> {
  let width = size.x;
  let x = pos % width;
  let y = pos / width;

  return textureLoad(texture, vec2<i32>(x, y), 0);
}

fn calculateCrossings(p0: vec2<f32>, p1: vec2<f32>, p2: vec2<f32>, vTexCoord: vec2<f32>, pixelScale: vec2<f32>) -> array<vec2<f32>, 2> {
  // get the coefficients of the quadratic in t
  var a = p0 - p1 * 2.0 + p2;
  var b = p0 - p1;
  a = vec2<f32>(
    select(a.x, sign(a.x) * 1e-6, abs(a.x) < 1e-6),
    select(a.y, sign(a.y) * 1e-6, abs(a.y) < 1e-6)
  );
  b = vec2<f32>(
    select(b.x, sign(b.x) * 1e-6, abs(b.x) < 1e-6),
    select(b.y, sign(b.y) * 1e-6, abs(b.y) < 1e-6)
  );
  let c = p0 - vTexCoord;

  // found out which values of 't' it crosses the axes
  let surd = sqrt(max(vec2<f32>(0.0), b * b - a * c));
  let t1 = ((b - surd) / a).yx;
  let t2 = ((b + surd) / a).yx;

  // approximate straight lines to avoid rounding errors
  var t1_fixed = t1;
  var t2_fixed = t2;
  if (abs(a.y) < 0.001) {
    t1_fixed.x = c.y / (2.0 * b.y);
    t2_fixed.x = c.y / (2.0 * b.y);
  }

  if (abs(a.x) < 0.001) {
    t1_fixed.y = c.x / (2.0 * b.x);
    t2_fixed.y = c.x / (2.0 * b.x);
  }

  // plug into quadratic formula to find the coordinates of the crossings
  let C1 = ((a * t1_fixed - b * 2.0) * t1_fixed + c) * pixelScale;
  let C2 = ((a * t2_fixed - b * 2.0) * t2_fixed + c) * pixelScale;

  return array<vec2<f32>, 2>(C1, C2);
}

fn coverageX(p0: vec2<f32>, p1: vec2<f32>, p2: vec2<f32>, vTexCoord: vec2<f32>, pixelScale: vec2<f32>, coverage: ptr<function, vec2<f32>>, weight: ptr<function, vec2<f32>>) {
  let crossings = calculateCrossings(p0, p1, p2, vTexCoord, pixelScale);
  let C1 = crossings[0];
  let C2 = crossings[1];

  // determine on which side of the x-axis the points lie
  let y0 = p0.y > vTexCoord.y;
  let y1 = p1.y > vTexCoord.y;
  let y2 = p2.y > vTexCoord.y;

  // could we be under the curve (after t1)?
  if ((y1 && !y2) || (!y1 && y0)) {
    // add the coverage for t1
    (*coverage).x = (*coverage).x + saturate_f32(C1.x + 0.5);
    // calculate the anti-aliasing for t1
    (*weight).x = min((*weight).x, abs(C1.x));
  }

  // are we outside the curve (after t2)?
  if ((y1 && !y0) || (!y1 && y2)) {
    // subtract the coverage for t2
    (*coverage).x = (*coverage).x - saturate_f32(C2.x + 0.5);
    // calculate the anti-aliasing for t2
    (*weight).x = min((*weight).x, abs(C2.x));
  }
}

// this is essentially the same as coverageX, but with the axes swapped
fn coverageY(p0: vec2<f32>, p1: vec2<f32>, p2: vec2<f32>, vTexCoord: vec2<f32>, pixelScale: vec2<f32>, coverage: ptr<function, vec2<f32>>, weight: ptr<function, vec2<f32>>) {
  let crossings = calculateCrossings(p0, p1, p2, vTexCoord, pixelScale);
  let C1 = crossings[0];
  let C2 = crossings[1];

  let x0 = p0.x > vTexCoord.x;
  let x1 = p1.x > vTexCoord.x;
  let x2 = p2.x > vTexCoord.x;

  if ((x1 && !x2) || (!x1 && x0)) {
    (*coverage).y = (*coverage).y - saturate_f32(C1.y + 0.5);
    weight.y = min(weight.y, abs(C1.y));
  }

  if ((x1 && !x0) || (!x1 && x2)) {
    (*coverage).y = (*coverage).y + saturate_f32(C2.y + 0.5);
    (*weight).y = min((*weight).y, abs(C2.y));
  }
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // var pixelScale: vec2<f32>;
  var coverage: vec2<f32> = vec2<f32>(0.0);
  var weight: vec2<f32> = vec2<f32>(0.5);
  let pixelScale = hardness / fwidth(input.vTexCoord);

  // which grid cell is this pixel in?
  let gridCoord = vec2<i32>(floor(input.vTexCoord * vec2<f32>(uniforms.uGridSize)));

  // intersect curves in this row
  {
    // the index into the row info bitmap
    let rowIndex = gridCoord.y + uniforms.uGridOffset.y;
    // fetch the info texel
    let rowInfo = getTexel(uSamplerRows, uSamplerRows_sampler, rowIndex, uniforms.uGridImageSize);
    // unpack the rowInfo
    let rowStrokeIndex = getInt16(rowInfo.xy);
    let rowStrokeCount = getInt16(rowInfo.zw);

    for (var iRowStroke = 0; iRowStroke < N; iRowStroke = iRowStroke + 1) {
      if (iRowStroke >= rowStrokeCount) {
        break;
      }

      // each stroke is made up of 3 points: the start and control point
      // and the start of the next curve.
      // fetch the indices of this pair of strokes:
      let strokeIndices = getTexel(uSamplerRowStrokes, uSamplerRowStrokes_sampler, rowStrokeIndex + iRowStroke, uniforms.uCellsImageSize);

      // unpack the stroke index
      let strokePos = getInt16(strokeIndices.xy);

      // fetch the two strokes
      let stroke0 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 0, uniforms.uStrokeImageSize);
      let stroke1 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 1, uniforms.uStrokeImageSize);

      // calculate the coverage
      coverageX(stroke0.xy, stroke0.zw, stroke1.xy, input.vTexCoord, pixelScale, &coverage, &weight);
    }
  }

  // intersect curves in this column
  {
    let colIndex = gridCoord.x + uniforms.uGridOffset.x;
    let colInfo = getTexel(uSamplerCols, uSamplerCols_sampler, colIndex, uniforms.uGridImageSize);
    let colStrokeIndex = getInt16(colInfo.xy);
    let colStrokeCount = getInt16(colInfo.zw);

    for (var iColStroke = 0; iColStroke < N; iColStroke = iColStroke + 1) {
      if (iColStroke >= colStrokeCount) {
        break;
      }

      let strokeIndices = getTexel(uSamplerColStrokes, uSamplerColStrokes_sampler, colStrokeIndex + iColStroke, uniforms.uCellsImageSize);

      let strokePos = getInt16(strokeIndices.xy);
      let stroke0 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 0, uniforms.uStrokeImageSize);
      let stroke1 = getTexel(uSamplerStrokes, uSamplerStrokes_sampler, strokePos + 1, uniforms.uStrokeImageSize);
      coverageY(stroke0.xy, stroke0.zw, stroke1.xy, input.vTexCoord, pixelScale, &coverage, &weight);
    }
  }

  weight = saturate_vec2(vec2<f32>(1.0) - weight * 2.0);
  let distance = max(weight.x + weight.y, minDistance); // manhattan approx.
  let antialias = abs(dot(coverage, weight) / distance);
  let cover = min(abs(coverage.x), abs(coverage.y));
  var outColor = vec4<f32>(uniforms.uMaterialColor.rgb, 1.0) * uniforms.uMaterialColor.a;
  outColor = outColor * saturate_f32(max(antialias, cover));
  return outColor;
}
`;

  function internalError(errorMessage) {
      const prefixedMessage = `[p5.strands internal error]: ${errorMessage}`; 
      throw new Error(prefixedMessage);
  }

  function userError(errorType, errorMessage) {
      const prefixedMessage = `[p5.strands ${errorType}]: ${errorMessage}`;
      throw new Error(prefixedMessage);
  }

  function getOrCreateNode(graph, node) {
    // const key = getNodeKey(node);
    // const existing = graph.cache.get(key);

    // if (existing !== undefined) {
      // return existing;
    // } else {
      const id = createNode(graph, node);
      // graph.cache.set(key, id);
      return id;
    // }
  }

  function createNodeData(data = {}) {
    const node = {
      nodeType: data.nodeType ?? null,
      baseType: data.baseType ?? null,
      dimension: data.dimension ?? null,
      opCode: data.opCode ?? null,
      value: data.value ?? null,
      identifier: data.identifier ?? null,
      statementType: data.statementType ?? null,
      swizzle: data.swizzle ?? null,
      dependsOn: Array.isArray(data.dependsOn) ? data.dependsOn : [],
      usedBy: Array.isArray(data.usedBy) ? data.usedBy : [],
      phiBlocks: Array.isArray(data.phiBlocks) ? data.phiBlocks : [],
    };
    validateNode(node);
    return node;
  }

  function getNodeDataFromID(graph, id) {
    return {
      id,
      nodeType: graph.nodeTypes[id],
      opCode: graph.opCodes[id],
      value: graph.values[id],
      identifier: graph.identifiers[id],
      dependsOn: graph.dependsOn[id],
      usedBy: graph.usedBy[id],
      phiBlocks: graph.phiBlocks[id],
      dimension: graph.dimensions[id],
      baseType: graph.baseTypes[id],
      statementType: graph.statementTypes[id],
      swizzle: graph.swizzles[id],
    }
  }

  function extractNodeTypeInfo(dag, nodeID) {
    return {
      baseType: dag.baseTypes[nodeID],
      dimension: dag.dimensions[nodeID],
      priority: BasePriority[dag.baseTypes[nodeID]],
    };
  }

  /////////////////////////////////
  // Private functions
  /////////////////////////////////
  function createNode(graph, node) {
    const id = graph.nextID++;
    graph.nodeTypes[id] = node.nodeType;
    graph.opCodes[id] = node.opCode;
    graph.values[id] = node.value;
    graph.identifiers[id] = node.identifier;
    graph.dependsOn[id] = node.dependsOn.slice();
    graph.usedBy[id] = node.usedBy;
    graph.phiBlocks[id] = node.phiBlocks.slice();
    graph.baseTypes[id] = node.baseType;
    graph.dimensions[id] = node.dimension;
    graph.statementTypes[id] = node.statementType;
    graph.swizzles[id] = node.swizzle;

    for (const dep of node.dependsOn) {
      if (!Array.isArray(graph.usedBy[dep])) {
        graph.usedBy[dep] = [];
      }
      graph.usedBy[dep].push(id);
    }
    return id;
  }

  function validateNode(node){
    const nodeType = node.nodeType;
    const requiredFields = NodeTypeRequiredFields[nodeType];
    if (requiredFields.length === 2) {
      internalError(`Required fields for node type '${NodeTypeToName[nodeType]}' not defined. Please add them to the utils.js file in p5.strands!`);
    }
    const missingFields = [];
    for (const field of requiredFields) {
      if (node[field] === null) {
        missingFields.push(field);
      }
    }
    if (node.dependsOn?.some(v => v === undefined)) {
      throw new Error('Undefined dependency!');
    }
    if (missingFields.length > 0) {
      internalError(`Missing fields ${missingFields.join(', ')} for a node type '${NodeTypeToName[nodeType]}'.`);
    }
  }

  function recordInBasicBlock(graph, blockID, nodeID) {
    if (nodeID === undefined) {
      internalError('undefined nodeID in `recordInBasicBlock()`');
    }
    if (blockID === undefined) {
      internalError('undefined blockID in `recordInBasicBlock()');
    }
    graph.blockInstructions[blockID] = graph.blockInstructions[blockID] || [];
    graph.blockInstructions[blockID].push(nodeID);
  }

  class StrandsNode {
    constructor(id, dimension, strandsContext) {
      this.id = id;
      this.strandsContext = strandsContext;
      this.dimension = dimension;
      this.isStrandsNode = true;

      // Store original identifier for varying variables
      const dag = this.strandsContext.dag;
      const nodeData = getNodeDataFromID(dag, this.id);
      if (nodeData && nodeData.identifier) {
        this._originalIdentifier = nodeData.identifier;
      }
      if (nodeData) {
        this._originalBaseType = nodeData.baseType;
        this._originalDimension = nodeData.dimension;
      }
    }
    copy() {
      return createStrandsNode(this.id, this.dimension, this.strandsContext);
    }
    typeInfo() {
      return {
        baseType: this._originalBaseType || BaseType.FLOAT,
        dimension: this.dimension
      };
    }
    bridge(value) {
      const { dag, cfg } = this.strandsContext;
      const orig = getNodeDataFromID(dag, this.id);
      const baseType = orig?.baseType ?? BaseType.FLOAT;

      let newValueID;
      if (value instanceof StrandsNode) {
        newValueID = value.id;
      } else {
        const newVal = primitiveConstructorNode(
          this.strandsContext,
          { baseType, dimension: this.dimension },
          value
        );
        newValueID = newVal.id;
      }

      // For varying variables, we need both assignment generation AND a way to reference by identifier
      if (this._originalIdentifier) {
        // Create a variable node for the target (the varying variable)
        const { id: targetVarID } = variableNode(
          this.strandsContext,
          { baseType: this._originalBaseType, dimension: this._originalDimension },
          this._originalIdentifier
        );

        // Create assignment node for GLSL generation
        const assignmentNode = createNodeData({
          nodeType: NodeType.ASSIGNMENT,
          dependsOn: [targetVarID, newValueID],
          phiBlocks: []
        });
        const assignmentID = getOrCreateNode(dag, assignmentNode);
        recordInBasicBlock(cfg, cfg.currentBlock, assignmentID);

        // Track for global assignments processing
        this.strandsContext.globalAssignments.push(assignmentID);

        // Simply update this node to be a variable node with the identifier
        // This ensures it always generates the variable name in expressions
        const variableNodeData = createNodeData({
          nodeType: NodeType.VARIABLE,
          baseType: this._originalBaseType,
          dimension: this._originalDimension,
          identifier: this._originalIdentifier
        });
        const variableID = getOrCreateNode(dag, variableNodeData);

        this.id = variableID; // Point to the variable node for expression generation
      } else {
        this.id = newValueID; // For non-varying variables, just update to new value
      }

      return this;
    }
    bridgeSwizzle(swizzlePattern, value) {
      const { dag, cfg } = this.strandsContext;
      const orig = getNodeDataFromID(dag, this.id);
      const baseType = orig?.baseType ?? BaseType.FLOAT;

      let newValueID;
      if (value instanceof StrandsNode) {
        newValueID = value.id;
      } else {
        const newVal = primitiveConstructorNode(
          this.strandsContext,
          { baseType, dimension: this.dimension },
          value
        );
        newValueID = newVal.id;
      }

      // For varying variables, create swizzle assignment
      if (this._originalIdentifier) {
        // Create a variable node for the target with swizzle
        const { id: targetVarID } = variableNode(
          this.strandsContext,
          { baseType: this._originalBaseType, dimension: this._originalDimension },
          this._originalIdentifier
        );

        // Create a swizzle node for the target (myVarying.xyz)
        const swizzleNode = createNodeData({
          nodeType: NodeType.OPERATION,
          opCode: OpCode.Unary.SWIZZLE,
          baseType: this._originalBaseType,
          dimension: swizzlePattern.length, // xyz = 3, xy = 2, etc.
          swizzle: swizzlePattern,
          dependsOn: [targetVarID]
        });
        const swizzleID = getOrCreateNode(dag, swizzleNode);

        // Create assignment node: myVarying.xyz = value
        const assignmentNode = createNodeData({
          nodeType: NodeType.ASSIGNMENT,
          dependsOn: [swizzleID, newValueID],
          phiBlocks: []
        });
        const assignmentID = getOrCreateNode(dag, assignmentNode);
        recordInBasicBlock(cfg, cfg.currentBlock, assignmentID);

        // Track for global assignments processing in the current hook context
        this.strandsContext.globalAssignments.push(assignmentID);

        // Simply update this node to be a variable node with the identifier
        // This ensures it always generates the variable name in expressions
        const variableNodeData = createNodeData({
          nodeType: NodeType.VARIABLE,
          baseType: this._originalBaseType,
          dimension: this._originalDimension,
          identifier: this._originalIdentifier
        });
        const variableID = getOrCreateNode(dag, variableNodeData);

        this.id = variableID; // Point to the variable node, not the assignment node
      } else {
        this.id = newValueID; // For non-varying variables, just update to new value
      }

      return this;
    }
    getValue() {
      if (this._originalIdentifier) {
        const { id, dimension } = variableNode(
          this.strandsContext,
          { baseType: this._originalBaseType, dimension: this._originalDimension },
          this._originalIdentifier
        );
        return createStrandsNode(id, dimension, this.strandsContext);
      }

      return this;
    }
  }
  function createStrandsNode(id, dimension, strandsContext, onRebind) {
    return new Proxy(
      new StrandsNode(id, dimension, strandsContext),
      swizzleTrap(id, dimension, strandsContext)
    );
  }

  // Need the .js extension because we also import this from a Node script.
  // Try to keep this file minimal because of that.

  // GLSL Built in functions
  // https://docs.gl/el3/abs
  const builtInGLSLFunctions = {
    //////////// Trigonometry //////////
    acos: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    acosh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    asin: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    asinh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    atan: [
      { params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
    ],
    atanh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    cos: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    cosh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    degrees: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    radians: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    sin: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT , isp5Function: true}],
    sinh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    tan: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    tanh: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],

    ////////// Mathematics //////////
    abs: [
      { params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.FLOAT], returnType: GenType.INT, isp5Function: true}
    ],
    ceil: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    clamp: [
      { params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
      { params: [GenType.FLOAT,DataType.float1,DataType.float1], returnType: GenType.FLOAT, isp5Function: false},
      { params: [GenType.INT, GenType.INT, GenType.INT], returnType: GenType.INT, isp5Function: false},
      { params: [GenType.INT, DataType.int1, DataType.int1], returnType: GenType.INT, isp5Function: false},
    ],
    dFdx: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    dFdy: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    exp: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    exp2: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    floor: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    fma: [{ params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    fract: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    fwidth: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    inversesqrt: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    // "isinf": [{}],
    // "isnan": [{}],
    log: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    log2: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    max: [
      { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.INT, GenType.INT], returnType: GenType.INT, isp5Function: true},
      { params: [GenType.INT, DataType.int1], returnType: GenType.INT, isp5Function: true},
    ],
    min: [
      { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.INT, GenType.INT], returnType: GenType.INT, isp5Function: true},
      { params: [GenType.INT, DataType.int1], returnType: GenType.INT, isp5Function: true},
    ],
    mix: [
      { params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
      { params: [GenType.FLOAT, GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: false},
      { params: [GenType.FLOAT, GenType.FLOAT, GenType.BOOL], returnType: GenType.FLOAT, isp5Function: false},
    ],
    mod: [
      { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true},
      { params: [GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: true},
    ],
    // "modf": [{}],
    pow: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    round: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    roundEven: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    sign: [
      { params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
      { params: [GenType.INT], returnType: GenType.INT, isp5Function: false},
    ],
    smoothstep: [
      { params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
      { params: [ DataType.float1,DataType.float1, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false},
    ],
    sqrt: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    step: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    trunc: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],

    ////////// Vector //////////
    cross: [{ params: [DataType.float3, DataType.float3], returnType: DataType.float3, isp5Function: true}],
    distance: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType:DataType.float1, isp5Function: true}],
    dot: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType:DataType.float1, isp5Function: true}],
    equal: [
      { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.BOOL, isp5Function: false},
      { params: [GenType.INT, GenType.INT], returnType: GenType.BOOL, isp5Function: false},
      { params: [GenType.BOOL, GenType.BOOL], returnType: GenType.BOOL, isp5Function: false},
    ],
    faceforward: [{ params: [GenType.FLOAT, GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    length: [{ params: [GenType.FLOAT], returnType:DataType.float1, isp5Function: false}],
    normalize: [{ params: [GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: true}],
    notEqual: [
      { params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.BOOL, isp5Function: false},
      { params: [GenType.INT, GenType.INT], returnType: GenType.BOOL, isp5Function: false},
      { params: [GenType.BOOL, GenType.BOOL], returnType: GenType.BOOL, isp5Function: false},
    ],
    reflect: [{ params: [GenType.FLOAT, GenType.FLOAT], returnType: GenType.FLOAT, isp5Function: false}],
    refract: [{ params: [GenType.FLOAT, GenType.FLOAT,DataType.float1], returnType: GenType.FLOAT, isp5Function: false}],
  };

  const strandsBuiltinFunctions = {
    ...builtInGLSLFunctions,
  };

  //////////////////////////////////////////////
  // Builders for node graphs
  //////////////////////////////////////////////
  function scalarLiteralNode(strandsContext, typeInfo, value) {
    const { cfg, dag } = strandsContext;
    let { dimension, baseType } = typeInfo;
    if (dimension !== 1) {
      internalError('Created a scalar literal node with dimension > 1.');
    }
    const nodeData = createNodeData({
      nodeType: NodeType.LITERAL,
      dimension,
      baseType,
      value
    });
    const id = getOrCreateNode(dag, nodeData);
    recordInBasicBlock(cfg, cfg.currentBlock, id);
    return { id, dimension };
  }

  function variableNode(strandsContext, typeInfo, identifier) {
    const { cfg, dag } = strandsContext;
    const { dimension, baseType } = typeInfo;
    const nodeData = createNodeData({
      nodeType: NodeType.VARIABLE,
      dimension,
      baseType,
      identifier
    });
    const id = getOrCreateNode(dag, nodeData);
    recordInBasicBlock(cfg, cfg.currentBlock, id);
    return { id, dimension };
  }

  function mapPrimitiveDepsToIDs(strandsContext, typeInfo, dependsOn) {
    const inputs = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
    const mappedDependencies = [];
    let { dimension, baseType } = typeInfo;

    const dag = strandsContext.dag;
    let calculatedDimensions = 0;
    let originalNodeID = null;
    for (const dep of inputs.flat(Infinity)) {
      if (dep && dep.isStrandsNode) {
        const node = getNodeDataFromID(dag, dep.id);
        originalNodeID = dep.id;
        baseType = node.baseType;

        if (node.opCode === OpCode.Nary.CONSTRUCTOR) {
          for (const inner of node.dependsOn) {
            mappedDependencies.push(inner);
          }
        } else {
          mappedDependencies.push(dep.id);
        }

        calculatedDimensions += node.dimension;
        continue;
      }
      else if (typeof dep === 'number') {
        const { id, dimension } = scalarLiteralNode(strandsContext, { dimension: 1, baseType }, dep);
        mappedDependencies.push(id);
        calculatedDimensions += dimension;
        continue;
      }
      else {
        userError('type error', `You've tried to construct a scalar or vector type with a non-numeric value: ${dep}`);
      }
    }
    if (dimension === null) {
      dimension = calculatedDimensions;
    } else if (dimension > calculatedDimensions && calculatedDimensions === 1) {
      calculatedDimensions = dimension;
    } else if(calculatedDimensions !== 1 && calculatedDimensions !== dimension) {
      userError('type error', `You've tried to construct a ${baseType + dimension} with ${calculatedDimensions} components`);
    }
    const inferredTypeInfo = {
      dimension,
      baseType,
      priority: BasePriority[baseType],
    };
    return { originalNodeID, mappedDependencies, inferredTypeInfo };
  }

  function constructTypeFromIDs(strandsContext, typeInfo, strandsNodesArray) {
    const nodeData = createNodeData({
      nodeType: NodeType.OPERATION,
      opCode: OpCode.Nary.CONSTRUCTOR,
      dimension: typeInfo.dimension,
      baseType: typeInfo.baseType,
      dependsOn: strandsNodesArray
    });
    const id = getOrCreateNode(strandsContext.dag, nodeData);
    return id;
  }

  function primitiveConstructorNode(strandsContext, typeInfo, dependsOn) {
    const cfg = strandsContext.cfg;
    const { mappedDependencies, inferredTypeInfo } = mapPrimitiveDepsToIDs(strandsContext, typeInfo, dependsOn);

    const finalType = {
      baseType: typeInfo.baseType,
      dimension: inferredTypeInfo.dimension
    };

    const id = constructTypeFromIDs(strandsContext, finalType, mappedDependencies);
    if (typeInfo.baseType !== BaseType.DEFER) {
      recordInBasicBlock(cfg, cfg.currentBlock, id);
    }

    return { id, dimension: finalType.dimension, components: mappedDependencies };
  }

  function functionCallNode(
    strandsContext,
    functionName,
    rawUserArgs,
    { overloads: rawOverloads } = {},
  ) {
    const { cfg, dag } = strandsContext;
    const overloads = rawOverloads || strandsBuiltinFunctions[functionName];

    const preprocessedArgs = rawUserArgs.map((rawUserArg) => mapPrimitiveDepsToIDs(strandsContext, DataType.defer, rawUserArg));
    const matchingArgsCounts = overloads.filter(overload => overload.params.length === preprocessedArgs.length);
    if (matchingArgsCounts.length === 0) {
      const argsLengthSet = new Set();
      const argsLengthArr = [];
      overloads.forEach((overload) => argsLengthSet.add(overload.params.length));
      argsLengthSet.forEach((len) => argsLengthArr.push(`${len}`));
      const argsLengthStr = argsLengthArr.join(', or ');
      userError("parameter validation error",`Function '${functionName}' has ${overloads.length} variants which expect ${argsLengthStr} arguments, but ${preprocessedArgs.length} arguments were provided.`);
    }

    const isGeneric = (T) => T.dimension === null;
    let bestOverload = null;
    let bestScore = 0;
    let inferredReturnType = null;
    let inferredDimension = null;

    for (const overload of matchingArgsCounts) {
      let isValid = true;
      let similarity = 0;

      for (let i = 0; i < preprocessedArgs.length; i++) {
        const preArg = preprocessedArgs[i];
        const argType = preArg.inferredTypeInfo;
        const expectedType = overload.params[i];
        let dimension = expectedType.dimension;

        if (isGeneric(expectedType)) {
          if (inferredDimension === null || inferredDimension === 1) {
            inferredDimension = argType.dimension;
          }

          if (inferredDimension !== argType.dimension &&
            !(argType.dimension === 1 && inferredDimension >= 1)
            ) {
            isValid = false;
          }
          dimension = inferredDimension;
        }
        else {
          if (argType.dimension > dimension) {
            isValid = false;
          }
        }

        if (argType.baseType === expectedType.baseType) {
          similarity += 2;
        }
        else if(expectedType.priority > argType.priority) {
          similarity += 1;
        }

      }

      if (isValid && (!bestOverload || similarity > bestScore)) {
        bestOverload = overload;
        bestScore = similarity;
        inferredReturnType =  {...overload.returnType };
        if (isGeneric(inferredReturnType)) {
          inferredReturnType.dimension = inferredDimension;
        }
      }
    }

    if (bestOverload === null) {
      userError('parameter validation', `No matching overload for ${functionName} was found!`);
    }

    let dependsOn = [];
    for (let i = 0; i < bestOverload.params.length; i++) {
      const arg = preprocessedArgs[i];
      const paramType = { ...bestOverload.params[i] };
      if (isGeneric(paramType)) {
        paramType.dimension = inferredDimension;
      }
      if (arg.originalNodeID && typeEquals(arg.inferredTypeInfo, paramType)) {
        dependsOn.push(arg.originalNodeID);
      }
      else {
        const castedArgID = constructTypeFromIDs(strandsContext, paramType, arg.mappedDependencies);
        recordInBasicBlock(cfg, cfg.currentBlock, castedArgID);
        dependsOn.push(castedArgID);
      }
    }

    const nodeData = createNodeData({
      nodeType: NodeType.OPERATION,
      opCode: OpCode.Nary.FUNCTION_CALL,
      identifier: functionName,
      dependsOn,
      baseType: inferredReturnType.baseType,
      dimension: inferredReturnType.dimension
    });
    const id = getOrCreateNode(dag, nodeData);
    recordInBasicBlock(cfg, cfg.currentBlock, id);
    return { id, dimension: inferredReturnType.dimension  };
  }

  function swizzleNode(strandsContext, parentNode, swizzle) {
    const { dag, cfg } = strandsContext;
    const baseType = dag.baseTypes[parentNode.id];
    const nodeData = createNodeData({
      nodeType: NodeType.OPERATION,
      baseType,
      dimension: swizzle.length,
      opCode: OpCode.Unary.SWIZZLE,
      dependsOn: [parentNode.id],
      swizzle,
    });
    const id = getOrCreateNode(dag, nodeData);
    recordInBasicBlock(cfg, cfg.currentBlock, id);
    return { id, dimension: swizzle.length };
  }

  function swizzleTrap(id, dimension, strandsContext, onRebind) {
      const swizzleSets = [
        ['x', 'y', 'z', 'w'],
        ['r', 'g', 'b', 'a'],
        ['s', 't', 'p', 'q']
      ].map(s => s.slice(0, dimension));
      const trap = {
        get(target, property, receiver) {
          if (property in target) {
            return Reflect.get(...arguments);
          } else {
            for (const set of swizzleSets) {
              if ([...property.toString()].every(char => set.includes(char))) {
                const swizzle = [...property].map(char => {
                  const index = set.indexOf(char);
                  return swizzleSets[0][index];
                }).join('');
                const node = swizzleNode(strandsContext, target, swizzle);
                return createStrandsNode(node.id, node.dimension, strandsContext);
              }
            }
          }
      },
    set(target, property, value, receiver) {
      for (const swizzleSet of swizzleSets) {
        const chars = [...property];
        const valid =
          chars.every(c => swizzleSet.includes(c)) &&
          new Set(chars).size === chars.length &&
          target.dimension >= chars.length;
        if (!valid) continue;

        const dim = target.dimension;

        // lanes are the underlying values of the target vector
        //  e.g. lane 0 holds the value aliased by 'x', 'r', and 's'
        // the lanes array is in the 'correct' order
        const lanes = new Array(dim);
        for (let i = 0; i < dim; i++) {
          const { id, dimension } = swizzleNode(strandsContext, target, 'xyzw'[i]);
          lanes[i] = createStrandsNode(id, dimension, strandsContext);
        }

        // The scalars array contains the individual components of the users values.
        // This may not be the most efficient way, as we swizzle each component individually,
        // so that .xyz becomes .x, .y, .z
        let scalars = [];
        if (value instanceof StrandsNode) {
          if (value.dimension === 1) {
            scalars = Array(chars.length).fill(value);
          } else if (value.dimension === chars.length) {
            for (let k = 0; k < chars.length; k++) {
              const { id, dimension } = swizzleNode(strandsContext, value, 'xyzw'[k]);
              scalars.push(createStrandsNode(id, dimension, strandsContext));
            }
          } else {
            userError('type error', `Swizzle assignment: RHS vector does not match LHS vector (need ${chars.length}, got ${value.dimension}).`);
          }
        } else if (Array.isArray(value)) {
          const flat = value.flat(Infinity);
          if (flat.length === 1) {
            scalars = Array(chars.length).fill(flat[0]);
          } else if (flat.length === chars.length) {
            scalars = flat;
          } else {
            userError('type error', `Swizzle assignment: RHS length ${flat.length} does not match ${chars.length}.`);
          }
        } else if (typeof value === 'number') {
          scalars = Array(chars.length).fill(value);
        } else {
          userError('type error', `Unsupported RHS for swizzle assignment: ${value}`);
        }

        // The canonical index refers to the actual value's position in the vector lanes
        // i.e. we are finding (3,2,1) from .zyx
        // We set the correct value in the lanes array
        for (let j = 0; j < chars.length; j++) {
          const canonicalIndex = swizzleSet.indexOf(chars[j]);
          lanes[canonicalIndex] = scalars[j];
        }

        const orig = getNodeDataFromID(strandsContext.dag, target.id);
        const baseType = orig?.baseType ?? BaseType.FLOAT;
        const { id: newID } = primitiveConstructorNode(
          strandsContext,
          { baseType, dimension: dim },
          lanes
        );

        target.id = newID;
        return true;
      }
      return Reflect.set(...arguments);
    }
    };
    return trap;
  }

  function shouldCreateTemp(dag, nodeID) {
    const nodeType = dag.nodeTypes[nodeID];
    if (nodeType !== NodeType.OPERATION) return false;
    if (dag.baseTypes[nodeID] === BaseType.SAMPLER2D) return false;
    const uses = dag.usedBy[nodeID] || [];
    return uses.length > 1;
  }
  const TypeNames = {
    'float1': 'f32',
    'float2': 'vec2<f32>',
    'float3': 'vec3<f32>',
    'float4': 'vec4<f32>',
    'int1': 'i32',
    'int2': 'vec2<i32>',
    'int3': 'vec3<i32>',
    'int4': 'vec4<i32>',
    'bool1': 'bool',
    'bool2': 'vec2<bool>',
    'bool3': 'vec3<bool>',
    'bool4': 'vec4<bool>',
    'mat2': 'mat2x2<f32>',
    'mat3': 'mat3x3<f32>',
    'mat4': 'mat4x4<f32>',
  };
  const cfgHandlers = {
    [BlockType.DEFAULT]: (blockID, strandsContext, generationContext) => {
      const { dag, cfg } = strandsContext;
      const instructions = cfg.blockInstructions[blockID] || [];
      for (const nodeID of instructions) {
        const nodeType = dag.nodeTypes[nodeID];
        if (shouldCreateTemp(dag, nodeID)) {
          const declaration = wgslBackend.generateDeclaration(generationContext, dag, nodeID);
          generationContext.write(declaration);
        }
        if (nodeType === NodeType.STATEMENT) {
          wgslBackend.generateStatement(generationContext, dag, nodeID);
        }
        if (nodeType === NodeType.ASSIGNMENT) {
          wgslBackend.generateAssignment(generationContext, dag, nodeID);
          generationContext.visitedNodes.add(nodeID);
        }
      }
    },
    [BlockType.BRANCH](blockID, strandsContext, generationContext) {
      const { dag, cfg } = strandsContext;
      // Find all phi nodes in this branch block and declare them
      const blockInstructions = cfg.blockInstructions[blockID] || [];
      for (const nodeID of blockInstructions) {
        const node = getNodeDataFromID(dag, nodeID);
        if (node.nodeType === NodeType.PHI) {
          // Check if the phi node's first dependency already has a temp name
          const dependsOn = node.dependsOn || [];
          if (dependsOn.length > 0) {
            const firstDependency = dependsOn[0];
            const existingTempName = generationContext.tempNames[firstDependency];
            if (existingTempName) {
              // Reuse the existing temp name instead of creating a new one
              generationContext.tempNames[nodeID] = existingTempName;
              continue; // Skip declaration, just alias to existing variable
            }
          }

          // Otherwise, create a new temp variable for the phi node
          const tmp = `T${generationContext.nextTempID++}`;
          generationContext.tempNames[nodeID] = tmp;
          const T = extractNodeTypeInfo(dag, nodeID);
          const typeName = wgslBackend.getTypeName(T.baseType, T.dimension);
          // Initialize with default value - WGSL requires initialization
          let defaultValue;
          if (T.dimension === 1) {
            defaultValue = T.baseType === 'float' ? '0.0' : '0';
          } else {
            // For vector types, use constructor with repeated scalar values
            const scalarDefault = T.baseType === 'float' ? '0.0' : '0';
            const components = Array(T.dimension).fill(scalarDefault).join(', ');
            defaultValue = `${typeName}(${components})`;
          }
          generationContext.write(`var ${tmp}: ${typeName} = ${defaultValue};`);
        }
      }
      this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    },
    [BlockType.IF_COND](blockID, strandsContext, generationContext) {
      const { dag, cfg } = strandsContext;
      const conditionID = cfg.blockConditions[blockID];
      const condExpr = wgslBackend.generateExpression(generationContext, dag, conditionID);
      generationContext.write(`if (${condExpr})`);
      this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    },
    [BlockType.ELSE_COND](blockID, strandsContext, generationContext) {
      generationContext.write(`else`);
      this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    },
    [BlockType.IF_BODY](blockID, strandsContext, generationContext) {
      this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
      this.assignPhiNodeValues(blockID, strandsContext, generationContext);
    },
    [BlockType.SCOPE_START](blockID, strandsContext, generationContext) {
      generationContext.write(`{`);
      generationContext.indent++;
    },
    [BlockType.SCOPE_END](blockID, strandsContext, generationContext) {
      generationContext.indent--;
      generationContext.write(`}`);
    },
    [BlockType.MERGE](blockID, strandsContext, generationContext) {
      this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    },
    [BlockType.FUNCTION](blockID, strandsContext, generationContext) {
      this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    },
    [BlockType.FOR](blockID, strandsContext, generationContext) {
      const { dag, cfg } = strandsContext;
      const instructions = cfg.blockInstructions[blockID] || [];

      generationContext.write(`for (`);

      // Set flag to suppress semicolon on the last statement
      const originalSuppressSemicolon = generationContext.suppressSemicolon;

      for (let i = 0; i < instructions.length; i++) {
        const nodeID = instructions[i];
        const node = getNodeDataFromID(dag, nodeID);
        const isLast = i === instructions.length - 1;

        // Suppress semicolon on the last statement
        generationContext.suppressSemicolon = isLast;

        if (shouldCreateTemp(dag, nodeID)) {
          const declaration = wgslBackend.generateDeclaration(generationContext, dag, nodeID);
          generationContext.write(declaration);
        }
        if (node.nodeType === NodeType.STATEMENT) {
          wgslBackend.generateStatement(generationContext, dag, nodeID);
        }
        if (node.nodeType === NodeType.ASSIGNMENT) {
          wgslBackend.generateAssignment(generationContext, dag, nodeID);
          generationContext.visitedNodes.add(nodeID);
        }
      }

      // Restore original flag
      generationContext.suppressSemicolon = originalSuppressSemicolon;

      generationContext.write(`)`);
    },
    assignPhiNodeValues(blockID, strandsContext, generationContext) {
      const { dag, cfg } = strandsContext;
      // Find all phi nodes that this block feeds into
      const successors = cfg.outgoingEdges[blockID] || [];
      for (const successorBlockID of successors) {
        const instructions = cfg.blockInstructions[successorBlockID] || [];
        for (const nodeID of instructions) {
          const node = getNodeDataFromID(dag, nodeID);
          if (node.nodeType === NodeType.PHI) {
            // Find which input of this phi node corresponds to our block
            const branchIndex = node.phiBlocks?.indexOf(blockID);
            if (branchIndex !== -1 && branchIndex < node.dependsOn.length) {
              const sourceNodeID = node.dependsOn[branchIndex];
              const tempName = generationContext.tempNames[nodeID];
              if (tempName && sourceNodeID !== null) {
                const sourceExpr = wgslBackend.generateExpression(generationContext, dag, sourceNodeID);
                generationContext.write(`${tempName} = ${sourceExpr};`);
              }
            }
          }
        }
      }
    },
  };
  const wgslBackend = {
    hookEntry(hookType) {
      const params = hookType.parameters.map((param) => {
        // For struct types, use a raw prefix since we'll create a mutable copy
        const paramName = param.type.properties ? `_p5_strands_raw_${param.name}` : param.name;
        return `${paramName}: ${param.type.typeName}`;
      }).join(', ');

      const firstLine = `(${params}) {`;

      // Generate mutable copies for struct parameters with original names
      const mutableCopies = hookType.parameters
        .filter(param => param.type.properties) // Only struct types
        .map(param => `  var ${param.name} = _p5_strands_raw_${param.name};`)
        .join('\n');

      return mutableCopies ? firstLine + '\n' + mutableCopies : firstLine;
    },
    addTextureBindingsToDeclarations(strandsContext) {
      // Add texture and sampler bindings for sampler2D uniforms to both vertex and fragment declarations
      if (!strandsContext.renderer || !strandsContext.baseShader) return;

      // Get the next available binding index from the renderer
      let bindingIndex = strandsContext.renderer.getNextBindingIndex(strandsContext.baseShader);

      for (const {name, typeInfo} of strandsContext.uniforms) {
        if (typeInfo.baseType === 'sampler2D') {
          const textureBinding = `@group(0) @binding(${bindingIndex}) var ${name}: texture_2d<f32>;`;
          const samplerBinding = `@group(0) @binding(${bindingIndex + 1}) var ${name}_sampler: sampler;`;

          strandsContext.vertexDeclarations.add(textureBinding);
          strandsContext.vertexDeclarations.add(samplerBinding);
          strandsContext.fragmentDeclarations.add(textureBinding);
          strandsContext.fragmentDeclarations.add(samplerBinding);

          bindingIndex += 2;
        }
      }
    },
    getTypeName(baseType, dimension) {
      const primitiveTypeName = TypeNames[baseType + dimension];
      if (!primitiveTypeName) {
        return baseType;
      }
      return primitiveTypeName;
    },
    generateHookUniformKey(name, typeInfo) {
      // For sampler2D types, we don't add them to the uniform struct
      // Instead, they become separate texture and sampler bindings
      if (typeInfo.baseType === 'sampler2D') {
        return null; // Signal that this should not be added to uniform struct
      }
      return `${name}: ${this.getTypeName(typeInfo.baseType, typeInfo.dimension)}`;
    },
    generateVaryingVariable(varName, typeInfo) {
      const typeName = this.getTypeName(typeInfo.baseType, typeInfo.dimension);
      return `${varName}: ${typeName}`;
    },
    generateLocalDeclaration(varName, typeInfo) {
      const typeName = this.getTypeName(typeInfo.baseType, typeInfo.dimension);
      return `var<private> ${varName}: ${typeName};`;
    },
    generateStatement(generationContext, dag, nodeID) {
      const node = getNodeDataFromID(dag, nodeID);
      // Generate the expression followed by semicolon (unless suppressed)
      const semicolon = generationContext.suppressSemicolon ? '' : ';';
      if (node.statementType === StatementType.DISCARD) {
        generationContext.write(`discard${semicolon}`);
      } else if (node.statementType === StatementType.BREAK) {
        generationContext.write(`break${semicolon}`);
      } else if (node.statementType === StatementType.EXPRESSION) {
        const exprNodeID = node.dependsOn[0];
        const expr = this.generateExpression(generationContext, dag, exprNodeID);
        generationContext.write(`${expr}${semicolon}`);
      } else if (node.statementType === StatementType.EMPTY) {
        // Generate just a semicolon (unless suppressed)
        generationContext.write(semicolon);
      } else if (node.statementType === StatementType.EARLY_RETURN) {
        const exprNodeID = node.dependsOn[0];
        const expr = this.generateExpression(generationContext, dag, exprNodeID);
        generationContext.write(`return ${expr}${semicolon}`);
      }
    },
    generateAssignment(generationContext, dag, nodeID) {
      const node = getNodeDataFromID(dag, nodeID);
      // dependsOn[0] = targetNodeID, dependsOn[1] = sourceNodeID
      const targetNodeID = node.dependsOn[0];
      const sourceNodeID = node.dependsOn[1];

      const targetNode = getNodeDataFromID(dag, targetNodeID);
      const semicolon = generationContext.suppressSemicolon ? '' : ';';

      // Check if target is a swizzle assignment
      if (targetNode.opCode === OpCode.Unary.SWIZZLE) {
        const parentID = targetNode.dependsOn[0];
        const parentNode = getNodeDataFromID(dag, parentID);
        const parentExpr = this.generateExpression(generationContext, dag, parentID);
        const swizzle = targetNode.swizzle;
        const parentDimension = parentNode.dimension;
        const sourceExpr = this.generateExpression(generationContext, dag, sourceNodeID);

        // Create an array for each element of the target variable
        const componentMap = [];
        for (let i = 0; i < parentDimension; i++) {
          componentMap[i] = { target: 'self', index: i };
        }

        // Map swizzle characters to component indices
        const getComponentIndex = (char) => {
          if ('xyzw'.includes(char)) return 'xyzw'.indexOf(char);
          if ('rgba'.includes(char)) return 'rgba'.indexOf(char);
          return -1;
        };

        // Update the component map based on the swizzle assignment
        for (let i = 0; i < swizzle.length; i++) {
          const targetComponentIndex = getComponentIndex(swizzle[i]);
          if (targetComponentIndex >= 0 && targetComponentIndex < parentDimension) {
            componentMap[targetComponentIndex] = { target: 'rhs', index: i };
          }
        }

        // Generate the reconstruction expression
        const vectorTypeName = this.getTypeName(parentNode.baseType, parentDimension);
        const components = componentMap.map(({ target, index }) => {
          return `${target === 'self' ? parentExpr : sourceExpr}.${'xyzw'[index]}`
        });

        generationContext.write(`${parentExpr} = ${vectorTypeName}(${components.join(', ')})${semicolon}`);
      } else {
        // Regular assignment
        const targetExpr = this.generateExpression(generationContext, dag, targetNodeID);
        const sourceExpr = this.generateExpression(generationContext, dag, sourceNodeID);

        // Generate assignment if we have both target and source
        if (targetExpr && sourceExpr && targetExpr !== sourceExpr) {
          generationContext.write(`${targetExpr} = ${sourceExpr}${semicolon}`);
        }
      }
    },
    generateDeclaration(generationContext, dag, nodeID) {
      const expr = this.generateExpression(generationContext, dag, nodeID);
      const tmp = `T${generationContext.nextTempID++}`;
      generationContext.tempNames[nodeID] = tmp;
      const T = extractNodeTypeInfo(dag, nodeID);
      const typeName = this.getTypeName(T.baseType, T.dimension);
      return `var ${tmp}: ${typeName} = ${expr};`;
    },
    generateReturnStatement(strandsContext, generationContext, rootNodeID, returnType) {
      const dag = strandsContext.dag;
      const rootNode = getNodeDataFromID(dag, rootNodeID);
      if (isStructType(returnType)) {
        const structTypeInfo = returnType;
        for (let i = 0; i < structTypeInfo.properties.length; i++) {
          const prop = structTypeInfo.properties[i];
          const val = this.generateExpression(generationContext, dag, rootNode.dependsOn[i]);
          if (prop.name !== val) {
            generationContext.write(
              `${rootNode.identifier}.${prop.name} = ${val};`
            );
          }
        }
      }
      generationContext.write(`return ${this.generateExpression(generationContext, dag, rootNodeID)};`);
    },
    generateExpression(generationContext, dag, nodeID) {
      const node = getNodeDataFromID(dag, nodeID);
      if (generationContext.tempNames?.[nodeID]) {
        return generationContext.tempNames[nodeID];
      }
      switch (node.nodeType) {
        case NodeType.LITERAL:
        if (node.baseType === BaseType.FLOAT) {
          return node.value.toFixed(4);
        }
        else {
          return node.value;
        }
        case NodeType.VARIABLE:
        // Track shared variable usage context
        if (generationContext.shaderContext && generationContext.strandsContext?.sharedVariables?.has(node.identifier)) {
          const sharedVar = generationContext.strandsContext.sharedVariables.get(node.identifier);
          if (generationContext.shaderContext === 'vertex') {
            sharedVar.usedInVertex = true;
          } else if (generationContext.shaderContext === 'fragment') {
            sharedVar.usedInFragment = true;
          }
        }

        // Check if this is a uniform variable (but not a texture)
        const uniform = generationContext.strandsContext?.uniforms?.find(uniform => uniform.name === node.identifier);
        if (uniform && uniform.typeInfo.baseType !== 'sampler2D') {
          return `uniforms.${node.identifier}`;
        }

        return node.identifier;
        case NodeType.OPERATION:
        const useParantheses = node.usedBy.length > 0;
        if (node.opCode === OpCode.Nary.CONSTRUCTOR) {
          // TODO: differentiate casts and constructors for more efficient codegen.
          // if (node.dependsOn.length === 1 && node.dimension === 1) {
          //   return this.generateExpression(generationContext, dag, node.dependsOn[0]);
          // }
          if (node.baseType === BaseType.SAMPLER2D) {
            return this.generateExpression(generationContext, dag, node.dependsOn[0]);
          }
          const T = this.getTypeName(node.baseType, node.dimension);
          const deps = node.dependsOn.map((dep) => this.generateExpression(generationContext, dag, dep));
          return `${T}(${deps.join(', ')})`;
        }
        if (node.opCode === OpCode.Nary.FUNCTION_CALL) {
          // Convert mod() function calls to % operator in WGSL
          if (node.identifier === 'mod' && node.dependsOn.length === 2) {
            const [leftID, rightID] = node.dependsOn;
            const left = this.generateExpression(generationContext, dag, leftID);
            const right = this.generateExpression(generationContext, dag, rightID);
            const useParantheses = node.usedBy.length > 0;
            if (useParantheses) {
              return `(${left} % ${right})`;
            } else {
              return `${left} % ${right}`;
            }
          }

          // Convert atan(y, x) to atan2(y, x) in WGSL
          if (node.identifier === 'atan' && node.dependsOn.length === 2) {
            const functionArgs = node.dependsOn.map(arg => this.generateExpression(generationContext, dag, arg));
            return `atan2(${functionArgs.join(', ')})`;
          }

          const functionArgs = node.dependsOn.map(arg =>this.generateExpression(generationContext, dag, arg));
          return `${node.identifier}(${functionArgs.join(', ')})`;
        }
        if (node.opCode === OpCode.Binary.MEMBER_ACCESS) {
          const [lID, rID] = node.dependsOn;
          const lName = this.generateExpression(generationContext, dag, lID);
          const rName = this.generateExpression(generationContext, dag, rID);
          return `${lName}.${rName}`;
        }
        if (node.opCode === OpCode.Unary.SWIZZLE) {
          const parentID = node.dependsOn[0];
          const parentExpr = this.generateExpression(generationContext, dag, parentID);
          return `${parentExpr}.${node.swizzle}`;
        }
        if (node.dependsOn.length === 2) {
          const [lID, rID] = node.dependsOn;
          const left  = this.generateExpression(generationContext, dag, lID);
          const right = this.generateExpression(generationContext, dag, rID);

          // In WGSL, % operator works for both floats and integers
          if (node.opCode === OpCode.Binary.MODULO) {
            return `(${left} % ${right})`;
          }

          const opSym = OpCodeToSymbol[node.opCode];
          if (useParantheses) {
            return `(${left} ${opSym} ${right})`;
          } else {
            return `${left} ${opSym} ${right}`;
          }
        }
        if (node.opCode === OpCode.Unary.LOGICAL_NOT
          || node.opCode === OpCode.Unary.NEGATE
          || node.opCode === OpCode.Unary.PLUS
          ) {
          const [i] = node.dependsOn;
          const val  = this.generateExpression(generationContext, dag, i);
          const sym  = OpCodeToSymbol[node.opCode];
          return `${sym}${val}`;
        }
        case NodeType.PHI:
        // Phi nodes represent conditional merging of values
        // If this phi node has an identifier (like varying variables), use that
        if (node.identifier) {
          return node.identifier;
        }
        // Otherwise, they should have been declared as temporary variables
        // and assigned in the appropriate branches
        if (generationContext.tempNames?.[nodeID]) {
          return generationContext.tempNames[nodeID];
        } else {
          // If no temp was created, this phi node only has one input
          // so we can just use that directly
          const validInputs = node.dependsOn.filter(id => id !== null);
          if (validInputs.length > 0) {
            return this.generateExpression(generationContext, dag, validInputs[0]);
          } else {
            throw new Error(`No valid inputs for node`)
          }
        }
        case NodeType.ASSIGNMENT:
        internalError(`ASSIGNMENT nodes should not be used as expressions`);
        default:
        internalError(`${NodeTypeToName[node.nodeType]} code generation not implemented yet`);
      }
    },
    generateBlock(blockID, strandsContext, generationContext) {
      const type = strandsContext.cfg.blockTypes[blockID];
      const handler = cfgHandlers[type] || cfgHandlers[BlockType.DEFAULT];
      handler.call(cfgHandlers, blockID, strandsContext, generationContext);
    },

    createGetTextureCall(strandsContext, args) {
      // In WebGPU, we need to add a sampler argument for the texture call
      // First argument should be a texture, second should be coordinates
      // We need to augment with a sampler argument based on the texture name
      const textureArg = args[0];
      const coordsArg = args[1];

      // Create a sampler variable node - add "_sampler" suffix to the texture identifier
      const { dag } = strandsContext;
      const textureNode = getNodeDataFromID(dag, textureArg.id);
      const samplerIdentifier = textureNode.identifier + '_sampler';

      const samplerVariable = variableNode(strandsContext, { baseType: BaseType.SAMPLER, dimension: 1 }, samplerIdentifier);
      const samplerNode = createStrandsNode(samplerVariable.id, samplerVariable.dimension, strandsContext);

      // Create the augmented args: [texture, sampler, coords]
      const augmentedArgs = [textureArg, samplerNode, coordsArg];

      const { id, dimension } = functionCallNode(strandsContext, 'textureSample', augmentedArgs, {
        overloads: [{
          params: [DataType.sampler2D, DataType.sampler, DataType.float2],
          returnType: DataType.float4
        }]
      });
      return { id, dimension };
    },

    instanceIdReference() {
      return 'instanceID';
    },
  };

  // Based on https://github.com/stegu/webgl-noise/blob/22434e04d7753f7e949e8d724ab3da2864c17a0f/src/noise3D.glsl
  // MIT licensed, adapted for p5.strands and converted to WGSL

  var noiseWGSL = `fn mod289Vec3(x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289Vec4(x: vec4<f32>) -> vec4<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute(x: vec4<f32>) -> vec4<f32> {
  return mod289Vec4(((x*34.0)+10.0)*x);
}

fn taylorInvSqrt(r: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(1.79284291400159) - vec4<f32>(0.85373472095314) * r;
}

fn baseNoise(v: vec3<f32>) -> f32 {
  let C = vec2<f32>(1.0/6.0, 1.0/3.0);
  let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);

  // First corner
  var i = floor(v + dot(v, C.yyy));
  let x0 = v - i + dot(i, C.xxx);

  // Other corners
  let g = step(x0.yzx, x0.xyz);
  let l = vec3<f32>(1.0) - g;
  let i1 = min(g.xyz, l.zxy);
  let i2 = max(g.xyz, l.zxy);

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  let x1 = x0 - i1 + C.xxx;
  let x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  let x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289Vec3(i);
  let p = permute( permute( permute(
          i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0 ))
        + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0 ))
      + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  let n_ = 0.142857142857; // 1.0/7.0
  let ns = n_ * D.wyz - D.xzx;

  let j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  let x_ = floor(j * ns.z);
  let y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  let x = x_ *ns.x + ns.yyyy;
  let y = y_ *ns.x + ns.yyyy;
  let h = vec4<f32>(1.0) - abs(x) - abs(y);

  let b0 = vec4<f32>( x.xy, y.xy );
  let b1 = vec4<f32>( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  let s0 = floor(b0)*2.0 + vec4<f32>(1.0);
  let s1 = floor(b1)*2.0 + vec4<f32>(1.0);
  let sh = -step(h, vec4<f32>(0.0));

  let a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw*sh.zzww;

  let p0 = vec3<f32>(a0.xy, h.x);
  let p1 = vec3<f32>(a0.zw, h.y);
  let p2 = vec3<f32>(a1.xy, h.z);
  let p3 = vec3<f32>(a1.zw, h.w);

  //Normalise gradients
  let norm = taylorInvSqrt(vec4<f32>(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  let p0_norm = p0 * norm.x;
  let p1_norm = p1 * norm.y;
  let p2_norm = p2 * norm.z;
  let p3_norm = p3 * norm.w;

  // Mix final noise value
  var m = max(vec4<f32>(0.5) - vec4<f32>(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4<f32>(0.0));
  m = m * m;
  return 105.0 * dot( m*m, vec4<f32>( dot(p0_norm,x0), dot(p1_norm,x1),
        dot(p2_norm,x2), dot(p3_norm,x3) ) );
}

fn noise(st: vec3<f32>, octaves: i32, ampFalloff: f32) -> f32 {
  var result = 0.0;
  var amplitude = 1.0;
  var frequency = 1.0;

  for (var i = 0; i < 8; i++) {
    if (i >= octaves) { break; }
    result += amplitude * baseNoise(st * frequency);
    frequency *= 2.0;
    amplitude *= ampFalloff;
  }

  return result;
}`;

  const filterUniforms = `
struct Uniforms {
  uModelViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  canvasSize: vec2<f32>,
  texelSize: vec2<f32>,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var tex0: texture_2d<f32>;
@group(0) @binding(2) var tex0_sampler: sampler;
`;

  const baseFilterVertexShader = filterUniforms + `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aTexCoord: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) vTexCoord: vec2<f32>,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  // transferring texcoords for the frag shader
  output.vTexCoord = input.aTexCoord;

  // copy position with a fourth coordinate for projection (1.0 is normal)
  let positionVec4 = vec4<f32>(input.aPosition, 1.0);

  // project to 3D space
  output.position = uniforms.uProjectionMatrix * uniforms.uModelViewMatrix * positionVec4;

  return output;
}
`;

  const baseFilterFragmentShader = filterUniforms + `
struct FilterInputs {
  texCoord: vec2<f32>,
  canvasSize: vec2<f32>,
  texelSize: vec2<f32>,
}

struct FragmentInput {
  @location(0) vTexCoord: vec2<f32>,
}

struct FragmentOutput {
  @location(0) color: vec4<f32>,
}

@fragment
fn main(input: FragmentInput) -> FragmentOutput {
  var output: FragmentOutput;
  var inputs: FilterInputs;
  inputs.texCoord = input.vTexCoord;
  inputs.canvasSize = uniforms.canvasSize;
  inputs.texelSize = uniforms.texelSize;

  var outColor = HOOK_getColor(inputs, tex0, tex0_sampler);
  outColor = vec4<f32>(outColor.rgb * outColor.a, outColor.a);
  output.color = outColor;

  return output;
}
`;

  const uniforms = `
struct Uniforms {
  uModelViewMatrix: mat4x4<f32>,
  uProjectionMatrix: mat4x4<f32>,
  uNormalMatrix: mat3x3<f32>,
  roughness: f32,
};
`;

  // Shared WGSL functions
  const sharedFunctions = `
const PI = 3.14159265359;

fn nTOE(v: vec3<f32>) -> vec2<f32> {
  // x = r sin(phi) cos(theta)
  // y = r cos(phi)
  // z = r sin(phi) sin(theta)
  let phi = acos(v.y);
  // if phi is 0, then there are no x, z components
  var theta = 0.0;
  // else
  theta = acos(v.x / sin(phi));
  let sinTheta = v.z / sin(phi);
  if (sinTheta < 0.0) {
    // Turn it into -theta, but in the 0-2PI range
    theta = 2.0 * PI - theta;
  }
  theta = theta / (2.0 * PI);
  let phiNorm = phi / PI;

  return vec2<f32>(phiNorm, theta);
}

fn random(p: vec2<f32>) -> f32 {
  let p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.1031);
  let dotP3 = dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

  const imageLightVertexShader = `
struct VertexInput {
  @location(0) aPosition: vec3<f32>,
  @location(1) aNormal: vec3<f32>,
  @location(2) aTexCoord: vec2<f32>,
}

struct VertexOutput {
  @builtin(position) Position: vec4<f32>,
  @location(0) localPos: vec3<f32>,
  @location(1) vWorldNormal: vec3<f32>,
  @location(2) vWorldPosition: vec3<f32>,
  @location(3) vTexCoord: vec2<f32>,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  // Multiply the position by the matrix
  let viewModelPosition = uniforms.uModelViewMatrix * vec4<f32>(input.aPosition, 1.0);
  output.Position = uniforms.uProjectionMatrix * viewModelPosition;

  // Orient the normals and pass to the fragment shader
  output.vWorldNormal = uniforms.uNormalMatrix * input.aNormal;

  // Send the view position to the fragment shader
  output.vWorldPosition = viewModelPosition.xyz;

  output.localPos = output.vWorldPosition;
  output.vTexCoord = input.aTexCoord;

  return output;
}
`;

  const imageLightDiffusedFragmentShader = `
struct FragmentInput {
  @location(0) localPos: vec3<f32>,
  @location(3) vTexCoord: vec2<f32>,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var environmentMap: texture_2d<f32>;
@group(0) @binding(2) var environmentMap_sampler: sampler;

${sharedFunctions}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // The sample direction equals the hemisphere's orientation
  let phi = input.vTexCoord.x * 2.0 * PI;
  let theta = input.vTexCoord.y * PI;
  let x = sin(theta) * cos(phi);
  let y = sin(theta) * sin(phi);
  let z = cos(theta);
  let normal = vec3<f32>(x, y, z);

  // Discretely sampling the hemisphere given the integral's
  // spherical coordinates translates to the following fragment code:
  var irradiance = vec3<f32>(0.0);
  let up = vec3<f32>(0.0, 1.0, 0.0);
  let right = normalize(cross(up, normal));
  let upNorm = normalize(cross(normal, right));

  // We specify a fixed sampleDelta delta value to traverse
  // the hemisphere; decreasing or increasing the sample delta
  // will increase or decrease the accuracy respectively.
  let sampleDelta = 0.100;
  var nrSamples = 0.0;
  let randomOffset = random(input.vTexCoord) * sampleDelta;

  for (var rawPhi = 0.0; rawPhi < 2.0 * PI; rawPhi += sampleDelta) {
    let phiSample = rawPhi + randomOffset;
    for (var rawTheta = 0.0; rawTheta < 0.5 * PI; rawTheta += sampleDelta) {
      let thetaSample = rawTheta + randomOffset;
      // spherical to cartesian (in tangent space) // tangent space to world // add each sample result to irradiance
      let xSample = sin(thetaSample) * cos(phiSample);
      let ySample = sin(thetaSample) * sin(phiSample);
      let zSample = cos(thetaSample);
      let tangentSample = vec3<f32>(xSample, ySample, zSample);

      let sampleVec = tangentSample.x * right + tangentSample.y * upNorm + tangentSample.z * normal;
      let envSample = textureSample(environmentMap, environmentMap_sampler, nTOE(sampleVec));
      irradiance += envSample.xyz * cos(thetaSample) * sin(thetaSample);
      nrSamples += 1.0;
    }
  }
  // divide by the total number of samples taken, giving us the average sampled irradiance.
  irradiance = PI * irradiance * (1.0 / nrSamples);

  return vec4<f32>(irradiance, 1.0);
}
`;

  const imageLightSpecularFragmentShader = `
struct FragmentInput {
  @location(0) localPos: vec3<f32>,
  @location(3) vTexCoord: vec2<f32>,
}

${uniforms}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var environmentMap: texture_2d<f32>;
@group(0) @binding(2) var environmentMap_sampler: sampler;

${sharedFunctions}

fn VanDerCorput(nIn: i32, base: i32) -> f32 {
  // Use the bit manipulation version for WebGPU (equivalent to WEBGL2 version)
  var n = u32(nIn);
  n = (n << 16u) | (n >> 16u);
  n = ((n & 0x55555555u) << 1u) | ((n & 0xAAAAAAAAu) >> 1u);
  n = ((n & 0x33333333u) << 2u) | ((n & 0xCCCCCCCCu) >> 2u);
  n = ((n & 0x0F0F0F0Fu) << 4u) | ((n & 0xF0F0F0F0u) >> 4u);
  n = ((n & 0x00FF00FFu) << 8u) | ((n & 0xFF00FF00u) >> 8u);
  return f32(n) * 2.3283064365386963e-10; // / 0x100000000
}

fn HammersleyNoBitOps(i: i32, N: i32) -> vec2<f32> {
  return vec2<f32>(f32(i) / f32(N), VanDerCorput(i, 2));
}

fn ImportanceSampleGGX(Xi: vec2<f32>, N: vec3<f32>, roughness: f32) -> vec3<f32> {
  let a = roughness * roughness;

  let phi = 2.0 * PI * Xi.x;
  let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
  let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

  // from spherical coordinates to cartesian coordinates
  var H: vec3<f32>;
  H.x = cos(phi) * sinTheta;
  H.y = sin(phi) * sinTheta;
  H.z = cosTheta;

  // from tangent-space vector to world-space sample vector
  let up = select(vec3<f32>(0.0, 0.0, 1.0), vec3<f32>(1.0, 0.0, 0.0), abs(N.z) < 0.999);
  let tangent = normalize(cross(up, N));
  let bitangent = cross(N, tangent);

  let sampleVec = tangent * H.x + bitangent * H.y + N * H.z;
  return normalize(sampleVec);
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  let SAMPLE_COUNT = 400i; // 4096
  let lowRoughnessLimit = i32(pow(2.0, (uniforms.roughness + 0.1) * 20.0));
  var totalWeight = 0.0;
  var prefilteredColor = vec3<f32>(0.0);
  let phi = input.vTexCoord.x * 2.0 * PI;
  let theta = input.vTexCoord.y * PI;
  let x = sin(theta) * cos(phi);
  let y = sin(theta) * sin(phi);
  let z = cos(theta);
  let N = vec3<f32>(x, y, z);
  let V = N;

  for (var i = 0i; i < SAMPLE_COUNT; i++) {
    // break at smaller sample numbers for low roughness levels
    if (i == lowRoughnessLimit) {
      break;
    }
    let Xi = HammersleyNoBitOps(i, SAMPLE_COUNT);
    let H = ImportanceSampleGGX(Xi, N, uniforms.roughness);
    let L = normalize(2.0 * dot(V, H) * H - V);

    let NdotL = max(dot(N, L), 0.0);
    // Always sample the texture to maintain uniform control flow
    let envSample = textureSample(environmentMap, environmentMap_sampler, nTOE(L));
    // Only add to accumulators if NdotL > 0
    if (NdotL > 0.0) {
      prefilteredColor += envSample.xyz * NdotL;
      totalWeight += NdotL;
    }
  }
  prefilteredColor = prefilteredColor / totalWeight;

  return vec4<f32>(prefilteredColor, 1.0);
}
`;

  function rendererWebGPU(p5, fn) {
    const { lineDefs } = getStrokeDefs((n, v, t) => `const ${n}: ${t} = ${v};\n`);

    // RendererWebGPU depends on these other classes being set up prior,
    // as it is optimized for being in a standalone build, not core
    const {
      Renderer3D,
      Shader,
      Texture,
      MipmapTexture,
      Image,
      Camera,
      RGBA,
    } = p5;

    class RendererWebGPU extends Renderer3D {
      constructor(pInst, w, h, isMainCanvas, elt) {
        super(pInst, w, h, isMainCanvas, elt);

        this.renderPass = {};

        this.samplers = new Map();

        // Single reusable staging buffer for pixel reading
        this.pixelReadBuffer = null;
        this.pixelReadBufferSize = 0;

        this.strandsBackend = wgslBackend;

        // Registry to track all shaders for uniform data pooling
        this._shadersWithPools = [];

        // Registry to track geometries with buffer pools
        this._geometriesWithPools = [];

        // Flag to track if any draws have happened that need queue submission
        this._hasPendingDraws = false;
        this._pendingCommandEncoders = [];

        // Retired buffers to destroy at end of frame
        this._retiredBuffers = [];

        // 2D canvas for pixel reading fallback
        this._pixelReadCanvas = null;
        this._pixelReadCtx = null;
        this.mainFramebuffer = null;

        this.finalCamera = new Camera(this);
        this.finalCamera._computeCameraDefaultSettings();
        this.finalCamera._setDefaultCamera();
      }

      async setupContext() {
        this._setAttributeDefaults(this._pInst);
        await this._initContext();
      }

      _setAttributeDefaults(pInst) {
        const defaults = {
          forceFallbackAdapter: false,
          powerPreference: 'high-performance',
        };
        if (pInst._webgpuAttributes === null) {
          pInst._webgpuAttributes = defaults;
        } else {
          pInst._webgpuAttributes = Object.assign(defaults, pInst._webgpuAttributes);
        }
        return;
      }

      async _initContext() {
        this.adapter = await navigator.gpu?.requestAdapter(this._webgpuAttributes);
        this.device = await this.adapter?.requestDevice({
          // Todo: check support
          requiredFeatures: ['depth32float-stencil8']
        });
        if (!this.device) {
          throw new Error('Your browser does not support WebGPU.');
        }
        this.queue = this.device.queue;
        this.drawingContext = this.canvas.getContext('webgpu');
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        this.drawingContext.configure({
          device: this.device,
          format: this.presentationFormat,
          usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
          alphaMode: 'premultiplied',
        });

        // TODO disablable stencil
        this.depthFormat = 'depth24plus-stencil8';
        this.mainFramebuffer = this.createFramebuffer();
        this._updateSize();
        this._update();
      }

      async _setAttributes(key, value) {
        if (typeof this._pInst._webgpuAttributes === "undefined") {
          console.log(
            "You are trying to use setAttributes on a p5.Graphics object " +
            "that does not use a WebGPU renderer."
          );
          return;
        }
        let unchanged = true;

        if (typeof value !== "undefined") {
          //first time modifying the attributes
          if (this._pInst._webgpuAttributes === null) {
            this._pInst._webgpuAttributes = {};
          }
          if (this._pInst._webgpuAttributes[key] !== value) {
            //changing value of previously altered attribute
            this._webgpuAttributes[key] = value;
            unchanged = false;
          }
          //setting all attributes with some change
        } else if (key instanceof Object) {
          if (this._pInst._webgpuAttributes !== key) {
            this._pInst._webgpuAttributes = key;
            unchanged = false;
          }
        }
        //@todo_FES
        if (!this.isP3D || unchanged) {
          return;
        }

        if (!this._pInst._setupDone) {
          if (this.geometryBufferCache.numCached() > 0) {
            p5._friendlyError(
              "Sorry, Could not set the attributes, you need to call setAttributes() " +
              "before calling the other drawing methods in setup()"
            );
            return;
          }
        }

        await this._resetContext(null, null, RendererWebGPU);

        if (this.states.curCamera) {
          this.states.curCamera._renderer = this._renderer;
        }
      }

      _updateSize() {
        if (this.depthTexture && this.depthTexture.destroy) {
          this.depthTexture.destroy();
        }
        this.depthTexture = this.device.createTexture({
          size: {
            width: Math.ceil(this.width * this._pixelDensity),
            height: Math.ceil(this.height * this._pixelDensity),
            depthOrArrayLayers: 1,
          },
          format: this.depthFormat,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        // Clear the main canvas after resize
        this.clear();
      }

      clear(...args) {
        const _r = args[0] || 0;
        const _g = args[1] || 0;
        const _b = args[2] || 0;
        const _a = args[3] || 0;

        const commandEncoder = this.device.createCommandEncoder();

        // Use framebuffer texture if active, otherwise use canvas texture
        const activeFramebuffer = this.activeFramebuffer();
        const colorTexture = activeFramebuffer ?
          (activeFramebuffer.aaColorTexture || activeFramebuffer.colorTexture) :
          this.drawingContext.getCurrentTexture();

        const colorAttachment = {
          view: colorTexture.createView(),
          clearValue: { r: _r * _a, g: _g * _a, b: _b * _a, a: _a },
          loadOp: 'clear',
          storeOp: 'store',
          // If using multisampled texture, resolve to non-multisampled texture
          resolveTarget: activeFramebuffer && activeFramebuffer.aaColorTexture ?
            activeFramebuffer.colorTexture.createView() : undefined,
        };

        // Use framebuffer depth texture if active, otherwise use canvas depth texture
        const depthTexture = activeFramebuffer ?
          (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
          this.depthTexture;
        const depthTextureView = depthTexture?.createView();
        const depthAttachment = depthTextureView
          ? {
            view: depthTextureView,
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilLoadOp: 'load',
            stencilStoreOp: 'store',
          }
          : undefined;

        const renderPassDescriptor = {
          colorAttachments: [colorAttachment],
          ...(depthAttachment ? { depthStencilAttachment: depthAttachment } : {}),
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();

        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }

      /**
       * Resets all depth information so that nothing previously drawn will
       * occlude anything subsequently drawn.
       */
      clearDepth(depth = 1) {
        const commandEncoder = this.device.createCommandEncoder();

        // Use framebuffer texture if active, otherwise use canvas texture
        const activeFramebuffer = this.activeFramebuffer();

        // Use framebuffer depth texture if active, otherwise use canvas depth texture
        const depthTexture = activeFramebuffer ?
          (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
          this.depthTexture;
        const depthTextureView = depthTexture?.createView();

        if (!depthTextureView) {
          // No depth buffer to clear
          return;
        }

        const depthAttachment = {
          view: depthTextureView,
          depthClearValue: depth,
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
          stencilLoadOp: 'load',
          stencilStoreOp: 'store',
        };

        const renderPassDescriptor = {
          colorAttachments: [], // No color attachments, we're only clearing depth
          depthStencilAttachment: depthAttachment,
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();

        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }

      _prepareBuffer(renderBuffer, geometry, shader) {
        const attr = shader.attributes[renderBuffer.attr];
        if (!attr) return;

        const { src, dst, size, map } = renderBuffer;

        const device = this.device;
        const buffers = this._getOrMakeCachedBuffers(geometry);
        let srcData = geometry[src];
        if (!srcData || srcData.length === 0) {
          if (renderBuffer.default) {
            srcData = geometry[src] = renderBuffer.default(geometry);
            srcData.isDefault = true;
          } else {
            return;
          }
        }

        // Check if we already have a buffer for this data
        let existingBuffer = buffers[dst];
        const needsNewBuffer = !existingBuffer;

        // Only create new buffer and write data if buffer doesn't exist or data is dirty
        if (needsNewBuffer || geometry.dirtyFlags[src] !== false) {
          const raw = map ? map(srcData) : srcData;
          const typed = this._normalizeBufferData(raw, Float32Array);

          // Get pooled buffer (may reuse existing or create new)
          const pooledBufferInfo = this._getVertexBufferFromPool(geometry, dst, typed.byteLength);

          // Create a copy of the data to avoid conflicts when geometry arrays are reset
          const dataCopy = new typed.constructor(typed);
          pooledBufferInfo.dataCopy = dataCopy;

          // Write the data to the pooled buffer
          device.queue.writeBuffer(pooledBufferInfo.buffer, 0, dataCopy);

          // Update the buffers cache to use the pooled buffer
          buffers[dst] = pooledBufferInfo.buffer;
          geometry.dirtyFlags[src] = false;
        }

        shader.enableAttrib(attr, size);
      }

      _disableRemainingAttributes(shader) {}

      _enableAttrib(attr) {
        // TODO: is this necessary?
        const loc = attr.location;
        if (!this.registerEnabled.has(loc)) {
          // TODO
          // this.renderPass.setVertexBuffer(loc, buffer);
          this.registerEnabled.add(loc);
        }
      }

      _ensureGeometryBuffers(buffers, indices, indexType) {
        if (!indices) return;

        const device = this.device;

        const buffer = device.createBuffer({
          size: Math.ceil((indices.length * indexType.BYTES_PER_ELEMENT) / 4) * 4,
          usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
          mappedAtCreation: true,
        });

        // Write index data to buffer
        const mapping = new indexType(buffer.getMappedRange());
        mapping.set(indices);
        buffer.unmap();

        buffers.indexBuffer = buffer;
        buffers.indexBufferType = indexType === Uint32Array ? 'uint32' : 'uint16';
      }

      _freeBuffers(buffers) {
        const destroyIfExists = (buf) => {
          if (buf && buf.destroy) {
            buf.destroy();
          }
        };

        destroyIfExists(buffers.indexBuffer);

        const freeDefs = (defs) => {
          for (const def of defs) {
            destroyIfExists(buffers[def.dst]);
            buffers[def.dst] = null;
          }
        };

        freeDefs(this.buffers.stroke);
        freeDefs(this.buffers.fill);
        freeDefs(this.buffers.user);
      }

      _getValidSampleCount(requestedCount) {
        // WebGPU supports sample counts of 1, 4 (and sometimes 8)
        if (requestedCount <= 1) return 1;
        if (requestedCount <= 4) return 4;
        return 4; // Cap at 4 for broader compatibility
      }

      _shaderOptions({ mode }) {
        const activeFramebuffer = this.activeFramebuffer();
        const format = activeFramebuffer ?
          this._getWebGPUColorFormat(activeFramebuffer) :
          this.presentationFormat;

        const requestedSampleCount = activeFramebuffer ?
          (activeFramebuffer.antialias ? activeFramebuffer.antialiasSamples : 1) :
          (this.antialias || 1);
        const sampleCount = this._getValidSampleCount(requestedSampleCount);

        const depthFormat = activeFramebuffer && activeFramebuffer.useDepth ?
          this._getWebGPUDepthFormat(activeFramebuffer) :
          this.depthFormat;

        const drawTarget = this.drawTarget();
        const clipping = this._clipping;
        const clipApplied = drawTarget._isClipApplied;

        return {
          topology: mode === TRIANGLE_STRIP ? 'triangle-strip' : 'triangle-list',
          blendMode: this.states.curBlendMode,
          sampleCount,
          format,
          depthFormat,
          clipping,
          clipApplied,
        }
      }

      _initShader(shader) {
        const device = this.device;

        shader.vertModule = device.createShaderModule({ code: shader.vertSrc() });
        shader.fragModule = device.createShaderModule({ code: shader.fragSrc() });

        shader._pipelineCache = new Map();
        shader.getPipeline = ({ topology, blendMode, sampleCount, format, depthFormat, clipping, clipApplied }) => {
          const key = `${topology}_${blendMode}_${sampleCount}_${format}_${depthFormat}_${clipping}_${clipApplied}`;
          if (!shader._pipelineCache.has(key)) {
            const pipeline = device.createRenderPipeline({
              layout: shader._pipelineLayout,
              vertex: {
                module: shader.vertModule,
                entryPoint: 'main',
                buffers: this._getVertexLayout(shader),
              },
              fragment: {
                module: shader.fragModule,
                entryPoint: 'main',
                targets: [{
                  format,
                  blend: this._getBlendState(blendMode),
                }],
              },
              primitive: { topology },
              multisample: { count: sampleCount },
              depthStencil: {
                format: depthFormat,
                depthWriteEnabled: !clipping,
                depthCompare: 'less-equal',
                stencilFront: {
                  compare: clipping ? 'always' : (clipApplied ? 'not-equal' : 'always'),
                  failOp: 'keep',
                  depthFailOp: 'keep',
                  passOp: clipping ? 'replace' : 'keep',
                },
                stencilBack: {
                  compare: clipping ? 'always' : (clipApplied ? 'not-equal' : 'always'),
                  failOp: 'keep',
                  depthFailOp: 'keep',
                  passOp: clipping ? 'replace' : 'keep',
                },
                stencilReadMask: 0xFF,
                stencilWriteMask: clipping ? 0xFF : 0x00,
              },
            });
            shader._pipelineCache.set(key, pipeline);
          }
          return shader._pipelineCache.get(key);
        };
      }

      _finalizeShader(shader) {
        const rawSize = Math.max(
          0,
          ...Object.values(shader.uniforms).filter(u => !u.isSampler).map(u => u.offsetEnd)
        );
        const alignedSize = Math.ceil(rawSize / 16) * 16;
        shader._uniformData = new Float32Array(alignedSize / 4);
        shader._uniformDataView = new DataView(shader._uniformData.buffer);

        // Create pools for uniform buffers (both GPU buffers and data arrays.) This
        // is so that we can queue up multiple things to be able to be drawn and have
        // the GPU go through them as fast as possible. If we're overwriting the same
        // data again and again, we would have to wait for the GPU after each primitive
        // that we draw.
        shader._uniformBufferPool = [];
        shader._uniformBuffersInUse = [];
        shader._uniformBufferSize = alignedSize;

        // Create the first buffer for the pool
        const firstGPUBuffer = this.device.createBuffer({
          size: alignedSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const firstData = new Float32Array(alignedSize / 4);
        const firstDataView = new DataView(firstData.buffer);

        shader._uniformBufferPool.push({
          buffer: firstGPUBuffer,
          data: firstData,
          dataView: firstDataView
        });

        // Keep backward compatibility reference
        shader._uniformBuffer = firstGPUBuffer;

        // Register this shader in our registry for pool cleanup
        this._shadersWithPools.push(shader);

        const bindGroupLayouts = new Map(); // group index -> bindGroupLayout
        const groupEntries = new Map(); // group index -> array of entries

        // We're enforcing that every shader have a single uniform struct in binding 0
        groupEntries.set(0, [{
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        }]);

        // Add the variable amount of samplers and texture bindings that can come after
        for (const sampler of shader.samplers) {
          const group = sampler.group;
          const entries = groupEntries.get(group) || [];
          if (!['sampler', 'texture_2d<f32>'].includes(sampler.type)) {
            throw new Error(`Unsupported texture type: ${sampler.type}`);
          }

          entries.push({
            binding: sampler.binding,
            visibility: sampler.visibility,
            sampler: sampler.type === 'sampler'
              ? { type: 'filtering' }
              : undefined,
            texture: sampler.type === 'texture_2d<f32>'
              ? { sampleType: 'float', viewDimension: '2d' }
              : undefined,
            uniform: sampler,
          });

          groupEntries.set(group, entries);
        }

        // Create layouts and bind groups
        for (const [group, entries] of groupEntries) {
          const layout = this.device.createBindGroupLayout({ entries });
          bindGroupLayouts.set(group, layout);
        }

        shader._groupEntries = groupEntries;
        shader._bindGroupLayouts = [...bindGroupLayouts.values()];
        shader._pipelineLayout = this.device.createPipelineLayout({
          bindGroupLayouts: shader._bindGroupLayouts,
        });
      }

      _getBlendState(mode) {
        switch (mode) {
          case BLEND:
            return {
              color: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha'
              }
            };

          case ADD:
            return {
              color: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one'
              }
            };

          case REMOVE:
            return {
              color: {
                operation: 'add',
                srcFactor: 'zero',
                dstFactor: 'one-minus-src-alpha'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'zero',
                dstFactor: 'one-minus-src-alpha'
              }
            };

          case MULTIPLY:
            return {
              color: {
                operation: 'add',
                srcFactor: 'dst-color',
                dstFactor: 'one-minus-src-alpha'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'dst-alpha',
                dstFactor: 'one-minus-src-alpha'
              }
            };

          case SCREEN:
            return {
              color: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one-minus-src-color'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha'
              }
            };

          case EXCLUSION:
            return {
              color: {
                operation: 'add',
                srcFactor: 'one-minus-dst-color',
                dstFactor: 'one-minus-src-color'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one'
              }
            };

          case REPLACE:
            return {
              color: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'zero'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'zero'
              }
            };

          case SUBTRACT:
            return {
              color: {
                operation: 'reverse-subtract',
                srcFactor: 'one',
                dstFactor: 'one'
              },
              alpha: {
                operation: 'add',
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha'
              }
            };

          case DARKEST:
            return {
              color: {
                operation: 'min',
                srcFactor: 'one',
                dstFactor: 'one'
              },
              alpha: {
                operation: 'min',
                srcFactor: 'one',
                dstFactor: 'one'
              }
            };

          case LIGHTEST:
            return {
              color: {
                operation: 'max',
                srcFactor: 'one',
                dstFactor: 'one'
              },
              alpha: {
                operation: 'max',
                srcFactor: 'one',
                dstFactor: 'one'
              }
            };

          default:
            console.warn(`Unsupported blend mode: ${mode}`);
            return undefined;
        }
      }

      _applyColorBlend() {}

      _getVertexLayout(shader) {
        const layouts = [];

        for (const attrName in shader.attributes) {
          const attr = shader.attributes[attrName];
          if (!attr || attr.location === -1) continue;
          // Get the vertex buffer info associated with this attribute
          const renderBuffer =
            this.buffers[shader.shaderType].find(buf => buf.attr === attrName) ||
            this.buffers.user.find(buf => buf.attr === attrName);
          if (!renderBuffer) continue;

          const { size } = renderBuffer;
          // Convert from the number of floats (e.g. 3) to a recognized WebGPU
          // format (e.g. "float32x3")
          const format = this._getFormatFromSize(size);

          layouts.push({
            arrayStride: size * 4,
            stepMode: 'vertex',
            attributes: [
              {
                shaderLocation: attr.location,
                offset: 0,
                format,
              },
            ],
          });
        }
        return layouts;
      }

      _getVertexBuffers(shader) {
        const buffers = [];

        for (const attrName in shader.attributes) {
          const attr = shader.attributes[attrName];
          if (!attr || attr.location === -1) continue;

          // Get the vertex buffer info associated with this attribute
          const renderBuffer =
            this.buffers[shader.shaderType].find(buf => buf.attr === attrName) ||
            this.buffers.user.find(buf => buf.attr === attrName);
          if (!renderBuffer) continue;

          buffers.push(renderBuffer);
        }

        return buffers;
      }

      _getFormatFromSize(size) {
        switch (size) {
          case 1: return 'float32';
          case 2: return 'float32x2';
          case 3: return 'float32x3';
          case 4: return 'float32x4';
          default: throw new Error(`Unsupported attribute size: ${size}`);
        }
      }

      _useShader(shader, options) {}

      _updateViewport() {
        this._origViewport = {
          width: this.width,
          height: this.height,
        };
        this._viewport = [0, 0, this.width, this.height];
      }

      _createPixelsArray() {
        this.pixels = new Uint8Array(
          this.width * this.pixelDensity() * this.height * this.pixelDensity() * 4
        );
      }

      viewport() {}

      zClipRange() {
        return [0, 1];
      }
      defaultNearScale() {
        return 0.01;
      }
      defaultFarScale() {
        return 100;
      }

      _resetBuffersBeforeDraw() {
        if (!this.activeFramebuffer()) {
          this.mainFramebuffer.begin();
        }
        const commandEncoder = this.device.createCommandEncoder();

        const depthTextureView = this.depthTexture?.createView();
        const depthAttachment = depthTextureView
          ? {
            view: depthTextureView,
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
            stencilLoadOp: 'load',
            stencilStoreOp: "store",
          }
          : undefined;

        const renderPassDescriptor = {
          colorAttachments: [],
          ...(depthAttachment ? { depthStencilAttachment: depthAttachment } : {}),
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();

        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }

      //////////////////////////////////////////////
      // Geometry buffer pool management
      //////////////////////////////////////////////

      _initializeGeometryBufferPools(geometry) {
        if (geometry._vertexBufferPools) {
          return; // Already initialized
        }

        geometry._vertexBufferPools = {}; // Keyed by buffer type (dst)
        geometry._vertexBuffersInUse = {}; // Keyed by buffer type (dst)
        geometry._vertexBuffersToReturn = {}; // Keyed by buffer type (dst)

        // Register this geometry for pool cleanup
        this._geometriesWithPools.push(geometry);
      }

      _getVertexBufferFromPool(geometry, dst, size) {
        // Initialize pools if needed
        this._initializeGeometryBufferPools(geometry);

        // Get or create pool for this buffer type
        if (!geometry._vertexBufferPools[dst]) {
          geometry._vertexBufferPools[dst] = [];
        }
        if (!geometry._vertexBuffersInUse[dst]) {
          geometry._vertexBuffersInUse[dst] = [];
        }
        if (!geometry._vertexBuffersToReturn[dst]) {
          geometry._vertexBuffersToReturn[dst] = [];
        }

        // Try to get a buffer from the pool
        const pool = geometry._vertexBufferPools[dst];
        if (pool.length > 0) {
          const bufferInfo = pool.pop();
          // Check if buffer is large enough
          if (bufferInfo.buffer.size >= size) {
            geometry._vertexBuffersInUse[dst].push(bufferInfo);
            return bufferInfo;
          } else {
            // Buffer too small, don't destroy immediately as it may still be in use
            // Add to retirement array
            this._retiredBuffers.push(bufferInfo.buffer);
          }
        }

        // No suitable buffer available, create a new one
        const newBuffer = this.device.createBuffer({
          size,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        const bufferInfo = {
          buffer: newBuffer,
          size,
          // Create a copy of the data array to avoid conflicts when geometry is reset
          dataCopy: null
        };

        geometry._vertexBuffersInUse[dst].push(bufferInfo);
        return bufferInfo;
      }

      _returnVertexBuffersToPool() {
        // Return buffers marked for return back to their pools for all registered geometries
        for (const geometry of this._geometriesWithPools) {
          if (geometry._vertexBuffersToReturn) {
            for (const [dst, buffersToReturn] of Object.entries(geometry._vertexBuffersToReturn)) {
              if (buffersToReturn.length > 0) {
                // Move all buffers from ToReturn back to pool
                const pool = geometry._vertexBufferPools[dst] || [];
                while (buffersToReturn.length > 0) {
                  const bufferInfo = buffersToReturn.pop();
                  // Clear the data copy reference to prevent memory leaks
                  bufferInfo.dataCopy = null;
                  pool.push(bufferInfo);
                }
                geometry._vertexBufferPools[dst] = pool;
              }
            }
          }
        }
      }

      // Called when geometry is reset - mark its buffers for return
      onReset(geometry) {
        this._markGeometryBuffersForReturn(geometry);
      }

      // Mark geometry buffers for return when geometry is reset/freed
      _markGeometryBuffersForReturn(geometry) {
        if (geometry._vertexBuffersInUse && geometry._vertexBuffersToReturn) {
          for (const [dst, buffersInUse] of Object.entries(geometry._vertexBuffersInUse)) {
            if (buffersInUse.length > 0) {
              // Move all buffers from InUse to ToReturn
              const buffersToReturn = geometry._vertexBuffersToReturn[dst] || [];
              while (buffersInUse.length > 0) {
                const bufferInfo = buffersInUse.pop();
                buffersToReturn.push(bufferInfo);
              }
              geometry._vertexBuffersToReturn[dst] = buffersToReturn;
            }
          }
        }
      }

      //////////////////////////////////////////////
      // Uniform buffer pool management
      //////////////////////////////////////////////

      _getUniformBufferFromPool(shader) {
        // Try to get a buffer from the pool
        if (shader._uniformBufferPool.length > 0) {
          const bufferInfo = shader._uniformBufferPool.pop();
          shader._uniformBuffersInUse.push(bufferInfo);
          return bufferInfo;
        }

        // No buffers available, create a new one
        const newBuffer = this.device.createBuffer({
          size: shader._uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const newData = new Float32Array(shader._uniformBufferSize / 4);
        const newDataView = new DataView(newData.buffer);

        const bufferInfo = {
          buffer: newBuffer,
          data: newData,
          dataView: newDataView
        };

        shader._uniformBuffersInUse.push(bufferInfo);
        return bufferInfo;
      }

      _returnUniformBuffersToPool() {
        // Return all used buffers back to their pools for all registered shaders
        for (const shader of this._shadersWithPools) {
          if (shader._uniformBuffersInUse && shader._uniformBuffersInUse.length > 0) {
            this._returnShaderBuffersToPool(shader);
          }
        }
      }

      _returnShaderBuffersToPool(shader) {
        // Move all buffers from inUse back to pool
        while (shader._uniformBuffersInUse.length > 0) {
          const bufferInfo = shader._uniformBuffersInUse.pop();
          shader._uniformBufferPool.push(bufferInfo);
        }
      }

      flushDraw() {
        // Only submit if we actually had any draws
        if (this._hasPendingDraws) {
          // Create a copy of pending command encoders
          const commandsToSubmit = this._pendingCommandEncoders.slice();
          this._pendingCommandEncoders = [];
          this._hasPendingDraws = false;

          // Submit the commands
          this.queue.submit(commandsToSubmit);
        }
      }

      _ensurePixelReadCanvas(width, height) {
        // Create canvas if it doesn't exist
        if (!this._pixelReadCanvas) {
          this._pixelReadCanvas = document.createElement('canvas');
          this._pixelReadCtx = this._pixelReadCanvas.getContext('2d');
        }

        // Resize canvas if dimensions changed
        if (this._pixelReadCanvas.width !== width || this._pixelReadCanvas.height !== height) {
          this._pixelReadCanvas.width = width;
          this._pixelReadCanvas.height = height;
        }

        return { canvas: this._pixelReadCanvas, ctx: this._pixelReadCtx };
      }

      resize(w, h) {
        super.resize(w, h);
        this._hasPendingDraws = true;
        this.flushDraw();
      }

      async finishDraw() {
        this.flushDraw();
        const states = [];
        while (this.activeFramebuffers.length > 0) {
          const fbo = this.activeFramebuffers.pop();
          states.unshift({ fbo, diff: { ...this.states } });
        }
        this.flushDraw();

        // this._pInst.background('red');
        this._pInst.push();
        this.states.setValue('enableLighting', false);
        this.states.setValue('activeImageLight', null);
        this._pInst.setCamera(this.finalCamera);
        this._pInst.resetShader();
        this._pInst.imageMode(this._pInst.CENTER);
        this._pInst.image(this.mainFramebuffer, 0, 0);
        this._pInst.pop();
        this.flushDraw();

        // Return all uniform buffers to their pools
        this._returnUniformBuffersToPool();

        // Mark all geometry buffers for return after frame is complete
        for (const geometry of this._geometriesWithPools) {
          this._markGeometryBuffersForReturn(geometry);
        }

        // Return all vertex buffers to their pools
        this._returnVertexBuffersToPool();

        // Destroy all retired buffers
        for (const buffer of this._retiredBuffers) {
          if (buffer && buffer.destroy) {
            buffer.destroy();
          }
        }
        this._retiredBuffers = [];

        for (const { fbo, diff } of states) {
          fbo.begin();
          for (const key in diff) {
            this.states.setValue(key, diff[key]);
          }
        }
      }

      //////////////////////////////////////////////
      // Rendering
      //////////////////////////////////////////////

      _drawBuffers(geometry, { mode = TRIANGLES, count = 1 }) {
        const buffers = this.geometryBufferCache.getCached(geometry);
        if (!buffers) return;

        const commandEncoder = this.device.createCommandEncoder();

        // Use framebuffer texture if active, otherwise use canvas texture
        const activeFramebuffer = this.activeFramebuffer();
        const colorTexture = activeFramebuffer ?
          (activeFramebuffer.aaColorTexture || activeFramebuffer.colorTexture) :
          this.drawingContext.getCurrentTexture();

        const colorAttachment = {
          view: colorTexture.createView(),
          loadOp: "load",
          storeOp: "store",
          // If using multisampled texture, resolve to non-multisampled texture
          resolveTarget: activeFramebuffer && activeFramebuffer.aaColorTexture ?
            activeFramebuffer.colorTexture.createView() : undefined,
        };

        // Use framebuffer depth texture if active, otherwise use canvas depth texture
        const depthTexture = activeFramebuffer ?
          (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
          this.depthTexture;
        const depthTextureView = depthTexture?.createView();
        const renderPassDescriptor = {
          colorAttachments: [colorAttachment],
          depthStencilAttachment: depthTextureView
            ? {
                view: depthTextureView,
                depthLoadOp: "load",
                depthStoreOp: "store",
                depthClearValue: 1.0,
                stencilLoadOp: "load",
                stencilStoreOp: "store",
                depthReadOnly: false,
                stencilReadOnly: false,
              }
            : undefined,
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        const currentShader = this._curShader;
        passEncoder.setPipeline(currentShader.getPipeline(this._shaderOptions({ mode })));

        // Set stencil reference value for clipping
        const drawTarget = this.drawTarget();
        if (drawTarget._isClipApplied && !this._clipping) {
          // When using the clip mask, test against reference value 0 (background)
          // WebGL uses NOTEQUAL with ref 0, so fragments pass where stencil != 0
          // In WebGPU with 'not-equal', we need ref 0 to pass where stencil != 0
          passEncoder.setStencilReference(0);
        } else if (this._clipping) {
          // When writing to the clip mask, write reference value 1
          passEncoder.setStencilReference(1);
        }
        // Bind vertex buffers
        for (const buffer of this._getVertexBuffers(currentShader)) {
          const location = currentShader.attributes[buffer.attr].location;
          const gpuBuffer = buffers[buffer.dst];
          passEncoder.setVertexBuffer(location, gpuBuffer, 0);
        }
        // Bind uniforms - get a buffer from the pool
        const uniformBufferInfo = this._getUniformBufferFromPool(currentShader);
        this._packUniforms(currentShader, uniformBufferInfo);
        this.device.queue.writeBuffer(
          uniformBufferInfo.buffer,
          0,
          uniformBufferInfo.data.buffer,
          uniformBufferInfo.data.byteOffset,
          uniformBufferInfo.data.byteLength
        );

        // Bind sampler/texture uniforms
        for (const [group, entries] of currentShader._groupEntries) {
          const bgEntries = entries.map(entry => {
            if (group === 0 && entry.binding === 0) {
              return {
                binding: 0,
                resource: { buffer: uniformBufferInfo.buffer },
              };
            }

            if (!entry.uniform.isSampler) {
              throw new Error(
                'All non-texture/sampler uniforms should be in the uniform struct!'
              );
            }

            return {
              binding: entry.binding,
              resource: entry.uniform.type === 'sampler'
                ? (entry.uniform.textureSource.texture || this._getEmptyTexture()).getSampler()
                : (entry.uniform.texture || this._getEmptyTexture()).textureHandle.view,
            };
          });

          const layout = currentShader._bindGroupLayouts[group];
          const bindGroup = this.device.createBindGroup({
            layout,
            entries: bgEntries,
          });
          passEncoder.setBindGroup(group, bindGroup);
        }

        if (currentShader.shaderType === "fill") {
          // Bind index buffer and issue draw
          if (buffers.indexBuffer) {
            const indexFormat = buffers.indexFormat || "uint16";
            passEncoder.setIndexBuffer(buffers.indexBuffer, indexFormat);
            passEncoder.drawIndexed(geometry.faces.length * 3, count, 0, 0, 0);
          } else {
            passEncoder.draw(geometry.vertices.length, count, 0, 0);
          }
        } else if (currentShader.shaderType === "text") {
          if (!buffers.indexBuffer) {
            throw new Error("Text geometry must have an index buffer");
          }
          const indexFormat = buffers.indexFormat || "uint16";
          passEncoder.setIndexBuffer(buffers.indexBuffer, indexFormat);
          passEncoder.drawIndexed(geometry.faces.length * 3, count, 0, 0, 0);
        }

        if (buffers.lineVerticesBuffer && currentShader.shaderType === "stroke") {
          passEncoder.draw(geometry.lineVertices.length / 3, count, 0, 0);
        }

        passEncoder.end();

        // Store the command encoder for later submission
        this._pendingCommandEncoders.push(commandEncoder.finish());

        // Mark that we have pending draws that need submission
        this._hasPendingDraws = true;
      }

      //////////////////////////////////////////////
      // SHADER
      //////////////////////////////////////////////

      _packUniforms(shader, bufferInfo) {
        const data = bufferInfo.data;
        const dataView = bufferInfo.dataView;

        for (const name in shader.uniforms) {
          const uniform = shader.uniforms[name];
          if (uniform.isSampler) continue;

          if (uniform.baseType === 'u32') {
            if (uniform.size === 4) {
              // Single u32
              dataView.setUint32(uniform.offset, uniform._cachedData, true);
            } else {
              // Vector of u32s
              const uniformData = uniform._cachedData;
              for (let i = 0; i < uniformData.length; i++) {
                dataView.setUint32(uniform.offset + i * 4, uniformData[i], true);
              }
            }
          } else if (uniform.baseType === 'i32') {
            if (uniform.size === 4) {
              // Single i32
              dataView.setInt32(uniform.offset, uniform._cachedData, true);
            } else {
              // Vector of i32s
              const uniformData = uniform._cachedData;
              for (let i = 0; i < uniformData.length; i++) {
                dataView.setInt32(uniform.offset + i * 4, uniformData[i], true);
              }
            }
          } else if (uniform.size === 4) {
            // Single float value
            data.set([uniform._cachedData], uniform.offset / 4);
          } else if (uniform._cachedData !== undefined) {
            // Float array (including vec2<f32>, vec3<f32>, vec4<f32>, mat4x4<f32>)
            data.set(uniform._cachedData, uniform.offset / 4);
          }
        }
      }

      _parseStruct(shaderSource, structName) {
        const structMatch = shaderSource.match(
          new RegExp(`struct\\s+${structName}\\s*\\{([^\\}]+)\\}`)
        );
        if (!structMatch) {
          throw new Error(`Can't find a struct definition for ${structName}`);
        }

        const structBody = structMatch[1];
        const elements = {};
        let match;
        let index = 0;
        let offset = 0;

        const elementRegex =
          /(?:@location\((\d+)\)\s+)?(\w+):\s*([^\n]+?),?\n/g;

        const baseAlignAndSize = (type) => {
          if (['f32', 'i32', 'u32', 'bool'].includes(type)) {
            return { align: 4, size: 4, items: 1, baseType: type };
          }
          if (/^vec[2-4](<f32>|f)$/.test(type)) {
            const n = parseInt(type.match(/^vec([2-4])/)[1]);
            const size = 4 * n;
            const align = n === 2 ? 8 : 16;
            return { align, size, items: n, baseType: 'f32' };
          }
          if (/^vec[2-4]<(i32|u32)>$/.test(type)) {
            const n = parseInt(type.match(/^vec([2-4])/)[1]);
            const match = type.match(/^vec[2-4]<(i32|u32)>$/);
            const baseType = match[1]; // 'i32' or 'u32'
            const size = 4 * n;
            const align = n === 2 ? 8 : 16;
            return { align, size, items: n, baseType };
          }
          if (/^mat[2-4](?:x[2-4])?(<f32>|f)$/.test(type)) {
            if (type[4] === 'x' && type[3] !== type[5]) {
              throw new Error('Non-square matrices not implemented yet');
            }
            const dim = parseInt(type[3]);
            const align = dim === 2 ? 8 : 16;
            // Each column must be aligned
            const size = Math.ceil(dim * 4 / align) * align * dim;
            const pack = dim === 3
              ? (data) => [
                ...data.slice(0, 3),
                0,
                ...data.slice(3, 6),
                0,
                ...data.slice(6, 9),
                0
              ]
              : undefined;
            return { align, size, pack, items: dim * dim, baseType: 'f32' };
          }
          if (/^array<.+>$/.test(type)) {
            const [, subtype, rawLength] = type.match(/^array<(.+),\s*(\d+)>/);
            const length = parseInt(rawLength);
            const {
              align: elemAlign,
              size: elemSize,
              items: elemItems,
              pack: elemPack = (data) => [...data],
              baseType: elemBaseType
            } = baseAlignAndSize(subtype);
            const stride = Math.ceil(elemSize / elemAlign) * elemAlign;
            const pack = (data) => {
              const result = [];
              for (let i = 0; i < data.length; i += elemItems) {
                const elemData = elemPack(data.slice(i, elemItems));
                result.push(...elemData);
                for (let j = 0; j < stride / 4 - elemData.length; j++) {
                  result.push(0);
                }
              }
              return result;
            };
            return {
              align: elemAlign,
              size: stride * length,
              items: elemItems * length,
              pack,
              baseType: elemBaseType
            };
          }
          throw new Error(`Unknown type in WGSL struct: ${type}`);
        };

        while ((match = elementRegex.exec(structBody)) !== null) {
          const [_, location, name, type] = match;
          const { size, align, pack, baseType } = baseAlignAndSize(type);
          offset = Math.ceil(offset / align) * align;
          const offsetEnd = offset + size;
          elements[name] = {
            name,
            location: location ? parseInt(location) : undefined,
            index,
            type,
            size,
            offset,
            offsetEnd,
            pack,
            baseType
          };
          index++;
          offset = offsetEnd;
        }

        return elements;
      }

      _mapUniformData(uniform, data) {
        if (uniform.pack) {
          return uniform.pack(data);
        }
        return data;
      }

      _getShaderAttributes(shader) {
        const mainMatch = /fn main\(.+:\s*([^\s\)]+)/.exec(shader._vertSrc);
        if (!mainMatch) throw new Error("Can't find `fn main` in vertex shader source");
        const inputType = mainMatch[1];

        return this._parseStruct(shader.vertSrc(), inputType);
      }

      getUniformMetadata(shader) {
        // Currently, for ease of parsing, we enforce that the first bind group is a
        // struct, which contains all non-sampler uniforms. Then, any subsequent
        // groups contain samplers.

        // Extract the struct name from the uniform variable declaration
        const uniformVarRegex = /@group\(0\)\s+@binding\(0\)\s+var<uniform>\s+(\w+)\s*:\s*(\w+);/;
        const uniformVarMatch = uniformVarRegex.exec(shader.vertSrc());
        if (!uniformVarMatch) {
          throw new Error('Expected a uniform struct bound to @group(0) @binding(0)');
        }
        const structType = uniformVarMatch[2];
        const uniforms = this._parseStruct(shader.vertSrc(), structType);
        // Extract samplers from group bindings
        const samplers = {};
        // TODO: support other texture types
        const samplerRegex = /@group\((\d+)\)\s*@binding\((\d+)\)\s*var\s+(\w+)\s*:\s*(texture_2d<f32>|sampler);/g;
        for (const [src, visibility] of [
          [shader.vertSrc(), GPUShaderStage.VERTEX],
          [shader.fragSrc(), GPUShaderStage.FRAGMENT]
        ]) {
          let match;
          while ((match = samplerRegex.exec(src)) !== null) {
            const [_, group, binding, name, type] = match;
            const groupIndex = parseInt(group);
            const bindingIndex = parseInt(binding);
            // We're currently reserving group 0 for non-sampler stuff, which we parse
            // above, so we can skip it here while we grab the remaining sampler
            // uniforms
            if (groupIndex === 0 && bindingIndex === 0) continue;

            const key = `${groupIndex},${bindingIndex}`;
            samplers[key] = {
              visibility: (samplers[key]?.visibility || 0) | visibility,
              group: groupIndex,
              binding: bindingIndex,
              name,
              type,
              isSampler: true,
              noData: type === 'sampler',
            };
          }

          for (const sampler of Object.values(samplers)) {
            if (sampler.type.startsWith('texture')) {
              const samplerName = sampler.name + '_sampler';
              const samplerNode = Object
                .values(samplers)
                .find((s) => s.name === samplerName);
              if (!samplerNode) {
                throw new Error(
                  `Every shader texture needs an accompanying sampler. Could not find sampler ${samplerName} for texture ${sampler.name}`
                );
              }
              samplerNode.textureSource = sampler;
            }
          }
        }
        return [...Object.values(uniforms).sort((a, b) => a.index - b.index), ...Object.values(samplers)];
      }

      getNextBindingIndex(shader, group = 0) {
        // Get the highest binding index in the specified group and return the next available
        const samplerRegex = /@group\((\d+)\)\s*@binding\((\d+)\)\s*var\s+(\w+)\s*:\s*(texture_2d<f32>|sampler|uniform)/g;
        let maxBindingIndex = -1;

        for (const [src, visibility] of [
          [shader.vertSrc(), GPUShaderStage.VERTEX],
          [shader.fragSrc(), GPUShaderStage.FRAGMENT]
        ]) {
          let match;
          while ((match = samplerRegex.exec(src)) !== null) {
            const [_, groupIndex, bindingIndex] = match;
            if (parseInt(groupIndex) === group) {
              maxBindingIndex = Math.max(maxBindingIndex, parseInt(bindingIndex));
            }
          }
        }

        return maxBindingIndex + 1;
      }

      updateUniformValue(_shader, uniform, data) {
        if (uniform.isSampler) {
          uniform.texture =
            data instanceof Texture ? data : this.getTexture(data);
        }
      }

      _updateTexture(uniform, tex) {
        tex.update();
      }

      bindTexture(tex) {}
      unbindTexture(tex) {}
      _unbindFramebufferTexture(uniform) {}

      createTexture({ width, height, format = 'rgba8unorm', usage }) {
        const gpuTexture = this.device.createTexture({
          size: [width, height],
          format,
          usage: usage || (
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT
          ),
        });
        return { gpuTexture, view: gpuTexture.createView() };
      }

      uploadTextureFromSource({ gpuTexture }, source) {
        this.queue.copyExternalImageToTexture(
          { source },
          { texture: gpuTexture },
          [source.width, source.height]
        );

        // Force submission to ensure texture upload completes before usage
        this._hasPendingDraws = true;
        this.flushDraw();
      }

      uploadTextureFromData({ gpuTexture }, data, width, height) {
        this.queue.writeTexture(
          { texture: gpuTexture },
          data,
          { bytesPerRow: width * 4, rowsPerImage: height },
          { width, height, depthOrArrayLayers: 1 }
        );

        // Force submission to ensure texture upload completes before usage
        this._hasPendingDraws = true;
        this.flushDraw();
      }

      setTextureParams(_texture) {}

      getSampler(texture) {
        const key = `${texture.minFilter}_${texture.magFilter}_${texture.wrapS}_${texture.wrapT}`;
        if (this.samplers.has(key)) {
          return this.samplers.get(key);
        }
        const constantMapping = {
          [NEAREST]: 'nearest',
          [LINEAR]: 'linear',
          [CLAMP]: 'clamp-to-edge',
          [REPEAT]: 'repeat',
          [MIRROR]: 'mirror-repeat'
        };
        const sampler = this.device.createSampler({
          magFilter: constantMapping[texture.magFilter],
          minFilter: constantMapping[texture.minFilter],
          addressModeU: constantMapping[texture.wrapS],
          addressModeV: constantMapping[texture.wrapT],
        });
        this.samplers.set(key, sampler);
        return sampler;
      }

      bindTextureToShader(_texture, _sampler, _uniformName, _unit) {}

      deleteTexture({ gpuTexture }) {
        gpuTexture.destroy();
      }

      _getLightShader() {
        if (!this._defaultLightShader) {
          this._defaultLightShader = new Shader(
            this,
            materialVertexShader,
            materialFragmentShader,
            {
              vertex: {
                "void beforeVertex": "() {}",
                "Vertex getObjectInputs": "(inputs: Vertex) { return inputs; }",
                "Vertex getWorldInputs": "(inputs: Vertex) { return inputs; }",
                "Vertex getCameraInputs": "(inputs: Vertex) { return inputs; }",
                "void afterVertex": "() {}",
              },
              fragment: {
                "void beforeFragment": "() {}",
                "Inputs getPixelInputs": "(inputs: Inputs) { return inputs; }",
                "vec4f combineColors": `(components: ColorComponents) {
                var rgb = vec3<f32>(0.0);
                rgb += components.diffuse * components.baseColor;
                rgb += components.ambient * components.ambientColor;
                rgb += components.specular * components.specularColor;
                rgb += components.emissive;
                return vec4<f32>(rgb, components.opacity);
              }`,
                "vec4f getFinalColor": "(color: vec4<f32>) { return color; }",
                "void afterFragment": "() {}",
              },
            }
          );
        }
        return this._defaultLightShader;
      }

      _getColorShader() {
        if (!this._defaultColorShader) {
          this._defaultColorShader = new Shader(
            this,
            colorVertexShader,
            colorFragmentShader,
            {
              vertex: {
                "void beforeVertex": "() {}",
                "Vertex getObjectInputs": "(inputs: Vertex) { return inputs; }",
                "Vertex getWorldInputs": "(inputs: Vertex) { return inputs; }",
                "Vertex getCameraInputs": "(inputs: Vertex) { return inputs; }",
                "void afterVertex": "() {}",
              },
              fragment: {
                "void beforeFragment": "() {}",
                "vec4<f32> getFinalColor": "(color: vec4<f32>) { return color; }",
                "void afterFragment": "() {}",
              },
            }
          );
        }
        return this._defaultColorShader;
      }

      _getLineShader() {
        if (!this._defaultLineShader) {
          this._defaultLineShader = new Shader(
            this,
            lineDefs + lineVertexShader,
            lineDefs + lineFragmentShader,
            {
              vertex: {
                "void beforeVertex": "() {}",
                "StrokeVertex getObjectInputs": "(inputs: StrokeVertex) { return inputs; }",
                "StrokeVertex getWorldInputs": "(inputs: StrokeVertex) { return inputs; }",
                "StrokeVertex getCameraInputs": "(inputs: StrokeVertex) { return inputs; }",
                "void afterVertex": "() {}",
              },
              fragment: {
                "void beforeFragment": "() {}",
                "Inputs getPixelInputs": "(inputs: Inputs) { return inputs; }",
                "vec4<f32> getFinalColor": "(color: vec4<f32>) { return color; }",
                "bool shouldDiscard": "(outside: bool) { return outside; };",
                "void afterFragment": "() {}",
              },
            }
          );
        }
        return this._defaultLineShader;
      }

      _getFontShader() {
        if (!this._defaultFontShader) {
          this._defaultFontShader = new Shader(
            this,
            fontVertexShader,
            fontFragmentShader
          );
        }
        return this._defaultFontShader;
      }

      //////////////////////////////////////////////
      // Setting
      //////////////////////////////////////////////
      _adjustDimensions(width, height) {
        // TODO: find max texture size
        return { adjustedWidth: width, adjustedHeight: height };
      }

      _applyClip() {
        const commandEncoder = this.device.createCommandEncoder();

        const activeFramebuffer = this.activeFramebuffer();
        const depthTexture = activeFramebuffer ?
          (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
          this.depthTexture;

        if (!depthTexture) {
          return;
        }

        const depthStencilAttachment = {
          view: depthTexture.createView(),
          stencilLoadOp: 'clear',
          stencilStoreOp: 'store',
          stencilClearValue: 0,
          depthReadOnly: true,
          stencilReadOnly: false,
        };

        const renderPassDescriptor = {
          colorAttachments: [],
          depthStencilAttachment: depthStencilAttachment,
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();

        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }

      _unapplyClip() {
        // In WebGPU, clip unapplication is handled through pipeline state rather than direct commands
        // The stencil test configuration is set in the render pipeline based on _clipping and _clipInvert flags
        // This is already handled in the _shaderOptions() method and pipeline creation
      }

      _clearClipBuffer() {
        const commandEncoder = this.device.createCommandEncoder();

        const activeFramebuffer = this.activeFramebuffer();
        const depthTexture = activeFramebuffer ?
          (activeFramebuffer.aaDepthTexture || activeFramebuffer.depthTexture) :
          this.depthTexture;

        if (!depthTexture) {
          return;
        }

        const depthStencilAttachment = {
          view: depthTexture.createView(),
          stencilLoadOp: 'clear',
          stencilStoreOp: 'store',
          stencilClearValue: 1,
          depthReadOnly: true,
          stencilReadOnly: false,
        };

        const renderPassDescriptor = {
          colorAttachments: [],
          depthStencilAttachment: depthStencilAttachment,
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();

        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }

      _applyStencilTestIfClipping() {
        // This is done via pipeline state in WebGL so this is a no-op
      }

      //////////////////////////////////////////////
      // Shader hooks
      //////////////////////////////////////////////
      uniformNameFromHookKey(key) {
        return key.slice(0, key.indexOf(':'));
      }
      populateHooks(shader, src, shaderType) {
        if (!src.includes('fn main')) return src;

        // Apply some p5-specific preprocessing. WGSL doesn't have preprocessor
        // statements, but some of our shaders might need it, so we add a lightweight
        // way to add code if a hook is augmented. e.g.:
        //   struct Uniforms {
        //   // @p5 ifdef Vertex getWorldInputs
        //     uModelMatrix: mat4f,
        //     uViewMatrix: mat4f,
        //   // @p5 endif
        //   // @p5 ifndef Vertex getWorldInputs
        //     uModelViewMatrix: mat4f,
        //   // @p5 endif
        //   }
        src = src.replace(
          /\/\/ @p5 (ifdef|ifndef) (\w+)\s+(\w+)\n((?:(?!\/\/ @p5)(?:.|\n))*)\/\/ @p5 endif/g,
          (_, condition, hookType, hookName, body) => {
            const target = condition === 'ifdef';
            if (
              (
                !!shader.hooks.modified.vertex[`${hookType} ${hookName}`] ||
                !!shader.hooks.modified.fragment[`${hookType} ${hookName}`]
              ) === target
            ) {
              return body;
            } else {
              return '';
            }
          }
        );

        let [preMain, main, postMain] = src.split(/((?:@(?:vertex|fragment)\s*)?fn main[^{]+\{)/);
        if (shaderType !== 'fragment') {
          if (!main.match(/\@builtin\s*\(\s*instance_index\s*\)/)) {
            main = main.replace(/\)\s*(->|\{)/, ', @builtin(instance_index) instanceID: u32) $1');
          }
        }

        let uniforms = '';
        for (const key in shader.hooks.uniforms) {
          // WGSL format: "name: type"
          uniforms += `${key},\n`;
        }
        preMain = preMain.replace(/struct\s+Uniforms\s+\{/, `$&\n${uniforms}`);

        // Handle varying variables by injecting them into VertexOutput and FragmentInput structs
        if (shader.hooks.varyingVariables && shader.hooks.varyingVariables.length > 0) {
          // Generate struct members for varying variables
          let nextLocationIndex = this._getNextAvailableLocation(preMain, shaderType);
          let varyingMembers = '';

          for (const varyingVar of shader.hooks.varyingVariables) {
            // varyingVar is a string like "varName: vec3<f32>"
            const member = `@location(${nextLocationIndex++}) ${varyingVar},`;
            varyingMembers += member + '\n';
          }

          if (shaderType === 'vertex') {
            // Inject into VertexOutput struct
            preMain = preMain.replace(
              /struct\s+VertexOutput\s+\{([^}]*)\}/,
              (match, body) => `struct VertexOutput {${body}\n${varyingMembers}}`
            );
          } else if (shaderType === 'fragment') {
            // Inject into FragmentInput struct
            preMain = preMain.replace(
              /struct\s+FragmentInput\s+\{([^}]*)\}/,
              (match, body) => `struct FragmentInput {${body}\n${varyingMembers}}`
            );
          }
        }

        // Add file-global varying variable declarations
        if (shader.hooks.varyingVariables && shader.hooks.varyingVariables.length > 0) {
          let varyingDeclarations = '';
          for (const varyingVar of shader.hooks.varyingVariables) {
            // varyingVar is a string like "varName: vec3<f32>"
            const [varName, varType] = varyingVar.split(':').map(s => s.trim());
            varyingDeclarations += `var<private> ${varName}: ${varType};\n`;
          }

          // Add declarations before the main function
          preMain += varyingDeclarations;

          if (shaderType === 'vertex') {
            // In vertex shader, copy varying variables to output struct before return
            let copyStatements = '';
            for (const varyingVar of shader.hooks.varyingVariables) {
              const [varName] = varyingVar.split(':').map(s => s.trim());
              copyStatements += `  OUTPUT_VAR.${varName} = ${varName};\n`;
            }

            // Find the output variable name from the return statement and replace OUTPUT_VAR
            const returnMatch = postMain.match(/return\s+(\w+)\s*;/);
            if (returnMatch) {
              const outputVarName = returnMatch[1];
              copyStatements = copyStatements.replace(/OUTPUT_VAR/g, outputVarName);
              // Insert before the return statement
              postMain = postMain.replace(/(return\s+\w+\s*;)/g, `${copyStatements}  $1`);
            }
          } else if (shaderType === 'fragment') {
            // In fragment shader, initialize varying variables from input struct at start of main
            let initStatements = '';
            for (const varyingVar of shader.hooks.varyingVariables) {
              const [varName] = varyingVar.split(':').map(s => s.trim());
              initStatements += `  ${varName} = INPUT_VAR.${varName};\n`;
            }

            // Find the input parameter name from the main function signature (anchored to start)
            const inputMatch = main.match(/fn main\s*\((\w+):\s*\w+\)/);
            if (inputMatch) {
              const inputVarName = inputMatch[1];
              initStatements = initStatements.replace(/INPUT_VAR/g, inputVarName);
              // Insert after the main function parameter but before any other code (anchored to start)
              postMain = initStatements + postMain;
            }
          }
        }

        let hooks = '';
        let defines = '';
        if (shader.hooks.declarations) {
          hooks += shader.hooks.declarations + '\n';
        }
        if (shader.hooks[shaderType].declarations) {
          hooks += shader.hooks[shaderType].declarations + '\n';
        }
        for (const hookDef in shader.hooks.helpers) {
          const [hookType, hookName] = hookDef.split(' ');
          const [_, params, body] = /^(\([^\)]*\))((?:.|\n)*)$/.exec(shader.hooks.helpers[hookDef]);
          if (hookType === 'void') {
            hooks += `fn ${hookName}${params}${body}\n`;
          } else {
            hooks += `fn ${hookName}${params} -> ${hookType}${body}\n`;
          }
        }
        for (const hookDef in shader.hooks[shaderType]) {
          if (hookDef === 'declarations') continue;
          const [hookType, hookName] = hookDef.split(' ');

          // Add a const so that if the shader wants to
          // optimize away the extra function calls in main, it can do so
          defines += `const AUGMENTED_HOOK_${hookName} = ${
          shader.hooks.modified[shaderType][hookDef] ? 'true' : 'false'
        };\n`;

          let [_, params, body] = /^(\([^\)]*\))((?:.|\n)*)$/.exec(shader.hooks[shaderType][hookDef]);

          if (shaderType !== 'fragment') {
            // Splice the instance ID in as a final parameter to every WGSL hook function
            let hasParams = !!params.match(/^\(\s*\S+.*\)$/);
            params = params.slice(0, -1) + (hasParams ? ', ' : '') + 'instanceID: u32)';
          }

          if (hookType === 'void') {
            hooks += `fn HOOK_${hookName}${params}${body}\n`;
          } else {
            hooks += `fn HOOK_${hookName}${params} -> ${hookType}${body}\n`;
          }
        }

        // Add the instance ID as a final parameter to each hook call
        if (shaderType !== 'fragment') {
          const addInstanceIDParam = (src) => {
            let result = src;
            let idx = 0;
            let match;
            do {
              match = /HOOK_\w+\(/.exec(result.slice(idx));
              if (match) {
                idx += match.index + match[0].length - 1;
                let nesting = 0;
                let hasParams = false;
                while (idx < result.length) {
                  if (result[idx] === '(') {
                    nesting++;
                  } else if (result[idx] === ')') {
                    nesting--;
                  } else if (result[idx].match(/\S/)) {
                    hasParams = true;
                  }
                  idx++;
                  if (nesting === 0) {
                    break;
                  }
                }
                const insertion = (hasParams ? ', ' : '') + 'instanceID';
                result = result.slice(0, idx-1) + insertion + result.slice(idx-1);
                idx += insertion.length;
              }
            } while (match);
            return result;
          };
          preMain = addInstanceIDParam(preMain);
          postMain = addInstanceIDParam(postMain);
        }

        return preMain + '\n' + defines + hooks + main + postMain;
      }

      _getNextAvailableLocation(shaderSource, shaderType) {
        // Parse existing struct to find the highest @location number
        let maxLocation = -1;
        const structName = shaderType === 'vertex' ? 'VertexOutput' : 'FragmentInput';

        // Find the struct definition
        const structMatch = shaderSource.match(new RegExp(`struct\\s+${structName}\\s*\\{([^}]*)\\}`, 's'));
        if (structMatch) {
          const structBody = structMatch[1];

          // Find all @location(N) declarations
          const locationMatches = structBody.matchAll(/@location\((\d+)\)/g);
          for (const match of locationMatches) {
            const locationNum = parseInt(match[1]);
            if (locationNum > maxLocation) {
              maxLocation = locationNum;
            }
          }
        }

        return maxLocation + 1;
      }

      getShaderHookTypes(shader, hookName) {
        // Create mapping from WGSL types to DataType entries
        const wgslToDataType = {
          'f32': DataType.float1,
          'vec2<f32>': DataType.float2,
          'vec3<f32>': DataType.float3,
          'vec4<f32>': DataType.float4,
          'vec2f': DataType.float2,
          'vec3f': DataType.float3,
          'vec4f': DataType.float4,
          'i32': DataType.int1,
          'vec2<i32>': DataType.int2,
          'vec3<i32>': DataType.int3,
          'vec4<i32>': DataType.int4,
          'bool': DataType.bool1,
          'vec2<bool>': DataType.bool2,
          'vec3<bool>': DataType.bool3,
          'vec4<bool>': DataType.bool4,
          'mat2x2<f32>': DataType.mat2,
          'mat3x3<f32>': DataType.mat3,
          'mat4x4<f32>': DataType.mat4,
          'texture_2d<f32>': DataType.sampler2D
        };

        let fullSrc = shader._vertSrc;
        let body = shader.hooks.vertex[hookName];
        if (!body) {
          body = shader.hooks.fragment[hookName];
          fullSrc = shader._fragSrc;
        }
        if (!body) {
          throw new Error(`Can't find hook ${hookName}!`);
        }
        const nameParts = hookName.split(/\s+/g);
        const functionName = nameParts.pop();
        const returnType = nameParts.pop();
        const returnQualifiers = [...nameParts];
        const parameterMatch = /\(([^\)]*)\)/.exec(body);
        if (!parameterMatch) {
          throw new Error(`Couldn't find function parameters in hook body:\n${body}`);
        }

        const structProperties = structName => {
          // WGSL struct parsing: struct StructName { field1: Type, field2: Type }
          const structDefMatch = new RegExp(`struct\\s+${structName}\\s*{([^}]*)}`).exec(fullSrc);
          if (!structDefMatch) return undefined;
          const properties = [];

          // Parse WGSL struct fields (e.g., "texCoord: vec2<f32>,")
          for (const fieldSrc of structDefMatch[1].split(',')) {
            const trimmed = fieldSrc.trim();
            if (!trimmed) continue;

            // Remove location decorations and parse field
            // Format: [@location(N)] fieldName: Type
            const fieldMatch = /(?:@location\([^)]*\)\s*)?(\w+)\s*:\s*([^,\s]+)/.exec(trimmed);
            if (!fieldMatch) continue;

            const name = fieldMatch[1];
            let typeName = fieldMatch[2];

            const dataType = wgslToDataType[typeName] || null;

            const typeProperties = structProperties(typeName);
            properties.push({
              name,
              type: {
                typeName: typeName, // Keep native WGSL type name
                qualifiers: [],
                properties: typeProperties,
                dataType: dataType
              }
            });
          }
          return properties;
        };

        const parameters = parameterMatch[1].split(',').map(paramString => {
          // WGSL function parameters: name: type or name: binding<type>
          const trimmed = paramString.trim();
          if (!trimmed) return null;

          const parts = trimmed.split(':').map(s => s.trim());
          if (parts.length !== 2) return null;

          const name = parts[0];
          let typeName = parts[1];

          // Handle texture bindings like "texture_2d<f32>" -> sampler2D DataType
          if (typeName.includes('texture_2d')) {
            typeName = 'texture_2d<f32>';
          }

          const dataType = wgslToDataType[typeName] || null;

          const properties = structProperties(typeName);
          return {
            name,
            type: {
              typeName: typeName, // Keep native WGSL type name
              qualifiers: [],
              properties,
              dataType: dataType
            }
          };
        }).filter(Boolean);

        // Convert WGSL return type to DataType
        const returnDataType = wgslToDataType[returnType] || null;

        return {
          name: functionName,
          returnType: {
            typeName: returnType, // Keep native WGSL type name
            qualifiers: returnQualifiers,
            properties: structProperties(returnType),
            dataType: returnDataType
          },
          parameters
        };
      }

      //////////////////////////////////////////////
      // Buffer management for pixel reading
      //////////////////////////////////////////////

      _ensurePixelReadBuffer(requiredSize) {
        // Create or resize staging buffer if needed
        if (!this.pixelReadBuffer || this.pixelReadBufferSize < requiredSize) {
          // Clean up old buffer
          if (this.pixelReadBuffer) {
            this.pixelReadBuffer.destroy();
          }

          // Create new buffer with padding to avoid frequent recreations
          // Scale by 2 to ensure integer size and reasonable headroom
          const bufferSize = Math.max(requiredSize, this.pixelReadBufferSize * 2);
          this.pixelReadBuffer = this.device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
          });
          this.pixelReadBufferSize = bufferSize;
        }
        return this.pixelReadBuffer;
      }

      _alignBytesPerRow(bytesPerRow) {
        // WebGPU requires bytesPerRow to be a multiple of 256 bytes for texture-to-buffer copies
        return Math.ceil(bytesPerRow / 256) * 256;
      }

      //////////////////////////////////////////////
      // Framebuffer methods
      //////////////////////////////////////////////

      defaultFramebufferAlpha() {
        return true
      }

      defaultFramebufferAntialias() {
        return true;
      }

      supportsFramebufferAntialias() {
        return true;
      }

      createFramebufferResources(framebuffer) {
      }

      validateFramebufferFormats(framebuffer) {
        if (![
          UNSIGNED_BYTE,
          FLOAT,
          HALF_FLOAT
        ].includes(framebuffer.format)) {
          console.warn(
            'Unknown Framebuffer format. ' +
              'Please use UNSIGNED_BYTE, FLOAT, or HALF_FLOAT. ' +
              'Defaulting to UNSIGNED_BYTE.'
          );
          framebuffer.format = UNSIGNED_BYTE;
        }

        if (framebuffer.useDepth && ![
          UNSIGNED_INT,
          FLOAT
        ].includes(framebuffer.depthFormat)) {
          console.warn(
            'Unknown Framebuffer depth format. ' +
              'Please use UNSIGNED_INT or FLOAT. Defaulting to FLOAT.'
          );
          framebuffer.depthFormat = FLOAT;
        }
      }

      recreateFramebufferTextures(framebuffer) {
        // Clean up existing textures
        if (framebuffer.colorTexture && framebuffer.colorTexture.destroy) {
          framebuffer.colorTexture.destroy();
        }
        if (framebuffer.aaColorTexture && framebuffer.aaColorTexture.destroy) {
          framebuffer.aaColorTexture.destroy();
        }
        if (framebuffer.depthTexture && framebuffer.depthTexture.destroy) {
          framebuffer.depthTexture.destroy();
        }
        if (framebuffer.aaDepthTexture && framebuffer.aaDepthTexture.destroy) {
          framebuffer.aaDepthTexture.destroy();
        }

        const baseDescriptor = {
          size: {
            width: framebuffer.width * framebuffer.density,
            height: framebuffer.height * framebuffer.density,
            depthOrArrayLayers: 1,
          },
          format: this._getWebGPUColorFormat(framebuffer),
        };

        // Create non-multisampled texture for texture binding (always needed)
        const colorTextureDescriptor = {
          ...baseDescriptor,
          usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
          sampleCount: 1,
        };
        framebuffer.colorTexture = this.device.createTexture(colorTextureDescriptor);

        // Create multisampled texture for rendering if antialiasing is enabled
        if (framebuffer.antialias) {
          const aaColorTextureDescriptor = {
            ...baseDescriptor,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            sampleCount: this._getValidSampleCount(framebuffer.antialiasSamples),
          };
          framebuffer.aaColorTexture = this.device.createTexture(aaColorTextureDescriptor);
        }

        if (framebuffer.useDepth) {
          const depthBaseDescriptor = {
            size: {
              width: framebuffer.width * framebuffer.density,
              height: framebuffer.height * framebuffer.density,
              depthOrArrayLayers: 1,
            },
            format: this._getWebGPUDepthFormat(framebuffer),
          };

          // Create non-multisampled depth texture for texture binding (always needed)
          const depthTextureDescriptor = {
            ...depthBaseDescriptor,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            sampleCount: 1,
          };
          framebuffer.depthTexture = this.device.createTexture(depthTextureDescriptor);

          // Create multisampled depth texture for rendering if antialiasing is enabled
          if (framebuffer.antialias) {
            const aaDepthTextureDescriptor = {
              ...depthBaseDescriptor,
              usage: GPUTextureUsage.RENDER_ATTACHMENT,
              sampleCount: this._getValidSampleCount(framebuffer.antialiasSamples),
            };
            framebuffer.aaDepthTexture = this.device.createTexture(aaDepthTextureDescriptor);
          }
        }

        // Clear the framebuffer textures after creation
        this._clearFramebufferTextures(framebuffer);
      }

      _clearFramebufferTextures(framebuffer) {
        const commandEncoder = this.device.createCommandEncoder();

        // Clear the color texture (and multisampled texture if it exists)
        const colorTexture = framebuffer.aaColorTexture || framebuffer.colorTexture;
        const colorAttachment = {
          view: colorTexture.createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          resolveTarget: framebuffer.aaColorTexture ?
            framebuffer.colorTexture.createView() : undefined,
        };

        // Clear the depth texture if it exists
        const depthTexture = framebuffer.aaDepthTexture || framebuffer.depthTexture;
        const depthStencilAttachment = depthTexture ? {
          view: depthTexture.createView(),
          depthLoadOp: "clear",
          depthStoreOp: "store",
          depthClearValue: 1.0,
          stencilLoadOp: "clear",
          stencilStoreOp: "store",
          depthReadOnly: false,
          stencilReadOnly: false,
        } : undefined;

        const renderPassDescriptor = {
          colorAttachments: [colorAttachment],
          depthStencilAttachment: depthStencilAttachment,
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.end();

        this._pendingCommandEncoders.push(commandEncoder.finish());
        this._hasPendingDraws = true;
      }

      _getFramebufferColorTextureView(framebuffer) {
        if (framebuffer.colorTexture) {
          return framebuffer.colorTexture.createView();
        }
        return null;
      }

      createFramebufferTextureHandle(framebufferTexture) {
        const src = framebufferTexture;
        let renderer = this;
        return {
          get view() {
            return renderer._getFramebufferColorTextureView(src.framebuffer);
          },
          get gpuTexture() {
            return src.framebuffer.colorTexture;
          }
        };
      }

      _getWebGPUColorFormat(framebuffer) {
        if (framebuffer.format === FLOAT) {
          return framebuffer.channels === RGBA ? 'rgba32float' : 'rgba32float';
        } else if (framebuffer.format === HALF_FLOAT) {
          return framebuffer.channels === RGBA ? 'rgba16float' : 'rgba16float';
        } else {
          return framebuffer.channels === RGBA ? 'rgba8unorm' : 'rgba8unorm';
        }
      }

      _getWebGPUDepthFormat(framebuffer) {
        if (framebuffer.useStencil) {
          return framebuffer.depthFormat === FLOAT ? 'depth32float-stencil8' : 'depth24plus-stencil8';
        } else {
          return framebuffer.depthFormat === FLOAT ? 'depth32float' : 'depth24plus';
        }
      }

      _deleteFramebufferTexture(texture) {
        const handle = texture.rawTexture();
        if (handle.texture && handle.texture.destroy) {
          handle.texture.destroy();
        }
        this.textures.delete(texture);
      }

      deleteFramebufferTextures(framebuffer) {
        this._deleteFramebufferTexture(framebuffer.color);
        if (framebuffer.depth) this._deleteFramebufferTexture(framebuffer.depth);
      }

      deleteFramebufferResources(framebuffer) {
        if (framebuffer.colorTexture && framebuffer.colorTexture.destroy) {
          framebuffer.colorTexture.destroy();
        }
        if (framebuffer.depthTexture && framebuffer.depthTexture.destroy) {
          framebuffer.depthTexture.destroy();
        }
        if (framebuffer.aaDepthTexture && framebuffer.aaDepthTexture.destroy) {
          framebuffer.aaDepthTexture.destroy();
        }
      }

      getFramebufferToBind(framebuffer) {
      }

      updateFramebufferTexture(framebuffer, property) {
        // No-op for WebGPU since antialiasing is handled at pipeline level
      }

      bindFramebuffer(framebuffer) {}

      framebufferYScale() {
        return 1;
      }

      async readFramebufferPixels(framebuffer) {
        await this.finishDraw();
        // Ensure all pending GPU work is complete before reading pixels
        // await this.queue.onSubmittedWorkDone();

        const width = framebuffer.width * framebuffer.density;
        const height = framebuffer.height * framebuffer.density;
        const bytesPerPixel = 4;
        const unalignedBytesPerRow = width * bytesPerPixel;
        const alignedBytesPerRow = this._alignBytesPerRow(unalignedBytesPerRow);
        const bufferSize = alignedBytesPerRow * height;

        // const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);
        const stagingBuffer = this.device.createBuffer({
          size: bufferSize,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });

        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyTextureToBuffer(
          {
            texture: framebuffer.colorTexture,
            origin: { x: 0, y: 0, z: 0 },
            mipLevel: 0,
            aspect: 'all'
          },
          { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow, rowsPerImage: height },
          { width, height, depthOrArrayLayers: 1 }
        );

        this.device.queue.submit([commandEncoder.finish()]);

        // Wait for the copy operation to complete
        // await this.queue.onSubmittedWorkDone();

        await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
        const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);

        // If alignment was needed, extract the actual pixel data
        if (alignedBytesPerRow === unalignedBytesPerRow) {
          const result = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
          stagingBuffer.unmap();
          return result;
        } else {
          // Need to extract pixel data from aligned buffer
          const result = new Uint8Array(width * height * bytesPerPixel);
          const mappedData = new Uint8Array(mappedRange);
          for (let y = 0; y < height; y++) {
            const srcOffset = y * alignedBytesPerRow;
            const dstOffset = y * unalignedBytesPerRow;
            result.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
          }
          stagingBuffer.unmap();
          return result;
        }
      }

      async readFramebufferPixel(framebuffer, x, y) {
        await this.finishDraw();
        // Ensure all pending GPU work is complete before reading pixels
        // await this.queue.onSubmittedWorkDone();

        const bytesPerPixel = 4;
        const alignedBytesPerRow = this._alignBytesPerRow(bytesPerPixel);
        const bufferSize = alignedBytesPerRow;

        const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyTextureToBuffer(
          {
            texture: framebuffer.colorTexture,
            origin: { x, y, z: 0 }
          },
          { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
          { width: 1, height: 1, depthOrArrayLayers: 1 }
        );

        this.device.queue.submit([commandEncoder.finish()]);

        await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
        const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);
        const pixelData = new Uint8Array(mappedRange);
        const result = [pixelData[0], pixelData[1], pixelData[2], pixelData[3]];

        stagingBuffer.unmap();
        return result;
      }

      async readFramebufferRegion(framebuffer, x, y, w, h) {
        await this.finishDraw();
        // const wasActive = this.activeFramebuffer() === framebuffer;
        // if (wasActive) {
          // framebuffer.end();
          // this.flushDraw()
        // }
        // Ensure all pending GPU work is complete before reading pixels
        // await this.queue.onSubmittedWorkDone();

        const width = w * framebuffer.density;
        const height = h * framebuffer.density;
        const bytesPerPixel = 4;
        const unalignedBytesPerRow = width * bytesPerPixel;
        const alignedBytesPerRow = this._alignBytesPerRow(unalignedBytesPerRow);
        const bufferSize = alignedBytesPerRow * height;

        const stagingBuffer = this._ensurePixelReadBuffer(bufferSize);

        const commandEncoder = this.device.createCommandEncoder();
        commandEncoder.copyTextureToBuffer(
          {
            texture: framebuffer.colorTexture,
            mipLevel: 0,
            origin: { x: x * framebuffer.density, y: y * framebuffer.density, z: 0 }
          },
          { buffer: stagingBuffer, bytesPerRow: alignedBytesPerRow },
          { width, height, depthOrArrayLayers: 1 }
        );

        this.device.queue.submit([commandEncoder.finish()]);

        await stagingBuffer.mapAsync(GPUMapMode.READ, 0, bufferSize);
        const mappedRange = stagingBuffer.getMappedRange(0, bufferSize);

        let pixelData;
        if (alignedBytesPerRow === unalignedBytesPerRow) {
          pixelData = new Uint8Array(mappedRange.slice(0, width * height * bytesPerPixel));
        } else {
          // Need to extract pixel data from aligned buffer
          pixelData = new Uint8Array(width * height * bytesPerPixel);
          const mappedData = new Uint8Array(mappedRange);
          for (let y = 0; y < height; y++) {
            const srcOffset = y * alignedBytesPerRow;
            const dstOffset = y * unalignedBytesPerRow;
            pixelData.set(mappedData.subarray(srcOffset, srcOffset + unalignedBytesPerRow), dstOffset);
          }
        }

        // WebGPU doesn't need vertical flipping unlike WebGL
        const region = new Image(width, height);
        region.imageData = region.canvas.getContext('2d').createImageData(width, height);
        region.imageData.data.set(pixelData);
        region.pixels = region.imageData.data;
        region.updatePixels();

        if (framebuffer.density !== 1) {
          region.pixelDensity(framebuffer.density);
        }

        stagingBuffer.unmap();
        // if (wasActive) framebuffer.begin();
        return region;
      }

      updateFramebufferPixels(framebuffer) {
        const width = framebuffer.width * framebuffer.density;
        const height = framebuffer.height * framebuffer.density;
        const bytesPerPixel = 4;

        const expectedLength = width * height * bytesPerPixel;
        if (!framebuffer.pixels || framebuffer.pixels.length !== expectedLength) {
          throw new Error(
            'The pixels array has not been set correctly. Please call loadPixels() before updatePixels().'
          );
        }

        this.device.queue.writeTexture(
          { texture: framebuffer.colorTexture },
          framebuffer.pixels,
          {
            bytesPerRow: width * bytesPerPixel,
            rowsPerImage: height
          },
          { width, height, depthOrArrayLayers: 1 }
        );
      }

      //////////////////////////////////////////////
      // Main canvas pixel methods
      //////////////////////////////////////////////

      _convertBGRtoRGB(pixelData) {
        // Convert BGR to RGB by swapping red and blue channels
        for (let i = 0; i < pixelData.length; i += 4) {
          const temp = pixelData[i];     // Store red
          pixelData[i] = pixelData[i + 2]; // Red = Blue
          pixelData[i + 2] = temp;         // Blue = Red
          // Green (i + 1) and Alpha (i + 3) stay the same
        }
        return pixelData;
      }

      async loadPixels() {
        await this.mainFramebuffer.loadPixels();
        this.pixels = this.mainFramebuffer.pixels.slice();
      }

      async get(x, y, w, h) {
        return this.mainFramebuffer.get(x, y, w, h);
      }

      getNoiseShaderSnippet() {
        return noiseWGSL;
      }


      baseFilterShader() {
        if (!this._baseFilterShader) {
          this._baseFilterShader = new Shader(
            this,
            baseFilterVertexShader,
            baseFilterFragmentShader,
            {
              vertex: {},
              fragment: {
                "vec4<f32> getColor": `(inputs: FilterInputs, tex: texture_2d<f32>, tex_sampler: sampler) -> vec4<f32> {
                return textureSample(tex, tex_sampler, inputs.texCoord);
              }`,
              },
            }
          );
        }
        return this._baseFilterShader;
      }

      /*
       * WebGPU-specific implementation of imageLight shader creation
       */
      _createImageLightShader(type) {
        if (type === 'diffused') {
          return this._pInst.createShader(
            imageLightVertexShader,
            imageLightDiffusedFragmentShader
          );
        } else if (type === 'specular') {
          return this._pInst.createShader(
            imageLightVertexShader,
            imageLightSpecularFragmentShader
          );
        }
        throw new Error(`Unknown imageLight shader type: ${type}`);
      }

      /*
       * WebGPU-specific implementation of mipmap texture creation
       */
      _createMipmapTexture(levels) {
        return new MipmapTexture(this, levels, {});
      }

      /*
       * Prepare WebGPU texture to accumulate mip levels directly
       */
      _prepareMipmapData(size, mipLevels) {
        // Create WebGPU texture with mipmaps upfront
        const textureDescriptor = {
          size: {
            width: size,
            height: size,
            depthOrArrayLayers: 1,
          },
          mipLevelCount: mipLevels,
          format: 'rgba8unorm',
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        };

        const gpuTexture = this.device.createTexture(textureDescriptor);

        return {
          gpuTexture,
          size,
          mipLevels,
          format: 'rgba8unorm'
        };
      }

      /*
       * Copy framebuffer content directly to WebGPU texture mip level
       */
      _accumulateMipLevel(framebuffer, mipmapData, mipLevel, width, height) {
        // Copy from framebuffer texture to the mip level
        const commandEncoder = this.device.createCommandEncoder();

        // Get the underlying WebGPU texture from the framebuffer
        const sourceTexture = framebuffer.color.rawTexture().texture;

        commandEncoder.copyTextureToTexture(
          {
            texture: sourceTexture,
            origin: { x: 0, y: 0, z: 0 },
          },
          {
            texture: mipmapData.gpuTexture,
            mipLevel: mipLevel,
            origin: { x: 0, y: 0, z: 0 },
          },
          {
            width: width,
            height: height,
            depthOrArrayLayers: 1,
          }
        );

        this.device.queue.submit([commandEncoder.finish()]);
      }

      /*
       * Create final MipmapTexture from WebGPU texture
       */
      _finalizeMipmapTexture(mipmapData) {
        // Create a MipmapTexture that wraps the pre-built WebGPU texture
        return new MipmapTexture(this, mipmapData, {});
      }

      createMipmapTextureHandle({ gpuTexture, format, dataType, width, height }) {
        // WebGPU always uses pre-built GPU textures for mipmaps
        return {
          texture: gpuTexture,
          view: gpuTexture.createView(),
          glFormat: format || 'rgba8unorm',
          glDataType: dataType || 'uint8'
        };
      }
    }

    p5.RendererWebGPU = RendererWebGPU;

    p5.renderers[WEBGPU] = p5.RendererWebGPU;

    // TODO: move this and the duplicate in the WebGL renderer to another file
    fn.setAttributes = async function (key, value) {
      return this._renderer._setAttributes(key, value);
    };
  }

  if (typeof p5 !== "undefined") {
    rendererWebGPU(p5, p5.prototype);
  }

  function index(p5){
    p5.registerAddon(rendererWebGPU);
  }

  return index;

})();
