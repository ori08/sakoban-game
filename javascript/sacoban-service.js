'use strict';
var gSacoban
var gGamerPos = { i: 2, j: 2 }
var keyFromPlayer = ""


function createSacoban() {
    gSacoban = {
        isMagnet: false,
        isClock: false
    }
    var board = getBoard()


    var cell = {
        type: FLOOR,
        gameElement: SACOBAN
    }

    board[gGamerPos.i][gGamerPos.j] = cell;
    return gSacoban
}

function getNextLocation(ev) {
    var nextLocation = {
        i: gGamerPos.i,
        j: gGamerPos.j,
    }

    // var rotation

    switch (ev.code) {
        case 'ArrowUp':
            nextLocation.i--
            playerPostionImg = "Up"
            break;

        case 'ArrowDown':
            nextLocation.i++
            playerPostionImg = "Down"
            break;

        case 'ArrowLeft':
            nextLocation.j--
            playerPostionImg = "Left"
            break;

        case 'ArrowRight':
            nextLocation.j++
            playerPostionImg = "Right"
            break;
    }
    return nextLocation;
}

function getSacobanPos() {
    return gGamerPos
}

function resetPlayerPos() {
    gGamerPos = { i: 2, j: 2 }
    return gGamerPos


}

function getPlayer() {

    return gSacoban

}