import { libraryState } from '../core/state';
import { addPaneNavButtons } from './tweakpaneUtil';
import { logWarn } from '../util/logging';

/**
 * Add a color palette selector to a Tweakpane panel
 * @param {Object} paneRef - Reference to the Tweakpane panel
 * @param {Object} pObject - Parameter object containing palette and collection keys
 * @param {Object} [incomingOptions] - Options for customizing the selector
 * @param {number} [incomingOptions.index=1] - Default index for the selector
 * @param {boolean} [incomingOptions.justPrimary=true] - Whether to show only primary palettes
 * @param {boolean} [incomingOptions.sorted=true] - Whether to sort the palette list
 * @param {boolean} [incomingOptions.navButtons=true] - Whether to add navigation buttons
 * @example
 * // Add palette selector to pane
 * toko.addPaletteSelector(pane, params, {
 *   justPrimary: true,
 *   navButtons: true
 * });
 */
export function addPaletteSelector (paneRef, pObject, incomingOptions) {
  // set default options
  let o = {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionKey: 'collection',
    paletteKey: 'palette',
    collectionsListKey: 'collections',
  };

  // merge incoming with default options
  o = Object.assign({}, o, incomingOptions);

  if (!paneRef || !pObject) {
    logWarn('Toko - addPaletteSelector: paneRef or pObject is missing');
    return;
  }

  // store references
  o.paneRef = paneRef;
  o.pObject = pObject;

  // get the data for the controls
  if (!o.collectionKey || !o.paletteKey || !o.collectionsListKey) {
    logWarn('Toko - addPaletteSelector: missing required option keys');
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(o.pObject, o.collectionKey)) {
    logWarn('Toko - addPaletteSelector: collectionKey not found on parameter object');
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(o.pObject, o.paletteKey)) {
    logWarn('Toko - addPaletteSelector: paletteKey not found on parameter object');
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(o.pObject, o.collectionsListKey)) {
    logWarn('Toko - addPaletteSelector: collectionsListKey not found on parameter object');
    return;
  }

  o.colorPalettes = libraryState.toko.getPaletteSelection(o.pObject[o.collectionKey], o.justPrimary, o.sorted);
  o.collectionsList = libraryState.toko.formatForTweakpane(o.pObject[o.collectionsListKey]);

  // add the collection control
  o.collectionInput = o.paneRef
    .addBinding(o.pObject, o.collectionKey, {
      index: o.index,
      options: o.collectionsList,
    })
    .on('change', () => {
      o.colorPalettes = libraryState.toko.getPaletteSelection(pObject[o.collectionKey], o.justPrimary, o.sorted);
      o.pObject[o.paletteKey] = Object.values(o.colorPalettes)[0];
      o.scaleInput.dispose();
      o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
        index: o.index,
        options: o.colorPalettes,
      });
    });

  // add the palette control
  o.scaleInput = paneRef.addBinding(o.pObject, o.paletteKey, {
    options: o.colorPalettes,
    index: o.index,
  });

  // store for when things change later
  libraryState.paletteSelectorData = o;

  // add nav buttons below the dropdowns for previous, next and random
  if (o.navButtons) {
    addPaneNavButtons(o.paneRef, o.pObject, o.paletteKey, o.collectionKey, o.justPrimary, o.sorted, o.index + 1);
  }
}

/**
 * Update the color palette selector with new collection and palette
 * @param {string} receivedCollection - New collection name to set
 * @param {string} receivedPalette - New palette name to set
 * @example
 * // Update palette selector
 * updatePaletteSelector('warm', 'sunset');
 */
export function updatePaletteSelector (receivedCollection, receivedPalette) {
  // get references to the controls
  const o = libraryState.paletteSelectorData;
  if (!o || !o.paneRef || !o.pObject) {
    logWarn('Toko - updatePaletteSelector: palette selector not initialized');
    return;
  }

  // get the palettes for the selected collection
  o.colorPalettes = libraryState.toko.getPaletteSelection(receivedCollection, o.justPrimary, o.sorted);

  // remove the existing palette control and one with the updated palette list
  o.scaleInput.dispose();
  o.pObject[o.paletteKey] = receivedPalette;
  o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
    index: o.index + 1,
    options: o.colorPalettes,
  });

  // call main refresh function to update everything
  if (typeof window.refresh === 'function') {
    window.refresh();
  }
}

/**
 * Add a blend mode selector to a Tweakpane panel
 * @param {Object} paneRef - Reference to the Tweakpane panel
 * @param {Object} pObject - Parameter object containing blend mode key
 * @param {Object} [incomingOptions] - Options for customizing the selector
 * @param {boolean} [incomingOptions.showAllModes=false] - Whether to show all blend modes
 * @example
 * // Add blend mode selector
 * toko.addBlendModeSelector(pane, params, {
 *   showAllModes: true
 * });
 */
export function addBlendModeSelector (paneRef, pObject, incomingOptions) {
  // set default options
  let o = {
    showAllModes: false, // by default don't show all the modes
  };

  // merge with default options
  o = Object.assign({}, o, incomingOptions);

  let blendModes = {
    Default: 'source-over', //p5.BLEND,
    Multiply: 'multiply', //p5.MULTIPLY,
    Screen: 'screen', //p5.SCREEN,
    Overlay: 'overlay', //p5.OVERLAY,
    Darkest: 'darken', //p5.DARKEST,
    Lightest: 'lighten', //p5.LIGHTEST,
    Difference: 'difference', //p5.DIFFERENCE,
    Exclusion: 'exclusion', //p5.EXCLUSION,
  };

  let additionalBlendModes = {
    Add: 'lighter',
    HardLight: 'hard-light',
    SoftLight: 'soft-light',
    Dodge: 'color-dodge',
    Burn: 'color-burn',
  };

  if (o.showAllModes) {
    blendModes = Object.assign({}, blendModes, additionalBlendModes);
  }

  //
  // TO DO define blendmodes as constants
  paneRef.addBinding(pObject, o.blendModeKey, {
    options: blendModes,
  });
}
