/*-------------- Constants -------------*/
const game={
    timer,
    targetScore,
    score,
    birds=[],


}


/*---------- Variables (state) ---------*/


/*----- Cached Element References  -----*/


/*-------------- Functions -------------*/
const createBird=()=>{
    let bird=document.createElement('img')
    bird.src="./assets/duckEnemy-1.png"
    return bird;

}

const start=()=>{
    game.timer=120000
    game.targetScore=10
    game.score=0
    game.birds=[]

}



/*----------- Event Listeners ----------*/
