const ENEMY_TYPES = {
    0: {
    name: "Slime",
    hp: 20,
    atk: 20,
    def: 5,
    img: "GreenSlime",
    goldGain: 2,
    expGain: 2
  },
    1: {
    name: "Red Slime",
    hp: 50,
    atk: 40,
    def: 2,
    img: "RedSlime",
    goldGain: 2,
    expGain: 2
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
    name: "Pink Slime",
    hp: 20,
    atk: 4,
    def: 4,
    img: "PinkSlime",
    goldGain: 2,
    expGain: 2
  },
    4: {
    name: "Purple Slime",
    hp: 20,
    atk: 4,
    def: 4,
    img: "PurpleSlime",
    goldGain: 2,
    expGain: 2
  },
    5: {
    name: "White Slime",
    hp: 20,
    atk: 120,
    def: 5,
    img: "WhiteSlime",
    goldGain: 2,
    expGain: 2
  },
    6: {
    name: "Yellow Slime",
    hp: 20,
    atk: 4,
    def: 4,
    img: "YellowSlime",
    goldGain: 2,
    expGain: 2
  }
};

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
  let dmgToPlayer = currentEnemy.atk - player.def;
  if (dmgToPlayer >= 0) {
    player.hp -= dmgToPlayer;
  }
  // Player → Enemy
  let dmgToEnemy = player.atk - currentEnemy.def;
  if (dmgToEnemy >= 0) {
    currentEnemy.hp -= dmgToEnemy;
  }
  // Check outcomes
  if (currentEnemy.hp <= 0) {
    endCombat(true);
  } else if (player.hp <= 0) {
    endCombat(false);
  }
}

function endCombat(victory) {
  if (victory) {
    gold += currentEnemy.goldGain;
    exp += currentEnemy.expGain;
    currentEnemy.die();
    enemies = enemies.filter(e => e !== currentEnemy);
    gameState = "explore";
  } else {
    gameState = "gameover";
  }
}

function updateHoverTarget(enemies) {
  currentTarget = null;
  const mx = mouseX - UI_WIDTH;
  const my = mouseY;
  for (let enemy of enemies) {
    if (
      mx >= enemy.x &&
      mx <= enemy.x + T_S &&
      my >= enemy.y &&
      my <= enemy.y + T_S
    ) {
      currentTarget = enemy;
      return; // first enemy only
    } else {
      currentTarget = null;
    }
  }
}

class Enemy {
  constructor(x, y, type, key) {
    let cfg = ENEMY_TYPES[type];
    this.key = key;
    this.x = x;
    this.y = y;
    this.name = cfg.name;
    this.goldGain = cfg.goldGain;
    this.expGain = cfg.expGain;
    this.hp = cfg.hp;
    this.atk = cfg.atk;
    this.def = cfg.def;
    this.img = images[cfg.img];
  }
  show() {
    image(this.img, this.x, this.y, T_S, T_S);
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
