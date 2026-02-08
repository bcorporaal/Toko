import { LIBRARY_NAME, BLEND_MODE } from './config/constants.js';
import {
  EASE_LINEAR,
  EASE_SMOOTH,
  EASE_QUAD,
  EASE_CUBIC,
  EASE_QUART,
  EASE_QUINT,
  EASE_EXPO,
  EASE_CIRC,
  EASE_ELASTIC,
  EASE_BOUNCE,
  EASE_BACK,
  EASE_IN,
  EASE_OUT,
  EASE_IN_OUT,
  LIBRARY,
} from '../shared/constants/common.js';
import { Toko } from './core/toko.js';

// IIFE wrapper for the entire library
(function (global) {
  'use strict';

  // Create the main Toko instance
  const tokoInstance = new Toko();
  let initializationAttempted = false;
  let domReadyHandler = null;

  function autoInit () {
    // Prevent multiple initialization attempts
    if (initializationAttempted) {
      return;
    }
    if (domReadyHandler && typeof document !== 'undefined') {
      document.removeEventListener('DOMContentLoaded', domReadyHandler);
      domReadyHandler = null;
    }

    // Check for both global and window-attached variables
    if (
      typeof p5 !== 'undefined' ||
      typeof Q5 !== 'undefined' ||
      (typeof window !== 'undefined' && (typeof window.p5 !== 'undefined' || typeof window.Q5 !== 'undefined'))
    ) {
      initializationAttempted = true;

      tokoInstance.initializeLibrary();
    } else {
      setTimeout(autoInit, 100);
    }
  }

  // Expose both the class and instance to global scope
  global[LIBRARY_NAME] = tokoInstance; // Main instance
  global.TokoClass = Toko; // Class constructor for creating new instances

  // Also expose as lowercase for convenience
  global.toko = tokoInstance;

  global.toko.BLEND_MODE = BLEND_MODE;

  // Expose easing constants
  global.toko.EASE_LINEAR = EASE_LINEAR;
  global.toko.EASE_SMOOTH = EASE_SMOOTH;
  global.toko.EASE_QUAD = EASE_QUAD;
  global.toko.EASE_CUBIC = EASE_CUBIC;
  global.toko.EASE_QUART = EASE_QUART;
  global.toko.EASE_QUINT = EASE_QUINT;
  global.toko.EASE_EXPO = EASE_EXPO;
  global.toko.EASE_CIRC = EASE_CIRC;
  global.toko.EASE_ELASTIC = EASE_ELASTIC;
  global.toko.EASE_BOUNCE = EASE_BOUNCE;
  global.toko.EASE_BACK = EASE_BACK;
  global.toko.EASE_IN = EASE_IN;
  global.toko.EASE_OUT = EASE_OUT;
  global.toko.EASE_IN_OUT = EASE_IN_OUT;
  global.toko.LIBRARY = LIBRARY;

  // Auto-initialize
  if (typeof document !== 'undefined') {
    // For Q5, initialize immediately to catch lifecycle hooks
    if (typeof Q5 !== 'undefined' || (typeof window !== 'undefined' && typeof window.Q5 !== 'undefined')) {
      autoInit();
    } else if (document.readyState === 'loading') {
      if (!domReadyHandler) {
        domReadyHandler = () => {
          document.removeEventListener('DOMContentLoaded', domReadyHandler);
          domReadyHandler = null;
          autoInit();
        };
      }
      document.addEventListener('DOMContentLoaded', domReadyHandler);
    } else {
      autoInit();
    }
  } else {
    autoInit();
  }
})(typeof window !== 'undefined' ? window : global);
