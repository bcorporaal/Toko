/**
 * Shared logging utility for Toko
 *
 * Provides level-based logging functions that work across toko-library and toko-wrapper.
 * Supports standard log levels: error, warn, info, debug with configurable filtering.
 */

import { LOG_LEVELS, shouldLog } from '../constants/logging.js';

/**
 * Get the current library state for logging configuration
 * This function will be overridden by each library to provide their specific state
 * @returns {Object} Library state with options.loggingEnabled and options.logLevel
 */
let getLibraryState = () => ({ options: { loggingEnabled: true, logLevel: LOG_LEVELS.INFO } });

/**
 * Set the library state getter function
 * @param {Function} stateGetter - Function that returns the current library state
 * @returns {void}
 * @example
 * setLibraryStateGetter(() => libraryState);
 */
export function setLibraryStateGetter (stateGetter) {
  getLibraryState = stateGetter;
}

/**
 * Log an error message
 * @param {string} message - The error message to log
 * @returns {void}
 * @example
 * logError('Failed to initialize canvas');
 */
export function logError (message) {
  const state = getLibraryState();
  const loggingEnabled = state?.options?.loggingEnabled ?? true;
  const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
  if (shouldLog(LOG_LEVELS.ERROR, loggingEnabled, logLevel)) {
    console.error(message);
  }
}

/**
 * Log a warning message
 * @param {string} message - The warning message to log
 * @returns {void}
 * @example
 * logWarn('Canvas size exceeds recommended limits');
 */
export function logWarn (message) {
  const state = getLibraryState();
  const loggingEnabled = state?.options?.loggingEnabled ?? true;
  const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
  if (shouldLog(LOG_LEVELS.WARN, loggingEnabled, logLevel)) {
    console.warn(message);
  }
}

/**
 * Log an info message
 * @param {string} message - The info message to log
 * @returns {void}
 * @example
 * logInfo('Library initialized successfully');
 */
export function logInfo (message) {
  const state = getLibraryState();
  const loggingEnabled = state?.options?.loggingEnabled ?? true;
  const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
  if (shouldLog(LOG_LEVELS.INFO, loggingEnabled, logLevel)) {
    console.log(message);
  }
}

/**
 * Log a debug message
 * @param {string} message - The debug message to log
 * @returns {void}
 * @example
 * logDebug('Processing frame 42');
 */
export function logDebug (message) {
  const state = getLibraryState();
  const loggingEnabled = state?.options?.loggingEnabled ?? true;
  const logLevel = state?.options?.logLevel ?? LOG_LEVELS.INFO;
  if (shouldLog(LOG_LEVELS.DEBUG, loggingEnabled, logLevel)) {
    console.log(message);
  }
}

/**
 * Log a message with default info level (backward compatibility)
 * @param {string} message - The message to log
 * @returns {void}
 * @example
 * log('Processing complete');
 */
export function log (message) {
  logInfo(message);
}

// Export log levels for external use
export { LOG_LEVELS };
