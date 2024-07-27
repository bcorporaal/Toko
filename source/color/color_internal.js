import Toko from '../core/main';

import basicPalettes from '../color_palettes/basic';
import cakoPalettes from '../color_palettes/cako';
import colourscafePalettes from '../color_palettes/colourscafe';
import d3Palettes from '../color_palettes/d3';
import dalePalettes from '../color_palettes/dale';
import ducciPalettes from '../color_palettes/ducci';
import duotonePalettes from '../color_palettes/duotone';
import expositoPalettes from '../color_palettes/exposito';
import flourishPalettes from '../color_palettes/flourish';
import golidmiscPalettes from '../color_palettes/golidmisc';
import hildaPalettes from '../color_palettes/hilda';
import iivonenPalettes from '../color_palettes/iivonen';
import judsonPalettes from '../color_palettes/judson';
import jungPalettes from '../color_palettes/jung';
import kovecsesPalettes from '../color_palettes/kovecses';
import mayoPalettes from '../color_palettes/mayo';
import metBrewerPalettes from '../color_palettes/metBrewer';
import ranganathPalettes from '../color_palettes/ranganath';
import rohlfsPalettes from '../color_palettes/rohlfs';
import roygbivsPalettes from '../color_palettes/roygbivs';
import spatialPalettes from '../color_palettes/spatial';
import systemPalettes from '../color_palettes/system';
import tsuchimochiPalettes from '../color_palettes/tsuchimochi';
import tundraPalettes from '../color_palettes/tundra';
import orbifoldPalettes from '../color_palettes/orbifold';
import lospecPalettes from '../color_palettes/lospec';

Toko.prototype.MAX_COLORS_BEZIER = 5; // maximum number of colors for which bezier works well
Toko.prototype.COLOR_COLLECTIONS = [];
Toko.prototype.MODELIST = ['rgb', 'lrgb', 'lab', 'hsl', 'lch'];
Toko.prototype.EXTRA_SPECTRAL_COLORS = 25;

Toko.prototype.DEFAULT_COLOR_OPTIONS = {
  reverse: false,
  domain: [0, 1],
  mode: 'rgb',
  gamma: 1,
  correctLightness: false,
  useSpectral: true,
  bezier: false,
  stepped: false,
  steps: 10,
  nrColors: 10,
  useSortOrder: false,
  constrainContrast: false,
  nrDuotones: 12,
};

Toko.prototype.initColorDone = false;

//
//  init everything
//
Toko.prototype._initColor = function () {
  this._preprocessPalettes();
};

//
//  validate incoming color options
//
Toko.prototype._validateColorOptions = function (colorOptions) {
  //
  // merge with default options
  //
  colorOptions = Object.assign({}, this.DEFAULT_COLOR_OPTIONS, colorOptions);

  //
  //  add defoult RNG if none was defined
  //
  if (colorOptions.rng == undefined) {
    colorOptions.rng = this._rng;
  }

  //
  // don't use bezier for more than a preset number of colors
  //
  if (colorOptions.bezier && colorOptions.length > this.MAX_COLORS_BEZIER) {
    console.log(`INFO: Bezier does not work for more than $MAX_COLORS_BEZIER} colors`);
    colorOptions.bezier = false;
  }

  //
  // set to validated, so it is not needlessly checked multiple times
  //
  colorOptions._validated = true;

  return colorOptions;
};

Toko.prototype._createColorScale = function (colorSet, colorOptions, extraColors) {
  if (!this.initColorDone) {
    this._initColor();
  }
  let sc, oSC, eSC, expandedColorSet;
  let o = {};

  if (colorOptions._validated != true) {
    colorOptions = this._validateColorOptions(colorOptions);
  }

  let contrastColors = this._defineContrastColors(colorSet, extraColors, colorOptions.constrainContrast);

  //
  // reverse input colors
  //
  if (colorOptions.reverse) {
    colorSet.reverse();
  }

  //
  // create a scale with bezier or use standard options
  //
  if (colorOptions.bezier) {
    sc = chroma.bezier(colorSet).scale();
  } else {
    sc = chroma.scale(colorSet).domain(colorOptions.domain).mode(colorOptions.mode);
  }

  //
  // scale mapped to the original array of colors
  //
  oSC = chroma.scale(colorSet).domain(colorOptions.domain).classes(colorSet.length);

  //
  //  expand color set using Spectral
  //
  expandedColorSet = this._expandColorSet(colorSet);
  eSC = chroma.scale(expandedColorSet).domain(colorOptions.domain).mode(colorOptions.mode);

  //
  // only adjust gamma if needed
  //
  if (colorOptions.gamma != 1) {
    sc.gamma(colorOptions.gamma);
    eSC.gamma(colorOptions.gamma);
  }

  //
  // this does not work well with varied palettes so avoid
  //
  if (colorOptions.correctLightness) {
    sc = sc.correctLightness();
    eSC = eSC.correctLightness();
  }

  if (colorOptions.stepped && colorOptions.steps > 0) {
    sc = sc.classes(colorOptions.steps);
    eSC = eSC.classes(colorOptions.steps);
  }

  o.scaleChroma = sc;
  o.scaleSpectral = eSC;
  o.contrastColors = contrastColors;
  o.options = colorOptions;
  o.originalColors = colorSet;

  if (colorOptions.useSpectral) {
    o.list = eSC.colors(colorOptions.nrColors);
  } else {
    o.list = sc.colors(colorOptions.nrColors);
  }

  if (colorOptions.useSpectral) {
    o.scale = (i, useOriginal = false) => {
      if (!useOriginal) {
        return eSC(i).hex();
      } else {
        return oSC(i).hex();
      }
    };
  } else {
    o.scale = (i, useOriginal = false) => {
      if (!useOriginal) {
        return sc(i).hex();
      } else {
        return oSC(i).hex();
      }
    };
  }

  o.originalScale = i => {
    return oSC(i).hex();
  };

  o.randomColor = (useOriginal = false, shift = { h: 0, s: 0, l: 0 }) => {
    let r = colorOptions.rng.random();
    let d = colorOptions.domain;
    let c;
    if (!useOriginal) {
      c = sc(d[0] + r * (d[1] - d[0])).hex();
    } else {
      c = oSC(d[0] + r * (d[1] - d[0])).hex();
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

  o.randomOriginalColor = (shift = { h: 0, s: 0, l: 0 }) => {
    let r = colorOptions.rng.random();
    let d = colorOptions.domain;
    let c = oSC(d[0] + r * (d[1] - d[0])).hex();

    if (shift.h != 0 || shift.s != 0 || shift.l != 0) {
      let cShifted = chroma(c).hsl();
      cShifted[0] = cShifted[0] + colorOptions.rng.random(-shift.h * 360, shift.h * 360);
      cShifted[1] = cShifted[1] + colorOptions.rng.random(-shift.s, shift.s);
      cShifted[2] = cShifted[2] + colorOptions.rng.random(-shift.l, shift.l);
      c = chroma.hsl(cShifted[0], cShifted[1], cShifted[2]).hex();
    }

    return c;
  };

  o.backgroundColor = (flip = false) => {
    let cc = flip ? 1 : 0;
    return contrastColors[cc];
  };

  o.drawColor = (flip = false) => {
    let cc = flip ? 0 : 1;
    return contrastColors[cc];
  };

  o.duotones = this._findDuotones(o.originalColors, colorOptions.nrDuotones, colorOptions.reverse);

  return o;
};

//
//  from a palette create a set of color combinations
//
Toko.prototype._findDuotones = function (inPalette, minLength, reverse) {
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
    if (i + mid < n) {
      interleaved.push(duotones[i + mid]);
    }
  }
  duotones = [...interleaved];

  //
  //  copy items if there are fewer than minLength
  //
  if (duotones.length < minLength) {
    let needed = minLength - duotones.length;
    while (needed > 0) {
      let itemsToCopy = Math.min(duotones.length, needed);
      duotones.push(...duotones.slice(0, itemsToCopy));
      needed -= itemsToCopy;
    }
  }

  return duotones.slice(0, minLength);
};

Toko.prototype._expandColorSet = function (inColorSet) {
  let newColorSet = [];
  let n = inColorSet.length;

  newColorSet.push(inColorSet[0]);
  for (let i = 1; i < n; i++) {
    let c0 = inColorSet[i - 1];
    let c1 = inColorSet[i];
    let extraColors = spectral.palette(c0, c1, this.EXTRA_SPECTRAL_COLORS);
    extraColors = extraColors.slice(0, -1);
    newColorSet = newColorSet.concat(extraColors);
  }
  newColorSet.push(inColorSet[n - 1]);

  return newColorSet;
};

Toko.prototype._getColorScale = function (inPalette, colorOptions) {
  if (!this.initColorDone) {
    this._initColor();
  }

  if (colorOptions._validated != true) {
    colorOptions = this._validateColorOptions(colorOptions);
  }

  let p, colorSet;
  let o = {};
  let extraColors = [];

  if (typeof inPalette === 'object') {
    colorSet = [...inPalette];
  } else if (typeof inPalette === 'string') {
    p = this.findPaletteByName(inPalette);

    //
    //  TO DO - currently this does not work
    //
    if ('sortOrder' in p && colorOptions.useSortOrder) {
      console.log('sorting because sortOrder is available and sort is true');
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
    console.log('ERROR: palette should be a string or an array');
  }
  o = this._createColorScale(colorSet, colorOptions, extraColors);

  return o;
};

//
//  get the next or previous palette
//
Toko.prototype._getAnotherPalette = function (inPalette, paletteType = 'all', justPrimary = true, direction = 1) {
  let tempPaletteList = this._getPaletteListRaw(paletteType, justPrimary);
  var i = tempPaletteList.findIndex(p => p.name === inPalette);
  if (i === undefined) {
    console.log('palette not found: ' + inPalette);
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
};

//
//  get a random palette
//
Toko.prototype._getRandomPalette = function (inPalette, paletteType = 'all', justPrimary = true) {
  if (!this.initColorDone) {
    this._initColor();
  }
  let tempPaletteList = this._getPaletteListRaw(paletteType, justPrimary);

  var randomPalette = tempPaletteList[Math.floor(colorOptions.rng.random() * tempPaletteList.length)];

  return randomPalette.name;
};

//
//  get set of palettes with a specific type or primary state
//
Toko.prototype._getPaletteListRaw = function (paletteType = 'all', justPrimary = true, sorted) {
  if (!this.initColorDone) {
    this._initColor();
  }
  let filtered = this.palettes;
  if (paletteType !== 'all') {
    filtered = this.palettes.filter(p => p.type === paletteType);
  }

  if (justPrimary) {
    filtered = filtered.filter(p => p.isPrimary);
  }

  //
  //  sort if requested
  //
  if (sorted) {
    filtered = this._sortPaletteList(filtered);
  }

  return filtered;
};

//
//  get a selection of palettes based on name or type
//
Toko.prototype._getPaletteSelectionRaw = function (selectionList, justPrimary, sorted) {
  if (!this.initColorDone) {
    this._initColor();
  }
  // to lowercase and strip spaces
  selectionList = selectionList.toLowerCase().replace(/\s/g, '');
  let labels = selectionList.split(',');
  let filtered = [];
  for (let i = 0; i < labels.length; i++) {
    filtered = filtered.concat(this.palettes.filter(p => p.name.toLowerCase() === labels[i] || p.type === labels[i]));
  }
  if (justPrimary) {
    filtered = filtered.filter(p => p.isPrimary);
  }
  //
  //  sort if requested
  //
  if (sorted) {
    filtered = this._sortPaletteList(filtered);
  }

  return filtered;
};

//
//  sort palette list alphabetically
//
Toko.prototype._sortPaletteList = function (paletteList) {
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
};

Toko.prototype._preprocessPalettes = function () {
  //
  //  combine palettes
  //
  this.palettes = basicPalettes.concat(
    cakoPalettes,
    colourscafePalettes,
    d3Palettes,
    dalePalettes,
    ducciPalettes,
    duotonePalettes,
    expositoPalettes,
    flourishPalettes,
    golidmiscPalettes,
    hildaPalettes,
    iivonenPalettes,
    judsonPalettes,
    jungPalettes,
    kovecsesPalettes,
    lospecPalettes,
    mayoPalettes,
    metBrewerPalettes,
    orbifoldPalettes,
    ranganathPalettes,
    rohlfsPalettes,
    roygbivsPalettes,
    spatialPalettes,
    systemPalettes,
    tsuchimochiPalettes,
    tundraPalettes,
  );
  //
  //  add missing fields and make list of all palettes
  //
  this.palettes.forEach(o => {
    //
    //  make them primary by default if field is empty
    //
    if (o.isPrimary == undefined) {
      o.isPrimary = true;
    }
    this.COLOR_COLLECTIONS.push(o.type);
  });
  this.COLOR_COLLECTIONS = [...new Set(this.COLOR_COLLECTIONS)];
};

//
// from
// https://observablehq.com/@mbostock/cosine-color-schemes
// http://iquilezles.org/www/articles/palettes/palettes.htm
//
// _interpolateCosine([ar, ag, ab], [br, bg, bb], [cr, cg, cb], [dr, dg, db]) {
// return t => `rgb(${[
//     ar + br * Math.cos(2 * Math.PI * (cr * t + dr)),
//     ag + bg * Math.cos(2 * Math.PI * (cg * t + dg)),
//     ab + bb * Math.cos(2 * Math.PI * (cb * t + db))
// ].map(v => Math.floor(Math.max(0, Math.min(1, v)) * 255))})`;
// }

// interpolateCosineV1 = this._interpolateCosine([0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.00, 0.10, 0.20]);
// interpolateCosineV2 = this._interpolateCosine([0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 1.0], [0.30, 0.20, 0.20]);
// interpolateCosineV3 = this._interpolateCosine([0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 1.0, 0.5], [0.80, 0.90, 0.30]);
// interpolateCosineV4 = this._interpolateCosine([0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [1.0, 0.7, 0.4], [0.00, 0.15, 0.20]);
// interpolateCosineV5 = this._interpolateCosine([0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [2.0, 1.0, 0.0], [0.50, 0.20, 0.25]);
// interpolateCosineV6 = this._interpolateCosine([0.8, 0.5, 0.4], [0.2, 0.4, 0.2], [2.0, 1.0, 1.0], [0.00, 0.25, 0.25]);
// interpolateCosineV7 = this._interpolateCosine([1.000, 0.500, 0.500], [0.500, 0.500, 0.500], [0.750, 1.000, 0.667], [0.800, 1.000, 0.333]);
// interpolateCosineV8 = this._interpolateCosine([0.093, 0.629, 0.825], [0.800, 0.269, 0.087], [0.906, 1.470, 1.544], [5.345, 4.080, 0.694]);

Toko.prototype._defineContrastColors = function (colorSet, extraColors, constrainContrast = false) {
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
    //  if requested constrain the constrast colors
    //
    if (constrainContrast) {
      hsl = chroma(contrastColors[0]).hsl();
      lightH = hsl[0];
      lightS = constrain((hsl[1] - ls.shift) * ls.factor, ls.min, ls.max);
      lightL = constrain((hsl[2] - ll.shift) * ll.factor, ll.min, ll.max);
      contrastColors[0] = chroma.hsl(lightH, lightS, lightL).hex();

      hsl = chroma(contrastColors[1]).hsl();
      darkH = hsl[0];
      darkS = constrain((hsl[1] + ds.shift) * ds.factor, ds.min, ds.max);
      darkL = constrain((hsl[2] + dl.shift) * dl.factor, dl.min, dl.max);
      contrastColors[1] = chroma.hsl(darkH, darkS, darkL).hex();
    }
  }

  //
  //  generate contrast colors by adjusting the saturation and lightness of the lightest and darkest color
  //
  if (!lightContrastSet) {
    hsl = chroma(sortedColorSet[0]).hsl();
    lightH = hsl[0];
    lightS = constrain((hsl[1] - ls.shift) * ls.factor, ls.min, ls.max);
    lightL = constrain((hsl[2] - ll.shift) * ll.factor, ll.min, ll.max);
    contrastColors[0] = chroma.hsl(lightH, lightS, lightL).hex();
  }
  if (!darkContrastSet) {
    hsl = chroma(sortedColorSet[n - 1]).hsl();
    darkH = hsl[0];
    darkS = constrain((hsl[1] + ds.shift) * ds.factor, ds.min, ds.max);
    darkL = constrain((hsl[2] + dl.shift) * dl.factor, dl.min, dl.max);
    contrastColors[1] = chroma.hsl(darkH, darkS, darkL).hex();
  }

  // check and flip order if needed
  if (chroma(contrastColors[0]).hsl()[2] < chroma(contrastColors[1]).hsl()[2]) {
    contrastColors.reverse();
  }

  return contrastColors;
};
