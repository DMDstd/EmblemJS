class Trigger {
  constructor(x, y, size, direction) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.direction = direction;
    this.triggerSize = size * 0.4;
    this.triggerOffset = (size - this.triggerSize) / 2;
  }
checkTrigger(player) {
  let pcx = player.x + 24;
  let pcy = player.y + 24;
  let tx = this.x + this.triggerOffset;
  let ty = this.y + this.triggerOffset;
  stroke(255, 0, 0);
  point(pcx, pcy);
  if (
    pcx > tx &&
    pcx < tx + this.triggerSize &&
    pcy > ty &&
    pcy < ty + this.triggerSize
  ) {
    if (this.direction == "up")  {
      changeLevel(1, tx, ty);
    } else {
    changeLevel(0, tx, ty);
    }
  }
}
hitbox() {
  noFill();
  stroke(0, 255, 0);
  rect(
    this.x + this.triggerOffset,
    this.y + this.triggerOffset,
    this.triggerSize,
    this.triggerSize
  );
}
}