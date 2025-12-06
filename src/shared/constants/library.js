// Library-specific constants

export const LIBRARY_NAME = 'Toko';

export const COLOR_MODE_LIST = ['rgb', 'lrgb', 'lab', 'hsl', 'lch', 'oklab', 'oklch'];

export var DEFAULT_COLOR_OPTIONS = {
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
  easingParameters: [0.25, 0.25, 0.75, 0.75],
  useEasing: false,
};

export const BLEND_MODE = {
  BLEND: 'source-over', //p5.BLEND,
  MULTIPLY: 'multiply', //p5.MULTIPLY,
  SCREEN: 'screen', //p5.SCREEN,
  OVERLAY: 'overlay', //p5.OVERLAY,
  DARKEST: 'darken', //p5.DARKEST,
  LIGHTEST: 'lighten', //p5.LIGHTEST,
  DIFFERENCE: 'difference', //p5.DIFFERENCE,
  EXCLUSION: 'exclusion', //p5.EXCLUSION,
};
