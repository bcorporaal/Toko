import { LIBRARY_NAME, VERSION } from '../../config/constants.js';
import { detectP5Variant } from '../../core/detector.js';

/**
 * Get information about the current Toko library instance
 * @returns {Object} Library information object with name, version, and detected p5.js variant
 * @example
 * // Get library information
 * const info = toko.getInfo();
 * console.log(`Using ${info.name} v${info.version} with ${info.variant}`);
 */
export function getInfo () {
  return {
    name: LIBRARY_NAME,
    version: VERSION,
    variant: detectP5Variant(),
  };
}
