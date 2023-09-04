import Toko from '../core/main';

//
//  receive a json file with settings dropped on the canvas
//
//  WARNING: basically no error checking is done here
//
Toko.prototype.receiveSettings = function (file) {

  if (file.subtype == 'json') {
    let newState = this._presetToState(file.data);
    this.basePane.importState(newState);
    this.pane.tab.refresh();
  }
  
  window.receivedFile?.(file);
}