import Toko from '../core/main';

//
//  receive a json file with settings dropped on the canvas
//
//  WARNING: basically no error checking is done here
//
Toko.prototype.dropFile = function (file) {
  if (this.options.acceptDroppedSettings && file.subtype == 'json') {
    this.receiveSettings(file);
  } else if (this.options.acceptDroppedFiles) {
    this.receiveFile(file);
  }
};

Toko.prototype.receiveSettings = function (file) {
  let receivedCollection, receivedPalette;

  let newState = this._presetToState(file.data);
  this.basePane.importState(newState);

  receivedCollection = file.data.collection;
  receivedPalette = file.data.palette;

  this.updatePaletteSelector(receivedCollection, receivedPalette);

  window.receivedFile?.(file);
};

Toko.prototype.receiveFile = function (file) {
  window.receivedFile?.(file);
};
