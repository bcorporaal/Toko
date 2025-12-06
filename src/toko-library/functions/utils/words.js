// words.js
import { ADJECTIVES, NOUNS } from '../../config/wordList';
/**
 * Pick a random adjective from the predefined list
 * Note: Uses Math.random() instead of seeded random to avoid filename conflicts
 * @returns {string} A random adjective from the word list
 * @example
 * // Get a random adjective
 * const adj = toko.randomAdjective();
 * console.log(adj); // e.g., 'mysterious'
 */
export function randomAdjective () {
  return ADJECTIVES[Math.floor(ADJECTIVES.length * Math.random())];
}

/**
 * Pick a random noun from the predefined list
 * Note: Uses Math.random() instead of seeded random to avoid filename conflicts
 * @returns {string} A random noun from the word list
 * @example
 * // Get a random noun
 * const noun = toko.randomNoun();
 * console.log(noun); // e.g., 'mountain'
 */
export function randomNoun () {
  return NOUNS[Math.floor(NOUNS.length * Math.random())];
}

/**
 * Generate a creative filename with timestamp, verb, and random words
 * @param {string} [extension='svg'] - File extension to append, or 'none' for no extension
 * @param {string} [verb='sketched'] - Action verb to include in the filename
 * @returns {string} Generated filename in format: YYYYMMDD_verb_the_adjective_adjective_noun.extension
 * @example
 * // Generate a basic filename
 * const filename = toko.generateFilename();
 * console.log(filename); // e.g., '20241201_sketched_the_mysterious_blue_mountain.svg'
 *
 * // Generate filename with custom verb and extension
 * const custom = toko.generateFilename('png', 'painted');
 * console.log(custom); // e.g., '20241201_painted_the_ancient_golden_forest.png'
 */
export function generateFilename (extension = 'svg', verb = 'sketched') {
  const adj1 = randomAdjective();
  const adj2 = randomAdjective();
  const noun = randomNoun();

  const timestamp = _getTimeStamp();
  const baseFilename = `${timestamp}_${verb}_the_${adj1}_${adj2}_${noun}`;

  return extension && extension !== 'none' ? `${baseFilename}.${extension}` : baseFilename;
}

/**
 * Generate a timestamp string in YYYYMMDD format
 * @returns {string} Current date formatted as YYYYMMDD
 * @example
 * // Get current timestamp
 * const timestamp = toko._getTimeStamp();
 * console.log(timestamp); // e.g., '20241201'
 */
export function _getTimeStamp () {
  // Get the current date
  const d = new Date();

  // Destructure to get year, month, and day
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(d.getDate()).padStart(2, '0'); // Ensures two-digit day

  // Return formatted timestamp
  return `${year}${month}${day}`;
}
