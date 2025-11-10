let move_speed = 3, gravity = 0.5;
const bird = document.querySelector('.bird');
const img = document.getElementById('bird-1');
const score_val = document.querySelector('.score_val');
const message = document.querySelector('.message');
const score_title = document.querySelector('.score_title');

let sound_point = new Audio('sounds_effect/point.mp3');
let sound_die = new Audio('sounds_effect/die.mp3');
let bg_music = new Audio('sounds_effect/bgg_music.mp3');
bg_music.loop = true;
bg_music.volume = 0.4;

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
message.innerHTML = `Play With Me<br><span style="color:red;">↑</span> Tap or Press Enter to Fly`;

function startGame() {
  if (game_state === 'Play') return;
  document.querySelectorAll('.pipe_sprite').forEach(el => el.remove());
  const brokenHeart = document.querySelector('.broken-heart');
  if (brokenHeart) brokenHeart.remove();

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

// ✅ Desktop + Mobile Controls (start game / jump)
['keydown', 'touchstart', 'pointerdown', 'click'].forEach(evt => {
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

function play() {
  let bird_dy = 0;
  let pipe_seperation = 0;
  const pipe_gap = 35;
  let bird_props = bird.getBoundingClientRect();
  const background = document.querySelector('.background').getBoundingClientRect();

  // Bird jump
  function jump() {
    img.src = './images/bird-2.png';
    bird_dy = -7.6;
    setTimeout(() => (img.src = './images/bird.png'), 100);
  }
  window.jump = jump; // for event use

  // Pipe movement
  function move() {
    if (game_state !== 'Play') return;
    document.querySelectorAll('.pipe_sprite').forEach((el) => {
      const pipe_props = el.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      // 💥 collision fix: smaller hitbox
      if (
        bird_props.left + 10 < pipe_props.left + pipe_props.width &&
        bird_props.left + bird_props.width - 10 > pipe_props.left &&
        bird_props.top + 10 < pipe_props.top + pipe_props.height &&
        bird_props.top + bird_props.height - 10 > pipe_props.top
      ) {
        endGame();
        return;
      }

      if (pipe_props.right <= 0) el.remove();
      else {
        if (
          pipe_props.right < bird_props.left &&
          pipe_props.right + move_speed >= bird_props.left &&
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

  // Gravity + Jump motion
  function apply_gravity() {
    if (game_state !== 'Play') return;
    bird_dy += gravity;

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      endGame();
      return;
    }

    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  // Pipe creation
  function create_pipe() {
    if (game_state !== 'Play') return;
    if (pipe_seperation > 115) {
      pipe_seperation = 0;
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      document.body.appendChild(pipe_sprite_inv);

      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);

  function endGame() {
    game_state = 'End';
    message.innerHTML = 'Game Over '.fontcolor('red') + '<br>Tap or Press Enter to Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
    sound_die.play();
    bg_music.pause();
    bg_music.currentTime = 0;
    message.style.display = 'block';

    const brokenHeart = document.createElement('div');
    brokenHeart.className = 'broken-heart';
    document.body.appendChild(brokenHeart);
  }
}
