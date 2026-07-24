import { libraryState } from '../core/state';
import * as constants from '../config/constants';
import { saveSettings } from './saveSketch';

//
//  set up general capturing options
//
export function setUpCapture () {
  libraryState.currentlyCapturing = false;

  if (typeof P5Capture !== 'undefined') {
    P5Capture.setDefaultOptions(libraryState.options.captureOptions);
    hideP5CaptureControls();
  }
}

export function hideP5CaptureControls () {
  const container = document.querySelector('.p5c-container');
  if (container) {
    container.style.display = 'none';
  }
}

//
//  called when the capture is started
//
export function initCapture () {
  if (typeof P5Capture === 'undefined') {
    console.warn('TokoWrapper: P5Capture is not loaded. Capture functionality is unavailable.');
    return;
  }
  libraryState.capturer = P5Capture.getInstance();

  //  just in case the duration was not set properly
  if (libraryState.options.captureOptions.fixedDuration) {
    if (
      libraryState.options.captureOptions.duration === null ||
      libraryState.options.captureOptions.duration === undefined
    ) {
      libraryState.options.captureOptions.duration = constants.DEFAULT_CAPTURE_DURATION;
    }
  }

  //  refresh the sketch before capture
  if (libraryState.options.captureOptions.refreshBeforeCapture) {
    if (typeof window.refresh === 'function') {
      window.refresh();
    } else if (typeof window.tokoWrapper === 'function' && window.tokoWrapper()) {
      window.tokoWrapper().updateParameters();
    }
  }
}

export function updateCaptureDuration (e) {
  libraryState.options.captureOptions.duration = e.value;
  updateRecordButtonLabel();
}

export function updateCaptureFormat (e) {
  libraryState.options.captureOptions.format = e.value;
}

export function updateCaptureFrameRate (e) {
  libraryState.options.captureOptions.framerate = e.value;
}

export function updateCaptureRefreshBefore (e) {
  libraryState.options.captureOptions.refreshBeforeCapture = e.value;
  updateRecordButtonLabel(libraryState.options.captureOptions.refreshBeforeCapture);
}

export function updateRecordButtonLabel () {
  let buttonLabel;

  if (libraryState.options.captureOptions.refreshBeforeCapture) {
    buttonLabel = constants.REFRESH_RECORD_BUTTON_LABEL;
  } else {
    buttonLabel = constants.RECORD_BUTTON_LABEL;
  }

  if (libraryState.options.captureOptions.fixedDuration) {
    buttonLabel += ` ${libraryState.options.captureOptions.duration} ${constants.RECORD_BUTTON_LABEL_FRAMES}`;
  }

  if (libraryState.options.saveSettingsWithSketch) {
    buttonLabel += constants.RECORD_BUTTON_LABEL_SETTINGS;
  }

  libraryState.options.captureOptions.startCaptureButton.title = buttonLabel;
}

export function updateCaptureFixedDuration (e) {
  libraryState.options.captureOptions.fixedDuration = e.value;
  if (libraryState.options.captureOptions.fixedDuration) {
    libraryState.options.captureOptions.captureDurationControl.hidden = false;
    // Use current duration if previousDuration is undefined
    if (libraryState.options.captureOptions.previousDuration !== undefined) {
      libraryState.options.captureOptions.duration = libraryState.options.captureOptions.previousDuration;
    }
  } else {
    libraryState.options.captureOptions.captureDurationControl.hidden = true;
    libraryState.options.captureOptions.previousDuration = libraryState.options.captureOptions.duration;
    libraryState.options.captureOptions.duration = null;
  }
  updateRecordButtonLabel();
}

export function clickStartCapture () {
  libraryState.options.captureOptions.stopCaptureButton.hidden = false;
  libraryState.options.captureOptions.startCaptureButton.hidden = true;
  startCapture();
}

export function clickStopCapture () {
  stopCapture();
}

export function startCapture () {
  if (!libraryState.currentlyCapturing && libraryState.options.showCaptureOptions) {
    initCapture();
    libraryState.currentlyCapturing = true;
    libraryState.capturer.start(libraryState.options.captureOptions);
  }
}

export function stopCapture () {
  if (libraryState.currentlyCapturing && libraryState.options.showCaptureOptions) {
    libraryState.capturer.stop();
  }
}

//
//  called by p5.capture just ahead of downlaoding the video
//
export function resetCapture (videoFilename) {
  //  remove the extension from the filename (matches the last dot and all following non-slash/non-dot characters)
  let filename = typeof videoFilename === 'string' ? videoFilename.replace(/\.[^/.]+$/, '') : videoFilename;

  //  save the settings
  if (libraryState.options.saveSettingsWithSketch) {
    saveSettings(filename);
  }

  // reset the capture buttons
  libraryState.options.captureOptions.stopCaptureButton.hidden = true;
  libraryState.options.captureOptions.startCaptureButton.hidden = false;

  // reset the state
  libraryState.currentlyCapturing = false;
}

// eslint-disable-next-line no-unused-vars
export function getFilenameForCapture (_date) {
  let filename = libraryState.toko.generateFilename('none', 'captured');
  return filename;
}
