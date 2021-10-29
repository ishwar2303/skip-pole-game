var ballY
var coordinates = []
var dropInterval
var poleSlideInterval
var collisionInterval
var poleSlideSpeed
var ballRelativeX 
var bodyHeight = document.body.offsetHeight
var bodyWidth = document.body.offsetWidth
var poleRef = bodyWidth + 100
var polePass = 1
var highScore = 0
var poleWidth = 50 // 100
var poleGap = 300 // 250
var poleDesignWidth = 60 // 110
var poleSeparation = 350 // 300
var noOfPoles = 50

const scoreBlock = document.getElementById('high-score')
const currScore = document.getElementById('curr-score')
const yourScore = document.getElementById('your-score')
const playBtn = document.getElementById('play-btn')
const playContainerOption = document.getElementById('play-and-score-container')
const poleSlide = document.getElementById('pole-slide')
const overlay = document.getElementById('overlay')
const touch = document.getElementById('touch-plate')
const ball  = document.getElementById('ball')

playBtn.addEventListener('click', () => {
    start()
})

const start = () => {
    clearInterval(poleSlideInterval)
    poleGap = 250
    poleSlideSpeed = 5
    polePass = 1
    poleRef = bodyWidth + 100
    currScore.innerText = 0
    coordinates = []
    ball.style.display = 'block'
    overlay.style.display = 'none'
    playContainerOption.style.display = 'none'
    ball.style.background = 'linear-gradient(45deg, black, #3333cdad)'
    ball.style.top = bodyHeight/2 - 25 + 'px'
    ball.style.left = bodyWidth/2  + 'px'
    ballY = bodyHeight/2 - 25
    ballRelativeX = bodyWidth/2
    poleSlide.innerHTML = ''
    poleSlide.style.left = '0'
    let div = document.createElement('div')
    div.style.width = bodyWidth + 100 + 'px'
    div.style.height = '100%'
    poleSlide.appendChild(div)
    for(let i=1; i<=noOfPoles; i++) {
        createPole(i)
    }
    addTheEnd()
    poleSlideInterval = setInterval(() => {
        movePoleSlide(true)
    }, poleSlideSpeed)
    dropInterval = setInterval(dropball, 0.5)
    // collisionInterval = setInterval(checkCollision, 1)
} 

const addTheEnd = () => {
    let div = document.createElement('div')
    div.className = 'flex-row justify-center align-start'
    div.style.paddingTop = '50px'
    div.style.width = '400px'
    div.style.height = '100%'
    let h1 = document.createElement('h1')
    h1.innerText = 'The End'
    h1.className = 'the-end'
    div.appendChild(h1)
    poleSlide.appendChild(div)
}

const restart = () => {
    playContainerOption.style.display = 'flex'
}
const addTouch = () => {
    touch.addEventListener('click', () => {
        for(let i=1; i<=120; i++) {
            setTimeout(flyball, i)
        }
    })
}
addTouch()
const flyball = () => {
    if(ballY <= 0)
        return
    ballY -= 1.5
    ball.style.top = ballY + 'px'
    
}
const dropball = () => {
    ballY += 1.8
    ball.style.top = ballY + 'px'
    if(ballY >= bodyHeight - 25) {
        gameOver()
    }
}

const gameOver = (slideCloseTimer) => {
    dieball()
    var au = new Audio('break.mp3')
    au.play()
    clearInterval(dropInterval)
    clearInterval(collisionInterval)
    if(!slideCloseTimer)
        clearInterval(poleSlideInterval)
    else setTimeout(() => {
        clearInterval(poleSlideInterval)
    }, slideCloseTimer)
    playContainerOption.style.display = 'flex'
    overlay.style.display = 'block'
}

const movePoleSlide = (gameTrue) => {
    let str = poleSlide.style.left
    var pos = 0
    if(str) {
        pos = parseInt(str.substring(0, str.length-2))
        pos -= 2
    }
    if(gameTrue) {  
        checkCollision()
        ballRelativeX += 2
    }
    poleSlide.style.left = pos + 'px'
}

const createPole = (poleNum) => {

    if(poleNum%5 == 0 && poleNum != 0)
        poleGap += 10
    let points = {
        startX: '',
        upper: {
            startY: '',
            endY: ''
        },
        lower : {
            startY: '',
            endY: ''
        }
    }
    points.startX = poleRef
    points.endX   = poleRef + poleWidth // for pole
    poleRef += poleGap + poleWidth

    let availableHeight = bodyHeight - poleSeparation
    let breakRatio = Math.random().toFixed(1)*100
    let poleContainer = document.createElement('div')
    poleContainer.className = 'pole-container'
    poleContainer.style.height = '100%'
    poleContainer.style.width = poleWidth + 'px'
    poleContainer.style.position = 'relative'
    let div = document.createElement('div')
    let temp = breakRatio*availableHeight/100
    points.upper.startY = 0
    points.upper.endY = temp
    div.style.height = temp + 'px'
    div.className = 'upper-pole'
    if(highScore == poleNum)
        div.className += ' golden-design'
    var divDesign = document.createElement('div')
    divDesign.className = 'div-design-upper'
    divDesign.style.width = poleDesignWidth + 'px'
    if(highScore == poleNum)
        divDesign.className += ' golden-design'
    div.appendChild(divDesign)
    poleContainer.appendChild(div)
    div = document.createElement('div')
    temp = (100 - breakRatio)*availableHeight/100
    points.lower.startY = bodyHeight - temp
    points.lower.endY = bodyHeight
    div.style.height = temp + 'px'
    div.className = 'lower-pole'
    if(highScore == poleNum)
        div.className += ' golden-design'
    divDesign = document.createElement('div')
    divDesign.className = 'div-design-lower'
    divDesign.style.width = poleDesignWidth + 'px'
    if(highScore == poleNum)
        divDesign.className += ' golden-design'
    div.appendChild(divDesign)
    poleContainer.appendChild(div)
    poleSlide.appendChild(poleContainer)
    let margin = document.createElement('div')
    margin.style.width = poleGap + 'px'
    poleSlide.appendChild(margin)

    coordinates.push(points)
}
const checkCollision = () => {
    if(polePass == noOfPoles + 1) {
        yourScore.innerText = polePass - 1
        updateScore(polePass-1)
        gameOver(3000)
        return;
    }
    if(polePass%5 == 0) {
        poleSlideSpeed -= 0.001
        clearInterval(poleSlideInterval)
        poleSlideInterval = setInterval(() => {
            movePoleSlide(true)
        }, poleSlideSpeed)
    }
    let tempballY = ball.offsetTop
    let xAxis = coordinates[polePass-1].startX
    let upperStartY = coordinates[polePass-1].upper.startY
    let upperEndY   = coordinates[polePass-1].upper.endY + 45
    let lowerStartY = coordinates[polePass-1].lower.startY - 45
    let lowerEndY   = coordinates[polePass-1].lower.endY
    if(ballRelativeX >= xAxis && (tempballY <= upperEndY || tempballY >= lowerStartY)) { // pole start
        yourScore.innerText = polePass - 1
        updateScore(polePass-1)
        gameOver()
    }

    if(ballRelativeX > xAxis + 100) { // pole pass
        currScore.innerText = polePass
        polePass++;
        var au = new Audio('pole-cross-tune.mp3')
        au.play()
    }
}

const highscore = () => {
    let score = localStorage.getItem('pole-pass-highscore')
    if(!score)
        score = 0
    else {
        scoreBlock.innerText = score
    }
    highScore = score
    console.log('HighScore : ' + highScore)
}
highscore()

const updateScore = (newScore) => {
    let score = localStorage.getItem('pole-pass-highscore')
    if(score >= 0) {
        if(score < newScore) {
            localStorage.setItem('pole-pass-highscore', newScore)
            scoreBlock.innerText = newScore
            highScore = newScore
        }
    }
}

const resetHighscore = () => {
    localStorage.setItem('pole-pass-highscore', 0)
}


const dieball = () => {
    ball.style.background = 'linear-gradient(45deg, black, red)'
}

document.addEventListener('keyup', (e) => {
    if(e.keyCode == 13) {
        start()
    }
    if(e.keyCode == 32) {
        for(let i=1; i<=120; i++) {
            setTimeout(flyball, i)
        }
    }
})



for(let i=1; i<=noOfPoles; i++) {
    createPole()
}
addTheEnd()
poleSlideInterval = setInterval(() => {
    movePoleSlide(false)
}, 5)