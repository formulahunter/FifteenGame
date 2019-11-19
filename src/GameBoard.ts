interface CoordinatePair {
    x: number,
    y: number
}
interface Tile extends CoordinatePair {
    num: number
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

    /** The offset of the upper-left corner of the first tile from the
     *  upper-left corner of the canvas element
     */
    private _offset: CoordinatePair = {x: 250, y: 100};
    /** The number of tiles along one axis of the board */
    private _gridSize: CoordinatePair = {x: 4, y: 4};
    /** The length of one side of a square tile, in pixels */
    private _tileSize: number = 100;
    /** The width of the board's border, in pixels */
    private _border: number = 4;
    /** The width of the board's margin, in pixels. Everything within this
     *  margin is cleared when the board is drawn
     */
    private _margin: number = 2;

    /** The canvas drawing context */
    private _ctx: CanvasRenderingContext2D | null = null;
    /** Font size of number characters on the board, in pixels */
    private _fontSize: number;

    constructor() {

        this.tiles = [];
        for (let i = 0; i < this.gridSize.x; ++i) {
            this.tiles[i] = [];
            for (let j = 0; j < this.gridSize.y; ++j) {
                this.tiles[i][j] = i + j * 4 + 1;
            }
        }

        //  0 is the empty space
        this.tiles[this.gridSize.x - 1][this.gridSize.y - 1] = 0;

        //  Set the default font size
        this._fontSize = this.defaultFontSize;
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
        console.debug('GameBoard tile size has been changed - consider' +
            ' updating font size using setFontSize()');
    }

    get gridSize(): CoordinatePair {
        return this._gridSize;
    }
    set gridSize(value: CoordinatePair) {
        this._gridSize = value;
    }

    get offset(): CoordinatePair {
        return this._offset;
    }
    set offset(value: CoordinatePair) {
        this._offset = value;
    }


    get ctx(): CanvasRenderingContext2D | null {
        return this._ctx;
    }
    set ctx(value: CanvasRenderingContext2D | null) {
        this._ctx = value;
    }

    get defaultFontSize() {
        return this.tileSize * 0.6;
    }
    get fontSize(): number {
        return this._fontSize;
    }
    set fontSize(value: number) {
        //  Setting the font size to -1 sets the font size to 60% of tile size
        if(value < -1)
            value = this.tileSize * 0.6;
        else if(value < 0)
            throw new Error(`Cannot set GameBoard's font size to a negative value: ${value}`);

        this._fontSize = value;
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

        //  Identify which tile was touched
        let col: number = Math.trunc((point.x - this.offset.x) / (this.tileSize + this.border));
        let row: number = Math.trunc((point.y - this.offset.y) / (this.tileSize + this.border));
        let tile: Readonly<Tile> = {
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
        [col, row] = this.tiles.reduce((acc, val, ind) => {
            let zeroInd: number = val.indexOf(0);
            if(zeroInd >= 0) {
                acc.push(ind, zeroInd);
            }
            return acc;
        }, []);
        if(col === -1 || row === -1) {
            throw new Error('Error in GameBoard locating empty space');
        }
        let empty: Tile = {
            x: col,
            y: row,
            num: 0
        };

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

        //  Determine which axis and direction along that axis to move
        let axis: 'x'|'y' = displacement.x === 0 ? 'y' : 'x';
        let dir: number = Math.sign(displacement[axis]);
        console.debug(displacement, axis, dir);

        //  Start at the empty space's location in the grid and move each
        //  tile one position toward the empty space, then set the original
        //  tile's position to the new empty space
        let shift: CoordinatePair = {
            x: empty.x,
            y: empty.y
        };
        let next: CoordinatePair = {
            x: shift.x,
            y: shift.y
        };
        if(dir > 0) {
            for(let i = empty[axis]; i < tile[axis]; i += dir) {
                shift[axis] = i;
                next[axis] = i + dir;
                this.tiles[shift.x][shift.y] = this.tiles[next.x][next.y];
            }
        }
        else {
            for(let i = empty[axis]; i > tile[axis]; i += dir) {
                shift[axis] = i;
                next[axis] = i + dir;
                this.tiles[shift.x][shift.y] = this.tiles[next.x][next.y];
            }
        }
        this.tiles[tile.x][tile.y] = 0;

        this.draw();
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
    draw() {

        //  Get local drawing context reference and verify it has been assigned
        let ctx = this.ctx;
        if(ctx === null) {
            throw new Error('Cannot draw GameBoard: canvas rendering context' +
                ' has not been assigned');
        }

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
        for (let i = 0; i < this.gridSize.x; ++i) {
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
    }
}
