import Toko from './main';

//
//  additions to TweakPane
//

//
// create a list that is convenient to use by Tweakpane
//
Toko.prototype.formatForTweakpane = function (inList, propertyName) {
  let o = {};

  if (typeof propertyName == 'string') {
    inList.forEach(function (m) {
      o[m[propertyName]] = m[propertyName];
    });
  } else {
    inList.forEach(function (m) {
      o[m] = m;
    });
  }

  return o;
}

//
//  add next, previous and random buttons to the pane to navigate a specific list
//
Toko.prototype.addPaneNavButtons = function (paneRef, pObject, paletteKey, collectionKey, justPrimary = false, sorted = false, index = -1) {

  let o = {
    view: 'buttongrid',
    size: [3, 1],
    cells: (x, y) => ({
      title: [
        ['← prev', 'rnd', 'next →'],
      ][y][x],
    }),
    label: ' ',
  }

  if (index != -1) {
    o.index = index;
  }

  paneRef.addBlade( o
  ).on('click', (ev) => {
    let paletteList = toko.getPaletteSelection(pObject[collectionKey], justPrimary, sorted);
    switch (ev.index[0]) {
      case 0:
        pObject[paletteKey] = this.findPreviousInList(pObject[paletteKey],paletteList);
        break;
      case 1:
        pObject[paletteKey] = this.findRandomInList(pObject[paletteKey],paletteList);
        break;
      case 2:
        pObject[paletteKey] = this.findNextInList(pObject[paletteKey],paletteList);
        break;
      default:
        console.log('a non-existing button was pressed:',ev.index[0]);
        break;
    }
    this.basePane.refresh();
  });
}

//
//  find the next item in a list formatted for TweakPane
//
Toko.prototype.findNextInList = function (item, list) {
  let keys = Object.keys(list);
  let i = keys.indexOf(item);
  let n;
  if (i < keys.length-1) {
    n = i + 1;
  } else {
    n = 0;
  }
  let newItem = keys[n];
  return list[newItem];
}

//
//  find the previous item in a list formatted for TweakPane
//
Toko.prototype.findPreviousInList = function (item, list) {
  let keys = Object.keys(list);
  let i = keys.indexOf(item);
  let n;
  if (i > 0) {
    n = i - 1;
  } else {
    n = keys.length - 1;
  }
  let newItem = keys[n];
  return list[newItem];
}

//
//  select a random item in a list formatted for TweakPane
//
Toko.prototype.findRandomInList = function (item, list) {
  let keys = Object.keys(list);
  let newItem;
  do {
    newItem = keys[Math.floor(Math.random()*keys.length)];
  } while (newItem == item);
  return list[newItem];
}

//
//  turn the long Tweakpane state into a more compact set of values
//
Toko.prototype._stateToPreset = function(stateObject) {
  let presetObject = {};

  function traverse(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // check if the current property is 'binding' and an object
        if (key === 'binding' && typeof obj[key] === 'object') {
          // if it is, extract the key value combination and add it to the presets
          let o = {}
          o[obj[key].key] = obj[key].value;
          presetObject = {...presetObject, ...o};
        } else if (typeof obj[key] === 'object') {
          // if it is not binding but is and object, dig deeper
          traverse(obj[key]);
        }
      }
    }
  }

  // start traversing the state object
  traverse(stateObject);

  return presetObject;
}

//
//  use the compact preset to create a new Tweakpane state
//
Toko.prototype._presetToState = function(presetObject) {
  let stateObject = this.basePane.exportState();

  function traverse(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // check if the current property is 'binding' and an object
        if (key === 'binding' && typeof obj[key] === 'object') {
          // update the 'binding' object with values from newPreset
          if (presetObject.hasOwnProperty(obj[key].key)) {
            obj[key].value = presetObject[obj[key].key];
          }
        } else if (typeof obj[key] === 'object') {
          // if the property is an object, recursively traverse it
          traverse(obj[key]);
        }
      }
    }
  }

  // start traversing the current state to add the preset values
  traverse(stateObject);

  return stateObject;
}

//
//  add a double drop down to select a color palette
//
Toko.prototype.addPaletteSelector = function(paneRef, pObject, incomingOptions) {
  //
  //  set default options
  //
  let o = {
    selectorIndex: 1,
    justPrimary: false,
    sorted: false,
    addNavButtons: true,
  };

  //
  // merge with default options
  //
  o = Object.assign({}, incomingOptions, o);
  o.paneRef = paneRef;
  o.pObject = pObject;

  o.colorPalettes = Toko.prototype.getPaletteSelection(o.pObject[o.collectionKey], o.justPrimary, o.sorted);
  o.collectionsList = Toko.prototype.formatForTweakpane(o.pObject[o.collectionsList]);

  o.collectionInput = o.paneRef.addBinding(o.pObject, o.collectionKey, {
    index: o.selectorIndex,
    options: o.collectionsList
  }).on('change', (ev) => {
    o.colorPalettes = Toko.prototype.getPaletteSelection(pObject[o.collectionKey], o.justPrimary, o.sorted);
    o.pObject[o.paletteKey] = Object.values(o.colorPalettes)[0];
    o.scaleInput.dispose();
    o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
      index:o.selectorIndex,
      options:o.colorPalettes
    });
  });

  o.scaleInput = paneRef.addBinding(o.pObject, o.paletteKey, {
    options:o.colorPalettes,
    index: o.selectorIndex
  });

  this.paletteSelectorData = o;

  //
  //  add nav buttons below the dropdowns
  //
  if (o.addNavButtons) {
    this.addPaneNavButtons(o.paneRef, o.pObject, o.paletteKey, o.collectionKey, o.justPrimary, o.sorted, o.selectorIndex+1);
  }

}

//
//  update the color palette selector
//
Toko.prototype.updatePaletteSelector = function(receivedCollection, receivedPalette) {
  console.log('updatePaletteSelector');
  let o;
  o = this.paletteSelectorData;
  o.colorPalettes = Toko.prototype.getPaletteSelection(receivedCollection, o.justPrimary, o.sorted);
  o.scaleInput.dispose();
  o.pObject[o.paletteKey] = receivedPalette;
  console.log(o.selectorIndex+1);
  o.scaleInput = o.paneRef.addBinding(o.pObject, o.paletteKey, {
    index:o.selectorIndex+1,
    options:o.colorPalettes
  });
  //
  //  call main refresh function to update everything
  //
  refresh();
}