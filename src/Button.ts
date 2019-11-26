class Button {

    /** The offset of the upper-left corner from the upper-left corner of the
     *  canvas
     */
    private _offset: CoordinatePair;

    /** Width & height */
    private _size: CoordinatePair;
    /** The width of the board's border, in pixels */
    private _border: number = 3;
    /** The width of the board's margin, in pixels. Everything within this
     *  margin is cleared when the board is drawn
     */
    private _margin: number = 1;

    constructor(offset: CoordinatePair, size: CoordinatePair) {
        this._offset = offset;
        this._size = size;
    }

    get offset(): CoordinatePair {
        return this._offset;
    }
    set offset(value: CoordinatePair) {
        this._offset = value;
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

    getBoundingBox(): BoundingBox {
        return {
            x: new BoundedValue(this.offset.x, this.offset.x + this.size.x),
            y: new BoundedValue(this.offset.y, this.offset.y + this.size.y)
        }
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

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.translate(this.offset.x, this.offset.y);
        ctx.clearRect(-this.margin, -this.margin,
                      this.size.x + this.margin, this.size.y + this.margin);


        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(0, 0, this.size.x, this.size.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, this.size.x, this.size.y);

        let arrowLength: number = 40;
        let headLength: number = 15;
        ctx.translate(this.size.x / 2 - arrowLength / 2, this.size.y / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(arrowLength, 0);
        ctx.moveTo(0, 0);
        ctx.rotate(-30 * Math.PI / 180);
        ctx.lineTo(headLength, 0);
        ctx.moveTo(0, 0);
        ctx.rotate(60 * Math.PI / 180);
        ctx.lineTo(headLength, 0);
        ctx.stroke();
        ctx.resetTransform();
    }
}
