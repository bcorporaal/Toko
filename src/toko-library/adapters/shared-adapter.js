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
export function initializeP5v1 () {
  return adapter.initialize();
}

export const p5v2Adapter = function (p5, fn, lifecycles) {
  return adapter.initialize({ p5, fn, lifecycles });
};

export function initializeQ5 () {
  return adapter.initialize();
}
