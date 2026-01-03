class Gate {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw() {
    image(images["Gate"], this.x, this.y, this.size, this.size);
  }
}