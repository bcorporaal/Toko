/**
 * Main random number generator class with seed-based deterministic randomness
 * Provides various random number generation methods and seed management
 * Uses a high-quality pseudo-random number generator (mulberry32) for consistent results
 *
 * @example
 * // Create a new RNG with a seed
 * const rng = new RNG('mySeed123');
 *
 * // Generate random numbers
 * const randomValue = rng.random(0, 100);
 * const randomInt = rng.intRange(1, 10);
 *
 * // Navigate seed history
 * rng.nextSeed();
 * rng.previousSeed();
 *
 */

import { libraryState } from '../core/state.js';
import { isDebugLogEnabled } from '../../shared/util/debug.js';

export class RNG {
  /**
   * Create a new RNG instance
   * @param {string} [seedString] - Initial seed string. If not provided, a random seed is generated
   */
  constructor(seedString) {
    this._currentSeed = 0;
    this._seedString = '';
    this.reset(seedString);
  }

  /**
   * Debug method to log current seed state
   * @private
   * @returns {void}
   */
  _dump() {
    if (isDebugLogEnabled(libraryState)) {
      console.log(this._seedString, this._currentSeed);
      console.log(this._seedHistory, this._seedHistoryIndex);
    }
  }

  /**
   * Push a new seed to the history
   * @param {string} newSeed - The new seed string to push
   * @returns {void}
   * @private
   */
  _pushSeed(newSeed) {
    if (newSeed != this._seedString) {
      // ignore if it is the same string
      if (this._seedHistory.length > 0 && this._seedHistoryIndex >= 0) {
        this._seedHistory = this._seedHistory.slice(0, this._seedHistoryIndex + 1);
      }
      this._seedHistory.push(newSeed);
      this._seedHistoryIndex++;
      this._seedString = newSeed;
      this._currentSeed = this._base62ToBase10(this._seedString);
    }
  }

  /**
   * Validate the incoming string to only include numbers and letters
   * If the string is empty a random string is generated
   * @param {string} inSeedString - The seed string to validate
   * @returns {string} Cleaned and validated seed string
   * @private
   */
  _validateSeedString(inSeedString) {
    let cleanSeedString;
    if (inSeedString == undefined || inSeedString == '') {
      cleanSeedString = this._randomSeedString();
    } else {
      cleanSeedString = inSeedString;
    }
    cleanSeedString = cleanSeedString.replace(/[^a-zA-Z0-9]/g, '');
    // Fallback to random seed if cleaned string is empty (all non-alphanumeric input)
    if (cleanSeedString.length === 0) {
      cleanSeedString = this._randomSeedString();
    }
    return cleanSeedString;
  }

  /**
   * Reset the RNG with a new seed, clearing history
   * @param {string} [newSeed] - New seed string. If not provided, a random seed is generated
   * @returns {string} The validated seed string
   */
  reset(newSeed) {
    this._seedHistory = [];
    this._seedHistoryIndex = -1;
    newSeed = this._validateSeedString(newSeed);
    this._pushSeed(newSeed);
    return this._seedString;
  }

  /**
   * Reset the current seed back to the current seedString
   * Effectively resets the sequence of random numbers
   * @returns {string} The current seed string
   */
  resetSeed() {
    this._currentSeed = this._base62ToBase10(this._seedString);
    return this._seedString;
  }

  /**
   * Navigate to the previous seed in the history
   * @returns {string} The previous seed string
   */
  previousSeed() {
    if (this._seedHistoryIndex >= 1) {
      this._seedHistoryIndex--;
      this._seedString = this._seedHistory[this._seedHistoryIndex];
      this._currentSeed = this._base62ToBase10(this._seedString);
    }
    return this._seedString;
  }

  /**
   * Navigate to the next seed in the history
   * @returns {string} The next seed string
   */
  nextSeed() {
    if (this._seedHistoryIndex < this._seedHistory.length - 1) {
      this._seedHistoryIndex++;
      this._seedString = this._seedHistory[this._seedHistoryIndex];
      this._currentSeed = this._base62ToBase10(this._seedString);
    }
    return this._seedString;
  }

  /**
   * Set seed to random and push to the history
   * @returns {string} The new random seed string
   */
  randomSeed() {
    this._pushSeed(this._randomSeedString());
    return this._seedString;
  }

  //------------------------------------------------------------------------
  //
  //  GET & SET
  //
  //------------------------------------------------------------------------

  /**
   * Get the current seed string
   * @returns {string} The current seed string
   */
  get seed() {
    return this._seedString;
  }

  /**
   * Set a new seed string
   * @param {string} newSeed - The new seed string
   * @returns {void}
   */
  set seed(newSeed) {
    newSeed = this._validateSeedString(newSeed);
    this._pushSeed(newSeed);
  }

  //------------------------------------------------------------------------
  //
  //  SUPPORT FUNCTIONS
  //
  //------------------------------------------------------------------------

  /**
   * Generate a random seed string
   * @param {number} [stringLength=6] - Length of the seed string to generate
   * @returns {string} Random seed string
   * @private
   */
  _randomSeedString(stringLength = 6) {
    const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < stringLength; i++) {
      const n = Math.floor(Math.random() * 62);
      result = BASE62_ALPHABET[n] + result;
    }
    return result;
  }

  /**
   * Convert a base62 string to base10 number
   * @param {string} input - Base62 string to convert
   * @returns {number} Base10 number
   * @throws {Error} If input contains invalid characters
   * @private
   */
  _base62ToBase10(input) {
    const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      base = 62;
    let result = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i),
        charValue = BASE62_ALPHABET.indexOf(char);

      if (charValue === -1) {
        throw new Error('Toko: RNG randomChar() requires a non-empty string. Provide a string of valid characters.');
      }

      result = result * base + charValue;
    }

    return result;
  }

  //------------------------------------------------------------------------
  //
  //  CORE RNG
  //
  //------------------------------------------------------------------------

  /**
   * The pseudo random number generator
   * Adapted from https://github.com/cprosche/mulberry32
   * @returns {number} Random number between 0 and 1
   * @private
   */
  _rng() {
    let t = (this._currentSeed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  //------------------------------------------------------------------------
  //
  //  RNG FUNCTIONS
  //
  //------------------------------------------------------------------------

  /**
   * Return a random floating-point number
   * @param {number|Array} [min] - If number: minimum value (exclusive). If array: random element from array
   * @param {number} [max] - Maximum value (exclusive) when min is a number
   * @returns {number|*} Random number or array element
   *
   * @example
   * rng.random();           // Random number between 0 and 1
   * rng.random(10);         // Random number between 0 and 10
   * rng.random(5, 15);      // Random number between 5 and 15
   * rng.random(['a', 'b']); // Random element from array
   */
  random(min, max) {
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

  /**
   * Generate a random integer from a range
   * @param {number} [min=0] - Minimum value (inclusive)
   * @param {number} [max=100] - Maximum value (exclusive)
   * @returns {number} Random integer in the range
   */
  intRange(min = 0, max = 100) {
    let rand = this._rng();

    min = Math.floor(min);
    max = Math.floor(max);

    // Swap if min > max
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    // When min === max, the range is empty; return min
    if (min === max) {
      return min;
    }

    return Math.floor(rand * (max - min) + min);
  }

  /**
   * Return a random boolean
   * @returns {boolean} Random boolean value
   */
  randomBool() {
    if (this._rng() < 0.5) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Return a random character from a string
   * Without input it returns a random lowercase letter
   * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - String to select character from
   * @returns {string} Random character from the string
   * @throws {Error} If input string is empty
   */
  randomChar(inString = 'abcdefghijklmnopqrstuvwxyz') {
    if (inString.length === 0) {
      throw new Error(
        'Toko: RNG randomChar() requires a non-empty string. Provide at least one character to choose from.',
      );
    }
    let r = Math.floor(this.random(0, inString.length));
    return inString.charAt(r);
  }

  /**
   * Generate a random string of specified length from a character set
   * @param {number} [count=1] - Length of the string to generate
   * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - Character set to select from
   * @returns {string} Random string of specified length
   * @throws {Error} If input string is empty
   */
  randomString(count = 1, inString = 'abcdefghijklmnopqrstuvwxyz') {
    if (inString.length === 0) {
      throw new Error(
        'Toko: RNG randomString() requires a non-empty character set. Provide at least one character to choose from.',
      );
    }
    let output = '';
    for (var i = 0; i < count; i++) {
      output += this.randomChar(inString);
    }
    return output;
  }

  /**
   * Generate a random number snapped to steps
   * @param {number} [min=0] - Minimum value
   * @param {number} [max=1] - Maximum value
   * @param {number} [step=0.1] - Step size
   * @returns {number} Random number snapped to the nearest step
   */
  steppedRandom(min = 0, max = 1, step = 0.1) {
    // Swap if min > max
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    // Ensure step is positive
    if (step <= 0) {
      return min;
    }

    let n = Math.floor((max - min) / step);
    if (n <= 0) {
      return min;
    }

    let r = Math.round(this._rng() * n);
    return min + r * step;
  }

  /**
   * Shuffle an array in place using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} The shuffled array (same reference)
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(this._rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Generate random integer sequence from min to max
   * Including min, excluding max
   * @param {number} [min=0] - Minimum value (inclusive)
   * @param {number} [max=100] - Maximum value (exclusive)
   * @returns {number[]} Shuffled array of integers in the range
   */
  intSequence(min = 0, max = 100) {
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
  }
  /**
   * Create a 2D unit p5 vector in a random direction
   * @returns {p5.Vector} Random 2D unit vector
   */
  random2DVector() {
    let v = createVector(1, 0);
    let h = this.random() * TWO_PI;
    v.setHeading(h);
    return v;
  }
  /**
   * Fast Poisson Disk Sampling
   * Based on the example from Coding Train
   * https://thecodingtrain.com/challenges/33-poisson-disc-sampling
   * @param {number} inWidth - Width of the sampling area
   * @param {number} inHeight - Height of the sampling area
   * @param {number} inRadius - Minimum distance between points
   * @returns {p5.Vector[]} Array of points generated using Poisson disk sampling
   */
  poissonDisk(inWidth, inHeight, inRadius) {
    let r = inRadius;
    let nrSamples = 30;
    let grid = [];
    let w = r / Math.sqrt(2);
    let active = [];
    let cols, rows;
    let ordered = [];
    let nrTries = 20;

    //  create reference grid
    cols = Math.floor(inWidth / w);
    rows = Math.floor(inHeight / w);
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
        let randIndex = Math.floor(this.random(active.length));
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
                  let dx = sample.x - neighbor.x;
                  let dy = sample.y - neighbor.y;
                  let d = Math.sqrt(dx * dx + dy * dy);
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
    ordered = ordered.filter((n) => n !== undefined);

    return ordered;
  }
}
