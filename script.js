"use strict";
const resultChecker = {
    isLeft(position, colval, player, gameArray) {
        let col = colval;
        let checkposition = position;
        while (col >= 0) {
            if (gameArray[checkposition] != player) {
                return false;
            }
            col--;
            checkposition--;
        }
        return true;
    },
    isRight(position, colval, player, gameArray, boxsize) {
        let col = colval;
        let checkposition = position;
        while (col < boxsize) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            col++;
            checkposition++;
        }
        return true;
    },
    isTop(position, rowval, player, gameArray, boxsize) {
        let row = rowval;
        let checkposition = position;
        while (row >= 0) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            row--;
            checkposition -= boxsize;
        }
        return true;
    },
    isBottom(position, rowval, player, gameArray, boxsize) {
        let row = rowval;
        let checkposition = position;
        while (row < boxsize) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            row++;
            checkposition += boxsize;
        }
        return true;
    },
    topleftDiog(position, colval, rowval, player, gameArray, boxsize) {
        let row = rowval;
        let col = colval;
        let checkposition = position;
        while (row >= 0 && col >= 0) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            row--;
            col--;
            checkposition = checkposition - boxsize - 1;
        }
        if (row < 0 && col < 0) {
            return true;
        }
        return false;
    },
    bottomrightDiog(position, colval, rowval, player, gameArray, boxsize) {
        let row = rowval;
        let col = colval;
        let checkposition = position;
        while (row < boxsize && col < boxsize) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            row++;
            col++;
            checkposition = checkposition + boxsize + 1;
        }
        if (row >= boxsize && col >= boxsize) {
            return true;
        }
        return false;
    },
    toprightDiog(position, colval, rowval, player, gameArray, boxsize) {
        let row = rowval;
        let col = colval;
        let checkposition = position;
        while (row >= 0 && col < boxsize) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            row--;
            col++;
            checkposition = checkposition - (boxsize - 1);
        }
        if (row < 0 && col >= boxsize) {
            return true;
        }
        return false;
    },
    bottomleftDiog(position, colval, rowval, player, gameArray, boxsize) {
        let row = rowval;
        let col = colval;
        let checkposition = position;
        while (row < boxsize && col >= 0) {
            console.log('inside');
            if (gameArray[checkposition] != player) {
                return false;
            }
            row++;
            col--;
            checkposition = checkposition + (boxsize - 1);
        }
        if (row >= boxsize && col < 0) {
            return true;
        }
        return false;
    },
    checkHorizontal(position, colval, player, gameArray, boxsize) {
        return this.isLeft(position - 1, colval - 1, player, gameArray) && this.isRight(position + 1, colval + 1, player, gameArray, boxsize);
    },
    checkVertical(position, rowval, player, gameArray, boxsize) {
        return this.isTop(position - boxsize, rowval - 1, player, gameArray, boxsize) && this.isBottom(position + boxsize, rowval + 1, player, gameArray, boxsize);
    },
    checkDiagonal(position, colval, rowval, player, gameArray, boxsize) {
        return (this.topleftDiog(position - (boxsize + 1), colval - 1, rowval - 1, player, gameArray, boxsize) && this.bottomrightDiog(position + (boxsize + 1), colval + 1, rowval + 1, player, gameArray, boxsize)) || (this.toprightDiog(position - (boxsize - 1), colval + 1, rowval - 1, player, gameArray, boxsize) && this.bottomleftDiog(position + (boxsize - 1), colval - 1, rowval + 1, player, gameArray, boxsize));
    }
};
class TicToc {
    constructor() {
        this.initializeEventlistner();
        this.playerx = true;
        this.displayPlayer();
        this.isWin = false;
        this.isTie = false;
        this.noMoves = 0;
        this.boxsize = +document.getElementById('boxsize').value;
        this.gameArray = new Array(this.boxsize ** 2).fill('');
        this.generateGrid(0);
        console.log(this.gameArray);
    }
    initializeEventlistner() {
        document.getElementsByClassName('gamepage__box')[0].addEventListener('click', (event) => {
            if ('tagName' in event.target && event.target.tagName === 'BUTTON') {
                const btn = event.target;
                this.handlebuttonClick(btn);
                if (!this.isWin && !this.isTie) {
                    this.displayPlayer();
                }
                if (this.isWin) {
                    btn.disabled = true;
                }
            }
        });
        document.getElementsByClassName('btn--start')[0].addEventListener('click', (event) => {
            const previousBoxsize = this.boxsize;
            this.boxsize = +document.getElementById('boxsize').value;
            this.gameArray = new Array(this.boxsize ** 2).fill('');
            console.log(this.gameArray);
            this.generateGrid(previousBoxsize);
            this.closePopup(document.getElementsByClassName('boxsize__popup')[0]);
        });
        document.getElementsByClassName('gamepage__buttons')[0].addEventListener('click', (event) => {
            if (event.target.className === 'btn gamepage__changeboxsize') {
                this.openPopup(document.getElementsByClassName('boxsize__popup')[0]);
            }
            else if (event.target.className === 'btn gamepage__btn--reset') {
                this.resetGame();
            }
        });
    }
    generateGrid(previousBoxsize) {
        const gridConatiner = document.getElementsByClassName('gamepage__box')[0];
        gridConatiner.style.setProperty('grid-template-columns', 'repeat(' + this.boxsize + ', 1fr)');
        gridConatiner.style.setProperty('grid-template-rows', 'repeat(' + this.boxsize + ', 150px)');
        if (previousBoxsize < this.boxsize) {
            this.addButton(previousBoxsize, gridConatiner);
        }
        else {
            this.removeButton(previousBoxsize, gridConatiner);
        }
    }
    addButton(previousBoxsize, gridConatiner) {
        for (let i = previousBoxsize ** 2; i < this.boxsize ** 2; i++) {
            const newBtn = document.createElement('button');
            newBtn.value = i.toString();
            gridConatiner.appendChild(newBtn);
        }
    }
    removeButton(previousBoxsize, gridConatiner) {
        var _a;
        const noOfRemovebtn = (previousBoxsize ** 2) - (this.boxsize ** 2);
        for (let i = 0; i < noOfRemovebtn; i++) {
            (_a = gridConatiner.lastChild) === null || _a === void 0 ? void 0 : _a.remove();
        }
    }
    handlebuttonClick(element) {
        this.noMoves++;
        this.gameArray[+element.value] = this.playerx ? 'x' : 'o';
        element.textContent = this.playerx ? 'X' : 'O';
        element.classList.add(this.playerx ? 'x' : 'o');
        element.disabled = true;
        if (this.noMoves >= (this.boxsize * 2 - 1)) {
            this.checkResult(+element.value);
        }
        this.playerx = !this.playerx;
    }
    checkResult(position) {
        let rowval = Math.floor(position / this.boxsize);
        let colval = Math.floor(position % this.boxsize);
        let currentPlayer = this.playerx ? 'x' : 'o';
        this.isWin = resultChecker.checkHorizontal(position, colval, currentPlayer, this.gameArray, this.boxsize) || resultChecker.checkVertical(position, rowval, currentPlayer, this.gameArray, this.boxsize) || resultChecker.checkDiagonal(position, colval, rowval, currentPlayer, this.gameArray, this.boxsize);
        const playerName = document.getElementsByClassName('gamepage__player')[0];
        if (this.isWin) {
            console.log(`Player ${this.playerx ? 'X' : 'O'} Win`);
            playerName.textContent = `Player ${this.playerx ? 'X' : 'O'} Win`;
            this.disableButtons();
        }
        else if (!this.gameArray.includes('')) {
            this.isTie = true;
            playerName.textContent = `Match Tie`;
        }
    }
    displayPlayer() {
        const playerName = document.getElementsByClassName('gamepage__player')[0];
        playerName.textContent = `Player ${this.playerx ? 'X' : 'O'} turn`;
    }
    disableButtons() {
        console.log("inside");
        document.querySelectorAll('.gamepage__box > button').forEach((element) => {
            const btn = element;
            btn.disabled = true;
        });
    }
    resetGame() {
        this.gameArray.fill('');
        this.isWin = false;
        this.isTie = false;
        this.displayPlayer();
        this.noMoves = 0;
        document.querySelectorAll('.gamepage__box > button').forEach((element) => {
            const btn = element;
            btn.disabled = false;
            btn.textContent = '';
            btn.classList.remove('x', 'o');
        });
    }
    openPopup(element) {
        element.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
    closePopup(element) {
        element.style.display = "none";
        document.body.style.overflow = "";
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    return new TicToc();
});
