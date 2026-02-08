import { libraryState } from '../core/state.js';

export function setUpFPS () {
  if (libraryState.options.showFPS) {
    libraryState.toko.createFPS();
  }
  addFPSToggle();
}

let fpsToggleHandler = null;

export function addFPSToggle () {
  if (fpsToggleHandler) return;
  fpsToggleHandler = function (event) {
    if (event.key.toLowerCase() === 'f') {
      libraryState.toko.toggleFPS();
    }
  };
  document.addEventListener('keydown', fpsToggleHandler);
}

export function removeFPSToggle () {
  if (!fpsToggleHandler) return;
  document.removeEventListener('keydown', fpsToggleHandler);
  fpsToggleHandler = null;
}
