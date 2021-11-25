'use strict'


const EMPTY = ' '
const MINE = '💥'
const FLAG = '🚩'

var gMineBoard = [];

var gMinesLocation = [];
// update the count
var gCount = {
    shownCount: 0,
    markedCount: 0
};

var gLevel = {
    SIZE: 4,
    MINE: 2
};
//  A Matrix
// containing cell objects:
// Each cell: 
var gBoard = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true

}

var gSecsInterval;
var gTimePassed;
var gNumOfFlags = 0;

const noContext = document.getElementById('noContextMenu');
noContext.addEventListener('contextmenu' , (e) => {
    e.preventDefault();
})



function initGame() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    cellClicked()
    gCount.shownCount;
    gCount.markedCount;
}
// buildBoard()
function buildBoard() {
    var bombCounter = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        // console.log(i);
        gMineBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false
            }
            gMineBoard[i][j] = cell
            // console.table(gMineBoard);

            if (Math.random() > 0.6 && bombCounter < gLevel.MINE) {
                cell.isMine = true
                gMinesLocation.push({ indexI: i, indexJ: j });
                bombCounter++;
                // console.log(bombCounter);
            }
        }
    }
    // return board;
}
// setMinesNegsCount(board)
function setMinesNegsCount(gMineBoard, gMinesLocation) {

    for (var minesIndex = 0; minesIndex < gMinesLocation.length; minesIndex++) {
        for (var i = gMinesLocation[minesIndex].indexI - 1; i <= gMinesLocation[minesIndex].indexI + 1; i++) {
            for (var j = gMinesLocation[minesIndex].indexJ - 1; j <= gMinesLocation[minesIndex].indexJ + 1; j++) {
                if (i === gMinesLocation[minesIndex].indexI && j === gMinesLocation[minesIndex].indexJ) continue;
                if (i < 0 || i > gMineBoard.length - 1) continue;
                if (j < 0 || j > gMineBoard[0].length - 1) continue;

                gMineBoard[i][j].negs += 1;
            }
        }
    }
}

// renderBoard(board) 

function renderBoard() {
    var strHtml = '';
    gMineBoard.forEach(function (cells, i) {
        strHtml += '<tr>';
        cells.forEach(function (cell, j) {
            var tdId = 'cell-' + i + '-' + j;
            strHtml += `<td id="${tdId}" oncontextmenu="cellMarked(this, ${i},${j})"</td>`;
        });
        strHtml += '</tr>';
    });
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
    setMinesNegsCount(gMineBoard, gMinesLocation);
}

// cellClicked(elCell, i, j) 
function cellClicked(elCell, i, j) {
    if (!gSecsInterval) {
        gSecsInterval = setInterval(function () {
            gTimePassed++;
            updateTime();
        }, 100)
    }
    if (gMineBoard.isMine) {
        var cellId = '#cell-' + i + '-' + j;
        var elCell = document.querySelector(cellId);
        elCell.innerHTML = 'X';
        var elCurrCell = document.querySelector('.game-over')
        elCurrCell.innerText = 'Game Over';
        if (gSecsInterval) clearInterval(gSecsInterval);
        var elCells = document.getElementsByTagName('td');
        for (var i = 0; i < elCells.length; i++) {
            elCells[i].style.backgroundColor = 'grey';
        }
    } else {
        if (!gMineBoard[i][j].isOpen) {
            if (gMineBoard[i][j].negs > 0) {
                elCell.innerHTML = gMineBoard[i][j].negs;
                elCell.style.backgroundColor = 'grey';
                gMineBoard[i][j].isOpen = true;
                gCount.shownCount++;
                checkGameOver();
            } else {
                gMineBoard[i][j].isOpen = true;
                gCount.shownCount++;
                checkGameOver();
                expandShown(gMineBoard, elCell, i, j);
            }
        }
    }
}



// expandShown(board, elCell,i, j)
function expandShown(gMineBoard, elCell, cellI, cellJ) {
    var currCell;
    
    checkGameOver();
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i > gMineBoard.length - 1) continue;
            if (j < 0 || j > gMineBoard[0].length - 1) continue;
            
            currCell = document.querySelector('#cell-' + i + '-' + j);
            if (currCell.children[0]) continue;
            else if (gMineBoard[i][j].isMine) continue;
            else if (gMineBoard[i][j].isOpen) continue;
            else {
                if (gMineBoard[i][j].negs > 0) {
                    currCell.innerHTML = gMineBoard[i][j].negs;
                    currCell.style.backgroundColor = 'grey';
                    gMineBoard[i][j].isOpen = true;
                    gCount.shownCount++;
                    checkGameOver();
                } else {
                    
                    gCount.shownCount++;
                    if (!elCell.children[0]) {
                        elCell.style.backgroundColor = 'grey';
                    }
                    currCell.style.backgroundColor = 'grey';
                    gMineBoard[i][j].isOpen = true;
                    
                    expandShown(gMineBoard, currCell, i, j);
                }
            }
        }
    }
}
// cellMarked(elCell) 
function cellMarked(elCell) {
    elCell.innerHTML = FLAG
    if(gMineBoard[i][j].isMine) {
        gCount.markedCount++;
        updateMinesLeft()
    } else {
        gNumOfFlags++;
    }
    checkGameOver();
}
// checkGameOver()
function checkGameOver() {
    if(gCount.shownCount + gCount.markedCount === Math.pow(gLevel.SIZE,2)) {
        var elWin = document.querySelector('.win')
        elWin.innerText = 'You WON!'
    
        if (gSecsInterval) clearInterval(gSecsInterval);
    }
}

function updateTime() {
    var elSpanTimer = document.querySelector('#spanTimer');
    elSpanTimer.innerText = gTimePassed / 10;
}