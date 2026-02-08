import { SIZE_DEFAULT, RENDER_MODES } from './wrapper.js';
import { LOG_LEVELS } from './logging.js';

//
//	Default options for setup
//
export const DEFAULT_OPTIONS = {
  sketchElementId: 'sketch-canvas',
  renderMode: RENDER_MODES.P2D,
  title: 'untitled sketch',
  addInfoToTitle: false,
  showSaveSketchButton: false,
  saveSettingsWithSketch: false,
  acceptDroppedSettings: false,
  acceptDroppedFiles: false,
  useParameterPanel: true,
  hideParameterPanelOnStart: false,
  showCanvasSizeOptions: false,
  additionalCanvasSizes: [],
  captureFrames: false,
  canvasSize: SIZE_DEFAULT,
  seedString: '',
  debounceDelay: 100,
  loggingEnabled: true,
  logLevel: LOG_LEVELS.INFO,
  showCaptureOptions: false,
  showFPS: false,
  shiftCanvasForWebGL: true,
};

export const DEFAULT_CAPTURE_OPTIONS = {
  format: 'png',
  framerate: 30,
  bitrate: 5000,
  quality: 0.95,
  width: null,
  height: null,
  duration: 100,
  autoSaveDuration: null,
  fixedDuration: false,
  refreshBeforeCapture: true,
  recordButtonOnMainTab: true,
};
