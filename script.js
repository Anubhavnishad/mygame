let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

let sound_point = new Audio('sounds_effect/point.mp3');
let sound_die = new Audio('sounds_effect/die.mp3');
let bg_music = new Audio('sounds_effect/bgg_music.mp3');
bg_music.loop = true;
bg_music.volume = 0.4;

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
message.innerHTML = `Play With Me<br><span style="color:red;">↑</span> Tap / Press ArrowUp to Fly<br>Press Enter or Tap to Start`;

function startGame() {
    if (game_state === 'Play') return;

    document.querySelectorAll('.pipe_sprite').forEach((el) => el.remove());
    let brokenHeart = document.querySelector('.broken-heart');
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

// ✅ Start game (Enter key or tap)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') startGame();
});
document.addEventListener('touchstart', () => {
    if (game_state !== 'Play') startGame();
});

function play() {
    let bird_dy = 0;
    let pipe_seperation = 0;
    let pipe_gap = 35;
    let bird_props = bird.getBoundingClientRect();
    let background = document.querySelector('.background').getBoundingClientRect();

    // Pipe movement
    function move() {
        if (game_state !== 'Play') return;
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) element.remove();
            else {
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {
                    endGame();
                    return;
                } else {
                    if (
                        pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score === '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        element.increase_score = '0';
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    // Gravity + Jump (with keyboard & touch)
    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === ' ') jump();
        });
        document.addEventListener('touchstart', jump);

        function jump() {
            img.src = 'images/Bird-2.png';
            bird_dy = -7.6;
            setTimeout(() => { img.src = 'images/Bird.png'; }, 100);
        }

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame();
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    // Pipe Creation
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

    // Game Over
    function endGame() {
        game_state = 'End';
        message.innerHTML = 'Game Over '.fontcolor('red') + '<br>Tap or Press Enter to Restart';
        message.classList.add('messageStyle');
        img.style.display = 'none';
        sound_die.play();
        bg_music.pause();
        bg_music.currentTime = 0;
        message.style.display = 'block';

        // Broken Heart animation
        let brokenHeart = document.createElement('div');
        brokenHeart.className = 'broken-heart';
        document.body.appendChild(brokenHeart);
    }
}
