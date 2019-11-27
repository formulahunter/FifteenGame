interface CoordinatePair {
    x: number,
    y: number
}
interface Tile extends CoordinatePair {
    num: number
}

/** A Direction indicates a unit vector along the x- OR y- axis, but never both
 *  and never the zero-vector
 */
type Direction = DirectionX | DirectionY;
/**  Unit vector along x-axis (can be positive or negative) */
interface DirectionX extends CoordinatePair {
    x: 1 | -1,
    y: 0
}
/**  Unit vector along y-axis (can be positive or negative) */
interface DirectionY extends CoordinatePair {
    x: 0,
    y: 1 | -1
}

class BoundedValue {

    readonly min: number;
    readonly max: number;
    private _val?: number;

    constructor(min: number, max: number, value?: number) {
        this.min = min;
        this.max = max;
        this.val = value;
    }

    get val(): number|undefined {
        return this._val;
    }
    set val(val: number|undefined) {
        if(val !== undefined) {
            if(val < this.min) {
                let er = new Error(`${val} is below the minimum bound of ${this.min}`);
                er.name = 'BoundedValueBelowMinimum';
                throw er;
            }
            if(val > this.max) {
                let er = new Error(`${val} is above the maximum bound of ${this.max}`);
                er.name = 'BoundedValueAboveMaximum';
                throw er;
            }
        }

        this._val = val;
    }
    valueOf(): number|undefined {
        return this.val;
    }
}

interface BoundingBox {
    x: BoundedValue,
    y: BoundedValue
}

class GameBoard {
    /** An array indicating the tile at each position on the board. Tiles are
     *  located in the grid with indices as [x][y]. The number 0 holds the
     *  location of the empty space on the board.
     */
    private readonly tiles: number[][];

    /** Record all moves made during a game for undo/history */
    private _history: Direction[] = [];

    /* History index is always one position *ahead* of last *applied* move */
    private historyInd: number = 0;

    /** Count all moves (including undo/redo) */
    private _moveCount: number = 0;

    /** The offset of the upper-left corner of the first tile from the
     *  upper-left corner of the canvas element
     */
    private _offset: CoordinatePair;
    /** The number of tiles along one axis of the board */
    private _gridSize: CoordinatePair;
    /** The length of one side of a square tile, in pixels */
    private _tileSize: number = 100;
    /** The width of the board's border, in pixels */
    private _border: number = 4;
    /** The width of the board's margin, in pixels. Everything within this
     *  margin is cleared when the board is drawn
     */
    private _margin: number = 2;
    /** Compute size once during construction */
    private _size: CoordinatePair;

    /** Font size of number characters on the board, in pixels */
    private _fontSize: number = -1;

    constructor(gridSize: CoordinatePair, size: CoordinatePair, offset: CoordinatePair) {

        this._gridSize = gridSize;
        this._size = size;
        this._offset = offset;

        //  Define the tileSize property
        this.tileSize = Math.round(this.size.x / this.gridSize.x);

        this.tiles = [];
        for (let i = 0; i < this.gridSize.x; ++i) {
            this.tiles[i] = [];
            for (let j = 0; j < this.gridSize.y; ++j) {
                this.tiles[i][j] = i + j * 4 + 1;
            }
        }

        //  0 is the empty space
        this.tiles[this.gridSize.x - 1][this.gridSize.y - 1] = 0;
    }


    get size(): CoordinatePair {
        return this._size;
    }
    set size(value: CoordinatePair) {
        this._size = value;
    }

    get margin(): number {
        return this._margin;
    }
    set margin(value: number) {
        this._margin = value;
    }

    get border(): number {
        return this._border;
    }
    set border(value: number) {
        this._border = value;
    }

    get tileSize(): number {
        return this._tileSize;
    }
    set tileSize(value: number) {
        this._tileSize = value;
        this._size = {
            x: this.gridSize.x * this.tileSize,
            y: this.gridSize.y * this.tileSize
        };
        if(this._fontSize !== -1) {
            console.debug('GameBoard tile size has been changed - consider' +
                ' updating font size using setFontSize()');
        }
    }

    get gridSize(): CoordinatePair {
        return this._gridSize;
    }
    set gridSize(value: CoordinatePair) {
        this._gridSize = value;
        this._size = {
            x: this.gridSize.x * this.tileSize,
            y: this.gridSize.y * this.tileSize
        };
    }

    get offset(): CoordinatePair {
        return this._offset;
    }
    set offset(value: CoordinatePair) {
        this._offset = value;
    }


    get defaultFontSize() {
        return this.tileSize * 0.6;
    }
    get fontSize(): number {
        if(this._fontSize === -1) {
            return this.defaultFontSize;
        }

        return this._fontSize;
    }
    set fontSize(value: number) {
        //  Setting the font size to -1 sets the font size to 60% of tile size
        if(value < 0 && value !== -1)
            throw new Error(`Cannot set GameBoard's font size to negative value: ${value}`);

        this._fontSize = value;
    }


    get history(): Direction[] {
        return this._history;
    }


    get emptySpace(): Tile {

        //  Return the index of the column containing 0 and the index of 0
        //  within that column
        function findZero(acc: [number, number], val: number[], ind: number): [number, number] {
            let zeroInd: number = val.indexOf(0);
            if(zeroInd >= 0) {
                acc.splice(0, 2, ind, zeroInd);
            }
            return acc;
        }

        //  Call reduce() with the initial value [-1, -1] so that the results
        //  can be verified
        let [col, row]: [number, number] = this.tiles.reduce(findZero, [-1, -1]);
        if(col === -1 || row === -1) {
            throw new Error('Error in GameBoard locating empty space');
        }

        //  Return the identified row/column
        let empty: Tile = {
            x: col,
            y: row,
            num: 0
        };
        return empty;
    }


    getBoundingBox(): BoundingBox {

        return {
            x: new BoundedValue(this.offset.x, this.offset.x + this.gridSize.x * this.tileSize),
            y: new BoundedValue(this.offset.y, this.offset.y + this.gridSize.y * this.tileSize)
        };
    }
    hit(point: CoordinatePair): boolean {
        let bounds: BoundingBox = this.getBoundingBox();

        return (
            point.x > bounds.x.min &&
            point.x < bounds.x.max &&
            point.y > bounds.y.min &&
            point.y < bounds.y.max
        );
    }

    touch(point: CoordinatePair) {

        //  Adjust point for window scroll position and GameBoard position
        point.x += window.scrollX - this.offset.x;
        point.y += window.scrollY - this.offset.y;

        //  Identify which tile was touched
        let col: number = Math.trunc(point.x / this.tileSize);
        let row: number = Math.trunc(point.y / this.tileSize);
        const tile: Readonly<Tile> = {
            x: col,
            y: row,
            num: this.tiles?.[col]?.[row]
        };
        if(tile.num === undefined) {
            throw new Error('The click event seems to be in bounds of the' +
                ' game board, but there was an error identifying the clicked' +
                ` tile at grid location {x: ${tile.x}, y: ${tile.y}}`);
        }
        if(tile.num === 0) {
            //  The empty tile was clicked
            //  Do nothing
            console.debug('The empty tile was clicked\nnothing to do');
            return;
        }

        //  Locate the empty cell
        let empty: Tile = this.emptySpace;

        //  Determine the relative grid locations of the "touched" tile and the
        //  empty space
        let displacement: CoordinatePair = {
            x: tile.x - empty.x,
            y: tile.y - empty.y
        };
        if(displacement.x !== 0 && displacement.y !== 0) {
            //  Clicked tile is not in the same row OR column as the empty tile
            //  Do nothing
            console.debug(`Tile ${tile.num} is not aligned with the empty tile\nnothing to do`);
            return;
        }

        //  Separate the displacement from the direction on each axis
        //  Remember that one of x or y will always be zero - calculations are
        //  applied to both so that it doesn't matter which one is which
        let dir: Direction = <Direction>{
            x: Math.sign(displacement.x),
            y: Math.sign(displacement.y)
        };
        displacement = {
            x: Math.abs(displacement.x),
            y: Math.abs(displacement.y)
        };

        //  Start at the empty space's location in the grid and move each
        //  tile one position toward the empty space, then set the original
        //  tile's position to the new empty space
        let shift: CoordinatePair = {
            x: empty.x,
            y: empty.y
        };
        let numMoves: number = displacement.x === 0 ? displacement.y : displacement.x;
        for(let i = 0; i < numMoves; ++i) {
            shift = {
                x: shift.x + dir.x,
                y: shift.y + dir.y
            };
            this.moveTile(shift, dir);
        }
        this.tiles[tile.x][tile.y] = 0;
    }

    moveTile(tile: CoordinatePair, dir: Direction): CoordinatePair {

        //  Determine the tentative new coordinates and verify they point to the
        //  empty space
        //  Use subtraction to increment the coordinate because dir measures
        //  displacement *from empty to tile* but shift direction is *from tile
        //  tile to empty*
        let [x, y]: [number, number] = [tile.x - dir.x, tile.y - dir.y];
        console.debug(`Moving {${tile.x}, ${tile.y}} to {${x}, ${y}}`);
        let newCoords: Tile = {
            x: x,
            y: y,
            num: this.tiles[tile.x][tile.y]
        };
        if(this.tiles[newCoords.x][newCoords.y] !== 0) {
            throw new Error(`Cannot move tile at ${tile} to non-empty space
                                ${newCoords}`);
        }

        //  Update this.tiles to reflect the new tile and empty space positions
        this.tiles[newCoords.x][newCoords.y] = newCoords.num;
        this.tiles[tile.x][tile.y] = 0;

        //  Count and/or stack (for 'undo') the move
        if(this.historyInd === this.history.length) {
            this.history.push(dir);
        }
        else {
            this.history.splice(this.historyInd, this.history.length - this.historyInd, dir);
        }
        ++this.historyInd;
        ++this._moveCount;

        //  Return the new tile position/number
        return newCoords;
    }
    checkWin(): boolean {

        if(this.tiles[this.gridSize.x - 1][this.gridSize.y - 1] !== 0) {
            return false;
        }

        let numTiles = this.gridSize.x * this.gridSize.y - 1;
        for(let i = numTiles - 1; i >= 0; --i) {
            if(this.tiles[i % 4][Math.trunc(i / 4)] !== i + 1) {
                return false;
            }
        }

        return true;
    }

    undo() {
        if(this.historyInd === 0) {
            console.debug('No previous moves to undo');
            // console.debug(`historyInd: ${this.historyInd}\nhistory.length: ${this.history.length}`);
            return;
        }

        //  get the previous move
        let move: Direction = this.history[this.historyInd - 1];

        //  move pointed from empty -> tile *before* the tile was moved
        //  now points from tile -> empty
        //  get the current position of the empty tile
        //  subtract move from empty to get position of last moved tile
        let empty: Tile = this.emptySpace;
        let lastTile: Tile = {
            x: empty.x - move.x,
            y: empty.y - move.y,
            num: this.tiles[empty.x - move.x][empty.y - move.y]
        };

        //  Swap the empty and last moved tiles
        this.tiles[empty.x][empty.y] = lastTile.num;
        this.tiles[lastTile.x][lastTile.y] = 0;

        //  update history index
        --this.historyInd;

        //  increment move count
        ++this._moveCount;
    }
    redo() {
        if(this.history.length === 0 || this.historyInd === this.history.length) {
            console.debug('No subsequent moves to redo');
            return;
        }

        //  get the next move
        let move: Direction = this.history[this.historyInd];

        //  'redo' affects a move in the same direction as the original move
        //  (unlike undo)
        //  get the current position of the empty tile
        //  add move to empty to get position of the next moved tile
        let empty: Tile = this.emptySpace;
        let nextTile: Tile = {
            x: empty.x + move.x,
            y: empty.y + move.y,
            num: this.tiles[empty.x + move.x][empty.y + move.y]
        };

        //  swap the empty and next moved tiles
        this.tiles[empty.x][empty.y] = nextTile.num;
        this.tiles[nextTile.x][nextTile.y] = 0;

        //  update history index
        ++this.historyInd;

        //  increment move count
        ++this._moveCount;
    }

    shuffleTiles(): void {

        let temp: number[] = [];
        for(let i = 0; i < this.gridSize.x * this.gridSize.y; ++i) {
            temp[i] = i;
        }
        for(let x = 0; x < this.tiles.length; ++x) {
            for(let y = 0; y < this.tiles[x].length; ++y) {
                let ind = Math.trunc(Math.random() * temp.length);
                this.tiles[x][y] = temp.splice(ind, 1)[0];
            }
        }
    }

    /** Draw the current state to the canvas */
    draw(ctx: CanvasRenderingContext2D) {

        //  Clear the board area
        let start: CoordinatePair = {
            x: this.offset.x - this.border - this.margin / 2,
            y: this.offset.y - this.border - this.margin / 2
        };
        let size: CoordinatePair = {
            x: this.gridSize.x * this.tileSize + 2 * this.border + 2 * this.margin,
            y: this.gridSize.y * this.tileSize + 2 * this.border + 2 * this.margin
        };
        ctx.clearRect(start.x, start.y, size.x, size.y);

        //  Reassign `start` and `size` to draw the border (exclude the margin)
        start = {
            x: this.offset.x - this.border,
            y: this.offset.y - this.border
        };
        size = {
            x: this.gridSize.x * this.tileSize + 2 * this.border,
            y: this.gridSize.y * this.tileSize + 2 * this.border
        };

        //  Draw a rectangle for the entire board
        ctx.lineWidth = this.border;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(start.x, start.y, size.x, size.y);

        //  Draw tiles to te board
        for(let i = 0; i < this.gridSize.x; ++i) {
            for (let j = 0; j < this.gridSize.y; ++j) {

                let tile: number = this.tiles[i][j];
                if(tile === 0)
                    continue;

                //  Calculate the position of the tile wrt the board, in pixels
                let tileOffset: CoordinatePair = {
                    x: this.offset.x + i * this.tileSize,
                    y: this.offset.y + j * this.tileSize,
                };

                // Fill the tile and draw its outline
                ctx.beginPath();
                ctx.fillStyle = '#888888';
                ctx.fillRect(tileOffset.x, tileOffset.y, this.tileSize, this.tileSize);
                ctx.lineWidth = 2;
                ctx.strokeRect(tileOffset.x, tileOffset.y, this.tileSize, this.tileSize);

                //  Number the tile
                //  With alignment 'centered' and a 'middle' baseline,
                //  fillText() and strokeText() position text by the center
                //  of its bounding/em box so the only offset needed from the
                //  tile's origin is half the tile's width/height
                let char: string = tile.toString();
                ctx.beginPath();
                ctx.font = `${this.fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#444444';
                ctx.fillText(char,
                    tileOffset.x + (this.tileSize / 2),
                    tileOffset.y + (this.tileSize / 2));
                ctx.lineWidth = 1;
                ctx.strokeText(char,
                    tileOffset.x + (this.tileSize / 2),
                    tileOffset.y + (this.tileSize / 2));
            }
        }

        //  Paint the move count to the left of the board
        let padding: number = this.border + this.margin + 10;
        ctx.clearRect(this.offset.x - padding, this.offset.y, -100, this.size.y);
        ctx.font = `${this.fontSize}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#000000';
        ctx.fillText(this._moveCount.toString(), this.offset.x - padding, this.offset.y);
    }
}
