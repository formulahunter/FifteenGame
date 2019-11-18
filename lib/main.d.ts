declare function main(): void;
/** The canvas element */
/** A persistent drawing context */
/** An array indicating the positions (coordinates) of each tile on the board.
 *
 * The final element (index `tiles.length - 1`) is the empty space on the board.
 *
 * Each tile is numbered by its index in the array plus one, e.g. the element
 * at index 1 (the second element) gives the coordinates of the tile numbered
 * 1 + 1 = 2.
 */
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
/** Font size of number characters on the board, in pixels */
/** Draw the current state to the canvas */
