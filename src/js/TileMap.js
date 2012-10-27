define(function() {
  var TileMap = function(options) {
    this.width  = options.width;
    this.height = options.height;
    this.tiles  = [];

    for (var i = 0, m = this.width; i < m; i++) {
      this.tiles[i] = [];
    }
  };

  TileMap.prototype.setTile = function(x, y, iType) {
    this.tiles[x][y] = iType;
    return this;
  };

  TileMap.prototype.getTile = function(x, y) {
    return this.tiles[x][y];
  };

  return TileMap;
});