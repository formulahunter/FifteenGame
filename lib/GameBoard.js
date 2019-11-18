"use strict";
class BoundedValue {
    constructor(min, max, value) {
        this.min = min;
        this.max = max;
        this.val = value;
    }
    get val() {
        return this._val;
    }
    set val(val) {
        if (val !== undefined) {
            if (val < this.min) {
                let er = new Error(`${val} is below the minimum bound of ${this.min}`);
                er.name = 'BoundedValueBelowMinimum';
                throw er;
            }
            if (val > this.max) {
                let er = new Error(`${val} is above the maximum bound of ${this.max}`);
                er.name = 'BoundedValueAboveMaximum';
                throw er;
            }
        }
        this._val = val;
    }
    valueOf() {
        return this.val;
    }
}
class GameBoard {
    constructor() {
        this._offset = { x: 250, y: 100 };
        this._gridSize = { x: 4, y: 4 };
        this._tileSize = 100;
        this._border = 4;
        this._margin = 2;
        this._ctx = null;
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
    get margin() {
        return this._margin;
    }
    set margin(value) {
        this._margin = value;
    }
    get border() {
        return this._border;
    }
    set border(value) {
        this._border = value;
    }
    get tileSize() {
        return this._tileSize;
    }
    set tileSize(value) {
        this._tileSize = value;
        console.debug('GameBoard tile size has been changed - consider' +
            ' updating font size using setFontSize()');
    }
    get gridSize() {
        return this._gridSize;
    }
    set gridSize(value) {
        this._gridSize = value;
    }
    get offset() {
        return this._offset;
    }
    set offset(value) {
        this._offset = value;
    }
    get ctx() {
        return this._ctx;
    }
    set ctx(value) {
        this._ctx = value;
    }
    get defaultFontSize() {
        return this.tileSize * 0.6;
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value) {
        //  Setting the font size to -1 sets the font size to 60% of tile size
        if (value < -1)
            value = this.tileSize * 0.6;
        else if (value < 0)
            throw new Error(`Cannot set GameBoard's font size to a negative value: ${value}`);
        this._fontSize = value;
    }
    getBoundingBox() {
        return {
            x: new BoundedValue(this.offset.x, this.offset.x + this.gridSize.x * this.tileSize),
            y: new BoundedValue(this.offset.y, this.offset.y + this.gridSize.y * this.tileSize)
        };
    }
    hit(point) {
        let bounds = this.getBoundingBox();
        return (point.x > bounds.x.min &&
            point.x < bounds.x.max &&
            point.y > bounds.y.min &&
            point.y < bounds.y.max);
    }
    draw() {
        //  Get local drawing context reference and verify it has been assigned
        let ctx = this.ctx;
        if (ctx === null) {
            throw new Error('Cannot draw GameBoard: canvas rendering context' +
                ' has not been assigned');
        }
        //  Clear the board area
        let start = {
            x: this.offset.x - this.border - this.margin / 2,
            y: this.offset.y - this.border - this.margin / 2
        };
        let size = {
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
                let tile = this.tiles[i][j];
                if (tile === 0)
                    continue;
                //  Calculate the position of the tile wrt the board, in pixels
                let tileOffset = {
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
                let char = tile.toString();
                ctx.beginPath();
                ctx.font = `${this.fontSize}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#444444';
                ctx.fillText(char, tileOffset.x + (this.tileSize / 2), tileOffset.y + (this.tileSize / 2));
                ctx.lineWidth = 1;
                ctx.strokeText(char, tileOffset.x + (this.tileSize / 2), tileOffset.y + (this.tileSize / 2));
            }
        }
    }
}
//# sourceMappingURL=GameBoard.js.map