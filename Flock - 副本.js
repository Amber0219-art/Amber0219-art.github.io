class Flock {
  constructor() {
    this.boids = [];
  }

  addBoid(b) {
    this.boids.push(b);
  }

  run() {
    for (let b of this.boids) {
      b.run(this.boids);
    }
  }
}
