function main(): void {

    /** The canvas element */
    let canvas = <HTMLCanvasElement>document.getElementById('viewport');

    //  Make sure the canvas element's size agrees with its CSS-styled size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    //  Verify the canvas rendering context is accessible
    let ctx: CanvasRenderingContext2D|null = canvas.getContext('2d');
    if(ctx === null) {
        throw new Error(`Error accessing canvas rendering context`);
    }

    //  Create a GameBoard instance and assign its ctx property
    board = new GameBoard();
    board.ctx = ctx;

    //  Shuffle the board and draw its initial state
    //board.shuffle()
    board.draw();

    //  Define the click event handler
    canvas.addEventListener('click', canvasClicked);
}
document.addEventListener('DOMContentLoaded', main);

function canvasClicked(ev: MouseEvent): void {

    let click: CoordinatePair = {x: ev.clientX, y: ev.clientY};
    if(board.hit(click)) {
        board.touch(click);
    }
}

let board: GameBoard;

/*function shuffleTiles(): void {
    let temp: CoordinatePair[] = [];
    for(let i = tiles.length - 1; i >= 0; --i) {
        let ind = Math.trunc(Math.random() * tiles.length - 1);
        temp.push(tiles.splice(ind, 1)[0]);
    }
    tiles = temp;
}*/

// const DIRECTION = ['up', 'right', 'down', 'left'];
// function animateTile(tile, dir) {
//
// }
