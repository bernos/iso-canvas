var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
define(["require", "exports", './geometry', './directions'], function(require, exports, __g__, __d__) {
    var g = __g__;

    var d = __d__;

    var AbstractPlotter = (function () {
        function AbstractPlotter() {
            this.image = new Image();
            this.context = (document.createElement("canvas")).getContext("2d");
            this.mouseMapLookup = [];
        }
        AbstractPlotter.prototype.loadMouseMap = function (src, callback) {
            var _this = this;
            this.image.onload = function () {
                _this.onLoad(callback);
            };
            this.image.src = src;
        };
        AbstractPlotter.prototype.onLoad = function (callback) {
            this.context.drawImage(this.image, 0, 0);
            var imageData = this.context.getImageData(0, 0, this.image.width, this.image.height).data;
            for(var i = 0; i < imageData.length; i += 4) {
                var r = imageData[i];
                var g = imageData[i + 1];
                var b = imageData[i + 2];
                if(r == 255 && b == 255) {
                    this.mouseMapLookup.push(d.SOUTHWEST);
                } else {
                    if(g == 255 && b == 255) {
                        this.mouseMapLookup.push(d.SOUTHEAST);
                    } else {
                        if(r == 255) {
                            this.mouseMapLookup.push(d.NORTHWEST);
                        } else {
                            if(g == 255) {
                                this.mouseMapLookup.push(d.NORTHEAST);
                            } else {
                                this.mouseMapLookup.push(-1);
                            }
                        }
                    }
                }
            }
            callback();
        };
        return AbstractPlotter;
    })();
    exports.AbstractPlotter = AbstractPlotter;    
    var StaggeredMapPlotter = (function (_super) {
        __extends(StaggeredMapPlotter, _super);
        function StaggeredMapPlotter() {
            _super.apply(this, arguments);

        }
        StaggeredMapPlotter.prototype.mapToWorld = function (mapPoint, tileWidth, tileHeight) {
            return new g.Point((mapPoint.x * tileWidth) + ((mapPoint.y % 2) * tileWidth / 2), mapPoint.y * (tileHeight / 2));
        };
        StaggeredMapPlotter.prototype.worldToMap = function (worldPoint, tileWidth, tileHeight) {
            var coarsePoint = this.worldToMapCoarse(worldPoint, tileWidth, tileHeight);
            var direction = this.mouseMapLookup[(worldPoint.x % tileWidth) + ((worldPoint.y % tileHeight) * tileWidth)];
            return this.movePoint(coarsePoint, direction);
        };
        StaggeredMapPlotter.prototype.worldToMapCoarse = function (worldPoint, tileWidth, tileHeight) {
            var y = Math.floor(worldPoint.y / tileHeight) * 2;
            var x = Math.floor(worldPoint.x / tileWidth);
            return new g.Point(x, y);
        };
        StaggeredMapPlotter.prototype.movePoint = function (point, direction) {
            switch(direction) {
                case d.NORTH: {
                    point.y -= 2;
                    break;

                }
                case d.NORTHEAST: {
                    point.x += (point.y & 1);
                    point.y--;
                    break;

                }
                case d.EAST: {
                    point.x++;
                    break;

                }
                case d.SOUTHEAST: {
                    point.x += (point.y & 1);
                    point.y++;
                    break;

                }
                case d.SOUTH: {
                    point.y += 2;
                    break;

                }
                case d.SOUTHWEST: {
                    point.x += ((point.y & 1) - 1);
                    point.y++;
                    break;

                }
                case d.WEST: {
                    point.x -= 2;
                    break;

                }
                case d.NORTHWEST: {
                    point.x += ((point.y & 1) - 1);
                    point.y--;
                    break;

                }
            }
            return point;
        };
        return StaggeredMapPlotter;
    })(AbstractPlotter);
    exports.StaggeredMapPlotter = StaggeredMapPlotter;    
    var SlideMapPlotter = (function (_super) {
        __extends(SlideMapPlotter, _super);
        function SlideMapPlotter() {
            _super.apply(this, arguments);

        }
        SlideMapPlotter.prototype.mapToWorld = function (mapPoint, tileWidth, tileHeight) {
            return new g.Point((mapPoint.x * tileWidth) + (mapPoint.y * tileWidth / 2), mapPoint.y * (tileHeight / 2));
        };
        SlideMapPlotter.prototype.worldToMap = function (worldPoint, tileWidth, tileHeight) {
            var coarsePoint = this.worldToMapCoarse(worldPoint, tileWidth, tileHeight);
            var direction = this.mouseMapLookup[(worldPoint.x % tileWidth) + ((worldPoint.y % tileHeight) * tileWidth)];
            return this.movePoint(coarsePoint, direction);
        };
        SlideMapPlotter.prototype.worldToMapCoarse = function (worldPoint, tileWidth, tileHeight) {
            var y = Math.floor(worldPoint.y / (tileHeight)) * 2;
            var x = Math.floor(worldPoint.x / tileWidth) - (y / 2);
            return new g.Point(x, y);
        };
        SlideMapPlotter.prototype.movePoint = function (point, direction) {
            switch(direction) {
                case d.NORTH: {
                    point.x++;
                    point.y -= 2;
                    break;

                }
                case d.NORTHEAST: {
                    point.x++;
                    point.y--;
                    break;

                }
                case d.EAST: {
                    point.x++;
                    break;

                }
                case d.SOUTHEAST: {
                    point.y++;
                    break;

                }
                case d.SOUTH: {
                    point.x--;
                    point.y += 2;
                    break;

                }
                case d.SOUTHWEST: {
                    point.x--;
                    point.y++;
                    break;

                }
                case d.WEST: {
                    point.x--;
                    break;

                }
                case d.NORTHWEST: {
                    point.y--;
                    break;

                }
            }
            return point;
        };
        return SlideMapPlotter;
    })(AbstractPlotter);
    exports.SlideMapPlotter = SlideMapPlotter;    
    var DiamondMapPlotter = (function () {
        function DiamondMapPlotter() { }
        DiamondMapPlotter.prototype.mapToWorld = function (mapPoint, tileWidth, tileHeight) {
            return new g.Point((mapPoint.x - mapPoint.y) * tileWidth / 2, (mapPoint.x + mapPoint.y) * tileHeight / 2);
        };
        return DiamondMapPlotter;
    })();
    exports.DiamondMapPlotter = DiamondMapPlotter;    
})

