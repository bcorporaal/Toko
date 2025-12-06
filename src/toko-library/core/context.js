/**
 * Centralized context management for p5.js/Q5.js integration
 * Handles context detection and function binding across different p5.js variants
 */

import { getGlobalObject } from '../../shared/util/global.js';

export class ContextManager {
  static _cachedContext = null;
  static _contextInitialized = false;

  /**
   * Initialize and cache the p5.js/Q5.js context
   * Should be called once during library initialization
   */
  static initializeContext () {
    if (this._contextInitialized) {
      return this._cachedContext;
    }

    // Try to get the current p5/Q5 instance
    // p5.js instance mode
    if (typeof p5 !== 'undefined' && p5.instance) {
      this._cachedContext = p5.instance;
    }
    // Q5.js
    else if (typeof Q5 !== 'undefined' && Q5.instance) {
      this._cachedContext = Q5.instance;
    }
    // Global mode - functions should be available globally
    else {
      const globalObj = getGlobalObject();

      // Check if p5/Q5 functions are available globally
      if (globalObj.sin && globalObj.millis) {
        this._cachedContext = globalObj;
      } else {
        // Last resort - return global object (some functions might not work)
        this._cachedContext = globalObj;
      }
    }

    this._contextInitialized = true;
    return this._cachedContext;
  }

  /**
   * Get the cached p5.js/Q5.js context for function binding
   * @returns {Object} The cached p5.js/Q5.js instance or global object
   */
  static getCurrentContext () {
    if (!this._contextInitialized) {
      return this.initializeContext();
    }
    return this._cachedContext;
  }

  /**
   * Create a bound function that uses the current p5.js/Q5.js context
   * @param {Function} fn - Function to bind to the current context
   * @returns {Function} Bound function that will execute with the correct context
   */
  static createBoundFunction (fn) {
    return function (...args) {
      const context = ContextManager.getCurrentContext();
      return fn.call(context, ...args);
    };
  }

  /**
   * Bind all functions in an object to the current p5.js/Q5.js context
   * @param {Object} functionsObj - Object containing functions to bind
   * @returns {Object} Object with all functions bound to the current context
   */
  static bindAllFunctions (functionsObj) {
    const boundFunctions = {};

    Object.entries(functionsObj).forEach(([name, value]) => {
      if (typeof value === 'function') {
        boundFunctions[name] = ContextManager.createBoundFunction(value);
      } else {
        // For constants, just copy them
        boundFunctions[name] = value;
      }
    });

    return boundFunctions;
  }
}
