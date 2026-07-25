/**
 * Toko Library adapter using the shared base adapter system
 * This eliminates code duplication while maintaining library-specific functionality
 */

import { BaseAdapter } from '../../shared/adapters/base-adapter.js';
import { registerLibraryFunctions, registerLibraryClasses } from '../../shared/register.js';
import * as libraryFunctions from '../functions/index.js';
import * as libraryClasses from '../classes/index.js';
import { libraryState } from '../core/state.js';
import { initHook, preSetupHook, postSetupHook, preDrawHook, postDrawHook, removeHook } from '../lifecycle/handlers.js';

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
/**
 * Initialize Toko for p5.js v1
 * Registers library functions and lifecycle hooks on the p5.js v1 prototype
 * @returns {boolean} True if initialization was successful
 * @example
 * // Automatically called by Toko during initialization
 * // No direct usage needed in user code
 */
export function initializeP5v1() {
  return adapter.initialize();
}

/**
 * Adapter function for p5.js v2
 * Creates an adapter function that can be called with p5, fn, and lifecycles parameters
 * @param {Object} p5 - p5 instance for v2
 * @param {Object} fn - p5 function for v2
 * @param {Object} lifecycles - lifecycles object for v2
 * @returns {boolean} True if initialization was successful
 * @example
 * // Automatically called by Toko during initialization
 * // No direct usage needed in user code
 */
export const p5v2Adapter = function (p5, fn, lifecycles) {
  return adapter.initialize({ p5, fn, lifecycles });
};

/**
 * Initialize Toko for Q5
 * Registers library functions and lifecycle hooks on the Q5 prototype
 * @returns {boolean} True if initialization was successful
 * @example
 * // Automatically called by Toko during initialization
 * // No direct usage needed in user code
 */
export function initializeQ5() {
  return adapter.initialize();
}
