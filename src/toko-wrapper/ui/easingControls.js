import {
  EASE_LINEAR,
  EASE_SMOOTH,
  EASE_QUAD,
  EASE_CUBIC,
  EASE_QUART,
  EASE_QUINT,
  EASE_EXPO,
  EASE_CIRC,
  EASE_ELASTIC,
  EASE_BOUNCE,
  EASE_BACK,
  EASE_IN,
  EASE_OUT,
  EASE_IN_OUT,
} from '../../shared/constants/common.js';

//
//  add easing selector
//
export function addEasingSelector (paneRef, pObject, incomingOptions) {
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
        Linear: EASE_LINEAR,
        Smooth: EASE_SMOOTH,
        Quad: EASE_QUAD,
        Cubic: EASE_CUBIC,
        Quart: EASE_QUART,
        Quint: EASE_QUINT,
        Expo: EASE_EXPO,
        Circ: EASE_CIRC,
        Elastic: EASE_ELASTIC,
        Bounce: EASE_BOUNCE,
        Back: EASE_BACK,
      },
    })
    .on('change', ev => {
      if (ev.value === EASE_LINEAR || ev.value === EASE_SMOOTH) {
        o.easeDirectionControl.hidden = true;
      } else {
        o.easeDirectionControl.hidden = false;
      }
    });

  o.easeDirectionControl = paneRef.addBinding(pObject, o.directionKey, {
    label: 'direction',
    options: {
      In: EASE_IN,
      Out: EASE_OUT,
      InOut: EASE_IN_OUT,
    },
  });
}
