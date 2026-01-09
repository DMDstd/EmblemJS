const ENEMY_TYPES = {
    0: {
    name: "Slime",
    hp: 20,
    atk: 20,
    def: 5,
    img: "GreenSlime",
    goldGain: 2,
    expGain: 3
  },
    1: {
    name: "Red Slime",
    hp: 50,
    atk: 40,
    def: 2,
    img: "RedSlime",
    goldGain: 4,
    expGain: 7
  },
    2: {
    name: "Golden Slime",
    hp: 20,
    atk: 4,
    def: 4,
    img: "GoldenSlime",
    goldGain: 20,
    expGain: 1
  },
    3: {
    name: "Yellow Slime",
    hp: 20,
    atk: 10,
    def: 10,
    img: "YellowSlime",
    goldGain: 3,
    expGain: 4
  },
    4: {
    name: "Purple Slime",
    hp: 250,
    atk: 80,
    def: 60,
    img: "PurpleSlime",
    goldGain: 8,
    expGain: 12
  },
    5: {
    name: "White Slime",
    hp: 200,
    atk: 125,
    def: 50,
    img: "WhiteSlime",
    goldGain: 15,
    expGain: 20
  },
    6: {
    name: "Pink Slime",
    hp: 600,
    atk: 110,
    def: 80,
    img: "PinkSlime",
    goldGain: 17,
    expGain: 22
  },
    7: {
    name: "The Chitin King",
    hp: BossMaxHP,
    atk: 5000,
    def: 2000,
    img: "SpiderKing",
    goldGain: 0,
    expGain: 0
  }
};

let round = 0;

function startCombat(enemy) {
  currentEnemy = enemy;
  gameState = "combat";
  lastCombatTick = millis();
  console.log("Combat started with:", enemy);
}

function updateCombat() {
  if (millis() - lastCombatTick < COMBAT_INTERVAL) return;
  lastCombatTick = millis();
  // Enemy → Player
  if (round <= 15) {
    round++;
  }
  let DoT = round * DoTLevel;
  let dmgToPlayer = currentEnemy.atk - player.def;
  if (dmgToPlayer >= 0) {
    player.hp -= dmgToPlayer;
  }
  // Player → Enemy
  let dmgToEnemy = player.atk - currentEnemy.def + DoT;
  if (dmgToEnemy >= 0) {
    currentEnemy.hp -= dmgToEnemy;
  }
  // Check outcomes
  if (player.hp <= 0) {
    player.hp = 0;
    DoT = 0;
    round = 0;
    endCombat(false);
  } else if (currentEnemy.hp <= 0) {
    DoT = 0;
    round = 0;
    endCombat(true);
  } else if (dmgToPlayer <= 0 && dmgToEnemy <= 0){
    DoT = 0;
    round = 0;
    player.hp = 0;
    endCombat(false);
  }
}

function endCombat(victory) {
  gameState = "combatResult";
  combatResult.startTime = millis();
  combatResult.victory = victory;
  if (victory) {
    gold += currentEnemy.goldGain;
    exp += currentEnemy.expGain;
    currentEnemy.die();
    enemies = enemies.filter(e => e !== currentEnemy);
  }
}

class Enemy {
  constructor(x, y, w, h, type, key) {
    let cfg = ENEMY_TYPES[type];
    this.key = key;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = cfg.name;
    this.goldGain = cfg.goldGain;
    this.expGain = cfg.expGain;
    this.hp = cfg.hp;
    this.atk = cfg.atk;
    this.def = cfg.def;
    this.img = images[cfg.img];
  }
  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
  attack(player) {
    if((this.atk - player.def)>=0)player.hp -= (this.atk - player.def);
  }
  takeDamage() {
    if((player.atk - this.def)>=0)this.hp -= (player.atk - this.def);
  }
  die() {
    defeatedEnemies[this.key] = true;
  }
}
