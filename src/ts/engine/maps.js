define(["require", "exports"], function(require, exports) {
    
    var RandomMapLayer = (function () {
        function RandomMapLayer(tileset, width, height) {
            this.tileset = tileset;
            this.width = width;
            this.height = height;
            this.tiles = [];
        }
        RandomMapLayer.prototype.load = function (callback) {
            var _this = this;
            this.tileset.load(function () {
                _this.onTilesetLoadComplete();
                callback();
            });
        };
        RandomMapLayer.prototype.onTilesetLoadComplete = function () {
            for(var i = 0; i < this.width * this.height; i++) {
                var tt = Math.random() * 1000 % (this.tileset.tiles.length - 1) | 1;
                this.tiles.push(tt);
            }
        };
        RandomMapLayer.prototype.getTileAt = function (x, y) {
            return this.tileset.tiles[this.tiles[x + (y * this.width)]];
        };
        return RandomMapLayer;
    })();
    exports.RandomMapLayer = RandomMapLayer;    
})

