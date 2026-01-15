let walls = [];
let water = [];
let stairs = [];
let triggers = [];
let floor = [];
let projectiles = [];
let buttons = [];
let images = {};
let player;
let keys = {};
let musicVolume = 0.5;
let currentTrack = null;
const T_S = 59;
let currentLevel = 1;
let defeatedEnemies = {};
let despawnedEntities = {};
const UI_WIDTH = 381;
let gameState;
let currentEnemy = null;
let currentEntity = null;
let currentTarget = null;
let currentTargetSwitch = null;
let shop = 0;
let sett = 0;
let Menusett = 0;
let first = 0;
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
let BossMaxHP = 200000;
let BossHP = BossMaxHP;
let BossLevel = 7;
let DoTLevel = 0;
let Jesus = 0;
let jumping = 0;
let startBtnHover = false;
let settingsBtnHover = false;
let respawnHover = false;
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
  images["smallDefBottle"] = loadImage('./images/smallDEFpotion.png');
  images["smallHpBottle"] = loadImage('./images/smallHPpotion.png');
  images["smallAtkBottle"] = loadImage('./images/smallATKpotion.png');
  images["defBottle"] = loadImage('./images/defBottle.png');
  images["hpBottle"] = loadImage('./images/hpBottle.png');
  images["atkBottle"] = loadImage('./images/atkBottle.png');
  images["bigDefBottle"] = loadImage('./images/bigDEFpotion.png');
  images["bigHpBottle"] = loadImage('./images/bigHPpotion.png');
  images["bigAtkBottle"] = loadImage('./images/bigATKpotion.png');
  images["Gate"] = loadImage('./images/Gate.png');
  images["GateB"] = loadImage('./images/GateB.png');
  images["GateR"] = loadImage('./images/GateR.png');
  images["GateY"] = loadImage('./images/GateY.png');
  images["Gate2"] = loadImage('./images/Gate2.png');
  images["GateB2"] = loadImage('./images/GateB2.png');
  images["GateR2"] = loadImage('./images/GateR2.png');
  images["GateY2"] = loadImage('./images/GateY2.png');
  images["cross"] = loadImage('./images/Cross.png');
  images["bluegoblin"] = loadImage('./images/BlueGoblin.png');
  images["bluegobling"] = loadImage('./images/BlueGoblinG.png');
  images["redgoblin"] = loadImage('./images/RedGoblin.png');
  images["redgobling"] = loadImage('./images/RedGoblinG.png');
  images["sandgoblin"] = loadImage('./images/SandGoblin.png');
  images["sandgobling"] = loadImage('./images/SandGoblinG.png');
  images["goblin"] = loadImage('./images/Goblin.png');
  images["gobling"] = loadImage('./images/GoblinG.png');
  images["Arrow"] = loadImage('./images/Arrow.png');
  BossMusic = loadSound('./tracks/BossMusic.m4a');
  FightMusic = loadSound('./tracks/Combat.m4a');
  StrollMusic = loadSound('./tracks/stroll_track.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gameState = "menu";
  drawStartupMenu();
}

function loadLevel(n) {
  let lvl = LEVELS[n];
  generateLevel(lvl.terrain);
  generateEnemies(lvl.enemies, n);
  generateEntities(lvl.entities, n);
}

function drawHPBar(x, y, w, h, current, max) {
  current = constrain(current, 0, max);
  let ratio = current / max;
  noStroke();
  fill(80);
  rect(x, y, w, h, 4);
  fill(200, 40, 40);
  rect(x, y, w * ratio, h, 4);
  stroke(0);
  noFill();
  rect(x, y, w, h, 4);
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

function MenuSettUI() {
  const w = VIRTUAL_WIDTH;
  const h = VIRTUAL_HEIGHT;
  const x = 0;
  const y = 0;
  const closeSize = 30;
  const sliderX = 80;
  const sliderY = 120;
  const sliderW = w - 160;
  const sliderH = 6;
  const knobR = 10;
  let mx = (mouseX - view.offsetX) / view.scale;
  let my = (mouseY - view.offsetY) / view.scale;
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
      mx >= w - closeSize - 10 &&
      mx <= w - 10 &&
      my >= 10 &&
      my <= 10 + closeSize)
  ) {
    Menusett = 0;
    gameState = "menu";
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
    mx >= sliderX &&
    mx <= sliderX + sliderW &&
    my >= sliderY - 15 &&
    my <= sliderY + 15
  ) {
    musicVolume = constrain(
      (mx - sliderX) / sliderW,
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
  if(currentLevel > 0 && currentLevel <= 2){
  image(images["smallHpBottle"], 150, 100, 120, 280);
  image(images["shop"], 195, 430 , 30, 30);
  text("Health Potion - 10 Gold", 90, 90);
  image(images["smallAtkBottle"], 620, 100, 120, 280);
  image(images["shop"], 665, 430 , 30, 30);
  text("Attack Potion - 10 Gold", 560, 90);
  image(images["smallDefBottle"], 1090, 100, 120, 280);
  image(images["shop"], 1135, 430 , 30, 30);
  text("Defence Potion - 10 Gold", 1030, 90);
  if(mouseIsPressed && m.x >= 195 && m.x <= 225 && m.y >= 430 && m.y <= 460 && gold >= price){
    player.hp += 30;
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
  }else if(currentLevel > 2 && currentLevel <= 4){
  image(images["hpBottle"], 120, 100, 200, 320);
  image(images["shop"], 195, 430 , 30, 30);
  text("Health Potion - 100 Gold", 90, 90);
  image(images["atkBottle"], 590, 100, 200, 320);
  image(images["shop"], 665, 430 , 30, 30);
  text("Attack Potion - 100 Gold", 560, 90);
  image(images["defBottle"], 1050, 100, 200, 320);
  image(images["shop"], 1135, 430 , 30, 30);
  text("Defence Potion - 100 Gold", 1030, 90);
  if(mouseIsPressed && m.x >= 195 && m.x <= 225 && m.y >= 430 && m.y <= 460 && gold >= price * 10){
    player.hp += 300;
    gold -= price *10;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 665 && m.x <= 695 && m.y >= 430 && m.y <= 460 && gold >= price * 10){
    player.atk += 30;
    gold -= price *10;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 1135 && m.x <= 1165 && m.y >= 430 && m.y <= 460 && gold >= price *10){
    player.def += 30;
    gold -= price *10;
    mouseIsPressed = false;
  }
  }else{
    image(images["bigHpBottle"], 50, 100, 320, 320);
  image(images["shop"], 195, 430 , 30, 30);
  text("Health Potion - 1000 Gold", 90, 90);
  image(images["bigAtkBottle"], 520, 100, 320, 320);
  image(images["shop"], 665, 430 , 30, 30);
  text("Attack Potion - 1000 Gold", 560, 90);
  image(images["bigDefBottle"], 1000, 100, 320, 320);
  image(images["shop"], 1135, 430 , 30, 30);
  text("Defence Potion - 1000 Gold", 1030, 90);
  if(mouseIsPressed && m.x >= 195 && m.x <= 225 && m.y >= 430 && m.y <= 460 && gold >= price *100){
    player.hp += 3000;
    gold -= price *100;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 665 && m.x <= 695 && m.y >= 430 && m.y <= 460 && gold >= price *100){
    player.atk += 300;
    gold -= price *100;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 1135 && m.x <= 1165 && m.y >= 430 && m.y <= 460 && gold >= price *100){
    player.def += 300;
    gold -= price *100;
    mouseIsPressed = false;
  }
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
  image(images["shop"], 260, 900, 30, 30);
  text("Jesus perk - 3 perk points", 160 , 870);
  image(images["shop"], 690, 900, 30, 30);
  text("Damage over time perk - 1 point per level", 510 , 870);
  text(`Damage over time perk current level = ${DoTLevel}` , 510 , 955);
  image(images["shop"], 1120, 900 , 30, 30);
  text("WIP", 1100 , 870);
   if(mouseIsPressed && m.x >= 260 && m.x <= 290 && m.y >= 900 && m.y <= 930 && perks >= 3){
    Jesus = 1;
    perks -= 3;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 690 && m.x <= 720 && m.y >= 900 && m.y <= 930 && perks >= 1){
    DoTLevel++;
    perks -= 1;
    mouseIsPressed = false;
  }else if(mouseIsPressed && m.x >= 1120 && m.x <= 1150 && m.y >= 900 && m.y <= 930 && perks >= 3){
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
  text("Perk points: " + perks, 20, 100);
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
  image(images["coins"], 20, 600, 30, 30);
  text(`: ${currentTarget.goldGain}`, 54, 620);
  image(images["XP"], 20, 630, 30, 30);
  text(`: ${currentTarget.expGain}`, 54, 650);
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

function mousePressed() {
  if (gameState === "boss") {
    let m = getWorldMouse();

    projectiles.push(
      new Projectile(player.x + player.size / 2, player.y + player.size / 2, m.x, m.y, images["Arrow"])
    );
  }
}

function draw() {
  if (gameState == "SETTMENU") {
    MenuSettUI();
    return;
  }
  if (gameState == "menu") {
    drawStartupMenu();
    return;
  }
  if (first == 0) {
    buttons.push(new Button(-360, 10, 30, 30, "settings", "sett"));
    buttons.push(new Button(-320, 10, 30, 30, "shop", "shop"));
    first = 1;
  }
  let scaleX = windowWidth / VIRTUAL_WIDTH;
  let scaleY = windowHeight / VIRTUAL_HEIGHT;
  view.scale = min(scaleX, scaleY);
  view.offsetX = (windowWidth - VIRTUAL_WIDTH * view.scale) / 2;
  view.offsetY = (windowHeight - VIRTUAL_HEIGHT * view.scale) / 2;
  if (currentLevel === BossLevel){
    background(images["bg"]);
    gameState = "boss";
  } else if (currentLevel != BossLevel && gameState == "boss") {
    background(0);
    gameState = "explore";
  }
  textAlign(LEFT);
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
  if (keyIsDown(UP_ARROW)|| keyIsDown(87)) {
    if (!player.jumping && (player.y > VIRTUAL_HEIGHT - T_S*2.7)) {
      player.jumping = true;
    }
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
    if(jumping == 0){
    player.move("up", walls, water, enemies);
    }
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
  for (let i = projectiles.length - 1; i >= 0; i--) {
  let p = projectiles[i];
  p.update();

  if (gameState === "boss" && enemies.length > 0) {
    let boss = enemies[0];

    if (p.hitsBoss(boss)) {
      BossHP -= p.damage;
      p.dead = true;

      if (BossHP <= 0) {
        BossHP = 0;
      }
    }
  }

  if (p.dead) {
    projectiles.splice(i, 1);
  } else {
    p.draw();
  }
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
  updateHoverTarget(enemies, buttons, entities);
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
    drawGameOver();
  }
  updateMusic();
  FightMusic.setVolume(musicVolume);
  BossMusic.setVolume(musicVolume);
  StrollMusic.setVolume(musicVolume);
  if (gameState === "boss") {
    drawHPBar(510, 40, 500, 10, BossHP, BossMaxHP);
    if (player.jumping) {
      player.jump(walls, water, enemies);
    } else {
      player.move("down", walls, water, enemies);
    }
  }
pop();
}

function drawStartupMenu() {
  if (images["bg"]) {
    image(images["bg"], 0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  } else {
    background(10);
  }
  noStroke();
  fill(0, 170);
  rect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text("Maze of Emblem", VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 220);
  const bw = 320;
  const bh = 70;
  const bx = VIRTUAL_WIDTH / 2 - bw / 2;
  const startY = VIRTUAL_HEIGHT / 2 - 40;
  const gap = 25;
  let mx = (mouseX - view.offsetX) / view.scale;
  let my = (mouseY - view.offsetY) / view.scale;
  // ---------- START BUTTON ----------
  startBtnHover =
  mx >= bx &&
  mx <= bx + bw &&
  my >= startY &&
  my <= startY + bh;
  fill(startBtnHover ? color(90, 220, 120) : color(60, 180, 80));
  rect(bx, startY, bw, bh, 10);
  fill(255);
  textSize(30);
  text("START GAME", bx + bw / 2, startY + bh / 2);
  if (mouseIsPressed && startBtnHover) {
    respawn();
    mouseIsPressed = false;
    return;
  }
  // ---------- SETTINGS BUTTON ----------
  let setY = startY + bh + gap;
  settingsBtnHover =
  mx >= bx &&
  mx <= bx + bw &&
  my >= setY &&
  my <= setY + bh;
  fill(settingsBtnHover ? color(100, 100, 130) : color(70, 70, 90));
  rect(bx, setY, bw, bh, 10);
  fill(255);
  textSize(28);
  text("SETTINGS", bx + bw / 2, setY + bh / 2);
  if (mouseIsPressed && settingsBtnHover) {
    Menusett = 1;
    gameState = "SETTMENU";
    mouseIsPressed = false;
    return;
  }
  textAlign(LEFT);
}

function drawGameOver() {
  let m = getWorldMouse();
  noStroke();
  fill(0, 255);
  rect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  fill(255, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(64);
  text("GAME OVER", VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 120);
  textSize(24);
  fill(200);
  text("You have fallen…", VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 70);
  const bw = 260;
  const bh = 70;
  const bx = VIRTUAL_WIDTH / 2 - bw / 2;
  const by = VIRTUAL_HEIGHT / 2 + 10;
  respawnHover =
  m.x >= bx &&
  m.x <= bx + bw &&
  m.y >= by &&
  m.y <= by + bh;
  fill(respawnHover ? color(80, 220, 80) : color(60, 170, 60));
  rect(bx, by, bw, bh, 10);
  fill(255);
  textSize(30);
  text("RESPAWN", bx + bw / 2, by + bh / 2);
  if (respawnHover && mouseIsPressed) {
    mouseIsPressed = false;
    respawn();
  }
}

function respawn() {
  if (Math.round(musicVolume * 100) == 86) {
    PlayerHP = 200000;
    PlayerAtk = 3000;
    PlayerDef = 3000;
    defeatedEnemies = {};
    despawnedEntities = {};
    currentLevel = 7;
    loadLevel(currentLevel);
    gameState = "explore";
    gold = 200;
    perks = 5;
    exp = 0;
    blueKey = 1;
    yellowKey = 1;
    redKey = 1;
    player = new Player(T_S, VIRTUAL_HEIGHT - 3*T_S, T_S/1.3, images["FenorisL1"], images["FenorisR1"]);
  } else {
    PlayerHP = 1124;
    PlayerAtk = 274;
    PlayerDef = 238;
    defeatedEnemies = {};
    despawnedEntities = {};
    currentLevel = 7;
    loadLevel(currentLevel);
    gameState = "explore";
    gold = 156;
    perks = 7;
    exp = 54;
    blueKey = 1;
    yellowKey = 1;
    redKey = 1;
    player = new Player(T_S, T_S, T_S/1.3, images["FenorisL1"], images["FenorisR1"]);
  }
  
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
  if (gameState === "explore") {
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
  }
  for (let button of buttons) {
    if (
      m.x >= button.x &&
      m.x <= button.x + button.w &&
      m.y >= button.y &&
      m.y <= button.y + button.h &&
      gameState != "combat" &&
      gameState != "gameover"
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
    x += (windowWidth - UI_WIDTH) - 2.2*T_S;
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
      if (tile === "7" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 8, key));
      }
      if (tile === "8" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 9, key));
      }
      if (tile === "9" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 10, key));
      }
      if (tile === "a" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 11, key));
      }
      if (tile === "b" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 12, key));
      }
      if (tile === "c" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 13, key));
      }
      if (tile === "d" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 14, key));
      }
      if (tile === "e" && !defeatedEnemies[key]) {
        enemies.push(new Enemy(px, py, T_S, T_S, 15, key));
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
        entities.push(new Entity(px + T_S/3.3, py + T_S/20, 24, 56, 7, key));
      }
      if (tile === "8" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/3.3, py + T_S/20, 24, 56, 8, key));
      }
      if (tile === "9" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/3.3, py + T_S/20, 24, 56, 9, key));
      }
      if (tile === "i" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/4, py + T_S/6, 30, 48, "i", key));
      }
      if (tile === "j" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/4, py + T_S/6, 30, 48, "j", key));
      }
      if (tile === "k" && !despawnedEntities[key]) {
        entities.push(new Entity(px + T_S/4, py + T_S/6, 30, 48, "k", key));
      }
      if (tile === "l" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "l", key));
      }
      if (tile === "m" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "m", key));
      }
      if (tile === "n" && !despawnedEntities[key]) {
        entities.push(new Entity(px, py, T_S, T_S, "n", key));
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
  if (currentLevel === BossLevel) {
    playMusic(BossMusic);
  } 
  else if (gameState === "combat" || gameState === "combatResult") {
    playMusic(FightMusic);
  } 
  else {
    playMusic(StrollMusic);
  }
}
