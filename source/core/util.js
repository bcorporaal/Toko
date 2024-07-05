import Toko from './main';

//
//  pick a random adjective from the list
//  note this does not use the seeded random function to avoid file name conflicts
//
Toko.prototype.randomAdjective = function () {
  return this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
};

//
//  pick a random noun from the list
//  note this does not use the seeded random function to avoid file name conflicts
//
Toko.prototype.randomNoun = function () {
  return this.NOUNS[Math.floor(this.NOUNS.length * Math.random())];
};

//
//  simple shortcut to set a p5 color object with a hexCode and alpha value
//
Toko.prototype.colorAlpha = function (hexColor, alpha = 255) {
  let c = color(hexColor);
  c.setAlpha(alpha);
  return c;
};
