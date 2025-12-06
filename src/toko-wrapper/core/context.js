// core/context.js - Centralized context management
export class ContextManager {
  static getCurrentContext () {
    // Try to get the current p5/Q5 instance
    // p5.js instance mode
    if (typeof p5 !== 'undefined' && p5.instance) {
      return p5.instance;
    }

    // Q5.js
    if (typeof Q5 !== 'undefined' && Q5.instance) {
      return Q5.instance;
    }

    // Global mode - functions should be available globally
    const globalObj = typeof window !== 'undefined' ? window : global;

    // Check if p5/Q5 functions are available globally
    if (globalObj.sin && globalObj.millis) {
      return globalObj;
    }

    // Last resort - return global object (some functions might not work)
    return globalObj;
  }

  static createBoundFunction (fn) {
    return function (...args) {
      const context = ContextManager.getCurrentContext();
      return fn.call(context, ...args);
    };
  }

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
