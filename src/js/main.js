console.log("HELLO WORLD");

var TILE_WIDTH = 30;
var TILE_HEIGHT = 19;
var TILE_ROW_HEIGHT = 16;
var TILESET_ORIGIN = [0,5];
var MAP_WIDTH = 50;
var MAP_HEIGHT = 50;
var SCROLL_AMOUNT = 5;

//var tileSet = new Image();
var ctx = document.getElementById("canvas").getContext("2d");

/*
tileSet.src = "img/tiles.png";

var source = document.createElement("canvas");
  source.width = tileSet.width;
  source.height = tileSet.height;
  var sctx = source.getContext("2d");

  sctx.drawImage(tileSet, 0,0);
  document.body.appendChild(source);

*/


require(["plotters/DiamondMapPlotter", "TileSet", "Rect", "CanvasRenderer"], function(TilePlotter, TileSet, Rect, Renderer) {

  var Key = {
    LEFT  : 37,
    RIGHT : 39,
    UP    : 38,
    DOWN  : 40
  };


  var Direction = {
    NORTH : 1,
    SOUTH : 2,
    EAST  : 4,
    WEST  : 8
  };

  var currentDirection = 0;


  document.onkeydown = function(e) {

    e = window.event || e;

    switch (e.keyCode) {
      case Key.LEFT :
        currentDirection |= Direction.WEST;
      break;

      case Key.RIGHT :
        currentDirection |= Direction.EAST;
      break;

      case Key.UP :
        currentDirection |= Direction.NORTH;
      break;

      case Key.DOWN :
        currentDirection |= Direction.SOUTH;
      break;
    }
  };

  document.onkeyup = function(e) {
    e = window.event || e;

    switch(e.keyCode) {
      case Key.LEFT :
        currentDirection ^= Direction.WEST;
      break;

      case Key.RIGHT :
        currentDirection ^= Direction.EAST;
      break;

      case Key.UP :
        currentDirection ^= Direction.NORTH;
      break;

      case Key.DOWN :
        currentDirection ^= Direction.SOUTH;
      break;
    }
  };

  var requestAnimFrame = (function () {
      var func = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback, element) {
              window.setTimeout(callback, 1000 / 60);
          };

      // apply to our window global to avoid illegal invocations (it's a native)
      return function (callback, element) {
          func.apply(window, [callback, element]);
      };
  })();


  var ptAnchor = {
    x:0,
    y:0
  };

  var plotter = new TilePlotter();

  var renderer = new Renderer({
    el : document.getElementById("canvas")
  });

  var tileSet = new TileSet({
    tileWidth: 64,
    tileHeight: 32
  });
  
  tileSet.load("img/myTiles.png", function() {
    console.log("tileset loaded");
    loop();
  });

  function loop() {
    //  setTimeout(loop, 1000 / 60);
    requestAnimFrame(loop);
    getInput();
    draw();
    
  }

  function getInput() {
    ptAnchor.x += (((currentDirection & Direction.EAST) >> 2) * SCROLL_AMOUNT) - (((currentDirection & Direction.WEST) >> 3) * SCROLL_AMOUNT);
    ptAnchor.y += ((currentDirection & Direction.NORTH) * SCROLL_AMOUNT) - (((currentDirection & Direction.SOUTH) >> 1) * SCROLL_AMOUNT);
  }

  function draw() {

  


    var t = new Date().getTime();
    var ptMap, ptWorld;


    renderer.clear();

    for (var i = 0, m = MAP_WIDTH * MAP_HEIGHT; i < m; i++) {
      ptMap = {
        x : i % MAP_WIDTH,
        y : Math.floor(i/MAP_WIDTH)
      };
      
      ptWorld = plotter.mapToWorld(ptMap, tileSet.tileWidth, tileSet.tileHeight);

      ptWorld.x -= ptAnchor.x;
      ptWorld.y += ptAnchor.y;

      // Get a random tile
      var iTileType = 1;//Math.random() * 1000 % (tileSet.tiles.length - 1) | 1;
      var tile = tileSet.tiles[iTileType];



      renderer.renderTile(tile, ptWorld);
      
    }


   //console.log(currentDirection);

    
  }


//setTimeout(draw, 1000);


});






















