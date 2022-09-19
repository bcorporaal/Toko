import Toko from '../core/main';

Toko.prototype.receiveSettings = function (file) {
  if (file.subtype == 'json') {
    this.basePane.importPreset(file.data);
  }
  window.receivedFile?.(file);
}