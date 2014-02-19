define(["require", "exports", "./engine/geometry", "./engine/tiles", "./engine/plotters", "./engine/renderers", "./engine/directions", "./engine/utils", "./engine/maps"], function(require, exports, __g__, __t__, __p__, __r__, __d__, __u__, __m__) {
    var g = __g__;

    var t = __t__;

    var p = __p__;

    var r = __r__;

    var d = __d__;

    var u = __u__;

    var m = __m__;

    var TILE_WIDTH = 30;
    var TILE_HEIGHT = 19;
    var TILE_ROW_HEIGHT = 16;
    var TILESET_ORIGIN = [
        0, 
        5
    ];
    var MAP_WIDTH = 1500;
    var MAP_HEIGHT = 1500;
    var SCROLL_AMOUNT = 5;
    var Key = {
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40
    };
    var plotter = new p.StaggeredMapPlotter();
    var renderer = new r.CanvasRenderer(document.getElementById("canvas"));
    var tileset = new t.TileSet("img/32_flagstone_tiles.png", 64, 32);
    var wallset = new t.TileSet("img/walls.png", 64, 64);
    var mapLayer = new m.RandomMapLayer(tileset, MAP_WIDTH, MAP_HEIGHT);
    var requestAnimFrame = (function (window) {
        var func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
            window.setTimeout(callback, 1000 / 120);
        };
        return function (callback) {
            func.apply(window, [
                callback
            ]);
        }
    })(window);
    wallset.load(function () {
        mapLayer.load(function () {
            plotter.loadMouseMap("img/mousemap.png", function () {
                requestAnimFrame(loop);
            });
        });
    });
    var frameTime = -1;
    function loop() {
        var t = new Date().getTime();
        if(frameTime > -1) {
            u.updateRenderTime(t - frameTime);
        }
        frameTime = t;
        getInput();
        draw();
        requestAnimFrame(loop);
    }
    var highlightDirection = 0;
    document.onkeyup = function (e) {

        e = window.event || e;
        switch(e.keyCode) {
            case Key.LEFT: {
                highlightDirection ^= d.WEST;
                break;

            }
            case Key.RIGHT: {
                highlightDirection ^= d.EAST;
                break;

            }
            case Key.UP: {
                highlightDirection ^= d.NORTH;
                break;

            }
            case Key.DOWN: {
                highlightDirection ^= d.SOUTH;
                break;

            }
        }


    };
    document.onkeydown = function (e) {
        e = window.event || e;
        switch(e.keyCode) {
            case Key.LEFT: {
                highlightDirection |= d.WEST;
                break;

            }
            case Key.RIGHT: {
                highlightDirection |= d.EAST;
                break;

            }
            case Key.UP: {
                highlightDirection |= d.NORTH;
                break;

            }
            case Key.DOWN: {
                highlightDirection |= d.SOUTH;
                break;

            }
        }
    };
    var ptAnchor = {
        x: 0,
        y: 0
    };
    function getInput() {
        ptAnchor.x += (((highlightDirection & d.EAST) >> 2) * SCROLL_AMOUNT) - (((highlightDirection & d.WEST) >> 3) * SCROLL_AMOUNT);
        ptAnchor.y -= ((highlightDirection & d.NORTH) * SCROLL_AMOUNT) - (((highlightDirection & d.SOUTH) >> 1) * SCROLL_AMOUNT);
        
    }
    var selectedTile = new g.Point(0, 0);
    document.getElementById("canvas").onclick = function (e) {
        e = window.event || e;
        var screenPoint = new g.Point(e.offsetX + ptAnchor.x, e.offsetY + ptAnchor.y);
        selectedTile = plotter.worldToMap(screenPoint, tileset.tileWidth, tileset.tileHeight);
        console.log(screenPoint, selectedTile);
    };
    function basicRender() {
        var ptMap = new g.Point(0, 0);
        var ptWorld = new g.Point(0, 0);
        for(var y = 0; y < MAP_HEIGHT; y++) {
            ptMap.y = y;
            for(var x = 0; x < MAP_WIDTH; x++) {
                ptMap.x = x;
                var iTileType = 1;
                if(ptMap.x == selectedTile.x && ptMap.y == selectedTile.y) {
                    iTileType = 3;
                }
                ptWorld = plotter.mapToWorld(ptMap, tileset.tileWidth, tileset.tileHeight);
                ptWorld.x -= ptAnchor.x;
                ptWorld.y -= ptAnchor.y;
                renderer.renderTile(tileset.tiles[iTileType], ptWorld, ptMap.x + "," + ptMap.y);
            }
        }
    }
    function optimisedRender() {
        var worldRect = new g.Rectangle(ptAnchor.x, ptAnchor.y, renderer.context.canvas.width, renderer.context.canvas.height);
        var ptMap;
        var ptWorld;

        var tl = plotter.worldToMapCoarse(new g.Point(worldRect.x, worldRect.y), tileset.tileWidth, tileset.tileHeight);
        var br = plotter.worldToMapCoarse(new g.Point(worldRect.x + worldRect.width, worldRect.y + worldRect.height), tileset.tileWidth, tileset.tileHeight);
        plotter.movePoint(tl, d.NORTHWEST);
        plotter.movePoint(br, d.SOUTHEAST);
        if(tl.y < 0) {
            tl.y = 0;
        }
        ; ;
        if(br.y > MAP_HEIGHT) {
            br.y = MAP_HEIGHT;
        }
        ; ;
        var l = new g.Point(tl.x, tl.y);
        var r = new g.Point(br.x, tl.y);
        ptMap = new g.Point(l.x, l.y);
        var rowCount = 0;
        while(true) {
            if(ptMap.x < 0) {
                ptMap.x = 0;
            }
            if(ptMap.x > MAP_WIDTH) {
                ptMap.x = MAP_WIDTH;
            }
            var rowLength = Math.min(MAP_WIDTH, r.x);
            while(ptMap.x <= rowLength) {
                var iTileType = 1;
                if(ptMap.x == selectedTile.x && ptMap.y == selectedTile.y) {
                    iTileType = 3;
                }
                ptWorld = plotter.mapToWorld(ptMap, tileset.tileWidth, tileset.tileHeight);
                ptWorld.x -= ptAnchor.x;
                ptWorld.y -= ptAnchor.y;
                renderer.renderTile(mapLayer.getTileAt(ptMap.x, ptMap.y), ptWorld, ptMap.x + "," + ptMap.y);
                if(ptMap.x == 2 && ptMap.y == 2) {
                    ptWorld.y -= 32;
                    renderer.renderTile(wallset.tiles[0], ptWorld, "");
                }
                ptMap = plotter.movePoint(ptMap, d.EAST);
            }
            if(rowCount % 2 == 0) {
                plotter.movePoint(l, d.SOUTHEAST);
                plotter.movePoint(r, d.SOUTHEAST);
            } else {
                plotter.movePoint(l, d.SOUTHWEST);
                plotter.movePoint(r, d.SOUTHWEST);
            }
            ptMap.x = l.x;
            ptMap.y = l.y;
            rowCount++;
            if(ptMap.y > br.y || ptMap.y > MAP_HEIGHT || l.x > r.x) {
                break;
            }
        }
    }
    function draw() {
        renderer.clear();
        optimisedRender();
    }
})

