//
//  color options and defaults
//
// Toko.prototype.DEFAULT_COLOR_OPTIONS = {
//   reverse: false,          - whether the scale should be reversed
//   domain: [0, 1],          - the value range to which the palette is mapped
//   mode: 'rgb',             - color interpolation mode
//   gamma: 1,                - gamma adjustment
//   correctLightness: false, - adjust the range to ensure even lightness
//   bezier: false,           - whether to use bezier interpolation (does not work that well)
//   stepped: false           - whether the scale should be smooth or stepped
//   steps: 10                - number of steps in the scale. Only used if stepped is true
//   nrColors: 10             - number of colors used to create the color list array
//   useSortOrder: false      - Use any predefined sort order
//   constrainContrast: fals  - limit the range of predefined contrast colors
//   nrDuotones: 5            - number of duotones generated in the palette
// }

//
//  returned color object
//
//  o = {
//    scale,                  - function that returns an interpolated color in hex based on a value within the range.
//                                useOriginal - boolean to use original color palette
//    scaleChroma,            - function is the original Chroma color scale object. Normally not used.
//    originalScale,          - function that returns a color from the original set based on a value within the range.
//    contrastColors,         - array of 2 contrast colors based on the ends of the range.
//    backgroundColor         - color: first of the contrast colors
//    drawColor               - color: second of the contrast colors
//    duotones                - array of 5 color combinations ordered from high to low contrast. Each:
//                                backgroundColor
//                                drawColor
//                                contrast - number defining the contrast between the colors
//    originalColors,         - array of original palette colors. Length of the array varies with palette.
//    randomColor,            - function that provides a random color in the full palette.
//                                useOriginal - boolean to use original color palette
//                                shift - {h,s,l} object that determines the random shift in hue, saturation and lightness
//                                        each value has a range between 0 and 1
//    randomOriginalColor,    - function that provides a random color from the original palette.
//                                shift - {h,s,l} object that determines the random shift in hue, saturation and lightness
//                                        each value has a range between 0 and 1
//    list,                   - list of interpolated colors. Number of colors is defined in the options object.
//    options,                - the options provided/used for the creation of the object.
//  }
//

import Toko from '../core/main';

//
//  get color scales based on a palette name
//
Toko.prototype.getColorScale = function (inPalette, colorOptions) {
  let o = this._getColorScale(inPalette, colorOptions);
  return o;
};

//
//  create color scales based on a set of colors in an array
//
Toko.prototype.createColorScale = function (colorSet, colorOptions, extraColors) {
  let o = this._createColorScale(colorSet, colorOptions, extraColors);
  return o;
};

//
// create a list of modes that is easy for TweakPane to use
//
Toko.prototype.getColorModeList = function () {
  return this.formatForTweakpane(this.MODELIST);
};

//
//  get the previous palette based on the type and isPrimary status. Loops at the beginning
//
Toko.prototype.getNextPalette = function (inPalette, paletteType = 'all', justPrimary = true) {
  return this._getAnotherPalette(inPalette, paletteType, justPrimary, 1);
};

//
//  get the next palette based on the type and isPrimary status. Loops at the end
//
Toko.prototype.getPreviousPalette = function (inPalette, paletteType = 'all', justPrimary = true) {
  return this._getAnotherPalette(inPalette, paletteType, justPrimary, -1);
};

//
//  get a random palette
//
Toko.prototype.getRandomPalette = function (inPalette, paletteType = 'all', justPrimary = true) {
  return this._getRandomPalette(inPalette, paletteType, justPrimary);
};

//
//  find a specific palette by name
//
Toko.prototype.findPaletteByName = function (paletteName) {
  if (!this.initColorDone) {
    this._initColor();
  }
  var p = this.palettes.filter(p => p.name === paletteName)[0];
  if (p === undefined) {
    console.log('palette not found: ' + paletteName);
  }
  return p;
};

//
//  get a list of palettes based on type and isPrimary status
//
Toko.prototype.getPaletteList = function (paletteType = 'all', justPrimary = true, sorted = false) {
  let filtered = this._getPaletteListRaw(paletteType, justPrimary, sorted);
  return this.formatForTweakpane(filtered, 'name');
};

//
//  get a selection of palettes based on a comma seperated list
//
Toko.prototype.getPaletteSelection = function (selectionList, justPrimary = false, sorted = false) {
  let filtered = this._getPaletteSelectionRaw(selectionList, justPrimary, sorted);
  return this.formatForTweakpane(filtered, 'name');
};
