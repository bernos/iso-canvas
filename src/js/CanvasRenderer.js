define(function() {
  var Renderer = function(options) {
    if (options.el) {
      this.ctx = options.el.getContext("2d");
    }
  };

  Renderer.prototype.clear = function() {
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  };

  Renderer.prototype.renderTile = function(tile, ptScreen) {
    this.ctx.drawImage(
      tile.srcImage,
      tile.srcRect.x,
      tile.srcRect.y,
      tile.srcRect.width,
      tile.srcRect.height - 1,
      ptScreen.x,
      ptScreen.y,
      tile.srcRect.width,
      tile.srcRect.height - 1
    );
  };

  return Renderer;
});