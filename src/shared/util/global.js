/**
 * Shared utility for consistent global object detection
 * Handles different JavaScript environments (browser, Node.js, etc.)
 */

/**
 * Get the global object in a cross-platform way
 * @returns {Object} The global object (window, global, or self)
 * @example
 * const globalObj = getGlobalObject();
 * globalObj.myVariable = 'value';
 */
export function getGlobalObject () {
  // Check for different global objects in order of preference
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  if (typeof self !== 'undefined') {
    return self;
  }

  // Last resort - return an empty object
  // This should rarely happen in practice
  return {};
}
