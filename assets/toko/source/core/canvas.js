import Toko from './main';

//
//  resize canvas to a new size while fitting within the window
//
Toko.prototype.setCanvasSize = function(inSize) {
  let margin = 80;
  let zoomFactor = 1;
  let displayFactor = inSize.pixelDensity/2;
  let newWidthString, newHeightString;

  if (!inSize.fullWindow) {
    zoomFactor = Math.min(1,(windowWidth - margin)/inSize.width*displayFactor);
    zoomFactor = Math.min(zoomFactor,(windowHeight -margin)/inSize.height*displayFactor);

    newWidthString = Math.floor(inSize.width * zoomFactor / displayFactor) + 'px';
    newHeightString = Math.floor(inSize.height * zoomFactor / displayFactor) + 'px';
  } else {
    inSize.width = windowWidth;
    inSize.height = windowHeight;

    newWidthString = '100vw';
    newHeightString = '100vh';
  }

  resizeCanvas(inSize.width*displayFactor, inSize.height*displayFactor, true);

  p5Canvas.canvas.style.width = newWidthString;
  p5Canvas.canvas.style.height = newHeightString;
}

Toko.prototype.addCanvasSize = function(name,width,height,pixelDensity = 1, fullWindow = false) {
  let o = {
    name: name,
    width: width,
    height: height,
    pixelDensity: pixelDensity,
    fullWindow: fullWindow
  }

  this.SIZES.push(o);
  this.SIZES_LIST[name] = name;
  this.basePane.refresh();
}