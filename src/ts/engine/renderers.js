define(["require", "exports"], function(require, exports) {
    
    
    var CanvasRenderer = (function () {
        function CanvasRenderer(el) {
            this.canvas = el;
            this.context = this.canvas.getContext("2d");
        }
        CanvasRenderer.prototype.clear = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return this;
        };
        CanvasRenderer.prototype.renderTile = function (tile, screenPoint, label) {
            if (typeof label === "undefined") { label = ""; }
            this.context.drawImage(tile.srcImage, tile.srcRect.x, tile.srcRect.y, tile.srcRect.width, tile.srcRect.height - 0, screenPoint.x, screenPoint.y, tile.srcRect.width, tile.srcRect.height - 0);
            return this;
        };
        return CanvasRenderer;
    })();
    exports.CanvasRenderer = CanvasRenderer;    
})

