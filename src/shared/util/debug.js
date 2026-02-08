/**
 * Debug logging helper - only used to gate console.log when debug flag is set.
 * @param {Object} state - Library state with options.loggingEnabled and options.logLevel
 * @returns {boolean} True when debug logging is enabled
 */
export function isDebugLogEnabled (state) {
  return !!(state?.options?.loggingEnabled && state?.options?.logLevel === 'debug');
}
