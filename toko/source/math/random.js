import Toko from '../core/main';

//
//  random number generators and support
//

//
//  init the random number generator for this instance of Toko
//
Toko.reseed = function(seed) {
  this._rng = new Toko.rng(seed);
}

//
//  random number, element from array
//
Toko.random = function(min, max) {
  return this._rng.random(min, max);
}

//
//  random integer
//
Toko.intRange = function(min = 0, max = 100) {
  return this._rng.intRange(min, max);
}
//
//  random boolean
//
Toko.randomBool = function() {
  return this._rng.randomBool();
}
//
//  random charactor from string or lowercase
//
Toko.randomChar = function(inString = 'abcdefghijklmnopqrstuvwxyz') {
  return this._rng.randomChar(inString);
}
//
//  stepped random number in range
//
Toko.steppedRandom = function(min = 0, max = 1, step = 0.1) {
  return this._rng.steppedRandom(min, max, step);
}
//
//  shuffle array in place
//
Toko.shuffle = function(inArray) {
  return this._rng.shuffle(inArray);
}
//
//  all integers between min and max in random order
//
Toko.intSequence = function (min = 0, max = 100) {
  return this._rng.intSequence(min, max);
}

//
//  main random number generator class
//
Toko.rng = class {

  constructor(seed) {
    if (seed == undefined) { 
      this.seed = Date.now(); 
    } else {
      this.seed = seed;
    }
  }

  //
  //  reseed the random number generator
  //
  reseed = function(newSeed) {
    this.seed = newSeed;
  }

  //
  //  Return a random floating-point number
  //
  //  0 arguments - random number between 0 and 1
  //  1 argument & number - random number between 0 and the number (but not including)
  //  1 argument & array  - random element from the array
  //  2 arguments & number - random number from 1st number to 2nd number (but not including)
  //
  //  adapted from p5.js code
  //
  random = function(min, max) {
    let rand = this._rng();
  
    if (typeof min === 'undefined') {
      return rand;
    } else if (typeof max === 'undefined') {
      if (min instanceof Array) {
        return min[Math.floor(rand * min.length)];
      } else {
        return rand * min;
      }
    } else {
      if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
      }
  
      return rand * (max - min) + min;
    }
  }

  //
  //  random integer from a range
  //
  intRange = function(min = 0, max = 100) {
    let rand = this._rng();

    min = Math.floor(min);
    max = Math.floor(max);
  
    return Math.floor(rand * (max - min) + min);
  }

  //
  //  random boolean
  //
  randomBool = function() {
    if (this._rng() < 0.5) {
      return true;
    } else {
      return false;
    }
  }

  //
  //  random character from a string
  //  without input it returns a random lowercase letter
  //
  randomChar = function(inString = 'abcdefghijklmnopqrstuvwxyz') {
    let l = inString.length;
    let r = Math.floor(this.random(0,l));
    return inString.charAt(r);
  }

  //
  //  generate a random number snapped to steps
  //
  steppedRandom = function (min = 0, max = 1, step = 0.1) {
    let n = Math.floor((max - min) / step);
    let r = Math.round(this._rng() * n);
    return min + r * step;
  }

  //
  //  shuffle an array in place
  //
  shuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(this._rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  //
  //  generate random integer sequence from min to max
  //
  intSequence = function (min = 0, max = 100) {
    min = Math.floor(min);
    max = Math.floor(max);
    if (max < min) {
      let temp = max;
      max = min;
      min = temp;
    }
    let seq = Array.from(Array(max - min)).map((e,i)=>i+min);
    this.shuffle(seq);
    return seq;
  }

  //
  //  the psuedo random number generator
  //  adapted from https://github.com/cprosche/mulberry32
  //
  _rng = function() {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

}

Toko.randomSeedString = function(stringLength = 6) {
  const BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  
  for (let i = 0; i < stringLength; i++) {
    let n = Math.floor(Math.random()*62);
    result = BASE62_ALPHABET[n] + result;
  }
  return result;
}

//
//  from: https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
//
Toko.cyrb53a = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca77);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
  }
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x735a2d97);
  h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
  h1 ^= h2 >>> 16; h2 ^= h1 >>> 16;
    return 2097152 * (h2 >>> 0) + (h1 >>> 11);
};