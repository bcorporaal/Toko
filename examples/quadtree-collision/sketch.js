//---------------------------------------------
//
//  QUADTREE COLLISIONS
//
//  Bouncing balls whose collisions are resolved
//  efficiently with a QuadTree broad-phase.
//
//---------------------------------------------

let balls = [];
let quadtree;

let tokoWrapper = new TokoWrapper({
  title: 'QuadTree collisions',
  addInfoToTitle: true,
  showCanvasSizeOptions: true,
  showSaveSketchButton: true,
  showFPS: true,
});

//---------------------------------------------
//
//  SKETCH PARAMETERS - p
//
//---------------------------------------------
let p = {
  nrBalls: 200,
  ballSize: 5,
  speed: 2.5,
  capacity: 4,
  showQuadtree: true,
  showCollisions: false,
  collections: toko.COLOR_COLLECTIONS,
  collection: 'lospec',
  palette: 'vaporhaze',
  inverse: false,
};

//---------------------------------------------
//
//  SET UP PANEL CONTROLS
//
//---------------------------------------------
function setupPanelControls(panelObject) {
  let fBalls = panelObject.primaryTab.addFolder({
    title: 'Balls',
    expanded: true,
  });

  fBalls.addBinding(p, 'nrBalls', { min: 10, max: 2000, step: 10, label: 'count' });
  fBalls.addBinding(p, 'ballSize', { min: 2, max: 20, step: 1, label: 'size' });
  fBalls.addBinding(p, 'speed', { min: 0.5, max: 6, step: 0.5, label: 'speed' });

  let fQuadtree = panelObject.primaryTab.addFolder({
    title: 'QuadTree',
    expanded: true,
  });

  fQuadtree.addBinding(p, 'capacity', { min: 1, max: 16, step: 1, label: 'capacity' });
  fQuadtree.addBinding(p, 'showQuadtree', { label: 'show tree' });
  fQuadtree.addBinding(p, 'showCollisions', { label: 'highlight' });

  let fColors = panelObject.primaryTab.addFolder({
    title: 'Colors',
    expanded: true,
  });

  panelObject.addPaletteSelector(fColors, p, {
    index: 1,
    justPrimary: true,
    sorted: true,
    navButtons: true,
    collectionsList: 'collections',
    collectionKey: 'collection',
    paletteKey: 'palette',
  });
  fColors.addBinding(p, 'inverse', { label: 'invert bgnd' });

  panelObject.primaryTab.addBlade({ view: 'separator' });

  panelObject.primaryTab
    .addButton({
      title: 'Reset balls',
    })
    .on('click', () => {
      createBalls();
    });
}

//---------------------------------------------
//
//  SETUP - standard p5.js setup function
//
//---------------------------------------------
function setup() {
  let p5Canvas = createCanvas(100, 100, tokoWrapper.renderMode);
  p5Canvas.parent(tokoWrapper.sketchElementId);
  tokoWrapper.storeCanvas(p5Canvas);
}

//---------------------------------------------
//
//  REFRESH - called when a parameter changes
//
//---------------------------------------------
function refresh() {
  //
  //  color scale, one color per ball index
  //
  const o = {
    domain: [0, max(p.nrBalls, 1)],
  };
  colors = toko.getColorScale(p.palette, o);
  //
  //  (re)create the balls if the count changed
  //
  if (balls.length !== p.nrBalls) {
    createBalls();
  } else {
    //
    //  just refresh the colors and size for the existing balls
    //
    for (let i = 0; i < balls.length; i++) {
      balls[i].color = color(colors.scale(i, true));
      balls[i].r = p.ballSize;
    }
  }
}

//---------------------------------------------
//
//  DRAW - standard p5.js draw function
//
//---------------------------------------------
function draw() {
  clear();
  noStroke();

  let bgndColor = colors.backgroundColor(p.inverse);
  background(bgndColor);

  //
  //  1. rebuild the quadtree with the current ball positions.
  //     each ball is inserted as a QuadTreeCircle carrying its
  //     index in `data`, so we can map a query result back to a ball.
  //
  quadtree = new Toko.QuadTree(new Toko.QuadTreeRectangle(width / 2, height / 2, width, height), p.capacity);
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    quadtree.insert(new Toko.QuadTreeCircle(b.x, b.y, b.r, { id: i }));
  }

  //
  //  2. update positions, bounce off the canvas edges.
  //
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.x - b.r < 0) {
      b.x = b.r;
      b.vx *= -1;
    } else if (b.x + b.r > width) {
      b.x = width - b.r;
      b.vx *= -1;
    }
    if (b.y - b.r < 0) {
      b.y = b.r;
      b.vy *= -1;
    } else if (b.y + b.r > height) {
      b.y = height - b.r;
      b.vy *= -1;
    }
    b.colliding = false;
  }

  //
  //  3. broad-phase: for each ball query a circle slightly larger
  //     than the ball to find collision candidates, then do a
  //     precise distance check and resolve elastic collisions.
  //     only process j > i so each pair is handled once.
  //
  for (let i = 0; i < balls.length; i++) {
    let a = balls[i];
    let range = new Toko.QuadTreeCircle(a.x, a.y, a.r * 2);
    let candidates = quadtree.query(range);

    for (let c of candidates) {
      let j = c.data.id;
      if (j <= i) continue;
      let b = balls[j];

      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distSq = dx * dx + dy * dy;
      let minDist = a.r + b.r;

      if (distSq < minDist * minDist && distSq > 0) {
        let dist = Math.sqrt(distSq);
        let nx = dx / dist;
        let ny = dy / dist;

        //
        //  relative velocity along the collision normal.
        //  vn > 0 means the balls are moving towards each other.
        //
        let dvx = a.vx - b.vx;
        let dvy = a.vy - b.vy;
        let vn = dvx * nx + dvy * ny;

        if (vn > 0) {
          //
          //  equal-mass elastic collision: swap the normal
          //  components of the velocities.
          //
          a.vx -= vn * nx;
          a.vy -= vn * ny;
          b.vx += vn * nx;
          b.vy += vn * ny;
        }

        //
        //  push the balls apart so they no longer overlap.
        //
        let overlap = minDist - dist;
        a.x -= (nx * overlap) / 2;
        a.y -= (ny * overlap) / 2;
        b.x += (nx * overlap) / 2;
        b.y += (ny * overlap) / 2;

        a.colliding = true;
        b.colliding = true;
      }
    }
  }

  //
  //  4. draw the quadtree structure first (behind the balls).
  //
  if (p.showQuadtree) {
    drawQuadtree(quadtree);
  }

  //
  //  5. draw the balls.
  //
  noStroke();
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    if (p.showCollisions && b.colliding) {
      fill(255);
    } else {
      fill(b.color);
    }
    circle(b.x, b.y, b.r * 2);
  }
}

//---------------------------------------------
//
//  HELPERS
//
//---------------------------------------------

//
//  (re)create the balls array with random positions and velocities.
//
function createBalls() {
  balls = [];
  for (let i = 0; i < p.nrBalls; i++) {
    let r = p.ballSize;
    let x = toko.random(r, width - r);
    let y = toko.random(r, height - r);
    let angle = toko.random(TWO_PI);
    let mag = toko.random(p.speed * 0.5, p.speed);
    balls.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * mag,
      vy: Math.sin(angle) * mag,
      r: r,
      color: color(colors.scale(i, true)),
      colliding: false,
    });
  }
}

//
//  recursively draw the quadtree boundaries.
//
function drawQuadtree(qt) {
  let b = qt.boundary;
  noFill();
  stroke(toko.colorAlpha(colors.drawColor(p.inverse), 80));
  strokeWeight(1);
  rect(b.left, b.top, b.w, b.h);

  if (qt.divided) {
    drawQuadtree(qt.northwest);
    drawQuadtree(qt.northeast);
    drawQuadtree(qt.southwest);
    drawQuadtree(qt.southeast);
  }
}
