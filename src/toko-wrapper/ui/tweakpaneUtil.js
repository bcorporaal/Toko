/**
 * Convert Tweakpane state object into a compact preset object
 * @param {Object} stateObject - Tweakpane state object to convert
 * @returns {Object} Compact preset object with key-value pairs
 * @example
 * // Convert state to preset
 * const preset = _stateToPreset(tweakpaneState);
 */

import { logWarn } from '../util/logging';
//
//  turn the long Tweakpane state into a more compact set of values

import { libraryState } from '../core/state';

//
export function _stateToPreset (stateObject) {
  let presetObject = {};

  function traverse (obj) {
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        // check if the current property is 'binding' and an object
        if (key === 'binding' && typeof obj[key] === 'object') {
          // if it is, extract the key value combination and add it to the presets
          let o = {};
          o[obj[key].key] = obj[key].value;
          presetObject = { ...presetObject, ...o };
        } else if (typeof obj[key] === 'object') {
          // if it is not binding but is and object, dig deeper
          traverse(obj[key]);
        }
      }
    }
  }

  // start traversing the state object
  traverse(stateObject);

  return presetObject;
}

/**
 * Convert compact preset object into Tweakpane state object
 * @param {Object} presetObject - Compact preset object to convert
 * @returns {Object} Tweakpane state object
 * @example
 * // Convert preset to state
 * const state = _presetToState(presetObject);
 */
//
//  use the compact preset to create a new Tweakpane state
//
export function _presetToState (presetObject) {
  let stateObject = libraryState.tweakpane.base.exportState();

  function traverse (obj) {
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        // check if the current property is 'binding' and an object
        if (key === 'binding' && typeof obj[key] === 'object') {
          // update the 'binding' object with values from newPreset
          if (Object.hasOwn(presetObject, obj[key].key)) {
            obj[key].value = presetObject[obj[key].key];
          }
        } else if (typeof obj[key] === 'object') {
          // if the property is an object, recursively traverse it
          traverse(obj[key]);
        }
      }
    }
  }

  // start traversing the current state to add the preset values
  traverse(stateObject);

  return stateObject;
}

/**
 * Add navigation buttons (previous, next, random) to a Tweakpane panel
 * @param {Object} paneRef - Reference to the Tweakpane panel
 * @param {Object} pObject - Parameter object containing palette and collection keys
 * @param {string} paletteKey - Key for the palette in pObject
 * @param {string} collectionKey - Key for the collection in pObject
 * @param {boolean} [justPrimary=false] - Whether to show only primary palettes
 * @param {boolean} [sorted=false] - Whether to sort the palette list
 * @param {number} [index=-1] - Index for the button grid
 * @example
 * // Add navigation buttons
 * addPaneNavButtons(pane, params, 'palette', 'collection', true, true);
 */
export function addPaneNavButtons (
  paneRef,
  pObject,
  paletteKey,
  collectionKey,
  justPrimary = false,
  sorted = false,
  index = -1,
) {
  let o = {
    view: 'buttongrid',
    size: [3, 1],
    cells: (x, y) => ({
      title: [['← prev', 'next →', 'rnd']][y][x],
    }),
    label: ' ',
  };

  if (index != -1) {
    o.index = index;
  }

  paneRef.addBlade(o).on('click', ev => {
    let paletteList = libraryState.toko.getPaletteSelection(pObject[collectionKey], justPrimary, sorted);
    switch (ev.index[0]) {
      case 0:
        pObject[paletteKey] = findPreviousInList(pObject[paletteKey], paletteList);
        break;
      case 1:
        pObject[paletteKey] = findNextInList(pObject[paletteKey], paletteList);
        break;
      case 2:
        pObject[paletteKey] = findRandomInList(pObject[paletteKey], paletteList);
        break;

      default:
        logWarn('a non-existing button was pressed:', ev.index[0]);
        break;
    }
    libraryState.tweakpane.base.refresh();
  });
}

/**
 * Find the next item in a Tweakpane-formatted list
 * @param {string} item - Current item to find next for
 * @param {Object} list - Tweakpane-formatted list object
 * @returns {string} Next item in the list (wraps to beginning if at end)
 * @example
 * // Find next item
 * const next = findNextInList('current', tweakpaneList);
 */
export function findNextInList (item, list) {
  let keys = Object.keys(list);
  let i = keys.indexOf(item);
  let n;
  if (i < keys.length - 1) {
    n = i + 1;
  } else {
    n = 0;
  }
  let newItem = keys[n];
  return list[newItem];
}

/**
 * Find the previous item in a Tweakpane-formatted list
 * @param {string} item - Current item to find previous for
 * @param {Object} list - Tweakpane-formatted list object
 * @returns {string} Previous item in the list (wraps to end if at beginning)
 * @example
 * // Find previous item
 * const prev = findPreviousInList('current', tweakpaneList);
 */
export function findPreviousInList (item, list) {
  let keys = Object.keys(list);
  let i = keys.indexOf(item);
  let n;
  if (i > 0) {
    n = i - 1;
  } else {
    n = keys.length - 1;
  }
  let newItem = keys[n];
  return list[newItem];
}

/**
 * Select a random item from a Tweakpane-formatted list (excluding current item)
 * @param {string} item - Current item to exclude from random selection
 * @param {Object} list - Tweakpane-formatted list object
 * @returns {string} Random item from the list (different from current item)
 * @example
 * // Find random item
 * const random = findRandomInList('current', tweakpaneList);
 */
export function findRandomInList (item, list) {
  let keys = Object.keys(list);
  let newItem;
  do {
    newItem = keys[Math.floor(Math.random() * keys.length)];
  } while (newItem == item);
  return list[newItem];
}
