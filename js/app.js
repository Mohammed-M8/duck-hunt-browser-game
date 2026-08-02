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
        this.timer = 120000
        this.targetScore = 2
        this.score = 0
        this.birds = []
        this.element.replaceChildren()
        this.bullets = 10
        this.isPlaying = true
        console.log("game started")
        render();

        setInterval(() => createBird(), this.gap)

        setInterval(() => {
            this.timer -= 1000;
            render();

            if (this.timer <= 0) {
                end()
            }
        }, 1000)

    }


}



/*---------- Variables (state) ---------*/


/*----- Cached Element References  -----*/

const remainSpan = document.querySelector("#remain")
const timeSpan = document.querySelector("#time")
const scoreSpan = document.querySelector("#score")
const overlayElement = document.querySelector(".overlay")

const UIElement = document.querySelector(".UI")
const playBtn = document.querySelector(".play")
const resultSpan = document.querySelector("#result")
/*-------------- Functions -------------*/
const createBird = () => {
    const bird = {
        x: 480,
        y: Math.random() * 280,
        element: document.createElement('div'),
        child: document.createElement('img'),
        speed: 10,
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



    setInterval(() => {
        bird.flap()
        bird.x -= game.speed;
        bird.element.style.left = bird.x + "px"
    }, 180)



}

const shot = (e) => {
    e.stopPropagation();
    game.bullets--;


    const birdBox = e.currentTarget;
    const birdImg = birdBox.querySelector(".bird");

    birdImg.src = "/assets/duckEnemy-4.png";

    game.score++;
    render()
    if (game.score === game.targetScore) end()
    console.log(game.score);

    setTimeout(() => {
        birdBox.remove();
    }, 200);

    if (game.bullets <= 0) {
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

}





/*----------- Event Listeners ----------*/
game.element.addEventListener('click', (e) => {
    if (game.bullets === 0) end()
    game.speed += 1
    shotSmoke = document.createElement('img')
    shotSmoke.src = "/assets/shot.png"
    shotSmoke.classList.add("shot")
    game.bullets--;

    shotSmoke.style.left = `${e.offsetX}px`;
    shotSmoke.style.top = `${e.offsetY}px`;
    game.element.appendChild(shotSmoke);
    setTimeout(() => {
        shotSmoke.remove()
    }, 100)
})

playBtn.addEventListener('click', () => game.start())