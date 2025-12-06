import {
  log as sharedLog,
  logError,
  logWarn,
  logInfo,
  logDebug,
  setLibraryStateGetter,
} from '../../shared/util/logging.js';
import { libraryState } from '../core/state.js';

// Set up the library state getter for the shared logging system
setLibraryStateGetter(() => libraryState);

// Export all logging functions for backward compatibility and new functionality
export { logError, logWarn, logInfo, logDebug };

// Backward compatible log function
export function log (message) {
  sharedLog(message);
}
