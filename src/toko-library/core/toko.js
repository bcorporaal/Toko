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

import { LIBRARY_NAME, VERSION, LIBRARY_UNKNOWN } from '../config/constants.js';
import { detectP5Variant } from './detector.js';
import { p5v2Adapter, initializeP5v1, initializeQ5 } from '../adapters/shared-adapter.js';
import { libraryState } from './state.js';
import { ContextManager } from './context.js';
import * as libraryFunctions from '../functions/index.js';
import * as libraryClasses from '../classes/index.js';
import { logWarn } from '../functions/utils/logging.js';
import { getGlobalObject } from '../../shared/util/global.js';
import { initializeP5Variant } from '../../shared/util/initialization.js';

export class Toko {
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
}
