/**
 * Detect and return the Toko library instance
 * Checks multiple possible locations where the toko instance might be available
 * @returns {Object|null} Toko library instance if found, null otherwise
 * @example
 * // Detect toko instance
 * const tokoInstance = detectToko();
 * if (tokoInstance) {
 *   console.log('Toko library found:', tokoInstance.name);
 * }
 */
/* global toko */
export function detectToko () {
  // Check for toko instance in different possible locations
  if (typeof toko !== 'undefined') {
    return toko;
  }
  if (typeof window !== 'undefined' && typeof window.toko !== 'undefined') {
    return window.toko;
  }
  return null;
}
