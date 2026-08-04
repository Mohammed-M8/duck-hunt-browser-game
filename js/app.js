

/*---------- Variables (state) ---------*/
let renderId, createId, flapId, speedId;
/*-------------- Constants -------------*/


const render = () => {
    remainSpan.textContent = game.lives
    timeSpan.textContent = `${game.timer / 1000}s left`
    scoreSpan.textContent = `${game.score}/${game.targetScore}`

}
const game = {
    timer: 0,
    targetScore: 0,
    score: 0,
    birds: [],
    lives: 10,
    played: false,
    win: undefined,
    gap: 2000,
    speed: 0,
    penalty: 10000,
    element: document.querySelector(".game"),
    start() {
        if (this.played) {
            overlayElement.classList.add("hidden")
        }
        UIElement.classList.remove("hidden")
        infoElement.classList.add("hidden")
        this.timer = 60000
        this.targetScore = 20
        this.score = 0
        this.speed = 0
        this.birds = []
        this.element.replaceChildren()
        this.lives = 10
        this.played = true
        console.log("game started")
        render();

        speedId = setInterval(faster, 5000)
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
const startBtn = document.querySelector(".start")
const resultSpan = document.querySelector("#result")

const infoElement = document.querySelector(".info")
/*-------------- Functions -------------*/

const openInfo = () => {
    overlayElement.classList.add("hidden")
    infoElement.classList.remove("hidden")

}

const getRandom = (items) => {
    let total = items.reduce((sum, item) => {
        return sum + item.weight
    }, 0)

    let roll = Math.random() * total;
    for (const item of items) {
        if (roll < item.weight) return item

        roll -= item.weight
    }
}



const renderTimer = () => {
    game.timer -= 1000;
    render();

    if (game.timer <= 0) {
        end()
    }
}
const createBird = () => {
    const types = [
        { name: "duck", flap1: "/assets/duckEnemy-1.png", flap2: "/assets/duckEnemy-2.png", weight: 70, speed: 10 },
        { name: "crow", flap1: "/assets/crowChill-1.png", flap2: "/assets/crowChill-2.png", weight: 20, speed: 12 },
        { name: "eagle", flap1: "/assets/eagleChill-1.png", flap2: "/assets/eagleChill-2.png", weight: 10, speed: 14 },
    ]
    const bird = {
        x: game.element.clientWidth,
        y: Math.random() * (game.element.clientHeight - 90),
        element: document.createElement('div'),
        child: document.createElement('img'),
        speed: 2,
        state: 1,
        type: getRandom(types),
        flap() {
            if (this.state === 1) {
                this.state = 2
                this.child.src = this.type.flap1
            }
            else {
                this.state = 1
                this.child.src = this.type.flap2
            }
        }

    }
    bird.element.bird = bird
    bird.child.src = bird.type.flap1
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
        const speed = bird.type.speed + game.speed
        bird.x -= speed;
        bird.element.style.left = bird.x + "px"
        if (bird.x < -window.innerWidth) {
            clearInterval(bird.interval)
            bird.element.remove()
        }
    }, 180)



}

const shot = (e) => {
    e.stopPropagation();


    const birdBox = e.currentTarget;
    const birdImg = birdBox.querySelector(".bird");

    birdImg.src = "/assets/duckEnemy-3.png";
    const bird = birdBox.bird;
    if (bird.type.name === "crow") {

        game.lives -= 2;
        remainSpan.textContent += "- 2"
        if (game.lives === 0) end()

    }
    else if (bird.type.name === "eagle") {
        game.timer -= game.penalty
        timeSpan.textContent += `- ${game.penalty / 1000}s`
    }
    else {
        game.score++;
    }
    setTimeout(render, 500)
    if (game.score === game.targetScore) end()
    console.log(game.score);

    setTimeout(() => {
        birdBox.remove();
    }, 200);

    if (game.lives === 0) {
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
    overlayElement.classList.remove("hidden")
    UIElement.classList.add("hidden")
    clearInterval(renderId)
    clearInterval(createId)
    clearInterval(speedId)
    game.birds.forEach((b) => clearInterval(b.interval))
}

const faster = () => game.speed += 3;



/*----------- Event Listeners ----------*/
game.element.addEventListener('click', (e) => {
    game.speed += 1
    const shotSmoke = document.createElement('img')
    shotSmoke.src = "/assets/shot.png"
    shotSmoke.classList.add("shot")
    if (game.lives === 0) end()

    shotSmoke.style.left = `${e.offsetX}px`;
    shotSmoke.style.top = `${e.offsetY}px`;
    game.element.appendChild(shotSmoke);
    setTimeout(() => {
        shotSmoke.remove()
    }, 100)
})

startBtn.addEventListener('click', () => {
    game.start()
})
playBtn.addEventListener('click', () => {
    if (game.played) {
        game.start()
    }
    else {
        openInfo()
    }
})