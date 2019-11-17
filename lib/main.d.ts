declare type CoordinatePair = [number, number];
declare function main(): void;
/** The canvas element */
declare let board: HTMLCanvasElement;
/** A persistent drawing context */
declare let ctx: CanvasRenderingContext2D;
/** The size of one side of the game board */
declare const SIZE: number;
/** An array indicating the positions (coordinates) of each tile on the board.
 *
 * The final element (index `tiles.length - 1`) is the empty space on the board.
 *
 * Each tile is numbered by its index in the array plus one, e.g. the element
 * at index 1 (the second element) gives the coordinates of the tile numbered
 * 1 + 1 = 2.
 */
declare let tiles: Array<CoordinatePair>;
/** The size of each tile on the board, in pixels */
declare const UNIT: number;
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
declare const BOARD: {
    size: number;
    pos: CoordinatePair;
    border: number;
    margin: number;
    tile: number;
};
/** Font size of number characters on the board, in pixels */
declare let fontSize: number;
/** Draw the current state to the canvas */
declare function draw(): void;
declare function shiftTiles(ev: MouseEvent): void;
declare function shuffleTiles(): void;
