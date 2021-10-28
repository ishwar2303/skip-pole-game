var birdY
var dropInterval
var bodyHeight = document.body.offsetHeight
var bodyWidth = document.body.offsetWidth
var poleRef = bodyWidth + 100
var coordinates = []
var poleSlideInterval
var polePass = 1
var birdRelativeX 
var highScore = 0

const scoreBlock = document.getElementById('high-score')
const currScore = document.getElementById('curr-score')
const yourScore = document.getElementById('your-score')
const playBtn = document.getElementById('play-btn')
const playContainerOption = document.getElementById('play-and-score-container')
const poleSlide = document.getElementById('pole-slide')
const overlay = document.getElementById('overlay')
const touch = document.getElementById('touch-plate')
const bird  = document.getElementById('bird')

playBtn.addEventListener('click', () => {
    start()
})

const start = () => {
    coordinates = []
    bird.style.display = 'block'
    clearInterval(poleSlideInterval)
    polePass = 1
    overlay.style.display = 'none'
    poleRef = bodyWidth + 100
    currScore.innerText = 0
    bird.style.top = bodyHeight/2 - 25 + 'px'
    bird.style.left = bodyWidth/2  + 'px'
    birdY = bodyHeight/2 - 25
    birdRelativeX = bodyWidth/2
    dropInterval = setInterval(dropBird, 0.5)
    playContainerOption.style.display = 'none'
    poleSlide.innerHTML = ''
    poleSlide.style.left = '0'
    let div = document.createElement('div')
    div.style.width = bodyWidth + 100 + 'px'
    div.style.height = '100%'
    poleSlide.appendChild(div)
    for(let i=1; i<=100; i++) {
        createPole(i)
    }
    poleSlideInterval = setInterval(() => {
        movePoleSlide(true)
    }, 7)
} 

const restart = () => {
    playContainerOption.style.display = 'flex'
}
const addTouch = () => {
    touch.addEventListener('click', () => {
        for(let i=1; i<=120; i++) {
            setTimeout(flyBird, i)
        }
    })
}
addTouch()
const flyBird = () => {
    if(birdY <= 0)
        return
    birdY -= 1.5
    bird.style.top = birdY + 'px'
    
}
const dropBird = () => {
    birdY += 1.8
    bird.style.top = birdY + 'px'
    if(birdY >= bodyHeight - 25) {
        gameOver()
    }
}
const gameOver = () => {
    var au = new Audio('break.mp3')
    au.play()
    clearInterval(dropInterval)
    clearInterval(poleSlideInterval)
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
        birdRelativeX += 2
        checkCollision()
    }
    poleSlide.style.left = pos + 'px'
}

const createPole = (poleNum) => {

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
    points.endX   = poleRef + 100
    poleRef += 350

    let availableHeight = bodyHeight - 300
    let breakRatio = Math.random().toFixed(1)*100
    let poleContainer = document.createElement('div')
    poleContainer.className = 'pole-container'
    poleContainer.style.height = '100%'
    poleContainer.style.width = '100px'
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
    if(highScore == poleNum)
        divDesign.className += ' golden-design'
    div.appendChild(divDesign)
    poleContainer.appendChild(div)
    poleSlide.appendChild(poleContainer)
    let margin = document.createElement('div')
    margin.style.width = '250px'
    poleSlide.appendChild(margin)

    coordinates.push(points)
}
const checkCollision = () => {
    if(polePass == 100) {
        gameOver()
    }
    let tempBirdY = bird.offsetTop
    let xAxis = coordinates[polePass-1].startX
    let upperStartY = coordinates[polePass-1].upper.startY
    let upperEndY   = coordinates[polePass-1].upper.endY + 45
    let lowerStartY = coordinates[polePass-1].lower.startY - 45
    let lowerEndY   = coordinates[polePass-1].lower.endY
    if(birdRelativeX >= xAxis && (tempBirdY <= upperEndY || tempBirdY >= lowerStartY)) { // pole start
        yourScore.innerText = polePass - 1
        updateScore(polePass-1)
        gameOver()
    }

    if(birdRelativeX > xAxis + 100) { // pole pass
        currScore.innerText = polePass
        polePass++;
        var au = new Audio('pole-cross-tune.mp3')
        au.play()
    }
}

const highscore = () => {
    let score = localStorage.getItem('pass-ball-highscore')
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
    let score = localStorage.getItem('pass-ball-highscore')
    if(score >= 0) {
        if(score < newScore) {
            localStorage.setItem('pass-ball-highscore', newScore)
            scoreBlock.innerText = newScore
            highScore = newScore
        }
    }
}

const resetHighscore = () => {
    localStorage.setItem('pass-ball-highscore', 0)
}

document.addEventListener('keyup', (e) => {
    if(e.keyCode == 13) {
        start()
    }
    if(e.keyCode == 32) {
        for(let i=1; i<=120; i++) {
            setTimeout(flyBird, i)
        }
    }
})


for(let i=1; i<=100; i++) {
    createPole()
}
poleSlideInterval = setInterval(() => {
    movePoleSlide(false)
}, 5)