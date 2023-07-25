"use strict";
// SET NUMBER OF ROWS AND COLUMNS HERE.
let rows = 6;
let cols = 7;
let moveNumber = 0;
let gameOver = false;
var STATUS;
(function (STATUS) {
    STATUS["AVAILABLE"] = "AVAILABLE";
    STATUS["P1_SELECTED"] = "P1_SELECTED";
    STATUS["P2_SELECTED"] = "P2_SELECTED";
})(STATUS || (STATUS = {}));
// Interaction with individual tiles
class Tile {
    constructor(id) {
        this.id = id;
        this.status = STATUS.AVAILABLE;
        this.element = document.createElement('div');
        this.element.classList.add('tile');
        this.element.classList.add(this.status.toLowerCase());
        this.element.addEventListener('click', () => {
            this.handleClick();
        });
    }
    handleClick() {
        // If tile already selected or game is over nothing occurs
        if (this.status === STATUS.P1_SELECTED || this.status === STATUS.P2_SELECTED || gameOver === true)
            return;
        //Otherwise changes tiles status to new player.
        this.element.classList.remove(this.status.toLowerCase());
        if (moveNumber % 2 === 0)
            this.status = this.status === STATUS.AVAILABLE ? STATUS.P2_SELECTED : STATUS.AVAILABLE;
        else
            this.status = this.status === STATUS.AVAILABLE ? STATUS.P1_SELECTED : STATUS.AVAILABLE;
        this.element.classList.add(this.status.toLowerCase());
        moveNumber = moveNumber + 1;
    }
    get isSelectedP1() {
        return this.status === STATUS.P1_SELECTED;
    }
    get isSelectedP2() {
        return this.status === STATUS.P2_SELECTED;
    }
}
// Interaction with individual rows of tiles.
class Row {
    constructor(id, tileNumber) {
        this.id = id;
        this.tiles = Array.from({ length: tileNumber }).map((_, index) => {
            const tileId = tileNumber * id + index;
            return new Tile(tileId);
        });
        this.element = document.createElement('div');
        this.element.classList.add('row');
        this.element.append(...this.tiles.map((tile) => tile.element));
    }
    get selectedSeatsIdP1() {
        return this.tiles.filter((tile) => tile.isSelectedP1).map((tile) => tile.id);
    }
    get selectedSeatsIdP2() {
        return this.tiles.filter((tile) => tile.isSelectedP2).map((tile) => tile.id);
    }
}
// Interaction with tile map. Used to get array of numbers containing tiles for each player
class TileMap {
    constructor(rowNumber, tileNumberPerRow) {
        this.selectedTilesP1 = [];
        this.selectedTilesP2 = [];
        this.rows = Array.from({ length: rowNumber }).map((_, index) => {
            return new Row(index, tileNumberPerRow);
        });
        this.element = document.createElement('div');
        this.element.classList.add('tile-map');
        this.element.append(...this.rows.map((row) => row.element));
        this.element.addEventListener('click', () => {
            this.getSelectedSeatsIdP1();
            this.getSelectedSeatsIdP2();
        });
    }
    getSelectedSeatsIdP1() {
        this.selectedTilesP1 = this.rows.reduce((total, row) => {
            total = [...total, ...row.selectedSeatsIdP1];
            return total;
        }, []);
        //console.log(`selected tiles: ${this.selectedTilesP1.join(',')}`)
        //console.log('P1: '+checkIfWinner(this.selectedTilesP1))
        //console.log(moveNumber)
    }
    getSelectedSeatsIdP2() {
        this.selectedTilesP2 = this.rows.reduce((total, row) => {
            total = [...total, ...row.selectedSeatsIdP2];
            return total;
        }, []);
        //console.log(`selected tiles: ${this.selectedTilesP2.join(',')}`)
        console.log('P2: ' + checkIfWinner(this.selectedTilesP2));
        //console.log(moveNumber)
    }
}
// Reset button, reloads page thus reseting game.
class resetButton {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('reset');
        this.element.innerText = 'reset';
        this.element.addEventListener('click', () => {
            this.handleClick();
        });
    }
    handleClick() {
        location.reload();
    }
}
// Creates display layout module containing board, score and reset button to add to main div.
class displayLayout {
    constructor() {
        var _a;
        const boardMap = new TileMap(rows, cols);
        const resetElement = new resetButton;
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'gameSpace';
        this.gameContainer.classList.add('gameSpace');
        const scoreElement = document.createElement('div');
        scoreElement.classList.add('score');
        scoreElement.innerText = 'White Turn';
        this.gameContainer.appendChild(boardMap.element);
        this.gameContainer.appendChild(scoreElement);
        this.gameContainer.appendChild(resetElement.element);
        // With each click...
        this.gameContainer.addEventListener('click', () => {
            // Checks if either black or white won.
            if (checkIfWinner(boardMap.selectedTilesP1)) {
                scoreElement.innerText = 'Black Wins';
                gameOver = true;
            }
            else if (checkIfWinner(boardMap.selectedTilesP2)) {
                scoreElement.innerText = 'White Wins';
                gameOver = true;
            }
            else {
                //Otherwise checks for draw.
                if (moveNumber === rows * cols)
                    scoreElement.innerText = 'Draw';
                else {
                    //Finally checks who's turn it is.
                    if (moveNumber % 2 === 0)
                        scoreElement.innerText = 'White Turn';
                    else
                        scoreElement.innerText = 'Black Turn';
                }
            }
        });
        (_a = document.getElementById('game')) === null || _a === void 0 ? void 0 : _a.append(this.gameContainer);
    }
}
// Initiates display
const displayGame = new displayLayout();
// Various check for winner functions.
function checkIfWinner(board) {
    // Horizontal 
    for (let j = 0; j < cols * (rows - 1); j = j + cols) {
        for (let i = 0; i < cols - 4; i++) {
            if (board.includes(j + i) &&
                board.includes(j + i + 1) &&
                board.includes(j + i + 2) &&
                board.includes(j + i + 3) &&
                board.includes(j + i + 4)) {
                return true;
            }
        }
    }
    // Vertical 
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows * (cols - 4); i = i + cols) {
            if (board.includes(j + i) &&
                board.includes(j + i + cols) &&
                board.includes(j + i + 2 * cols) &&
                board.includes(j + i + 3 * cols) &&
                board.includes(j + i + 4 * cols)) {
                return true;
            }
        }
    }
    // Diagonal down 
    for (let j = 0; j < cols - 4; j++) {
        for (let i = 0; i < rows * (cols - 4); i = i + cols) {
            if (board.includes(j + i) &&
                board.includes(j + 1 + (i + cols)) &&
                board.includes(j + 2 + (i + cols * 2)) &&
                board.includes(j + 3 + (i + cols * 3)) &&
                board.includes(j + 4 + (i + cols * 4))) {
                return true;
            }
        }
    }
    // Diagonal up 
    for (let j = 0; j < cols - 4; j++) {
        for (let i = 4 * cols; i < rows * (cols); i = i + cols) {
            if (board.includes(j + i) &&
                board.includes(j + 1 + (i - cols)) &&
                board.includes(j + 2 + (i - cols * 2)) &&
                board.includes(j + 3 + (i - cols * 3)) &&
                board.includes(j + 4 + (i - cols * 4))) {
                return true;
            }
        }
    }
    return false;
}
