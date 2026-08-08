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

const OBSTACLE_SIZE = 200;
const OBSTACLE_HALF = OBSTACLE_SIZE / 2;
let obstacle = { x: 0, y: 0 };
let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

let firstFrame = true;
let lastCanvasW = 0;
let lastCanvasH = 0;
let prevObstacleX = 0;
let prevObstacleY = 0;
let wallVx = 0;
let wallVy = 0;

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
  nrBalls: 600,
  ballSize: 5,
  speed: 0,
  mass: 1.0,
  friction: 0.015,
  capacity: 4,
  showQuadtree: true,
  showCollisions: false,
  showNeighbors: false,
  neighbors: 3,
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
  fBalls.addBinding(p, 'speed', { min: 0, max: 6, step: 0.5, label: 'speed' });
  fBalls.addBinding(p, 'mass', { min: 0, max: 10, step: 0.5, label: 'mass' });
  fBalls.addBinding(p, 'friction', { min: 0, max: 0.1, step: 0.005, label: 'friction' });

  let fQuadtree = panelObject.primaryTab.addFolder({
    title: 'QuadTree',
    expanded: true,
  });

  fQuadtree.addBinding(p, 'capacity', { min: 1, max: 16, step: 1, label: 'capacity' });
  fQuadtree.addBinding(p, 'showQuadtree', { label: 'show tree' });
  fQuadtree.addBinding(p, 'showCollisions', { label: 'highlight' });
  fQuadtree.addBinding(p, 'showNeighbors', { label: 'show neighbors' });
  fQuadtree.addBinding(p, 'neighbors', { min: 1, max: 12, step: 1, label: 'neighbors' });

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
//  MOUSE - drag the obstacle rectangle around
//
//---------------------------------------------
function mousePressed() {
  if (
    mouseX >= obstacle.x - OBSTACLE_HALF &&
    mouseX <= obstacle.x + OBSTACLE_HALF &&
    mouseY >= obstacle.y - OBSTACLE_HALF &&
    mouseY <= obstacle.y + OBSTACLE_HALF
  ) {
    dragging = true;
    dragOffsetX = mouseX - obstacle.x;
    dragOffsetY = mouseY - obstacle.y;
  }
}

function mouseDragged() {
  if (!dragging) return;
  obstacle.x = constrain(mouseX - dragOffsetX, OBSTACLE_HALF, width - OBSTACLE_HALF);
  obstacle.y = constrain(mouseY - dragOffsetY, OBSTACLE_HALF, height - OBSTACLE_HALF);
}

function mouseReleased() {
  dragging = false;
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
  //  center the obstacle on the real canvas on the first frame
  //  and whenever the canvas is resized (unless being dragged).
  //
  if (firstFrame || width !== lastCanvasW || height !== lastCanvasH) {
    if (!dragging) {
      obstacle.x = width / 2;
      obstacle.y = height / 2;
      prevObstacleX = obstacle.x;
      prevObstacleY = obstacle.y;
    }
    lastCanvasW = width;
    lastCanvasH = height;
    firstFrame = false;
  }

  //
  //  rectangle velocity = per-frame displacement of its center.
  //  used to add energy to balls it pushes.
  //
  wallVx = obstacle.x - prevObstacleX;
  wallVy = obstacle.y - prevObstacleY;
  prevObstacleX = obstacle.x;
  prevObstacleY = obstacle.y;

  //
  //  obstacle bounds, derived from the draggable center.
  //
  let rectLeft = obstacle.x - OBSTACLE_HALF;
  let rectRight = obstacle.x + OBSTACLE_HALF;
  let rectTop = obstacle.y - OBSTACLE_HALF;
  let rectBottom = obstacle.y + OBSTACLE_HALF;

  //
  //  1. rebuild the quadtree with the current ball positions.
  //     each ball is inserted as a QuadTreePoint carrying its index
  //     in userData, so query/closest results can map back to a ball.
  //
  quadtree = new Toko.QuadTree(new Toko.QuadTreeRectangle(width / 2, height / 2, width, height), p.capacity);
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    quadtree.insert(new Toko.QuadTreePoint(b.x, b.y, { id: i }));
  }

  //
  //  2. update positions, bounce off the canvas edges and the
  //     obstacle rectangle.
  //
  let damp = 1 - p.friction;
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    b.vx *= damp;
    b.vy *= damp;
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
    //
    //  bounce off the obstacle rectangle (a solid axis-aligned
    //  box). find the closest point on the rect to the ball center;
    //  if it's within the radius, push the ball out along the normal
    //  and reflect its velocity relative to the (possibly moving)
    //  wall, so a fast drag flings the ball.
    //
    let cx = constrain(b.x, rectLeft, rectRight);
    let cy = constrain(b.y, rectTop, rectBottom);
    let dx = b.x - cx;
    let dy = b.y - cy;
    let distSq = dx * dx + dy * dy;
    if (distSq < b.r * b.r) {
      if (distSq > 0) {
        let dist = Math.sqrt(distSq);
        let nx = dx / dist;
        let ny = dy / dist;
        b.x = cx + nx * b.r;
        b.y = cy + ny * b.r;
        //
        //  bounce off the (possibly moving) wall. the base reflection
        //  is independent of mass; the wall's motion transfers momentum
        //  scaled by 1/(1+mass), so a heavier ball is flung less by a
        //  fast drag (mass 0 -> full transfer, large mass -> none).
        //
        let vnBall = b.vx * nx + b.vy * ny;
        let Vn = wallVx * nx + wallVy * ny;
        if (vnBall - Vn < 0) {
          let transfer = 1 / (1 + p.mass);
          let vnBallNew = -vnBall + 2 * transfer * Vn;
          let dvn = vnBallNew - vnBall;
          b.vx += dvn * nx;
          b.vy += dvn * ny;
        }
      } else {
        //
        //  center ended up inside the rectangle: push it out
        //  through the nearest edge.
        //
        let dLeft = b.x - rectLeft;
        let dRight = rectRight - b.x;
        let dTop = b.y - rectTop;
        let dBottom = rectBottom - b.y;
        let minD = Math.min(dLeft, dRight, dTop, dBottom);
        if (minD === dLeft) {
          b.x = rectLeft - b.r;
          b.vx = -Math.abs(b.vx);
        } else if (minD === dRight) {
          b.x = rectRight + b.r;
          b.vx = Math.abs(b.vx);
        } else if (minD === dTop) {
          b.y = rectTop - b.r;
          b.vy = -Math.abs(b.vy);
        } else {
          b.y = rectBottom + b.r;
          b.vy = Math.abs(b.vy);
        }
      }
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
      let j = c.userData.id;
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
  //  4b. optionally draw a thin line from each ball to its N
  //      nearest neighbors, using the same color as the tree grid.
  //
  if (p.showNeighbors) {
    drawNeighbors();
  }

  //
  //  5. draw the obstacle rectangle, then the balls.
  //
  noStroke();
  fill(colors.scale(0, true));
  rect(rectLeft, rectTop, OBSTACLE_SIZE, OBSTACLE_SIZE);

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
  let rectLeft = obstacle.x - OBSTACLE_HALF;
  let rectRight = obstacle.x + OBSTACLE_HALF;
  let rectTop = obstacle.y - OBSTACLE_HALF;
  let rectBottom = obstacle.y + OBSTACLE_HALF;
  for (let i = 0; i < p.nrBalls; i++) {
    let r = p.ballSize;
    let x = toko.random(r, width - r);
    let y = toko.random(r, height - r);
    //
    //  don't spawn a ball overlapping the obstacle rectangle.
    //
    let cx = constrain(x, rectLeft, rectRight);
    let cy = constrain(y, rectTop, rectBottom);
    if ((x - cx) * (x - cx) + (y - cy) * (y - cy) < (r + 1) * (r + 1)) {
      // push it to a random edge of the canvas instead
      x = toko.random() < 0.5 ? toko.random(r, rectLeft - r) : toko.random(rectRight + r, width - r);
    }
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

//
//  draw a thin line from each ball to its N closest neighbors using
//  the quadtree's k-nearest search. the search point is excluded by
//  id so a ball never links to itself.
//
function drawNeighbors() {
  noFill();
  stroke(toko.colorAlpha(colors.drawColor(p.inverse), 80));
  strokeWeight(1);
  for (let i = 0; i < balls.length; i++) {
    let a = balls[i];
    let found = quadtree.closest(new Toko.QuadTreePoint(a.x, a.y), p.neighbors + 1);
    let drawn = 0;
    for (let pt of found) {
      if (pt.userData.id === i) continue;
      let b = balls[pt.userData.id];
      line(a.x, a.y, b.x, b.y);
      if (++drawn >= p.neighbors) break;
    }
  }
}
