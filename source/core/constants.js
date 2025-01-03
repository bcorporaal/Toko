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
export const VERSION = 'Toko v0.13.0';

//
//  Set of standard sizes for the canvas and exports
//
export const SIZE_DEFAULT = {
  name: 'default',
  width: 800,
  height: 800,
  pixelDensity: 2,
};

export const SIZE_FULL = {
  name: 'full_window',
  width: 100,
  height: 100,
  pixelDensity: 2,
  fullWindow: true,
};

export const SIZE_SQUARE_XL = {
  name: 'square_XL',
  width: 1600,
  height: 1600,
  pixelDensity: 2,
};

export const SIZE_1080P = {
  name: '1080p',
  width: 1920,
  height: 1080,
  pixelDensity: 2,
};

export const SIZE_1080P_PORTRAIT = {
  name: '1080p_portrait',
  width: 1080,
  height: 1920,
  pixelDensity: 2,
};

export const SIZE_4K = {
  name: '4K',
  width: 3840,
  height: 2160,
  pixelDensity: 2,
};

export const SIZE_4K_PORTRAIT = {
  name: '4K_portrait',
  width: 2160,
  height: 3840,
  pixelDensity: 2,
};

export const SIZE_IPHONE_11_WALLPAPER = {
  name: 'iphone_11',
  width: 1436,
  height: 3113,
  pixelDensity: 1,
};

export const SIZE_WIDE_SCREEN = {
  name: 'wide_screen',
  width: 2560,
  height: 1440,
  pixelDensity: 1,
};

export const SIZE_MACBOOK_14_WALLPAPER = {
  name: 'macbook_14',
  width: 3024,
  height: 1964,
  pixelDensity: 1,
};

export const SIZE_MACBOOK_16_WALLPAPER = {
  name: 'macbook_16',
  width: 3072,
  height: 1920,
  pixelDensity: 1,
};

//
//  List used for the dropdown in the advanced tab
//
export var SIZES_LIST = {
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

export var SIZES = [
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
export const TABS_PARAMETERS = 'Parameters';
export const TABS_ADVANCED = 'Size';
export const TABS_FPS = 'FPS';
export const TABS_CAPTURE = 'Record';

export var TAB_ID_CAPTURE = -1;
export var TAB_ID_FPS = -1;
export var TAB_ID_PARAMETERS = 0;
export var TAB_ID_ADVANCED = 1;

//
//	Default options for setup
//
export const DEFAULT_OPTIONS = {
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
  log: true,
  captureFrames: false,
  canvasSize: SIZE_DEFAULT,
  seedString: '',
};

//
//  Options for capture
//
export const CAPTURE_FORMATS = {
  WebM: 'webm',
  MP4: 'mp4',
  PNG: 'png',
  JPG: 'jpg',
  GIF: 'gif',
  WebP: 'webp',
};

export const CAPTURE_FRAMERATES = {
  15: 15,
  24: 24,
  25: 25,
  30: 30,
  60: 60,
};

export const DEFAULT_CAPTURE_OPTIONS = {
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
    toko.resetCapture(context.filename); // used to ensure the reset always happens
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
export const FPS_FILTER_STRENGTH = 40;
export const FRAME_TIME = 16;

//
//  easing parameters
//
export const EASE_LINEAR = 'Linear';
export const EASE_SMOOTH = 'InOutSmoother';
export const EASE_QUAD = 'Quad';
export const EASE_CUBIC = 'Cubic';
export const EASE_QUART = 'Quart';
export const EASE_QUINT = 'Quint';
export const EASE_EXPO = 'Expo';
export const EASE_CIRC = 'Circ';
export const EASE_ELASTIC = 'Elastic';
export const EASE_BOUNCE = 'Bounce';
export const EASE_BACK = 'Back';

export const EASE_IN = 'In';
export const EASE_OUT = 'Out';
export const EASE_IN_OUT = 'InOut';
