// Import constants from shared files
import {
  LIBRARY_NAME,
  SIZE_DEFAULT,
  SIZE_FULL,
  SIZE_SQUARE_XL,
  SIZE_1080P,
  SIZE_1080P_PORTRAIT,
  SIZE_4K,
  SIZE_4K_PORTRAIT,
  SIZE_IPHONE_11_WALLPAPER,
  SIZE_WIDE_SCREEN,
  SIZE_MACBOOK_14_WALLPAPER,
  SIZE_MACBOOK_16_WALLPAPER,
  SIZE_INSTAGRAM_PORTRAIT,
  CAPTURE_FORMATS,
  CAPTURE_FRAMERATES,
  VERSION,
  RENDER_MODES,
} from './config/constants.js';

import { LIBRARY_Q5, LIBRARY_UNKNOWN } from '../shared/constants/common.js';
import { initializeP5v1, initializeQ5, p5v2Adapter } from './adapters/shared-adapter.js';
import { parseOptions } from './core/options.js';
import { libraryState } from './core/state.js';
import { logError, logWarn, logInfo, logDebug } from './util/logging.js';
import { initializeP5Variant } from '../shared/util/initialization.js';

// IIFE wrapper for the entire TokoWrapper library
(function () {
  'use strict';

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

    /**
     * Returns the renderer value for use with createCanvas().
     * Resolves internal render mode string to the p5/Q5 renderer constant when available,
     * so createCanvas(w, h, tokoWrapper.renderMode) works with p5.js and extensions (e.g. p5.svg).
     * @returns {Object|string} p5 renderer constant (P2D, WEBGL, SVG) or internal string if not yet available
     */
    get renderMode () {
      const mode = libraryState.options.renderMode;
      if (typeof window !== 'undefined') {
        if (mode === RENDER_MODES.P2D && typeof window.P2D !== 'undefined') return window.P2D;
        if (mode === RENDER_MODES.WEBGL && typeof window.WEBGL !== 'undefined') return window.WEBGL;
        if (mode === RENDER_MODES.WEBGPU && typeof window.WEBGPU !== 'undefined') return window.WEBGPU;
        if (mode === RENDER_MODES.SVG && typeof window.SVG !== 'undefined') return window.SVG;
      }
      return mode;
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
