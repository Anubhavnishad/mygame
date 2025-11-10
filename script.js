let move_speed = 3, gravity = 0.5;
const bird = document.querySelector('.bird');
const img = document.getElementById('bird-1');
const score_val = document.querySelector('.score_val');
const message = document.querySelector('.message');
const score_title = document.querySelector('.score_title');

// 🎵 Sounds
let sound_point = new Audio('sounds_effect/point.mp3');
let sound_die = new Audio('sounds_effect/die.mp3');
let bg_music = new Audio('sounds_effect/bgg_music.mp3');
bg_music.loop = true;
bg_music.volume = 0.4;

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
message.innerHTML = `<br><span style="color:red;">↑</span> Tap To Start`;

function startGame() {
  if (game_state === 'Play') return;
  document.querySelectorAll('.pipe_sprite').forEach(el => el.remove());
  img.style.display = 'block';
  bird.style.top = '40vh';
  bird.style.height = "200px";
  bird.style.width = "250px";
  game_state = 'Play';
  message.innerHTML = '';
  score_title.innerHTML = 'Score: ';
  score_val.innerHTML = '0';
  message.classList.remove('messageStyle');
  message.style.display = 'none';
  bg_music.currentTime = 0;
  bg_music.play();
  play();
}

// ✅ Start Game or Jump (for both mobile + PC)
['keydown', 'touchstart', 'click'].forEach(evt => {
  document.addEventListener(evt, e => {
    if (game_state !== 'Play') {
      startGame();
    } else {
      if (e.key === 'ArrowUp' || e.key === ' ' || e.type !== 'keydown') {
        jump();
      }
    }
  }, { passive: true });
});

let bird_dy = 0;

function jump() {
  img.src = './images/bird-2.png';  // Jump image
  bird_dy = -7.2;
  setTimeout(() => {
    img.src = './images/bird.png';  // Back to normal
  }, 150);
}

function play() {
  let pipe_gap = 35;
  let pipe_separation = 0;
  let bird_props = bird.getBoundingClientRect();
  const background = document.querySelector('.background').getBoundingClientRect();

  // 🪶 Gravity
  function apply_gravity() {
    if (game_state !== 'Play') return;
    bird_dy += gravity;
    bird.style.top = bird_props.top + bird_dy + 'px';
     bird.style.hight="200px";
     bird.style.width="250px";
    bird_props = bird.getBoundingClientRect();

    // Out of bounds
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      endGame();
      return;
    }

    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  // 🏗️ Create Pipes
  function create_pipe() {
    if (game_state !== 'Play') return;

    if (pipe_separation > 115) {
      pipe_separation = 0;
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      // Upper pipe
      let top_pipe = document.createElement('div');
      top_pipe.className = 'pipe_sprite';
      top_pipe.style.top = pipe_posi - 70 + 'vh';
      top_pipe.style.left = '100vw';
      document.body.appendChild(top_pipe);

      // Lower pipe
      let bottom_pipe = document.createElement('div');
      bottom_pipe.className = 'pipe_sprite';
      bottom_pipe.style.top = pipe_posi + pipe_gap + 'vh';
      bottom_pipe.style.left = '100vw';
      bottom_pipe.increase_score = '1';
      document.body.appendChild(bottom_pipe);
    }
    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);

  // 🌀 Move Pipes + Collision Check
  function move() {
    if (game_state !== 'Play') return;
    document.querySelectorAll('.pipe_sprite').forEach((el) => {
      let pipe_props = el.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      // ✅ Collision fix (little tolerance)
      if (
        bird_props.right - 10 > pipe_props.left &&
        bird_props.left + 10 < pipe_props.right &&
        bird_props.bottom - 10 > pipe_props.top &&
        bird_props.top + 10 < pipe_props.bottom
      ) {
        endGame();
        return;
      }

      // remove off-screen pipes
      if (pipe_props.right <= 0) el.remove();
      else {
        // ✅ Score increase
        if (
          pipe_props.right < bird_props.left &&
          el.increase_score === '1'
        ) {
          score_val.innerHTML = +score_val.innerHTML + 1;
          el.increase_score = '0';
          sound_point.play();
        }
        el.style.left = pipe_props.left - move_speed + 'px';
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
}

function endGame() {
  game_state = 'End';
  message.innerHTML = 'Game Over 😔<br> Restart';
  message.classList.add('messageStyle');
  img.style.display = 'none';
  sound_die.play();
  bg_music.pause();
  bg_music.currentTime = 0;
  message.style.display = 'block';
}
