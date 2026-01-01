class Player {
  constructor(x, y, size, imgL, imgR) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fimg = imgR;
    this.imgR = imgR;
    this.imgL = imgL;
    this.speed = 3;
    this.hp = 100;
    this.atk = 10;
    this.def = 10;
  }
move(d, walls, enemies) {
  let nx = this.x;
  let ny = this.y;
  if (d === "left") {
    nx -= this.speed;
    this.fimg = this.imgL;
  }
  if (d === "right") {
    nx += this.speed;
    this.fimg = this.imgR;
  }
  if (d === "up") {
    ny -= this.speed;
  }
  if (d === "down") {
    ny += this.speed;
  }
  let result = this.collides(nx, ny, walls, enemies, entities);
  // Move only if no collision
  if (!result) {
    this.x = nx;
    this.y = ny;
  } else if (result.enemy && gameState === "explore") {
    startCombat(result.enemy);
  } else if (result.entity && gameState === "explore") {
    startInteraction(result.entity);
  }
}
teleport(x, y) {
  console.log(`tel:${this.x}, ${this.y}`);
  this.x = x;
  this.y = y;
}
hitbox() {
  noFill();
  stroke(255, 0, 0);
  rect(
    this.x,
    this.y,
    this.size,
    this.size
  );
}
  collides(nx, ny, walls, enemies, entities) {
    for (let wall of walls) {
      if (
        nx < wall.x + wall.size &&
        nx + this.size > wall.x &&
        ny < wall.y + wall.size &&
        ny + this.size > wall.y
      ) {
        console.log("kolize brasko");
        return true;
      }
    }
    for (let enemy of enemies) {
      if (
        nx < enemy.x + T_S &&
        nx + this.size > enemy.x &&
        ny < enemy.y + T_S &&
        ny + this.size > enemy.y
      ) {
        console.log("kolize brasko");
        return { enemy: enemy };
      }
    }
    for (let entity of entities) {
      if (
        nx < entity.x + entity.w &&
        nx + this.size > entity.x &&
        ny < entity.y + entity.h &&
        ny + this.size > entity.y
      ) {
        console.log("kolize brasko");
        return { entity: entity };
      }
    }
    console.log("zadna kolize brasko");
    return false;
  }
  draw() {
    image(this.fimg, this.x, this.y, this.size, this.size);
  }
}