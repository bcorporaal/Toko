import Toko from './main';

//
//  resize canvas to a new size while fitting within the window
//
Toko.prototype.setCanvasSize = function (inSize) {
  let margin = 80;
  let zoomFactor = 1;
  const displayFactor = inSize.pixelDensity / 2;
  let newWidthString = '',
    newHeightString = '';

  if (typeof windowWidth === 'undefined' || typeof windowHeight === 'undefined') {
    console.error('windowWidth or windowHeight is not defined');
    return;
  }

  if (!inSize.fullWindow) {
    zoomFactor = Math.min(1, ((windowWidth - margin) / inSize.width) * displayFactor);
    zoomFactor = Math.min(zoomFactor, ((windowHeight - margin) / inSize.height) * displayFactor);

    newWidthString = Math.floor((inSize.width * zoomFactor) / displayFactor) + 'px';
    newHeightString = Math.floor((inSize.height * zoomFactor) / displayFactor) + 'px';
  } else {
    inSize.width = windowWidth;
    inSize.height = windowHeight;

    newWidthString = '100vw';
    newHeightString = '100vh';
  }

  resizeCanvas(inSize.width * displayFactor, inSize.height * displayFactor, true);

  p5Canvas.canvas.style.width = newWidthString;
  p5Canvas.canvas.style.height = newHeightString;
};

//
//  add an additional size to the list of sizes - can only be done once Toko is set up
//
Toko.prototype.addCanvasSize = function (inSize) {
  this.SIZES.push(inSize);
  this.SIZES_LIST[inSize.name] = inSize.name;
};
