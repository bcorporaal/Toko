import { setUpCanvas } from '../canvas/canvas.js';
import { setUpTweakpane } from '../ui/tweakpane.js';
import { setUpReceiveFile } from '../media/receiveFile.js';
import { setUpCapture } from '../media/capture.js';
import { setUpFPS } from '../ui/fps.js';

/**
 * Set up all wrapper components
 * Initializes canvas, Tweakpane, capture tools, file receiving
 * @example
 * // Set up all wrapper components
 * setUpWrapper();
 */
export function setUpWrapper () {
  setUpCanvas();
  setUpTweakpane();
  setUpCapture();
  setUpReceiveFile();
  setUpFPS();
}
