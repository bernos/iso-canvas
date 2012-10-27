import t = module("./tiles");

export class RandomMapLayer {
    private tiles;

    constructor (public tileset: t.TileSet, public width:number, public height:number) {
        this.tiles = [];
    }

    public load(callback: Function): void {
        this.tileset.load(() => {
            this.onTilesetLoadComplete();
            callback();
        });
    }

    private onTilesetLoadComplete(): void  {
        for (var i: number = 0; i < this.width * this.height; i++) {
            var tt: number = Math.random() * 1000 % (this.tileset.tiles.length - 1) | 1;
            //this.tiles.push(this.tileset.tiles[tt]);
            this.tiles.push(tt);
           
        }
    }

    public getTileAt(x: number, y: number): t.Tile {
        return this.tileset.tiles[this.tiles[x + (y * this.width)]];
    }
}