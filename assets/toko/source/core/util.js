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

//
//  pick a random adjective from the list
//
Toko.prototype.randomAdjective = function() {
  return this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
}

//
//  pick a random noun from the list
//
Toko.prototype.randomNoun = function() {
  return this.NOUNS[Math.floor(this.NOUNS.length * Math.random())];
}
