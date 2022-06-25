'use strict';
const SACOBAN = '🎮'
const WALL = '☐';
const FLOOR = '0';
const BOX = '⚪';
const TARGET = '*';
const CLOCK = "1"
const GOLD = "2"
const MAGNET = "3"
const GLUE = "4"
const WATER = "5"

var gBoard;
var playerPostionImg = "Down"

//list of counters vars 
var gGame = {
    score: 0,
    isOn: false,
    stepCount: 0,
    collectedTarget: 0,

};
var freeStep = 10;


// counters vars that used to switch betwin the bonus apperes
var bonusSwitch = 1
var obsteclesSwitch = 1

//lis of intravals saved vars
var Add_Bonus_Interval
var Clear_Bonus_Interval
var Add_Obstacle_Interval
var Clear_Obstacle_Interval

// those cells stored the bonus/obsicle that appear evry 10 sec 
var emptyCellBonus
var emptyCellObsticle

var isBonus = true
var isObseticle = true




function init() {
    clearIntervals()
    gGame.isOn = true
    resetCounters()
    resetPlayerPos()
    gBoard = createBoard()
    gSacoban = createSacoban()
    addIntervals()
    printBoard()
}

// create the board
function createBoard() {
    const size = { I: 9, J: 8 }

    const wall = [
        [1, 1], [1, 2], [1, 6], [1, 7],
        [2, 6],
        [3, 1], [3, 2], [3, 6],
        [4, 2], [4, 3], [4, 6],
        [5, 2], [5, 7],
        [6, 7],
        [7, 7],

    ]

    const box = [[2, 3], [3, 4], [4, 4], [6, 1], [6, 3], [6, 4], [6, 5]]

    const target = [[2, 1], [3, 5], [4, 1], [5, 4], [6, 6], [7, 4]]

    var board = createEmpetyBoard(size.I, size.J)
    createOutWall(board, size.I, size.J)
    placeInTheBoard(board, wall, WALL, "null")
    placeInTheBoard(board, box, FLOOR, BOX)
    placeInTheBoard(board, target, TARGET, "null")
    return board
}


function createOutWall(board, sizeI, sizeJ) {
    let cell = {
        type: WALL,
        gameElement: "null"
    }
    for (var i = 0; i < sizeI; i++) {
        board[i][0] = cell
        board[i][sizeJ - 1] = cell
        for (var j = 0; j < sizeJ; j++) {
            board[0][j] = cell
            board[sizeI - 1][j] = cell
        }
    }
}


function createEmpetyBoard(width, height) {
    var board = []
    for (var i = 0; i < width; i++) {
        board[i] = []
        for (var j = 0; j < height; j++) {
            var cell = {
                type: FLOOR,
                gameElement: "null"
            }
            board[i][j] = cell
        }
    }
    return board
}
//palce the board with the sent elments like: wall/target/box....
function placeInTheBoard(board, parmeter, type, gameElement) {
    for (var i = 0; i < parmeter.length; i++) {
        var x = parmeter[i][0]
        var y = parmeter[i][1]

        board[x][y] = { type: type, gameElement: gameElement }
    }

    return board

}

function getBoard() {
    return gBoard
}

function printBoard() {
    var board = getBoard()
    var strHtml = ""
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j].type
            var cellElement = board[i][j].gameElement

            if (cell === FLOOR) strHtml += `<td class="floor cell " onclick="moveTo(${i},${j})" >`
            else if (cell === WALL) strHtml += `<td class="wall cell" onclick="moveTo(${i},${j})" >`
            else if (cell === TARGET) strHtml += `<td class="target cell " onclick="moveTo(${i},${j})">`

            if (cellElement === SACOBAN) strHtml += `<img class="player" src="pics/Character${playerPostionImg}.png"></img>`
            else if (cellElement === BOX) strHtml += `<img src="pics/box.png"></img>`
            else if (cellElement === CLOCK) strHtml += `<img src="pics/clock.png"></img>`
            else if (cellElement === GOLD) strHtml += `<img src="pics/gold.png"></img>`
            else if (cellElement === MAGNET) strHtml += `<img src="pics/magnet.png"></img>`
            else if (cellElement === GLUE) strHtml += `<img src="pics/glue.png"></img>`
            else if (cellElement === WATER) strHtml += `<img src="pics/water.png"></img>`


        }
        strHtml += `</td ></tr >`
    }

    document.querySelector(".gameBoard").innerHTML = strHtml

}
//check if the game is over
function isWin() {
    if (gGame.stepCount === 0) {
        alert("game over u used all 100 steps")
        init()
    }
    var board = getBoard()
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].type === TARGET && board[i][j].gameElement === BOX) gGame.collectedTarget++
        }
    }
    if (gGame.collectedTarget === 6) {
        alert("u win")
        gGame.isOn = false

        init();
        return
    }
    gGame.collectedTarget = 0;

}

function undo() {


    if (undoBoard.length - 1 >= 1) {
        undoBoard.pop()
        undoGamerPos.pop()
        gGame.stepCount++
        document.querySelector(".stepScore").innerText = "Steps: " + gGame.stepCount

    }
    gBoard = undoBoard[undoBoard.length - 1]
    gGamerPos = undoGamerPos[undoGamerPos.length - 1]

    printBoard()
}
//update the score and the steps
function updateStepScore() {
    var player = getPlayer()

    if (player.isClock) {
        freeStep--
        if (freeStep === 0) {
            player.isClock = false
            freeStep = 10
        }
    }
    else {
        gGame.stepCount--
        document.querySelector(".stepScore").innerText = "Steps: " + gGame.stepCount
    }
}
//reset the counters 
function resetCounters() {
    gGame.stepCount = 100;
    gGame.collectedTarget = 0;
    gGame.score = 0
    document.querySelector(".stepScore").innerText = "Steps: " + gGame.stepCount
    document.querySelector(".score").innerText = "score: " + gGame.score

}

// bounus section:
// add 1/3 of the bonus(each time other bonus) 
function addBonus() {

    if (bonusSwitch > 3) bonusSwitch = 1


    if (bonusSwitch === 1) {
        CreateBonus(CLOCK)
        bonusSwitch++
    }
    else if (bonusSwitch === 2) {
        CreateBonus(GOLD)
        bonusSwitch++
    }
    else if (bonusSwitch === 3) {
        CreateBonus(MAGNET)
        bonusSwitch++
    }
}
//create bonus by the parmater that sent 
function CreateBonus(bonus) {
    isBonus = true;
    var board = getBoard()
    emptyCellBonus = getRandomEmetyCell()
    board[emptyCellBonus.i][emptyCellBonus.j].gameElement = bonus
    printBoard()
}
// clear the bonus
function clearBonus() {

    isBonus = !isBonus
    if (isBonus) {
        var board = getBoard()
        board[emptyCellBonus.i][emptyCellBonus.j].gameElement = "null"
        printBoard()
    }
}

//obstacles section:
// add 1/2 of the obstacle(each time other obsatcale) 
function addObstacles() {
    if (obsteclesSwitch > 2) obsteclesSwitch = 1

    if (obsteclesSwitch === 1) {
        createObstacle(GLUE)
        obsteclesSwitch++
    }
    else if (obsteclesSwitch === 2) {
        createObstacle(WATER)
        obsteclesSwitch++
    }
}
//create obsatcle by the parmater that sent 
function createObstacle(obstacle) {
    isObseticle = true;
    var board = getBoard()
    emptyCellObsticle = getRandomEmetyCell()
    board[emptyCellObsticle.i][emptyCellObsticle.j].gameElement = obstacle
    printBoard()
}
// clear the obastcle
function clearObsitcle() {

    isObseticle = !isObseticle
    if (isObseticle) {
        var board = getBoard()
        board[emptyCellObsticle.i][emptyCellObsticle.j].gameElement = "null"
        printBoard()
    }
}

function getRandomIntInc(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function addIntervals() {
    Add_Bonus_Interval = setInterval(addBonus, 10000)
    Clear_Bonus_Interval = setInterval(clearBonus, 5000)
    Add_Obstacle_Interval = setInterval(addObstacles, 10000)
    Clear_Obstacle_Interval = setInterval(clearObsitcle, 5000)

}

function clearIntervals() {
    clearInterval(Add_Bonus_Interval)
    clearInterval(Clear_Bonus_Interval)
    clearInterval(Add_Obstacle_Interval)
    clearInterval(Clear_Obstacle_Interval)
}
//find empty cell 
function findEmetyCells() {
    var board = getBoard()
    var emptyCells = []
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board[0].length - 1; j++) {
            if (board[i][j].type === FLOOR && board[i][j].gameElement === "null") emptyCells.push({ i: i, j: j })
        }
    }
    return emptyCells
}
//return random empty cell
function getRandomEmetyCell() {
    var emptyCells = findEmetyCells()
    var randomEmptyCell = emptyCells[getRandomIntInc(0, emptyCells.length - 1)]
    return randomEmptyCell
}

function createManuelBoard() {
    init()
    gBoard = []
    var boardSize = getRandomIntInc(8, 11)
    gBoard = createEmpetyBoard(boardSize, boardSize)
    createOutWall(gBoard, boardSize, boardSize)
    createSacoban()
    placeRandomlyMap()
    printBoard()
}

function placeRandomlyMap() {
    var board = getBoard()
    for (var i = 0; i < 20; i++) {
        var randomCell = getRandomEmetyCell()
        if (i >= 0 && i < 6) board[randomCell.i][randomCell.j] = { type: FLOOR, gameElement: BOX }
        else if (i >= 6 && i < 12) board[randomCell.i][randomCell.j] = { type: TARGET, gameElement: "null" }
        else board[randomCell.i][randomCell.j] = { type: WALL, gameElement: "null" }
    }
}


