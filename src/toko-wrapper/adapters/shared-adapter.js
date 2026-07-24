/**
 * Toko Wrapper adapter using the shared base adapter system
 * This eliminates code duplication while maintaining wrapper-specific functionality
 */

import { BaseAdapter } from '../../shared/adapters/base-adapter.js';
import { libraryState } from '../core/state.js';
import { initHook, preSetupHook, postSetupHook, preDrawHook, postDrawHook, removeHook } from '../lifecycle/handlers.js';
import { isDebugLogEnabled } from '../../shared/util/debug.js';

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
export function initializeP5v1 () {
  return adapter.initialize();
}

export const p5v2Adapter = function (p5, fn, lifecycles) {
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - shared-adapter - p5v2Adapter', libraryState);
  return adapter.initialize({ p5, fn, lifecycles });
};

export function initializeQ5 () {
  return adapter.initialize();
}
