import { libraryState } from '../core/state';

/**
 * Add a random seed control to a Tweakpane panel
 * @param {Object} paneRef - Reference to the Tweakpane panel
 * @param {Object} pObject - Parameter object containing seed string key
 * @param {Object} [incomingOptions] - Options for customizing the control
 * @param {Object} [incomingOptions.rng] - RNG instance to use (defaults to library RNG)
 * @param {string} [incomingOptions.seedStringKey='seedString'] - Key for the seed string in pObject
 * @param {string} [incomingOptions.label='untitled'] - Label for the seed input
 * @example
 * // Add random seed control
 * toko.addRandomSeedControl(pane, params, {
 *   label: 'Seed'
 * });
 */
export function addRandomSeedControl (paneRef, pObject, incomingOptions) {
  //
  //  set default options
  //
  let o = {
    rng: null,
    seedStringKey: 'seedString',
    label: 'untitled',
  };

  o = Object.assign({}, o, incomingOptions);
  o.paneRef = paneRef;
  o.pObject = pObject;

  //
  //  ensure an rng is always available
  //
  if (!o.rng) {
    // First try to use libraryState.RNG if it exists
    if (libraryState.RNG) {
      o.rng = libraryState.RNG;
    } else if (libraryState.toko && libraryState.toko.RNG) {
      // Create a new RNG from the toko instance
      o.rng = new libraryState.toko.RNG();
      // Also store it in libraryState for future use
      libraryState.RNG = o.rng;
    }
  }

  //
  //  string input
  //
  pObject[o.seedStringKey] = o.rng.seed;
  let seedStringForm = paneRef.addBinding(pObject, o.seedStringKey, {
    label: o.label,
  });
  seedStringForm.on('change', e => {
    o.rng.seed = e.value;
  });

  const op = {
    view: 'buttongrid',
    size: [3, 1],
    cells: (x, y) => ({ title: [['← prev', 'next →', 'rnd']][y][x] }),
    label: ' ',
  };

  paneRef.addBlade(op).on('click', ev => {
    switch (ev.index[0]) {
      case 0:
        pObject[o.seedStringKey] = o.rng.previousSeed();
        break;
      case 1:
        pObject[o.seedStringKey] = o.rng.nextSeed();
        break;
      case 2:
        pObject[o.seedStringKey] = o.rng.randomSeed();
        break;
      default:
        console.warn('a non-existing button was pressed:', ev.index[0]);
        break;
    }

    libraryState.tweakpane.base.refresh();
  });
}
