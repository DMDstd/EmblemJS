let walls = [];
let water = [];
let stairs = [];
let triggers = [];
let floor = [];
let buttons = [];
let images = {};
let player;
let keys = {};
let loopCount = 0;
let currentTrack = "P1";
const T_S = 59;
let currentLevel = 2;
let defeatedEnemies = {};
let despawnedEntities = {};
const UI_WIDTH = 381;
let gameState = "explore";
let currentEnemy = null;
let currentEntity = null;
let currentTarget = null;
let currentTargetSwitch = null;
let shop = 0;
let sett = 0;
let lastCombatTick = 0;
let yellowKey = 1;
let blueKey = 1;
let redKey = 1;
let gold = 0;
let exp = 0;
let PlayerHP = 100;
let PlayerAtk = 10;
let PlayerDef = 10;
const COMBAT_INTERVAL = 1000;

function preload() {

  images["FenorisL1"] = loadImage('./images/FenorisL1Hit.png');
  images["FenorisR1"] = loadImage('./images/FenorisR1Hit.png');
  images["stone"] = loadImage('./images/Stone2.png');
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
  images["shield"] = loadImage('./images/shield.png');
  images["heart"] = loadImage('./images/heart.png');
  images["fight"] = loadImage('./images/fight.png');
  images["coins"] = loadImage('./images/coins.png');
  images["settings"] = loadImage('./images/settings.png');
  images["shop"] = loadImage('./images/shop.png');
  images["water"] = loadImage('./images/water.png');
  images["sword"] = loadImage('./images/sword.png');
  images["XP"] = loadImage('./images/XP.png');
  images["defBottle"] = loadImage('./images/defBottle.png');
  images["hpBottle"] = loadImage('./images/hpBottle.png');
  images["atkBottle"] = loadImage('./images/atkBottle.png');
  images["Gate"] = loadImage('./images/Gate.png');
  images["GateB"] = loadImage('./images/GateB.png');
  images["GateR"] = loadImage('./images/GateR.png');
  images["GateY"] = loadImage('./images/GateY.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(T_S, T_S, T_S/1.3, images["FenorisL1"], images["FenorisR1"]);
  buttons.push(new Button(-360, 10, 30, 30, "settings", "sett"));
  buttons.push(new Button(-320, 10, 30, 30, "shop", "shop"));
  loadLevel(currentLevel);
}

function loadLevel(n) {
  let lvl = LEVELS[n];
  generateLevel(lvl.terrain);
  generateEnemies(lvl.enemies, n);
  generateEntities(lvl.entities, n);
}

function settUI() {
  const w = 1200;
  const h = 800;
  const x = windowWidth / 2 - UI_WIDTH;
  const y = windowHeight / 2 - UI_WIDTH / 2;
  fill(20, 220);
  stroke(255);
  rect(x, y, w, h, 10);
}

function shopUI() {
  const w = 600;
  const h = 300;
  const x = windowWidth / 2 - UI_WIDTH;
  const y = windowHeight / 2 - UI_WIDTH / 2;
  fill(20, 220);
  stroke(255);
  rect(x, y, w, h, 10);
}

function drawCombatWindow() {
  const w = 600;
  const h = 300;
  const x = windowWidth / 2 - UI_WIDTH;
  const y = windowHeight / 2 - UI_WIDTH / 2;
  fill(20, 220);
  stroke(255);
  rect(x, y, w, h, 10);
  image(images["fight"], x + 245, y + 180, 115, 75);
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
  image(images["FenorisR1"], x + w / 8, y + 180, T_S, T_S);
  image(currentEnemy.img, x + w / 1.3, y + 180, T_S, T_S);
  textAlign(LEFT);
}

function drawUI() {
  noStroke();
  fill(30);
  rect(0, 0, UI_WIDTH, windowHeight);
  fill(255);
  textSize(16);
  text(`Floor: ${currentLevel}`, 20, 60);
  image(images["FenorisR1"], 150, 50, 200, 300);
  text("Fenoris", 20, 100);
  textSize(14);
  image(images["heart"], 20, 110, 30, 30);
  text(": " + player.hp, 54, 130);
  image(images["sword"], 20, 140, 30, 30);
  text(": " + player.atk, 54, 160);
  image(images["shield"], 20, 170, 30, 30);
  text(": " + player.def, 54, 190);
  image(images["coins"], 20, 200, 30, 30);
  text(": " + gold, 54, 220);
  image(images["XP"], 20, 230, 30, 30);
  text(": " + exp, 54, 250);
  image(images["yellowKey"], 20, 270, 60, 30);
  text(": " + yellowKey, 84, 290);
  image(images["blueKey"], 20, 300, 60, 30);
  text(": " + blueKey, 84, 320);
  image(images["redKey"], 20, 330, 60, 30);
  text(": " + redKey, 84, 350);
  if(currentTarget && currentTargetSwitch == 1) {
    textSize(16);
  image(currentTarget.img, 150, 490, 100, 100);
  text(`${currentTarget.name}`, 20, 500);
  textSize(14);
  image(images["heart"], 20, 510, 30, 30);
  text(`: ${currentTarget.hp}`, 54, 530);
  image(images["sword"], 20, 540, 30, 30);
  text(`: ${currentTarget.atk}`, 54, 560);
  image(images["shield"], 20, 570, 30, 30);
  text(`: ${currentTarget.def}`, 54, 590);
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
    player.move("left", walls, water, enemies);
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.move("right", walls, water, enemies);
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.move("up", walls, water, enemies);
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.move("down", walls, water, enemies);
  }
  }
  for (let floors of floor) {
    floors.draw();
  }
  for (let wall of walls) {
    wall.draw();
  }
  for (let w of water) {
    w.draw();
  }
  for (let stair of stairs) {
    stair.draw();
  }
  for (let obj of triggers) {
    if(obj.checkTrigger(player))loadLevel(currentLevel);
    //obj.hitbox();
  }
  for (let e of enemies) {
    e.show();
  }
  for (let e of entities) {
    e.show();
  }
  for (let b of buttons) {
    b.draw();
  }
  player.draw();
  //player.hitbox();
  if (gameState === "explore") {
    updateHoverTarget(enemies, buttons);
  }
  if (currentTarget && currentTargetSwitch == 3 && mouseIsPressed) {
    shop = 1;
    gameState = "INUI"
  }
  if (currentTarget && currentTargetSwitch == 2 && mouseIsPressed) {
    sett = 1;
    gameState = "INUI"
  }
  if (shop == 1)shopUI();
  if (sett == 1)settUI();
  if (gameState === "combat") {
    updateCombat();
    drawCombatWindow();
  }
  if (gameState === "gameover") {
    noStroke();
    background(0);
    fill(255, 0, 0);
    textAlign(CENTER);
    textSize(32);
    text("GAME OVER", windowWidth / 3.3, windowHeight / 2.5);
    fill(0, 255, 0);
    textSize(26);
    text("RESPAWN", windowWidth / 3.3, windowHeight / 2);
    textAlign(LEFT);
  } 
}

function updateHoverTarget(enemies, buttons) {
  currentTarget = null;
  const mx = mouseX - UI_WIDTH;
  const my = mouseY;
  for (let enemy of enemies) {
    if (
      mx >= enemy.x &&
      mx <= enemy.x + enemy.w &&
      my >= enemy.y &&
      my <= enemy.y + enemy.h
    ) {
      currentTarget = enemy;
      currentTargetSwitch = 1;
      return;
    }
  }
  for (let button of buttons) {
    if (
      mx >= button.x &&
      mx <= button.x + button.w &&
      my >= button.y &&
      my <= button.y + button.h
    ) {
      if(button.t == "sett") {
        currentTarget = button;
        currentTargetSwitch = 2;
        return;
      }
      currentTarget = button;
      currentTargetSwitch = 3;
      return;
    }
  }
  currentTarget = null;
  currentTargetSwitch = null;
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
  water = [];
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
      } else if (level[y][x] === "4") {
        water.push(new Water(x * T_S, y * T_S, T_S));
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
        enemies.push(new Enemy(px, py, T_S, T_S, 0, key));
      }
      if (tile === "1" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 1, key));
      }
      if (tile === "2" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 2, key));
      }
      if (tile === "3" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 3, key));
      }
      if (tile === "4" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 4, key));
      }
      if (tile === "5" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 5, key));
      }
      if (tile === "6" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 6, key));
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
      if (tile === "7" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/4, py + T_S/6, 30, 48, 7, key));
      }
      if (tile === "8" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/4, py + T_S/6, 30, 48, 8, key));
      }
      if (tile === "9" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/4, py + T_S/6, 30, 48, 9, key));
      }
      if (tile === "a" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "a", key));
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