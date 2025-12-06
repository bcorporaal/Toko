import { libraryState } from '../../core/state.js';

/**
 * Toggle the library's default background color to the next color in the predefined palette
 * Cycles through a set of predefined colors: red, teal, blue, and green
 * @example
 * // Toggle to next background color
 * toko.toggleLibraryBackground();
 */
export function toggleLibraryBackground () {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
  const currentIndex = colors.indexOf(libraryState.defaultColor);
  const nextIndex = (currentIndex + 1) % colors.length;
  libraryState.defaultColor = colors[nextIndex];
}
