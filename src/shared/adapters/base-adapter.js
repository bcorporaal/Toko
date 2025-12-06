/**
 * Base adapter class that provides common functionality for all p5.js variants
 * This eliminates code duplication between toko-library and toko-wrapper
 */

import { detectP5Variant } from '../detector.js';
import { LIBRARY_P5V1, LIBRARY_P5V2, LIBRARY_Q5 } from '../constants/common.js';
import { logWarn, logDebug } from '../util/logging.js';

/**
 * Base adapter class with common functionality
 */
export class BaseAdapter {
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
