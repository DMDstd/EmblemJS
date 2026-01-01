class Floor {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw() {
    image(images["stone"], this.x, this.y, this.size, this.size);
  }
}