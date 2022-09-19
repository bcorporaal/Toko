import Toko from '../core/main';

Toko.prototype.saveSettings = function (filename = 'default') {
  
  if (typeof filename === 'undefined' || filename == 'default') {
    filename = this.generateFilename('json');
  }

  if (filename.slice(-5) != '.json') {
    filename += '.json';
  }

  let settings = this.basePane.exportPreset();
  createStringDict(settings).saveJSON(filename);
}