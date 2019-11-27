let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let board: GameBoard;
let undoButton: Button;
let redoButton: Button;

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

    //  Create the 'undo' button
    let undoOffset: CoordinatePair = {
        x: boardOffset.x,
        y: boardOffset.y + boardSize.y + board.margin + 10
    };
    let undoSize: CoordinatePair = {
        x: 80,
        y: 30
    };
    undoButton = new Button(undoOffset, undoSize);
    undoButton.draw = drawLeftArrow;

    //  Create the 'redo' button
    let redoOffset: CoordinatePair = {
        x: undoOffset.x + undoSize.x + 5,
        y: undoOffset.y
    };
    let redoSize = undoSize;
    redoButton = new Button(redoOffset, redoSize);
    redoButton.draw = drawRightArrow;

    //  Shuffle the board
    board.shuffleTiles();

    // Draw the board & undo button
    board.draw(ctx);
    undoButton.draw(ctx);
    redoButton.draw(ctx);

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
    if(undoButton.hit(click)) {
        board.undo();
        board.draw(ctx);
    }
    if(redoButton.hit(click)) {
        board.redo();
        board.draw(ctx);
    }
}

function drawLeftArrow(this: Button, ctx: CanvasRenderingContext2D): void {

    ctx.translate(this.offset.x, this.offset.y);
    ctx.clearRect(-this.margin, -this.margin,
        this.size.x + this.margin, this.size.y + this.margin);


    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(0, 0, this.size.x, this.size.y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, this.size.x, this.size.y);

    let arrowLength: number = 40;
    let headLength: number = 15;
    ctx.translate(this.size.x / 2 - arrowLength / 2, this.size.y / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.moveTo(0, 0);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.lineTo(headLength, 0);
    ctx.moveTo(0, 0);
    ctx.rotate(60 * Math.PI / 180);
    ctx.lineTo(headLength, 0);
    ctx.stroke();
    ctx.resetTransform();
}
function drawRightArrow(this: Button, ctx: CanvasRenderingContext2D): void {

    ctx.translate(this.offset.x, this.offset.y);
    ctx.clearRect(-this.margin, -this.margin,
        this.size.x + this.margin, this.size.y + this.margin);


    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(0, 0, this.size.x, this.size.y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, this.size.x, this.size.y);

    let arrowLength: number = 40;
    let headLength: number = 15;
    ctx.translate(this.size.x / 2 + arrowLength / 2, this.size.y / 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowLength, 0);
    ctx.moveTo(0, 0);
    ctx.rotate(-30 * Math.PI / 180);
    ctx.lineTo(-headLength, 0);
    ctx.moveTo(0, 0);
    ctx.rotate(60 * Math.PI / 180);
    ctx.lineTo(-headLength, 0);
    ctx.stroke();
    ctx.resetTransform();
}

// const DIRECTION = ['up', 'right', 'down', 'left'];
// function animateTile(tile, dir) {
//
// }
