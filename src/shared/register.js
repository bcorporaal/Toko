/**
 * Shared registration functions for library functions and classes
 * This eliminates duplication between toko-library and toko-wrapper
 */

import { getGlobalObject } from './util/global.js';

let prototypeFunctionsRegistered = false;
let prototypeClassesRegistered = false;

/**
 * Register library functions on the p5.js prototype
 * @param {Object} libraryFunctions - Object containing functions to register
 * @param {Object} libraryState - State object containing x5 prototype reference
 * @returns {void}
 * @example
 * registerLibraryFunctions({ myFunction: () => {} }, libraryState);
 */
export function registerLibraryFunctions (libraryFunctions, libraryState) {
  if (!libraryFunctions) {
    console.error('Toko: registerLibraryFunctions called with null or undefined libraryFunctions.');
    return;
  }

  const x5 = libraryState?.x5;

  if (!libraryState || !x5) {
    console.error('Toko: libraryState.x5 is undefined or null.');
    return;
  }

  // Prevent multiple registrations on prototype
  if (prototypeFunctionsRegistered) {
    return;
  }

  // Register functions on prototype
  Object.entries(libraryFunctions).forEach(([name, value]) => {
    if (typeof value === 'function' || typeof value === 'string') {
      if (!Object.prototype.hasOwnProperty.call(x5, name)) {
        x5[name] = value;
      }
    }
  });

  // Register constants on global object (only constants, not functions)
  const globalObj = getGlobalObject();
  Object.entries(libraryFunctions).forEach(([name, value]) => {
    if (typeof value === 'string') {
      if (!Object.prototype.hasOwnProperty.call(globalObj, name)) {
        globalObj[name] = value;
      }
    }
  });

  prototypeFunctionsRegistered = true;
}

/**
 * Register library classes on the p5.js prototype
 * @param {Object} libraryClasses - Object containing classes to register
 * @param {Object} libraryState - State object containing x5 prototype reference
 * @returns {void}
 * @example
 * registerLibraryClasses({ Grid: GridClass }, libraryState);
 */
export function registerLibraryClasses (libraryClasses, libraryState) {
  if (!libraryClasses) {
    console.error('Toko: registerLibraryClasses called with null or undefined libraryClasses.');
    return;
  }

  const x5 = libraryState?.x5;

  if (!libraryState || !x5) {
    console.error('Toko: libraryState.x5 is undefined or null.');
    return;
  }

  // Prevent multiple registrations on prototype
  if (prototypeClassesRegistered) {
    return;
  }

  // Register classes on prototype for this.Grid access in sketches
  Object.entries(libraryClasses).forEach(([name, ClassConstructor]) => {
    if (!Object.prototype.hasOwnProperty.call(x5, name)) {
      x5[name] = ClassConstructor;
    }
  });

  prototypeClassesRegistered = true;
}

/**
 * Reset registration flags (useful for testing)
 * @returns {void}
 * @example
 * resetRegistrationFlags();
 */
export function resetRegistrationFlags () {
  prototypeFunctionsRegistered = false;
  prototypeClassesRegistered = false;
}
