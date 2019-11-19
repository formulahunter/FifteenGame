interface CoordinatePair {
    x: number;
    y: number;
}
interface Tile extends CoordinatePair {
    num: number;
}
/** A Direction indicates a unit vector along the x- OR y- axis, but never both
 *  and never the zero-vector
 */
declare type Direction = DirectionX | DirectionY;
/**  Unit vector along x-axis (can be positive or negative) */
interface DirectionX extends CoordinatePair {
    x: 1 | -1;
    y: 0;
}
/**  Unit vector along y-axis (can be positive or negative) */
interface DirectionY extends CoordinatePair {
    x: 0;
    y: 1 | -1;
}
declare class BoundedValue {
    readonly min: number;
    readonly max: number;
    private _val?;
    constructor(min: number, max: number, value?: number);
    get val(): number | undefined;
    set val(val: number | undefined);
    valueOf(): number | undefined;
}
interface BoundingBox {
    x: BoundedValue;
    y: BoundedValue;
}
declare class GameBoard {
    /** An array indicating the tile at each position on the board. Tiles are
     *  located in the grid with indices as [x][y]. The number 0 holds the
     *  location of the empty space on the board.
     */
    private readonly tiles;
    /** The offset of the upper-left corner of the first tile from the
     *  upper-left corner of the canvas element
     */
    private _offset;
    /** The number of tiles along one axis of the board */
    private _gridSize;
    /** The length of one side of a square tile, in pixels */
    private _tileSize;
    /** The width of the board's border, in pixels */
    private _border;
    /** The width of the board's margin, in pixels. Everything within this
     *  margin is cleared when the board is drawn
     */
    private _margin;
    /** The canvas drawing context */
    private _ctx;
    /** Font size of number characters on the board, in pixels */
    private _fontSize;
    constructor();
    get margin(): number;
    set margin(value: number);
    get border(): number;
    set border(value: number);
    get tileSize(): number;
    set tileSize(value: number);
    get gridSize(): CoordinatePair;
    set gridSize(value: CoordinatePair);
    get offset(): CoordinatePair;
    set offset(value: CoordinatePair);
    get ctx(): CanvasRenderingContext2D | null;
    set ctx(value: CanvasRenderingContext2D | null);
    get defaultFontSize(): number;
    get fontSize(): number;
    set fontSize(value: number);
    get emptySpace(): Tile;
    getBoundingBox(): BoundingBox;
    hit(point: CoordinatePair): boolean;
    touch(point: CoordinatePair): void;
    moveTile(tile: CoordinatePair, dir: Direction): CoordinatePair;
    shuffleTiles(): void;
    /** Draw the current state to the canvas */
    draw(): void;
}
