import Toko from '../core/main';

Toko.prototype.initCapture = function () {
  this.capturer = P5Capture.getInstance();
  //  just in case the duration was not set properly
  if (this.captureOptions.duration === null || this.captureOptions.duration === undefined) {
    this.captureOptions.captureFixedNrFrames = false;
  } else {
    this.captureOptions.captureFixedNrFrames = true;
  }
  //  refresh the sketch before capture
  if (this.captureOptions.refreshBeforeCapture) {
    refresh();
  }
};

Toko.prototype.createCapturePanel = function (tabID) {
  //  tab for options
  let t = this.basePaneTab.pages[tabID];
  //  tab for buttons depending on the options
  let tb;
  if (this.captureOptions.recordButtonOnMainTab) {
    tb = this.basePaneTab.pages[0];
    tb.addBlade({ view: 'separator' });
  } else {
    tb = t;
  }

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

  t.addBinding(this.captureOptions, 'refreshBeforeCapture', {
    label: 'refresh first',
  }).on('change', value => {
    this.updateRecordButtonLabel(value);
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
    this.captureOptions.duration = 0;
  }
  if (this.captureOptions.captureFixedNrFrames) {
    this.captureFrameControl.hidden = false;
  }

  t.addBlade({ view: 'separator' });

  this.startCaptureButton = tb
    .addButton({
      title: this.captureOptions.refreshBeforeCapture ? this.REFRESH_RECORD_BUTTON_LABEL : this.RECORD_BUTTON_LABEL,
    })
    .on('click', value => {
      this.clickStartCapture();
    });

  this.stopCaptureButton = tb
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

Toko.prototype.updateRecordButtonLabel = function (e) {
  if (e.value) {
    this.startCaptureButton.title = this.REFRESH_RECORD_BUTTON_LABEL;
  } else {
    this.startCaptureButton.title = this.RECORD_BUTTON_LABEL;
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

//
//  called by p5.capture just ahead of downlaoding the video
//
Toko.prototype.resetCapture = function (videoFilename) {
  //  remove the extension
  let filename = typeof videoFilename === 'string' ? videoFilename.replace(/\.[^/.]+$/, '') : videoFilename;
  //  save the settings
  this.saveSettings(filename);
  //  reset the capture buttons
  this.stopCaptureButton.hidden = true;
  this.startCaptureButton.hidden = false;
  this._captureStarted = false;
};

Toko.prototype.filenameCapture = function (date) {
  return this.generateFilename('none', 'captured');
};
