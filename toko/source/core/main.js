import * as constants from './constants'; 
import * as words from './words'; 

class Toko {
  constructor() {

    for (const k in constants) {
      this[k] = constants[k];
    }

    for (const k in words) {
      this[k] = words[k];
    }

    console.log(this.VERSION);

  }
}

export default Toko;