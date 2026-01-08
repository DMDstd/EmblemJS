const ENTITY_TYPES = {
    0: {
    name: "Yellow Key",
    img: "yellowKey",
    inter: "collectable",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    1: {
    name: "Yellow Key",
    img: "yellowKey",
    inter: "collectable",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    2: {
    name: "Blue Key",
    img: "blueKey",
    inter: "collectable",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    3: {
    name: "Red Key",
    img: "redKey",
    inter: "collectable",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    4: {
    name: "Yellow Chest",
    img: "yellowChest",
    inter: "container",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 10
  },
    5: {
    name: "Blue Chest",
    img: "blueChest",
    inter: "container",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 25
  },
    6: {
    name: "Red Chest",
    img: "redChest",
    inter: "container",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 50
  },
    7: {
    name: "Small HP Potion",
    img: "smallHpBottle",
    inter: "container",
    hp: 30,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    8: {
    name: "Small Attack Potion",
    img: "smallAtkBottle",
    inter: "container",
    hp: 0,
    atk: 3,
    def: 0,
    goldGain: 0
  },
    9: {
    name: "Small Defence Potion",
    img: "smallDefBottle",
    inter: "container",
    hp: 0,
    atk: 0,
    def: 3,
    goldGain: 0
  },
    i: {
    name: "HP Potion",
    img: "hpBottle",
    inter: "container",
    hp: 300,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    j: {
    name: "Attack Potion",
    img: "atkBottle",
    inter: "container",
    hp: 0,
    atk: 30,
    def: 0,
    goldGain: 0
  },
    k: {
    name: "Defence Potion",
    img: "defBottle",
    inter: "container",
    hp: 0,
    atk: 0,
    def: 30,
    goldGain: 0
  },
    l: {
    name: "Big HP Potion",
    img: "bigHpBottle",
    inter: "container",
    hp: 3000,
    atk: 0,
    def: 0,
    goldGain: 0
  },
    m: {
    name: "Big Attack Potion",
    img: "bigAtkBottle",
    inter: "container",
    hp: 0,
    atk: 300,
    def: 0,
    goldGain: 0
  },
    n: {
    name: "Big Defence Potion",
    img: "bigDefBottle",
    inter: "container",
    hp: 0,
    atk: 0,
    def: 300,
    goldGain: 0
  },
  a:{
    name: "Yellow Gate",
    img: "GateY",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  b:{
    name: "Blue Gate",
    img: "GateB",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  c:{
    name: "Red Gate",
    img: "GateR",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  d:{
    name: "Yellow Gate 2",
    img: "GateY2",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  e:{
    name: "Blue Gate 2",
    img: "GateB2",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  f:{
    name: "Red Gate 2",
    img: "GateR2",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  g:{
    name: "Gate",
    img: "Gate",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  },
  h:{
    name: "Gate 2",
    img: "Gate2",
    inter: "gate",
    hp: 0,
    atk: 0,
    def: 0,
    goldGain: 0
  }
};

function startInteraction(entity, player) {
  currentEntity = entity;
  if (entity.inter === "collectable") {
    if(entity.name === "Yellow Key")yellowKey++;
    else if(entity.name === "Blue Key")blueKey++;
    else if(entity.name === "Red Key")redKey++;
  }
  if (entity.inter === "container") {
    if (entity.name === "Yellow Chest") {
      if (yellowKey > 0) {
        yellowKey--;
        gold += entity.goldGain;
      }
      else return 0;
    } else if (entity.name === "Blue Chest") {
      if (blueKey > 0) {
        blueKey--;
        gold += entity.goldGain;
      }
      else return 0;
    } else if (entity.name === "Red Chest") {
      if (redKey > 0) {
        redKey--;
        gold += entity.goldGain;
      }
      else return 0;
    } else if (entity.name === "Defence Potion") {
      player.def += entity.def;
    } else if (entity.name === "HP Potion") {
      player.hp += entity.hp;
    } else if (entity.name === "Attack Potion") {
      player.atk += entity.atk;
    }
  }
  if (entity.inter === "gate") {
    if (entity.name === "Yellow Gate") {
      if (yellowKey > 0) {
        yellowKey--;
      }
      else return 0;
    }else if (entity.name === "Blue Gate") {
      if (blueKey > 0) {
        blueKey--;
      }
      else return 0;
    }else if (entity.name === "Red Gate") {
      if (redKey > 0) {
        redKey--;
      }
      else return 0;
    }else if (entity.name === "Yellow Gate 2") {
      if (yellowKey > 0) {
        yellowKey--;
      }
      else return 0;
    }else if (entity.name === "Blue Gate 2") {
      if (blueKey > 0) {
        blueKey--;
      }
      else return 0;
    }else if (entity.name === "Red Gate 2") {
      if (redKey > 0) {
        redKey--;
      }
      else return 0;
    }
    
  }
  entity.despawn();
  entities = entities.filter(e => e !== entity);
  console.log("Entity despawned:", entity);
}

class Entity {
  constructor(x, y, w, h, type, key) {
    let cfg = ENTITY_TYPES[type];
    this.key = key;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hp = cfg.hp;
    this.atk = cfg.atk;
    this.def = cfg.def;
    this.goldGain = cfg.goldGain;
    this.inter = cfg.inter;
    this.name = cfg.name;
    this.img = images[cfg.img];
  }
  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
  despawn() {
    despawnedEntities[this.key] = true;
  }
}