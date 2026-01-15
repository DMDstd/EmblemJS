class Projectile {
  constructor(startX, startY, targetX, targetY, shooter, img) {
    this.x = startX;
    this.y = startY;
    this.img = img;
    this.shooter = shooter;
    this.speed = 10;
    this.damage = player.atk;
    this.dead = false;
    this.angle = atan2(targetY - startY, targetX - startX);
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    if (this.shooter == 0 && (this.x < -100 || this.y < -100 || this.x > VIRTUAL_WIDTH + 100 || this.y > VIRTUAL_HEIGHT + 100)) {
      this.dead = true;
    }
  }

  hitsBoss(boss) {
    if (this.shooter == 0) {
      return (this.x > boss.x && this.x < boss.x + boss.w && this.y > boss.y && this.y < boss.y + boss.h);
    } else {
      return;
    }
  }

  hitsPlayer(player) {
  if (this.shooter !== 1) return false;

  const r = 8; // projectile hit radius

  return (
    this.x + r > player.x &&
    this.x - r < player.x + T_S &&
    this.y + r > player.y &&
    this.y - r < player.y + T_S
  );
}


  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + 60);
    imageMode(CENTER);
    image(this.img, 0, 0, 40, 20);
    pop();
  }
 hitsWall(walls) {
  const r = 8;

  for (let w of walls) {
    const size = w.w || w.size || T_S;

    if (this.x + r > w.x && this.x - r < w.x + size && this.y + r > w.y && this.y - r < w.y + size) {
      return true;
    }
  }
  return false;
}

}