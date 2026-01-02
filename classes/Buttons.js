class Button {
  constructor(x, y, w, h, img, t) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.t = t;
    this.img = images[img];
  }
  draw() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}