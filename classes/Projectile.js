class Projectile {
    constructor(x, y, img){
        this.x = x;
        this.y = y;
        this.img = images[img];
        this.dragging = false;
        this.fx;
        this.fy;
        this.launchForce = { x: 0, y: 0 };
        this.springLength = 0;
        this.angleInDegrees = 0;

    }
    mouseIsPressed() {
        this.x = worldMouseX;
        this.y = worldMouseY;
        this.dragging = true;
        if(mouseIsPressed()){
            mouseX = this.fx;
            mouseY = this.fy;
        }
    }
     calculateLaunchForce() {
    const springLength = dist(this.mx, this.my, this.fx, this.fy);
    const angle = atan2(this.fy - this.my, this.fx - this.fx);

    let limitedLength = springLength;
    if (springLength > 100) {
      limitedLength = 100;
    }
  }

    displaySpring() {
    if (this.dragging) {
      stroke(0);
      const springLength = dist(this.mx, this.my, this.fx, this.fy);
      const angle = atan2(this.fy - this.my, this.fx - this.fx);

      let limitedLength = springLength;
      if (springLength > 100) {
        limitedLength = 100;
      }

      const endX = this.mx + cos(angle) * limitedLength;
      const endY = this.my + sin(angle) * limitedLength;
      line(this.mx, this.my, endX, endY);

      // Zobrazení hodnoty natažení pružiny
      noStroke();
      fill(0);
      textSize(10);
      text(`${Math.round(limitedLength)} | ${Math.round(degrees(angle) >= 0 ? degrees(angle) : 360 + degrees(angle))}°`, endX, endY);
    }
  }
  diplay(){
    this.displaySpring();
  }
}