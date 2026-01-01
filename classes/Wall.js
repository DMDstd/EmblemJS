class Wall {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw() {
    image(images["bricks"], this.x, this.y, this.size, this.size);
  }
}