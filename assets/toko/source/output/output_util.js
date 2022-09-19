import Toko from '../core/main';

Toko.prototype.generateFilename = function (extension = 'svg', verb = 'sketched') {
  var adj1 = this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
  var adj2 = this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
  var noun = this.NOUNS[Math.floor(this.NOUNS.length * Math.random())];

  var filename = this._getTimeStamp() + '_';

  if (extension != '' && extension != 'none') {
    filename = filename + verb + '_the' + '_' + adj1 + '_' + adj2 + '_' + noun + '.' + extension;
  } else {
    filename = filename + verb + '_the' + '_' + adj1 + '_' + adj2 + '_' + noun;
  }
  return filename;
}

Toko.prototype._getTimeStamp = function () {
  //
  // create a yyyymmdd string
  //
  var d = new Date();
  var day = ("0" + d.getDate()).slice(-2);
  var month = ("0" + (
    d.getMonth() + 1
  )).slice(-2)
  var year = d.getFullYear();

  return year + month + day;
}