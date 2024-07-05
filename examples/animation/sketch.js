p5.disableFriendlyErrors = false; // disables FES to speed things up a little bit

let toko = new Toko();
let particles = [];
let attractors = [];

function preload () {
  //
  // All loading calls here
  //
}

function setup () {
  //------------------------------------------------------
  //
  //  set base canvas
  //
  let sketchElementId = 'sketch-canvas';
  let canvasWidth = 0;
  let canvasHeight = 0;

  //
  //  the size is set using the Toko setup options
  //
  p5Canvas = createCanvas(canvasWidth, canvasHeight, P2D);
  p5Canvas.parent(sketchElementId);

  //-------------------------------------------------------
  //
  //  start Toko
  //
  toko.setup({
    //
    //  basic options
    //
    title: 'Toko demo', //  title displayed
    sketchElementId: sketchElementId, //  id used to create the p5 canvas
    canvasSize: toko.SIZE_DEFAULT, //  canvas size to use
    //
    //  additional options
    //
    showSaveSketchButton: true, //  show save image button in tweakpane
    saveSettingsWithSketch: true, //  save json of settings together with the image
    acceptDroppedSettings: true, //  accept dropped json files with settings
    useParameterPanel: true, //  use the tweakpane panel for settings
    hideParameterPanel: false, //  hide the parameter panel by default (show by pressing 'p')
    showAdvancedOptions: true, //  show advanced settings in tweakpane, like size
    additionalCanvasSizes: [
      //  array of additional canvas sizes
      {
        name: 'landscape',
        width: 1200,
        height: 900,
        pixelDensity: 2,
      },
    ],
    captureFrames: true, //  add record option in tweakpane
    captureFrameCount: 999, //  max number of frames captured (is this actually used?)
    captureFrameRate: 15, //  basic frame rate for capture
    captureFormat: 'png', //  default image format for capture
    logFPS: false, //  log the fps in tweakpane (not working properly)
  });

  //
  //-------------------------------------------------------
  //
  //  sketch parameters
  //
  p = {
    nrParticles: 4,
    plotMirrorParticle: false,
    trailLength: 80,
    fadeTrail: false,
    nrAttractors: 1,
    attractorHorizontal: true,
    attractorVertical: true,
    showAttractors: false,
    size: 5,
    gravity: 85,
    velocityMax: 6,
    velocityMin: 2,
    colorReverse: false,
    collections: ['basic', 'golid', 'metbrewer', 'd3', 'duotone'],
    collection: 'basic',
    palette: 'westCoast',
    originalColors: false,
    mode: 'lab',
    darkBgnd: false,
    blendMode: BLEND,
  };

  //
  //  set all the tweakpane controls
  //
  let fParticles = toko.pane.tab.addFolder({
    title: 'Particles',
    expanded: true,
  });
  fParticles.addBinding(p, 'nrParticles', {
    min: 1,
    max: 100,
    step: 1,
    label: 'particles',
  });
  fParticles.addBinding(p, 'size', { min: 1, max: 80, step: 2, label: 'size' });
  fParticles.addBinding(p, 'trailLength', {
    min: 2,
    max: 500,
    step: 5,
    label: 'trail',
  });
  fParticles.addBinding(p, 'fadeTrail');
  fParticles.addBinding(p, 'plotMirrorParticle', { label: 'mirror' });

  let fAttractors = toko.pane.tab.addFolder({
    title: 'Attractors',
    expanded: true,
  });
  fAttractors.addBinding(p, 'nrAttractors', {
    min: 1,
    max: 7,
    step: 1,
    label: 'attractors',
  });
  fAttractors.addBinding(p, 'gravity', {
    min: 0,
    max: 400,
    step: 10,
    label: 'gravity',
  });
  fAttractors.addBinding(p, 'showAttractors', { label: 'show' });
  fAttractors.addBinding(p, 'attractorHorizontal', { label: 'horizontal' });
  fAttractors.addBinding(p, 'attractorVertical', { label: 'vertical' });

  let fColors = toko.pane.tab.addFolder({ title: 'Colors', expanded: true });
  // add collection and palette selector, with next, previous and random buttons
  toko.addPaletteSelector(fColors, p, {
    index: 1,
    justPrimary: false,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });
  // add blendmode selector
  toko.addBlendModeSelector(fColors, p, {
    blendModeKey: 'blendMode',
  });

  fColors.addBinding(p, 'colorReverse', { label: 'reverse' });
  fColors.addBinding(p, 'originalColors', { label: 'original' });
  fColors.addBinding(p, 'darkBgnd', { label: 'dark bgnd' });

  toko.pane.tab.addBlade({ view: 'separator' });

  const btnClear = toko.pane.tab
    .addButton({
      title: 'Clear trails',
    })
    .on('click', () => {
      clearTrails();
    });

  toko.pane.events.on('change', value => {
    refresh();
  });

  refresh();

  //---------------------------------------------
  toko.endSetup();
  //---------------------------------------------
}

function refresh () {
  //
  //  set color parameters
  //
  const o = {
    domain: [0, p.trailLength],
    mode: this.p.mode,
    reverse: p.colorReverse,
  };
  //
  //  get colors and set the blendmode
  //
  colors = toko.getColorScale(this.p.palette, o);
  blendMode(p.blendMode);
  //
  //  make additional particles if needed
  //
  if (particles.length < p.nrParticles) {
    let c = p.nrParticles - particles.length;
    for (let i = 0; i < c; i++) {
      let p1 = createVector(toko.random(width), toko.random(height));
      let v1 = p5.Vector.random2D().setMag(toko.random(p.velocityMin, p.velocityMax));
      particles.push({
        pos: [p1],
        vel: v1,
      });
    }
  }
  //
  //  position the attractors
  //
  attractors = [];
  let d = height / (p.nrAttractors + 1);
  if (p.attractorVertical) {
    for (let i = 0; i < p.nrAttractors; i++) {
      attractors[i] = createVector(width / 2, (i + 1) * d);
    }
  }
  let pn = attractors.length;
  d = width / (p.nrAttractors + 1);
  if (p.attractorHorizontal) {
    for (let i = 0; i < p.nrAttractors; i++) {
      attractors[i + pn] = createVector((i + 1) * d, height / 2);
    }
  }
  //
  //  redraw with updated parameters
  //
  redraw();
}

function clearTrails () {
  for (let i = 0; i < particles.length; i++) {
    let curPos = particles[i].pos[0];
    particles[i].pos = [];
    particles[i].pos.push(curPos);
  }
  refresh();
}

function draw () {
  //---------------------------------------------
  toko.startDraw();
  //---------------------------------------------

  clear();
  noStroke();

  let bgndColor = colors.backgroundColor(p.darkBgnd);
  let drawColor = colors.drawColor(p.darkBgnd);

  background(bgndColor);

  //
  //  plot the attractors
  //
  if (p.showAttractors) {
    fill(drawColor);
    let n = attractors.length;
    for (let i = 0; i < n; i++) {
      circle(attractors[i].x, attractors[i].y, 10);
    }
  }

  let pos, vel, n, posNew, col, force, af;

  for (let i = 0; i < p.nrParticles; i++) {
    pos = particles[i].pos;
    vel = particles[i].vel;
    n = pos.length;

    //
    //  attract to attractors
    //
    force = createVector(0, 0);
    for (let i = 0; i < p.nrAttractors; i++) {
      af = attractorForce(attractors[i], pos[0]);
      force.add(af);
    }
    vel.add(force);

    //
    //  update position and previous positions
    //
    posNew = p5.Vector.add(pos[0], vel);
    pos.unshift(posNew);
    pos.splice(p.trailLength);

    n = pos.length - 1;
    noFill();
    strokeWeight(p.size);
    for (let j = 0; j < n; j++) {
      //
      //  use the interpolated scale or the original colors
      //
      col = color(colors.scale(j, p.originalColors));
      //
      //  fade trail if option is set
      //
      if (p.fadeTrail) {
        let a = map(j, 0, n, 255, 0);
        col.setAlpha(a);
      }
      stroke(col);
      line(pos[j].x, pos[j].y, pos[j + 1].x, pos[j + 1].y);
    }

    //
    //  plot the mirror particle if set
    //  (just mirrored around the center of the canvas)
    //
    if (p.plotMirrorParticle) {
      for (let j = 0; j < n; j++) {
        //
        //  use the interpolated scale or the original colors
        //
        if (!p.originalColors) {
          col = color(colors.scale(j));
        } else {
          col = color(colors.originalScale(j));
        }

        if (p.fadeTrail) {
          let a = map(j, 0, n, 255, 0);
          col.setAlpha(a);
        }
        stroke(col);
        line(width - pos[j].x, height - pos[j].y, width - pos[j + 1].x, height - pos[j + 1].y);
      }
    }
  }

  //---------------------------------------------
  toko.endDraw();
  //---------------------------------------------
}

function attractorForce (attractor, position) {
  let force = p5.Vector.sub(attractor, position);
  let distanceSq = constrain(force.magSq(), 100, 1000);
  let strength = p.gravity / distanceSq;
  force.setMag(strength);
  return force;
}

//---------------------------------------------
//
//  EVENTS
//
//---------------------------------------------

function captureStarted () {
  //
  //  called when capture has started, use to reset visuals
  //
  console.log('Toko - captureStarted');
}

function captureStopped () {
  //
  //  called when capture is stopped, use to reset visuals
  //
  console.log('Toko - captureStopped');
}

function canvasResized () {
  //
  //  called when the canvas was resized
  //
  console.log('Toko - canvasResized');
}

function windowResized () {
  //
  //  resize the canvas when the framing div was resized
  //
  console.log('Toko - windowResized');

  var newWidth = document.getElementById('sketch-canvas').offsetWidth;
  var newHeight = document.getElementById('sketch-canvas').offsetHeight;

  if (newWidth != width || newHeight != height) {
    canvasResized();
  }
}

function receivedFile (file) {
  //
  //  called when a file is dropped on the sketch
  //  tweakpane settings are automatically updated
  //
  console.log('Toko - receivedFile');
}
