//<reference path="./lib.d.ts"/>

import g = module("./engine/geometry");
import t = module("./engine/tiles");
import p = module("./engine/plotters");
import r = module("./engine/renderers");
import d = module("./engine/directions");
import u = module("./engine/utils");
import m = module("./engine/maps");

var TILE_WIDTH = 30;
var TILE_HEIGHT = 19;
var TILE_ROW_HEIGHT = 16;
var TILESET_ORIGIN = [0,5];
var MAP_WIDTH = 1500;
var MAP_HEIGHT = 1500;
var SCROLL_AMOUNT = 5;

var Key = {
    LEFT  : 37,
    RIGHT : 39,
    UP    : 38,
    DOWN  : 40
  };


var plotter     = new p.StaggeredMapPlotter();
var renderer    = new r.CanvasRenderer(document.getElementById("canvas"));
var tileset     = new t.TileSet("img/32_flagstone_tiles.png", 64, 32);
var wallset = new t.TileSet("img/walls.png", 64, 64);
var mapLayer = new m.RandomMapLayer(tileset, MAP_WIDTH, MAP_HEIGHT);

var requestAnimFrame = (function (window:any) {
    var func = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element)
        {
            window.setTimeout(callback, 1000 / 120);
        };

    // apply to our window global to avoid illegal invocations (it's a native)
    return function (callback) {
        func.apply(window, [callback]);
    };
})(window);

wallset.load(function () {
    mapLayer.load(function () {
        plotter.loadMouseMap("img/mousemap.png", function () {
            loop();
        });
    });
});

var frameTime: number = -1;

function loop() {
    var t = new Date().getTime();

    if (frameTime > -1) {
        u.updateRenderTime(t - frameTime);
    }

    frameTime = t;
     
    //requestAnimFrame(loop);
    getInput();
    draw();
}

var highlightDirection: number = 0;

document.onkeyup = function(e) {
    e = window.event || e;

    switch(e.keyCode) {
      case Key.LEFT :
        highlightDirection ^= d.WEST;
      break;

      case Key.RIGHT :
        highlightDirection ^= d.EAST;
      break;

      case Key.UP :
        highlightDirection ^= d.NORTH;
      break;

      case Key.DOWN :
        highlightDirection ^= d.SOUTH;
      break;
    }
  };

document.onkeydown = function(e) {
    e = window.event || e;

    switch(e.keyCode) {
      case Key.LEFT :
        highlightDirection |= d.WEST;
      break;

      case Key.RIGHT :
        highlightDirection |= d.EAST;
      break;

      case Key.UP :
        highlightDirection |= d.NORTH;
      break;

      case Key.DOWN :
        highlightDirection |= d.SOUTH;
      break;
    }
  };

var ptAnchor = { x: 0, y: 0 };

function getInput() {
    ptAnchor.x += (((highlightDirection & d.EAST) >> 2) * SCROLL_AMOUNT) - (((highlightDirection & d.WEST) >> 3) * SCROLL_AMOUNT);
    ptAnchor.y -= ((highlightDirection & d.NORTH) * SCROLL_AMOUNT) - (((highlightDirection & d.SOUTH) >> 1) * SCROLL_AMOUNT);
  }


/**
 * Select tile under mouse on click
 */
var selectedTile: g.Point = new g.Point(0, 0);

document.getElementById("canvas").onclick = function (e) {
    e = window.event || e;
    var screenPoint = new g.Point(e.offsetX + ptAnchor.x, e.offsetY + ptAnchor.y);
    selectedTile = plotter.worldToMap(screenPoint, tileset.tileWidth, tileset.tileHeight);
    console.log(screenPoint, selectedTile);
}

// */

function basicRender() {
    var ptMap = new g.Point(0, 0);
    var ptWorld = new g.Point(0,0);
    for (var y = 0; y < MAP_HEIGHT; y++) {
        ptMap.y = y;
        for (var x = 0; x < MAP_WIDTH; x++) {
            ptMap.x = x;

            var iTileType = 1;//Math.random() * 1000 % (tileSet.tiles.length - 1) | 1;
        
            if (ptMap.x == selectedTile.x && ptMap.y == selectedTile.y) {
                iTileType = 3;
            }

            // Get the world co-ord of the map point
            ptWorld = plotter.mapToWorld(ptMap, tileset.tileWidth, tileset.tileHeight);

            // Offset the world co-ord by the current scroll anchor amount
            ptWorld.x -= ptAnchor.x;
            ptWorld.y -= ptAnchor.y;

            // Render the tile
            renderer.renderTile(tileset.tiles[iTileType], ptWorld, ptMap.x + "," + ptMap.y);
        }
    }
}

function optimisedRender() {
    var worldRect = new g.Rectangle(ptAnchor.x, ptAnchor.y, renderer.context.canvas.width, renderer.context.canvas.height);
    var ptMap, ptWorld;

    var tl: g.Point = plotter.worldToMapCoarse(new g.Point(worldRect.x, worldRect.y), tileset.tileWidth, tileset.tileHeight);
    var br: g.Point = plotter.worldToMapCoarse(new g.Point(worldRect.x + worldRect.width, worldRect.y + worldRect.height), tileset.tileWidth, tileset.tileHeight);
    
    plotter.movePoint(tl, d.NORTHWEST);
    plotter.movePoint(br, d.SOUTHEAST);
    
    if (tl.y < 0) { tl.y = 0 };    
    if (br.y > MAP_HEIGHT) { br.y = MAP_HEIGHT };
    
    var l: g.Point = new g.Point(tl.x, tl.y);
    var r: g.Point = new g.Point(br.x, tl.y);

    // Starting at the top left, render each tile, then walk one tile east and render the
    // next tile, until we get to the right hand extreme
    ptMap = new g.Point(l.x, l.y);
    
    var rowCount = 0;

    while (true) {

        // Make sure that the x position is in-bounds
        if (ptMap.x < 0) ptMap.x = 0;
        if (ptMap.x > MAP_WIDTH) ptMap.x = MAP_WIDTH;

        // Precalc the row length
        var rowLength = Math.min(MAP_WIDTH, r.x);

        // Render a row of tiles
        while (ptMap.x <= rowLength) {
            // Pick a tile
            // TODO: once we have an actual map class we should be asking it for tile types.
            // for now we'll just pick one at random
            var iTileType = 1;// Math.random() * 1000 % (tileset.tiles.length - 1) | 1;
        
            // If the tile we are about to render is the one that the mouse was clicked on,
            // then we'll set it to a different tile type.
            if (ptMap.x == selectedTile.x && ptMap.y == selectedTile.y) {
                iTileType = 3;
            }

            // Get the world co-ord of the map point
            ptWorld = plotter.mapToWorld(ptMap, tileset.tileWidth, tileset.tileHeight);

            // Offset the world co-ord by the current scroll anchor amount
            ptWorld.x -= ptAnchor.x;
            ptWorld.y -= ptAnchor.y;

            // Render the tile
            //renderer.renderTile(tileset.tiles[iTileType], ptWorld, ptMap.x + "," + ptMap.y);
            renderer.renderTile(mapLayer.getTileAt(ptMap.x, ptMap.y), ptWorld, ptMap.x + "," + ptMap.y);

            // Render a sample wall tile
            if (ptMap.x == 2 && ptMap.y == 2) {
                console.log("wall");
                // Our wall tiles are 32 px taller than our floor tiles, so we need to offset em
                ptWorld.y -= 32;
                renderer.renderTile(wallset.tiles[0], ptWorld, "");
            }

            // move to the next tile...
            ptMap = plotter.movePoint(ptMap, d.EAST);
        }

        // Move to the row down...
        // update the l and r tiles. on even rows we walk SE for the tl and
        // SW for the tr, and on odd rows we do the opposite
        if (rowCount % 2 == 0) {
            plotter.movePoint(l, d.SOUTHEAST);
            plotter.movePoint(r, d.SOUTHEAST);
        } else {
            plotter.movePoint(l, d.SOUTHWEST);
            plotter.movePoint(r, d.SOUTHWEST);
        }

        ptMap.x = l.x;
        ptMap.y = l.y;

        rowCount++;

        // Test if we are done...
        if (ptMap.y > br.y || ptMap.y > MAP_HEIGHT || l.x > r.x) {           
            break;
        }        
    }
}

function draw() {
    renderer.clear();
    //basicRender();
    optimisedRender();
}

