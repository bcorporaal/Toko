import { CAPTURE_FORMATS } from '../core/constants';
import Toko from '../core/main';

Toko.prototype.initCapture = function () {
  let o = this.getCaptureOptions(this.captureOptions.format);
  this.capturer = new CCapture(o);
}

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
}

Toko.prototype.clickStartCapture = function() {
  this.stopCaptureButton.hidden = false;
  this.startCaptureButton.hidden = true;
  this.startCapture();
  redraw(); // BUG: this should not be needed but for some reason it halts without it
}

Toko.prototype.clickStopCapture = function() {
  this.stopCaptureButton.hidden = true;
  this.startCaptureButton.hidden = false;
  this.stopCapture();
}

Toko.prototype.startCapture = function () {
  if (!this._captureStarted && this.options.captureFrames) {
    this.initCapture();
    window.captureStarted?.();
    this._captureStarted = true;
    this.capturer.start();
  }
}

Toko.prototype.stopCapture = function () {
  if (this.options.captureFrames && this._captureStarted) {
    this.capturer.stop();
    window.captureStopped?.();
    this.capturer.save();
    this._captureStarted = false;
  }
}

Toko.prototype.captureFrame = function() {
  if (this.options.captureFrames) {
    // capture a frame
    this.capturer.capture(document.getElementById('defaultCanvas0'));
  } else {
    this.stopCapture()
  }
}

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
  }
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
}





