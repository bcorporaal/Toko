import Toko from './main';

// Toko.prototype.steppedRandom = function (min = 0, max = 1, step = 0.1) {
//   var n = Math.floor((max - min) / step);
//   var r = Math.round(Math.random() * n);
//   return min + r * step;
// }

// Toko.prototype.wrap = function (value, min = 0, max = 100) {
//   var vw = value;

//   if (value < min) {
//     vw = max + (value - min)
//   } else if (value > max) {
//     vw = min + (value - max)
//   }

//   return vw
// }

//
// create a list that is convenient to use by Tweakpane
//
Toko.prototype.formatForTweakpane = function (inList, propertyName) {
  let o = {};

  if (typeof propertyName == 'string') {
    inList.forEach(function (m) {
      o[m[propertyName]] = m[propertyName];
    });
  } else {
    inList.forEach(function (m) {
      o[m] = m;
    });
  }

  return o;
}

//
//  generate a random name for use as a file name
//
// Toko.prototype.generateRandomName = function () {
//   var adj1 = this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
//   var adj2 = this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
//   var noun = this.NOUNS[Math.floor(this.NOUNS.length * Math.random())];

//   return 'The ' + adj1 + ' ' + adj2 + ' ' + noun;
// }
