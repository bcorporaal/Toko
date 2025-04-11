import * as constants from './constants';
import * as words from './words';

class Toko {
  constructor () {
    for (const k in constants) {
      this[k] = constants[k];
    }

    for (const k in words) {
      this[k] = words[k];
    }

    //
    //  pre-seed the random function
    //
    this._rng = new Toko.RNG();

    //
    //  set the default options for P5Capture.
    //  this needs to happen before the p5 setup.
    //
    P5Capture.setDefaultOptions(this.DEFAULT_CAPTURE_OPTIONS);
  }
}

export default Toko;
