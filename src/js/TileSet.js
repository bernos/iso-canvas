define(["./Tile"], function(Tile) {
  var TileSet = function(options) {
    this.tileWidth = options.tileWidth;
    this.tileHeight = options.tileHeight;
    this.tiles = options.tiles || [];
    this.image = new Image();
  };

  TileSet.prototype.load = function(src, callback) {
    var tileSet = this;
    
    this.image.onload = function() {
      var cols = Math.floor(this.width / tileSet.tileWidth);
      var rows = Math.floor(this.height / tileSet.tileHeight);
      
      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {

          tileSet.tiles.push(new Tile({
            srcImage : this,
            srcRect : {
              y : row * (tileSet.tileHeight - 1),
              x : col * tileSet.tileWidth,
              width : tileSet.tileWidth,
              height : tileSet.tileHeight
            }
          }));
        }
      }

      tileSet.length = rows * cols;

      callback();
    };

    this.image.src = src;
  };

  TileSet.prototype.getTileRect = function(iTileType) {
    return this.tileRects[iTileType];
  };

  return TileSet;
});