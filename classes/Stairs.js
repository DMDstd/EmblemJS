class Stairs {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw() {
    image(images["stairs"], this.x, this.y, this.size, this.size);
  }
}