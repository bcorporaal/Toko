import Toko from '../core/main';

//
//  receive a json file with settings dropped on the canvas
//
//  WARNING: basically no error checking is done here
//
Toko.prototype.receiveSettings = function (file) {
  let receivedCollection, receivedPalette;

  this.receivingFileNow = true;

  if (file.subtype == 'json') {
    let newState = this._presetToState(file.data);
    this.basePane.importState(newState);

    receivedCollection = file.data.collection;
    receivedPalette = file.data.palette;
  }

  this.receivingFileNow = false;
  this.updatePaletteSelector(receivedCollection, receivedPalette);

  window.receivedFile?.(file);
};
