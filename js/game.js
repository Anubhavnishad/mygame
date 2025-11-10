let canvas, ctx, boyImg, girlImg;
let boy, girl, obstacles = [];
let gravity = 0.8, gameSpeed = 6;
let score = 0, gameOver = false, gameStarted = false;
let bgX = 0;

function startGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;

  // load images
  boyImg = new Image();
  girlImg = new Image();
  boyImg.src = 'assets/head_boy.png';
  girlImg.src = 'assets/head_girl.png';

  // set players
  boy = { x: 100, y: canvas.height - 150, w: 60, h: 60, vy: 0, onGround: true };
  girl = { x: 170, y: canvas.height - 150, w: 60, h: 60, vy: 0, onGround: true };

  // add event listeners
  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', jump);

  drawStartScreen();
}

function drawStartScreen() {
  ctx.fillStyle = '#f8c8dc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ff4081';
  ctx.font = '40px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText('💖 Tap or Press Start to Begin the Love Run 💖', canvas.width / 2, canvas.height / 2 - 50);
  
  const startButton = document.createElement('button');
  startButton.textContent = 'Start Game';
  startButton.style.position = 'absolute';
  startButton.style.top = '50%';
  startButton.style.left = '50%';
  startButton.style.transform = 'translate(-50%, -50%)';
  startButton.style.padding = '15px 40px';
  startButton.style.fontSize = '18px';
  startButton.style.borderRadius = '30px';
  startButton.style.background = '#ff80ab';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.cursor = 'pointer';
  startButton.style.boxShadow = '0 0 10px #ff4081';
  document.body.appendChild(startButton);

  startButton.onclick = () => {
    startButton.remove();
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.play().catch(() => console.log("Autoplay blocked"));
    gameStarted = true;
    setInterval(spawnObstacle, 2000);
    requestAnimationFrame(update);
  };
}

function jump() {
  if (!gameStarted || gameOver) return;
  const jumpSound = document.getElementById('jumpSound');
  if (boy.onGround) {
    boy.vy = girl.vy = -15;
    boy.onGround = girl.onGround = false;
    jumpSound.play();
  }
}

function spawnObstacle() {
  if (gameOver || !gameStarted) return;
  const h = 40 + Math.random() * 30;
  obstacles.push({ x: canvas.width, y: canvas.height - h - 50, w: 40, h });
}

function update() {
  if (gameOver) return;

  // background scroll
  bgX -= gameSpeed;
  if (bgX <= -canvas.width) bgX = 0;

  // background
  ctx.fillStyle = '#f8c8dc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffe4ec';
  ctx.fillRect(bgX, canvas.height - 100, canvas.width * 2, 100);

  // move & draw obstacles
  ctx.fillStyle = '#ff4081';
  obstacles.forEach((o, i) => {
    o.x -= gameSpeed;
    ctx.fillRect(o.x, o.y, o.w, o.h);
    if (o.x + o.w < 0) obstacles.splice(i, 1);

    // collision
    if (checkCollision(boy, o) || checkCollision(girl, o)) {
      endGame();
    }
  });

  // gravity + jump logic
  [boy, girl].forEach(p => {
    p.y += p.vy;
    p.vy += gravity;
    if (p.y > canvas.height - 150) {
      p.y = canvas.height - 150;
      p.vy = 0;
      p.onGround = true;
    }
  });

  // move forward illusion
  ctx.drawImage(boyImg, boy.x, boy.y, boy.w, boy.h);
  ctx.drawImage(girlImg, girl.x, girl.y, girl.w, girl.h);

  // Score
  score += 0.05;
  ctx.fillStyle = 'black';
  ctx.font = '24px Poppins';
  ctx.fillText('Distance: ' + score.toFixed(1) + ' km', 30, 40);

  if (!gameOver) requestAnimationFrame(update);
}

function checkCollision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function endGame() {
  gameOver = true;
  const bgMusic = document.getElementById('bgMusic');
  const hitSound = document.getElementById('hitSound');
  bgMusic.pause();
  hitSound.play();

  ctx.fillStyle = 'red';
  ctx.font = '50px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText('💔 Heart Broken 💔', canvas.width / 2, canvas.height / 2);
  ctx.font = '30px Poppins';
  ctx.fillText('Game Over! Distance: ' + score.toFixed(1) + ' km', canvas.width / 2, canvas.height / 2 + 50);
}
