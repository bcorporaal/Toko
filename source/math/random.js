import Toko from '../core/main';

//
// pass through functions for the internal RNG object
//
Toko.prototype.resetRNG = function (seed) {
  this._rng.reset(seed);
};

Toko.prototype.setSeed = function (seed) {
  this._rng.seed = seed;
};

Toko.prototype.getSeed = function () {
  return this._rng.seed;
};

Toko.prototype.nextSeed = function () {
  return this._rng.nextSeed();
};

Toko.prototype.previousSeed = function () {
  return this._rng.previousSeed();
};

Toko.prototype.randomSeed = function () {
  return this._rng.randomSeed();
};

Toko.prototype.resetSeed = function () {
  return this._rng.resetSeed();
};

//
// random number, element from array
//
Toko.prototype.random = function (min, max) {
  return this._rng.random(min, max);
};

//
// random integer
//
Toko.prototype.intRange = function (min = 0, max = 100) {
  return this._rng.intRange(min, max);
};
//
// random boolean
//
Toko.prototype.randomBool = function () {
  return this._rng.randomBool();
};
//
// random charactor from string or lowercase
//
Toko.prototype.randomChar = function (inString = 'abcdefghijklmnopqrstuvwxyz') {
  return this._rng.randomChar(inString);
};
//
// random string from provided string or lowercase
//
Toko.prototype.randomString = function (count = 1, inString = 'abcdefghijklmnopqrstuvwxyz') {
  return this._rng.randomString(count, inString);
};
//
// stepped random number in range
//
Toko.prototype.steppedRandom = function (min = 0, max = 1, step = 0.1) {
  return this._rng.steppedRandom(min, max, step);
};
//
// shuffle array in place
//
Toko.prototype.shuffle = function (inArray) {
  return this._rng.shuffle(inArray);
};
//
// all integers between min and max in random order
//
Toko.prototype.intSequence = function (min = 0, max = 100) {
  return this._rng.intSequence(min, max);
};
//
//  2D unit p5 vector in a random direction
//
Toko.prototype.random2DVector = function () {
  return this._rng.random2DVector();
};
//
//  Poisson Disk sampling
//
Toko.prototype.poissonDisk = function (inWidth, inHeight, inRadius) {
  return this._rng.poissonDisk(inWidth, inHeight, inRadius);
};
