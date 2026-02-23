//---------------------------------------------
//
//  ANIMATION - using p5.toko without TokoWrapper
//
//---------------------------------------------

let particles = [];

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let p = {
  nrParticles: 30,
  plotMirrorParticle: true,
  trailLength: 60,
  size: 2,
  velocityMax: 4,
  velocityMin: 0,
  attractorStrength: 0.5,
  colorReverse: false,
  collection: 'basic',
  palette: '12bitRainbow',
  originalColors: false,
  mode: 'lab',
  darkBgnd: true,
  blendMode: toko.BLEND_MODE.BLEND,
};

//---------------------------------------------
//
//  SETUP - standard p5.js setup function
//
//---------------------------------------------
function setup () {
  createCanvas(windowWidth, windowHeight);
  refresh();
}

//---------------------------------------------
//
//  REFRESH - called when a parameter changes
//
//---------------------------------------------
function refresh () {
  //
  //  set color parameters
  //
  const o = {
    domain: [0, p.trailLength],
    mode: p.mode,
    reverse: p.colorReverse,
  };
  //
  //  get colors and set the blendmode
  //
  colors = toko.getColorScale(p.palette, o);
  blendMode(p.blendMode);
  //
  //  make additional particles if needed
  //
  if (particles.length < p.nrParticles) {
    let c = p.nrParticles - particles.length;
    for (let i = 0; i < c; i++) {
      let p1 = createVector(toko.random(width), toko.random(height));
      let m = toko.random(p.velocityMin, p.velocityMax);
      let v1 = p5.Vector.random2D().setMag(m);
      let attractionStrength = 1;
      particles.push({
        pos: [p1],
        vel: v1,
        attractionStrength: attractionStrength,
      });
    }
  }
}

function clearTrails () {
  for (let i = 0; i < particles.length; i++) {
    let curPos = particles[i].pos[0];
    particles[i].pos = [];
    particles[i].pos.push(curPos);
  }
  refresh();
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw () {
  clear();
  noStroke();

  let bgndColor = colors.backgroundColor(p.darkBgnd);
  let drawColor = colors.drawColor(p.darkBgnd);

  background(bgndColor);

  //
  //  plot the central attractor
  //
  fill(drawColor);
  circle(width / 2, height / 2, 10);

  let pos, vel, n, posNew, col;

  for (let i = 0; i < p.nrParticles; i++) {
    pos = particles[i].pos;
    vel = particles[i].vel;
    n = pos.length;

    //
    //  apply attractor force
    //
    let attractorPos = createVector(width / 2, height / 2);
    let force = attractorForce(attractorPos, pos[0]);
    vel.add(force);
    vel.limit(p.velocityMax);

    //
    //  update position and previous positions
    //
    posNew = p5.Vector.add(pos[0], vel);

    //
    //  bounce off canvas edges
    //
    if (posNew.x < p.size / 2 || posNew.x > width - p.size / 2) {
      vel.x *= -1; // Reverse horizontal velocity
      posNew.x = constrain(posNew.x, p.size / 2, width - p.size / 2); // Keep particle on canvas
    }
    if (posNew.y < p.size / 2 || posNew.y > height - p.size / 2) {
      vel.y *= -1; // Reverse vertical velocity
      posNew.y = constrain(posNew.y, p.size / 2, height - p.size / 2); // Keep particle on canvas
    }

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
        line(pos[j].x, height - pos[j].y, pos[j + 1].x, height - pos[j + 1].y);
        line(width - pos[j].x, pos[j].y, width - pos[j + 1].x, pos[j + 1].y);
      }
    }
  }
}

function attractorForce (attractorPos, particlePos) {
  // Calculate direction from particle to attractor
  let forceDirection = p5.Vector.sub(attractorPos, particlePos);
  forceDirection = p5.Vector.normalize(forceDirection);

  // Apply constant weak force
  forceDirection.mult(p.attractorStrength * 2 * 0.015);
  return forceDirection;
}

//---------------------------------------------
//
//  WINDOW RESIZED
//
//---------------------------------------------
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}
