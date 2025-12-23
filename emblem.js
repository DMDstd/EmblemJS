let objects = [];
let images = {};
let player;
let keys = {};

function preload() {
  images["bg"] = loadImage('./images/background.jpg');
  images["FenorisL1"] = loadImage('./images/FenorisL1.png');
  images["FenorisR1"] = loadImage('./images/FenorisR1.png');
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  player = new Player(width / 2, height - 100, 200, images["FenorisL1"], images["FenorisR1"]);
}

function draw() {
  background(0);
  image(images["bg"], width/2, height/2, width, height);
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.move("left");
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.move("right");
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.move("up");
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.move("down");
  }
  player.draw();
}

function fightMusic() {
    const music = document.getElementById("FM");
    music.volume = 0.5;
    music.play();
}

function themeMusic() {
    const P1 = document.getElementById("SM1");
    const P2 = document.getElementById("SM1");
    const P3 = document.getElementById("SM1");
    const P4 = document.getElementById("SME");
    let loop = 0;
    P1.volume = 1;
    P2.volume = 1;
    P3.volume = 1;
    P4.volume = 1;
    console.log("AAA");
    P1.ontimeupdate = () => {
      if ((P1.duration - P1.currentTime < 2) && (loop == 2)) {
        console.log("CCC");
        P4.play();
        loop = 0;
        P1.ontimeupdate = null;
      } else if (P1.duration - P1.currentTime < 2) {
        console.log("BBB");
        P2.play();
        console.log("DDD");
        loop++;
        P1.ontimeupdate = null;
      }
    };
    P4.ontimeupdate = () => {
      if (P4.duration - P4.currentTime < 2) {
        P1.play();
        P4.ontimeupdate = null;
      }
    };
  P1.play();
}