"use strict";
//  vector in a more abstract sense
function main() {
    //  Assign the canvas to `board`
    board = document.getElementById('viewport');
    //  Make sure the canvas element's size agrees with its CSS-styled size
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    board.style.width = `${window.innerWidth}px`;
    board.style.height = `${window.innerHeight}px`;
    //  Define the click event handler
    board.addEventListener('click', shiftTiles);
    //  Verify the canvas rendering context is accessible
    let ctxCheck = board.getContext('2d');
    if (ctxCheck === null) {
        throw new Error(`Error accessing canvas rendering context`);
    }
    ctx = ctxCheck;
    //  Populate the `tiles` array and shuffle the board
    for (let i = 0; i < SIZE; ++i) {
        for (let j = 0; j < SIZE; ++j) {
            tiles[i * 4 + j] = [j, i];
        }
    }
    shuffleTiles(tiles);
    {
    }
    //  Draw the game board in its initial state
    draw();
}
document.addEventListener('DOMContentLoaded', main);
/** The canvas element */
let board;
/** A persistent drawing context */
let ctx;
/** The size of one side of the game board */
const SIZE = 4;
/** An array indicating the positions (coordinates) of each tile on the board.
 *
 * The final element (index `tiles.length - 1`) is the empty space on the board.
 *
 * Each tile is numbered by its index in the array plus one, e.g. the element
 * at index 1 (the second element) gives the coordinates of the tile numbered
 * 1 + 1 = 2.
 */
let tiles = [];
/** The size of each tile on the board, in pixels */
const UNIT = 100;
/** The board's display is based on HTML's box model - it has its content, a
 *  border, and a margin.
 *
 *  @property size - The number of tiles along one axis of the board
 *  @property pos - The offset of the upper-left corner of the first tile from
 *            the upper-left corner of the canvas element
 *  @property boarder - the width of the board's border, in pixels
 *  @property margin - the width of the board's margin, in pixels
 *  @property tile - the length of one side of one tile, in pixels
 */
const BOARD = {
    size: 4,
    pos: [250, 100],
    border: 4,
    margin: 2,
    tile: 100
};
/** Font size of number characters on the board, in pixels */
let fontSize = BOARD.tile * 0.6;
/** Draw the current state to the canvas */
function draw() {
    //  Clear the board area
    let start = [
        BOARD.pos[0] - BOARD.border - BOARD.margin / 2,
        BOARD.pos[1] - BOARD.border - BOARD.margin / 2
    ];
    let size = BOARD.size * BOARD.tile + 2 * BOARD.border + 2 * BOARD.margin;
    ctx.clearRect(start[0], start[1], size, size);
    //  Reassign `start` and `size` to draw the border (exclude the margin)
    start = [
        BOARD.pos[0] - BOARD.border,
        BOARD.pos[1] - BOARD.border
    ];
    size -= 2 * BOARD.margin;
    //  Draw a rectangle for the entire board
    ctx.beginPath();
    ctx.moveTo(...BOARD.pos);
    ctx.lineWidth = BOARD.border;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(start[0], start[1], size, size);
    //  Exclude the final element in tiles from this loop to so as to
    //  leave the "empty" tile blank
    for (let i = 0; i < tiles.length - 1; ++i) {
        let tile = tiles[i];
        //  Calculate the position of the tile wrt the board, in pixels
        let pos = [
            BOARD.pos[0] + tile[0] * BOARD.tile,
            BOARD.pos[1] + tile[1] * BOARD.tile
        ];
        // Fill the tile and draw its outline
        ctx.beginPath();
        ctx.fillStyle = '#888888';
        ctx.fillRect(pos[0], pos[1], BOARD.tile, BOARD.tile);
        ctx.lineWidth = 2;
        ctx.strokeRect(pos[0], pos[1], BOARD.tile, BOARD.tile);
        //  Number the tile
        //  With alignment 'centered' and a 'middle' baseline, fillText() and
        //  strokeText() position text by the center of its bounding/em box
        //  so the only offset that's necessary is half the tile's width/height
        let char = (i + 1).toString();
        ctx.beginPath();
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#444444';
        ctx.fillText(char, pos[0] + (BOARD.tile / 2), pos[1] + (BOARD.tile / 2));
        ctx.lineWidth = 1;
        ctx.strokeText(char, pos[0] + (BOARD.tile / 2), pos[1] + (BOARD.tile / 2));
    }
}
function shiftTiles(ev) {
    //  Check the click coordinates wrt the board to verify that the click is
    //  on a tile
    let click = [ev.clientX - BOARD.pos[0], ev.clientY - BOARD.pos[1]];
    let bound = SIZE * BOARD.tile;
    let relX = click[0] % (BOARD.tile + BOARD.border);
    if (relX < 0 || relX > bound) {
        //  Click is outside of the board boundaries
        //  Do nothing
        console.debug(`${click} is outside of the game board\n`);
        return;
    }
    if (relX + BOARD.border >= BOARD.tile) {
        //  Border between tiles was clicked
        //  Do nothing
        console.debug(`${click} falls on a border between tiles\n`);
        return;
    }
    let relY = click[1] % (BOARD.tile + BOARD.border);
    if (relY < 0 || relY > bound) {
        //  Click is outside of the board boundaries
        //  Do nothing
        console.debug(`${click} is outside of the game board\nnothing to do`);
        return;
    }
    if (relY + BOARD.border >= BOARD.tile) {
        //  Border between tiles was clicked
        //  Do nothing
        console.debug(`${click} falls on a border between tiles\nnothing to do`);
        return;
    }
    //  Identify which tile was clicked
    let col = Math.floor(click[0] / (BOARD.tile + BOARD.border));
    let row = Math.floor(click[1] / (BOARD.tile + BOARD.border));
    let tileInd = tiles.findIndex(el => el[0] === col && el[1] === row);
    if (tileInd < 0) {
        //  Not sure why this would happen...
        //  ...but just in case
        console.error('The click event seems to be in bounds of the game' +
            ' board, but there was an error identifying the clicked tile');
        return;
    }
    if (tileInd === tiles.length - 1) {
        //  The empty tile was clicked
        //  Do nothing
        console.debug('The empty tile was clicked\nnothing to do');
        return;
    }
    //  Get the row/column of clicked tile relative to empty and verify that
    //  they are aligned on exactly one axis
    let tile = tiles[tileInd];
    let empty = tiles[tiles.length - 1];
    let displacement = [
        empty[0] - tile[0],
        empty[1] - tile[1]
    ];
    if (displacement[0] !== 0 && displacement[1] !== 0) {
        //  Clicked tile is not in the same row OR column as the empty tile
        //  Do nothing
        console.debug(`Tile ${tileInd + 1} is not aligned with the empty tile\nnothing to do`);
        return;
    }
    //  Determine which axis and direction along that axis to move
    //  `axis` is 1 if `tile` and `empty` are aligned on the x-axis, 0 if on y
    //  This will move `tile` along y if x is aligned and vice vera
    //  `dir` is the direction of change from `tile` to `empty`
    let axis = 1 - displacement.indexOf(0);
    let dir = Math.sign(displacement[axis]);
    console.debug(displacement, axis, dir);
    //  If there are other tiles between the empty one and the one clicked,
    //  they must be moved as well
    //  Start the loop at i = `dir` (not 0) because `tile` is added by default
    let tilesToShift = [tile];
    let shift; //  Temp ref for intermediate tiles
    for (let i = dir; Math.abs(i) < Math.abs(displacement[axis]); i += dir) {
        //  Create a new CoordinatePair of the next tile between `empty` and
        //  `tile`
        let coords = Array.from(tile);
        coords[axis] += i;
        shift = tiles.find(el => el[0] === coords[0] && el[1] === coords[1]);
        if (shift === undefined) {
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
    for (shift of tilesToShift) {
        let temp = Array.from(shift);
        shift[axis] += dir;
        console.debug(`Moved ${temp} to ${shift}`);
    }
    tiles[tiles.length - 1] = [col, row];
    draw();
}
function shuffleTiles() {
    let temp = [];
    for (let i = tiles.length - 1; i >= 0; --i) {
        let ind = Math.trunc(Math.random() * tiles.length - 1);
        temp.push(tiles.splice(ind, 1)[0]);
    }
    tiles = temp;
}
// const DIRECTION = ['up', 'right', 'down', 'left'];
// function animateTile(tile, dir) {
//
// }
//# sourceMappingURL=main.js.map