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
                this.tiles[i][j] = i * 4 + j + 1;
            }
        }
        //  0 is the empty space
        this.tiles[this.gridSize.x - 1][this.gridSize.y - 1] = 0;
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
    }
}
//# sourceMappingURL=GameBoard.js.map