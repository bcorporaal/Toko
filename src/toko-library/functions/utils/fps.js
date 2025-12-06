import { libraryState } from '../../core/state.js';
import { ContextManager } from '../../core/context.js';

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
export function createFPS ({
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
export function updateFPS (fps = null) {
  if (!fps) fps = libraryState.fps;
  if (!fps) return;

  // Check if delay has passed and show the element (only if not manually controlled)
  if (!fps.isVisible && !fps._manuallyControlled) {
    const elapsed = performance.now() - fps.startTime;
    if (elapsed >= fps.delay) {
      fps.element.style.visibility = 'visible';
      fps.isVisible = true;
    } else {
      // Still in delay period, don't update display
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
export function showFPS (fps = null) {
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
export function hideFPS (fps = null) {
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
export function toggleFPS (fps = null) {
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

export function isFPSVisible (fps = null) {
  if (!fps) fps = libraryState.fps;
  if (!fps) return false;
  return fps.isVisible;
}
