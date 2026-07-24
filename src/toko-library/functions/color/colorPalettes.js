import { libraryState } from '../../core/state.js';
import * as constants from '../../config/constants.js';
import allPalettes from '../../color-palettes/index.js';
import { easeLinear } from '../math/easing.js';
import { isDebugLogEnabled } from '../../../shared/util/debug.js';
import chroma from '../../../../assets/js/chroma/3.2.0/chroma.min.cjs';
import { RNG } from '../../classes/rng.js';
import { cubicBezier } from '../../classes/cubicBezier.js';

export var COLOR_COLLECTIONS = [];
export var COLOR_PALETTES = allPalettes;

/**
 * Constrain a value between a minimum and maximum
 * Local implementation to avoid dependency on p5.js
 * @param {number} value - The value to constrain
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Constrained value
 */
function _constrain (value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Initialize the color system and preprocess all palettes
 * This function must be called before using any color palette functions
 * @example
 * // Initialize color system (usually called automatically)
 * toko.initColor();
 */
export function initColor () {
  _preprocessPalettes();
  libraryState.initColorDone = true;
}

//
//  validate incoming color options
//
export function _validateColorOptions (colorOptions) {
  // merge with default options (copy defaults to avoid mutating the shared object)
  let defaults = Object.assign({}, constants.DEFAULT_COLOR_OPTIONS, { easing: easeLinear });
  colorOptions = Object.assign({}, defaults, colorOptions);

  // add a new RNG if none was defined
  if (colorOptions.rng == undefined) {
    colorOptions.rng = new RNG();
  }

  // set the options validated, so it is not needlessly checked multiple times
  colorOptions._validated = true;

  return colorOptions;
}

//
// Create a colorscale based on a set of colors with useful functions
//
export function _createColorScale (colorSet, colorOptions, extraColors) {
  if (!libraryState.initColorDone) {
    initColor();
  }
  let sc, oSC;
  let o = {};

  if (colorOptions._validated != true) {
    colorOptions = _validateColorOptions(colorOptions);
  }

  let contrastColors = _defineContrastColors(colorSet, extraColors, colorOptions.constrainContrast);

  // reverse input colors
  if (colorOptions.reverse) {
    colorSet.reverse();
  }

  // create a scale
  sc = chroma.scale(colorSet).domain([0, 1]).mode(colorOptions.mode);

  // scale mapped to the original array of colors
  oSC = chroma.scale(colorSet).domain([0, 1]).classes(colorSet.length);

  // only adjust gamma if needed
  if (colorOptions.gamma != 1) {
    sc.gamma(colorOptions.gamma);
  }

  if (colorOptions.stepped && colorOptions.steps > 0) {
    sc = sc.classes(colorOptions.steps);
  }

  // check domain and turn on remapping if it is not [0,1]
  o.domain = colorOptions.domain;
  if (colorOptions.domain[0] !== 0 || colorOptions.domain[1] !== 1) {
    o.remapDomain = true;
  } else {
    o.remapDomain = false;
  }

  // store additional options
  o.scaleChroma = sc;
  o.contrastColors = contrastColors;
  o.options = colorOptions;
  o.originalColors = colorSet;
  o.list = sc.colors(colorOptions.nrColors);

  // set easing function for the scale
  if (colorOptions.useEasing) {
    let par = colorOptions.easingParameters;
    o.easing = cubicBezier(par[0], par[1], par[2], par[3]);
  } else {
    o.easing = i => {
      return i;
    };
  }

  // function to return a color on the scale
  o.scale = (i, useOriginal = false) => {
    if (o.remapDomain) {
      i = map(i, o.domain[0], o.domain[1], 0, 1);
    }

    let ie = o.easing(i);

    if (!useOriginal) {
      return sc(ie).hex();
    } else {
      return oSC(ie).hex();
    }
  };

  // function to return the original scale
  o.originalScale = i => {
    return oSC(i).hex();
  };

  // return a random color from the set
  o.randomColor = (useOriginal = false, shift = { h: 0, s: 0, l: 0 }) => {
    let c;
    let r = colorOptions.rng.random();

    if (!useOriginal) {
      c = sc(r).hex();
    } else {
      c = oSC(r).hex();
    }

    if (shift.h != 0 || shift.s != 0 || shift.l != 0) {
      let cShifted = chroma(c).hsl();
      cShifted[0] = cShifted[0] + colorOptions.rng.random(-shift.h * 360, shift.h * 360);
      cShifted[1] = cShifted[1] + colorOptions.rng.random(-shift.s, shift.s);
      cShifted[2] = cShifted[2] + colorOptions.rng.random(-shift.l, shift.l);
      c = chroma.hsl(cShifted[0], cShifted[1], cShifted[2]).hex();
    }

    return c;
  };

  // return a random color from the original set
  o.randomOriginalColor = (shift = { h: 0, s: 0, l: 0 }) => {
    let r = colorOptions.rng.random();
    let c = oSC(r).hex();

    if (shift.h != 0 || shift.s != 0 || shift.l != 0) {
      let cShifted = chroma(c).hsl();
      cShifted[0] = cShifted[0] + colorOptions.rng.random(-shift.h * 360, shift.h * 360);
      cShifted[1] = cShifted[1] + colorOptions.rng.random(-shift.s, shift.s);
      cShifted[2] = cShifted[2] + colorOptions.rng.random(-shift.l, shift.l);
      c = chroma.hsl(cShifted[0], cShifted[1], cShifted[2]).hex();
    }

    return c;
  };

  // return an appropriate background color
  o.backgroundColor = (flip = false) => {
    let cc = flip ? 1 : 0;
    return contrastColors[cc];
  };

  // return an appropriate draw or foreground color
  o.drawColor = (flip = false) => {
    let cc = flip ? 0 : 1;
    return contrastColors[cc];
  };

  // store a set of duotones
  o.duotones = _findDuotones(o.originalColors, colorOptions.nrDuotones, colorOptions.reverse);

  // return the complete color object
  return o;
}

export function _getColorScale (inPalette, colorOptions) {
  if (!libraryState.initColorDone) {
    initColor();
  }

  if (colorOptions._validated != true) {
    colorOptions = _validateColorOptions(colorOptions);
  }

  let p, colorSet;
  let o = {};
  let extraColors = [];

  if (typeof inPalette === 'object') {
    colorSet = [...inPalette];
  } else if (typeof inPalette === 'string') {
    p = findPaletteByName(inPalette);

    if (!p) {
      console.error('Toko: palette not found: ' + inPalette);
      return o;
    }

    //
    //  TO DO - currently this does not work
    //
    if ('sortOrder' in p && colorOptions.useSortOrder) {
      if (isDebugLogEnabled(libraryState)) console.log('sorting because sortOrder is available and sort is true');
      colorSet = [p.colors.length];
      for (let i = 0; i < p.colors.length; i++) {
        colorSet[i] = p.colors[p.sortOrder[i] - 1];
      }
    } else {
      colorSet = [...p.colors]; // clone the array to not mess up the original
    }

    if ('stroke' in p) {
      extraColors.push(p.stroke);
    }
    if ('background' in p) {
      extraColors.push(p.background);
    }
  } else {
    console.error('ERROR: palette should be a string or an array');
  }
  o = _createColorScale(colorSet, colorOptions, extraColors);

  return o;
}

//
//  get the next or previous palette
//
export function _getAnotherPalette (inPalette, paletteType = 'all', justPrimary = true, direction = 1) {
  let tempPaletteList = _getPaletteListRaw(paletteType, justPrimary);
  var i = tempPaletteList.findIndex(p => p.name === inPalette);
  if (i === -1) {
    console.warn('palette not found: ' + inPalette);
    return inPalette;
  } else {
    i += direction;
  }

  if (i >= tempPaletteList.length - 1) {
    i = 0;
  } else if (i < 0) {
    i = tempPaletteList.length - 1;
  }

  return tempPaletteList[i].name;
}

//
//  get a random palette
//
export function _getRandomPalette (inPalette, paletteType = 'all', justPrimary = true) {
  if (!libraryState.initColorDone) {
    initColor();
  }
  let tempPaletteList = _getPaletteListRaw(paletteType, justPrimary);

  // using the internal RNG
  var randomPalette = tempPaletteList[Math.floor(libraryState.RNG.random() * tempPaletteList.length)];

  return randomPalette.name;
}

//
//  get set of palettes with a specific type or primary state
//
export function _getPaletteListRaw (paletteType = 'all', justPrimary = true, sorted) {
  if (!libraryState.initColorDone) {
    initColor();
  }
  let filtered;
  if (paletteType !== 'all') {
    filtered = COLOR_PALETTES.filter(p => p.type === paletteType);
  } else {
    filtered = [...COLOR_PALETTES];
  }

  if (justPrimary) {
    filtered = filtered.filter(p => p.isPrimary);
  }

  //
  //  sort if requested
  //
  if (sorted) {
    filtered = _sortPaletteList(filtered);
  }

  return filtered;
}

//
//  get a selection of palettes based on name or type
//
export function _getPaletteSelectionRaw (selectionList, justPrimary, sorted) {
  if (!libraryState.initColorDone) {
    initColor();
  }
  // to lowercase and strip spaces
  selectionList = selectionList.toLowerCase().replace(/\s/g, '');
  let labels = selectionList.split(',');
  let filtered = [];
  for (let i = 0; i < labels.length; i++) {
    filtered = filtered.concat(COLOR_PALETTES.filter(p => p.name.toLowerCase() === labels[i] || p.type === labels[i]));
  }
  if (justPrimary) {
    filtered = filtered.filter(p => p.isPrimary);
  }
  //
  //  sort if requested
  //
  if (sorted) {
    filtered = _sortPaletteList(filtered);
  }

  return filtered;
}

//
//  sort palette list alphabetically
//
export function _sortPaletteList (paletteList) {
  paletteList.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  return paletteList;
}

export function _defineContrastColors (colorSet, extraColors, constrainContrast = false) {
  //
  // make contrast colors from colors from both ends of the scale
  //
  // 0 is the light background and 1 is the dark background
  //
  let contrastColors = [];
  let hsl = [];
  let lightContrastSet = false;
  let darkContrastSet = false;
  let n = colorSet.length;
  let lightH, lightS, lightL;
  let darkH, darkS, darkL;

  //
  //  adjustment factors
  //
  //  dark - saturation
  let ds = {
    shift: 0,
    factor: 1.25,
    max: 0.8,
    min: 0.15,
  };
  //  dark - lightness
  let dl = {
    shift: -0.1,
    factor: 0.7,
    max: 0.09,
    min: 0.05,
  };
  //
  //  light - saturation
  let ls = {
    shift: 0,
    factor: 0.8,
    max: 0.25,
    min: 0.1,
  };
  //  light - lightness
  let ll = {
    shift: 0,
    factor: 1.2,
    max: 0.95,
    min: 0.9,
  };

  //
  //  sort colors from light to dark
  //
  let tempColors = [...colorSet];
  let sortedColorSet = tempColors.sort((a, b) => chroma(b).hsl()[2] - chroma(a).hsl()[2]);

  //
  //  parse provided extra colors – if there are more then two the last dark and light are used
  //
  if (Array.isArray(extraColors) && extraColors.length) {
    extraColors.forEach(c => {
      let l = chroma(c).hsl()[2];
      if (l > 0.5) {
        contrastColors[0] = c;
        lightContrastSet = true;
      } else {
        contrastColors[1] = c;
        darkContrastSet = true;
      }
    });

    //
    //  if requested constrain the contrast colors
    //
    if (constrainContrast) {
      hsl = chroma(contrastColors[0]).hsl();
      lightH = hsl[0];
      lightS = _constrain((hsl[1] - ls.shift) * ls.factor, ls.min, ls.max);
      lightL = _constrain((hsl[2] - ll.shift) * ll.factor, ll.min, ll.max);
      contrastColors[0] = chroma.hsl(lightH, lightS, lightL).hex();

      hsl = chroma(contrastColors[1]).hsl();
      darkH = hsl[0];
      darkS = _constrain((hsl[1] + ds.shift) * ds.factor, ds.min, ds.max);
      darkL = _constrain((hsl[2] + dl.shift) * dl.factor, dl.min, dl.max);
      contrastColors[1] = chroma.hsl(darkH, darkS, darkL).hex();
    }
  }

  //
  //  generate contrast colors by adjusting the saturation and lightness of the lightest and darkest color
  //
  if (!lightContrastSet) {
    hsl = chroma(sortedColorSet[0]).hsl();
    lightH = hsl[0];
    lightS = _constrain((hsl[1] - ls.shift) * ls.factor, ls.min, ls.max);
    lightL = _constrain((hsl[2] - ll.shift) * ll.factor, ll.min, ll.max);
    contrastColors[0] = chroma.hsl(lightH, lightS, lightL).hex();
  }
  if (!darkContrastSet) {
    hsl = chroma(sortedColorSet[n - 1]).hsl();
    darkH = hsl[0];
    darkS = _constrain((hsl[1] + ds.shift) * ds.factor, ds.min, ds.max);
    darkL = _constrain((hsl[2] + dl.shift) * dl.factor, dl.min, dl.max);
    contrastColors[1] = chroma.hsl(darkH, darkS, darkL).hex();
  }

  // check and flip order if needed
  if (chroma(contrastColors[0]).hsl()[2] < chroma(contrastColors[1]).hsl()[2]) {
    contrastColors.reverse();
  }

  return contrastColors;
}

//
//  from a palette create a set of color combinations
//
export function _findDuotones (inPalette, minLength, reverse) {
  let nrColors = inPalette.length;
  let duotones = [];

  for (let i = 0; i < nrColors; i++) {
    for (let j = i + 1; j < nrColors; j++) {
      let c1 = inPalette[i];
      let c2 = inPalette[j];

      let contrast = chroma.contrast(c1, c2);

      //
      //  arrange colors by luminance
      //
      let cB, cA;
      let lum1 = chroma(c1).hsl()[2];
      let lum2 = chroma(c2).hsl()[2];

      if (reverse) {
        cA = lum1 < lum2 ? c1 : c2;
        cB = lum1 < lum2 ? c2 : c1;
      } else {
        cA = lum1 > lum2 ? c1 : c2;
        cB = lum1 > lum2 ? c2 : c1;
      }

      duotones.push({
        colors: [cA, cB],
        backgroundColor: cA,
        drawColor: cB,
        contrast: contrast,
      });
    }
  }

  //  sort from high to low
  duotones.sort((a, b) => b.contrast - a.contrast);

  //  interleave from start and middle
  //  [1,2,3,4,5,6] -> [1,4,2,5,3,6]
  const n = duotones.length;
  const mid = Math.floor(n / 2);
  const interleaved = [];
  for (let i = 0; i < mid; i++) {
    interleaved.push(duotones[i]);
    interleaved.push(duotones[i + mid]);
  }
  //  handle uneven lists
  if (n % 2 !== 0) {
    interleaved.push(duotones[n - 1]);
  }

  duotones = [...interleaved];

  //
  //  add copies to lengthen the array
  //
  while (duotones.length < minLength) {
    duotones = duotones.concat(duotones);
  }

  //
  //  reduce to required length and return
  //
  return duotones.slice(0, minLength);
}

export function _preprocessPalettes () {
  // Process palettes
  allPalettes.forEach(o => {
    if (o.isPrimary == undefined) {
      o.isPrimary = true;
    }
    COLOR_COLLECTIONS.push(o.type);
  });

  COLOR_COLLECTIONS = [...new Set(COLOR_COLLECTIONS)];
}

//////////////////////////////

/**
 * Get color scale based on a palette name
 * @param {string} inPalette - Name of the palette to use
 * @param {Object} [colorOptions] - Color options object for customization
 * @returns {Object} Color scale object with interpolation functions
 * @example
 * // Get a basic color scale
 * const scale = toko.getColorScale('viridis');
 * const color = scale.getColor(0.5);
 *
 * // Get color scale with custom options
 * const customScale = toko.getColorScale('viridis', {
 *   steps: 10,
 *   easing: toko.easeInOutQuad
 * });
 */
export function getColorScale (inPalette, colorOptions) {
  let o = _getColorScale(inPalette, colorOptions);
  return o;
}

/**
 * Create color scale based on a custom set of colors
 * @param {string[]} colorSet - Array of color strings (hex, rgb, etc.)
 * @param {Object} [colorOptions] - Color options object for customization
 * @param {string[]} [extraColors] - Additional colors for contrast and variations
 * @returns {Object} Color scale object with interpolation functions
 * @example
 * // Create scale from custom colors
 * const colors = ['#ff0000', '#00ff00', '#0000ff'];
 * const scale = toko.createColorScale(colors);
 *
 * // Create scale with extra contrast colors
 * const extraColors = ['#ffffff', '#000000'];
 * const scaleWithContrast = toko.createColorScale(colors, {}, extraColors);
 */
export function createColorScale (colorSet, colorOptions, extraColors) {
  let o = _createColorScale(colorSet, colorOptions, extraColors);
  return o;
}

/**
 * Get a list of color modes formatted for Tweakpane
 * @returns {Object} Object with color mode names as keys and values
 * @example
 * // Get color modes for Tweakpane
 * const modes = toko.getColorModeList();
 * // Returns: { 'linear': 'linear', 'bezier': 'bezier', ... }
 */
export function getColorModeList () {
  return formatForTweakpane(constants.COLOR_MODE_LIST);
}

/**
 * Get the next palette in sequence based on type and primary status
 * @param {string} inPalette - Current palette name
 * @param {string} [paletteType='all'] - Type of palettes to cycle through
 * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
 * @returns {string} Name of the next palette in sequence
 * @example
 * // Get next palette
 * const next = toko.getNextPalette('viridis');
 *
 * // Get next palette of specific type
 * const nextWarm = toko.getNextPalette('viridis', 'warm', true);
 */
export function getNextPalette (inPalette, paletteType = 'all', justPrimary = true) {
  return _getAnotherPalette(inPalette, paletteType, justPrimary, 1);
}

/**
 * Get the previous palette in sequence based on type and primary status
 * @param {string} inPalette - Current palette name
 * @param {string} [paletteType='all'] - Type of palettes to cycle through
 * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
 * @returns {string} Name of the previous palette in sequence
 * @example
 * // Get previous palette
 * const prev = toko.getPreviousPalette('viridis');
 *
 * // Get previous palette of specific type
 * const prevCool = toko.getPreviousPalette('viridis', 'cool', true);
 */
export function getPreviousPalette (inPalette, paletteType = 'all', justPrimary = true) {
  return _getAnotherPalette(inPalette, paletteType, justPrimary, -1);
}

/**
 * Get a random palette based on type and primary status
 * @param {string} inPalette - Current palette name (used for type filtering)
 * @param {string} [paletteType='all'] - Type of palettes to choose from
 * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
 * @returns {string} Name of a random palette
 * @example
 * // Get random palette
 * const random = toko.getRandomPalette('viridis');
 *
 * // Get random palette of specific type
 * const randomWarm = toko.getRandomPalette('viridis', 'warm', true);
 */
export function getRandomPalette (inPalette, paletteType = 'all', justPrimary = true) {
  return _getRandomPalette(inPalette, paletteType, justPrimary);
}

/**
 * Find a specific palette by name
 * @param {string} paletteName - Name of the palette to find
 * @returns {Object|undefined} Palette object if found, undefined otherwise
 * @example
 * // Find a specific palette
 * const palette = toko.findPaletteByName('viridis');
 * if (palette) {
 *   console.log('Found palette:', palette.name);
 * }
 */
export function findPaletteByName (paletteName) {
  if (!libraryState.initColorDone) {
    initColor();
  }
  var p = COLOR_PALETTES.filter(p => p.name === paletteName)[0];
  if (p === undefined) {
    console.warn('palette not found: ' + paletteName);
  }
  return p;
}

/**
 * Get a list of palettes formatted for Tweakpane based on type and primary status
 * @param {string} [paletteType='all'] - Type of palettes to include
 * @param {boolean} [justPrimary=true] - Whether to only include primary palettes
 * @param {boolean} [sorted=false] - Whether to sort the palette list
 * @returns {Object} Object with palette names as keys and values for Tweakpane
 * @example
 * // Get all palettes for Tweakpane
 * const palettes = toko.getPaletteList();
 *
 * // Get only warm primary palettes
 * const warmPalettes = toko.getPaletteList('warm', true, true);
 */
export function getPaletteList (paletteType = 'all', justPrimary = true, sorted = false) {
  let filtered = _getPaletteListRaw(paletteType, justPrimary, sorted);
  return formatForTweakpane(filtered, 'name');
}

/**
 * Get a selection of palettes based on a comma-separated list of names
 * @param {string} selectionList - Comma-separated list of palette names
 * @param {boolean} [justPrimary=false] - Whether to only include primary palettes
 * @param {boolean} [sorted=false] - Whether to sort the palette list
 * @returns {Object} Object with selected palette names as keys and values for Tweakpane
 * @example
 * // Get specific palettes
 * const selection = toko.getPaletteSelection('viridis,plasma,inferno');
 *
 * // Get specific palettes with sorting
 * const sortedSelection = toko.getPaletteSelection('viridis,plasma,inferno', false, true);
 */
export function getPaletteSelection (selectionList, justPrimary = false, sorted = false) {
  let filtered = _getPaletteSelectionRaw(selectionList, justPrimary, sorted);
  return formatForTweakpane(filtered, 'name');
}

/**
 * Format a list of objects or strings for use with Tweakpane
 * @param {Array} inList - Array of objects or strings to format
 * @param {string} [propertyName] - Property name to extract from objects (if objects)
 * @returns {Object} Object formatted for Tweakpane with keys and values
 * @example
 * // Format string array for Tweakpane
 * const modes = toko.formatForTweakpane(['linear', 'bezier', 'cubic']);
 * // Returns: { 'linear': 'linear', 'bezier': 'bezier', 'cubic': 'cubic' }
 *
 * // Format object array for Tweakpane
 * const palettes = toko.formatForTweakpane(paletteArray, 'name');
 */
export function formatForTweakpane (inList, propertyName) {
  let o = {};

  if (typeof propertyName == 'string') {
    inList.forEach(function (m) {
      o[m[propertyName]] = m[propertyName];
    });
  } else {
    inList.forEach(function (m) {
      o[m] = m;
    });
  }

  return o;
}

/**
 * Get all color palettes
 * @returns {Array} Array of all palette objects with name, colors, type, etc.
 * @example
 * // Get all palettes
 * const palettes = toko.getAllPalettes();
 * palettes.forEach(p => console.log(p.name, p.colors));
 */
export function getAllPalettes () {
  if (!libraryState.initColorDone) {
    initColor();
  }
  return COLOR_PALETTES;
}

/**
 * Get all collection types
 * @returns {Array} Array of collection type strings (e.g., 'basic', 'cako', etc.)
 * @example
 * // Get all collection types
 * const collections = toko.getCollections();
 * // Returns: ['basic', 'cako', 'colourscafe', ...]
 */
export function getCollections () {
  if (!libraryState.initColorDone) {
    initColor();
  }
  return COLOR_COLLECTIONS;
}
