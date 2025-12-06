/**
 * Canvas size management for TokoWrapper
 *
 * Handles canvas size configuration, additional size parsing,
 * and canvas size list management.
 *
 * @namespace CanvasSizes
 */

import { SIZES, SIZES_LIST } from '../config/constants';
import { libraryState } from '../core/state.js';

/**
 * Parse additional canvas sizes from options
 * @param {Object} options - Options object containing additionalCanvasSizes array
 */
export function parseAdditionalCanvasSizes (options) {
  let n = options.additionalCanvasSizes.length;
  let useCustomSize = false;
  let selectedCustomSize = null;
  if (n > 0) {
    for (let i = 0; i < n; i++) {
      addCanvasSize(options.additionalCanvasSizes[i]);
      if (options.additionalCanvasSizes[i].useThisSizeAsDefault) {
        useCustomSize = true;
        selectedCustomSize = options.additionalCanvasSizes[i];
      }
    }
  }
  libraryState.options.canvasSize = useCustomSize ? selectedCustomSize : libraryState.options.canvasSize;
}

/**
 * Add an additional canvas size to the available sizes list
 * Can only be called after Toko is set up
 * @param {Object} inSize - Size object with name and dimensions
 */
export function addCanvasSize (inSize) {
  SIZES.push(inSize);
  SIZES_LIST[inSize.name] = inSize.name;
}
