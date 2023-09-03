import Toko from '../core/main';

//
//  save all the current settings in a simple JSON file
//
//  WARNING: basically no error checking is done here
//
Toko.prototype.saveSettings = function (filename = 'default') {
  
  if (typeof filename === 'undefined' || filename == 'default') {
    filename = this.generateFilename('json');
  }

  if (filename.slice(-5) != '.json') {
    filename += '.json';
  }

  let state = this.basePane.exportState();
  let settings = this._stateToPreset(state);
  createStringDict(settings).saveJSON(filename);
}