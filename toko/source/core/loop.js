import Toko from './main';

Toko.prototype.startDraw = function() {
  //
  //	will be called at the start of the draw loop
  //
}

Toko.prototype.endDraw = function() {
  //
  //	will be called at the end of the draw loop
  //
  //--------------------------------------------
  //
  //	track fps with a simple filter to dampen any short spikes
  //
  if (this.options.logFPS) {
      this._frameTime += (deltaTime - this.FRAME_TIME) / this.FPS_FILTER_STRENGTH;
      this.pt.fps = this.pt.graph = Math.round(1000/this.FRAME_TIME);
  }
  //
  //  capture a frame if we're actively capturing
  //
  if (this.options.captureFrames && this._captureStarted) {
    this.captureFrame();
  }
}