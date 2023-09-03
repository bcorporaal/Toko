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
export const VERSION = 'Toko v0.6.0'

//
//  Set of standard sizes for the canvas and exports
//
export const SIZE_DEFAULT = {
  name: 'default',
  width: 800,
  height: 800,
  pixelDensity: 2,
}

export const SIZE_FULL = {
  name: 'full_window',
  width: 100,
  height: 100,
  pixelDensity: 2,
  fullWindow: true,
}

export const SIZE_SQUARE_XL = {
  name: 'square_XL',
  width: 1600,
  height: 1600,
  pixelDensity: 2,
}

export const SIZE_1080P = {
  name: '1080p',
  width: 1920,
  height: 1080,
  pixelDensity: 2,
}

export const SIZE_720P = {
  name: '720p',
  width: 1280,
  height: 720,
  pixelDensity: 1,
}

export const SIZE_IPHONE_11_WALLPAPER = {
  name: 'iphone_11',
  width: 1436,
  height: 3113,
  pixelDensity: 1,
}

export const SIZE_MACBOOK_PRO_WALLPAPER = {
  name: 'macbook_pro',
  width: 2880,
  height: 1800,
  pixelDensity: 1,
}

//
//  List used for the dropdown in the advanced tab
//
export var SIZES_LIST = {
  default: 'default',
  square_HD: 'square_XL',
  iphone_11: 'iphone_11',
  SD_720p: '720p',
  HD_1080p: '1080p',
  macbook_pro: 'macbook_pro',
  full_window: 'full_window',
}

export var SIZES = [
  SIZE_DEFAULT,
  SIZE_FULL,
  SIZE_SQUARE_XL,
  SIZE_720P,
  SIZE_1080P,
  SIZE_IPHONE_11_WALLPAPER,
  SIZE_MACBOOK_PRO_WALLPAPER,
]

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
export const CAPTURE_FORMATS = {
  PNG: 'png',
  JPG: 'jpg',
  GIF: 'gif'
}

//
//  Parameters to calculate frames per second
//
export const FPS_FILTER_STRENGTH = 40;
export const FRAME_TIME = 16;


