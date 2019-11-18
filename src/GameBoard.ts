interface CoordinatePair {
    x: number,
    y: number
}

interface ValueBounds {
    min: number,
    max: number
}

interface BoundingBox {
    x: ValueBounds,
    y: ValueBounds
}

class GameBoard {

    private readonly tiles: number[][];
    private _offset: CoordinatePair = {x: 250, y: 100};
    private _gridSize: CoordinatePair = {x: 4, y: 4};
    private _tileSize: number = 100;
    private _border: number = 4;
    private _margin: number = 2;

    private _ctx: CanvasRenderingContext2D | null = null;

    constructor() {

        this.tiles = [];
        for (let i = 0; i < this.gridSize.x; ++i) {
            this.tiles[i] = [];
            for (let j = 0; j < this.gridSize.y; ++j) {
                this.tiles[i][j] = i * 4 + j + 1;
            }
        }

        //  0 is the empty space
        this.tiles[this.gridSize.x - 1][this.gridSize.y - 1] = 0;
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


    getBoundingBox(): BoundingBox {

        return {
            x: {
                min: this.offset.x,
                max: this.offset.x + this.gridSize.x * this.tileSize
            },
            y: {
                min: this.offset.y,
                max: this.offset.y + this.gridSize.y * this.tileSize
            }
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
    }
}
