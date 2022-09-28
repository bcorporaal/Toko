import Toko from './main';

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
