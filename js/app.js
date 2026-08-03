

/*---------- Variables (state) ---------*/
let renderId, createId, flapId;
/*-------------- Constants -------------*/


const render = () => {
    remainSpan.textContent = game.bullets
    timeSpan.textContent = `${game.timer / 1000}s left`
    scoreSpan.textContent = `${game.score}/${game.targetScore}`

}
const game = {
    timer: 0,
    targetScore: 0,
    score: 0,
    speed: 10,
    birds: [],
    bullets: 10,
    isPlaying: false,
    win: undefined,
    gap: 2000,
    element: document.querySelector(".game"),
    start() {

        UIElement.classList.remove("hidden")
        overlayElement.classList.add("hidden")
        this.timer = 60000
        this.targetScore = 10
        this.score = 0
        this.speed = 20
        this.birds = []
        this.element.replaceChildren()
        this.bullets = 10
        this.isPlaying = true
        console.log("game started")


        createId = setInterval(createBird, this.gap)

        renderId = setInterval(renderTimer, 1000)

    }
}



/*----- Cached Element References  -----*/

const remainSpan = document.querySelector("#remain")
const timeSpan = document.querySelector("#time")
const scoreSpan = document.querySelector("#score")
const overlayElement = document.querySelector(".overlay")

const UIElement = document.querySelector(".UI")
const playBtn = document.querySelector(".play")
const resultSpan = document.querySelector("#result")
/*-------------- Functions -------------*/

const renderTimer = () => {
    game.timer -= 1000;
    render();

    if (game.timer <= 0) {
        end()
    }
}
const createBird = () => {
    const bird = {
        x: game.element.clientWidth,
        y: Math.random() * (game.element.clientHeight - 90),
        element: document.createElement('div'),
        child: document.createElement('img'),
        speed: 2,
        state: 1,
        flap() {
            if (this.state === 1) {
                this.state = 2
                this.child.src = "/assets/duckEnemy-2.png"
            }
            else {
                this.state = 1
                this.child.src = "/assets/duckEnemy-1.png"
            }
        }

    }
    bird.child.src = "/assets/duckEnemy-1.png"
    bird.child.classList.add("bird")

    bird.element.classList.add("birdBox")
    bird.element.addEventListener('click', shot)

    bird.element.style.left = bird.x + "px";
    bird.element.style.top = bird.y + "px";

    bird.element.appendChild(bird.child)

    game.birds.push(bird)
    game.element.appendChild(bird.element)



    bird.interval = setInterval(() => {
        bird.flap()
        bird.x -= game.speed;
        bird.element.style.left = bird.x + "px"
        if (bird.x < -window.innerWidth) {
            clearInterval(bird.interval)
            bird.element.remove()
        }
    }, 180)



}

const shot = (e) => {
    e.stopPropagation();
    game.bullets--;
    game.speed += 10



    const birdBox = e.currentTarget;
    const birdImg = birdBox.querySelector(".bird");

    birdImg.src = "/assets/duckEnemy-3.png";

    game.score++;
    render()
    if (game.score === game.targetScore) end()
    console.log(game.score);

    setTimeout(() => {
        birdBox.remove();
    }, 200);

    if (game.bullets === 0) {
        game.isPlaying = false
        end()
    }
}



const end = () => {
    console.log("GameOver");
    game.win = game.timer >= 0 && (game.targetScore === game.score)
    if (game.win) {
        resultSpan.textContent = "YOU WON!"
    }
    else {
        resultSpan.textContent = "YOU LOST!"

    }
    game.isPlaying = false
    overlayElement.classList.remove("hidden")
    UIElement.classList.add("hidden")
    clearInterval(renderId)
    clearInterval(createId)
    game.birds.forEach((b) => clearInterval(b.interval))
}





/*----------- Event Listeners ----------*/
game.element.addEventListener('click', (e) => {
    game.speed += 1
    shotSmoke = document.createElement('img')
    shotSmoke.src = "/assets/shot.png"
    shotSmoke.classList.add("shot")
    game.bullets--;
    if (game.bullets === 0) end()

    shotSmoke.style.left = `${e.offsetX}px`;
    shotSmoke.style.top = `${e.offsetY}px`;
    game.element.appendChild(shotSmoke);
    setTimeout(() => {
        shotSmoke.remove()
    }, 100)
})

playBtn.addEventListener('click', () => game.start())