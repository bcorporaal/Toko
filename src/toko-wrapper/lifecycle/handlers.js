import { LIBRARY_NAME, RENDER_MODES, VERSION } from '../config/constants.js';
import { LIBRARY_P5V1, LIBRARY_P5V2, LIBRARY_Q5 } from '../../shared/constants/common.js';
import { libraryState } from '../core/state.js';
import { setUpWrapper } from '../core/setup.js';
import { isDebugLogEnabled } from '../../shared/util/debug.js';
import { recenterCanvas, tearDownCanvas } from '../canvas/canvas.js';
import { removePaneToggle } from '../ui/tweakpane.js';
import { removeFPSToggle } from '../ui/fps.js';
import { tearDownReceiveFile } from '../media/receiveFile.js';

/**
 * Initialize hook for wrapper - called when p5.js/Q5.js initializes
 * Note: Not used since it is not available for p5.js v2
 */
export function initHook () {
  //
  //  not used since it is not available for p5 v2
  //
}

/**
 * Pre-setup hook for wrapper - called before p5.js setup() function
 * Initializes the wrapper state and logs version information
 */
export function preSetupHook () {
  const renderMode = libraryState.options?.renderMode ?? 'unknown';
  console.log(`${LIBRARY_NAME} v${VERSION} (${libraryState.variant} - ${renderMode})`);
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - preSetupHook');
  libraryState.initialized = true;
}

/**
 * Post-setup hook for wrapper - called after p5.js setup() function
 * Sets up all wrapper components including canvas, Tweakpane, and capture tools
 */
export function postSetupHook () {
  // window.createCanvasNow(); // = createCanvasNow;
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - postSetupHook');
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
export function preDrawHook () {
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - preDrawHook');
  //
  //  shift the canvas for webgl if enabled
  //
  if (libraryState.options?.shiftCanvasForWebGL) {
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
export function postDrawHook () {
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - postDrawHook');
}

/**
 * Pre-refresh hook for wrapper - called before refresh operations
 * Currently logs debug information
 */
export function preRefreshHook () {
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - preRefreshHook');
}

/**
 * Post-refresh hook for wrapper - called after refresh operations
 * Currently logs debug information
 */
export function postRefreshHook () {
  if (isDebugLogEnabled(libraryState)) console.log('tokoWrapper - postRefreshHook');
}

/**
 * Remove hook for wrapper - called when the sketch is removed or destroyed
 * Performs cleanup tasks and resets wrapper state
 */
export function removeHook () {
  if (isDebugLogEnabled(libraryState)) console.log(`${LIBRARY_NAME} - Cleanup on sketch removal`);
  tearDownCanvas();
  removePaneToggle();
  removeFPSToggle();
  tearDownReceiveFile();
  libraryState.initialized = false;
}
