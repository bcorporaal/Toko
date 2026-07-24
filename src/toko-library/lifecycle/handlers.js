import { LIBRARY_NAME, VERSION } from '../config/constants.js';
import { libraryState } from '../core/state.js';
import { initColor } from '../functions/color/colorPalettes.js';
import { isDebugLogEnabled } from '../../shared/util/debug.js';
import { updateFPS } from '../functions/utils/fps.js';
import { ContextManager } from '../core/context.js';

/**
 * Initialize hook - called when p5.js/Q5.js initializes
 * Note: Not used since it is not available for p5.js v2
 */
export function initHook () {
  // not used since it is not available for p5 v2
}

/**
 * Pre-setup hook - called before p5.js setup() function
 * Initializes the library state and color system
 */
export function preSetupHook () {
  console.log(`${LIBRARY_NAME} v${VERSION} (${libraryState.variant})`);
  libraryState.initialized = true;
  initColor();
}

/**
 * Post-setup hook - called after p5.js setup() function
 * Currently unused but available for future initialization tasks
 */
export function postSetupHook () {}

/**
 * Pre-draw hook - called before each draw() cycle
 * Currently unused but available for per-frame setup tasks
 */
export function preDrawHook () {
  // not used yet
}

/**
 * Post-draw hook - called after each draw() cycle
 * Tracks when the first draw cycle has completed
 */
export function postDrawHook () {
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
export function removeHook () {
  if (isDebugLogEnabled(libraryState)) console.log(`${LIBRARY_NAME} - Cleanup on sketch removal`);
  libraryState.initialized = false;
}
