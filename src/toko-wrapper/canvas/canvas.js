/**
 * Canvas management for TokoWrapper
 *
 * Handles canvas setup, sizing, and resize events for the sketch canvas.
 * Manages canvas dimensions, pixel density, and responsive behavior.
 *
 * @namespace Canvas
 */

import { libraryState } from '../core/state';
import { logError, logInfo } from '../util/logging';

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

  document.getElementById('sketch-title').innerText = sketchTitle;
  document.title = sketchTitle;
  //
  //  listen to resizes
  //
  window.addEventListener('resize', windowResized);
}

/**
 * Set the canvas size based on the provided size configuration
 * Handles both fixed and full-window sizing with proper scaling
 * @param {Object} inSize - Size configuration object with width, height, and other properties
 */
export function setCanvasSize (inSize) {
  const MARGIN = 80;
  const DISPLAY_FACTOR = inSize.pixelDensity / 2;
  let zoomFactor = 1;
  let newWidthString = '',
    newHeightString = '';

  if (typeof window.innerWidth === 'undefined' || typeof window.innerHeight === 'undefined') {
    logError('window.innerWidth or window.innerHeight is not defined');
    return;
  }

  if (!inSize.fullWindow) {
    zoomFactor = Math.min(1, ((window.innerWidth - MARGIN) / inSize.width) * DISPLAY_FACTOR);
    zoomFactor = Math.min(zoomFactor, ((window.innerHeight - MARGIN) / inSize.height) * DISPLAY_FACTOR);

    newWidthString = Math.floor((inSize.width * zoomFactor) / DISPLAY_FACTOR) + 'px';
    newHeightString = Math.floor((inSize.height * zoomFactor) / DISPLAY_FACTOR) + 'px';
  } else {
    inSize.width = window.innerWidth;
    inSize.height = window.innerHeight;

    newWidthString = '100vw';
    newHeightString = '100vh';
  }

  resizeCanvas(inSize.width * DISPLAY_FACTOR, inSize.height * DISPLAY_FACTOR, true);

  libraryState.p5Canvas.canvas.style.width = newWidthString;
  libraryState.p5Canvas.canvas.style.height = newHeightString;
}

/**
 * Handle window resize events
 * Checks if the sketch element dimensions have changed and triggers canvas resize if needed
 */
export function windowResized () {
  let sketchElementId = libraryState.options.sketchElementId;

  let newWidth = document.getElementById(sketchElementId).offsetWidth;
  let newHeight = document.getElementById(sketchElementId).offsetHeight;

  if (newWidth != width || newHeight != height) {
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
  logInfo('TokoWrapper - canvasResized');
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
  translate(-width / 2, -height / 2);
}
