"use strict";
class TicToc {
    constructor() {
        this.initializeEventlistner();
        this.gameArray = ['', '', '', '', '', '', '', '', ''];
        this.winnigArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        this.playerx = true;
        this.displayPlayer();
        this.isWin = false;
        this.isTie = false;
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
        const resetButton = document.getElementsByClassName('gamepage__btn--reset')[0];
        resetButton.addEventListener('click', (event) => {
            this.resetGame();
        });
    }
    handlebuttonClick(element) {
        this.gameArray[+element.value] = this.playerx ? 'x' : 'o';
        element.textContent = this.playerx ? 'X' : 'O';
        element.classList.add(this.playerx ? 'x' : 'o');
        element.disabled = true;
        this.checkResult();
        this.playerx = !this.playerx;
    }
    checkResult() {
        for (let i = 0; i < this.winnigArray.length; i++) {
            const [a, b, c] = this.winnigArray[i];
            this.isWin = this.gameArray[a] && this.gameArray[a] == this.gameArray[b] && this.gameArray[a] == this.gameArray[c] ? true : false;
            if (this.isWin) {
                break;
            }
        }
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
        this.gameArray = ['', '', '', '', '', '', '', '', ''];
        this.isWin = false;
        this.isTie = false;
        this.displayPlayer();
        document.querySelectorAll('.gamepage__box > button').forEach((element) => {
            const btn = element;
            btn.disabled = false;
            btn.textContent = '';
            btn.classList.remove('x', 'o');
        });
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    return new TicToc();
});
