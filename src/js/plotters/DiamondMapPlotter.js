define(function() {
  var Plotter = function() {};

  Plotter.prototype.mapToWorld = function(ptMap, iTileWidth, iTileHeight) {
    return {
      x : (ptMap.x - ptMap.y) * iTileWidth/2,
      y : (ptMap.x + ptMap.y) * iTileHeight/2
    };
  };

  return Plotter;
});