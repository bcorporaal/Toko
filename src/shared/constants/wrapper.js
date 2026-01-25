// Wrapper-specific constants

export const LIBRARY_NAME = 'TokoWrapper';

//
//  Div container where the tweakpane is placed
//
export const TWEAKPANE_CONTAINER = 'tweakpane-container';
export const TWEAKPANE_HIDDEN_CLASS = 'tweakpane-hidden';

//
//  Set of standard sizes for the canvas and exports
//
export const SIZE_DEFAULT = {
  name: 'default',
  width: 800,
  height: 800,
  pixelDensity: 2,
};

export const SIZE_INSTAGRAM_PORTRAIT = {
  name: 'insta_portrait',
  width: 1080,
  height: 1350,
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
export let SIZES_LIST = {
  default: 'default',
  square_HD: 'square_XL',
  insta_portrait: 'insta_portrait',
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

export const SIZES = [
  SIZE_DEFAULT,
  SIZE_FULL,
  SIZE_INSTAGRAM_PORTRAIT,
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
export const TABS_CAPTURE = 'Capture';

export const TAB_ID_PARAMETERS = 0;
export const TAB_ID_ADVANCED = 1;
export const TAB_ID_CAPTURE = 2;

//
//  Render modes
//
export const RENDER_MODES = {
  P2D: 'p2d',
  WEBGL: 'webgl',
  SVG: 'svg',
  WEBGPU: 'webgpu',
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

export const DEFAULT_CAPTURE_DURATION = 100; // number of frames captured when undefined but recording for fixed number of frames

export const SAVE_SKETCH_BUTTON_LABEL = '💾 Save sketch';
export const SAVE_SKETCH_AND_SETTINGS_BUTTON_LABEL = '💾 Save sketch & settings';
export const RECORD_BUTTON_LABEL = '🔴 Record';
export const REFRESH_RECORD_BUTTON_LABEL = '🔴 Refresh & record';
export const RECORD_BUTTON_LABEL_FRAMES = 'frames';
export const RECORD_BUTTON_LABEL_SETTINGS = ' & settings';
export const STOP_BUTTON_LABEL = '⬛️ Stop recording';
