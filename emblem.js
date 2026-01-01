let walls = [];
let stairs = [];
let triggers = [];
let floor = [];
let images = {};
let player;
let keys = {};
let loopCount = 0;
let currentTrack = "P1";
const T_S = 59;
let currentLevel = 1;
let defeatedEnemies = {};
let despawnedEntities = {};
const UI_WIDTH = 381;
let gameState = "explore"; // "combat"
let currentEnemy = null;
let currentEntity = null;
let currentTarget = null;
let lastCombatTick = 0;
let yellowKey = 0;
let blueKey = 0;
let redKey = 0;
const COMBAT_INTERVAL = 1000; // ms

function preload() {
  images["FenorisL1"] = loadImage('./images/FenorisL1Hit.png');
  images["FenorisR1"] = loadImage('./images/FenorisR1Hit.png');
  images["stone"] = loadImage('./images/Stone.png');
  images["stairs"] = loadImage('./images/Stairs.png');
  images["GreenSlime"] = loadImage('./images/GreenSlime.png');
  images["GoldenSlime"] = loadImage('./images/GoldenSlime.png');
  images["PinkSlime"] = loadImage('./images/PinkSlime.png');
  images["PurpleSlime"] = loadImage('./images/PurpleSlime.png');
  images["RedSlime"] = loadImage('./images/RedSlime.png');
  images["WhiteSlime"] = loadImage('./images/WhiteSlime.png');
  images["YellowSlime"] = loadImage('./images/YellowSlime.png');
  images["bricks"] = loadImage('./images/Bricks.png');
  images["yellowKey"] = loadImage('./images/YellowKey.png');
  images["blueKey"] = loadImage('./images/BlueKey.png');
  images["redKey"] = loadImage('./images/RedKey.png');
  images["yellowChest"] = loadImage('./images/YellowChest.png');
  images["blueChest"] = loadImage('./images/BlueChest.png');
  images["redChest"] = loadImage('./images/RedChest.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(T_S, T_S, T_S/1.3, images["FenorisL1"], images["FenorisR1"]);
  loadLevel(currentLevel);
}

function loadLevel(n) {
  let lvl = LEVELS[n];
  generateLevel(lvl.terrain);
  generateEnemies(lvl.enemies, n);
  generateEntities(lvl.entities, n);
}

function drawCombatWindow() {
  const w = 600;
  const h = 300;
  const x = windowWidth / 2 - UI_WIDTH;
  const y = windowHeight / 2 - UI_WIDTH / 2;
  fill(20, 220);
  stroke(255);
  rect(x, y, w, h, 10);
  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text("COMBAT", x + w / 2, y + 30);
  textSize(14);
  text(
    `Player HP: ${player.hp}\n` +
    `${currentEnemy.name} HP: ${currentEnemy.hp}`,
    x + w / 2,
    y + 80
  );
  textAlign(LEFT);

}

function drawUI() {
  noStroke();
  fill(30);
  rect(0, 0, UI_WIDTH, windowHeight);
  fill(255);
  textSize(16);
  text(`Floor: ${currentLevel}`, 20, 20);
  text("Player: Fenoris", 20, 60);
  textSize(14);
  text("HP: " + player.hp, 20, 90);
  text("ATK: " + player.atk, 20, 110);
  text("DEF: " + player.def, 20, 130);
  textSize(16);
  text("Keys", 20, 170);
  textSize(14);
  text("Yellow: " + yellowKey, 20, 200);
  text("Blue: " + blueKey, 20, 220);
  text("Red: " + redKey, 20, 240);
  if(currentTarget) {
    textSize(16);
  text(`${currentTarget.name}`, 20, 500);
  textSize(14);
  text(`HP: ${currentTarget.hp}`, 20, 530);
  text(`ATK: ${currentTarget.atk}`, 20, 550);
  text(`DEF: ${currentTarget.def}`, 20, 570);
  }
  stroke(80);
  line(UI_WIDTH - 10, 0, UI_WIDTH - 10, windowHeight);
}

function draw() {
  background(0);
  drawUI();
  push();
  translate(UI_WIDTH, 0);
  if (gameState === "explore") {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.move("left", walls, enemies);
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.move("right", walls, enemies);
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.move("up", walls, enemies);
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.move("down", walls, enemies);
  }
  }
  for (let floors of floor) {
    floors.draw();
  }
  for (let wall of walls) {
    wall.draw();
  }
  for (let stair of stairs) {
    stair.draw();
  }
  for (let obj of triggers) {
    if(obj.checkTrigger(player))loadLevel(currentLevel);
    obj.hitbox();
  }
  for (let e of enemies) {
    e.show();
  }
  for (let e of entities) {
    e.show();
  }
  player.draw();
  player.hitbox();
  if (gameState === "explore") {
    updateHoverTarget(enemies);
  }
  if (gameState === "combat") {
    updateCombat();
    drawCombatWindow();
  }
  if (gameState === "gameover") {
    background(0);
    fill(255, 0, 0);
    textAlign(CENTER);
    textSize(32);
    text("GAME OVER", (windowWidth - UI_WIDTH) / 2, windowHeight / 2);
    textAlign(LEFT);
  } 
}

function changeLevel(d, x, y) {
  if(d === 1) {
    currentLevel++;
    x -= (windowWidth - UI_WIDTH) - 1.9*T_S;
    player.teleport(x, y - 10);
    loadLevel(currentLevel);
  } else if(d === 0) {
    currentLevel--;
    loadLevel(currentLevel);
    x += (windowWidth - UI_WIDTH) - 2.5*T_S;
    player.teleport(x, y - 10);
  }
}

function generateLevel(level) {
  floor = [];
  walls = [];
  triggers = [];
  stairs = [];
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === "0") {
        floor.push(new Floor(x * T_S, y * T_S, T_S));
      } else if (level[y][x] === "1") {
        walls.push(new Wall(x * T_S, y * T_S, T_S));
      } else if (level[y][x] === "2") {
        stairs.push(new Stairs(x * T_S, y * T_S, T_S));
        triggers.push(new Trigger(x * T_S, y * T_S, T_S, "up"));
      } else if (level[y][x] === "3") {
        stairs.push(new Stairs(x * T_S, y * T_S, T_S));
        triggers.push(new Trigger(x * T_S, y * T_S, T_S, "down"));
      }
    }
  }
}

function generateEnemies(map, levelNum) {
  enemies = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tile = map[y][x];
      let px = x * T_S;
      let py = y * T_S;
      let key = `${levelNum}-${x}-${y}`;
      if (tile === "0" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 0, key));
      }
      if (tile === "1" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 1, key));
      }
      if (tile === "2" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 2, key));
      }
      if (tile === "3" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 3, key));
      }
      if (tile === "4" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 4, key));
      }
      if (tile === "5" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 5, key));
      }
      if (tile === "6" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, 6, key));
      }
    }
  }
}

function generateEntities(map, levelNum) {
  entities = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tile = map[y][x];
      let px = x * T_S;
      let py = y * T_S;
      let key = `${levelNum}-${x}-${y}`;
      if (tile === "0" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S/2, 0, key));
      }
      if (tile === "1" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py+T_S/4, T_S, T_S/2, 1, key));
      }
      if (tile === "2" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py+T_S/4, T_S, T_S/2, 2, key));
      }
      if (tile === "3" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py+T_S/4, T_S, T_S/2, 3, key));
      }
      if (tile === "4" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, 4, key));
      }
      if (tile === "5" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, 5, key));
      }
      if (tile === "6" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, 6, key));
      }
    }
  }
}


function fightMusic() {
    currentTrack = "FM";
    const music = document.getElementById("FM");
    music.volume = 0.5;
    music.play();
}

function themeMusic() {
  const P1 = document.getElementById("SM1");
  const P4 = document.getElementById("SME");
  P1.volume = 1;
  P4.volume = 1;
  P1.ontimeupdate = () => {
    if (currentTrack !== "P1") return;
    if (P1.duration - P1.currentTime < 0.15) {
      loopCount++;
      if (loopCount < 3) {
        P1.currentTime = 0;
        P1.play();
      } else {
        loopCount = 0;
        currentTrack = "P4";
        P4.currentTime = 0;
        P4.play();
      }
    }
  };
  P4.ontimeupdate = () => {
    if (currentTrack !== "P4") return;
    if (P4.duration - P4.currentTime < 0.15) {
      currentTrack = "P1";
      P1.currentTime = 0;
      P1.play();
    }
  };
  currentTrack = "P1";
  P1.play();
}