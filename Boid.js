class Boid {
    constructor(x, y, clicked) {
      this.acceleration = createVector(0, 0);
      let angle = random(TWO_PI);
      this.velocity = createVector(cos(angle), sin(angle));
      this.position = createVector(x, y);
      this.r = 8.0;
      this.maxspeed = 2;
      this.maxforce = 0.03;
      this.isClicked = clicked;
    }
  
    run(boids) {
      this.flock(boids);
      this.update();
      this.borders();
      this.render();
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    flock(boids) {
      let sep = this.separate(boids);
      let ali = this.align(boids);
      let coh = this.cohesion(boids);
      let circling = this.circle(mouseX, mouseY);
  
      sep.mult(1.5);
      ali.mult(1.0);
      coh.mult(1.0);
      circling.mult(1.0);
  
      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
      this.applyForce(circling);
    }
  
    update() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }
  
    render() {
      let theta = this.velocity.heading() + radians(90);
  
      if (this.isClicked) {
        fill(255, 105, 180);
      } else {
        fill(255);
      }
      noStroke();
      push();
      translate(this.position.x, this.position.y);
      rotate(theta);
      beginShape();
      vertex(0, -this.r);
      bezierVertex(-this.r, -this.r * 2, -this.r * 2, 0, 0, this.r);
      bezierVertex(this.r * 2, 0, this.r, -this.r * 2, 0, -this.r);
      endShape(CLOSE);
      pop();
    }
  
    borders() {
      if (this.position.x < -this.r) this.position.x = width + this.r;
      if (this.position.y < -this.r) this.position.y = height + this.r;
      if (this.position.x > width + this.r) this.position.x = -this.r;
      if (this.position.y > height + this.r) this.position.y = -this.r;
    }
  
    separate(boids) {
      let desiredseparation = 25.0;
      let steer = createVector(0, 0);
      let count = 0;
      for (let other of boids) {
        let d = p5.Vector.dist(this.position, other.position);
        if ((d > 0) && (d < desiredseparation)) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.normalize();
          diff.div(d);
          steer.add(diff);
          count++;
        }
      }
  
      if (count > 0) {
        steer.div(count);
      }
  
      if (steer.mag() > 0) {
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
      }
      return steer;
    }
  
    align(boids) {
      let neighbordist = 50;
      let sum = createVector(0, 0);
      let count = 0;
      for (let other of boids) {
        let d = p5.Vector.dist(this.position, other.position);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(other.velocity);
          count++;
        }
      }
  
      if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        let steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxforce);
        return steer;
      } else {
        return createVector(0, 0);
      }
    }
  
    cohesion(boids) {
      let neighbordist = 50;
      let sum = createVector(0, 0);
      let count = 0;
      for (let other of boids) {
        let d = p5.Vector.dist(this.position, other.position);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(other.position);
          count++;
        }
      }
  
      if (count > 0) {
        sum.div(count);
        return this.seek(sum);
      } else {
        return createVector(0, 0);
      }
    }
  
    seek(target) {
      let desired = p5.Vector.sub(target, this.position);
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
  
    circle(centerX, centerY) {
      let radius = 50;
      let circleCenter = createVector(centerX, centerY);
      let toCenter = p5.Vector.sub(circleCenter, this.position);
      let distance = toCenter.mag();
      let angle = atan2(toCenter.y, toCenter.x) + radians(90);
  
      if (distance > radius) {
        return this.seek(circleCenter);
      } else {
        let desired = createVector(cos(angle), sin(angle));
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer;
      }
    }
  }
  