const ENTITY_TYPES = {
    1: {
    name: "Yellow Key",
    img: "yellowKey",
    inter: "collectable"
  },
    2: {
    name: "Blue Key",
    img: "blueKey",
    inter: "collectable"
  },
    3: {
    name: "Red Key",
    img: "redKey",
    inter: "collectable"
  },
    4: {
    name: "Yellow Chest",
    img: "yellowChest",
    inter: "container"
  },
    5: {
    name: "Blue Chest",
    img: "blueChest",
    inter: "container"
  },
    6: {
    name: "Red Chest",
    img: "redChest",
    inter: "container"
  },
};

function startInteraction(entity) {
  currentEntity = entity;
  if (entity.inter === "collectable") {
    if(entity.name === "Yellow Key")yellowKey++;
    else if(entity.name === "Blue Key")blueKey++;
    else if(entity.name === "Red Key")redKey++;
  } else if (entity.inter === "container") {
    if(entity.name === "Yellow Chest" && yellowKey > 0) { 
        yellowKey--;
    } else {
        return 0;
    }
    if(entity.name === "Blue Chest" && blueKey > 0) {
        blueKey--;
    } else {
        return 0;
    }
    if(entity.name === "Red Chest" && redKey > 0) {
        redKey--;
    } else {
        return 0;
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