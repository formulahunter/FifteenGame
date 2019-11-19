"use strict";
let board;
function main() {
    /** The canvas element */
    let canvas = document.getElementById('viewport');
    //  Make sure the canvas element's size agrees with its CSS-styled size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    //  Verify the canvas rendering context is accessible
    let ctx = canvas.getContext('2d');
    if (ctx === null) {
        throw new Error(`Error accessing canvas rendering context`);
    }
    //  Create a GameBoard instance and assign its ctx property
    board = new GameBoard();
    board.ctx = ctx;
    //  Shuffle the board and draw its initial state
    board.shuffleTiles();
    board.draw();
    //  Define the click event handler
    canvas.addEventListener('click', canvasClicked);
}
document.addEventListener('DOMContentLoaded', main);
function canvasClicked(ev) {
    let click = { x: ev.clientX, y: ev.clientY };
    if (board.hit(click)) {
        board.touch(click);
    }
}
// const DIRECTION = ['up', 'right', 'down', 'left'];
// function animateTile(tile, dir) {
//
// }
//# sourceMappingURL=main.js.map