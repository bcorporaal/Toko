import Toko from './main';

//
//  resize canvas to a new size while fitting within the window
//
Toko.prototype.setCanvasSize = function(inSize) {
  const margin = 80;
  let zoomFactor = 1;
  let displayFactor = inSize.pixelDensity/2;

  zoomFactor = Math.min(1,(windowWidth - margin)/inSize.width*displayFactor);
  zoomFactor = Math.min(zoomFactor,(windowHeight -margin)/inSize.height*displayFactor);

  let newWidthString = Math.floor(inSize.width * zoomFactor / displayFactor) + 'px';
  let newHeightString = Math.floor(inSize.height * zoomFactor / displayFactor) + 'px';

  resizeCanvas(inSize.width*displayFactor, inSize.height*displayFactor, true);

  p5Canvas.canvas.style.width = newWidthString;
  p5Canvas.canvas.style.height = newHeightString;
}