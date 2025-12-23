class Player {
  constructor(x, y, size, imgL, imgR) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fimg = imgR;
    this.imgR = imgR;
    this.imgL = imgL;
    this.speed = 5;
    this.color = color(200, 200, 200);
  }
  
  move(direction) {
    if (direction == "left") {
      this.x -= this.speed;
      this.fimg = this.imgL;
    }
    if (direction == "right") {
      this.x += this.speed;
      this.fimg = this.imgR;
    }
    if (direction == "up") {
      this.y -= this.speed;
    }
    if (direction == "down") {
      this.y += this.speed;
    }
  }
  draw() {
    image(this.fimg, this.x, this.y, this.size, this.size);
  }
}