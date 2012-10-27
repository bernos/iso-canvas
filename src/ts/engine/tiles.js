define(["require", "exports", "./geometry"], function(require, exports, __g__) {
    var g = __g__;

    var Tile = (function () {
        function Tile(srcRect, srcImage) {
            this.srcRect = srcRect;
            this.srcImage = srcImage;
        }
        return Tile;
    })();
    exports.Tile = Tile;    
    var TileSet = (function () {
        function TileSet(src, tileWidth, tileHeight) {
            this.src = src;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.length = 0;
            this.tiles = [];
            this.image = new Image();
        }
        TileSet.prototype.load = function (callback) {
            var _this = this;
            this.image.onload = function () {
                _this.onLoad(callback);
            };
            this.image.src = this.src;
        };
        TileSet.prototype.onLoad = function (callback) {
            var cols = Math.floor(this.image.width / this.tileWidth);
            var rows = Math.floor(this.image.height / this.tileHeight);
            for(var row = 0; row < rows; row++) {
                for(var col = 0; col < cols; col++) {
                    var rect = new g.Rectangle(col * this.tileWidth, row * (this.tileHeight - 0), this.tileWidth, this.tileHeight);
                    this.tiles.push(new Tile(rect, this.image));
                }
            }
            this.length = this.tiles.length;
            console.log(this.tiles);
            callback();
        };
        return TileSet;
    })();
    exports.TileSet = TileSet;    
})

