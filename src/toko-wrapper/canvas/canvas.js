/**
 * Canvas management for TokoWrapper
 *
 * Handles canvas setup, sizing, and resize events for the sketch canvas.
 * Manages canvas dimensions, pixel density, and responsive behavior.
 *
 * @namespace Canvas
 */

import { libraryState } from '../core/state';
import { LIBRARY_Q5 } from '../../shared/constants/common.js';
import {
  TWEAKPANE_CONTAINER_ID,
  SKETCH_WRAPPER_CLASS,
  SKETCH_CANVAS_ID,
  LABELS_CLASS,
  FULLWINDOW_CLASS,
} from '../../shared/constants/wrapper';

let resizeListenerAttached = false;

/**
 * Set up the canvas with initial configuration
 * Sets canvas size, document title, and window resize listener
 */
export function setUpCanvas () {
  //
  //  set the canvas base on provided options
  //
  setCanvasSize(libraryState.options.canvasSize);
  //
  // set the label and document title
  //
  let sketchTitle = libraryState.options.title;
  if (libraryState.options.addInfoToTitle) {
    sketchTitle += ' - ' + libraryState.variant + ' - ' + libraryState.options.renderMode;
  }

  const sketchTitleElement = document.getElementById('sketch-title');
  if (sketchTitleElement) {
    sketchTitleElement.innerText = sketchTitle;
  }
  document.title = sketchTitle;
  //
  //  listen to resizes
  //
  if (!resizeListenerAttached) {
    window.addEventListener('resize', windowResized);
    resizeListenerAttached = true;
  }
}

export function tearDownCanvas () {
  if (resizeListenerAttached) {
    window.removeEventListener('resize', windowResized);
    resizeListenerAttached = false;
  }
}

/**
 * Set the canvas size based on the provided size configuration
 * Handles both fixed and full-window sizing with proper scaling
 * @param {Object} inSize - Size configuration object with width, height, and other properties
 */
export function setCanvasSize (inSize) {
  if (!inSize) {
    console.error('TokoWrapper: setCanvasSize called with null or undefined size configuration');
    return;
  }

  const pixelDensity = Number(inSize.pixelDensity);
  if (!Number.isFinite(pixelDensity) || pixelDensity <= 0) {
    console.error('TokoWrapper: setCanvasSize called with invalid pixelDensity');
    return;
  }
  if (!Number.isFinite(inSize.width) || !Number.isFinite(inSize.height) || inSize.width <= 0 || inSize.height <= 0) {
    console.error('TokoWrapper: setCanvasSize called with invalid width/height');
    return;
  }

  const MARGIN = 80;
  const DISPLAY_FACTOR = pixelDensity / 2;
  let zoomFactor = 1;
  let newWidthString = '',
    newHeightString = '';

  if (typeof window.innerWidth === 'undefined' || typeof window.innerHeight === 'undefined') {
    console.error('window.innerWidth or window.innerHeight is not defined');
    return;
  }
  if (window.innerWidth <= 0 || window.innerHeight <= 0) {
    console.error('window.innerWidth or window.innerHeight is invalid');
    return;
  }

  // Get references to layout elements for fullwindow class toggling
  const sketchWrapper = document.querySelector('.' + SKETCH_WRAPPER_CLASS);
  const tweakpaneContainer = document.getElementById(TWEAKPANE_CONTAINER_ID);
  const sketchCanvas = document.getElementById(SKETCH_CANVAS_ID);
  const labels = document.querySelector('.' + LABELS_CLASS);

  if (!inSize.fullWindow) {
    // Constrain sketch container so canvas and any wrapper (e.g. Q5) scale with the viewport.
    if (sketchCanvas) {
      sketchCanvas.style.maxWidth = '100%';
      sketchCanvas.style.overflow = 'hidden';
    }
    zoomFactor = Math.min(1, ((window.innerWidth - MARGIN) / inSize.width) * DISPLAY_FACTOR);
    zoomFactor = Math.min(zoomFactor, ((window.innerHeight - MARGIN) / inSize.height) * DISPLAY_FACTOR);

    newWidthString = Math.floor((inSize.width * zoomFactor) / DISPLAY_FACTOR) + 'px';
    newHeightString = Math.floor((inSize.height * zoomFactor) / DISPLAY_FACTOR) + 'px';

    // Remove fullwindow classes for fixed canvas mode
    sketchWrapper?.classList.remove(FULLWINDOW_CLASS);
    tweakpaneContainer?.classList.remove(FULLWINDOW_CLASS);
    sketchCanvas?.classList.remove(FULLWINDOW_CLASS);
    labels?.classList.remove(FULLWINDOW_CLASS);
  } else {
    inSize.width = window.innerWidth;
    inSize.height = window.innerHeight;

    newWidthString = '100vw';
    newHeightString = '100vh';

    if (sketchCanvas) {
      sketchCanvas.style.maxWidth = '';
      sketchCanvas.style.overflow = '';
    }

    // Add fullwindow classes for full-screen canvas mode
    sketchWrapper?.classList.add(FULLWINDOW_CLASS);
    tweakpaneContainer?.classList.add(FULLWINDOW_CLASS);
    sketchCanvas?.classList.add(FULLWINDOW_CLASS);
    labels?.classList.add(FULLWINDOW_CLASS);
  }

  const resizeFn = libraryState.p5Canvas?.resizeCanvas ?? (typeof window !== 'undefined' ? window.resizeCanvas : null);
  if (typeof resizeFn === 'function') {
    resizeFn.call(libraryState.p5Canvas ?? window, inSize.width * DISPLAY_FACTOR, inSize.height * DISPLAY_FACTOR, true);
  } else {
    console.error('TokoWrapper: resizeCanvas is not available');
    return;
  }

  if (libraryState.p5Canvas && libraryState.p5Canvas.canvas) {
    const canvasEl = libraryState.p5Canvas.canvas;
    canvasEl.style.width = newWidthString;
    canvasEl.style.height = newHeightString;

    // Ensure canvas scales down in small windows and keeps aspect ratio when constrained.
    // Use max-width + aspect-ratio + height:auto so when the container narrows, the canvas
    // shrinks proportionally (not just in width). Q5 may wrap the canvas in a div that
    // doesn't constrain; we constrain the wrapper so layout is consistent across variants.
    if (!inSize.fullWindow) {
      canvasEl.style.aspectRatio = String(inSize.width) + ' / ' + String(inSize.height);
      canvasEl.style.maxWidth = '100%';
      canvasEl.style.height = 'auto';
      canvasEl.style.boxSizing = 'border-box';

      // If the canvas has a wrapper (e.g. Q5 appends to a div inside the sketch container),
      // constrain that wrapper so the canvas scales with the container.
      if (libraryState.variant === LIBRARY_Q5 && sketchCanvas) {
        const canvasParent = canvasEl.parentElement;
        if (canvasParent && canvasParent !== sketchCanvas && sketchCanvas.contains(canvasParent)) {
          canvasParent.style.maxWidth = '100%';
          canvasParent.style.boxSizing = 'border-box';
          canvasParent.style.overflow = 'hidden';
        }
      }
    } else {
      canvasEl.style.aspectRatio = '';
      canvasEl.style.maxWidth = '';
      canvasEl.style.height = '';
      canvasEl.style.boxSizing = '';
    }
  }
}

/**
 * Handle window resize events
 * Recalculates proportional canvas display size so the canvas keeps the same aspect ratio
 * when the window is resized (works for all variants including Q5).
 */
export function windowResized () {
  if (!libraryState.p5Canvas) return;

  const sketchElementId = libraryState.options?.sketchElementId;
  if (!sketchElementId) return;

  const sketchElement = document.getElementById(sketchElementId);
  if (!sketchElement) return;

  const newWidth = sketchElement.offsetWidth;
  const newHeight = sketchElement.offsetHeight;

  const hasGlobalSize = typeof width === 'number' && typeof height === 'number';
  const currentWidth = hasGlobalSize ? width : (libraryState.p5Canvas?.width ?? null);
  const currentHeight = hasGlobalSize ? height : (libraryState.p5Canvas?.height ?? null);
  if (currentWidth === null || currentHeight === null) return;

  if (newWidth !== currentWidth || newHeight !== currentHeight) {
    // Re-run setCanvasSize so zoomFactor and display dimensions are recalculated
    // for the new window size, keeping the canvas proportional.
    setCanvasSize(libraryState.options.canvasSize);
    canvasResized();
  }
}

/**
 * Handle canvas resize events
 * Called when the canvas dimensions need to be updated
 * @todo Determine how to best call the appropriate resize function
 */
export function canvasResized () {
  // TO DO - determine how to best call the right function
  console.log('TokoWrapper - canvasResized');
}

/**
 * Recenter the canvas origin to the top left corner.
 * Used because WebGL and WebGPU have a different origin than P2D and SVG.
 * Called in the preDrawHook in the wrapper.
 *
 * @example
 * // Recenter the canvas
 * recenterCanvas();
 */
export function recenterCanvas () {
  const hasGlobalSize = typeof width === 'number' && typeof height === 'number';
  const currentWidth = hasGlobalSize ? width : (libraryState.p5Canvas?.width ?? null);
  const currentHeight = hasGlobalSize ? height : (libraryState.p5Canvas?.height ?? null);
  const translateFn = hasGlobalSize && typeof translate === 'function'
    ? translate
    : (libraryState.p5Canvas?.translate ?? null);

  if (currentWidth === null || currentHeight === null || typeof translateFn !== 'function') {
    console.error('TokoWrapper: recenterCanvas requires a valid drawing context');
    return;
  }

  if (hasGlobalSize && typeof translate === 'function') {
    translate(-currentWidth / 2, -currentHeight / 2);
  } else {
    libraryState.p5Canvas.translate(-currentWidth / 2, -currentHeight / 2);
  }
}
