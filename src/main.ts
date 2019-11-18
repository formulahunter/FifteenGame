function main(): void {

    /** The canvas element */
    let canvas = <HTMLCanvasElement>document.getElementById('viewport');

    //  Make sure the canvas element's size agrees with its CSS-styled size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    //  Define the click event handler
    // board.addEventListener('click', shiftTiles);

    //  Verify the canvas rendering context is accessible
    let ctx: CanvasRenderingContext2D|null = canvas.getContext('2d');
    if(ctx === null) {
        throw new Error(`Error accessing canvas rendering context`);
    }

    //  Create a GameBoard instance and assign its ctx property
    let board: GameBoard = new GameBoard();
    board.ctx = ctx;

    //  Shuffle the board and draw its initial state
    //board.shuffle()
    board.draw();
}
document.addEventListener('DOMContentLoaded', main);

/*function shiftTiles(ev: MouseEvent): void {

    //  Check the click coordinates wrt the board to verify that the click is
    //  on a tile
    let click: CoordinatePair = [ev.clientX - BOARD.pos[0], ev.clientY - BOARD.pos[1]];
    let bound: number = SIZE * BOARD.tile;

    let relX: number = click[0] % (BOARD.tile + BOARD.border);
    if(relX < 0 || relX > bound) {
        //  Click is outside of the board boundaries
        //  Do nothing
        console.debug(`${click} is outside of the game board\n`);
        return;
    }
    if(relX + BOARD.border >= BOARD.tile) {
        //  Border between tiles was clicked
        //  Do nothing
        console.debug(`${click} falls on a border between tiles\n`);
        return;
    }

    let relY: number = click[1] % (BOARD.tile + BOARD.border);
    if(relY < 0 || relY > bound) {
        //  Click is outside of the board boundaries
        //  Do nothing
        console.debug(`${click} is outside of the game board\nnothing to do`);
        return;
    }
    if(relY + BOARD.border >= BOARD.tile) {
        //  Border between tiles was clicked
        //  Do nothing
        console.debug(`${click} falls on a border between tiles\nnothing to do`);
        return;
    }

    //  Identify which tile was clicked
    let col: number = Math.floor(click[0] / (BOARD.tile + BOARD.border));
    let row: number = Math.floor(click[1] / (BOARD.tile + BOARD.border));
    let tileInd: number = tiles.findIndex(el => el[0] === col && el[1] === row);
    if(tileInd < 0) {
        //  Not sure why this would happen...
        //  ...but just in case
        console.error('The click event seems to be in bounds of the game' +
            ' board, but there was an error identifying the clicked tile');
        return;
    }
    if(tileInd === tiles.length - 1) {
        //  The empty tile was clicked
        //  Do nothing
        console.debug('The empty tile was clicked\nnothing to do');
        return;
    }

    //  Get the row/column of clicked tile relative to empty and verify that
    //  they are aligned on exactly one axis
    let tile: CoordinatePair = tiles[tileInd];
    let empty: CoordinatePair = tiles[tiles.length - 1];
    let displacement: CoordinatePair = [
        empty[0] - tile[0],
        empty[1] - tile[1]
    ];
    if(displacement[0] !== 0 && displacement[1] !== 0) {
        //  Clicked tile is not in the same row OR column as the empty tile
        //  Do nothing
        console.debug(`Tile ${tileInd + 1} is not aligned with the empty tile\nnothing to do`);
        return;
    }

    //  Determine which axis and direction along that axis to move
    //  `axis` is 1 if `tile` and `empty` are aligned on the x-axis, 0 if on y
    //  This will move `tile` along y if x is aligned and vice vera
    //  `dir` is the direction of change from `tile` to `empty`
    let axis: number = 1 - displacement.indexOf(0);
    let dir: number = Math.sign(displacement[axis]);
    console.debug(displacement, axis, dir);

    //  If there are other tiles between the empty one and the one clicked,
    //  they must be moved as well
    //  Start the loop at i = `dir` (not 0) because `tile` is added by default
    let tilesToShift: CoordinatePair[] = [tile];
    let shift: CoordinatePair | undefined;  //  Temp ref for intermediate tiles
    for(let i = dir; Math.abs(i) < Math.abs(displacement[axis]); i += dir) {
        //  Create a new CoordinatePair of the next tile between `empty` and
        //  `tile`
        let coords: CoordinatePair = <CoordinatePair> Array.from(tile);
        coords[axis] += i;

        shift = tiles.find(el => el[0] === coords[0] && el[1] === coords[1]);
        if(shift === undefined) {
            //  Not sure why this would happen...
            //  ...but just in case
            console.warn('The clicked and empty tiles don\'t seem to be' +
                ' adjacent, but there was an error identifying one of the' +
                ` intermediate tiles at ${coords}`);

            //  Return because otherwise the function would go on to change
            //  some tiles' positions but not others
            return;
        }
        tilesToShift.push(shift);
    }

    //  Shift all tiles and reset `empty` to the original position of `tile`
    for(shift of tilesToShift) {
        let temp: CoordinatePair = <CoordinatePair> Array.from(shift);
        shift[axis] += dir;
        console.debug(`Moved ${temp} to ${shift}`);
    }
    tiles[tiles.length - 1] = [col, row];

    draw();
}*/

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
