/**
 * General options parsing and management for TokoWrapper
 *
 * Handles parsing and merging of user-provided options with default values.
 * This is core functionality that other parts of the system depend on.
 *
 * @namespace Options
 */

import { DEFAULT_OPTIONS, LIBRARY_Q5 } from '../config/constants';
import { DEFAULT_CAPTURE_OPTIONS } from '../../shared/constants/defaults.js';
import { RENDER_MODES } from '../../shared/constants/wrapper.js';
import { libraryState } from './state.js';
import { parseAdditionalCanvasSizes } from '../canvas/sizes.js';
import { resetCapture } from '../media/capture.js';
import { getFilenameForCapture } from '../media/capture.js';

/**
 * Parse and merge user options with default options
 * @param {Object} options - User-provided options to merge with defaults
 */
export function parseOptions (options) {
  // Guard against null/undefined options
  if (options == null) {
    options = {};
  }

  if (libraryState.options != null) {
    libraryState.options = { ...libraryState.options, ...options };
  } else {
    libraryState.options = { ...DEFAULT_OPTIONS, ...options };
  }

  // Parse url parameters
  libraryState.options = parseUrlParameters(libraryState.options);

  libraryState.options.captureOptions = { ...DEFAULT_CAPTURE_OPTIONS, ...libraryState.options.captureOptions };
  libraryState.options.captureOptions.previousDuration = libraryState.options.captureOptions.duration;
  libraryState.options.captureOptions.beforeDownload = function (blob, context, next) {
    resetCapture(context.filename); // used to ensure the reset always happens
    next();
  };

  libraryState.options.captureOptions.baseFilename = function (date) {
    return getFilenameForCapture(date);
  };

  // Handle canvas-specific options if they exist
  if (options && options.additionalCanvasSizes != undefined && options.additionalCanvasSizes.length != 0) {
    parseAdditionalCanvasSizes(options);
  }
}

/**
 * Parse URL parameters to override render mode
 *
 * Allows for overriding the render mode via URL parameters:
 * - r: render mode (p2d, svg, webgl)
 *
 * @param {Object} options - Options object
 * @returns {Object} Options object with updated render mode
 * @example
 * // URL: ?r=svg
 * // Will set options.renderMode to 'SVG'
 * @note SVG render mode is automatically converted to P2D when using Q5 variant
 */
function parseUrlParameters (options) {
  if (typeof document === 'undefined' || !document.location) {
    return options;
  }
  const params = new URLSearchParams(document.location.search);
  const renderModeParam = params.get('r');

  if (renderModeParam && renderModeParam.trim() !== '') {
    const normalizedParam = renderModeParam.toLowerCase().trim();
    let renderMode;

    switch (normalizedParam) {
      case 'p2d':
        renderMode = RENDER_MODES.P2D;
        break;
      case 'svg':
        renderMode = RENDER_MODES.SVG;
        if (libraryState.toko?.variant === LIBRARY_Q5) {
          renderMode = RENDER_MODES.P2D;
          console.log('SVG is not supported in Q5, using default: P2D');
        }
        break;
      case 'webgl':
        if (libraryState.toko?.variant === LIBRARY_Q5) {
          renderMode = RENDER_MODES.WEBGPU;
          Q5.WebGPU();
        } else {
          renderMode = RENDER_MODES.WEBGL;
        }
        break;
      case 'webgpu':
        if (libraryState.toko?.variant === LIBRARY_Q5) {
          renderMode = RENDER_MODES.WEBGPU;
          Q5.WebGPU();
        } else {
          renderMode = RENDER_MODES.WEBGL;
        }
        break;
      default:
        console.log(`Invalid render mode: ${normalizedParam}, using default: P2D`);
        renderMode = RENDER_MODES.P2D;
        break;
    }

    options.renderMode = renderMode;
  }

  return options;
}
