import Toko from '../core/main';

Toko.prototype.saveSketch = function () {
  //
  // detect if the sketch is in canvas or svg
  //
  var sketchElement = document.getElementById(this.options.sketchElementId).firstChild;
  var isCanvas = sketchElement instanceof HTMLCanvasElement;
  if (sketchElement.firstChild != null) {
    var isSVG = (sketchElement.firstChild.nodeName == "svg");
  }

  if (isCanvas) {
    //
    //  save canvas as png
    //
    var filename = this.generateFilename('png');
    saveCanvas(filename, 'png');
    return filename;
  } else if (isSVG) {
    //
    // add attributes to ensure proper preview of the SVG file in the Finder
    //
    var svgTemp = document.getElementById('sketch-canvas').firstChild.firstChild.firstChild;
    svgTemp.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svgTemp.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    var filename = this.generateFilename('svg');
    var svgString = document.getElementById(this.options.sketchElementId).firstChild.innerHTML;

    var blob = new Blob([svgString], {'type': 'image/svg+xml'})
    var url = window.URL.createObjectURL(blob);

    //
    // create a hidden url with the image and click it
    //
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    return filename;

  } else {
    console.log("Toko - saveSketch: unkown type");
    return;
  }
  
}

//
//  save both the sketch image and the settings
//
Toko.prototype.saveSketchAndSettings = function () {
  let filename = this.saveSketch();
  //
  //  strip the extension of the filename so we can reuse it.
  //
  filename = filename.split('.').slice(0, -1).join('.');
  this.saveSettings(filename);
}