class Projectile {
  constructor(x, y, radius, color = "blue") {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.radius = radius;
    this.color = color;
    this.dragging = false;
    this.maxPull = 120;
    this.power = 0.15;
    this.active = false;
    this.cooldown = 0;
  }
  update() {
    if (!this.active) return;
    this.vel.y += 0.4; // gravity
    this.pos.add(this.vel);
    // simple ground despawn
    if (this.pos.y > VIRTUAL_HEIGHT) {
      this.reset();
    }
  }
  reset() {
    this.active = false;
    this.vel.set(0, 0);
    this.cooldown = millis();
  }
  mousePressed() {
    if (this.active) return;
    let m = getWorldMouse();
    let d = dist(m.x, m.y, this.pos.x, this.pos.y);
    if (d < this.radius * 2) {
      this.dragging = true;
    }
  }
  mouseReleased() {
    if (!this.dragging) return;
    let m = getWorldMouse();
    let dir = p5.Vector.sub(this.pos, createVector(m.x, m.y));
    let strength = constrain(dir.mag(), 0, this.maxPull);
    dir.normalize();
    dir.mult(strength * this.power);
    this.vel = dir;
    this.active = true;
    this.dragging = false;
  }
  drawSpring() {
    if (!this.dragging) return;
    let m = getWorldMouse();
    stroke(0);
    line(this.pos.x, this.pos.y, m.x, m.y);
    let pull = constrain(dist(this.pos.x, this.pos.y, m.x, m.y), 0, this.maxPull);
    let angle = degrees(atan2(m.y - this.pos.y, m.x - this.pos.x));
    if (angle < 0) angle += 360;
    noStroke();
    fill(0);
    textSize(12);
    text(`${Math.round(pull)} | ${Math.round(angle)}°`, m.x + 5, m.y - 5);
  }
  display() {
    fill(this.color);
    noStroke();
    circle(this.pos.x, this.pos.y, this.radius * 2);
    this.drawSpring();
  }
}