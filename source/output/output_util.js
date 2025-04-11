import Toko from '../core/main';

Toko.prototype.generateFilename = function (extension = 'svg', verb = 'sketched') {
  const adj1 = this.randomAdjective();
  const adj2 = this.randomAdjective();
  const noun = this.randomNoun();

  const timestamp = this._getTimeStamp();
  const baseFilename = `${timestamp}_${verb}_the_${adj1}_${adj2}_${noun}`;

  return extension && extension !== 'none' ? `${baseFilename}.${extension}` : baseFilename;
};

Toko.prototype._getTimeStamp = function () {
  // Get the current date
  const d = new Date();

  // Destructure to get year, month, and day
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(d.getDate()).padStart(2, '0'); // Ensures two-digit day

  // Return formatted timestamp
  return `${year}${month}${day}`;
};
