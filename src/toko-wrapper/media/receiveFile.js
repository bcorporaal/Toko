import { libraryState } from '../core/state';
import { LIBRARY_Q5 } from '../config/constants';
import { _presetToState } from '../ui/tweakpaneUtil';
import { updatePaletteSelector } from '../ui/colorControls';
import { logWarn } from '../util/logging';

/**
 * Set up file receiving functionality for drag and drop
 * @returns {void}
 * @example
 * // Set up file receiving
 * setUpReceiveFile();
 */
export function setUpReceiveFile () {
  if (libraryState.options.acceptDroppedSettings || libraryState.options.acceptDroppedFiles) {
    // Check if p5.js drop() method is available (not available in p5v2 SVG or Q5)
    if (libraryState.p5Canvas && typeof libraryState.p5Canvas.drop === 'function') {
      libraryState.p5Canvas.drop(dropFile.bind(this));
    } else {
      // Fallback to native drag and drop for p5v2 SVG, Q5, or other cases
      setUpNativeDrop();
    }
  }
}

let nativeDropElement = null;
let dragOverHandler = null;
let dragEnterHandler = null;
let dropHandler = null;

/**
 * Set up native drag and drop event listeners
 * Used as fallback when p5.js drop() method is not available (e.g., p5v2 SVG, Q5)
 */
function setUpNativeDrop () {
  if (!libraryState.p5Canvas) {
    logWarn('Cannot set up file drop: canvas not available');
    return;
  }

  // Try different ways to access the canvas element depending on p5.js variant and renderer
  let canvasElement = null;

  if (libraryState.variant === LIBRARY_Q5) {
    // For Q5, libraryState.p5Canvas is window.Q5, and the canvas is at Q5.canvas
    if (libraryState.p5Canvas.canvas) {
      canvasElement = libraryState.p5Canvas.canvas;
    }
  } else if (libraryState.p5Canvas.canvas) {
    // Standard canvas element (P2D, WEBGL)
    canvasElement = libraryState.p5Canvas.canvas;
  } else if (libraryState.p5Canvas.elt) {
    // Alternative property name
    canvasElement = libraryState.p5Canvas.elt;
  } else if (libraryState.p5Canvas instanceof HTMLElement) {
    // Canvas is the element itself
    canvasElement = libraryState.p5Canvas;
  }

  // If we still don't have a canvas element, try to get it from the sketch container
  // This is useful for SVG renderer where the structure might be different
  if (!canvasElement) {
    const sketchElement = document.getElementById(libraryState.options.sketchElementId);
    if (sketchElement && sketchElement.firstChild) {
      canvasElement = sketchElement.firstChild;
    }
  }

  if (!canvasElement) {
    logWarn('Cannot set up file drop: canvas element not found');
    return;
  }

  if (nativeDropElement) {
    tearDownReceiveFile();
  }
  nativeDropElement = canvasElement;

  // Prevent default drag behaviors
  dragOverHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  canvasElement.addEventListener('dragover', dragOverHandler);

  dragEnterHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  canvasElement.addEventListener('dragenter', dragEnterHandler);

  dropHandler = e => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processDroppedFile(file);
    }
  };
  canvasElement.addEventListener('drop', dropHandler);
}

export function tearDownReceiveFile () {
  if (!nativeDropElement) return;
  if (dragOverHandler) {
    nativeDropElement.removeEventListener('dragover', dragOverHandler);
  }
  if (dragEnterHandler) {
    nativeDropElement.removeEventListener('dragenter', dragEnterHandler);
  }
  if (dropHandler) {
    nativeDropElement.removeEventListener('drop', dropHandler);
  }
  nativeDropElement = null;
  dragOverHandler = null;
  dragEnterHandler = null;
  dropHandler = null;
}

/**
 * Process a dropped file using native File API
 * Converts the native File object to the format expected by dropFile()
 * @param {File} file - Native File object from drag and drop
 */
function processDroppedFile (file) {
  const reader = new FileReader();
  const fileExtension = file.name.split('.').pop().toLowerCase();

  reader.onload = function (e) {
    let fileData = e.target.result;
    let subtype = fileExtension;

    // Handle JSON files (settings)
    if (fileExtension === 'json') {
      try {
        fileData = JSON.parse(fileData);
      } catch (error) {
        logWarn('Failed to parse JSON file: ' + error.message);
        return;
      }
    }

    // Create file object in the format expected by dropFile()
    const p5FileObject = {
      file: file,
      type: file.type,
      subtype: subtype,
      name: file.name,
      size: file.size,
      data: fileData,
    };

    dropFile(p5FileObject);
  };

  reader.onerror = function () {
    logWarn('Failed to read dropped file');
  };

  // Read file as text for JSON, or as data URL for images
  if (fileExtension === 'json') {
    reader.readAsText(file);
  } else {
    reader.readAsDataURL(file);
  }
}

/**
 * Handle dropped files based on file type and options
 * @param {Object} file - Dropped file object
 * @returns {void}
 * @example
 * // Handle dropped file
 * dropFile(droppedFile);
 */
export function dropFile (file) {
  if (libraryState.options.acceptDroppedSettings && file.subtype == 'json') {
    receiveSettings(file);
  } else if (libraryState.options.acceptDroppedFiles) {
    receiveFile(file);
  }
}

/**
 * Receive and apply settings from a dropped JSON file
 * @param {Object} file - File object containing settings data
 * @returns {void}
 * @example
 * // Receive settings file
 * receiveSettings(settingsFile);
 */
export function receiveSettings (file) {
  let receivedCollection, receivedPalette;

  let newState = _presetToState(file.data);
  libraryState.tweakpane.base.importState(newState);

  receivedCollection = file.data.collection;
  receivedPalette = file.data.palette;

  updatePaletteSelector(receivedCollection, receivedPalette);

  window.receivedFile?.(file);
}

/**
 * Receive a dropped file and call the global receivedFile function if available
 * @param {Object} file - Dropped file object
 * @returns {void}
 * @example
 * // Receive file
 * receiveFile(droppedFile);
 */
export function receiveFile (file) {
  window.receivedFile?.(file);
}
