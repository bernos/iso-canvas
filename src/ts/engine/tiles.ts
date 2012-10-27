//<reference path="../lib.d.ts"/>

import g = module("./geometry");

export class Tile {
    constructor (public srcRect: g.Rectangle, public srcImage: HTMLImageElement) {
    
    }
}

export class TileSet {
    public tiles: Tile[];
    public length: number = 0;
    private image: HTMLImageElement;    

    constructor (public src:string, public tileWidth: number, public tileHeight: number) {
        this.tiles = [];
        this.image = new Image();
    }

    load(callback: Function):void {
        this.image.onload = () => {
            this.onLoad(callback);
        }
        this.image.src = this.src;
    }

    private onLoad(callback: Function):void {
        var cols: number = Math.floor(this.image.width / this.tileWidth);
        var rows: number = Math.floor(this.image.height / this.tileHeight);

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {                
                var rect = new g.Rectangle(col * this.tileWidth, row * (this.tileHeight - 0), this.tileWidth, this.tileHeight);
                this.tiles.push(new Tile(rect, this.image));

            }
        }

        this.length = this.tiles.length;
        console.log(this.tiles);
        callback();
    }
}

/*
export class TileMap {
    private tiles: number[][];
    
    constructor (public width: number, public height: number) {
        this.tiles = [];

        for (var i = 0; i < this.width; i++) {
            this.tiles[i] = [];
        }
    }

    setTile(x: number, y: number, type: number): TileMap {
        this.tiles[x][y] = type;
        return this;
    }

    getTile(x: number, y: number): number {
        return this.tiles[x][y];
    }
}
*/