import Toko from '../core/main';

// Based on
// https://gist.github.com/gre/1650294
// https://github.com/AndrewRayCode/easing-utils

// No easing, no acceleration
Toko.prototype.easeLinear = t => {
  return t;
};

// Slight acceleration from zero to full speed
Toko.prototype.easeInSine = t => {
  return -1 * Math.cos(t * (Math.PI / 2)) + 1;
};

// Slight deceleration at the end
Toko.prototype.easeOutSine = t => {
  return Math.sin(t * (Math.PI / 2));
};

// Slight acceleration at beginning and slight deceleration at end
Toko.prototype.easeInOutSine = t => {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
};

// Accelerating from zero velocity
Toko.prototype.easeInQuad = t => {
  return t * t;
};

// Decelerating to zero velocity
Toko.prototype.easeOutQuad = t => {
  return t * (2 - t);
};

// Acceleration until halfway, then deceleration
Toko.prototype.easeInOutQuad = t => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// Accelerating from zero velocity
Toko.prototype.easeInCubic = t => {
  return t * t * t;
};

// Decelerating to zero velocity
Toko.prototype.easeOutCubic = t => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

// Acceleration until halfway, then deceleration
Toko.prototype.easeInOutCubic = t => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

// Accelerating from zero velocity
Toko.prototype.easeInQuart = t => {
  return t * t * t * t;
};

// Decelerating to zero velocity
Toko.prototype.easeOutQuart = t => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

// Acceleration until halfway, then deceleration
Toko.prototype.easeInOutQuart = t => {
  const t1 = t - 1;
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
};

// Accelerating from zero velocity
Toko.prototype.easeInQuint = t => {
  return t * t * t * t * t;
};

// Decelerating to zero velocity
Toko.prototype.easeOutQuint = t => {
  const t1 = t - 1;
  return 1 + t1 * t1 * t1 * t1 * t1;
};

// Acceleration until halfway, then deceleration
Toko.prototype.easeInOutQuint = t => {
  const t1 = t - 1;
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
};

// Accelerate exponentially until finish
Toko.prototype.easeInExpo = t => {
  if (t === 0) {
    return 0;
  }

  return Math.pow(2, 10 * (t - 1));
};

// Initial exponential acceleration slowing to stop
Toko.prototype.easeOutExpo = t => {
  if (t === 1) {
    return 1;
  }

  return -Math.pow(2, -10 * t) + 1;
};

// Exponential acceleration and deceleration
Toko.prototype.easeInOutExpo = t => {
  if (t === 0 || t === 1) {
    return t;
  }

  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 1;

  if (scaledTime < 1) {
    return 0.5 * Math.pow(2, 10 * scaledTime1);
  }

  return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
};

// Increasing velocity until stop
Toko.prototype.easeInCirc = t => {
  const scaledTime = t / 1;
  return -1 * (Math.sqrt(1 - scaledTime * t) - 1);
};

// Start fast, decreasing velocity until stop
Toko.prototype.easeOutCirc = t => {
  const t1 = t - 1;
  return Math.sqrt(1 - t1 * t1);
};

// Fast increase in velocity, fast decrease in velocity
Toko.prototype.easeInOutCirc = t => {
  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 2;

  if (scaledTime < 1) {
    return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
  }

  return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
};

// Slow movement backwards then fast snap to finish
Toko.prototype.easeInBack = (t, magnitude = 1.70158) => {
  return t * t * ((magnitude + 1) * t - magnitude);
};

// Fast snap to backwards point then slow resolve to finish
Toko.prototype.easeOutBack = (t, magnitude = 1.70158) => {
  const scaledTime = t / 1 - 1;

  return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
};

// Slow movement backwards, fast snap to past finish, slow resolve to finish
Toko.prototype.easeInOutBack = (t, magnitude = 1.70158) => {
  const scaledTime = t * 2;
  const scaledTime2 = scaledTime - 2;

  const s = magnitude * 1.525;

  if (scaledTime < 1) {
    return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
  }

  return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
};
// Bounces slowly then quickly to finish
Toko.prototype.easeInElastic = (t, magnitude = 0.7) => {
  if (t === 0 || t === 1) {
    return t;
  }

  const scaledTime = t / 1;
  const scaledTime1 = scaledTime - 1;

  const p = 1 - magnitude;
  const s = (p / (2 * Math.PI)) * Math.asin(1);

  return -(Math.pow(2, 10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
};

// Fast acceleration, bounces to zero
Toko.prototype.easeOutElastic = (t, magnitude = 0.7) => {
  if (t === 0 || t === 1) {
    return t;
  }

  const p = 1 - magnitude;
  const scaledTime = t * 2;

  const s = (p / (2 * Math.PI)) * Math.asin(1);
  return Math.pow(2, -10 * scaledTime) * Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) + 1;
};

// Slow start and end, two bounces sandwich a fast motion
Toko.prototype.easeInOutElastic = (t, magnitude = 0.65) => {
  if (t === 0 || t === 1) {
    return t;
  }

  const p = 1 - magnitude;
  const scaledTime = t * 2;
  const scaledTime1 = scaledTime - 1;

  const s = (p / (2 * Math.PI)) * Math.asin(1);

  if (scaledTime < 1) {
    return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p));
  }

  return Math.pow(2, -10 * scaledTime1) * Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) * 0.5 + 1;
};

// Bounce to completion
Toko.prototype.easeOutBounce = t => {
  const scaledTime = t / 1;

  if (scaledTime < 1 / 2.75) {
    return 7.5625 * scaledTime * scaledTime;
  } else if (scaledTime < 2 / 2.75) {
    const scaledTime2 = scaledTime - 1.5 / 2.75;
    return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
  } else if (scaledTime < 2.5 / 2.75) {
    const scaledTime2 = scaledTime - 2.25 / 2.75;
    return 7.5625 * scaledTime2 * scaledTime2 + 0.9375;
  } else {
    const scaledTime2 = scaledTime - 2.625 / 2.75;
    return 7.5625 * scaledTime2 * scaledTime2 + 0.984375;
  }
};

// Bounce increasing in velocity until completion
Toko.prototype.easeInBounce = t => {
  return 1 - Toko.prototype.easeOutBounce(1 - t);
};

// Bounce in and bounce out
Toko.prototype.easeInOutBounce = t => {
  if (t < 0.5) {
    return Toko.prototype.easeInBounce(t * 2) * 0.5;
  }

  return Toko.prototype.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
};

// Extra smooth - Ken Perlin smoothstep function
Toko.prototype.easeInOutSmoother = t => {
  var ts = t * t,
    tc = ts * t;
  return 6 * tc * ts - 15 * ts * ts + 10 * tc;
};

//
//  add easing selector
//
Toko.prototype.addEasingSelector = function (paneRef, pObject, incomingOptions) {
  //
  //  set default options
  //
  let o = {
    // reserved for future defaults
  };
  //
  // merge with default options
  //
  o = Object.assign({}, o, incomingOptions);

  o.easeTypeControl = paneRef
    .addBinding(pObject, o.typeKey, {
      label: 'easing type',
      options: {
        Linear: this.EASE_LINEAR,
        Smooth: this.EASE_SMOOTH,
        Quad: this.EASE_QUAD,
        Cubic: this.EASE_CUBIC,
        Quart: this.EASE_QUART,
        Quint: this.EASE_QUINT,
        Expo: this.EASE_EXPO,
        Circ: this.EASE_CIRC,
        Elastic: this.EASE_ELASTIC,
        Bounce: this.EASE_BOUNCE,
        Back: this.EASE_BACK,
      },
    })
    .on('change', ev => {
      if (ev.value === this.EASE_LINEAR || ev.value === this.EASE_SMOOTH) {
        o.easeDirectionControl.hidden = true;
      } else {
        o.easeDirectionControl.hidden = false;
      }
    });

  o.easeDirectionControl = paneRef.addBinding(pObject, o.directionKey, {
    label: 'direction',
    options: {
      In: this.EASE_IN,
      Out: this.EASE_OUT,
      InOut: this.EASE_IN_OUT,
    },
  });
};

//
//  get the easing equation based on the type and direction
//
Toko.prototype.getEasingFunction = function (easeType = this.EASE_QUAD, easeDirection = this.EASE_IN_OUT) {
  let easeFunction = 'ease';
  //
  //  add the direction
  //
  if (easeType !== this.EASE_LINEAR && easeType !== this.EASE_SMOOTH) {
    easeFunction += easeDirection;
  }
  //
  //  add the type
  //
  easeFunction += easeType;

  let f = toko[easeFunction];

  if (typeof f === 'function') {
    return f;
  } else {
    console.log(`ERROR: ${easeFunction} is not a function.`);
    return null;
  }
};
