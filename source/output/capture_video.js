import Toko from '../core/main';

Toko.prototype.initCapture = function () {
  this.capturer = P5Capture.getInstance();
  if (this.captureOptions.duration === null || this.captureOptions.duration === undefined) {
    this.captureOptions.captureFixedNrFrames = false;
  } else {
    this.captureOptions.captureFixedNrFrames = true;
  }
};

Toko.prototype.createCapturePanel = function (tabID) {
  var t = this.basePaneTab.pages[tabID];

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
      console.log(this.captureOptions.captureFixedNrFrames);
      if (this.captureOptions.captureFixedNrFrames) {
        this.captureOptions.duration = e.value;
      }
      this.updateDurationEstimate();
    });

  this.captureFrameDurationDisplay = t.addBinding(this.captureOptions, 'estimate', {
    readonly: true,
    label: 'time (sec)',
  });

  if (this.captureOptions.duration === null || this.captureOptions.duration === undefined) {
    this.captureFrameControl.hidden = true;
    this.captureFrameDurationDisplay.hidden = true;
  }

  t.addBlade({ view: 'separator' });

  this.startCaptureButton = t
    .addButton({
      title: '🔴 Record',
    })
    .on('click', value => {
      this.clickStartCapture();
    });

  this.stopCaptureButton = t
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
    this.captureFrameDurationDisplay.hidden = false;
    this.updateDurationEstimate();
  } else {
    this.captureFrameControl.hidden = true;
    this.captureOptions.duration = null;
    this.captureFrameDurationDisplay.hidden = true;
  }
};

Toko.prototype.updateDurationEstimate = function () {
  let e = Math.round((100 * parseInt(this.captureOptions.duration)) / parseInt(this.captureOptions.framerate)) / 100;
  this.captureOptions.estimate = e;
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
    console.log(this.captureOptions);
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

Toko.prototype.resetCapture = function () {
  this.stopCaptureButton.hidden = true;
  this.startCaptureButton.hidden = false;
  this._captureStarted = false;
};
