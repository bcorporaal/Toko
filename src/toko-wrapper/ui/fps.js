import { libraryState } from '../core/state.js';

export function setUpFPS () {
  if (libraryState.options.showFPS) {
    libraryState.toko.createFPS();
  }
  addFPSToggle();
}

export function addFPSToggle () {
  document.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() === 'f') {
      libraryState.toko.toggleFPS();
    }
  });
}
