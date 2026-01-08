let walls = [];
let water = [];
let stairs = [];
let triggers = [];
let floor = [];
let buttons = [];
let images = {};
let player;
let keys = {};
let musicVolume = 0.5;
let currentTrack = null;
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
let perks = 0;
let PlayerHP = 100;
let PlayerAtk = 10;
let PlayerDef = 10;
let statOffset = 0;
const COMBAT_INTERVAL = 1000;
let combatResult = {
  victory: false,
  startTime: 0
};
const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 995;
let view = {
  scale: 1,
  offsetX: 0,
  offsetY: 0
};

function preload() {
  images["FenorisL1"] = loadImage('./images/FenorisL1Hit.png');
  images["FenorisR1"] = loadImage('./images/FenorisR1Hit.png');
  images["bg"] = loadImage('./images/background.png');
  images["stone"] = loadImage('./images/Stone2.png');
  images["stairs"] = loadImage('./images/Stairs.png');
  images["GreenSlime"] = loadImage('./images/GreenSlime.png');
  images["GoldenSlime"] = loadImage('./images/GoldenSlime.png');
  images["PinkSlime"] = loadImage('./images/PinkSlime.png');
  images["PurpleSlime"] = loadImage('./images/PurpleSlime.png');
  images["RedSlime"] = loadImage('./images/RedSlime.png');
  images["WhiteSlime"] = loadImage('./images/WhiteSlime.png');
  images["YellowSlime"] = loadImage('./images/YellowSlime.png');
  images["SpiderKing"] = loadImage('./images/BigSpider.png');
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
  images["Gate2"] = loadImage('./images/Gate2.png');
  images["GateB2"] = loadImage('./images/GateB2.png');
  images["GateR2"] = loadImage('./images/GateR2.png');
  images["GateY2"] = loadImage('./images/GateY2.png');
  images["cross"] = loadImage('./images/Cross.png');
  BossMusic = loadSound('./tracks/BossMusic.m4a');
  FightMusic = loadSound('./tracks/Combat.m4a');
  StrollMusic = loadSound('./tracks/stroll_track.wav');
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
  const w = VIRTUAL_WIDTH - UI_WIDTH;
  const h = VIRTUAL_HEIGHT;
  const x = 0;
  const y = 0;
  const closeSize = 30;
  const sliderX = 80;
  const sliderY = 120;
  const sliderW = w - 160;
  const sliderH = 6;
  const knobR = 10;
  let m = getWorldMouse();
  noStroke();
  fill(20, 220);
  rect(x, y, w, h);
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text("SETTINGS", w / 2, 40);
  image(images["cross"], w - closeSize - 10, 10, closeSize, closeSize);
  if (
    keyIsDown(ESCAPE) ||
    (mouseIsPressed &&
      m.x >= w - closeSize - 10 &&
      m.x <= w - 10 &&
      m.y >= 10 &&
      m.y <= 10 + closeSize)
  ) {
    sett = 0;
    gameState = "explore";
    return;
  }
  textAlign(LEFT);
  textSize(16);
  text("Master Volume", sliderX, sliderY - 20);
  stroke(150);
  strokeWeight(sliderH);
  line(sliderX, sliderY, sliderX + sliderW, sliderY);
  let knobX = sliderX + musicVolume * sliderW;
  noStroke();
  fill(255);
  circle(knobX, sliderY, knobR * 2);
  if (
    mouseIsPressed &&
    m.x >= sliderX &&
    m.x <= sliderX + sliderW &&
    m.y >= sliderY - 15 &&
    m.y <= sliderY + 15
  ) {
    musicVolume = constrain(
      (m.x - sliderX) / sliderW,
      0,
      1
    );
  }
  textAlign(RIGHT);
  textSize(14);
  text(Math.round(musicVolume * 100) + "%", sliderX + sliderW, sliderY + 30);
}

function shopUI() {
  const w = VIRTUAL_WIDTH - UI_WIDTH;
  const h = VIRTUAL_HEIGHT;
  const x = 0;
  const y = 0;
  const closeSize = 30;
  let price = 10;
  let m = getWorldMouse();
  noStroke();
  fill(20, 220);
  rect(x, y, w, h);
  image(images["cross"], w - closeSize, y, closeSize, closeSize);
  if (keyIsDown(ESCAPE) || mouseIsPressed && m.x >= w - closeSize && m.x <= w && m.y >= y && m.y <= y + closeSize) {
    shop = 0;
    gameState = "explore";
  }
  fill(255);
  textAlign(LEFT);
  textSize(22);
  image(images["hpBottle"], 110, 100, 200, 320);
  image(images["shop"], 195, 430 , 30, 30);
  text("Health Potion - 10 Gold", 90, 90);
  image(images["atkBottle"], 580, 100, 200, 320);
  image(images["shop"], 665, 430 , 30, 30);
  text("Attack Potion - 10 Gold", 560, 90);
  image(images["defBottle"], 1050, 100, 200, 320);
  image(images["shop"], 1135, 430 , 30, 30);
  text("Defence Potion - 10 Gold", 1030, 90);
  if(mouseIsPressed && m.x >= 195 && m.x <= 225 && m.y >= 430 && m.y <= 460 && gold >= price){
    player.hp += 10;
    gold -= price;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 665 && m.x <= 695 && m.y >= 430 && m.y <= 460 && gold >= price){
    player.atk += 3;
    gold -= price;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 1135 && m.x <= 1165 && m.y >= 430 && m.y <= 460 && gold >= price){
    player.def += 3;
    gold -= price;
    mouseIsPressed = false;
  }
  image(images["yellowKey"],110, 600, 330, 165);
  image(images["shop"], 260, 775 , 30, 30);
  text("Yellow key - 8 Gold", 190 , 590);
  image(images["blueKey"],540, 600, 330, 165);
  image(images["shop"], 690, 775 , 30, 30);
  text("Blue key - 20 Gold", 620 , 590);
  image(images["redKey"],970, 600, 330, 165);
  image(images["shop"], 1120, 775 , 30, 30);
  text("Red key - 40 Gold", 1050 , 590);
   if(mouseIsPressed && m.x >= 260 && m.x <= 290 && m.y >= 775 && m.y <= 805 && gold >= 8){
    yellowKey++;
    gold -= 8;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 690 && m.x <= 720 && m.y >= 775 && m.y <= 805 && gold >= 20){
    blueKey++;
    gold -= 20;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 1120 && m.x <= 1150 && m.y >= 775 && m.y <= 805 && gold >= 40){
    redKey++;
    gold -= 40;
    mouseIsPressed = false;
  }
}

function drawCombatWindow() {
  const w = 600;
  const h = 300;
  const x = VIRTUAL_WIDTH / 2 - UI_WIDTH;
  const y = VIRTUAL_HEIGHT / 2 - UI_WIDTH / 2;
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
function combatResultWindow(victory) {
  const w = 600;
  const h = 300;
  const x = VIRTUAL_WIDTH / 2 - UI_WIDTH;
  const y = VIRTUAL_HEIGHT / 2 - UI_WIDTH / 2;
  fill(20, 220);
  stroke(255);
  rect(x, y, w, h, 10);
  image(images["fight"], x + 245, y + 180, 115, 75);
  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(16);
  if(victory == 1) {
    text("VICTORY", x + w / 2, y + 30);
    image(images["coins"], x + w / 2 - 20, y + 60, 30, 30);
    textSize(14);
    text(
      `: ${currentEnemy.goldGain}\n`,x + w / 2 + 20,y + 80);
    image(images["XP"], x + w / 2 - 20, y + 100, 30, 30);
    text(`: ${currentEnemy.expGain}`,x + w / 2 + 20,y + 120);
  } else {
    text("DEFEAT", x + w / 2, y + 30);
    text("You have fallen...", x + w / 2, y + 80);
  }
  image(images["FenorisR1"], x + w / 8, y + 180, T_S, T_S);
  image(currentEnemy.img, x + w / 1.3, y + 180, T_S, T_S);
  textAlign(LEFT);
}

function drawUI() {
  noStroke();
  fill(30);
  rect(0, 0, UI_WIDTH, VIRTUAL_HEIGHT);
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
  if(currentTarget && currentTargetSwitch == 4) {
    textSize(16);
  image(currentTarget.img, 150, 490, currentTarget.w*3, currentTarget.h*3);
  text(`${currentTarget.name}`, 20, 500);
  textSize(14);
  if (currentTarget.hp != 0) {
    image(images["heart"], 20, 510, 30, 30);
    text(`: +${currentTarget.hp}`, 54, 530);
    statOffset+=30;
  }
  if (currentTarget.atk != 0) {
    image(images["sword"], 20, 510 + statOffset, 30, 30);
    text(`: +${currentTarget.atk}`, 54, 530 + statOffset);
    statOffset+=30;
  }
  if (currentTarget.def != 0) {
    image(images["shield"], 20, 510 + statOffset, 30, 30);
    text(`: +${currentTarget.def}`, 54, 530 + statOffset);
    statOffset+=30;
  }
  if (currentTarget.goldGain != 0) {
    image(images["coins"], 20, 510 + statOffset, 30, 30);
    text(`: +${currentTarget.goldGain}`, 54, 530 + statOffset);
    statOffset+=30;
  }
  }
  statOffset = 0;
  stroke(80);
  line(UI_WIDTH - 10, 0, UI_WIDTH - 10, VIRTUAL_HEIGHT);
}

function draw() {
  let scaleX = windowWidth / VIRTUAL_WIDTH;
  let scaleY = windowHeight / VIRTUAL_HEIGHT;
  view.scale = min(scaleX, scaleY);
  view.offsetX = (windowWidth - VIRTUAL_WIDTH * view.scale) / 2;
  view.offsetY = (windowHeight - VIRTUAL_HEIGHT * view.scale) / 2;
  background(0);
  push();
  translate(view.offsetX, view.offsetY);
  scale(view.scale);
  drawUI();
  translate(UI_WIDTH, 0);
  if(gameState === "boss") {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.move("left", walls, water, enemies);
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.move("right", walls, water, enemies);
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.jump(walls, water, enemies);
  }
  }
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
  if (exp >= 100) {
    exp-=100;
    perks++;
  }
  //player.hitbox();
  if (gameState === "explore") {
    updateHoverTarget(enemies, buttons, entities);
  }
  if (currentTarget && currentTargetSwitch == 3 && mouseIsPressed) {
    shop = 1;
    console.log("shop");
    gameState = "INUI"
    currentTargetSwitch = 0;
  }
  if (currentTarget && currentTargetSwitch == 2 && mouseIsPressed) {
    sett = 1;
    console.log("sett");
    gameState = "INUI"
    currentTargetSwitch = 0;
  }
  if (shop == 1)shopUI();
  if (sett == 1)settUI();
  if (gameState === "combat") {
    updateCombat();
    drawCombatWindow();
  }
  if (gameState === "combatResult") {
    if (combatResult.victory) {
      combatResultWindow(1);
    } else {
      combatResultWindow(0);
    }
  if (millis() - combatResult.startTime > 2000) {
    if (combatResult.victory) {
      gameState = "explore";
    } else {
      gameState = "gameover";
    }
  }
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
  updateMusic();
  if (currentLevel === 10){
    background(images["bg"]);
    gameState = "boss";
  }
  FightMusic.setVolume(musicVolume);
  BossMusic.setVolume(musicVolume);
  StrollMusic.setVolume(musicVolume);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getWorldMouse() {
  let x = mouseX - view.offsetX;
  let y = mouseY - view.offsetY;
  x /= view.scale;
  y /= view.scale;
  x -= UI_WIDTH;
  return { x, y };
}

function updateHoverTarget(enemies, buttons, entities) {
  currentTarget = null;
  let m = getWorldMouse();
  for (let enemy of enemies) {
    if (
      m.x >= enemy.x &&
      m.x <= enemy.x + enemy.w &&
      m.y >= enemy.y &&
      m.y <= enemy.y + enemy.h
    ) {
      currentTarget = enemy;
      currentTargetSwitch = 1;
      return;
    }
  }
  for (let entity of entities) {
    if (entity.inter == "container") {
      if (
      m.x >= entity.x &&
      m.x <= entity.x + entity.w &&
      m.y >= entity.y &&
      m.y <= entity.y + entity.h
    ) {
      currentTarget = entity;
      currentTargetSwitch = 4;
      return;
    }
    }
  }
  for (let button of buttons) {
    if (
      m.x >= button.x &&
      m.x <= button.x + button.w &&
      m.y >= button.y &&
      m.y <= button.y + button.h
    ) {
      if(button.t == "sett") {
        currentTarget = button;
        currentTargetSwitch = 2;
        return;
      } else if(button.t == "shop"){
      currentTarget = button;
      currentTargetSwitch = 3;
      return;
      }
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
      if (tile === "Z" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S*4, T_S*6, 7, key));
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
      if (tile === "b" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "b", key));
      }
      if (tile === "c" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "c", key));
      }
      if (tile === "d" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "d", key));
      }
      if (tile === "e" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "e", key));
      }
      if (tile === "f" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "f", key));
      }
      if (tile === "g" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "g", key));
      }
      if (tile === "h" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "h", key));
      }
    }
  }
}

function stopAllMusic() {
  if (BossMusic.isPlaying()) BossMusic.stop();
  if (FightMusic.isPlaying()) FightMusic.stop();
  if (StrollMusic.isPlaying()) StrollMusic.stop();
}

function playMusic(track) {
  if (currentTrack === track)return;
  stopAllMusic();
  track.setVolume(musicVolume);
  track.loop();
  currentTrack = track;
}

function updateMusic() {
  if (currentLevel === 10) {
    playMusic(BossMusic);
  } 
  else if (gameState === "combat" || gameState === "combatResult") {
    playMusic(FightMusic);
  } 
  else {
    playMusic(StrollMusic);
  }
}

function setMusicVolume(v) {
  musicVolume = constrain(v, 0, 1);
  if (currentMusic) {
    currentMusic.setVolume(musicVolume);
  }
}
