/**
 * Random number generation functions
 *
 * Pass-through functions for the internal RNG object that provide
 * convenient access to seeded random number generation.
 *
 * @namespace Random
 */

import { libraryState } from '../../core/state';

/**
 * Ensure the global RNG is initialized before use
 * @private
 */
function _ensureRNG () {
  if (!libraryState.RNG) {
    throw new Error('Toko: RNG is not initialized. Make sure toko.init() has been called before using random functions.');
  }
}

/**
 * Reset the global RNG with a new seed
 * @param {string} [seed] - New seed string. If not provided, a random seed is generated
 * @returns {string} The validated seed string
 */
export function resetRNG (seed) {
  _ensureRNG();
  libraryState.RNG.reset(seed);
}

/**
 * Set the current seed for the global RNG
 * @param {string} seed - New seed string
 */
export function setSeed (seed) {
  _ensureRNG();
  libraryState.RNG.seed = seed;
}

/**
 * Get the current seed of the global RNG
 * @returns {string} Current seed string
 */
export function getSeed () {
  _ensureRNG();
  return libraryState.RNG.seed;
}

/**
 * Move to the next seed in the seed history
 * @returns {string} The next seed string
 */
export function nextSeed () {
  _ensureRNG();
  return libraryState.RNG.nextSeed();
}

/**
 * Move to the previous seed in the seed history
 * @returns {string} The previous seed string
 */
export function previousSeed () {
  _ensureRNG();
  return libraryState.RNG.previousSeed();
}

/**
 * Generate a new random seed and add it to history
 * @returns {string} The new random seed string
 */
export function randomSeed () {
  _ensureRNG();
  return libraryState.RNG.randomSeed();
}

/**
 * Reset the RNG to the current seed string
 * @returns {string} The current seed string
 */
export function resetSeed () {
  _ensureRNG();
  return libraryState.RNG.resetSeed();
}

/**
 * Generate a random number or select from array
 * @param {number|Array} [min] - If number: minimum value. If array: random element from array
 * @param {number} [max] - Maximum value when min is a number
 * @returns {number|*} Random number or array element
 */
export function random (min, max) {
  _ensureRNG();
  return libraryState.RNG.random(min, max);
}

/**
 * Generate a random integer in a range
 * @param {number} [min=0] - Minimum value (inclusive)
 * @param {number} [max=100] - Maximum value (exclusive)
 * @returns {number} Random integer
 */
export function intRange (min = 0, max = 100) {
  _ensureRNG();
  return libraryState.RNG.intRange(min, max);
}

/**
 * Generate a random boolean value
 * @returns {boolean} Random true or false
 */
export function randomBool () {
  _ensureRNG();
  return libraryState.RNG.randomBool();
}

/**
 * Generate a random character from a string
 * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - String to select from
 * @returns {string} Random character
 */
export function randomChar (inString = 'abcdefghijklmnopqrstuvwxyz') {
  _ensureRNG();
  return libraryState.RNG.randomChar(inString);
}

/**
 * Generate a random string of specified length
 * @param {number} [count=1] - Length of the string
 * @param {string} [inString='abcdefghijklmnopqrstuvwxyz'] - Characters to choose from
 * @returns {string} Random string
 */
export function randomString (count = 1, inString = 'abcdefghijklmnopqrstuvwxyz') {
  _ensureRNG();
  return libraryState.RNG.randomString(count, inString);
}

/**
 * Generate a random number snapped to steps
 * @param {number} [min=0] - Minimum value
 * @param {number} [max=1] - Maximum value
 * @param {number} [step=0.1] - Step size
 * @returns {number} Random number snapped to steps
 */
export function steppedRandom (min = 0, max = 1, step = 0.1) {
  _ensureRNG();
  return libraryState.RNG.steppedRandom(min, max, step);
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * @param {Array} inArray - Array to shuffle
 * @returns {Array} The shuffled array (same reference)
 */
export function shuffle (inArray) {
  _ensureRNG();
  return libraryState.RNG.shuffle(inArray);
}

/**
 * Generate all integers between min and max in random order
 * @param {number} [min=0] - Minimum value (inclusive)
 * @param {number} [max=100] - Maximum value (exclusive)
 * @returns {number[]} Array of integers in random order
 */
export function intSequence (min = 0, max = 100) {
  _ensureRNG();
  return libraryState.RNG.intSequence(min, max);
}

/**
 * Generate a 2D unit vector in a random direction
 * @returns {p5.Vector} Random 2D unit vector
 */
export function random2DVector () {
  _ensureRNG();
  return libraryState.RNG.random2DVector();
}

/**
 * Generate points using Poisson Disk Sampling
 * Creates a set of points that are randomly distributed but maintain
 * a minimum distance from each other
 * @param {number} inWidth - Width of the sampling area
 * @param {number} inHeight - Height of the sampling area
 * @param {number} inRadius - Minimum distance between points
 * @returns {p5.Vector[]} Array of randomly distributed points
 */
export function poissonDisk (inWidth, inHeight, inRadius) {
  _ensureRNG();
  return libraryState.RNG.poissonDisk(inWidth, inHeight, inRadius);
}
