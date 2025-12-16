(function () {
  'use strict';

  // Common constants shared between toko-library and toko-wrapper

  /**
   * Library version
   * @readonly
   * @enum {string}
   */
  const VERSION = '1.0.1';

  /**
   * Library variant constants
   * @readonly
   * @enum {string}
   */
  const LIBRARY_P5V1 = 'p5v1';
  const LIBRARY_P5V2 = 'p5v2';
  const LIBRARY_Q5 = 'q5';
  const LIBRARY_UNKNOWN = 'unknown';

  /**
   * Easing type constants
   * @readonly
   * @enum {string}
   */
  const EASE_LINEAR = 'Linear';
  const EASE_SMOOTH = 'InOutSmoother';
  const EASE_QUAD = 'Quad';
  const EASE_CUBIC = 'Cubic';
  const EASE_QUART = 'Quart';
  const EASE_QUINT = 'Quint';
  const EASE_EXPO = 'Expo';
  const EASE_CIRC = 'Circ';
  const EASE_ELASTIC = 'Elastic';
  const EASE_BOUNCE = 'Bounce';
  const EASE_BACK = 'Back';

  /**
   * Easing direction constants
   * @readonly
   * @enum {string}
   */
  const EASE_IN = 'In';
  const EASE_OUT = 'Out';
  const EASE_IN_OUT = 'InOut';

  // Wrapper-specific constants

  const LIBRARY_NAME = 'TokoWrapper';

  //
  //  Set of standard sizes for the canvas and exports
  //
  const SIZE_DEFAULT = {
    name: 'default',
    width: 800,
    height: 800,
    pixelDensity: 2,
  };

  const SIZE_INSTAGRAM_PORTRAIT = {
    name: 'insta_portrait',
    width: 1080,
    height: 1350,
    pixelDensity: 2,
  };

  const SIZE_FULL = {
    name: 'full_window',
    width: 100,
    height: 100,
    pixelDensity: 2,
    fullWindow: true,
  };

  const SIZE_SQUARE_XL = {
    name: 'square_XL',
    width: 1600,
    height: 1600,
    pixelDensity: 2,
  };

  const SIZE_1080P = {
    name: '1080p',
    width: 1920,
    height: 1080,
    pixelDensity: 2,
  };

  const SIZE_1080P_PORTRAIT = {
    name: '1080p_portrait',
    width: 1080,
    height: 1920,
    pixelDensity: 2,
  };

  const SIZE_4K = {
    name: '4K',
    width: 3840,
    height: 2160,
    pixelDensity: 2,
  };

  const SIZE_4K_PORTRAIT = {
    name: '4K_portrait',
    width: 2160,
    height: 3840,
    pixelDensity: 2,
  };

  const SIZE_IPHONE_11_WALLPAPER = {
    name: 'iphone_11',
    width: 1436,
    height: 3113,
    pixelDensity: 1,
  };

  const SIZE_WIDE_SCREEN = {
    name: 'wide_screen',
    width: 2560,
    height: 1440,
    pixelDensity: 1,
  };

  const SIZE_MACBOOK_14_WALLPAPER = {
    name: 'macbook_14',
    width: 3024,
    height: 1964,
    pixelDensity: 1,
  };

  const SIZE_MACBOOK_16_WALLPAPER = {
    name: 'macbook_16',
    width: 3072,
    height: 1920,
    pixelDensity: 1,
  };

  //
  //  List used for the dropdown in the advanced tab
  //
  let SIZES_LIST = {
    default: 'default',
    square_HD: 'square_XL',
    insta_portrait: 'insta_portrait',
    iphone_11: 'iphone_11',
    HD_1080p: '1080p',
    HD_1080p_Portrait: '1080p_portrait',
    wide_screen: 'wide_screen',
    UHD_4K: '4K',
    UHD_4K_Portrait: '4K_portrait',
    macbook_14: 'macbook_14',
    macbook_16: 'macbook_16',
    full_window: 'full_window',
  };

  const SIZES = [
    SIZE_DEFAULT,
    SIZE_FULL,
    SIZE_INSTAGRAM_PORTRAIT,
    SIZE_SQUARE_XL,
    SIZE_1080P,
    SIZE_1080P_PORTRAIT,
    SIZE_4K,
    SIZE_4K_PORTRAIT,
    SIZE_IPHONE_11_WALLPAPER,
    SIZE_WIDE_SCREEN,
    SIZE_MACBOOK_14_WALLPAPER,
    SIZE_MACBOOK_16_WALLPAPER,
  ];

  //
  //  Panel tab
  //
  const TABS_PARAMETERS = 'Parameters';
  const TABS_ADVANCED = 'Size';
  const TABS_CAPTURE = 'Capture';

  const TAB_ID_PARAMETERS = 0;
  const TAB_ID_ADVANCED = 1;

  //
  //  Render modes
  //
  const RENDER_MODES = {
    P2D: 'p2d',
    WEBGL: 'webgl',
    SVG: 'svg',
    WEBGPU: 'webgpu',
  };

  //
  //  Options for capture
  //
  const CAPTURE_FORMATS = {
    WebM: 'webm',
    MP4: 'mp4',
    PNG: 'png',
    JPG: 'jpg',
    GIF: 'gif',
    WebP: 'webp',
  };

  const CAPTURE_FRAMERATES = {
    15: 15,
    24: 24,
    25: 25,
    30: 30,
    60: 60,
  };

  const DEFAULT_CAPTURE_DURATION = 100; // number of frames captured when undefined but recording for fixed number of frames

  const SAVE_SKETCH_BUTTON_LABEL = '💾 Save sketch';
  const SAVE_SKETCH_AND_SETTINGS_BUTTON_LABEL = '💾 Save sketch & settings';
  const RECORD_BUTTON_LABEL = '🔴 Record';
  const REFRESH_RECORD_BUTTON_LABEL = '🔴 Refresh & record';
  const RECORD_BUTTON_LABEL_FRAMES = 'frames';
  const RECORD_BUTTON_LABEL_SETTINGS = ' & settings';

  /**
   * Logging level constants and utilities
   *
   * Provides standard logging levels with numeric hierarchy for comparison.
   * Levels are ordered from most critical (error) to least critical (debug).
   */

  // Log level constants with numeric values for comparison
  const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  };

  // Numeric hierarchy for level comparison (higher number = more verbose)
  const LOG_LEVEL_VALUES = {
    [LOG_LEVELS.ERROR]: 0,
    [LOG_LEVELS.WARN]: 1,
    [LOG_LEVELS.INFO]: 2,
    [LOG_LEVELS.DEBUG]: 3,
  };

  /**
   * Check if a log level should be output based on current configuration
   * @param {string} level - The log level to check
   * @param {boolean} loggingEnabled - Master logging switch
   * @param {string} currentLogLevel - Current minimum log level setting
   * @returns {boolean} True if the level should be logged
   */
  function shouldLog (level, loggingEnabled, currentLogLevel) {
    if (!loggingEnabled) {
      return false;
    }

    const levelValue = LOG_LEVEL_VALUES[level];
    const currentValue = LOG_LEVEL_VALUES[currentLogLevel];

    return levelValue !== undefined && currentValue !== undefined && levelValue <= currentValue;
  }

  //
  //	Default options for setup
  //
  const DEFAULT_OPTIONS = {
    sketchElementId: 'sketch-canvas',
    renderMode: 'P2D',
    title: 'untitled sketch',
    addInfoToTitle: false,
    showSaveSketchButton: false,
    saveSettingsWithSketch: false,
    acceptDroppedSettings: false,
    acceptDroppedFiles: false,
    useParameterPanel: true,
    hideParameterPanelOnStart: false,
    showCanvasSizeOptions: false,
    additionalCanvasSizes: [],
    captureFrames: false,
    canvasSize: SIZE_DEFAULT,
    seedString: '',
    debounceDelay: 100,
    loggingEnabled: true,
    logLevel: LOG_LEVELS.INFO,
    showCaptureOptions: false,
    showFPS: false,
    shiftCanvasForWebGL: true,
  };

  const DEFAULT_CAPTURE_OPTIONS = {
    format: 'png',
    framerate: 30,
    bitrate: 5000,
    quality: 0.95,
    width: null,
    height: null,
    duration: 100,
    autoSaveDuration: null,
    fixedDuration: false,
    refreshBeforeCapture: true,
    recordButtonOnMainTab: true,
  };

  /**
   * Detects the variant of the p5 library being used in the current environment.
   * This is shared between toko-library and toko-wrapper to eliminate duplication.
   *
   * @returns {string} Returns one of the constants: LIBRARY_P5V1, LIBRARY_P5V2, LIBRARY_Q5, or LIBRARY_UNKNOWN
   * @example
   * const variant = detectP5Variant();
   * if (variant === LIBRARY_Q5) {
   *   // Q5-specific code
   * }
   */
  function detectP5Variant () {
    // q5.js check - check both global Q5 and window.Q5
    if (typeof Q5 !== 'undefined' || (typeof window !== 'undefined' && typeof window.Q5 !== 'undefined')) {
      return LIBRARY_Q5;
    }

    // p5.js checks - check both global p5 and window.p5
    if (typeof p5 !== 'undefined' || (typeof window !== 'undefined' && typeof window.p5 !== 'undefined')) {
      const p5Instance = typeof p5 !== 'undefined' ? p5 : window.p5;

      // Quick v2 detection
      if (typeof p5Instance.VERSION === 'string' && p5Instance.VERSION.startsWith('2.')) {
        return LIBRARY_P5V2;
      }
      if (p5Instance && typeof p5Instance.Graphics2D !== 'undefined') {
        return LIBRARY_P5V2; // Beta version of p5.js with Graphics2D feature
      }
      return LIBRARY_P5V1;
    }

    return LIBRARY_UNKNOWN;
  }

  /**
   * Shared logging utility for Toko
   *
   * Provides level-based logging functions that work across toko-library and toko-wrapper.
   * Supports standard log levels: error, warn, info, debug with configurable filtering.
   */

  /**
   * Get the current library state for logging configuration
   * This function will be overridden by each library to provide their specific state
   * @returns {Object} Library state with options.loggingEnabled and options.logLevel
   */
  let getLibraryState = () => ({ options: { loggingEnabled: true, logLevel: LOG_LEVELS.INFO } });

  /**
   * Set the library state getter function
   * @param {Function} stateGetter - Function that returns the current library state
   * @returns {void}
   * @example
   * setLibraryStateGetter(() => libraryState);
   */
  function setLibraryStateGetter (stateGetter) {
    getLibraryState = stateGetter;
  }

  /**
   * Log an error message
   * @param {string} message - The error message to log
   * @returns {void}
   * @example
   * logError('Failed to initialize canvas');
   */
  function logError (message) {
    const state = getLibraryState();
    const loggingEnabled = state?.options?.loggingEnabled ?? true;
    const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
    if (shouldLog(LOG_LEVELS.ERROR, loggingEnabled, logLevel)) {
      console.error(message);
    }
  }

  /**
   * Log a warning message
   * @param {string} message - The warning message to log
   * @returns {void}
   * @example
   * logWarn('Canvas size exceeds recommended limits');
   */
  function logWarn (message) {
    const state = getLibraryState();
    const loggingEnabled = state?.options?.loggingEnabled ?? true;
    const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
    if (shouldLog(LOG_LEVELS.WARN, loggingEnabled, logLevel)) {
      console.warn(message);
    }
  }

  /**
   * Log an info message
   * @param {string} message - The info message to log
   * @returns {void}
   * @example
   * logInfo('Library initialized successfully');
   */
  function logInfo (message) {
    const state = getLibraryState();
    const loggingEnabled = state?.options?.loggingEnabled ?? true;
    const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
    if (shouldLog(LOG_LEVELS.INFO, loggingEnabled, logLevel)) {
      console.log(message);
    }
  }

  /**
   * Log a debug message
   * @param {string} message - The debug message to log
   * @returns {void}
   * @example
   * logDebug('Processing frame 42');
   */
  function logDebug (message) {
    const state = getLibraryState();
    const loggingEnabled = state?.options?.loggingEnabled ?? true;
    const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
    if (shouldLog(LOG_LEVELS.DEBUG, loggingEnabled, logLevel)) {
      console.log(message);
    }
  }

  /**
   * Base adapter class that provides common functionality for all p5.js variants
   * This eliminates code duplication between toko-library and toko-wrapper
   */

  /**
   * Base adapter class with common functionality
   */
  class BaseAdapter {
    constructor (libraryState, lifecycleHandlers, registrationFunctions = null) {
      this.libraryState = libraryState;
      this.lifecycleHandlers = lifecycleHandlers;
      this.registrationFunctions = registrationFunctions;
      this.variant = detectP5Variant();
    }

    /**
     * Initialize the adapter for the detected p5.js variant
     * @param {Object} [p5v2Params] - Optional parameters for p5v2 initialization
     * @param {Object} [p5v2Params.p5] - p5 instance for v2
     * @param {Object} [p5v2Params.fn] - p5 function for v2
     * @param {Object} [p5v2Params.lifecycles] - lifecycles object for v2
     */
    initialize (p5v2Params = null) {
      this.libraryState.variant = this.variant;

      switch (this.variant) {
        case LIBRARY_P5V1:
          return this.initializeP5v1();
        case LIBRARY_P5V2:
          return this.initializeP5v2(p5v2Params);
        case LIBRARY_Q5:
          return this.initializeQ5();
        default:
          logWarn(`Unsupported p5.js variant: ${this.variant}`);
          return false;
      }
    }

    /**
     * Initialize for p5.js v1
     */
    initializeP5v1 () {
      // Set the prototype reference
      this.libraryState.x5 = p5.prototype;

      // Register library functions and classes if provided
      if (this.registrationFunctions) {
        this.registrationFunctions.registerLibraryFunctions();
        this.registrationFunctions.registerLibraryClasses();
      }

      // Register lifecycle hooks using v1 syntax
      p5.prototype.registerMethod('init', this.lifecycleHandlers.initHook);
      p5.prototype.registerMethod('beforeSetup', this.lifecycleHandlers.preSetupHook);
      p5.prototype.registerMethod('afterSetup', this.lifecycleHandlers.postSetupHook);
      p5.prototype.registerMethod('pre', this.lifecycleHandlers.preDrawHook);
      p5.prototype.registerMethod('post', this.lifecycleHandlers.postDrawHook);
      p5.prototype.registerMethod('remove', this.lifecycleHandlers.removeHook);

      return true;
    }

    /**
     * Initialize for p5.js v2
     * @param {Object} [params] - Parameters for p5v2 initialization
     * @param {Object} [params.p5] - p5 instance for v2
     * @param {Object} [params.fn] - p5 function for v2
     * @param {Object} [params.lifecycles] - lifecycles object for v2
     */
    initializeP5v2 (params = null) {
      logDebug('shared-adapter - initializeP5v2');

      // If no parameters provided, return the adapter function for later use
      if (!params) {
        return (p5, fn, lifecycles) => {
          return this.initializeP5v2({ p5, fn, lifecycles });
        };
      }

      const { p5, fn, lifecycles } = params;

      // Set the prototype reference
      this.libraryState.p5 = p5;
      this.libraryState.x5 = fn;

      // Register library functions and classes if provided
      if (this.registrationFunctions) {
        this.registrationFunctions.registerLibraryFunctions();
        this.registrationFunctions.registerLibraryClasses();
      }

      // Register lifecycle hooks
      lifecycles.presetup = this.lifecycleHandlers.preSetupHook;
      lifecycles.postsetup = this.lifecycleHandlers.postSetupHook;
      lifecycles.predraw = this.lifecycleHandlers.preDrawHook;
      lifecycles.postdraw = this.lifecycleHandlers.postDrawHook;
      lifecycles.remove = this.lifecycleHandlers.removeHook;

      return true;
    }

    /**
     * Initialize for Q5
     */
    initializeQ5 () {
      // Set the prototype reference
      this.libraryState.x5 = Q5.prototype;

      // Register library functions and classes if provided
      if (this.registrationFunctions) {
        this.registrationFunctions.registerLibraryFunctions();
        this.registrationFunctions.registerLibraryClasses();
      }

      // Create wrapper functions for Q5's calling convention
      // Q5 calls hooks with hook.call($, q) where $ is the Q5 instance and q is the proxied version
      const wrapHandler = handler => {
        return function (q5Instance) {
          // Ensure libraryState.x5 is set to the current Q5 instance for handlers that need it
          this.libraryState.x5 = q5Instance.constructor.prototype;
          // Call the original handler without parameters to keep it framework-agnostic
          return handler.call(this);
        }.bind(this);
      };

      // Register lifecycle hooks with wrappers
      Q5.addHook('init', wrapHandler(this.lifecycleHandlers.initHook));
      Q5.addHook('presetup', wrapHandler(this.lifecycleHandlers.preSetupHook));
      Q5.addHook('postsetup', wrapHandler(this.lifecycleHandlers.postSetupHook));
      Q5.addHook('predraw', wrapHandler(this.lifecycleHandlers.preDrawHook));
      Q5.addHook('postdraw', wrapHandler(this.lifecycleHandlers.postDrawHook));
      Q5.addHook('remove', wrapHandler(this.lifecycleHandlers.removeHook));

      return true;
    }

    /**
     * Get the detected variant
     */
    getVariant () {
      return this.variant;
    }
  }

  let libraryState = {
    initialized: false,
    variant: LIBRARY_UNKNOWN,
    x5: null,
    options: null,
    p5Canvas: null,
    tweakpane: null,
    initialRefreshCallDone: false,
    paletteSelectorData: {},
    // globalFunctionsRegistered: false,
    // prototypeFunctionsRegistered: false,
  };

  // Set up the library state getter for the shared logging system
  setLibraryStateGetter(() => libraryState);

  /**
   * Canvas management for TokoWrapper
   *
   * Handles canvas setup, sizing, and resize events for the sketch canvas.
   * Manages canvas dimensions, pixel density, and responsive behavior.
   *
   * @namespace Canvas
   */

  /**
   * Set up the canvas with initial configuration
   * Sets canvas size, document title, and window resize listener
   */
  function setUpCanvas () {
    //
    //  set the canvas base on provided options
    //
    setCanvasSize(libraryState.options.canvasSize);
    //
    // set the label and document title
    //
    let sketchTitle = libraryState.options.title;
    if (libraryState.options.addInfoToTitle) {
      sketchTitle += ' - ' + libraryState.variant + ' - ' + libraryState.options.renderMode;
    }

    document.getElementById('sketch-title').innerText = sketchTitle;
    document.title = sketchTitle;
    //
    //  listen to resizes
    //
    window.addEventListener('resize', windowResized);
  }

  /**
   * Set the canvas size based on the provided size configuration
   * Handles both fixed and full-window sizing with proper scaling
   * @param {Object} inSize - Size configuration object with width, height, and other properties
   */
  function setCanvasSize (inSize) {
    const MARGIN = 80;
    const DISPLAY_FACTOR = inSize.pixelDensity / 2;
    let zoomFactor = 1;
    let newWidthString = '',
      newHeightString = '';

    if (typeof window.innerWidth === 'undefined' || typeof window.innerHeight === 'undefined') {
      logError('window.innerWidth or window.innerHeight is not defined');
      return;
    }

    if (!inSize.fullWindow) {
      zoomFactor = Math.min(1, ((window.innerWidth - MARGIN) / inSize.width) * DISPLAY_FACTOR);
      zoomFactor = Math.min(zoomFactor, ((window.innerHeight - MARGIN) / inSize.height) * DISPLAY_FACTOR);

      newWidthString = Math.floor((inSize.width * zoomFactor) / DISPLAY_FACTOR) + 'px';
      newHeightString = Math.floor((inSize.height * zoomFactor) / DISPLAY_FACTOR) + 'px';
    } else {
      inSize.width = window.innerWidth;
      inSize.height = window.innerHeight;

      newWidthString = '100vw';
      newHeightString = '100vh';
    }

    resizeCanvas(inSize.width * DISPLAY_FACTOR, inSize.height * DISPLAY_FACTOR, true);

    libraryState.p5Canvas.canvas.style.width = newWidthString;
    libraryState.p5Canvas.canvas.style.height = newHeightString;
  }

  /**
   * Handle window resize events
   * Checks if the sketch element dimensions have changed and triggers canvas resize if needed
   */
  function windowResized () {
    let sketchElementId = libraryState.options.sketchElementId;

    let newWidth = document.getElementById(sketchElementId).offsetWidth;
    let newHeight = document.getElementById(sketchElementId).offsetHeight;

    if (newWidth != width || newHeight != height) {
      canvasResized();
    }
  }

  /**
   * Handle canvas resize events
   * Called when the canvas dimensions need to be updated
   * @todo Determine how to best call the appropriate resize function
   */
  function canvasResized () {
    // TO DO - determine how to best call the right function
    logInfo('TokoWrapper - canvasResized');
  }

  /**
   * Recenter the canvas origin to the top left corner.
   * Used because WebGL and WebGPU have a different origin than P2D and SVG.
   * Called in the preDrawHook in the wrapper.
   *
   * @example
   * // Recenter the canvas
   * recenterCanvas();
   */
  function recenterCanvas () {
    translate(-width / 2, -height / 2);
  }

  /**
   * Convert Tweakpane state object into a compact preset object
   * @param {Object} stateObject - Tweakpane state object to convert
   * @returns {Object} Compact preset object with key-value pairs
   * @example
   * // Convert state to preset
   * const preset = _stateToPreset(tweakpaneState);
   */

  //
  function _stateToPreset (stateObject) {
    let presetObject = {};

    function traverse (obj) {
      for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
          // check if the current property is 'binding' and an object
          if (key === 'binding' && typeof obj[key] === 'object') {
            // if it is, extract the key value combination and add it to the presets
            let o = {};
            o[obj[key].key] = obj[key].value;
            presetObject = { ...presetObject, ...o };
          } else if (typeof obj[key] === 'object') {
            // if it is not binding but is and object, dig deeper
            traverse(obj[key]);
          }
        }
      }
    }

    // start traversing the state object
    traverse(stateObject);

    return presetObject;
  }

  /**
   * Convert compact preset object into Tweakpane state object
   * @param {Object} presetObject - Compact preset object to convert
   * @returns {Object} Tweakpane state object
   * @example
   * // Convert preset to state
   * const state = _presetToState(presetObject);
   */
  //
  //  use the compact preset to create a new Tweakpane state
  //
  function _presetToState (presetObject) {
    let stateObject = libraryState.tweakpane.base.exportState();

    function traverse (obj) {
      for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
          // check if the current property is 'binding' and an object
          if (key === 'binding' && typeof obj[key] === 'object') {
            // update the 'binding' object with values from newPreset
            if (Object.hasOwn(presetObject, obj[key].key)) {
              obj[key].value = presetObject[obj[key].key];
            }
          } else if (typeof obj[key] === 'object') {
            // if the property is an object, recursively traverse it
            traverse(obj[key]);
          }
        }
      }
    }

    // start traversing the current state to add the preset values
    traverse(stateObject);

    return stateObject;
  }

  /**
   * Add navigation buttons (previous, next, random) to a Tweakpane panel
   * @param {Object} paneRef - Reference to the Tweakpane panel
   * @param {Object} pObject - Parameter object containing palette and collection keys
   * @param {string} paletteKey - Key for the palette in pObject
   * @param {string} collectionKey - Key for the collection in pObject
   * @param {boolean} [justPrimary=false] - Whether to show only primary palettes
   * @param {boolean} [sorted=false] - Whether to sort the palette list
   * @param {number} [index=-1] - Index for the button grid
   * @example
   * // Add navigation buttons
   * addPaneNavButtons(pane, params, 'palette', 'collection', true, true);
   */
  function addPaneNavButtons (
    paneRef,
    pObject,
    paletteKey,
    collectionKey,
    justPrimary = false,
    sorted = false,
    index = -1,
  ) {
    let o = {
      view: 'buttongrid',
      size: [3, 1],
      cells: (x, y) => ({
        title: [['← prev', 'next →', 'rnd']][y][x],
      }),
      label: ' ',
    };

    if (index != -1) {
      o.index = index;
    }

    paneRef.addBlade(o).on('click', ev => {
      let paletteList = libraryState.toko.getPaletteSelection(pObject[collectionKey], justPrimary, sorted);
      switch (ev.index[0]) {
        case 0:
          pObject[paletteKey] = findPreviousInList(pObject[paletteKey], paletteList);
          break;
        case 1:
          pObject[paletteKey] = findNextInList(pObject[paletteKey], paletteList);
          break;
        case 2:
          pObject[paletteKey] = findRandomInList(pObject[paletteKey], paletteList);
          break;

        default:
          logWarn('a non-existing button was pressed:', ev.index[0]);
          break;
      }
      libraryState.tweakpane.base.refresh();
    });
  }

  /**
   * Find the next item in a Tweakpane-formatted list
   * @param {string} item - Current item to find next for
   * @param {Object} list - Tweakpane-formatted list object
   * @returns {string} Next item in the list (wraps to beginning if at end)
   * @example
   * // Find next item
   * const next = findNextInList('current', tweakpaneList);
   */
  function findNextInList (item, list) {
    let keys = Object.keys(list);
    let i = keys.indexOf(item);
    let n;
    if (i < keys.length - 1) {
      n = i + 1;
    } else {
      n = 0;
    }
    let newItem = keys[n];
    return list[newItem];
  }

  /**
   * Find the previous item in a Tweakpane-formatted list
   * @param {string} item - Current item to find previous for
   * @param {Object} list - Tweakpane-formatted list object
   * @returns {string} Previous item in the list (wraps to end if at beginning)
   * @example
   * // Find previous item
   * const prev = findPreviousInList('current', tweakpaneList);
   */
  function findPreviousInList (item, list) {
    let keys = Object.keys(list);
    let i = keys.indexOf(item);
    let n;
    if (i > 0) {
      n = i - 1;
    } else {
      n = keys.length - 1;
    }
    let newItem = keys[n];
    return list[newItem];
  }

  /**
   * Select a random item from a Tweakpane-formatted list (excluding current item)
   * @param {string} item - Current item to exclude from random selection
   * @param {Object} list - Tweakpane-formatted list object
   * @returns {string} Random item from the list (different from current item)
   * @example
   * // Find random item
   * const random = findRandomInList('current', tweakpaneList);
   */
  function findRandomInList (item, list) {
    let keys = Object.keys(list);
    let newItem;
    do {
      newItem = keys[Math.floor(Math.random() * keys.length)];
    } while (newItem == item);
    return list[newItem];
  }

  /**
   * Sketch saving functionality for TokoWrapper
   *
   * Provides functions to save sketches as images (PNG) or SVG files,
   * and to save sketch settings as JSON files.
   *
   * @namespace SaveSketch
   */

  /**
   * Save the current sketch as an image file
   * Automatically detects whether the sketch is canvas or SVG and saves accordingly
   * @returns {string|undefined} The filename of the saved file, or undefined if save failed
   */
  function saveSketch () {
    //
    // detect if the sketch is in canvas or svg
    //
    let isCanvas = null;
    let isSVG = null;

    let sketchElement = document.getElementById(libraryState.options.sketchElementId).firstChild;
    isCanvas = sketchElement instanceof HTMLCanvasElement;
    if (sketchElement.firstChild != null) {
      isSVG = sketchElement.firstChild.nodeName == 'svg';
    }

    if (isCanvas) {
      //
      //  save canvas as png
      //
      let filename = libraryState.toko.generateFilename('png');
      saveCanvas(filename, 'png');
      return filename;
    } else if (isSVG) {
      //
      // add attributes to ensure proper preview of the SVG file in the Finder
      //
      let svgTemp = document.getElementById('sketch-canvas').firstChild.firstChild.firstChild;
      svgTemp.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svgTemp.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      let filename = libraryState.toko.generateFilename('svg');
      let svgString = document.getElementById(libraryState.options.sketchElementId).firstChild.innerHTML;

      let blob = new Blob([svgString], { type: 'image/svg+xml' });
      let url = window.URL.createObjectURL(blob);

      //
      // create a hidden url with the image and click it
      //
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      return filename;
    } else {
      logWarn('Toko - saveSketch: unknown type');
      return;
    }
  }

  /**
   * Save both the sketch image and its settings
   * @returns {string|undefined} The base filename (without extension) of the saved files
   */
  function saveSketchAndSettings () {
    let filename = saveSketch();
    //
    //  strip the extension of the filename so we can reuse it.
    //
    filename = filename.split('.').slice(0, -1).join('.');
    saveSettings(filename);
  }

  /**
   * Save the current sketch settings from Tweakpane as a JSON file
   * @param {string} [filename='default'] - Base filename for the settings file
   */
  function saveSettings (filename = 'default') {
    // determine the filename
    if (typeof filename === 'undefined' || filename === 'default') {
      filename = libraryState.toko.generateFilename('json');
    }

    // add extension if needed
    if (!filename.endsWith('.json')) {
      filename += '.json';
    }

    // gather the current Tweakpane state
    const state = libraryState.tweakpane.base.exportState();
    const settings = _stateToPreset(state);

    // save with p5.js native saver
    saveJSON(settings, filename);
  }

  //
  //  set up general capturing options
  //
  function setUpCapture () {
    libraryState.currentlyCapturing = false;

    P5Capture.setDefaultOptions(libraryState.options.captureOptions);
    hideP5CaptureControls();
  }

  function hideP5CaptureControls () {
    document.querySelector('.p5c-container').style.display = 'none';
  }

  //
  //  called when the capture is started
  //
  function initCapture () {
    libraryState.capturer = P5Capture.getInstance();

    //  just in case the duration was not set properly
    if (libraryState.options.captureOptions.fixedDuration) {
      if (
        libraryState.options.captureOptions.duration === null ||
        libraryState.options.captureOptions.duration === undefined
      ) {
        libraryState.options.captureOptions.duration = DEFAULT_CAPTURE_DURATION;
      }
    }

    //  refresh the sketch before capture
    if (libraryState.options.captureOptions.refreshBeforeCapture) {
      refresh();
    }
  }

  function updateCaptureDuration (e) {
    libraryState.options.captureOptions.duration = e.value;
    updateRecordButtonLabel();
  }

  function updateCaptureFormat (e) {
    libraryState.options.captureOptions.format = e.value;
  }

  function updateCaptureFrameRate (e) {
    libraryState.options.captureOptions.framerate = e.value;
  }

  function updateCaptureRefreshBefore (e) {
    libraryState.options.captureOptions.refreshBeforeCapture = e.value;
    updateRecordButtonLabel(libraryState.options.captureOptions.refreshBeforeCapture);
  }

  function updateRecordButtonLabel () {
    let buttonLabel;

    if (libraryState.options.captureOptions.refreshBeforeCapture) {
      buttonLabel = REFRESH_RECORD_BUTTON_LABEL;
    } else {
      buttonLabel = RECORD_BUTTON_LABEL;
    }

    if (libraryState.options.captureOptions.fixedDuration) {
      buttonLabel += ` ${libraryState.options.captureOptions.duration} ${RECORD_BUTTON_LABEL_FRAMES}`;
    }

    if (libraryState.options.saveSettingsWithSketch) {
      buttonLabel += RECORD_BUTTON_LABEL_SETTINGS;
    }

    libraryState.options.captureOptions.startCaptureButton.title = buttonLabel;
  }

  function updateCaptureFixedDuration (e) {
    libraryState.options.captureOptions.fixedDuration = e.value;
    if (libraryState.options.captureOptions.fixedDuration) {
      libraryState.options.captureOptions.captureDurationControl.hidden = false;
      // Use current duration if previousDuration is undefined
      if (libraryState.options.captureOptions.previousDuration !== undefined) {
        libraryState.options.captureOptions.duration = libraryState.options.captureOptions.previousDuration;
      }
    } else {
      libraryState.options.captureOptions.captureDurationControl.hidden = true;
      libraryState.options.captureOptions.previousDuration = libraryState.options.captureOptions.duration;
      libraryState.options.captureOptions.duration = null;
    }
    updateRecordButtonLabel();
  }

  function clickStartCapture () {
    libraryState.options.captureOptions.stopCaptureButton.hidden = false;
    libraryState.options.captureOptions.startCaptureButton.hidden = true;
    startCapture();
  }

  function clickStopCapture () {
    stopCapture();
  }

  function startCapture () {
    if (!libraryState.currentlyCapturing && libraryState.options.showCaptureOptions) {
      initCapture();
      libraryState.currentlyCapturing = true;
      libraryState.capturer.start(libraryState.options.captureOptions);
    }
  }

  function stopCapture () {
    if (libraryState.currentlyCapturing && libraryState.options.showCaptureOptions) {
      libraryState.capturer.stop();
    }
  }

  //
  //  called by p5.capture just ahead of downlaoding the video
  //
  function resetCapture (videoFilename) {
    //  remove the extension from the filename (matches the last dot and all following non-slash/non-dot characters)
    let filename = typeof videoFilename === 'string' ? videoFilename.replace(/\.[^/.]+$/, '') : videoFilename;

    //  save the settings
    if (libraryState.options.saveSettingsWithSketch) {
      saveSettings(filename);
    }

    // reset the capture buttons
    libraryState.options.captureOptions.stopCaptureButton.hidden = true;
    libraryState.options.captureOptions.startCaptureButton.hidden = false;

    // reset the state
    libraryState.currentlyCapturing = false;
  }

  // eslint-disable-next-line no-unused-vars
  function getFilenameForCapture (_date) {
    let filename = libraryState.toko.generateFilename('none', 'captured');
    return filename;
  }

  /**
   * Add a color palette selector to a Tweakpane panel
   * @param {Object} paneRef - Reference to the Tweakpane panel
   * @param {Object} pObject - Parameter object containing palette and collection keys
   * @param {Object} [incomingOptions] - Options for customizing the selector
   * @param {number} [incomingOptions.index=1] - Default index for the selector
   * @param {boolean} [incomingOptions.justPrimary=true] - Whether to show only primary palettes
   * @param {boolean} [incomingOptions.sorted=true] - Whether to sort the palette list
   * @param {boolean} [incomingOptions.navButtons=true] - Whether to add navigation buttons
   * @example
   * // Add palette selector to pane
   * toko.addPaletteSelector(pane, params, {
   *   justPrimary: true,
   *   navButtons: true
   * });
   */
  function addPaletteSelector (paneRef, pObject, incomingOptions) {
    // set default options
    let o = {
      index: 1,
      justPrimary: true,
      sorted: true,
      navButtons: true,
    };

    // merge incoming with default options
    o = Object.assign({}, o, incomingOptions);

    // store references
    o.paneRef = paneRef;
    o.pObject = pObject;

    // get the data for the controls
    o.colorPalettes = libraryState.toko.getPaletteSelection(o.pObject[o.collectionKey], o.justPrimary, o.sorted);
    o.collectionsList = libraryState.toko.formatForTweakpane(o.pObject[o.collectionsList]);

    // add the collection control
    o.collectionInput = o.paneRef
      .addBinding(o.pObject, o.collectionKey, {
        index: o.index,
        options: o.collectionsList,
      })
      .on('change', () => {
        o.colorPalettes = libraryState.toko.getPaletteSelection(pObject[o.collectionKey], o.justPrimary, o.sorted);
        o.pObject[o.paletteKey] = Object.values(o.colorPalettes)[0];
        o.scaleInput.dispose();
        o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
          index: o.index,
          options: o.colorPalettes,
        });
      });

    // add the palette control
    o.scaleInput = paneRef.addBinding(o.pObject, o.paletteKey, {
      options: o.colorPalettes,
      index: o.index,
    });

    // store for when things change later
    libraryState.paletteSelectorData = o;

    // add nav buttons below the dropdowns for previous, next and random
    if (o.navButtons) {
      addPaneNavButtons(o.paneRef, o.pObject, o.paletteKey, o.collectionKey, o.justPrimary, o.sorted, o.index + 1);
    }
  }

  /**
   * Update the color palette selector with new collection and palette
   * @param {string} receivedCollection - New collection name to set
   * @param {string} receivedPalette - New palette name to set
   * @example
   * // Update palette selector
   * updatePaletteSelector('warm', 'sunset');
   */
  function updatePaletteSelector (receivedCollection, receivedPalette) {
    let o;

    // get references to the controls
    o = libraryState.paletteSelectorData;

    // get the palettes for the selected collection
    o.colorPalettes = libraryState.toko.getPaletteSelection(receivedCollection, o.justPrimary, o.sorted);

    // remove the existing palette control and one with the updated palette list
    o.scaleInput.dispose();
    o.pObject[o.paletteKey] = receivedPalette;
    o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
      index: o.index + 1,
      options: o.colorPalettes,
    });

    // call main refresh function to update everything
    if (typeof window.refresh === 'function') {
      window.refresh();
    }
  }

  /**
   * Add a blend mode selector to a Tweakpane panel
   * @param {Object} paneRef - Reference to the Tweakpane panel
   * @param {Object} pObject - Parameter object containing blend mode key
   * @param {Object} [incomingOptions] - Options for customizing the selector
   * @param {boolean} [incomingOptions.showAllModes=false] - Whether to show all blend modes
   * @example
   * // Add blend mode selector
   * toko.addBlendModeSelector(pane, params, {
   *   showAllModes: true
   * });
   */
  function addBlendModeSelector (paneRef, pObject, incomingOptions) {
    // set default options
    let o = {
      showAllModes: false, // by default don't show all the modes
    };

    // merge with default options
    o = Object.assign({}, o, incomingOptions);

    let blendModes = {
      Default: 'source-over', //p5.BLEND,
      Multiply: 'multiply', //p5.MULTIPLY,
      Screen: 'screen', //p5.SCREEN,
      Overlay: 'overlay', //p5.OVERLAY,
      Darkest: 'darken', //p5.DARKEST,
      Lightest: 'lighten', //p5.LIGHTEST,
      Difference: 'difference', //p5.DIFFERENCE,
      Exclusion: 'exclusion', //p5.EXCLUSION,
    };

    let additionalBlendModes = {
      Add: 'lighter',
      HardLight: 'hard-light',
      SoftLight: 'soft-light',
      Dodge: 'color-dodge',
      Burn: 'color-burn',
    };

    if (o.showAllModes) {
      blendModes = Object.assign({}, blendModes, additionalBlendModes);
    }

    //
    // TO DO define blendmodes as constants
    paneRef.addBinding(pObject, o.blendModeKey, {
      options: blendModes,
    });
  }

  /**
   * Add a random seed control to a Tweakpane panel
   * @param {Object} paneRef - Reference to the Tweakpane panel
   * @param {Object} pObject - Parameter object containing seed string key
   * @param {Object} [incomingOptions] - Options for customizing the control
   * @param {Object} [incomingOptions.rng] - RNG instance to use (defaults to library RNG)
   * @param {string} [incomingOptions.seedStringKey='seedString'] - Key for the seed string in pObject
   * @param {string} [incomingOptions.label='untitled'] - Label for the seed input
   * @example
   * // Add random seed control
   * toko.addRandomSeedControl(pane, params, {
   *   label: 'Seed'
   * });
   */
  function addRandomSeedControl (paneRef, pObject, incomingOptions) {
    //
    //  set default options
    //
    let o = {
      rng: null,
      seedStringKey: 'seedString',
      label: 'untitled',
    };

    o = Object.assign({}, o, incomingOptions);
    o.paneRef = paneRef;
    o.pObject = pObject;

    //
    //  ensure an rng is always available
    //
    if (!o.rng) {
      // First try to use libraryState.RNG if it exists
      if (libraryState.RNG) {
        o.rng = libraryState.RNG;
      } else if (libraryState.toko && libraryState.toko.RNG) {
        // Create a new RNG from the toko instance
        o.rng = new libraryState.toko.RNG();
        // Also store it in libraryState for future use
        libraryState.RNG = o.rng;
      }
    }

    //
    //  string input
    //
    pObject[o.seedStringKey] = o.rng.seed;
    let seedStringForm = paneRef.addBinding(pObject, o.seedStringKey, {
      label: o.label,
    });
    seedStringForm.on('change', e => {
      o.rng.seed = e.value;
    });

    const op = {
      view: 'buttongrid',
      size: [3, 1],
      cells: (x, y) => ({ title: [['← prev', 'next →', 'rnd']][y][x] }),
      label: ' ',
    };

    paneRef.addBlade(op).on('click', ev => {
      switch (ev.index[0]) {
        case 0:
          pObject[o.seedStringKey] = o.rng.previousSeed();
          break;
        case 1:
          pObject[o.seedStringKey] = o.rng.nextSeed();
          break;
        case 2:
          pObject[o.seedStringKey] = o.rng.randomSeed();
          break;
        default:
          logWarn('a non-existing button was pressed:', ev.index[0]);
          break;
      }

      libraryState.tweakpane.base.refresh();
    });
  }

  //
  //  add easing selector
  //
  function addEasingSelector (paneRef, pObject, incomingOptions) {
    //
    //  set default options
    //
    let o = {
      // reserved for future defaults
    };
    //
    // merge with default options
    //
    o = Object.assign({}, o, incomingOptions);

    o.easeTypeControl = paneRef
      .addBinding(pObject, o.typeKey, {
        label: 'easing type',
        options: {
          Linear: EASE_LINEAR,
          Smooth: EASE_SMOOTH,
          Quad: EASE_QUAD,
          Cubic: EASE_CUBIC,
          Quart: EASE_QUART,
          Quint: EASE_QUINT,
          Expo: EASE_EXPO,
          Circ: EASE_CIRC,
          Elastic: EASE_ELASTIC,
          Bounce: EASE_BOUNCE,
          Back: EASE_BACK,
        },
      })
      .on('change', ev => {
        if (ev.value === EASE_LINEAR || ev.value === EASE_SMOOTH) {
          o.easeDirectionControl.hidden = true;
        } else {
          o.easeDirectionControl.hidden = false;
        }
      });

    o.easeDirectionControl = paneRef.addBinding(pObject, o.directionKey, {
      label: 'direction',
      options: {
        In: EASE_IN,
        Out: EASE_OUT,
        InOut: EASE_IN_OUT,
      },
    });
  }

  // Global references to the main Tweakpane panel and tab container
  let basePane, basePaneTab;

  /**
   * Initializes the Tweakpane UI panel with tabs and controls based on configuration options
   * Sets up the main panel, registers plugins, and adds conditional tabs and controls
   * @returns {void}
   */
  function setUpTweakpane () {
    // Create the main Tweakpane panel if enabled
    if (libraryState.options.useParameterPanel) {
      basePane = new Tweakpane.Pane({});
    }

    // Build array of tabs to add based on configuration
    const tabs = buildTabList();

    // Add all tabs to the panel
    basePaneTab = basePane.addTab({ pages: tabs });

    // Register required Tweakpane plugins
    registerTweakpanePlugins();

    // Store panel references in library state for external access
    setupTweakpaneReferences();

    // Add conditional controls (except buttons which go at the bottom)
    addConditionalControlsWithoutButtons();
    addEventHandlers();

    // Add buttons last to ensure they appear at the bottom
    addBottomButtons();

    // Initialize panel state
    initializePanelState();
  }

  /**
   * Builds the list of tabs to display based on configuration options
   * @returns {Array} Array of tab objects with titles
   */
  function buildTabList () {
    const tabs = [{ title: TABS_PARAMETERS }];

    if (libraryState.options.showCanvasSizeOptions) {
      tabs.push({ title: TABS_ADVANCED });
    }

    if (libraryState.options.showCaptureOptions) {
      tabs.push({ title: TABS_CAPTURE });
    }

    return tabs;
  }

  /**
   * Registers Tweakpane plugins for enhanced functionality
   */
  function registerTweakpanePlugins () {
    basePane.registerPlugin(TweakpaneEssentialsPlugin);
    basePane.registerPlugin(TweakpaneCamerakitPlugin);
  }

  /**
   * Sets up the tweakpane object in library state with all necessary references
   */
  function setupTweakpaneReferences () {
    libraryState.tweakpane = {
      base: basePane,
      basePaneTab: basePaneTab,
      primaryTab: basePaneTab.pages[0],
      addPaletteSelector: addPaletteSelector,
      addBlendModeSelector: addBlendModeSelector,
      addRandomSeedControl: addRandomSeedControl,
      addEasingSelector: addEasingSelector,
    };
  }

  /**
   * Adds conditional controls based on configuration options (excluding buttons)
   * Buttons are added separately to ensure they appear at the bottom
   */
  function addConditionalControlsWithoutButtons () {
    if (libraryState.options.showCanvasSizeOptions) {
      addSizeOptions();
    }

    if (libraryState.options.showCaptureOptions) {
      addCaptureOptions();
    }
  }

  /**
   * Adds buttons that should appear at the bottom of the interface
   */
  function addBottomButtons () {
    if (libraryState.options.showSaveSketchButton) {
      addSaveSketchButton();
    }

    if (libraryState.options.showCaptureOptions) {
      addCaptureButtons();
    }
  }

  /**
   * Adds event handlers for panel interactions
   */
  function addEventHandlers () {
    addRefreshHandler();
    addPaneToggle();

    // Call user-defined setup function if available
    if (typeof window.setupPanelControls === 'function') {
      logDebug(`${LIBRARY_NAME} - setupPanelControls`);
      window.setupPanelControls(libraryState.tweakpane);
    }
  }

  /**
   * Initializes the panel's initial state based on configuration
   */
  function initializePanelState () {
    if (libraryState.options.hideParameterPanelOnStart) {
      togglePaneVisibility(false);
    }
  }

  /**
   * Adds keyboard shortcut (P key) to toggle panel visibility
   * Replaces any existing keydown handler on the document
   * @returns {void}
   */
  function addPaneToggle () {
    document.onkeydown = function (event) {
      if (event.key.toLowerCase() === 'p') {
        togglePaneVisibility();
      }
    };
  }

  /**
   * Toggles the visibility of the Tweakpane panel
   * @param {boolean|null} makeVisible - Force visibility state (true=show, false=hide, null=toggle)
   * @returns {void}
   */
  function togglePaneVisibility (makeVisible = null) {
    const panelElement = document.getElementsByClassName('tp-dfwv')[0];
    if (!panelElement) return;

    const isCurrentlyVisible = panelElement.style.display === 'block' || panelElement.style.display === '';

    if (makeVisible === true || (makeVisible === null && !isCurrentlyVisible)) {
      panelElement.style.display = 'block';
    } else if (makeVisible === false || (makeVisible === null && isCurrentlyVisible)) {
      panelElement.style.display = 'none';
    }
  }

  /**
   * Adds a debounced refresh handler to the panel that updates parameters when controls change
   * Prevents excessive updates during rapid parameter changes
   * @returns {void}
   */
  function addRefreshHandler () {
    let refreshTimeout;

    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        if (typeof window.tokoWrapper === 'function' && window.tokoWrapper()) {
          window.tokoWrapper().updateParameters();
        } else {
          logError('tokoWrapper instance not available to update parameters');
        }
      }, libraryState.debounceDelay);
    };

    basePane.on('change', debouncedRefresh);
  }

  /**
   * Adds canvas size selection control to the advanced tab
   * Allows users to change canvas dimensions from predefined options
   * @returns {void}
   */
  function addSizeOptions () {
    if (!libraryState.options.showCanvasSizeOptions) return;

    // Extract name from canvas size object for the dropdown
    libraryState.options.canvasSizeName = libraryState.options.canvasSize.name;

    basePaneTab.pages[TAB_ID_ADVANCED].addBinding(libraryState.options, 'canvasSizeName', {
      options: SIZES_LIST,
      label: 'canvas size',
    }).on('change', event => {
      const selectedSize = SIZES.find(size => size.name === event.value);
      if (selectedSize) {
        setCanvasSize(selectedSize);
      }
    });
  }

  /**
   * Adds video capture controls to the capture tab (excluding buttons)
   * Buttons are added separately to ensure they appear at the bottom
   * @returns {void}
   */
  function addCaptureOptions () {
    // Find the actual capture tab index dynamically
    const captureTabIndex = basePaneTab.pages.findIndex(page => page.title === TABS_CAPTURE);

    if (captureTabIndex === -1) {
      console.error('ERROR: Capture tab not found in pages array');
      return;
    }

    const captureTab = basePaneTab.pages[captureTabIndex];

    // Add capture format and framerate controls
    addCaptureFormatControls(captureTab);

    // Add duration and refresh controls
    addCaptureDurationControls(captureTab);
  }

  /**
   * Adds capture buttons that should appear at the bottom
   * @returns {void}
   */
  function addCaptureButtons () {
    if (!libraryState.options.showCaptureOptions) return;

    // Find the actual capture tab index dynamically
    const captureTabIndex = basePaneTab.pages.findIndex(page => page.title === TABS_CAPTURE);
    if (captureTabIndex === -1) {
      console.error('ERROR: Capture tab not found in pages array for buttons');
      return;
    }

    const captureTab = basePaneTab.pages[captureTabIndex];
    const buttonTab = getButtonTab(captureTab);

    // Add record/stop buttons
    addCaptureButtonsToTab(buttonTab);

    // Initialize control states after buttons are created
    initializeCaptureControls();
  }

  /**
   * Determines which tab should contain the record/stop buttons
   * @param {Object} captureTab - The capture options tab
   * @returns {Object} The tab to add buttons to
   */
  function getButtonTab (captureTab) {
    if (libraryState.options.captureOptions.recordButtonOnMainTab) {
      const primaryTab = libraryState.tweakpane.primaryTab;
      primaryTab.addBlade({ view: 'separator' });
      return primaryTab;
    }
    return captureTab;
  }

  /**
   * Adds format and framerate selection controls
   * @param {Object} tab - The tab to add controls to
   */
  function addCaptureFormatControls (tab) {
    if (!tab) {
      console.error('ERROR: tab is null or undefined, cannot add controls');
      return;
    }

    tab
      .addBinding(libraryState.options.captureOptions, 'format', {
        label: 'video format',
        options: CAPTURE_FORMATS,
      })
      .on('change', updateCaptureFormat);

    tab
      .addBinding(libraryState.options.captureOptions, 'framerate', {
        label: 'video framerate',
        options: CAPTURE_FRAMERATES,
      })
      .on('change', updateCaptureFrameRate);

    tab.addBlade({ view: 'separator' });
  }

  /**
   * Adds duration and refresh controls
   * @param {Object} tab - The tab to add controls to
   */
  function addCaptureDurationControls (tab) {
    tab
      .addBinding(libraryState.options.captureOptions, 'refreshBeforeCapture', {
        label: 'refresh first',
      })
      .on('change', updateCaptureRefreshBefore);

    tab.addBlade({ view: 'separator' });

    tab
      .addBinding(libraryState.options.captureOptions, 'fixedDuration', {
        label: 'fixed duration',
      })
      .on('change', updateCaptureFixedDuration);

    // Store reference to duration control for external access
    libraryState.options.captureOptions.captureDurationControl = tab
      .addBinding(libraryState.options.captureOptions, 'duration', {
        label: 'nr of frames',
        min: 0,
        max: 3000,
        step: 10,
      })
      .on('change', updateCaptureDuration);
  }

  /**
   * Adds record and stop buttons to the specified tab
   * @param {Object} tab - The tab to add buttons to
   */
  function addCaptureButtonsToTab (tab) {
    if (!libraryState.options.captureOptions.recordButtonOnMainTab) {
      tab.addBlade({ view: 'separator' });
    }

    const buttonTitle = libraryState.options.captureOptions.refreshBeforeCapture
      ? REFRESH_RECORD_BUTTON_LABEL
      : RECORD_BUTTON_LABEL;

    libraryState.options.captureOptions.startCaptureButton = tab
      .addButton({ title: buttonTitle })
      .on('click', clickStartCapture);

    libraryState.options.captureOptions.stopCaptureButton = tab
      .addButton({ title: '⬛️ Stop recording' })
      .on('click', clickStopCapture);
  }

  /**
   * Initializes the initial state of capture controls
   */
  function initializeCaptureControls () {
    updateCaptureFixedDuration({ value: libraryState.options.captureOptions.fixedDuration });
    updateRecordButtonLabel(libraryState.options.captureOptions.refreshBeforeCapture);
    libraryState.options.captureOptions.stopCaptureButton.hidden = true;
  }

  /**
   * Adds a save sketch button to the parameters tab
   * Button behavior changes based on whether settings should be saved with the sketch
   * @returns {void}
   */
  function addSaveSketchButton () {
    const parametersTab = basePaneTab.pages[TAB_ID_PARAMETERS];

    parametersTab.addBlade({ view: 'separator' });

    const buttonLabel = libraryState.options.saveSettingsWithSketch
      ? SAVE_SKETCH_AND_SETTINGS_BUTTON_LABEL
      : SAVE_SKETCH_BUTTON_LABEL;

    const buttonHandler = libraryState.options.saveSettingsWithSketch ? saveSketchAndSettings : saveSketch;

    parametersTab.addButton({ title: buttonLabel }).on('click', buttonHandler);
  }

  /**
   * Set up file receiving functionality for drag and drop
   * @returns {void}
   * @example
   * // Set up file receiving
   * setUpReceiveFile();
   */
  function setUpReceiveFile () {
    if (libraryState.options.acceptDroppedSettings || libraryState.options.acceptDroppedFiles) {
      // Check if p5.js drop() method is available (not available in p5v2 SVG or Q5)
      if (libraryState.p5Canvas && typeof libraryState.p5Canvas.drop === 'function') {
        libraryState.p5Canvas.drop(dropFile.bind(this));
      } else {
        // Fallback to native drag and drop for p5v2 SVG, Q5, or other cases
        setUpNativeDrop();
      }
    }
  }

  /**
   * Set up native drag and drop event listeners
   * Used as fallback when p5.js drop() method is not available (e.g., p5v2 SVG, Q5)
   */
  function setUpNativeDrop () {
    if (!libraryState.p5Canvas) {
      logWarn('Cannot set up file drop: canvas not available');
      return;
    }

    // Try different ways to access the canvas element depending on p5.js variant and renderer
    let canvasElement = null;

    if (libraryState.variant === LIBRARY_Q5) {
      // For Q5, libraryState.p5Canvas is window.Q5, and the canvas is at Q5.canvas
      if (libraryState.p5Canvas.canvas) {
        canvasElement = libraryState.p5Canvas.canvas;
      }
    } else if (libraryState.p5Canvas.canvas) {
      // Standard canvas element (P2D, WEBGL)
      canvasElement = libraryState.p5Canvas.canvas;
    } else if (libraryState.p5Canvas.elt) {
      // Alternative property name
      canvasElement = libraryState.p5Canvas.elt;
    } else if (libraryState.p5Canvas instanceof HTMLElement) {
      // Canvas is the element itself
      canvasElement = libraryState.p5Canvas;
    }

    // If we still don't have a canvas element, try to get it from the sketch container
    // This is useful for SVG renderer where the structure might be different
    if (!canvasElement) {
      const sketchElement = document.getElementById(libraryState.options.sketchElementId);
      if (sketchElement && sketchElement.firstChild) {
        canvasElement = sketchElement.firstChild;
      }
    }

    if (!canvasElement) {
      logWarn('Cannot set up file drop: canvas element not found');
      return;
    }

    // Prevent default drag behaviors
    canvasElement.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
    });

    canvasElement.addEventListener('dragenter', e => {
      e.preventDefault();
      e.stopPropagation();
    });

    canvasElement.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        processDroppedFile(file);
      }
    });
  }

  /**
   * Process a dropped file using native File API
   * Converts the native File object to the format expected by dropFile()
   * @param {File} file - Native File object from drag and drop
   */
  function processDroppedFile (file) {
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = function (e) {
      let fileData = e.target.result;
      let subtype = fileExtension;

      // Handle JSON files (settings)
      if (fileExtension === 'json') {
        try {
          fileData = JSON.parse(fileData);
        } catch (error) {
          logWarn('Failed to parse JSON file: ' + error.message);
          return;
        }
      }

      // Create file object in the format expected by dropFile()
      const p5FileObject = {
        file: file,
        type: file.type,
        subtype: subtype,
        name: file.name,
        size: file.size,
        data: fileData,
      };

      dropFile(p5FileObject);
    };

    reader.onerror = function () {
      logWarn('Failed to read dropped file');
    };

    // Read file as text for JSON, or as data URL for images
    if (fileExtension === 'json') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }

  /**
   * Handle dropped files based on file type and options
   * @param {Object} file - Dropped file object
   * @returns {void}
   * @example
   * // Handle dropped file
   * dropFile(droppedFile);
   */
  function dropFile (file) {
    if (libraryState.options.acceptDroppedSettings && file.subtype == 'json') {
      receiveSettings(file);
    } else if (libraryState.options.acceptDroppedFiles) {
      receiveFile(file);
    }
  }

  /**
   * Receive and apply settings from a dropped JSON file
   * @param {Object} file - File object containing settings data
   * @returns {void}
   * @example
   * // Receive settings file
   * receiveSettings(settingsFile);
   */
  function receiveSettings (file) {
    let receivedCollection, receivedPalette;

    let newState = _presetToState(file.data);
    libraryState.tweakpane.base.importState(newState);

    receivedCollection = file.data.collection;
    receivedPalette = file.data.palette;

    updatePaletteSelector(receivedCollection, receivedPalette);

    window.receivedFile?.(file);
  }

  /**
   * Receive a dropped file and call the global receivedFile function if available
   * @param {Object} file - Dropped file object
   * @returns {void}
   * @example
   * // Receive file
   * receiveFile(droppedFile);
   */
  function receiveFile (file) {
    window.receivedFile?.(file);
  }

  function setUpFPS () {
    if (libraryState.options.showFPS) {
      libraryState.toko.createFPS();
    }
    addFPSToggle();
  }

  function addFPSToggle () {
    document.onkeydown = function (event) {
      if (event.key.toLowerCase() === 'f') {
        libraryState.toko.toggleFPS();
      }
    };
  }

  /**
   * Set up all wrapper components
   * Initializes canvas, Tweakpane, capture tools, file receiving
   * @example
   * // Set up all wrapper components
   * setUpWrapper();
   */
  function setUpWrapper () {
    setUpCanvas();
    setUpTweakpane();
    setUpCapture();
    setUpReceiveFile();
    setUpFPS();
  }

  /**
   * Initialize hook for wrapper - called when p5.js/Q5.js initializes
   * Note: Not used since it is not available for p5.js v2
   */
  function initHook () {
    //
    //  not used since it is not available for p5 v2
    //
  }

  /**
   * Pre-setup hook for wrapper - called before p5.js setup() function
   * Initializes the wrapper state and logs version information
   */
  function preSetupHook () {
    logInfo(`${LIBRARY_NAME} v${VERSION} (${libraryState.variant} - ${libraryState.options.renderMode})`);
    logDebug('tokoWrapper - preSetupHook');
    libraryState.initialized = true;
  }

  /**
   * Post-setup hook for wrapper - called after p5.js setup() function
   * Sets up all wrapper components including canvas, Tweakpane, and capture tools
   */
  function postSetupHook () {
    // window.createCanvasNow(); // = createCanvasNow;
    logDebug('tokoWrapper - postSetupHook');
    setUpWrapper();

    // Call refresh() if available, otherwise call tokoWrapper updateParameters
    if (typeof window.refresh === 'function') {
      window.refresh();
    } else if (typeof window.tokoWrapper === 'function' && window.tokoWrapper()) {
      window.tokoWrapper().updateParameters();
    }
  }

  /**
   * Pre-draw hook for wrapper - called before each draw() cycle
   * Currently logs debug information
   */
  function preDrawHook () {
    logDebug('tokoWrapper - preDrawHook');
    //
    //  shift the canvas for webgl if enabled
    //
    if (libraryState.options.shiftCanvasForWebGL) {
      const isP5AndWebGL =
        (libraryState.variant === LIBRARY_P5V1 || libraryState.variant === LIBRARY_P5V2) &&
        libraryState.options.renderMode === RENDER_MODES.WEBGL;
      const isQ5AndWebGPU =
        libraryState.variant === LIBRARY_Q5 && libraryState.options.renderMode === RENDER_MODES.WEBGPU;

      if (isP5AndWebGL || isQ5AndWebGPU) {
        recenterCanvas();
      }
    }
  }

  /**
   * Post-draw hook for wrapper - called after each draw() cycle
   * Currently unused but available for per-frame tasks
   */
  function postDrawHook () {
    logDebug('tokoWrapper - postDrawHook');
  }

  /**
   * Remove hook for wrapper - called when the sketch is removed or destroyed
   * Performs cleanup tasks and resets wrapper state
   */
  function removeHook () {
    logDebug(`${LIBRARY_NAME} - Cleanup on sketch removal`);
    libraryState.initialized = false;
  }

  /**
   * Toko Wrapper adapter using the shared base adapter system
   * This eliminates code duplication while maintaining wrapper-specific functionality
   */

  // Create lifecycle handlers object
  const lifecycleHandlers = {
    initHook,
    preSetupHook,
    postSetupHook,
    preDrawHook,
    postDrawHook,
    removeHook,
  };

  // Create the adapter instance (no registration functions for wrapper)
  const adapter = new BaseAdapter(libraryState, lifecycleHandlers);

  // Export the adapter functions
  function initializeP5v1 () {
    return adapter.initialize();
  }

  const p5v2Adapter = function (p5, fn, lifecycles) {
    logDebug('tokoWrapper - shared-adapter - p5v2Adapter');
    return adapter.initialize({ p5, fn, lifecycles });
  };

  function initializeQ5 () {
    return adapter.initialize();
  }

  /**
   * Canvas size management for TokoWrapper
   *
   * Handles canvas size configuration, additional size parsing,
   * and canvas size list management.
   *
   * @namespace CanvasSizes
   */

  /**
   * Parse additional canvas sizes from options
   * @param {Object} options - Options object containing additionalCanvasSizes array
   */
  function parseAdditionalCanvasSizes (options) {
    let n = options.additionalCanvasSizes.length;
    let useCustomSize = false;
    let selectedCustomSize = null;
    if (n > 0) {
      for (let i = 0; i < n; i++) {
        addCanvasSize(options.additionalCanvasSizes[i]);
        if (options.additionalCanvasSizes[i].useThisSizeAsDefault) {
          useCustomSize = true;
          selectedCustomSize = options.additionalCanvasSizes[i];
        }
      }
    }
    libraryState.options.canvasSize = useCustomSize ? selectedCustomSize : libraryState.options.canvasSize;
  }

  /**
   * Add an additional canvas size to the available sizes list
   * Can only be called after Toko is set up
   * @param {Object} inSize - Size object with name and dimensions
   */
  function addCanvasSize (inSize) {
    SIZES.push(inSize);
    SIZES_LIST[inSize.name] = inSize.name;
  }

  /**
   * General options parsing and management for TokoWrapper
   *
   * Handles parsing and merging of user-provided options with default values.
   * This is core functionality that other parts of the system depend on.
   *
   * @namespace Options
   */

  /**
   * Parse and merge user options with default options
   * @param {Object} options - User-provided options to merge with defaults
   */
  function parseOptions (options) {
    if (libraryState.options != null) {
      libraryState.options = { ...libraryState.options, ...options };
    } else {
      libraryState.options = { ...DEFAULT_OPTIONS, ...options };
    }

    // Parse url parameters
    libraryState.options = parseUrlParameters(libraryState.options);

    libraryState.options.captureOptions = { ...DEFAULT_CAPTURE_OPTIONS, ...libraryState.options.captureOptions };
    libraryState.options.captureOptions.previousDuration = libraryState.options.captureOptions.duration;
    libraryState.options.captureOptions.beforeDownload = function (blob, context, next) {
      resetCapture(context.filename); // used to ensure the reset always happens
      next();
    };

    libraryState.options.captureOptions.baseFilename = function (date) {
      return getFilenameForCapture();
    };

    // Handle canvas-specific options if they exist
    if (options.additionalCanvasSizes != undefined && options.additionalCanvasSizes.length != 0) {
      parseAdditionalCanvasSizes(options);
    }
  }

  /**
   * Parse URL parameters to override render mode
   *
   * Allows for overriding the render mode via URL parameters:
   * - r: render mode (p2d, svg, webgl)
   *
   * @param {Object} options - Options object
   * @returns {Object} Options object with updated render mode
   * @example
   * // URL: ?r=svg
   * // Will set options.renderMode to 'SVG'
   * @note SVG render mode is automatically converted to P2D when using Q5 variant
   */
  function parseUrlParameters (options) {
    const params = new URLSearchParams(document.location.search);
    const renderModeParam = params.get('r');

    if (renderModeParam && renderModeParam.trim() !== '') {
      const normalizedParam = renderModeParam.toLowerCase().trim();
      let renderMode;

      switch (normalizedParam) {
        case 'p2d':
          renderMode = RENDER_MODES.P2D;
          break;
        case 'svg':
          renderMode = RENDER_MODES.SVG;
          if (libraryState.toko?.variant === LIBRARY_Q5) {
            renderMode = RENDER_MODES.P2D;
            console.log('SVG is not supported in Q5, using default: P2D');
          }
          break;
        case 'webgl':
          if (libraryState.toko?.variant === LIBRARY_Q5) {
            renderMode = RENDER_MODES.WEBGPU;
            Q5.WebGPU();
          } else {
            renderMode = RENDER_MODES.WEBGL;
          }
          break;
        case 'webgpu':
          if (libraryState.toko?.variant === LIBRARY_Q5) {
            renderMode = RENDER_MODES.WEBGPU;
            Q5.WebGPU();
          } else {
            renderMode = RENDER_MODES.WEBGL;
          }
          break;
        default:
          console.log(`Invalid render mode: ${normalizedParam}, using default: P2D`);
          renderMode = RENDER_MODES.P2D;
          break;
      }

      options.renderMode = renderMode;
    }

    return options;
  }

  /**
   * Shared initialization utilities for p5.js variant handling
   * Eliminates code duplication between toko-library and toko-wrapper
   */

  /**
   * Initialize p5.js variant with the provided adapter functions
   * @param {Object} options - Initialization options
   * @param {Object} options.libraryState - Library state object
   * @param {Function} options.initializeP5v1 - p5v1 initialization function
   * @param {Function} options.initializeQ5 - Q5 initialization function
   * @param {Function} options.p5v2Adapter - p5v2 adapter function
   * @param {Function} options.logWarn - Warning logging function
   * @param {string} options.libraryName - Name of the library for logging
   * @returns {string} The detected variant
   * @example
   * const variant = initializeP5Variant({
   *   libraryState,
   *   initializeP5v1,
   *   initializeQ5,
   *   p5v2Adapter,
   *   logWarn,
   *   libraryName: 'Toko'
   * });
   */
  function initializeP5Variant (options) {
    const { libraryState, initializeP5v1, initializeQ5, p5v2Adapter, logWarn, libraryName } = options;

    const variant = detectP5Variant();
    libraryState.variant = variant;

    switch (variant) {
      case LIBRARY_P5V2:
        if (typeof p5 !== 'undefined' && typeof p5.registerAddon === 'function') {
          p5.registerAddon(p5v2Adapter);
        } else {
          logWarn(`${libraryName}: p5 is not available globally or registerAddon is missing.`);
        }
        break;

      case LIBRARY_P5V1:
        initializeP5v1();
        break;

      case LIBRARY_Q5:
        initializeQ5();
        break;

      default:
        logWarn(`${libraryName}: Unknown or unsupported p5 variant`);
        break;
    }

    return variant;
  }

  // Import constants from shared files

  // IIFE wrapper for the entire TokoWrapper library
  (function () {

    /*!----------------------------------------------------
    //
    //  TokoWrapper
    //  expanding p5.js with loads of duct tape
    //
    //  by Bob Corporaal
    //
    //  MIT License
    //
    -------------------------------------------------------
    */

    // Utility functions

    function detectTokoWrapper () {
      if (typeof window !== 'undefined' && window.toko) {
        return window.toko;
      }
      if (typeof global !== 'undefined' && global.toko) {
        return global.toko;
      }
      return null;
    }

    // Save sketch functions (simplified)
    function saveSketchWrapper () {
      logDebug('saveSketch');
      // Implementation would go here
    }

    function saveSketchAndSettingsWrapper () {
      logDebug('saveSketchAndSettings');
      // Implementation would go here
    }

    // Main TokoWrapper class
    class TokoWrapper {
      constructor (options = {}) {
        this.initialized = false;
        this.variant = LIBRARY_UNKNOWN;
        this.name = LIBRARY_NAME;

        // Bind all wrapper functions
        this.bindFunctions();

        // Bind all wrapper classes and constants
        this.bindClasses();
        this.bindConstants();

        // Initialize with options
        this.init(options);
      }

      bindFunctions () {
        // Add core wrapper functions to instance
        this.updateOptions = this.updateOptions.bind(this);
        this.storeCanvas = this.storeCanvas.bind(this);
        this.test = this.test.bind(this);
        this.saveSketch = this.saveSketch.bind(this);
        this.saveSketchAndSettings = this.saveSketchAndSettings.bind(this);
        this.updateParameters = this.updateParameters.bind(this);
        this.logError = logError.bind(this);
        this.logWarn = logWarn.bind(this);
        this.logInfo = logInfo.bind(this);
        this.logDebug = logDebug.bind(this);
      }

      bindClasses () {
        // Attach any wrapper-specific classes here
      }

      bindConstants () {
        // Bind constants to the class
        this.SIZE_DEFAULT = SIZE_DEFAULT;
        this.SIZE_FULL = SIZE_FULL;
        this.SIZE_SQUARE_XL = SIZE_SQUARE_XL;
        this.SIZE_1080P = SIZE_1080P;
        this.SIZE_1080P_PORTRAIT = SIZE_1080P_PORTRAIT;
        this.SIZE_4K = SIZE_4K;
        this.SIZE_4K_PORTRAIT = SIZE_4K_PORTRAIT;
        this.SIZE_IPHONE_11_WALLPAPER = SIZE_IPHONE_11_WALLPAPER;
        this.SIZE_WIDE_SCREEN = SIZE_WIDE_SCREEN;
        this.SIZE_MACBOOK_14_WALLPAPER = SIZE_MACBOOK_14_WALLPAPER;
        this.SIZE_MACBOOK_16_WALLPAPER = SIZE_MACBOOK_16_WALLPAPER;
        this.SIZE_INSTAGRAM_PORTRAIT = SIZE_INSTAGRAM_PORTRAIT;
        this.CAPTURE_FORMATS = CAPTURE_FORMATS;
        this.CAPTURE_FRAMERATES = CAPTURE_FRAMERATES;
        this.VERSION = VERSION;
        this.RENDER_MODES = RENDER_MODES;
      }

      init (options = {}) {
        // Detect and store Toko reference
        const tokoInstance = detectTokoWrapper();
        if (!tokoInstance) {
          throw new Error('Toko library is required but not available');
        }
        libraryState.toko = tokoInstance;

        parseOptions(options);

        // Store this instance globally for refresh calls
        currentTokoWrapperInstance = this;

        return this.initializeLibrary();
      }

      initializeLibrary () {
        // Prevent multiple initializations
        if (this.initialized) {
          logWarn(`${this.name}: Already initialized`);
          return this;
        }

        // Initialize p5.js variant using shared utility
        const variant = initializeP5Variant({
          libraryState,
          initializeP5v1,
          initializeQ5,
          p5v2Adapter,
          logWarn,
          libraryName: LIBRARY_NAME,
        });
        this.variant = variant;

        this.initialized = true;
        return this;
      }

      updateOptions (options) {
        parseOptions(options);
      }

      storeCanvas (newCanvas) {
        if (libraryState.variant != LIBRARY_Q5) {
          libraryState.p5Canvas = newCanvas;
        } else {
          libraryState.p5Canvas = window.Q5;
        }
      }

      getCanvas () {
        return libraryState.p5Canvas;
      }

      get sketchElementId () {
        return libraryState.options.sketchElementId;
      }

      set sketchElementId (value) {
        libraryState.options.sketchElementId = value;
      }

      get renderMode () {
        return libraryState.options.renderMode;
      }

      // set renderMode (value) {
      //   libraryState.options.renderMode = value;
      // }

      test () {
        logDebug('testing');
      }

      saveSketch () {
        logDebug('saveSketch');
        saveSketchWrapper();
      }

      saveSketchAndSettings () {
        logDebug('saveSketchAndSettings');
        saveSketchAndSettingsWrapper();
      }

      // Called by the UI to update the parameters
      updateParameters () {
        logDebug('tokoWrapper - updateParameters');

        // Call refresh() if available to parse the parameters
        if (typeof window.refresh === 'function') {
          window.refresh();
        }

        // Call redraw() if available to redraw the canvas
        if (typeof window.redraw === 'function') {
          window.redraw();
        }
      }
    }

    // Make it globally available
    window.TokoWrapper = TokoWrapper;

    // Store the current instance globally for refresh calls
    let currentTokoWrapperInstance = null;

    // Make constants available on TokoWrapper so they can be used without creating an instance
    TokoWrapper.SIZE_DEFAULT = SIZE_DEFAULT;
    TokoWrapper.SIZE_FULL = SIZE_FULL;
    TokoWrapper.SIZE_SQUARE_XL = SIZE_SQUARE_XL;
    TokoWrapper.SIZE_1080P = SIZE_1080P;
    TokoWrapper.SIZE_1080P_PORTRAIT = SIZE_1080P_PORTRAIT;
    TokoWrapper.SIZE_4K = SIZE_4K;
    TokoWrapper.SIZE_4K_PORTRAIT = SIZE_4K_PORTRAIT;
    TokoWrapper.SIZE_IPHONE_11_WALLPAPER = SIZE_IPHONE_11_WALLPAPER;
    TokoWrapper.SIZE_WIDE_SCREEN = SIZE_WIDE_SCREEN;
    TokoWrapper.SIZE_MACBOOK_14_WALLPAPER = SIZE_MACBOOK_14_WALLPAPER;
    TokoWrapper.SIZE_MACBOOK_16_WALLPAPER = SIZE_MACBOOK_16_WALLPAPER;
    TokoWrapper.SIZE_INSTAGRAM_PORTRAIT = SIZE_INSTAGRAM_PORTRAIT;
    TokoWrapper.CAPTURE_FORMATS = CAPTURE_FORMATS;
    TokoWrapper.CAPTURE_FRAMERATES = CAPTURE_FRAMERATES;
    TokoWrapper.VERSION = VERSION;
    TokoWrapper.RENDER_MODES = RENDER_MODES;

    // Make the current instance globally accessible
    window.tokoWrapper = () => currentTokoWrapperInstance;
  })();

})();
//# sourceMappingURL=p5.tokoWrapper.js.map
