var Toko = (function () {
  'use strict';

  /*!----------------------------------------------------
  //
  //  Toko
  //  expanding p5.js with loads of duct tape
  //
  //  by Bob Corporaal
  //
  //  MIT License
  //
  ----------------------------------------------------
  */

  //
  //  current version
  //
  const VERSION = 'Toko v0.13.0';

  //
  //  Set of standard sizes for the canvas and exports
  //
  const SIZE_DEFAULT = {
    name: 'default',
    width: 800,
    height: 800,
    pixelDensity: 2,
  };

  const SIZE_FULL = {
    name: 'full_window',
    width: 100,
    height: 100,
    pixelDensity: 2,
    fullWindow: true,
  };

  const SIZE_SQUARE_XL = {
    name: 'square_XL',
    width: 1600,
    height: 1600,
    pixelDensity: 2,
  };

  const SIZE_1080P = {
    name: '1080p',
    width: 1920,
    height: 1080,
    pixelDensity: 2,
  };

  const SIZE_1080P_PORTRAIT = {
    name: '1080p_portrait',
    width: 1080,
    height: 1920,
    pixelDensity: 2,
  };

  const SIZE_4K = {
    name: '4K',
    width: 3840,
    height: 2160,
    pixelDensity: 2,
  };

  const SIZE_4K_PORTRAIT = {
    name: '4K_portrait',
    width: 2160,
    height: 3840,
    pixelDensity: 2,
  };

  const SIZE_IPHONE_11_WALLPAPER = {
    name: 'iphone_11',
    width: 1436,
    height: 3113,
    pixelDensity: 1,
  };

  const SIZE_WIDE_SCREEN = {
    name: 'wide_screen',
    width: 2560,
    height: 1440,
    pixelDensity: 1,
  };

  const SIZE_MACBOOK_14_WALLPAPER = {
    name: 'macbook_14',
    width: 3024,
    height: 1964,
    pixelDensity: 1,
  };

  const SIZE_MACBOOK_16_WALLPAPER = {
    name: 'macbook_16',
    width: 3072,
    height: 1920,
    pixelDensity: 1,
  };

  //
  //  List used for the dropdown in the advanced tab
  //
  var SIZES_LIST = {
    default: 'default',
    square_HD: 'square_XL',
    iphone_11: 'iphone_11',
    HD_1080p: '1080p',
    HD_1080p_Portrait: '1080p_portrait',
    wide_screen: 'wide_screen',
    UHD_4K: '4K',
    UHD_4K_Portrait: '4K_portrait',
    macbook_14: 'macbook_14',
    macbook_16: 'macbook_16',
    full_window: 'full_window',
  };

  var SIZES = [
    SIZE_DEFAULT,
    SIZE_FULL,
    SIZE_SQUARE_XL,
    SIZE_1080P,
    SIZE_1080P_PORTRAIT,
    SIZE_4K,
    SIZE_4K_PORTRAIT,
    SIZE_IPHONE_11_WALLPAPER,
    SIZE_WIDE_SCREEN,
    SIZE_MACBOOK_14_WALLPAPER,
    SIZE_MACBOOK_16_WALLPAPER,
  ];

  //
  //  Panel tab
  //
  const TABS_PARAMETERS = 'Parameters';
  const TABS_ADVANCED = 'Size';
  const TABS_FPS = 'FPS';
  const TABS_CAPTURE = 'Record';

  var TAB_ID_CAPTURE = -1;
  var TAB_ID_FPS = -1;
  var TAB_ID_PARAMETERS = 0;
  var TAB_ID_ADVANCED = 1;

  //
  //	Default options for setup
  //
  const DEFAULT_OPTIONS = {
    title: 'untitled sketch',
    showSaveSketchButton: false,
    saveSettingsWithSketch: false,
    acceptDroppedSettings: true,
    acceptDroppedFiles: false,
    sketchElementId: 'sketch-canvas',
    useParameterPanel: true,
    hideParameterPanel: false,
    showAdvancedOptions: false,
    additionalCanvasSizes: [],
    logFPS: false,
    captureFrames: false,
    captureFormat: 'mp4',
    canvasSize: SIZE_DEFAULT,
    seedString: '',
  };

  //
  //  Options for capture
  //
  const CAPTURE_FORMATS = {
    WebM: 'webm',
    MP4: 'mp4',
    PNG: 'png',
    JPG: 'jpg',
    GIF: 'gif',
    WebP: 'webp',
  };

  const CAPTURE_FRAMERATES = {
    15: 15,
    24: 24,
    25: 25,
    30: 30,
    60: 60,
  };

  const DEFAULT_CAPTURE_OPTIONS = {
    format: 'mp4', //  export format
    framerate: 30, //  recording framerate
    bitrate: 5000, // 	recording bitrate in kbps (only available for MP4)
    quality: 0.95, //  recording quality option (only available for WebM/GIF/JPG/WebP)
    width: null, // 	output width. canvas width used as default
    height: null, // 	output height. canvas height used as default
    duration: null, // 	maximum recording duration in number of frames
    autoSaveDuration: null, //  automatically downloads every n frames. convenient for long captures
    disableUi: true, //  hide the ui
    beforeDownload: (blob, context, next) => {
      toko.resetCapture(); // used to ensure the reset always happens
      next();
    },
    baseFilename: date => {
      return toko.filenameCapture();
    },
    // used by Toko but not by p5.capture
    captureFixedNrFrames: false,
    nrFrames: 0,
    estimate: '0',
  };

  //
  //  Parameters to calculate frames per second
  //
  const FPS_FILTER_STRENGTH = 40;
  const FRAME_TIME = 16;

  //
  //  easing parameters
  //
  const EASE_LINEAR = 'Linear';
  const EASE_SMOOTH = 'InOutSmoother';
  const EASE_QUAD = 'Quad';
  const EASE_CUBIC = 'Cubic';
  const EASE_QUART = 'Quart';
  const EASE_QUINT = 'Quint';
  const EASE_EXPO = 'Expo';
  const EASE_CIRC = 'Circ';
  const EASE_ELASTIC = 'Elastic';
  const EASE_BOUNCE = 'Bounce';
  const EASE_BACK = 'Back';

  const EASE_IN = 'In';
  const EASE_OUT = 'Out';
  const EASE_IN_OUT = 'InOut';

  var constants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CAPTURE_FORMATS: CAPTURE_FORMATS,
    CAPTURE_FRAMERATES: CAPTURE_FRAMERATES,
    DEFAULT_CAPTURE_OPTIONS: DEFAULT_CAPTURE_OPTIONS,
    DEFAULT_OPTIONS: DEFAULT_OPTIONS,
    EASE_BACK: EASE_BACK,
    EASE_BOUNCE: EASE_BOUNCE,
    EASE_CIRC: EASE_CIRC,
    EASE_CUBIC: EASE_CUBIC,
    EASE_ELASTIC: EASE_ELASTIC,
    EASE_EXPO: EASE_EXPO,
    EASE_IN: EASE_IN,
    EASE_IN_OUT: EASE_IN_OUT,
    EASE_LINEAR: EASE_LINEAR,
    EASE_OUT: EASE_OUT,
    EASE_QUAD: EASE_QUAD,
    EASE_QUART: EASE_QUART,
    EASE_QUINT: EASE_QUINT,
    EASE_SMOOTH: EASE_SMOOTH,
    FPS_FILTER_STRENGTH: FPS_FILTER_STRENGTH,
    FRAME_TIME: FRAME_TIME,
    SIZES: SIZES,
    SIZES_LIST: SIZES_LIST,
    SIZE_1080P: SIZE_1080P,
    SIZE_1080P_PORTRAIT: SIZE_1080P_PORTRAIT,
    SIZE_4K: SIZE_4K,
    SIZE_4K_PORTRAIT: SIZE_4K_PORTRAIT,
    SIZE_DEFAULT: SIZE_DEFAULT,
    SIZE_FULL: SIZE_FULL,
    SIZE_IPHONE_11_WALLPAPER: SIZE_IPHONE_11_WALLPAPER,
    SIZE_MACBOOK_14_WALLPAPER: SIZE_MACBOOK_14_WALLPAPER,
    SIZE_MACBOOK_16_WALLPAPER: SIZE_MACBOOK_16_WALLPAPER,
    SIZE_SQUARE_XL: SIZE_SQUARE_XL,
    SIZE_WIDE_SCREEN: SIZE_WIDE_SCREEN,
    TABS_ADVANCED: TABS_ADVANCED,
    TABS_CAPTURE: TABS_CAPTURE,
    TABS_FPS: TABS_FPS,
    TABS_PARAMETERS: TABS_PARAMETERS,
    TAB_ID_ADVANCED: TAB_ID_ADVANCED,
    TAB_ID_CAPTURE: TAB_ID_CAPTURE,
    TAB_ID_FPS: TAB_ID_FPS,
    TAB_ID_PARAMETERS: TAB_ID_PARAMETERS,
    VERSION: VERSION
  });

  //
  //  Word lists from various sources.
  //  Used to create random file names for the exports
  //
  //  Sources (among others and random additions)
  //  https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors
  //  https://github.com/Atrox/haikunatorjs - BSD-3-Clause license
  //
  const ADJECTIVES = [
    'adorable',
    'aged',
    'alert',
    'alien',
    'analog',
    'ancient',
    'animated',
    'aqua',
    'astro',
    'atomic',
    'autumn',
    'bashful',
    'batty',
    'bemused',
    'billowing',
    'bitter',
    'bittersweet',
    'black',
    'blue',
    'bold',
    'bouncing',
    'bright',
    'broad',
    'broken',
    'bronze',
    'calm',
    'carbon',
    'carefree',
    'caribbean',
    'chestnut',
    'cold',
    'cool',
    'cosmic',
    'crimson',
    'crunchy',
    'curly',
    'daffy',
    'daft',
    'damp',
    'dark',
    'dawn',
    'deep',
    'delicate',
    'descending',
    'divine',
    'dotted',
    'droll',
    'dry',
    'easy',
    'elastic',
    'electric',
    'elegant',
    'empty',
    'enigmatic',
    'epic',
    'excited',
    'fabulous',
    'falling',
    'fancy',
    'fatal',
    'flat',
    'floral',
    'fragrant',
    'frenzied',
    'fresh',
    'frolicsome',
    'frosty',
    'fuzzy',
    'gentle',
    'glassy',
    'glitter',
    'glorious',
    'green',
    'grunge',
    'hidden',
    'holy',
    'iced',
    'icy',
    'idiosyncratic',
    'imaginary',
    'impressive',
    'indigo',
    'ingenious',
    'inquisitive',
    'jolly',
    'joyful',
    'late',
    'lazy',
    'lingering',
    'little',
    'lively',
    'long',
    'lopsided',
    'loud',
    'lucky',
    'magic',
    'maroon',
    'marvelous',
    'maximum',
    'melodramatic',
    'metal',
    'middle',
    'misty',
    'mixed',
    'morning',
    'muddy',
    'mute',
    'mystic',
    'nameless',
    'neon',
    'new',
    'nifty',
    'noisy',
    'nonchalant',
    'odd',
    'old',
    'orange',
    'outlandish',
    'outrageous',
    'pacific',
    'patient',
    'permanent',
    'petite',
    'pixelated',
    'plain',
    'plucky',
    'polished',
    'proud',
    'purple',
    'quiet',
    'radical',
    'rambunctious',
    'rapid',
    'raspy',
    'red',
    'reflective',
    'restless',
    'rough',
    'round',
    'royal',
    'rusted',
    'rustic',
    'rusty',
    'scarlet',
    'scatterbrained',
    'shining',
    'shiny',
    'shocking',
    'shy',
    'silent',
    'silly',
    'small',
    'smokey',
    'snowy',
    'snug',
    'soft',
    'solitary',
    'sparkling',
    'spiked',
    'spiky',
    'spring',
    'square',
    'steel',
    'steep',
    'still',
    'sturdy',
    'summer',
    'super',
    'sweet',
    'throbbing',
    'thrumming',
    'tight',
    'tiny',
    'transparent',
    'tricky',
    'tropical',
    'twilight',
    'unassuming',
    'vibrant',
    'wandering',
    'warm',
    'weathered',
    'white',
    'wild',
    'winter',
    'wispy',
    'withered',
    'wondrous',
    'yellow',
    'yodeling',
    'young',
    'zealous',
  ];

  const NOUNS = [
    'adventure',
    'air',
    'alchemy',
    'art',
    'avocado',
    'band',
    'bar',
    'base',
    'basket',
    'bay',
    'beauty',
    'being',
    'belt',
    'bird',
    'bison',
    'block',
    'bloom',
    'blue',
    'boat',
    'bonus',
    'bottle',
    'box',
    'bread',
    'breeze',
    'brook',
    'bunny',
    'bush',
    'butterfly',
    'cake',
    'canary',
    'cell',
    'cherry',
    'clear',
    'clock',
    'cloud',
    'cookie',
    'coral',
    'cotton',
    'credit',
    'crocodile',
    'curry',
    'cyan',
    'daisy',
    'dance',
    'dandelion',
    'darkness',
    'dawn',
    'deep',
    'desert',
    'dew',
    'diamond',
    'dinosaur',
    'discovery',
    'disk',
    'dragon',
    'dream',
    'duck',
    'duke',
    'dusk',
    'dust',
    'eden',
    'experience',
    'explosion',
    'feather',
    'feelings',
    'field',
    'fiesta,',
    'fire',
    'firefly',
    'flamingo',
    'flow',
    'flower',
    'foam',
    'fog',
    'forest',
    'fox',
    'fresco',
    'frog',
    'frost',
    'fruitbat',
    'future',
    'gallery',
    'glade',
    'glass',
    'glitter',
    'glow',
    'goose',
    'grass',
    'green',
    'grey',
    'hall',
    'hamster',
    'hat',
    'haze',
    'heart',
    'hill',
    'ice',
    'igloo',
    'island',
    'jungle',
    'king',
    'lab',
    'lake',
    'leaf',
    'light',
    'lime',
    'limit',
    'lobster',
    'log',
    'love',
    'machine',
    'math',
    'meadow',
    'mist',
    'mode',
    'moon',
    'moose',
    'morning',
    'mountain',
    'mouse',
    'mud',
    'muse',
    'nation',
    'night',
    'nights',
    'oasis',
    'obscura',
    'ocean',
    'operation',
    'orchid',
    'owl',
    'paint',
    'panda',
    'pandemonium',
    'paper',
    'paradise',
    'pearl',
    'penguin',
    'perspective',
    'pine',
    'pirate',
    'pizza',
    'plank',
    'poetry',
    'pond',
    'powdered',
    'prince',
    'princess',
    'pura',
    'queen',
    'rain',
    'rainbow',
    'rapids',
    'recipe',
    'resonance',
    'revival',
    'rice',
    'river',
    'rocket',
    'rose',
    'salad',
    'scene',
    'sea',
    'shadow',
    'shape',
    'shark',
    'silence',
    'sky',
    'smoke',
    'snow',
    'snowflake',
    'sound',
    'space',
    'spaceship',
    'sparkle',
    'splash',
    'spoon',
    'spray',
    'spring',
    'squeeze',
    'star',
    'statue',
    'stroke',
    'sun',
    'sunset',
    'surf',
    'tango',
    'term',
    'thing',
    'thunder',
    'ticket',
    'tiger',
    'tint',
    'toast',
    'tooth',
    'toy',
    'tree',
    'trumpet',
    'truth',
    'umbrella',
    'union',
    'unit',
    'velvet',
    'verde',
    'view',
    'violet',
    'vitale',
    'voice',
    'void',
    'volcano',
    'vortex',
    'water',
    'waterfall',
    'waters',
    'wave',
    'weasel',
    'whisper',
    'wildflower',
    'wind',
    'window',
    'winter',
    'wish',
    'wizard',
    'wood',
    'woodpecker',
    'zing',
  ];

  var words = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ADJECTIVES: ADJECTIVES,
    NOUNS: NOUNS
  });

  class Toko {
    constructor () {
      for (const k in constants) {
        this[k] = constants[k];
      }

      for (const k in words) {
        this[k] = words[k];
      }

      //
      //  preseed the random function
      //
      this._rng = new Toko.RNG();

      console.log(this.VERSION);

      //
      //  set the default options for P5Capture.
      //  this needs to happen before the p5 setup.
      //
      P5Capture.setDefaultOptions(this.DEFAULT_CAPTURE_OPTIONS);
    }
  }

  //

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

  var basicPalettes = [
    {
      name: 'logical',
      colors: ['#F7A13D', '#54ADFD', '#FE766C', '#112264', '#005BF7', '#FC0340'],
      stroke: '#21202E',
      background: '#F8F8F8',
      isPrimary: true,
      type: 'basic',
    },
    {
      name: '12bitRainbow', // source: https://iamkate.com/data/12-bit-rainbow/
      colors: ['#817', '#a35', '#c66', '#e94', '#ed0', '#9d5', '#4d8', '#2cb', '#0bc', '#09c', '#36b', '#639'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'lighthouse',
      colors: ['#FF0A39', '#11C3EF', '#117092', '#E7F6FE'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'darkSands',
      colors: ['#f2e9e4', '#c9ada7', '#9a8c98', '#4a4e69', '#22223b'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'indianSummer',
      colors: ['#3c2706', '#7A5649', '#CC3904', '#e5cf0a'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'summer',
      colors: ['#f5f02b', '#19AAD1'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'fadedRainbow',
      colors: ['#ef476f', '#f78c6b', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'mellowGreen',
      colors: ['#c6dabf', '#88d498', '#1a936f', '#114b5f'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'sunsetBeach',
      colors: ['#ea7317', '#fec601', '#73bfb8', '#3da5d9', '#2364aa'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'justBlack',
      colors: ['#000', '#000'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'justWhite',
      colors: ['#FFF', '#FFF'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'greyhound',
      colors: ['#696969', '#696969', '#696969', '#00A6B5'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'almostBlack',
      colors: ['#202020', '#404040'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'blackWhite',
      colors: ['#FFF', '#000'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'fullRainbow',
      colors: [
        '#1B1334',
        '#262A4A',
        '#00545A',
        '#027350',
        '#08C383',
        '#AAD962',
        '#FBBF46',
        '#EF6A32',
        '#ED0445',
        '#A12A5E',
        '#710262',
        '#110141',
      ],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'pastel',
      colors: ['#F7884B', '#E87A7A', '#B8609A', '#8F64B0', '#7171C4', '#5381E3', '#41ADD4', '#5CB592'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'brightBeach',
      colors: ['#1873D3', '#1237A1', '#00017A', '#FFDE00', '#FFB900'],
      isPrimary: false,
      type: 'basic',
    },
    // colors from d3
    {
      name: 'paired',
      colors: [
        '#A6CEE3',
        '#1F78B4',
        '#B2DF8A',
        '#33A02C',
        '#FB9A99',
        '#E31A1C',
        '#FDBF6F',
        '#FF7F00',
        '#CAB2D6',
        '#6A3D9A',
        '#FFFF99',
        '#B15928',
      ],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'sand',
      colors: ['#FCE29C', '#FCD67A', '#F0B46C', '#D59262', '#B47457', '#81514B', '#4C3C45'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'natural',
      colors: ['#F5C41E', '#F3B607', '#EC8E1E', '#8D9655', '#3E7D58', '#13404E'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'sweet',
      colors: ['#10BBB1', '#398A9B', '#DF1260', '#9D246F', '#401469'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'westCoast',
      colors: ['#D9CCC0', '#F19D1A', '#DC306A', '#7E245A', '#398589', '#093578', '#0F1A5E'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'mountain',
      colors: ['#8BBDD3', '#5396BA', '#D55F32', '#8D0805'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'freshCut',
      colors: ['#00B7D0', '#51CBD5', '#BCE849', '#A0CA00'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'mintHoney',
      colors: ['#434635', '#526D51', '#A5B17F', '#F0BF20', '#5F2A00'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'fluor',
      colors: ['#beeb00', '#D7F654', '#D3E0EA', '#8FABC1', '#507089', '#2a465c'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'district2',
      colors: ['#2A2955', '#382855', '#762754', '#E12955', '#FC2956'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'lemonade',
      colors: ['#C51645', '#C3144C', '#D34C53', '#F0AA64', '#F7C265'],
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'soft',
      colors: ['#F2F5E7', '#EBDED1', '#E5B5B7', '#D68097', '#B06683', '#705771', '#294353', '#0B3039'],
      isPrimary: false,
      type: 'basic',
    },
    {
      name: 'donut',
      colors: ['#FFB7BC', '#FF5181', '#FFCF49', '#FFA43F', '#5CCAEF'],
      isPrimary: true,
      type: 'basic',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var cakoPalettes = [
    {
      name: 'cako1',
      colors: ['#000000', '#d55a3a', '#2a5c8a', '#7e7d14', '#dbdac9'],
      stroke: '#000000',
      background: '#f4e9d5',
      type: 'cako',
    },
    {
      name: 'cako2',
      colors: ['#dbdac9', '#d55a3a', '#2a5c8a', '#b47b8c', '#7e7d14'],
      stroke: '#000000',
      background: '#000000',
      type: 'cako',
    },
    {
      name: 'cako2_sub1',
      colors: ['#dbdac9', '#d55a3a', '#2a5c8a'],
      stroke: '#000000',
      background: '#000000',
      type: 'cako',
    },
    {
      name: 'cako2_sub2',
      colors: ['#dbdac9', '#d55a3a', '#7e7d14'],
      stroke: '#000000',
      background: '#000000',
      type: 'cako',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var colourscafePalettes = [
    {
      name: 'cc239',
      colors: ['#e3dd34', '#78496b', '#f0527f', '#a7e0e2'],
      background: '#e0eff0',
      type: 'colourscafe',
    },
    {
      name: 'cc234',
      colors: ['#ffce49', '#ede8dc', '#ff5736', '#ff99b4'],
      background: '#f7f4ed',
      type: 'colourscafe',
    },
    {
      name: 'cc232',
      colors: ['#5c5f46', '#ff7044', '#ffce39', '#66aeaa'],
      background: '#e9ecde',
      type: 'colourscafe',
    },
    {
      name: 'cc238',
      colors: ['#553c60', '#ffb0a0', '#ff6749', '#fbe090'],
      background: '#f5e9de',
      type: 'colourscafe',
    },
    {
      name: 'cc242',
      colors: ['#bbd444', '#fcd744', '#fa7b53', '#423c6f'],
      background: '#faf4e4',
      type: 'colourscafe',
    },
    {
      name: 'cc245',
      colors: ['#0d4a4e', '#ff947b', '#ead3a2', '#5284ab'],
      background: '#f6f4ed',
      type: 'colourscafe',
    },
    {
      name: 'cc273',
      colors: ['#363d4a', '#7b8a56', '#ff9369', '#f4c172'],
      background: '#f0efe2',
      type: 'colourscafe',
    },
  ];

  //
  //  color palettes from D3
  //  see https://observablehq.com/@d3/color-schemes
  //
  var d3Palettes = [
    {
      name: 'brownGreen',
      colors: [
        '#543005',
        '#7c480a',
        '#a1661b',
        '#c28c3d',
        '#d9b671',
        '#ebd7a4',
        '#f4ead0',
        '#eef1ea',
        '#d2ece8',
        '#a8ddd5',
        '#75c3b8',
        '#429f96',
        '#197b73',
        '#045a51',
        '#003c30',
      ],
      id: 'interpolateBrBG',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'greys',
      colors: [
        '#ffffff',
        '#f6f6f6',
        '#ececec',
        '#dfdfdf',
        '#d1d1d1',
        '#c0c0c0',
        '#acacac',
        '#979797',
        '#828282',
        '#6e6e6e',
        '#5b5b5b',
        '#444444',
        '#2c2c2c',
        '#151515',
        '#000000',
      ],
      id: 'interpolateGreys',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'inferno',
      colors: [
        '#000004',
        '#0d0829',
        '#280b53',
        '#470b6a',
        '#65156e',
        '#82206c',
        '#9f2a63',
        '#bc3754',
        '#d44842',
        '#e8602d',
        '#f57d15',
        '#fc9f07',
        '#fac228',
        '#f3e55d',
        '#fcffa4',
      ],
      id: 'interpolateInferno',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'magma',
      colors: [
        '#000004',
        '#0c0926',
        '#221150',
        '#400f74',
        '#5f187f',
        '#7b2382',
        '#982d80',
        '#b73779',
        '#d3436e',
        '#eb5760',
        '#f8765c',
        '#fd9a6a',
        '#febb81',
        '#fddc9e',
        '#fcfdbf',
      ],
      id: 'interpolateMagma',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'plasma',
      colors: [
        '#0d0887',
        '#350498',
        '#5302a3',
        '#6f00a8',
        '#8b0aa5',
        '#a31e9a',
        '#b83289',
        '#cc4778',
        '#db5c68',
        '#e97158',
        '#f48849',
        '#fba238',
        '#febd2a',
        '#fada24',
        '#f0f921',
      ],
      id: 'interpolatePlasma',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'puBuGn',
      colors: [
        '#fff7fb',
        '#f4ebf5',
        '#e7e0ef',
        '#d7d6e9',
        '#c3cbe3',
        '#aac0dc',
        '#8bb4d6',
        '#69a8cf',
        '#4b9bc5',
        '#2e8fb4',
        '#14859a',
        '#057b7c',
        '#016d61',
        '#015b4a',
        '#014636',
      ],
      id: 'interpolatePuBuGn',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'rainbow',
      colors: [
        '#6e40aa',
        '#a83cb3',
        '#df40a1',
        '#ff507a',
        '#ff704e',
        '#f89b31',
        '#d2c934',
        '#aff05b',
        '#6bf75c',
        '#34f07e',
        '#1bd9ac',
        '#1fb3d3',
        '#3988e1',
        '#585fd2',
        '#6e40aa',
      ],
      id: 'interpolateRainbow',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'RedPurple',
      colors: [
        '#fff7f3',
        '#feeae6',
        '#fddcd8',
        '#fcccc9',
        '#fbb9be',
        '#faa3b6',
        '#f887ac',
        '#f369a3',
        '#e74a9b',
        '#d42d92',
        '#bb1386',
        '#9f047d',
        '#820177',
        '#650171',
        '#49006a',
      ],
      id: 'interpolateRdPu',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'sinebow',
      colors: [
        '#ff4040',
        '#f27616',
        '#cfae01',
        '#9cdd06',
        '#63f922',
        '#30fe51',
        '#0de989',
        '#00bfbf',
        '#0d89e9',
        '#3051fe',
        '#6322f9',
        '#9c06dd',
        '#cf01ae',
        '#f21676',
        '#ff4040',
      ],
      id: 'interpolateSinebow',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'spectral',
      colors: [
        '#9e0142',
        '#c42c4a',
        '#e1524a',
        '#f3784c',
        '#fba35e',
        '#fdca79',
        '#fee89a',
        '#fbf8b0',
        '#ebf7a6',
        '#ccea9f',
        '#a0d9a3',
        '#72c3a7',
        '#4ba0b1',
        '#4478b2',
        '#5e4fa2',
      ],
      id: 'interpolateSpectral',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'turbo',
      colors: [
        '#23171b',
        '#4a44bc',
        '#4076f5',
        '#2ca6f1',
        '#26d0cd',
        '#37ed9f',
        '#5ffc73',
        '#95fb51',
        '#cbe839',
        '#f5c72b',
        '#ff9b21',
        '#fb6919',
        '#d6390f',
        '#a81604',
        '#900c00',
      ],
      id: 'interpolateTurbo',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'viridis',
      colors: [
        '#440154',
        '#481b6d',
        '#46327e',
        '#3f4788',
        '#365c8d',
        '#2e6e8e',
        '#277f8e',
        '#21918c',
        '#1fa187',
        '#2db27d',
        '#4ac16d',
        '#73d056',
        '#a0da39',
        '#d0e11c',
        '#fde725',
      ],
      id: 'interpolateViridis',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'YlGnBu',
      colors: [
        '#ffffd9',
        '#f4fbc3',
        '#e5f5b6',
        '#d0ecb4',
        '#b0e0b6',
        '#8ad2ba',
        '#65c3bf',
        '#45b4c2',
        '#2ea0c1',
        '#2288ba',
        '#216daf',
        '#2353a2',
        '#213c93',
        '#182b79',
        '#081d58',
      ],
      id: 'interpolateYlGnBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'YlOrBr',
      colors: [
        '#ffffe5',
        '#ffface',
        '#fff3b6',
        '#fee89c',
        '#fed97d',
        '#fec75b',
        '#feb140',
        '#fb992c',
        '#f3821d',
        '#e66b12',
        '#d45708',
        '#bc4604',
        '#a03804',
        '#832e05',
        '#662506',
      ],
      id: 'interpolateYlOrBr',
      isPrimary: true,
      type: 'd3',
    },
    {
      name: 'YlOrRd',
      colors: [
        '#ffffcc',
        '#fff5b3',
        '#ffea9a',
        '#fede82',
        '#fecd6a',
        '#feb855',
        '#fea246',
        '#fd893c',
        '#fc6932',
        '#f64828',
        '#e92a21',
        '#d71420',
        '#c00624',
        '#a20126',
        '#800026',
      ],
      id: 'interpolateYlOrRd',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'blueGreen',
      colors: [
        '#f7fcfd',
        '#ecf8fa',
        '#e1f3f5',
        '#d2eeeb',
        '#bce6dd',
        '#a0dbcc',
        '#83cfb9',
        '#68c2a3',
        '#51b68a',
        '#3da76f',
        '#2b9554',
        '#19833f',
        '#097030',
        '#015b25',
        '#00441b',
      ],
      id: 'interpolateBuGn',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'bluePurple',
      colors: [
        '#f7fcfd',
        '#eaf3f8',
        '#dae7f1',
        '#c8daea',
        '#b6cce3',
        '#a4bedb',
        '#97abd1',
        '#8f95c6',
        '#8c7dba',
        '#8b65ae',
        '#894da2',
        '#863293',
        '#7d1a7f',
        '#690a67',
        '#4d004b',
      ],
      id: 'interpolateBuPu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'cividis',
      colors: [
        '#002051',
        '#032d66',
        '#173a6d',
        '#30476e',
        '#48546d',
        '#5d616e',
        '#706e71',
        '#7f7c75',
        '#8e8978',
        '#9e9878',
        '#b1a775',
        '#c6b76c',
        '#ddc75f',
        '#f1d851',
        '#fdea45',
      ],
      id: 'interpolateCividis',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'cool',
      colors: [
        '#6e40aa',
        '#654ec0',
        '#585fd2',
        '#4973dd',
        '#3988e1',
        '#2b9ede',
        '#1fb3d3',
        '#1ac7c2',
        '#1bd9ac',
        '#24e695',
        '#34f07e',
        '#4df56a',
        '#6bf75c',
        '#8cf457',
        '#aff05b',
      ],
      id: 'interpolateCool',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'cubeHelix',
      colors: [
        '#000000',
        '#170d22',
        '#1a2442',
        '#15434f',
        '#1b6145',
        '#387434',
        '#6a7b30',
        '#a07949',
        '#c77b7b',
        '#d588b5',
        '#cda3e1',
        '#c2c4f3',
        '#c6e1f1',
        '#def4ef',
        '#ffffff',
      ],
      id: 'interpolateCubehelixDefault',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'greenBlue',
      colors: [
        '#f7fcf0',
        '#eaf7e4',
        '#ddf2d8',
        '#d1edcc',
        '#c1e7c1',
        '#acdfbb',
        '#94d6bc',
        '#7bcbc4',
        '#62bdcb',
        '#4aaccc',
        '#3597c4',
        '#2182b9',
        '#116dac',
        '#095799',
        '#084081',
      ],
      id: 'interpolateGnBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'orangeRed',
      colors: [
        '#fff7ec',
        '#feeed7',
        '#fee5c1',
        '#fdd9ab',
        '#fdcc97',
        '#fdbc86',
        '#fca771',
        '#fa8e5d',
        '#f4764f',
        '#ea5c40',
        '#dd3f2b',
        '#cc2317',
        '#b60c08',
        '#9c0101',
        '#7f0000',
      ],
      id: 'interpolateOrRd',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'plasma',
      colors: [
        '#0d0887',
        '#350498',
        '#5302a3',
        '#6f00a8',
        '#8b0aa5',
        '#a31e9a',
        '#b83289',
        '#cc4778',
        '#db5c68',
        '#e97158',
        '#f48849',
        '#fba238',
        '#febd2a',
        '#fada24',
        '#f0f921',
      ],
      id: 'interpolatePlasma',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'purpleBlue',
      colors: [
        '#fff7fb',
        '#f4eef6',
        '#e7e3f0',
        '#d7d7e9',
        '#c3cbe3',
        '#abc0dc',
        '#90b4d6',
        '#72a8cf',
        '#519ac6',
        '#308bbe',
        '#167ab3',
        '#086aa5',
        '#045c90',
        '#034b76',
        '#023858',
      ],
      id: 'interpolatePuBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'purpleRed',
      colors: [
        '#f7f4f9',
        '#eee8f3',
        '#e4d9eb',
        '#dac5e0',
        '#d1afd5',
        '#ce98c9',
        '#d37fbd',
        '#dd63ae',
        '#e2449a',
        '#e02a81',
        '#d31967',
        '#bd0d53',
        '#a00444',
        '#830133',
        '#67001f',
      ],
      id: 'interpolatePuRd',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'RdBu',
      colors: [
        '#67001f',
        '#9a1429',
        '#c0383b',
        '#da6a57',
        '#ee9a7c',
        '#f8c3a9',
        '#fae1d3',
        '#f2efee',
        '#dae9f1',
        '#b5d7e8',
        '#85bcd9',
        '#539bc7',
        '#3079b4',
        '#195693',
        '#053061',
      ],
      id: 'interpolateRdBu',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'warm',
      colors: [
        '#6e40aa',
        '#8a3eb2',
        '#a83cb3',
        '#c53dad',
        '#df40a1',
        '#f4468f',
        '#ff507a',
        '#ff5e63',
        '#ff704e',
        '#ff843d',
        '#f89b31',
        '#e6b32e',
        '#d2c934',
        '#bfde43',
        '#aff05b',
      ],
      id: 'interpolateWarm',
      isPrimary: false,
      type: 'd3',
    },
    {
      name: 'YlGn',
      colors: [
        '#ffffe5',
        '#fafdcd',
        '#f0f9b8',
        '#e1f3a9',
        '#ccea9d',
        '#b2df91',
        '#96d385',
        '#78c578',
        '#59b669',
        '#3fa45a',
        '#2b904b',
        '#197d40',
        '#096b39',
        '#015931',
        '#004529',
      ],
      id: 'interpolateYlGn',
      isPrimary: false,
      type: 'd3',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var dalePalettes = [
    {
      name: 'dale_paddle',
      colors: ['#ff7a5a', '#765aa6', '#fee7bc', '#515e8c', '#ffc64a', '#b460a6', '#ffffff', '#4781c1'],
      stroke: '#000000',
      background: '#abe9e8',
      type: 'dale',
    },
    {
      name: 'dale_night',
      colors: ['#ae5d9d', '#f1e8bc', '#ef8fa3', '#f7c047', '#58c9ed', '#f77150'],
      stroke: '#000000',
      background: '#00ae83',
      type: 'dale',
    },
    {
      name: 'dale_cat',
      colors: ['#f77656', '#f7f7f7', '#efc545', '#dfe0e2', '#3c70bd', '#66bee4'],
      stroke: '#000000',
      background: '#f6e0b8',
      type: 'dale',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var ducciPalettes = [
    {
      name: 'ducci_jb',
      colors: ['#395e54', '#e77b4d', '#050006', '#e55486'],
      stroke: '#050006',
      background: '#efe0bc',
      type: 'ducci',
    },
    {
      name: 'ducci_a',
      colors: ['#809498', '#d3990e', '#000000', '#ecddc5'],
      stroke: '#ecddc5',
      background: '#863f52',
      type: 'ducci',
    },
    {
      name: 'ducci_b',
      colors: ['#ecddc5', '#79b27b', '#000000', '#ac6548'],
      stroke: '#ac6548',
      background: '#d5c08e',
      type: 'ducci',
    },
    {
      name: 'ducci_d',
      colors: ['#f3cb4d', '#f2f5e3', '#20191b', '#67875c'],
      stroke: '#67875c',
      background: '#433d5f',
      type: 'ducci',
    },
    {
      name: 'ducci_e',
      colors: ['#c37c2b', '#f6ecce', '#000000', '#386a7a'],
      stroke: '#386a7a',
      background: '#e3cd98',
      type: 'ducci',
    },
    {
      name: 'ducci_f',
      colors: ['#596f7e', '#eae6c7', '#463c21', '#f4cb4c'],
      stroke: '#f4cb4c',
      background: '#e67300',
      type: 'ducci',
    },
    {
      name: 'ducci_g',
      colors: ['#c75669', '#000000', '#11706a'],
      stroke: '#11706a',
      background: '#ecddc5',
      type: 'ducci',
    },
    {
      name: 'ducci_h',
      colors: ['#6b5c6e', '#4a2839', '#d9574a'],
      stroke: '#d9574a',
      background: '#ffc34b',
      type: 'ducci',
    },
    {
      name: 'ducci_i',
      colors: ['#e9dcad', '#143331', '#ffc000'],
      stroke: '#ffc000',
      background: '#a74c02',
      type: 'ducci',
    },
    {
      name: 'ducci_j',
      colors: ['#c47c2b', '#5f5726', '#000000', '#7e8a84'],
      stroke: '#7e8a84',
      background: '#ecddc5',
      type: 'ducci',
    },
    {
      name: 'ducci_o',
      colors: ['#c15e1f', '#e4a13a', '#000000', '#4d545a'],
      stroke: '#4d545a',
      background: '#dfc79b',
      type: 'ducci',
    },
    {
      name: 'ducci_q',
      colors: ['#4bae8c', '#d0c1a0', '#2d3538'],
      stroke: '#2d3538',
      background: '#d06440',
      type: 'ducci',
    },
    {
      name: 'ducci_u',
      colors: ['#f6d700', '#f2d692', '#000000', '#5d3552'],
      stroke: '#5d3552',
      background: '#ff7426',
      type: 'ducci',
    },
    {
      name: 'ducci_v',
      colors: ['#c65f75', '#d3990e', '#000000', '#597e7a'],
      stroke: '#597e7a',
      background: '#f6eccb',
      type: 'ducci',
    },
    {
      name: 'ducci_x',
      colors: ['#dd614a', '#f5cedb', '#1a1e4f'],
      stroke: '#1a1e4f',
      background: '#fbb900',
      type: 'ducci',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var duotonePalettes = [
    {
      name: 'dt01',
      colors: ['#172a89', '#f7f7f3'],
      stroke: '#172a89',
      background: '#f3abb0',
      type: 'duotone',
    },
    {
      name: 'dt02',
      colors: ['#302956', '#f3c507'],
      stroke: '#302956',
      background: '#eee3d3',
      type: 'duotone',
    },
    {
      name: 'dt03',
      colors: ['#000000', '#a7a7a7'],
      stroke: '#000000',
      background: '#0a5e78',
      type: 'duotone',
    },
    {
      name: 'dt04',
      colors: ['#50978e', '#f7f0df'],
      stroke: '#000000',
      background: '#f7f0df',
      type: 'duotone',
    },
    {
      name: 'dt05',
      colors: ['#ee5d65', '#f0e5cb'],
      stroke: '#080708',
      background: '#f0e5cb',
      type: 'duotone',
    },
    {
      name: 'dt06',
      colors: ['#271f47', '#e7ceb5'],
      stroke: '#271f47',
      background: '#cc2b1c',
      type: 'duotone',
    },
    {
      name: 'dt07',
      colors: ['#6a98a5', '#d24c18'],
      stroke: '#efebda',
      background: '#efebda',
      type: 'duotone',
    },
    {
      name: 'dt08',
      colors: ['#5d9d88', '#ebb43b'],
      stroke: '#efebda',
      background: '#efebda',
      type: 'duotone',
    },
    {
      name: 'dt09',
      colors: ['#052e57', '#de8d80'],
      stroke: '#efebda',
      background: '#efebda',
      type: 'duotone',
    },
    {
      name: 'dt10',
      colors: ['#e5dfcf', '#151513'],
      stroke: '#151513',
      background: '#e9b500',
      type: 'duotone',
    },
    {
      name: 'dt13',
      colors: ['#f5f2d3', '#f5f2d3', '#fbd6b8'],
      stroke: '#ec5525',
      background: '#ec5525',
      type: 'duotone',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var expositoPalettes = [
    {
      name: 'exposito',
      colors: ['#8bc9c3', '#ffae43', '#ea432c', '#228345', '#d1d7d3', '#524e9c', '#9dc35e', '#f0a1a1'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
    {
      name: 'exposito_sub1',
      colors: ['#8bc9c3', '#ffae43', '#ea432c', '#524e9c'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
    {
      name: 'exposito_sub2',
      colors: ['#8bc9c3', '#ffae43', '#ea432c', '#524e9c', '#f0a1a1', '#228345'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
    {
      name: 'exposito_sub3',
      colors: ['#ffae43', '#ea432c', '#524e9c', '#f0a1a1'],
      stroke: '#fff',
      background: '#000000',
      type: 'exposito',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var flourishPalettes = [
    {
      name: 'empusa',
      colors: ['#c92a28', '#e69301', '#1f8793', '#13652b', '#e7d8b0', '#48233b', '#e3b3ac'],
      stroke: '#1a1a1a',
      background: '#f0f0f2',
      type: 'flourish',
    },
    {
      name: 'delphi',
      colors: ['#475b62', '#7a999c', '#2a1f1d', '#fbaf3c', '#df4a33', '#f0e0c6', '#af592c'],
      stroke: '#2a1f1d',
      background: '#f0e0c6',
      type: 'flourish',
    },
    {
      name: 'mably',
      colors: ['#13477b', '#2f1b10', '#d18529', '#d72a25', '#e42184', '#138898', '#9d2787', '#7f311b'],
      stroke: '#2a1f1d',
      background: '#dfc792',
      type: 'flourish',
    },
    {
      name: 'nowak',
      colors: ['#e85b30', '#ef9e28', '#c6ac71', '#e0c191', '#3f6279', '#ee854e', '#180305'],
      stroke: '#180305',
      background: '#ede4cb',
      type: 'flourish',
    },
    {
      name: 'jupiter',
      colors: ['#c03a53', '#edd09e', '#aab5af', '#023629', '#eba735', '#8e9380', '#6c4127'],
      stroke: '#12110f',
      background: '#e6e2d6',
      type: 'flourish',
    },
    {
      name: 'hersche',
      colors: ['#df9f00', '#1f6f50', '#8e6d7f', '#da0607', '#a4a5a7', '#d3d1c3', '#42064f', '#25393a'],
      stroke: '#0a0a0a',
      background: '#f0f5f6',
      type: 'flourish',
    },
    {
      name: 'cherfi',
      colors: ['#99cb9f', '#cfb610', '#d00701', '#dba78d', '#2e2c1d', '#bfbea2', '#d2cfaf'],
      stroke: '#332e22',
      background: '#e3e2c5',
      type: 'flourish',
    },
    {
      name: 'harvest',
      colors: ['#313a42', '#9aad2e', '#f0ae3c', '#df4822', '#8eac9b', '#cc3d3f', '#ec8b1c', '#1b9268'],
      stroke: '#463930',
      background: '#e5e2cf',
      type: 'flourish',
    },
    {
      name: 'honey',
      colors: ['#f14d42', '#f4fdec', '#4fbe5d', '#265487', '#f6e916', '#f9a087', '#2e99d6'],
      stroke: '#141414',
      background: '#f4fdec',
      type: 'flourish',
    },
    {
      name: 'jungle',
      colors: ['#adb100', '#e5f4e9', '#f4650f', '#4d6838', '#cb9e00', '#689c7d', '#e2a1a8', '#151c2e'],
      stroke: '#0e0f27',
      background: '#cecaa9',
      type: 'flourish',
    },
    {
      name: 'skyspider',
      colors: ['#f4b232', '#f2dbbd', '#01799c', '#e93e48', '#0b1952', '#006748', '#ed817d'],
      stroke: '#050505',
      background: '#f0dbbc',
      type: 'flourish',
    },
    {
      name: 'atlas',
      colors: ['#5399b1', '#f4e9d5', '#de4037', '#ed942f', '#4e9e48', '#7a6e62'],
      stroke: '#3d352b',
      background: '#f0c328',
      type: 'flourish',
    },
    {
      name: 'giftcard',
      colors: [
        '#FBF5E9',
        '#FF514E',
        '#FDBC2E',
        '#4561CC',
        '#2A303E',
        '#6CC283',
        '#A71172',
        '#238DA5',
        '#9BD7CB',
        '#231E58',
        '#4E0942',
      ],
      stroke: '#000',
      background: '#FBF5E9',
      type: 'flourish',
    },
    {
      name: 'giftcard_sub',
      colors: ['#FBF5E9', '#FF514E', '#FDBC2E', '#4561CC', '#2A303E', '#6CC283', '#238DA5', '#9BD7CB'],
      stroke: '#000',
      background: '#FBF5E9',
      type: 'flourish',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var golidmiscPalettes = [
    {
      name: 'frozen-rose',
      colors: ['#29368f', '#e9697b', '#1b164d', '#f7d996'],
      background: '#f2e8e4',
      type: 'golid',
    },
    {
      name: 'winter-night',
      colors: ['#122438', '#dd672e', '#87c7ca', '#ebebeb'],
      background: '#ebebeb',
      type: 'golid',
    },
    {
      name: 'saami',
      colors: ['#eab700', '#e64818', '#2c6393', '#eecfca'],
      background: '#e7e6e4',
      type: 'golid',
    },
    {
      name: 'knotberry1',
      colors: ['#20342a', '#f74713', '#686d2c', '#e9b4a6'],
      background: '#e5ded8',
      type: 'golid',
    },
    {
      name: 'knotberry2',
      colors: ['#1d3b1a', '#eb4b11', '#e5bc00', '#f29881'],
      background: '#eae2d0',
      type: 'golid',
    },
    {
      name: 'tricolor',
      colors: ['#ec643b', '#56b7ab', '#f8cb57', '#1f1e43'],
      background: '#f7f2df',
      type: 'golid',
    },
    {
      name: 'foxshelter',
      colors: ['#ff3931', '#007861', '#311f27', '#bab9a4'],
      background: '#dddddd',
      type: 'golid',
    },
    {
      name: 'hermes',
      colors: ['#253852', '#51222f', '#b53435', '#ecbb51'],
      background: '#eeccc2',
      type: 'golid',
    },
    {
      name: 'olympia',
      colors: ['#ff3250', '#ffb33a', '#008c36', '#0085c6', '#4c4c4c'],
      stroke: '#0b0b0b',
      background: '#faf2e5',
      type: 'golid',
    },
    {
      name: 'byrnes',
      colors: ['#c54514', '#dca215', '#23507f'],
      stroke: '#0b0b0b',
      background: '#e8e7d4',
      type: 'golid',
    },
    {
      name: 'butterfly',
      colors: ['#f40104', '#f6c0b3', '#99673a', '#f0f1f4'],
      stroke: '#191e36',
      background: '#191e36',
      type: 'golid',
    },
    {
      name: 'floratopia',
      colors: ['#bf4a2b', '#cd902a', '#4e4973', '#f5d4bc'],
      stroke: '#1e1a43',
      background: '#1e1a43',
      type: 'golid',
    },
    {
      name: 'verena',
      colors: ['#f1594a', '#f5b50e', '#14a160', '#2969de', '#885fa4'],
      stroke: '#1a1a1a',
      background: '#e2e6e8',
      type: 'golid',
    },
    {
      name: 'florida_citrus',
      colors: ['#ea7251', '#ebf7f0', '#02aca5'],
      stroke: '#050100',
      background: '#9ae2d3',
      type: 'golid',
    },
    {
      name: 'lemon_citrus',
      colors: ['#e2d574', '#f1f4f7', '#69c5ab'],
      stroke: '#463231',
      background: '#f79eac',
      type: 'golid',
    },
    {
      name: 'yuma_punk',
      colors: ['#f05e3b', '#ebdec4', '#ffdb00'],
      stroke: '#ebdec4',
      background: '#161616',
      type: 'golid',
    },
    {
      name: 'yuma_punk2',
      colors: ['#f2d002', '#f7f5e1', '#ec643b'],
      stroke: '#19080e',
      background: '#f7f5e1',
      type: 'golid',
    },
    {
      name: 'moir',
      colors: ['#a49f4f', '#d4501e', '#f7c558', '#ebbaa6'],
      stroke: '#161716',
      background: '#f7f4ef',
      type: 'golid',
    },
    {
      name: 'sprague',
      colors: ['#ec2f28', '#f8cd28', '#1e95bb', '#fbaab3', '#fcefdf'],
      stroke: '#221e1f',
      background: '#fcefdf',
      type: 'golid',
    },
    {
      name: 'bloomberg',
      colors: ['#ff5500', '#f4c145', '#144714', '#2f04fc', '#e276af'],
      stroke: '#000',
      background: '#fff3dd',
      type: 'golid',
    },
    {
      name: 'revolucion',
      colors: ['#ed555d', '#fffcc9', '#41b797', '#eda126', '#7b5770'],
      stroke: '#fffcc9',
      background: '#2d1922',
      type: 'golid',
    },
    {
      name: 'sneaker',
      colors: ['#e8165b', '#401e38', '#66c3b4', '#ee7724', '#584098'],
      stroke: '#401e38',
      background: '#ffffff',
      type: 'golid',
    },
    {
      name: 'miradors',
      colors: ['#ff6936', '#fddc3f', '#0075ca', '#00bb70'],
      stroke: '#ffffff',
      background: '#020202',
      type: 'golid',
    },
    {
      name: 'kaffeprat',
      colors: ['#BCAA8C', '#D8CDBE', '#484A42', '#746B58', '#9A8C73'],
      stroke: '#000',
      background: '#fff',
      type: 'golid',
    },
    {
      name: 'jrmy',
      colors: ['#df456c', '#ea6a82', '#270b32', '#471e43'],
      stroke: '#270b32',
      background: '#ef9198',
      type: 'golid',
    },
    {
      name: 'animo',
      colors: ['#f6c103', '#f6f6f6', '#d1cdc7', '#e7e6e5'],
      stroke: '#010001',
      background: '#f5f5f5',
      type: 'golid',
    },
    {
      name: 'book',
      colors: ['#be1c24', '#d1a082', '#037b68', '#d8b1a5', '#1c2738', '#c95a3f'],
      stroke: '#0e0f27',
      background: '#f5b28a',
      type: 'golid',
    },
    {
      name: 'juxtapoz',
      colors: ['#20357e', '#f44242', '#ffffff'],
      stroke: '#000000',
      background: '#cfc398',
      type: 'golid',
    },
    {
      name: 'hurdles',
      colors: ['#e16503', '#dc9a0f', '#dfe2b4', '#66a7a6'],
      stroke: '#3c1c03',
      background: '#3c1c03',
      type: 'golid',
    },
    {
      name: 'ludo',
      colors: ['#df302f', '#e5a320', '#0466b3', '#0f7963'],
      stroke: '#272621',
      background: '#dedccd',
      type: 'golid',
    },
    {
      name: 'riff',
      colors: ['#e24724', '#c7c7c7', '#1f3e7c', '#d29294', '#010203'],
      stroke: '#010203',
      background: '#f2f2f2',
      type: 'golid',
    },
    {
      name: 'san ramon',
      colors: ['#4f423a', '#f6a74b', '#589286', '#f8e9e2', '#2c2825'],
      stroke: '#2c2825',
      background: '#fff',
      type: 'golid',
    },
    {
      name: 'one-dress',
      colors: ['#1767D2', '#FFFFFF', '#F9AB00', '#212121'],
      stroke: '#212121',
      background: '#fff',
      type: 'golid',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var hildaPalettes = [
    {
      name: 'hilda01',
      colors: ['#ec5526', '#f4ac12', '#9ebbc1', '#f7f4e2'],
      stroke: '#1e1b1e',
      background: '#e7e8d4',
      type: 'hilda',
    },
    {
      name: 'hilda02',
      colors: ['#eb5627', '#eebb20', '#4e9eb8', '#f7f5d0'],
      stroke: '#201d13',
      background: '#77c1c0',
      type: 'hilda',
    },
    {
      name: 'hilda03',
      colors: ['#e95145', '#f8b917', '#b8bdc1', '#ffb2a2'],
      stroke: '#010101',
      background: '#6b7752',
      type: 'hilda',
    },
    {
      name: 'hilda04',
      colors: ['#e95145', '#f6bf7a', '#589da1', '#f5d9bc'],
      stroke: '#000001',
      background: '#f5ede1',
      type: 'hilda',
    },
    {
      name: 'hilda05',
      colors: ['#ff6555', '#ffb58f', '#d8eecf', '#8c4b47', '#bf7f93'],
      stroke: '#2b0404',
      background: '#ffda82',
      type: 'hilda',
    },
    {
      name: 'hilda06',
      colors: ['#f75952', '#ffce84', '#74b7b2', '#f6f6f6', '#b17d71'],
      stroke: '#0e0603',
      background: '#f6ecd4',
      type: 'hilda',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var iivonenPalettes = [
    {
      name: 'iiso_zeitung',
      colors: ['#ee8067', '#f3df76', '#00a9c0', '#f7ab76'],
      stroke: '#111a17',
      background: '#f5efcb',
      type: 'iivonen',
    },
    {
      name: 'iiso_curcuit',
      colors: ['#f0865c', '#f2b07b', '#6bc4d2', '#1a3643'],
      stroke: '#0f1417',
      background: '#f0f0e8',
      type: 'iivonen',
    },
    {
      name: 'iiso_airlines',
      colors: ['#fe765a', '#ffb468', '#4b588f', '#faf1e0'],
      stroke: '#1c1616',
      background: '#fae5c8',
      type: 'iivonen',
    },
    {
      name: 'iiso_daily',
      colors: ['#e76c4a', '#f0d967', '#7f8cb6', '#1daeb1', '#ef9640'],
      stroke: '#000100',
      background: '#e2ded2',
      type: 'iivonen',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var judsonPalettes = [
    {
      name: 'jud_playground',
      colors: ['#f04924', '#fcce09', '#408ac9'],
      stroke: '#2e2925',
      background: '#ffffff',
      type: 'judson',
    },
    {
      name: 'jud_horizon',
      colors: ['#f8c3df', '#f2e420', '#28b3d0', '#648731', '#ef6a7d'],
      stroke: '#030305',
      background: '#f2f0e1',
      type: 'judson',
    },
    {
      name: 'jud_mural',
      colors: ['#ca3122', '#e5af16', '#4a93a2', '#0e7e39', '#e2b9bd'],
      stroke: '#1c1616',
      background: '#e3ded8',
      type: 'judson',
    },
    {
      name: 'jud_cabinet',
      colors: ['#f0afb7', '#f6bc12', '#1477bb', '#41bb9b'],
      stroke: '#020508',
      background: '#e3ded8',
      type: 'judson',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var jungPalettes = [
    {
      name: 'jung_bird',
      colors: ['#fc3032', '#fed530', '#33c3fb', '#ff7bac', '#fda929'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_horse',
      colors: ['#e72e81', '#f0bf36', '#3056a2'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_croc',
      colors: ['#f13274', '#eed03e', '#405e7f', '#19a198'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_hippo',
      colors: ['#ff7bac', '#ff921e', '#3ea8f5', '#7ac943'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
    {
      name: 'jung_wolf',
      colors: ['#e51c39', '#f1b844', '#36c4b7', '#666666'],
      stroke: '#000000',
      background: '#ffffff',
      type: 'jung',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var kovecsesPalettes = [
    {
      name: 'kov_01',
      colors: ['#d24c23', '#7ba6bc', '#f0c667', '#ede2b3', '#672b35', '#142a36'],
      stroke: '#132a37',
      background: '#108266',
      type: 'kovesecs',
    },
    {
      name: 'kov_02',
      colors: ['#e8dccc', '#e94641', '#eeaeae'],
      stroke: '#e8dccc',
      background: '#6c96be',
      type: 'kovesecs',
    },
    {
      name: 'kov_03',
      colors: ['#e3937b', '#d93f1d', '#090d15', '#e6cca7'],
      stroke: '#090d15',
      background: '#558947',
      type: 'kovesecs',
    },
    {
      name: 'kov_04',
      colors: ['#d03718', '#292b36', '#33762f', '#ead7c9', '#ce7028', '#689d8d'],
      stroke: '#292b36',
      background: '#deb330',
      type: 'kovesecs',
    },
    {
      name: 'kov_05',
      colors: ['#de3f1a', '#de9232', '#007158', '#e6cdaf', '#869679'],
      stroke: '#010006',
      background: '#7aa5a6',
      type: 'kovesecs',
    },
    {
      name: 'kov_06',
      colors: ['#a87c2a', '#bdc9b1', '#f14616', '#ecbfaf', '#017724', '#0e2733', '#2b9ae9'],
      stroke: '#292319',
      background: '#dfd4c1',
      type: 'kovesecs',
    },
    {
      name: 'kov_06b',
      colors: ['#d57846', '#dfe0cc', '#de442f', '#e7d3c5', '#5ec227', '#302f35', '#63bdb3'],
      stroke: '#292319',
      background: '#dfd4c1',
      type: 'kovesecs',
    },
    {
      name: 'kov_07',
      colors: ['#c91619', '#fdecd2', '#f4a000', '#4c2653'],
      stroke: '#111',
      background: '#89c2cd',
      type: 'kovesecs',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var mayoPalettes = [
    {
      name: 'mayo1',
      colors: ['#ea510e', '#ffd203', '#0255a3', '#039177', '#111111'],
      stroke: '#111111',
      background: '#fff',
      type: 'mayo',
    },
    {
      name: 'mayo2',
      colors: ['#ea663f', '#f9cc27', '#84afd7', '#7ca994', '#f1bbc9', '#242424'],
      stroke: '#2a2a2a',
      background: '#f5f6f1',
      type: 'mayo',
    },
    {
      name: 'mayo3',
      colors: ['#ea5b19', '#f8c9b9', '#137661', '#2a2a2a'],
      stroke: '#2a2a2a',
      background: '#f5f4f0',
      type: 'mayo',
    },
  ];

  //
  //  metbrewer color palettes
  //  https://github.com/BlakeRMills/metbrewer
  //
  var metBrewerPalettes = [
    {
      name: 'archambault',
      colors: ['#88a0dc', '#381a61', '#7c4b73', '#ed968c', '#ab3329', '#e78429', '#f9d14a'],
      isPrimary: true,
      sortOrder: [2, 7, 5, 1, 6, 4, 3],
      type: 'metbrewer',
    },
    {
      name: 'austria',
      colors: ['#a40000', '#16317d', '#007e2f', '#ffcd12', '#b86092', '#721b3e', '#00b7a7'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 6, 5, 7],
      type: 'metbrewer',
    },
    {
      name: 'benedictus',
      colors: [
        '#9a133d',
        '#b93961',
        '#d8527c',
        '#f28aaa',
        '#f9b4c9',
        '#f9e0e8',
        '#ffffff',
        '#eaf3ff',
        '#c5daf6',
        '#a1c2ed',
        '#6996e3',
        '#4060c8',
        '#1a318b',
      ],
      isPrimary: true,
      sortOrder: [9, 5, 11, 1, 7, 3, 13, 4, 8, 2, 12, 6, 10],
      type: 'metbrewer',
    },
    {
      name: 'cassatt1',
      colors: ['#b1615c', '#d88782', '#e3aba7', '#edd7d9', '#c9c9dd', '#9d9dc7', '#8282aa', '#5a5a83'],
      isPrimary: true,
      sortOrder: [3, 6, 1, 8, 4, 5, 2, 7],
      type: 'metbrewer',
    },
    {
      name: 'cassatt2',
      colors: [
        '#2d223c',
        '#574571',
        '#90719f',
        '#b695bc',
        '#dec5da',
        '#c1d1aa',
        '#7fa074',
        '#466c4b',
        '#2c4b27',
        '#0e2810',
      ],
      isPrimary: true,
      sortOrder: [7, 3, 9, 1, 5, 6, 2, 10, 4, 8],
      type: 'metbrewer',
    },
    {
      name: 'cross',
      colors: ['#c969a1', '#ce4441', '#ee8577', '#eb7926', '#ffbb44', '#859b6c', '#62929a', '#004f63', '#122451'],
      isPrimary: true,
      sortOrder: [4, 7, 1, 8, 2, 6, 3, 5, 9],
      type: 'metbrewer',
    },
    {
      name: 'degas',
      colors: ['#591d06', '#96410e', '#e5a335', '#556219', '#418979', '#2b614e', '#053c29'],
      isPrimary: true,
      sortOrder: [5, 2, 1, 3, 4, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'demuth',
      colors: [
        '#591c19',
        '#9b332b',
        '#b64f32',
        '#d39a2d',
        '#f7c267',
        '#b9b9b8',
        '#8b8b99',
        '#5d6174',
        '#41485f',
        '#262d42',
      ],
      isPrimary: true,
      sortOrder: [5, 2, 1, 3, 4, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'derain',
      colors: ['#efc86e', '#97c684', '#6f9969', '#aab5d5', '#808fe1', '#5c66a8', '#454a74'],
      isPrimary: true,
      sortOrder: [4, 2, 5, 7, 1, 3, 6],
      type: 'metbrewer',
    },
    {
      name: 'egypt',
      colors: ['#dd5129', '#0f7ba2', '#43b284', '#fab255'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'metbrewer',
    },
    {
      name: 'gauguin',
      colors: ['#b04948', '#811e18', '#9e4013', '#c88a2c', '#4c6216', '#1a472a'],
      isPrimary: true,
      sortOrder: [2, 5, 4, 3, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'greek',
      colors: ['#3c0d03', '#8d1c06', '#e67424', '#ed9b49', '#f5c34d'],
      isPrimary: true,
      sortOrder: [2, 3, 5, 1, 4],
      type: 'metbrewer',
    },
    {
      name: 'hiroshige',
      colors: [
        '#e76254',
        '#ef8a47',
        '#f7aa58',
        '#ffd06f',
        '#ffe6b7',
        '#aadce0',
        '#72bcd5',
        '#528fad',
        '#376795',
        '#1e466e',
      ],
      isPrimary: true,
      sortOrder: [6, 2, 9, 3, 7, 5, 1, 10, 4, 8],
      type: 'metbrewer',
    },
    {
      name: 'hokusai1',
      colors: ['#6d2f20', '#b75347', '#df7e66', '#e09351', '#edc775', '#94b594', '#224b5e'],
      isPrimary: true,
      sortOrder: [2, 7, 4, 6, 5, 1, 3],
      type: 'metbrewer',
    },
    {
      name: 'hokusai2',
      colors: ['#abc9c8', '#72aeb6', '#4692b0', '#2f70a1', '#134b73', '#0a3351'],
      isPrimary: true,
      sortOrder: [5, 2, 4, 1, 6, 3],
      type: 'metbrewer',
    },
    {
      name: 'hokusai3',
      colors: ['#d8d97a', '#95c36e', '#74c8c3', '#5a97c1', '#295384', '#0a2e57'],
      isPrimary: true,
      sortOrder: [4, 2, 5, 3, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'homer1',
      colors: ['#551f00', '#a62f00', '#df7700', '#f5b642', '#fff179', '#c3f4f6', '#6ad5e8', '#32b2da'],
      isPrimary: true,
      sortOrder: [6, 3, 2, 7, 4, 8, 5, 1],
      type: 'metbrewer',
    },
    {
      name: 'homer2',
      colors: ['#bf3626', '#e9724c', '#e9851d', '#f9c53b', '#aeac4c', '#788f33', '#165d43'],
      isPrimary: true,
      sortOrder: [3, 7, 1, 4, 6, 2, 5],
      type: 'metbrewer',
    },
    {
      name: 'ingres',
      colors: ['#041d2c', '#06314e', '#18527e', '#2e77ab', '#d1b252', '#a97f2f', '#7e5522', '#472c0b'],
      isPrimary: true,
      sortOrder: [4, 5, 3, 6, 2, 7, 1, 8],
      type: 'metbrewer',
    },
    {
      name: 'isfahan1',
      colors: ['#4e3910', '#845d29', '#d8c29d', '#4fb6ca', '#178f92', '#175f5d', '#1d1f54'],
      isPrimary: true,
      sortOrder: [5, 2, 4, 6, 1, 7, 3],
      type: 'metbrewer',
    },
    {
      name: 'isfahan2',
      colors: ['#d7aca1', '#ddc000', '#79ad41', '#34b6c6', '#4063a3'],
      isPrimary: true,
      sortOrder: [4, 2, 3, 5, 1],
      type: 'metbrewer',
    },
    {
      name: 'java',
      colors: ['#663171', '#cf3a36', '#ea7428', '#e2998a', '#0c7156'],
      isPrimary: true,
      sortOrder: [1, 4, 2, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'johnson',
      colors: ['#a00e00', '#d04e00', '#f6c200', '#0086a8', '#132b69'],
      isPrimary: true,
      sortOrder: [3, 1, 4, 2, 5],
      type: 'metbrewer',
    },
    {
      name: 'juarez',
      colors: ['#a82203', '#208cc0', '#f1af3a', '#cf5e4e', '#637b31', '#003967'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'metbrewer',
    },
    {
      name: 'kandinsky',
      colors: ['#3b7c70', '#ce9642', '#898e9f', '#3b3a3e'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'metbrewer',
    },
    {
      name: 'klimt',
      colors: ['#df9ed4', '#c93f55', '#eacc62', '#469d76', '#3c4b99', '#924099'],
      isPrimary: true,
      sortOrder: [5, 2, 3, 4, 6, 1],
      type: 'metbrewer',
    },
    {
      name: 'lakota',
      colors: ['#04a3bd', '#f0be3d', '#931e18', '#da7901', '#247d3f', '#20235b'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'metbrewer',
    },
    {
      name: 'manet',
      colors: [
        '#3b2319',
        '#80521c',
        '#d29c44',
        '#ebc174',
        '#ede2cc',
        '#7ec5f4',
        '#4585b7',
        '#225e92',
        '#183571',
        '#43429b',
        '#5e65be',
      ],
      isPrimary: true,
      sortOrder: [8, 3, 10, 4, 7, 9, 11, 2, 6, 1, 5],
      type: 'metbrewer',
    },
    {
      name: 'monet',
      colors: ['#4e6d58', '#749e89', '#abccbe', '#e3cacf', '#c399a2', '#9f6e71', '#41507b', '#7d87b2', '#c2cae3'],
      isPrimary: true,
      sortOrder: [2, 5, 8, 3, 4, 9, 1, 6, 7],
      type: 'metbrewer',
    },
    {
      name: 'moreau',
      colors: ['#421600', '#792504', '#bc7524', '#8dadca', '#527baa', '#104839', '#082844'],
      isPrimary: true,
      sortOrder: [2, 5, 3, 4, 7, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'morgenstern',
      colors: ['#7c668c', '#b08ba5', '#dfbbc8', '#ffc680', '#ffb178', '#db8872', '#a56457'],
      isPrimary: true,
      sortOrder: [7, 5, 4, 6, 3, 2, 1],
      type: 'metbrewer',
    },
    {
      name: 'nattier',
      colors: ['#52271c', '#944839', '#c08e39', '#7f793c', '#565c33', '#184948', '#022a2a'],
      isPrimary: true,
      sortOrder: [1, 6, 3, 4, 7, 2, 5],
      type: 'metbrewer',
    },
    {
      name: 'navajo',
      colors: ['#660d20', '#e59a52', '#edce79', '#094568', '#e1c59a'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5],
      type: 'metbrewer',
    },
    {
      name: 'newkingdom',
      colors: ['#e1846c', '#9eb4e0', '#e6bb9e', '#9c6849', '#735852'],
      isPrimary: true,
      sortOrder: [2, 1, 3, 4, 5],
      type: 'metbrewer',
    },
    {
      name: 'nizami',
      colors: ['#dd7867', '#b83326', '#c8570d', '#edb144', '#8cc8bc', '#7da7ea', '#5773c0', '#1d4497'],
      isPrimary: true,
      sortOrder: [5, 2, 6, 8, 3, 7, 4, 1],
      type: 'metbrewer',
    },
    {
      name: 'okeeffe1',
      colors: [
        '#6b200c',
        '#973d21',
        '#da6c42',
        '#ee956a',
        '#fbc2a9',
        '#f6f2ee',
        '#bad6f9',
        '#7db0ea',
        '#447fdd',
        '#225bb2',
        '#133e7e',
      ],
      isPrimary: true,
      sortOrder: [8, 6, 1, 4, 10, 3, 11, 5, 2, 7, 9],
      type: 'metbrewer',
    },
    {
      name: 'okeeffe2',
      colors: ['#fbe3c2', '#f2c88f', '#ecb27d', '#e69c6b', '#d37750', '#b9563f', '#92351e'],
      isPrimary: true,
      sortOrder: [7, 1, 6, 4, 2, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'paquin',
      colors: [
        '#831818',
        '#c62320',
        '#f05b43',
        '#f78462',
        '#feac81',
        '#f7dea3',
        '#ced1af',
        '#98ab76',
        '#748f46',
        '#47632a',
        '#275024',
      ],
      isPrimary: true,
      sortOrder: [10, 6, 1, 8, 4, 3, 5, 9, 2, 7, 11],
      type: 'metbrewer',
    },
    {
      name: 'peru1',
      colors: ['#b5361c', '#e35e28', '#1c9d7c', '#31c7ba', '#369cc9', '#3a507f'],
      isPrimary: true,
      sortOrder: [3, 1, 5, 2, 4, 6],
      type: 'metbrewer',
    },
    {
      name: 'peru2',
      colors: ['#65150b', '#961f1f', '#c0431f', '#b36c06', '#f19425', '#c59349', '#533d14'],
      isPrimary: true,
      sortOrder: [4, 1, 3, 5, 2, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'pillement',
      colors: ['#a9845b', '#697852', '#738e8e', '#44636f', '#2b4655', '#0f252f'],
      isPrimary: true,
      sortOrder: [4, 3, 2, 5, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'pissaro',
      colors: ['#134130', '#4c825d', '#8cae9e', '#8dc7dc', '#508ca7', '#1a5270', '#0e2a4d'],
      isPrimary: true,
      sortOrder: [6, 2, 4, 1, 7, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'redon',
      colors: [
        '#5b859e',
        '#1e395f',
        '#75884b',
        '#1e5a46',
        '#df8d71',
        '#af4f2f',
        '#d48f90',
        '#732f30',
        '#ab84a5',
        '#59385c',
        '#d8b847',
        '#b38711',
      ],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      type: 'metbrewer',
    },
    {
      name: 'renoir',
      colors: [
        '#17154f',
        '#2f357c',
        '#6c5d9e',
        '#9d9cd5',
        '#b0799a',
        '#f6b3b0',
        '#e48171',
        '#bf3729',
        '#e69b00',
        '#f5bb50',
        '#ada43b',
        '#355828',
      ],
      isPrimary: true,
      sortOrder: [2, 5, 9, 12, 3, 8, 7, 10, 4, 1, 6, 11],
      type: 'metbrewer',
    },
    {
      name: 'robert',
      colors: ['#11341a', '#375624', '#6ca4a0', '#487a7c', '#18505f', '#062e3d'],
      isPrimary: true,
      sortOrder: [2, 5, 3, 1, 6, 4],
      type: 'metbrewer',
    },
    {
      name: 'signac',
      colors: [
        '#fbe183',
        '#f4c40f',
        '#fe9b00',
        '#d8443c',
        '#9b3441',
        '#de597c',
        '#e87b89',
        '#e6a2a6',
        '#aa7aa1',
        '#9f5691',
        '#633372',
        '#1f6e9c',
        '#2b9b81',
        '#92c051',
      ],
      isPrimary: true,
      sortOrder: [13, 3, 2, 1, 11, 5, 8, 14, 12, 10, 7, 4, 6, 9],
      type: 'metbrewer',
    },
    {
      name: 'stevens',
      colors: ['#042e4e', '#307d7f', '#598c4c', '#ba5c3f', '#a13213', '#470c00'],
      isPrimary: true,
      sortOrder: [4, 2, 3, 5, 1, 6],
      type: 'metbrewer',
    },
    {
      name: 'tam',
      colors: ['#ffd353', '#ffb242', '#ef8737', '#de4f33', '#bb292c', '#9f2d55', '#62205f', '#341648'],
      isPrimary: true,
      sortOrder: [3, 8, 1, 6, 2, 7, 4, 5],
      type: 'metbrewer',
    },
    {
      name: 'tara',
      colors: ['#eab1c6', '#d35e17', '#e18a1f', '#e9b109', '#829d44'],
      isPrimary: true,
      sortOrder: [1, 3, 2, 5, 4],
      type: 'metbrewer',
    },
    {
      name: 'thomas',
      colors: ['#b24422', '#c44d76', '#4457a5', '#13315f', '#b1a1cc', '#59386c', '#447861', '#7caf5c'],
      isPrimary: true,
      sortOrder: [3, 2, 8, 6, 1, 4, 7, 5],
      type: 'metbrewer',
    },
    {
      name: 'tiepolo',
      colors: ['#802417', '#c06636', '#ce9344', '#e8b960', '#646e3b', '#2b5851', '#508ea2', '#17486f'],
      isPrimary: true,
      sortOrder: [1, 2, 8, 4, 3, 5, 7, 6],
      type: 'metbrewer',
    },
    {
      name: 'troy',
      colors: ['#421401', '#6c1d0e', '#8b3a2b', '#c27668', '#7ba0b4', '#44728c', '#235070', '#0a2d46'],
      isPrimary: true,
      sortOrder: [2, 7, 4, 5, 1, 8, 3, 6],
      type: 'metbrewer',
    },
    {
      name: 'tsimshian',
      colors: ['#582310', '#aa361d', '#82c45f', '#318f49', '#0cb4bb', '#2673a3', '#473d7d'],
      isPrimary: true,
      sortOrder: [6, 1, 7, 4, 1, 5, 3],
      type: 'metbrewer',
    },
    {
      name: 'vangogh1',
      colors: ['#2c2d54', '#434475', '#6b6ca3', '#969bc7', '#87bcbd', '#89ab7c', '#6f9954'],
      isPrimary: true,
      sortOrder: [3, 5, 7, 4, 6, 2, 1],
      type: 'metbrewer',
    },
    {
      name: 'vangogh2',
      colors: ['#bd3106', '#d9700e', '#e9a00e', '#eebe04', '#5b7314', '#c3d6ce', '#89a6bb', '#454b87'],
      isPrimary: true,
      sortOrder: [1, 5, 8, 2, 7, 4, 6, 3],
      type: 'metbrewer',
    },
    {
      name: 'vangogh3',
      colors: ['#e7e5cc', '#c2d6a4', '#9cc184', '#669d62', '#447243', '#1f5b25', '#1e3d14', '#192813'],
      isPrimary: true,
      sortOrder: [7, 5, 1, 4, 8, 2, 3, 6],
      type: 'metbrewer',
    },
    {
      name: 'veronese',
      colors: ['#67322e', '#99610a', '#c38f16', '#6e948c', '#2c6b67', '#175449', '#122c43'],
      isPrimary: true,
      sortOrder: [5, 1, 7, 2, 3, 6, 4],
      type: 'metbrewer',
    },
    {
      name: 'wissing',
      colors: ['#4b1d0d', '#7c291e', '#ba7233', '#3a4421', '#2d5380'],
      isPrimary: true,
      sortOrder: [2, 3, 5, 4, 1],
      type: 'metbrewer',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var ranganathPalettes = [
    {
      name: 'rag-mysore',
      colors: ['#ec6c26', '#613a53', '#e8ac52', '#639aa0'],
      background: '#d5cda1',
      type: 'ranganath',
    },
    {
      name: 'rag-gol',
      colors: ['#d3693e', '#803528', '#f1b156', '#90a798'],
      background: '#f0e0a4',
      type: 'ranganath',
    },
    {
      name: 'rag-belur',
      colors: ['#f46e26', '#68485f', '#3d273a', '#535d55'],
      background: '#dcd4a6',
      type: 'ranganath',
    },
    {
      name: 'rag-bangalore',
      colors: ['#ea720e', '#ca5130', '#e9c25a', '#52534f'],
      background: '#f9ecd3',
      type: 'ranganath',
    },
    {
      name: 'rag-taj',
      colors: ['#ce565e', '#8e1752', '#f8a100', '#3ac1a6'],
      background: '#efdea2',
      type: 'ranganath',
    },
    {
      name: 'rag-virupaksha',
      colors: ['#f5736a', '#925951', '#feba4c', '#9d9b9d'],
      background: '#eedfa2',
      type: 'ranganath',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var rohlfsPalettes = [
    {
      name: 'rohlfs_1R',
      colors: ['#004996', '#567bae', '#ff4c48', '#ffbcb3'],
      stroke: '#004996',
      background: '#fff8e7',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_1Y',
      colors: ['#004996', '#567bae', '#ffc000', '#ffdca4'],
      stroke: '#004996',
      background: '#fff8e7',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_1G',
      colors: ['#004996', '#567bae', '#60bf3c', '#d2deb1'],
      stroke: '#004996',
      background: '#fff8e7',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_2',
      colors: ['#4d3d9a', '#f76975', '#ffffff', '#eff0dd'],
      stroke: '#211029',
      background: '#58bdbc',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_3',
      colors: ['#abdfdf', '#fde500', '#58bdbc', '#eff0dd'],
      stroke: '#211029',
      background: '#f76975',
      type: 'rohlfs',
    },
    {
      name: 'rohlfs_4',
      colors: ['#fde500', '#2f2043', '#f76975', '#eff0dd'],
      stroke: '#211029',
      background: '#fbbeca',
      type: 'rohlfs',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var roygbivsPalettes = [
    {
      name: 'retro',
      colors: ['#69766f', '#9ed6cb', '#f7e5cc', '#9d8f7f', '#936454', '#bf5c32', '#efad57'],
      type: 'roygbivs',
    },
    {
      name: 'retro-washedout',
      colors: ['#878a87', '#cbdbc8', '#e8e0d4', '#b29e91', '#9f736c', '#b76254', '#dfa372'],
      type: 'roygbivs',
    },
    {
      name: 'roygbiv-warm',
      colors: ['#705f84', '#687d99', '#6c843e', '#fc9a1a', '#dc383a', '#aa3a33', '#9c4257'],
      type: 'roygbivs',
    },
    {
      name: 'roygbiv-toned',
      colors: ['#817c77', '#396c68', '#89e3b7', '#f59647', '#d63644', '#893f49', '#4d3240'],
      type: 'roygbivs',
    },
    {
      name: 'present-correct',
      colors: [
        '#fd3741',
        '#fe4f11',
        '#ff6800',
        '#ffa61a',
        '#ffc219',
        '#ffd114',
        '#fcd82e',
        '#f4d730',
        '#ced562',
        '#8ac38f',
        '#79b7a0',
        '#72b5b1',
        '#5b9bae',
        '#6ba1b7',
        '#49619d',
        '#604791',
        '#721e7f',
        '#9b2b77',
        '#ab2562',
        '#ca2847',
      ],
      type: 'roygbivs',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var spatialPalettes = [
    {
      name: 'spatial01',
      colors: ['#ff5937', '#f6f6f4', '#4169ff'],
      stroke: '#ff5937',
      background: '#f6f6f4',
      type: 'spatial',
    },
    {
      name: 'spatial02',
      colors: ['#ff5937', '#f6f6f4', '#f6f6f4'],
      stroke: '#ff5937',
      background: '#f6f6f4',
      type: 'spatial',
    },
    {
      name: 'spatial02i',
      colors: ['#f6f6f4', '#ff5937', '#ff5937'],
      stroke: '#f6f6f4',
      background: '#ff5937',
      type: 'spatial',
    },

    {
      name: 'spatial03',
      colors: ['#4169ff', '#f6f6f4', '#f6f6f4'],
      stroke: '#4169ff',
      background: '#f6f6f4',
      type: 'spatial',
    },
    {
      name: 'spatial03i',
      colors: ['#f6f6f4', '#4169ff', '#4169ff'],
      stroke: '#f6f6f4',
      background: '#4169ff',
      type: 'spatial',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var systemPalettes = [
    {
      name: 'system.#01',
      colors: ['#ff4242', '#fec101', '#1841fe', '#fcbdcc', '#82e9b5'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#02',
      colors: ['#ff4242', '#ffd480', '#1e365d', '#edb14c', '#418dcd'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#03',
      colors: ['#f73f4a', '#d3e5eb', '#002c3e', '#1aa1b1', '#ec6675'],
      stroke: '#110b09',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#04',
      colors: ['#e31f4f', '#f0ac3f', '#18acab', '#26265a', '#ea7d81', '#dcd9d0'],
      stroke: '#26265a',
      backgrund: '#dcd9d0',
      type: 'system',
    },
    {
      name: 'system.#05',
      colors: ['#db4549', '#d1e1e1', '#3e6a90', '#2e3853', '#a3c9d3'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#06',
      colors: ['#e5475c', '#95b394', '#28343b', '#f7c6a3', '#eb8078'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#07',
      colors: ['#d75c49', '#f0efea', '#509da4'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
    {
      name: 'system.#08',
      colors: ['#f6625a', '#92b29f', '#272c3f'],
      stroke: '#000',
      background: '#fff',
      type: 'system',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var tsuchimochiPalettes = [
    {
      name: 'tsu_arcade',
      colors: ['#4aad8b', '#e15147', '#f3b551', '#cec8b8', '#d1af84', '#544e47'],
      stroke: '#251c12',
      background: '#cfc7b9',
      type: 'tsuchimochi',
    },
    {
      name: 'tsu_harutan',
      colors: ['#75974a', '#c83e3c', '#f39140', '#e4ded2', '#f8c5a4', '#434f55'],
      stroke: '#251c12',
      background: '#cfc7b9',
      type: 'tsuchimochi',
    },
    {
      name: 'tsu_akasaka',
      colors: ['#687f72', '#cc7d6c', '#dec36f', '#dec7af', '#ad8470', '#424637'],
      stroke: '#251c12',
      background: '#cfc7b9',
      type: 'tsuchimochi',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var tundraPalettes = [
    {
      name: 'tundra1',
      colors: ['#40708c', '#8e998c', '#5d3f37', '#ed6954', '#f2e9e2'],
      type: 'tundra',
    },
    {
      name: 'tundra2',
      colors: ['#5f9e93', '#3d3638', '#733632', '#b66239', '#b0a1a4', '#e3dad2'],
      type: 'tundra',
    },
    {
      name: 'tundra3',
      colors: ['#87c3ca', '#7b7377', '#b2475d', '#7d3e3e', '#eb7f64', '#d9c67a', '#f3f2f2'],
      type: 'tundra',
    },
    {
      name: 'tundra4',
      colors: ['#d53939', '#b6754d', '#a88d5f', '#524643', '#3c5a53', '#7d8c7c', '#dad6cd'],
      type: 'tundra',
    },
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var orbifoldPalettes = [
    {
      name: 'candy-wrap',
      colors: ['#f19797', '#f9b73e', '#ee5151', '#fb671f', '#6bbe3a', '#0c75b7', '#0b9e4e', '#763f68'],
      stroke: '#302319',
      background: '#e7ded5',
      type: 'orbifold',
    },
    {
      name: 'slicks',
      colors: ['#e1decd', '#d95336', '#e6ac1d'],
      stroke: '#302319',
      background: '#e1decd',
      type: 'orbifold',
    },
    {
      name: 'circus',
      colors: ['#3eb79e', '#f4a910', '#f37377', '#207986', '#f26003', '#afce95'],
      stroke: '#302319',
      background: '#eadcb6',
      type: 'orbifold',
    },
    {
      name: 'spotlight',
      colors: ['#f34312', '#00a49e', '#ef888f', '#f5b408', '#412432'],
      stroke: '#412432',
      background: '#dfdcd5',
      type: 'orbifold',
    },
    {
      name: 'five-stars',
      colors: ['#f5e8c7', '#d9dcad', '#cf3933', '#f3f4f4', '#74330d', '#8bb896', '#eba824', '#f05c03'],
      stroke: '#380c05',
      background: '#ecd598',
      type: 'orbifold',
    },
    {
      name: 'full-moon',
      colors: ['#f7e8be', '#aa879f', '#f6634e'],
      stroke: '#2a1f39',
      background: '#f7e8be',
      type: 'orbifold',
    },
    {
      name: 'sunday-stroll',
      colors: [
        '#d44c4c',
        '#e47781',
        '#f5d274',
        '#f7e8be',
        '#acbe55',
        '#6fb97a',
        '#5ba150',
        '#037750',
        '#003e5e',
        '#595373',
        '#73659e',
        '#ac879f',
      ],
      background: '#e5cbb5',
      w: 2,
      type: 'orbifold',
    },
    {
      name: 'vegetable-soup',
      colors: ['#ec6a22', '#f7e9c5', '#399a3f', '#9ac764', '#fff7e0', '#ffcd6b', '#634754', '#98c195', '#708658'],
      background: '#fff7e0',
      w: 2,
      type: 'orbifold',
    },
    {
      name: 'risograph',
      colors: ['#f56f64', '#f9cb1f', '#f0eace'],
      stroke: '#295042',
      background: '#f0eace',
      w: 1,
      type: 'orbifold',
    },
    {
      name: 'tote-bag',
      colors: ['#f5f5f5', '#ffc6cf', '#fd5105', '#4124b0'],
      stroke: '#231e22',
      background: '#ffc6cf',
      w: 1,
      type: 'orbifold',
    },
    {
      name: 'slicks',
      colors: ['#ffbdd0', '#ff4328', '#e88526', '#21b929', '#2193c9', '#fffcea', '#ffcc21'],
      stroke: '#fffcea',
      background: '#212121',
      w: 1,
      type: 'orbifold',
    },
  ];

  //
  // Selected palettes from lospec
  // https://lospec.com/palette-list
  //
  var lospecPalettes = [
    {
      name: 'sweetie16', // https://lospec.com/palette-list/sweetie-16
      colors: [
        '#5d275d',
        '#b13e53',
        '#ef7d57',
        '#ffcd75',
        '#a7f070',
        '#38b764',
        '#257179',
        '#29366f',
        '#3b5dc9',
        '#41a6f6',
        '#73eff7',
        '#94b0c2',
        '#566c86',
        '#333c57',
      ],

      stroke: '#f4f4f4',
      background: '#1a1c2c',
      type: 'lospec',
    },
    {
      name: 'na16', // https://lospec.com/palette-list/na16
      colors: [
        '#8c8fae',
        '#584563',
        '#3e2137',
        '#9a6348',
        '#d79b7d',
        '#f5edba',
        '#c0c741',
        '#647d34',
        '#e4943a',
        '#9d303b',
        '#d26471',
        '#70377f',
        '#7ec4c1',
        '#34859d',
        '#17434b',
        '#1f0e1c',
      ],
      stroke: '#f5edba',
      background: '#1f0e1c',
      type: 'lospec',
    },
    {
      name: 'lost-century', // https://lospec.com/palette-list/lost-century
      colors: [
        '#d1b187',
        '#c77b58',
        '#ae5d40',
        '#79444a',
        '#4b3d44',
        '#ba9158',
        '#927441',
        '#4d4539',
        '#77743b',
        '#b3a555',
        '#d2c9a5',
        '#8caba1',
        '#4b726e',
        '#574852',
        '#847875',
        '#ab9b8e',
      ],
      type: 'lospec',
    },
    {
      name: 'nostalgic-dreams', // https://lospec.com/palette-list/nostalgic-dreams
      colors: ['#d9af80', '#b07972', '#524352', '#686887', '#7f9bb0', '#bfd4b0', '#90b870', '#628c70'],
      type: 'lospec',
    },
    {
      name: 'sls08', // https://lospec.com/palette-list/slso8
      colors: ['#0d2b45', '#203c56', '#544e68', '#8d697a', '#d08159', '#ffaa5e', '#ffd4a3', '#ffecd6'],
      type: 'lospec',
    },
    {
      name: 'rust-gold-8', // https://lospec.com/palette-list/rust-gold-8
      colors: ['#f6cd26', '#ac6b26', '#563226', '#331c17', '#bb7f57', '#725956', '#393939', '#202020'],
      type: 'lospec',
    },
    {
      name: 'ink-crimson', // https://lospec.com/palette-list/ink-crimson
      colors: [
        '#ff0546',
        '#9c173b',
        '#660f31',
        '#450327',
        '#270022',
        '#17001d',
        '#09010d',
        '#0ce6f2',
        '#0098db',
        '#1e579c',
      ],
      type: 'lospec',
    },
    {
      name: 'look-of-horror', // https://lospec.com/palette-list/look-of-horror
      colors: ['#0a202f', '#302d6a', '#871c3e', '#d32836'],
      type: 'lospec',
    },
    {
      name: 'cormorant14', // https://lospec.com/palette-list/cormorant14
      colors: [
        '#dc67b9',
        '#ffa3a2',
        '#fcf6e7',
        '#ff8e58',
        '#da6175',
        '#79396c',
        '#213756',
        '#26707a',
        '#24b8a0',
        '#8ee6a1',
        '#edd54f',
        '#6bae36',
        '#7da497',
        '#c8cdbb',
      ],
      type: 'lospec',
    },
    {
      name: 'midnight_ablaze',
      colors: ['#ff8274', '#d53c6a', '#7c183c', '#460e2b', '#31051e', '#1f0510', '#130208'],
      type: 'lospec',
    },
    {
      name: 'taliwan', // https://lospec.com/palette-list/taliwan
      colors: [
        '#f2eef1',
        '#ffa7bf',
        '#ec7d9b',
        '#e64667',
        '#a02552',
        '#75024d',
        '#2c0f30',
        '#e18434',
        '#ffa01b',
        '#ffbd20',
      ],
      type: 'lospec',
    },
    {
      name: 'spanish_sunset', // https://lospec.com/palette-list/spanish-sunset
      colors: ['#f5ddbc', '#fabb64', '#fd724e', '#a02f40', '#5f2f45'],
      type: 'lospec',
    },
    {
      name: 'late_night_bath', // https://lospec.com/palette-list/late-night-bath
      colors: ['#282d3c', '#5b5d70', '#74838c', '#ffc4b8', '#f69197'],
      type: 'lospec',
    },
    {
      name: 'vaporhaze', // https://lospec.com/palette-list/vaporhaze-16
      colors: [
        '#00474f',
        '#225054',
        '#475b58',
        '#6a645d',
        '#8e6e61',
        '#b17766',
        '#d4826b',
        '#f88c6e',
        '#156d8e',
        '#467b96',
        '#6b869b',
        '#8e8f9f',
        '#b199a3',
        '#d5a3a7',
        '#f8adac',
        '#ffbdbb',
      ],
      type: 'lospec',
    },
    {
      name: 'neon_reflection', // https://lospec.com/palette-list/dr-neon-reflection
      colors: [
        '#b1e2e7',
        '#5be4b9',
        '#10bdc6',
        '#517cb8',
        '#394072',
        '#7441ae',
        '#bb49d7',
        '#f69dbd',
        '#d8d272',
        '#f3ad58',
        '#e74a9d',
        '#af517a',
      ],
      type: 'lospec',
    },
    {
      name: '17pastels', // https://lospec.com/palette-list/17pastels
      colors: [
        '#373254',
        '#68356f',
        '#5e6b82',
        '#25718c',
        '#11abbe',
        '#69f6bf',
        '#eff0d7',
        '#f8e574',
        '#a3e75c',
        '#6d4442',
        '#a16557',
        '#f98bb7',
        '#c84c66',
        '#f79152',
        '#9b9c82',
        '#1c866d',
        '#59b15e',
      ],
      type: 'lospec',
    },
  ];

  //
  //  moma color palettes
  //  https://github.com/BlakeRMills/MoMAColors
  //
  var momaPalettes = [
    {
      name: 'Abbott',
      colors: ['#950404', '#e04b28', '#c38961', '#9f5630', '#388f30', '#0f542f', '#007d82', '#004042'],
      isPrimary: true,
      sortOrder: [1, 6, 5, 4, 3, 8, 2, 7],
      type: 'momacolors',
    },
    {
      name: 'Alkalay1',
      colors: ['#241d1d', '#5b2125', '#8d3431', '#bf542e', '#e9a800'],
      isPrimary: true,
      sortOrder: [5, 1, 4, 3, 2],
      type: 'momacolors',
    },
    {
      name: 'Alkalay2',
      colors: ['#ebcf2e', '#b4bf3a', '#88ab38', '#5e9432', '#3b7d31', '#225f2f', '#244422', '#252916'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      type: 'momacolors',
    },

    {
      name: 'Althoff',
      colors: ['#ff9898', '#d9636c', '#a91e45', '#691238', '#251714'],
      isPrimary: true,
      sortOrder: [2, 4, 1, 3, 5],
      type: 'momacolors',
    },
    {
      name: 'Andri',
      colors: ['#f56455', '#15134b', '#87c785', '#572f30'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'momacolors',
    },
    {
      name: 'Avedon',
      colors: [
        '#ff7200',
        '#ff8827',
        '#ff9c4c',
        '#ffb274',
        '#f1caa8',
        '#e3e1dc',
        '#c2ceaa',
        '#a1ba77',
        '#8bac54',
        '#7ea13e',
        '#648c16',
      ],
      isPrimary: true,
      sortOrder: [10, 1, 8, 4, 6, 3, 7, 5, 9, 2, 11],
      type: 'momacolors',
    },
    {
      name: 'Budnitz',
      colors: ['#86dd45', '#f6e71c', '#fda900', '#fd5300', '#57348b'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5],
      type: 'momacolors',
    },
    {
      name: 'Clay',
      colors: ['#c48329', '#8b3b36', '#a2b4b7', '#514a2e', '#cf9860', '#8E4115'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'momacolors',
    },
    {
      name: 'Connors',
      colors: ['#d92a05', '#f35d36', '#fc9073', '#ffba1b', '#60cfa1'],
      isPrimary: true,
      sortOrder: [5, 1, 4, 3, 2],
      type: 'momacolors',
    },
    {
      name: 'Dali',
      colors: ['#b4b87f', '#9c913f', '#585b33', '#6ea8ab', '#397893', '#31333f', '#8f5715', '#ba9a44', '#cfbb83'],
      isPrimary: true,
      sortOrder: [8, 3, 7, 1, 5, 9, 2, 6, 4],
      type: 'momacolors',
    },
    {
      name: 'Doughton',
      colors: [
        '#155b51',
        '#216f63',
        '#2d8277',
        '#3a9387',
        '#45a395',
        '#c468b2',
        '#af509c',
        '#803777',
        '#5d2155',
        '#45113f',
      ],
      isPrimary: true,
      sortOrder: [9, 3, 7, 1, 5, 6, 2, 8, 4, 10],
      type: 'momacolors',
    },
    {
      name: 'Ernst',
      colors: ['#e8e79a', '#c2d89a', '#8cbf9a', '#5fa2a4', '#477b95', '#315b88', '#24396b', '#191f40'],
      isPrimary: true,
      sortOrder: [4, 2, 6, 1, 3, 8, 5, 7],
      type: 'momacolors',
    },
    {
      name: 'Exter',
      colors: [
        '#ffec9d',
        '#fac881',
        '#f4a464',
        '#e87444',
        '#d9402a',
        '#bf2729',
        '#912534',
        '#64243e',
        '#3d1b28',
        '#161212',
      ],
      isPrimary: true,
      sortOrder: [4, 9, 2, 5, 7, 1, 6, 3, 8, 10],
      type: 'momacolors',
    },
    {
      name: 'Flash',
      colors: ['#e3c0db', '#db95cb', '#cd64b5', '#B83D9F', '#900c7e', '#680369', '#41045a', '#140e3a'],
      isPrimary: true,
      sortOrder: [4, 6, 1, 7, 2, 5, 3, 8],
      type: 'momacolors',
    },
    {
      name: 'Fritsch',
      colors: ['#0f8d7b', '#8942bd', '#1e1a1a', '#eadd17'],
      isPrimary: true,
      sortOrder: [1, 3, 4, 2],
      type: 'momacolors',
    },
    {
      name: 'Kippenberger',
      colors: [
        '#8b174d',
        '#ae2565',
        '#c1447e',
        '#d06c9b',
        '#da9fb8',
        '#d9d2cc',
        '#adbe7c',
        '#8ba749',
        '#6e8537',
        '#4f5f28',
        '#343d1f',
      ],
      isPrimary: true,
      sortOrder: [10, 6, 1, 8, 4, 3, 5, 9, 2, 7, 11],
      type: 'momacolors',
    },
    {
      name: 'Klein',
      colors: [
        '#ff4d6f',
        '#579ea4',
        '#df7713',
        '#f9c000',
        '#86ad34',
        '#5d7298',
        '#81b28d',
        '#7e1a2f',
        '#2d2651',
        '#c8350d',
        '#bd777a',
      ],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      type: 'momacolors',
    },
    {
      name: 'Koons',
      colors: ['#d8537d', '#6DC5B2', '#eeca76', '#5d2314', '#b5282a'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 5, 4],
      type: 'momacolors',
    },
    {
      name: 'Levine1 ',
      colors: ['#E0D9B2', '#818053', '#6B3848', '#8B3E50', '#D5BB6C', '#3F3A4B', '#474C66', '#A5806F'],
      isPrimary: true,
      sortOrder: [5, 4, 6, 1, 2, 7, 3, 8],
      type: 'momacolors',
    },
    {
      name: 'Levine2 ',
      colors: ['#E3C1CB', '#AD5A6B', '#C993A2', '#365C83', '#384351', '#4D8F8B', '#CDD6AD'],
      isPrimary: true,
      sortOrder: [7, 1, 5, 3, 6, 2, 4],
      type: 'momacolors',
    },
    {
      name: 'Liu',
      colors: ['#9fd7bd', '#9b5c1c', '#97c124', '#3b5f13', '#ddb25d', '#5c4a32'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'momacolors',
    },
    {
      name: 'Lupi',
      colors: ['#61bea4', '#b6e7e0', '#aa3f5d', '#daa5ac', '#98a54f', '#2e92a2', '#ffb651', '#d85a44'],
      isPrimary: true,
      sortOrder: [1, 6, 2, 8, 7, 3, 4, 5],
      type: 'momacolors',
    },
    {
      name: 'Ohchi',
      colors: ['#582851', '#40606d', '#69a257', '#e3d19c', '#c4024d'],
      isPrimary: true,
      sortOrder: [3, 4, 1, 2, 5],
      type: 'momacolors',
    },
    {
      name: 'OKeeffe',
      colors: ['#f3d567', '#ee9b43', '#e74b47', '#b80422', '#172767', '#19798b'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6],
      type: 'momacolors',
    },

    {
      name: 'Palermo',
      colors: ['#1b80ad', '#ea5b57', '#9c5555', '#0c3c5f'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4],
      type: 'momacolors',
    },
    {
      name: 'Panton',
      colors: ['#e84a00', '#bb1d2c', '#9b0c43', '#661f66', '#2c1f62', '#006289', '#004759'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8],
      type: 'momacolors',
    },
    {
      name: 'Picabia',
      colors: [
        '#53362e',
        '#744940',
        '#9f7064',
        '#c99582',
        '#e6bcac',
        '#e2d8d6',
        '#a5a6ae',
        '#858794',
        '#666879',
        '#515260',
        '#3d3d47',
      ],
      isPrimary: true,
      sortOrder: [10, 4, 8, 1, 6, 3, 7, 2, 9, 5, 11],
      type: 'momacolors',
    },
    {
      name: 'Picasso',
      colors: ['#d5968c', '#c2676d', '#5c363a', '#995041', '#45939c', '#0f6a81'],
      isPrimary: true,
      sortOrder: [6, 3, 4, 2, 1, 5],
      type: 'momacolors',
    },
    {
      name: 'Rattner',
      colors: ['#de8e69', '#f1be99', '#c1bd38', '#7a9132', '#4c849a', '#184363', '#5d5686', '#a39fc9'],
      isPrimary: true,
      sortOrder: [1, 5, 6, 2, 3, 7, 8, 4],
      type: 'momacolors',
    },
    {
      name: 'Sidhu',
      colors: ['#af4646', '#762b35', '#005187', '#251c4a', '#78adb7', '#4c9a77', '#1b7975'],
      isPrimary: true,
      sortOrder: [5, 2, 6, 7, 3, 4, 1],
      type: 'momacolors',
    },
    {
      name: 'Smith',
      colors: ['#ef7923', '#75bca9', '#7b89bb', '#e9de97', '#2a2e38'],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5],
      type: 'momacolors',
    },
    {
      name: 'ustwo',
      colors: ['#d7433b', '#f06a63', '#ff8e5e', '#ffcc3d', '#95caa6', '#008d98'],
      isPrimary: true,
      sortOrder: [6, 5, 2, 3, 1, 4],
      type: 'momacolors',
    },
    {
      name: 'VanGogh',
      colors: ['#c3a016', '#c3d878', '#58a787', '#8ebacd', '#246893', '#163274', '#0C1F4b'],
      isPrimary: true,
      sortOrder: [2, 4, 3, 6, 1, 5, 7],
      type: 'momacolors',
    },
    {
      name: 'vonHeyl',
      colors: ['#f96149', '#ffa479', '#e7d800', '#94aec2', '#0d0c0b'],
      isPrimary: true,
      sortOrder: [1, 4, 2, 3, 5],
      type: 'momacolors',
    },
    {
      name: 'Warhol',
      colors: [
        '#ff0066',
        '#328c97',
        '#d1aac2',
        '#a5506d',
        '#b3e0bf',
        '#2A9D3D',
        '#edf181',
        '#db7003',
        '#fba600',
        '#f8c1a6',
        '#A30000',
        '#ff3200',
        '#011a51',
        '#97d1d9',
        '#916c37',
      ],
      isPrimary: true,
      sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      type: 'momacolors',
    },
  ];

  //
  // Australian bird plumages
  // https://github.com/shandiya/feathers
  //
  var feathersPalettes = [
    {
      name: 'spotted_pardalote',
      colors: ['#feca00', '#d36328', '#cb0300', '#b4b9b3', '#424847', '#000100'],
      type: 'feathers',
    },
    {
      name: 'plains_wanderer',
      colors: ['#edd8c5', '#d09a5e', '#e7aa01', '#ac570f', '#73481b', '#442c0e', '#0d0403'],
      type: 'feathers',
    },
    {
      name: 'bee_eater',
      colors: ['#00346E', '#007CBF', '#06ABDF', '#EDD03E', '#F5A200', '#6D8600', '#424D0C'],
      type: 'feathers',
    },
    {
      name: 'rose_crowned_fruit_dove',
      colors: ['#BD338F', '#EB8252', '#F5DC83', '#CDD4DC', '#8098A2', '#8FA33F', '#5F7929', '#014820'],
      type: 'feathers',
    },
    {
      name: 'eastern_rosella',
      colors: ['#cd3122', '#f4c623', '#bee183', '#6c905e', '#2f533c', '#b8c9dc', '#2f7ab9'],
      type: 'feathers',
    },
    {
      name: 'oriole',
      colors: [
        '#8a3223',
        '#bb5645',
        '#d97878',
        '#e2aba0',
        '#d0cfe9',
        '#a29eb8',
        '#6c6b75',
        '#b8a53f',
        '#93862a',
        '#4d4019',
      ],
      type: 'feathers',
    },
    {
      name: 'princess_parrot',
      colors: ['#7090c9', '#8cb3de', '#afbe9f', '#616020', '#6eb245', '#214917', '#cf2236', '#d683ad'],
      type: 'feathers',
    },
    { name: 'superb_fairy_wren', colors: ['#4F3321', '#AA7853', '#D9C4A7', '#B03F05', '#020503'], type: 'feathers' },
    {
      name: 'cassowary',
      colors: ['#BDA14D', '#3EBCB6', '#0169C4', '#153460', '#D5114E', '#A56EB6', '#4B1C57', '#09090C'],
      type: 'feathers',
    },
    {
      name: 'yellow_robin',
      colors: ['#E19E00', '#FBEB5B', '#85773A', '#979EB9', '#727B98', '#454B56', '#201B1E'],
      type: 'feathers',
    },
    { name: 'galah', colors: ['#FFD2CF', '#E9A7BB', '#D05478', '#AAB9CC', '#8390A2', '#4C5766'], type: 'feathers' },
  ];

  //
  //  Wes Anderson movie color palettes
  //  https://github.com/karthik/wesanderson
  //
  var wesandersonPalettes = [
    {
      name: 'bottlerocket1',
      colors: ['#a42820', '#5f5647', '#9b110e', '#3f5151', '#4e2a1e', '#550307', '#0c1707'],
      type: 'wesanderson',
    },
    { name: 'bottlerocket2', colors: ['#fad510', '#cb2314', '#273046', '#354823', '#1e1e1e'], type: 'wesanderson' },
    { name: 'rushmore1', colors: ['#e1bd6d', '#eabe94', '#0b775e', '#35274a', '#f2300f'], type: 'wesanderson' },
    { name: 'rushmore', colors: ['#e1bd6d', '#eabe94', '#0b775e', '#35274a', '#f2300f'], type: 'wesanderson' },
    { name: 'royal1', colors: ['#899da4', '#c93312', '#faefd1', '#dc863b'], type: 'wesanderson' },
    { name: 'royal2', colors: ['#9a8822', '#f5cdb4', '#f8afa8', '#fddda0', '#74a089'], type: 'wesanderson' },
    { name: 'zissou1', colors: ['#3b9ab2', '#78b7c5', '#ebcc2a', '#e1af00', '#f21a00'], type: 'wesanderson' },
    {
      name: 'zissou2',
      colors: [
        '#3a9ab2',
        '#6fb2c1',
        '#91bab6',
        '#a5c2a3',
        '#bdc881',
        '#dccb4e',
        '#e3b710',
        '#e79805',
        '#ec7a05',
        '#ef5703',
        '#f11b00',
      ],
      type: 'wesanderson',
    },
    { name: 'darjeeling1', colors: ['#ff0000', '#00a08a', '#f2ad00', '#f98400', '#5bbcd6'], type: 'wesanderson' },
    { name: 'darjeeling2', colors: ['#eccbae', '#046c9a', '#d69c4e', '#abddde', '#000000'], type: 'wesanderson' },
    { name: 'chevalier1', colors: ['#446455', '#fdd262', '#d3dddc', '#c7b19c'], type: 'wesanderson' },
    { name: 'fantasticfox1', colors: ['#dd8d29', '#e2d200', '#46acc8', '#e58601', '#b40f20'], type: 'wesanderson' },
    { name: 'moonrise1', colors: ['#f3df6c', '#ceab07', '#d5d5d3', '#24281a'], type: 'wesanderson' },
    { name: 'moonrise2', colors: ['#798e87', '#c27d38', '#ccc591', '#29211f'], type: 'wesanderson' },
    { name: 'moonrise3', colors: ['#85d4e3', '#f4b5bd', '#9c964a', '#cdc08c', '#fad77b'], type: 'wesanderson' },
    { name: 'cavalcanti1', colors: ['#d8b70a', '#02401b', '#a2a475', '#81a88d', '#972d15'], type: 'wesanderson' },
    { name: 'grandbudapest1', colors: ['#f1bb7b', '#fd6467', '#5b1a18', '#d67236'], type: 'wesanderson' },
    { name: 'grandbudapest2', colors: ['#e6a0c4', '#c6cdf7', '#d8a499', '#7294d4'], type: 'wesanderson' },
    {
      name: 'isleofdogs1',
      colors: ['#9986a5', '#79402e', '#ccba72', '#0f0d0e', '#d9d0d3', '#8d8680'],
      type: 'wesanderson',
    },
    { name: 'isleofdogs2', colors: ['#ead3bf', '#aa9486', '#b6854d', '#39312f', '#1c1718'], type: 'wesanderson' },
    { name: 'frenchdispatch', colors: ['#90d4cc', '#bd3027', '#b0afa2', '#7fc0c6', '#9d9c85'], type: 'wesanderson' },
    { name: 'asteroidcity1', colors: ['#0a9f9d', '#ceb175', '#e54e21', '#6c8645', '#c18748'], type: 'wesanderson' },
    {
      name: 'asteroidcity2',
      colors: ['#c52e19', '#ac9765', '#54d8b1', '#b67c3b', '#175149', '#af4e24'],
      type: 'wesanderson',
    },
    { name: 'asteroidcity3', colors: ['#fba72a', '#d3d4d8', '#cb7a5c', '#5785c1'], type: 'wesanderson' },
  ];

  Toko.prototype.COLOR_COLLECTIONS = [];
  Toko.prototype.MODELIST = ['rgb', 'lrgb', 'lab', 'hsl', 'lch', 'oklab', 'oklch'];

  Toko.prototype.DEFAULT_COLOR_OPTIONS = {
    reverse: false,
    domain: [0, 1],
    mode: 'oklab',
    gamma: 1,
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
    // set to validated, so it is not needlessly checked multiple times
    //
    colorOptions._validated = true;

    return colorOptions;
  };

  Toko.prototype._createColorScale = function (colorSet, colorOptions, extraColors) {
    if (!this.initColorDone) {
      this._initColor();
    }
    let sc, oSC;
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
    // create a scale
    //
    sc = chroma.scale(colorSet).domain(colorOptions.domain).mode(colorOptions.mode);

    //
    // scale mapped to the original array of colors
    //
    oSC = chroma.scale(colorSet).domain(colorOptions.domain).classes(colorSet.length);

    //
    // only adjust gamma if needed
    //
    if (colorOptions.gamma != 1) {
      sc.gamma(colorOptions.gamma);
    }

    if (colorOptions.stepped && colorOptions.steps > 0) {
      sc = sc.classes(colorOptions.steps);
    }

    o.scaleChroma = sc;
    o.contrastColors = contrastColors;
    o.options = colorOptions;
    o.originalColors = colorSet;
    o.list = sc.colors(colorOptions.nrColors);

    o.scale = (i, useOriginal = false) => {
      if (!useOriginal) {
        return sc(i).hex();
      } else {
        return oSC(i).hex();
      }
    };

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
      feathersPalettes,
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
      momaPalettes,
      orbifoldPalettes,
      ranganathPalettes,
      rohlfsPalettes,
      roygbivsPalettes,
      spatialPalettes,
      systemPalettes,
      tsuchimochiPalettes,
      tundraPalettes,
      wesandersonPalettes,
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

  Toko.prototype.setup = function (inputOptions) {
    console.log('Toko - setup');

    // todo: fix the fps graph. Currently it increases when using the tweakpane controls
    this.capturer = {};
    this.captureOptions = this.DEFAULT_CAPTURE_OPTIONS;

    this.paletteSelectorData = {}; // array of double dropdowns to select a palette from a collection

    this.receivingFileNow = false;

    //
    // merge incoming options with the defaults
    //
    this.options = Object.assign({}, this.DEFAULT_OPTIONS, inputOptions);

    if (this.options.acceptDroppedSettings || this.options.acceptDroppedFiles) {
      p5Canvas.drop(this.dropFile.bind(this));
    }

    if (this.options.seedString != '') {
      Toko.reset(this.options.seedString);
    }

    if (this.options.useParameterPanel) {
      this.basePane = new Tweakpane.Pane({
        title: 'Sketch options',
      });

      var tabs = [{ title: this.TABS_PARAMETERS }];
      if (this.options.showAdvancedOptions) {
        tabs.push({ title: this.TABS_ADVANCED });
        this.TAB_ID_ADVANCED = tabs.length - 1;
      }

      if (this.options.captureFrames) {
        tabs.push({ title: this.TABS_CAPTURE });
        this.TAB_ID_CAPTURE = tabs.length - 1;
      }
      if (this.options.logFPS) {
        tabs.push({ title: this.TABS_FPS });
        this.TAB_ID_FPS = tabs.length - 1;
      }

      this.basePaneTab = this.basePane.addTab({ pages: tabs });

      //
      // register the tweakpane plugins
      //
      this.basePane.registerPlugin(TweakpaneEssentialsPlugin);
      this.basePane.registerPlugin(TweakpaneCamerakitPlugin);

      //
      // create references for use in the sketch
      //
      this.pane = {};
      this.pane.tab = this.basePaneTab.pages[0];
      this.pane.events = this.basePane;
      //
      // use (p) to show or hide the panel
      //
      document.onkeydown = function (event) {
        switch (event.key.toLocaleLowerCase()) {
          case 'p':
            var e = document.getElementsByClassName('tp-dfwv')[0];
            if (e.style.display == 'block') e.style.display = 'none';
            else e.style.display = 'block';

            break;
        }
      };

      //
      // add any additional canvas sizes that were passed along
      //
      let n = this.options.additionalCanvasSizes.length;
      if (n > 0) {
        for (let i = 0; i < n; i++) {
          this.addCanvasSize(this.options.additionalCanvasSizes[i]);
        }
      }

      //
      // add advanced options
      //
      if (this.options.showAdvancedOptions) {
        this.options.canvasSizeName = this.options.canvasSize.name; // use this to take the name out of the object
        this.basePaneTab.pages[this.TAB_ID_ADVANCED]
          .addBinding(this.options, 'canvasSizeName', {
            options: this.SIZES_LIST,
            label: 'canvas size',
          })
          .on('change', ev => {
            let s = this.SIZES.filter(p => p.name === ev.value)[0];
            this.setCanvasSize(s);
          });
      }
    }
    //
    // set the label and document title
    //
    document.getElementById('sketch-title').innerText = this.options.title;
    document.title = this.options.title;

    this.setCanvasSize(this.SIZES.filter(p => p.name === this.options.canvasSize.name)[0]);
  };

  Toko.prototype.endSetup = function () {
    console.log('Toko - endSetup');

    //
    // store the current canvas size as the default
    //
    this.SIZE_DEFAULT.width = width;
    this.SIZE_DEFAULT.height = height;

    if (this.options.logFPS) {
      this.pt = { fps: 0, graph: 0 };

      var f = this.basePaneTab.pages[this.TAB_ID_FPS];

      f.addBinding(this.pt, 'fps', { interval: 200, readonly: true });

      f.addBinding(this.pt, 'graph', {
        view: 'graph',
        interval: 100,
        min: 0,
        max: 120,
        readonly: true,
      });
    }

    if (this.options.useParameterPanel) {
      if (this.options.showSaveSketchButton && !this.options.saveSettingsWithSketch) {
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addBlade({
          view: 'separator',
        });
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addButton({ title: 'Save sketch' }).on('click', value => {
          this.saveSketch();
        });
      } else if (this.options.showSaveSketchButton && this.options.saveSettingsWithSketch) {
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addBlade({
          view: 'separator',
        });
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS]
          .addButton({ title: 'Save sketch & settings' })
          .on('click', value => {
            this.saveSketchAndSettings();
          });
      }
      if (this.options.hideParameterPanel) {
        var e = document.getElementsByClassName('tp-dfwv')[0];
        e.style.display = 'none';
      }
    }

    if (this.options.captureFrames) {
      this.captureOptions.format = this.options.captureFormat;
      this.createCapturePanel(this.TAB_ID_CAPTURE);
    }
  };

  Toko.prototype.startDraw = function () {
    //
    //	will be called at the start of the draw loop
    //
  };

  Toko.prototype.endDraw = function () {
    //
    //	will be called at the end of the draw loop
    //
    //--------------------------------------------
    //
    //	track fps with a simple filter to dampen any short spikes
    //
    if (this.options.logFPS) {
      this._frameTime += (deltaTime - this.FRAME_TIME) / this.FPS_FILTER_STRENGTH;
      this.pt.fps = this.pt.graph = Math.round(1000 / this.FRAME_TIME);
    }
  };

  //
  //  resize canvas to a new size while fitting within the window
  //
  Toko.prototype.setCanvasSize = function (inSize) {
    let margin = 80;
    let zoomFactor = 1;
    let displayFactor = inSize.pixelDensity / 2;
    let newWidthString, newHeightString;

    if (!inSize.fullWindow) {
      zoomFactor = Math.min(1, ((windowWidth - margin) / inSize.width) * displayFactor);
      zoomFactor = Math.min(zoomFactor, ((windowHeight - margin) / inSize.height) * displayFactor);

      newWidthString = Math.floor((inSize.width * zoomFactor) / displayFactor) + 'px';
      newHeightString = Math.floor((inSize.height * zoomFactor) / displayFactor) + 'px';
    } else {
      inSize.width = windowWidth;
      inSize.height = windowHeight;

      newWidthString = '100vw';
      newHeightString = '100vh';
    }

    resizeCanvas(inSize.width * displayFactor, inSize.height * displayFactor, true);

    p5Canvas.canvas.style.width = newWidthString;
    p5Canvas.canvas.style.height = newHeightString;
  };

  //
  //  add an additional size to the list of sizes - can only be done once Toko is set up
  //
  Toko.prototype.addCanvasSize = function (inSize) {
    this.SIZES.push(inSize);
    this.SIZES_LIST[inSize.name] = inSize.name;
  };

  //
  //  pick a random adjective from the list
  //  note this does not use the seeded random function to avoid file name conflicts
  //
  Toko.prototype.randomAdjective = function () {
    return this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
  };

  //
  //  pick a random noun from the list
  //  note this does not use the seeded random function to avoid file name conflicts
  //
  Toko.prototype.randomNoun = function () {
    return this.NOUNS[Math.floor(this.NOUNS.length * Math.random())];
  };

  //
  //  simple shortcut to set a p5 color object with a hexCode and alpha value
  //
  Toko.prototype.colorAlpha = function (hexColor, alpha = 255) {
    let c = color(hexColor);
    c.setAlpha(alpha);
    return c;
  };

  //
  //  additions to TweakPane
  //

  //
  // create a list that is convenient to use by Tweakpane
  //
  Toko.prototype.formatForTweakpane = function (inList, propertyName) {
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
  };

  //
  //  add next, previous and random buttons to the pane to navigate a specific list
  //
  Toko.prototype.addPaneNavButtons = function (
    paneRef,
    pObject,
    paletteKey,
    collectionKey,
    justPrimary = false,
    sorted = false,
    index = -1,
  ) {
    let o = {
      view: 'buttongrid',
      size: [3, 1],
      cells: (x, y) => ({
        title: [['← prev', 'next →', 'rnd']][y][x],
      }),
      label: ' ',
    };

    if (index != -1) {
      o.index = index;
    }

    paneRef.addBlade(o).on('click', ev => {
      let paletteList = toko.getPaletteSelection(pObject[collectionKey], justPrimary, sorted);
      switch (ev.index[0]) {
        case 0:
          pObject[paletteKey] = this.findPreviousInList(pObject[paletteKey], paletteList);
          break;
        case 1:
          pObject[paletteKey] = this.findNextInList(pObject[paletteKey], paletteList);
          break;
        case 2:
          pObject[paletteKey] = this.findRandomInList(pObject[paletteKey], paletteList);
          break;

        default:
          console.log('a non-existing button was pressed:', ev.index[0]);
          break;
      }
      this.basePane.refresh();
    });
  };

  //
  //  find the next item in a list formatted for TweakPane
  //
  Toko.prototype.findNextInList = function (item, list) {
    let keys = Object.keys(list);
    let i = keys.indexOf(item);
    let n;
    if (i < keys.length - 1) {
      n = i + 1;
    } else {
      n = 0;
    }
    let newItem = keys[n];
    return list[newItem];
  };

  //
  //  find the previous item in a list formatted for TweakPane
  //
  Toko.prototype.findPreviousInList = function (item, list) {
    let keys = Object.keys(list);
    let i = keys.indexOf(item);
    let n;
    if (i > 0) {
      n = i - 1;
    } else {
      n = keys.length - 1;
    }
    let newItem = keys[n];
    return list[newItem];
  };

  //
  //  select a random item in a list formatted for TweakPane
  //
  Toko.prototype.findRandomInList = function (item, list) {
    let keys = Object.keys(list);
    let newItem;
    do {
      newItem = keys[Math.floor(Math.random() * keys.length)];
    } while (newItem == item);
    return list[newItem];
  };

  //
  //  turn the long Tweakpane state into a more compact set of values
  //
  Toko.prototype._stateToPreset = function (stateObject) {
    let presetObject = {};

    function traverse (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // check if the current property is 'binding' and an object
          if (key === 'binding' && typeof obj[key] === 'object') {
            // if it is, extract the key value combination and add it to the presets
            let o = {};
            o[obj[key].key] = obj[key].value;
            presetObject = { ...presetObject, ...o };
          } else if (typeof obj[key] === 'object') {
            // if it is not binding but is and object, dig deeper
            traverse(obj[key]);
          }
        }
      }
    }

    // start traversing the state object
    traverse(stateObject);

    return presetObject;
  };

  //
  //  use the compact preset to create a new Tweakpane state
  //
  Toko.prototype._presetToState = function (presetObject) {
    let stateObject = this.basePane.exportState();

    function traverse (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // check if the current property is 'binding' and an object
          if (key === 'binding' && typeof obj[key] === 'object') {
            // update the 'binding' object with values from newPreset
            if (presetObject.hasOwnProperty(obj[key].key)) {
              obj[key].value = presetObject[obj[key].key];
            }
          } else if (typeof obj[key] === 'object') {
            // if the property is an object, recursively traverse it
            traverse(obj[key]);
          }
        }
      }
    }

    // start traversing the current state to add the preset values
    traverse(stateObject);

    return stateObject;
  };

  //
  //  add a double drop down to select a color palette
  //
  Toko.prototype.addPaletteSelector = function (paneRef, pObject, incomingOptions) {
    //
    //  set default options
    //
    let o = {
      index: 1,
      justPrimary: true,
      sorted: true,
      navButtons: true,
    };

    //
    // merge with default options
    //
    o = Object.assign({}, o, incomingOptions);
    o.paneRef = paneRef;
    o.pObject = pObject;

    o.colorPalettes = Toko.prototype.getPaletteSelection(o.pObject[o.collectionKey], o.justPrimary, o.sorted);
    o.collectionsList = Toko.prototype.formatForTweakpane(o.pObject[o.collectionsList]);

    o.collectionInput = o.paneRef
      .addBinding(o.pObject, o.collectionKey, {
        index: o.index,
        options: o.collectionsList,
      })
      .on('change', ev => {
        o.colorPalettes = Toko.prototype.getPaletteSelection(pObject[o.collectionKey], o.justPrimary, o.sorted);
        o.pObject[o.paletteKey] = Object.values(o.colorPalettes)[0];
        o.scaleInput.dispose();
        o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
          index: o.index,
          options: o.colorPalettes,
        });
      });

    o.scaleInput = paneRef.addBinding(o.pObject, o.paletteKey, {
      options: o.colorPalettes,
      index: o.index,
    });

    this.paletteSelectorData = o;

    //
    //  add nav buttons below the dropdowns
    //
    if (o.navButtons) {
      this.addPaneNavButtons(o.paneRef, o.pObject, o.paletteKey, o.collectionKey, o.justPrimary, o.sorted, o.index + 1);
    }
  };

  //
  //  update the color palette selector
  //
  Toko.prototype.updatePaletteSelector = function (receivedCollection, receivedPalette) {
    let o;
    o = this.paletteSelectorData;
    o.colorPalettes = Toko.prototype.getPaletteSelection(receivedCollection, o.justPrimary, o.sorted);
    o.scaleInput.dispose();
    o.pObject[o.paletteKey] = receivedPalette;
    o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
      index: o.index + 1,
      options: o.colorPalettes,
    });
    //
    //  call main refresh function to update everything
    //
    refresh();
  };

  //
  //  add blendmode palette selector
  //
  Toko.prototype.addBlendModeSelector = function (paneRef, pObject, incomingOptions) {
    //
    //  set default options
    //
    let o = {
      // reserved for future defaults
    };
    //
    // merge with default options
    //
    o = Object.assign({}, o, incomingOptions);
    //
    //  not all p5 blendmodes are included
    //
    paneRef.addBinding(pObject, o.blendModeKey, {
      options: {
        Default: BLEND,
        Multiply: MULTIPLY,
        Screen: SCREEN,
        Overlay: OVERLAY,
        Darkest: DARKEST,
        Lightest: LIGHTEST,
        Difference: DIFFERENCE,
        Exclusion: EXCLUSION,
        // Add: ADD,
        // Hard-light: HARD_LIGHT,
        // Soft-light: SOFT_LIGHT,
        // Dodge: DODGE,
        // Burn: BURN,
      },
    });
  };

  Toko.prototype.addRandomSeedControl = function (paneRef, pObject, incomingOptions) {
    //
    //  set default options
    //
    let o = {
      rng: toko._rng,
      seedStringKey: 'seedString',
      label: 'untitled',
    };

    o = Object.assign({}, o, incomingOptions);
    o.paneRef = paneRef;
    o.pObject = pObject;

    //
    //  string input
    //
    pObject[o.seedStringKey] = o.rng.seed;
    let seedStringForm = paneRef.addBinding(p, o.seedStringKey, {
      label: o.label,
    });
    seedStringForm.on('change', e => {
      o.rng.pushSeed(e.value);
    });

    const op = {
      view: 'buttongrid',
      size: [3, 1],
      cells: (x, y) => ({ title: [['← prev', 'next →', 'rnd']][y][x] }),
      label: ' ',
    };

    paneRef.addBlade(op).on('click', ev => {
      switch (ev.index[0]) {
        case 0:
          pObject[o.seedStringKey] = o.rng.previousSeed();
          break;
        case 1:
          pObject[o.seedStringKey] = o.rng.nextSeed();
          break;
        case 2:
          pObject[o.seedStringKey] = o.rng.randomSeed();
          break;
        default:
          console.log('a non-existing button was pressed:', ev.index[0]);
          break;
      }
      toko.pane.tab.refresh();
    });
  };

  //
  //  GENERAL MATH FUNCTIONS
  //

  //
  //  wrap a number around if it goes above the maximum or below the minimum
  //
  Toko.wrap = function (value, min = 0, max = 100) {
    let vw = value;

    if (value < min) {
      vw = max + (value - min);
    } else if (value > max) {
      vw = min + (value - max);
    }

    return vw;
  };

  //
  //  return number of integer digits
  //  see https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
  //
  Toko.numDigits = function (x) {
    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
  };

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
      let l = inString.length,
        r = Math.floor(this.random(0, l));
      return inString.charAt(r);
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

  // SimplexNoiseJS by Mark Spronck
  //  https://github.com/blindman67/SimplexNoiseJS

  // This is free and unencumbered software released into the public domain.

  // Anyone is free to copy, modify, publish, use, compile, sell, or
  // distribute this software, either in source code form or as a compiled
  // binary, for any purpose, commercial or non-commercial, and by any
  // means.

  // In jurisdictions that recognize copyright laws, the author or authors
  // of this software dedicate any and all copyright interest in the
  // software to the public domain. We make this dedication for the benefit
  // of the public at large and to the detriment of our heirs and
  // successors. We intend this dedication to be an overt act of
  // relinquishment in perpetuity of all present and future rights to this
  // software under copyright law.

  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  // IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
  // OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
  // ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  // OTHER DEALINGS IN THE SOFTWARE.

  // For more information, please refer to <http://unlicense.org>

  Toko.prototype.openSimplexNoise = function (clientSeed) {
    const SQ5 = 2.23606797749979;
    const SQ4 = 2;
    const SQ3 = 1.7320508075688772;
    const toNums = s => s.split(',').map(s => new Uint8Array(s.split('').map(v => Number(v))));
    const decode = (m, r, s) => new Int8Array(s.split('').map(v => parseInt(v, r) + m));
    const toNumsB32 = s => s.split(',').map(s => parseInt(s, 32));
    const NORM_2D = 1.0 / 47.0;
    const NORM_3D = 1.0 / 103.0;
    const NORM_4D = 1.0 / 30.0;
    const SQUISH_2D = (SQ3 - 1) / 2;
    const SQUISH_3D = (SQ4 - 1) / 3;
    const SQUISH_4D = (SQ5 - 1) / 4;
    const STRETCH_2D = (1 / SQ3 - 1) / 2;
    const STRETCH_3D = (1 / SQ4 - 1) / 3;
    const STRETCH_4D = (1 / SQ5 - 1) / 4;
    var base2D = toNums('110101000,110101211');
    var base3D = toNums('0000110010101001,2110210120113111,110010101001211021012011');
    var base4D = toNums(
      '0000011000101001001010001,3111031101310113011141111,11000101001001010001211002101021001201102010120011,31110311013101130111211002101021001201102010120011',
    );
    const gradients2D = decode(-5, 11, 'a77a073aa3700330');
    const gradients3D = decode(-11, 23, '0ff7mf7fmmfffmfffm07f70f77mm7ff0ff7m0f77m77f0mf7fm7ff0077707770m77f07f70');
    const gradients4D = decode(
      -3,
      7,
      '6444464444644446044426442464244662444044426442460244204422642246642446244404442604242624240424266224402442044226022420242204222664424642446244400442264224622440624240424262424002422042226222406422462244024420042226222402242062224022420242200222202222022220',
    );
    var lookupPairs2D = () =>
      new Uint8Array([0, 1, 1, 0, 4, 1, 17, 0, 20, 2, 21, 2, 22, 5, 23, 5, 26, 4, 39, 3, 42, 4, 43, 3]);
    var lookupPairs3D = () =>
      new Uint16Array(
        toNumsB32(
          '0,2,1,1,2,2,5,1,6,0,7,0,10,2,12,2,41,1,45,1,50,5,51,5,g6,0,g7,0,h2,4,h6,4,k5,3,k7,3,l0,5,l1,5,l2,4,l5,3,l6,4,l7,3,l8,d,l9,d,la,c,ld,e,le,c,lf,e,m8,k,ma,i,p9,l,pd,n,q8,k,q9,l,15e,j,15f,m,16a,i,16e,j,19d,n,19f,m,1a8,f,1a9,h,1aa,f,1ad,h,1ae,g,1af,g,1ag,b,1ah,a,1ai,b,1al,a,1am,9,1an,9,1bg,b,1bi,b,1eh,a,1el,a,1fg,8,1fh,8,1qm,9,1qn,9,1ri,7,1rm,7,1ul,6,1un,6,1vg,8,1vh,8,1vi,7,1vl,6,1vm,7,1vn,6',
        ),
      );
    var lookupPairs4D = () =>
      new Uint32Array(
        toNumsB32(
          '0,3,1,2,2,3,5,2,6,1,7,1,8,3,9,2,a,3,d,2,g,3,i,3,m,1,n,1,o,3,q,3,11,2,15,2,16,1,17,1,19,2,1d,2,1m,1,1n,1,1o,0,1p,0,1q,0,1r,0,1s,0,1t,0,1u,0,1v,0,80,3,82,3,88,3,8a,3,8g,3,8i,3,8o,3,8q,3,201,2,205,2,209,2,20d,2,211,2,215,2,219,2,21d,2,280,9,281,9,288,9,289,9,g06,1,g07,1,g0m,1,g0n,1,g16,1,g17,1,g1m,1,g1n,1,g82,8,g86,8,g8i,8,g8m,8,i05,6,i07,6,i15,6,i17,6,i80,9,i81,9,i82,8,i85,6,i86,8,i87,6,i88,9,i89,9,i8i,8,i8m,8,i95,6,i97,6,401o,0,401p,0,401q,0,401r,0,401s,0,401t,0,401u,0,401v,0,408o,7,408q,7,409o,7,409q,7,4219,5,421d,5,421p,5,421t,5,4280,9,4281,9,4288,9,4289,9,428o,7,428q,7,4299,5,429d,5,429o,7,429p,5,429q,7,429t,5,4g1m,4,4g1n,4,4g1u,4,4g1v,4,4g82,8,4g86,8,4g8i,8,4g8m,8,4g8o,7,4g8q,7,4g9m,4,4g9n,4,4g9o,7,4g9q,7,4g9u,4,4g9v,4,4i05,6,4i07,6,4i15,6,4i17,6,4i19,5,4i1d,5,4i1m,4,4i1n,4,4i1p,5,4i1t,5,4i1u,4,4i1v,4,4i80,9,4i81,9,4i82,8,4i85,6,4i86,8,4i87,6,4i88,9,4i89,9,4i8i,8,4i8m,8,4i8o,7,4i8q,7,4i95,6,4i97,6,4i99,5,4i9d,5,4i9m,4,4i9n,4,4i9o,7,4i9p,5,4i9q,7,4i9t,5,4i9u,4,4i9v,4,4ia0,15,4ia1,15,4ia2,14,4ia5,12,4ia6,14,4ia7,12,4ia8,15,4ia9,15,4iai,14,4iam,14,4iao,13,4iaq,13,4ib5,12,4ib7,12,4ib9,11,4ibd,11,4ibm,10,4ibn,10,4ibo,13,4ibp,11,4ibq,13,4ibt,11,4ibu,10,4ibv,10,4ii0,1h,4ii2,1g,4ii8,1h,4iii,1g,4iio,1f,4iiq,1f,4ka1,1e,4ka5,1d,4ka9,1e,4kb5,1d,4kb9,1c,4kbd,1c,4ki0,1h,4ki1,1e,4ki8,1h,4ki9,1e,52a6,1b,52a7,1a,52am,1b,52b7,1a,52bm,19,52bn,19,52i2,1g,52i6,1b,52ii,1g,52im,1b,54a5,1d,54a7,1a,54b5,1d,54b7,1a,54i0,v,54i1,s,54i2,v,54i5,s,54i6,p,54i7,p,8ibo,18,8ibp,17,8ibq,18,8ibt,17,8ibu,16,8ibv,16,8iio,1f,8iiq,1f,8ijo,18,8ijq,18,8kb9,1c,8kbd,1c,8kbp,17,8kbt,17,8ki8,u,8ki9,r,8kio,u,8kj9,r,8kjo,m,8kjp,m,92bm,19,92bn,19,92bu,16,92bv,16,92ii,t,92im,o,92iq,t,92jm,o,92jq,l,92ju,l,94b5,q,94b7,n,94bd,q,94bn,n,94bt,k,94bv,k,94i0,v,94i1,s,94i2,v,94i5,s,94i6,p,94i7,p,94i8,u,94i9,r,94ii,t,94im,o,94io,u,94iq,t,94j5,q,94j7,n,94j9,r,94jd,q,94jm,o,94jn,n,94jo,m,94jp,m,94jq,l,94jt,k,94ju,l,94jv,k,94k0,1t,94k1,1s,94k2,1t,94k5,1s,94k6,1r,94k7,1r,94k8,1q,94k9,1p,94ki,1n,94km,1m,94ko,1q,94kq,1n,94l5,1k,94l7,1j,94l9,1p,94ld,1k,94lm,1m,94ln,1j,94lo,1o,94lp,1o,94lq,1l,94lt,1i,94lu,1l,94lv,1i,94s0,1t,94s2,1t,94s8,1q,94si,1n,94so,1q,94sq,1n,96k1,1s,96k5,1s,96k9,1p,96l5,1k,96l9,1p,96ld,1k,96s0,2f,96s1,2f,96s8,2c,96s9,2c,9kk6,1r,9kk7,1r,9kkm,1m,9kl7,1j,9klm,1m,9kln,1j,9ks2,2e,9ks6,2e,9ksi,29,9ksm,29,9mk5,2d,9mk7,2d,9ml5,26,9ml7,26,9ms0,2f,9ms1,2f,9ms2,2e,9ms5,2d,9ms6,2e,9ms7,2d,d4lo,1o,d4lp,1o,d4lq,1l,d4lt,1i,d4lu,1l,d4lv,1i,d4so,2b,d4sq,28,d4to,2b,d4tq,28,d6l9,2a,d6ld,25,d6lp,2a,d6lt,25,d6s8,2c,d6s9,2c,d6so,2b,d6t9,2a,d6to,2b,d6tp,2a,dklm,27,dkln,24,dklu,27,dklv,24,dksi,29,dksm,29,dksq,28,dktm,27,dktq,28,dktu,27,dml5,26,dml7,26,dmld,25,dmln,24,dmlt,25,dmlv,24,dms0,23,dms1,23,dms2,22,dms5,20,dms6,22,dms7,20,dms8,23,dms9,23,dmsi,22,dmsm,22,dmso,21,dmsq,21,dmt5,20,dmt7,20,dmt9,1v,dmtd,1v,dmtm,1u,dmtn,1u,dmto,21,dmtp,1v,dmtq,21,dmtt,1v,dmtu,1u,dmtv,1u,dmu0,j,dmu1,j,dmu2,i,dmu5,g,dmu6,i,dmu7,g,dmu8,j,dmu9,j,dmui,i,dmum,i,dmuo,h,dmuq,h,dmv5,g,dmv7,g,dmv9,f,dmvd,f,dmvm,e,dmvn,e,dmvo,h,dmvp,f,dmvq,h,dmvt,f,dmvu,e,dmvv,e,dn60,j,dn61,j,dn62,i,dn66,i,dn68,j,dn69,j,dn6i,i,dn6m,i,dn6o,h,dn6q,h,dn7o,h,dn7q,h,dou0,j,dou1,j,dou5,g,dou7,g,dou8,j,dou9,j,dov5,g,dov7,g,dov9,f,dovd,f,dovp,f,dovt,f,dp60,j,dp61,j,dp68,j,dp69,j,e6u2,i,e6u5,g,e6u6,i,e6u7,g,e6ui,i,e6um,i,e6v5,g,e6v7,g,e6vm,e,e6vn,e,e6vu,e,e6vv,e,e762,i,e766,i,e76i,i,e76m,i,e8u5,g,e8u7,g,e8v5,g,e8v7,g,e960,d,e961,d,e962,d,e963,d,e964,d,e965,d,e966,d,e967,d,hmuo,h,hmuq,h,hmv9,f,hmvd,f,hmvm,e,hmvn,e,hmvo,h,hmvp,f,hmvq,h,hmvt,f,hmvu,e,hmvv,e,hn6o,h,hn6q,h,hn7o,h,hn7q,h,hov9,f,hovd,f,hovp,f,hovt,f,hp68,c,hp69,c,hp6o,c,hp6p,c,hp78,c,hp79,c,hp7o,c,hp7p,c,i6vm,e,i6vn,e,i6vu,e,i6vv,e,i76i,b,i76m,b,i76q,b,i76u,b,i77i,b,i77m,b,i77q,b,i77u,b,i8v5,a,i8v7,a,i8vd,a,i8vf,a,i8vl,a,i8vn,a,i8vt,a,i8vv,a,i960,d,i961,d,i962,d,i963,d,i964,d,i965,d,i966,d,i967,d,i968,c,i969,c,i96i,b,i96m,b,i96o,c,i96p,c,i96q,b,i96u,b,i975,a,i977,a,i978,c,i979,c,i97d,a,i97f,a,i97i,b,i97l,a,i97m,b,i97n,a,i97o,c,i97p,c,i97q,b,i97t,a,i97u,b,i97v,a',
        ),
      );
    var p2D = decode(-1, 4, '112011021322233123132111');
    var p3D = decode(
      -1,
      5,
      '112011210110211120110121102132212220132122202131222022243214231243124213241324123222113311221213131221123113311112202311112022311112220342223113342223311342223131322023113322023311320223113320223131322203311322203131',
    );
    var p4D = decode(
      -1,
      6,
      '11201112101121101102111120111210110121110211112011011211012111021322112220122210132121220212212013122120221212201321122201222102131212202122120213112220122210222532215232152231253212523125221325312252132521232513225123251223232211432114231123212143121421312312214132141231232112431124211323121241312412132311224113241123342221322203311134221232202331113421223202233111342221322203131134221232202313113412223022231311342221322203113134212232022311313412223022231131342212322023111334212232022311133412223022231113322201222101111132202122120111113202212122011111322012221021111132021221202111113201222102211111322201222103311132202122120331113220122210233111322201222103131132022121220313113202122120231311322021221203113132022121220311313201222102231131322012221023111332021221202311133201222102231113422111331113222042121131311322204211213113132220422111331113220242121131311322024211123111332202422111331113202242112131131320224211123111332022421211313113022242112131131302224211123111330222443211423115222244312142131522224413214123152222443112421135222244131241213522224411324112352222443211423113222044312142131322204413214123132220443211423113220244311242113322024413124121332202443121421313202244311242113320224411324112332022441321412313022244131241213302224411324112330222',
    );

    const setOf = (count, cb = i => i) => {
      var a = [],
        i = 0;
      while (i < count) {
        a.push(cb(i++));
      }
      return a;
    };
    const doFor = (count, cb) => {
      var i = 0;
      while (i < count && cb(i++) !== true);
    };

    function shuffleSeed (seed, count = 1) {
      seed = (seed * 1664525 + 1013904223) | 0;
      count -= 1;
      return count > 0 ? shuffleSeed(seed, count) : seed;
    }
    const types = {
      _2D: {
        base: base2D,
        squish: SQUISH_2D,
        dimensions: 2,
        pD: p2D,
        lookup: lookupPairs2D,
      },
      _3D: {
        base: base3D,
        squish: SQUISH_3D,
        dimensions: 3,
        pD: p3D,
        lookup: lookupPairs3D,
      },
      _4D: {
        base: base4D,
        squish: SQUISH_4D,
        dimensions: 4,
        pD: p4D,
        lookup: lookupPairs4D,
      },
    };

    function createContribution (type, baseSet, index) {
      var i = 0;
      const multiplier = baseSet[index++];
      const c = { next: undefined };
      while (i < type.dimensions) {
        const axis = 'xyzw'[i];
        c[axis + 'sb'] = baseSet[index + i];
        c['d' + axis] = -baseSet[index + i++] - multiplier * type.squish;
      }
      return c;
    }

    function createLookupPairs (lookupArray, contributions) {
      var i;
      const a = lookupArray();
      const res = new Map();
      for (i = 0; i < a.length; i += 2) {
        res.set(a[i], contributions[a[i + 1]]);
      }
      return res;
    }

    function createContributionArray (type) {
      const conts = [];
      const d = type.dimensions;
      const baseStep = d * d;
      var k,
        i = 0;
      while (i < type.pD.length) {
        const baseSet = type.base[type.pD[i]];
        let previous, current;
        k = 0;
        do {
          current = createContribution(type, baseSet, k);
          if (!previous) {
            conts[i / baseStep] = current;
          } else {
            previous.next = current;
          }
          previous = current;
          k += d + 1;
        } while (k < baseSet.length);

        current.next = createContribution(type, type.pD, i + 1);
        if (d >= 3) {
          current.next.next = createContribution(type, type.pD, i + d + 2);
        }
        if (d === 4) {
          current.next.next.next = createContribution(type, type.pD, i + 11);
        }
        i += baseStep;
      }
      const result = [conts, createLookupPairs(type.lookup, conts)];
      type.base = undefined;
      type.lookup = undefined;
      return result;
    }

    const [contributions2D, lookup2D] = createContributionArray(types._2D);
    const [contributions3D, lookup3D] = createContributionArray(types._3D);
    const [contributions4D, lookup4D] = createContributionArray(types._4D);
    const perm = new Uint8Array(256);
    const perm2D = new Uint8Array(256);
    const perm3D = new Uint8Array(256);
    const perm4D = new Uint8Array(256);
    const source = new Uint8Array(setOf(256, i => i));
    var seed = shuffleSeed(clientSeed, 3);
    doFor(256, i => {
      i = 255 - i;
      seed = shuffleSeed(seed);
      var r = (seed + 31) % (i + 1);
      r += r < 0 ? i + 1 : 0;
      perm[i] = source[r];
      perm2D[i] = perm[i] & 0x0e;
      perm3D[i] = (perm[i] % 24) * 3;
      perm4D[i] = perm[i] & 0xfc;
      source[r] = source[i];
    });
    base2D = base3D = base4D = undefined;
    lookupPairs2D = lookupPairs3D = lookupPairs4D = undefined;
    p2D = p3D = p4D = undefined;

    const API = {
      noise2D (x, y) {
        const pD = perm2D;
        const p = perm;
        const g = gradients2D;
        const stretchOffset = (x + y) * STRETCH_2D;
        const xs = x + stretchOffset,
          ys = y + stretchOffset;
        const xsb = Math.floor(xs),
          ysb = Math.floor(ys);
        const squishOffset = (xsb + ysb) * SQUISH_2D;
        const dx0 = x - (xsb + squishOffset),
          dy0 = y - (ysb + squishOffset);
        var c = (() => {
          const xins = xs - xsb,
            yins = ys - ysb;
          const inSum = xins + yins;
          return lookup2D.get((xins - yins + 1) | (inSum << 1) | ((inSum + yins) << 2) | ((inSum + xins) << 4));
        })();
        var i,
          value = 0;
        while (c !== undefined) {
          const dx = dx0 + c.dx;
          const dy = dy0 + c.dy;
          let attn = 2 - dx * dx - dy * dy;
          if (attn > 0) {
            i = pD[(p[(xsb + c.xsb) & 0xff] + (ysb + c.ysb)) & 0xff];
            attn *= attn;
            value += attn * attn * (g[i++] * dx + g[i] * dy);
          }
          c = c.next;
        }
        return value * NORM_2D;
      },
      noise3D (x, y, z) {
        const pD = perm3D;
        const p = perm;
        const g = gradients3D;
        const stretchOffset = (x + y + z) * STRETCH_3D;
        const xs = x + stretchOffset,
          ys = y + stretchOffset,
          zs = z + stretchOffset;
        const xsb = Math.floor(xs),
          ysb = Math.floor(ys),
          zsb = Math.floor(zs);
        const squishOffset = (xsb + ysb + zsb) * SQUISH_3D;
        const dx0 = x - (xsb + squishOffset),
          dy0 = y - (ysb + squishOffset),
          dz0 = z - (zsb + squishOffset);
        var c = (() => {
          const xins = xs - xsb,
            yins = ys - ysb,
            zins = zs - zsb;
          const inSum = xins + yins + zins;
          return lookup3D.get(
            (yins - zins + 1) |
              ((xins - yins + 1) << 1) |
              ((xins - zins + 1) << 2) |
              (inSum << 3) |
              ((inSum + zins) << 5) |
              ((inSum + yins) << 7) |
              ((inSum + xins) << 9),
          );
        })();
        var i,
          value = 0;
        while (c !== undefined) {
          const dx = dx0 + c.dx,
            dy = dy0 + c.dy,
            dz = dz0 + c.dz;
          let attn = 2 - dx * dx - dy * dy - dz * dz;
          if (attn > 0) {
            i = pD[(((p[(xsb + c.xsb) & 0xff] + (ysb + c.ysb)) & 0xff) + (zsb + c.zsb)) & 0xff];
            attn *= attn;
            value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i] * dz);
          }
          c = c.next;
        }
        return value * NORM_3D;
      },
      noise4D (x, y, z, w) {
        const pD = perm4D;
        const p = perm;
        const g = gradients4D;
        const stretchOffset = (x + y + z + w) * STRETCH_4D;
        const xs = x + stretchOffset,
          ys = y + stretchOffset,
          zs = z + stretchOffset,
          ws = w + stretchOffset;
        const xsb = Math.floor(xs),
          ysb = Math.floor(ys),
          zsb = Math.floor(zs),
          wsb = Math.floor(ws);
        const squishOffset = (xsb + ysb + zsb + wsb) * SQUISH_4D;
        const dx0 = x - (xsb + squishOffset),
          dy0 = y - (ysb + squishOffset),
          dz0 = z - (zsb + squishOffset),
          dw0 = w - (wsb + squishOffset);
        var c = (() => {
          const xins = xs - xsb,
            yins = ys - ysb,
            zins = zs - zsb,
            wins = ws - wsb;
          const inSum = xins + yins + zins + wins;
          return lookup4D.get(
            (zins - wins + 1) |
              ((yins - zins + 1) << 1) |
              ((yins - wins + 1) << 2) |
              ((xins - yins + 1) << 3) |
              ((xins - zins + 1) << 4) |
              ((xins - wins + 1) << 5) |
              (inSum << 6) |
              ((inSum + wins) << 8) |
              ((inSum + zins) << 11) |
              ((inSum + yins) << 14) |
              ((inSum + xins) << 17),
          );
        })();
        var i,
          value = 0;
        while (c !== undefined) {
          const dx = dx0 + c.dx,
            dy = dy0 + c.dy,
            dz = dz0 + c.dz,
            dw = dw0 + c.dw;
          let attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
          if (attn > 0) {
            i =
              pD[(((((p[(xsb + c.xsb) & 0xff] + (ysb + c.ysb)) & 0xff) + (zsb + c.zsb)) & 0xff) + (wsb + c.wsb)) & 0xff];
            attn *= attn;
            value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i++] * dz + g[i] * dw);
          }
          c = c.next;
        }
        return value * NORM_4D;
      },
    };
    return API;
  };

  //
  //  QuadTree
  //

  //  Original code by Daniel Shiffman
  //  http://codingtra.in
  //  http://patreon.com/codingtrain
  //  https://github.com/CodingTrain/QuadTree

  //  MIT License

  //  Copyright (c) 2021 Coding Train

  //  Permission is hereby granted, free of charge, to any person obtaining a copy
  //  of this software and associated documentation files (the "Software"), to deal
  //  in the Software without restriction, including without limitation the rights
  //  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  //  copies of the Software, and to permit persons to whom the Software is
  //  furnished to do so, subject to the following conditions:

  //  The above copyright notice and this permission notice shall be included in all
  //  copies or substantial portions of the Software.

  //  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  //  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  //  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  //  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  //  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  //  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  //  SOFTWARE.

  Toko.QuadTree = class {
    DEFAULT_CAPACITY = 8;
    MAX_DEPTH = 8;

    constructor (boundary, capacity = this.DEFAULT_CAPACITY, _depth = 0) {
      if (!boundary) {
        throw TypeError('boundary is null or undefined');
      }
      if (!(boundary instanceof Toko.QuadTree.Rectangle)) {
        throw TypeError('boundary should be a Rectangle');
      }
      if (typeof capacity !== 'number') {
        throw TypeError(`capacity should be a number but is a ${typeof capacity}`);
      }
      if (capacity < 1) {
        throw RangeError('capacity must be greater than 0');
      }

      this.boundary = boundary;
      this.capacity = capacity;
      this.points = [];
      this.divided = false;

      this.depth = _depth;
    }

    get children () {
      if (this.divided) {
        return [this.northeast, this.northwest, this.southeast, this.southwest];
      } else {
        return [];
      }
    }

    clear () {
      this.points = [];

      if (this.divided) {
        this.divided = false;
        delete this.northwest;
        delete this.northeast;
        delete this.southwest;
        delete this.southeast;
      }
    }

    static create () {
      if (arguments.length === 0) {
        if (typeof width === 'undefined') {
          throw new TypeError('No global width defined');
        }
        if (typeof height === 'undefined') {
          throw new TypeError('No global height defined');
        }
        let bounds = new Toko.QuadTree.Rectangle(width / 2, height / 2, width, height);
        return new Toko.QuadTree(bounds, this.DEFAULT_CAPACITY);
      }
      if (arguments[0] instanceof Toko.QuadTree.Rectangle) {
        let capacity = arguments[1] || this.DEFAULT_CAPACITY;
        return new Toko.QuadTree(arguments[0], capacity);
      }
      if (
        typeof arguments[0] === 'number' &&
        typeof arguments[1] === 'number' &&
        typeof arguments[2] === 'number' &&
        typeof arguments[3] === 'number'
      ) {
        let capacity = arguments[4] || this.DEFAULT_CAPACITY;
        return new Toko.QuadTree(
          new Toko.QuadTree.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]),
          capacity,
        );
      }
      throw new TypeError('Invalid parameters');
    }

    toJSON () {
      let obj = {};

      if (this.divided) {
        if (this.northeast.divided || this.northeast.points.length > 0) {
          obj.ne = this.northeast.toJSON();
        }
        if (this.northwest.divided || this.northwest.points.length > 0) {
          obj.nw = this.northwest.toJSON();
        }
        if (this.southeast.divided || this.southeast.points.length > 0) {
          obj.se = this.southeast.toJSON();
        }
        if (this.southwest.divided || this.southwest.points.length > 0) {
          obj.sw = this.southwest.toJSON();
        }
      } else {
        obj.points = this.points;
      }

      if (this.depth === 0) {
        obj.capacity = this.capacity;
        obj.x = this.boundary.x;
        obj.y = this.boundary.y;
        obj.w = this.boundary.w;
        obj.h = this.boundary.h;
      }

      return obj;
    }

    static fromJSON (obj, x, y, w, h, capacity, depth) {
      if (typeof x === 'undefined') {
        if ('x' in obj) {
          x = obj.x;
          y = obj.y;
          w = obj.w;
          h = obj.h;
          capacity = obj.capacity;
          depth = 0;
        } else {
          throw TypeError('JSON missing boundary information');
        }
      }

      let qt = new Toko.QuadTree(new Toko.QuadTree.Rectangle(x, y, w, h), capacity, depth);

      qt.points = obj.points ?? null;
      qt.divided = qt.points === null; // points are set to null on subdivide

      if ('ne' in obj || 'nw' in obj || 'se' in obj || 'sw' in obj) {
        const x = qt.boundary.x;
        const y = qt.boundary.y;
        const w = qt.boundary.w / 2;
        const h = qt.boundary.h / 2;

        if ('ne' in obj) {
          qt.northeast = Toko.QuadTree.fromJSON(obj.ne, x + w / 2, y - h / 2, w, h, capacity, depth + 1);
        } else {
          qt.northeast = new Toko.QuadTree(qt.boundary.subdivide('ne'), capacity, depth + 1);
        }
        if ('nw' in obj) {
          qt.northwest = Toko.QuadTree.fromJSON(obj.nw, x - w / 2, y - h / 2, w, h, capacity, depth + 1);
        } else {
          qt.northwest = new Toko.QuadTree(qt.boundary.subdivide('nw'), capacity, depth + 1);
        }
        if ('se' in obj) {
          qt.southeast = Toko.QuadTree.fromJSON(obj.se, x + w / 2, y + h / 2, w, h, capacity, depth + 1);
        } else {
          qt.southeast = new Toko.QuadTree(qt.boundary.subdivide('se'), capacity, depth + 1);
        }
        if ('sw' in obj) {
          qt.southwest = Toko.QuadTree.fromJSON(obj.sw, x - w / 2, y + h / 2, w, h, capacity, depth + 1);
        } else {
          qt.southwest = new Toko.QuadTree(qt.boundary.subdivide('sw'), capacity, depth + 1);
        }
      }

      return qt;
    }

    subdivide () {
      this.northeast = new Toko.QuadTree(this.boundary.subdivide('ne'), this.capacity, this.depth + 1);
      this.northwest = new Toko.QuadTree(this.boundary.subdivide('nw'), this.capacity, this.depth + 1);
      this.southeast = new Toko.QuadTree(this.boundary.subdivide('se'), this.capacity, this.depth + 1);
      this.southwest = new Toko.QuadTree(this.boundary.subdivide('sw'), this.capacity, this.depth + 1);

      this.divided = true;

      // Move points to children.
      // This improves performance by placing points
      // in the smallest available rectangle.
      for (const p of this.points) {
        const inserted =
          this.northeast.insert(p) || this.northwest.insert(p) || this.southeast.insert(p) || this.southwest.insert(p);

        if (!inserted) {
          throw RangeError('capacity must be greater than 0');
        }
      }

      this.points = null;
    }

    insert (point) {
      if (!this.boundary.contains(point)) {
        return false;
      }

      if (!this.divided) {
        if (this.points.length < this.capacity || this.depth === this.MAX_DEPTH) {
          this.points.push(point);
          return true;
        }

        this.subdivide();
      }

      return (
        this.northeast.insert(point) ||
        this.northwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point)
      );
    }

    query (range, found) {
      if (!found) {
        found = [];
      }

      if (!range.intersects(this.boundary)) {
        return found;
      }

      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
        return found;
      }

      for (const p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }

      return found;
    }

    deleteInRange (range) {
      if (this.divided) {
        this.northwest.deleteInRange(range);
        this.northeast.deleteInRange(range);
        this.southwest.deleteInRange(range);
        this.southeast.deleteInRange(range);
      }

      // Delete points with range
      this.points = this.points.filter(point => !range.contains(point));
    }

    closest (searchPoint, maxCount = 1, maxDistance = Infinity) {
      if (typeof searchPoint === 'undefined') {
        throw TypeError("Method 'closest' needs a point");
      }

      const sqMaxDistance = maxDistance ** 2;
      return this.kNearest(searchPoint, maxCount, sqMaxDistance, 0, 0).found;
    }

    kNearest (searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar) {
      let found = [];

      if (this.divided) {
        this.children
          .sort((a, b) => a.boundary.sqDistanceFrom(searchPoint) - b.boundary.sqDistanceFrom(searchPoint))
          .forEach(child => {
            const sqDistance = child.boundary.sqDistanceFrom(searchPoint);
            if (sqDistance > sqMaxDistance) {
              return;
            } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
              const result = child.kNearest(searchPoint, maxCount, sqMaxDistance, furthestSqDistance, foundSoFar);
              const childPoints = result.found;
              found = found.concat(childPoints);
              foundSoFar += childPoints.length;
              furthestSqDistance = result.furthestSqDistance;
            }
          });
      } else {
        this.points
          .sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint))
          .forEach(p => {
            const sqDistance = p.sqDistanceFrom(searchPoint);
            if (sqDistance > sqMaxDistance) {
              return;
            } else if (foundSoFar < maxCount || sqDistance < furthestSqDistance) {
              found.push(p);
              furthestSqDistance = Math.max(sqDistance, furthestSqDistance);
              foundSoFar++;
            }
          });
      }

      return {
        found: found.sort((a, b) => a.sqDistanceFrom(searchPoint) - b.sqDistanceFrom(searchPoint)).slice(0, maxCount),
        furthestSqDistance: Math.sqrt(furthestSqDistance),
      };
    }

    forEach (fn) {
      if (this.divided) {
        this.northeast.forEach(fn);
        this.northwest.forEach(fn);
        this.southeast.forEach(fn);
        this.southwest.forEach(fn);
      } else {
        this.points.forEach(fn);
      }
    }

    filter (fn) {
      let filtered = new Toko.QuadTree(this.boundary, this.capacity);

      this.forEach(point => {
        if (fn(point)) {
          filtered.insert(point);
        }
      });

      return filtered;
    }

    merge (other, capacity) {
      let left = Math.min(this.boundary.left, other.boundary.left);
      let right = Math.max(this.boundary.right, other.boundary.right);
      let top = Math.min(this.boundary.top, other.boundary.top);
      let bottom = Math.max(this.boundary.bottom, other.boundary.bottom);

      let height = bottom - top;
      let width = right - left;

      let midX = left + width / 2;
      let midY = top + height / 2;

      let boundary = new Toko.QuadTree.Rectangle(midX, midY, width, height);
      let result = new Toko.QuadTree(boundary, capacity);

      this.forEach(point => result.insert(point));
      other.forEach(point => result.insert(point));

      return result;
    }

    get length () {
      if (this.divided) {
        return this.northwest.length + this.northeast.length + this.southwest.length + this.southeast.length;
      }

      return this.points.length;
    }
  };

  //
  //------------------------------------------------------------------------------------------------------------------
  //

  // circle class for a circle shaped query
  Toko.QuadTree.Circle = class {
    constructor (x, y, r, data) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.rSquared = this.r * this.r;
      this.data = data;
    }

    contains (point) {
      // check if the point is in the circle by checking if the euclidean distance of
      // the point and the center of the circle if smaller or equal to the radius of
      // the circle
      let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
      return d <= this.rSquared;
    }

    intersects (range) {
      let xDist = Math.abs(range.x - this.x);
      let yDist = Math.abs(range.y - this.y);

      // radius of the circle
      let r = this.r;

      let w = range.w / 2;
      let h = range.h / 2;

      let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

      // no intersection
      if (xDist > r + w || yDist > r + h) return false;

      // intersection within the circle
      if (xDist <= w || yDist <= h) return true;

      // intersection on the edge of the circle
      return edges <= this.rSquared;
    }
  };

  Toko.QuadTree.Point = class {
    constructor (x, y, data) {
      this.x = x;
      this.y = y;
      this.userData = data;
    }

    // Skips Math.sqrt for faster comparisons
    sqDistanceFrom (other) {
      const dx = other.x - this.x;
      const dy = other.y - this.y;

      return dx * dx + dy * dy;
    }

    // Pythagorus: a^2 = b^2 + c^2
    distanceFrom (other) {
      return Math.sqrt(this.sqDistanceFrom(other));
    }
  };

  Toko.QuadTree.Rectangle = class {
    constructor (x, y, w, h, data) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;

      this.left = x - w / 2;
      this.right = x + w / 2;
      this.top = y - h / 2;
      this.bottom = y + h / 2;
    }

    contains (point) {
      return this.left <= point.x && point.x <= this.right && this.top <= point.y && point.y <= this.bottom;
    }

    intersects (range) {
      return !(this.right < range.left || range.right < this.left || this.bottom < range.top || range.bottom < this.top);
    }

    subdivide (quadrant) {
      switch (quadrant) {
        case 'ne':
          return new Toko.QuadTree.Rectangle(this.x + this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
        case 'nw':
          return new Toko.QuadTree.Rectangle(this.x - this.w / 4, this.y - this.h / 4, this.w / 2, this.h / 2);
        case 'se':
          return new Toko.QuadTree.Rectangle(this.x + this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
        case 'sw':
          return new Toko.QuadTree.Rectangle(this.x - this.w / 4, this.y + this.h / 4, this.w / 2, this.h / 2);
      }
    }

    xDistanceFrom (point) {
      if (this.left <= point.x && point.x <= this.right) {
        return 0;
      }

      return Math.min(Math.abs(point.x - this.left), Math.abs(point.x - this.right));
    }

    yDistanceFrom (point) {
      if (this.top <= point.y && point.y <= this.bottom) {
        return 0;
      }

      return Math.min(Math.abs(point.y - this.top), Math.abs(point.y - this.bottom));
    }

    // Skips Math.sqrt for faster comparisons
    sqDistanceFrom (point) {
      const dx = this.xDistanceFrom(point);
      const dy = this.yDistanceFrom(point);

      return dx * dx + dy * dy;
    }

    // Pythagorus: a^2 = b^2 + c^2
    distanceFrom (point) {
      return Math.sqrt(this.sqDistanceFrom(point));
    }
  };

  // Based on
  // https://gist.github.com/gre/1650294
  // https://github.com/AndrewRayCode/easing-utils

  // No easing, no acceleration
  Toko.prototype.easeLinear = t => {
    return t;
  };

  // Slight acceleration from zero to full speed
  Toko.prototype.easeInSine = t => {
    return -1 * Math.cos(t * (Math.PI / 2)) + 1;
  };

  // Slight deceleration at the end
  Toko.prototype.easeOutSine = t => {
    return Math.sin(t * (Math.PI / 2));
  };

  // Slight acceleration at beginning and slight deceleration at end
  Toko.prototype.easeInOutSine = t => {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  };

  // Accelerating from zero velocity
  Toko.prototype.easeInQuad = t => {
    return t * t;
  };

  // Decelerating to zero velocity
  Toko.prototype.easeOutQuad = t => {
    return t * (2 - t);
  };

  // Acceleration until halfway, then deceleration
  Toko.prototype.easeInOutQuad = t => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Accelerating from zero velocity
  Toko.prototype.easeInCubic = t => {
    return t * t * t;
  };

  // Decelerating to zero velocity
  Toko.prototype.easeOutCubic = t => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  };

  // Acceleration until halfway, then deceleration
  Toko.prototype.easeInOutCubic = t => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  // Accelerating from zero velocity
  Toko.prototype.easeInQuart = t => {
    return t * t * t * t;
  };

  // Decelerating to zero velocity
  Toko.prototype.easeOutQuart = t => {
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
  };

  // Acceleration until halfway, then deceleration
  Toko.prototype.easeInOutQuart = t => {
    const t1 = t - 1;
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
  };

  // Accelerating from zero velocity
  Toko.prototype.easeInQuint = t => {
    return t * t * t * t * t;
  };

  // Decelerating to zero velocity
  Toko.prototype.easeOutQuint = t => {
    const t1 = t - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
  };

  // Acceleration until halfway, then deceleration
  Toko.prototype.easeInOutQuint = t => {
    const t1 = t - 1;
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
  };

  // Accelerate exponentially until finish
  Toko.prototype.easeInExpo = t => {
    if (t === 0) {
      return 0;
    }

    return Math.pow(2, 10 * (t - 1));
  };

  // Initial exponential acceleration slowing to stop
  Toko.prototype.easeOutExpo = t => {
    if (t === 1) {
      return 1;
    }

    return -Math.pow(2, -10 * t) + 1;
  };

  // Exponential acceleration and deceleration
  Toko.prototype.easeInOutExpo = t => {
    if (t === 0 || t === 1) {
      return t;
    }

    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;

    if (scaledTime < 1) {
      return 0.5 * Math.pow(2, 10 * scaledTime1);
    }

    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
  };

  // Increasing velocity until stop
  Toko.prototype.easeInCirc = t => {
    const scaledTime = t / 1;
    return -1 * (Math.sqrt(1 - scaledTime * t) - 1);
  };

  // Start fast, decreasing velocity until stop
  Toko.prototype.easeOutCirc = t => {
    const t1 = t - 1;
    return Math.sqrt(1 - t1 * t1);
  };

  // Fast increase in velocity, fast decrease in velocity
  Toko.prototype.easeInOutCirc = t => {
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 2;

    if (scaledTime < 1) {
      return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
    }

    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
  };

  // Slow movement backwards then fast snap to finish
  Toko.prototype.easeInBack = (t, magnitude = 1.70158) => {
    return t * t * ((magnitude + 1) * t - magnitude);
  };

  // Fast snap to backwards point then slow resolve to finish
  Toko.prototype.easeOutBack = (t, magnitude = 1.70158) => {
    const scaledTime = t / 1 - 1;

    return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
  };

  // Slow movement backwards, fast snap to past finish, slow resolve to finish
  Toko.prototype.easeInOutBack = (t, magnitude = 1.70158) => {
    const scaledTime = t * 2;
    const scaledTime2 = scaledTime - 2;

    const s = magnitude * 1.525;

    if (scaledTime < 1) {
      return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
    }

    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
  };
  // Bounces slowly then quickly to finish
  Toko.prototype.easeInElastic = (t, magnitude = 0.7) => {
    if (t === 0 || t === 1) {
      return t;
    }

    const scaledTime = t / 1;
    const scaledTime1 = scaledTime - 1;

    const p = 1 - magnitude;
    const s = (p / (2 * Math.PI)) * Math.asin(1);

    return -(Math.pow(2, 10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
  };

  // Fast acceleration, bounces to zero
  Toko.prototype.easeOutElastic = (t, magnitude = 0.7) => {
    if (t === 0 || t === 1) {
      return t;
    }

    const p = 1 - magnitude;
    const scaledTime = t * 2;

    const s = (p / (2 * Math.PI)) * Math.asin(1);
    return Math.pow(2, -10 * scaledTime) * Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) + 1;
  };

  // Slow start and end, two bounces sandwich a fast motion
  Toko.prototype.easeInOutElastic = (t, magnitude = 0.65) => {
    if (t === 0 || t === 1) {
      return t;
    }

    const p = 1 - magnitude;
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;

    const s = (p / (2 * Math.PI)) * Math.asin(1);

    if (scaledTime < 1) {
      return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
    }

    return Math.pow(2, -10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) * 0.5 + 1;
  };

  // Bounce to completion
  Toko.prototype.easeOutBounce = t => {
    const scaledTime = t / 1;

    if (scaledTime < 1 / 2.75) {
      return 7.5625 * scaledTime * scaledTime;
    } else if (scaledTime < 2 / 2.75) {
      const scaledTime2 = scaledTime - 1.5 / 2.75;
      return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
    } else if (scaledTime < 2.5 / 2.75) {
      const scaledTime2 = scaledTime - 2.25 / 2.75;
      return 7.5625 * scaledTime2 * scaledTime2 + 0.9375;
    } else {
      const scaledTime2 = scaledTime - 2.625 / 2.75;
      return 7.5625 * scaledTime2 * scaledTime2 + 0.984375;
    }
  };

  // Bounce increasing in velocity until completion
  Toko.prototype.easeInBounce = t => {
    return 1 - Toko.prototype.easeOutBounce(1 - t);
  };

  // Bounce in and bounce out
  Toko.prototype.easeInOutBounce = t => {
    if (t < 0.5) {
      return Toko.prototype.easeInBounce(t * 2) * 0.5;
    }

    return Toko.prototype.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
  };

  // Extra smooth - Ken Perlin smoothstep function
  Toko.prototype.easeInOutSmoother = t => {
    var ts = t * t,
      tc = ts * t;
    return 6 * tc * ts - 15 * ts * ts + 10 * tc;
  };

  //
  //  add easing selector
  //
  Toko.prototype.addEasingSelector = function (paneRef, pObject, incomingOptions) {
    //
    //  set default options
    //
    let o = {
      // reserved for future defaults
    };
    //
    // merge with default options
    //
    o = Object.assign({}, o, incomingOptions);

    o.easeTypeControl = paneRef
      .addBinding(pObject, o.typeKey, {
        label: 'easing type',
        options: {
          Linear: this.EASE_LINEAR,
          Smooth: this.EASE_SMOOTH,
          Quad: this.EASE_QUAD,
          Cubic: this.EASE_CUBIC,
          Quart: this.EASE_QUART,
          Quint: this.EASE_QUINT,
          Expo: this.EASE_EXPO,
          Circ: this.EASE_CIRC,
          Elastic: this.EASE_ELASTIC,
          Bounce: this.EASE_BOUNCE,
          Back: this.EASE_BACK,
        },
      })
      .on('change', ev => {
        if (ev.value === this.EASE_LINEAR || ev.value === this.EASE_SMOOTH) {
          o.easeDirectionControl.hidden = true;
        } else {
          o.easeDirectionControl.hidden = false;
        }
      });

    o.easeDirectionControl = paneRef.addBinding(pObject, o.directionKey, {
      label: 'direction',
      options: {
        In: this.EASE_IN,
        Out: this.EASE_OUT,
        InOut: this.EASE_IN_OUT,
      },
    });
  };

  //
  //  get the easing equation based on the type and direction
  //
  Toko.prototype.getEasingFunction = function (easeType = this.EASE_QUAD, easeDirection = this.EASE_IN_OUT) {
    let easeFunction = 'ease';
    //
    //  add the direction
    //
    if (easeType !== this.EASE_LINEAR && easeType !== this.EASE_SMOOTH) {
      easeFunction += easeDirection;
    }
    //
    //  add the type
    //
    easeFunction += easeType;

    let f = toko[easeFunction];

    if (typeof f === 'function') {
      return f;
    } else {
      console.log(`ERROR: ${easeFunction} is not a function.`);
      return null;
    }
  };

  //
  //  grid generators
  //
  //  create grids by recursive splitting cells or packing cells
  //
  //
  // Toko.Grid = {
  //    x          - x position on the canvas
  //    y          - y position on the canvas
  //    width      - width of the complete grid
  //    height     - width of the complete grid
  //  }
  //
  // External functions
  //  setBaseGrid       - reset all cells and start with a rectangular grid of celles
  //  packGrid          - pack the grid with cells of predefined sizes
  //  splitRecursive    - split all the cells recursively for a number of loops
  //
  // Values
  //  minCounter        - lowest number of splits for a recursive grid
  //  maxCounter        - highest number of splits for a recursive grid
  //  cells             - get an array of all the current cells
  //  points            - get an array of all the corner points for the current grid of cells
  //

  Toko.Grid = class {
    SPLIT_HORIZONTAL = 'split_horizonal';
    SPLIT_VERTICAL = 'split_vertical';
    SPLIT_LONGEST = 'split_longest';
    SPLIT_MIX = 'split_mix';
    SPLIT_SQUARE = 'split_square';

    constructor (x, y, width, height, rng = toko._rng) {
      this._position = createVector(x, y);
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._cells = [
        new Toko.GridCell(
          this._x,
          this._y,
          this._width,
          this._height,
          0,
          0,
          this._width,
          this._height,
        ),
      ];
      this._points = [];
      this._pointsAreUpdated = false;
      this._openSpaces = [];
      this._rng = rng;
    }

    //
    //  set the base rows and columns for the grid
    //
    setBaseGrid (columns = 1, rows = 1) {
      let cellWidth = this._width / columns;
      let cellHeight = this._height / rows;

      this._cells = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          let newCell = new Toko.GridCell(
            this._x + c * cellWidth,
            this._y + r * cellHeight,
            cellWidth,
            cellHeight,
            c,
            r,
            cellWidth,
            cellHeight,
          );
          this._cells.push(newCell);
        }
      }
    }

    //
    //  collect the coordinates of all unique points on the grid
    //
    gatherPoints () {
      this._pointsAreUpdated = true;
      this._points = [];
      let tempPoints = [];
      let uniquePoints = [];
      let c;
      //
      //  gather all points as strings
      //
      for (let n = 0; n < this._cells.length; n++) {
        c = this._cells[n];
        // top left corner
        tempPoints.push(`${c.x}-${c.y}`);
        // top right corner
        tempPoints.push(`${c.x + c.width}-${c.y}`);
        // bottom left corner
        tempPoints.push(`${c.x}-${c.y + c.height}`);
        // bottom right corner
        tempPoints.push(`${c.x + c.width}-${c.y + c.height}`);
      }
      //
      //  deduplicate using a set
      //
      uniquePoints = [...new Set(tempPoints)];
      //
      // parse back to vectors
      //
      uniquePoints.forEach(element => {
        let a = element.split('-');
        this._points.push(createVector(parseFloat(a[0]), parseFloat(a[1])));
      });

      return this._points;
    }

    //
    //  construct a grid by packing shapes
    //  partly inspired by
    //  https://www.gorillasun.de/blog/an-algorithm-for-irregular-grids/
    //
    //  columns         - number of columns to be packed
    //  rows            - number of rows to be packed
    //  cellShapes      - array of cells defining width and height of cell shapes
    //  fillEmptySpaces - whether left over spaces should be filled with 1x1 cells
    //  snapToPixel     - if set to true all sizes and positions are rounded to a pixel
    //                    This can result in the cells not filling the complete grid space
    //
    packGrid (
      columns,
      rows,
      cellShapes,
      fillEmptySpaces = true,
      snapToPixel = true,
    ) {
      this._pointsAreValid = false;
      this._cells = [];
      let cw, rh;
      if (snapToPixel) {
        cw = Math.round(this._width / columns);
        rh = Math.round(this._height / rows);
      } else {
        cw = this._width / columns;
        rh = this._height / rows;
      }

      this.resetOpenSpaces(columns, rows);

      let spaceCheckInterval = 10;
      let keepGoing = true;
      let shape, w, h, c, r, newCell, keepTryingThisShape;
      let k = 0;
      let fails = 0;
      let maxFails = 1000;
      let triesPerShape = 2500;
      let tryCounter = 0;

      while (keepGoing) {
        // pick random shape
        shape = this._rng.random(cellShapes);
        w = shape[0];
        h = shape[1];

        keepTryingThisShape = true;
        while (keepTryingThisShape) {
          // pick random location
          c = this._rng.intRange(0, columns - w + 1);
          r = this._rng.intRange(0, rows - h + 1);

          // check if space is available
          if (this.spaceAvailable(c, r, w, h)) {
            // if it is available, add a cell with the picked size
            newCell = new Toko.GridCell(
              this._x + c * cw,
              this._y + r * rh,
              w * cw,
              h * rh,
              c,
              r,
              w,
              h,
            );
            newCell.counter = tryCounter;
            this._cells.push(newCell);
            // claim the space
            this.fillSpace(c, r, w, h);
            // reset
            keepTryingThisShape = false;
            tryCounter = 0;
          } else {
            tryCounter++;
            if (tryCounter > triesPerShape) {
              fails++;
              keepTryingThisShape = false;
            }
          }
        }
        //
        // every once in a while check if there is any space left
        //
        k++;
        if (k % spaceCheckInterval == 0) {
          keepGoing = this.anySpaceLeft();
        }
        //
        //  stop after a max number of fails
        //
        if (fails > maxFails) {
          keepGoing = false;
        }
      }
      //
      //  fill left over spaces
      //
      if (fillEmptySpaces) {
        this.fillEmptySpaces(columns, rows, cellShapes, snapToPixel);
      }
    }

    //
    //  fill the remaining empty spaces systematically
    //
    fillEmptySpaces (columns, rows, cellShapes, snapToPixel) {
      cellShapes.push([1, 1]); // add a 1x1 so we can always fill
      let cw, rh;
      if (snapToPixel) {
        cw = Math.round(this._width / columns);
        rh = Math.round(this._height / rows);
      } else {
        cw = this._width / columns;
        rh = this._height / rows;
      }
      let s, tryingShapes, w, h, newCell;
      //
      //  go through the entire grid and try every shape in every open spot
      //
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          tryingShapes = true;
          s = 0;
          while (tryingShapes) {
            w = cellShapes[s][0];
            h = cellShapes[s][1];
            if (this.spaceAvailable(i, j, w, h)) {
              newCell = new Toko.GridCell(
                this._x + i * cw,
                this._y + j * rh,
                w * cw,
                h * rh,
                i,
                j,
                cw,
                rh,
              );
              newCell.counter = s;
              this._cells.push(newCell);
              this.fillSpace(i, j, w, h);
              tryingShapes = false;
            }
            s++;
            if (s >= cellShapes.length) {
              tryingShapes = false;
            }
          }
        }
      }
    }

    //
    //  check if space is available for this shape
    //
    spaceAvailable (column, row, width, height) {
      if (column + width > this._openSpaces.length) {
        return false;
      }
      if (row + height > this._openSpaces[0].length) {
        return false;
      }
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!this._openSpaces[column + i][row + j]) {
            return false;
          }
        }
      }
      return true;
    }

    //
    //  mark a specific area in the grid as no longer open
    //
    fillSpace (column, row, width, height) {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          this._openSpaces[column + i][row + j] = false;
        }
      }
    }

    //
    //  reset all the space back to open
    //
    resetOpenSpaces (columns, rows) {
      this._openSpaces = [];
      for (let i = 0; i < columns; i++) {
        this._openSpaces[i] = new Array();
        for (let j = 0; j < rows; j++) {
          this._openSpaces[i][j] = true;
        }
      }
    }

    //
    //  check if there is any space left at all
    //
    anySpaceLeft () {
      let columns = this._openSpaces.length;
      let rows = this._openSpaces[0].length;
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (this._openSpaces[i][j]) {
            return true;
          }
        }
      }
      return false;
    }

    //
    //  split the cells recursively
    //
    //  nrLoops         - number times all cells are evaluated
    //  chance          - the chance a cell is split when evaluated
    //  minSize         - only splits resulting in new cells larger than this size are considered
    //  splitStyle      - defines how the cells should split
    //                    SPLIT_HORIZONTAL  = split a cell horizontally into 2 new cells
    //                    SPLIT_VERTICAL    = split a cell vertically into 2 new cells
    //                    SPLIT_LONGEST     = split the longest dimension
    //                    SPLIT_MIX         = split along both axis randomly
    //                    SPLIT_SQUARE      = split cells into 4 new cells
    //
    splitRecursive (
      nrLoops = 1,
      chance = 0.5,
      minSize = 10,
      splitStyle = this.SPLIT_MIX,
    ) {
      if (splitStyle == this.SPLIT_SQUARE) {
        // reduce the chance because the square split creates 4 cells instead of 2
        chance *= 0.5;
      }

      for (let i = 0; i < nrLoops; i++) {
        let newCells = [];
        for (let n = 0; n < this._cells.length; n++) {
          if (this._rng.random() < chance) {
            let c = this.splitCell(this._cells[n], minSize, splitStyle);
            newCells = newCells.concat(c);
          } else {
            newCells.push(this._cells[n]);
          }
        }
        this._cells = [...newCells];
      }
    }

    //
    //  direct to right split style
    //
    splitCell (cell, minSize = 10, splitStyle = this.SPLIT_MIX) {
      let newCells = [];
      switch (splitStyle) {
        case this.SPLIT_SQUARE:
          newCells = this.splitCellSquare(cell, minSize);
          break;
        case this.SPLIT_HORIZONTAL:
          newCells = this.splitCellHorizontal(cell, minSize);
          break;
        case this.SPLIT_VERTICAL:
          newCells = this.splitCellVertical(cell, minSize);
          break;
        case this.SPLIT_LONGEST:
          newCells = this.splitCellLongest(cell, minSize);
          break;
        case this.SPLIT_MIX:
          newCells = this.splitCellMix(cell, minSize);
          break;
        default:
          newCells = this.splitCellMix(cell, minSize);
          break;
      }
      return newCells;
    }

    //
    //  split cell along the longest side
    //
    splitCellLongest (cell, minSize = 10) {
      if (cell.width > cell.height) {
        return this.splitCellHorizontal(cell, minSize);
      } else {
        return this.splitCellVertical(cell, minSize);
      }
    }

    //
    //  split cells randomly along horizontal or vertical axis
    //
    splitCellMix (cell, minSize = 10) {
      if (this._rng.random() < 0.5) {
        return this.splitCellHorizontal(cell, minSize);
      } else {
        return this.splitCellVertical(cell, minSize);
      }
    }

    //
    //  split a cell evenly into 4 cells
    //
    splitCellSquare (cell, minSize = 10) {
      let w2 = cell.width / 2;
      let h2 = cell.height / 2;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (w2 > minSize && h2 > minSize) {
        newCells.push(new Toko.GridCell(x, y, w2, h2));
        newCells.push(new Toko.GridCell(x + w2, y, w2, h2));
        newCells.push(new Toko.GridCell(x + w2, y + h2, w2, h2));
        newCells.push(new Toko.GridCell(x, y + h2, w2, h2));
        newCells[0].counter =
          newCells[1].counter =
          newCells[2].counter =
          newCells[3].counter =
            c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    //
    //  split a cell horizontally
    //
    splitCellHorizontal (cell, minSize = 10) {
      let w2 = cell.width / 2;
      let h = cell.height;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (w2 > minSize) {
        newCells.push(new Toko.GridCell(x, y, w2, h));
        newCells.push(new Toko.GridCell(x + w2, y, w2, h));
        newCells[0].counter = newCells[1].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    //
    //  split a cell vertically
    //
    splitCellVertical (cell, minSize = 10) {
      let w = cell.width;
      let h2 = cell.height / 2;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (h2 > minSize) {
        newCells.push(new Toko.GridCell(x, y, w, h2));
        newCells.push(new Toko.GridCell(x, y + h2, w, h2));
        newCells[0].counter = newCells[1].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    //----------------------------------------
    //
    //  Get and set functions
    //
    //----------------------------------------

    get maxCounter () {
      //
      //  find the max value of counter in all the cells
      //  see https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
      //
      let maxC = this._cells.reduce((a, b) =>
        a.counter > b.counter ? a : b,
      ).counter;
      return maxC;
    }

    get minCounter () {
      let minC = this._cells.reduce((a, b) =>
        a.counter < b.counter ? a : b,
      ).counter;
      return minC;
    }

    get width () {
      return this._width;
    }

    get height () {
      return this._height;
    }

    get x () {
      return this._x;
    }

    get y () {
      return this._y;
    }

    get cells () {
      return this._cells;
    }

    get points () {
      if (!this._pointsAreUpdated) {
        return this.gatherPoints();
      } else {
        return this._points;
      }
    }
  };

  //
  // Toko.GridCell = {
  //    x          - x position on the canvas
  //    y          - y position on the canvas
  //    width      - width of the cell
  //    height     - height of the cell
  //    column     - x position in columns
  //    row        - y position in rows
  //    gridWidth  - nr of columns wide
  //    gridHeight - nr of rows height
  //    gridWidth and gridHeight are only applicable for a packed grid
  //  }
  //
  // Set separately
  //    value       - value per cell that can be set and used for visual effects
  //    counter     - used to track how often a cell is split
  //

  Toko.GridCell = class {
    constructor (x, y, width, height, column = 0, row = 0, gridWidth = 0, gridHeight = 0) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._row = row;
      this._column = column;
      this._gridWidth = gridWidth;
      this._gridHeight = gridHeight;
      this._value = 0;
      this._counter = 0;
    }

    get x () {
      return this._x;
    }
    set x (in_x) {
      this._x = in_x;
    }

    get y () {
      return this._y;
    }
    set y (in_y) {
      this._y = in_y;
    }

    get width () {
      return this._width;
    }
    set width (in_width) {
      this._width = in_width;
    }

    get height () {
      return this._height;
    }
    set height (in_height) {
      this._height = in_height;
    }

    get row () {
      return this._row;
    }
    set row (in_row) {
      this._row = in_row;
    }

    get column () {
      return this._column;
    }
    set column (in_column) {
      this._column = in_column;
    }

    get gridWidth () {
      return this._gridWidth;
    }
    set gridWidth (in_gridWidth) {
      this._gridWidth = in_gridWidth;
    }

    get gridHeight () {
      return this._gridHeight;
    }
    set gridHeight (in_gridHeight) {
      this._gridHeight = in_gridHeight;
    }

    get value () {
      return this._value;
    }
    set value (in_value) {
      this._value = in_value;
    }

    get counter () {
      return this._counter;
    }
    set counter (in_counter) {
      this._counter = in_counter;
    }
  };

  //
  //  TRANSFORMATION SHORTCUTS
  //

  //
  //  rotate current transformation matrix around a specific point
  //
  Toko.prototype.rotateAround = function (x, y, inAngle) {
    translate(x, y);
    rotate(inAngle);
    translate(-x, -y);
  };

  //
  //  scale current transformation matrix around a specific point
  //
  Toko.prototype.scaleAround = function (x, y, inScale) {
    translate(x, y);
    scale(inScale);
    translate(-x, -y);
  };

  //
  //  STANDARD GRADIENTS
  //

  //
  //  linearGradiant
  //
  //  xStart  x coordinate of start position
  //  yStart  y coordinate of start position
  //  xEnd    x coordinate of end position
  //  yEnd    y coordinate of end position
  //  stops   array of all the color stops each an object with:
  //            stop    value between 0 (start) and 1 (end)
  //            color   standard css color value
  //
  Toko.prototype.linearGradient = function (xStart, yStart, xEnd, yEnd, stops) {
    let gradient = drawingContext.createLinearGradient(xStart, yStart, xEnd, yEnd);
    stops.forEach(stop => {
      gradient.addColorStop(stop.offset, stop.color);
    });
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  };

  //
  //  radialGradiant
  //
  //  xStart  x coordinate of start position
  //  yStart  y coordinate of start position
  //  rStart  start radius
  //  xEnd    x coordinate of end position
  //  yEnd    y coordinate of end position
  //  rEnd    end radius
  //  stops   array of all the color stops each an object with:
  //            stop    value between 0 (start) and 1 (end)
  //            color   standard css color value
  //
  Toko.prototype.radialGradient = function (xStart, yStart, rStart, xEnd, yEnd, rEnd, stops) {
    let gradient = drawingContext.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd, rEnd);
    stops.forEach(stop => {
      gradient.addColorStop(stop.offset, stop.color);
    });
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  };

  //
  //  conicGradiant
  //
  //  angle   start angle in radians, clockwise from horizontal right
  //  x       x coordinate of the gradient center
  //  y       y coordinate of the gradient center
  //  stops   array of all the color stops each an object with:
  //            stop    value between 0 (start) and 1 (end)
  //            color   standard css color value
  //
  Toko.prototype.conicGradient = function (angle, x, y, stops) {
    let gradient = drawingContext.createConicGradient(angle, x, y);
    stops.forEach(stop => {
      gradient.addColorStop(stop.offset, stop.color);
    });
    drawingContext.fillStyle = gradient;
    drawingContext.strokeStyle = gradient;
  };

  //
  //  makeGradientStops
  //
  //  colors    Toko colors object
  //  nrStops   number of stops in the gradient - default is 50
  //
  Toko.prototype.makeGradientStops = function (colors, nrStops = 50) {
    let stops = [];
    for (let i = 0; i < nrStops; i++) {
      stops.push({
        offset: map(i, 0, nrStops, 0, 1),
        color: colors.scale(map(i, 0, nrStops, colors.options.domain[0], colors.options.domain[1])),
      });
    }
    return stops;
  };

  //
  //  SHADOW & GLOW EFFECTS
  //

  //
  //  shadow
  //
  //  xOffset   the distance that shadows will be offset horizontally - positive is right
  //  yOffset   the distance that shadows will be offset vertically - positive is down
  //  blur      level of blur of the shadow, 0 is no shadow
  //  shadow    color of the shadow as standard css value, including opacity
  //
  Toko.prototype.shadow = function (xOffset, yOffset, blur, color) {
    drawingContext.shadowOffsetX = xOffset;
    drawingContext.shadowOffsetY = yOffset;
    drawingContext.shadowBlur = blur;
    drawingContext.shadowColor = color;
  };

  //
  //  BASIC GRAIN FOR IMAGES
  //
  //  Based on https://www.fxhash.xyz/article/all-about-that-grain

  //
  //  simple grain function
  //  shifts all pixels randomly between -strength & +strength
  //
  //  strength is a value between 0 and 255
  //
  Toko.prototype.addSimpleGrain = function (strength) {
    loadPixels();
    const d = pixelDensity();
    const pixelsCount = 4 * (width * d) * (height * d);
    for (let i = 0; i < pixelsCount; i += 4) {
      pixels[i] = pixels[i] + random(-strength, strength);
      pixels[i + 1] = pixels[i + 1] + random(-strength, strength);
      pixels[i + 2] = pixels[i + 2] + random(-strength, strength);
    }
    updatePixels();
  };

  //
  //  adds grain differently across channels
  //
  //  strength and shift are objects with a value for red, green and blue each
  //
  //  strength = { red: 10, green: 20, blue: 10}
  //  shift = { red: -10, green: 0, blue: 0 }
  //
  //  each value is between 0 and 255
  //
  Toko.prototype.addChannelGrain = function (strength, shift) {
    loadPixels();
    const d = pixelDensity();
    const pixelsCount = 4 * (width * d) * (height * d);
    for (let i = 0; i < pixelsCount; i += 4) {
      pixels[i] = pixels[i] + random(-strength.red, strength.red) + shift.red;
      pixels[i + 1] =
        pixels[i + 1] + random(-strength.green, strength.green) + shift.green;
      pixels[i + 2] =
        pixels[i + 2] + random(-strength.blue, strength.blue) + shift.blue;
    }
    updatePixels();
  };

  //
  //  draw a regular polygon shape
  //
  //  x,y     x,y position of the shape center
  //  size    shape size
  //  sides   number of sides of the shape
  //  spin    rotation around center
  //
  Toko.prototype.plotPolygon = function (x, y, size = 100, sides = 6, spin = 0, shapeMode = CLOSE) {
    let vertices = this.polygonVertices(x, y, size, sides, spin);
    this.plotVertices(vertices, shapeMode);
  };

  //
  //  get an array of polygon vertices (as p5 vectors)
  //
  //  x,y     x,y position of the shape center
  //  size    shape size
  //  sides   number of sides of the shape
  //  spin    rotation around center
  //

  Toko.prototype.polygonVertices = function (x, y, size = 100, sides = 6, spin = 0) {
    let vertices = [];
    let sideAngle = TWO_PI / sides;
    //
    //  some adjustments to the base spin to get a more pleasing default rotation
    //  anything above 12 sides might still need some tweaks
    //
    if (sides == 3) {
      spin += PI / 6;
    } else if (sides == 5) {
      spin += 1.5 * PI;
    } else if (sides == 4) {
      spin += PI / 4;
    } else if (sides == 7) {
      spin += PI / 14;
    } else if (sides == 8) {
      spin += PI / 8;
    } else if (sides == 9) {
      spin -= PI / 18;
    } else if (sides == 11) {
      spin += PI / 22;
    } else if (sides == 12) {
      spin += PI / 12;
    }

    for (let i = 1; i < sides + 1; i++) {
      let xs = x + cos(sideAngle * i + spin) * size;
      let ys = y + sin(sideAngle * i + spin) * size;
      vertices.push(createVector(xs, ys));
    }
    return vertices;
  };

  //
  //  plot an array of vertices
  //
  //  vertices    an array of p5 vectors, each a single vertex
  //  shapeMode   p5 shape mode that defines how the shape is closed
  //
  Toko.prototype.plotVertices = function (vertices, shapeMode = CLOSE) {
    beginShape();
    vertices.forEach(v => {
      vertex(v.x, v.y);
    });
    endShape(shapeMode);
  };

  //
  //  getPixelColor
  //
  //  image   p5.js image. Use loadPixels first
  //  x       pixel x position
  //  y       pixel y position
  //  width   width of the referenced image
  //
  Toko.prototype.getPixelColor = function (image, x, y, width) {
    // calculate the index in the pixel array
    let d = image.pixelDensity();
    let index = 4 * (y * d * width * d + x * d);

    // retrieve the color values
    let r = image.pixels[index];
    let g = image.pixels[index + 1];
    let b = image.pixels[index + 2];
    let a = image.pixels[index + 3];

    return [r, g, b, a];
  };

  //
  //  pixelThreshold
  //  returns true if average pixel value is between min and max values
  //
  //  image     p5.js image. Use loadPixels first
  //  x         pixel x position
  //  y         pixel y position
  //  width     width of the referenced image
  //  min       lower boundary value, included in selection
  //  max       upper boundary value, included in selection
  //
  Toko.prototype.pixelThreshold = function (image, x, y, width, min = 0, max = 255) {
    // calculate the index in the pixel array
    let d = image.pixelDensity();
    let index = 4 * (y * d * width * d + x * d);

    // retrieve the color values
    let ave = (image.pixels[index] + image.pixels[index + 1] + image.pixels[index + 2]) / 3;
    return ave >= min && ave <= max;
  };

  Toko.prototype.generateFilename = function (extension = 'svg', verb = 'sketched') {
    var adj1 = this.randomAdjective();
    var adj2 = this.randomAdjective();
    var noun = this.randomNoun();

    var filename = this._getTimeStamp() + '_';

    if (extension != '' && extension != 'none') {
      filename = filename + verb + '_the' + '_' + adj1 + '_' + adj2 + '_' + noun + '.' + extension;
    } else {
      filename = filename + verb + '_the' + '_' + adj1 + '_' + adj2 + '_' + noun;
    }
    return filename;
  };

  Toko.prototype._getTimeStamp = function () {
    //
    // create a yyyymmdd string
    //
    var d = new Date();
    var day = ('0' + d.getDate()).slice(-2);
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var year = d.getFullYear();

    return year + month + day;
  };

  Toko.prototype.initCapture = function () {
    this.capturer = P5Capture.getInstance();
    if (this.captureOptions.duration === null || this.captureOptions.duration === undefined) {
      this.captureOptions.captureFixedNrFrames = false;
    } else {
      this.captureOptions.captureFixedNrFrames = true;
    }
  };

  Toko.prototype.createCapturePanel = function (tabID) {
    var t = this.basePaneTab.pages[tabID];

    t.addBinding(this.captureOptions, 'format', {
      options: this.CAPTURE_FORMATS,
    });

    t.addBinding(this.captureOptions, 'framerate', {
      options: this.CAPTURE_FRAMERATES,
    }).on('change', e => {
      frameRate(e.value);
      this.updateDurationEstimate();
    });

    t.addBlade({ view: 'separator' });

    t.addBinding(this.captureOptions, 'captureFixedNrFrames', {
      label: 'fixed duration',
    }).on('change', value => {
      this.updateCaptureFrameSelector(value);
    });

    this.captureFrameControl = t
      .addBinding(this.captureOptions, 'nrFrames', {
        min: 0,
        max: 1000,
        step: 5,
      })
      .on('change', e => {
        if (this.captureOptions.captureFixedNrFrames) {
          this.captureOptions.duration = e.value;
        }
      });

    if (this.captureOptions.duration === null || this.captureOptions.duration === undefined) {
      this.captureFrameControl.hidden = true;
    }

    t.addBlade({ view: 'separator' });

    this.startCaptureButton = t
      .addButton({
        title: '🔴 Record',
      })
      .on('click', value => {
        this.clickStartCapture();
      });

    this.stopCaptureButton = t
      .addButton({
        title: '⬛️ Stop recording',
      })
      .on('click', value => {
        this.clickStopCapture();
      });
    this.stopCaptureButton.hidden = true;
  };

  Toko.prototype.updateCaptureFrameSelector = function (e) {
    if (e.value) {
      this.captureFrameControl.hidden = false;
      this.captureOptions.duration = this.captureOptions.nrFrames;
    } else {
      this.captureFrameControl.hidden = true;
      this.captureOptions.duration = null;
    }
  };

  Toko.prototype.clickStartCapture = function () {
    this.stopCaptureButton.hidden = false;
    this.startCaptureButton.hidden = true;
    this.startCapture();
  };

  Toko.prototype.clickStopCapture = function () {
    this.stopCaptureButton.hidden = true;
    this.startCaptureButton.hidden = false;
    this.stopCapture();
  };

  Toko.prototype.startCapture = function () {
    if (!this._captureStarted && this.options.captureFrames) {
      this.initCapture();
      window.captureStarted?.();
      this._captureStarted = true;
      this.capturer.start(this.captureOptions);
    }
  };

  Toko.prototype.stopCapture = function () {
    if (this.options.captureFrames && this._captureStarted) {
      this.capturer.stop();
      window.captureStopped?.();
      this._captureStarted = false;
    }
  };

  Toko.prototype.resetCapture = function () {
    this.stopCaptureButton.hidden = true;
    this.startCaptureButton.hidden = false;
    this._captureStarted = false;
  };

  Toko.prototype.filenameCapture = function (date) {
    return this.generateFilename('none', 'captured');
  };

  Toko.prototype.saveSketch = function () {
    //
    // detect if the sketch is in canvas or svg
    //
    var sketchElement = document.getElementById(this.options.sketchElementId).firstChild;
    var isCanvas = sketchElement instanceof HTMLCanvasElement;
    if (sketchElement.firstChild != null) {
      var isSVG = sketchElement.firstChild.nodeName == 'svg';
    }

    if (isCanvas) {
      //
      //  save canvas as png
      //
      var filename = this.generateFilename('png');
      saveCanvas(filename, 'png');
      return filename;
    } else if (isSVG) {
      //
      // add attributes to ensure proper preview of the SVG file in the Finder
      //
      var svgTemp = document.getElementById('sketch-canvas').firstChild.firstChild.firstChild;
      svgTemp.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svgTemp.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      var filename = this.generateFilename('svg');
      var svgString = document.getElementById(this.options.sketchElementId).firstChild.innerHTML;

      var blob = new Blob([svgString], {type: 'image/svg+xml'});
      var url = window.URL.createObjectURL(blob);

      //
      // create a hidden url with the image and click it
      //
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      return filename;
    } else {
      console.log('Toko - saveSketch: unkown type');
      return;
    }
  };

  //
  //  save both the sketch image and the settings
  //
  Toko.prototype.saveSketchAndSettings = function () {
    let filename = this.saveSketch();
    //
    //  strip the extension of the filename so we can reuse it.
    //
    filename = filename.split('.').slice(0, -1).join('.');
    this.saveSettings(filename);
  };

  //
  //  save all the current settings in a simple JSON file
  //
  //  WARNING: basically no error checking is done here
  //
  Toko.prototype.saveSettings = function (filename = 'default') {
    if (typeof filename === 'undefined' || filename == 'default') {
      filename = this.generateFilename('json');
    }

    if (filename.slice(-5) != '.json') {
      filename += '.json';
    }

    let state = this.basePane.exportState();
    let settings = this._stateToPreset(state);
    createStringDict(settings).saveJSON(filename);
  };

  //
  //  receive a json file with settings dropped on the canvas
  //
  //  WARNING: basically no error checking is done here
  //
  Toko.prototype.dropFile = function (file) {
    if (this.options.acceptDroppedSettings && file.subtype == 'json') {
      this.receiveSettings(file);
    } else if (this.options.acceptDroppedFiles) {
      this.receiveFile(file);
    }
  };

  Toko.prototype.receiveSettings = function (file) {
    let receivedCollection, receivedPalette;

    let newState = this._presetToState(file.data);
    this.basePane.importState(newState);

    receivedCollection = file.data.collection;
    receivedPalette = file.data.palette;

    this.updatePaletteSelector(receivedCollection, receivedPalette);

    window.receivedFile?.(file);
  };

  Toko.prototype.receiveFile = function (file) {
    window.receivedFile?.(file);
  };

  //

  return Toko;

})();
//# sourceMappingURL=Toko.js.map
