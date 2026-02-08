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

  const LIBRARY = {
    P5V1: LIBRARY_P5V1,
    P5V2: LIBRARY_P5V2,
    Q5: LIBRARY_Q5,
    UNKNOWN: LIBRARY_UNKNOWN,
  };

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

  // Library-specific constants

  const LIBRARY_NAME = 'Toko';

  const COLOR_MODE_LIST = ['rgb', 'lrgb', 'lab', 'hsl', 'lch', 'oklab', 'oklch'];

  var DEFAULT_COLOR_OPTIONS = {
    reverse: false,
    domain: [0, 1],
    mode: 'oklab',
    gamma: 1,
    stepped: false,
    steps: 10,
    nrColors: 10,
    useSortOrder: false,
    constrainContrast: false,
    nrDuotones: 12,
    easingParameters: [0.25, 0.25, 0.75, 0.75],
    useEasing: false,
  };

  const BLEND_MODE = {
    BLEND: 'source-over', //p5.BLEND,
    MULTIPLY: 'multiply', //p5.MULTIPLY,
    SCREEN: 'screen', //p5.SCREEN,
    OVERLAY: 'overlay', //p5.OVERLAY,
    DARKEST: 'darken', //p5.DARKEST,
    LIGHTEST: 'lighten', //p5.LIGHTEST,
    DIFFERENCE: 'difference', //p5.DIFFERENCE,
    EXCLUSION: 'exclusion', //p5.EXCLUSION,
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

      if (!p5Instance) {
        return LIBRARY_UNKNOWN;
      }

      // Quick v2 detection
      if (typeof p5Instance.VERSION === 'string' && p5Instance.VERSION.startsWith('2.')) {
        return LIBRARY_P5V2;
      }
      if (typeof p5Instance.Graphics2D !== 'undefined') {
        return LIBRARY_P5V2; // Beta version of p5.js with Graphics2D feature
      }
      return LIBRARY_P5V1;
    }

    return LIBRARY_UNKNOWN;
  }

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
   * Log a message with default info level (backward compatibility)
   * @param {string} message - The message to log
   * @returns {void}
   * @example
   * log('Processing complete');
   */
  function log$1 (message) {
    logInfo(message);
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

      // Validate required parameters
      if (!p5 || !fn || !lifecycles) {
        logWarn('shared-adapter - initializeP5v2: missing required parameters (p5, fn, or lifecycles)');
        return false;
      }

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

  /**
   * Shared utility for consistent global object detection
   * Handles different JavaScript environments (browser, Node.js, etc.)
   */

  /**
   * Get the global object in a cross-platform way
   * @returns {Object} The global object (window, global, or self)
   * @example
   * const globalObj = getGlobalObject();
   * globalObj.myVariable = 'value';
   */
  function getGlobalObject () {
    // Check for different global objects in order of preference
    if (typeof window !== 'undefined') {
      return window;
    }
    if (typeof global !== 'undefined') {
      return global;
    }
    if (typeof self !== 'undefined') {
      return self;
    }

    // Last resort - return an empty object
    // This should rarely happen in practice
    return {};
  }

  /**
   * Shared registration functions for library functions and classes
   * This eliminates duplication between toko-library and toko-wrapper
   */

  let prototypeFunctionsRegistered = false;
  let prototypeClassesRegistered = false;

  /**
   * Register library functions on the p5.js prototype
   * @param {Object} libraryFunctions - Object containing functions to register
   * @param {Object} libraryState - State object containing x5 prototype reference
   * @returns {void}
   * @example
   * registerLibraryFunctions({ myFunction: () => {} }, libraryState);
   */
  function registerLibraryFunctions (libraryFunctions, libraryState) {
    if (!libraryFunctions) {
      console.error('Toko: registerLibraryFunctions called with null or undefined libraryFunctions.');
      return;
    }

    const x5 = libraryState?.x5;

    if (!libraryState || !x5) {
      console.error('Toko: libraryState.x5 is undefined or null.');
      return;
    }

    // Prevent multiple registrations on prototype
    if (prototypeFunctionsRegistered) {
      return;
    }

    // Register functions on prototype
    Object.entries(libraryFunctions).forEach(([name, value]) => {
      if (typeof value === 'function' || typeof value === 'string') {
        if (!Object.hasOwn(x5, name)) {
          x5[name] = value;
        }
      }
    });

    // Register constants on global object (only constants, not functions)
    const globalObj = getGlobalObject();
    Object.entries(libraryFunctions).forEach(([name, value]) => {
      if (typeof value === 'string') {
        if (!Object.hasOwn(globalObj, name)) {
          globalObj[name] = value;
        }
      }
    });

    prototypeFunctionsRegistered = true;
  }

  /**
   * Register library classes on the p5.js prototype
   * @param {Object} libraryClasses - Object containing classes to register
   * @param {Object} libraryState - State object containing x5 prototype reference
   * @returns {void}
   * @example
   * registerLibraryClasses({ Grid: GridClass }, libraryState);
   */
  function registerLibraryClasses (libraryClasses, libraryState) {
    if (!libraryClasses) {
      console.error('Toko: registerLibraryClasses called with null or undefined libraryClasses.');
      return;
    }

    const x5 = libraryState?.x5;

    if (!libraryState || !x5) {
      console.error('Toko: libraryState.x5 is undefined or null.');
      return;
    }

    // Prevent multiple registrations on prototype
    if (prototypeClassesRegistered) {
      return;
    }

    // Register classes on prototype for this.Grid access in sketches
    Object.entries(libraryClasses).forEach(([name, ClassConstructor]) => {
      if (!Object.hasOwn(x5, name)) {
        x5[name] = ClassConstructor;
      }
    });

    prototypeClassesRegistered = true;
  }

  // Wrapper-specific constants

  //
  //  Set of standard sizes for the canvas and exports
  //
  const SIZE_DEFAULT = {
    name: 'default',
    width: 800,
    height: 800,
    pixelDensity: 2,
  };

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

  const libraryState = {
    initialized: false,
    variant: LIBRARY_UNKNOWN,
    x5: null,
    globalFunctionsRegistered: false,
    prototypeFunctionsRegistered: false,
    initColorDone: false,
    initialDrawDone: false,
    options: { ...DEFAULT_OPTIONS },
    fps: null,
  };

  // Set up the library state getter for the shared logging system
  setLibraryStateGetter(() => libraryState);

  // Backward compatible log function
  function log (message) {
    log$1(message);
  }

  /**
   * Easing functions for smooth animations and transitions
   *
   * Based on:
   * - https://gist.github.com/gre/1650294
   * - https://github.com/AndrewRayCode/easing-utils
   *
   * Provides a comprehensive set of easing functions for animations.
   * Each function takes a parameter t (0-1) and returns an eased value (0-1).
   */

  /**
   * Clamps a value between 0 and 1
   * @param {number} t - Value to clamp
   * @returns {number} Clamped value (0-1)
   */
  function clamp01 (t) {
    return t < 0 ? 0 : t > 1 ? 1 : t;
  }

  /**
   * Linear easing - no acceleration or deceleration
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Linear interpolation value
   * @example
   * const value = easeLinear(0.5); // Returns 0.5
   */
  function easeLinear (t) {
    return clamp01(t);
  }

  /**
   * Sine easing in - slight acceleration from zero to full speed
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with sine acceleration
   * @example
   * const value = easeInSine(0.5); // Returns eased value
   */
  function easeInSine (t) {
    t = clamp01(t);
    return -1 * Math.cos(t * (Math.PI / 2)) + 1;
  }

  /**
   * Sine easing out - slight deceleration at the end
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with sine deceleration
   * @example
   * const value = easeOutSine(0.5); // Returns eased value
   */
  function easeOutSine (t) {
    t = clamp01(t);
    return Math.sin(t * (Math.PI / 2));
  }

  /**
   * Sine easing in-out - slight acceleration at beginning and slight deceleration at end
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with sine acceleration and deceleration
   * @example
   * const value = easeInOutSine(0.5); // Returns eased value
   */
  function easeInOutSine (t) {
    t = clamp01(t);
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  }

  /**
   * Quadratic easing in - accelerating from zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quadratic acceleration
   * @example
   * const value = easeInQuad(0.5); // Returns 0.25
   */
  function easeInQuad (t) {
    t = clamp01(t);
    return t * t;
  }

  /**
   * Quadratic easing out - decelerating to zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quadratic deceleration
   * @example
   * const value = easeOutQuad(0.5); // Returns eased value
   */
  function easeOutQuad (t) {
    t = clamp01(t);
    return t * (2 - t);
  }

  /**
   * Quadratic easing in-out - acceleration until halfway, then deceleration
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quadratic acceleration and deceleration
   * @example
   * const value = easeInOutQuad(0.5); // Returns eased value
   */
  function easeInOutQuad (t) {
    t = clamp01(t);
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Cubic easing in - accelerating from zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with cubic acceleration
   * @example
   * const value = easeInCubic(0.5); // Returns 0.125
   */
  function easeInCubic (t) {
    t = clamp01(t);
    return t * t * t;
  }

  /**
   * Cubic easing out - decelerating to zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with cubic deceleration
   * @example
   * const value = easeOutCubic(0.5); // Returns eased value
   */
  function easeOutCubic (t) {
    t = clamp01(t);
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  }

  /**
   * Cubic easing in-out - acceleration until halfway, then deceleration
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with cubic acceleration and deceleration
   * @example
   * const value = easeInOutCubic(0.5); // Returns eased value
   */
  function easeInOutCubic (t) {
    t = clamp01(t);
    if (t < 0.5) {
      return 4 * t * t * t;
    }
    const t1 = t - 1;
    const t2 = 2 * t1;
    return t1 * t2 * t2 + 1;
  }

  /**
   * Quartic easing in - accelerating from zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quartic acceleration
   * @example
   * const value = easeInQuart(0.5); // Returns 0.0625
   */
  function easeInQuart (t) {
    t = clamp01(t);
    return t * t * t * t;
  }

  /**
   * Quartic easing out - decelerating to zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quartic deceleration
   * @example
   * const value = easeOutQuart(0.5); // Returns eased value
   */
  function easeOutQuart (t) {
    t = clamp01(t);
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
  }

  /**
   * Quartic easing in-out - acceleration until halfway, then deceleration
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quartic acceleration and deceleration
   * @example
   * const value = easeInOutQuart(0.5); // Returns eased value
   */
  function easeInOutQuart (t) {
    t = clamp01(t);
    if (t < 0.5) {
      return 8 * t * t * t * t;
    }
    const t1 = t - 1;
    return 1 - 8 * t1 * t1 * t1 * t1;
  }

  /**
   * Quintic easing in - accelerating from zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quintic acceleration
   * @example
   * const value = easeInQuint(0.5); // Returns 0.03125
   */
  function easeInQuint (t) {
    t = clamp01(t);
    return t * t * t * t * t;
  }

  /**
   * Quintic easing out - decelerating to zero velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quintic deceleration
   * @example
   * const value = easeOutQuint(0.5); // Returns eased value
   */
  function easeOutQuint (t) {
    t = clamp01(t);
    const t1 = t - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
  }

  /**
   * Quintic easing in-out - acceleration until halfway, then deceleration
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with quintic acceleration and deceleration
   * @example
   * const value = easeInOutQuint(0.5); // Returns eased value
   */
  function easeInOutQuint (t) {
    t = clamp01(t);
    if (t < 0.5) {
      return 16 * t * t * t * t * t;
    }
    const t1 = t - 1;
    return 1 + 16 * t1 * t1 * t1 * t1 * t1;
  }

  /**
   * Exponential easing in - accelerate exponentially until finish
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with exponential acceleration
   * @example
   * const value = easeInExpo(0.5); // Returns eased value
   */
  function easeInExpo (t) {
    t = clamp01(t);
    if (t === 0) {
      return 0;
    }
    return Math.pow(2, 10 * (t - 1));
  }

  /**
   * Exponential easing out - initial exponential acceleration slowing to stop
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with exponential deceleration
   * @example
   * const value = easeOutExpo(0.5); // Returns eased value
   */
  function easeOutExpo (t) {
    t = clamp01(t);
    if (t === 1) {
      return 1;
    }
    return -Math.pow(2, -10 * t) + 1;
  }

  /**
   * Exponential easing in-out - exponential acceleration and deceleration
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with exponential acceleration and deceleration
   * @example
   * const value = easeInOutExpo(0.5); // Returns eased value
   */
  function easeInOutExpo (t) {
    t = clamp01(t);
    if (t === 0 || t === 1) {
      return t;
    }
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;
    if (scaledTime < 1) {
      return 0.5 * Math.pow(2, 10 * scaledTime1);
    }
    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
  }

  /**
   * Circular easing in - increasing velocity until stop
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with circular acceleration
   * @example
   * const value = easeInCirc(0.5); // Returns eased value
   */
  function easeInCirc (t) {
    t = clamp01(t);
    return -1 * (Math.sqrt(1 - t * t) - 1);
  }

  /**
   * Circular easing out - start fast, decreasing velocity until stop
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with circular deceleration
   * @example
   * const value = easeOutCirc(0.5); // Returns eased value
   */
  function easeOutCirc (t) {
    t = clamp01(t);
    const t1 = t - 1;
    return Math.sqrt(1 - t1 * t1);
  }

  /**
   * Circular easing in-out - fast increase in velocity, fast decrease in velocity
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with circular acceleration and deceleration
   * @example
   * const value = easeInOutCirc(0.5); // Returns eased value
   */
  function easeInOutCirc (t) {
    t = clamp01(t);
    const scaledTime = t * 2;
    if (scaledTime < 1) {
      return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
    }
    const scaledTime1 = scaledTime - 2;
    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
  }

  /**
   * Back easing in - slow movement backwards then fast snap to finish
   * @param {number} t - Time parameter (0-1)
   * @param {number} [magnitude=1.70158] - The magnitude of the overshoot
   * @returns {number} Eased value with back-in effect
   * @example
   * const value = easeInBack(0.5); // Returns eased value
   * const valueCustom = easeInBack(0.5, 2.0); // Returns eased value with custom magnitude
   */
  function easeInBack (t, magnitude = 1.70158) {
    t = clamp01(t);
    if (magnitude < 0) {
      magnitude = 0;
    }
    return t * t * ((magnitude + 1) * t - magnitude);
  }

  /**
   * Back easing out - fast snap to backwards point then slow resolve to finish
   * @param {number} t - Time parameter (0-1)
   * @param {number} [magnitude=1.70158] - The magnitude of the overshoot
   * @returns {number} Eased value with back-out effect
   * @example
   * const value = easeOutBack(0.5); // Returns eased value
   * const valueCustom = easeOutBack(0.5, 2.0); // Returns eased value with custom magnitude
   */
  function easeOutBack (t, magnitude = 1.70158) {
    t = clamp01(t);
    if (magnitude < 0) {
      magnitude = 0;
    }
    const t1 = t - 1;
    return t1 * t1 * ((magnitude + 1) * t1 + magnitude) + 1;
  }

  /**
   * Back easing in-out - slow movement backwards, fast snap to past finish, slow resolve to finish
   * @param {number} t - Time parameter (0-1)
   * @param {number} [magnitude=1.70158] - The magnitude of the overshoot
   * @returns {number} Eased value with back-in-out effect
   * @example
   * const value = easeInOutBack(0.5); // Returns eased value
   * const valueCustom = easeInOutBack(0.5, 2.0); // Returns eased value with custom magnitude
   */
  function easeInOutBack (t, magnitude = 1.70158) {
    t = clamp01(t);
    if (magnitude < 0) {
      magnitude = 0;
    }
    const scaledTime = t * 2;
    const s = magnitude * 1.525;
    if (scaledTime < 1) {
      return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
    }
    const scaledTime2 = scaledTime - 2;
    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
  }
  /**
   * Elastic easing in - bounces slowly then quickly to finish
   * @param {number} t - Time parameter (0-1)
   * @param {number} [magnitude=0.7] - The magnitude of the elastic effect (0-1)
   * @returns {number} Eased value with elastic-in effect
   * @example
   * const value = easeInElastic(0.5); // Returns eased value
   * const valueCustom = easeInElastic(0.5, 0.8); // Returns eased value with custom magnitude
   */
  function easeInElastic (t, magnitude = 0.7) {
    t = clamp01(t);
    if (t === 0 || t === 1) {
      return t;
    }
    if (magnitude < 0) {
      magnitude = 0;
    } else if (magnitude >= 1) {
      magnitude = 0.999;
    }
    const t1 = t - 1;
    const p = 1 - magnitude;
    const s = (p / (2 * Math.PI)) * Math.asin(1);
    return -(Math.pow(2, 10 * t1) * Math.sin(((t1 - s) * (2 * Math.PI)) / p));
  }

  /**
   * Elastic easing out - fast acceleration, bounces to zero
   * @param {number} t - Time parameter (0-1)
   * @param {number} [magnitude=0.7] - The magnitude of the elastic effect (0-1)
   * @returns {number} Eased value with elastic-out effect
   * @example
   * const value = easeOutElastic(0.5); // Returns eased value
   * const valueCustom = easeOutElastic(0.5, 0.8); // Returns eased value with custom magnitude
   */
  function easeOutElastic (t, magnitude = 0.7) {
    t = clamp01(t);
    if (t === 0 || t === 1) {
      return t;
    }
    if (magnitude < 0) {
      magnitude = 0;
    } else if (magnitude >= 1) {
      magnitude = 0.999;
    }
    const p = 1 - magnitude;
    const scaledTime = t * 2;
    const s = (p / (2 * Math.PI)) * Math.asin(1);
    return Math.pow(2, -10 * scaledTime) * Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) + 1;
  }

  /**
   * Elastic easing in-out - slow start and end, two bounces sandwich a fast motion
   * @param {number} t - Time parameter (0-1)
   * @param {number} [magnitude=0.65] - The magnitude of the elastic effect (0-1)
   * @returns {number} Eased value with elastic-in-out effect
   * @example
   * const value = easeInOutElastic(0.5); // Returns eased value
   * const valueCustom = easeInOutElastic(0.5, 0.8); // Returns eased value with custom magnitude
   */
  function easeInOutElastic (t, magnitude = 0.65) {
    t = clamp01(t);
    if (t === 0 || t === 1) {
      return t;
    }
    if (magnitude < 0) {
      magnitude = 0;
    } else if (magnitude >= 1) {
      magnitude = 0.999;
    }
    const p = 1 - magnitude;
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;
    const s = (p / (2 * Math.PI)) * Math.asin(1);
    if (scaledTime < 1) {
      return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
    }
    return Math.pow(2, -10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) * 0.5 + 1;
  }

  /**
   * Bounce easing out - bounce to completion
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with bounce-out effect
   * @example
   * const value = easeOutBounce(0.5); // Returns eased value
   */
  function easeOutBounce (t) {
    t = clamp01(t);
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      const t1 = t - 1.5 / 2.75;
      return 7.5625 * t1 * t1 + 0.75;
    } else if (t < 2.5 / 2.75) {
      const t1 = t - 2.25 / 2.75;
      return 7.5625 * t1 * t1 + 0.9375;
    } else {
      const t1 = t - 2.625 / 2.75;
      return 7.5625 * t1 * t1 + 0.984375;
    }
  }

  /**
   * Bounce easing in - bounce increasing in velocity until completion
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with bounce-in effect
   * @example
   * const value = easeInBounce(0.5); // Returns eased value
   */
  function easeInBounce (t) {
    t = clamp01(t);
    return 1 - easeOutBounce(1 - t);
  }

  /**
   * Bounce easing in-out - bounce in and bounce out
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with bounce-in-out effect
   * @example
   * const value = easeInOutBounce(0.5); // Returns eased value
   */
  function easeInOutBounce (t) {
    t = clamp01(t);
    if (t < 0.5) {
      return easeInBounce(t * 2) * 0.5;
    }
    return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
  }

  /**
   * Extra smooth easing - Ken Perlin smoothstep function
   * @param {number} t - Time parameter (0-1)
   * @returns {number} Eased value with extra smooth interpolation
   * @example
   * const value = easeInOutSmoother(0.5); // Returns eased value
   */
  function easeInOutSmoother (t) {
    t = clamp01(t);
    const ts = t * t;
    const tc = ts * t;
    return 6 * tc * ts - 15 * ts * ts + 10 * tc;
  }

  //
  //  get the easing equation based on the type and direction
  //
  // Precomputed lookup map for faster function retrieval
  const EASING_FUNCTION_MAP = new Map([
    ['easeLinear', easeLinear],
    ['easeInSine', easeInSine],
    ['easeOutSine', easeOutSine],
    ['easeInOutSine', easeInOutSine],
    ['easeInQuad', easeInQuad],
    ['easeOutQuad', easeOutQuad],
    ['easeInOutQuad', easeInOutQuad],
    ['easeInCubic', easeInCubic],
    ['easeOutCubic', easeOutCubic],
    ['easeInOutCubic', easeInOutCubic],
    ['easeInQuart', easeInQuart],
    ['easeOutQuart', easeOutQuart],
    ['easeInOutQuart', easeInOutQuart],
    ['easeInQuint', easeInQuint],
    ['easeOutQuint', easeOutQuint],
    ['easeInOutQuint', easeInOutQuint],
    ['easeInExpo', easeInExpo],
    ['easeOutExpo', easeOutExpo],
    ['easeInOutExpo', easeInOutExpo],
    ['easeInCirc', easeInCirc],
    ['easeOutCirc', easeOutCirc],
    ['easeInOutCirc', easeInOutCirc],
    ['easeInBack', easeInBack],
    ['easeOutBack', easeOutBack],
    ['easeInOutBack', easeInOutBack],
    ['easeInElastic', easeInElastic],
    ['easeOutElastic', easeOutElastic],
    ['easeInOutElastic', easeInOutElastic],
    ['easeInBounce', easeInBounce],
    ['easeOutBounce', easeOutBounce],
    ['easeInOutBounce', easeInOutBounce],
    ['easeInOutSmoother', easeInOutSmoother],
  ]);

  /**
   * Retrieves the easing function based on the specified type and direction.
   *
   * @param {string} easeType - The type of easing (e.g., Quad, Cubic, etc.).
   * @param {string} easeDirection - The direction of easing (e.g., In, Out, InOut).
   * @returns {Function|null} The corresponding easing function or null if not found.
   * @example
   * const easingFunc = getEasingFunction('Quad', 'InOut');
   * const value = easingFunc(0.5);
   */
  function getEasingFunction (easeType = EASE_QUAD, easeDirection = EASE_IN_OUT) {
    let easeFunction = 'ease';

    if (easeType !== EASE_LINEAR && easeType !== EASE_SMOOTH) {
      easeFunction += easeDirection;
    }

    easeFunction += easeType;

    const f = EASING_FUNCTION_MAP.get(easeFunction);

    if (typeof f === 'function') {
      return f;
    } else {
      logError(`${easeFunction} is not a function.`);
      return null;
    }
  }

  /**
   * OpenSimplex noise implementation
   *
   * SimplexNoiseJS by Mark Spronck
   * https://github.com/blindman67/SimplexNoiseJS
   *
   * This is free and unencumbered software released into the public domain.
   * For more information, please refer to <http://unlicense.org>
   *
   * OpenSimplex noise is a gradient noise function that produces smooth,
   * natural-looking random values. It's an improvement over Perlin noise
   * with better computational performance, visual quality and free to use.
   *
   * @example
   * // Create a noise generator
   * const noise = openSimplexNoise('mySeed');
   *
   * // Generate 2D noise
   * const value2D = noise.noise2D(10.5, 20.3);
   *
   * // Generate 3D noise
   * const value3D = noise.noise3D(10.5, 20.3, 5.7);
   *
   * // Generate 4D noise
   * const value4D = noise.noise4D(10.5, 20.3, 5.7, 2.1);
   *
   * @param {string|number} [clientSeed] - Seed for the noise generator
   * @returns {Object} Noise generator with noise2D, noise3D, and noise4D methods
   *
   * @author Mark Spronck (original), Bob Corporaal (adapted)
   * @since 0.0.1
   */
  function openSimplexNoise (clientSeed) {
    const SQ5 = 2.23606797749979;
    const SQ4 = 2;
    const SQ3 = 1.7320508075688772;
    const toNums = s => s.split(',').map(s => new Uint8Array(s.split('').map(v => Number(v))));
    const decode = (m, r, s) => new Int8Array(s.split('').map(v => parseInt(v, r) + m));
    const toNumsB32 = s => s.split(',').map(s => parseInt(s, 32));
    const NORM_2D = 1.0 / 47.0;
    const NORM_3D = 1.0 / 103.0;
    const NORM_4D = 1.0 / 30.0;
    const SQUISH_2D = (SQ3 - 1) / 2;
    const SQUISH_3D = (SQ4 - 1) / 3;
    const SQUISH_4D = (SQ5 - 1) / 4;
    const STRETCH_2D = (1 / SQ3 - 1) / 2;
    const STRETCH_3D = (1 / SQ4 - 1) / 3;
    const STRETCH_4D = (1 / SQ5 - 1) / 4;
    var base2D = toNums('110101000,110101211');
    var base3D = toNums('0000110010101001,2110210120113111,110010101001211021012011');
    var base4D = toNums(
      '0000011000101001001010001,3111031101310113011141111,11000101001001010001211002101021001201102010120011,31110311013101130111211002101021001201102010120011',
    );
    const gradients2D = decode(-5, 11, 'a77a073aa3700330');
    const gradients3D = decode(-11, 23, '0ff7mf7fmmfffmfffm07f70f77mm7ff0ff7m0f77m77f0mf7fm7ff0077707770m77f07f70');
    const gradients4D = decode(
      -3,
      7,
      '6444464444644446044426442464244662444044426442460244204422642246642446244404442604242624240424266224402442044226022420242204222664424642446244400442264224622440624240424262424002422042226222406422462244024420042226222402242062224022420242200222202222022220',
    );
    var lookupPairs2D = () =>
      new Uint8Array([0, 1, 1, 0, 4, 1, 17, 0, 20, 2, 21, 2, 22, 5, 23, 5, 26, 4, 39, 3, 42, 4, 43, 3]);
    var lookupPairs3D = () =>
      new Uint16Array(
        toNumsB32(
          '0,2,1,1,2,2,5,1,6,0,7,0,10,2,12,2,41,1,45,1,50,5,51,5,g6,0,g7,0,h2,4,h6,4,k5,3,k7,3,l0,5,l1,5,l2,4,l5,3,l6,4,l7,3,l8,d,l9,d,la,c,ld,e,le,c,lf,e,m8,k,ma,i,p9,l,pd,n,q8,k,q9,l,15e,j,15f,m,16a,i,16e,j,19d,n,19f,m,1a8,f,1a9,h,1aa,f,1ad,h,1ae,g,1af,g,1ag,b,1ah,a,1ai,b,1al,a,1am,9,1an,9,1bg,b,1bi,b,1eh,a,1el,a,1fg,8,1fh,8,1qm,9,1qn,9,1ri,7,1rm,7,1ul,6,1un,6,1vg,8,1vh,8,1vi,7,1vl,6,1vm,7,1vn,6',
        ),
      );
    var lookupPairs4D = () =>
      new Uint32Array(
        toNumsB32(
          '0,3,1,2,2,3,5,2,6,1,7,1,8,3,9,2,a,3,d,2,g,3,i,3,m,1,n,1,o,3,q,3,11,2,15,2,16,1,17,1,19,2,1d,2,1m,1,1n,1,1o,0,1p,0,1q,0,1r,0,1s,0,1t,0,1u,0,1v,0,80,3,82,3,88,3,8a,3,8g,3,8i,3,8o,3,8q,3,201,2,205,2,209,2,20d,2,211,2,215,2,219,2,21d,2,280,9,281,9,288,9,289,9,g06,1,g07,1,g0m,1,g0n,1,g16,1,g17,1,g1m,1,g1n,1,g82,8,g86,8,g8i,8,g8m,8,i05,6,i07,6,i15,6,i17,6,i80,9,i81,9,i82,8,i85,6,i86,8,i87,6,i88,9,i89,9,i8i,8,i8m,8,i95,6,i97,6,401o,0,401p,0,401q,0,401r,0,401s,0,401t,0,401u,0,401v,0,408o,7,408q,7,409o,7,409q,7,4219,5,421d,5,421p,5,421t,5,4280,9,4281,9,4288,9,4289,9,428o,7,428q,7,4299,5,429d,5,429o,7,429p,5,429q,7,429t,5,4g1m,4,4g1n,4,4g1u,4,4g1v,4,4g82,8,4g86,8,4g8i,8,4g8m,8,4g8o,7,4g8q,7,4g9m,4,4g9n,4,4g9o,7,4g9q,7,4g9u,4,4g9v,4,4i05,6,4i07,6,4i15,6,4i17,6,4i19,5,4i1d,5,4i1m,4,4i1n,4,4i1p,5,4i1t,5,4i1u,4,4i1v,4,4i80,9,4i81,9,4i82,8,4i85,6,4i86,8,4i87,6,4i88,9,4i89,9,4i8i,8,4i8m,8,4i8o,7,4i8q,7,4i95,6,4i97,6,4i99,5,4i9d,5,4i9m,4,4i9n,4,4i9o,7,4i9p,5,4i9q,7,4i9t,5,4i9u,4,4i9v,4,4ia0,15,4ia1,15,4ia2,14,4ia5,12,4ia6,14,4ia7,12,4ia8,15,4ia9,15,4iai,14,4iam,14,4iao,13,4iaq,13,4ib5,12,4ib7,12,4ib9,11,4ibd,11,4ibm,10,4ibn,10,4ibo,13,4ibp,11,4ibq,13,4ibt,11,4ibu,10,4ibv,10,4ii0,1h,4ii2,1g,4ii8,1h,4iii,1g,4iio,1f,4iiq,1f,4ka1,1e,4ka5,1d,4ka9,1e,4kb5,1d,4kb9,1c,4kbd,1c,4ki0,1h,4ki1,1e,4ki8,1h,4ki9,1e,52a6,1b,52a7,1a,52am,1b,52b7,1a,52bm,19,52bn,19,52i2,1g,52i6,1b,52ii,1g,52im,1b,54a5,1d,54a7,1a,54b5,1d,54b7,1a,54i0,v,54i1,s,54i2,v,54i5,s,54i6,p,54i7,p,8ibo,18,8ibp,17,8ibq,18,8ibt,17,8ibu,16,8ibv,16,8iio,1f,8iiq,1f,8ijo,18,8ijq,18,8kb9,1c,8kbd,1c,8kbp,17,8kbt,17,8ki8,u,8ki9,r,8kio,u,8kj9,r,8kjo,m,8kjp,m,92bm,19,92bn,19,92bu,16,92bv,16,92ii,t,92im,o,92iq,t,92jm,o,92jq,l,92ju,l,94b5,q,94b7,n,94bd,q,94bn,n,94bt,k,94bv,k,94i0,v,94i1,s,94i2,v,94i5,s,94i6,p,94i7,p,94i8,u,94i9,r,94ii,t,94im,o,94io,u,94iq,t,94j5,q,94j7,n,94j9,r,94jd,q,94jm,o,94jn,n,94jo,m,94jp,m,94jq,l,94jt,k,94ju,l,94jv,k,94k0,1t,94k1,1s,94k2,1t,94k5,1s,94k6,1r,94k7,1r,94k8,1q,94k9,1p,94ki,1n,94km,1m,94ko,1q,94kq,1n,94l5,1k,94l7,1j,94l9,1p,94ld,1k,94lm,1m,94ln,1j,94lo,1o,94lp,1o,94lq,1l,94lt,1i,94lu,1l,94lv,1i,94s0,1t,94s2,1t,94s8,1q,94si,1n,94so,1q,94sq,1n,96k1,1s,96k5,1s,96k9,1p,96l5,1k,96l9,1p,96ld,1k,96s0,2f,96s1,2f,96s8,2c,96s9,2c,9kk6,1r,9kk7,1r,9kkm,1m,9kl7,1j,9klm,1m,9kln,1j,9ks2,2e,9ks6,2e,9ksi,29,9ksm,29,9mk5,2d,9mk7,2d,9ml5,26,9ml7,26,9ms0,2f,9ms1,2f,9ms2,2e,9ms5,2d,9ms6,2e,9ms7,2d,d4lo,1o,d4lp,1o,d4lq,1l,d4lt,1i,d4lu,1l,d4lv,1i,d4so,2b,d4sq,28,d4to,2b,d4tq,28,d6l9,2a,d6ld,25,d6lp,2a,d6lt,25,d6s8,2c,d6s9,2c,d6so,2b,d6t9,2a,d6to,2b,d6tp,2a,dklm,27,dkln,24,dklu,27,dklv,24,dksi,29,dksm,29,dksq,28,dktm,27,dktq,28,dktu,27,dml5,26,dml7,26,dmld,25,dmln,24,dmlt,25,dmlv,24,dms0,23,dms1,23,dms2,22,dms5,20,dms6,22,dms7,20,dms8,23,dms9,23,dmsi,22,dmsm,22,dmso,21,dmsq,21,dmt5,20,dmt7,20,dmt9,1v,dmtd,1v,dmtm,1u,dmtn,1u,dmto,21,dmtp,1v,dmtq,21,dmtt,1v,dmtu,1u,dmtv,1u,dmu0,j,dmu1,j,dmu2,i,dmu5,g,dmu6,i,dmu7,g,dmu8,j,dmu9,j,dmui,i,dmum,i,dmuo,h,dmuq,h,dmv5,g,dmv7,g,dmv9,f,dmvd,f,dmvm,e,dmvn,e,dmvo,h,dmvp,f,dmvq,h,dmvt,f,dmvu,e,dmvv,e,dn60,j,dn61,j,dn62,i,dn66,i,dn68,j,dn69,j,dn6i,i,dn6m,i,dn6o,h,dn6q,h,dn7o,h,dn7q,h,dou0,j,dou1,j,dou5,g,dou7,g,dou8,j,dou9,j,dov5,g,dov7,g,dov9,f,dovd,f,dovp,f,dovt,f,dp60,j,dp61,j,dp68,j,dp69,j,e6u2,i,e6u5,g,e6u6,i,e6u7,g,e6ui,i,e6um,i,e6v5,g,e6v7,g,e6vm,e,e6vn,e,e6vu,e,e6vv,e,e762,i,e766,i,e76i,i,e76m,i,e8u5,g,e8u7,g,e8v5,g,e8v7,g,e960,d,e961,d,e962,d,e963,d,e964,d,e965,d,e966,d,e967,d,hmuo,h,hmuq,h,hmv9,f,hmvd,f,hmvm,e,hmvn,e,hmvo,h,hmvp,f,hmvq,h,hmvt,f,hmvu,e,hmvv,e,hn6o,h,hn6q,h,hn7o,h,hn7q,h,hov9,f,hovd,f,hovp,f,hovt,f,hp68,c,hp69,c,hp6o,c,hp6p,c,hp78,c,hp79,c,hp7o,c,hp7p,c,i6vm,e,i6vn,e,i6vu,e,i6vv,e,i76i,b,i76m,b,i76q,b,i76u,b,i77i,b,i77m,b,i77q,b,i77u,b,i8v5,a,i8v7,a,i8vd,a,i8vf,a,i8vl,a,i8vn,a,i8vt,a,i8vv,a,i960,d,i961,d,i962,d,i963,d,i964,d,i965,d,i966,d,i967,d,i968,c,i969,c,i96i,b,i96m,b,i96o,c,i96p,c,i96q,b,i96u,b,i975,a,i977,a,i978,c,i979,c,i97d,a,i97f,a,i97i,b,i97l,a,i97m,b,i97n,a,i97o,c,i97p,c,i97q,b,i97t,a,i97u,b,i97v,a',
        ),
      );
    var p2D = decode(-1, 4, '112011021322233123132111');
    var p3D = decode(
      -1,
      5,
      '112011210110211120110121102132212220132122202131222022243214231243124213241324123222113311221213131221123113311112202311112022311112220342223113342223311342223131322023113322023311320223113320223131322203311322203131',
    );
    var p4D = decode(
      -1,
      6,
      '11201112101121101102111120111210110121110211112011011211012111021322112220122210132121220212212013122120221212201321122201222102131212202122120213112220122210222532215232152231253212523125221325312252132521232513225123251223232211432114231123212143121421312312214132141231232112431124211323121241312412132311224113241123342221322203311134221232202331113421223202233111342221322203131134221232202313113412223022231311342221322203113134212232022311313412223022231131342212322023111334212232022311133412223022231113322201222101111132202122120111113202212122011111322012221021111132021221202111113201222102211111322201222103311132202122120331113220122210233111322201222103131132022121220313113202122120231311322021221203113132022121220311313201222102231131322012221023111332021221202311133201222102231113422111331113222042121131311322204211213113132220422111331113220242121131311322024211123111332202422111331113202242112131131320224211123111332022421211313113022242112131131302224211123111330222443211423115222244312142131522224413214123152222443112421135222244131241213522224411324112352222443211423113222044312142131322204413214123132220443211423113220244311242113322024413124121332202443121421313202244311242113320224411324112332022441321412313022244131241213302224411324112330222',
    );

    const setOf = (count, cb = i => i) => {
      var a = [],
        i = 0;
      while (i < count) {
        a.push(cb(i++));
      }
      return a;
    };
    const doFor = (count, cb) => {
      var i = 0;
      while (i < count && cb(i++) !== true);
    };

    function shuffleSeed (seed, count = 1) {
      seed = (seed * 1664525 + 1013904223) | 0;
      count -= 1;
      return count > 0 ? shuffleSeed(seed, count) : seed;
    }
    const types = {
      _2D: {
        base: base2D,
        squish: SQUISH_2D,
        dimensions: 2,
        pD: p2D,
        lookup: lookupPairs2D,
      },
      _3D: {
        base: base3D,
        squish: SQUISH_3D,
        dimensions: 3,
        pD: p3D,
        lookup: lookupPairs3D,
      },
      _4D: {
        base: base4D,
        squish: SQUISH_4D,
        dimensions: 4,
        pD: p4D,
        lookup: lookupPairs4D,
      },
    };

    function createContribution (type, baseSet, index) {
      var i = 0;
      const multiplier = baseSet[index++];
      const c = { next: undefined };
      while (i < type.dimensions) {
        const axis = 'xyzw'[i];
        c[axis + 'sb'] = baseSet[index + i];
        c['d' + axis] = -baseSet[index + i++] - multiplier * type.squish;
      }
      return c;
    }

    function createLookupPairs (lookupArray, contributions) {
      var i;
      const a = lookupArray();
      const res = new Map();
      for (i = 0; i < a.length; i += 2) {
        res.set(a[i], contributions[a[i + 1]]);
      }
      return res;
    }

    function createContributionArray (type) {
      const conts = [];
      const d = type.dimensions;
      const baseStep = d * d;
      var k,
        i = 0;
      while (i < type.pD.length) {
        const baseSet = type.base[type.pD[i]];
        let previous, current;
        k = 0;
        do {
          current = createContribution(type, baseSet, k);
          if (!previous) {
            conts[i / baseStep] = current;
          } else {
            previous.next = current;
          }
          previous = current;
          k += d + 1;
        } while (k < baseSet.length);

        current.next = createContribution(type, type.pD, i + 1);
        if (d >= 3) {
          current.next.next = createContribution(type, type.pD, i + d + 2);
        }
        if (d === 4) {
          current.next.next.next = createContribution(type, type.pD, i + 11);
        }
        i += baseStep;
      }
      const result = [conts, createLookupPairs(type.lookup, conts)];
      type.base = undefined;
      type.lookup = undefined;
      return result;
    }

    const [contributions2D, lookup2D] = createContributionArray(types._2D); // eslint-disable-line no-unused-vars
    const [contributions3D, lookup3D] = createContributionArray(types._3D); // eslint-disable-line no-unused-vars
    const [contributions4D, lookup4D] = createContributionArray(types._4D); // eslint-disable-line no-unused-vars

    const perm = new Uint8Array(256);
    const perm2D = new Uint8Array(256);
    const perm3D = new Uint8Array(256);
    const perm4D = new Uint8Array(256);
    const source = new Uint8Array(setOf(256, i => i));
    var seed = shuffleSeed(clientSeed, 3);
    doFor(256, i => {
      i = 255 - i;
      seed = shuffleSeed(seed);
      var r = (seed + 31) % (i + 1);
      r += r < 0 ? i + 1 : 0;
      perm[i] = source[r];
      perm2D[i] = perm[i] & 0x0e;
      perm3D[i] = (perm[i] % 24) * 3;
      perm4D[i] = perm[i] & 0xfc;
      source[r] = source[i];
    });
    base2D = base3D = base4D = undefined;
    lookupPairs2D = lookupPairs3D = lookupPairs4D = undefined;
    p2D = p3D = p4D = undefined;

    const API = {
      noise2D (x, y) {
        const pD = perm2D;
        const p = perm;
        const g = gradients2D;
        const stretchOffset = (x + y) * STRETCH_2D;
        const xs = x + stretchOffset,
          ys = y + stretchOffset;
        const xsb = Math.floor(xs),
          ysb = Math.floor(ys);
        const squishOffset = (xsb + ysb) * SQUISH_2D;
        const dx0 = x - (xsb + squishOffset),
          dy0 = y - (ysb + squishOffset);
        var c = (() => {
          const xins = xs - xsb,
            yins = ys - ysb;
          const inSum = xins + yins;
          return lookup2D.get((xins - yins + 1) | (inSum << 1) | ((inSum + yins) << 2) | ((inSum + xins) << 4));
        })();
        var i,
          value = 0;
        while (c !== undefined) {
          const dx = dx0 + c.dx;
          const dy = dy0 + c.dy;
          let attn = 2 - dx * dx - dy * dy;
          if (attn > 0) {
            i = pD[(p[(xsb + c.xsb) & 0xff] + (ysb + c.ysb)) & 0xff];
            attn *= attn;
            value += attn * attn * (g[i++] * dx + g[i] * dy);
          }
          c = c.next;
        }
        return value * NORM_2D;
      },
      noise3D (x, y, z) {
        const pD = perm3D;
        const p = perm;
        const g = gradients3D;
        const stretchOffset = (x + y + z) * STRETCH_3D;
        const xs = x + stretchOffset,
          ys = y + stretchOffset,
          zs = z + stretchOffset;
        const xsb = Math.floor(xs),
          ysb = Math.floor(ys),
          zsb = Math.floor(zs);
        const squishOffset = (xsb + ysb + zsb) * SQUISH_3D;
        const dx0 = x - (xsb + squishOffset),
          dy0 = y - (ysb + squishOffset),
          dz0 = z - (zsb + squishOffset);
        var c = (() => {
          const xins = xs - xsb,
            yins = ys - ysb,
            zins = zs - zsb;
          const inSum = xins + yins + zins;
          return lookup3D.get(
            (yins - zins + 1) |
              ((xins - yins + 1) << 1) |
              ((xins - zins + 1) << 2) |
              (inSum << 3) |
              ((inSum + zins) << 5) |
              ((inSum + yins) << 7) |
              ((inSum + xins) << 9),
          );
        })();
        var i,
          value = 0;
        while (c !== undefined) {
          const dx = dx0 + c.dx,
            dy = dy0 + c.dy,
            dz = dz0 + c.dz;
          let attn = 2 - dx * dx - dy * dy - dz * dz;
          if (attn > 0) {
            i = pD[(((p[(xsb + c.xsb) & 0xff] + (ysb + c.ysb)) & 0xff) + (zsb + c.zsb)) & 0xff];
            attn *= attn;
            value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i] * dz);
          }
          c = c.next;
        }
        return value * NORM_3D;
      },
      noise4D (x, y, z, w) {
        const pD = perm4D;
        const p = perm;
        const g = gradients4D;
        const stretchOffset = (x + y + z + w) * STRETCH_4D;
        const xs = x + stretchOffset,
          ys = y + stretchOffset,
          zs = z + stretchOffset,
          ws = w + stretchOffset;
        const xsb = Math.floor(xs),
          ysb = Math.floor(ys),
          zsb = Math.floor(zs),
          wsb = Math.floor(ws);
        const squishOffset = (xsb + ysb + zsb + wsb) * SQUISH_4D;
        const dx0 = x - (xsb + squishOffset),
          dy0 = y - (ysb + squishOffset),
          dz0 = z - (zsb + squishOffset),
          dw0 = w - (wsb + squishOffset);
        var c = (() => {
          const xins = xs - xsb,
            yins = ys - ysb,
            zins = zs - zsb,
            wins = ws - wsb;
          const inSum = xins + yins + zins + wins;
          return lookup4D.get(
            (zins - wins + 1) |
              ((yins - zins + 1) << 1) |
              ((yins - wins + 1) << 2) |
              ((xins - yins + 1) << 3) |
              ((xins - zins + 1) << 4) |
              ((xins - wins + 1) << 5) |
              (inSum << 6) |
              ((inSum + wins) << 8) |
              ((inSum + zins) << 11) |
              ((inSum + yins) << 14) |
              ((inSum + xins) << 17),
          );
        })();
        var i,
          value = 0;
        while (c !== undefined) {
          const dx = dx0 + c.dx,
            dy = dy0 + c.dy,
            dz = dz0 + c.dz,
            dw = dw0 + c.dw;
          let attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
          if (attn > 0) {
            i =
              pD[(((((p[(xsb + c.xsb) & 0xff] + (ysb + c.ysb)) & 0xff) + (zsb + c.zsb)) & 0xff) + (wsb + c.wsb)) & 0xff];
            attn *= attn;
            value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i++] * dz + g[i] * dw);
          }
          c = c.next;
        }
        return value * NORM_4D;
      },
    };
    return API;
  }

  /**
   * Random number generation functions
   *
   * Pass-through functions for the internal RNG object that provide
   * convenient access to seeded random number generation.
   *
   * @namespace Random
   */

  /**
   * Ensure the global RNG is initialized before use
   * @private
   */
  function _ensureRNG () {
    if (!libraryState.RNG) {
      throw new Error('Toko: RNG is not initialized. Make sure toko.init() has been called before using random functions.');
    }
  }

  /**
   * Reset the global RNG with a new seed
   * @param {string} [seed] - New seed string. If not provided, a random seed is generated
   * @returns {string} The validated seed string
   */
  function resetRNG (seed) {
    _ensureRNG();
    libraryState.RNG.reset(seed);
  }

  /**
   * Set the current seed for the global RNG
   * @param {string} seed - New seed string
   */
  function setSeed (seed) {
    _ensureRNG();
    libraryState.RNG.seed = seed;
  }

  /**
   * Get the current seed of the global RNG
   * @returns {string} Current seed string
   */
  function getSeed () {
    _ensureRNG();
    return libraryState.RNG.seed;
  }

  /**
   * Move to the next seed in the seed history
   * @returns {string} The next seed string
   */
  function nextSeed () {
    _ensureRNG();
    return libraryState.RNG.nextSeed();
  }

  /**
   * Move to the previous seed in the seed history
   * @returns {string} The previous seed string
   */
  function previousSeed () {
    _ensureRNG();
    return libraryState.RNG.previousSeed();
  }

  /**
   * Generate a new random seed and add it to history
   * @returns {string} The new random seed string
   */
  function randomSeed () {
    _ensureRNG();
    return libraryState.RNG.randomSeed();
  }

  /**
   * Reset the RNG to the current seed string
   * @returns {string} The current seed string
   */
  function resetSeed () {
    _ensureRNG();
    return libraryState.RNG.resetSeed();
  }

  /**
   * Generate a random number or select from array
   * @param {number|Array} [min] - If number: minimum value. If array: random element from array
   * @param {number} [max] - Maximum value when min is a number
   * @returns {number|*} Random number or array element
   */
  function random$1 (min, max) {
    _ensureRNG();
    return libraryState.RNG.random(min, max);
  }

  /**
   * Generate a random integer in a range
   * @param {number} [min=0] - Minimum value (inclusive)
   * @param {number} [max=100] - Maximum value (exclusive)
   * @returns {number} Random integer
   */
  function intRange (min = 0, max = 100) {
    _ensureRNG();
    return libraryState.RNG.intRange(min, max);
  }

  /**
   * Generate a random boolean value
   * @returns {boolean} Random true or false
   */
  function randomBool () {
    _ensureRNG();
    return libraryState.RNG.randomBool();
  }

  /**
   * Generate a random character from a string
   * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - String to select from
   * @returns {string} Random character
   */
  function randomChar (inString = 'abcdefghijklmnopqrstuvwxyz') {
    _ensureRNG();
    return libraryState.RNG.randomChar(inString);
  }

  /**
   * Generate a random string of specified length
   * @param {number} [count=1] - Length of the string
   * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - Characters to choose from
   * @returns {string} Random string
   */
  function randomString (count = 1, inString = 'abcdefghijklmnopqrstuvwxyz') {
    _ensureRNG();
    return libraryState.RNG.randomString(count, inString);
  }

  /**
   * Generate a random number snapped to steps
   * @param {number} [min=0] - Minimum value
   * @param {number} [max=1] - Maximum value
   * @param {number} [step=0.1] - Step size
   * @returns {number} Random number snapped to steps
   */
  function steppedRandom (min = 0, max = 1, step = 0.1) {
    _ensureRNG();
    return libraryState.RNG.steppedRandom(min, max, step);
  }

  /**
   * Shuffle an array in place using Fisher-Yates algorithm
   * @param {Array} inArray - Array to shuffle
   * @returns {Array} The shuffled array (same reference)
   */
  function shuffle (inArray) {
    _ensureRNG();
    return libraryState.RNG.shuffle(inArray);
  }

  /**
   * Generate all integers between min and max in random order
   * @param {number} [min=0] - Minimum value (inclusive)
   * @param {number} [max=100] - Maximum value (exclusive)
   * @returns {number[]} Array of integers in random order
   */
  function intSequence (min = 0, max = 100) {
    _ensureRNG();
    return libraryState.RNG.intSequence(min, max);
  }

  /**
   * Generate a 2D unit vector in a random direction
   * @returns {p5.Vector} Random 2D unit vector
   */
  function random2DVector () {
    _ensureRNG();
    return libraryState.RNG.random2DVector();
  }

  /**
   * Generate points using Poisson Disk Sampling
   * Creates a set of points that are randomly distributed but maintain
   * a minimum distance from each other
   * @param {number} inWidth - Width of the sampling area
   * @param {number} inHeight - Height of the sampling area
   * @param {number} inRadius - Minimum distance between points
   * @returns {p5.Vector[]} Array of randomly distributed points
   */
  function poissonDisk (inWidth, inHeight, inRadius) {
    _ensureRNG();
    return libraryState.RNG.poissonDisk(inWidth, inHeight, inRadius);
  }

  /**
   * Draw a regular polygon shape
   * @param {number} x - X position of the shape center in pixels
   * @param {number} y - Y position of the shape center in pixels
   * @param {number} [size=100] - Size of the polygon in pixels
   * @param {number} [sides=6] - Number of sides (3+ for valid polygon)
   * @param {number} [spin=0] - Rotation around center in radians
   * @param {number} [shapeMode=CLOSE] - p5.js shape mode (CLOSE, OPEN, etc.)
   * @example
   * // Draw a hexagon
   * toko.plotPolygon(width/2, height/2, 100, 6);
   *
   * // Draw a rotated triangle
   * toko.plotPolygon(200, 200, 80, 3, PI/4);
   */
  function plotPolygon (x, y, size = 100, sides = 6, spin = 0, shapeMode = CLOSE) {
    let vertices = this.polygonVertices(x, y, size, sides, spin);
    this.plotVertices(vertices, shapeMode);
  }

  /**
   * Get an array of polygon vertices as p5.Vector objects
   * @param {number} x - X position of the shape center in pixels
   * @param {number} y - Y position of the shape center in pixels
   * @param {number} [size=100] - Size of the polygon in pixels
   * @param {number} [sides=6] - Number of sides (3+ for valid polygon)
   * @param {number} [spin=0] - Rotation around center in radians
   * @returns {p5.Vector[]} Array of p5.Vector objects representing polygon vertices
   * @example
   * // Get hexagon vertices
   * const vertices = toko.polygonVertices(width/2, height/2, 100, 6);
   * vertices.forEach(v => circle(v.x, v.y, 5));
   *
   * // Use vertices for custom drawing
   * const triangle = toko.polygonVertices(200, 200, 80, 3, PI/4);
   * beginShape();
   * triangle.forEach(v => vertex(v.x, v.y));
   * endShape(CLOSE);
   */
  function polygonVertices (x, y, size = 100, sides = 6, spin = 0) {
    let vertices = [];
    let sideAngle = TWO_PI / sides;
    //
    //  some adjustments to the base spin to get a more pleasing default rotation
    //  anything above 12 sides might still need some tweaks
    //
    if (sides == 3) {
      spin += PI / 6;
    } else if (sides == 5) {
      spin += 1.5 * PI;
    } else if (sides == 4) {
      spin += PI / 4;
    } else if (sides == 7) {
      spin += PI / 14;
    } else if (sides == 8) {
      spin += PI / 8;
    } else if (sides == 9) {
      spin -= PI / 18;
    } else if (sides == 11) {
      spin += PI / 22;
    } else if (sides == 12) {
      spin += PI / 12;
    }

    for (let i = 1; i < sides + 1; i++) {
      let xs = x + cos(sideAngle * i + spin) * size;
      let ys = y + sin(sideAngle * i + spin) * size;
      vertices.push(createVector(xs, ys));
    }
    return vertices;
  }

  /**
   * Plot an array of vertices as a shape
   * @param {p5.Vector[]} vertices - Array of p5.Vector objects representing shape vertices
   * @param {number} [shapeMode=CLOSE] - p5.js shape mode (CLOSE, OPEN, etc.)
   * @example
   * // Plot custom vertices
   * const vertices = [
   *   createVector(100, 100),
   *   createVector(200, 100),
   *   createVector(150, 200)
   * ];
   * toko.plotVertices(vertices);
   *
   * // Plot as open shape
   * toko.plotVertices(vertices, OPEN);
   */
  function plotVertices (vertices, shapeMode = CLOSE) {
    beginShape();
    vertices.forEach(v => {
      vertex(v.x, v.y);
    });
    endShape(shapeMode);
  }

  /**
   * Converts two points into a normalized vector with polar coordinates
   * @param {Object} fromPoint - Starting point {x, y}
   * @param {Object} toPoint - Ending point {x, y}
   * @param {Object} vector - Vector object to populate (modified in place)
   * @param {number} epsilon - Minimum length threshold for valid vectors
   */
  function calculateVector (fromPoint, toPoint, vector, epsilon) {
    // Calculate vector components
    vector.x = toPoint.x - fromPoint.x;
    vector.y = toPoint.y - fromPoint.y;

    // Calculate magnitude (length)
    vector.len = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    // Handle zero-length vectors
    if (vector.len < epsilon) {
      vector.nx = vector.ny = vector.ang = 0;
      return;
    }

    // Calculate normalized components (unit vector)
    vector.nx = vector.x / vector.len;
    vector.ny = vector.y / vector.len;

    // Calculate angle in radians
    vector.ang = Math.atan2(vector.ny, vector.nx);
  }

  /**
   * Calculates the optimal arc parameters for a vertex
   * @param {Object} currentVertex - Current vertex point
   * @param {Object} previousVertex - Previous vertex point
   * @param {Object} nextVertex - Next vertex point
   * @param {number} defaultCornerRadius - Default radius for corners
   * @param {Object} vector1 - Reusable vector object for previous edge
   * @param {Object} vector2 - Reusable vector object for next edge
   * @param {number} epsilon - Minimum length threshold for valid vectors
   * @returns {Object} Arc parameters {centerX, centerY, radius, startAngle, endAngle, numSegments}
   */
  function calculateArcParameters (
    currentVertex,
    previousVertex,
    nextVertex,
    defaultCornerRadius,
    vector1,
    vector2,
    epsilon,
  ) {
    // Calculate vectors from current vertex to previous and next vertices
    calculateVector(currentVertex, previousVertex, vector1, epsilon);
    calculateVector(currentVertex, nextVertex, vector2, epsilon);

    // Calculate the interior angle using cross product for orientation
    // Cross product gives us the sine of the angle between vectors
    const crossProduct = vector1.nx * vector2.ny - vector1.ny * vector2.nx;

    // Dot product helps determine if angle is acute or obtuse
    const dotProduct = vector1.nx * vector2.nx + vector1.ny * vector2.ny;

    // Use arcsin with clamping to prevent numerical errors
    // The max/min ensures we stay within the valid range [-1, 1]
    let interiorAngle = Math.asin(Math.max(-1, Math.min(1, crossProduct)));

    // Determine arc direction based on angle orientation
    let arcDirection = 1; // 1 for counterclockwise, -1 for clockwise

    if (dotProduct < 0) {
      // Obtuse angle case
      if (interiorAngle < 0) {
        interiorAngle = Math.PI + interiorAngle;
      } else {
        interiorAngle = Math.PI - interiorAngle;
        arcDirection = -1;
      }
    } else {
      // Acute angle case
      if (interiorAngle > 0) {
        arcDirection = -1;
      } else {
        interiorAngle = Math.PI * 2 + interiorAngle;
      }
    }

    // Use vertex-specific radius if available, otherwise use default
    const cornerRadius = currentVertex.radius !== undefined ? currentVertex.radius : defaultCornerRadius;

    // Calculate half the interior angle for arc calculations
    const halfAngle = interiorAngle / 2;

    // Handle collinear or near-collinear edges where sin(halfAngle) is zero or near-zero
    // In this case, skip rounding and return a degenerate arc (radius 0, straight line segment)
    if (Math.abs(Math.sin(halfAngle)) < epsilon) {
      return {
        centerX: currentVertex.x,
        centerY: currentVertex.y,
        radius: 0,
        startAngle: 0,
        endAngle: 0,
        angleDiff: 0,
        numSegments: 0,
      };
    }

    // Calculate the distance from vertex to arc center
    // This is derived from trigonometry: distance = radius / tan(halfAngle)
    let distanceToArcCenter = Math.abs((Math.cos(halfAngle) * cornerRadius) / Math.sin(halfAngle));

    // Prevent the arc from extending beyond the available edge length
    // This ensures the rounded corners don't overlap or extend past the polygon edges
    const maxDistance = Math.min(vector1.len / 2, vector2.len / 2);
    let actualRadius = cornerRadius;

    if (distanceToArcCenter > maxDistance) {
      // Adjust the radius to fit within the available space
      distanceToArcCenter = maxDistance;
      actualRadius = Math.abs((distanceToArcCenter * Math.sin(halfAngle)) / Math.cos(halfAngle));
    }

    // Calculate the arc center position
    // Start from the vertex and move along the "next" edge
    let arcCenterX = currentVertex.x + vector2.nx * distanceToArcCenter;
    let arcCenterY = currentVertex.y + vector2.ny * distanceToArcCenter;

    // Offset perpendicular to the edge to position the arc center correctly
    arcCenterX += -vector2.ny * actualRadius * arcDirection;
    arcCenterY += vector2.nx * actualRadius * arcDirection;

    // Calculate arc angles
    let startAngle = vector1.ang + (Math.PI / 2) * arcDirection;
    let endAngle = vector2.ang - (Math.PI / 2) * arcDirection;

    // Ensure we take the shorter arc by checking the angle difference
    let angleDiff = endAngle - startAngle;
    if (angleDiff > Math.PI) {
      angleDiff -= Math.PI * 2;
    } else if (angleDiff < -Math.PI) {
      angleDiff += Math.PI * 2;
    }

    // Calculate adaptive number of arc segments based on radius and angle
    const arcLength = Math.abs(angleDiff) * actualRadius;
    const numArcSegments = Math.max(3, Math.min(50, Math.ceil(arcLength / 5)));

    return {
      centerX: arcCenterX,
      centerY: arcCenterY,
      radius: actualRadius,
      startAngle: startAngle,
      endAngle: endAngle,
      angleDiff: angleDiff,
      numSegments: numArcSegments,
    };
  }

  /**
   * Draws an arc segment using multiple vertices
   * @param {number} centerX - Arc center X coordinate
   * @param {number} centerY - Arc center Y coordinate
   * @param {number} radius - Arc radius
   * @param {number} startAngle - Starting angle in radians
   * @param {number} angleDiff - Angle difference for the arc
   * @param {number} numSegments - Number of arc segments
   */
  function drawArcSegment (centerX, centerY, radius, startAngle, angleDiff, numSegments) {
    for (let j = 0; j <= numSegments; j++) {
      const t = j / numSegments;
      const angle = startAngle + angleDiff * t;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      vertex(x, y);
    }
  }

  /**
   * Draws a polygon or polyline with rounded corners using p5.js
   *
   * This function creates a path with rounded corners by calculating arc segments
   * at each vertex. The rounding is achieved by finding the angle between adjacent
   * edges, calculating the optimal arc radius and position, and drawing arc segments
   * that smoothly connect the edges.
   *
   * @param {Array<{x: number, y: number, radius?: number}>} points - Array of vertex points with optional per-point radius
   * @param {number} defaultCornerRadius - Default radius for all corners in pixels (can be overridden per point)
   * @param {boolean} [isPathClosed=true] - Whether to close the path (polygon) or leave it open (polyline)
   * @returns {void}
   * @example
   * // Basic closed polygon with uniform rounding
   * const points = [{x: 100, y: 100}, {x: 200, y: 100}, {x: 200, y: 200}, {x: 100, y: 200}];
   * plotRoundedVertices(points, 20);
   *
   * @example
   * // Open polyline with mixed rounding
   * const points = [
   *   {x: 50, y: 50, radius: 10},
   *   {x: 150, y: 50},
   *   {x: 150, y: 150, radius: 30}
   * ];
   * plotRoundedVertices(points, 15, false);
   */
  function plotRoundedVertices (points, defaultCornerRadius, isPathClosed = true) {
    // Early exit for invalid inputs
    if (!points || points.length < 2 || defaultCornerRadius < 0) {
      console.warn('plotRoundedVertices: Invalid parameters');
      return;
    }

    // For open paths, we need at least 2 points; for closed paths, at least 3
    if (isPathClosed && points.length < 3) {
      console.warn('plotRoundedVertices: Closed path requires at least 3 points');
      return;
    }

    const numVertices = points.length;

    // Pre-calculate constants
    const EPSILON = 1e-10;

    // Reusable vector objects to avoid repeated allocations
    const vector1 = { x: 0, y: 0, len: 0, nx: 0, ny: 0, ang: 0 };
    const vector2 = { x: 0, y: 0, len: 0, nx: 0, ny: 0, ang: 0 };

    // For open paths, we process fewer vertices (no rounding at endpoints)
    const startIndex = isPathClosed ? 0 : 1;
    const endIndex = isPathClosed ? numVertices : numVertices - 1;

    // Start with the appropriate initial point
    let previousVertex = isPathClosed ? points[numVertices - 1] : points[0];

    // Start the shape
    if (!isPathClosed) {
      noFill(); // Prevent auto-filling of open polylines
    }
    beginShape();

    // For open paths, add the first point without rounding
    if (!isPathClosed) {
      vertex(points[0].x, points[0].y);
    }

    // Process each vertex that needs rounding
    for (let i = startIndex; i < endIndex; i++) {
      const currentVertex = points[i];
      const nextVertex = points[(i + 1) % numVertices];

      // For open paths, handle the last point differently
      if (!isPathClosed && i === numVertices - 1) {
        vertex(currentVertex.x, currentVertex.y);
        break;
      }

      // Calculate arc parameters for this vertex
      const arcParams = calculateArcParameters(
        currentVertex,
        previousVertex,
        nextVertex,
        defaultCornerRadius,
        vector1,
        vector2,
        EPSILON,
      );

      // Draw the arc segment using the calculated parameters
      drawArcSegment(
        arcParams.centerX,
        arcParams.centerY,
        arcParams.radius,
        arcParams.startAngle,
        arcParams.angleDiff,
        arcParams.numSegments,
      );

      // Move to the next vertex
      previousVertex = currentVertex;
    }

    // For open paths, ensure we end at the last point
    if (!isPathClosed && numVertices > 1) {
      const lastVertex = points[numVertices - 1];
      vertex(lastVertex.x, lastVertex.y);
    }

    // End the shape
    if (isPathClosed) {
      endShape(CLOSE);
    } else {
      endShape();
    }
  }

  /**
   * Creates a linear gradient and applies it to the current drawing context.
   * The gradient transitions from one point to another in a straight line.
   *
   * @param {number} xStart - X coordinate of the gradient start position
   * @param {number} yStart - Y coordinate of the gradient start position
   * @param {number} xEnd - X coordinate of the gradient end position
   * @param {number} yEnd - Y coordinate of the gradient end position
   * @param {Array<{offset: number, color: string}>} stops - Array of color stops, each containing:
   *   - offset: Value between 0 (start) and 1 (end) defining position along gradient
   *   - color: Standard CSS color value (hex, rgb, rgba, hsl, etc.)
   *
   * @example
   * // Create a simple two-color gradient
   * const stops = [
   *   { offset: 0, color: '#ff0000' },
   *   { offset: 1, color: '#0000ff' }
   * ];
   * linearGradient(0, 0, 100, 100, stops);
   * rect(0, 0, 100, 100);
   *
   * @example
   * // Create a multi-stop gradient
   * const stops = [
   *   { offset: 0, color: 'red' },
   *   { offset: 0.5, color: 'yellow' },
   *   { offset: 1, color: 'blue' }
   * ];
   * linearGradient(50, 0, 50, 100, stops);
   * ellipse(50, 50, 80, 80);
   */
  function linearGradient (xStart, yStart, xEnd, yEnd, stops) {
    let gradient = drawingContext.createLinearGradient(xStart, yStart, xEnd, yEnd);
    stops.forEach(stop => {
      gradient.addColorStop(stop.offset, stop.color);
    });
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  }

  /**
   * Creates a radial gradient and applies it to the current drawing context.
   * The gradient radiates outward from a center point in concentric circles.
   *
   * @param {number} xStart - X coordinate of the inner circle center
   * @param {number} yStart - Y coordinate of the inner circle center
   * @param {number} rStart - Radius of the inner circle (start of gradient)
   * @param {number} xEnd - X coordinate of the outer circle center
   * @param {number} yEnd - Y coordinate of the outer circle center
   * @param {number} rEnd - Radius of the outer circle (end of gradient)
   * @param {Array<{offset: number, color: string}>} stops - Array of color stops, each containing:
   *   - offset: Value between 0 (start) and 1 (end) defining position along gradient
   *   - color: Standard CSS color value (hex, rgb, rgba, hsl, etc.)
   *
   * @example
   * // Create a simple radial gradient from center
   * const stops = [
   *   { offset: 0, color: '#ffffff' },
   *   { offset: 1, color: '#000000' }
   * ];
   * radialGradient(50, 50, 0, 50, 50, 50, stops);
   * ellipse(50, 50, 100, 100);
   *
   * @example
   * // Create an off-center radial gradient
   * const stops = [
   *   { offset: 0, color: 'rgba(255, 0, 0, 1)' },
   *   { offset: 0.7, color: 'rgba(255, 0, 0, 0.5)' },
   *   { offset: 1, color: 'rgba(255, 0, 0, 0)' }
   * ];
   * radialGradient(30, 30, 0, 50, 50, 40, stops);
   * rect(0, 0, 100, 100);
   */
  function radialGradient (xStart, yStart, rStart, xEnd, yEnd, rEnd, stops) {
    let gradient = drawingContext.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd, rEnd);
    stops.forEach(stop => {
      gradient.addColorStop(stop.offset, stop.color);
    });
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  }

  /**
   * Creates a conic (conical) gradient and applies it to the current drawing context.
   * The gradient sweeps around a center point in a circular pattern.
   *
   * @param {number} angle - Start angle in radians, measured clockwise from the positive x-axis (horizontal right)
   * @param {number} x - X coordinate of the gradient center point
   * @param {number} y - Y coordinate of the gradient center point
   * @param {Array<{offset: number, color: string}>} stops - Array of color stops, each containing:
   *   - offset: Value between 0 (start) and 1 (end) defining position around the circle
   *   - color: Standard CSS color value (hex, rgb, rgba, hsl, etc.)
   *
   * @example
   * // Create a rainbow conic gradient
   * const stops = [
   *   { offset: 0, color: '#ff0000' },
   *   { offset: 0.17, color: '#ff8000' },
   *   { offset: 0.33, color: '#ffff00' },
   *   { offset: 0.5, color: '#00ff00' },
   *   { offset: 0.67, color: '#0080ff' },
   *   { offset: 0.83, color: '#8000ff' },
   *   { offset: 1, color: '#ff0000' }
   * ];
   * conicGradient(0, 50, 50, stops);
   * ellipse(50, 50, 80, 80);
   *
   * @example
   * // Create a simple two-color conic gradient
   * const stops = [
   *   { offset: 0, color: 'white' },
   *   { offset: 0.5, color: 'black' },
   *   { offset: 1, color: 'white' }
   * ];
   * conicGradient(PI / 4, 50, 50, stops);
   * rect(0, 0, 100, 100);
   */
  function conicGradient (angle, x, y, stops) {
    let gradient = drawingContext.createConicGradient(angle, x, y);
    stops.forEach(stop => {
      gradient.addColorStop(stop.offset, stop.color);
    });
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  }

  /**
   * Generates an array of gradient stops from a Toko color scale.
   * Creates smooth color transitions by sampling the color scale at regular intervals.
   *
   * @param {Object} colors - Toko colors object with scale function and options
   * @param {Function} colors.scale - Color scale function that maps values to colors
   * @param {Object} colors.options - Color options containing domain information
   * @param {Array<number>} colors.options.domain - Array with [min, max] values for the color scale
   * @param {number} [nrStops=50] - Number of color stops to generate (default: 50)
   * @returns {Array<{offset: number, color: string}>} Array of gradient stops with offset and color properties
   *
   * @example
   * // Create gradient stops from a Toko color palette
   * const colors = getColorScale('sunset', { steps: 10 });
   * const stops = makeGradientStops(colors, 20);
   * linearGradient(0, 0, 100, 0, stops);
   * rect(0, 0, 100, 100);
   *
   * @example
   * // Create a radial gradient with many stops for smooth transitions
   * const colors = getColorScale('ocean', { steps: 5 });
   * const stops = makeGradientStops(colors, 100);
   * radialGradient(50, 50, 0, 50, 50, 50, stops);
   * ellipse(50, 50, 100, 100);
   */
  function makeGradientStops (colors, nrStops = 50) {
    let stops = [];
    for (let i = 0; i < nrStops; i++) {
      stops.push({
        offset: map(i, 0, nrStops, 0, 1),
        color: colors.scale(map(i, 0, nrStops, colors.options.domain[0], colors.options.domain[1])),
      });
    }
    return stops;
  }

  /**
   * Applies shadow effects to subsequent drawing operations.
   * Creates a drop shadow or glow effect with customizable offset, blur, and color.
   *
   * @param {number} xOffset - Horizontal offset of the shadow (positive values move shadow right)
   * @param {number} yOffset - Vertical offset of the shadow (positive values move shadow down)
   * @param {number} blur - Blur radius of the shadow (0 = no blur, higher values = more blur)
   * @param {string} color - Color of the shadow as standard CSS value, including opacity (e.g., 'rgba(0,0,0,0.5)')
   *
   * @example
   * // Create a simple drop shadow
   * shadow(5, 5, 10, 'rgba(0, 0, 0, 0.3)');
   * fill(255, 0, 0);
   * rect(50, 50, 100, 100);
   *
   * @example
   * // Create a glow effect
   * shadow(0, 0, 20, 'rgba(255, 255, 0, 0.8)');
   * fill(255, 255, 0);
   * ellipse(100, 100, 80, 80);
   *
   * @example
   * // Create an upward shadow
   * shadow(0, -10, 15, 'rgba(0, 0, 255, 0.4)');
   * fill(0, 255, 0);
   * triangle(50, 50, 100, 20, 150, 50);
   */
  function shadow (xOffset, yOffset, blur, color) {
    drawingContext.shadowOffsetX = xOffset;
    drawingContext.shadowOffsetY = yOffset;
    drawingContext.shadowBlur = blur;
    drawingContext.shadowColor = color;
  }

  /**
   * @fileoverview Transformation utility functions for p5.js creative coding.
   * Provides convenient shortcuts for rotating and scaling around specific points.
   *
   * @example
   * // Rotate a shape around its center
   * rotateAround(width/2, height/2, PI/4);
   * rect(0, 0, 100, 100);
   *
   * // Scale a shape around a specific point
   * scaleAround(mouseX, mouseY, 1.5);
   * ellipse(0, 0, 50, 50);
   */

  /**
   * Rotates the current transformation matrix around a specific point.
   * This is equivalent to translating to the point, rotating, then translating back.
   *
   * @param {number} x - X coordinate of the rotation center point
   * @param {number} y - Y coordinate of the rotation center point
   * @param {number} inAngle - Rotation angle in radians (positive values rotate clockwise)
   *
   * @example
   * // Rotate around the center of the canvas
   * rotateAround(width/2, height/2, PI/4);
   * rect(0, 0, 100, 100);
   *
   * @example
   * // Rotate around mouse position
   * rotateAround(mouseX, mouseY, frameCount * 0.01);
   * triangle(0, 0, 50, 0, 25, 50);
   */
  function rotateAround (x, y, inAngle) {
    translate(x, y);
    rotate(inAngle);
    translate(-x, -y);
  }

  /**
   * Scales the current transformation matrix around a specific point.
   * This is equivalent to translating to the point, scaling, then translating back.
   *
   * @param {number} x - X coordinate of the scaling center point
   * @param {number} y - Y coordinate of the scaling center point
   * @param {number} inScale - Scale factor (1.0 = no change, >1.0 = larger, <1.0 = smaller)
   *
   * @example
   * // Scale around the center of the canvas
   * scaleAround(width/2, height/2, 1.5);
   * rect(0, 0, 100, 100);
   *
   * @example
   * // Scale around mouse position with pulsing effect
   * let scale = 1 + sin(frameCount * 0.1) * 0.5;
   * scaleAround(mouseX, mouseY, scale);
   * ellipse(0, 0, 50, 50);
   */
  function scaleAround (x, y, inScale) {
    translate(x, y);
    scale(inScale);
    translate(-x, -y);
  }

  /**
   * Draw a circle with a radial gradient from center to edge
   * @param {number} x - X position of the circle center in pixels
   * @param {number} y - Y position of the circle center in pixels
   * @param {number} size - Diameter of the circle in pixels
   * @param {string|p5.Color} centerColor - Color at the center of the circle
   * @param {string|p5.Color} edgeColor - Color at the edge of the circle
   * @example
   * // Draw a gradient circle from white to black
   * toko.gradientCircle(width/2, height/2, 200, 'white', 'black');
   *
   * // Draw a warm gradient circle
   * toko.gradientCircle(300, 200, 150, '#ff6b6b', '#4ecdc4');
   */
  function gradientCircle (x, y, size, centerColor, edgeColor) {
    this.push();

    const steps = 50;
    const stepSize = size / (steps * 2);

    for (let i = steps; i > 0; i--) {
      const alpha = this.map(i, 0, steps, 0, 1);
      const currentColor = this.lerpColor(this.color(centerColor), this.color(edgeColor), alpha);

      this.fill(currentColor);
      this.noStroke();
      this.circle(x, y, i * stepSize * 2);
    }

    this.pop();
  }

  //
  //  BASIC GRAIN FOR IMAGES
  //
  //  Based on https://www.fxhash.xyz/article/all-about-that-grain

  /**
   * Add simple grain effect to the current canvas by shifting all pixels randomly
   * @param {number} strength - Grain strength (0-255 range, higher = more grain)
   * @example
   * // Add subtle grain
   * toko.addSimpleGrain(10);
   *
   * // Add heavy grain effect
   * toko.addSimpleGrain(50);
   */
  function addSimpleGrain (strength) {
    loadPixels();
    const d = pixelDensity();
    const pixelsCount = 4 * (width * d) * (height * d);
    for (let i = 0; i < pixelsCount; i += 4) {
      pixels[i] = pixels[i] + random(-strength, strength);
      pixels[i + 1] = pixels[i + 1] + random(-strength, strength);
      pixels[i + 2] = pixels[i + 2] + random(-strength, strength);
    }
    updatePixels();
  }

  /**
   * Add grain effect with different strength and shift values for each color channel
   * @param {Object} strength - Object with red, green, blue values (0-255 range)
   * @param {Object} shift - Object with red, green, blue shift values (can be negative)
   * @example
   * // Add grain with different channel strengths
   * toko.addChannelGrain(
   *   { red: 10, green: 20, blue: 10 },
   *   { red: -5, green: 0, blue: 5 }
   * );
   *
   * // Create warm grain effect
   * toko.addChannelGrain(
   *   { red: 15, green: 10, blue: 5 },
   *   { red: 10, green: 5, blue: 0 }
   * );
   */
  function addChannelGrain (strength, shift) {
    loadPixels();
    const d = pixelDensity();
    const pixelsCount = 4 * (width * d) * (height * d);
    for (let i = 0; i < pixelsCount; i += 4) {
      pixels[i] = pixels[i] + random(-strength.red, strength.red) + shift.red;
      pixels[i + 1] = pixels[i + 1] + random(-strength.green, strength.green) + shift.green;
      pixels[i + 2] = pixels[i + 2] + random(-strength.blue, strength.blue) + shift.blue;
    }
    updatePixels();
  }

  /**
   * Get pixel density from an image object in a cross-variant compatible way
   * @param {p5.Image|Q5.Image} image - Image object
   * @returns {number} Pixel density value (defaults to 1)
   */
  function getImagePixelDensity (image) {
    // p5.js uses pixelDensity() as a method
    if (typeof image.pixelDensity === 'function') {
      return image.pixelDensity();
    }
    // Q5.js stores it as _pixelDensity property
    if (typeof image._pixelDensity !== 'undefined') {
      return image._pixelDensity;
    }
    // Fallback to 1 if neither is available
    return 1;
  }

  /**
   * Get the RGBA color values of a specific pixel in an image
   * @param {p5.Image} image - p5.js image object (must call loadPixels() first)
   * @param {number} x - X position of the pixel
   * @param {number} y - Y position of the pixel
   * @param {number} width - Width of the referenced image
   * @returns {number[]} Array of RGBA values [red, green, blue, alpha] (0-255 range)
   * @example
   * // Load and get pixel color
   * img.loadPixels();
   * const color = toko.getPixelColor(img, 100, 50, img.width);
   * console.log(`R:${color[0]} G:${color[1]} B:${color[2]} A:${color[3]}`);
   */
  function getPixelColor (image, x, y, width) {
    if (!image || !image.pixels) {
      console.warn('Toko: getPixelColor requires an image with loaded pixels. Call loadPixels() first.');
      return [0, 0, 0, 0];
    }

    // calculate the index in the pixel array
    let d = getImagePixelDensity(image);
    let index = 4 * (y * d * width * d + x * d);

    if (index < 0 || index + 3 >= image.pixels.length) {
      console.warn('Toko: getPixelColor coordinates out of bounds.');
      return [0, 0, 0, 0];
    }

    // retrieve the color values
    let r = image.pixels[index];
    let g = image.pixels[index + 1];
    let b = image.pixels[index + 2];
    let a = image.pixels[index + 3];

    return [r, g, b, a];
  }

  /**
   * Check if a pixel's average brightness is within a threshold range
   * @param {p5.Image} image - p5.js image object (must call loadPixels() first)
   * @param {number} x - X position of the pixel
   * @param {number} y - Y position of the pixel
   * @param {number} width - Width of the referenced image
   * @param {number} [min=0] - Lower boundary value (0-255 range)
   * @param {number} [max=255] - Upper boundary value (0-255 range)
   * @returns {boolean} True if pixel brightness is within the threshold range
   * @example
   * // Check if pixel is bright
   * img.loadPixels();
   * const isBright = toko.pixelThreshold(img, 100, 50, img.width, 200, 255);
   *
   * // Check if pixel is dark
   * const isDark = toko.pixelThreshold(img, 100, 50, img.width, 0, 50);
   */
  function pixelThreshold (image, x, y, width, min = 0, max = 255) {
    if (!image || !image.pixels) {
      console.warn('Toko: pixelThreshold requires an image with loaded pixels. Call loadPixels() first.');
      return false;
    }

    // calculate the index in the pixel array
    let d = getImagePixelDensity(image);
    let index = 4 * (y * d * width * d + x * d);

    if (index < 0 || index + 2 >= image.pixels.length) {
      console.warn('Toko: pixelThreshold coordinates out of bounds.');
      return false;
    }

    // retrieve the color values
    let ave = (image.pixels[index] + image.pixels[index + 1] + image.pixels[index + 2]) / 3;
    return ave >= min && ave <= max;
  }

  /**
   * Color utility functions
   *
   * @namespace Color
   */

  /**
   * Create a p5.js color object with a hex code and alpha value
   * Simple shortcut for setting color with transparency
   *
   * @example
   * // Create a red color with 50% opacity
   * const redWithAlpha = colorAlpha('#ff0000', 128);
   *
   * // Create a blue color with full opacity
   * const blue = colorAlpha('#0000ff');
   *
   * @param {string} hexColor - Hex color code (e.g., '#ff0000' or 'ff0000')
   * @param {number} [alpha=255] - Alpha value (0-255, where 255 is fully opaque)
   * @returns {p5.Color} p5.js color object with specified alpha
   */
  function colorAlpha (hexColor, alpha = 255) {
    if (hexColor == null || hexColor === '') {
      console.warn('Toko: colorAlpha received an invalid color value.');
      return null;
    }
    let c = color(hexColor);
    // Check if setAlpha method exists (p5.js and q5.js integer mode)
    if (typeof c.setAlpha === 'function') {
      c.setAlpha(alpha);
    } else {
      // WEBGPU float mode - convert alpha from 0-255 to 0-1
      // Check color format by looking at r value (if > 1, it's integer format)
      if (c.r !== undefined && c.r > 1) {
        // Integer format - alpha is already in 0-255 range
        c.a = alpha;
      } else {
        // Float format - convert alpha from 0-255 to 0-1
        c.a = alpha / 255;
      }
    }
    return c;
  }

  var basicPalettes = [
    {
      name: 'logical',
      colors: ['#F7A13D', '#54ADFD', '#FE766C', '#112264', '#005BF7', '#FC0340'],
      stroke: '#21202E',
      background: '#F8F8F8',
      isPrimary: true,
      type: 'basic',
    },
    {
      name: '12bitRainbow', // source: https://iamkate.com/data/12-bit-rainbow/
      colors: ['#817', '#a35', '#c66', '#e94', '#ed0', '#9d5', '#4d8', '#2cb', '#0bc', '#09c', '#36b', '#639'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'lighthouse',
      colors: ['#FF0A39', '#11C3EF', '#117092', '#E7F6FE'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'darkSands',
      colors: ['#f2e9e4', '#c9ada7', '#9a8c98', '#4a4e69', '#22223b'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'indianSummer',
      colors: ['#3c2706', '#7A5649', '#CC3904', '#e5cf0a'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'summer',
      colors: ['#f5f02b', '#19AAD1'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'fadedRainbow',
      colors: ['#ef476f', '#f78c6b', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'mellowGreen',
      colors: ['#c6dabf', '#88d498', '#1a936f', '#114b5f'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'sunsetBeach',
      colors: ['#ea7317', '#fec601', '#73bfb8', '#3da5d9', '#2364aa'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'justBlack',
      colors: ['#000', '#000'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'justWhite',
      colors: ['#FFF', '#FFF'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'greyhound',
      colors: ['#696969', '#696969', '#696969', '#00A6B5'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'almostBlack',
      colors: ['#202020', '#404040'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'blackWhite',
      colors: ['#FFF', '#000'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'fullRainbow',
      colors: [
        '#1B1334',
        '#262A4A',
        '#00545A',
        '#027350',
        '#08C383',
        '#AAD962',
        '#FBBF46',
        '#EF6A32',
        '#ED0445',
        '#A12A5E',
        '#710262',
        '#110141',
      ],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'pastel',
      colors: ['#F7884B', '#E87A7A', '#B8609A', '#8F64B0', '#7171C4', '#5381E3', '#41ADD4', '#5CB592'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'brightBeach',
      colors: ['#1873D3', '#1237A1', '#00017A', '#FFDE00', '#FFB900'],
      isPrimary: false,
      type: 'basic',
    },
    // colors from d3
    {
      name: 'paired',
      colors: [
        '#A6CEE3',
        '#1F78B4',
        '#B2DF8A',
        '#33A02C',
        '#FB9A99',
        '#E31A1C',
        '#FDBF6F',
        '#FF7F00',
        '#CAB2D6',
        '#6A3D9A',
        '#FFFF99',
        '#B15928',
      ],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'sand',
      colors: ['#FCE29C', '#FCD67A', '#F0B46C', '#D59262', '#B47457', '#81514B', '#4C3C45'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'natural',
      colors: ['#F5C41E', '#F3B607', '#EC8E1E', '#8D9655', '#3E7D58', '#13404E'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'sweet',
      colors: ['#10BBB1', '#398A9B', '#DF1260', '#9D246F', '#401469'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'westCoast',
      colors: ['#D9CCC0', '#F19D1A', '#DC306A', '#7E245A', '#398589', '#093578', '#0F1A5E'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'mountain',
      colors: ['#8BBDD3', '#5396BA', '#D55F32', '#8D0805'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'freshCut',
      colors: ['#00B7D0', '#51CBD5', '#BCE849', '#A0CA00'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'mintHoney',
      colors: ['#434635', '#526D51', '#A5B17F', '#F0BF20', '#5F2A00'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'fluor',
      colors: ['#beeb00', '#D7F654', '#D3E0EA', '#8FABC1', '#507089', '#2a465c'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'district2',
      colors: ['#2A2955', '#382855', '#762754', '#E12955', '#FC2956'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'lemonade',
      colors: ['#C51645', '#C3144C', '#D34C53', '#F0AA64', '#F7C265'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'soft',
      colors: ['#F2F5E7', '#EBDED1', '#E5B5B7', '#D68097', '#B06683', '#705771', '#294353', '#0B3039'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'donut',
      colors: ['#FFB7BC', '#FF5181', '#FFCF49', '#FFA43F', '#5CCAEF'],
      isPrimary: true,
      type: 'basic',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var cakoPalettes = [
    {
      name: 'cako1',
      colors: ['#000000', '#d55a3a', '#2a5c8a', '#7e7d14', '#dbdac9'],
      stroke: '#000000',
      background: '#f4e9d5',
      type: 'cako',
    },
    {
      name: 'cako2',
      colors: ['#dbdac9', '#d55a3a', '#2a5c8a', '#b47b8c', '#7e7d14'],
      stroke: '#000000',
      background: '#000000',
      type: 'cako',
    },
    {
      name: 'cako2_sub1',
      colors: ['#dbdac9', '#d55a3a', '#2a5c8a'],
      stroke: '#000000',
      background: '#000000',
      type: 'cako',
    },
    {
      name: 'cako2_sub2',
      colors: ['#dbdac9', '#d55a3a', '#7e7d14'],
      stroke: '#000000',
      background: '#000000',
      type: 'cako',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var colourscafePalettes = [
    {
      name: 'cc239',
      colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2'],
      background: '#e0eff0',
      type: 'colourscafe',
    },
    {
      name: 'cc234',
      colors: ['#ffce49', '#ede8dc', '#ff5736', '#ff99b4'],
      background: '#f7f4ed',
      type: 'colourscafe',
    },
    {
      name: 'cc232',
      colors: ['#5c5f46', '#ff7044', '#ffce39', '#66aeaa'],
      background: '#e9ecde',
      type: 'colourscafe',
    },
    {
      name: 'cc238',
      colors: ['#553c60', '#ffb0a0', '#ff6749', '#fbe090'],
      background: '#f5e9de',
      type: 'colourscafe',
    },
    {
      name: 'cc242',
      colors: ['#bbd444', '#fcd744', '#fa7b53', '#423c6f'],
      background: '#faf4e4',
      type: 'colourscafe',
    },
    {
      name: 'cc245',
      colors: ['#0d4a4e', '#ff947b', '#ead3a2', '#5284ab'],
      background: '#f6f4ed',
      type: 'colourscafe',
    },
    {
      name: 'cc273',
      colors: ['#363d4a', '#7b8a56', '#ff9369', '#f4c172'],
      background: '#f0efe2',
      type: 'colourscafe',
    },
  ];

  //
  //  color palettes from D3
  //  see https://observablehq.com/@d3/color-schemes
  //
  var d3Palettes = [
    {
      name: 'brownGreen',
      colors: [
        '#543005',
        '#7c480a',
        '#a1661b',
        '#c28c3d',
        '#d9b671',
        '#ebd7a4',
        '#f4ead0',
        '#eef1ea',
        '#d2ece8',
        '#a8ddd5',
        '#75c3b8',
        '#429f96',
        '#197b73',
        '#045a51',
        '#003c30',
      ],
      id: 'interpolateBrBG',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'greys',
      colors: [
        '#ffffff',
        '#f6f6f6',
        '#ececec',
        '#dfdfdf',
        '#d1d1d1',
        '#c0c0c0',
        '#acacac',
        '#979797',
        '#828282',
        '#6e6e6e',
        '#5b5b5b',
        '#444444',
        '#2c2c2c',
        '#151515',
        '#000000',
      ],
      id: 'interpolateGreys',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'inferno',
      colors: [
        '#000004',
        '#0d0829',
        '#280b53',
        '#470b6a',
        '#65156e',
        '#82206c',
        '#9f2a63',
        '#bc3754',
        '#d44842',
        '#e8602d',
        '#f57d15',
        '#fc9f07',
        '#fac228',
        '#f3e55d',
        '#fcffa4',
      ],
      id: 'interpolateInferno',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'magma',
      colors: [
        '#000004',
        '#0c0926',
        '#221150',
        '#400f74',
        '#5f187f',
        '#7b2382',
        '#982d80',
        '#b73779',
        '#d3436e',
        '#eb5760',
        '#f8765c',
        '#fd9a6a',
        '#febb81',
        '#fddc9e',
        '#fcfdbf',
      ],
      id: 'interpolateMagma',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'plasma',
      colors: [
        '#0d0887',
        '#350498',
        '#5302a3',
        '#6f00a8',
        '#8b0aa5',
        '#a31e9a',
        '#b83289',
        '#cc4778',
        '#db5c68',
        '#e97158',
        '#f48849',
        '#fba238',
        '#febd2a',
        '#fada24',
        '#f0f921',
      ],
      id: 'interpolatePlasma',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'puBuGn',
      colors: [
        '#fff7fb',
        '#f4ebf5',
        '#e7e0ef',
        '#d7d6e9',
        '#c3cbe3',
        '#aac0dc',
        '#8bb4d6',
        '#69a8cf',
        '#4b9bc5',
        '#2e8fb4',
        '#14859a',
        '#057b7c',
        '#016d61',
        '#015b4a',
        '#014636',
      ],
      id: 'interpolatePuBuGn',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'rainbow',
      colors: [
        '#6e40aa',
        '#a83cb3',
        '#df40a1',
        '#ff507a',
        '#ff704e',
        '#f89b31',
        '#d2c934',
        '#aff05b',
        '#6bf75c',
        '#34f07e',
        '#1bd9ac',
        '#1fb3d3',
        '#3988e1',
        '#585fd2',
        '#6e40aa',
      ],
      id: 'interpolateRainbow',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'RedPurple',
      colors: [
        '#fff7f3',
        '#feeae6',
        '#fddcd8',
        '#fcccc9',
        '#fbb9be',
        '#faa3b6',
        '#f887ac',
        '#f369a3',
        '#e74a9b',
        '#d42d92',
        '#bb1386',
        '#9f047d',
        '#820177',
        '#650171',
        '#49006a',
      ],
      id: 'interpolateRdPu',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'sinebow',
      colors: [
        '#ff4040',
        '#f27616',
        '#cfae01',
        '#9cdd06',
        '#63f922',
        '#30fe51',
        '#0de989',
        '#00bfbf',
        '#0d89e9',
        '#3051fe',
        '#6322f9',
        '#9c06dd',
        '#cf01ae',
        '#f21676',
        '#ff4040',
      ],
      id: 'interpolateSinebow',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'spectral',
      colors: [
        '#9e0142',
        '#c42c4a',
        '#e1524a',
        '#f3784c',
        '#fba35e',
        '#fdca79',
        '#fee89a',
        '#fbf8b0',
        '#ebf7a6',
        '#ccea9f',
        '#a0d9a3',
        '#72c3a7',
        '#4ba0b1',
        '#4478b2',
        '#5e4fa2',
      ],
      id: 'interpolateSpectral',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'turbo',
      colors: [
        '#23171b',
        '#4a44bc',
        '#4076f5',
        '#2ca6f1',
        '#26d0cd',
        '#37ed9f',
        '#5ffc73',
        '#95fb51',
        '#cbe839',
        '#f5c72b',
        '#ff9b21',
        '#fb6919',
        '#d6390f',
        '#a81604',
        '#900c00',
      ],
      id: 'interpolateTurbo',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'viridis',
      colors: [
        '#440154',
        '#481b6d',
        '#46327e',
        '#3f4788',
        '#365c8d',
        '#2e6e8e',
        '#277f8e',
        '#21918c',
        '#1fa187',
        '#2db27d',
        '#4ac16d',
        '#73d056',
        '#a0da39',
        '#d0e11c',
        '#fde725',
      ],
      id: 'interpolateViridis',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'YlGnBu',
      colors: [
        '#ffffd9',
        '#f4fbc3',
        '#e5f5b6',
        '#d0ecb4',
        '#b0e0b6',
        '#8ad2ba',
        '#65c3bf',
        '#45b4c2',
        '#2ea0c1',
        '#2288ba',
        '#216daf',
        '#2353a2',
        '#213c93',
        '#182b79',
        '#081d58',
      ],
      id: 'interpolateYlGnBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'YlOrBr',
      colors: [
        '#ffffe5',
        '#ffface',
        '#fff3b6',
        '#fee89c',
        '#fed97d',
        '#fec75b',
        '#feb140',
        '#fb992c',
        '#f3821d',
        '#e66b12',
        '#d45708',
        '#bc4604',
        '#a03804',
        '#832e05',
        '#662506',
      ],
      id: 'interpolateYlOrBr',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'YlOrRd',
      colors: [
        '#ffffcc',
        '#fff5b3',
        '#ffea9a',
        '#fede82',
        '#fecd6a',
        '#feb855',
        '#fea246',
        '#fd893c',
        '#fc6932',
        '#f64828',
        '#e92a21',
        '#d71420',
        '#c00624',
        '#a20126',
        '#800026',
      ],
      id: 'interpolateYlOrRd',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'blueGreen',
      colors: [
        '#f7fcfd',
        '#ecf8fa',
        '#e1f3f5',
        '#d2eeeb',
        '#bce6dd',
        '#a0dbcc',
        '#83cfb9',
        '#68c2a3',
        '#51b68a',
        '#3da76f',
        '#2b9554',
        '#19833f',
        '#097030',
        '#015b25',
        '#00441b',
      ],
      id: 'interpolateBuGn',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'bluePurple',
      colors: [
        '#f7fcfd',
        '#eaf3f8',
        '#dae7f1',
        '#c8daea',
        '#b6cce3',
        '#a4bedb',
        '#97abd1',
        '#8f95c6',
        '#8c7dba',
        '#8b65ae',
        '#894da2',
        '#863293',
        '#7d1a7f',
        '#690a67',
        '#4d004b',
      ],
      id: 'interpolateBuPu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'cividis',
      colors: [
        '#002051',
        '#032d66',
        '#173a6d',
        '#30476e',
        '#48546d',
        '#5d616e',
        '#706e71',
        '#7f7c75',
        '#8e8978',
        '#9e9878',
        '#b1a775',
        '#c6b76c',
        '#ddc75f',
        '#f1d851',
        '#fdea45',
      ],
      id: 'interpolateCividis',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'cool',
      colors: [
        '#6e40aa',
        '#654ec0',
        '#585fd2',
        '#4973dd',
        '#3988e1',
        '#2b9ede',
        '#1fb3d3',
        '#1ac7c2',
        '#1bd9ac',
        '#24e695',
        '#34f07e',
        '#4df56a',
        '#6bf75c',
        '#8cf457',
        '#aff05b',
      ],
      id: 'interpolateCool',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'cubeHelix',
      colors: [
        '#000000',
        '#170d22',
        '#1a2442',
        '#15434f',
        '#1b6145',
        '#387434',
        '#6a7b30',
        '#a07949',
        '#c77b7b',
        '#d588b5',
        '#cda3e1',
        '#c2c4f3',
        '#c6e1f1',
        '#def4ef',
        '#ffffff',
      ],
      id: 'interpolateCubehelixDefault',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'greenBlue',
      colors: [
        '#f7fcf0',
        '#eaf7e4',
        '#ddf2d8',
        '#d1edcc',
        '#c1e7c1',
        '#acdfbb',
        '#94d6bc',
        '#7bcbc4',
        '#62bdcb',
        '#4aaccc',
        '#3597c4',
        '#2182b9',
        '#116dac',
        '#095799',
        '#084081',
      ],
      id: 'interpolateGnBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'orangeRed',
      colors: [
        '#fff7ec',
        '#feeed7',
        '#fee5c1',
        '#fdd9ab',
        '#fdcc97',
        '#fdbc86',
        '#fca771',
        '#fa8e5d',
        '#f4764f',
        '#ea5c40',
        '#dd3f2b',
        '#cc2317',
        '#b60c08',
        '#9c0101',
        '#7f0000',
      ],
      id: 'interpolateOrRd',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'purpleBlue',
      colors: [
        '#fff7fb',
        '#f4eef6',
        '#e7e3f0',
        '#d7d7e9',
        '#c3cbe3',
        '#abc0dc',
        '#90b4d6',
        '#72a8cf',
        '#519ac6',
        '#308bbe',
        '#167ab3',
        '#086aa5',
        '#045c90',
        '#034b76',
        '#023858',
      ],
      id: 'interpolatePuBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'purpleRed',
      colors: [
        '#f7f4f9',
        '#eee8f3',
        '#e4d9eb',
        '#dac5e0',
        '#d1afd5',
        '#ce98c9',
        '#d37fbd',
        '#dd63ae',
        '#e2449a',
        '#e02a81',
        '#d31967',
        '#bd0d53',
        '#a00444',
        '#830133',
        '#67001f',
      ],
      id: 'interpolatePuRd',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'RdBu',
      colors: [
        '#67001f',
        '#9a1429',
        '#c0383b',
        '#da6a57',
        '#ee9a7c',
        '#f8c3a9',
        '#fae1d3',
        '#f2efee',
        '#dae9f1',
        '#b5d7e8',
        '#85bcd9',
        '#539bc7',
        '#3079b4',
        '#195693',
        '#053061',
      ],
      id: 'interpolateRdBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'warm',
      colors: [
        '#6e40aa',
        '#8a3eb2',
        '#a83cb3',
        '#c53dad',
        '#df40a1',
        '#f4468f',
        '#ff507a',
        '#ff5e63',
        '#ff704e',
        '#ff843d',
        '#f89b31',
        '#e6b32e',
        '#d2c934',
        '#bfde43',
        '#aff05b',
      ],
      id: 'interpolateWarm',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'YlGn',
      colors: [
        '#ffffe5',
        '#fafdcd',
        '#f0f9b8',
        '#e1f3a9',
        '#ccea9d',
        '#b2df91',
        '#96d385',
        '#78c578',
        '#59b669',
        '#3fa45a',
        '#2b904b',
        '#197d40',
        '#096b39',
        '#015931',
        '#004529',
      ],
      id: 'interpolateYlGn',
      isPrimary: false,
      type: 'd3',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var dalePalettes = [
    {
      name: 'dale_paddle',
      colors: ['#ff7a5a', '#765aa6', '#fee7bc', '#515e8c', '#ffc64a', '#b460a6', '#ffffff', '#4781c1'],
      stroke: '#000000',
      background: '#abe9e8',
      type: 'dale',
    },
    {
      name: 'dale_night',
      colors: ['#ae5d9d', '#f1e8bc', '#ef8fa3', '#f7c047', '#58c9ed', '#f77150'],
      stroke: '#000000',
      background: '#00ae83',
      type: 'dale',
    },
    {
      name: 'dale_cat',
      colors: ['#f77656', '#f7f7f7', '#efc545', '#dfe0e2', '#3c70bd', '#66bee4'],
      stroke: '#000000',
      background: '#f6e0b8',
      type: 'dale',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var ducciPalettes = [
    {
      name: 'ducci_jb',
      colors: ['#395e54', '#e77b4d', '#050006', '#e55486'],
      stroke: '#050006',
      background: '#efe0bc',
      type: 'ducci',
    },
    {
      name: 'ducci_a',
      colors: ['#809498', '#d3990e', '#000000', '#ecddc5'],
      stroke: '#ecddc5',
      background: '#863f52',
      type: 'ducci',
    },
    {
      name: 'ducci_b',
      colors: ['#ecddc5', '#79b27b', '#000000', '#ac6548'],
      stroke: '#ac6548',
      background: '#d5c08e',
      type: 'ducci',
    },
    {
      name: 'ducci_d',
      colors: ['#f3cb4d', '#f2f5e3', '#20191b', '#67875c'],
      stroke: '#67875c',
      background: '#433d5f',
      type: 'ducci',
    },
    {
      name: 'ducci_e',
      colors: ['#c37c2b', '#f6ecce', '#000000', '#386a7a'],
      stroke: '#386a7a',
      background: '#e3cd98',
      type: 'ducci',
    },
    {
      name: 'ducci_f',
      colors: ['#596f7e', '#eae6c7', '#463c21', '#f4cb4c'],
      stroke: '#f4cb4c',
      background: '#e67300',
      type: 'ducci',
    },
    {
      name: 'ducci_g',
      colors: ['#c75669', '#000000', '#11706a'],
      stroke: '#11706a',
      background: '#ecddc5',
      type: 'ducci',
    },
    {
      name: 'ducci_h',
      colors: ['#6b5c6e', '#4a2839', '#d9574a'],
      stroke: '#d9574a',
      background: '#ffc34b',
      type: 'ducci',
    },
    {
      name: 'ducci_i',
      colors: ['#e9dcad', '#143331', '#ffc000'],
      stroke: '#ffc000',
      background: '#a74c02',
      type: 'ducci',
    },
    {
      name: 'ducci_j',
      colors: ['#c47c2b', '#5f5726', '#000000', '#7e8a84'],
      stroke: '#7e8a84',
      background: '#ecddc5',
      type: 'ducci',
    },
    {
      name: 'ducci_o',
      colors: ['#c15e1f', '#e4a13a', '#000000', '#4d545a'],
      stroke: '#4d545a',
      background: '#dfc79b',
      type: 'ducci',
    },
    {
      name: 'ducci_q',
      colors: ['#4bae8c', '#d0c1a0', '#2d3538'],
      stroke: '#2d3538',
      background: '#d06440',
      type: 'ducci',
    },
    {
      name: 'ducci_u',
      colors: ['#f6d700', '#f2d692', '#000000', '#5d3552'],
      stroke: '#5d3552',
      background: '#ff7426',
      type: 'ducci',
    },
    {
      name: 'ducci_v',
      colors: ['#c65f75', '#d3990e', '#000000', '#597e7a'],
      stroke: '#597e7a',
      background: '#f6eccb',
      type: 'ducci',
    },
    {
      name: 'ducci_x',
      colors: ['#dd614a', '#f5cedb', '#1a1e4f'],
      stroke: '#1a1e4f',
      background: '#fbb900',
      type: 'ducci',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var duotonePalettes = [
    {
      name: 'dt01',
      colors: ['#172a89', '#f7f7f3'],
      stroke: '#172a89',
      background: '#f3abb0',
      type: 'duotone',
    },
    {
      name: 'dt02',
      colors: ['#302956', '#f3c507'],
      stroke: '#302956',
      background: '#eee3d3',
      type: 'duotone',
    },
    {
      name: 'dt03',
      colors: ['#000000', '#a7a7a7'],
      stroke: '#000000',
      background: '#0a5e78',
      type: 'duotone',
    },
    {
      name: 'dt04',
      colors: ['#50978e', '#f7f0df'],
      stroke: '#000000',
      background: '#f7f0df',
      type: 'duotone',
    },
    {
      name: 'dt05',
      colors: ['#ee5d65', '#f0e5cb'],
      stroke: '#080708',
      background: '#f0e5cb',
      type: 'duotone',
    },
    {
      name: 'dt06',
      colors: ['#271f47', '#e7ceb5'],
      stroke: '#271f47',
      background: '#cc2b1c',
      type: 'duotone',
    },
    {
      name: 'dt07',
      colors: ['#6a98a5', '#d24c18'],
      stroke: '#efebda',
      background: '#efebda',
      type: 'duotone',
    },
    {
      name: 'dt08',
      colors: ['#5d9d88', '#ebb43b'],
      stroke: '#efebda',
      background: '#efebda',
      type: 'duotone',
    },
    {
      name: 'dt09',
      colors: ['#052e57', '#de8d80'],
      stroke: '#efebda',
      background: '#efebda',
      type: 'duotone',
    },
    {
      name: 'dt10',
      colors: ['#e5dfcf', '#151513'],
      stroke: '#151513',
      background: '#e9b500',
      type: 'duotone',
    },
    {
      name: 'dt13',
      colors: ['#f5f2d3', '#f5f2d3', '#fbd6b8'],
      stroke: '#ec5525',
      background: '#ec5525',
      type: 'duotone',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var expositoPalettes = [
    {
      name: 'exposito',
      colors: ['#8bc9c3', '#ffae43', '#ea432c', '#228345', '#d1d7d3', '#524e9c', '#9dc35e', '#f0a1a1'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
    {
      name: 'exposito_sub1',
      colors: ['#8bc9c3', '#ffae43', '#ea432c', '#524e9c'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
    {
      name: 'exposito_sub2',
      colors: ['#8bc9c3', '#ffae43', '#ea432c', '#524e9c', '#f0a1a1', '#228345'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
    {
      name: 'exposito_sub3',
      colors: ['#ffae43', '#ea432c', '#524e9c', '#f0a1a1'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var flourishPalettes = [
    {
      name: 'empusa',
      colors: ['#c92a28', '#e69301', '#1f8793', '#13652b', '#e7d8b0', '#48233b', '#e3b3ac'],
      stroke: '#1a1a1a',
      background: '#f0f0f2',
      type: 'flourish',
    },
    {
      name: 'delphi',
      colors: ['#475b62', '#7a999c', '#2a1f1d', '#fbaf3c', '#df4a33', '#f0e0c6', '#af592c'],
      stroke: '#2a1f1d',
      background: '#f0e0c6',
      type: 'flourish',
    },
    {
      name: 'mably',
      colors: ['#13477b', '#2f1b10', '#d18529', '#d72a25', '#e42184', '#138898', '#9d2787', '#7f311b'],
      stroke: '#2a1f1d',
      background: '#dfc792',
      type: 'flourish',
    },
    {
      name: 'nowak',
      colors: ['#e85b30', '#ef9e28', '#c6ac71', '#e0c191', '#3f6279', '#ee854e', '#180305'],
      stroke: '#180305',
      background: '#ede4cb',
      type: 'flourish',
    },
    {
      name: 'jupiter',
      colors: ['#c03a53', '#edd09e', '#aab5af', '#023629', '#eba735', '#8e9380', '#6c4127'],
      stroke: '#12110f',
      background: '#e6e2d6',
      type: 'flourish',
    },
    {
      name: 'hersche',
      colors: ['#df9f00', '#1f6f50', '#8e6d7f', '#da0607', '#a4a5a7', '#d3d1c3', '#42064f', '#25393a'],
      stroke: '#0a0a0a',
      background: '#f0f5f6',
      type: 'flourish',
    },
    {
      name: 'cherfi',
      colors: ['#99cb9f', '#cfb610', '#d00701', '#dba78d', '#2e2c1d', '#bfbea2', '#d2cfaf'],
      stroke: '#332e22',
      background: '#e3e2c5',
      type: 'flourish',
    },
    {
      name: 'harvest',
      colors: ['#313a42', '#9aad2e', '#f0ae3c', '#df4822', '#8eac9b', '#cc3d3f', '#ec8b1c', '#1b9268'],
      stroke: '#463930',
      background: '#e5e2cf',
      type: 'flourish',
    },
    {
      name: 'honey',
      colors: ['#f14d42', '#f4fdec', '#4fbe5d', '#265487', '#f6e916', '#f9a087', '#2e99d6'],
      stroke: '#141414',
      background: '#f4fdec',
      type: 'flourish',
    },
    {
      name: 'jungle',
      colors: ['#adb100', '#e5f4e9', '#f4650f', '#4d6838', '#cb9e00', '#689c7d', '#e2a1a8', '#151c2e'],
      stroke: '#0e0f27',
      background: '#cecaa9',
      type: 'flourish',
    },
    {
      name: 'skyspider',
      colors: ['#f4b232', '#f2dbbd', '#01799c', '#e93e48', '#0b1952', '#006748', '#ed817d'],
      stroke: '#050505',
      background: '#f0dbbc',
      type: 'flourish',
    },
    {
      name: 'atlas',
      colors: ['#5399b1', '#f4e9d5', '#de4037', '#ed942f', '#4e9e48', '#7a6e62'],
      stroke: '#3d352b',
      background: '#f0c328',
      type: 'flourish',
    },
    {
      name: 'giftcard',
      colors: [
        '#FBF5E9',
        '#FF514E',
        '#FDBC2E',
        '#4561CC',
        '#2A303E',
        '#6CC283',
        '#A71172',
        '#238DA5',
        '#9BD7CB',
        '#231E58',
        '#4E0942',
      ],
      stroke: '#000',
      background: '#FBF5E9',
      type: 'flourish',
    },
    {
      name: 'giftcard_sub',
      colors: ['#FBF5E9', '#FF514E', '#FDBC2E', '#4561CC', '#2A303E', '#6CC283', '#238DA5', '#9BD7CB'],
      stroke: '#000',
      background: '#FBF5E9',
      type: 'flourish',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var golidmiscPalettes = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4',
      type: 'golid',
    },
    {
      name: 'winter-night',
      colors: ['#122438', '#dd672e', '#87c7ca', '#ebebeb'],
      background: '#ebebeb',
      type: 'golid',
    },
    {
      name: 'saami',
      colors: ['#eab700', '#e64818', '#2c6393', '#eecfca'],
      background: '#e7e6e4',
      type: 'golid',
    },
    {
      name: 'knotberry1',
      colors: ['#20342a', '#f74713', '#686d2c', '#e9b4a6'],
      background: '#e5ded8',
      type: 'golid',
    },
    {
      name: 'knotberry2',
      colors: ['#1d3b1a', '#eb4b11', '#e5bc00', '#f29881'],
      background: '#eae2d0',
      type: 'golid',
    },
    {
      name: 'tricolor',
      colors: ['#ec643b', '#56b7ab', '#f8cb57', '#1f1e43'],
      background: '#f7f2df',
      type: 'golid',
    },
    {
      name: 'foxshelter',
      colors: ['#ff3931', '#007861', '#311f27', '#bab9a4'],
      background: '#dddddd',
      type: 'golid',
    },
    {
      name: 'hermes',
      colors: ['#253852', '#51222f', '#b53435', '#ecbb51'],
      background: '#eeccc2',
      type: 'golid',
    },
    {
      name: 'olympia',
      colors: ['#ff3250', '#ffb33a', '#008c36', '#0085c6', '#4c4c4c'],
      stroke: '#0b0b0b',
      background: '#faf2e5',
      type: 'golid',
    },
    {
      name: 'byrnes',
      colors: ['#c54514', '#dca215', '#23507f'],
      stroke: '#0b0b0b',
      background: '#e8e7d4',
      type: 'golid',
    },
    {
      name: 'butterfly',
      colors: ['#f40104', '#f6c0b3', '#99673a', '#f0f1f4'],
      stroke: '#191e36',
      background: '#191e36',
      type: 'golid',
    },
    {
      name: 'floratopia',
      colors: ['#bf4a2b', '#cd902a', '#4e4973', '#f5d4bc'],
      stroke: '#1e1a43',
      background: '#1e1a43',
      type: 'golid',
    },
    {
      name: 'verena',
      colors: ['#f1594a', '#f5b50e', '#14a160', '#2969de', '#885fa4'],
      stroke: '#1a1a1a',
      background: '#e2e6e8',
      type: 'golid',
    },
    {
      name: 'florida_citrus',
      colors: ['#ea7251', '#ebf7f0', '#02aca5'],
      stroke: '#050100',
      background: '#9ae2d3',
      type: 'golid',
    },
    {
      name: 'lemon_citrus',
      colors: ['#e2d574', '#f1f4f7', '#69c5ab'],
      stroke: '#463231',
      background: '#f79eac',
      type: 'golid',
    },
    {
      name: 'yuma_punk',
      colors: ['#f05e3b', '#ebdec4', '#ffdb00'],
      stroke: '#ebdec4',
      background: '#161616',
      type: 'golid',
    },
    {
      name: 'yuma_punk2',
      colors: ['#f2d002', '#f7f5e1', '#ec643b'],
      stroke: '#19080e',
      background: '#f7f5e1',
      type: 'golid',
    },
    {
      name: 'moir',
      colors: ['#a49f4f', '#d4501e', '#f7c558', '#ebbaa6'],
      stroke: '#161716',
      background: '#f7f4ef',
      type: 'golid',
    },
    {
      name: 'sprague',
      colors: ['#ec2f28', '#f8cd28', '#1e95bb', '#fbaab3', '#fcefdf'],
      stroke: '#221e1f',
      background: '#fcefdf',
      type: 'golid',
    },
    {
      name: 'bloomberg',
      colors: ['#ff5500', '#f4c145', '#144714', '#2f04fc', '#e276af'],
      stroke: '#000',
      background: '#fff3dd',
      type: 'golid',
    },
    {
      name: 'revolucion',
      colors: ['#ed555d', '#fffcc9', '#41b797', '#eda126', '#7b5770'],
      stroke: '#fffcc9',
      background: '#2d1922',
      type: 'golid',
    },
    {
      name: 'sneaker',
      colors: ['#e8165b', '#401e38', '#66c3b4', '#ee7724', '#584098'],
      stroke: '#401e38',
      background: '#ffffff',
      type: 'golid',
    },
    {
      name: 'miradors',
      colors: ['#ff6936', '#fddc3f', '#0075ca', '#00bb70'],
      stroke: '#ffffff',
      background: '#020202',
      type: 'golid',
    },
    {
      name: 'kaffeprat',
      colors: ['#BCAA8C', '#D8CDBE', '#484A42', '#746B58', '#9A8C73'],
      stroke: '#000',
      background: '#fff',
      type: 'golid',
    },
    {
      name: 'jrmy',
      colors: ['#df456c', '#ea6a82', '#270b32', '#471e43'],
      stroke: '#270b32',
      background: '#ef9198',
      type: 'golid',
    },
    {
      name: 'animo',
      colors: ['#f6c103', '#f6f6f6', '#d1cdc7', '#e7e6e5'],
      stroke: '#010001',
      background: '#f5f5f5',
      type: 'golid',
    },
    {
      name: 'book',
      colors: ['#be1c24', '#d1a082', '#037b68', '#d8b1a5', '#1c2738', '#c95a3f'],
      stroke: '#0e0f27',
      background: '#f5b28a',
      type: 'golid',
    },
    {
      name: 'juxtapoz',
      colors: ['#20357e', '#f44242', '#ffffff'],
      stroke: '#000000',
      background: '#cfc398',
      type: 'golid',
    },
    {
      name: 'hurdles',
      colors: ['#e16503', '#dc9a0f', '#dfe2b4', '#66a7a6'],
      stroke: '#3c1c03',
      background: '#3c1c03',
      type: 'golid',
    },
    {
      name: 'ludo',
      colors: ['#df302f', '#e5a320', '#0466b3', '#0f7963'],
      stroke: '#272621',
      background: '#dedccd',
      type: 'golid',
    },
    {
      name: 'riff',
      colors: ['#e24724', '#c7c7c7', '#1f3e7c', '#d29294', '#010203'],
      stroke: '#010203',
      background: '#f2f2f2',
      type: 'golid',
    },
    {
      name: 'san ramon',
      colors: ['#4f423a', '#f6a74b', '#589286', '#f8e9e2', '#2c2825'],
      stroke: '#2c2825',
      background: '#fff',
      type: 'golid',
    },
    {
      name: 'one-dress',
      colors: ['#1767D2', '#FFFFFF', '#F9AB00', '#212121'],
      stroke: '#212121',
      background: '#fff',
      type: 'golid',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var hildaPalettes = [
    {
      name: 'hilda01',
      colors: ['#ec5526', '#f4ac12', '#9ebbc1', '#f7f4e2'],
      stroke: '#1e1b1e',
      background: '#e7e8d4',
      type: 'hilda',
    },
    {
      name: 'hilda02',
      colors: ['#eb5627', '#eebb20', '#4e9eb8', '#f7f5d0'],
      stroke: '#201d13',
      background: '#77c1c0',
      type: 'hilda',
    },
    {
      name: 'hilda03',
      colors: ['#e95145', '#f8b917', '#b8bdc1', '#ffb2a2'],
      stroke: '#010101',
      background: '#6b7752',
      type: 'hilda',
    },
    {
      name: 'hilda04',
      colors: ['#e95145', '#f6bf7a', '#589da1', '#f5d9bc'],
      stroke: '#000001',
      background: '#f5ede1',
      type: 'hilda',
    },
    {
      name: 'hilda05',
      colors: ['#ff6555', '#ffb58f', '#d8eecf', '#8c4b47', '#bf7f93'],
      stroke: '#2b0404',
      background: '#ffda82',
      type: 'hilda',
    },
    {
      name: 'hilda06',
      colors: ['#f75952', '#ffce84', '#74b7b2', '#f6f6f6', '#b17d71'],
      stroke: '#0e0603',
      background: '#f6ecd4',
      type: 'hilda',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var iivonenPalettes = [
    {
      name: 'iiso_zeitung',
      colors: ['#ee8067', '#f3df76', '#00a9c0', '#f7ab76'],
      stroke: '#111a17',
      background: '#f5efcb',
      type: 'iivonen',
    },
    {
      name: 'iiso_curcuit',
      colors: ['#f0865c', '#f2b07b', '#6bc4d2', '#1a3643'],
      stroke: '#0f1417',
      background: '#f0f0e8',
      type: 'iivonen',
    },
    {
      name: 'iiso_airlines',
      colors: ['#fe765a', '#ffb468', '#4b588f', '#faf1e0'],
      stroke: '#1c1616',
      background: '#fae5c8',
      type: 'iivonen',
    },
    {
      name: 'iiso_daily',
      colors: ['#e76c4a', '#f0d967', '#7f8cb6', '#1daeb1', '#ef9640'],
      stroke: '#000100',
      background: '#e2ded2',
      type: 'iivonen',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var judsonPalettes = [
    {
      name: 'jud_playground',
      colors: ['#f04924', '#fcce09', '#408ac9'],
      stroke: '#2e2925',
      background: '#ffffff',
      type: 'judson',
    },
    {
      name: 'jud_horizon',
      colors: ['#f8c3df', '#f2e420', '#28b3d0', '#648731', '#ef6a7d'],
      stroke: '#030305',
      background: '#f2f0e1',
      type: 'judson',
    },
    {
      name: 'jud_mural',
      colors: ['#ca3122', '#e5af16', '#4a93a2', '#0e7e39', '#e2b9bd'],
      stroke: '#1c1616',
      background: '#e3ded8',
      type: 'judson',
    },
    {
      name: 'jud_cabinet',
      colors: ['#f0afb7', '#f6bc12', '#1477bb', '#41bb9b'],
      stroke: '#020508',
      background: '#e3ded8',
      type: 'judson',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var jungPalettes = [
    {
      name: 'jung_bird',
      colors: ['#fc3032', '#fed530', '#33c3fb', '#ff7bac', '#fda929'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_horse',
      colors: ['#e72e81', '#f0bf36', '#3056a2'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_croc',
      colors: ['#f13274', '#eed03e', '#405e7f', '#19a198'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_hippo',
      colors: ['#ff7bac', '#ff921e', '#3ea8f5', '#7ac943'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_wolf',
      colors: ['#e51c39', '#f1b844', '#36c4b7', '#666666'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var kovecsesPalettes = [
    {
      name: 'kov_01',
      colors: ['#d24c23', '#7ba6bc', '#f0c667', '#ede2b3', '#672b35', '#142a36'],
      stroke: '#132a37',
      background: '#108266',
      type: 'kovesecs',
    },
    {
      name: 'kov_02',
      colors: ['#e8dccc', '#e94641', '#eeaeae'],
      stroke: '#e8dccc',
      background: '#6c96be',
      type: 'kovesecs',
    },
    {
      name: 'kov_03',
      colors: ['#e3937b', '#d93f1d', '#090d15', '#e6cca7'],
      stroke: '#090d15',
      background: '#558947',
      type: 'kovesecs',
    },
    {
      name: 'kov_04',
      colors: ['#d03718', '#292b36', '#33762f', '#ead7c9', '#ce7028', '#689d8d'],
      stroke: '#292b36',
      background: '#deb330',
      type: 'kovesecs',
    },
    {
      name: 'kov_05',
      colors: ['#de3f1a', '#de9232', '#007158', '#e6cdaf', '#869679'],
      stroke: '#010006',
      background: '#7aa5a6',
      type: 'kovesecs',
    },
    {
      name: 'kov_06',
      colors: ['#a87c2a', '#bdc9b1', '#f14616', '#ecbfaf', '#017724', '#0e2733', '#2b9ae9'],
      stroke: '#292319',
      background: '#dfd4c1',
      type: 'kovesecs',
    },
    {
      name: 'kov_06b',
      colors: ['#d57846', '#dfe0cc', '#de442f', '#e7d3c5', '#5ec227', '#302f35', '#63bdb3'],
      stroke: '#292319',
      background: '#dfd4c1',
      type: 'kovesecs',
    },
    {
      name: 'kov_07',
      colors: ['#c91619', '#fdecd2', '#f4a000', '#4c2653'],
      stroke: '#111',
      background: '#89c2cd',
      type: 'kovesecs',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var mayoPalettes = [
    {
      name: 'mayo1',
      colors: ['#ea510e', '#ffd203', '#0255a3', '#039177', '#111111'],
      stroke: '#111111',
      background: '#fff',
      type: 'mayo',
    },
    {
      name: 'mayo2',
      colors: ['#ea663f', '#f9cc27', '#84afd7', '#7ca994', '#f1bbc9', '#242424'],
      stroke: '#2a2a2a',
      background: '#f5f6f1',
      type: 'mayo',
    },
    {
      name: 'mayo3',
      colors: ['#ea5b19', '#f8c9b9', '#137661', '#2a2a2a'],
      stroke: '#2a2a2a',
      background: '#f5f4f0',
      type: 'mayo',
    },
  ];

  //
  //  metbrewer color palettes
  //  https://github.com/BlakeRMills/metbrewer
  //
  var metbrewerPalettes = [
    {
      name: 'archambault',
      colors: ['#88a0dc', '#381a61', '#7c4b73', '#ed968c', '#ab3329', '#e78429', '#f9d14a'],
      isPrimary: true,
      sortOrder: [2, 7, 5, 1, 6, 4, 3],
      type: 'metbrewer',
    },
    {
      name: 'austria',
      colors: ['#a40000', '#16317d', '#007e2f', '#ffcd12', '#b86092', '#721b3e', '#00b7a7'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 6, 5, 7],
      type: 'metbrewer',
    },
    {
      name: 'benedictus',
      colors: [
        '#9a133d',
        '#b93961',
        '#d8527c',
        '#f28aaa',
        '#f9b4c9',
        '#f9e0e8',
        '#ffffff',
        '#eaf3ff',
        '#c5daf6',
        '#a1c2ed',
        '#6996e3',
        '#4060c8',
        '#1a318b',
      ],
      isPrimary: true,
      sortOrder: [9, 5, 11, 1, 7, 3, 13, 4, 8, 2, 12, 6, 10],
      type: 'metbrewer',
    },
    {
      name: 'cassatt1',
      colors: ['#b1615c', '#d88782', '#e3aba7', '#edd7d9', '#c9c9dd', '#9d9dc7', '#8282aa', '#5a5a83'],
      isPrimary: true,
      sortOrder: [3, 6, 1, 8, 4, 5, 2, 7],
      type: 'metbrewer',
    },
    {
      name: 'cassatt2',
      colors: [
        '#2d223c',
        '#574571',
        '#90719f',
        '#b695bc',
        '#dec5da',
        '#c1d1aa',
        '#7fa074',
        '#466c4b',
        '#2c4b27',
        '#0e2810',
      ],
      isPrimary: true,
      sortOrder: [7, 3, 9, 1, 5, 6, 2, 10, 4, 8],
      type: 'metbrewer',
    },
    {
      name: 'cross',
      colors: ['#c969a1', '#ce4441', '#ee8577', '#eb7926', '#ffbb44', '#859b6c', '#62929a', '#004f63', '#122451'],
      isPrimary: true,
      sortOrder: [4, 7, 1, 8, 2, 6, 3, 5, 9],
      type: 'metbrewer',
    },
    {
      name: 'degas',
      colors: ['#591d06', '#96410e', '#e5a335', '#556219', '#418979', '#2b614e', '#053c29'],
      isPrimary: true,
      sortOrder: [5, 2, 1, 3, 4, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'demuth',
      colors: [
        '#591c19',
        '#9b332b',
        '#b64f32',
        '#d39a2d',
        '#f7c267',
        '#b9b9b8',
        '#8b8b99',
        '#5d6174',
        '#41485f',
        '#262d42',
      ],
      isPrimary: true,
      sortOrder: [5, 2, 1, 3, 4, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'derain',
      colors: ['#efc86e', '#97c684', '#6f9969', '#aab5d5', '#808fe1', '#5c66a8', '#454a74'],
      isPrimary: true,
      sortOrder: [4, 2, 5, 7, 1, 3, 6],
      type: 'metbrewer',
    },
    {
      name: 'egypt',
      colors: ['#dd5129', '#0f7ba2', '#43b284', '#fab255'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'metbrewer',
    },
    {
      name: 'gauguin',
      colors: ['#b04948', '#811e18', '#9e4013', '#c88a2c', '#4c6216', '#1a472a'],
      isPrimary: true,
      sortOrder: [2, 5, 4, 3, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'greek',
      colors: ['#3c0d03', '#8d1c06', '#e67424', '#ed9b49', '#f5c34d'],
      isPrimary: true,
      sortOrder: [2, 3, 5, 1, 4],
      type: 'metbrewer',
    },
    {
      name: 'hiroshige',
      colors: [
        '#e76254',
        '#ef8a47',
        '#f7aa58',
        '#ffd06f',
        '#ffe6b7',
        '#aadce0',
        '#72bcd5',
        '#528fad',
        '#376795',
        '#1e466e',
      ],
      isPrimary: true,
      sortOrder: [6, 2, 9, 3, 7, 5, 1, 10, 4, 8],
      type: 'metbrewer',
    },
    {
      name: 'hokusai1',
      colors: ['#6d2f20', '#b75347', '#df7e66', '#e09351', '#edc775', '#94b594', '#224b5e'],
      isPrimary: true,
      sortOrder: [2, 7, 4, 6, 5, 1, 3],
      type: 'metbrewer',
    },
    {
      name: 'hokusai2',
      colors: ['#abc9c8', '#72aeb6', '#4692b0', '#2f70a1', '#134b73', '#0a3351'],
      isPrimary: true,
      sortOrder: [5, 2, 4, 1, 6, 3],
      type: 'metbrewer',
    },
    {
      name: 'hokusai3',
      colors: ['#d8d97a', '#95c36e', '#74c8c3', '#5a97c1', '#295384', '#0a2e57'],
      isPrimary: true,
      sortOrder: [4, 2, 5, 3, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'homer1',
      colors: ['#551f00', '#a62f00', '#df7700', '#f5b642', '#fff179', '#c3f4f6', '#6ad5e8', '#32b2da'],
      isPrimary: true,
      sortOrder: [6, 3, 2, 7, 4, 8, 5, 1],
      type: 'metbrewer',
    },
    {
      name: 'homer2',
      colors: ['#bf3626', '#e9724c', '#e9851d', '#f9c53b', '#aeac4c', '#788f33', '#165d43'],
      isPrimary: true,
      sortOrder: [3, 7, 1, 4, 6, 2, 5],
      type: 'metbrewer',
    },
    {
      name: 'ingres',
      colors: ['#041d2c', '#06314e', '#18527e', '#2e77ab', '#d1b252', '#a97f2f', '#7e5522', '#472c0b'],
      isPrimary: true,
      sortOrder: [4, 5, 3, 6, 2, 7, 1, 8],
      type: 'metbrewer',
    },
    {
      name: 'isfahan1',
      colors: ['#4e3910', '#845d29', '#d8c29d', '#4fb6ca', '#178f92', '#175f5d', '#1d1f54'],
      isPrimary: true,
      sortOrder: [5, 2, 4, 6, 1, 7, 3],
      type: 'metbrewer',
    },
    {
      name: 'isfahan2',
      colors: ['#d7aca1', '#ddc000', '#79ad41', '#34b6c6', '#4063a3'],
      isPrimary: true,
      sortOrder: [4, 2, 3, 5, 1],
      type: 'metbrewer',
    },
    {
      name: 'java',
      colors: ['#663171', '#cf3a36', '#ea7428', '#e2998a', '#0c7156'],
      isPrimary: true,
      sortOrder: [1, 4, 2, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'johnson',
      colors: ['#a00e00', '#d04e00', '#f6c200', '#0086a8', '#132b69'],
      isPrimary: true,
      sortOrder: [3, 1, 4, 2, 5],
      type: 'metbrewer',
    },
    {
      name: 'juarez',
      colors: ['#a82203', '#208cc0', '#f1af3a', '#cf5e4e', '#637b31', '#003967'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'metbrewer',
    },
    {
      name: 'kandinsky',
      colors: ['#3b7c70', '#ce9642', '#898e9f', '#3b3a3e'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'metbrewer',
    },
    {
      name: 'klimt',
      colors: ['#df9ed4', '#c93f55', '#eacc62', '#469d76', '#3c4b99', '#924099'],
      isPrimary: true,
      sortOrder: [5, 2, 3, 4, 6, 1],
      type: 'metbrewer',
    },
    {
      name: 'lakota',
      colors: ['#04a3bd', '#f0be3d', '#931e18', '#da7901', '#247d3f', '#20235b'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'metbrewer',
    },
    {
      name: 'manet',
      colors: [
        '#3b2319',
        '#80521c',
        '#d29c44',
        '#ebc174',
        '#ede2cc',
        '#7ec5f4',
        '#4585b7',
        '#225e92',
        '#183571',
        '#43429b',
        '#5e65be',
      ],
      isPrimary: true,
      sortOrder: [8, 3, 10, 4, 7, 9, 11, 2, 6, 1, 5],
      type: 'metbrewer',
    },
    {
      name: 'monet',
      colors: ['#4e6d58', '#749e89', '#abccbe', '#e3cacf', '#c399a2', '#9f6e71', '#41507b', '#7d87b2', '#c2cae3'],
      isPrimary: true,
      sortOrder: [2, 5, 8, 3, 4, 9, 1, 6, 7],
      type: 'metbrewer',
    },
    {
      name: 'moreau',
      colors: ['#421600', '#792504', '#bc7524', '#8dadca', '#527baa', '#104839', '#082844'],
      isPrimary: true,
      sortOrder: [2, 5, 3, 4, 7, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'morgenstern',
      colors: ['#7c668c', '#b08ba5', '#dfbbc8', '#ffc680', '#ffb178', '#db8872', '#a56457'],
      isPrimary: true,
      sortOrder: [7, 5, 4, 6, 3, 2, 1],
      type: 'metbrewer',
    },
    {
      name: 'nattier',
      colors: ['#52271c', '#944839', '#c08e39', '#7f793c', '#565c33', '#184948', '#022a2a'],
      isPrimary: true,
      sortOrder: [1, 6, 3, 4, 7, 2, 5],
      type: 'metbrewer',
    },
    {
      name: 'navajo',
      colors: ['#660d20', '#e59a52', '#edce79', '#094568', '#e1c59a'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5],
      type: 'metbrewer',
    },
    {
      name: 'newkingdom',
      colors: ['#e1846c', '#9eb4e0', '#e6bb9e', '#9c6849', '#735852'],
      isPrimary: true,
      sortOrder: [2, 1, 3, 4, 5],
      type: 'metbrewer',
    },
    {
      name: 'nizami',
      colors: ['#dd7867', '#b83326', '#c8570d', '#edb144', '#8cc8bc', '#7da7ea', '#5773c0', '#1d4497'],
      isPrimary: true,
      sortOrder: [5, 2, 6, 8, 3, 7, 4, 1],
      type: 'metbrewer',
    },
    {
      name: 'okeeffe1',
      colors: [
        '#6b200c',
        '#973d21',
        '#da6c42',
        '#ee956a',
        '#fbc2a9',
        '#f6f2ee',
        '#bad6f9',
        '#7db0ea',
        '#447fdd',
        '#225bb2',
        '#133e7e',
      ],
      isPrimary: true,
      sortOrder: [8, 6, 1, 4, 10, 3, 11, 5, 2, 7, 9],
      type: 'metbrewer',
    },
    {
      name: 'okeeffe2',
      colors: ['#fbe3c2', '#f2c88f', '#ecb27d', '#e69c6b', '#d37750', '#b9563f', '#92351e'],
      isPrimary: true,
      sortOrder: [7, 1, 6, 4, 2, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'paquin',
      colors: [
        '#831818',
        '#c62320',
        '#f05b43',
        '#f78462',
        '#feac81',
        '#f7dea3',
        '#ced1af',
        '#98ab76',
        '#748f46',
        '#47632a',
        '#275024',
      ],
      isPrimary: true,
      sortOrder: [10, 6, 1, 8, 4, 3, 5, 9, 2, 7, 11],
      type: 'metbrewer',
    },
    {
      name: 'peru1',
      colors: ['#b5361c', '#e35e28', '#1c9d7c', '#31c7ba', '#369cc9', '#3a507f'],
      isPrimary: true,
      sortOrder: [3, 1, 5, 2, 4, 6],
      type: 'metbrewer',
    },
    {
      name: 'peru2',
      colors: ['#65150b', '#961f1f', '#c0431f', '#b36c06', '#f19425', '#c59349', '#533d14'],
      isPrimary: true,
      sortOrder: [4, 1, 3, 5, 2, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'pillement',
      colors: ['#a9845b', '#697852', '#738e8e', '#44636f', '#2b4655', '#0f252f'],
      isPrimary: true,
      sortOrder: [4, 3, 2, 5, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'pissaro',
      colors: ['#134130', '#4c825d', '#8cae9e', '#8dc7dc', '#508ca7', '#1a5270', '#0e2a4d'],
      isPrimary: true,
      sortOrder: [6, 2, 4, 1, 7, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'redon',
      colors: [
        '#5b859e',
        '#1e395f',
        '#75884b',
        '#1e5a46',
        '#df8d71',
        '#af4f2f',
        '#d48f90',
        '#732f30',
        '#ab84a5',
        '#59385c',
        '#d8b847',
        '#b38711',
      ],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      type: 'metbrewer',
    },
    {
      name: 'renoir',
      colors: [
        '#17154f',
        '#2f357c',
        '#6c5d9e',
        '#9d9cd5',
        '#b0799a',
        '#f6b3b0',
        '#e48171',
        '#bf3729',
        '#e69b00',
        '#f5bb50',
        '#ada43b',
        '#355828',
      ],
      isPrimary: true,
      sortOrder: [2, 5, 9, 12, 3, 8, 7, 10, 4, 1, 6, 11],
      type: 'metbrewer',
    },
    {
      name: 'robert',
      colors: ['#11341a', '#375624', '#6ca4a0', '#487a7c', '#18505f', '#062e3d'],
      isPrimary: true,
      sortOrder: [2, 5, 3, 1, 6, 4],
      type: 'metbrewer',
    },
    {
      name: 'signac',
      colors: [
        '#fbe183',
        '#f4c40f',
        '#fe9b00',
        '#d8443c',
        '#9b3441',
        '#de597c',
        '#e87b89',
        '#e6a2a6',
        '#aa7aa1',
        '#9f5691',
        '#633372',
        '#1f6e9c',
        '#2b9b81',
        '#92c051',
      ],
      isPrimary: true,
      sortOrder: [13, 3, 2, 1, 11, 5, 8, 14, 12, 10, 7, 4, 6, 9],
      type: 'metbrewer',
    },
    {
      name: 'stevens',
      colors: ['#042e4e', '#307d7f', '#598c4c', '#ba5c3f', '#a13213', '#470c00'],
      isPrimary: true,
      sortOrder: [4, 2, 3, 5, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'tam',
      colors: ['#ffd353', '#ffb242', '#ef8737', '#de4f33', '#bb292c', '#9f2d55', '#62205f', '#341648'],
      isPrimary: true,
      sortOrder: [3, 8, 1, 6, 2, 7, 4, 5],
      type: 'metbrewer',
    },
    {
      name: 'tara',
      colors: ['#eab1c6', '#d35e17', '#e18a1f', '#e9b109', '#829d44'],
      isPrimary: true,
      sortOrder: [1, 3, 2, 5, 4],
      type: 'metbrewer',
    },
    {
      name: 'thomas',
      colors: ['#b24422', '#c44d76', '#4457a5', '#13315f', '#b1a1cc', '#59386c', '#447861', '#7caf5c'],
      isPrimary: true,
      sortOrder: [3, 2, 8, 6, 1, 4, 7, 5],
      type: 'metbrewer',
    },
    {
      name: 'tiepolo',
      colors: ['#802417', '#c06636', '#ce9344', '#e8b960', '#646e3b', '#2b5851', '#508ea2', '#17486f'],
      isPrimary: true,
      sortOrder: [1, 2, 8, 4, 3, 5, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'troy',
      colors: ['#421401', '#6c1d0e', '#8b3a2b', '#c27668', '#7ba0b4', '#44728c', '#235070', '#0a2d46'],
      isPrimary: true,
      sortOrder: [2, 7, 4, 5, 1, 8, 3, 6],
      type: 'metbrewer',
    },
    {
      name: 'tsimshian',
      colors: ['#582310', '#aa361d', '#82c45f', '#318f49', '#0cb4bb', '#2673a3', '#473d7d'],
      isPrimary: true,
      sortOrder: [6, 1, 7, 4, 1, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'vangogh1',
      colors: ['#2c2d54', '#434475', '#6b6ca3', '#969bc7', '#87bcbd', '#89ab7c', '#6f9954'],
      isPrimary: true,
      sortOrder: [3, 5, 7, 4, 6, 2, 1],
      type: 'metbrewer',
    },
    {
      name: 'vangogh2',
      colors: ['#bd3106', '#d9700e', '#e9a00e', '#eebe04', '#5b7314', '#c3d6ce', '#89a6bb', '#454b87'],
      isPrimary: true,
      sortOrder: [1, 5, 8, 2, 7, 4, 6, 3],
      type: 'metbrewer',
    },
    {
      name: 'vangogh3',
      colors: ['#e7e5cc', '#c2d6a4', '#9cc184', '#669d62', '#447243', '#1f5b25', '#1e3d14', '#192813'],
      isPrimary: true,
      sortOrder: [7, 5, 1, 4, 8, 2, 3, 6],
      type: 'metbrewer',
    },
    {
      name: 'veronese',
      colors: ['#67322e', '#99610a', '#c38f16', '#6e948c', '#2c6b67', '#175449', '#122c43'],
      isPrimary: true,
      sortOrder: [5, 1, 7, 2, 3, 6, 4],
      type: 'metbrewer',
    },
    {
      name: 'wissing',
      colors: ['#4b1d0d', '#7c291e', '#ba7233', '#3a4421', '#2d5380'],
      isPrimary: true,
      sortOrder: [2, 3, 5, 4, 1],
      type: 'metbrewer',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var ranganathPalettes = [
    {
      name: 'rag-mysore',
      colors: ['#ec6c26', '#613a53', '#e8ac52', '#639aa0'],
      background: '#d5cda1',
      type: 'ranganath',
    },
    {
      name: 'rag-gol',
      colors: ['#d3693e', '#803528', '#f1b156', '#90a798'],
      background: '#f0e0a4',
      type: 'ranganath',
    },
    {
      name: 'rag-belur',
      colors: ['#f46e26', '#68485f', '#3d273a', '#535d55'],
      background: '#dcd4a6',
      type: 'ranganath',
    },
    {
      name: 'rag-bangalore',
      colors: ['#ea720e', '#ca5130', '#e9c25a', '#52534f'],
      background: '#f9ecd3',
      type: 'ranganath',
    },
    {
      name: 'rag-taj',
      colors: ['#ce565e', '#8e1752', '#f8a100', '#3ac1a6'],
      background: '#efdea2',
      type: 'ranganath',
    },
    {
      name: 'rag-virupaksha',
      colors: ['#f5736a', '#925951', '#feba4c', '#9d9b9d'],
      background: '#eedfa2',
      type: 'ranganath',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var rohlfsPalettes = [
    {
      name: 'rohlfs_1R',
      colors: ['#004996', '#567bae', '#ff4c48', '#ffbcb3'],
      stroke: '#004996',
      background: '#fff8e7',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_1Y',
      colors: ['#004996', '#567bae', '#ffc000', '#ffdca4'],
      stroke: '#004996',
      background: '#fff8e7',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_1G',
      colors: ['#004996', '#567bae', '#60bf3c', '#d2deb1'],
      stroke: '#004996',
      background: '#fff8e7',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_2',
      colors: ['#4d3d9a', '#f76975', '#ffffff', '#eff0dd'],
      stroke: '#211029',
      background: '#58bdbc',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_3',
      colors: ['#abdfdf', '#fde500', '#58bdbc', '#eff0dd'],
      stroke: '#211029',
      background: '#f76975',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_4',
      colors: ['#fde500', '#2f2043', '#f76975', '#eff0dd'],
      stroke: '#211029',
      background: '#fbbeca',
      type: 'rohlfs',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var roygbivsPalettes = [
    {
      name: 'retro',
      colors: ['#69766f', '#9ed6cb', '#f7e5cc', '#9d8f7f', '#936454', '#bf5c32', '#efad57'],
      type: 'roygbivs',
    },
    {
      name: 'retro-washedout',
      colors: ['#878a87', '#cbdbc8', '#e8e0d4', '#b29e91', '#9f736c', '#b76254', '#dfa372'],
      type: 'roygbivs',
    },
    {
      name: 'roygbiv-warm',
      colors: ['#705f84', '#687d99', '#6c843e', '#fc9a1a', '#dc383a', '#aa3a33', '#9c4257'],
      type: 'roygbivs',
    },
    {
      name: 'roygbiv-toned',
      colors: ['#817c77', '#396c68', '#89e3b7', '#f59647', '#d63644', '#893f49', '#4d3240'],
      type: 'roygbivs',
    },
    {
      name: 'present-correct',
      colors: [
        '#fd3741',
        '#fe4f11',
        '#ff6800',
        '#ffa61a',
        '#ffc219',
        '#ffd114',
        '#fcd82e',
        '#f4d730',
        '#ced562',
        '#8ac38f',
        '#79b7a0',
        '#72b5b1',
        '#5b9bae',
        '#6ba1b7',
        '#49619d',
        '#604791',
        '#721e7f',
        '#9b2b77',
        '#ab2562',
        '#ca2847',
      ],
      type: 'roygbivs',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var spatialPalettes = [
    {
      name: 'spatial01',
      colors: ['#ff5937', '#f6f6f4', '#4169ff'],
      stroke: '#ff5937',
      background: '#f6f6f4',
      type: 'spatial',
    },
    {
      name: 'spatial02',
      colors: ['#ff5937', '#f6f6f4', '#f6f6f4'],
      stroke: '#ff5937',
      background: '#f6f6f4',
      type: 'spatial',
    },
    {
      name: 'spatial02i',
      colors: ['#f6f6f4', '#ff5937', '#ff5937'],
      stroke: '#f6f6f4',
      background: '#ff5937',
      type: 'spatial',
    },

    {
      name: 'spatial03',
      colors: ['#4169ff', '#f6f6f4', '#f6f6f4'],
      stroke: '#4169ff',
      background: '#f6f6f4',
      type: 'spatial',
    },
    {
      name: 'spatial03i',
      colors: ['#f6f6f4', '#4169ff', '#4169ff'],
      stroke: '#f6f6f4',
      background: '#4169ff',
      type: 'spatial',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var systemPalettes = [
    {
      name: 'system.#01',
      colors: ['#ff4242', '#fec101', '#1841fe', '#fcbdcc', '#82e9b5'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#02',
      colors: ['#ff4242', '#ffd480', '#1e365d', '#edb14c', '#418dcd'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#03',
      colors: ['#f73f4a', '#d3e5eb', '#002c3e', '#1aa1b1', '#ec6675'],
      stroke: '#110b09',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#04',
      colors: ['#e31f4f', '#f0ac3f', '#18acab', '#26265a', '#ea7d81', '#dcd9d0'],
      stroke: '#26265a',
      backgrund: '#dcd9d0',
      type: 'system',
    },
    {
      name: 'system.#05',
      colors: ['#db4549', '#d1e1e1', '#3e6a90', '#2e3853', '#a3c9d3'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#06',
      colors: ['#e5475c', '#95b394', '#28343b', '#f7c6a3', '#eb8078'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#07',
      colors: ['#d75c49', '#f0efea', '#509da4'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#08',
      colors: ['#f6625a', '#92b29f', '#272c3f'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var tsuchimochiPalettes = [
    {
      name: 'tsu_arcade',
      colors: ['#4aad8b', '#e15147', '#f3b551', '#cec8b8', '#d1af84', '#544e47'],
      stroke: '#251c12',
      background: '#cfc7b9',
      type: 'tsuchimochi',
    },
    {
      name: 'tsu_harutan',
      colors: ['#75974a', '#c83e3c', '#f39140', '#e4ded2', '#f8c5a4', '#434f55'],
      stroke: '#251c12',
      background: '#cfc7b9',
      type: 'tsuchimochi',
    },
    {
      name: 'tsu_akasaka',
      colors: ['#687f72', '#cc7d6c', '#dec36f', '#dec7af', '#ad8470', '#424637'],
      stroke: '#251c12',
      background: '#cfc7b9',
      type: 'tsuchimochi',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var tundraPalettes = [
    {
      name: 'tundra1',
      colors: ['#40708c', '#8e998c', '#5d3f37', '#ed6954', '#f2e9e2'],
      type: 'tundra',
    },
    {
      name: 'tundra2',
      colors: ['#5f9e93', '#3d3638', '#733632', '#b66239', '#b0a1a4', '#e3dad2'],
      type: 'tundra',
    },
    {
      name: 'tundra3',
      colors: ['#87c3ca', '#7b7377', '#b2475d', '#7d3e3e', '#eb7f64', '#d9c67a', '#f3f2f2'],
      type: 'tundra',
    },
    {
      name: 'tundra4',
      colors: ['#d53939', '#b6754d', '#a88d5f', '#524643', '#3c5a53', '#7d8c7c', '#dad6cd'],
      type: 'tundra',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var orbifoldPalettes = [
    {
      name: 'candy-wrap',
      colors: ['#f19797', '#f9b73e', '#ee5151', '#fb671f', '#6bbe3a', '#0c75b7', '#0b9e4e', '#763f68'],
      stroke: '#302319',
      background: '#e7ded5',
      type: 'orbifold',
    },
    {
      name: 'slicks',
      colors: ['#e1decd', '#d95336', '#e6ac1d'],
      stroke: '#302319',
      background: '#e1decd',
      type: 'orbifold',
    },
    {
      name: 'circus',
      colors: ['#3eb79e', '#f4a910', '#f37377', '#207986', '#f26003', '#afce95'],
      stroke: '#302319',
      background: '#eadcb6',
      type: 'orbifold',
    },
    {
      name: 'spotlight',
      colors: ['#f34312', '#00a49e', '#ef888f', '#f5b408', '#412432'],
      stroke: '#412432',
      background: '#dfdcd5',
      type: 'orbifold',
    },
    {
      name: 'five-stars',
      colors: ['#f5e8c7', '#d9dcad', '#cf3933', '#f3f4f4', '#74330d', '#8bb896', '#eba824', '#f05c03'],
      stroke: '#380c05',
      background: '#ecd598',
      type: 'orbifold',
    },
    {
      name: 'full-moon',
      colors: ['#f7e8be', '#aa879f', '#f6634e'],
      stroke: '#2a1f39',
      background: '#f7e8be',
      type: 'orbifold',
    },
    {
      name: 'sunday-stroll',
      colors: [
        '#d44c4c',
        '#e47781',
        '#f5d274',
        '#f7e8be',
        '#acbe55',
        '#6fb97a',
        '#5ba150',
        '#037750',
        '#003e5e',
        '#595373',
        '#73659e',
        '#ac879f',
      ],
      background: '#e5cbb5',
      w: 2,
      type: 'orbifold',
    },
    {
      name: 'vegetable-soup',
      colors: ['#ec6a22', '#f7e9c5', '#399a3f', '#9ac764', '#fff7e0', '#ffcd6b', '#634754', '#98c195', '#708658'],
      background: '#fff7e0',
      w: 2,
      type: 'orbifold',
    },
    {
      name: 'risograph',
      colors: ['#f56f64', '#f9cb1f', '#f0eace'],
      stroke: '#295042',
      background: '#f0eace',
      w: 1,
      type: 'orbifold',
    },
    {
      name: 'tote-bag',
      colors: ['#f5f5f5', '#ffc6cf', '#fd5105', '#4124b0'],
      stroke: '#231e22',
      background: '#ffc6cf',
      w: 1,
      type: 'orbifold',
    },
    {
      name: 'slicks',
      colors: ['#ffbdd0', '#ff4328', '#e88526', '#21b929', '#2193c9', '#fffcea', '#ffcc21'],
      stroke: '#fffcea',
      background: '#212121',
      w: 1,
      type: 'orbifold',
    },
  ];

  //
  // Selected palettes from lospec
  // https://lospec.com/palette-list
  //
  var lospecPalettes = [
    {
      name: 'sweetie16', // https://lospec.com/palette-list/sweetie-16
      colors: [
        '#5d275d',
        '#b13e53',
        '#ef7d57',
        '#ffcd75',
        '#a7f070',
        '#38b764',
        '#257179',
        '#29366f',
        '#3b5dc9',
        '#41a6f6',
        '#73eff7',
        '#94b0c2',
        '#566c86',
        '#333c57',
      ],

      stroke: '#f4f4f4',
      background: '#1a1c2c',
      type: 'lospec',
    },
    {
      name: 'na16', // https://lospec.com/palette-list/na16
      colors: [
        '#8c8fae',
        '#584563',
        '#3e2137',
        '#9a6348',
        '#d79b7d',
        '#f5edba',
        '#c0c741',
        '#647d34',
        '#e4943a',
        '#9d303b',
        '#d26471',
        '#70377f',
        '#7ec4c1',
        '#34859d',
        '#17434b',
        '#1f0e1c',
      ],
      stroke: '#f5edba',
      background: '#1f0e1c',
      type: 'lospec',
    },
    {
      name: 'lost-century', // https://lospec.com/palette-list/lost-century
      colors: [
        '#d1b187',
        '#c77b58',
        '#ae5d40',
        '#79444a',
        '#4b3d44',
        '#ba9158',
        '#927441',
        '#4d4539',
        '#77743b',
        '#b3a555',
        '#d2c9a5',
        '#8caba1',
        '#4b726e',
        '#574852',
        '#847875',
        '#ab9b8e',
      ],
      type: 'lospec',
    },
    {
      name: 'nostalgic-dreams', // https://lospec.com/palette-list/nostalgic-dreams
      colors: ['#d9af80', '#b07972', '#524352', '#686887', '#7f9bb0', '#bfd4b0', '#90b870', '#628c70'],
      type: 'lospec',
    },
    {
      name: 'sls08', // https://lospec.com/palette-list/slso8
      colors: ['#0d2b45', '#203c56', '#544e68', '#8d697a', '#d08159', '#ffaa5e', '#ffd4a3', '#ffecd6'],
      type: 'lospec',
    },
    {
      name: 'rust-gold-8', // https://lospec.com/palette-list/rust-gold-8
      colors: ['#f6cd26', '#ac6b26', '#563226', '#331c17', '#bb7f57', '#725956', '#393939', '#202020'],
      type: 'lospec',
    },
    {
      name: 'ink-crimson', // https://lospec.com/palette-list/ink-crimson
      colors: [
        '#ff0546',
        '#9c173b',
        '#660f31',
        '#450327',
        '#270022',
        '#17001d',
        '#09010d',
        '#0ce6f2',
        '#0098db',
        '#1e579c',
      ],
      type: 'lospec',
    },
    {
      name: 'look-of-horror', // https://lospec.com/palette-list/look-of-horror
      colors: ['#0a202f', '#302d6a', '#871c3e', '#d32836'],
      type: 'lospec',
    },
    {
      name: 'cormorant14', // https://lospec.com/palette-list/cormorant14
      colors: [
        '#dc67b9',
        '#ffa3a2',
        '#fcf6e7',
        '#ff8e58',
        '#da6175',
        '#79396c',
        '#213756',
        '#26707a',
        '#24b8a0',
        '#8ee6a1',
        '#edd54f',
        '#6bae36',
        '#7da497',
        '#c8cdbb',
      ],
      type: 'lospec',
    },
    {
      name: 'midnight_ablaze',
      colors: ['#ff8274', '#d53c6a', '#7c183c', '#460e2b', '#31051e', '#1f0510', '#130208'],
      type: 'lospec',
    },
    {
      name: 'taliwan', // https://lospec.com/palette-list/taliwan
      colors: [
        '#f2eef1',
        '#ffa7bf',
        '#ec7d9b',
        '#e64667',
        '#a02552',
        '#75024d',
        '#2c0f30',
        '#e18434',
        '#ffa01b',
        '#ffbd20',
      ],
      type: 'lospec',
    },
    {
      name: 'spanish_sunset', // https://lospec.com/palette-list/spanish-sunset
      colors: ['#f5ddbc', '#fabb64', '#fd724e', '#a02f40', '#5f2f45'],
      type: 'lospec',
    },
    {
      name: 'late_night_bath', // https://lospec.com/palette-list/late-night-bath
      colors: ['#282d3c', '#5b5d70', '#74838c', '#ffc4b8', '#f69197'],
      type: 'lospec',
    },
    {
      name: 'vaporhaze', // https://lospec.com/palette-list/vaporhaze-16
      colors: [
        '#00474f',
        '#225054',
        '#475b58',
        '#6a645d',
        '#8e6e61',
        '#b17766',
        '#d4826b',
        '#f88c6e',
        '#156d8e',
        '#467b96',
        '#6b869b',
        '#8e8f9f',
        '#b199a3',
        '#d5a3a7',
        '#f8adac',
        '#ffbdbb',
      ],
      type: 'lospec',
    },
    {
      name: 'neon_reflection', // https://lospec.com/palette-list/dr-neon-reflection
      colors: [
        '#b1e2e7',
        '#5be4b9',
        '#10bdc6',
        '#517cb8',
        '#394072',
        '#7441ae',
        '#bb49d7',
        '#f69dbd',
        '#d8d272',
        '#f3ad58',
        '#e74a9d',
        '#af517a',
      ],
      type: 'lospec',
    },
    {
      name: '17pastels', // https://lospec.com/palette-list/17pastels
      colors: [
        '#373254',
        '#68356f',
        '#5e6b82',
        '#25718c',
        '#11abbe',
        '#69f6bf',
        '#eff0d7',
        '#f8e574',
        '#a3e75c',
        '#6d4442',
        '#a16557',
        '#f98bb7',
        '#c84c66',
        '#f79152',
        '#9b9c82',
        '#1c866d',
        '#59b15e',
      ],
      type: 'lospec',
    },
    {
      name: 'pollen8', // https://lospec.com/palette-list/pollen8
      colors: ['#73464c', '#ab5675', '#ee6a7c', '#ffa7a5', '#ffe07e', '#72dcbb', '#34acba'],
      type: 'lospec',
    },
    {
      name: 'neon_space', // https://lospec.com/palette-list/neon-space
      colors: ['#df0772', '#fe546f', '#ff9e7d', '#ffd080', '#0bffe6', '#01cbcf', '#0188a5', '#3e3264', '#352a55'],
      type: 'lospec',
    },
    {
      name: 'salad_bowl', // https://lospec.com/palette-list/salad-bowl
      colors: ['#541b3c', '#802040', '#a04040', '#c06040', '#e0e080', '#a0c040', '#60a040', '#206040', '#103040'],
      type: 'lospec',
    },
    {
      name: 'seafoam', // https://lospec.com/palette-list/seafoam
      colors: ['#37364e', '#355d69', '#6aae9d', '#b9d4b4', '#f4e9d4', '#d0baa9', '#9e8e91', '#5b4a68'],
      type: 'lospec',
    },
    {
      name: 'chasm', // https://lospec.com/palette-list/chasm
      colors: [
        '#85daeb',
        '#5fc9e7',
        '#5fa1e7',
        '#5f6ee7',
        '#4c60aa',
        '#444774',
        '#32313b',
        '#463c5e',
        '#5d4776',
        '#855395',
      ],
      type: 'lospec',
    },
    {
      name: 'soapy10', // https://lospec.com/palette-list/soapy-10
      colors: [
        '#54cea7',
        '#2ba4a6',
        '#0c6987',
        '#054b84',
        '#0d2147',
        '#ffb0bf',
        '#ff82bd',
        '#d74ac7',
        '#a825ba',
        '#682b9c',
      ],
      type: 'lospec',
    },
    {
      name: 'synthetic80s', // https://lospec.com/palette-list/synthetic-80s
      colors: ['#e46018', '#fcb800', '#008894', '#004058', '#290d28', '#9d2496', '#db24d4'],
      type: 'lospec',
    },
  ];

  //
  //  moma color palettes
  //  https://github.com/BlakeRMills/MoMAColors
  //
  var momaPalettes = [
    {
      name: 'Abbott',
      colors: ['#950404', '#e04b28', '#c38961', '#9f5630', '#388f30', '#0f542f', '#007d82', '#004042'],
      isPrimary: true,
      sortOrder: [1, 6, 5, 4, 3, 8, 2, 7],
      type: 'momacolors',
    },
    {
      name: 'Alkalay1',
      colors: ['#241d1d', '#5b2125', '#8d3431', '#bf542e', '#e9a800'],
      isPrimary: true,
      sortOrder: [5, 1, 4, 3, 2],
      type: 'momacolors',
    },
    {
      name: 'Alkalay2',
      colors: ['#ebcf2e', '#b4bf3a', '#88ab38', '#5e9432', '#3b7d31', '#225f2f', '#244422', '#252916'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      type: 'momacolors',
    },

    {
      name: 'Althoff',
      colors: ['#ff9898', '#d9636c', '#a91e45', '#691238', '#251714'],
      isPrimary: true,
      sortOrder: [2, 4, 1, 3, 5],
      type: 'momacolors',
    },
    {
      name: 'Andri',
      colors: ['#f56455', '#15134b', '#87c785', '#572f30'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'momacolors',
    },
    {
      name: 'Avedon',
      colors: [
        '#ff7200',
        '#ff8827',
        '#ff9c4c',
        '#ffb274',
        '#f1caa8',
        '#e3e1dc',
        '#c2ceaa',
        '#a1ba77',
        '#8bac54',
        '#7ea13e',
        '#648c16',
      ],
      isPrimary: true,
      sortOrder: [10, 1, 8, 4, 6, 3, 7, 5, 9, 2, 11],
      type: 'momacolors',
    },
    {
      name: 'Budnitz',
      colors: ['#86dd45', '#f6e71c', '#fda900', '#fd5300', '#57348b'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5],
      type: 'momacolors',
    },
    {
      name: 'Clay',
      colors: ['#c48329', '#8b3b36', '#a2b4b7', '#514a2e', '#cf9860', '#8E4115'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'momacolors',
    },
    {
      name: 'Connors',
      colors: ['#d92a05', '#f35d36', '#fc9073', '#ffba1b', '#60cfa1'],
      isPrimary: true,
      sortOrder: [5, 1, 4, 3, 2],
      type: 'momacolors',
    },
    {
      name: 'Dali',
      colors: ['#b4b87f', '#9c913f', '#585b33', '#6ea8ab', '#397893', '#31333f', '#8f5715', '#ba9a44', '#cfbb83'],
      isPrimary: true,
      sortOrder: [8, 3, 7, 1, 5, 9, 2, 6, 4],
      type: 'momacolors',
    },
    {
      name: 'Doughton',
      colors: [
        '#155b51',
        '#216f63',
        '#2d8277',
        '#3a9387',
        '#45a395',
        '#c468b2',
        '#af509c',
        '#803777',
        '#5d2155',
        '#45113f',
      ],
      isPrimary: true,
      sortOrder: [9, 3, 7, 1, 5, 6, 2, 8, 4, 10],
      type: 'momacolors',
    },
    {
      name: 'Ernst',
      colors: ['#e8e79a', '#c2d89a', '#8cbf9a', '#5fa2a4', '#477b95', '#315b88', '#24396b', '#191f40'],
      isPrimary: true,
      sortOrder: [4, 2, 6, 1, 3, 8, 5, 7],
      type: 'momacolors',
    },
    {
      name: 'Exter',
      colors: [
        '#ffec9d',
        '#fac881',
        '#f4a464',
        '#e87444',
        '#d9402a',
        '#bf2729',
        '#912534',
        '#64243e',
        '#3d1b28',
        '#161212',
      ],
      isPrimary: true,
      sortOrder: [4, 9, 2, 5, 7, 1, 6, 3, 8, 10],
      type: 'momacolors',
    },
    {
      name: 'Flash',
      colors: ['#e3c0db', '#db95cb', '#cd64b5', '#B83D9F', '#900c7e', '#680369', '#41045a', '#140e3a'],
      isPrimary: true,
      sortOrder: [4, 6, 1, 7, 2, 5, 3, 8],
      type: 'momacolors',
    },
    {
      name: 'Fritsch',
      colors: ['#0f8d7b', '#8942bd', '#1e1a1a', '#eadd17'],
      isPrimary: true,
      sortOrder: [1, 3, 4, 2],
      type: 'momacolors',
    },
    {
      name: 'Kippenberger',
      colors: [
        '#8b174d',
        '#ae2565',
        '#c1447e',
        '#d06c9b',
        '#da9fb8',
        '#d9d2cc',
        '#adbe7c',
        '#8ba749',
        '#6e8537',
        '#4f5f28',
        '#343d1f',
      ],
      isPrimary: true,
      sortOrder: [10, 6, 1, 8, 4, 3, 5, 9, 2, 7, 11],
      type: 'momacolors',
    },
    {
      name: 'Klein',
      colors: [
        '#ff4d6f',
        '#579ea4',
        '#df7713',
        '#f9c000',
        '#86ad34',
        '#5d7298',
        '#81b28d',
        '#7e1a2f',
        '#2d2651',
        '#c8350d',
        '#bd777a',
      ],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      type: 'momacolors',
    },
    {
      name: 'Koons',
      colors: ['#d8537d', '#6DC5B2', '#eeca76', '#5d2314', '#b5282a'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 5, 4],
      type: 'momacolors',
    },
    {
      name: 'Levine1 ',
      colors: ['#E0D9B2', '#818053', '#6B3848', '#8B3E50', '#D5BB6C', '#3F3A4B', '#474C66', '#A5806F'],
      isPrimary: true,
      sortOrder: [5, 4, 6, 1, 2, 7, 3, 8],
      type: 'momacolors',
    },
    {
      name: 'Levine2 ',
      colors: ['#E3C1CB', '#AD5A6B', '#C993A2', '#365C83', '#384351', '#4D8F8B', '#CDD6AD'],
      isPrimary: true,
      sortOrder: [7, 1, 5, 3, 6, 2, 4],
      type: 'momacolors',
    },
    {
      name: 'Liu',
      colors: ['#9fd7bd', '#9b5c1c', '#97c124', '#3b5f13', '#ddb25d', '#5c4a32'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'momacolors',
    },
    {
      name: 'Lupi',
      colors: ['#61bea4', '#b6e7e0', '#aa3f5d', '#daa5ac', '#98a54f', '#2e92a2', '#ffb651', '#d85a44'],
      isPrimary: true,
      sortOrder: [1, 6, 2, 8, 7, 3, 4, 5],
      type: 'momacolors',
    },
    {
      name: 'Ohchi',
      colors: ['#582851', '#40606d', '#69a257', '#e3d19c', '#c4024d'],
      isPrimary: true,
      sortOrder: [3, 4, 1, 2, 5],
      type: 'momacolors',
    },
    {
      name: 'OKeeffe',
      colors: ['#f3d567', '#ee9b43', '#e74b47', '#b80422', '#172767', '#19798b'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'momacolors',
    },

    {
      name: 'Palermo',
      colors: ['#1b80ad', '#ea5b57', '#9c5555', '#0c3c5f'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'momacolors',
    },
    {
      name: 'Panton',
      colors: ['#e84a00', '#bb1d2c', '#9b0c43', '#661f66', '#2c1f62', '#006289', '#004759'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8],
      type: 'momacolors',
    },
    {
      name: 'Picabia',
      colors: [
        '#53362e',
        '#744940',
        '#9f7064',
        '#c99582',
        '#e6bcac',
        '#e2d8d6',
        '#a5a6ae',
        '#858794',
        '#666879',
        '#515260',
        '#3d3d47',
      ],
      isPrimary: true,
      sortOrder: [10, 4, 8, 1, 6, 3, 7, 2, 9, 5, 11],
      type: 'momacolors',
    },
    {
      name: 'Picasso',
      colors: ['#d5968c', '#c2676d', '#5c363a', '#995041', '#45939c', '#0f6a81'],
      isPrimary: true,
      sortOrder: [6, 3, 4, 2, 1, 5],
      type: 'momacolors',
    },
    {
      name: 'Rattner',
      colors: ['#de8e69', '#f1be99', '#c1bd38', '#7a9132', '#4c849a', '#184363', '#5d5686', '#a39fc9'],
      isPrimary: true,
      sortOrder: [1, 5, 6, 2, 3, 7, 8, 4],
      type: 'momacolors',
    },
    {
      name: 'Sidhu',
      colors: ['#af4646', '#762b35', '#005187', '#251c4a', '#78adb7', '#4c9a77', '#1b7975'],
      isPrimary: true,
      sortOrder: [5, 2, 6, 7, 3, 4, 1],
      type: 'momacolors',
    },
    {
      name: 'Smith',
      colors: ['#ef7923', '#75bca9', '#7b89bb', '#e9de97', '#2a2e38'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5],
      type: 'momacolors',
    },
    {
      name: 'ustwo',
      colors: ['#d7433b', '#f06a63', '#ff8e5e', '#ffcc3d', '#95caa6', '#008d98'],
      isPrimary: true,
      sortOrder: [6, 5, 2, 3, 1, 4],
      type: 'momacolors',
    },
    {
      name: 'VanGogh',
      colors: ['#c3a016', '#c3d878', '#58a787', '#8ebacd', '#246893', '#163274', '#0C1F4b'],
      isPrimary: true,
      sortOrder: [2, 4, 3, 6, 1, 5, 7],
      type: 'momacolors',
    },
    {
      name: 'vonHeyl',
      colors: ['#f96149', '#ffa479', '#e7d800', '#94aec2', '#0d0c0b'],
      isPrimary: true,
      sortOrder: [1, 4, 2, 3, 5],
      type: 'momacolors',
    },
    {
      name: 'Warhol',
      colors: [
        '#ff0066',
        '#328c97',
        '#d1aac2',
        '#a5506d',
        '#b3e0bf',
        '#2A9D3D',
        '#edf181',
        '#db7003',
        '#fba600',
        '#f8c1a6',
        '#A30000',
        '#ff3200',
        '#011a51',
        '#97d1d9',
        '#916c37',
      ],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      type: 'momacolors',
    },
  ];

  //
  // Australian bird plumages
  // https://github.com/shandiya/feathers
  //
  var feathersPalettes = [
    {
      name: 'spotted_pardalote',
      colors: ['#feca00', '#d36328', '#cb0300', '#b4b9b3', '#424847', '#000100'],
      type: 'feathers',
    },
    {
      name: 'plains_wanderer',
      colors: ['#edd8c5', '#d09a5e', '#e7aa01', '#ac570f', '#73481b', '#442c0e', '#0d0403'],
      type: 'feathers',
    },
    {
      name: 'bee_eater',
      colors: ['#00346E', '#007CBF', '#06ABDF', '#EDD03E', '#F5A200', '#6D8600', '#424D0C'],
      type: 'feathers',
    },
    {
      name: 'rose_crowned_fruit_dove',
      colors: ['#BD338F', '#EB8252', '#F5DC83', '#CDD4DC', '#8098A2', '#8FA33F', '#5F7929', '#014820'],
      type: 'feathers',
    },
    {
      name: 'eastern_rosella',
      colors: ['#cd3122', '#f4c623', '#bee183', '#6c905e', '#2f533c', '#b8c9dc', '#2f7ab9'],
      type: 'feathers',
    },
    {
      name: 'oriole',
      colors: [
        '#8a3223',
        '#bb5645',
        '#d97878',
        '#e2aba0',
        '#d0cfe9',
        '#a29eb8',
        '#6c6b75',
        '#b8a53f',
        '#93862a',
        '#4d4019',
      ],
      type: 'feathers',
    },
    {
      name: 'princess_parrot',
      colors: ['#7090c9', '#8cb3de', '#afbe9f', '#616020', '#6eb245', '#214917', '#cf2236', '#d683ad'],
      type: 'feathers',
    },
    { name: 'superb_fairy_wren', colors: ['#4F3321', '#AA7853', '#D9C4A7', '#B03F05', '#020503'], type: 'feathers' },
    {
      name: 'cassowary',
      colors: ['#BDA14D', '#3EBCB6', '#0169C4', '#153460', '#D5114E', '#A56EB6', '#4B1C57', '#09090C'],
      type: 'feathers',
    },
    {
      name: 'yellow_robin',
      colors: ['#E19E00', '#FBEB5B', '#85773A', '#979EB9', '#727B98', '#454B56', '#201B1E'],
      type: 'feathers',
    },
    { name: 'galah', colors: ['#FFD2CF', '#E9A7BB', '#D05478', '#AAB9CC', '#8390A2', '#4C5766'], type: 'feathers' },
  ];

  // color_palettes/index.js

  // Export all palettes as a single array
  var allPalettes = [
    ...basicPalettes,
    ...cakoPalettes,
    ...colourscafePalettes,
    ...d3Palettes,
    ...dalePalettes,
    ...ducciPalettes,
    ...duotonePalettes,
    ...expositoPalettes,
    ...feathersPalettes,
    ...flourishPalettes,
    ...golidmiscPalettes,
    ...hildaPalettes,
    ...iivonenPalettes,
    ...judsonPalettes,
    ...jungPalettes,
    ...kovecsesPalettes,
    ...lospecPalettes,
    ...mayoPalettes,
    ...metbrewerPalettes,
    ...momaPalettes,
    ...orbifoldPalettes,
    ...ranganathPalettes,
    ...rohlfsPalettes,
    ...roygbivsPalettes,
    ...spatialPalettes,
    ...systemPalettes,
    ...tsuchimochiPalettes,
    ...tundraPalettes,
  ];

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var chroma_min = {exports: {}};

  /**
   * chroma.js - JavaScript library for color conversions
   *
   * Copyright (c) 2011-2025, Gregor Aisch
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   * list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. The name Gregor Aisch may not be used to endorse or promote products
   * derived from this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
   * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
   * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
   * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   * -------------------------------------------------------
   *
   * chroma.js includes colors from colorbrewer2.org, which are released under
   * the following license:
   *
   * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
   * and The Pennsylvania State University.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing,
   * software distributed under the License is distributed on an
   * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   * either express or implied. See the License for the specific
   * language governing permissions and limitations under the License.
   *
   * ------------------------------------------------------
   *
   * Named colors are taken from X11 Color Names.
   * http://www.w3.org/TR/css3-color/#svg-color
   *
   * @preserve
   */

  (function (module, exports) {
  	!function(r,n){module.exports=n();}(commonjsGlobal,(function(){var r=Math.min,n=Math.max;function e(e,t,a){return void 0===t&&(t=0),void 0===a&&(a=1),r(n(t,e),a)}function t(r){r._clipped=!1,r._unclipped=r.slice(0);for(var n=0;n<=3;n++)n<3?((r[n]<0||r[n]>255)&&(r._clipped=!0),r[n]=e(r[n],0,255)):3===n&&(r[n]=e(r[n],0,1));return r}for(var a={},f=0,o=["Boolean","Number","String","Function","Array","Date","RegExp","Undefined","Null"];f<o.length;f+=1){var u=o[f];a["[object "+u+"]"]=u.toLowerCase();}function c(r){return a[Object.prototype.toString.call(r)]||"object"}function i(r,n){return void 0===n&&(n=null),r.length>=3?Array.prototype.slice.call(r):"object"==c(r[0])&&n?n.split("").filter((function(n){return void 0!==r[0][n]})).map((function(n){return r[0][n]})):r[0].slice(0)}function l(r){if(r.length<2)return null;var n=r.length-1;return "string"==c(r[n])?r[n].toLowerCase():null}var h=Math.PI,s=Math.min,d=Math.max,b=function(r){return Math.round(100*r)/100},g=function(r){return Math.round(100*r)/100},v=2*h,p=h/3,m=h/180,y=180/h;function w(r){return r.slice(0,3).reverse().concat(r.slice(3))}var k={format:{},autodetect:[]},M=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=this;if("object"===c(r[0])&&r[0].constructor&&r[0].constructor===this.constructor)return r[0];var a=l(r),f=!1;if(!a){f=!0,k.sorted||(k.autodetect=k.autodetect.sort((function(r,n){return n.p-r.p})),k.sorted=!0);for(var o=0,u=k.autodetect;o<u.length;o+=1){var i=u[o];if(a=i.test.apply(i,r))break}}if(!k.format[a])throw new Error("unknown format: "+r);var h=k.format[a].apply(null,f?r:r.slice(0,-1));e._rgb=t(h),3===e._rgb.length&&e._rgb.push(1);};M.prototype.toString=function(){return "function"==c(this.hex)?this.hex():"["+this._rgb.join(",")+"]"};var N=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r)))};N.version="3.2.0";var x=Math.max;M.prototype.cmyk=function(){return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgb"),t=e[0],a=e[1],f=e[2],o=1-x(t/=255,x(a/=255,f/=255)),u=o<1?1/(1-o):0;return [(1-t-o)*u,(1-a-o)*u,(1-f-o)*u,o]}(this._rgb)};var _=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["cmyk"])))};Object.assign(N,{cmyk:_}),k.format.cmyk=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=(r=i(r,"cmyk"))[0],t=r[1],a=r[2],f=r[3],o=r.length>4?r[4]:1;return 1===f?[0,0,0,o]:[e>=1?0:255*(1-e)*(1-f),t>=1?0:255*(1-t)*(1-f),a>=1?0:255*(1-a)*(1-f),o]},k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"cmyk"))&&4===r.length)return "cmyk"}});var A=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e,t,a=(r=i(r,"rgba"))[0],f=r[1],o=r[2],u=s(a/=255,f/=255,o/=255),c=d(a,f,o),l=(c+u)/2;return c===u?(e=0,t=Number.NaN):e=l<.5?(c-u)/(c+u):(c-u)/(2-c-u),a==c?t=(f-o)/(c-u):f==c?t=2+(o-a)/(c-u):o==c&&(t=4+(a-f)/(c-u)),(t*=60)<0&&(t+=360),r.length>3&&void 0!==r[3]?[t,e,l,r[3]]:[t,e,l]},j={Kn:18,labWhitePoint:"d65",Xn:.95047,Yn:1,Zn:1.08883,kE:216/24389,kKE:8,kK:24389/27,RefWhiteRGB:{X:.95047,Y:1,Z:1.08883},MtxRGB2XYZ:{m00:.4124564390896922,m01:.21267285140562253,m02:.0193338955823293,m10:.357576077643909,m11:.715152155287818,m12:.11919202588130297,m20:.18043748326639894,m21:.07217499330655958,m22:.9503040785363679},MtxXYZ2RGB:{m00:3.2404541621141045,m01:-.9692660305051868,m02:.055643430959114726,m10:-1.5371385127977166,m11:1.8760108454466942,m12:-.2040259135167538,m20:-.498531409556016,m21:.041556017530349834,m22:1.0572251882231791},As:.9414285350000001,Bs:1.040417467,Cs:1.089532651,MtxAdaptMa:{m00:.8951,m01:-.7502,m02:.0389,m10:.2664,m11:1.7135,m12:-.0685,m20:-.1614,m21:.0367,m22:1.0296},MtxAdaptMaI:{m00:.9869929054667123,m01:.43230526972339456,m02:-.008528664575177328,m10:-.14705425642099013,m11:.5183602715367776,m12:.04004282165408487,m20:.15996265166373125,m21:.0492912282128556,m22:.9684866957875502}},E=new Map([["a",[1.0985,.35585]],["b",[1.0985,.35585]],["c",[.98074,1.18232]],["d50",[.96422,.82521]],["d55",[.95682,.92149]],["d65",[.95047,1.08883]],["e",[1,1,1]],["f2",[.99186,.67393]],["f7",[.95041,1.08747]],["f11",[1.00962,.6435]],["icc",[.96422,.82521]]]);function R(r){var n=E.get(String(r).toLowerCase());if(!n)throw new Error("unknown Lab illuminant "+r);j.labWhitePoint=r,j.Xn=n[0],j.Zn=n[1];}function O(){return j.labWhitePoint}var P=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgb"),t=e[0],a=e[1],f=e[2],o=e.slice(3),u=L(t,a,f),c=function(r,n,e){var t=j.Xn,a=j.Yn,f=j.Zn,o=j.kE,u=j.kK,c=r/t,i=n/a,l=e/f,h=c>o?Math.pow(c,1/3):(u*c+16)/116,s=i>o?Math.pow(i,1/3):(u*i+16)/116,d=l>o?Math.pow(l,1/3):(u*l+16)/116;return [116*s-16,500*(h-s),200*(s-d)]}(u[0],u[1],u[2]);return [c[0],c[1],c[2]].concat(o.length>0&&o[0]<1?[o[0]]:[])};function F(r){var n=Math.sign(r);return ((r=Math.abs(r))<=.04045?r/12.92:Math.pow((r+.055)/1.055,2.4))*n}var L=function(r,n,e){r=F(r/255),n=F(n/255),e=F(e/255);var t=j.MtxRGB2XYZ,a=j.MtxAdaptMa,f=j.MtxAdaptMaI,o=j.Xn,u=j.Yn,c=j.Zn,i=j.As,l=j.Bs,h=j.Cs,s=r*t.m00+n*t.m10+e*t.m20,d=r*t.m01+n*t.m11+e*t.m21,b=r*t.m02+n*t.m12+e*t.m22,g=o*a.m00+u*a.m10+c*a.m20,v=o*a.m01+u*a.m11+c*a.m21,p=o*a.m02+u*a.m12+c*a.m22,m=s*a.m00+d*a.m10+b*a.m20,y=s*a.m01+d*a.m11+b*a.m21,w=s*a.m02+d*a.m12+b*a.m22;return y*=v/l,w*=p/h,[s=(m*=g/i)*f.m00+y*f.m10+w*f.m20,d=m*f.m01+y*f.m11+w*f.m21,b=m*f.m02+y*f.m12+w*f.m22]},B=Math.sqrt,G=Math.atan2,Y=Math.round,q=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"lab"),t=e[0],a=e[1],f=e[2],o=B(a*a+f*f),u=(G(f,a)*y+360)%360;return 0===Y(1e4*o)&&(u=Number.NaN),[t,o,u]},C=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgb"),t=e[0],a=e[1],f=e[2],o=e.slice(3),u=P(t,a,f),c=u[0],l=u[1],h=u[2],s=q(c,l,h);return [s[0],s[1],s[2]].concat(o.length>0&&o[0]<1?[o[0]]:[])};function X(r,n){var e=r.length;Array.isArray(r[0])||(r=[r]),Array.isArray(n[0])||(n=n.map((function(r){return [r]})));var t=n[0].length,a=n[0].map((function(r,e){return n.map((function(r){return r[e]}))})),f=r.map((function(r){return a.map((function(n){return Array.isArray(r)?r.reduce((function(r,e,t){return r+e*(n[t]||0)}),0):n.reduce((function(n,e){return n+e*r}),0)}))}));return 1===e&&(f=f[0]),1===t?f.map((function(r){return r[0]})):f}var Z=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e,t,a=i(r,"rgb"),f=a[0],o=a[1],u=a[2],c=a.slice(3),l=L(f,o,u);return (e=[[.210454268309314,.7936177747023054,-.0040720430116193],[1.9779985324311684,-2.42859224204858,.450593709617411],[.0259040424655478,.7827717124575296,-.8086757549230774]],t=X([[.819022437996703,.3619062600528904,-.1288737815209879],[.0329836539323885,.9292868615863434,.0361446663506424],[.0481771893596242,.2642395317527308,.6335478284694309]],l),X(e,t.map((function(r){return Math.cbrt(r)})))).concat(c.length>0&&c[0]<1?[c[0]]:[])};var $=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgb"),t=e[0],a=e[1],f=e[2],o=e.slice(3),u=Z(t,a,f),c=u[0],l=u[1],h=u[2],s=q(c,l,h);return [s[0],s[1],s[2]].concat(o.length>0&&o[0]<1?[o[0]]:[])},S=Math.round,W=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgba"),t=l(r)||"rgb";if("hsl"===t.substr(0,3))return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"hsla"),t=l(r)||"lsa";return e[0]=b(e[0]||0)+"deg",e[1]=b(100*e[1])+"%",e[2]=b(100*e[2])+"%","hsla"===t||e.length>3&&e[3]<1?(e[3]="/ "+(e.length>3?e[3]:1),t="hsla"):e.length=3,t.substr(0,3)+"("+e.join(" ")+")"}(A(e),t);if("lab"===t.substr(0,3)){var a=O();R("d50");var f=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"lab"),t=l(r)||"lab";return e[0]=b(e[0])+"%",e[1]=b(e[1]),e[2]=b(e[2]),"laba"===t||e.length>3&&e[3]<1?e[3]="/ "+(e.length>3?e[3]:1):e.length=3,"lab("+e.join(" ")+")"}(P(e),t);return R(a),f}if("lch"===t.substr(0,3)){var o=O();R("d50");var u=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"lch"),t=l(r)||"lab";return e[0]=b(e[0])+"%",e[1]=b(e[1]),e[2]=isNaN(e[2])?"none":b(e[2])+"deg","lcha"===t||e.length>3&&e[3]<1?e[3]="/ "+(e.length>3?e[3]:1):e.length=3,"lch("+e.join(" ")+")"}(C(e),t);return R(o),u}return "oklab"===t.substr(0,5)?function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"lab");return e[0]=b(100*e[0])+"%",e[1]=g(e[1]),e[2]=g(e[2]),e.length>3&&e[3]<1?e[3]="/ "+(e.length>3?e[3]:1):e.length=3,"oklab("+e.join(" ")+")"}(Z(e)):"oklch"===t.substr(0,5)?function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"lch");return e[0]=b(100*e[0])+"%",e[1]=g(e[1]),e[2]=isNaN(e[2])?"none":b(e[2])+"deg",e.length>3&&e[3]<1?e[3]="/ "+(e.length>3?e[3]:1):e.length=3,"oklch("+e.join(" ")+")"}($(e)):(e[0]=S(e[0]),e[1]=S(e[1]),e[2]=S(e[2]),("rgba"===t||e.length>3&&e[3]<1)&&(e[3]="/ "+(e.length>3?e[3]:1),t="rgba"),t.substr(0,3)+"("+e.slice(0,"rgb"===t?3:4).join(" ")+")")},I=function(){for(var r,n=[],e=arguments.length;e--;)n[e]=arguments[e];var t,a,f,o=(n=i(n,"hsl"))[0],u=n[1],c=n[2];if(0===u)t=a=f=255*c;else {var l=[0,0,0],h=[0,0,0],s=c<.5?c*(1+u):c+u-c*u,d=2*c-s,b=o/360;l[0]=b+1/3,l[1]=b,l[2]=b-1/3;for(var g=0;g<3;g++)l[g]<0&&(l[g]+=1),l[g]>1&&(l[g]-=1),6*l[g]<1?h[g]=d+6*(s-d)*l[g]:2*l[g]<1?h[g]=s:3*l[g]<2?h[g]=d+(s-d)*(2/3-l[g])*6:h[g]=d;t=(r=[255*h[0],255*h[1],255*h[2]])[0],a=r[1],f=r[2];}return n.length>3?[t,a,f,n[3]]:[t,a,f,1]},K=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=(r=i(r,"lab"))[0],t=r[1],a=r[2],f=z(e,t,a),o=f[0],u=f[1],c=f[2],l=V(o,u,c);return [l[0],l[1],l[2],r.length>3?r[3]:1]},z=function(r,n,e){var t=j.kE,a=j.kK,f=j.kKE,o=j.Xn,u=j.Yn,c=j.Zn,i=(r+16)/116,l=.002*n+i,h=i-.005*e,s=l*l*l,d=h*h*h;return [(s>t?s:(116*l-16)/a)*o,(r>f?Math.pow((r+16)/116,3):r/a)*u,(d>t?d:(116*h-16)/a)*c]},U=function(r){var n=Math.sign(r);return ((r=Math.abs(r))<=.0031308?12.92*r:1.055*Math.pow(r,1/2.4)-.055)*n},V=function(r,n,e){var t=j.MtxAdaptMa,a=j.MtxAdaptMaI,f=j.MtxXYZ2RGB,o=j.RefWhiteRGB,u=j.Xn,c=j.Yn,i=j.Zn,l=u*t.m00+c*t.m10+i*t.m20,h=u*t.m01+c*t.m11+i*t.m21,s=u*t.m02+c*t.m12+i*t.m22,d=o.X*t.m00+o.Y*t.m10+o.Z*t.m20,b=o.X*t.m01+o.Y*t.m11+o.Z*t.m21,g=o.X*t.m02+o.Y*t.m12+o.Z*t.m22,v=(r*t.m00+n*t.m10+e*t.m20)*(d/l),p=(r*t.m01+n*t.m11+e*t.m21)*(b/h),m=(r*t.m02+n*t.m12+e*t.m22)*(g/s),y=v*a.m00+p*a.m10+m*a.m20,w=v*a.m01+p*a.m11+m*a.m21,k=v*a.m02+p*a.m12+m*a.m22;return [255*U(y*f.m00+w*f.m10+k*f.m20),255*U(y*f.m01+w*f.m11+k*f.m21),255*U(y*f.m02+w*f.m12+k*f.m22)]},D=Math.sin,T=Math.cos,H=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"lch"),t=e[0],a=e[1],f=e[2];return isNaN(f)&&(f=0),[t,T(f*=m)*a,D(f)*a]},J=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=(r=i(r,"lch"))[0],t=r[1],a=r[2],f=H(e,t,a),o=f[0],u=f[1],c=f[2],l=K(o,u,c);return [l[0],l[1],l[2],r.length>3?r[3]:1]},Q=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e,t,a=(r=i(r,"lab"))[0],f=r[1],o=r[2],u=r.slice(3),c=(e=[[1.2268798758459243,-.5578149944602171,.2813910456659647],[-.0405757452148008,1.112286803280317,-.0717110580655164],[-.0763729366746601,-.4214933324022432,1.5869240198367816]],t=X([[1,.3963377773761749,.2158037573099136],[1,-.1055613458156586,-.0638541728258133],[1,-.0894841775298119,-1.2914855480194092]],[a,f,o]),X(e,t.map((function(r){return Math.pow(r,3)})))),l=c[0],h=c[1],s=c[2],d=V(l,h,s);return [d[0],d[1],d[2]].concat(u.length>0&&u[0]<1?[u[0]]:[])};var rr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=(r=i(r,"lch"))[0],t=r[1],a=r[2],f=r.slice(3),o=H(e,t,a),u=o[0],c=o[1],l=o[2],h=Q(u,c,l);return [h[0],h[1],h[2]].concat(f.length>0&&f[0]<1?[f[0]]:[])},nr=/((?:-?\d+)|(?:-?\d+(?:\.\d+)?)%|none)/.source,er=/((?:-?(?:\d+(?:\.\d*)?|\.\d+)%?)|none)/.source,tr=/((?:-?(?:\d+(?:\.\d*)?|\.\d+)%)|none)/.source,ar=/\s*/.source,fr=/\s+/.source,or=/\s*,\s*/.source,ur=/((?:-?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?)|none)/.source,cr=/\s*(?:\/\s*((?:[01]|[01]?\.\d+)|\d+(?:\.\d+)?%))?/.source,ir=new RegExp("^rgba?\\("+ar+[nr,nr,nr].join(fr)+cr+"\\)$"),lr=new RegExp("^rgb\\("+ar+[nr,nr,nr].join(or)+ar+"\\)$"),hr=new RegExp("^rgba\\("+ar+[nr,nr,nr,er].join(or)+ar+"\\)$"),sr=new RegExp("^hsla?\\("+ar+[ur,tr,tr].join(fr)+cr+"\\)$"),dr=new RegExp("^hsl?\\("+ar+[ur,tr,tr].join(or)+ar+"\\)$"),br=/^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,gr=new RegExp("^lab\\("+ar+[er,er,er].join(fr)+cr+"\\)$"),vr=new RegExp("^lch\\("+ar+[er,er,ur].join(fr)+cr+"\\)$"),pr=new RegExp("^oklab\\("+ar+[er,er,er].join(fr)+cr+"\\)$"),mr=new RegExp("^oklch\\("+ar+[er,er,ur].join(fr)+cr+"\\)$"),yr=Math.round,wr=function(r){return r.map((function(r,n){return n<=2?e(yr(r),0,255):r}))},kr=function(r,n,e,t){return void 0===n&&(n=0),void 0===e&&(e=100),void 0===t&&(t=!1),"string"==typeof r&&r.endsWith("%")&&(r=parseFloat(r.substring(0,r.length-1))/100,r=t?n+.5*(r+1)*(e-n):n+r*(e-n)),+r},Mr=function(r,n){return "none"===r?n:r},Nr=function(r){if("transparent"===(r=r.toLowerCase().trim()))return [0,0,0,0];var n;if(k.format.named)try{return k.format.named(r)}catch(r){}if((n=r.match(ir))||(n=r.match(lr))){for(var e=n.slice(1,4),t=0;t<3;t++)e[t]=+kr(Mr(e[t],0),0,255);e=wr(e);var a=void 0!==n[4]?+kr(n[4],0,1):1;return e[3]=a,e}if(n=r.match(hr)){for(var f=n.slice(1,5),o=0;o<4;o++)f[o]=+kr(f[o],0,255);return f}if((n=r.match(sr))||(n=r.match(dr))){var u=n.slice(1,4);u[0]=+Mr(u[0].replace("deg",""),0),u[1]=.01*+kr(Mr(u[1],0),0,100),u[2]=.01*+kr(Mr(u[2],0),0,100);var c=wr(I(u)),i=void 0!==n[4]?+kr(n[4],0,1):1;return c[3]=i,c}if(n=r.match(br)){var l=n.slice(1,4);l[1]*=.01,l[2]*=.01;for(var h=I(l),s=0;s<3;s++)h[s]=yr(h[s]);return h[3]=+n[4],h}if(n=r.match(gr)){var d=n.slice(1,4);d[0]=kr(Mr(d[0],0),0,100),d[1]=kr(Mr(d[1],0),-125,125,!0),d[2]=kr(Mr(d[2],0),-125,125,!0);var b=O();R("d50");var g=wr(K(d));R(b);var v=void 0!==n[4]?+kr(n[4],0,1):1;return g[3]=v,g}if(n=r.match(vr)){var p=n.slice(1,4);p[0]=kr(p[0],0,100),p[1]=kr(Mr(p[1],0),0,150,!1),p[2]=+Mr(p[2].replace("deg",""),0);var m=O();R("d50");var y=wr(J(p));R(m);var w=void 0!==n[4]?+kr(n[4],0,1):1;return y[3]=w,y}if(n=r.match(pr)){var M=n.slice(1,4);M[0]=kr(Mr(M[0],0),0,1),M[1]=kr(Mr(M[1],0),-.4,.4,!0),M[2]=kr(Mr(M[2],0),-.4,.4,!0);var N=wr(Q(M)),x=void 0!==n[4]?+kr(n[4],0,1):1;return N[3]=x,N}if(n=r.match(mr)){var _=n.slice(1,4);_[0]=kr(Mr(_[0],0),0,1),_[1]=kr(Mr(_[1],0),0,.4,!1),_[2]=+Mr(_[2].replace("deg",""),0);var A=wr(rr(_)),j=void 0!==n[4]?+kr(n[4],0,1):1;return A[3]=j,A}};Nr.test=function(r){return ir.test(r)||sr.test(r)||gr.test(r)||vr.test(r)||pr.test(r)||mr.test(r)||lr.test(r)||hr.test(r)||dr.test(r)||br.test(r)||"transparent"===r},M.prototype.css=function(r){return W(this._rgb,r)};var xr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["css"])))};N.css=xr,k.format.css=Nr,k.autodetect.push({p:5,test:function(r){for(var n=[],e=arguments.length-1;e-- >0;)n[e]=arguments[e+1];if(!n.length&&"string"===c(r)&&Nr.test(r))return "css"}}),k.format.gl=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgba");return e[0]*=255,e[1]*=255,e[2]*=255,e};var _r=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["gl"])))};N.gl=_r,M.prototype.gl=function(){var r=this._rgb;return [r[0]/255,r[1]/255,r[2]/255,r[3]]};var Ar=Math.floor;M.prototype.hcg=function(){return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e,t=i(r,"rgb"),a=t[0],f=t[1],o=t[2],u=s(a,f,o),c=d(a,f,o),l=c-u,h=100*l/255,b=u/(255-l)*100;return 0===l?e=Number.NaN:(a===c&&(e=(f-o)/l),f===c&&(e=2+(o-a)/l),o===c&&(e=4+(a-f)/l),(e*=60)<0&&(e+=360)),[e,h,b]}(this._rgb)};var jr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["hcg"])))};N.hcg=jr,k.format.hcg=function(){for(var r,n,e,t,a,f,o=[],u=arguments.length;u--;)o[u]=arguments[u];var c,l,h,s=(o=i(o,"hcg"))[0],d=o[1],b=o[2];b*=255;var g=255*d;if(0===d)c=l=h=b;else {360===s&&(s=0),s>360&&(s-=360),s<0&&(s+=360);var v=Ar(s/=60),p=s-v,m=b*(1-d),y=m+g*(1-p),w=m+g*p,k=m+g;switch(v){case 0:c=(r=[k,w,m])[0],l=r[1],h=r[2];break;case 1:c=(n=[y,k,m])[0],l=n[1],h=n[2];break;case 2:c=(e=[m,k,w])[0],l=e[1],h=e[2];break;case 3:c=(t=[m,y,k])[0],l=t[1],h=t[2];break;case 4:c=(a=[w,m,k])[0],l=a[1],h=a[2];break;case 5:c=(f=[k,m,y])[0],l=f[1],h=f[2];}}return [c,l,h,o.length>3?o[3]:1]},k.autodetect.push({p:1,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"hcg"))&&3===r.length)return "hcg"}});var Er=/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,Rr=/^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/,Or=function(r){if(r.match(Er)){4!==r.length&&7!==r.length||(r=r.substr(1)),3===r.length&&(r=(r=r.split(""))[0]+r[0]+r[1]+r[1]+r[2]+r[2]);var n=parseInt(r,16);return [n>>16,n>>8&255,255&n,1]}if(r.match(Rr)){5!==r.length&&9!==r.length||(r=r.substr(1)),4===r.length&&(r=(r=r.split(""))[0]+r[0]+r[1]+r[1]+r[2]+r[2]+r[3]+r[3]);var e=parseInt(r,16);return [e>>24&255,e>>16&255,e>>8&255,Math.round((255&e)/255*100)/100]}throw new Error("unknown hex color: "+r)},Pr=Math.round,Fr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgba"),t=e[0],a=e[1],f=e[2],o=e[3],u=l(r)||"auto";void 0===o&&(o=1),"auto"===u&&(u=o<1?"rgba":"rgb");var c="000000"+((t=Pr(t))<<16|(a=Pr(a))<<8|(f=Pr(f))).toString(16);c=c.substr(c.length-6);var h="0"+Pr(255*o).toString(16);switch(h=h.substr(h.length-2),u.toLowerCase()){case"rgba":return "#"+c+h;case"argb":return "#"+h+c;default:return "#"+c}};M.prototype.hex=function(r){return Fr(this._rgb,r)};var Lr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["hex"])))};N.hex=Lr,k.format.hex=Or,k.autodetect.push({p:4,test:function(r){for(var n=[],e=arguments.length-1;e-- >0;)n[e]=arguments[e+1];if(!n.length&&"string"===c(r)&&[3,4,5,6,7,8,9].indexOf(r.length)>=0)return "hex"}});var Br=Math.cos,Gr=Math.min,Yr=Math.sqrt,qr=Math.acos;M.prototype.hsi=function(){return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e,t=i(r,"rgb"),a=t[0],f=t[1],o=t[2],u=Gr(a/=255,f/=255,o/=255),c=(a+f+o)/3,l=c>0?1-u/c:0;return 0===l?e=NaN:(e=(a-f+(a-o))/2,e/=Yr((a-f)*(a-f)+(a-o)*(f-o)),e=qr(e),o>f&&(e=v-e),e/=v),[360*e,l,c]}(this._rgb)};var Cr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["hsi"])))};N.hsi=Cr,k.format.hsi=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var t,a,f,o=(r=i(r,"hsi"))[0],u=r[1],c=r[2];return isNaN(o)&&(o=0),isNaN(u)&&(u=0),o>360&&(o-=360),o<0&&(o+=360),(o/=360)<1/3?a=1-((f=(1-u)/3)+(t=(1+u*Br(v*o)/Br(p-v*o))/3)):o<2/3?f=1-((t=(1-u)/3)+(a=(1+u*Br(v*(o-=1/3))/Br(p-v*o))/3)):t=1-((a=(1-u)/3)+(f=(1+u*Br(v*(o-=2/3))/Br(p-v*o))/3)),[255*(t=e(c*t*3)),255*(a=e(c*a*3)),255*(f=e(c*f*3)),r.length>3?r[3]:1]},k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"hsi"))&&3===r.length)return "hsi"}}),M.prototype.hsl=function(){return A(this._rgb)};var Xr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["hsl"])))};N.hsl=Xr,k.format.hsl=I,k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"hsl"))&&3===r.length)return "hsl"}});var Zr=Math.floor,$r=Math.min,Sr=Math.max;M.prototype.hsv=function(){return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e,t,a,f=(r=i(r,"rgb"))[0],o=r[1],u=r[2],c=$r(f,o,u),l=Sr(f,o,u),h=l-c;return a=l/255,0===l?(e=Number.NaN,t=0):(t=h/l,f===l&&(e=(o-u)/h),o===l&&(e=2+(u-f)/h),u===l&&(e=4+(f-o)/h),(e*=60)<0&&(e+=360)),[e,t,a]}(this._rgb)};var Wr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["hsv"])))};N.hsv=Wr,k.format.hsv=function(){for(var r,n,e,t,a,f,o=[],u=arguments.length;u--;)o[u]=arguments[u];var c,l,h,s=(o=i(o,"hsv"))[0],d=o[1],b=o[2];if(b*=255,0===d)c=l=h=b;else {360===s&&(s=0),s>360&&(s-=360),s<0&&(s+=360);var g=Zr(s/=60),v=s-g,p=b*(1-d),m=b*(1-d*v),y=b*(1-d*(1-v));switch(g){case 0:c=(r=[b,y,p])[0],l=r[1],h=r[2];break;case 1:c=(n=[m,b,p])[0],l=n[1],h=n[2];break;case 2:c=(e=[p,b,y])[0],l=e[1],h=e[2];break;case 3:c=(t=[p,m,b])[0],l=t[1],h=t[2];break;case 4:c=(a=[y,p,b])[0],l=a[1],h=a[2];break;case 5:c=(f=[b,p,m])[0],l=f[1],h=f[2];}}return [c,l,h,o.length>3?o[3]:1]},k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"hsv"))&&3===r.length)return "hsv"}}),M.prototype.lab=function(){return P(this._rgb)};var Ir=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["lab"])))};Object.assign(N,{lab:Ir,getLabWhitePoint:O,setLabWhitePoint:R}),k.format.lab=K,k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"lab"))&&3===r.length)return "lab"}});M.prototype.lch=function(){return C(this._rgb)},M.prototype.hcl=function(){return w(C(this._rgb))};var Kr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["lch"])))},zr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["hcl"])))};Object.assign(N,{lch:Kr,hcl:zr}),k.format.lch=J,k.format.hcl=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=w(i(r,"hcl"));return J.apply(void 0,e)},["lch","hcl"].forEach((function(r){return k.autodetect.push({p:2,test:function(){for(var n=[],e=arguments.length;e--;)n[e]=arguments[e];if("array"===c(n=i(n,r))&&3===n.length)return r}})}));M.prototype.num=function(){return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgb");return (e[0]<<16)+(e[1]<<8)+e[2]}(this._rgb)};var Ur=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["num"])))};Object.assign(N,{num:Ur}),k.format.num=function(r){if("number"==c(r)&&r>=0&&r<=16777215)return [r>>16,r>>8&255,255&r,1];throw new Error("unknown num color: "+r)},k.autodetect.push({p:5,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if(1===r.length&&"number"===c(r[0])&&r[0]>=0&&r[0]<=16777215)return "num"}});var Vr=Math.round;M.prototype.rgb=function(r){return void 0===r&&(r=!0),!1===r?this._rgb.slice(0,3):this._rgb.slice(0,3).map(Vr)},M.prototype.rgba=function(r){return void 0===r&&(r=!0),this._rgb.slice(0,4).map((function(n,e){return e<3?!1===r?n:Vr(n):n}))};var Dr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["rgb"])))};Object.assign(N,{rgb:Dr}),k.format.rgb=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];var e=i(r,"rgba");return void 0===e[3]&&(e[3]=1),e},k.autodetect.push({p:3,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"rgba"))&&(3===r.length||4===r.length&&"number"==c(r[3])&&r[3]>=0&&r[3]<=1))return "rgb"}});var Tr=Math.log,Hr=function(r){var n,e,t,a=r/100;return a<66?(n=255,e=a<6?0:-155.25485562709179-.44596950469579133*(e=a-2)+104.49216199393888*Tr(e),t=a<20?0:.8274096064007395*(t=a-10)-254.76935184120902+115.67994401066147*Tr(t)):(n=351.97690566805693+.114206453784165*(n=a-55)-40.25366309332127*Tr(n),e=325.4494125711974+.07943456536662342*(e=a-50)-28.0852963507957*Tr(e),t=255),[n,e,t,1]},Jr=Math.round;M.prototype.temp=M.prototype.kelvin=M.prototype.temperature=function(){return function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];for(var e,t=i(r,"rgb"),a=t[0],f=t[2],o=1e3,u=4e4;u-o>.4;){var c=Hr(e=.5*(u+o));c[2]/c[0]>=f/a?u=e:o=e;}return Jr(e)}(this._rgb)};var Qr=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["temp"])))};Object.assign(N,{temp:Qr,kelvin:Qr,temperature:Qr}),k.format.temp=k.format.kelvin=k.format.temperature=Hr,M.prototype.oklab=function(){return Z(this._rgb)};var rn=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["oklab"])))};Object.assign(N,{oklab:rn}),k.format.oklab=Q,k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"oklab"))&&3===r.length)return "oklab"}}),M.prototype.oklch=function(){return $(this._rgb)};var nn=function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];return new(Function.prototype.bind.apply(M,[null].concat(r,["oklch"])))};Object.assign(N,{oklch:nn}),k.format.oklch=rr,k.autodetect.push({p:2,test:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];if("array"===c(r=i(r,"oklch"))&&3===r.length)return "oklch"}});var en={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",laserlemon:"#ffff54",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrod:"#fafad2",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",maroon2:"#7f0000",maroon3:"#b03060",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",purple2:"#7f007f",purple3:"#a020f0",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};M.prototype.name=function(){for(var r=Fr(this._rgb,"rgb"),n=0,e=Object.keys(en);n<e.length;n+=1){var t=e[n];if(en[t]===r)return t.toLowerCase()}return r},k.format.named=function(r){if(r=r.toLowerCase(),en[r])return Or(en[r]);throw new Error("unknown color name: "+r)},k.autodetect.push({p:5,test:function(r){for(var n=[],e=arguments.length-1;e-- >0;)n[e]=arguments[e+1];if(!n.length&&"string"===c(r)&&en[r.toLowerCase()])return "named"}}),M.prototype.alpha=function(r,n){return void 0===n&&(n=!1),void 0!==r&&"number"===c(r)?n?(this._rgb[3]=r,this):new M([this._rgb[0],this._rgb[1],this._rgb[2],r],"rgb"):this._rgb[3]},M.prototype.clipped=function(){return this._rgb._clipped||!1},M.prototype.darken=function(r){void 0===r&&(r=1);var n=this.lab();return n[0]-=j.Kn*r,new M(n,"lab").alpha(this.alpha(),!0)},M.prototype.brighten=function(r){return void 0===r&&(r=1),this.darken(-r)},M.prototype.darker=M.prototype.darken,M.prototype.brighter=M.prototype.brighten,M.prototype.get=function(r){var n=r.split("."),e=n[0],t=n[1],a=this[e]();if(t){var f=e.indexOf(t)-("ok"===e.substr(0,2)?2:0);if(f>-1)return a[f];throw new Error("unknown channel "+t+" in mode "+e)}return a};var tn=Math.pow;M.prototype.luminance=function(r,n){if(void 0===n&&(n="rgb"),void 0!==r&&"number"===c(r)){if(0===r)return new M([0,0,0,this._rgb[3]],"rgb");if(1===r)return new M([255,255,255,this._rgb[3]],"rgb");var e=this.luminance(),t=20,a=function(e,f){var o=e.interpolate(f,.5,n),u=o.luminance();return Math.abs(r-u)<1e-7||!t--?o:u>r?a(e,o):a(o,f)},f=(e>r?a(new M([0,0,0]),this):a(this,new M([255,255,255]))).rgb();return new M(f.concat([this._rgb[3]]))}return an.apply(void 0,this._rgb.slice(0,3))};var an=function(r,n,e){return .2126*(r=fn(r))+.7152*(n=fn(n))+.0722*(e=fn(e))},fn=function(r){return (r/=255)<=.03928?r/12.92:tn((r+.055)/1.055,2.4)},on={};function un(r,n,e){void 0===e&&(e=.5);for(var t=[],a=arguments.length-3;a-- >0;)t[a]=arguments[a+3];var f=t[0]||"lrgb";if(on[f]||t.length||(f=Object.keys(on)[0]),!on[f])throw new Error("interpolation mode "+f+" is not defined");return "object"!==c(r)&&(r=new M(r)),"object"!==c(n)&&(n=new M(n)),on[f](r,n,e).alpha(r.alpha()+e*(n.alpha()-r.alpha()))}M.prototype.mix=M.prototype.interpolate=function(r,n){void 0===n&&(n=.5);for(var e=[],t=arguments.length-2;t-- >0;)e[t]=arguments[t+2];return un.apply(void 0,[this,r,n].concat(e))},M.prototype.premultiply=function(r){void 0===r&&(r=!1);var n=this._rgb,e=n[3];return r?(this._rgb=[n[0]*e,n[1]*e,n[2]*e,e],this):new M([n[0]*e,n[1]*e,n[2]*e,e],"rgb")},M.prototype.saturate=function(r){void 0===r&&(r=1);var n=this.lch();return n[1]+=j.Kn*r,n[1]<0&&(n[1]=0),new M(n,"lch").alpha(this.alpha(),!0)},M.prototype.desaturate=function(r){return void 0===r&&(r=1),this.saturate(-r)},M.prototype.set=function(r,n,e){void 0===e&&(e=!1);var t=r.split("."),a=t[0],f=t[1],o=this[a]();if(f){var u=a.indexOf(f)-("ok"===a.substr(0,2)?2:0);if(u>-1){if("string"==c(n))switch(n.charAt(0)){case"+":case"-":o[u]+=+n;break;case"*":o[u]*=+n.substr(1);break;case"/":o[u]/=+n.substr(1);break;default:o[u]=+n;}else {if("number"!==c(n))throw new Error("unsupported value for Color.set");o[u]=n;}var i=new M(o,a);return e?(this._rgb=i._rgb,this):i}throw new Error("unknown channel "+f+" in mode "+a)}return o},M.prototype.tint=function(r){void 0===r&&(r=.5);for(var n=[],e=arguments.length-1;e-- >0;)n[e]=arguments[e+1];return un.apply(void 0,[this,"white",r].concat(n))},M.prototype.shade=function(r){void 0===r&&(r=.5);for(var n=[],e=arguments.length-1;e-- >0;)n[e]=arguments[e+1];return un.apply(void 0,[this,"black",r].concat(n))};on.rgb=function(r,n,e){var t=r._rgb,a=n._rgb;return new M(t[0]+e*(a[0]-t[0]),t[1]+e*(a[1]-t[1]),t[2]+e*(a[2]-t[2]),"rgb")};var cn=Math.sqrt,ln=Math.pow;on.lrgb=function(r,n,e){var t=r._rgb,a=t[0],f=t[1],o=t[2],u=n._rgb,c=u[0],i=u[1],l=u[2];return new M(cn(ln(a,2)*(1-e)+ln(c,2)*e),cn(ln(f,2)*(1-e)+ln(i,2)*e),cn(ln(o,2)*(1-e)+ln(l,2)*e),"rgb")};function hn(r,n,e,t){var a,f,o,u,c,i,l,h,s,d,b,g,v;return "hsl"===t?(o=r.hsl(),u=n.hsl()):"hsv"===t?(o=r.hsv(),u=n.hsv()):"hcg"===t?(o=r.hcg(),u=n.hcg()):"hsi"===t?(o=r.hsi(),u=n.hsi()):"lch"===t||"hcl"===t?(t="hcl",o=r.hcl(),u=n.hcl()):"oklch"===t&&(o=r.oklch().reverse(),u=n.oklch().reverse()),"h"!==t.substr(0,1)&&"oklch"!==t||(c=(a=o)[0],l=a[1],s=a[2],i=(f=u)[0],h=f[1],d=f[2]),isNaN(c)||isNaN(i)?isNaN(c)?isNaN(i)?g=Number.NaN:(g=i,1!=s&&0!=s||"hsv"==t||(b=h)):(g=c,1!=d&&0!=d||"hsv"==t||(b=l)):g=c+e*(i>c&&i-c>180?i-(c+360):i<c&&c-i>180?i+360-c:i-c),void 0===b&&(b=l+e*(h-l)),v=s+e*(d-s),new M("oklch"===t?[v,b,g]:[g,b,v],t)}on.lab=function(r,n,e){var t=r.lab(),a=n.lab();return new M(t[0]+e*(a[0]-t[0]),t[1]+e*(a[1]-t[1]),t[2]+e*(a[2]-t[2]),"lab")};var sn=function(r,n,e){return hn(r,n,e,"lch")};on.lch=sn,on.hcl=sn;on.num=function(r,n,e){var t=r.num(),a=n.num();return new M(t+e*(a-t),"num")};on.hcg=function(r,n,e){return hn(r,n,e,"hcg")};on.hsi=function(r,n,e){return hn(r,n,e,"hsi")};on.hsl=function(r,n,e){return hn(r,n,e,"hsl")};on.hsv=function(r,n,e){return hn(r,n,e,"hsv")};on.oklab=function(r,n,e){var t=r.oklab(),a=n.oklab();return new M(t[0]+e*(a[0]-t[0]),t[1]+e*(a[1]-t[1]),t[2]+e*(a[2]-t[2]),"oklab")};on.oklch=function(r,n,e){return hn(r,n,e,"oklch")};var dn=Math.pow,bn=Math.sqrt,gn=Math.PI,vn=Math.cos,pn=Math.sin,mn=Math.atan2;var yn=function(r,n){for(var e=r.length,a=[0,0,0,0],f=0;f<r.length;f++){var o=r[f],u=n[f]/e,c=o._rgb;a[0]+=dn(c[0],2)*u,a[1]+=dn(c[1],2)*u,a[2]+=dn(c[2],2)*u,a[3]+=c[3]*u;}return a[0]=bn(a[0]),a[1]=bn(a[1]),a[2]=bn(a[2]),a[3]>.9999999&&(a[3]=1),new M(t(a))},wn=Math.pow;function kn(r){var n="rgb",t=N("#ccc"),a=0,f=[0,1],o=[0,1],u=[],i=[0,0],l=!1,h=[],s=!1,d=0,b=1,g=!1,v={},p=!0,m=1,y=function(r){if((r=r||["#fff","#000"])&&"string"===c(r)&&N.brewer&&N.brewer[r.toLowerCase()]&&(r=N.brewer[r.toLowerCase()]),"array"===c(r)){1===r.length&&(r=[r[0],r[0]]),r=r.slice(0);for(var n=0;n<r.length;n++)r[n]=N(r[n]);u.length=0;for(var e=0;e<r.length;e++)u.push(e/(r.length-1));}return x(),h=r},w=function(r){return r},k=function(r){return r},M=function(r,a){var f,o;if(null==a&&(a=!1),isNaN(r)||null===r)return t;if(a)o=r;else if(l&&l.length>2){var s=function(r){if(null!=l){for(var n=l.length-1,e=0;e<n&&r>=l[e];)e++;return e-1}return 0}(r);o=s/(l.length-2);}else o=b!==d?(r-d)/(b-d):1;o=k(o),a||(o=w(o)),1!==m&&(o=wn(o,m)),o=e(o=i[0]+o*(1-i[0]-i[1]),0,1);var g=Math.floor(1e4*o);if(p&&v[g])f=v[g];else {if("array"===c(h))for(var y=0;y<u.length;y++){var M=u[y];if(o<=M){f=h[y];break}if(o>=M&&y===u.length-1){f=h[y];break}if(o>M&&o<u[y+1]){o=(o-M)/(u[y+1]-M),f=N.interpolate(h[y],h[y+1],o,n);break}}else "function"===c(h)&&(f=h(o));p&&(v[g]=f);}return f},x=function(){return v={}};y(r);var _=function(r){var n=N(M(r));return s&&n[s]?n[s]():n};return _.classes=function(r){if(null!=r){if("array"===c(r))l=r,f=[r[0],r[r.length-1]];else {var n=N.analyze(f);l=0===r?[n.min,n.max]:N.limits(n,"e",r);}return _}return l},_.domain=function(r){if(!arguments.length)return o;o=r.slice(0),d=r[0],b=r[r.length-1],u=[];var n=h.length;if(r.length===n&&d!==b)for(var e=0,t=Array.from(r);e<t.length;e+=1){var a=t[e];u.push((a-d)/(b-d));}else {for(var c=0;c<n;c++)u.push(c/(n-1));if(r.length>2){var i=r.map((function(n,e){return e/(r.length-1)})),l=r.map((function(r){return (r-d)/(b-d)}));l.every((function(r,n){return i[n]===r}))||(k=function(r){if(r<=0||r>=1)return r;for(var n=0;r>=l[n+1];)n++;var e=(r-l[n])/(l[n+1]-l[n]);return i[n]+e*(i[n+1]-i[n])});}}return f=[d,b],_},_.mode=function(r){return arguments.length?(n=r,x(),_):n},_.range=function(r,n){return y(r),_},_.out=function(r){return s=r,_},_.spread=function(r){return arguments.length?(a=r,_):a},_.correctLightness=function(r){return null==r&&(r=!0),g=r,x(),w=g?function(r){for(var n=M(0,!0).lab()[0],e=M(1,!0).lab()[0],t=n>e,a=M(r,!0).lab()[0],f=n+(e-n)*r,o=a-f,u=0,c=1,i=20;Math.abs(o)>.01&&i-- >0;)t&&(o*=-1),o<0?(u=r,r+=.5*(c-r)):(c=r,r+=.5*(u-r)),a=M(r,!0).lab()[0],o=a-f;return r}:function(r){return r},_},_.padding=function(r){return null!=r?("number"===c(r)&&(r=[r,r]),i=r,_):i},_.colors=function(n,e){arguments.length<2&&(e="hex");var t=[];if(0===arguments.length)t=h.slice(0);else if(1===n)t=[_(.5)];else if(n>1){var a=f[0],o=f[1]-a;t=function(r,n){for(var e=[],t=r<n,a=n,f=r;t?f<a:f>a;t?f++:f--)e.push(f);return e}(0,n).map((function(r){return _(a+r/(n-1)*o)}));}else {r=[];var u=[];if(l&&l.length>2)for(var c=1,i=l.length,s=1<=i;s?c<i:c>i;s?c++:c--)u.push(.5*(l[c-1]+l[c]));else u=f;t=u.map((function(r){return _(r)}));}return N[e]&&(t=t.map((function(r){return r[e]()}))),t},_.cache=function(r){return null!=r?(p=r,_):p},_.gamma=function(r){return null!=r?(m=r,_):m},_.nodata=function(r){return null!=r?(t=N(r),_):t},_}var Mn=function(r,n,e){if(!Mn[e])throw new Error("unknown blend mode "+e);return Mn[e](r,n)},Nn=function(r){return function(n,e){var t=N(e).rgb(),a=N(n).rgb();return N.rgb(r(t,a))}},xn=function(r){return function(n,e){var t=[];return t[0]=r(n[0],e[0]),t[1]=r(n[1],e[1]),t[2]=r(n[2],e[2]),t}};Mn.normal=Nn(xn((function(r){return r}))),Mn.multiply=Nn(xn((function(r,n){return r*n/255}))),Mn.screen=Nn(xn((function(r,n){return 255*(1-(1-r/255)*(1-n/255))}))),Mn.overlay=Nn(xn((function(r,n){return n<128?2*r*n/255:255*(1-2*(1-r/255)*(1-n/255))}))),Mn.darken=Nn(xn((function(r,n){return r>n?n:r}))),Mn.lighten=Nn(xn((function(r,n){return r>n?r:n}))),Mn.dodge=Nn(xn((function(r,n){return 255===r||(r=n/255*255/(1-r/255))>255?255:r}))),Mn.burn=Nn(xn((function(r,n){return 255*(1-(1-n/255)/(r/255))})));var _n=Math.pow,An=Math.sin,jn=Math.cos;var En=Math.floor,Rn=Math.random;var On=Math.log,Pn=Math.pow,Fn=Math.floor,Ln=Math.abs;function Bn(r,n){void 0===n&&(n=null);var e={min:Number.MAX_VALUE,max:-1*Number.MAX_VALUE,sum:0,values:[],count:0};return "object"===c(r)&&(r=Object.values(r)),r.forEach((function(r){n&&"object"===c(r)&&(r=r[n]),null==r||isNaN(r)||(e.values.push(r),e.sum+=r,r<e.min&&(e.min=r),r>e.max&&(e.max=r),e.count+=1);})),e.domain=[e.min,e.max],e.limits=function(r,n){return Gn(e,r,n)},e}function Gn(r,n,e){void 0===n&&(n="equal"),void 0===e&&(e=7),"array"==c(r)&&(r=Bn(r));var t=r.min,a=r.max,f=r.values.sort((function(r,n){return r-n}));if(1===e)return [t,a];var o=[];if("c"===n.substr(0,1)&&(o.push(t),o.push(a)),"e"===n.substr(0,1)){o.push(t);for(var u=1;u<e;u++)o.push(t+u/e*(a-t));o.push(a);}else if("l"===n.substr(0,1)){if(t<=0)throw new Error("Logarithmic scales are only possible for values > 0");var i=Math.LOG10E*On(t),l=Math.LOG10E*On(a);o.push(t);for(var h=1;h<e;h++)o.push(Pn(10,i+h/e*(l-i)));o.push(a);}else if("q"===n.substr(0,1)){o.push(t);for(var s=1;s<e;s++){var d=(f.length-1)*s/e,b=Fn(d);if(b===d)o.push(f[b]);else {var g=d-b;o.push(f[b]*(1-g)+f[b+1]*g);}}o.push(a);}else if("k"===n.substr(0,1)){var v,p=f.length,m=new Array(p),y=new Array(e),w=!0,k=0,M=null;(M=[]).push(t);for(var N=1;N<e;N++)M.push(t+N/e*(a-t));for(M.push(a);w;){for(var x=0;x<e;x++)y[x]=0;for(var _=0;_<p;_++)for(var A=f[_],j=Number.MAX_VALUE,E=void 0,R=0;R<e;R++){var O=Ln(M[R]-A);O<j&&(j=O,E=R),y[E]++,m[_]=E;}for(var P=new Array(e),F=0;F<e;F++)P[F]=null;for(var L=0;L<p;L++)null===P[v=m[L]]?P[v]=f[L]:P[v]+=f[L];for(var B=0;B<e;B++)P[B]*=1/y[B];w=!1;for(var G=0;G<e;G++)if(P[G]!==M[G]){w=!0;break}M=P,++k>200&&(w=!1);}for(var Y={},q=0;q<e;q++)Y[q]=[];for(var C=0;C<p;C++)Y[v=m[C]].push(f[C]);for(var X=[],Z=0;Z<e;Z++)X.push(Y[Z][0]),X.push(Y[Z][Y[Z].length-1]);X=X.sort((function(r,n){return r-n})),o.push(X[0]);for(var $=1;$<X.length;$+=2){var S=X[$];isNaN(S)||-1!==o.indexOf(S)||o.push(S);}}return o}
  	/**
  	     * @license
  	     *
  	     * The APCA contrast prediction algorithm is based of the formulas published
  	     * in the APCA-1.0.98G specification by Myndex. The specification is available at:
  	     * https://raw.githubusercontent.com/Myndex/apca-w3/master/images/APCAw3_0.1.17_APCA0.0.98G.svg
  	     *
  	     * Note that the APCA implementation is still beta, so please update to
  	     * future versions of chroma.js when they become available.
  	     *
  	     * You can read more about the APCA Readability Criterion at
  	     * https://readtech.org/ARC/
  	     */
  	var Yn=.022;function qn(r,n,e){return .2126729*Math.pow(r/255,2.4)+.7151522*Math.pow(n/255,2.4)+.072175*Math.pow(e/255,2.4)}var Cn=Math.sqrt,Xn=Math.pow,Zn=Math.min,$n=Math.max,Sn=Math.atan2,Wn=Math.abs,In=Math.cos,Kn=Math.sin,zn=Math.exp,Un=Math.PI;var Vn={cool:function(){return kn([N.hsl(180,1,.9),N.hsl(250,.7,.4)])},hot:function(){return kn(["#000","#f00","#ff0","#fff"]).mode("rgb")}},Dn={OrRd:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],PuBu:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"],BuPu:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"],Oranges:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],BuGn:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"],YlOrBr:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],YlGn:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"],Reds:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],RdPu:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"],Greens:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],YlGnBu:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],Purples:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],GnBu:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],Greys:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"],YlOrRd:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"],PuRd:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"],Blues:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],PuBuGn:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"],Viridis:["#440154","#482777","#3f4a8a","#31678e","#26838f","#1f9d8a","#6cce5a","#b6de2b","#fee825"],Spectral:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],RdYlGn:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],RdBu:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],PiYG:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],PRGn:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],RdYlBu:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],BrBG:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],RdGy:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],PuOr:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],Set2:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"],Accent:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"],Set1:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"],Set3:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"],Dark2:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"],Paired:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],Pastel2:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"],Pastel1:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},Tn=Object.keys(Dn),Hn=new Map(Tn.map((function(r){return [r.toLowerCase(),r]}))),Jn="function"==typeof Proxy?new Proxy(Dn,{get:function(r,n){var e=n.toLowerCase();if(Hn.has(e))return r[Hn.get(e)]},getOwnPropertyNames:function(){return Object.getOwnPropertyNames(Tn)}}):Dn;return Object.assign(N,{analyze:Bn,average:function(r,n,e){void 0===n&&(n="lrgb"),void 0===e&&(e=null);var t=r.length;e||(e=Array.from(new Array(t)).map((function(){return 1})));var a=t/e.reduce((function(r,n){return r+n}));if(e.forEach((function(r,n){e[n]*=a;})),r=r.map((function(r){return new M(r)})),"lrgb"===n)return yn(r,e);for(var f=r.shift(),o=f.get(n),u=[],c=0,i=0,l=0;l<o.length;l++)if(o[l]=(o[l]||0)*e[0],u.push(isNaN(o[l])?0:e[0]),"h"===n.charAt(l)&&!isNaN(o[l])){var h=o[l]/180*gn;c+=vn(h)*e[0],i+=pn(h)*e[0];}var s=f.alpha()*e[0];r.forEach((function(r,t){var a=r.get(n);s+=r.alpha()*e[t+1];for(var f=0;f<o.length;f++)if(!isNaN(a[f]))if(u[f]+=e[t+1],"h"===n.charAt(f)){var l=a[f]/180*gn;c+=vn(l)*e[t+1],i+=pn(l)*e[t+1];}else o[f]+=a[f]*e[t+1];}));for(var d=0;d<o.length;d++)if("h"===n.charAt(d)){for(var b=mn(i/u[d],c/u[d])/gn*180;b<0;)b+=360;for(;b>=360;)b-=360;o[d]=b;}else o[d]=o[d]/u[d];return s/=t,new M(o,n).alpha(s>.99999?1:s,!0)},bezier:function(r){var n=function(r){var n,e,t,a,f,o,u;if(2===(r=r.map((function(r){return new M(r)}))).length)n=r.map((function(r){return r.lab()})),f=n[0],o=n[1],a=function(r){var n=[0,1,2].map((function(n){return f[n]+r*(o[n]-f[n])}));return new M(n,"lab")};else if(3===r.length)e=r.map((function(r){return r.lab()})),f=e[0],o=e[1],u=e[2],a=function(r){var n=[0,1,2].map((function(n){return (1-r)*(1-r)*f[n]+2*(1-r)*r*o[n]+r*r*u[n]}));return new M(n,"lab")};else if(4===r.length){var c;t=r.map((function(r){return r.lab()})),f=t[0],o=t[1],u=t[2],c=t[3],a=function(r){var n=[0,1,2].map((function(n){return (1-r)*(1-r)*(1-r)*f[n]+3*(1-r)*(1-r)*r*o[n]+3*(1-r)*r*r*u[n]+r*r*r*c[n]}));return new M(n,"lab")};}else {if(!(r.length>=5))throw new RangeError("No point in running bezier with only one color.");var i,l,h;i=r.map((function(r){return r.lab()})),h=r.length-1,l=function(r){for(var n=[1,1],e=1;e<r;e++){for(var t=[1],a=1;a<=n.length;a++)t[a]=(n[a]||0)+n[a-1];n=t;}return n}(h),a=function(r){var n=1-r,e=[0,1,2].map((function(e){return i.reduce((function(t,a,f){return t+l[f]*Math.pow(n,h-f)*Math.pow(r,f)*a[e]}),0)}));return new M(e,"lab")};}return a}(r);return n.scale=function(){return kn(n)},n},blend:Mn,brewer:Jn,Color:M,colors:en,contrast:function(r,n){r=new M(r),n=new M(n);var e=r.luminance(),t=n.luminance();return e>t?(e+.05)/(t+.05):(t+.05)/(e+.05)},contrastAPCA:function(r,n){r=new M(r),n=new M(n),r.alpha()<1&&(r=un(n,r,r.alpha(),"rgb"));var e=qn.apply(void 0,r.rgb()),t=qn.apply(void 0,n.rgb()),a=e>=Yn?e:e+Math.pow(Yn-e,1.414),f=t>=Yn?t:t+Math.pow(Yn-t,1.414),o=Math.pow(f,.56)-Math.pow(a,.57),u=Math.pow(f,.65)-Math.pow(a,.62),c=Math.abs(f-a)<5e-4?0:a<f?1.14*o:1.14*u;return 100*(Math.abs(c)<.1?0:c>0?c-.027:c+.027)},cubehelix:function(r,n,e,a,f){void 0===r&&(r=300),void 0===n&&(n=-1.5),void 0===e&&(e=1),void 0===a&&(a=1),void 0===f&&(f=[0,1]);var o,u=0;"array"===c(f)?o=f[1]-f[0]:(o=0,f=[f,f]);var i=function(c){var i=v*((r+120)/360+n*c),l=_n(f[0]+o*c,a),h=(0!==u?e[0]+c*u:e)*l*(1-l)/2,s=jn(i),d=An(i);return N(t([255*(l+h*(-.14861*s+1.78277*d)),255*(l+h*(-.29227*s-.90649*d)),255*(l+h*(1.97294*s)),1]))};return i.start=function(n){return null==n?r:(r=n,i)},i.rotations=function(r){return null==r?n:(n=r,i)},i.gamma=function(r){return null==r?a:(a=r,i)},i.hue=function(r){return null==r?e:("array"===c(e=r)?0===(u=e[1]-e[0])&&(e=e[1]):u=0,i)},i.lightness=function(r){return null==r?f:("array"===c(r)?(f=r,o=r[1]-r[0]):(f=[r,r],o=0),i)},i.scale=function(){return N.scale(i)},i.hue(e),i},deltaE:function(r,n,e,t,a){void 0===e&&(e=1),void 0===t&&(t=1),void 0===a&&(a=1);var f=function(r){return 360*r/(2*Un)},o=function(r){return 2*Un*r/360};r=new M(r),n=new M(n);var u=Array.from(r.lab()),c=u[0],i=u[1],l=u[2],h=Array.from(n.lab()),s=h[0],d=h[1],b=h[2],g=(c+s)/2,v=(Cn(Xn(i,2)+Xn(l,2))+Cn(Xn(d,2)+Xn(b,2)))/2,p=.5*(1-Cn(Xn(v,7)/(Xn(v,7)+Xn(25,7)))),m=i*(1+p),y=d*(1+p),w=Cn(Xn(m,2)+Xn(l,2)),k=Cn(Xn(y,2)+Xn(b,2)),N=(w+k)/2,x=f(Sn(l,m)),_=f(Sn(b,y)),A=x>=0?x:x+360,j=_>=0?_:_+360,E=Wn(A-j)>180?(A+j+360)/2:(A+j)/2,R=1-.17*In(o(E-30))+.24*In(o(2*E))+.32*In(o(3*E+6))-.2*In(o(4*E-63)),O=j-A;O=Wn(O)<=180?O:j<=A?O+360:O-360,O=2*Cn(w*k)*Kn(o(O)/2);var P=s-c,F=k-w,L=1+.015*Xn(g-50,2)/Cn(20+Xn(g-50,2)),B=1+.045*N,G=1+.015*N*R,Y=30*zn(-Xn((E-275)/25,2)),q=-(2*Cn(Xn(N,7)/(Xn(N,7)+Xn(25,7))))*Kn(2*o(Y)),C=Cn(Xn(P/(e*L),2)+Xn(F/(t*B),2)+Xn(O/(a*G),2)+q*(F/(t*B))*(O/(a*G)));return $n(0,Zn(100,C))},distance:function(r,n,e){void 0===e&&(e="lab"),r=new M(r),n=new M(n);var t=r.get(e),a=n.get(e),f=0;for(var o in t){var u=(t[o]||0)-(a[o]||0);f+=u*u;}return Math.sqrt(f)},input:k,interpolate:un,limits:Gn,mix:un,random:function(r){void 0===r&&(r=Rn);for(var n="#",e=0;e<6;e++)n+="0123456789abcdef".charAt(En(16*r()));return new M(n,"hex")},scale:kn,scales:Vn,valid:function(){for(var r=[],n=arguments.length;n--;)r[n]=arguments[n];try{return new(Function.prototype.bind.apply(M,[null].concat(r))),!0}catch(r){return !1}},cmyk:_,css:xr,gl:_r,hcg:jr,hex:Lr,hsi:Cr,hsl:Xr,hsv:Wr,lab:Ir,lch:Kr,hcl:zr,num:Ur,rgb:Dr,temp:Qr,kelvin:Qr,temperature:Qr,oklab:rn,oklch:nn,getLabWhitePoint:O,setLabWhitePoint:R}),N})); 
  } (chroma_min));

  var chroma_minExports = chroma_min.exports;
  var chroma = /*@__PURE__*/getDefaultExportFromCjs(chroma_minExports);

  /**
   * Main random number generator class with seed-based deterministic randomness
   * Provides various random number generation methods and seed management
   * Uses a high-quality pseudo-random number generator (mulberry32) for consistent results
   *
   * @example
   * // Create a new RNG with a seed
   * const rng = new RNG('mySeed123');
   *
   * // Generate random numbers
   * const randomValue = rng.random(0, 100);
   * const randomInt = rng.intRange(1, 10);
   *
   * // Navigate seed history
   * rng.nextSeed();
   * rng.previousSeed();
   *
   */

  class RNG {
    /**
     * Create a new RNG instance
     * @param {string} [seedString] - Initial seed string. If not provided, a random seed is generated
     */
    constructor (seedString) {
      this._currentSeed = 0;
      this._seedString = '';
      this.reset(seedString);
    }

    /**
     * Debug method to log current seed state
     * @private
     * @returns {void}
     */
    _dump () {
      logDebug(this._seedString, this._currentSeed);
      logDebug(this._seedHistory, this._seedHistoryIndex);
    }

    /**
     * Push a new seed to the history
     * @param {string} newSeed - The new seed string to push
     * @returns {void}
     * @private
     */
    _pushSeed (newSeed) {
      if (newSeed != this._seedString) {
        // ignore if it is the same string
        if (this._seedHistory.length > 0 && this._seedHistoryIndex >= 0) {
          this._seedHistory = this._seedHistory.slice(0, this._seedHistoryIndex + 1);
        }
        this._seedHistory.push(newSeed);
        this._seedHistoryIndex++;
        this._seedString = newSeed;
        this._currentSeed = this._base62ToBase10(this._seedString);
      }
    }

    /**
     * Validate the incoming string to only include numbers and letters
     * If the string is empty a random string is generated
     * @param {string} inSeedString - The seed string to validate
     * @returns {string} Cleaned and validated seed string
     * @private
     */
    _validateSeedString (inSeedString) {
      let cleanSeedString;
      if (inSeedString == undefined || inSeedString == '') {
        cleanSeedString = this._randomSeedString();
      } else {
        cleanSeedString = inSeedString;
      }
      cleanSeedString = cleanSeedString.replace(/[^a-zA-Z0-9]/g, '');
      // Fallback to random seed if cleaned string is empty (all non-alphanumeric input)
      if (cleanSeedString.length === 0) {
        cleanSeedString = this._randomSeedString();
      }
      return cleanSeedString;
    }

    /**
     * Reset the RNG with a new seed, clearing history
     * @param {string} [newSeed] - New seed string. If not provided, a random seed is generated
     * @returns {string} The validated seed string
     */
    reset (newSeed) {
      this._seedHistory = [];
      this._seedHistoryIndex = -1;
      newSeed = this._validateSeedString(newSeed);
      this._pushSeed(newSeed);
      return this._seedString;
    }

    /**
     * Reset the current seed back to the current seedString
     * Effectively resets the sequence of random numbers
     * @returns {string} The current seed string
     */
    resetSeed () {
      this._currentSeed = this._base62ToBase10(this._seedString);
      return this._seedString;
    }

    /**
     * Navigate to the previous seed in the history
     * @returns {string} The previous seed string
     */
    previousSeed () {
      if (this._seedHistoryIndex >= 1) {
        this._seedHistoryIndex--;
        this._seedString = this._seedHistory[this._seedHistoryIndex];
        this._currentSeed = this._base62ToBase10(this._seedString);
      }
      return this._seedString;
    }

    /**
     * Navigate to the next seed in the history
     * @returns {string} The next seed string
     */
    nextSeed () {
      if (this._seedHistoryIndex < this._seedHistory.length - 1) {
        this._seedHistoryIndex++;
        this._seedString = this._seedHistory[this._seedHistoryIndex];
        this._currentSeed = this._base62ToBase10(this._seedString);
      }
      return this._seedString;
    }

    /**
     * Set seed to random and push to the history
     * @returns {string} The new random seed string
     */
    randomSeed () {
      this._pushSeed(this._randomSeedString());
      return this._seedString;
    }

    //------------------------------------------------------------------------
    //
    //  GET & SET
    //
    //------------------------------------------------------------------------

    /**
     * Get the current seed string
     * @returns {string} The current seed string
     */
    get seed () {
      return this._seedString;
    }

    /**
     * Set a new seed string
     * @param {string} newSeed - The new seed string
     * @returns {void}
     */
    set seed (newSeed) {
      newSeed = this._validateSeedString(newSeed);
      this._pushSeed(newSeed);
    }

    //------------------------------------------------------------------------
    //
    //  SUPPORT FUNCTIONS
    //
    //------------------------------------------------------------------------

    /**
     * Generate a random seed string
     * @param {number} [stringLength=6] - Length of the seed string to generate
     * @returns {string} Random seed string
     * @private
     */
    _randomSeedString (stringLength = 6) {
      const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let result = '';

      for (let i = 0; i < stringLength; i++) {
        const n = Math.floor(Math.random() * 62);
        result = BASE62_ALPHABET[n] + result;
      }
      return result;
    }

    /**
     * Convert a base62 string to base10 number
     * @param {string} input - Base62 string to convert
     * @returns {number} Base10 number
     * @throws {Error} If input contains invalid characters
     * @private
     */
    _base62ToBase10 (input) {
      const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        base = 62;
      let result = 0;

      for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i),
          charValue = BASE62_ALPHABET.indexOf(char);

        if (charValue === -1) {
          throw new Error('Invalid character in the input string.');
        }

        result = result * base + charValue;
      }

      return result;
    }

    //------------------------------------------------------------------------
    //
    //  CORE RNG
    //
    //------------------------------------------------------------------------

    /**
     * The pseudo random number generator
     * Adapted from https://github.com/cprosche/mulberry32
     * @returns {number} Random number between 0 and 1
     * @private
     */
    _rng () {
      let t = (this._currentSeed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    //------------------------------------------------------------------------
    //
    //  RNG FUNCTIONS
    //
    //------------------------------------------------------------------------

    /**
     * Return a random floating-point number
     * @param {number|Array} [min] - If number: minimum value (exclusive). If array: random element from array
     * @param {number} [max] - Maximum value (exclusive) when min is a number
     * @returns {number|*} Random number or array element
     *
     * @example
     * rng.random();           // Random number between 0 and 1
     * rng.random(10);         // Random number between 0 and 10
     * rng.random(5, 15);      // Random number between 5 and 15
     * rng.random(['a', 'b']); // Random element from array
     */
    random (min, max) {
      let rand = this._rng();

      if (typeof min === 'undefined') {
        return rand;
      } else if (typeof max === 'undefined') {
        if (min instanceof Array) {
          return min[Math.floor(rand * min.length)];
        } else {
          return rand * min;
        }
      } else {
        if (min > max) {
          const tmp = min;
          min = max;
          max = tmp;
        }

        return rand * (max - min) + min;
      }
    }

    /**
     * Generate a random integer from a range
     * @param {number} [min=0] - Minimum value (inclusive)
     * @param {number} [max=100] - Maximum value (exclusive)
     * @returns {number} Random integer in the range
     */
    intRange (min = 0, max = 100) {
      let rand = this._rng();

      min = Math.floor(min);
      max = Math.floor(max);

      // Swap if min > max
      if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
      }

      // When min === max, the range is empty; return min
      if (min === max) {
        return min;
      }

      return Math.floor(rand * (max - min) + min);
    }

    /**
     * Return a random boolean
     * @returns {boolean} Random boolean value
     */
    randomBool () {
      if (this._rng() < 0.5) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Return a random character from a string
     * Without input it returns a random lowercase letter
     * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - String to select character from
     * @returns {string} Random character from the string
     * @throws {Error} If input string is empty
     */
    randomChar (inString = 'abcdefghijklmnopqrstuvwxyz') {
      if (inString.length === 0) {
        throw new Error('randomChar: Input string cannot be empty.');
      }
      let r = Math.floor(this.random(0, inString.length));
      return inString.charAt(r);
    }

    /**
     * Generate a random string of specified length from a character set
     * @param {number} [count=1] - Length of the string to generate
     * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - Character set to select from
     * @returns {string} Random string of specified length
     * @throws {Error} If input string is empty
     */
    randomString (count = 1, inString = 'abcdefghijklmnopqrstuvwxyz') {
      if (inString.length === 0) {
        throw new Error('randomString: Input string cannot be empty.');
      }
      let output = '';
      for (var i = 0; i < count; i++) {
        output += this.randomChar(inString);
      }
      return output;
    }

    /**
     * Generate a random number snapped to steps
     * @param {number} [min=0] - Minimum value
     * @param {number} [max=1] - Maximum value
     * @param {number} [step=0.1] - Step size
     * @returns {number} Random number snapped to the nearest step
     */
    steppedRandom (min = 0, max = 1, step = 0.1) {
      // Swap if min > max
      if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
      }

      // Ensure step is positive
      if (step <= 0) {
        return min;
      }

      let n = Math.floor((max - min) / step);
      if (n <= 0) {
        return min;
      }

      let r = Math.round(this._rng() * n);
      return min + r * step;
    }

    /**
     * Shuffle an array in place using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} The shuffled array (same reference)
     */
    shuffle (array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(this._rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    /**
     * Generate random integer sequence from min to max
     * Including min, excluding max
     * @param {number} [min=0] - Minimum value (inclusive)
     * @param {number} [max=100] - Maximum value (exclusive)
     * @returns {number[]} Shuffled array of integers in the range
     */
    intSequence (min = 0, max = 100) {
      min = Math.floor(min);
      max = Math.floor(max);
      if (max < min) {
        let temp = max;
        max = min;
        min = temp;
      }
      let seq = Array.from(Array(max - min)).map((e, i) => i + min);
      this.shuffle(seq);
      return seq;
    }
    /**
     * Create a 2D unit p5 vector in a random direction
     * @returns {p5.Vector} Random 2D unit vector
     */
    random2DVector () {
      let v = createVector(1, 0);
      let h = this.random() * TWO_PI;
      v.setHeading(h);
      return v;
    }
    /**
     * Fast Poisson Disk Sampling
     * Based on the example from Coding Train
     * https://thecodingtrain.com/challenges/33-poisson-disc-sampling
     * @param {number} inWidth - Width of the sampling area
     * @param {number} inHeight - Height of the sampling area
     * @param {number} inRadius - Minimum distance between points
     * @returns {p5.Vector[]} Array of points generated using Poisson disk sampling
     */
    poissonDisk (inWidth, inHeight, inRadius) {
      let r = inRadius;
      let nrSamples = 30;
      let grid = [];
      let w = r / Math.sqrt(2);
      let active = [];
      let cols, rows;
      let ordered = [];
      let nrTries = 20;

      //  create reference grid
      cols = Math.floor(inWidth / w);
      rows = Math.floor(inHeight / w);
      grid = new Array(cols * rows);

      // set initial point
      let x = this.random(inWidth);
      let y = this.random(inHeight);
      let i = Math.floor(x / w);
      let j = Math.floor(y / w);
      let pos = createVector(x, y);
      grid[i + j * cols] = pos;
      active.push(pos);

      for (let total = 0; total < nrTries; total++) {
        while (active.length > 0) {
          let randIndex = Math.floor(this.random(active.length));
          let pos = active[randIndex];
          let found = false;
          for (let n = 0; n < nrSamples; n++) {
            let sample = this.random2DVector();
            let m = this.random(r, 2 * r);
            sample.setMag(m);
            sample.add(pos);

            let col = Math.floor(sample.x / w);
            let row = Math.floor(sample.y / w);

            if (col > -1 && row > -1 && col < cols && row < rows && !grid[col + row * cols]) {
              let ok = true;
              for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                  let index = col + i + (row + j) * cols;
                  let neighbor = grid[index];
                  if (neighbor) {
                    let dx = sample.x - neighbor.x;
                    let dy = sample.y - neighbor.y;
                    let d = Math.sqrt(dx * dx + dy * dy);
                    if (d < r) {
                      ok = false;
                    }
                  }
                }
              }
              if (ok) {
                found = true;
                grid[col + row * cols] = sample;
                active.push(sample);
                ordered.push(sample);
                break;
              }
            }
          }
          //
          //  remove active point if no option was found
          //
          if (!found) {
            active.splice(randIndex, 1);
          }
        }
      }

      //
      //  take out undefined points
      //
      ordered = ordered.filter(n => n !== undefined);

      return ordered;
    }
  }

  /**
   * CubicBezier easing function implementation
   *
   * Based on https://github.com/thednp/bezier-easing/ by thednp
   *
   * Creates a cubic Bézier easing function for smooth animations and transitions.
   * Uses Newton-Raphson method with bisection fallback for precise curve solving.
   *
   * @example
   * // Create a custom easing function
   * const easing = toko.cubicBezier(0.25, 0.1, 0.25, 1, 'custom');
   * const value = easing(0.5); // Get eased value at t=0.5
   *
   * // Use preset easing functions
   * const easeInOut = toko.cubicBezier.presets.easeInOut();
   * const easedValue = easeInOut(0.3);
   *
   * // Use https://cubic-bezier.com/ to find suitable parameters
   *
   * @param {number} [x1=0] - X coordinate of first control point
   * @param {number} [y1=0] - Y coordinate of first control point
   * @param {number} [x2=1] - X coordinate of second control point
   * @param {number} [y2=1] - Y coordinate of second control point
   * @param {string} [customName=null] - Custom name for the easing function
   * @returns {Function} Easing function that takes t (0-1) and returns eased value
   *
   * @author thednp (original), Bob Corporaal (adapted)
   */
  function cubicBezier (x1 = 0, y1 = 0, x2 = 1, y2 = 1, customName = null) {
    // Validate inputs
    const isNumber = val => typeof val === 'number';
    const allNumbers = [x1, y1, x2, y2].every(isNumber);

    // Store control points
    const controlPoints = { x1, y1, x2, y2 };

    // Generate name for the easing function
    const name = customName || (allNumbers ? `cubic-bezier(${[x1, y1, x2, y2].join(',')})` : 'linear');

    // Calculate coefficients for the cubic bezier curve
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;

    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    // Sample the curve at parameter t for X coordinate
    function sampleCurveX (t) {
      return ((ax * t + bx) * t + cx) * t;
    }

    // Sample the curve at parameter t for Y coordinate
    function sampleCurveY (t) {
      return ((ay * t + by) * t + cy) * t;
    }

    // Calculate the derivative of the curve at parameter t for X coordinate
    function sampleCurveDerivativeX (t) {
      return (3 * ax * t + 2 * bx) * t + cx;
    }

    // Solve for t given x using Newton-Raphson method with bisection fallback
    function solveCurveX (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;

      let t = x;
      let x2, d2;

      // Newton-Raphson iteration
      for (let i = 0; i < 8; i++) {
        x2 = sampleCurveX(t) - x;
        if (Math.abs(x2) < 1e-6) return t;

        d2 = sampleCurveDerivativeX(t);
        if (Math.abs(d2) < 1e-6) break;

        t -= x2 / d2;
      }

      // Fallback to bisection method
      let t0 = 0;
      let t1 = 1;
      t = x;

      while (t0 < t1) {
        x2 = sampleCurveX(t);
        if (Math.abs(x2 - x) < 1e-6) return t;

        if (x > x2) {
          t0 = t;
        } else {
          t1 = t;
        }

        t = (t1 - t0) * 0.5 + t0;
      }

      return t;
    }

    // Main easing function - given input t (0-1), return eased value
    function easingFunction (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return sampleCurveY(solveCurveX(t));
    }

    // Add properties to the function for compatibility and debugging
    Object.defineProperty(easingFunction, 'name', {
      writable: true,
      value: name,
    });
    easingFunction.x1 = x1;
    easingFunction.y1 = y1;
    easingFunction.x2 = x2;
    easingFunction.y2 = y2;
    easingFunction.controlPoints = controlPoints;

    // Add the original ease method for backward compatibility
    easingFunction.ease = easingFunction;

    // Add toString method
    easingFunction.toString = () => name;

    return easingFunction;
  }

  /**
   * Static presets for common easing functions
   * Each preset returns a callable easing function
   * @namespace cubicBezier.presets
   */
  cubicBezier.presets = {
    linear: () => cubicBezier(0, 0, 1, 1, 'linear'),
    ease: () => cubicBezier(0.25, 0.1, 0.25, 1, 'ease'),
    easeIn: () => cubicBezier(0.42, 0, 1, 1, 'ease-in'),
    easeOut: () => cubicBezier(0, 0, 0.58, 1, 'ease-out'),
    easeInOut: () => cubicBezier(0.42, 0, 0.58, 1, 'ease-in-out'),
    easeInBack: () => cubicBezier(0.6, -0.28, 0.735, 0.045, 'ease-in-back'),
    easeOutBack: () => cubicBezier(0.175, 0.885, 0.32, 1.275, 'ease-out-back'),
    easeInOutBack: () => cubicBezier(0.68, -0.55, 0.265, 1.55, 'ease-in-out-back'),
  };

  var COLOR_COLLECTIONS = [];
  var COLOR_PALETTES = allPalettes;

  /**
   * Constrain a value between a minimum and maximum
   * Local implementation to avoid dependency on p5.js
   * @param {number} value - The value to constrain
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Constrained value
   */
  function _constrain (value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Initialize the color system and preprocess all palettes
   * This function must be called before using any color palette functions
   * @example
   * // Initialize color system (usually called automatically)
   * toko.initColor();
   */
  function initColor () {
    _preprocessPalettes();
    libraryState.initColorDone = true;
  }

  //
  //  validate incoming color options
  //
  function _validateColorOptions (colorOptions) {
    // merge with default options (copy defaults to avoid mutating the shared object)
    let defaults = Object.assign({}, DEFAULT_COLOR_OPTIONS, { easing: easeLinear });
    colorOptions = Object.assign({}, defaults, colorOptions);

    // add a new RNG if none was defined
    if (colorOptions.rng == undefined) {
      colorOptions.rng = new RNG();
    }

    // set the options validated, so it is not needlessly checked multiple times
    colorOptions._validated = true;

    return colorOptions;
  }

  //
  // Create a colorscale based on a set of colors with useful functions
  //
  function _createColorScale (colorSet, colorOptions, extraColors) {
    if (!libraryState.initColorDone) {
      initColor();
    }
    let sc, oSC;
    let o = {};

    if (colorOptions._validated != true) {
      colorOptions = _validateColorOptions(colorOptions);
    }

    let contrastColors = _defineContrastColors(colorSet, extraColors, colorOptions.constrainContrast);

    // reverse input colors
    if (colorOptions.reverse) {
      colorSet.reverse();
    }

    // create a scale
    sc = chroma.scale(colorSet).domain([0, 1]).mode(colorOptions.mode);

    // scale mapped to the original array of colors
    oSC = chroma.scale(colorSet).domain([0, 1]).classes(colorSet.length);

    // only adjust gamma if needed
    if (colorOptions.gamma != 1) {
      sc.gamma(colorOptions.gamma);
    }

    if (colorOptions.stepped && colorOptions.steps > 0) {
      sc = sc.classes(colorOptions.steps);
    }

    // check domain and turn on remapping if it is not [0,1]
    o.domain = colorOptions.domain;
    if (colorOptions.domain[0] !== 0 || colorOptions.domain[1] !== 1) {
      o.remapDomain = true;
    } else {
      o.remapDomain = false;
    }

    // store additional options
    o.scaleChroma = sc;
    o.contrastColors = contrastColors;
    o.options = colorOptions;
    o.originalColors = colorSet;
    o.list = sc.colors(colorOptions.nrColors);

    // set easing function for the scale
    if (colorOptions.useEasing) {
      let par = colorOptions.easingParameters;
      o.easing = cubicBezier(par[0], par[1], par[2], par[3]);
    } else {
      o.easing = i => {
        return i;
      };
    }

    // function to return a color on the scale
    o.scale = (i, useOriginal = false) => {
      if (o.remapDomain) {
        i = map(i, o.domain[0], o.domain[1], 0, 1);
      }

      let ie = o.easing(i);

      if (!useOriginal) {
        return sc(ie).hex();
      } else {
        return oSC(ie).hex();
      }
    };

    // function to return the original scale
    o.originalScale = i => {
      return oSC(i).hex();
    };

    // return a random color from the set
    o.randomColor = (useOriginal = false, shift = { h: 0, s: 0, l: 0 }) => {
      let c;
      let r = colorOptions.rng.random();

      if (!useOriginal) {
        c = sc(r).hex();
      } else {
        c = oSC(r).hex();
      }

      if (shift.h != 0 || shift.s != 0 || shift.l != 0) {
        let cShifted = chroma(c).hsl();
        cShifted[0] = cShifted[0] + colorOptions.rng.random(-shift.h * 360, shift.h * 360);
        cShifted[1] = cShifted[1] + colorOptions.rng.random(-shift.s, shift.s);
        cShifted[2] = cShifted[2] + colorOptions.rng.random(-shift.l, shift.l);
        c = chroma.hsl(cShifted[0], cShifted[1], cShifted[2]).hex();
      }

      return c;
    };

    // return a random color from the original set
    o.randomOriginalColor = (shift = { h: 0, s: 0, l: 0 }) => {
      let r = colorOptions.rng.random();
      let c = oSC(r).hex();

      if (shift.h != 0 || shift.s != 0 || shift.l != 0) {
        let cShifted = chroma(c).hsl();
        cShifted[0] = cShifted[0] + colorOptions.rng.random(-shift.h * 360, shift.h * 360);
        cShifted[1] = cShifted[1] + colorOptions.rng.random(-shift.s, shift.s);
        cShifted[2] = cShifted[2] + colorOptions.rng.random(-shift.l, shift.l);
        c = chroma.hsl(cShifted[0], cShifted[1], cShifted[2]).hex();
      }

      return c;
    };

    // return an appropriate background color
    o.backgroundColor = (flip = false) => {
      let cc = flip ? 1 : 0;
      return contrastColors[cc];
    };

    // return an appropriate draw or foreground color
    o.drawColor = (flip = false) => {
      let cc = flip ? 0 : 1;
      return contrastColors[cc];
    };

    // store a set of duotones
    o.duotones = _findDuotones(o.originalColors, colorOptions.nrDuotones, colorOptions.reverse);

    // return the complete color object
    return o;
  }

  function _getColorScale (inPalette, colorOptions) {
    if (!libraryState.initColorDone) {
      initColor();
    }

    if (colorOptions._validated != true) {
      colorOptions = _validateColorOptions(colorOptions);
    }

    let p, colorSet;
    let o = {};
    let extraColors = [];

    if (typeof inPalette === 'object') {
      colorSet = [...inPalette];
    } else if (typeof inPalette === 'string') {
      p = findPaletteByName(inPalette);

      if (!p) {
        logError('Toko: palette not found: ' + inPalette);
        return o;
      }

      //
      //  TO DO - currently this does not work
      //
      if ('sortOrder' in p && colorOptions.useSortOrder) {
        logDebug('sorting because sortOrder is available and sort is true');
        colorSet = [p.colors.length];
        for (let i = 0; i < p.colors.length; i++) {
          colorSet[i] = p.colors[p.sortOrder[i] - 1];
        }
      } else {
        colorSet = [...p.colors]; // clone the array to not mess up the original
      }

      if ('stroke' in p) {
        extraColors.push(p.stroke);
      }
      if ('background' in p) {
        extraColors.push(p.background);
      }
    } else {
      logError('ERROR: palette should be a string or an array');
    }
    o = _createColorScale(colorSet, colorOptions, extraColors);

    return o;
  }

  //
  //  get the next or previous palette
  //
  function _getAnotherPalette (inPalette, paletteType = 'all', justPrimary = true, direction = 1) {
    let tempPaletteList = _getPaletteListRaw(paletteType, justPrimary);
    var i = tempPaletteList.findIndex(p => p.name === inPalette);
    if (i === -1) {
      logWarn('palette not found: ' + inPalette);
      return inPalette;
    } else {
      i += direction;
    }

    if (i >= tempPaletteList.length - 1) {
      i = 0;
    } else if (i < 0) {
      i = tempPaletteList.length - 1;
    }

    return tempPaletteList[i].name;
  }

  //
  //  get a random palette
  //
  function _getRandomPalette (inPalette, paletteType = 'all', justPrimary = true) {
    if (!libraryState.initColorDone) {
      initColor();
    }
    let tempPaletteList = _getPaletteListRaw(paletteType, justPrimary);

    // using the internal RNG
    var randomPalette = tempPaletteList[Math.floor(libraryState.RNG.random() * tempPaletteList.length)];

    return randomPalette.name;
  }

  //
  //  get set of palettes with a specific type or primary state
  //
  function _getPaletteListRaw (paletteType = 'all', justPrimary = true, sorted) {
    if (!libraryState.initColorDone) {
      initColor();
    }
    let filtered;
    if (paletteType !== 'all') {
      filtered = COLOR_PALETTES.filter(p => p.type === paletteType);
    } else {
      filtered = [...COLOR_PALETTES];
    }

    if (justPrimary) {
      filtered = filtered.filter(p => p.isPrimary);
    }

    //
    //  sort if requested
    //
    if (sorted) {
      filtered = _sortPaletteList(filtered);
    }

    return filtered;
  }

  //
  //  get a selection of palettes based on name or type
  //
  function _getPaletteSelectionRaw (selectionList, justPrimary, sorted) {
    if (!libraryState.initColorDone) {
      initColor();
    }
    // to lowercase and strip spaces
    selectionList = selectionList.toLowerCase().replace(/\s/g, '');
    let labels = selectionList.split(',');
    let filtered = [];
    for (let i = 0; i < labels.length; i++) {
      filtered = filtered.concat(COLOR_PALETTES.filter(p => p.name.toLowerCase() === labels[i] || p.type === labels[i]));
    }
    if (justPrimary) {
      filtered = filtered.filter(p => p.isPrimary);
    }
    //
    //  sort if requested
    //
    if (sorted) {
      filtered = _sortPaletteList(filtered);
    }

    return filtered;
  }

  //
  //  sort palette list alphabetically
  //
  function _sortPaletteList (paletteList) {
    paletteList.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    return paletteList;
  }

  function _defineContrastColors (colorSet, extraColors, constrainContrast = false) {
    //
    // make contrast colors from colors from both ends of the scale
    //
    // 0 is the light background and 1 is the dark background
    //
    let contrastColors = [];
    let hsl = [];
    let lightContrastSet = false;
    let darkContrastSet = false;
    let n = colorSet.length;
    let lightH, lightS, lightL;
    let darkH, darkS, darkL;

    //
    //  adjustment factors
    //
    //  dark - saturation
    let ds = {
      shift: 0,
      factor: 1.25,
      max: 0.8,
      min: 0.15,
    };
    //  dark - lightness
    let dl = {
      shift: -0.1,
      factor: 0.7,
      max: 0.09,
      min: 0.05,
    };
    //
    //  light - saturation
    let ls = {
      shift: 0,
      factor: 0.8,
      max: 0.25,
      min: 0.1,
    };
    //  light - lightness
    let ll = {
      shift: 0,
      factor: 1.2,
      max: 0.95,
      min: 0.9,
    };

    //
    //  sort colors from light to dark
    //
    let tempColors = [...colorSet];
    let sortedColorSet = tempColors.sort((a, b) => chroma(b).hsl()[2] - chroma(a).hsl()[2]);

    //
    //  parse provided extra colors – if there are more then two the last dark and light are used
    //
    if (Array.isArray(extraColors) && extraColors.length) {
      extraColors.forEach(c => {
        let l = chroma(c).hsl()[2];
        if (l > 0.5) {
          contrastColors[0] = c;
          lightContrastSet = true;
        } else {
          contrastColors[1] = c;
          darkContrastSet = true;
        }
      });

      //
      //  if requested constrain the contrast colors
      //
      if (constrainContrast) {
        hsl = chroma(contrastColors[0]).hsl();
        lightH = hsl[0];
        lightS = _constrain((hsl[1] - ls.shift) * ls.factor, ls.min, ls.max);
        lightL = _constrain((hsl[2] - ll.shift) * ll.factor, ll.min, ll.max);
        contrastColors[0] = chroma.hsl(lightH, lightS, lightL).hex();

        hsl = chroma(contrastColors[1]).hsl();
        darkH = hsl[0];
        darkS = _constrain((hsl[1] + ds.shift) * ds.factor, ds.min, ds.max);
        darkL = _constrain((hsl[2] + dl.shift) * dl.factor, dl.min, dl.max);
        contrastColors[1] = chroma.hsl(darkH, darkS, darkL).hex();
      }
    }

    //
    //  generate contrast colors by adjusting the saturation and lightness of the lightest and darkest color
    //
    if (!lightContrastSet) {
      hsl = chroma(sortedColorSet[0]).hsl();
      lightH = hsl[0];
      lightS = _constrain((hsl[1] - ls.shift) * ls.factor, ls.min, ls.max);
      lightL = _constrain((hsl[2] - ll.shift) * ll.factor, ll.min, ll.max);
      contrastColors[0] = chroma.hsl(lightH, lightS, lightL).hex();
    }
    if (!darkContrastSet) {
      hsl = chroma(sortedColorSet[n - 1]).hsl();
      darkH = hsl[0];
      darkS = _constrain((hsl[1] + ds.shift) * ds.factor, ds.min, ds.max);
      darkL = _constrain((hsl[2] + dl.shift) * dl.factor, dl.min, dl.max);
      contrastColors[1] = chroma.hsl(darkH, darkS, darkL).hex();
    }

    // check and flip order if needed
    if (chroma(contrastColors[0]).hsl()[2] < chroma(contrastColors[1]).hsl()[2]) {
      contrastColors.reverse();
    }

    return contrastColors;
  }

  //
  //  from a palette create a set of color combinations
  //
  function _findDuotones (inPalette, minLength, reverse) {
    let nrColors = inPalette.length;
    let duotones = [];

    for (let i = 0; i < nrColors; i++) {
      for (let j = i + 1; j < nrColors; j++) {
        let c1 = inPalette[i];
        let c2 = inPalette[j];

        let contrast = chroma.contrast(c1, c2);

        //
        //  arrange colors by luminance
        //
        let cB, cA;
        let lum1 = chroma(c1).hsl()[2];
        let lum2 = chroma(c2).hsl()[2];

        if (reverse) {
          cA = lum1 < lum2 ? c1 : c2;
          cB = lum1 < lum2 ? c2 : c1;
        } else {
          cA = lum1 > lum2 ? c1 : c2;
          cB = lum1 > lum2 ? c2 : c1;
        }

        duotones.push({
          colors: [cA, cB],
          backgroundColor: cA,
          drawColor: cB,
          contrast: contrast,
        });
      }
    }

    //  sort from high to low
    duotones.sort((a, b) => b.contrast - a.contrast);

    //  interleave from start and middle
    //  [1,2,3,4,5,6] -> [1,4,2,5,3,6]
    const n = duotones.length;
    const mid = Math.floor(n / 2);
    const interleaved = [];
    for (let i = 0; i < mid; i++) {
      interleaved.push(duotones[i]);
      interleaved.push(duotones[i + mid]);
    }
    //  handle uneven lists
    if (n % 2 !== 0) {
      interleaved.push(duotones[n - 1]);
    }

    duotones = [...interleaved];

    //
    //  add copies to lengthen the array
    //
    while (duotones.length < minLength) {
      duotones = duotones.concat(duotones);
    }

    //
    //  reduce to required length and return
    //
    return duotones.slice(0, minLength);
  }

  function _preprocessPalettes () {
    // Process palettes
    allPalettes.forEach(o => {
      if (o.isPrimary == undefined) {
        o.isPrimary = true;
      }
      COLOR_COLLECTIONS.push(o.type);
    });

    COLOR_COLLECTIONS = [...new Set(COLOR_COLLECTIONS)];
  }

  //////////////////////////////

  /**
   * Get color scale based on a palette name
   * @param {string} inPalette - Name of the palette to use
   * @param {Object} [colorOptions] - Color options object for customization
   * @returns {Object} Color scale object with interpolation functions
   * @example
   * // Get a basic color scale
   * const scale = toko.getColorScale('viridis');
   * const color = scale.getColor(0.5);
   *
   * // Get color scale with custom options
   * const customScale = toko.getColorScale('viridis', {
   *   steps: 10,
   *   easing: toko.easeInOutQuad
   * });
   */
  function getColorScale (inPalette, colorOptions) {
    let o = _getColorScale(inPalette, colorOptions);
    return o;
  }

  /**
   * Create color scale based on a custom set of colors
   * @param {string[]} colorSet - Array of color strings (hex, rgb, etc.)
   * @param {Object} [colorOptions] - Color options object for customization
   * @param {string[]} [extraColors] - Additional colors for contrast and variations
   * @returns {Object} Color scale object with interpolation functions
   * @example
   * // Create scale from custom colors
   * const colors = ['#ff0000', '#00ff00', '#0000ff'];
   * const scale = toko.createColorScale(colors);
   *
   * // Create scale with extra contrast colors
   * const extraColors = ['#ffffff', '#000000'];
   * const scaleWithContrast = toko.createColorScale(colors, {}, extraColors);
   */
  function createColorScale (colorSet, colorOptions, extraColors) {
    let o = _createColorScale(colorSet, colorOptions, extraColors);
    return o;
  }

  /**
   * Get a list of color modes formatted for Tweakpane
   * @returns {Object} Object with color mode names as keys and values
   * @example
   * // Get color modes for Tweakpane
   * const modes = toko.getColorModeList();
   * // Returns: { 'linear': 'linear', 'bezier': 'bezier', ... }
   */
  function getColorModeList () {
    return formatForTweakpane(COLOR_MODE_LIST);
  }

  /**
   * Get the next palette in sequence based on type and primary status
   * @param {string} inPalette - Current palette name
   * @param {string} [paletteType='all'] - Type of palettes to cycle through
   * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
   * @returns {string} Name of the next palette in sequence
   * @example
   * // Get next palette
   * const next = toko.getNextPalette('viridis');
   *
   * // Get next palette of specific type
   * const nextWarm = toko.getNextPalette('viridis', 'warm', true);
   */
  function getNextPalette (inPalette, paletteType = 'all', justPrimary = true) {
    return _getAnotherPalette(inPalette, paletteType, justPrimary, 1);
  }

  /**
   * Get the previous palette in sequence based on type and primary status
   * @param {string} inPalette - Current palette name
   * @param {string} [paletteType='all'] - Type of palettes to cycle through
   * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
   * @returns {string} Name of the previous palette in sequence
   * @example
   * // Get previous palette
   * const prev = toko.getPreviousPalette('viridis');
   *
   * // Get previous palette of specific type
   * const prevCool = toko.getPreviousPalette('viridis', 'cool', true);
   */
  function getPreviousPalette (inPalette, paletteType = 'all', justPrimary = true) {
    return _getAnotherPalette(inPalette, paletteType, justPrimary, -1);
  }

  /**
   * Get a random palette based on type and primary status
   * @param {string} inPalette - Current palette name (used for type filtering)
   * @param {string} [paletteType='all'] - Type of palettes to choose from
   * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
   * @returns {string} Name of a random palette
   * @example
   * // Get random palette
   * const random = toko.getRandomPalette('viridis');
   *
   * // Get random palette of specific type
   * const randomWarm = toko.getRandomPalette('viridis', 'warm', true);
   */
  function getRandomPalette (inPalette, paletteType = 'all', justPrimary = true) {
    return _getRandomPalette(inPalette, paletteType, justPrimary);
  }

  /**
   * Find a specific palette by name
   * @param {string} paletteName - Name of the palette to find
   * @returns {Object|undefined} Palette object if found, undefined otherwise
   * @example
   * // Find a specific palette
   * const palette = toko.findPaletteByName('viridis');
   * if (palette) {
   *   console.log('Found palette:', palette.name);
   * }
   */
  function findPaletteByName (paletteName) {
    if (!libraryState.initColorDone) {
      initColor();
    }
    var p = COLOR_PALETTES.filter(p => p.name === paletteName)[0];
    if (p === undefined) {
      logWarn('palette not found: ' + paletteName);
    }
    return p;
  }

  /**
   * Get a list of palettes formatted for Tweakpane based on type and primary status
   * @param {string} [paletteType='all'] - Type of palettes to include
   * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
   * @param {boolean} [sorted=false] - Whether to sort the palette list
   * @returns {Object} Object with palette names as keys and values for Tweakpane
   * @example
   * // Get all palettes for Tweakpane
   * const palettes = toko.getPaletteList();
   *
   * // Get only warm primary palettes
   * const warmPalettes = toko.getPaletteList('warm', true, true);
   */
  function getPaletteList (paletteType = 'all', justPrimary = true, sorted = false) {
    let filtered = _getPaletteListRaw(paletteType, justPrimary, sorted);
    return formatForTweakpane(filtered, 'name');
  }

  /**
   * Get a selection of palettes based on a comma-separated list of names
   * @param {string} selectionList - Comma-separated list of palette names
   * @param {boolean} [justPrimary=false] - Whether to only include primary palettes
   * @param {boolean} [sorted=false] - Whether to sort the palette list
   * @returns {Object} Object with selected palette names as keys and values for Tweakpane
   * @example
   * // Get specific palettes
   * const selection = toko.getPaletteSelection('viridis,plasma,inferno');
   *
   * // Get specific palettes with sorting
   * const sortedSelection = toko.getPaletteSelection('viridis,plasma,inferno', false, true);
   */
  function getPaletteSelection (selectionList, justPrimary = false, sorted = false) {
    let filtered = _getPaletteSelectionRaw(selectionList, justPrimary, sorted);
    return formatForTweakpane(filtered, 'name');
  }

  /**
   * Format a list of objects or strings for use with Tweakpane
   * @param {Array} inList - Array of objects or strings to format
   * @param {string} [propertyName] - Property name to extract from objects (if objects)
   * @returns {Object} Object formatted for Tweakpane with keys and values
   * @example
   * // Format string array for Tweakpane
   * const modes = toko.formatForTweakpane(['linear', 'bezier', 'cubic']);
   * // Returns: { 'linear': 'linear', 'bezier': 'bezier', 'cubic': 'cubic' }
   *
   * // Format object array for Tweakpane
   * const palettes = toko.formatForTweakpane(paletteArray, 'name');
   */
  function formatForTweakpane (inList, propertyName) {
    let o = {};

    if (typeof propertyName == 'string') {
      inList.forEach(function (m) {
        o[m[propertyName]] = m[propertyName];
      });
    } else {
      inList.forEach(function (m) {
        o[m] = m;
      });
    }

    return o;
  }

  /**
   * Get all color palettes
   * @returns {Array} Array of all palette objects with name, colors, type, etc.
   * @example
   * // Get all palettes
   * const palettes = toko.getAllPalettes();
   * palettes.forEach(p => console.log(p.name, p.colors));
   */
  function getAllPalettes () {
    if (!libraryState.initColorDone) {
      initColor();
    }
    return COLOR_PALETTES;
  }

  /**
   * Get all collection types
   * @returns {Array} Array of collection type strings (e.g., 'basic', 'cako', etc.)
   * @example
   * // Get all collection types
   * const collections = toko.getCollections();
   * // Returns: ['basic', 'cako', 'colourscafe', ...]
   */
  function getCollections () {
    if (!libraryState.initColorDone) {
      initColor();
    }
    return COLOR_COLLECTIONS;
  }

  /**
   * Generate a pulsing value between 0 and 1 using sine wave
   * @param {number} [speed=0.05] - Speed of the pulse animation (higher = faster)
   * @returns {number} Pulsing value between 0 and 1
   * @example
   * // Create a slow pulsing effect
   * const alpha = toko.pulse(0.02);
   * fill(255, 255, 255, alpha * 255);
   * circle(width/2, height/2, 100);
   *
   * // Create a fast pulsing effect
   * const size = toko.pulse(0.1) * 50 + 25;
   * circle(width/2, height/2, size);
   */
  function pulse (speed = 0.05) {
    return (this.sin(this.millis() * speed) + 1) / 2;
  }

  /**
   * Toggle the library's default background color to the next color in the predefined palette
   * Cycles through a set of predefined colors: red, teal, blue, and green
   * @example
   * // Toggle to next background color
   * toko.toggleLibraryBackground();
   */
  function toggleLibraryBackground () {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    const currentIndex = colors.indexOf(libraryState.defaultColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    libraryState.defaultColor = colors[nextIndex];
  }

  /**
   * Get information about the current Toko library instance
   * @returns {Object} Library information object with name, version, and detected p5.js variant
   * @example
   * // Get library information
   * const info = toko.getInfo();
   * console.log(`Using ${info.name} v${info.version} with ${info.variant}`);
   */
  function getInfo () {
    return {
      name: LIBRARY_NAME,
      version: VERSION,
      variant: detectP5Variant(),
    };
  }

  //
  //  Word lists from various sources.
  //  Used to create random file names for the exports
  //
  //  Sources (among others and random additions)
  //  https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors
  //  https://github.com/Atrox/haikunatorjs - BSD-3-Clause license
  //
  const ADJECTIVES = [
    'adorable',
    'aged',
    'alert',
    'alien',
    'analog',
    'ancient',
    'animated',
    'aqua',
    'astro',
    'atomic',
    'autumn',
    'bashful',
    'batty',
    'bemused',
    'billowing',
    'bitter',
    'bittersweet',
    'black',
    'blue',
    'bold',
    'bouncing',
    'bright',
    'broad',
    'broken',
    'bronze',
    'calm',
    'carbon',
    'carefree',
    'caribbean',
    'chestnut',
    'cold',
    'cool',
    'cosmic',
    'crimson',
    'crunchy',
    'curly',
    'daffy',
    'daft',
    'damp',
    'dark',
    'dawn',
    'deep',
    'delicate',
    'descending',
    'divine',
    'dotted',
    'droll',
    'dry',
    'easy',
    'elastic',
    'electric',
    'elegant',
    'empty',
    'enigmatic',
    'epic',
    'excited',
    'fabulous',
    'falling',
    'fancy',
    'fatal',
    'flat',
    'floral',
    'fragrant',
    'frenzied',
    'fresh',
    'frolicsome',
    'frosty',
    'fuzzy',
    'gentle',
    'glassy',
    'glitter',
    'glorious',
    'green',
    'grunge',
    'hidden',
    'holy',
    'iced',
    'icy',
    'idiosyncratic',
    'imaginary',
    'impressive',
    'indigo',
    'ingenious',
    'inquisitive',
    'jolly',
    'joyful',
    'late',
    'lazy',
    'lingering',
    'little',
    'lively',
    'long',
    'lopsided',
    'loud',
    'lucky',
    'magic',
    'maroon',
    'marvelous',
    'maximum',
    'melodramatic',
    'metal',
    'middle',
    'misty',
    'mixed',
    'morning',
    'muddy',
    'mute',
    'mystic',
    'nameless',
    'neon',
    'new',
    'nifty',
    'noisy',
    'nonchalant',
    'odd',
    'old',
    'orange',
    'outlandish',
    'outrageous',
    'pacific',
    'patient',
    'permanent',
    'petite',
    'pixelated',
    'plain',
    'plucky',
    'polished',
    'proud',
    'purple',
    'quiet',
    'radical',
    'rambunctious',
    'rapid',
    'raspy',
    'red',
    'reflective',
    'restless',
    'rough',
    'round',
    'royal',
    'rusted',
    'rustic',
    'rusty',
    'scarlet',
    'scatterbrained',
    'shining',
    'shiny',
    'shocking',
    'shy',
    'silent',
    'silly',
    'small',
    'smokey',
    'snowy',
    'snug',
    'soft',
    'solitary',
    'sparkling',
    'spiked',
    'spiky',
    'spring',
    'square',
    'steel',
    'steep',
    'still',
    'sturdy',
    'summer',
    'super',
    'sweet',
    'throbbing',
    'thrumming',
    'tight',
    'tiny',
    'transparent',
    'tricky',
    'tropical',
    'twilight',
    'unassuming',
    'vibrant',
    'wandering',
    'warm',
    'weathered',
    'white',
    'wild',
    'winter',
    'wispy',
    'withered',
    'wondrous',
    'yellow',
    'yodeling',
    'young',
    'zealous',
  ];

  const NOUNS = [
    'adventure',
    'air',
    'alchemy',
    'art',
    'avocado',
    'band',
    'bar',
    'base',
    'basket',
    'bay',
    'beauty',
    'being',
    'belt',
    'bird',
    'bison',
    'block',
    'bloom',
    'blue',
    'boat',
    'bonus',
    'bottle',
    'box',
    'bread',
    'breeze',
    'brook',
    'bunny',
    'bush',
    'butterfly',
    'cake',
    'canary',
    'cell',
    'cherry',
    'clear',
    'clock',
    'cloud',
    'cookie',
    'coral',
    'cotton',
    'credit',
    'crocodile',
    'curry',
    'cyan',
    'daisy',
    'dance',
    'dandelion',
    'darkness',
    'dawn',
    'deep',
    'desert',
    'dew',
    'diamond',
    'dinosaur',
    'discovery',
    'disk',
    'dragon',
    'dream',
    'duck',
    'duke',
    'dusk',
    'dust',
    'eden',
    'experience',
    'explosion',
    'feather',
    'feelings',
    'field',
    'fiesta',
    'fire',
    'firefly',
    'flamingo',
    'flow',
    'flower',
    'foam',
    'fog',
    'forest',
    'fox',
    'fresco',
    'frog',
    'frost',
    'fruitbat',
    'future',
    'gallery',
    'glade',
    'glass',
    'glitter',
    'glow',
    'goose',
    'grass',
    'green',
    'grey',
    'hall',
    'hamster',
    'hat',
    'haze',
    'heart',
    'hill',
    'ice',
    'igloo',
    'island',
    'jungle',
    'king',
    'lab',
    'lake',
    'leaf',
    'light',
    'lime',
    'limit',
    'lobster',
    'log',
    'love',
    'machine',
    'math',
    'meadow',
    'mist',
    'mode',
    'moon',
    'moose',
    'morning',
    'mountain',
    'mouse',
    'mud',
    'muse',
    'nation',
    'night',
    'nights',
    'oasis',
    'obscura',
    'ocean',
    'operation',
    'orchid',
    'owl',
    'paint',
    'panda',
    'pandemonium',
    'paper',
    'paradise',
    'pearl',
    'penguin',
    'perspective',
    'pine',
    'pirate',
    'pizza',
    'plank',
    'poetry',
    'pond',
    'powdered',
    'prince',
    'princess',
    'pura',
    'queen',
    'rain',
    'rainbow',
    'rapids',
    'recipe',
    'resonance',
    'revival',
    'rice',
    'river',
    'rocket',
    'rose',
    'salad',
    'scene',
    'sea',
    'shadow',
    'shape',
    'shark',
    'silence',
    'sky',
    'smoke',
    'snow',
    'snowflake',
    'sound',
    'space',
    'spaceship',
    'sparkle',
    'splash',
    'spoon',
    'spray',
    'spring',
    'squeeze',
    'star',
    'statue',
    'stroke',
    'sun',
    'sunset',
    'surf',
    'tango',
    'term',
    'thing',
    'thunder',
    'ticket',
    'tiger',
    'tint',
    'toast',
    'tooth',
    'toy',
    'tree',
    'trumpet',
    'truth',
    'umbrella',
    'union',
    'unit',
    'velvet',
    'verde',
    'view',
    'violet',
    'vitale',
    'voice',
    'void',
    'volcano',
    'vortex',
    'water',
    'waterfall',
    'waters',
    'wave',
    'weasel',
    'whisper',
    'wildflower',
    'wind',
    'window',
    'winter',
    'wish',
    'wizard',
    'wood',
    'woodpecker',
    'zing',
  ];

  // words.js
  /**
   * Pick a random adjective from the predefined list
   * Note: Uses Math.random() instead of seeded random to avoid filename conflicts
   * @returns {string} A random adjective from the word list
   * @example
   * // Get a random adjective
   * const adj = toko.randomAdjective();
   * console.log(adj); // e.g., 'mysterious'
   */
  function randomAdjective () {
    return ADJECTIVES[Math.floor(ADJECTIVES.length * Math.random())];
  }

  /**
   * Pick a random noun from the predefined list
   * Note: Uses Math.random() instead of seeded random to avoid filename conflicts
   * @returns {string} A random noun from the word list
   * @example
   * // Get a random noun
   * const noun = toko.randomNoun();
   * console.log(noun); // e.g., 'mountain'
   */
  function randomNoun () {
    return NOUNS[Math.floor(NOUNS.length * Math.random())];
  }

  /**
   * Generate a creative filename with timestamp, verb, and random words
   * @param {string} [extension='svg'] - File extension to append, or 'none' for no extension
   * @param {string} [verb='sketched'] - Action verb to include in the filename
   * @returns {string} Generated filename in format: YYYYMMDD_verb_the_adjective_adjective_noun.extension
   * @example
   * // Generate a basic filename
   * const filename = toko.generateFilename();
   * console.log(filename); // e.g., '20241201_sketched_the_mysterious_blue_mountain.svg'
   *
   * // Generate filename with custom verb and extension
   * const custom = toko.generateFilename('png', 'painted');
   * console.log(custom); // e.g., '20241201_painted_the_ancient_golden_forest.png'
   */
  function generateFilename (extension = 'svg', verb = 'sketched') {
    const adj1 = randomAdjective();
    const adj2 = randomAdjective();
    const noun = randomNoun();

    const timestamp = _getTimeStamp();
    const baseFilename = `${timestamp}_${verb}_the_${adj1}_${adj2}_${noun}`;

    return extension && extension !== 'none' ? `${baseFilename}.${extension}` : baseFilename;
  }

  /**
   * Generate a timestamp string in YYYYMMDD format
   * @returns {string} Current date formatted as YYYYMMDD
   * @example
   * // Get current timestamp
   * const timestamp = toko._getTimeStamp();
   * console.log(timestamp); // e.g., '20241201'
   */
  function _getTimeStamp () {
    // Get the current date
    const d = new Date();

    // Destructure to get year, month, and day
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(d.getDate()).padStart(2, '0'); // Ensures two-digit day

    // Return formatted timestamp
    return `${year}${month}${day}`;
  }

  /**
   * Centralized context management for p5.js/Q5.js integration
   * Handles context detection and function binding across different p5.js variants
   */

  class ContextManager {
    static _cachedContext = null;
    static _contextInitialized = false;

    /**
     * Initialize and cache the p5.js/Q5.js context
     * Should be called once during library initialization
     */
    static initializeContext () {
      if (this._contextInitialized) {
        return this._cachedContext;
      }

      // Try to get the current p5/Q5 instance
      // p5.js instance mode
      if (typeof p5 !== 'undefined' && p5.instance) {
        this._cachedContext = p5.instance;
      }
      // Q5.js
      else if (typeof Q5 !== 'undefined' && Q5.instance) {
        this._cachedContext = Q5.instance;
      }
      // Global mode - functions should be available globally
      else {
        const globalObj = getGlobalObject();

        // Check if p5/Q5 functions are available globally
        if (globalObj.sin && globalObj.millis) {
          this._cachedContext = globalObj;
        } else {
          // Last resort - return global object (some functions might not work)
          this._cachedContext = globalObj;
        }
      }

      this._contextInitialized = true;
      return this._cachedContext;
    }

    /**
     * Get the cached p5.js/Q5.js context for function binding
     * @returns {Object} The cached p5.js/Q5.js instance or global object
     */
    static getCurrentContext () {
      if (!this._contextInitialized) {
        return this.initializeContext();
      }
      return this._cachedContext;
    }

    /**
     * Create a bound function that uses the current p5.js/Q5.js context
     * @param {Function} fn - Function to bind to the current context
     * @returns {Function} Bound function that will execute with the correct context
     */
    static createBoundFunction (fn) {
      return function (...args) {
        const context = ContextManager.getCurrentContext();
        return fn.call(context, ...args);
      };
    }

    /**
     * Bind all functions in an object to the current p5.js/Q5.js context
     * @param {Object} functionsObj - Object containing functions to bind
     * @returns {Object} Object with all functions bound to the current context
     */
    static bindAllFunctions (functionsObj) {
      const boundFunctions = {};

      Object.entries(functionsObj).forEach(([name, value]) => {
        if (typeof value === 'function') {
          boundFunctions[name] = ContextManager.createBoundFunction(value);
        } else {
          // For constants, just copy them
          boundFunctions[name] = value;
        }
      });

      return boundFunctions;
    }
  }

  // Frame rate tracking for generic JavaScript
  let lastFrameTime = 0;
  let frameCount = 0;
  let currentFrameRate = 0;
  let targetFrameRate = 60; // Default target frame rate
  let NO_LOOP_TEXT = 'noLoop';

  /**
   * Calculate current frame rate using requestAnimationFrame timing
   * @returns {number} Current frame rate
   */
  function calculateFrameRate () {
    const now = performance.now();
    frameCount++;

    if (lastFrameTime === 0) {
      lastFrameTime = now;
      return 0;
    }

    const deltaTime = now - lastFrameTime;
    if (deltaTime >= 1000) {
      // Update every second
      currentFrameRate = Math.round((frameCount * 1000) / deltaTime);
      frameCount = 0;
      lastFrameTime = now;
    }

    return currentFrameRate;
  }

  /**
   * Get the target frame rate
   * @returns {number} Target frame rate
   */
  function getTargetFrameRate () {
    return targetFrameRate;
  }

  /**
   * Create an FPS counter display element
   * @param {Object} options - Configuration options for the FPS counter
   * @param {number} [options.n=30] - Number of samples to average over
   * @param {boolean} [options.showMinMax=false] - Show min-max range in display
   * @param {boolean} [options.showTarget=false] - Show target frame rate
   * @param {Object} [options.element=null] - Custom DOM element to use
   * @param {string} [options.label='FPS '] - Label text for the counter
   * @param {number} [options.delay=1000] - Delay in milliseconds before showing the display
   * @returns {Object} FPS counter object
   * @example
   * // Create a basic FPS counter
   * toko.createFPS();
   *
   * // Create a FPS counter with min/max display
   * toko.createFPS({
   *   showMinMax: true,
   * });
   *
   * // Create a FPS counter with custom delay
   * toko.createFPS({
   *   delay: 2000, // Show after 2 seconds
   * });
   */
  function createFPS ({
    n = 30,
    showMinMax = false,
    showTarget = false,
    element = null,
    label = 'FPS ',
    delay = 1500,
  } = {}) {
    if (!element) {
      element = document.createElement('span');
      element.textContent = label;
      element.classList.add('label--fps');

      // Hide the element initially until delay has passed
      element.style.visibility = 'hidden';

      // Try to append to body if no parent is specified
      if (!element.parentNode) {
        document.body.appendChild(element);
      }
    }

    const fps = {
      element,
      label,
      n,
      showMinMax,
      showTarget,
      delay,
      samples: [],
      sum: 0,
      avg: NaN,
      min: Infinity,
      max: -Infinity,
      targetFrameRate: showTarget ? getTargetFrameRate() : null,
      startTime: performance.now(),
      isVisible: false,
      _manuallyControlled: false,
    };

    // Store in libraryState for automatic updates
    libraryState.fps = fps;

    return fps;
  }

  /**
   * Update the FPS counter display with current frame rate
   * Called automatically by the library's postDrawHook if an FPS counter exists
   * @param {Object} [fps=null] - FPS counter object to update (uses libraryState.fps if null)
   * @example
   * // Manual update (usually not needed as it's automatic)
   * toko.updateFPS();
   */
  function updateFPS (fps = null) {
    if (!fps) fps = libraryState.fps;
    if (!fps) return;

    // Check if delay has passed and show the element (only if not manually controlled)
    if (!fps.isVisible && !fps._manuallyControlled) {
      const elapsed = performance.now() - fps.startTime;
      if (elapsed >= fps.delay) {
        fps.element.style.visibility = 'visible';
        fps.isVisible = true;
      }
    }

    const sample = calculateFrameRate();
    if (sample === undefined || sample === null) {
      console.warn('FPS counter: frameRate() returned undefined/null');
      return;
    }
    fps.samples.push(sample);
    fps.sum += sample;

    let recalcMin = false,
      recalcMax = false;
    if (fps.samples.length > fps.n) {
      const removed = fps.samples.shift();
      fps.sum -= removed;
      if (fps.showMinMax) {
        if (Math.abs(removed - fps.min) < 0.01) recalcMin = true;
        if (Math.abs(removed - fps.max) < 0.01) recalcMax = true;
      }
    }

    if (recalcMin || recalcMax) {
      let min = Infinity,
        max = -Infinity;
      for (let i = 0; i < fps.samples.length; i++) {
        const s = fps.samples[i];
        if (s < min) min = s;
        if (s > max) max = s;
      }
      if (recalcMin) fps.min = min;
      if (recalcMax) fps.max = max;
    }

    if (fps.showMinMax) {
      if (sample < fps.min) fps.min = sample;
      if (sample > fps.max) fps.max = sample;
    }

    fps.avg = fps.sum / fps.samples.length;

    // Check if sketch is looping
    const context = ContextManager.getCurrentContext();
    const isLooping = context && typeof context.isLooping === 'function' ? context.isLooping() : true;

    let html = fps.label ?? '';
    if (!isLooping) {
      // Display 'noLoop' when sketch is not looping
      html += NO_LOOP_TEXT;
    } else {
      if (fps.showMinMax) {
        html += `${Math.floor(fps.min)}-${Math.round(fps.avg)}-${Math.ceil(fps.max)}`;
      } else {
        html += Math.round(fps.avg);
      }
      if (fps.showTarget) html += `/${fps.targetFrameRate}`;
    }

    fps.element.textContent = html;
  }

  /**
   * Show the FPS counter display
   * Creates the FPS counter automatically if it doesn't exist yet
   * @param {Object} [fps=null] - FPS counter object to show (uses libraryState.fps if null)
   * @example
   * // Show the FPS counter (creates it if it doesn't exist)
   * toko.showFPS();
   */
  function showFPS (fps = null) {
    if (!fps) fps = libraryState.fps;

    // Create FPS counter if it doesn't exist
    if (!fps || !fps.element) {
      fps = createFPS();
    }

    fps.element.style.visibility = 'visible';
    fps.isVisible = true;
    fps._manuallyControlled = true;
  }

  /**
   * Hide the FPS counter display
   * @param {Object} [fps=null] - FPS counter object to hide (uses libraryState.fps if null)
   * @example
   * // Hide the FPS counter
   * toko.hideFPS();
   */
  function hideFPS (fps = null) {
    if (!fps) fps = libraryState.fps;
    if (!fps || !fps.element) return;

    fps.element.style.visibility = 'hidden';
    fps.isVisible = false;
    fps._manuallyControlled = true;
  }

  /**
   * Toggle the FPS counter display visibility
   * Creates the FPS counter automatically if it doesn't exist yet
   * @param {Object} [fps=null] - FPS counter object to toggle (uses libraryState.fps if null)
   * @example
   * // Toggle the FPS counter visibility
   * toko.toggleFPS();
   */
  function toggleFPS (fps = null) {
    if (!fps) fps = libraryState.fps;

    // If FPS counter doesn't exist, show it (which will create it)
    if (!fps || !fps.element) {
      showFPS();
      return;
    }

    // Toggle visibility based on current state
    if (fps.isVisible) {
      hideFPS(fps);
    } else {
      showFPS(fps);
    }
  }

  function isFPSVisible (fps = null) {
    if (!fps) fps = libraryState.fps;
    if (!fps) return false;
    return fps.isVisible;
  }

  //
  //  GENERAL MATH FUNCTIONS
  //

  //
  //  wrap a number around if it goes above the maximum or below the minimum
  //
  // This function ensures a number stays within a range by wrapping it around if it exceeds the bounds.
  function wrap (value, min = 0, max = 100) {
    let vw = value;

    if (value < min) {
      vw = max + (value - min);
    } else if (value > max) {
      vw = min + (value - max);
    }

    return vw;
  }

  //
  //  return number of integer digits of a value
  //
  //  Note: This implementation uses Math.log10, which may introduce slight inaccuracies
  //  for very large or very small numbers due to floating-point precision.
  //
  function numDigits (x) {
    return (Math.log10(Math.abs(x)) | 0) + 1;
  }

  /**
   * Creates evenly distributed values between two numbers
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} segments - Number of segments to divide the range into
   * @param {boolean} includeEndpoints - Whether to include start and end values (default: true)
   * @returns {Array<number>} Array of evenly distributed values
   */
  function interpolate (a, b, segments, includeEndpoints = true) {
    // Minimal validation - only check segments validity
    if (!Number.isInteger(segments) || segments < 0 || (segments == 0 && !includeEndpoints)) {
      throw new Error('Segments must be a positive integer');
    }

    if (segments == 0 && includeEndpoints) {
      return [a, b];
    }

    const count = includeEndpoints ? segments + 1 : segments - 1;
    const result = new Array(count); // Pre-allocate

    if (includeEndpoints) {
      for (let i = 0; i <= segments; i++) {
        result[i] = a + (i / segments) * (b - a);
      }
    } else {
      for (let i = 1; i < segments; i++) {
        result[i - 1] = a + (i / segments) * (b - a);
      }
    }

    return result;
  }

  /**
   * Creates evenly distributed coordinate points between two coordinate objects
   * @param {Object} pointA - Start coordinate {x, y}
   * @param {Object} pointB - End coordinate {x, y}
   * @param {number} segments - Number of segments to divide the path into
   * @param {boolean} includeEndpoints - Whether to include start and end points (default: true)
   * @returns {Array<Object>} Array of coordinate objects with interpolated x and y values
   */
  function interpolateCoordinates (pointA, pointB, segments, includeEndpoints = true) {
    // Minimal validation
    if (!Number.isInteger(segments) || segments < 0 || (segments == 0 && !includeEndpoints)) {
      throw new Error('Segments must be a positive integer');
    }

    if (segments == 0 && includeEndpoints) {
      return [pointA, pointB];
    }

    const count = includeEndpoints ? segments + 1 : segments - 1;
    const result = new Array(count); // Pre-allocate

    if (includeEndpoints) {
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        result[i] = {
          x: pointA.x + t * (pointB.x - pointA.x),
          y: pointA.y + t * (pointB.y - pointA.y),
        };
      }
    } else {
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        result[i - 1] = {
          x: pointA.x + t * (pointB.x - pointA.x),
          y: pointA.y + t * (pointB.y - pointA.y),
        };
      }
    }

    return result;
  }

  function lerpCoordinates (p0, p1, fraction) {
    let newVector = {
      x: (p1.x - p0.x) * fraction + p0.x,
      y: (p1.y - p0.y) * fraction + p0.y,
    };
    return newVector;
  }

  // functions/index.js - Auto-export all functions organized by category

  var libraryFunctions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get COLOR_COLLECTIONS () { return COLOR_COLLECTIONS; },
    COLOR_PALETTES: COLOR_PALETTES,
    _createColorScale: _createColorScale,
    _defineContrastColors: _defineContrastColors,
    _findDuotones: _findDuotones,
    _getAnotherPalette: _getAnotherPalette,
    _getColorScale: _getColorScale,
    _getPaletteListRaw: _getPaletteListRaw,
    _getPaletteSelectionRaw: _getPaletteSelectionRaw,
    _getRandomPalette: _getRandomPalette,
    _getTimeStamp: _getTimeStamp,
    _preprocessPalettes: _preprocessPalettes,
    _sortPaletteList: _sortPaletteList,
    _validateColorOptions: _validateColorOptions,
    addChannelGrain: addChannelGrain,
    addSimpleGrain: addSimpleGrain,
    colorAlpha: colorAlpha,
    conicGradient: conicGradient,
    createColorScale: createColorScale,
    createFPS: createFPS,
    easeInBack: easeInBack,
    easeInBounce: easeInBounce,
    easeInCirc: easeInCirc,
    easeInCubic: easeInCubic,
    easeInElastic: easeInElastic,
    easeInExpo: easeInExpo,
    easeInOutBack: easeInOutBack,
    easeInOutBounce: easeInOutBounce,
    easeInOutCirc: easeInOutCirc,
    easeInOutCubic: easeInOutCubic,
    easeInOutElastic: easeInOutElastic,
    easeInOutExpo: easeInOutExpo,
    easeInOutQuad: easeInOutQuad,
    easeInOutQuart: easeInOutQuart,
    easeInOutQuint: easeInOutQuint,
    easeInOutSine: easeInOutSine,
    easeInOutSmoother: easeInOutSmoother,
    easeInQuad: easeInQuad,
    easeInQuart: easeInQuart,
    easeInQuint: easeInQuint,
    easeInSine: easeInSine,
    easeLinear: easeLinear,
    easeOutBack: easeOutBack,
    easeOutBounce: easeOutBounce,
    easeOutCirc: easeOutCirc,
    easeOutCubic: easeOutCubic,
    easeOutElastic: easeOutElastic,
    easeOutExpo: easeOutExpo,
    easeOutQuad: easeOutQuad,
    easeOutQuart: easeOutQuart,
    easeOutQuint: easeOutQuint,
    easeOutSine: easeOutSine,
    findPaletteByName: findPaletteByName,
    formatForTweakpane: formatForTweakpane,
    generateFilename: generateFilename,
    getAllPalettes: getAllPalettes,
    getCollections: getCollections,
    getColorModeList: getColorModeList,
    getColorScale: getColorScale,
    getEasingFunction: getEasingFunction,
    getInfo: getInfo,
    getNextPalette: getNextPalette,
    getPaletteList: getPaletteList,
    getPaletteSelection: getPaletteSelection,
    getPixelColor: getPixelColor,
    getPreviousPalette: getPreviousPalette,
    getRandomPalette: getRandomPalette,
    getSeed: getSeed,
    gradientCircle: gradientCircle,
    hideFPS: hideFPS,
    initColor: initColor,
    intRange: intRange,
    intSequence: intSequence,
    interpolate: interpolate,
    interpolateCoordinates: interpolateCoordinates,
    isFPSVisible: isFPSVisible,
    lerpCoordinates: lerpCoordinates,
    linearGradient: linearGradient,
    log: log,
    logDebug: logDebug,
    logError: logError,
    logInfo: logInfo,
    logWarn: logWarn,
    makeGradientStops: makeGradientStops,
    nextSeed: nextSeed,
    numDigits: numDigits,
    openSimplexNoise: openSimplexNoise,
    pixelThreshold: pixelThreshold,
    plotPolygon: plotPolygon,
    plotRoundedVertices: plotRoundedVertices,
    plotVertices: plotVertices,
    poissonDisk: poissonDisk,
    polygonVertices: polygonVertices,
    previousSeed: previousSeed,
    pulse: pulse,
    radialGradient: radialGradient,
    random: random$1,
    random2DVector: random2DVector,
    randomAdjective: randomAdjective,
    randomBool: randomBool,
    randomChar: randomChar,
    randomNoun: randomNoun,
    randomSeed: randomSeed,
    randomString: randomString,
    resetRNG: resetRNG,
    resetSeed: resetSeed,
    rotateAround: rotateAround,
    scaleAround: scaleAround,
    setSeed: setSeed,
    shadow: shadow,
    showFPS: showFPS,
    shuffle: shuffle,
    steppedRandom: steppedRandom,
    toggleFPS: toggleFPS,
    toggleLibraryBackground: toggleLibraryBackground,
    updateFPS: updateFPS,
    wrap: wrap
  });

  /**
   * Grid class for creating and manipulating rectangular grids with recursive cell splitting
   * and cell packing capabilities. Supports various splitting strategies and maintains
   * cell relationships for complex grid layouts.
   *
   * @example
   * // Create a basic grid
   * const grid = new Grid(0, 0, 400, 300);
   *
   * // Split recursively
   * grid.splitRecursive(3, Grid.SPLIT_LONGEST);
   *
   * // Get all cells
   * const cells = grid.cells;
   */
  class Grid {
    // Static split strategy constants
    static SPLIT_HORIZONTAL = 'split_horizontal';
    static SPLIT_VERTICAL = 'split_vertical';
    static SPLIT_LONGEST = 'split_longest';
    static SPLIT_MIX = 'split_mix';
    static SPLIT_SQUARE = 'split_square';

    /**
     * Create a new Grid instance
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {number} width - Width of the complete grid
     * @param {number} height - Height of the complete grid
     * @param {RNG} [rng=libraryState.RNG] - Random number generator instance
     */
    constructor (x, y, width, height, rng) {
      if (rng === undefined) {
        if (!libraryState.RNG) {
          throw new Error('Toko: Grid requires an RNG instance. Either pass one or ensure toko.init() has been called.');
        }
        rng = libraryState.RNG;
      }
      this._position = createVector(x, y);
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._cells = [new Toko.GridCell(this._x, this._y, this._width, this._height, 0, 0, this._width, this._height)];
      this._points = [];
      this._pointsAreUpdated = false;
      this._openSpaces = [];
      this._rng = rng;
    }

    /**
     * Set the base grid structure with specified rows and columns
     * Resets all existing cells and creates a uniform grid
     * @param {number} [columns=1] - Number of columns in the grid
     * @param {number} [rows=1] - Number of rows in the grid
     * @returns {this} Returns this grid for method chaining
     */
    setBaseGrid (columns = 1, rows = 1) {
      let cellWidth = this._width / columns;
      let cellHeight = this._height / rows;

      this._cells = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          let newCell = new Toko.GridCell(
            this._x + c * cellWidth,
            this._y + r * cellHeight,
            cellWidth,
            cellHeight,
            c,
            r,
            cellWidth,
            cellHeight,
          );
          this._cells.push(newCell);
        }
      }
    }

    /**
     * Collect the coordinates of all unique corner points in the grid
     * Updates the internal points array and marks it as current
     * @returns {p5.Vector[]} Array of unique corner points as p5.Vector objects
     */
    gatherPoints () {
      this._pointsAreUpdated = true;
      this._points = [];
      const pointMap = new Map();

      this._cells.forEach(c => {
        const corners = [
          [c.x, c.y],
          [c.x + c.width, c.y],
          [c.x, c.y + c.height],
          [c.x + c.width, c.y + c.height],
        ];

        corners.forEach(([x, y]) => {
          const key = `${x},${y}`;
          if (!pointMap.has(key)) {
            pointMap.set(key, createVector(x, y));
          }
        });
      });

      this._points = Array.from(pointMap.values());
      return this._points;
    }

    /**
     * Construct a grid by packing cells of different shapes
     * Partly inspired by https://www.gorillasun.de/blog/an-algorithm-for-irregular-grids/
     * @param {number} columns - Number of columns to be packed
     * @param {number} rows - Number of rows to be packed
     * @param {Object[]} cellShapes - Array of objects defining width and height of cell shapes
     * @param {boolean} [fillEmptySpaces=true] - Whether leftover spaces should be filled with 1x1 cells
     * @param {boolean} [snapToPixel=true] - If true, all sizes and positions are rounded to pixels
     * @returns {this} Returns this grid for method chaining
     */
    packGrid (columns, rows, cellShapes, fillEmptySpaces = true, snapToPixel = true) {
      this._pointsAreValid = false;
      this._cells = [];
      let cw, rh;
      if (snapToPixel) {
        cw = Math.round(this._width / columns);
        rh = Math.round(this._height / rows);
      } else {
        cw = this._width / columns;
        rh = this._height / rows;
      }

      this._resetOpenSpaces(columns, rows);

      let spaceCheckInterval = 10;
      let keepGoing = true;
      let shape, w, h, c, r, newCell, keepTryingThisShape;
      let k = 0;
      let fails = 0;
      let maxFails = 1000;
      let triesPerShape = 2500;
      let tryCounter = 0;

      while (keepGoing) {
        // pick random shape
        shape = this._rng.random(cellShapes);
        w = shape[0];
        h = shape[1];

        keepTryingThisShape = true;

        // Skip shapes that are wider or taller than the grid
        if (w > columns || h > rows) {
          fails++;
          keepTryingThisShape = false;
        }

        while (keepTryingThisShape) {
          // pick random location
          c = this._rng.intRange(0, columns - w + 1);
          r = this._rng.intRange(0, rows - h + 1);

          // check if space is available
          if (this._spaceAvailable(c, r, w, h)) {
            newCell = new Toko.GridCell(this._x + c * cw, this._y + r * rh, w * cw, h * rh, c, r, w, h);
            newCell.counter = tryCounter;
            this._cells.push(newCell);
            // claim the space
            this._fillSpace(c, r, w, h);
            // reset
            keepTryingThisShape = false;
            tryCounter = 0;
          } else {
            tryCounter++;
            if (tryCounter > triesPerShape) {
              fails++;
              keepTryingThisShape = false;
            }
          }
        }
        //
        // every once in a while check if there is any space left
        //
        k++;
        if (k % spaceCheckInterval == 0) {
          keepGoing = this._anySpaceLeft();
        }
        //
        //  stop after a max number of fails
        //
        if (fails > maxFails) {
          keepGoing = false;
        }
      }
      //
      //  fill left over spaces
      //
      if (fillEmptySpaces) {
        this._fillEmptySpaces(columns, rows, cellShapes, snapToPixel);
      }
    }

    /**
     * Fill the remaining empty spaces systematically
     * @param {number} columns - Number of columns in the grid
     * @param {number} rows - Number of rows in the grid
     * @param {Array[]} cellShapes - Array of cell shape arrays [width, height]
     * @param {boolean} snapToPixel - Whether to snap to pixel boundaries
     * @private
     */
    _fillEmptySpaces (columns, rows, cellShapes, snapToPixel) {
      // Clone to avoid mutating the caller's array
      cellShapes = [...cellShapes];
      cellShapes.push([1, 1]); // add a 1x1 so we can always fill
      let cw, rh;
      if (snapToPixel) {
        cw = Math.round(this._width / columns);
        rh = Math.round(this._height / rows);
      } else {
        cw = this._width / columns;
        rh = this._height / rows;
      }
      let s, tryingShapes, w, h, newCell;
      //
      //  go through the entire grid and try every shape in every open spot
      //
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          tryingShapes = true;
          s = 0;
          while (tryingShapes) {
            w = cellShapes[s][0];
            h = cellShapes[s][1];
            if (this._spaceAvailable(i, j, w, h)) {
              newCell = new Toko.GridCell(this._x + i * cw, this._y + j * rh, w * cw, h * rh, i, j, cw, rh);
              newCell.counter = s;
              this._cells.push(newCell);
              this._fillSpace(i, j, w, h);
              tryingShapes = false;
            }
            s++;
            if (s >= cellShapes.length) {
              tryingShapes = false;
            }
          }
        }
      }
    }

    /**
     * Check if space is available for this shape
     * @param {number} column - Column position to check
     * @param {number} row - Row position to check
     * @param {number} width - Width of the shape
     * @param {number} height - Height of the shape
     * @returns {boolean} True if space is available
     * @private
     */
    _spaceAvailable (column, row, width, height) {
      if (column + width > this._openSpaces.length) {
        return false;
      }
      if (row + height > this._openSpaces[0].length) {
        return false;
      }
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!this._openSpaces[column + i][row + j]) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * Mark a specific area in the grid as no longer open
     * @param {number} column - Column position to mark
     * @param {number} row - Row position to mark
     * @param {number} width - Width of the area to mark
     * @param {number} height - Height of the area to mark
     * @private
     */
    _fillSpace (column, row, width, height) {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          this._openSpaces[column + i][row + j] = false;
        }
      }
    }

    /**
     * Reset all the space back to open
     * @param {number} columns - Number of columns in the grid
     * @param {number} rows - Number of rows in the grid
     * @private
     */
    _resetOpenSpaces (columns, rows) {
      this._openSpaces = [];
      for (let i = 0; i < columns; i++) {
        this._openSpaces[i] = Array(rows);
        this._openSpaces[i].fill(true);
      }
    }

    /**
     * Check if there is any space left at all
     * @returns {boolean} True if there is any open space remaining
     * @private
     */
    _anySpaceLeft () {
      let columns = this._openSpaces.length;
      let rows = this._openSpaces[0].length;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (this._openSpaces[i][j]) {
            return true;
          }
        }
      }
      return false;
    }

    /**
     * Split the cells recursively
     * @param {number} [nrLoops=1] - Number of times all cells are evaluated
     * @param {number} [chance=0.5] - The chance a cell is split when evaluated (0-1)
     * @param {number} [minSize=10] - Only splits resulting in new cells larger than this size are considered
     * @param {string} [splitStyle=Grid.SPLIT_MIX] - Defines how the cells should split:
     *   - SPLIT_HORIZONTAL: split a cell horizontally into 2 new cells
     *   - SPLIT_VERTICAL: split a cell vertically into 2 new cells
     *   - SPLIT_LONGEST: split the longest dimension
     *   - SPLIT_MIX: split along both axis randomly
     *   - SPLIT_SQUARE: split cells into 4 new cells
     * @returns {this} Returns this grid for method chaining
     */
    splitRecursive (nrLoops = 1, chance = 0.5, minSize = 10, splitStyle = Grid.SPLIT_MIX) {
      if (splitStyle == Grid.SPLIT_SQUARE) {
        // reduce the chance because the square split creates 4 cells instead of 2
        chance *= 0.5;
      }

      for (let i = 0; i < nrLoops; i++) {
        let newCells = [];
        for (let n = 0; n < this._cells.length; n++) {
          if (this._rng.random() < chance) {
            let c = this._splitCell(this._cells[n], minSize, splitStyle);
            newCells = newCells.concat(c);
          } else {
            newCells.push(this._cells[n]);
          }
        }
        this._cells = [...newCells];
      }
    }

    /**
     * Split a single cell according to the specified style
     * @param {GridCell} cell - The cell to split
     * @param {number} [minSize=10] - Minimum size for resulting cells
     * @param {string} [splitStyle=Grid.SPLIT_MIX] - How to split the cell
     * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
     * @private
     */
    _splitCell (cell, minSize = 10, splitStyle = Grid.SPLIT_MIX) {
      let newCells = [];
      switch (splitStyle) {
        case Grid.SPLIT_SQUARE:
          newCells = this._splitCellSquare(cell, minSize);
          break;
        case Grid.SPLIT_HORIZONTAL:
          newCells = this._splitCellHorizontal(cell, minSize);
          break;
        case Grid.SPLIT_VERTICAL:
          newCells = this._splitCellVertical(cell, minSize);
          break;
        case Grid.SPLIT_LONGEST:
          newCells = this._splitCellLongest(cell, minSize);
          break;
        case Grid.SPLIT_MIX:
          newCells = this._splitCellMix(cell, minSize);
          break;
        default:
          newCells = this._splitCellMix(cell, minSize);
          break;
      }
      return newCells;
    }

    /**
     * Split cell along the longest side
     * @param {GridCell} cell - The cell to split
     * @param {number} [minSize=10] - Minimum size for resulting cells
     * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
     * @private
     */
    _splitCellLongest (cell, minSize = 10) {
      if (cell.width > cell.height) {
        return this._splitCellHorizontal(cell, minSize);
      } else {
        return this._splitCellVertical(cell, minSize);
      }
    }

    /**
     * Split cells randomly along horizontal or vertical axis
     * @param {GridCell} cell - The cell to split
     * @param {number} [minSize=10] - Minimum size for resulting cells
     * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
     * @private
     */
    _splitCellMix (cell, minSize = 10) {
      if (this._rng.random() < 0.5) {
        return this._splitCellHorizontal(cell, minSize);
      } else {
        return this._splitCellVertical(cell, minSize);
      }
    }

    /**
     * Split a cell evenly into 4 cells
     * @param {GridCell} cell - The cell to split
     * @param {number} [minSize=10] - Minimum size for resulting cells
     * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
     * @private
     */
    _splitCellSquare (cell, minSize = 10) {
      let w2 = cell.width / 2;
      let h2 = cell.height / 2;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (w2 > minSize && h2 > minSize) {
        newCells.push(new Toko.GridCell(x, y, w2, h2));
        newCells.push(new Toko.GridCell(x + w2, y, w2, h2));
        newCells.push(new Toko.GridCell(x + w2, y + h2, w2, h2));
        newCells.push(new Toko.GridCell(x, y + h2, w2, h2));
        newCells[0].counter = newCells[1].counter = newCells[2].counter = newCells[3].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    /**
     * Split a cell horizontally
     * @param {GridCell} cell - The cell to split
     * @param {number} [minSize=10] - Minimum size for resulting cells
     * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
     * @private
     */
    _splitCellHorizontal (cell, minSize = 10) {
      let w2 = cell.width / 2;
      let h = cell.height;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (w2 > minSize) {
        newCells.push(new Toko.GridCell(x, y, w2, h));
        newCells.push(new Toko.GridCell(x + w2, y, w2, h));
        newCells[0].counter = newCells[1].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    /**
     * Split a cell vertically
     * @param {GridCell} cell - The cell to split
     * @param {number} [minSize=10] - Minimum size for resulting cells
     * @returns {GridCell[]} Array of new cells (or original cell if split not possible)
     * @private
     */
    _splitCellVertical (cell, minSize = 10) {
      let w = cell.width;
      let h2 = cell.height / 2;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (h2 > minSize) {
        newCells.push(new Toko.GridCell(x, y, w, h2));
        newCells.push(new Toko.GridCell(x, y + h2, w, h2));
        newCells[0].counter = newCells[1].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    //----------------------------------------
    //
    //  Set functions
    //
    //----------------------------------------

    /**
     * Set the offset of the entire grid
     * @param {number} x - New x position for the grid
     * @param {number} y - New y position for the grid
     * @returns {this} Returns this grid for method chaining
     */
    setOffset (x, y) {
      // Calculate the offset difference
      let offsetX = x - this._x;
      let offsetY = y - this._y;

      // Update the grid's base position
      this._x = x;
      this._y = y;
      this._position = createVector(x, y);

      // Update all existing cells to maintain their relative positions
      this._cells.forEach(cell => {
        cell.x += offsetX;
        cell.y += offsetY;
      });

      // Invalidate points cache since positions have changed
      this._pointsAreUpdated = false;
    }

    //----------------------------------------
    //  Get functions
    //----------------------------------------

    /**
     * Get the maximum counter value across all cells
     * @returns {number} The highest counter value, or 0 if no cells exist
     */
    get maxCounter () {
      if (this._cells.length === 0) return 0;
      let maxC = Math.max(...this._cells.map(cell => cell.counter));
      return maxC;
    }

    /**
     * Get the minimum counter value across all cells
     * @returns {number} The lowest counter value, or 0 if no cells exist
     */
    get minCounter () {
      if (this._cells.length === 0) return 0;
      let minC = Math.min(...this._cells.map(cell => cell.counter));
      return minC;
    }

    /**
     * Get the grid width
     * @returns {number} The width of the grid
     */
    get width () {
      return this._width;
    }

    /**
     * Get the grid height
     * @returns {number} The height of the grid
     */
    get height () {
      return this._height;
    }

    /**
     * Get the grid x position
     * @returns {number} The x position of the grid
     */
    get x () {
      return this._x;
    }

    /**
     * Get the grid y position
     * @returns {number} The y position of the grid
     */
    get y () {
      return this._y;
    }

    /**
     * Get all cells in the grid
     * @returns {GridCell[]} Array of all grid cells
     */
    get cells () {
      return this._cells;
    }

    /**
     * Get all unique corner points in the grid
     * Automatically updates points if they're not current
     * @returns {p5.Vector[]} Array of unique corner points
     */
    get points () {
      if (!this._pointsAreUpdated) {
        return this.gatherPoints();
      } else {
        return this._points;
      }
    }
  }

  /**
   * QuadTree implementation for efficient spatial queries
   *
   * Original code by Daniel Shiffman
   * http://codingtra.in
   * http://patreon.com/codingtrain
   * https://github.com/CodingTrain/QuadTree
   *
   * MIT License - Copyright (c) 2021 Coding Train
   *
   * A QuadTree is a tree data structure in which each internal node has exactly four children.
   * It's used to partition a two-dimensional space by recursively subdividing it into four
   * quadrants or regions. This makes it efficient for spatial queries like finding all
   * points within a given range.
   *
   * @example
   * // Create a QuadTree with a boundary
   * const boundary = new QuadTreeRectangle(400, 300, 800, 600);
   * const qt = new QuadTree(boundary, 4);
   *
   * // Insert points
   * qt.insert(new QuadTreePoint(100, 100));
   * qt.insert(new QuadTreePoint(200, 200));
   *
   * // Query points in a range
   * const range = new QuadTreeRectangle(50, 50, 200, 200);
   * const found = qt.query(range);
   *
   * @author Daniel Shiffman (original), Bob Corporaal (adapted)
   */
  class QuadTree {
    /**
     * Create a new QuadTree instance
     * @param {QuadTreeRectangle} boundary - The rectangular boundary for this QuadTree node
     * @param {number} [capacity=8] - Maximum number of points before subdividing
     * @param {number} [_depth=0] - Current depth in the tree (internal use)
     * @throws {TypeError} If boundary is null/undefined or not a QuadTreeRectangle
     * @throws {TypeError} If capacity is not a number
     * @throws {RangeError} If capacity is less than 1
     */
    constructor (boundary, capacity = 8, _depth = 0) {
      if (!boundary) {
        throw TypeError('boundary is null or undefined');
      }
      if (!(boundary instanceof QuadTreeRectangle)) {
        throw TypeError('boundary should be a Rectangle');
      }
      if (typeof capacity !== 'number') {
        throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
      }
      if (capacity < 1) {
        throw RangeError('capacity must be greater than 0');
      }

      this.MAX_DEPTH = 8;

      this.boundary = boundary;
      this.capacity = capacity;
      this.points = [];
      this.divided = false;

      this.depth = _depth;
    }

    /**
     * Get all child nodes of this QuadTree
     * @returns {QuadTree[]} Array of child nodes, or empty array if not divided
     */
    get children () {
      if (this.divided) {
        return [this.northeast, this.northwest, this.southeast, this.southwest];
      } else {
        return [];
      }
    }

    /**
     * Clear all points from this QuadTree and remove subdivisions
     * @returns {void}
     */
    clear () {
      this.points = [];

      if (this.divided) {
        this.divided = false;
        delete this.northwest;
        delete this.northeast;
        delete this.southwest;
        delete this.southeast;
      }
    }

    /**
     * Create a new QuadTree with various parameter options
     * @param {QuadTreeRectangle|number} [boundary] - Boundary rectangle or x coordinate
     * @param {number} [y] - Y coordinate (if boundary is x coordinate)
     * @param {number} [width] - Width (if using separate coordinates)
     * @param {number} [height] - Height (if using separate coordinates)
     * @param {number} [capacity] - Maximum capacity before subdividing
     * @returns {QuadTree} New QuadTree instance
     * @throws {TypeError} If no global width/height defined or invalid parameters
     */
    static create () {
      if (arguments.length === 0) {
        if (typeof width === 'undefined') {
          throw new TypeError('No global width defined');
        }
        if (typeof height === 'undefined') {
          throw new TypeError('No global height defined');
        }
        let bounds = new QuadTreeRectangle(width / 2, height / 2, width, height);
        return new QuadTree(bounds, this.DEFAULT_CAPACITY);
      }
      if (arguments[0] instanceof QuadTreeRectangle) {
        let capacity = arguments[1] || this.DEFAULT_CAPACITY;
        return new QuadTree(arguments[0], capacity);
      }
      if (
        typeof arguments[0] === 'number' &&
        typeof arguments[1] === 'number' &&
        typeof arguments[2] === 'number' &&
        typeof arguments[3] === 'number'
      ) {
        let capacity = arguments[4] || this.DEFAULT_CAPACITY;
        return new QuadTree(new QuadTreeRectangle(arguments[0], arguments[1], arguments[2], arguments[3]), capacity);
      }
      throw new TypeError('Invalid parameters');
    }

    /**
     * Convert QuadTree to JSON representation
     * @returns {Object} JSON object representing the QuadTree structure
     */
    toJSON () {
      let obj = {};

      if (this.divided) {
        if (this.northeast.divided || this.northeast.points.length > 0) {
          obj.ne = this.northeast.toJSON();
        }
        if (this.northwest.divided || this.northwest.points.length > 0) {
          obj.nw = this.northwest.toJSON();
        }
        if (this.southeast.divided || this.southeast.points.length > 0) {
          obj.se = this.southeast.toJSON();
        }
        if (this.southwest.divided || this.southwest.points.length > 0) {
          obj.sw = this.southwest.toJSON();
        }
      } else {
        obj.points = this.points;
      }

      if (this.depth === 0) {
        obj.capacity = this.capacity;
        obj.x = this.boundary.x;
        obj.y = this.boundary.y;
        obj.w = this.boundary.w;
        obj.h = this.boundary.h;
      }

      return obj;
    }

    /**
     * Create QuadTree from JSON representation
     * @param {Object} obj - JSON object representing the QuadTree
     * @param {number} [x] - X coordinate (if not in obj)
     * @param {number} [y] - Y coordinate (if not in obj)
     * @param {number} [w] - Width (if not in obj)
     * @param {number} [h] - Height (if not in obj)
     * @param {number} [capacity] - Capacity (if not in obj)
     * @param {number} [depth] - Depth (if not in obj)
     * @returns {QuadTree} New QuadTree instance
     * @throws {TypeError} If JSON missing boundary information
     */
    static fromJSON (obj, x, y, w, h, capacity, depth) {
      if (typeof x === 'undefined') {
        if ('x' in obj) {
          x = obj.x;
          y = obj.y;
          w = obj.w;
          h = obj.h;
          capacity = obj.capacity;
          depth = 0;
        } else {
          throw TypeError('JSON missing boundary information');
        }
      }

      let qt = new QuadTree(new QuadTreeRectangle(x, y, w, h), capacity, depth);

      qt.points = obj.points ?? null;
      qt.divided = qt.points === null; // points are set to null on subdivide

      if ('ne' in obj || 'nw' in obj || 'se' in obj || 'sw' in obj) {
        const x = qt.boundary.x;
        const y = qt.boundary.y;
        const w = qt.boundary.w / 2;
        const h = qt.boundary.h / 2;

        if ('ne' in obj) {
          qt.northeast = QuadTree.fromJSON(obj.ne, x + w / 2, y - h / 2, w, h, capacity, depth + 1);
        } else {
          qt.northeast = new QuadTree(qt.boundary.subdivide('ne'), capacity, depth + 1);
        }
        if ('nw' in obj) {
          qt.northwest = QuadTree.fromJSON(obj.nw, x - w / 2, y - h / 2, w, h, capacity, depth + 1);
        } else {
          qt.northwest = new QuadTree(qt.boundary.subdivide('nw'), capacity, depth + 1);
        }
        if ('se' in obj) {
          qt.southeast = QuadTree.fromJSON(obj.se, x + w / 2, y + h / 2, w, h, capacity, depth + 1);
        } else {
          qt.southeast = new QuadTree(qt.boundary.subdivide('se'), capacity, depth + 1);
        }
        if ('sw' in obj) {
          qt.southwest = QuadTree.fromJSON(obj.sw, x - w / 2, y + h / 2, w, h, capacity, depth + 1);
        } else {
          qt.southwest = new QuadTree(qt.boundary.subdivide('sw'), capacity, depth + 1);
        }
      }

      return qt;
    }

    /**
     * Subdivide this QuadTree into four child nodes
     * @returns {void}
     * @throws {RangeError} If capacity is not greater than 0
     */
    subdivide () {
      this.northeast = new QuadTree(this.boundary.subdivide('ne'), this.capacity, this.depth + 1);
      this.northwest = new QuadTree(this.boundary.subdivide('nw'), this.capacity, this.depth + 1);
      this.southeast = new QuadTree(this.boundary.subdivide('se'), this.capacity, this.depth + 1);
      this.southwest = new QuadTree(this.boundary.subdivide('sw'), this.capacity, this.depth + 1);

      this.divided = true;

      // Move points to children.
      // This improves performance by placing points
      // in the smallest available rectangle.
      for (const p of this.points) {
        const inserted =
          this.northeast.insert(p) || this.northwest.insert(p) || this.southeast.insert(p) || this.southwest.insert(p);

        if (!inserted) {
          throw RangeError('capacity must be greater than 0');
        }
      }

      this.points = null;
    }

    /**
     * Insert a point into the QuadTree
     * @param {QuadTreePoint} point - The point to insert
     * @returns {boolean} True if the point was successfully inserted
     */
    insert (point) {
      if (!this.boundary.contains(point)) {
        return false;
      }

      if (!this.divided) {
        if (this.points.length < this.capacity || this.depth === this.MAX_DEPTH) {
          this.points.push(point);
          return true;
        }

        this.subdivide();
      }

      return (
        this.northeast.insert(point) ||
        this.northwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point)
      );
    }

    /**
     * Query points within a given range
     * @param {QuadTreeRectangle|QuadTreeCircle} range - The range to search within
     * @param {QuadTreePoint[]} [found] - Array to store found points (optional)
     * @returns {QuadTreePoint[]} Array of points within the range
     */
    query (range, found) {
      if (!found) {
        found = [];
      }

      if (!range.intersects(this.boundary)) {
        return found;
      }

      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
        return found;
      }

      for (const p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }

      return found;
    }

    /**
     * Delete all points within a given range
     * @param {QuadTreeRectangle|QuadTreeCircle} range - The range to delete points from
     * @returns {void}
     */
    deleteInRange (range) {
      if (this.divided) {
        this.northwest.deleteInRange(range);
        this.northeast.deleteInRange(range);
        this.southwest.deleteInRange(range);
        this.southeast.deleteInRange(range);
      }

      // Delete points within range (points is null when subdivided)
      if (this.points) {
        this.points = this.points.filter(point => !range.contains(point));
      }
    }

    /**
     * Find the closest points to a search point
     * @param {QuadTreePoint} searchPoint - The point to search from
     * @param {number} [maxCount=1] - Maximum number of points to return
     * @param {number} [maxDistance=Infinity] - Maximum distance to search
     * @returns {QuadTreePoint[]} Array of closest points
     * @throws {TypeError} If searchPoint is undefined
     */
    closest (searchPoint, maxCount = 1, maxDistance = Infinity) {
      if (typeof searchPoint === 'undefined') {
        throw TypeError("Method 'closest' needs a point");
      }

      const sqMaxDistance = maxDistance ** 2;
      return this._kNearest(searchPoint, maxCount, sqMaxDistance, 0, 0).found;
    }

    /**
     * Find k nearest points using internal algorithm
     * @param {QuadTreePoint} searchPoint - The point to search from
     * @param {number} maxCount - Maximum number of points to return
     * @param {number} sqMaxDistance - Maximum squared distance to search
     * @param {number} furthestSqDistance - Current furthest squared distance
     * @param {number} foundSoFar - Number of points found so far
     * @returns {Object} Object with found points and furthest distance
     * @private
     */
    _kNearest (searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar) {
      let found = [];

      if (this.divided) {
        this.children
          .sort((a, b) => a.boundary.sqDistanceFrom(searchPoint) - b.boundary.sqDistanceFrom(searchPoint))
          .forEach(child => {
            const sqDistance = child.boundary.sqDistanceFrom(searchPoint);
            if (sqDistance > sqMaxDistance) {
              return;
            } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
              const result = child._kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar);
              const childPoints = result.found;
              found = found.concat(childPoints);
              foundSoFar += childPoints.length;
              furthestSqDistance = result.furthestSqDistance;
            }
          });
      } else {
        this.points
          .sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint))
          .forEach(p => {
            const sqDistance = p.sqDistanceFrom(searchPoint);
            if (sqDistance > sqMaxDistance) {
              return;
            } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
              found.push(p);
              furthestSqDistance = Math.max(sqDistance, furthestSqDistance);
              foundSoFar++;
            }
          });
      }

      return {
        found: found.sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint)).slice(0, maxCount),
        furthestSqDistance: furthestSqDistance,
      };
    }

    /**
     * Execute a function for each point in the QuadTree
     * @param {Function} fn - Function to execute for each point
     * @returns {void}
     */
    forEach (fn) {
      if (this.divided) {
        this.northeast.forEach(fn);
        this.northwest.forEach(fn);
        this.southeast.forEach(fn);
        this.southwest.forEach(fn);
      } else {
        this.points.forEach(fn);
      }
    }

    /**
     * Filter points in the QuadTree based on a predicate function
     * @param {Function} fn - Predicate function to test each point
     * @returns {QuadTree} New QuadTree containing only points that pass the test
     */
    filter (fn) {
      let filtered = new QuadTree(this.boundary, this.capacity);

      this.forEach(point => {
        if (fn(point)) {
          filtered.insert(point);
        }
      });

      return filtered;
    }

    /**
     * Merge this QuadTree with another QuadTree
     * @param {QuadTree} other - The other QuadTree to merge with
     * @param {number} capacity - Capacity for the merged QuadTree
     * @returns {QuadTree} New QuadTree containing all points from both trees
     */
    merge (other, capacity) {
      let left = Math.min(this.boundary.left, other.boundary.left);
      let right = Math.max(this.boundary.right, other.boundary.right);
      let top = Math.min(this.boundary.top, other.boundary.top);
      let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);

      let height = bottom - top;
      let width = right - left;

      let midX = left + width / 2;
      let midY = top + height / 2;

      let boundary = new QuadTreeRectangle(midX, midY, width, height);
      let result = new QuadTree(boundary, capacity);

      this.forEach(point => result.insert(point));
      other.forEach(point => result.insert(point));

      return result;
    }

    /**
     * Get the total number of points in this QuadTree
     * @returns {number} Total number of points
     */
    get length () {
      if (this.divided) {
        return this.northwest.length + this.northeast.length + this.southwest.length + this.southeast.length;
      }

      return this.points.length;
    }
  }

  //
  //------------------------------------------------------------------------------------------------------------------
  //

  /**
   * Circle class for circular range queries in QuadTree
   * Used to define circular search areas when querying a QuadTree
   *
   * @example
   * // Create a circular query area
   * const circle = new QuadTreeCircle(100, 100, 50);
   *
   * // Query points within the circle
   * const pointsInCircle = quadTree.query(circle);
   *
   * @author Daniel Shiffman (original), Toko Library (adapted)
   * @since 0.0.1
   */
  class QuadTreeCircle {
    /**
     * Create a new QuadTreeCircle
     * @param {number} x - X coordinate of the circle center
     * @param {number} y - Y coordinate of the circle center
     * @param {number} r - Radius of the circle
     * @param {*} [data] - Optional data to store with the circle
     */
    constructor (x, y, r, data) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.rSquared = this.r * this.r;
      this.data = data;
    }

    /**
     * Check if a point is contained within this circle
     * @param {QuadTreePoint} point - The point to check
     * @returns {boolean} True if the point is within the circle
     */
    contains (point) {
      // check if the point is in the circle by checking if the euclidean distance of
      // the point and the center of the circle if smaller or equal to the radius of
      // the circle
      let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
      return d <= this.rSquared;
    }

    /**
     * Check if this circle intersects with a rectangular range
     * @param {QuadTreeRectangle} range - The rectangular range to check
     * @returns {boolean} True if the circle intersects with the range
     */
    intersects (range) {
      let xDist = Math.abs(range.x - this.x);
      let yDist = Math.abs(range.y - this.y);

      // radius of the circle
      let r = this.r;

      let w = range.w / 2;
      let h = range.h / 2;

      let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

      // no intersection
      if (xDist > r + w || yDist > r + h) return false;

      // intersection within the circle
      if (xDist <= w || yDist <= h) return true;

      // intersection on the edge of the circle
      return edges <= this.rSquared;
    }
  }

  /**
   * Point class for QuadTree operations
   * Represents a point in 2D space with optional user data
   *
   * @example
   * // Create a point with data
   * const point = new QuadTreePoint(100, 200, { id: 'point1' });
   *
   * // Calculate distance to another point
   * const distance = point.distanceFrom(otherPoint);
   *
   * @author Daniel Shiffman (original), Toko Library (adapted)
   * @since 0.0.1
   */
  class QuadTreePoint {
    /**
     * Create a new QuadTreePoint
     * @param {number} x - X coordinate of the point
     * @param {number} y - Y coordinate of the point
     * @param {*} [data] - Optional data to store with the point
     */
    constructor (x, y, data) {
      this.x = x;
      this.y = y;
      this.userData = data;
    }

    /**
     * Calculate squared distance to another point (faster than distanceFrom)
     * @param {QuadTreePoint} other - The other point
     * @returns {number} Squared distance between points
     */
    sqDistanceFrom (other) {
      const dx = other.x - this.x;
      const dy = other.y - this.y;

      return dx * dx + dy * dy;
    }

    /**
     * Calculate Euclidean distance to another point
     * @param {QuadTreePoint} other - The other point
     * @returns {number} Distance between points
     */
    distanceFrom (other) {
      return Math.sqrt(this.sqDistanceFrom(other));
    }
  }

  /**
   * Rectangle class for QuadTree operations
   * Represents a rectangular boundary for QuadTree nodes and queries
   *
   * @example
   * // Create a rectangle boundary
   * const rect = new QuadTreeRectangle(400, 300, 800, 600);
   *
   * // Check if a point is contained
   * const contains = rect.contains(point);
   *
   * @author Daniel Shiffman (original), Toko Library (adapted)
   * @since 0.0.1
   */
  class QuadTreeRectangle {
    /**
     * Create a new QuadTreeRectangle
     * @param {number} x - X coordinate of the rectangle center
     * @param {number} y - Y coordinate of the rectangle center
     * @param {number} w - Width of the rectangle
     * @param {number} h - Height of the rectangle
     */
    constructor (x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;

      this.left = x - w / 2;
      this.right = x + w / 2;
      this.top = y - h / 2;
      this.bottom = y + h / 2;
    }

    /**
     * Check if a point is contained within this rectangle
     * @param {QuadTreePoint} point - The point to check
     * @returns {boolean} True if the point is within the rectangle
     */
    contains (point) {
      return this.left <= point.x && point.x <= this.right && this.top <= point.y && point.y <= this.bottom;
    }

    /**
     * Check if this rectangle intersects with another range
     * @param {QuadTreeRectangle|QuadTreeCircle} range - The range to check intersection with
     * @returns {boolean} True if the ranges intersect
     */
    intersects (range) {
      return !(this.right < range.left || range.right < this.left || this.bottom < range.top || range.bottom < this.top);
    }

    /**
     * Subdivide this rectangle into a quadrant
     * @param {string} quadrant - Quadrant to create ('ne', 'nw', 'se', 'sw')
     * @returns {QuadTreeRectangle} New rectangle for the specified quadrant
     */
    subdivide (quadrant) {
      switch (quadrant) {
        case 'ne':
          return new QuadTreeRectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
        case 'nw':
          return new QuadTreeRectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
        case 'se':
          return new QuadTreeRectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
        case 'sw':
          return new QuadTreeRectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
      }
    }

    /**
     * Calculate X distance from a point to this rectangle
     * @param {QuadTreePoint} point - The point to measure distance from
     * @returns {number} X distance (0 if point is within rectangle bounds)
     */
    xDistanceFrom (point) {
      if (this.left <= point.x && point.x <= this.right) {
        return 0;
      }

      return Math.min(Math.abs(point.x - this.left), Math.abs(point.x - this.right));
    }

    /**
     * Calculate Y distance from a point to this rectangle
     * @param {QuadTreePoint} point - The point to measure distance from
     * @returns {number} Y distance (0 if point is within rectangle bounds)
     */
    yDistanceFrom (point) {
      if (this.top <= point.y && point.y <= this.bottom) {
        return 0;
      }

      return Math.min(Math.abs(point.y - this.top), Math.abs(point.y - this.bottom));
    }

    /**
     * Calculate squared distance from a point to this rectangle (faster than distanceFrom)
     * @param {QuadTreePoint} point - The point to measure distance from
     * @returns {number} Squared distance to the rectangle
     */
    sqDistanceFrom (point) {
      const dx = this.xDistanceFrom(point);
      const dy = this.yDistanceFrom(point);

      return dx * dx + dy * dy;
    }

    /**
     * Calculate Euclidean distance from a point to this rectangle
     * @param {QuadTreePoint} point - The point to measure distance from
     * @returns {number} Distance to the rectangle
     */
    distanceFrom (point) {
      return Math.sqrt(this.sqDistanceFrom(point));
    }
  }

  /**
   * Hexagon Grid System
   * Based on Red Blob Games hexagon grid implementation
   * Provides classes for managing hexagonal grids and individual hexagons with custom data storage
   *
   * @author Based on Red Blob Games (redblobgames.com)
   * @license CC0 - No Rights Reserved
   */

  /**
   * Represents a 2D point with x and y coordinates
   */
  class HexPoint {
    /**
     * Create a new HexPoint
     * @param {number} x - The x coordinate
     * @param {number} y - The y coordinate
     */
    constructor (x, y) {
      this.x = x;
      this.y = y;
    }

    /**
     * Add another point to this point
     * @param {HexPoint} other - The point to add
     * @returns {HexPoint} New point with summed coordinates
     */
    add (other) {
      return new HexPoint(this.x + other.x, this.y + other.y);
    }

    /**
     * Subtract another point from this point
     * @param {HexPoint} other - The point to subtract
     * @returns {HexPoint} New point with difference coordinates
     */
    subtract (other) {
      return new HexPoint(this.x - other.x, this.y - other.y);
    }

    /**
     * Scale this point by a factor
     * @param {number} factor - The scaling factor
     * @returns {HexPoint} New scaled point
     */
    scale (factor) {
      return new HexPoint(this.x * factor, this.y * factor);
    }

    /**
     * Calculate distance to another point
     * @param {HexPoint} other - The other point
     * @returns {number} Euclidean distance
     */
    distanceTo (other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if this point equals another point
     * @param {HexPoint} other - The other point
     * @returns {boolean} True if points are equal
     */
    equals (other) {
      return this.x === other.x && this.y === other.y;
    }

    /**
     * Convert to string representation
     * @returns {string} String representation of the point
     */
    toString () {
      return `(${this.x}, ${this.y})`;
    }
  }

  /**
   * Hexagon Grid System
   * Based on Red Blob Games hexagon grid implementation
   * Provides classes for managing hexagonal grids and individual hexagons with custom data storage
   *
   * @author Based on Red Blob Games (redblobgames.com)
   * @license CC0 - No Rights Reserved
   */

  /**
   * Represents a hexagon using cube coordinates (q, r, s) with support for custom data
   * Cube coordinates have the constraint that q + r + s = 0
   */
  class Hexagon {
    /**
     * Create a new Hexagon
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional, will be calculated if not provided)
     * @param {Object} data - Optional custom data object to store with this hexagon
     */
    constructor (q, r, s = null, data = {}) {
      this.q = q;
      this.r = r;
      this.s = s !== null ? s : -q - r;
      this.data = { ...data }; // Create a copy to avoid reference sharing

      // Validate cube coordinate constraint
      if (Math.round(this.q + this.r + this.s) !== 0) {
        throw new Error('Hexagon cube coordinates must satisfy q + r + s = 0');
      }
    }

    /**
     * Set a custom data property
     * @param {string} key - The property key
     * @param {*} value - The property value
     * @returns {this} Returns this hexagon for method chaining
     */
    setData (key, value) {
      this.data[key] = value;
      return this;
    }

    /**
     * Get a custom data property
     * @param {string} key - The property key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The property value or default
     */
    getData (key, defaultValue = undefined) {
      return Object.hasOwn(this.data, key) ? this.data[key] : defaultValue;
    }

    /**
     * Check if a data property exists
     * @param {string} key - The property key
     * @returns {boolean} True if property exists
     */
    hasData (key) {
      return Object.hasOwn(this.data, key);
    }

    /**
     * Remove a data property
     * @param {string} key - The property key
     * @returns {boolean} True if property was removed
     */
    removeData (key) {
      if (Object.hasOwn(this.data, key)) {
        delete this.data[key];
        return true;
      }
      return false;
    }

    /**
     * Get all data keys
     * @returns {string[]} Array of all data property keys
     */
    getDataKeys () {
      return Object.keys(this.data);
    }

    /**
     * Clear all custom data
     * @returns {this} Returns this hexagon for method chaining
     */
    clearData () {
      this.data = {};
      return this;
    }

    /**
     * Clone this hexagon with optional new coordinates and data
     * @param {number} q - New q coordinate (optional, defaults to current)
     * @param {number} r - New r coordinate (optional, defaults to current)
     * @param {number} s - New s coordinate (optional, defaults to current)
     * @param {Object} data - New data object (optional, defaults to copy of current)
     * @returns {Hexagon} New hexagon with copied or new values
     */
    clone (q = this.q, r = this.r, s = this.s, data = this.data) {
      return new Hexagon(q, r, s, data);
    }

    /**
     * Add another hexagon to this one (coordinates only, data is not combined)
     * @param {Hexagon} other - The hexagon to add
     * @returns {Hexagon} New hexagon with summed coordinates and empty data
     */
    add (other) {
      return new Hexagon(this.q + other.q, this.r + other.r, this.s + other.s);
    }

    /**
     * Subtract another hexagon from this one (coordinates only)
     * @param {Hexagon} other - The hexagon to subtract
     * @returns {Hexagon} New hexagon with difference coordinates and empty data
     */
    subtract (other) {
      return new Hexagon(this.q - other.q, this.r - other.r, this.s - other.s);
    }

    /**
     * Scale this hexagon by a factor (coordinates only)
     * @param {number} k - The scaling factor
     * @returns {Hexagon} New scaled hexagon with empty data
     */
    scale (k) {
      return new Hexagon(this.q * k, this.r * k, this.s * k);
    }

    /**
     * Rotate this hexagon left (counterclockwise) by 60 degrees
     * @returns {Hexagon} New rotated hexagon with empty data
     */
    rotateLeft () {
      return new Hexagon(-this.s, -this.q, -this.r);
    }

    /**
     * Rotate this hexagon right (clockwise) by 60 degrees
     * @returns {Hexagon} New rotated hexagon with empty data
     */
    rotateRight () {
      return new Hexagon(-this.r, -this.s, -this.q);
    }

    /**
     * Get the direction vector for a given direction (0-5)
     * @param {number} direction - Direction index (0-5)
     * @returns {Hexagon} Direction vector
     */
    static direction (direction) {
      if (direction < 0 || direction > 5) {
        throw new Error('Direction must be between 0 and 5');
      }
      return Hexagon.DIRECTIONS[direction];
    }

    /**
     * Get all direction vectors
     * @returns {Hexagon[]} Array of all 6 direction vectors
     */
    static getAllDirections () {
      return [...Hexagon.DIRECTIONS];
    }

    /**
     * Get a neighbor in the specified direction
     * @param {number} direction - Direction index (0-5)
     * @returns {Hexagon} Neighboring hexagon coordinates (no data)
     */
    neighbor (direction) {
      return this.add(Hexagon.direction(direction));
    }

    /**
     * Get all 6 neighbors of this hexagon
     * @returns {Hexagon[]} Array of all neighboring hexagon coordinates (no data)
     */
    getAllNeighbors () {
      return Hexagon.DIRECTIONS.map(dir => this.add(dir));
    }

    /**
     * Get a diagonal neighbor in the specified direction
     * @param {number} direction - Direction index (0-5)
     * @returns {Hexagon} Diagonal neighboring hexagon coordinates (no data)
     */
    diagonalNeighbor (direction) {
      if (direction < 0 || direction > 5) {
        throw new Error('Direction must be between 0 and 5');
      }
      return this.add(Hexagon.DIAGONALS[direction]);
    }

    /**
     * Get all 6 diagonal neighbors
     * @returns {Hexagon[]} Array of all diagonal neighbor coordinates (no data)
     */
    getAllDiagonalNeighbors () {
      return Hexagon.DIAGONALS.map(diag => this.add(diag));
    }

    /**
     * Calculate the Manhattan distance from origin (0,0,0)
     * @returns {number} Distance from origin
     */
    length () {
      return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
    }

    /**
     * Calculate distance to another hexagon
     * @param {Hexagon} other - The other hexagon
     * @returns {number} Distance between hexagons
     */
    distanceTo (other) {
      return this.subtract(other).length();
    }

    /**
     * Round fractional cube coordinates to nearest integer coordinates
     * @returns {Hexagon} Hexagon with rounded coordinates and empty data
     */
    round () {
      let qi = Math.round(this.q);
      let ri = Math.round(this.r);
      let si = Math.round(this.s);

      const qDiff = Math.abs(qi - this.q);
      const rDiff = Math.abs(ri - this.r);
      const sDiff = Math.abs(si - this.s);

      if (qDiff > rDiff && qDiff > sDiff) {
        qi = -ri - si;
      } else if (rDiff > sDiff) {
        ri = -qi - si;
      } else {
        si = -qi - ri;
      }

      return new Hexagon(qi, ri, si);
    }

    /**
     * Linear interpolation between this hexagon and another
     * @param {Hexagon} target - Target hexagon
     * @param {number} t - Interpolation parameter (0-1)
     * @returns {Hexagon} Interpolated hexagon with empty data
     */
    lerp (target, t) {
      return new Hexagon(
        this.q * (1 - t) + target.q * t,
        this.r * (1 - t) + target.r * t,
        this.s * (1 - t) + target.s * t,
      );
    }

    /**
     * Get all hexagons on the line between this hexagon and another
     * @param {Hexagon} target - Target hexagon
     * @returns {Hexagon[]} Array of hexagon coordinates forming a line (no data)
     */
    lineTo (target) {
      const distance = this.distanceTo(target);
      const nudgeA = new Hexagon(this.q + 1e-6, this.r + 1e-6, this.s - 2e-6);
      const nudgeB = new Hexagon(target.q + 1e-6, target.r + 1e-6, target.s - 2e-6);

      const results = [];
      const step = 1.0 / Math.max(distance, 1);

      for (let i = 0; i <= distance; i++) {
        results.push(nudgeA.lerp(nudgeB, step * i).round());
      }

      return results;
    }

    /**
     * Get all hexagons within a certain range (ring)
     * @param {number} range - The range/radius
     * @returns {Hexagon[]} Array of hexagon coordinates within range (no data)
     */
    getHexagonsInRange (range) {
      const results = [];
      for (let q = -range; q <= range; q++) {
        const r1 = Math.max(-range, -q - range);
        const r2 = Math.min(range, -q + range);
        for (let r = r1; r <= r2; r++) {
          results.push(new Hexagon(this.q + q, this.r + r, this.s - q - r));
        }
      }
      return results;
    }

    /**
     * Get all hexagons at exactly the specified range (ring border)
     * @param {number} range - The range/radius
     * @returns {Hexagon[]} Array of hexagon coordinates at the ring border (no data)
     */
    getHexagonsAtRange (range) {
      if (range === 0) return [new Hexagon(this.q, this.r, this.s)];

      const results = [];
      let hex = this.add(Hexagon.direction(4).scale(range));

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < range; j++) {
          results.push(hex);
          hex = hex.neighbor(i);
        }
      }

      return results;
    }

    /**
     * Check if this hexagon equals another hexagon (coordinates only)
     * @param {Hexagon} other - The other hexagon
     * @returns {boolean} True if coordinates are equal
     */
    equals (other) {
      return this.q === other.q && this.r === other.r && this.s === other.s;
    }

    /**
     * Create a hexagon from offset coordinates
     * @param {number} col - Column coordinate
     * @param {number} row - Row coordinate
     * @param {number} offset - Offset type (1 for even, -1 for odd)
     * @param {string} type - 'q' for q-offset, 'r' for r-offset
     * @param {Object} data - Optional custom data
     * @returns {Hexagon} New hexagon
     */
    static fromOffset (col, row, offset, type = 'q', data = {}) {
      if (type === 'q') {
        const parity = col & 1;
        const q = col;
        const r = row - (col + offset * parity) / 2;
        return new Hexagon(q, r, -q - r, data);
      } else if (type === 'r') {
        const parity = row & 1;
        const q = col - (row + offset * parity) / 2;
        const r = row;
        return new Hexagon(q, r, -q - r, data);
      } else {
        throw new Error('Offset type must be "q" or "r"');
      }
    }

    /**
     * Convert to offset coordinates
     * @param {number} offset - Offset type (1 for even, -1 for odd)
     * @param {string} type - 'q' for q-offset, 'r' for r-offset
     * @returns {Object} Object with col and row properties
     */
    toOffset (offset, type = 'q') {
      if (type === 'q') {
        const parity = this.q & 1;
        return {
          col: this.q,
          row: this.r + (this.q + offset * parity) / 2,
        };
      } else if (type === 'r') {
        const parity = this.r & 1;
        return {
          col: this.q + (this.r + offset * parity) / 2,
          row: this.r,
        };
      } else {
        throw new Error('Offset type must be "q" or "r"');
      }
    }

    /**
     * Convert to string representation
     * @returns {string} String representation of the hexagon
     */
    toString () {
      return `Hex(${this.q}, ${this.r}, ${this.s})`;
    }

    /**
     * Convert to hash string for use as Map/Set key
     * @returns {string} Hash string
     */
    toHash () {
      return `${this.q},${this.r},${this.s}`;
    }

    /**
     * Create hexagon from hash string
     * @param {string} hash - Hash string created by toHash()
     * @param {Object} data - Optional custom data
     * @returns {Hexagon} New hexagon
     */
    static fromHash (hash, data = {}) {
      const [q, r, s] = hash.split(',').map(Number);
      return new Hexagon(q, r, s, data);
    }
  }

  /**
   * Hexagon Grid System
   * Based on Red Blob Games hexagon grid implementation
   * Provides classes for managing hexagonal grids and individual hexagons with custom data storage
   *
   * @author Based on Red Blob Games (redblobgames.com)
   * @license CC0 - No Rights Reserved
   */

  // Static direction and diagonal vectors
  Hexagon.DIRECTIONS = [
    new Hexagon(1, 0, -1), // East
    new Hexagon(1, -1, 0), // Northeast
    new Hexagon(0, -1, 1), // Northwest
    new Hexagon(-1, 0, 1), // West
    new Hexagon(-1, 1, 0), // Southwest
    new Hexagon(0, 1, -1), // Southeast
  ];

  Hexagon.DIAGONALS = [
    new Hexagon(2, -1, -1),
    new Hexagon(1, -2, 1),
    new Hexagon(-1, -1, 2),
    new Hexagon(-2, 1, 1),
    new Hexagon(-1, 2, -1),
    new Hexagon(1, 1, -2),
  ];

  /**
   * Orientation class for hexagon layout calculations
   * Used internally by HexGrid for coordinate transformations
   */
  class Orientation {
    /**
     * Create a new Orientation
     * @param {number} f0 - Forward transformation matrix element
     * @param {number} f1 - Forward transformation matrix element
     * @param {number} f2 - Forward transformation matrix element
     * @param {number} f3 - Forward transformation matrix element
     * @param {number} b0 - Backward transformation matrix element
     * @param {number} b1 - Backward transformation matrix element
     * @param {number} b2 - Backward transformation matrix element
     * @param {number} b3 - Backward transformation matrix element
     * @param {number} startAngle - Starting angle for corner calculations
     */
    constructor (f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
      this.f0 = f0;
      this.f1 = f1;
      this.f2 = f2;
      this.f3 = f3;
      this.b0 = b0;
      this.b1 = b1;
      this.b2 = b2;
      this.b3 = b3;
      this.startAngle = startAngle;
    }
  }

  /**
   * HexGrid class for managing a hexagonal grid layout with hexagon storage
   * Handles coordinate conversions and maintains a collection of hexagons with custom data
   */
  class HexGrid {
    /**
     * Create a new HexGrid
     * @param {string} orientation - 'pointy' or 'flat'
     * @param {HexPoint} size - Size of hexagons (width and height scaling)
     * @param {HexPoint} origin - Origin point of the grid in pixel coordinates
     */
    constructor (orientation = 'pointy', size = new HexPoint(100, 100), origin = new HexPoint(0, 0)) {
      // statics
      HexGrid.ORIENTATION_POINTY = 'pointy';
      HexGrid.ORIENTATION_FLAT = 'flat';

      if (orientation !== HexGrid.ORIENTATION_POINTY && orientation !== HexGrid.ORIENTATION_FLAT) {
        throw new Error('Orientation must be "pointy" or "flat"');
      }

      this.orientation = orientation === HexGrid.ORIENTATION_POINTY ? HexGrid.POINTY : HexGrid.FLAT;
      this.size = size;
      this.origin = origin;

      // Store hexagons using their coordinate hash as key
      this.hexagons = new Map();
    }

    /**
     * Add a hexagon to the grid
     * @param {Hexagon} hexagon - The hexagon to add
     * @returns {this} Returns this grid for method chaining
     */
    addHexagon (hexagon) {
      this.hexagons.set(hexagon.toHash(), hexagon);
      return this;
    }

    /**
     * Create and add a hexagon to the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @param {Object} data - Optional custom data
     * @returns {Hexagon} The created hexagon
     */
    createHexagon (q, r, s = null, data = {}) {
      const hexagon = new Hexagon(q, r, s, data);
      this.addHexagon(hexagon);
      return hexagon;
    }

    /**
     * Get a hexagon from the grid by coordinates
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {Hexagon|null} The hexagon or null if not found
     */
    getHexagon (q, r, s = null) {
      const testHex = new Hexagon(q, r, s);
      return this.hexagons.get(testHex.toHash()) || null;
    }

    /**
     * Get a hexagon from the grid by hash
     * @param {string} hash - The coordinate hash
     * @returns {Hexagon|null} The hexagon or null if not found
     */
    getHexagonByHash (hash) {
      return this.hexagons.get(hash) || null;
    }

    /**
     * Check if a hexagon exists in the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {boolean} True if hexagon exists
     */
    hasHexagon (q, r, s = null) {
      const testHex = new Hexagon(q, r, s);
      return this.hexagons.has(testHex.toHash());
    }

    /**
     * Remove a hexagon from the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {boolean} True if hexagon was removed
     */
    removeHexagon (q, r, s = null) {
      const testHex = new Hexagon(q, r, s);
      return this.hexagons.delete(testHex.toHash());
    }

    /**
     * Clear all hexagons from the grid
     * @returns {this} Returns this grid for method chaining
     */
    clear () {
      this.hexagons.clear();
      return this;
    }

    /**
     * Get the number of hexagons in the grid
     * @returns {number} Number of hexagons
     */
    gridSize () {
      return this.hexagons.size;
    }

    /**
     * Get all hexagons in the grid
     * @returns {Hexagon[]} Array of all hexagons
     */
    getAllHexagons () {
      return Array.from(this.hexagons.values());
    }

    /**
     * Get all hexagon coordinates (without data)
     * @returns {string[]} Array of all coordinate hashes
     */
    getAllCoordinates () {
      return Array.from(this.hexagons.keys());
    }

    /**
     * Iterate over all hexagons in the grid
     * @param {Function} callback - Function to call for each hexagon (hexagon, hash) => {...}
     * @returns {this} Returns this grid for method chaining
     */
    forEach (callback) {
      this.hexagons.forEach(callback);
      return this;
    }

    /**
     * Filter hexagons based on a predicate
     * @param {Function} predicate - Function to test each hexagon (hexagon) => boolean
     * @returns {Hexagon[]} Array of hexagons that pass the test
     */
    filter (predicate) {
      return this.getAllHexagons().filter(predicate);
    }

    /**
     * Find the first hexagon that matches a predicate
     * @param {Function} predicate - Function to test each hexagon (hexagon) => boolean
     * @returns {Hexagon|null} First matching hexagon or null
     */
    find (predicate) {
      for (const hexagon of this.hexagons.values()) {
        if (predicate(hexagon)) {
          return hexagon;
        }
      }
      return null;
    }

    /**
     * Get neighbors of a hexagon that exist in the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {Hexagon[]} Array of neighboring hexagons that exist in the grid
     */
    getNeighbors (q, r, s = null) {
      const neighbors = [];
      const directions = Hexagon.DIRECTIONS;

      // Direct calculation instead of creating hexagon objects
      for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        const neighborQ = q + dir.q;
        const neighborR = r + dir.r;
        const neighborS = s !== null ? s + dir.s : -neighborQ - neighborR;

        const neighbor = this.getHexagonByHash(`${neighborQ},${neighborR},${neighborS}`);
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }

      return neighbors;
    }

    /**
     * Get all neighboring positions that are empty (don't exist in the grid)
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {Hexagon[]} Array of neighboring hexagon coordinates that don't exist in the grid
     */
    getEmptyNeighbors (q, r, s = null) {
      const hex = new Hexagon(q, r, s);
      const emptyNeighbors = [];

      for (const neighborCoord of hex.getAllNeighbors()) {
        const neighbor = this.getHexagonByHash(neighborCoord.toHash());
        if (!neighbor) {
          emptyNeighbors.push(neighborCoord);
        }
      }

      return emptyNeighbors;
    }

    /**
     * Get all hexagons within a range from a center point
     * @param {number} centerQ - Center q coordinate
     * @param {number} centerR - Center r coordinate
     * @param {number} range - Range/radius
     * @param {boolean} includeCenter - Whether to include the center hexagon
     * @returns {Hexagon[]} Array of hexagons within range that exist in the grid
     */
    getHexagonsInRange (centerQ, centerR, range, includeCenter = true) {
      const center = new Hexagon(centerQ, centerR);
      const candidateCoords = center.getHexagonsInRange(range);
      const results = [];

      for (const coord of candidateCoords) {
        if (!includeCenter && coord.equals(center)) continue;

        const hexagon = this.getHexagonByHash(coord.toHash());
        if (hexagon) {
          results.push(hexagon);
        }
      }

      return results;
    }

    /**
     * Get all hexagons at exactly the specified range from a center point
     * @param {number} centerQ - Center q coordinate
     * @param {number} centerR - Center r coordinate
     * @param {number} range - Range/radius
     * @returns {Hexagon[]} Array of hexagons at the ring border that exist in the grid
     */
    getHexagonsAtRange (centerQ, centerR, range) {
      const center = new Hexagon(centerQ, centerR);
      const candidateCoords = center.getHexagonsAtRange(range);
      const results = [];

      for (const coord of candidateCoords) {
        const hexagon = this.getHexagonByHash(coord.toHash());
        if (hexagon) {
          results.push(hexagon);
        }
      }

      return results;
    }

    // =============================================
    // PIXEL COORDINATE METHODS
    // =============================================

    /**
     * Convert hexagon coordinates to pixel coordinates (center of hexagon)
     * @param {Hexagon|number} hex - The hexagon to convert, or q coordinate if using separate parameters
     * @param {number} [r] - The r coordinate (if hex is q coordinate)
     * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
     * @returns {HexPoint} Pixel coordinates of the hexagon center
     */
    hexToPixel (hex, r = null, s = null) {
      // Handle both Hexagon object and separate coordinate parameters
      const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);

      const M = this.orientation;
      const x = (M.f0 * hexagon.q + M.f1 * hexagon.r) * this.size.x;
      const y = (M.f2 * hexagon.q + M.f3 * hexagon.r) * this.size.y;
      return new HexPoint(x + this.origin.x, y + this.origin.y);
    }

    /**
     * Get the pixel coordinates of the center of a hexagon that exists in the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {HexPoint|null} Pixel coordinates of center, or null if hexagon doesn't exist in grid
     */
    getHexagonCenterPixel (q, r, s = null) {
      const hexagon = this.getHexagon(q, r, s);
      if (!hexagon) {
        return null;
      }
      return this.hexToPixel(hexagon);
    }

    /**
     * Get the offset from hex center to a corner
     * @param {number} corner - Corner index (0-5)
     * @returns {HexPoint} Offset to corner from center
     */
    getCornerOffset (corner, scaling = 1) {
      if (corner < 0 || corner > 5) {
        throw new Error('Corner index must be between 0 and 5');
      }
      const M = this.orientation;
      const angle = (2.0 * Math.PI * (M.startAngle - corner)) / 6.0;
      return new HexPoint(scaling * this.size.x * Math.cos(angle), scaling * this.size.y * Math.sin(angle));
    }

    /**
     * Get all corner points of a hexagon in pixel coordinates
     * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
     * @param {number} [r] - The r coordinate (if hex is q coordinate)
     * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
     * @returns {HexPoint[]} Array of 6 corner points in pixel coordinates
     */
    getHexCorners (hex, r = null, s = null, scaling = 1) {
      // Handle both Hexagon object and separate coordinate parameters
      const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);

      const corners = [];
      const center = this.hexToPixel(hexagon);

      for (let i = 0; i < 6; i++) {
        const offset = this.getCornerOffset(i, scaling);
        corners.push(center.add(offset));
      }

      return corners;
    }

    /**
     * Get the corner points of a hexagon that exists in the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {HexPoint[]|null} Array of 6 corner points, or null if hexagon doesn't exist in grid
     */
    getHexagonCornerPixels (q, r, s = null, scaling = 1) {
      const hexagon = this.getHexagon(q, r, s);
      if (!hexagon) {
        return null;
      }
      return this.getHexCorners(hexagon, null, null, scaling);
    }

    /**
     * Get a specific corner point of a hexagon in pixel coordinates
     * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
     * @param {number} corner - Corner index (0-5) or r coordinate if hex is q coordinate
     * @param {number} [r] - The r coordinate (if hex is q coordinate and corner is corner index)
     * @param {number} [s] - The s coordinate (optional, if using separate coordinates)
     * @returns {HexPoint} The specified corner point in pixel coordinates
     */
    getHexCorner (hex, corner, r = null, s = null) {
      let hexagon, cornerIndex;

      // Handle different parameter combinations
      if (hex instanceof Hexagon) {
        hexagon = hex;
        cornerIndex = corner;
      } else if (typeof hex === 'number' && typeof corner === 'number' && r !== null) {
        // hex is q, corner is cornerIndex, r is r coordinate
        hexagon = new Hexagon(hex, r, s);
        cornerIndex = corner;
      } else {
        throw new Error('Invalid parameters: expected (Hexagon, corner) or (q, corner, r, [s])');
      }

      if (cornerIndex < 0 || cornerIndex > 5) {
        throw new Error('Corner index must be between 0 and 5');
      }

      const center = this.hexToPixel(hexagon);
      const offset = this.getCornerOffset(cornerIndex);
      return center.add(offset);
    }

    /**
     * Get all facet midpoint coordinates of a hexagon in pixel coordinates
     * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
     * @param {number} [r] - The r coordinate (if hex is q coordinate)
     * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
     * @returns {HexPoint[]} Array of 6 facet midpoint coordinates in pixel coordinates
     */
    getHexMidpoints (hex, r = null, s = null) {
      // Handle both Hexagon object and separate coordinate parameters
      const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);

      const midpoints = [];
      const center = this.hexToPixel(hexagon);

      for (let i = 0; i < 6; i++) {
        // Get the current corner and the next corner (wrapping around)
        const corner1 = this.getCornerOffset(i);
        const corner2 = this.getCornerOffset((i + 1) % 6);

        // Calculate midpoint between the two corners
        const midpointOffset = new HexPoint((corner1.x + corner2.x) / 2, (corner1.y + corner2.y) / 2);

        midpoints.push(center.add(midpointOffset));
      }

      return midpoints;
    }

    /**
     * Get all pixel coordinates (center + corners) for a hexagon
     * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
     * @param {number} [r] - The r coordinate (if hex is q coordinate)
     * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
     * @returns {Object} Object with 'center' and 'corners' properties containing pixel coordinates
     */
    getHexagonPixelCoordinates (hex, r = null, s = null, scaling = 1) {
      // Handle both Hexagon object and separate coordinate parameters
      const hexagon = hex instanceof Hexagon ? hex : new Hexagon(hex, r, s);
      const center = this.hexToPixel(hexagon);
      const corners = this.getHexCorners(hexagon, null, null, scaling);

      return {
        center: center,
        corners: corners,
      };
    }

    /**
     * Get all pixel coordinates for a hexagon that exists in the grid
     * @param {number} q - The q coordinate
     * @param {number} r - The r coordinate
     * @param {number} s - The s coordinate (optional)
     * @returns {Object|null} Object with 'center' and 'corners' properties, or null if hexagon doesn't exist
     */
    getGridHexagonPixelCoordinates (q, r, s = null, scaling = 1) {
      const hexagon = this.getHexagon(q, r, s);
      if (!hexagon) {
        return null;
      }
      return this.getHexagonPixelCoordinates(hexagon, null, null, scaling);
    }

    /**
     * Get pixel coordinates for multiple hexagons
     * @param {Hexagon[]|Array} hexagons - Array of hexagons or coordinate arrays [[q,r,s], ...]
     * @returns {Array} Array of objects with hexagon coordinates and pixel data
     */
    getMultipleHexagonPixels (hexagons) {
      return hexagons.map(hex => {
        let hexagon;
        if (hex instanceof Hexagon) {
          hexagon = hex;
        } else if (Array.isArray(hex)) {
          hexagon = new Hexagon(hex[0], hex[1], hex[2] || null);
        } else {
          throw new Error('Invalid hexagon format in array');
        }

        return {
          hexagon: hexagon,
          coordinates: { q: hexagon.q, r: hexagon.r, s: hexagon.s },
          pixels: this.getHexagonPixelCoordinates(hexagon),
        };
      });
    }

    /**
     * Get pixel coordinates for all hexagons in the grid
     * @returns {Array} Array of objects with hexagon data and pixel coordinates
     */
    getAllHexagonPixels () {
      const result = [];
      this.forEach(hexagon => {
        result.push({
          hexagon: hexagon,
          coordinates: { q: hexagon.q, r: hexagon.r, s: hexagon.s },
          pixels: this.getHexagonPixelCoordinates(hexagon),
          data: hexagon.data,
        });
      });
      return result;
    }

    /**
     * Create an SVG path string for a hexagon outline
     * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
     * @param {number} [r] - The r coordinate (if hex is q coordinate)
     * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
     * @returns {string} SVG path string for the hexagon
     */

    /**
     * Get bounding box for a hexagon in pixel coordinates
     * @param {Hexagon|number} hex - The hexagon, or q coordinate if using separate parameters
     * @param {number} [r] - The r coordinate (if hex is q coordinate)
     * @param {number} [s] - The s coordinate (optional, if hex is q coordinate)
     * @returns {Object} Bounding box with minX, minY, maxX, maxY, width, height
     */
    getHexagonBounds (hex, r = null, s = null) {
      const corners = this.getHexCorners(hex, r, s);

      let minX = corners[0].x,
        maxX = corners[0].x;
      let minY = corners[0].y,
        maxY = corners[0].y;

      for (let i = 1; i < corners.length; i++) {
        minX = Math.min(minX, corners[i].x);
        maxX = Math.max(maxX, corners[i].x);
        minY = Math.min(minY, corners[i].y);
        maxY = Math.max(maxY, corners[i].y);
      }

      return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    /**
     * Get the bounding box for all hexagons in the grid
     * @returns {Object|null} Overall bounding box or null if grid is empty
     */
    getGridBounds () {
      const hexagons = this.getAllHexagons();
      if (hexagons.length === 0) {
        return null;
      }

      let overallMinX = Infinity,
        overallMaxX = -Infinity;
      let overallMinY = Infinity,
        overallMaxY = -Infinity;

      for (const hexagon of hexagons) {
        const bounds = this.getHexagonBounds(hexagon);
        overallMinX = Math.min(overallMinX, bounds.minX);
        overallMaxX = Math.max(overallMaxX, bounds.maxX);
        overallMinY = Math.min(overallMinY, bounds.minY);
        overallMaxY = Math.max(overallMaxY, bounds.maxY);
      }

      return {
        minX: overallMinX,
        minY: overallMinY,
        maxX: overallMaxX,
        maxY: overallMaxY,
        width: overallMaxX - overallMinX,
        height: overallMaxY - overallMinY,
      };
    }

    // =============================================
    // END PIXEL COORDINATE METHODS
    // =============================================

    /**
     * Get all hexagons that intersect with a rectangular area
     * @param {HexPoint} topLeft - Top-left corner of rectangle
     * @param {HexPoint} bottomRight - Bottom-right corner of rectangle
     * @returns {Hexagon[]} Array of hexagons in the area that exist in the grid
     */
    getHexagonsInRectangle (topLeft, bottomRight) {
      const hexagonHashes = new Set();

      // Sample points throughout the rectangle to find all intersecting hexagons
      const stepX = Math.max(1, (bottomRight.x - topLeft.x) / 20);
      const stepY = Math.max(1, (bottomRight.y - topLeft.y) / 20);

      for (let x = topLeft.x; x <= bottomRight.x; x += stepX) {
        for (let y = topLeft.y; y <= bottomRight.y; y += stepY) {
          const hex = this.pixelToHex(new HexPoint(x, y));
          hexagonHashes.add(hex.toHash());
        }
      }

      // Return only hexagons that exist in the grid
      const results = [];
      for (const hash of hexagonHashes) {
        const hexagon = this.getHexagonByHash(hash);
        if (hexagon) {
          results.push(hexagon);
        }
      }

      return results;
    }

    /**
     * Get all hexagons within a circular area
     * @param {HexPoint} center - Center of circle in pixel coordinates
     * @param {number} radius - Radius in pixels
     * @returns {Hexagon[]} Array of hexagons in the circle that exist in the grid
     */
    getHexagonsInCircle (center, radius) {
      const centerHex = this.pixelToHex(center);
      const hexRadius = Math.ceil(radius / Math.min(this.size.x, this.size.y));

      const candidateCoords = centerHex.getHexagonsInRange(hexRadius);
      const results = [];

      for (const coord of candidateCoords) {
        const hexagon = this.getHexagonByHash(coord.toHash());
        if (hexagon) {
          const hexCenter = this.hexToPixel(hexagon);
          if (hexCenter.distanceTo(center) <= radius) {
            results.push(hexagon);
          }
        }
      }

      return results;
    }

    /**
     * Create and add a rectangular grid of hexagons
     * @param {number} width - Width in hexagons
     * @param {number} height - Height in hexagons
     * @param {Hexagon} startHex - Starting hexagon coordinates (default: origin)
     * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
     * @returns {Hexagon[]} Array of created hexagons
     */
    createRectangularGrid (width, height, startHex = new Hexagon(0, 0, 0), dataFactory = null) {
      const hexagons = [];

      for (let r = 0; r < height; r++) {
        const rOffset = Math.floor(r / 2);
        for (let q = -rOffset; q < width - rOffset; q++) {
          const hexQ = startHex.q + q;
          const hexR = startHex.r + r;
          const hexS = startHex.s - q - r;

          const data = dataFactory ? dataFactory(hexQ, hexR, hexS) : {};
          const hexagon = this.createHexagon(hexQ, hexR, hexS, data);
          hexagons.push(hexagon);
        }
      }

      return hexagons;
    }

    /**
     * Create and add a hexagonal grid of hexagons
     * @param {number} radius - Radius of the hexagonal grid
     * @param {Hexagon} centerHex - Center hexagon coordinates (default: origin)
     * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
     * @returns {Hexagon[]} Array of created hexagons
     */
    createHexagonalGrid (radius, centerHex = new Hexagon(0, 0, 0), dataFactory = null) {
      const coordinateList = centerHex.getHexagonsInRange(radius);
      const hexagons = [];

      for (const coord of coordinateList) {
        const data = dataFactory ? dataFactory(coord.q, coord.r, coord.s) : {};
        const hexagon = this.createHexagon(coord.q, coord.r, coord.s, data);
        hexagons.push(hexagon);
      }

      return hexagons;
    }

    /**
     * Create and add hexagons along a line between two points
     * @param {Hexagon} startHex - Starting hexagon coordinates
     * @param {Hexagon} endHex - Ending hexagon coordinates
     * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
     * @returns {Hexagon[]} Array of created hexagons along the line
     */
    createLineOfHexagons (startHex, endHex, dataFactory = null) {
      const coordinateList = startHex.lineTo(endHex);
      const hexagons = [];

      for (const coord of coordinateList) {
        const data = dataFactory ? dataFactory(coord.q, coord.r, coord.s) : {};
        const hexagon = this.createHexagon(coord.q, coord.r, coord.s, data);
        hexagons.push(hexagon);
      }

      return hexagons;
    }

    /**
     * Create a new grid with different orientation
     * @param {string} newOrientation - 'pointy' or 'flat'
     * @returns {HexGrid} New grid with different orientation (hexagons not copied)
     */
    withOrientation (newOrientation) {
      return new HexGrid(newOrientation, this.size, this.origin);
    }

    /**
     * Create a new grid with different size
     * @param {HexPoint} newSize - New size
     * @returns {HexGrid} New grid with different size (hexagons not copied)
     */
    withSize (newSize) {
      const orientationName = this.orientation === HexGrid.POINTY ? 'pointy' : 'flat';
      return new HexGrid(orientationName, newSize, this.origin);
    }

    /**
     * Create a new grid with different origin
     * @param {HexPoint} newOrigin - New origin
     * @returns {HexGrid} New grid with different origin (hexagons not copied)
     */
    withOrigin (newOrigin) {
      const orientationName = this.orientation === HexGrid.POINTY ? 'pointy' : 'flat';
      return new HexGrid(orientationName, this.size, newOrigin);
    }

    /**
     * Clone this grid with all hexagons
     * @returns {HexGrid} New grid with copied hexagons
     */
    clone () {
      const orientationName = this.orientation === HexGrid.POINTY ? 'pointy' : 'flat';
      const newGrid = new HexGrid(orientationName, this.size, this.origin);

      // Copy all hexagons
      this.forEach(hexagon => {
        newGrid.addHexagon(hexagon.clone());
      });

      return newGrid;
    }

    /**
     * Get grid statistics
     * @returns {Object} Object with grid statistics
     */
    getStats () {
      const hexagons = this.getAllHexagons();

      if (hexagons.length === 0) {
        return {
          count: 0,
          bounds: null,
          center: null,
        };
      }

      let minQ = hexagons[0].q,
        maxQ = hexagons[0].q;
      let minR = hexagons[0].r,
        maxR = hexagons[0].r;
      let minS = hexagons[0].s,
        maxS = hexagons[0].s;

      for (const hex of hexagons) {
        minQ = Math.min(minQ, hex.q);
        maxQ = Math.max(maxQ, hex.q);
        minR = Math.min(minR, hex.r);
        maxR = Math.max(maxR, hex.r);
        minS = Math.min(minS, hex.s);
        maxS = Math.max(maxS, hex.s);
      }

      // Calculate center using fractional coordinates first, then round properly
      const centerQ = (minQ + maxQ) / 2;
      const centerR = (minR + maxR) / 2;
      const centerS = (minS + maxS) / 2;

      // Create a fractional hexagon and use the existing round() method
      // which properly maintains the q + r + s = 0 constraint
      const fractionalCenter = new Hexagon(centerQ, centerR, centerS);
      const center = fractionalCenter.round();

      return {
        count: hexagons.length,
        bounds: {
          q: { min: minQ, max: maxQ },
          r: { min: minR, max: maxR },
          s: { min: minS, max: maxS },
        },
        center: center,
      };
    }
    /**
     * Convert pixel coordinates to hexagon coordinates
     * @param {HexPoint} point - Pixel coordinates to convert
     * @returns {Hexagon} The hexagon containing this pixel point
     * OPTIMIZED: Added caching for frequently accessed coordinates
     */
    pixelToHex (point) {
      const M = this.orientation;
      const pt = new HexPoint((point.x - this.origin.x) / this.size.x, (point.y - this.origin.y) / this.size.y);
      const q = M.b0 * pt.x + M.b1 * pt.y;
      const r = M.b2 * pt.x + M.b3 * pt.y;
      const s = -q - r;

      // Create fractional hex and round to nearest integer coordinates
      const fractionalHex = new Hexagon(q, r, s);
      return fractionalHex.round();
    }

    /**
     * Snap pixel coordinates to the center of the containing hexagon
     * @param {HexPoint} point - Pixel coordinates to convert
     * @returns {HexPoint} Pixel coordinates of the hexagon center that contains the input point
     */
    snapToPixelCenter (point) {
      const inputPoint = new HexPoint(point.x, point.y);
      const containingHex = this.pixelToHex(inputPoint);
      return this.hexToPixel(containingHex);
    }

    /**
     * Create and add hexagons within a rectangular pixel area
     * @param {number} x - X coordinate of top-left corner of rectangle
     * @param {number} y - Y coordinate of top-left corner of rectangle
     * @param {number} width - Width of rectangle in pixels
     * @param {number} height - Height of rectangle in pixels
     * @param {Function} dataFactory - Optional function to create data for each hex (q, r, s) => data
     * @param {boolean} includePartial - If true, includes hexagons partially in rectangle; if false, only fully contained hexagons
     * @returns {Hexagon[]} Array of created hexagons
     */
    createRectangularGridFromPixels (x, y, width, height, dataFactory = null, includePartial = true) {
      // Input validation
      if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
        throw new Error('x, y, width, and height must be numbers');
      }

      if (width <= 0 || height <= 0) {
        throw new Error('width and height must be positive');
      }

      if (dataFactory && typeof dataFactory !== 'function') {
        throw new Error('dataFactory must be a function or null');
      }

      const topLeft = new HexPoint(x, y);
      const bottomRight = new HexPoint(x + width, y + height);

      // More efficient approach: determine hex coordinate bounds first
      const cornerHexes = [
        this.pixelToHex(topLeft),
        this.pixelToHex(new HexPoint(x + width, y)), // top-right
        this.pixelToHex(new HexPoint(x, y + height)), // bottom-left
        this.pixelToHex(bottomRight), // bottom-right
      ];

      // Find hex coordinate bounds with padding to ensure we don't miss any
      let minQ = Math.min(...cornerHexes.map(h => h.q)) - 1;
      let maxQ = Math.max(...cornerHexes.map(h => h.q)) + 1;
      let minR = Math.min(...cornerHexes.map(h => h.r)) - 1;
      let maxR = Math.max(...cornerHexes.map(h => h.r)) + 1;

      const hexagons = [];
      const processedHashes = new Set();

      // Iterate through hex coordinate bounds instead of pixel sampling
      for (let q = minQ; q <= maxQ; q++) {
        for (let r = minR; r <= maxR; r++) {
          const s = -q - r; // Maintain hex coordinate constraint
          const candidateHex = new Hexagon(q, r, s);
          const hash = candidateHex.toHash();

          if (processedHashes.has(hash)) continue;
          processedHashes.add(hash);

          let shouldInclude = false;

          if (includePartial) {
            // Include if any part of the hexagon intersects with the rectangle
            shouldInclude = this._hexagonIntersectsRectangle(candidateHex, topLeft, bottomRight);
          } else {
            // Include only if the hexagon is fully contained within the rectangle
            shouldInclude = this._hexagonFullyInRectangle(candidateHex, topLeft, bottomRight);
          }

          if (shouldInclude) {
            // Skip if hexagon already exists in grid (avoid duplicates)
            if (!this.hasHexagon(q, r, s)) {
              const data = dataFactory ? dataFactory(q, r, s) : {};
              const hexagon = this.createHexagon(q, r, s, data);
              hexagons.push(hexagon);
            }
          }
        }
      }

      return hexagons;
    }

    /**
     * Check if a hexagon intersects with a rectangle (any overlap)
     * Uses more precise hexagon corner checking for better accuracy
     * @private
     * @param {Hexagon} hex - The hexagon to check
     * @param {HexPoint} rectTopLeft - Top-left corner of rectangle
     * @param {HexPoint} rectBottomRight - Bottom-right corner of rectangle
     * @returns {boolean} True if hexagon intersects with rectangle
     */
    _hexagonIntersectsRectangle (hex, rectTopLeft, rectBottomRight) {
      // Quick bounding box check first (early rejection)
      const hexBounds = this.getHexagonBounds(hex);
      if (
        hexBounds.maxX < rectTopLeft.x ||
        hexBounds.minX > rectBottomRight.x ||
        hexBounds.maxY < rectTopLeft.y ||
        hexBounds.minY > rectBottomRight.y
      ) {
        return false;
      }

      // If bounding boxes overlap, do more precise check
      // Check if any hex corner is inside rectangle
      const corners = this.getHexCorners(hex);
      for (const corner of corners) {
        if (
          corner.x >= rectTopLeft.x &&
          corner.x <= rectBottomRight.x &&
          corner.y >= rectTopLeft.y &&
          corner.y <= rectBottomRight.y
        ) {
          return true;
        }
      }

      // Check if any rectangle corner is inside hexagon
      const rectCorners = [
        rectTopLeft,
        new HexPoint(rectBottomRight.x, rectTopLeft.y),
        rectBottomRight,
        new HexPoint(rectTopLeft.x, rectBottomRight.y),
      ];

      for (const rectCorner of rectCorners) {
        if (this._pointInHexagon(rectCorner, hex)) {
          return true;
        }
      }

      // Check if rectangle edges cross hexagon edges (covers remaining cases)
      return this._rectangleEdgesCrossHexagon(rectTopLeft, rectBottomRight, corners);
    }

    /**
     * Check if a hexagon is fully contained within a rectangle
     * @private
     * @param {Hexagon} hex - The hexagon to check
     * @param {HexPoint} rectTopLeft - Top-left corner of rectangle
     * @param {HexPoint} rectBottomRight - Bottom-right corner of rectangle
     * @returns {boolean} True if hexagon is fully within rectangle
     */
    _hexagonFullyInRectangle (hex, rectTopLeft, rectBottomRight) {
      // Check if all hexagon corners are within rectangle bounds
      const corners = this.getHexCorners(hex);
      return corners.every(
        corner =>
          corner.x >= rectTopLeft.x &&
          corner.x <= rectBottomRight.x &&
          corner.y >= rectTopLeft.y &&
          corner.y <= rectBottomRight.y,
      );
    }

    /**
     * Check if a point is inside a hexagon using the center and corner positions
     * @private
     * @param {HexPoint} point - Point to test
     * @param {Hexagon} hex - Hexagon to test against
     * @returns {boolean} True if point is inside hexagon
     */
    _pointInHexagon (point, hex) {
      // Convert point to hex coordinates and check if it rounds to the same hex
      const testHex = this.pixelToHex(point);
      return testHex.equals(hex);
    }

    /**
     * Check if rectangle edges cross any hexagon edges
     * Simplified check for edge intersection cases
     * @private
     * @param {HexPoint} rectTopLeft - Rectangle top-left corner
     * @param {HexPoint} rectBottomRight - Rectangle bottom-right corner
     * @param {HexPoint[]} hexCorners - Array of hexagon corner points
     * @returns {boolean} True if edges intersect
     */
    _rectangleEdgesCrossHexagon (rectTopLeft, rectBottomRight, hexCorners) {
      // This is a simplified check - in most practical cases,
      // the corner checks above will catch intersections
      // For a complete implementation, you would need line-line intersection tests

      // Check if rectangle spans across hexagon horizontally or vertically
      const hexBounds = {
        minX: Math.min(...hexCorners.map(c => c.x)),
        maxX: Math.max(...hexCorners.map(c => c.x)),
        minY: Math.min(...hexCorners.map(c => c.y)),
        maxY: Math.max(...hexCorners.map(c => c.y)),
      };

      // Rectangle spans hexagon horizontally and overlaps vertically
      const horizontalSpan =
        rectTopLeft.x <= hexBounds.minX &&
        rectBottomRight.x >= hexBounds.maxX &&
        rectTopLeft.y < hexBounds.maxY &&
        rectBottomRight.y > hexBounds.minY;

      // Rectangle spans hexagon vertically and overlaps horizontally
      const verticalSpan =
        rectTopLeft.y <= hexBounds.minY &&
        rectBottomRight.y >= hexBounds.maxY &&
        rectTopLeft.x < hexBounds.maxX &&
        rectBottomRight.x > hexBounds.minX;

      return horizontalSpan || verticalSpan;
    }
  }

  // Static orientation configurations
  HexGrid.POINTY = new Orientation(
    Math.sqrt(3.0),
    Math.sqrt(3.0) / 2.0,
    0.0,
    3.0 / 2.0,
    Math.sqrt(3.0) / 3.0,
    -1.0 / 3.0,
    0.0,
    2.0 / 3.0,
    0.5,
  );

  HexGrid.FLAT = new Orientation(
    3.0 / 2.0,
    0.0,
    Math.sqrt(3.0) / 2.0,
    Math.sqrt(3.0),
    2.0 / 3.0,
    0.0,
    -1.0 / 3.0,
    Math.sqrt(3.0) / 3.0,
    0.0,
  );

  // Constants for offset coordinate types
  const OFFSET_EVEN = 1;
  const OFFSET_ODD = -1;

  /**
   * GridCell class representing a single cell within a grid
   * Contains position, size, and metadata for grid operations
   *
   * @example
   * // Create a basic cell
   * const cell = new GridCell(10, 20, 50, 30);
   *
   * // Set custom values
   * cell.value = 0.5;
   * cell.counter = 3;
   *
   * @author Bob Corporaal
   * @since 0.0.1
   */
  class GridCell {
    /**
     * Create a new GridCell instance
     * @param {number} x - X position on the canvas
     * @param {number} y - Y position on the canvas
     * @param {number} width - Width of the cell
     * @param {number} height - Height of the cell
     * @param {number} [column=0] - Column position in the grid
     * @param {number} [row=0] - Row position in the grid
     * @param {number} [gridWidth=0] - Total number of columns in the grid
     * @param {number} [gridHeight=0] - Total number of rows in the grid
     */
    constructor (x, y, width, height, column = 0, row = 0, gridWidth = 0, gridHeight = 0) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._row = row;
      this._column = column;
      this._gridWidth = gridWidth;
      this._gridHeight = gridHeight;
      this._value = 0;
      this._counter = 0;
    }

    get x () {
      return this._x;
    }
    set x (x) {
      this._x = x;
    }

    get y () {
      return this._y;
    }
    set y (y) {
      this._y = y;
    }

    get width () {
      return this._width;
    }
    set width (width) {
      this._width = width;
    }

    get height () {
      return this._height;
    }
    set height (height) {
      this._height = height;
    }

    get row () {
      return this._row;
    }
    set row (row) {
      this._row = row;
    }

    get column () {
      return this._column;
    }
    set column (column) {
      this._column = column;
    }

    get gridWidth () {
      return this._gridWidth;
    }
    set gridWidth (gridWidth) {
      this._gridWidth = gridWidth;
    }

    get gridHeight () {
      return this._gridHeight;
    }
    set gridHeight (gridHeight) {
      this._gridHeight = gridHeight;
    }

    get value () {
      return this._value;
    }
    set value (value) {
      this._value = value;
    }

    get counter () {
      return this._counter;
    }
    set counter (counter) {
      this._counter = counter;
    }
  }

  /**
   * Camera class for mapping world coordinates to canvas coordinates
   * Uses p5.js transformation functions for efficient rendering
   */
  class Camera {
    constructor (canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;

      // Default world properties
      this.worldWidth = 1000;
      this.worldHeight = 1000;

      // Default focus area properties
      this.focusX = 0;
      this.focusY = 0;
      this.focusWidth = 200;
      this.focusHeight = 200;

      // Calculated transformation properties
      this.scale = 1;
      this.offsetX = 0;
      this.offsetY = 0;

      this.updateTransform();
    }

    /**
     * Set the world dimensions
     * @param {number} width - Width of the world in world coordinates
     * @param {number} height - Height of the world in world coordinates
     * @returns {this} Returns this camera for method chaining
     */
    setWorld (width, height) {
      this.worldWidth = width;
      this.worldHeight = height;
      this.updateTransform();
      return this;
    }

    /**
     * Set the focus area (the part of the world to fit in canvas)
     * @param {number} centerX - X coordinate of the focus area center in world coordinates
     * @param {number} centerY - Y coordinate of the focus area center in world coordinates
     * @param {number} width - Width of the focus area in world coordinates
     * @param {number} height - Height of the focus area in world coordinates
     * @returns {this} Returns this camera for method chaining
     */
    setFocus (centerX, centerY, width, height) {
      this.focusX = centerX;
      this.focusY = centerY;
      this.focusWidth = width;
      this.focusHeight = height;
      this.updateTransform();
      return this;
    }

    /**
     * Update canvas dimensions (call when canvas is resized)
     * @param {number} width - New canvas width in pixels
     * @param {number} height - New canvas height in pixels
     * @returns {this} Returns this camera for method chaining
     */
    setCanvas (width, height) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.updateTransform();
      return this;
    }

    /**
     * Calculate the transformation parameters
     * Ensures focus area fits entirely within canvas with proportional scaling
     * @returns {void}
     */
    updateTransform () {
      // Calculate scale to fit focus area in canvas (choose smaller scale to ensure full containment)
      const scaleX = this.canvasWidth / this.focusWidth;
      const scaleY = this.canvasHeight / this.focusHeight;
      this.scale = Math.min(scaleX, scaleY);

      // Calculate the top-left corner of the focus area in world coordinates
      const focusLeft = this.focusX - this.focusWidth / 2;
      const focusTop = this.focusY - this.focusHeight / 2;

      // Calculate offset to center the scaled focus area on canvas
      const scaledFocusWidth = this.focusWidth * this.scale;
      const scaledFocusHeight = this.focusHeight * this.scale;

      this.offsetX = (this.canvasWidth - scaledFocusWidth) / 2 - focusLeft * this.scale;
      this.offsetY = (this.canvasHeight - scaledFocusHeight) / 2 - focusTop * this.scale;
    }

    /**
     * Apply the camera transformation to p5.js
     * Call this before drawing world objects
     */
    apply () {
      push();
      translate(this.offsetX, this.offsetY);
      scale(this.scale);
    }

    /**
     * Remove the camera transformation
     * Call this after drawing world objects
     */
    unapply () {
      pop();
    }

    /**
     * Transform world coordinates to screen coordinates
     * @param {number} worldX - X coordinate in world space
     * @param {number} worldY - Y coordinate in world space
     * @returns {Object} Object with x and y properties in screen coordinates
     */
    worldToScreen (worldX, worldY) {
      return {
        x: worldX * this.scale + this.offsetX,
        y: worldY * this.scale + this.offsetY,
      };
    }

    /**
     * Transform screen coordinates to world coordinates
     * Handles high-DPI displays automatically via p5.js
     * @param {number} screenX - X coordinate in screen space
     * @param {number} screenY - Y coordinate in screen space
     * @returns {Object} Object with x and y properties in world coordinates
     */
    screenToWorld (screenX, screenY) {
      return {
        x: (screenX - this.offsetX) / this.scale,
        y: (screenY - this.offsetY) / this.scale,
      };
    }

    /**
     * Get the current view bounds in world coordinates
     * @returns {Object} Object with left, top, right, bottom, width, and height properties
     */
    getViewBounds () {
      const topLeft = this.screenToWorld(0, 0);
      const bottomRight = this.screenToWorld(this.canvasWidth, this.canvasHeight);

      return {
        left: topLeft.x,
        top: topLeft.y,
        right: bottomRight.x,
        bottom: bottomRight.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
      };
    }

    /**
     * Check if a world coordinate point is visible on screen
     * @param {number} worldX - X coordinate in world space
     * @param {number} worldY - Y coordinate in world space
     * @param {number} [margin=0] - Additional margin around the view bounds
     * @returns {boolean} True if the point is visible within the view bounds
     */
    isVisible (worldX, worldY, margin = 0) {
      const bounds = this.getViewBounds();
      return (
        worldX >= bounds.left - margin &&
        worldX <= bounds.right + margin &&
        worldY >= bounds.top - margin &&
        worldY <= bounds.bottom + margin
      );
    }

    /**
     * Get current scale factor
     * @returns {number} The current scale factor
     */
    getScale () {
      return this.scale;
    }

    /**
     * Get current offset
     * @returns {Object} Object with x and y properties representing the current offset
     */
    getOffset () {
      return { x: this.offsetX, y: this.offsetY };
    }

    /**
     * Setup high-DPI support for the current canvas
     * Call this after creating a Camera if you need high-DPI support
     */
  }

  /**
   * ImageLoader class for preloading images and SVG files with automatic type detection
   * Integrates with p5.js preload system to ensure assets are loaded before setup() runs.
   * Supports both SVG and raster image formats (PNG, JPG, JPEG).
   *
   * @example
   * // Create loader with items array
   * const loader = new toko.ImageLoader([
   *   { id: 1, url: 'image.png' },
   *   { id: 2, url: 'graphic.svg' },
   *   { id: 3, url: 'photo.jpg', type: toko.ImageLoader.IMAGE }
   * ]);
   *
   * // Preload all assets in preload() function
   * function preload() {
   *   loader.preloadAll(() => {
   *     console.log('All images loaded');
   *   });
   * }
   *
   * // Access loaded images in setup() or draw()
   * function setup() {
   *   const img = loader.get(1);
   *   image(img, 0, 0);
   * }
   */
  class ImageLoader {
    // Static type constants
    static SVG = 'svg';
    static IMAGE = 'image';

    /**
     * Create a new ImageLoader instance
     * @param {Array<Object>} items - Array of items to load, each with id, url, and optional type
     * @param {string|number} items[].id - Unique identifier for the asset
     * @param {string} items[].url - URL or path to the image file
     * @param {string} [items[].type] - Optional type override ('svg' or 'image'), defaults to auto-detection from file extension
     * @example
     * // Basic usage with auto-detection
     * const loader = new toko.ImageLoader([
     *   { id: 1, url: 'assets/image.png' },
     *   { id: 2, url: 'assets/logo.svg' }
     * ]);
     *
     * // With explicit type override
     * const loader = new toko.ImageLoader([
     *   { id: 1, url: 'image.png', type: toko.ImageLoader.IMAGE },
     *   { id: 2, url: 'graphic.svg', type: toko.ImageLoader.SVG }
     * ]);
     */
    constructor (items) {
      if (!Array.isArray(items)) {
        console.warn('Toko: ImageLoader expects an array of items. Defaulting to empty array.');
        items = [];
      }
      this.items = items;
      this.images = new Map();
      this.loadedCount = 0;
      this.totalCount = items.length;
      this.isDone = false;

      // Expose type constants as instance properties for convenience
      this.SVG = ImageLoader.SVG;
      this.IMAGE = ImageLoader.IMAGE;
    }

    /**
     * Preload all images and SVGs in the items array
     * Integrates with p5.js preload system when called from preload() function.
     * Works correctly whether called from preload() or setup().
     * Returns a Promise that resolves when all assets are loaded, allowing async/await usage.
     * @param {Function} [onComplete] - Optional callback function called when all assets are loaded
     * @returns {Promise} Promise that resolves when all assets are loaded
     * @example
     * // In preload() function
     * function preload() {
     *   loader.preloadAll(() => {
     *     console.log('All assets loaded');
     *   });
     * }
     *
     * // In setup() function with async/await (p5 v2)
     * async function setup() {
     *   await loader.preloadAll();
     *   // Assets are now loaded
     * }
     *
     * // In setup() function with callback
     * function setup() {
     *   loader.preloadAll(() => {
     *     console.log('All assets loaded');
     *   });
     * }
     */
    preloadAll (onComplete) {
      // Return a Promise that resolves when all assets are loaded
      return new Promise(resolve => {
        const completionHandler = () => {
          if (onComplete) onComplete();
          resolve();
        };

        if (this.totalCount === 0) {
          this.isDone = true;
          completionHandler();
          return;
        }

        this.items.forEach(item => {
          this._loadItem(item, completionHandler);
        });
      });
    }

    _determineLoadType (item) {
      // Check for explicit type override
      if (item.type === ImageLoader.SVG) {
        return ImageLoader.SVG;
      }
      if (item.type === ImageLoader.IMAGE) {
        return ImageLoader.IMAGE;
      }

      // Determine type from file extension
      // Remove query parameters and hash fragments before extracting extension
      const url = item.url || '';
      const urlWithoutParams = url.split('?')[0].split('#')[0];
      const extension = urlWithoutParams.split('.').pop()?.toLowerCase() || '';

      if (extension === 'svg') {
        return ImageLoader.SVG;
      }
      if (['png', 'jpg', 'jpeg'].includes(extension)) {
        return ImageLoader.IMAGE;
      }

      // Default to image for unknown extensions
      return ImageLoader.IMAGE;
    }

    _loadItem (item, onComplete) {
      // Create a closure to capture the correct item
      const currentItem = item;
      const loadType = this._determineLoadType(currentItem);
      const p5Context = ContextManager.getCurrentContext();

      // Increment preload counter if available (manual tracking - Option 2)
      // This works regardless of where preloadAll() is called
      // When called from preload(), automatic tracking (Option 1) also occurs
      if (p5Context && typeof p5Context._incrementPreload === 'function') {
        p5Context._incrementPreload();
      }

      if (loadType === ImageLoader.SVG) {
        loadSVG(
          currentItem.url,
          svg => {
            this.images.set(String(currentItem.id), svg);
            // Decrement preload counter on success
            if (p5Context && typeof p5Context._decrementPreload === 'function') {
              p5Context._decrementPreload();
            }
            this.loadedCount++;
            if (this.loadedCount === this.totalCount) {
              this.isDone = true;
              if (onComplete) onComplete();
            }
          },
          event => {
            // Decrement preload counter on error (critical - must always be called)
            if (p5Context && typeof p5Context._decrementPreload === 'function') {
              p5Context._decrementPreload();
            }
            console.log('SVG load failure', event);
          },
        );
      } else {
        loadImage(
          currentItem.url,
          img => {
            this.images.set(String(currentItem.id), img);
            // Decrement preload counter on success
            if (p5Context && typeof p5Context._decrementPreload === 'function') {
              p5Context._decrementPreload();
            }
            this.loadedCount++;
            if (this.loadedCount === this.totalCount) {
              this.isDone = true;
              if (onComplete) onComplete();
            }
          },
          event => {
            // Decrement preload counter on error (critical - must always be called)
            if (p5Context && typeof p5Context._decrementPreload === 'function') {
              p5Context._decrementPreload();
            }
            console.log('Image load failure', event);
          },
        );
      }
    }

    /**
     * Get a loaded image or SVG by its id
     * @param {string|number} id - The id of the asset to retrieve
     * @returns {p5.Image|p5.SVGElement|null} The loaded image or SVG element, or null if not found or not yet loaded
     * @example
     * // Get a loaded image
     * const img = loader.get(1);
     * if (img) {
     *   image(img, 0, 0);
     * }
     *
     * // Check if asset is loaded
     * const svg = loader.get(2);
     * if (svg) {
     *   // Use the SVG element
     * }
     */
    get (id) {
      return this.images.get(String(id)) || null;
    }
  }

  // classes/index.js - Export all classes

  var libraryClasses = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Camera: Camera,
    Grid: Grid,
    GridCell: GridCell,
    HexGrid: HexGrid,
    HexPoint: HexPoint,
    Hexagon: Hexagon,
    ImageLoader: ImageLoader,
    OFFSET_EVEN: OFFSET_EVEN,
    OFFSET_ODD: OFFSET_ODD,
    QuadTree: QuadTree,
    QuadTreeCircle: QuadTreeCircle,
    QuadTreePoint: QuadTreePoint,
    QuadTreeRectangle: QuadTreeRectangle,
    RNG: RNG,
    cubicBezier: cubicBezier
  });

  /**
   * Initialize hook - called when p5.js/Q5.js initializes
   * Note: Not used since it is not available for p5.js v2
   */
  function initHook () {
    // not used since it is not available for p5 v2
  }

  /**
   * Pre-setup hook - called before p5.js setup() function
   * Initializes the library state and color system
   */
  function preSetupHook () {
    logInfo(`${LIBRARY_NAME} v${VERSION} (${libraryState.variant})`);
    libraryState.initialized = true;
    initColor();
  }

  /**
   * Post-setup hook - called after p5.js setup() function
   * Currently unused but available for future initialization tasks
   */
  function postSetupHook () {}

  /**
   * Pre-draw hook - called before each draw() cycle
   * Currently unused but available for per-frame setup tasks
   */
  function preDrawHook () {
    // not used yet
  }

  /**
   * Post-draw hook - called after each draw() cycle
   * Tracks when the first draw cycle has completed
   */
  function postDrawHook () {
    if (!libraryState.initialDrawDone) {
      libraryState.initialDrawDone = true;
    }

    // Automatically update FPS counter if it exists
    if (libraryState.fps) {
      const context = ContextManager.getCurrentContext();
      updateFPS.call(context);
    }
  }

  /**
   * Remove hook - called when the sketch is removed or destroyed
   * Performs cleanup tasks and resets library state
   */
  function removeHook () {
    logDebug(`${LIBRARY_NAME} - Cleanup on sketch removal`);
    libraryState.initialized = false;
  }

  /**
   * Toko Library adapter using the shared base adapter system
   * This eliminates code duplication while maintaining library-specific functionality
   */

  // Create registration functions object
  const registrationFunctions = {
    registerLibraryFunctions: () => registerLibraryFunctions(libraryFunctions, libraryState),
    registerLibraryClasses: () => registerLibraryClasses(libraryClasses, libraryState),
  };

  // Create lifecycle handlers object
  const lifecycleHandlers = {
    initHook,
    preSetupHook,
    postSetupHook,
    preDrawHook,
    postDrawHook,
    removeHook,
  };

  // Create the adapter instance
  const adapter = new BaseAdapter(libraryState, lifecycleHandlers, registrationFunctions);

  // Export the adapter functions
  function initializeP5v1 () {
    return adapter.initialize();
  }

  const p5v2Adapter = function (p5, fn, lifecycles) {
    return adapter.initialize({ p5, fn, lifecycles });
  };

  function initializeQ5 () {
    return adapter.initialize();
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

  /**
   * Main Toko library class
   *
   * The core class that manages the Toko creative coding library.
   * Handles initialization, variant detection, and registration of functions and classes
   * across different p5.js variants (v1, v2, Q5).
   *
   * @example
   * // Toko is automatically initialized when the library loads
   * // Access functions and classes through the global toko instance
   * const grid = new toko.Grid(0, 0, 400, 300);
   * const randomValue = toko.random(0, 100);
   */

  let Toko$1 = class Toko {
    /**
     * Create a new Toko instance
     * Automatically binds functions and classes to the instance
     */
    constructor () {
      this.initialized = false;
      this.variant = LIBRARY_UNKNOWN;
      this.version = VERSION;
      this.name = LIBRARY_NAME;

      // Bind all library functions with proper context handling
      this.bindFunctions();

      // Attach classes to this instance
      this.bindClasses();
    }

    bindFunctions () {
      // Use ContextManager to create properly bound functions
      const boundFunctions = ContextManager.bindAllFunctions(libraryFunctions);

      // Assign all bound functions to this instance
      Object.entries(boundFunctions).forEach(([name, fn]) => {
        this[name] = fn;
      });
    }

    bindClasses () {
      // Attach all classes to this instance for Toko.ClassName access
      Object.entries(libraryClasses).forEach(([name, ClassConstructor]) => {
        this[name] = ClassConstructor;
      });
    }

    /**
     * Initialize the Toko library
     * @returns {Toko} Returns this instance for method chaining
     */
    init () {
      return this.initializeLibrary();
    }

    /**
     * Initialize the library with p5.js variant detection and registration
     * @returns {Toko} Returns this instance for method chaining
     */
    initializeLibrary () {
      // Prevent multiple initializations
      if (this.initialized) {
        logWarn(`${LIBRARY_NAME}: Already initialized`);
        return this;
      }

      // Initialize and cache the p5.js context for performance
      ContextManager.initializeContext();

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

      // Register global functions and classes
      this.registerGlobalFunctions();
      this.registerGlobalClasses();

      // Create a RNG to use as a default
      libraryState.RNG = new this.RNG();

      this.initialized = true;

      return this;
    }

    get initialDrawDone () {
      return libraryState.initialDrawDone;
    }

    registerGlobalFunctions () {
      const globalObj = getGlobalObject();

      // Use ContextManager to create properly bound global functions
      const boundFunctions = ContextManager.bindAllFunctions(libraryFunctions);

      // Register on global object for direct access
      Object.entries(boundFunctions).forEach(([name, fn]) => {
        if (!Object.prototype.hasOwnProperty.call(globalObj, name)) {
          globalObj[name] = fn;
        }
      });
    }

    registerGlobalClasses () {
      const globalObj = getGlobalObject();
      Object.entries(libraryClasses).forEach(([name, ClassConstructor]) => {
        if (!Object.prototype.hasOwnProperty.call(globalObj, name)) {
          globalObj[name] = ClassConstructor;
        }
      });
    }

    detectVariant () {
      return detectP5Variant();
    }

    getInfo () {
      return {
        name: this.name,
        version: this.version,
        variant: this.variant,
        initialized: this.initialized,
      };
    }
  };

  // IIFE wrapper for the entire library
  (function (global) {

    // Create the main Toko instance
    const tokoInstance = new Toko$1();
    let initializationAttempted = false;

    function autoInit () {
      // Prevent multiple initialization attempts
      if (initializationAttempted) {
        return;
      }

      // Check for both global and window-attached variables
      if (
        typeof p5 !== 'undefined' ||
        typeof Q5 !== 'undefined' ||
        (typeof window !== 'undefined' && (typeof window.p5 !== 'undefined' || typeof window.Q5 !== 'undefined'))
      ) {
        initializationAttempted = true;

        tokoInstance.initializeLibrary();
      } else {
        setTimeout(autoInit, 100);
      }
    }

    // Expose both the class and instance to global scope
    global[LIBRARY_NAME] = tokoInstance; // Main instance
    global.TokoClass = Toko$1; // Class constructor for creating new instances

    // Also expose as lowercase for convenience
    global.toko = tokoInstance;

    global.toko.BLEND_MODE = BLEND_MODE;

    // Expose easing constants
    global.toko.EASE_LINEAR = EASE_LINEAR;
    global.toko.EASE_SMOOTH = EASE_SMOOTH;
    global.toko.EASE_QUAD = EASE_QUAD;
    global.toko.EASE_CUBIC = EASE_CUBIC;
    global.toko.EASE_QUART = EASE_QUART;
    global.toko.EASE_QUINT = EASE_QUINT;
    global.toko.EASE_EXPO = EASE_EXPO;
    global.toko.EASE_CIRC = EASE_CIRC;
    global.toko.EASE_ELASTIC = EASE_ELASTIC;
    global.toko.EASE_BOUNCE = EASE_BOUNCE;
    global.toko.EASE_BACK = EASE_BACK;
    global.toko.EASE_IN = EASE_IN;
    global.toko.EASE_OUT = EASE_OUT;
    global.toko.EASE_IN_OUT = EASE_IN_OUT;
    global.toko.LIBRARY = LIBRARY;

    // Auto-initialize
    if (typeof document !== 'undefined') {
      // For Q5, initialize immediately to catch lifecycle hooks
      if (typeof Q5 !== 'undefined' || (typeof window !== 'undefined' && typeof window.Q5 !== 'undefined')) {
        autoInit();
      } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
      } else {
        autoInit();
      }
    } else {
      autoInit();
    }
  })(typeof window !== 'undefined' ? window : global);

})();
//# sourceMappingURL=p5.toko.js.map
