import Toko from '../core/main';

//
// main random number generator class
//
Toko.RNG = class {
  constructor (seedString) {
    this._currentSeed = 0;
    this._seedString = '';
    this.reset(seedString);
  }

  //
  //  for debugging
  //
  dump = function () {
    console.log(this._seedString, this._currentSeed);
    console.log(this._seedHistory, this._seedHistoryIndex);
  };

  //
  //  push a new seed to the history
  //
  pushSeed = function (newSeed) {
    if (newSeed != this._seedString) {
      // ignore if it is the same string
      if (this._seedHistory.length > 0 && this._seedHistoryIndex >= 0) {
        this._seedHistory = this._seedHistory.slice(0, this._seedHistoryIndex + 1);
      }
      this._seedHistory.push(newSeed);
      this._seedHistoryIndex++;
      this._seedString = newSeed;
      this._currentSeed = this.base62ToBase10(this._seedString);
    }
  };

  //
  //  validate the incoming string to only include numbers and letters
  //  if the string is empty a random string is generated
  //
  validateSeedString = function (inSeedString) {
    let cleanSeedString;
    if (inSeedString == undefined || inSeedString == '') {
      cleanSeedString = this.randomSeedString();
    } else {
      cleanSeedString = inSeedString;
    }
    cleanSeedString = cleanSeedString.replace(/[^a-zA-Z0-9]/g, '');
    return cleanSeedString;
  };

  reset = function (newSeed) {
    this._seedHistory = [];
    this._seedHistoryIndex = -1;
    newSeed = this.validateSeedString(newSeed);
    this.pushSeed(newSeed);
    return this._seedString;
  };

  //
  //  reset the current seed back to the current seedString
  //  effectively resets the sequence of random numbers
  //
  resetSeed = function () {
    this._currentSeed = this.base62ToBase10(this._seedString);
    return this._seedString;
  };

  //
  //  previousSeed - seed with the previous from the history
  //
  previousSeed = function () {
    if (this._seedHistoryIndex >= 1) {
      this._seedHistoryIndex--;
      this._seedString = this._seedHistory[this._seedHistoryIndex];
      this._currentSeed = this.base62ToBase10(this._seedString);
    }
    return this._seedString;
  };

  //
  //  nextSeed - seed with the next from the history
  //
  nextSeed = function () {
    if (this._seedHistoryIndex < this._seedHistory.length - 1) {
      this._seedHistoryIndex++;
      this._seedString = this._seedHistory[this._seedHistoryIndex];
      this._currentSeed = this.base62ToBase10(this._seedString);
    }
    return this._seedString;
  };

  //
  //  set seed to random and push to the history
  //
  randomSeed = function () {
    this.pushSeed(this.randomSeedString());
    return this._seedString;
  };

  //------------------------------------------------------------------------
  //
  //  GET & SET
  //
  //------------------------------------------------------------------------

  get seed () {
    return this._seedString;
  }

  set seed (newSeed) {
    newSeed = this.validateSeedString(newSeed);
    this.pushSeed(newSeed);
  }

  //------------------------------------------------------------------------
  //
  //  SUPPORT FUNCTIONS
  //
  //------------------------------------------------------------------------

  randomSeedString = function (stringLength = 6) {
    const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < stringLength; i++) {
      const n = Math.floor(Math.random() * 62);
      result = BASE62_ALPHABET[n] + result;
    }
    return result;
  };

  base62ToBase10 = function (input) {
    const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      base = 62;
    let result = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i),
        charValue = BASE62_ALPHABET.indexOf(char);

      if (charValue === -1) {
        throw new Error('Invalid character in the input string.');
      }

      result = result * base + charValue;
    }

    return result;
  };

  //------------------------------------------------------------------------
  //
  //  CORE RNG
  //
  //------------------------------------------------------------------------

  //
  // the psuedo random number generator
  // adapted from https://github.com/cprosche/mulberry32
  //
  _rng = function () {
    let t = (this._currentSeed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  //------------------------------------------------------------------------
  //
  //  RNG FUNCTIONS
  //
  //------------------------------------------------------------------------

  //
  // Return a random floating-point number
  //
  // 0 arguments - random number between 0 and 1
  // 1 argument & number - random number between 0 and the number (but not including)
  // 1 argument & array  - random element from the array
  // 2 arguments & number - random number from 1st number to 2nd number (but not including)
  //
  // adapted from p5.js code
  //
  random = function (min, max) {
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
  };

  //
  // random integer from a range
  //
  intRange = function (min = 0, max = 100) {
    let rand = this._rng();

    min = Math.floor(min);
    max = Math.floor(max);

    return Math.floor(rand * (max - min) + min);
  };

  //
  // return a random boolean
  //
  randomBool = function () {
    if (this._rng() < 0.5) {
      return true;
    } else {
      return false;
    }
  };

  //
  // random character from a string
  // without input it returns a random lowercase letter
  //
  randomChar = function (inString = 'abcdefghijklmnopqrstuvwxyz') {
    if (inString.length === 0) {
      throw new Error('randomChar: Input string cannot be empty.');
    }
    let r = Math.floor(this.random(0, inString.length));
    return inString.charAt(r);
  };

  //
  // random string of length count selected from a provided string
  // without input it returns a random lowercase letter
  //
  randomString = function (count = 1, inString = 'abcdefghijklmnopqrstuvwxyz') {
    if (inString.length === 0) {
      throw new Error('randomString: Input string cannot be empty.');
    }
    let output = '';
    for (var i = 0; i < count; i++) {
      output += this.randomChar(inString);
    }
    return output;
  };

  //
  // generate a random number snapped to steps
  //
  steppedRandom = function (min = 0, max = 1, step = 0.1) {
    let n = Math.floor((max - min) / step),
      r = Math.round(this._rng() * n);
    return min + r * step;
  };

  //
  // shuffle an array in place
  //
  shuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(this._rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  //
  // generate random integer sequence from min to max
  // including min, excluding max
  //
  intSequence = function (min = 0, max = 100) {
    min = Math.floor(min);
    max = Math.floor(max);
    if (max < min) {
      let temp = max;
      max = min;
      min = temp;
    }
    let seq = Array.from(Array(max - min)).map((e, i) => i + min);
    this.shuffle(seq);
    return seq;
  };
  //
  //  create a 2D unit p5 vector in a random direction
  //
  random2DVector = function () {
    let v = createVector(1, 0);
    let h = this.random() * TWO_PI;
    v.setHeading(h);
    return v;
  };
  //
  //  Fast Poisson Disk Sampling
  //
  //  based on the example from Coding Train
  //  https://thecodingtrain.com/challenges/33-poisson-disc-sampling
  //
  poissonDisk = function (inWidth, inHeight, inRadius) {
    let r = inRadius;
    let nrSamples = 30;
    let grid = [];
    let w = r / Math.sqrt(2);
    let active = [];
    let cols, rows;
    let ordered = [];
    let nrTries = 20;

    //  create reference grid
    cols = Math.floor(width / w);
    rows = Math.floor(height / w);
    grid = new Array(cols * rows);

    // set initial point
    let x = this.random(inWidth);
    let y = this.random(inHeight);
    let i = Math.floor(x / w);
    let j = Math.floor(y / w);
    let pos = createVector(x, y);
    grid[i + j * cols] = pos;
    active.push(pos);

    for (let total = 0; total < nrTries; total++) {
      while (active.length > 0) {
        let randIndex = Math.floor(toko.random(active.length));
        let pos = active[randIndex];
        let found = false;
        for (let n = 0; n < nrSamples; n++) {
          let sample = this.random2DVector();
          let m = this.random(r, 2 * r);
          sample.setMag(m);
          sample.add(pos);

          let col = Math.floor(sample.x / w);
          let row = Math.floor(sample.y / w);

          if (col > -1 && row > -1 && col < cols && row < rows && !grid[col + row * cols]) {
            let ok = true;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                let index = col + i + (row + j) * cols;
                let neighbor = grid[index];
                if (neighbor) {
                  let d = p5.Vector.dist(sample, neighbor);
                  if (d < r) {
                    ok = false;
                  }
                }
              }
            }
            if (ok) {
              found = true;
              grid[col + row * cols] = sample;
              active.push(sample);
              ordered.push(sample);
              break;
            }
          }
        }
        //
        //  remove active point if no option was found
        //
        if (!found) {
          active.splice(randIndex, 1);
        }
      }
    }

    //
    //  take out undefined points
    //
    ordered = ordered.filter(n => n !== undefined);

    return ordered;
  };
};
