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
  const VERSION = 'Toko v0.5.0';

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

  const SIZE_720P = {
    name: '720p',
    width: 1280,
    height: 720,
    pixelDensity: 1,
  };

  const SIZE_IPHONE_11_WALLPAPER = {
    name: 'iphone_11',
    width: 1436,
    height: 3113,
    pixelDensity: 1,
  };

  const SIZE_MACBOOK_PRO_WALLPAPER = {
    name: 'macbook_pro',
    width: 2880,
    height: 1800,
    pixelDensity: 1,
  };

  //
  //  List used for the dropdown in the advanced tab
  //
  var SIZES_LIST = {
    default: 'default',
    square_HD: 'square_XL',
    iphone_11: 'iphone_11',
    SD_720p: '720p',
    HD_1080p: '1080p',
    macbook_pro: 'macbook_pro',
    full_window: 'full_window',
  };

  var SIZES = [
    SIZE_DEFAULT,
    SIZE_FULL,
    SIZE_SQUARE_XL,
    SIZE_720P,
    SIZE_1080P,
    SIZE_IPHONE_11_WALLPAPER,
    SIZE_MACBOOK_PRO_WALLPAPER,
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
    sketchElementId: 'sketch-canvas',
    useParameterPanel: true,
    hideParameterPanel: false,
    showAdvancedOptions: false,
    additionalCanvasSizes: [],
    logFPS: false,
    captureFrames: false,
    captureFrameCount: 500,
    captureFrameRate: 15,
    captureFormat: 'png',
    canvasSize: SIZE_DEFAULT,
  };

  //
  //  Options for capture
  //
  const CAPTURE_FORMATS = {
    PNG: 'png',
    JPG: 'jpg',
    GIF: 'gif'
  };

  //
  //  Parameters to calculate frames per second
  //
  const FPS_FILTER_STRENGTH = 40;
  const FRAME_TIME = 16;

  var constants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CAPTURE_FORMATS: CAPTURE_FORMATS,
    DEFAULT_OPTIONS: DEFAULT_OPTIONS,
    FPS_FILTER_STRENGTH: FPS_FILTER_STRENGTH,
    FRAME_TIME: FRAME_TIME,
    SIZES: SIZES,
    SIZES_LIST: SIZES_LIST,
    SIZE_1080P: SIZE_1080P,
    SIZE_720P: SIZE_720P,
    SIZE_DEFAULT: SIZE_DEFAULT,
    SIZE_FULL: SIZE_FULL,
    SIZE_IPHONE_11_WALLPAPER: SIZE_IPHONE_11_WALLPAPER,
    SIZE_MACBOOK_PRO_WALLPAPER: SIZE_MACBOOK_PRO_WALLPAPER,
    SIZE_SQUARE_XL: SIZE_SQUARE_XL,
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
  //  https://github.com/Atrox/haikunatorjs
  //
  const ADJECTIVES = [
    'adorable',
    'aged',
    'alien',
    'ancient',
    'atomic',
    'autumn',
    'billowing',
    'bittersweet',
    'black',
    'blue',
    'bold',
    'bright',
    'broad',
    'bronze',
    'calm',
    'carbon',
    'caribbean',
    'chestnut',
    'cool',
    'cosmic',
    'crimson',
    'curly',
    'damp',
    'dark',
    'dawn',
    'deep',
    'delicate',
    'descending',
    'divine',
    'dry',
    'electric',
    'elegant',
    'empty',
    'epic',
    'fabulous',
    'falling',
    'fancy',
    'fatal',
    'flat',
    'floral',
    'fragrant',
    'fresh',
    'frosty',
    'gentle',
    'glitter',
    'glorious',
    'green',
    'grunge',
    'hidden',
    'holy',
    'icy',
    'imaginary',
    'impressive',
    'indigo',
    'jolly',
    'late',
    'lazy',
    'lingering',
    'little',
    'lively',
    'long',
    'lucky',
    'magic',
    'maroon',
    'marvelous',
    'maximum',
    'middle',
    'misty',
    'mixed',
    'morning',
    'mute',
    'mystic',
    'nameless',
    'neon',
    'new',
    'noisy',
    'odd',
    'old',
    'orange',
    'outrageous',
    'pacific',
    'patient',
    'permanent',
    'plain',
    'polished',
    'proud',
    'purple',
    'quiet',
    'radical',
    'rapid',
    'raspy',
    'red',
    'restless',
    'rough',
    'round',
    'royal',
    'scarlet',
    'shining',
    'shiny',
    'shocking',
    'shy',
    'silent',
    'small',
    'smokey',
    'snowy',
    'soft',
    'solitary',
    'sparkling',
    'spiked',
    'spring',
    'square',
    'steel',
    'steep',
    'still',
    'summer',
    'super',
    'sweet',
    'throbbing',
    'tight',
    'tiny',
    'tropical',
    'twilight',
    'wandering',
    'weathered',
    'white',
    'wild',
    'winter',
    'wispy',
    'withered',
    'yellow',
    'young',
  ];

  const NOUNS = [
    'alchemy',
    'art',
    'avocado',
    'bar',
    'base',
    'beauty',
    'bird',
    'block',
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
    'cloud',
    'credit',
    'crocodile',
    'dandelion',
    'darkness',
    'dawn',
    'desert',
    'dew',
    'dinosaur',
    'disk',
    'dragon',
    'dream',
    'duck',
    'dust',
    'experience',
    'feather',
    'field',
    'fire',
    'firefly',
    'flamingo',
    'flower',
    'fog',
    'forest',
    'frog',
    'frost',
    'future',
    'glade',
    'glitter',
    'grass',
    'hat',
    'haze',
    'heart',
    'hill',
    'jungle',
    'king',
    'lab',
    'lake',
    'leaf',
    'limit',
    'math',
    'meadow',
    'mode',
    'moon',
    'morning',
    'mountain',
    'mouse',
    'mud',
    'night',
    'orchid',
    'paper',
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
    'queen',
    'rain',
    'recipe',
    'resonance',
    'rice',
    'river',
    'rocket',
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
    'spoon',
    'star',
    'statue',
    'sun',
    'sunset',
    'surf',
    'tango',
    'term',
    'thunder',
    'tiger',
    'tooth',
    'toy',
    'tree',
    'trumpet',
    'truth',
    'union',
    'unit',
    'violet',
    'voice',
    'water',
    'waterfall',
    'wave',
    'weasel',
    'wildflower',
    'wind',
    'winter',
    'wood',
    'woodpecker',
  ];

  var words = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ADJECTIVES: ADJECTIVES,
    NOUNS: NOUNS
  });

  class Toko {
    constructor() {

      for (const k in constants) {
        this[k] = constants[k];
      }

      for (const k in words) {
        this[k] = words[k];
      }

      //
      //  seed the random function
      //
      Toko.reseed(Date.now());

      console.log(this.VERSION);

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
  Toko.prototype.createColorScale = function (colorSet, colorOptions) {
    let o = this._createColorScale(colorSet, colorOptions);
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
    return p
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
      stroke:'#21202E',
      background: '#F8F8F8',
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
      isPrimary: true,
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
      isPrimary: true,
      type: 'basic',
    },
    {
      name: 'almostBlack',
      colors: ['#202020', '#404040'],
      isPrimary: true,
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
      colors: ['#1B1334', '#262A4A', '#00545A', '#027350', '#08C383', '#AAD962', '#FBBF46', '#EF6A32', '#ED0445', '#A12A5E', '#710262', '#110141'],
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
      colors: ['#A6CEE3', '#1F78B4', '#B2DF8A', '#33A02C', '#FB9A99', '#E31A1C', '#FDBF6F', '#FF7F00', '#CAB2D6', '#6A3D9A', '#FFFF99', '#B15928'],
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
    }
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
    }
  ];

  //
  //  color palettes from D3
  //  see https://observablehq.com/@d3/color-schemes
  //
  var d3Palettes = [
  {
    name: 'brownGreen',
    colors: ['#543005', '#7c480a', '#a1661b', '#c28c3d', '#d9b671', '#ebd7a4', '#f4ead0', '#eef1ea', '#d2ece8', '#a8ddd5', '#75c3b8', '#429f96', '#197b73', '#045a51', '#003c30'],
    id: 'interpolateBrBG',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'greys',
    colors: ['#ffffff', '#f6f6f6', '#ececec', '#dfdfdf', '#d1d1d1', '#c0c0c0', '#acacac', '#979797', '#828282', '#6e6e6e', '#5b5b5b', '#444444', '#2c2c2c', '#151515', '#000000'],
    id: 'interpolateGreys',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'inferno',
    colors: ['#000004', '#0d0829', '#280b53', '#470b6a', '#65156e', '#82206c', '#9f2a63', '#bc3754', '#d44842', '#e8602d', '#f57d15', '#fc9f07', '#fac228', '#f3e55d', '#fcffa4'],
    id: 'interpolateInferno',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'magma',
    colors: ['#000004', '#0c0926', '#221150', '#400f74', '#5f187f', '#7b2382', '#982d80', '#b73779', '#d3436e', '#eb5760', '#f8765c', '#fd9a6a', '#febb81', '#fddc9e', '#fcfdbf'],
    id: 'interpolateMagma',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'plasma',
    colors: ['#0d0887', '#350498', '#5302a3', '#6f00a8', '#8b0aa5', '#a31e9a', '#b83289', '#cc4778', '#db5c68', '#e97158', '#f48849', '#fba238', '#febd2a', '#fada24', '#f0f921'],
    id: 'interpolatePlasma',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'puBuGn',
    colors: ['#fff7fb', '#f4ebf5', '#e7e0ef', '#d7d6e9', '#c3cbe3', '#aac0dc', '#8bb4d6', '#69a8cf', '#4b9bc5', '#2e8fb4', '#14859a', '#057b7c', '#016d61', '#015b4a', '#014636'],
    id: 'interpolatePuBuGn',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'rainbow',
    colors: ['#6e40aa', '#a83cb3', '#df40a1', '#ff507a', '#ff704e', '#f89b31', '#d2c934', '#aff05b', '#6bf75c', '#34f07e', '#1bd9ac', '#1fb3d3', '#3988e1', '#585fd2', '#6e40aa'],
    id: 'interpolateRainbow',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'RedPurple',
    colors: ['#fff7f3', '#feeae6', '#fddcd8', '#fcccc9', '#fbb9be', '#faa3b6', '#f887ac', '#f369a3', '#e74a9b', '#d42d92', '#bb1386', '#9f047d', '#820177', '#650171', '#49006a'],
    id: 'interpolateRdPu',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'sinebow',
    colors: ['#ff4040', '#f27616', '#cfae01', '#9cdd06', '#63f922', '#30fe51', '#0de989', '#00bfbf', '#0d89e9', '#3051fe', '#6322f9', '#9c06dd', '#cf01ae', '#f21676', '#ff4040'],
    id: 'interpolateSinebow',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'spectral',
    colors: ['#9e0142', '#c42c4a', '#e1524a', '#f3784c', '#fba35e', '#fdca79', '#fee89a', '#fbf8b0', '#ebf7a6', '#ccea9f', '#a0d9a3', '#72c3a7', '#4ba0b1', '#4478b2', '#5e4fa2'],
    id: 'interpolateSpectral',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'turbo',
    colors: ['#23171b', '#4a44bc', '#4076f5', '#2ca6f1', '#26d0cd', '#37ed9f', '#5ffc73', '#95fb51', '#cbe839', '#f5c72b', '#ff9b21', '#fb6919', '#d6390f', '#a81604', '#900c00'],
    id: 'interpolateTurbo',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'viridis',
    colors: ['#440154', '#481b6d', '#46327e', '#3f4788', '#365c8d', '#2e6e8e', '#277f8e', '#21918c', '#1fa187', '#2db27d', '#4ac16d', '#73d056', '#a0da39', '#d0e11c', '#fde725'],
    id: 'interpolateViridis',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'YlGnBu',
    colors: ['#ffffd9', '#f4fbc3', '#e5f5b6', '#d0ecb4', '#b0e0b6', '#8ad2ba', '#65c3bf', '#45b4c2', '#2ea0c1', '#2288ba', '#216daf', '#2353a2', '#213c93', '#182b79', '#081d58'],
    id: 'interpolateYlGnBu',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'YlOrBr',
    colors: ['#ffffe5', '#ffface', '#fff3b6', '#fee89c', '#fed97d', '#fec75b', '#feb140', '#fb992c', '#f3821d', '#e66b12', '#d45708', '#bc4604', '#a03804', '#832e05', '#662506'],
    id: 'interpolateYlOrBr',
    isPrimary: true,
    type: 'd3',
  },
  {
    name: 'YlOrRd',
    colors: ['#ffffcc', '#fff5b3', '#ffea9a', '#fede82', '#fecd6a', '#feb855', '#fea246', '#fd893c', '#fc6932', '#f64828', '#e92a21', '#d71420', '#c00624', '#a20126', '#800026'],
    id: 'interpolateYlOrRd',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'blueGreen',
    colors: ['#f7fcfd', '#ecf8fa', '#e1f3f5', '#d2eeeb', '#bce6dd', '#a0dbcc', '#83cfb9', '#68c2a3', '#51b68a', '#3da76f', '#2b9554', '#19833f', '#097030', '#015b25', '#00441b'],
    id: 'interpolateBuGn',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'bluePurple',
    colors: ['#f7fcfd', '#eaf3f8', '#dae7f1', '#c8daea', '#b6cce3', '#a4bedb', '#97abd1', '#8f95c6', '#8c7dba', '#8b65ae', '#894da2', '#863293', '#7d1a7f', '#690a67', '#4d004b'],
    id: 'interpolateBuPu',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'cividis',
    colors: ['#002051', '#032d66', '#173a6d', '#30476e', '#48546d', '#5d616e', '#706e71', '#7f7c75', '#8e8978', '#9e9878', '#b1a775', '#c6b76c', '#ddc75f', '#f1d851', '#fdea45'],
    id: 'interpolateCividis',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'cool',
    colors: ['#6e40aa', '#654ec0', '#585fd2', '#4973dd', '#3988e1', '#2b9ede', '#1fb3d3', '#1ac7c2', '#1bd9ac', '#24e695', '#34f07e', '#4df56a', '#6bf75c', '#8cf457', '#aff05b'],
    id: 'interpolateCool',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'cubeHelix',
    colors: ['#000000', '#170d22', '#1a2442', '#15434f', '#1b6145', '#387434', '#6a7b30', '#a07949', '#c77b7b', '#d588b5', '#cda3e1', '#c2c4f3', '#c6e1f1', '#def4ef', '#ffffff'],
    id: 'interpolateCubehelixDefault',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'greenBlue',
    colors: ['#f7fcf0', '#eaf7e4', '#ddf2d8', '#d1edcc', '#c1e7c1', '#acdfbb', '#94d6bc', '#7bcbc4', '#62bdcb', '#4aaccc', '#3597c4', '#2182b9', '#116dac', '#095799', '#084081'],
    id: 'interpolateGnBu',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'orangeRed',
    colors: ['#fff7ec', '#feeed7', '#fee5c1', '#fdd9ab', '#fdcc97', '#fdbc86', '#fca771', '#fa8e5d', '#f4764f', '#ea5c40', '#dd3f2b', '#cc2317', '#b60c08', '#9c0101', '#7f0000'],
    id: 'interpolateOrRd',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'plasma',
    colors: ['#0d0887', '#350498', '#5302a3', '#6f00a8', '#8b0aa5', '#a31e9a', '#b83289', '#cc4778', '#db5c68', '#e97158', '#f48849', '#fba238', '#febd2a', '#fada24', '#f0f921'],
    id: 'interpolatePlasma',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'purpleBlue',
    colors: ['#fff7fb', '#f4eef6', '#e7e3f0', '#d7d7e9', '#c3cbe3', '#abc0dc', '#90b4d6', '#72a8cf', '#519ac6', '#308bbe', '#167ab3', '#086aa5', '#045c90', '#034b76', '#023858'],
    id: 'interpolatePuBu',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'purpleRed',
    colors: ['#f7f4f9', '#eee8f3', '#e4d9eb', '#dac5e0', '#d1afd5', '#ce98c9', '#d37fbd', '#dd63ae', '#e2449a', '#e02a81', '#d31967', '#bd0d53', '#a00444', '#830133', '#67001f'],
    id: 'interpolatePuRd',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'RdBu',
    colors: ['#67001f', '#9a1429', '#c0383b', '#da6a57', '#ee9a7c', '#f8c3a9', '#fae1d3', '#f2efee', '#dae9f1', '#b5d7e8', '#85bcd9', '#539bc7', '#3079b4', '#195693', '#053061'],
    id: 'interpolateRdBu',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'warm',
    colors: ['#6e40aa', '#8a3eb2', '#a83cb3', '#c53dad', '#df40a1', '#f4468f', '#ff507a', '#ff5e63', '#ff704e', '#ff843d', '#f89b31', '#e6b32e', '#d2c934', '#bfde43', '#aff05b'],
    id: 'interpolateWarm',
    isPrimary: false,
    type: 'd3',
  },
  {
    name: 'YlGn',
    colors: ['#ffffe5', '#fafdcd', '#f0f9b8', '#e1f3a9', '#ccea9d', '#b2df91', '#96d385', '#78c578', '#59b669', '#3fa45a', '#2b904b', '#197d40', '#096b39', '#015931', '#004529'],
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
      colors: [
        '#ff7a5a',
        '#765aa6',
        '#fee7bc',
        '#515e8c',
        '#ffc64a',
        '#b460a6',
        '#ffffff',
        '#4781c1',
      ],
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
    }
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
      name: 'dt02b',
      colors: ['#eee3d3'],
      stroke: '#302956',
      background: '#f3c507',
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
      name: 'dt11',
      colors: ['#ece9e2'],
      stroke: '#221e1f',
      background: '#75c4bf',
      type: 'duotone',
    },
    {
      name: 'dt12',
      colors: ['#f5f2d3'],
      stroke: '#073c5c',
      background: '#c0d0c3',
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
      colors: [
        '#8bc9c3',
        '#ffae43',
        '#ea432c',
        '#228345',
        '#d1d7d3',
        '#524e9c',
        '#9dc35e',
        '#f0a1a1',
      ],
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
      colors: [
        '#13477b',
        '#2f1b10',
        '#d18529',
        '#d72a25',
        '#e42184',
        '#138898',
        '#9d2787',
        '#7f311b',
      ],
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
      colors: [
        '#df9f00',
        '#1f6f50',
        '#8e6d7f',
        '#da0607',
        '#a4a5a7',
        '#d3d1c3',
        '#42064f',
        '#25393a',
      ],
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
      colors: [
        '#313a42',
        '#9aad2e',
        '#f0ae3c',
        '#df4822',
        '#8eac9b',
        '#cc3d3f',
        '#ec8b1c',
        '#1b9268',
      ],
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
      colors: [
        '#adb100',
        '#e5f4e9',
        '#f4650f',
        '#4d6838',
        '#cb9e00',
        '#689c7d',
        '#e2a1a8',
        '#151c2e',
      ],
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
      colors: [
        '#FBF5E9',
        '#FF514E',
        '#FDBC2E',
        '#4561CC',
        '#2A303E',
        '#6CC283',
        '#238DA5',
        '#9BD7CB',
      ],
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
    }
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
    }
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
    }
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
    }
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
      colors: [
        '#a87c2a',
        '#bdc9b1',
        '#f14616',
        '#ecbfaf',
        '#017724',
        '#0e2733',
        '#2b9ae9'
      ],
      stroke: '#292319',
      background: '#dfd4c1',
      type: 'kovesecs',
    },
    {
      name: 'kov_06b',
      colors: [
        '#d57846',
        '#dfe0cc',
        '#de442f',
        '#e7d3c5',
        '#5ec227',
        '#302f35',
        '#63bdb3'
      ],
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
    }
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
    name: 'austria',
    colors: ['#a40000', '#16317d', '#007e2f', '#ffcd12', '#b86092', '#721b3e', '#00b7a7'],
    isPrimary: true,
    sortOrder: [1, 2, 3, 4, 6, 5, 7],
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
    colors: ['#2d223c', '#574571', '#90719f', '#b695bc', '#dec5da', '#c1d1aa', '#7fa074', '#466c4b', '#2c4b27', '#0e2810'],
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
    colors: ['#e76254', '#ef8a47', '#f7aa58', '#ffd06f', '#ffe6b7', '#aadce0', '#72bcd5', '#528fad', '#376795', '#1e466e'],
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
    name: 'juarez',
    colors: ['#a82203', '#208cc0', '#f1af3a', '#cf5e4e', '#637b31', '#003967'],
    isPrimary: true,
    sortOrder: [1, 2, 3, 4, 5, 6],
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
    colors: ['#3b2319', '#80521c', '#d29c44', '#ebc174', '#ede2cc', '#7ec5f4', '#4585b7', '#225e92', '#183571', '#43429b', '#5e65be'],
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
    colors: ['#6b200c', '#973d21', '#da6c42', '#ee956a', '#fbc2a9', '#f6f2ee', '#bad6f9', '#7db0ea', '#447fdd', '#225bb2', '#133e7e'],
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
    colors: ['#5b859e', '#1e395f', '#75884b', '#1e5a46', '#df8d71', '#af4f2f', '#d48f90', '#732f30', '#ab84a5', '#59385c', '#d8b847', '#b38711'],
    isPrimary: true,
    sortOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    type: 'metbrewer',
  },
  {
    name: 'renoir',
    colors: ['#17154f', '#2f357c', '#6c5d9e', '#9d9cd5', '#b0799a', '#f6b3b0', '#e48171', '#bf3729', '#e69b00', '#f5bb50', '#ada43b', '#355828'],
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
    colors: ['#fbe183', '#f4c40f', '#fe9b00', '#d8443c', '#9b3441', '#de597c', '#e87b89', '#e6a2a6', '#aa7aa1', '#9f5691', '#633372', '#1f6e9c', '#2b9b81', '#92c051'],
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
  }
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
    }
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
    }
  ];

  //
  // Original collection by Kjetil Midtgarden Golid
  // https://github.com/kgolid/chromotome
  // https://kgolid.github.io/chromotome-site/
  //
  var roygbivsPalettes = [
    {
      name: 'retro',
      colors: [
        '#69766f',
        '#9ed6cb',
        '#f7e5cc',
        '#9d8f7f',
        '#936454',
        '#bf5c32',
        '#efad57'
      ],
      type: 'roygbivs',
    },
    {
      name: 'retro-washedout',
      colors: [
        '#878a87',
        '#cbdbc8',
        '#e8e0d4',
        '#b29e91',
        '#9f736c',
        '#b76254',
        '#dfa372'
      ],
      type: 'roygbivs',
    },
    {
      name: 'roygbiv-warm',
      colors: [
        '#705f84',
        '#687d99',
        '#6c843e',
        '#fc9a1a',
        '#dc383a',
        '#aa3a33',
        '#9c4257'
      ],
      type: 'roygbivs',
    },
    {
      name: 'roygbiv-toned',
      colors: [
        '#817c77',
        '#396c68',
        '#89e3b7',
        '#f59647',
        '#d63644',
        '#893f49',
        '#4d3240'
      ],
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
        '#ca2847'
      ],
      type: 'roygbivs',
    }
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
    }
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
    }
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
    }
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
      colors: ['#5f9e93', '#3d3638', '#733632', '#b66239', '#b0a1a4', '#e3dad2']
    },
    {
      name: 'tundra3',
      colors: [
        '#87c3ca',
        '#7b7377',
        '#b2475d',
        '#7d3e3e',
        '#eb7f64',
        '#d9c67a',
        '#f3f2f2'
      ],
      type: 'tundra',
    },
    {
      name: 'tundra4',
      colors: [
        '#d53939',
        '#b6754d',
        '#a88d5f',
        '#524643',
        '#3c5a53',
        '#7d8c7c',
        '#dad6cd'
      ],
      type: 'tundra',
    }
  ];

  Toko.prototype.CONTRAST_MIX_COLORS = ['#111', '#eee'];
  Toko.prototype.CONTRAST_MIX_FACTOR = 0.8;
  Toko.prototype.CONTRAST_MIX_MODE = 'lab';
  Toko.prototype.MAX_COLORS_BEZIER = 5; // maximum number of colors for which bezier works well

  Toko.prototype.MODELIST = [
    'rgb',
    'lrgb',
    'lab',
    'hsl',
    'lch',
  ];

  Toko.prototype.DEFAULT_COLOR_OPTIONS = {
    reverse: false,
    domain: [0, 1],
    mode: 'rgb',
    gamma: 1,
    correctLightness: false,
    bezier: false,
    stepped: false,
    steps: 10,
    nrColors: 10,
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


  Toko.prototype._createColorScale = function (colorSet, colorOptions) {
    if (!this.initColorDone) {
      this._initColor();
    }
    let sc,oSC;
    let o = {};

    if (colorOptions._validated != true) {
      colorOptions = this._validateColorOptions(colorOptions);
    }

    //
    // make contrast colors from colors from both ends of the scale
    //
    let contrastColors = [];
    contrastColors[0] = chroma.mix(colorSet[0], this.CONTRAST_MIX_COLORS[0], this.CONTRAST_MIX_FACTOR, this.CONTRAST_MIX_MODE).hex();
    contrastColors[1] = chroma.mix(colorSet[colorSet.length - 1], this.CONTRAST_MIX_COLORS[1], this.CONTRAST_MIX_FACTOR, this.CONTRAST_MIX_MODE).hex();

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
    // only adjust gamma if needed
    //
    if (colorOptions.gamma != 1) {
      sc.gamma(colorOptions.gamma);
    }

    //
    // this does not work well with varied palettes so avoid
    //
    if (colorOptions.correctLightness) {
      sc = sc.correctLightness();
    }

    if (colorOptions.stepped && colorOptions.steps > 0) {
      sc = sc.classes(colorOptions.steps);
    }

    
    o.scaleChroma = sc;
    o.contrastColors = contrastColors;
    o.options = colorOptions;
    o.list = sc.colors(colorOptions.nrColors);
    
    o.originalColors = colorSet;

    o.scale = (i) => {
      return sc(i).hex();
    };
    o.originalScale = (i) => {
      return oSC(i).hex();
    };
    o.randomColor = (useTokoRandom = false) => {
      let r = (useTokoRandom)?Toko.random():Math.random();
      let d = colorOptions.domain;

      return sc(d[0] + r * (d[1] - d[0])).hex();
    };
    o.randomOriginalColor = (useTokoRandom = false) => {
      let r = (useTokoRandom)?Toko.random():Math.random();
      let d = colorOptions.domain;

      return oSC(d[0] + r * (d[1] - d[0])).hex();
    };

    return o;
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

    if (typeof inPalette === 'object') {
      colorSet = [... inPalette];
    } else if (typeof inPalette === 'string') {
      p = this.findPaletteByName(inPalette);
      colorSet = [... p.colors]; // clone the array to not mess up the original
    } else {
      console.log("ERROR: palette should be a string or an array");
    } o = this.createColorScale(colorSet, colorOptions);

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

    return tempPaletteList[i].name
  };

  //
  //  get a random palette
  //
  Toko.prototype._getRandomPalette = function (inPalette, paletteType = 'all', justPrimary = true) {
    if (!this.initColorDone) {
      this._initColor();
    }
    let tempPaletteList = this._getPaletteListRaw(paletteType, justPrimary);

    var randomPalette = tempPaletteList[Math.floor(Math.random() * tempPaletteList.length)];

    return randomPalette.name
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
      filtered = this.palettes.filter(p => (p.type === paletteType));
    }

    if (justPrimary) {
      filtered = filtered.filter(p => (p.isPrimary));
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
  Toko.prototype._getPaletteSelectionRaw = function(selectionList, justPrimary, sorted) {
    if (!this.initColorDone) {
      this._initColor();
    }
    // to lowercase and strip spaces
    selectionList = selectionList.toLowerCase().replace(/\s/g, '');
    let labels = selectionList.split(',');
    let filtered = [];
    for (let i = 0; i < labels.length; i++) {
      filtered = filtered.concat(
        this.palettes.filter(p => (p.name.toLowerCase() === labels[i] || p.type === labels[i]))
      );
    }
    if (justPrimary) {
      filtered = filtered.filter(p => (p.isPrimary));
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
  Toko.prototype._sortPaletteList = function(paletteList) {
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
    // combine the chromotome palettes
    //
    // var chromotome_complete = golidPalettes.misc.concat(golidPalettes.ranganath, golidPalettes.roygbivs, golidPalettes.tundra, golidPalettes.colourscafe, golidPalettes.rohlfs, golidPalettes.ducci, golidPalettes.judson, golidPalettes.iivonen, golidPalettes.kovecses, golidPalettes.tsuchimochi, golidPalettes.duotone, golidPalettes.hilda, golidPalettes.spatial, golidPalettes.jung, golidPalettes.system, golidPalettes.flourish, golidPalettes.exposito, golidPalettes.cako,);

    //
    // id the palettes
    //
    // basicPalettes = basicPalettes.colorSchemes.map(p => ({
    //   ...p,
    //   type: this.REGULAR_SCALE
    // }));
    // var d3Scales = d3Palettes.d3Scales.map(p => ({
    //   ...p,
    //   type: this.D3_SCALE
    // }));
    // var metBrewer = metBrewerPalettes.metBrewer.map(p => ({
    //   ...p,
    //   type: this.REGULAR_SCALE
    // }));
    // // this.cosineScales = this.cosineScales.map(p => ({ ...p, type: this.COSINE_SCALE }));
    // //
    // //	combine
    // //
    // this.palettes = [
    //   ... colorSchemes,
    //   ... d3Scales,
    //   // ...this.cosineScales,
    //   ... chromotome_complete,
    //   ... metBrewer,
    // ];

    this.palettes = basicPalettes.concat(
      d3Palettes,
      metBrewerPalettes,
      golidmiscPalettes,
      ranganathPalettes,
      roygbivsPalettes,
      tundraPalettes,
      colourscafePalettes,
      rohlfsPalettes,
      ducciPalettes,
      judsonPalettes,
      iivonenPalettes,
      kovecsesPalettes,
      tsuchimochiPalettes,
      duotonePalettes,
      hildaPalettes,
      spatialPalettes,
      jungPalettes,
      systemPalettes,
      flourishPalettes,
      dalePalettes,
      cakoPalettes,
      mayoPalettes,
      expositoPalettes,
    );
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

  Toko.prototype.setup = function (inputOptions) {

    console.log('Toko - setup');

    // todo: fix the fps graph. Currently it increases when using the tweakpane controls
    this.capturer = {};
    this.captureOptions = {};

    //
    // merge incoming options with the defaults
    //
    this.options = Object.assign({}, this.DEFAULT_OPTIONS, inputOptions);

    if (this.options.acceptDroppedSettings) {
      p5Canvas.drop(this.receiveSettings.bind(this));
    }

    if (this.options.useParameterPanel) {
      this.basePane = new Tweakpane.Pane();

      var tabs = [
        {
          title: this.TABS_PARAMETERS
        }
      ];
      if (this.options.showAdvancedOptions) {
        tabs.push({title: this.TABS_ADVANCED});
        this.TAB_ID_ADVANCED = tabs.length - 1;
      }

      if (this.options.captureFrames) {
        tabs.push({title: this.TABS_CAPTURE});
        this.TAB_ID_CAPTURE = tabs.length - 1;
      }
      if (this.options.logFPS) {
        tabs.push({title: this.TABS_FPS});
        this.TAB_ID_FPS = tabs.length - 1;
      }

      this.basePaneTab = this.basePane.addTab({pages: tabs});

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
            if (e.style.display == 'block') 
              e.style.display = 'none';
             else 
              e.style.display = 'block';
            
            break;
        }
      };
      
      //
      //  add any additional canvas sizes that were passed along
      //
      let n = this.options.additionalCanvasSizes.length;
      if (n > 0) {
        for (let i = 0; i < n; i++) {
          this.addCanvasSize(
            this.options.additionalCanvasSizes[i]
          );
        }
      }

      //
      // add advanced options
      //
      if (this.options.showAdvancedOptions) {
        this.options.canvasSizeName = this.options.canvasSize.name; // use this to take the name out of the object
        this.basePaneTab.pages[this.TAB_ID_ADVANCED].addInput(this.options, 'canvasSizeName', {options: this.SIZES_LIST}).on('change', (ev) => {
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

      this.pt = {
        fps: 0,
        graph: 0,
      };

      var f = this.basePaneTab.pages[this.TAB_ID_FPS];

      f.addMonitor(this.pt, 'fps', {interval: 200});

      f.addMonitor(this.pt, 'graph', {
        view: 'graph',
        interval: 100,
        min: 0,
        max: 120
      });
    }

    if (this.options.useParameterPanel) {
      if (this.options.showSaveSketchButton && !this.options.saveSettingsWithSketch) {
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addSeparator();
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addButton({title: 'Save sketch'}).on('click', (value) => {
          this.saveSketch();
        });
      } else if (this.options.showSaveSketchButton && this.options.saveSettingsWithSketch) {
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addSeparator();
        this.basePaneTab.pages[this.TAB_ID_PARAMETERS].addButton({title: 'Save sketch & settings'}).on('click', (value) => {
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

  Toko.prototype.startDraw = function() {
    //
    //	will be called at the start of the draw loop
    //
  };

  Toko.prototype.endDraw = function() {
    //
    //	will be called at the end of the draw loop
    //
    //--------------------------------------------
    //
    //	track fps with a simple filter to dampen any short spikes
    //
    if (this.options.logFPS) {
        this._frameTime += (deltaTime - this.FRAME_TIME) / this.FPS_FILTER_STRENGTH;
        this.pt.fps = this.pt.graph = Math.round(1000/this.FRAME_TIME);
    }
    //
    //  capture a frame if we're actively capturing
    //
    if (this.options.captureFrames && this._captureStarted) {
      this.captureFrame();
    }
  };

  //
  //  resize canvas to a new size while fitting within the window
  //
  Toko.prototype.setCanvasSize = function(inSize) {
    let margin = 80;
    let zoomFactor = 1;
    let displayFactor = inSize.pixelDensity/2;
    let newWidthString, newHeightString;

    if (!inSize.fullWindow) {
      zoomFactor = Math.min(1,(windowWidth - margin)/inSize.width*displayFactor);
      zoomFactor = Math.min(zoomFactor,(windowHeight -margin)/inSize.height*displayFactor);

      newWidthString = Math.floor(inSize.width * zoomFactor / displayFactor) + 'px';
      newHeightString = Math.floor(inSize.height * zoomFactor / displayFactor) + 'px';
    } else {
      inSize.width = windowWidth;
      inSize.height = windowHeight;

      newWidthString = '100vw';
      newHeightString = '100vh';
    }

    resizeCanvas(inSize.width*displayFactor, inSize.height*displayFactor, true);

    p5Canvas.canvas.style.width = newWidthString;
    p5Canvas.canvas.style.height = newHeightString;
  };

  //
  //  add an additional size to the list of sizes - can only be done as Toko is set up
  //
  Toko.prototype.addCanvasSize = function(inSize) {
    this.SIZES.push(inSize);
    this.SIZES_LIST[inSize.name] = inSize.name;
  };

  //
  //  pick a random adjective from the list
  //  note this does not use the seeded random function to avoid file name conflicts
  //
  Toko.prototype.randomAdjective = function() {
    return this.ADJECTIVES[Math.floor(this.ADJECTIVES.length * Math.random())];
  };

  //
  //  pick a random noun from the list
  //  note this does not use the seeded random function to avoid file name conflicts
  //
  Toko.prototype.randomNoun = function() {
    return this.NOUNS[Math.floor(this.NOUNS.length * Math.random())];
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
  Toko.prototype.addPaneNavButtons = function (pane, pObject, pName, pCollection) {
    pane.addBlade({
      view: 'buttongrid',
      size: [3, 1],
      cells: (x, y) => ({
        title: [
          ['← prev', 'rnd', 'next →'],
        ][y][x],
      }),
      label: ' ',
    }).on('click', (ev) => {
      let paletteList = toko.getPaletteSelection(pObject[pCollection], false, true);
      switch (ev.index[0]) {
        case 0:
          pObject[pName] = this.findPreviousInList(pObject[pName],paletteList);
          break;
        case 1:
          pObject[pName] = this.findRandomInList(pObject[pName],paletteList);
          break;
        case 2:
          pObject[pName] = this.findNextInList(pObject[pName],paletteList);
          break;
        default:
          console.log('a non-existing button was pressed:',ev.index[0]);
          break;
      }
      this.basePane.refresh();
    });
  };

  //
  //  add a double selector for color palette
  //
  Toko.prototype.addCollectionSelector = function (pane, pObject, collections, curCollection, palettes, index = 1) {
    let colorPalettes = this.getPaletteSelection(pObject[curCollection], false, true);
    var scaleInput = {};
    pane.addInput(pObject, curCollection, {
      index:index,
      options: this.formatForTweakpane(pObject[collections])
    }).on('change', (ev) => {
      let colorPalettes = this.getPaletteSelection(pObject[curCollection], false, true);
      scaleInput.dispose();
      scaleInput = pane.addInput(pObject, palettes, {
        index:index+1,
        options:colorPalettes
      });
      this.basePane.refresh();
    });
    scaleInput = pane.addInput(pObject, palettes, {
      options:colorPalettes
    });
  };

  //
  //  find the next item in a list formatted for TweakPane
  //
  Toko.prototype.findNextInList = function (item, list) {
    let keys = Object.keys(list);
    let i = keys.indexOf(item);
    let n;
    if (i < keys.length-1) {
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
      newItem = keys[Math.floor(Math.random()*keys.length)];
    } while (newItem == item);
    return list[newItem];
  };

  //
  //  general math functions
  //

  //
  //  wrap a number around if it goes above the maximum or below the minimum
  //
  Toko.wrap = function (value, min = 0, max = 100) {
    var vw = value;

    if (value < min) {
      vw = max + (value - min);
    } else if (value > max) {
      vw = min + (value - max);
    }

    return vw
  };

  //
  //  random number generators and support
  //

  //
  //  init the random number generator for this instance of Toko
  //
  Toko.reseed = function(seed) {
    this._rng = new Toko.rng(seed);
  };

  //
  //  get a random number
  //
  Toko.random = function(min, max) {
    return this._rng.random(min, max);
  };

  //
  //  main random number generator class
  //
  Toko.rng = class {

    constructor(seed) {
      if (seed == undefined) { 
        this.seed = Date.now(); 
      } else {
        this.seed = seed;
      }
    }

    //
    //  reseed the random number generator
    //
    reseed = function(newSeed) {
      this.seed = newSeed;
    }

    //
    //  Return a random floating-point number
    //
    //  0 arguments - random number between 0 and 1
    //  1 argument & number - random number between 0 and the number (but not including)
    //  1 argument & array  - random element from the array
    //  2 arguments & number - random number from 1st number to 2nd number (but not including)
    //
    //  adapted from p5.js code
    //
    random = function(min, max) {
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

    //
    //  random integer from a range
    //
    intRange = function(min = 0, max = 100) {
      let rand = this._rng();

      min = Math.floor(min);
      max = Math.floor(max);
    
      return Math.floor(rand * (max - min) + min);
    }

    //
    //  random boolean
    //
    bool = function() {
      if (this._rng() < 0.5) {
        return true;
      } else {
        return false;
      }
    }

    //
    //  random character from a string
    //  without input it returns a random lowercase letter
    //
    char = function(inString = 'abcdefghijklmnopqrstuvwxyz') {
      let l = inString.length;
      let r = Math.floor(this.random(0,l));
      return inString.charAt(r);
    }

    //
    //  generate a random number snapped to steps
    //
    steppedRandom = function (min = 0, max = 1, step = 0.1) {
      var n = Math.floor((max - min) / step);
      var r = Math.round(this._rng() * n);
      return min + r * step;
    }

    //
    //  shuffle an array in place
    //
    shuffle = function (array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(this._rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    //
    //  generate random integer sequence from min to max
    //
    intSequence = function (min = 0, max = 100) {
      min = Math.floor(min);
      max = Math.floor(max);
      if (max < min) {
        let temp = max;
        max = min;
        min = temp;
      }
      let seq = Array.from(Array(max - min)).map((e,i)=>i+min);
      this.shuffle(seq);
      return seq;
    }

    //
    //  the psuedo random number generator
    //  adapted from https://github.com/cprosche/mulberry32
    //
    _rng = function() {
      let t = this.seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
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

    SPLIT_HORIZONTAL = "split_horizonal";
    SPLIT_VERTICAL = "split_vertical";
    SPLIT_LONGEST = "split_longest";
    SPLIT_MIX = "split_mix";
    SPLIT_SQUARE = "split_square";

  	constructor(x,y,width,height) {
      this._position = createVector(x,y);
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._cells = [
        new Toko.GridCell(this._x,this._y,this._width,this._height, 0, 0, this._width, this._height)
      ];
      this._points = [];
      this._pointsAreUpdated = false;
      this._openSpaces = [];
    }

    //
    //  set the base rows and columns for the grid
    //
    setBaseGrid(columns = 1, rows = 1) {
      let cellWidth = this._width/columns;
      let cellHeight = this._height/rows;

      this._cells = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          let newCell = new Toko.GridCell(
            this._x + c * cellWidth,
            this._y + r* cellHeight,
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
    gatherPoints() {
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
        tempPoints.push(`${c.x+c.width}-${c.y}`);
        // bottom left corner
        tempPoints.push(`${c.x}-${c.y+c.height}`);
        // bottom right corner
        tempPoints.push(`${c.x+c.width}-${c.y+c.height}`);
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
        this._points.push(createVector(parseFloat(a[0]),parseFloat(a[1])));
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
    packGrid(columns,rows,cellShapes, fillEmptySpaces = true, snapToPixel = true) {
      this._pointsAreValid = false;
      this._cells = [];
      let cw, rh;
      if (snapToPixel) {
        cw = Math.round(this._width/columns);
        rh = Math.round(this._height/rows);
      } else {
        cw = this._width/columns;
        rh = this._height/rows;
      }
      
      this.resetOpenSpaces(columns,rows);
      let spaceCheckInterval = 10;
      let keepGoing = true;
      let shape, w, h, c, r, newCell, keepTryingThisShape;
      let k = 0;
      let fails = 0;
      let maxFails = 10000;
      let triesPerShape = 2500; 
      let tryCounter = 0;

      while (keepGoing) {
        // pick random shape
        shape = Toko.random(cellShapes);
        w = shape[0];
        h = shape[1];

        keepTryingThisShape = true;
        while (keepTryingThisShape) {
          // pick random location
          c = floor(Toko.random(0, columns - w + 1));
          r = floor(Toko.random(0, rows - h + 1));

          // check if space is available
          if (this.spaceAvailable(c,r,w,h)) {
            newCell = new Toko.GridCell(this._x+c*cw, this._y+r*rh, w*cw, h*rh, c, r, w, h);
            newCell.counter = tryCounter;
            this._cells.push(newCell);
            this.fillSpace(c,r,w,h);
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
        if (k%spaceCheckInterval == 0) {
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
        this.fillEmptySpaces(columns,rows,cellShapes, snapToPixel);
      }
      
    }

    //
    //  fill the remaining empty spaces systematically
    //
    fillEmptySpaces(columns,rows,cellShapes, snapToPixel) {
      cellShapes.push([1,1]); // add a 1x1 so we can always fill
      let cw, rh;
      if (snapToPixel) {
        cw = Math.round(this._width/columns);
        rh = Math.round(this._height/rows);
      } else {
        cw = this._width/columns;
        rh = this._height/rows;
      }
      let s, tryingShapes, w, h, newCell;
      //
      //  go through the entire grid and try every space in every open spot
      //
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          tryingShapes = true;
          s = 0;
          while (tryingShapes) {
            w = cellShapes[s][0];
            h = cellShapes[s][1];
            if (this.spaceAvailable(i,j,w,h)) {
              newCell = new Toko.GridCell(this._x+i*cw, this._y+j*rh, w*cw, h*rh, i, j, cw, rh);
              newCell.counter = s;
              this._cells.push(newCell);
              this.fillSpace(i,j,w,h);
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
    spaceAvailable(column,row,width,height) {
      if ((column+width) > this._openSpaces.length) {
        return false;
      }
      if ((row+height) > this._openSpaces[0].length) {
        return false;
      }
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!this._openSpaces[column+i][row+j]) {
            return false;
          }
        }
      }
      return true;
    }

    //
    //  mark a specific area in the grid as no longer open
    //
    fillSpace(column,row,width,height) {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          this._openSpaces[column+i][row+j] = false;
        }
      }
    }

    //
    //  reset all the space back to open
    //
    resetOpenSpaces(columns, rows) {
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
    anySpaceLeft() {
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
    splitRecursive(nrLoops = 1, chance = 0.5, minSize = 10, splitStyle = this.SPLIT_MIX) {
      if (splitStyle == this.SPLIT_SQUARE) {
        // reduce the chance because the square split creates 4 cells instead of 2
        chance *= 0.5;
      }

      for (let i = 0; i < nrLoops; i++) {
        let newCells = [];
        for (let n = 0; n < this._cells.length; n++) {
          if (Toko.random() < chance) {
            let c = this.splitCell(this._cells[n],minSize, splitStyle);
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
    splitCell(cell, minSize = 10, splitStyle = this.SPLIT_MIX) {
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
    splitCellLongest(cell, minSize = 10) {
      if (cell.width > cell.height) {
        return this.splitCellHorizontal(cell, minSize);
      } else {
        return this.splitCellVertical(cell, minSize);
      }
    }

    //
    //  split cells randomly along horizontal or vertical axis
    //
    splitCellMix(cell, minSize = 10) {
      if (Toko.random() < 0.5) {
        return this.splitCellHorizontal(cell, minSize);
      } else {
        return this.splitCellVertical(cell, minSize);
      }
    }

    //
    //  split a cell evenly into 4 cells
    //
    splitCellSquare(cell, minSize = 10) {
      let w2 = cell.width/2;
      let h2 = cell.height/2;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (w2 > minSize && h2 > minSize) {
          newCells.push(new Toko.GridCell(x,y,w2,h2));
          newCells.push(new Toko.GridCell(x+w2,y,w2,h2));
          newCells.push(new Toko.GridCell(x+w2,y+h2,w2,h2));
          newCells.push(new Toko.GridCell(x,y+h2,w2,h2));
          newCells[0].counter = newCells[1].counter = newCells[2].counter = newCells[3].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    //
    //  split a cell horizontally
    //
    splitCellHorizontal(cell, minSize = 10) {
      let w2 = cell.width/2;
      let h = cell.height;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (w2 > minSize) {
          newCells.push(new Toko.GridCell(x,y,w2,h));
          newCells.push(new Toko.GridCell(x+w2,y,w2,h));
          newCells[0].counter = newCells[1].counter = c;
      } else {
        newCells.push(cell);
      }
      return newCells;
    }

    //
    //  split a cell vertically
    //
    splitCellVertical(cell, minSize = 10) {
      let w = cell.width;
      let h2 = cell.height/2;
      let x = cell.x;
      let y = cell.y;
      let c = cell.counter + 1;
      let newCells = [];

      if (h2 > minSize) {
          newCells.push(new Toko.GridCell(x,y,w,h2));
          newCells.push(new Toko.GridCell(x,y+h2,w,h2));
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

    get maxCounter() {
      //
      //  find the max value of counter in all the cells
      //  see https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
      //
      let maxC = this._cells.reduce((a,b)=>a.counter > b.counter ?a:b).counter;
      return maxC;
    }

    get minCounter() {
      let minC = this._cells.reduce((a,b)=>a.counter < b.counter ?a:b).counter;
      return minC;
    }

    get width() {
      return this._width;
    }

    get height() {
      return this._height;
    }

    get x() {
      return this._x;
    }

    get y() {
      return this._y;
    }

    get cells() {
      return this._cells;
    }

    get points() {
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
    constructor(x,y,width,height,column=0,row=0,gridWidth=0,gridHeight=0) {
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

    get x() {
      return this._x;
    }
    set x(in_x) {
      this._x = in_x;
    }
    
    get y() {
      return this._y;
    }
    set y(in_y) {
      this._y = in_y;
    }
    
    get width() {
      return this._width;
    }
    set width(in_width) {
      this._width = in_width;
    }
    
    get height() {
      return this._height;
    }
    set height(in_height) {
      this._height = in_height;
    }
    
    get row() {
      return this._row;
    }
    set row(in_row) {
      this._row = in_row;
    }
    
    get column() {
      return this._column;
    }
    set column(in_column) {
      this._column = in_column;
    }
    
    get gridWidth() {
      return this._gridWidth;
    }
    set gridWidth(in_gridWidth) {
      this._gridWidth = in_gridWidth;
    }
    
    get gridHeight() {
      return this._gridHeight;
    }
    set gridHeight(in_gridHeight) {
      this._gridHeight = in_gridHeight;
    }
    
    get value() {
      return this._value;
    }
    set value(in_value) {
      this._value = in_value;
    }
    
    get counter() {
      return this._counter;
    }
    set counter(in_counter) {
      this._counter = in_counter;
    }

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
    var day = ("0" + d.getDate()).slice(-2);
    var month = ("0" + (
      d.getMonth() + 1
    )).slice(-2);
    var year = d.getFullYear();

    return year + month + day;
  };

  Toko.prototype.initCapture = function () {
    let o = this.getCaptureOptions(this.captureOptions.format);
    this.capturer = new CCapture(o);
  };

  Toko.prototype.createCapturePanel = function(tabID) {
    var t = this.basePaneTab.pages[tabID];

    t.addInput(this.captureOptions, 'format', {
      options: this.CAPTURE_FORMATS,
    });

    t.addSeparator();

    this.startCaptureButton = t.addButton({
      title: '🔴 Record',
    }).on('click', (value) => {
      this.clickStartCapture();
    });

    this.stopCaptureButton = t.addButton({
      title: '⬛️ Stop recording',
    }).on('click', (value) => {
      this.clickStopCapture();
    });
    this.stopCaptureButton.hidden = true;
  };

  Toko.prototype.clickStartCapture = function() {
    this.stopCaptureButton.hidden = false;
    this.startCaptureButton.hidden = true;
    this.startCapture();
    redraw(); // BUG: this should not be needed but for some reason it halts without it
  };

  Toko.prototype.clickStopCapture = function() {
    this.stopCaptureButton.hidden = true;
    this.startCaptureButton.hidden = false;
    this.stopCapture();
  };

  Toko.prototype.startCapture = function () {
    if (!this._captureStarted && this.options.captureFrames) {
      this.initCapture();
      window.captureStarted?.();
      this._captureStarted = true;
      this.capturer.start();
    }
  };

  Toko.prototype.stopCapture = function () {
    if (this.options.captureFrames && this._captureStarted) {
      this.capturer.stop();
      window.captureStopped?.();
      this.capturer.save();
      this._captureStarted = false;
    }
  };

  Toko.prototype.captureFrame = function() {
    if (this.options.captureFrames) {
      // capture a frame
      this.capturer.capture(document.getElementById('defaultCanvas0'));
    } else {
      this.stopCapture();
    }
  };

  Toko.prototype.getCaptureOptions = function(format = 'png') {
    //
    //  default options
    //
    let o = {
      format: 'png', 
      framerate: this.options.captureFrameRate, 
      name: this.generateFilename('none', 'captured'), 
      display: false,
      motionBlurFrames: 0,
      verbose: false,
    };
    //
    //  alternative options
    //
    switch (format) {
      case 'gif':
        o.format = 'gif';
        o.quality = 10;
        o.workersPath = 'assets/jnordberg/';
        break;
      case 'jpg':
        o.format = 'jpg';
        break;
    }

    return o;
  };

  Toko.prototype.saveSketch = function () {
    //
    // detect if the sketch is in canvas or svg
    //
    var sketchElement = document.getElementById(this.options.sketchElementId).firstChild;
    var isCanvas = sketchElement instanceof HTMLCanvasElement;
    if (sketchElement.firstChild != null) {
      var isSVG = (sketchElement.firstChild.nodeName == "svg");
    }

    if (isCanvas) {
      var filename = this.generateFilename('png');
      var url = document.getElementById(this.options.sketchElementId).firstChild.toDataURL("image/png;base64");
    } else if (isSVG) {
      //
      // add attributes to ensure proper preview of the SVG file in the Finder
      //
      var svgTemp = document.getElementById('sketch-canvas').firstChild.firstChild.firstChild;
      svgTemp.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svgTemp.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      var filename = this.generateFilename('svg');
      var svgString = document.getElementById(this.options.sketchElementId).firstChild.innerHTML;

      var blob = new Blob([svgString], {'type': 'image/svg+xml'});
      var url = window.URL.createObjectURL(blob);
    } else {
      console.log("Toko - saveSketch: unkown type");
      return;
    }
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

  Toko.prototype.saveSettings = function (filename = 'default') {
    
    if (typeof filename === 'undefined' || filename == 'default') {
      filename = this.generateFilename('json');
    }

    if (filename.slice(-5) != '.json') {
      filename += '.json';
    }

    let settings = this.basePane.exportPreset();
    createStringDict(settings).saveJSON(filename);
  };

  Toko.prototype.receiveSettings = function (file) {
    if (file.subtype == 'json') {
      this.basePane.importPreset(file.data);
    }
    window.receivedFile?.(file);
  };

  //

  return Toko;

})();
//# sourceMappingURL=Toko.js.map
