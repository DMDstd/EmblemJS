class Projectile {
  constructor(startX, startY, targetX, targetY, img) {
    this.x = startX;
    this.y = startY;
    this.img = img;

    this.speed = 10;
    this.damage = player.atk;
    this.dead = false;

    this.angle = atan2(targetY - startY, targetX - startX);
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    if (this.x < -100 || this.y < -100 || this.x > VIRTUAL_WIDTH + 100 || this.y > VIRTUAL_HEIGHT + 100) {
      this.dead = true;
    }
  }

  hitsBoss(boss) {
    return (this.x > boss.x && this.x < boss.x + boss.w && this.y > boss.y && this.y < boss.y + boss.h);
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.img, 0, 0, 40, 20);
    pop();
  }
}