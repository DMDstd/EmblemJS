class Player {
  constructor(x, y, size, imgL, imgR) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fimg = imgR;
    this.imgR = imgR;
    this.imgL = imgL;
    this.speed = 3;
    this.hp = PlayerHP;
    this.atk = PlayerAtk;
    this.def = PlayerDef;
  }
move(d, walls, water, enemies) {
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
  let result = this.collides(nx, ny, walls, water, enemies, entities);
  // Move only if no collision
  if (!result) {
    this.x = nx;
    this.y = ny;
  } else if (result.enemy && gameState === "explore") {
    startCombat(result.enemy);
  } else if (result.entity && gameState === "explore") {
    startInteraction(result.entity, player);
  }
}
jump(ee,walls, water, enemies) {
  let nx = this.x;
  let ny = this.y;

  ////jump
  if(this.y > VIRTUAL_HEIGHT - T_S *4){
    ny -= this.speed;
  }else{
    jumping = 1;
  }
  ////
  let result = this.collides(nx, ny, walls, water, enemies, entities);
  // Move only if no collision
  if (!result) {
    this.x = nx;
    this.y = ny;
  } else if (result.entity && gameState === "boss") {
    startInteraction(result.entity, player);
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
  collides(nx, ny, walls, water, enemies, entities) {
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
    for (let w of water) {
      if (
        nx < w.x + w.size &&
        nx + this.size > w.x &&
        ny < w.y + w.size &&
        ny + this.size > w.y &&
        Jesus == 0
      ) {
        console.log("kolize brasko");
        return true;
      }
    }
    for (let enemy of enemies) {
      if (
        nx < enemy.x + enemy.w &&
        nx + this.size > enemy.x &&
        ny < enemy.y + enemy.h &&
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