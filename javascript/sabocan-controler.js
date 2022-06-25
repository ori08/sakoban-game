'use strict';

var undoBoard = []
var undoGamerPos = []
var isGlue = true
var isMagnet = false
function moveSacoban(ev) {
    if (!isGlue) return

    // First Check if the game is over 
    isWin()
    if (!gGame.isOn) return
    // update the step score
    updateStepScore()

    var board = getBoard()
    var nextPos = getNextLocation(ev)
    var currPos = getSacobanPos()
    var currCell = board[currPos.i][currPos.j]
    var nextCell = board[nextPos.i][nextPos.j].type
    var nextCell_Element = board[nextPos.i][nextPos.j].gameElement



    if (nextCell_Element === GLUE) {
        gGame.stepCount -= 10
        updateStepScore()
        isGlue = false
        setTimeout(wait, 5000)

    }

    if (nextCell_Element === MAGNET) {
        isMagnet = true
    }

    if (nextCell_Element === CLOCK) {
        var player = getPlayer()
        player.isClock = true;
    }

    if (nextCell_Element === GOLD) {

        gGame.score += 100
        document.querySelector(".score").innerText = `score: ${gGame.score} `

    }

    //if the next cell is a box: 
    if (nextCell_Element === BOX) {
        gGamerPos = nextPos
        var posAfterBox = getNextLocation(ev)
        var cellAfterBox = board[posAfterBox.i][posAfterBox.j]
        var cellBox = board[currPos.i][currPos.j]

        //if the cell after the box is empty traget without box!
        if (cellAfterBox.type === TARGET && cellAfterBox.gameElement != BOX) {

            //update the current cell
            if (cellBox.type === TARGET) cellBox.type = TARGET
            else cellBox.type = FLOOR

            //move the player 
            changePlayerPosition(currPos.i, currPos.j, nextPos.i, nextPos.j, board)
            //move the box
            board[posAfterBox.i][posAfterBox.j].gameElement = BOX

            // print the board and save backup to undo
            saveBoardBackup(board)
            printBoard()
            return
        }

        //if the cell after the box is a wall (MAGNET mode pull from the wall)
        else if (cellAfterBox.type === WALL) {
            if (isMagnet) {
                var posBefore
                var posAfterTheBox
                var keyboard_KEY = ev.code

                if (keyboard_KEY === "ArrowUp") {
                    posBefore = { i: currPos.i + 1, j: currPos.j }
                    posAfterTheBox = { i: currPos.i - 1, j: currPos.j }
                }
                else if (keyboard_KEY === "ArrowDown") {
                    posBefore = { i: currPos.i - 1, j: currPos.j }
                    posAfterTheBox = { i: currPos.i + 1, j: currPos.j }
                }

                else if (keyboard_KEY === "ArrowRight") {
                    posBefore = { i: currPos.i, j: currPos.j - 1 }
                    posAfterTheBox = { i: currPos.i, j: currPos.j + 1 }
                }
                else if (keyboard_KEY === 'ArrowLeft') {
                    posBefore = { i: currPos.i, j: currPos.j + 1 }
                    posAfterTheBox = { i: currPos.i, j: currPos.j - 1 }
                }

                //check if the cell before the player is a box or wall  
                var cell_before_player = board[posBefore.i][posBefore.j]
                if (cell_before_player.gameElement === BOX || cell_before_player.type === WALL) {
                    gGamerPos = currPos
                    return
                }

                board[currPos.i][currPos.j].gameElement = BOX
                board[posAfterTheBox.i][posAfterTheBox.j].gameElement = "null"
                board[posBefore.i][posBefore.j].gameElement = SACOBAN
                gGamerPos = posBefore


                saveBoardBackup(board)
                printBoard()
                isMagnet = false
                return
            }
            else {
                gGamerPos = currPos
                // print the board and save backup to undo
                saveBoardBackup(board)
                printBoard()
                return
            }
        }

        //if the cell after the box is a box
        else if (cellAfterBox.gameElement === BOX) {
            gGamerPos = currPos
            // print the board and save backup to undo
            saveBoardBackup(board)
            printBoard()
            return
        }

        //if the cell after the box is a floor
        else {




            //update the current cell
            if (cellBox.type === TARGET) board[currPos.i][currPos.j].type = TARGET
            else board[currPos.i][currPos.j].type = FLOOR

            //move the player 
            changePlayerPosition(currPos.i, currPos.j, nextPos.i, nextPos.j, board)
            //move the box
            board[posAfterBox.i][posAfterBox.j].gameElement = BOX


            // print the board and save backup to undo
            saveBoardBackup(board)
            printBoard()
            return
        }
    }

    //if the next cell is a floor: 
    if (nextCell === FLOOR) {
        gGamerPos = nextPos

        //update the current cell
        if (currCell.type === TARGET) board[currPos.i][currPos.j].type = TARGET
        else board[currPos.i][currPos.j].type = FLOOR

        //move the player 
        changePlayerPosition(currPos.i, currPos.j, nextPos.i, nextPos.j, board)


        // print the board and save backup to undo
        saveBoardBackup(board)
        printBoard()
        return
    }

    //if the next cell is a target: 
    if (nextCell === TARGET) {
        gGamerPos = nextPos

        //update the current cell
        if (currCell.type === TARGET) board[currPos.i][currPos.j].type = TARGET
        else board[currPos.i][currPos.j].type = FLOOR

        //move the player 
        changePlayerPosition(currPos.i, currPos.j, nextPos.i, nextPos.j, board)

        // print the board and save backup to undo
        saveBoardBackup(board)
        printBoard()
        return
    }
}

function saveBoardBackup(board) {

    var boardBackup = board
    var gamerPosBackup = gGamerPos
    saveToStorage("board", gamerPosBackup)
    saveToStorage("gamer", boardBackup)
    undoBoard.push(loadFromStorage("gamer"))
    undoGamerPos.push(loadFromStorage("board"))

}


function moveTo(i, j) {
    var ev
    var currPos = getSacobanPos()
    var nextLocation = { i: i, j: j }

    if (nextLocation.i - currPos.i === -1 && nextLocation.j === currPos.j)
        ev = { isTrusted: true, key: 'ArrowUp', code: 'ArrowUp' }
    else if (nextLocation.i - currPos.i === 1 && nextLocation.j === currPos.j)
        ev = { isTrusted: true, key: 'ArrowDown', code: 'ArrowDown' }
    else if (nextLocation.i === currPos.i && nextLocation.j - currPos.j === -1)
        ev = { isTrusted: true, key: 'ArrowLeft', code: 'ArrowLeft' }
    else if (nextLocation.i === currPos.i && nextLocation.j - currPos.j === 1)
        ev = { isTrusted: true, key: 'ArrowRight', code: 'ArrowRight' }
    else return




    moveSacoban(ev)

}

function wait() {
    isGlue = true



}

function changePlayerPosition(currentPosI, currentPosJ, nextPosI, nextPosJ, board) {

    board[currentPosI][currentPosJ].gameElement = "null"
    board[nextPosI][nextPosJ].gameElement = SACOBAN
    return board
}