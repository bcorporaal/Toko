/**
 * Sketch saving functionality for TokoWrapper
 *
 * Provides functions to save sketches as images (PNG) or SVG files,
 * and to save sketch settings as JSON files.
 *
 * @namespace SaveSketch
 */

import { libraryState } from '../core/state';
import { logWarn } from '../util/logging';
import { _stateToPreset } from '../ui/tweakpaneUtil';

/**
 * Save the current sketch as an image file
 * Automatically detects whether the sketch is canvas or SVG and saves accordingly
 * @returns {string|undefined} The filename of the saved file, or undefined if save failed
 */
export function saveSketch () {
  //
  // detect if the sketch is in canvas or svg
  //
  let isCanvas = null;
  let isSVG = null;

  let sketchElement = document.getElementById(libraryState.options.sketchElementId).firstChild;
  isCanvas = sketchElement instanceof HTMLCanvasElement;
  if (sketchElement.firstChild != null) {
    isSVG = sketchElement.firstChild.nodeName == 'svg';
  }

  if (isCanvas) {
    //
    //  save canvas as png
    //
    let filename = libraryState.toko.generateFilename('png');
    saveCanvas(filename, 'png');
    return filename;
  } else if (isSVG) {
    //
    // add attributes to ensure proper preview of the SVG file in the Finder
    //
    let svgTemp = document.getElementById('sketch-canvas').firstChild.firstChild.firstChild;
    svgTemp.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svgTemp.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    let filename = libraryState.toko.generateFilename('svg');
    let svgString = document.getElementById(libraryState.options.sketchElementId).firstChild.innerHTML;

    let blob = new Blob([svgString], { type: 'image/svg+xml' });
    let url = window.URL.createObjectURL(blob);

    //
    // create a hidden url with the image and click it
    //
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    return filename;
  } else {
    logWarn('Toko - saveSketch: unknown type');
    return;
  }
}

/**
 * Save both the sketch image and its settings
 * @returns {string|undefined} The base filename (without extension) of the saved files
 */
export function saveSketchAndSettings () {
  let filename = saveSketch();
  //
  //  strip the extension of the filename so we can reuse it.
  //
  filename = filename.split('.').slice(0, -1).join('.');
  saveSettings(filename);
}

/**
 * Save the current sketch settings from Tweakpane as a JSON file
 * @param {string} [filename='default'] - Base filename for the settings file
 */
export function saveSettings (filename = 'default') {
  // determine the filename
  if (typeof filename === 'undefined' || filename === 'default') {
    filename = libraryState.toko.generateFilename('json');
  }

  // add extension if needed
  if (!filename.endsWith('.json')) {
    filename += '.json';
  }

  // gather the current Tweakpane state
  const state = libraryState.tweakpane.base.exportState();
  const settings = _stateToPreset(state);

  // save with p5.js native saver
  saveJSON(settings, filename);
}
