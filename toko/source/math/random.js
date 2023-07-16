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
//  get a random number
//
Toko.random = function(min, max) {
  return this._rng.random(min, max);
}

//  ****************
//  add placeholder functions for others as well 
//  ****************

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
  bool = function() {
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
  char = function(inString = 'abcdefghijklmnopqrstuvwxyz') {
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