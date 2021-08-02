const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Variables
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let playerCrouch;
let playerFoot = -1;
let playerDeath = false;
let pteroWing = -1;
let gravity;
let obstacles = [];
let groundList = [];
let skyList = [];
let gameSpeed;
let keys = {};
let groundLevel = 500;
let ground1;
let ground2;
let ground3;
let sky1;
let sky2;
let restartTimer = 11500;


var playerImageL = new Image();
playerImageL.src = 'img/dino-left.png';

var playerImageR = new Image();
playerImageR.src = 'img/dino-right.png';

var playerImageCrouch = new Image();
playerImageCrouch.src = 'img/dino-crouch.png';

var playerImageDeath = new Image();
playerImageDeath.src = 'img/dino-death.png';


var pteroLeft = new Image();
pteroLeft.src = 'img/ptero-left.png';

var pteroRight = new Image();
pteroRight.src = 'img/ptero-right.png';

var cactusImage1 = new Image();
cactusImage1.src = 'img/cactus1.png';

var cactusImage2 = new Image();
cactusImage2.src = 'img/cactus2.png';

var groundImage = new Image();
groundImage.src = 'img/ground.png';

var skyImage = new Image();
skyImage.src = 'img/dinobackground.png';




// Event Listeners
document.addEventListener('keydown', function (evt) {
  keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;



    this.dy = 0;
    this.jumpForce = 12;
    this.originalHeight = h;
    this.originalWidth = w;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate() {
    // Jump
    if (keys['Space'] || keys['KeyW']) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    if (keys['ShiftLeft'] || keys['KeyS']) {
      this.h = this.originalHeight / 2;
      this.w = this.originalWidth + 20;
      playerCrouch = true;
    } else {
      this.h = this.originalHeight;
      this.w = this.originalWidth
      playerCrouch = false;
    }

    this.y += this.dy;

    // Gravity
    if (this.y + this.h < groundLevel) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = groundLevel - this.h;
    }

    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - (this.jumpTimer / 50);
    }
  }

  Draw() {
    /*
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
*/

    if (playerCrouch == true) {
      ctx.drawImage(playerImageCrouch, this.x, this.y, this.w, this.h);
      //  console.log(this.x)
      // console.log(this.y)
    } else if (playerFoot == 1) {
      ctx.drawImage(playerImageL, this.x, this.y, this.w, this.h);
      // console.log(this.x)
      //  console.log(this.y)

    } else if (playerDeath == true) {
      ctx.drawImage(playerImageDeath, this.x, this.y, this.w, this.h);
    } else {
      ctx.drawImage(playerImageR, this.x, this.y, this.w, this.h);
      //   console.log(this.x)
      //  console.log(this.y)

    }


  }
}

class Obstacle {
  constructor(x, y, w, h, c, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.type = type;

    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw() {
    if (this.type == 0) {
      ctx.drawImage(cactusImage1, this.x, this.y, this.w, this.h);

    } else if (this.type == 1) {
      if (playerFoot == 1) {
        ctx.drawImage(pteroLeft, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(pteroRight, this.x, this.y + 10, this.w, this.h);
      }

    } else if (this.type == 2) {
      ctx.drawImage(cactusImage2, this.x, this.y, this.w, this.h);

    }
  }

}


class Ground {
  constructor(x) {
    this.x = x;
    this.y = groundLevel - 35;
    this.w = 1200;
    this.h = 54;
    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
    if (this.x <= - this.w) {
      this.x += 3 * this.w;
    }
  }

  Draw() {

    ctx.drawImage(groundImage, this.x, this.y, this.w, this.h);
    //  console.log(this.x)
    // console.log(this.y)
  }

}


class Sky {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 600;
    this.h = 236;
    this.dx = -gameSpeed * 0.25;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed * 0.25;
    if (this.x <= - this.w) {
      this.x += 4 * this.w;
      this.y = RandomIntInRange(10, 200);
    }
  }

  Draw() {
    ctx.drawImage(skyImage, this.x, this.y, this.w, this.h);
  }

}



class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

// Game Functions
function SpawnObstacle() {
  let type = RandomIntInRange(0, 2);
  let extraWidth = 0;

  if (type == 0) {
    size = 75;
    extraWidth = 40;
  } else if (type == 1) {
    size = 38;
    extraWidth = 30;
  } else {
    size = 70;
    extraWidth = 20;
  }

  let obstacle = new Obstacle(canvas.width + size, groundLevel - size, size + extraWidth, size, '#2484E4', type);

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}


function RandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function deathFreeze() {
  while (restartTimer > 0) {
    gameSpeed = 0;
    restartTimer--;
  }
  restartTimer = 11500;
  playerDeath = false;
}

function Start() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.font = "20px sans-serif";

  gameSpeed = 6;
  gravity = 1;



  score = 0;
  highscore = 0;
  if (localStorage.getItem('highscore')) {
    highscore = localStorage.getItem('highscore');
  }

  ground1 = new Ground(0);
  ground2 = new Ground(1200);
  ground3 = new Ground(2400);
  groundList.push(ground1, ground2, ground3);

  sky1 = new Sky(0, 40);
  sky2 = new Sky(1300, 150);
  skyList.push(sky1, sky2);


  player = new Player(25, 0, 50, 70, '#FF5858');

  scoreText = new Text("Score: " + score, 25, 25, "left", "#212121", "20");
  highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#212121", "20");


  requestAnimationFrame(Update);


}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;
function Update() {
  if (playerDeath == true && keys['Space']) {

    playerDeath = false;
  }

  requestAnimationFrame(Update);
  if (playerDeath == false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let obstacleGap = RandomIntInRange(8, 16);

    spawnTimer--;
    if (spawnTimer <= 0) {
      SpawnObstacle();
      // console.log(obstacles);
      spawnTimer = initialSpawnTimer - gameSpeed * obstacleGap;

      if (spawnTimer < 50) {
        spawnTimer = 50;
      }
    }

    // Spawn Enemies
    for (let i = 0; i < obstacles.length; i++) {
      let o = obstacles[i];

      if (o.x + o.w < 0) {
        obstacles.splice(i, 1);
        delete o;
      }

      if (
        player.x < o.x + o.w &&
        player.x + player.w > o.x &&
        player.y < o.y + o.h &&
        player.y + player.h > o.y
      ) {
        playerDeath = true;
        obstacles = [];
        score = 0;
        spawnTimer = initialSpawnTimer;
        gameSpeed = 6;
        window.localStorage.setItem('highscore', highscore);
      }

      o.Update();
    }
    groundList.forEach(function (piece) {
      piece.Update();
    });
    skyList.forEach(function (piece) {
      piece.Update();
    });

    player.Animate();

    score++;

    if (score % 10 == 0) {
      playerFoot *= -1;
    }

    if (score % 17 == 0) {
      pteroWing *= -1;
    }

    scoreText.t = "Score: " + score;
    scoreText.Draw();

    if (score > highscore) {
      highscore = score;
      highscoreText.t = "Highscore: " + highscore;
    }

    highscoreText.Draw();

    gameSpeed += 0.003;

  }
}

Start();






