interface CoordinatePair {
    x: number;
    y: number;
}
interface ValueBounds {
    min: number;
    max: number;
}
interface BoundingBox {
    x: ValueBounds;
    y: ValueBounds;
}
declare class GameBoard {
    private readonly tiles;
    private _offset;
    private _gridSize;
    private _tileSize;
    private _border;
    private _margin;
    private _ctx;
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
    getBoundingBox(): BoundingBox;
    hit(point: CoordinatePair): boolean;
    draw(): void;
}
