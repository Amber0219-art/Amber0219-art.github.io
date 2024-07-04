let flock;

function setup() {
  createCanvas(640, 360);
  flock = new Flock();
  for (let i = 0; i < 150; i++) {
    flock.addBoid(new Boid(width / 2, height / 2, false));
  }
}

function draw() {
  background(50);
  flock.run();
}

function mousePressed() {
  flock.addBoid(new Boid(mouseX, mouseY, true));
}
