/**
 * Logging level constants and utilities
 *
 * Provides standard logging levels with numeric hierarchy for comparison.
 * Levels are ordered from most critical (error) to least critical (debug).
 */

// Log level constants with numeric values for comparison
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

// Numeric hierarchy for level comparison (higher number = more verbose)
export const LOG_LEVEL_VALUES = {
  [LOG_LEVELS.ERROR]: 0,
  [LOG_LEVELS.WARN]: 1,
  [LOG_LEVELS.INFO]: 2,
  [LOG_LEVELS.DEBUG]: 3,
};

/**
 * Check if a log level should be output based on current configuration
 * @param {string} level - The log level to check
 * @param {boolean} loggingEnabled - Master logging switch
 * @param {string} currentLogLevel - Current minimum log level setting
 * @returns {boolean} True if the level should be logged
 */
export function shouldLog (level, loggingEnabled, currentLogLevel) {
  if (!loggingEnabled) {
    return false;
  }

  const levelValue = LOG_LEVEL_VALUES[level];
  const currentValue = LOG_LEVEL_VALUES[currentLogLevel];

  return levelValue !== undefined && currentValue !== undefined && levelValue <= currentValue;
}
