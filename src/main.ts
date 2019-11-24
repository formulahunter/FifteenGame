let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let board: GameBoard;
let undoButton: Button;

function main(): void {

    /** The canvas element */
    canvas = <HTMLCanvasElement>document.getElementById('viewport');

    //  Make sure the canvas element's size agrees with its CSS-styled size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    //  Verify the canvas rendering context is accessible
    let ctxTemp: CanvasRenderingContext2D|null = canvas.getContext('2d');
    if(ctxTemp === null) {
        throw new Error(`Error accessing canvas rendering context`);
    }
    ctx = ctxTemp;

    //  Create a GameBoard instance
    let boardGrid = {
        x: 4,
        y: 4
    };
    let boardSize: CoordinatePair = {
        x: 400,
        y: 400
    };
    let boardOffset: CoordinatePair = {
        x: 250,
        y: 100
    };
    board = new GameBoard(boardGrid, boardSize, boardOffset);

    let undoOffset: CoordinatePair = {
        x: boardOffset.x,
        y: boardOffset.y + boardSize.y + board.margin + 10
    };
    let undoSize: CoordinatePair = {
        x: 80,
        y: 30
    };
    undoButton = new Button(undoOffset, undoSize);

    //  Shuffle the board
    board.shuffleTiles();

    // Draw the board & undo button
    board.draw(ctx);
    undoButton.draw(ctx);

    //  Define the click event handler
    canvas.addEventListener('click', canvasClicked);
}
document.addEventListener('DOMContentLoaded', main);

function canvasClicked(ev: MouseEvent): void {

    let click: CoordinatePair = {x: ev.clientX, y: ev.clientY};
    if(board.hit(click)) {
        board.touch(click);
        board.draw(ctx);
    }
}

// const DIRECTION = ['up', 'right', 'down', 'left'];
// function animateTile(tile, dir) {
//
// }
