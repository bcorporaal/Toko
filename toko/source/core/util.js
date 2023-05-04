import Toko from './main';

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
